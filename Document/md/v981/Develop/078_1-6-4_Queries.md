---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.6.4 .. 1.6.4
printed_pages: 2054-2063
---

# 1.6.4 Queries

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.4. Queries

A query is a request to the database (RDBMS) that generates a reply. You can author queries by using RAD
(the Service Manager internal system language) or JavaScript. In either case, the query must be translated
to the native language of the RDBMS and the reply translated back into the original requesting language.
See the Service Manager Programming Guide for information on the Service Manager system language or
JavaScript.

In order to write an effective query you must be familiar with the logical structure of the Service Manager
tables and fields included in the query as they are defined in the system's database dictionary. It is
sometimes also helpful to know the architecture of the tables and fields as they are defined in the
database; however this information is often restricted to database administrators (DBAs) in enterprise
organizations.

Related topics

How do I write a good query?
Where are queries used?


1.6.4.1. How do I write a good query?

An ideal Service Manager query has the following characteristics.

     Runs against indexed columns to avoid full table scans. See Indexing below.
     Uses operators like equal to ( = ) that map well to SQL to avoid full table scans.
     See Query operators below.
     Avoids RAD functions like index() that are likely to cause full table scans. See
     Function usage below.
     Ensures that variables always have a non-null value. See Variable usage below.

Indexing

An ideal query runs against indexed columns. Querying against indexed columns
increases the speed at which Service Manager can receive data. However, adding too
many indexes adds a performance cost to inserting (adding) new records as well as
updating or deleting existing ones. Indexes also require additional storage space.

Your database administrator will weigh the potential benefit of indexing your queries
against the cost of increased write times (insertions and updates). Typically, your
database administrator may want to index any query that many people access or that
gets run frequently. You may want to index tables that are part of the following
Service Manager frequently-used queries:

     Public favorites
     Commonly-used forms containing Format controls
     Fills
     Drop-downs (combo boxes)
     Global lists
     Background processes

Query operators

Since Service Manager must translate queries into native RDBMS language, you
should try to use operators that map well to native RDBMS languages. In general,
queries that use the EQUAL TO operator ( = ) are the most efficient and easiest to
translate.


Operator                                Example query         Sample SQL statement
EQUAL TO ( =)
                                        contact.name="AARON,  SELECT
                                        JIM"                  "CONTACT_NAME"
                                                              FROM CONTCTSM1
                                                              WHERE
                                                              "CONTACT_NAME"='AA
                                                              RON, JIM';

As the example illustrates, an EQUAL TO query often directly translates into a SQL
query as part of a WHERE clause. In addition, queries with EQUAL TO operations are
also the most likely to use and benefit from table indexes.

If you can't use an EQUAL TO operator in a query, the following operators will also in
many cases facilitate direct translation into SQL queries.

