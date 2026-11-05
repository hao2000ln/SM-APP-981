---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.16.19 .. 1.2.16.36
printed_pages: 582-604
---

# 1.2.16.19 sqlddllogging

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.16.19. sqlddllogging

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sqlddllogging

Description

This parameter defines whether the Service Manager server produces database
definition language (DDL) files with every change to a database dictionary record. You
can enable DDL logging to keep a record of all your database dictionary changes or
as a means to deliver proposed changes to an RDBMS administrator who will actually
implement the changes. This parameter requires the use of the sqlddldirectory
parameter to define the path where DDL files will be written.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0

Possible values

0 (Disable)
1 (Enable)

Example usage

Command line: sm -sqlddllogging:1 -sqlddldirectory:ddl
Initialization file:

  sqlddllogging:1
  sqlddldirectory:ddl


Related topics

Database dictionary
Database dictionary records
Enter a parameter in the sm.ini file
Database parameters


1.2.16.20. sqldebug

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

            Note

           If you use an Oracle database, this parameter requires the following
           additional privileges for $sm_db_user:

                 grant select on sys.col$ to $sm_db_user;
                 grant select on sys.obj$ to $sm_db_user;
                 grant select on sys.icol$ to $sm_db_user;
                 grant select on sys.ind$ to $sm_db_user;
                 grant select on sys.all_users to $sm_db_user;

Parameter

sqldebug

Description

This parameter causes the Service Manager server to write information about RDBMS
connections to the sm.log file. If enabled, the server writes the time to login to the
RDBMS (sqllogintime) and the time it takes to perform a query request (sqlquerytime).

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

Command line: sm -httpPort:13080 -sqldb:dbserver -sqldebug:1
Initialization file: sqldebug:1

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.21. sqldictionary

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sqldictionary

Description

This parameter defines the name of the RDBMS where the Service Manager database
dictionary file resides.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

Name of RDBMS

Example usage

Command line: sm -httpPort:13080 -sqldb:dbserver -sqldictionary:dbserver
Initialization file: sqldictionary:dbserver

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.22. sqldictkey

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sqldictkey

Description

This parameter defines the primary key of the RDBMS column where the Service
Manager database dictionary resides. You only need to specify this parameter if you
are using the sqldictionary parameter and you are also using a primary key other than
the name field.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

name

Possible values

Primary key of the RDBMS column containing the name field of the database
dictionary

Example usage

Command line: sm -httpPort:13080 -sqldb:dbserver -sqldictionary:dbserver -
sqldictkey:id

Initialization file: sqldictkey:id

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.23. sqldicttable

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sqldicttable

Description

This parameter defines the name of the RDBMS table where the Service Manager
database dictionary resides. You only need to specify this parameter if you are using
the sqldictionary parameter and you are also using a table other than dbdictm1.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

dbdictm1

Possible values

Name of the RDBMS table that contains the database dictionary

Example usage

Command line: sm -httpPort:13080 -sqldb:dbserver -sqldictionary:dbserver -
sqldicttable:dbdict

Initialization file: sqldicttable:dbdict

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.24. sqldirect

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sqldirect

Description

This parameter determines where the Service Manager server sends a direct SQL
command to an RDBMS by using the SQLexecute RAD command panel. The database
type you specify here must match the RDBMS database type that's set up as a
section in your sm.ini file.

The Service Manager server uses shared libraries to interface with any supported
RDBMS client. For example, the SQORACLE.OCI.10.dll shared library on Windows
enables communication with Oracle 11 and 12 clients. When Service Manager opens a
file that's mapped to an RDBMS, the Service Manager SQL layer automatically loads
the appropriate shared library into memory.

The SQL Query tool also allows you to query tables that aren't Service Manager files.
To do this, add the sqldirect:<dbtype> parameter to the sm.ini file. Set the dbtype to
the name of an existing SQL section in your sm.ini file. For example for an Oracle
system, add the line sqldirect:oracle to the sm.ini file. This loads the appropriate
.DLL file for the backend RDBMS and enables direct SQL queries at any time.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

If this parameter is not set, but a RAD panel tries to execute a SQL Statement through
SQLexecute, the statement will be sent to the RDBMS that was used last by the RAD
(for a query, or an update, and so on.) Therefore if the whole file system is mapped to
one and only one RDBMS, that's the RDBMS sqldirect will use.

Possible values


  sqldirect:oracle11
  [oracle]
  sqldb:SomeOraDB
  sqllogin:sm/sm

Example usage

Command line: sm -httpPort:13080 -sqldb:<dbserver> -sqldirect:<oracle>
Initialization file:

  sqldirect:oracle11
  [oracle]
  sqldb:SomeOraDB
  sqllogin:sm/sm
  [oracle11]
  sqldb:SomeOtherOracleDB
  sqllogin:sm/sm

Related topics

System parameters
Enter a parameter in the sm.ini file
Software Support
Database parameters


1.2.16.25. sqlfetchrows

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sqlfetchrows

Description

This parameter determines the number of rows the Service Manager server retrieves
during one connection to the RDBMS. You can only use this parameter with an Oracle
OCI RDBMS. The server converts any value greater than 500 to the maximum limit of
500 rows.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

0

Possible values

Number of rows to fetch up to 500

Example usage

Command line: sm -httpPort:13080 -sqldb:dbserver -sqlfetchrows:250

Initialization file: sqlfetchrows:250

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.26. sqlfetchs

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sqlfetchs

Description

