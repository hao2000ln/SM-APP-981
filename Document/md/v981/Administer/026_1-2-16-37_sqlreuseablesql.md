---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.16.37 .. 1.2.16.45
printed_pages: 604-618
---

# 1.2.16.37 sqlreuseablesql

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.16.37. sqlreuseablesql

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

sqlreuseablesql

Description

This parameter is only valid for Oracle databases. When this parameter is enabled, the RDBMS
sends SQL statements with bind variables instead of in-text-values (“literals”). It enables the
RDBMS to cache the parsed SQL statement for use later to reduce the number of parses; it also
enables the RDBMS to prepare an execution plan for the statement only once and then reuse the
plan.

Using bind variables not only significantly reduces the Oracle shared memory used, but also
prevents SQL injection attacks.

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

Command line: sm -httpPort:13080 -sqldb:dbserver -sqlreuseablesql:1

Initialization file: sqlreuseablesql:1

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.38. sqlstats

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

sqlstats

Description

This parameter allows statistics from an Oracle database to log in the sm.log file.

Valid if set from

Initialization file (sm.ini). This parameter is only used when using an Oracle database.
Requires restart of the Service Manager server?
Yes

Default value

0 (Disabled)

Possible values

0 (disabled)
1 (enabled)

Example usage

Initialization file: sqlstats:1
Command line: sm -httpPort:13080 –sqlstats:1

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.39. sqltextdateformat

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

sqltextdateformat

Description

You may find the unable to convert value of field xxx from type STRING2 to type ARRAY. error
message in the sm.log file when both of the following conditions are met:

     The format of the input date/time data as a character string doesn't match the current user's
     date/time format setting
     The system needs to convert the string to an array field of Service Manager

To solve this problem, use the sqltextdateformat parameter to specify the date/time format of this
input string.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

Date formats

     YYYY/MM/DD
     YY/MM/DD
     MM/DD/YYYY
     MM/DD/YY
     DD/MM/YYYY
     DD/MM/YY

Example usage

Command line: sm -httpPort:13080 -sqldb:dbserver -sqltextdateformat:MM/DD/YYYY

Initialization file: sqltextdateformat:MM/DD/YYYY


            Note

           You should only use this parameter prior to conversion. Using it or changing it doesn't
           work for a converted system.

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.40. sqltimeoutlimit

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

sqltimeoutlimit

Description

When you executes a query, for example, search for an interaction or an incident, the query can
take a long time. If the time to process the query exceeds the session expiration time, the system
will automatically log you out. So there needs to be a way to stop long queries. For example, stop
the query if the query takes more than X seconds.

The sqltimeoutlimit parameter is introduced for this issue, which is implemented on expert search
and advanced filter. When the query execution time for expert search or advanced filter is longer
than the time set in the sqltimeoutlimit parameter, the query will be terminated in Oracle server
and display the following error message:
Query terminated: Your query execution time exceeded the time set in the query timeout
configuration.

Prerequisites:

     The feature is only applicable to Oracle Database.
     Oracle Instance Client version must be 19.3 or above.

Valid if set from

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0

Possible values

     0, which means this function is disabled.
     At least 30 (seconds). If you set the parameter to a value less than 30, the system will
     override this value and set it to 30 instead.

Example usage

Initialization file: sqltimeoutlimit:60
In this example, if your query execution time is longer than 60 seconds, the query will be
terminated automatically.


1.2.16.41. sqltz

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

sqltz

Description

This is an optional parameter that the Service Manager server uses to control storing of date and
time values in the RDBMS. This parameter defines the time zone to use as a base for all date and
time values. The time zone is specified as the name of the time zone record in the Service Manager
tzfile. The default time zone is Greenwich/Universal (GMT).

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

Greenwich/Universal (GMT)

Possible values

Time zone name as defined in Service Manager time zone record (tzfile)

Example usage

Command line: sm -httpPort:13080 -sqldb:dbserver -sqltz:Canada/Atlantic

Initialization file: sqltz:Canada/Atlantic

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.16.42. sqlupper

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

sqlupper

Description

This parameter enables the Service Manager server to convert new tables in an Oracle database to
use UPPER indexes and to implement case-insensitive search behavior in Service Manager. This
feature can implement case-insensitive search behavior on a case-sensitive Oracle database, and
therefore eliminates the need to use a case-insensitive Oracle database which might slow down
your system performance.

In sqlupper mode, the records are divided into groups according to their names when you use
grouping. If the names of two records differ only in the case of the letter, then the records will be
divided into different groups. For example, the "application" records and "Application" records in
the database are divided to the "Application" group and the "application" group. To get a better
view, you can unify the record names as "application" or "Application" in the database.

            Caution

           We recommend using Oracle's case-insensitive solution instead of this parameter. For
           more information, see Oracle case-sensitivity and Prepare an Oracle database.

To use this feature in an existing Service Manager system, follow these steps:

   1. Make sure your Oracle database is case-sensitive. If not, convert your Oracle database from
     case-insensitive to case-sensitive.

                   Note

                To make Service Manager treat your Oracle database as case-sensitive, make
                sure you have not NLS_SORT=BINARY_CI and NLS_COMP=LINGUISTIC
                configured in your Oracle. For example, you can configure NLS_SORT=BINARY
                and NLS_COMP=BINARY to make it case-sensitive. For more information, see
                Oracle case-sensitivity.

   2. Make sure all Service Manager server nodes are stopped.

   3. Add sqlupper:1 to the sm.ini file of each server node.
   4. In a server’s command prompt, run the system_createupperindex:all command to convert all

     existing tables to use UPPER indexes.


                   Note

                Every time after you run the system_createupperindex command, a message
                appears in the console that indicates if any tables aren't successfully converted.

  5. If any tables fail to be converted, run the system_createupperindex:<list of tables, separated
     by a comma> command to convert these tables again.

                   Note

                You can run this command multiple times as needed until all tables are
                successfully converted.

   6. Restart the server nodes.