Operator                                Example query         Sample SQL statement
Starts with                             contact.name#"AA"
(#)                                                           SELECT
                                        contact.name like     "CONTACT_NAME"
LIKE                                    "A*RON*"              FROM CONTCTSM1
                                                              WHERE
ISIN                                    contact.name isin     "CONTACT_NAME" LIKE
                                        {"AARON,              'AA%';
                                        JIM","ARMSTRONG,
                                        TRACY"}               SELECT
                                                              "CONTACT_NAME"
                                                              FROM CONTCTSM1
                                                              WHERE
                                                              "CONTACT_NAME" LIKE
                                                              'A%RON%';

                                                              SELECT
                                                              "CONTACT_NAME"
                                                              FROM CONTCTSM1
                                                              WHERE
                                                              "CONTACT_NAME" IN
                                                              ('AARON,JIM','ARMSTRO
                                                              NG,TRACY');


In these examples, the LIKE operator directly translates into a SQL query as part of a
WHERE clause. The ISIN operator translates into an IN predicate. The STARTS WITH
operator ( # ) translates into a LIKE predicate using a wildcard character.
Such kind of queries now translate into a SQL statement like the following:
'1 in assets="adv-Unix-101"'
'a3.record_number = 1 AND a3.asset = ?'
Supported query operators
The following operators are supported in a query:

     All logical operators
     TR, and NTR
     Like

            Caution

           If other operators are used in a query, the query translates into "1=1" and
           may cause performance issues.

For example, the following queries are supported:
'1 in assets ="adv-Unix-101"'
'7 in assets >"adv-Unix-101"'
'7 in assets#"adv-Desktop"'
'7 in assets like "adv-*-104"'

            Caution

           Only one array member can be used in the same query. For example, the
           following query is unsupported:
           1 in assets ="adv-Unix-101" and 2 in assets ="adv-Unix-102"
           This is because in the final SQL statement there would be
           "a3.record_number = 1 AND a3.record_number = 2" , which is always
           false for the RDBMS.

Function usage


Any query that contains a RAD system language function such as index() can
potentially cause a full table scan because it may not translate to SQL. Generally, you
want to limit the use of functions in queries to avoid degrading your system's
performance every time the query is run. If you anticipate a query will run frequently,
consider rewriting the query to use operators instead of functions. The most typical
high-use queries are those in the following areas:

Favorites
Views
Links
Stored queries.

For example, suppose you want to create a view that displays closed high priority
incidents with activity from a particular operator named Manager. You could create
this query by using the index() function.

View definition field                   Inefficient query example: index() function

                                                           View definition value

Table                                   probsummary

Query                                   (flag=false) and (priority.code<="2")
                                        and index("Manager",
                                        assignee.name)>0

As written this is an inefficient query. However, you can rewrite this query to use
simple operators and prevent unnecessary table scans. For example, the following
query accomplishes the same objective.

                                        Efficient query example: using simple operators

View definition field                   View definition value

Table                                   probsummary

Query                                   (flag=false) and (priority.code<="2")
                                        and (assignee.name like "*Manager*")

If you can't rewrite the query (for example, if you are using an exclusive feature of the
function), you can minimize its performance impact by limiting access to the query.

Variable usage and null values


Anytime you use a custom variable in query you should ensure that it doesn't have a
null value. Null values in query variables can cause full table scans which lower your
system's performance.You can avoid null values in custom variables by using the
following methods:

     Use the nullsub() function to replace the null value with a default value.
     Replace a custom variable with system variable. System variables obtain a value
     when a user logs in to the system or accesses a particular application.

For example,suppose you create a custom variable $name to store a contact's name.
You could provide a default value for the variable with the following expression.

$name=nullsub($name, contact.name in $L.file)

In this case, the default value will become the contact name listed in any file that uses
this contact.name field. If query doesn't have access to the contact.name field value,
you may consider hard-coding the default value, but the utility of such a hard-coded
value may be limited.

Alternatively, you may want to use an existing system variable such as
$lo.user.name or $lo.ufname to provide the name of current operator.

Miscellaneous queries

Service Manager handles miscellaneous queries as described in the following.

Queries with numbers in an array field

Queries with numbers in an array field, such as '1 in assets="adv-Unix-101"' ,
translate into a SQL statement like the following:

'a3.record_number = 1 AND a3.asset = ?'

The Service Manager server supports the following operators in such kind of queries:

     All logical operators
     TR, and NTR
     Like

            Caution

           If other operators are used in a query, the query translates into "1=1" and
           may cause performance issues.


Contents

     1 Indexing
     2 Query operators
     3 Function usage
     4 Variable usage and null values
     5 Miscellaneous queries


1.6.4.2. Where are queries used?

There are several places within Service Manager where you can tailor queries. You
should review any custom queries in these areas to ensure they are as efficient as
possible:

     Background processes
     Global lists
     Links
     Format controls

Service Manager runs these queries frequently because they are either part of a
scheduled task or common user actions trigger them.

Queries in background processes

Most background processes issue queries to your RDBMS at regularly scheduled
intervals.While these queries already have proper indexes in an out-of-box system,
you may consider limiting how often these queries run or eliminating them entirely if
your system doesn't use them. You should review the following background
processes to determine how often your system needs to run them:

     Agent (not started in an out-of-box system)
     Marquee (not started in an out-of-box system)
     Lister

You can control how often these background processes run from the Service
Manager schedule record. You can set these processes to run infrequently or never
run at all if they're not needed. See the Service Manager help for more information.

Queries in global lists

Because Service Manager often builds global lists at startup, the total number of
global lists you have determines how long your system spends generating these lists.
If you have custom global lists, you should verify that they are still in use and if not
clear the Build List at Startup option. Reducing the number of global lists you build
reduces the number of queries your system has to run and will result in improved
login performance.

In addition, you should verify that your custom global list query returns a useful
number of results. The more items there are in a global list the more memory a


Service Manager client requires to display them. Consider tuning your global list
queries to return a manageable number of results to improve your system's
performance.

Queries in links

Because link queries are run frequently, it is essential that you index them correctly
and write the queries with the most restrictive fields first in the search order. You can
also reduce the amount of computation needed to create links results by minimizing
the use of pre- and post-link expressions.

Queries in Format Control

You can use Format Control to specify the conditions that trigger a query to run. It is
most efficient if you only run queries when they are needed. For example, if you plan
to use query results during the addition or update of a record, then set the Format
Control conditions so that the query only during add or update operations. The same
suggestion applies to any custom Format Control calculations and subroutines you
use. Verify that you need the custom query and that it runs only when it is needed. By
restricting the conditions under which a Format Control query runs you minimize
unnecessary calls to the RDBMS and keep system resources free for other
operations.

Contents

     1 Queries in background processes
     2 Queries in global lists
     3 Queries in links
     4 Queries in Format Control
````
