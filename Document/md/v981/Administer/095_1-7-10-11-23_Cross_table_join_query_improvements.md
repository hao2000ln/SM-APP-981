---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.10.11.23 .. 1.7.10.12
printed_pages: 2371-2400
---

# 1.7.10.11.23 Cross-table join query improvements

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.10.11.23. Cross-table join query
improvements

The performance when running a join across database tables has been vastly
improved as compared to version of Service Manager prior to 9.32. Previously, a
query running across two tables was performed in memory by Service Manager. For
data sets that contain millions of records, this process could be extremely time
consuming.

The mechanism by which Service Manager executes queries across tables was
changed in Service Manager 9.32. With the new mechanism, the initial Service
Manager query is parsed, translated into SQL, and then issued directly to the RDBMS.
The RDBMS then handles the initial join operation and returns a subset of results to
Service Manager. However, because the database now performs this work, a number
of limitations are imposed. For more information on these limitations, see Limitations
on cross-table join queries

Additionally, the new functionality is limited to the Service Manager functions on the
Cross-table join functions.


1.7.10.11.23.1. Functions

Under the new mechanism, you can only use the following functions in your query:

     lng()
     null()
     nullsub()
     operator()
     substr()
     tod()
     toupper() and tolower()

            Note

           It is highly recommended that you restrict queries to run only on indexed
           fields. Running these queries on non-indexed fields can result in poor
           performance.

lng()

The lng() function determines the length of a value specified by the parameter.

                                        Example of the lng Function Translation

Service Manager function                Translated SQL equivalent:

select ps.number, ps.title              select t01.”NUMBER”,
from probsummary ps where               t01.”TITLE” from
lng(ps.openen.by)=6                     PROBSUMMARYM1 t01 where
                                        LENGTH(t01.”OPENED_BY”) = 6

The parameter can only be a field name or an expression that can be evaluated
beforehand; It can't be an expression that can't be evaluated before translation into
SQL:

The following cases are valid:


  lng ( ps.category ) //In this example, “category” is a field
  from file “probsummary”
  lng ( $L.var ) //In this example, $L.var is a local variable
  defined beforehand.

The following cases are invalid:

lng ( ps.title + ps.brief )
lng ( ps.title + $L.var )

null()

The Null() function determines whether a value specified by the parameter is null or
not.

                                        Example of the NULL Function Translation

Service Manager function                Translated SQL equivalent:

select ps.number, ps.title              select t01.”NUMBER”,
from probsummary ps where               t01.”TITLE” from
null(ps.assignment)                     PROBSUMMARYM1 t01 where
                                        t01.”ASSIGNMENT” is NULL

The parameter can only be a field name or an expression that can be evaluated
beforehand; It can't be an expression that can't be evaluated before translation into
SQL:

The following cases are valid:

  null( ps.category ) //In this example, “category” is a field
  from “probsummary” file.
  null( $L.var ) //In this example, $L.var is a local variable
  defined beforehand.

The following cases are invalid:

null ( ps.title + ps.brief )
null ( ps.title + $L.var )


nullsub()

The nullsub() function substitutes the variable with a default value if the variable
specified by the first parameter is null:

                                        Example of the nullsub Function Translation

Service Manager function                Translated SQL equivalent:

   select ps.number, ps.title           select t01.”NUMBER”,
from probsummary ps where               t01.”TITLE” from
nullsub (ps.openen.by,                  PROBSUMMARYM1 t01 where
“falcon”)=”falcon”                      COALESCE (t01.”OPENED_BY”,
                                        ‘falcon’) = ‘falcon’

The first parameter can only be a field name or an expression that can be evaluated
beforehand, it can't be an expression that can't be evaluated before translation into
SQL. The other parameters can only be constant numbers or expressions that can be
evaluated to numbers before translation into SQL:
The following cases are valid:

  nullsub ( ps.category, “abc” ) //In this example, “category”
  is a field from file “probsummary”
  nullsub ( $L.var, “abc” ) //In this example, $L.var is a local
  variable defined beforehand.

The following cases are invalid:

  nullsub ( ps.title + ps.brief, “abc” )
  nullsub ( ps.title + $L.var, “abc” )

operator()

