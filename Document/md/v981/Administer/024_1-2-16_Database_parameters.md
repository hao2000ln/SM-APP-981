---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.16 .. 1.2.16.18
printed_pages: 557-582
---

# 1.2.16 Database parameters

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.16. Database parameters

The following table lists the startup parameters that you can set from the Service
Manager server's operating system command prompt or from the Service Manager
initialization file (sm.ini).
These parameters determine how the Service Manager server manages the RDBMS
database systems.

Startup parameter                                                                               Service Manager 9.81
Startup parameter:
allowunsupporteddbversion               Brief description
Parameter: dbcachequery
generateIndexDDL                        Specifies whether the unsupported
                                        versions of the Oracle database are
SQL parameters: oracle                  allowed when Service Manager
SQL parameters: oracle_replicate        connects to the database server

SQL parameters: pgschema                Creates a cache for a comma
SQL parameters: postgresql              separated list of table names.
SQL parameters: sqlserver
                                        Generates the DDL of indexes and
SQL parameters: sqlserver_replicate     constraints for your database in a DDL
                                        file: <Server installation
                                        directory>/RUN/ddls/index.ddl.

                                        Creates a section header in the
                                        initialization file for connection
                                        parameters to an Oracle database

                                        Creates a section header in the
                                        initialization file for connection
                                        parameters to a replicated Oracle
                                        database

                                        Specifies the schema when you use a
                                        PostgreSQL database

                                        Creates a section header in the
                                        initialization file for connection
                                        parameters to a PostgreSQL database

                                        Creates a section header in the
                                        initialization file for connection
                                        parameters to a Microsoft SQL Server
                                        database

                                        Creates a section header in the
                                        initialization file for connection
                                        parameters to a replicated Microsoft
                                        SQL Server database

Startup parameter                                                                               Service Manager 9.81
SQL parameters: sqladhoccachesize
Parameter: sqlalwayson                  Brief description
SQL parameters: sqlautosort
SQL parameters: sqlbatchcount           Limits the memory consumption of the
Parameter: sqlcitext                    ad hoc SQL cache
SQL parameters: sqldb
Parameter: sqlddldirectory              Enables SQL Server AwaysOn when
Parameter: sqlddllogging                Service Manager is running on a SQL
SQL parameters: sqldebug                Server database cluster.
SQL parameters: sqldictionary
SQL parameters: sqldictkey              Causes the Service Manager server to
                                        automatically sort query results based
                                        on any keys within the query

                                        Defines the number of records the
                                        Service Manager server retrieves from
                                        the RDBMS during a single select call

                                        Enables case-insensitive when you use
                                        a PostgreSQL database

                                        Defines the host name of the RDBMS to
                                        which you want the Service Manager
                                        server to connect

                                        Defines the path where the Service
                                        Manager server saves DDL files

                                        Enables creation of DDL files when
                                        database dictionary records change

                                        Enables the Service Manager server to
                                        write information about RDBMS
                                        connections to the sm.log file

                                        Defines the name of the RDBMS where
                                        the Service Manager database
                                        dictionary resides

                                        Defines the primary key of the RDBMS
                                        column where the Service Manager
                                        database dictionary resides

 Startup parameter                                                                              Service Manager 9.81
 SQL parameters: sqldicttable
 SQL parameters: sqldirect              Brief description

 SQL parameters: sqlfetchrows           Defines the name of the RDBMS table
 SQL parameters: sqlfetchs              where the Service Manager database
 SQL parameters: sqljoinsok             dictionary resides
 SQL parameters: sqllibrary
 SQL parameters: sqllimit               Determines how the Service Manager
 SQL parameters: sqllockretry           server formats direct SQL commands
 SQL parameters: sqllockwait            to an RDBMS using the SQLexecute
 SQL parameters: sqllogin               RAD function

This PDF was generated on May 23, 2026  Determines the number of rows
                                        Service Manager retrieves during one
                                        connection to the RDBMS

                                        Determines the number of primary keys
                                        that Service Manager retrieves during
                                        one connection to the RDBMS

                                        Specifies a comma-delimited list of
                                        tables for which outer joins are allowed

                                        Defines the file name of library
                                        containing your RDBMS drivers

                                        Defines the time limit for requests to
                                        the RDBMS

                                        Defines the maximum number of retries
                                        the Service Manager server makes
                                        attempting to lock a system resource

                                        Defines the time in seconds that the
                                        Service Manager server waits between
                                        attempts to lock a system resource

                                        Defines the user name and password
                                        that Service Manager uses to
                                        authenticate connections to the
                                        RDBMS

                                                                                                                        Page 135 of 172
Startup parameter                                                                               Service Manager 9.81
SQL parameters: sqlloginretry
                                        Brief description
SQL parameters: sqlloginwait
SQL parameters: sqlnullclause           Defines the maximum number of times
SQL parameters: sqlouterjoins           that the Service Manager server retries
SQL parameters: sqlreuseablesql         to authenticate a connection to the
SQL parameter: sqlstats                 RDBMS
SQL parameters: sqltextdateformat
SQL parameter: sqltimeoutlimit          Defines the time in seconds that the
                                        Service Manager server waits to