To use this feature in a new Service Manager system, follow these steps:

   1. Prepare a case-sensitive Oracle database.
   2. Install the Service Manager server.
   3. Add sqlupper:1 to the sm.ini file.
   4. Run the server configuration utility to connect to the database.
   5. Load the Service Manager out-of-box tables and demonstration data.

     All tables are loaded with UPPER indexes. All new tables that you may create later will also use
     UPPER indexes.

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

Initialization file: sqlupper:1

Related topics

Oracle case-sensitivity
Enter a parameter in the sm.ini file


Parameter: system_createupperindex


1.2.16.43. system_addconstraint

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

system_addconstraint

Description

The system_addconstraint parameter adds a Not Null constraint to the first unique key or converts
the unique key to a primary key for the specified database tables, depending on usage. The
system_addconstraint parameter takes the following two arguments:

     The target tables: Specify "all" to update all tables or specify a list of tables separated by
     commas. If no tables are specified, running this command will don'thing but bring up the
     parameter help.
     Behavior:

            0 adds a "Not Null" constraint on the first unique key of the specified tables (if no
           unique key or primary key exists, Service Manager adds the constraint to the
           RECORD_KEY field).
            1 converts the first unique key of the specified tables to primary keys (if there is no
           unique or primary key, Service Manager converts the RECORD_KEYfield to primary key) .
            2 converts the first unique key of the specified tables to primary keys by using the full-
           table copy mechanism. Running this command may take a very long time.

                   Note

                This parameter can only be set from an operating system command prompt.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

You should run this command only when the Service Manager server is shutdown.

Default value

0 (By default, this parameter doesn'thing.)

Possible values

all:0 - Adds a "Not Null" constraint to the first unique key of all tables in the system.
all:1 - Converts the first unique key of all tables in the system to a primary key.


all:2 - Force a full table copy to convert the first unique key of all tables to a primary key in case
you can't convert the first unique key to a primary key in an MS SQL Server database.

[A comma separated list of tables]:0 - Adds a "Not Null" constraint only to the first unique key of
the specified tables.

[A comma separated list of tables]:1 - Converts the first unique key of the specified tables to
primary keys.

[A comma separated list of tables]:2 - Converts the first unique key of the specified tables to
primary keys by using the full-table copy mechanism. Running this command may take a very long
time..

Example usage

Command line: sm -system_addconstraint:all:1
Command line: sm -system_addconstraint:probsummary,incidents:0
Command line: sm -system_addconstraint:operator:2

Related topics

System parameters

Working with primary keys
Enter a parameter in the sm.ini file


1.2.16.44. system_createupperindex

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

system_createupperindex

Description

This parameter enables the Service Manager server to convert specified tables in an Oracle
database to use UPPER indexes.

            Note

           When running this command, error messages that resemble the following may occur,
           which can be safely ignored:
           3952( 4916) 09/18/2014 11:48:15 RTE E could not find key addl.parents in ocml
           In this example, the key field (addl.parents) is an array, and mapped to a separate table
           on SQL. The error message occurs because the index can't be generated on the main
           table (OCMLM1). The index will be generated later on the new table (OCMLA1).

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

all (Convert all tables in the Oracle database)
list of table names separated by a comma (Convert specified tables in the Oracle database)

Example usage

sm -system_createupperindex:all
sm -system_createupperindex:cm3r,cm3t

Related topics

Oracle case-sensitivity
Enter a parameter in the sm.ini file


1.2.16.45. wildcardcharacters

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

wildcardcharacters

Description

This parameter defines the wildcard characters you want the Service Manager server to use during
searches.

Valid if set from

Server's operating system command prompt
Initialization (sm.ini) file

Requires restart of the Service Manager server?

No

Default value

*?\
where * defines the place holder for any 0 to N characters
where ? defines the place holder for any one character
where \ defines the escape character to search literally for any of the wildcard characters

Possible values

These characters are only used in queries using the LIKE operator. For example: "*al?n*" matches
"alen"
These characters aren't used when using the = or # operator. For example:

     name="*al?n*" would only match "*al?n*"
     name#"*al?n*" would match "*al?n*" and "*al?n*e" [starts with]

            Note

           When Service Manager generates a query from what is typed on the search screen, the
           data is scanned for these characters and if found, a LIKE operator is generated
           automatically instead of the default "starts with" (#) operator.

Some wildcard character search examples are listed below:

     Wildcard character "*" to search for any number of characters. For example: "*ev*" would
     match "kevin" but not "kendel"


     Wildcard character "?" to search for a single character. For example, "l?n" would match "alen"
     and "alan" but not "alain"
     Wildcard character "\" to search for text containing special or wildcard characters. For
     example: "Help\?" would match "Help?" but not "Help!"

Example usage

Command line: sm -listener -wildcardcharacters:%?/

Initialization file: wildcardcharacters:%?/

Related topics

System parameters
Enter a parameter in the sm.ini file
````