When you use the operator() function in part of a query, the Service Manager server
will replace the call to operator() with the appropriate value. Therefore, the following
query is valid:

  select ps.number, ps.title from probsummary ps where
  ps.opened.by = operator()


substr()

The substr() function extracts a substring from a value specified by the parameter.

                                        Example of the lng Function Translation

Service Manager function                Translated SQL equivalent:

select ps.number, ps.title              select t01.”NUMBER”,
from probsummary ps where               t01.”TITLE” from
substr(ps.openen.by, 0,                 PROBSUMMARYM1 t01 where
3)=”fal”                                SUBSTR(t01.”OPENED_BY”) =
                                        ‘fal’

The first parameter can only be a field name or an expression that can be evaluated
beforehand, it can't be an expression that can't be evaluated before translation into
SQL. The other parameters can only be constant numbers or expressions that can be
evaluated to numbers before translation into SQL:
The following cases are valid:

  substr ( ps.category, 0, 4 ) //In this example, “category” is
  a field from file “probsummary”
  substr ( $L.var, 0, 4 ) //In this example,$L.var is a local
  variable defined beforehand.

The following cases are invalid:

  substr ( ps.title + ps.brief, 0, 4 )
  substr ( ps.title + $L.var, 0, 4 )

tod()

When you use the tod() function in part of a query, the Service Manager server will
replace the call to tod() with the appropriate value. Therefore, the following query is
valid:

  select ps.number, ps.title from probsummary ps where
  ps.open.date<tod()


toupper() and tolower()

The totoupper() and tolower() functions convert the given parameter to upper or
lower case as appropriate.

                                        Example of the toupper() Function Translation

Service Manager function                Translated SQL equivalent:

select ps.number, ps.title              select t01.”NUMBER”,
from probsummary ps where               t01.”TITLE” from
toupper(ps.openen.by)=”FALCO            PROBSUMMARYM1 t01 where
N”                                      UPPER(t01.”OPENED_BY”) =
                                        ‘FALCON’

The parameter can only be a field name or an expression that can be evaluated
beforehand; It can't be an expression that can't be evaluated before translation into
SQL:
The following cases are valid:

  toupper ( ps.category ) //where “category” is a field from
  file “probsummary”
  tolower ( $L.var ) //where $L.var is a local variable defined
  beforehand.

The following cases are invalid:

  tolower ( ps.title + ps.brief )
  toupper ( ps.title + $L.var )


1.7.10.11.23.2. Cross-table join query
examples and use cases

The following examples detail various scenarios in which you will see the benefits of
the cross-table join queries:

            Note

           The table alias are mandatory for cross-table query. For example, select
           pro.* from probsummary pro is correct, whereas select probsummary.*
           from probsummary is incorrect.

Reserved words

Reserved words have a special meaning in Service Manager that's defined in RAD.
These special words can only be used for that purpose. Do not use them for any other
purpose such as field names or table alias. The following is an alphabetical list of
reserved words:

AND, BEGIN, DO, ELSE, END, FALSE, FOR, IF, IN, ISIN, NOT, NULL, OR, STEP, WHILE,
THEN, TRUE, UNKNOWN, INNER, OUTER, JOIN, ON, SELECT, AS, FROM, WHERE,
ASC, DESC, BETWEEN, GROUP, BY, HAVING, LIKE, TABLE, VIEW, WHERE, MIN, MAX,
AVG, COUNT, SUM, ID.

In addition, all the RAD and JavaScript function names, and standard SQL reserved
word in Oracle or SQL Server are similarly reserved.

Use case: Incident Analyst

As an Incident Analyst, I would like to show interactions that have an incident attached
that's in open status.

Task 1: Configure the relationship between interaction and
incident.

   1. Sign in as a system administrator.

   2. From the command line, enter db and then press the Execute Command
     button.

   3. In Form enter relatedObjectMap and then click the Search button.


4. Type the following values in the corresponding fields and then click the Search
  button.

Field                                   Value
Source Table:                           incidents
Source Field:                           incident.id

5. Click Delete to delete the relation between incident and incdepends , which is
  not used in the Inbox.

6. Type the following values in the corresponding fields and then click the Add
  button.

Field                                   Value
Source Table:                           incidents
Source Field:                           incident.id
To Table:                               screlation
To Field:                               source