This parameter determines the number of primary keys Service Manager retrieves
during one connection to the RDBMS.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

500

Possible values

Number of primary keys to fetch

Example usage

Command line: sm -httpPort:13080 -sqldb:dbserver -sqlfetchs:750
Initialization file: sqlfetchs:750

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.27. sqljoinsok

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sqljoinsok

Description

The values for this parameter comprise a comma-delimited list of tables for which
outer joins are allowed.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

A comma-delimited list of table names

Example usage

Command line: sm -httpPort:13080 -sqldb:dbserver -sqljoinsok:problem, incident,
contact, operator

Initialization file: sqljoinsok:problem, incidents, contacts, operator

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.28. sqllibrary

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sqllibrary

Description

This parameter defines the file name of the library containing your RDBMS drivers.
Service Manager provides a collection of database drivers for supported vendors and
versions.

Valid if set from

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

One of the following RDBMS drivers:
Oracle

     Windows – SQORACLE.OCI10.DLL
     Linux – libsqoracle19.so
Microsoft SQL Server
     Windows – SQMSSQL.ODBC.DLL

Possible values

File name of library containing RDBMS drivers:

            Note

           Driver names are case-sensitive. Be sure to use the correct case.

Windows drivers
     SQDB2.CLI.DLL


     SQMSSQL.ODBC.DLL
     SQORACLE.OCI10.DLL

Linux drivers

     libsqoracle19.so

Example usage

If you are running on the Linux system and have the Oracle 19 client, the initialization
file entry is as follows:
-sqllibrary:libsqoracle19.so

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.29. sqllimit

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sqllimit

Description

If a particular request exceeds the time limit defined by this parameter, then the
Service Manager server writes a message to the Service Manager log file
documenting the name of the user making the request, how long it took, the actual
SQL query, and the information of the database on which the query was running slow.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

5

Possible values

Number of seconds

Example usage

Command line: sm -httpPort:13080 -sqldb:dbserver -sqllimit:10

Initialization file: sqllimit:10

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.30. sqllockretry

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sqllockretry

Description

This parameter defines the maximum number of retries the Service Manager server
makes attempting to lock a system resource. If a particular request exceeds the retry
limit defined by this parameter, then the Service Manager server writes a message to
the Service Manager log file documenting the name of the user making the request,
the number of lock attempts made by the request, and the actual SQL query.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

5

Possible values

Number of retries

Example usage

Command line: sm -httpPort:13080 -sqldb:dbserver -sqllockretry:7

Initialization file: sqllockretry:7

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.31. sqllockwait

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

sqllockwait

Description

This parameter defines the time in seconds the Service Manager server waits between attempts to
lock a system resource.

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

Command line: sm -httpPort:13080 -sqldb:dbserver -sqllockwait:2
Initialization file: sqllockwait:2

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.32. sqllogin

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

sqllogin

Description

This parameter defines the user name and password that Service Manager uses to authenticate
connections to the RDBMS. You must use a slash character to separate the user name and
password. If you omit this parameter, then the server attempts to authenticate the connection using
the user name and password of the user who started the Service Manager server, however this
feature requires the Service Manager server and the RDBMS server to use the same operating
system. If the Service Manager server and the RDBMS server use different operating systems, then
you must specify a sqllogin value.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

User name/password

Example usage

Command line: sm -httpPort:13080 -sqldb:dbserver -sqllogin:dbadmin/password

Initialization file: sqllogin:dbadmin/password

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.33. sqlloginretry

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

sqlloginretry

Description

This parameter defines the maximum number of retries the Service Manager server makes
attempting to authenticate a connection to the RDBMS. If a particular request exceeds the retry
limit defined by this parameter, then the Service Manager server writes a message to the Service
Manager log file documenting the name of the user making the request and the number of retry
attempts made by the request.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

3

Possible values

Number of retries

Example usage

Command line: sm -httpPort:13080 -sqldb:dbserver -sqlloginretry:3

Initialization file: sqlloginretry:3

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.34. sqlloginwait

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

sqlloginwait

Description

This parameter defines the time in seconds that the Service Manager server waits to connect to the
RDBMS.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

15

Possible values

Number of seconds

Example usage

Command line: sm -httpPort:13080 -sqldb:dbserver -sqlloginwait:30
Initialization file: sqlloginwait:30

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.35. sqlnullclause

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

sqlnullclause

Description

This parameter allows to use nulls first clause in SQL statements.
Valid if set from
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

0

Possible values

0 or 1

Example usage

Initialization file: sqlnullclause:1

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.36. sqlouterjoins

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

sqlouterjoins

Description

When querying two tables at the same time, Service Manager by default generates a SELECT
statement with a JOIN clause to join the tables together. This parameter provides options on how
two tables are joined together when being queried.

Caution: In some cases, generating a LEFT OUTER JOIN when querying two tables at the same
time causes performance degradation.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

2

Possible values

0 (Generates a LEFT OUTER JOIN clause only when querying a multi-row array table and one other
table in the same query. Otherwise, generates just a JOIN clause.)

1 (Always generates a LEFT OUTER JOIN clause when querying two tables in the same query.)

2 (Never generates a LEFT OUTER JOIN clause; always generates just a JOIN clause.)

Example usage

Using option 2 (default) to generate a JOIN clause when querying tables M1 and A3 (SELECT *
FROM M1 JOIN A3 ON...).
Command line: sm -httpPort:13080 -sqldb:dbserver -sqlouterjoins:2

Initialization file: sqlouterjoins:2

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters
````