SQL parameters: sqltz                   connect to the RDBMS

                                        Allows using nulls first clause in SQL
                                        statements.

                                        Provides options on how two tables are
                                        joined together when being queried

                                        Enables the RDBMS to cache query
                                        results for use later on Oracle
                                        databases

                                        Logs statistics from an Oracle database
                                        in the sm.log file

                                        Defines the format that the Service
                                        Manager server uses to write out dates
                                        to strings

                                        When the query execution time for
                                        expert search or advanced filter is
                                        longer than the time set in
                                        the sqltimeoutlimit parameter, the
                                        query will be terminated in Oracle
                                        server.

                                        Defines the time zone that the Service
                                        Manager server uses to control storing
                                        of date and time values in the RDBMS


Startup parameter                       Brief description
Parameter: sqlupper
                                        Converts new tables in a case-
Parameter: system_addconstraint         sensitive Oracle database to use
                                        UPPER indexes and enables a case-
Parameter: system_createupperindex      insensitive search behavior in the
Startup parameter: unlockdatabase       case-sensitive Oracle database

Parameter: wildcardcharacters           Adds a Not Null constraint to the first
Startup parameter:                      unique key or converts the unique key
alignradsensitivitywithdb               to a primary key for the specified
                                        database tables, depending on usage

                                        Converts specified tables in an Oracle
                                        database to use UPPER indexes

                                        Allows cleaning up the database lock
                                        record, and then starting the Service
                                        Manager system on a backup server in
                                        a vertical scaled implementation.

                                        Defines the wildcard characters that
                                        you want the Service Manager server
                                        to use during searches

                                        Specifies whether RAD case sensitivity
                                        for string comparing is aligned with
                                        that of the Service Manager database.


            Note

           The database parameters in the following list are section-dependent. For
           example, if you specify sqldebug:1 in the [sqlserver] section but not in
           the [sqlserver_replicate] section, then sqldebug is enabled only in
           database connections to [sqlserver].

                 sqldb
                 sqllogin
                 sqllibrary
                 sqldebug
                 sqlfetchs
                 sqlbatchcount
                 sqlfetchrows
                 sqlfilejoins
                 sqllockretry
                 sqllockwait
                 sqllimit
                 sqlloginretry
                 sqlloginwait
                 sqlnullclause
                 sqlreuseablesql
                 sqlouterjoins
                 sqlstats
                 sqlalwayson
                 sqlcitext

Related topics

System parameters
Enter a parameter in the sm.ini file


1.2.16.1. alignradsensitivitywithdb

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

alignradsensitivitywithdb

Description

This parameter specifies whether RAD case sensitivity for string comparing is aligned
with that of the Service Manager database. By default, this parameter is disabled
(value set to 0).

Valid if set from

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0

Possible values

0 or1

Example usage

Initialization file: alignradsensitivitywithdb:0

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.2. allowunsupporteddbversion

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.
You can always set a startup parameter from the server's operating system command
prompt.

Parameter

allowunsupporteddbversion

Description

This parameter specifies whether unsupported versions of Oracle Database are
allowed or not when Service Manager connects to the Oracle Database server.
Service Manager connects to the Oracle Database and prints the "Connection to
dbtype" message, Service Manager checks the Oracle server and client versions. If
the Oracle Database version is unsupported and the allowunsupporteddbversion
parameter is configured to "0," Service Manager disconnects the Oracle Database
server.

            Note

           This parameter applies to the Oracle Database server only. You can't use
           this parameter to allow unsupported versions of the Oracle database
           client.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0

Possible values

0: Do not allow unsupported versions of the Oracle Database server.

1: Allow unsupported versions of the Oracle Database server.


Example usage

Command line: sm -allowunsupporteddbversion:0

Initialization file: allowunsupporteddbversion:0

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.3. dbcachequery

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

dbcachequery

Description

This parameter creates a cache for a comma separated list of table names.

            Note

           It is recommended to use this parameter for dbdicts with only static
           contents. Additionally, when the query results include more than 1,000
           records, caching is disabled automatically.

Valid if set from

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

Any valid file names

Example usage

Initialization file: dbcachequery:extaccess

Related topics

System parameters
Enter a parameter in the sm.ini file


1.2.16.4. generateIndexDDL

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

generateIndexDDL

Description

This command enables the Service Manager server to generate the DDL of indexes
and constraints for your database and save the DDL to the following file: <Server
installation directory>/RUN/ddls/index.ddl.
You can use this command to identify which indexes and constraints are needed for
your database.

            Caution

           This command doesn't work when sqlupper:1 is specified.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage

sm -generateIndexDDL

Related topics

Oracle case-sensitivity
Enter a parameter in the sm.ini file


1.2.16.5. hidedberrorfromui

Parameter

hidedberrorfromui

Description

This parameter determines whether to hide the database-related error messages in
sm.log. You can set this parameter to the following values:

     1: Hide the database-related error messages in sm.log.
     0: Display the database-related error messages in sm.log.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

1

Possible values