7. Type the following values in the corresponding fields and then click the Add
  button.

Field                                   Value
Source Table:                           screlation
Source Field:                           depend
To Table:                               probsummary
To Field:                               number

   8. Sign out of Service Manager.

Task 2: Create the view


1. Sign in as a system administrator.
2. Switch to the Interaction queue.
3. Click More or the More Actions menu, and then click Define Views.
4. Click New.
5. In the name field, type the following, choose System View, and then click Next:

All interactions that have an open incident attached

 6. Click Next.
 7. Click Filter, click Advanced Filter, and then click Add New Filter Criteria.
 8. In Field in Interaction, select Interaction ID, and then click Use Multi Level Field

    Chooser.
 9. Select field Depend for screlation , and select Status for Incident .
10. Click Next.
11. Set Comparison to Equals, set Value to Open, and then click Next.
12. Click OK.
13. Click Fields.
14. Specify the following values in the corresponding fields and then click Add to

    List.

Field                                   Value
Interaction                             Interaction ID
screlation                              Depend
Incident                                Status

15. Specify the following values in the corresponding fields and then click Add to
    List.


Field                                   Value
Interaction                             Interaction ID
screlation                              Depend

 16. Click Finish and then click Apply View.

After you complete these tasks, you can sign in as an Incident Analyst, and then
switch to the "All interactions that have an open incident attached" view.

Use case: Department manager

As a department manager, I would like to see all incidents that were closed by
contacts from my department in the last 30 days.

Task 1: Create the view

   1. Sign in as a system administrator.
   2. Switch to the Incident queue.
   3. Click More or the More actions menu, and then click Define Views.
   4. Click New.
   5. In the name field, type the following, choose System View, and then click Next:

        All incidents closed by contacts from my department in last
        30 days

 6. Click Next.
 7. Click Filter, click Advanced Filter, and then click Add New Filter Criteria.
 8. In Field in Incident, select Closed By, and then click Use Multi Level Field

    Chooser.
 9. Select field Contact Name for Operator , and then select Dept Name for

     Contact .
10. Click Next.
11. Set Comparison to Equals, set Value to North America - IT, and then click Next.
12. Click OK.


13. Click Fields

14. Specify the following values in the corresponding fields and then click Add to
    List.

Field                                   Value
Incident                                Close Time
Incident                                Closed By

 15. Click Finish and then click Apply View.

Task 2: Define the restriction in the inbox definition

   1. Sign in as a system administrator.
   2. From the command line, enter db and then press the Execute Command button.
   3. In Form enter inbox and then click the Search button.
   4. Click inbox.view, click Search, and then click All incidents closed by contacts

     from my department in last 30 days.

   5. Click Query definition and modify the query form as follows:

     From:

  probsummary;closed.by;operator;name;operator;contact.name;co
  ntacts;contact.name;contacts;dept.name="North America - IT"

To:

          probsummary;closed.by;operator;name;operator;contact.name;co
          ntacts;contact.name;contacts;dept.name=$lo.dept and
          close.time>tod() - '30 00:00:00'

   6. Click Save.

After you complete these tasks, you can sign in as an Incident Manager, and then
switch to the "All incidents closed by contacts from my department in last 30 days"
view.

Use case: JavaScript Developer


The following use case describes how a developer counts the attachments related to
Interactions related to an Incident.

   1. Sign in as a system administrator.
   2. Navigate to Tailoring> Script Library
   3. Type getAttachments in the Name field.
   4. Click Add.
   5. Copy and paste the following code into the code window:

          var start=new Date();
          var file = new SCFile("probsummary");
          var sql = "SELECT pro.*, scr.*, att.* FROM probsummary pro,
          screlation scr inner join SYSATTACHMENTS att on
          (scr.source=att.topic ) where scr.depend=pro.number and
          scr.depend=\"IM10002\" and att.segment=0";
          var success=file.doSelect( sql ) ;
          var findNextRecord=RC_SUCCESS;
          var count=0;
          //iterate to print the related attachment names
          while ( success== RC_SUCCESS && findNextRecord == RC_SUCCESS
          && count<120)
          {
          print("find attachment No.: " + count + " " + file.filename
          + " in " + file.topic);
          //print(system.functions.descriptor(file));
          findNextRecord=file.getNext();
          count++;
          }
          var end=new Date();
          var timespent = end-start;
          print ("select time is: " + timespent + "ms");
          start=new Date();
          //count how many attachments are related to this incidents
          count=file.doCount(sql);
          print ("There are " + count + " attachments");
          end=new Date();
          timespent = end-start;
          print ("count time is: " + timespent + "ms");


   6. Save and compile the JavaScript code.
   7. Execute the compiled code.

Example: Query two tables

This query finds all open incidents for which your department is the service owner of
the affected service:

  var file = new SCFile("probsummary");
  var sql = "select p.* from probsummary p LEFT OUTER JOIN device
  d ON (p.affected.item=d.logical.name) where d.owner=$lo.dept and
  p.flag=true";
  var success = file.doSelect(sql);
  while (success == RC_SUCCESS)
  {
  print(file.affected_item)
  success = file.getNext();
  }

Example: Query more than two files

This query finds all open incidents that are assigned to my department:

  var file = new SCFile("probsummary");
  var sql = "SELECT ta01.*, ta03.dept.name AS dept.name FROM
  probsummary ta01 LEFT OUTER JOIN operator ta02 LEFT OUTER JOIN
  contacts ta03 ON ( ta02.contact.name = ta03.contact.name ) ON
  ( ta01.assignee.name = ta02.name ) WHERE ( ta01.flag = true and
  ta03.dept.name=$lo.dept)";
  var success = file.doSelect( sql ) ;
  while (success == RC_SUCCESS)
  {
  success = file.getNext();
  }

Example: Sort

This query finds all open incidents for which your department is the service owner of
the affected service, and sorts by service name in ascending order and incident
number in descending order:


            Note

           If possible, use the order by clause in the query instead of setsort() ,
           because the order by clause sort fields before the select operation.
           setsort() requires another SQL operation to sort. setOrderBy is
           unsupported in cross table query.

  var file = new SCFile("probsummary");
  var sql = "select p.*, d.logical.name as lname from probsummary
  p LEFT OUTER JOIN device d ON (p.affected.item=d.logical.name)
  where d.owner=$lo.dept and p.flag=true";
  sql += " order by d.logical.name asc, p.number desc"
  var success = file.doSelect(sql);
  while (success == RC_SUCCESS)
  {
  findNextRecord = file.getNext();
  }

Example: Count

This query counts all open incidents for which your department is the service owner
of the affected service:

            Note

           For better performance, this example use doCount in the query instead
           of looping on the record list.

  var file = new SCFile("probsummary");
  var sql = "select p.* from probsummary p LEFT OUTER JOIN device
  d ON (p.affected.item=d.logical.name) where d.owner=$lo.dept and
  p.flag=true";
  var count = file.doCount(sql);
  print(count);

Example: Handle two files that have the same field
name


This query finds all open incidents for which your department is the service owner of
the affected service, and then prints the category of the incidents and the category of
the service.

            Note

           If two fields have same name, you must use an alias to distinguish the
           fields.

  var file = new SCFile("probsummary");
  var sql = "select p.*,d.category AS cate from probsummary p LEFT
  OUTER JOIN device d ON (p.affected.item=d.logical.name) where
  d.owner=$lo.dept and p.flag=true";
  var success = file.doSelect(sql);
  print(file.category);
  print(file.cate);

Example: Handle BLOB, CLOB, text, and images

This query shows all open Incidents, where current operator is a member of an
assignment group (Support Groups) that's defined in the affected service.

            Note

                Because an RDBMS can't search on a BLOB field directly, if you want
                to use BLOB field as a query condition, you must map the BLOB field
                as multi-row array.
                You must map support.groups from DEVICE2M1 to DEVICE2A1
                for this example to work. Otherwise, you will receive the following
                error:
                 Queries on Blob/Clob/Text/Image field is unsupported in cross table
                query. (display,process.option) Field "ta02.support.groups" in the
                query is not mapped or mapped to Blob/Clob/Text/Image. Queries
                on Blob/Clob/Text/Image field is unsupported in cross table query.
                (display,process.option)