0 (Disabled)
1 (Enabled)

Example usage

Command line: sm -httpPort:13080 -hidedberrorfromui:1
Initialization file: hidedberrorfromui:1


1.2.16.6. [oracle]

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

[oracle]

Description

This parameter creates a section header in the initialization file for information about
an Oracle™ database. You only need to provide this parameter if you have set
sqldictionary and are using an Oracle database.

Valid if set from

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

None

Example usage

Initialization file: [oracle]

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.9. [postgresql]

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

[postgresql]

Description

This parameter creates a section header in the initialization file for information about a
PostgreSQL database. You only need to provide this parameter if you have set
sqldictionary and are using a PostgreSQL database.

Valid if set from

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

None

Example usage

Initialization file: [postgresql]

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.10. [sqlserver]

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

[sqlserver]

Description

This parameter creates a section header in the initialization file for information about
an Microsoft™ SQL Server database. You only need to provide this parameter if you
have set sqldictionary and are using an SQL Server database.

Valid if set from

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

None

Example usage

Initialization file: [sqlserver]

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.13. sqlalwayson

Parameter

sqlalwayson

Description

This parameter is used to enable SQL Server AwaysOn when Service Manager is
running on a SQL Server database cluster. You can set this parameter to the following
values:

     1: SQL Server AlwaysOn is enabled. The Service Manager server turns on
     SQL_COPT_SS_MULTISUBNET_FAILOVER and sets
     SQL_COPT_SS_APPLICATION_INTENT as ReadWrite.
     0: SQL Server AlwaysOn is disabled.

For more information, see Support of SQL Server AlwaysOn.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0

Possible values

0 (Disabled)
1 (Enabled)

Example usage

Command line: sm -httpPort:13080 -sqlalwayson:1
Initialization file: sqlalwayson:1


1.2.16.14. sqlautosort

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sqlautosort

Description

Enabling this parameter causes the Service Manager server to automatically sort
query results based on any keys within the query.

The following table describes different system behaviors based on the value of this
parameter.

Value       Description
1           Enable
0 or empty  Disable

            Note

            By default, this value is not
            specified and a value of "0"
            is used.

Valid if set from                                Page 149 of 172

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

0 (Disable)

Possible values

This PDF was generated on May 23, 2026

0 (Disable)
1 (Enable)

Example usage

Command line: sm -httpPort:13080 -sqldb:dbserver -sqlautosort:1
Initialization file: sqlautosort:1

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.15. sqlbatchcount

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sqlbatchcount

Description

This parameter defines the number of records the Service Manager server retrieves
from the RDBMS during a single select call. You can use this parameter to reduce the
number of interactions between Service Manager and your RDBMS. Rather than
selecting and returning each record from a record list individually, Service Manager
can select and return a batch of records in a single SELECT statement.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

64

Possible values

Number of records

Example usage

Command line: sm -httpPort:13080 -sqldb:dbserver -sqlbatchcount:72

Initialization file: sqlbatchcount:72

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.16. sqlcitext

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sqlcitext

Description

By default, Service Manager doesn't support case-insensitive searching when you
use the PostgreSQL database. If you want to use case-insensitive searching, set this
parameter to sqlcitext:1. Because this parameter takes effect when initializing the
database, if you need to change the setting, you must load the SM data again after
change the setting.

Valid if set from

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0

Possible values

0 (Disabled)

1 (Enabled)

Example usage

Initialization file: sqlcitext:1


1.2.16.17. sqldb

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sqldb

Description

This parameter defines the host name of the RDBMS to which you want the Service
Manager server to connect.

     For Oracle this is the Network Service Name in tnsnames.ora. You can also enter
     a connection string to specify a particular connection driver.
     For SQL Server this is the ODBC DSN name.
     For PostgreSQL, this includes the PostgreSQL host, port, and database name.
     The format is as follows:
      host=<db_server_host> port=<db_port> dbname=<db_name>
     Or
      //<db_server_host>:<db_port>/<db_name>

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

Host name of RDBMS

Example usage

Command line: sm -httpPort:13080 -sqldb:dbserver


Initialization file: sqldb:dbserver

            Tip

           Example for PostgreSQL: sqldb:host=192.0.2.10 port=5432
           dbname=dbserver

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.18. sqlddldirectory

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sqlddldirectory

Description

This parameter defines the path where you want the Service Manager server to save
database definition language (DDL) files with every change to a database dictionary
record. You can enable DDL logging to keep a record of all your database dictionary
changes or as a means to deliver proposed changes to an RDBMS administrator who
will actually implement the changes. This parameter requires the use of the
sqlddllogging parameter to enable the creation of DDL files.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

Service Manager server installation folder\RUN

Possible values

Path to DDL files relative to the server's RUN directory

Example usage

Command line: sm -sqlddllogging:1 -sqlddldirectory:ddl
Initialization file:

  sqlddllogging:1
  sqlddldirectory:ddl

Contents


1 Parameter
2 Description
3 Valid if set from
4 Requires restart of the Service Manager server?
5 Default value
6 Possible values
7 Example usage
````