var file = new SCFile("probsummary");
var sql = "SELECT ta01.*, ta02.support.groups FROM probsummary
ta01 LEFT OUTER JOIN device ta02 ON ( ta01.affected.item =
ta02.logical.name ) WHERE ( ta02.support.groups isin
$lo.pm.assignments and ta01.flag=true )";
var success = file.doSelect(sql);
while (success == RC_SUCCESS)
{
success = findNextRecord = file.getNext();
}

Example: Handle a one-to-many relationship

This query shows all Incidents that have an associated open interaction relation.

Note

All previous examples show a many-to-one relationship; that is, multiple
rows in the first table are associated to the same row in another table. For
example, multiple Incidents have the same owner. In this case, the query
returns only one row for each row in the Incident table. In this example,
the query returns more than one row for each row in the first table.
Therefore, the results of this query may resemble the following:

Incident                                Interaction
IM10003                                 SD10060
IM10003                                 SD10033
IM10003                                 SD10003
IM10002                                 SD10006
IM10002                                 SD10002


var file = new SCFile("probsummary");
var sql = "SELECT ta01.*, ta03.incident.id AS iid FROM
probsummary ta01 LEFT OUTER JOIN screlation ta02 LEFT OUTER JOIN
incidents ta03 ON ( ta02.depend = ta03.incident.id ) ON (
ta01.number = ta02.source ) WHERE ( ta03.open#\"Open\" )";
var success = file.doSelect(sql);
while (success == RC_SUCCESS)
{
print(file.number + " " + file.iid);
success = file.getNext();
}


1.7.10.11.23.3. Limitations on cross-table
join queries

The new implementation of the Cross Table Join mechanism has the following
limitations and behavior changes:

     You can only run a query on the eight functions that are described in Cross-
     table join functions
     The DISTINCT clause is unsupported.
     You can't run a join operation on the following:

           Array fields
           BLOB or CLOB objects (This is a limitation common to most RDBMSs)
           Image data-types
           Text data-types
           Encrypted fields
           LDAP files
           Joined files
           Merged files
           Tables in different RDBMSs
     Queries on IR files now behave differently. Specifically, the following behaviors
     now occur:
           Full text search no longer stems. The revised mechanism uses an SQL
            LIKE clause to retrieve results. Therefore, a search based on LIKE
           "%printer%" will no longer return stemmed variants such as "printing" or
           "printed." In the previous implementation, stemming was included because
           the query was run entirely in Service Manager and leveraged the stemming
           dictionary.
           You can no longer perform a full text search in the Cross Table Query in
           SM. Full-Text Search can only be performed in the initial relational search.
           Results are returned only from the exact fields that you specify. For
           example, if you searched for the term "printer" on the "Title" field by using
           the previous mechanism, you would receive a hit even if the term was not
           mentioned in the "Title" field, but only in the associated "Desc" field. With
           the new mechanism, you will only receive a hit if the term appears in the
           "Title" field.
     You can no longer GROUP or SORT by BLOB objects.


1.7.10.11.23.4. Error Messages

To support the new cross table join mechanism, the following error messages have
been implemented:

  Unable to locate field %s in any file

The %S function is unsupported in cross table queries.

Queries on Blob/Clob/Text/Image field %S is unsupported in cross
table query.

Cannot locate field %s in join condition \"%.*s\"

The join condition \"%.*s\" can't be converted into an SQL
expression. One or more fields might be a Blob/Clob/Text/Image
field.

The file alias \"%.*s\" is specified in the "order by" clause,
but the definition can't be found.

The field \"%.*s\" in the "order by" clause can't be found.

Cannot locate field %s.

Cannot sort or group on array field %s.

Joining tables of derived file type like JOIN_FILE or
MERGED_FILE is unsupported.


Joining tables from different RDBMS is unsupported.
Cannot locate field %s in SELECT list.


1.7.10.12. Database performance tuning

The topics in this section list suggestions for tuning your database to improve
performance, such as query speed and memory usage. Click any of the topics in this
section to learn more. For additional information, you can search the knowledgebase
in Knowledge Management or visit Software Support for a variety of best practice
documents and published white papers.


1.7.10.12.1. Tuning: Improving query speed

Most performance degradation occurs during queries. An inefficient query can
adversely affect the performance of your system by allocating resources that aren't
always needed. Queries can be tuned to perform more efficiently so that the engine is
not required to search entire files to determine which records match the query. Other
factors that can affect the performance of file system searches include key design,
key selection algorithms, and number of records.

Tuning: searching operation

Issue: When you search for an incident, interaction, or change in a heavily-populated
database, the operation takes more than 20 seconds.

Solution: In this case, change the first unique key to the primary key for the modules
that have this issue.

Tuning: query execution time

Slow query execution time is usually related to hardware and network limitations, or
report design. After eliminating hardware or network limitations as a source of the
slow response time, you can apply the following suggested tips to your report designs
to speed execution:

     Limit the number of records kept in a database table, such as avoid saving
     several years of incident records in a single database table. The more records
     that are kept in a file, the larger the index is. The larger the index is, the slower
     queries run.
     Limit sorting layers. If the raw SQL contains more than two ORDER BY
     statements, the processing time increases. Each ORDER BY statement
     significantly increases execution time.
     Use joins instead of subreports. Although subreports are universal and allow
     greater portability over different servers, they execute SQL queries against the
     database one time for every record. For example, a report with 100 records with
     a subreport in the Details section executes 101 SQL statements. A joined report
     of equivalent size executes only once.
     Use indexes where possible. Typically, the Unique key of any table is already
     indexed; however, in a join, placing a key on the field used to join the two tables
     dramatically increases the speed to execute. Add indexes only with the guidance
     of your Service Manager administrator. Adding too many indexes to a Service
     Manager table can affect performance.


Related topics

Key type definitions
Tuning: Designing keys for queries
Tuning: Key selection algorithms
Tuning: Number of fields in files


1.7.10.12.2. Tuning: Number of fields in
files

If you keep the number of fields in a database table low and limit the number of
records, performance is improved in the following areas:

     Searching for fields in a dbdict.
     Compressing and writing records to disk.
     Decompressing and reading records from disk.
     Operating client and server communications.
     Exercising the Load and Unload options.

Related topics

Key type definitions
Tuning: Designing keys for queries
Tuning: Improving query speed
Tuning: Key selection algorithms


1.7.10.12.3. Tuning queries

This section offers information about tuning queries. The suggestions, though not
required, are derived from best practices learned from previous applications of
Service Manager in large working environments. For additional information and
suggestions, you can search the knowledgebase in Knowledge Management or visit
the Software Support web site for a variety of documents and published white
papers.

Related topics

Database performance tuning
Relational operators
Retrieving records by using the record list method
Retrieving records using the Query window method
Using ranges in queries
Create a query using an or statement or an and statement
Perform IR Expert queries
Use the not symbol with logical or relational operators
Software Support


1.7.10.12.3.1. Tuning: Fully keyed queries

In fully keyed queries, all referenced fields are defined in the correct order using a
single key to process the query. This is an efficient query type because the query
engine determines precisely which records match the query by reading only part of
the index tree and none of the data record.

Related topics

Nonkeyed queries
Partially keyed queries
Stored queries
True queries
Troubleshooting and tuning queries
Tuning: Improving query speed


1.7.10.12.3.2. True queries

A true query is a query that only uses the true expression. The query engine uses the
first Unique key defined in the key list to process the query and then returns all
records in the database. If no Unique key is defined, Service Manager uses the first
key. Although a true query quickly and efficiently returns results, the results include
all records in the table and don't specify only records you want to view.

Related topics

Nonkeyed queries
Partially keyed queries
Stored queries
Tuning: Fully keyed queries


1.7.10.12.3.3. Partially keyed queries

A partially keyed query is a query where some of the referenced fields are defined in
the key that processes the query. Using the index, the query engine can only partially
determine whether a record matches the query. For an efficient partially keyed query,
the first field in the key must be included in the query expression. If it's not included,
all index entries in the index must first be read to determine the results of the query.

Related topics

Nonkeyed queries
Stored queries
True queries
Create a query using more than one field
Tuning: Fully keyed queries
Tuning: Improving query speed


1.7.10.12.3.4. Nonkeyed queries

Non keyed queries are typically used for small files only and aren't efficient when
used against a large file. The query engine must first read all index entries in an index
and then read all records within those entries to determine which records match the
query.

Related topics

Partially keyed queries
Stored queries
True queries
Tuning: Fully keyed queries
Tuning: Improving query speed
````
