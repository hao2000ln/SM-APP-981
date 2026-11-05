---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.10.11.11 .. 1.7.10.11.22
printed_pages: 2345-2371
---

# 1.7.10.11.11 Use the less than relational operator

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.10.11.11. Use the less than relational
operator

Applies to User Roles: System Administrator

Example: Retrieve all device records where the value of the IP Address field is less
than 196.

In this example, we execute a less than (<) search from the device form and then
displays a record list containing all matches with a value less than the number 196.

To use the less than relational operator:

   1. Click Tailoring > Database Manager.
   2. Type =device in the Form field.
   3. Click Search.
   4. Type <196 in the Serial number field on the device form.
   5. Press Enter.
   6. Click any record to view the details.

Note: A device is also referred to as an Asset or Configuration Item (CI).

Related topics

Less than relational operator
Record retrieval
Relational operators
Retrieving records by using the record list method


1.7.10.11.12. Use the like relational operator

Applies to User Roles: System Administrator

Example: Retrieve all contact records that contain the letter e as the second letter of
the last name.

In this example, we execute a like query where the full.name field is like ?e* and then
displays a record list containing all matching records.

To use the like relational operator:

   1. Click System Administration > Base System Configuration > Contacts.
   2. Type ?e* in the Full Name field.
   3. Press Enter.
   4. Click any record to view the details.

Note: This query contains two wildcard characters, which triggers Database Manager
to automatically generate a like query. A like query doesn't automatically generate a
starts with query. For example, to see all records that start with any character
followed by e* with any number of characters following, type ?e\** in the last.name
field. The returned records include those where the last.name is like Ae*, he*e, fe*,
Be*bcdefg, and so on.

Related topics

Like relational operator
Record retrieval
Relational operators
Wildcard characters
Retrieving records by using the record list method


1.7.10.11.13. Use the not symbol with
logical or relational operators

Applies to User Roles: System Administrator
Example: Retrieve all device records, excluding those that begin with the letter C, in
the Vendor Name field.

Note: If your database has not first been set up to enable case-insensitive searching,
this query returns records that begin with a lowercase letter c.

In this example, we use the not relational operator to exclude records in the
device.qbe form.

To use the not symbol with logical or relational operators:

   1. Click Tailoring > Database Manager.
   2. Type =device in the Form field, and then click Search.

   3. With the device form open, type C or ~C in the Vendor Name field, and then
     click Find.
     Note: Using the tilde (~) character is platform-dependent.

   4. Click any record in the list of returned records to view the details.

Note: A device is also referred to as an Asset or Configuration Item (CI).

Related topics

Logical operators
Relational operators
Retrieving records by using the record list method
Using ranges in queries


1.7.10.11.14. Use the starts with relational
operator

Applies to User Roles: System Administrator

Example: Retrieve all capability words that begin with the letter p.

In this example, we execute a starts with query for all capability records where the
capability field on the Capability Word form begins with the letter p.

To use the starts with relational operator:

   1. Click Tailoring > Database Manager.
   2. Type capability in the Form field, and then click Search.
   3. Double-click the capability form in the records returned.
   4. Type p in the Capability field on the Capability Word form, and then press

     Enter.
   5. Click any record to view the details.

Note: Results returned are case-sensitive and return only matches for the case used
in your query string, unless your database is first set up for case-insensitive
searching.

Related topics

Record retrieval
Relational operators
Retrieving records by using the record list method
Starts with relational operator


1.7.10.11.15. Create a query using a simple
query expression

Applies to User roles: System Administrator

In this example, a query is performed on a specific assignee for all contracts in
Configuration Management. Once stored, operators or groups of operators can
access the query and automatically generate a list of records without reentering the
detailed search criteria.

Note: You must have the capability word QueryAdmin or query.stored.mod operator
record to add or edit stored queries.

To create a query using a simple query expression:

   1. Click Configuration Management > Contracts > Contracts.
   2. Use the Fill function in the Assignee field to choose an assignee. For this

     example, Carlton Hulman was chosen.

   3. Open the More Actions menu and choose Expert Search.

     The Query form opens. The new query is displayed in the Query field. For this
     example, the query for Carlton Hulman is displayed as follows:
      assignee#"Carlton.Hulman"

   4. On the Query form, click Keys.

     Note: Do not modify the automatically-generated query string,
      assignee#"Carlton.Hulman" , as it appears in the Query field.

   5. On The Key Window (keylist form), type a key number to select the number of
     positions for the assignee.name key in the query. For example, type the number
      3 to select 3 positions.

   6. Click OK.

     The Sort Fields field in the Query Window is now modified to agree with the key
     definition you selected.

   7. On the Query form, click Store to create the querystored file.

   8. Fill in the following fields:

           In the Access List field, type in the Query Groups or Operator Names that
           you want to have access to this query. If you want all users to have access,


           leave the list blank.
           In the Name field, type a unique name for your query.
           In the Description field, type an explanatory description.

   9. Click Add.

     The following message confirms your entry was successful: Query added to
     querystored file .

 10. Continue to further refine your search criteria, or click Search. You can also
     click any record in the list of returned records to view the details.

Related topics

Complex query expressions
Record retrieval
Retrieving records using the Query window method
Simple query expressions


1.7.10.11.16. Create a query using isin in
statements

Applies to User Roles: System Administrator

Example: Retrieve all contacts records where the Company name is either DEFAULT
or advantage and the Contact Name begins with the letter B .

In this example, we perform a complex query on the contacts.qbe form using the
isin relational operator. An Advanced Search is performed and records are returned
where the value of the Company field is either DEFAULT or advantage and the
value of the Contact Name field begins the letter B .

To create a query using isin in statements:

   1. Click System Administration > Base System Configuration > Contacts.
   2. On the Contact Information form, open the More Actions menu.
   3. Select Expert Search.
   4. In the Query field, type company isin {"advantage", "DEFAULT"} and

     contact.name#"B" , and then click Search.
   5. Click any record in the list of returned records to view the details.

Related topics

Record retrieval
Relational operators
Retrieving records using the Query window method
Using functions in a query
More Actions menu
Create a query using an or statement or an and statement
Create a query using not in statements
Create a query using not in statements
Use like queries to search for a string of characters


1.7.10.11.17. Use the index function in a
query

Applies to User Roles: System Administrator

Example: Retrieve all records where the character string DEFAULT occurs anywhere
in the device name and the device name ends in the number string 002.

This example uses a like query and wildcard characters with the index function to
perform an Advanced Search on records on the device.qbe form.

To use the index function in a query:

   1. Click Tailoring > Database Manager.

   2. Type =device in the Form field, and then click Search.

   3. On the Asset Information form, open the More Actions menu.

   4. Select Expert Search.

   5. In the Query field, type logical.name like "*002" and index("DEFAULT",
     logical.name)>0 , and then click Search.

     Note: Wildcard characters are only valid in like queries. In other types of
     queries, the characters are literal interpretations.

   6. Click any record in the list of returned records to view the details.

Note: A device is also referred to as an Asset or Configuration Item (CI).

Related topics

     Complex query expressions
     Record retrieval
     Relational operators
     Stored queries
     Using functions in a query
     More Actions menu
     Use like queries to search for a string of characters
     Use the lng function in a query
     Use the tod function in a greater than or less than query


1.7.10.11.18. Use the lng function in a query

Applies to User roles: System Administrator

Example: Retrieve operator records where the length of the operator name is longer
than five (5) characters.
This example uses the lng function to specify the length of character strings in the
operator.qbe form and then performs an Advanced Search for records matching that
criteria.

To use the lng function in a query:

   1. Click Tailoring > Database Manager.
   2. Type =operator in the Form field, and then click Search.
   3. On the Operator Record form, open the More Actions menu.

   4. Select Expert Search.
   5. In the Query field, type lng(name)>5 , and then click Search.

     Note: This lng query is the same as typing name like "??????*"
   6. Click any record in the list of returned records to view the details.

Related topics

     Record retrieval
     Relational operators
     Using functions in a query
     More Actions menu
     Use the index function in a query
     Use the tod function in a greater than or less than query


1.7.10.11.19. Use the tod function in a
greater than or less than query

Applies to User roles: System Administrator

Example: Retrieve all operator records where the password was updated within the
past 100 days, or where the password has not been updated in the past 100 days.

In this example, we use the greater than (>) or less than (<) operator, in conjunction
with the tod function, to perform an Advanced Search on records in the operator.qbe
form.

To use the tod function in a greater than or less than query:

   1. Click Tailoring > Database Manager.
   2. Type =operator in the Form field, and then click Search.
   3. On the Operator Record form, open the More Actions menu.
   4. Select Expert Search.
   5. In the Query field, type password.date>tod() - '100 00:00:00' , and then click

     Search.
   6. Click any record in the list of returned records to view the details.

Note: Typing password.date<tod() - '100 00:00' in Step 5 returns the opposite
result, where the password has not been changed in 100 days or more.

Related topics

Record retrieval
Relational operators
Using functions in a query
More Actions menu
Create a query using not in statements
Create a query using an or statement or an and statement
Use like queries to search for a string of characters
Use the index function in a query
Use the lng function in a query


1.7.10.11.20. Retrieving records by using
the record list method

The record list is a standard feature for accessing records in a database. You will use
it most frequently at prompts where a form or file name is required. You enter the
necessary information in the form and Database Manager processes the query by
looking for similar records based on the values you entered. Search values from
record lists can be made more efficient through the use of relational operators.
Database Manager displays the records it finds in a record list.

Retrieve all records in a table

Applies to User Roles: System Administrator

Example: Retrieve all records in the Manage CI form.

In this example, we execute a true query, which returns all records contained in the
device.g form.

To retrieve all records in a table:

   1. Click Tailoring > Database Manager.
   2. Type =device in the Form field, and then click Search.
   3. On the Manage CI form, click Search.
   4. Click any record in the list of returned records to view the details.

Retrieve records within a range

Applies to User Roles: System Administrator

Example: Retrieve all device records where the value of the Part Number field is
greater than a character value of 500 and less than a character value of 1000.

In this example we execute a greater than (>) and less than (<) search on the device.g
form to search part numbers where the value is greater than the number 500 and less
than the number 1000.

Note: For a range query on numeric fields, use the Query window.

To retrieve records within a range:

   1. Click Tailoring > Database Manager.
   2. Type =device in the Form field, and then click Search.
   3. On the Manage CI form, type >500 AND <1000 in the Part Number field.


   4. Click Find.
   5. Click any record in the list of returned records to view the details

Note: A device is also referred to as a Configuration Item (CI).

Related topics

When should I use the Query Window instead of the record list query method?
Record retrieval


1.7.10.11.21. Retrieving records using the
Query window method

The Query Window method allows you to retrieve records by typing a logical
expression directly into the query field. When you press Enter, Database Manager
searches for records that match your query and displays the list of matching records
in a table. Additionally, you can define the querywindow capability word in your
operator record to add the ability to specify sort fields in the Query Window
application.

Related topics

Capability words
Logical operators
Record retrieval
Retrieving records by using the record list method
When should I use the Query Window instead of the record list query method?
Excluding records from a query
Perform IR Expert queries


1.7.10.11.21.1. When should I use the Query
Window instead of the record list query
method?

Use the Query Window instead of the record list query method in the following
situations:

     When performing simple queries in situations where a record list query can't be
     used.
     For queries that include ranges, such as when the field to query exists in the
     database dictionary record of the file, but is not displayed on the form.
     When the input field on the form is not long enough to contain the desired value.

Related topics

Record retrieval
Retrieving records by using the record list method
Retrieving records using the Query window method
Perform IR Expert queries


1.7.10.11.21.2. Excluding records from a
query

To exclude specific records from a query, use the not symbol with logical or relational
operators.

Related topics

Logical operators
Relational operators
Perform IR Expert queries
Use the not symbol with logical or relational operators


1.7.10.11.21.3. Using functions in a query

Use the Query window to perform queries that involve functions, such as index, tod,
or lng.

Related topics

Record retrieval
Retrieving records using the Query window method
Retrieving records by using the record list method
Perform IR Expert queries
Use the index function in a query
Use the lng function in a query
Use the tod function in a greater than or less than query
Service Manager Programming


1.7.10.11.21.4. Open the query window

Applies to User roles: System Administrator

To open the Query window from the operator record:

   1. Click Tailoring > Database Manager.
   2. Type =operator in the Form field, and then click Search.
   3. On the Operator Record form, open the More Actions menu.
   4. Select Expert Search.
   5. The Query form is displayed. The display options on the form are dependent on

     the execution capability words assigned for the user, as follows:

   1. Query Window access – The Query window is displayed at the bottom of
           your screen.
           Stored query access – If stored queries are defined, a list is displayed.
           Both – The Query window with buttons defining query options is displayed.

Related topics

Complex query expressions
Record retrieval
Logical operators
Relational operators
Retrieving records using the Query window method
Stored queries
Using functions in a query
More Actions menu
Create a query using a simple query expression
Use like queries to search for a string of characters
Use the Query Window


1.7.10.11.21.5. Use the query window

Applies to User roles: System Administrator

Example: Retrieve all device records where the logical name begins with the
character A.

This example uses the equal to (=) relational operator to perform an Advanced Search
on records in the device.qbe form. The system returns all values in the logical.name
heading that beginning with the letter A.

To use the Query Window:

   1. Click Tailoring > Database Manager.
   2. Type =device in the Form field, and then click Search.
   3. On the Asset Information form, open the More Actions menu.
   4. Select Expert Search.
   5. In the Query field, type logical.name#"A" , and then click Search.
   6. Click any record in the list of returned records to view the details.

Note: A device is also referred to as an Asset or Configuration Item (CI).

Related topics

     Complex query expressions
     Stored queries
     Record retrieval
     Relational operators
     Retrieving records using the Query window method
     Using functions in a query
     Create a query using a simple query expression
     Open the Query Window
     Use like queries to search for a string of characters


1.7.10.11.22. Stored queries

Stored queries enable users to retrieve and display current information efficiently by
using predefined search parameters. Depending on permissions, users can run
predefined queries, modify predefined queries before running them, or store a
personal list of modified queries and run a query from their list.

Administrators can use stored queries to display lists of specific records or populate
dynamic display objects such as charts and marquees. They can add new queries
and fine tune the out-of-box queries to decrease response time or implement best
practices in their environment.

Stored query option definitions

Option key                              Function            Definition
F1                                      Append using the &
F2                                      character           Appends an additional
F3                                                          query to the end of your
                                        character           original query using the
F4                                                          word AND to separate
                                        Insert using the &  the two queries.
                                        character
                                                            Appends an additional
                                        character           query to the end of your
                                                            original query using the
                                                            word OR to separate the
                                                            two queries.

                                                            Inserts an additional
                                                            query at the beginning of
                                                            your original query using
                                                            the word AND to
                                                            separate the two
                                                            queries.

                                                            Inserts an additional
                                                            query at the beginning of
                                                            your original query using
                                                            the word OR to separate
                                                            the two queries.


Add a stored query

Applies to User roles: System Administrator

You can add, edit, or run stored queries from the Query window, which is accessible
from the form in Database Manager or from the Application search form. Data entered
into the form is automatically entered into the Query window to form the query.
Depending on your permissions, you can edit and run that query, or select a query
from a list of stored queries.

In this example, a query is performed on a specific assignee for all contracts in
Configuration Management. Once stored, operators or groups of operators can
access the query and automatically generate a list of records without reentering the
detailed search criteria.

            Note

           You must have the capability word QueryAdmin or query.stored.mod
           operator record to add or edit stored queries.

To add a stored query:

   1. Click Configuration Management > Contracts > Contracts.
   2. Use the Fill function in the Assignee field to choose an assignee. For this

     example, Carlton Hulman was chosen.

   3. Click the More Actions icon and choose Expert Search.

     The Query form opens. The new query is displayed in the Query field. For this
     example, the query for Carlton Hulman is displayed as follows:
      assignee#"Carlton.Hulman"

                   Note

                In Service Manager, you can use field name information in field help
                to identify the field names you want to use in your stored queries. To
                display field name information in field help, make sure one of the
                following conditions is fulfilled:

                      In the Windows client, the Show context-sensitive help debug
                      information preference is enabled.
                      In the Web client, viewcontexthelp=true is appended to the
                      URL before you log in.


   4. On the Query form, click Keys.

     Note: Do not modify the automatically-generated query string,
      assignee#"Carlton.Hulman" , as it appears in the Query field.

   5. On The Key Window (keylist form), type a key number to select the number of
     positions for the assignee.name key in the query. For example, type the number
      3 to select 3 positions.

   6. Click OK.

     The Sort Fields field in the Query Window is now modified to agree with the key
     definition you selected.

   7. On the Query form, click Store to create the querystored file.

   8. Fill in the following fields:

           In the Access List field, type in the Query Groups or Operator Names that
           you want to have access to this query. If you want all users to have access,
           leave the list blank.
           In the Name field, type a unique name for your query.
           In the Description field, type an explanatory description.

   9. Click Add.

     The following message confirms your entry was successful: Query added to
     querystored file .

 10. Continue to further refine your search criteria, or click Search. You can also
     click any record in the list of returned records to view the details.

Update a stored query

Applies to User roles: System Administrator

You can add, edit, or run stored queries from the Query window, which is accessible
from the form in Database Manager or from the Application search form. Data entered
into the from is automatically entered into the Query window to form the query.
Depending on your permissions, you can edit and run that query or select a query
from a list of stored queries.

In this example, we update and save a stored query for Incident Management (the
probsummary file).

To update a stored query:


1. Open the query window.

        To open the query window from a Service Manager application:

           1. Open the application Search form. For this example, click Incident
              Management > Search Incidents.

           2. Open the More Actions menu.
           3. Select Expert Search.

        To open the query window from a Database Manager search form:

           1. Open the form in Database Manager. For this example, type
               =probsummary in the Form field, and then press Enter.

           2. Open the More Actions menu.

           3. Select Advanced Search.

              The Query window opens.

2. Click Select to display the list of stored queries for the associated file.

3. Double-click a query to select it. For this example, select status.resolved.

  The Stored Query record opens.

4. Click Select to edit the query as desired. In this example, change the query to
   flag=true and problem.status<>"Resolved" .

               Note

             In Service Manager, you can use field name information in field help
             to identify the field names you want to use in your stored queries. To
             display field name information in field help, make sure one of the
             following conditions is fulfilled:

                   In the Windows client, the Show context-sensitive help debug
                   information preference is enabled.
                   In the Web client, viewcontexthelp=true is appended to the
                   URL before you log in.

5. Specify any other controls you want.

6. Click Store to save your edits to the selected query.

  The Stored Query Maintenance form opens.

7. Give the query a unique Name. For this example, not.resolved .
8. Add a Description. For this example, type Unresolved records .


   9. Click Add.

     Service Manager returns you to the Query window and displays the message:
      Query added to querystored file .

You can click Execute Search to run the saved query at this point, or click Back to
exit.

Append stored queries

Applies to User roles: System Administrator

You can add, edit, or run stored queries from the Query window, which is accessible
from the form in Database Manager or from the Application search form. Data entered
into the from is automatically entered into the Query window to form the query.
Depending on your permissions, you can edit and run that query or select a query
from a list of stored queries.
Note: You must have the capability word QueryAdmin or query.stored.mod operator
record to add or edit stored queries.

In this example, two stored queries for Incident Management (the probsummary file)
are joined and saved.

To append stored queries:

   1. To open the query window from a Service Manager application:

        1. Open the application Search form.

           For this example, click Incident Management > Search Incidents.
        2. Open the More Actions menu.

        3. Choose Expert Search.

           The query window opens.

   2. To open the query window from a Database Manager search form:

        1. Open the form in Database Manager.
           For this example, type =probsummary in the Form field, and then press
           Enter.

        2. Open the More Actions menu.

        3. Choose Expert Search.


        The Query window opens.

3. Click Select to display the list of stored queries for the associated file, and then
  double-click a query to select it.

  For this example, select deadline. The Stored Query record opens.

4. Click Select.

  Service Manager returns you to the list of queries.

5. Select another query from the list.

  For this example, select pri.1. The Stored Query record opens with additional
  buttons on the toolbar.

6. Click one of these buttons to use this query in addition to the one you selected
  previously.

        Click Append using & to add this query after the previous one using the
        and (&) operator.
        Click Append using | to add this query after the previous one using the or
        (|) operator.
        Click Insert using & to add this query before the previous one using the
        and (&) operator.
        Click Insert using | to add this query before the previous one using the or
        (|) operator.

  For this example, click Append using &.

7. You can click Execute Search to run the query without saving it or click Store to
  save your modified query for future use.

  For this example, click Store. The Stored Query Maintenance form opens.

  The value in the Name field is that of the last appended or inserted stored query,
  pri.1.
  The value in the Query field is the new query you created. (flag=true and
  status#"DEADLINE" and problem.status~="Cleared" and flag=true and
  priority.code="1").

  For this example, enter the following information:
        Give the query a unique Name. For this example, type pri.1&deadline.
        Add a Description. For this example, type Priority 1 records in deadline
        alert.


           Edit the Query, if necessary. For this example, delete the second and
           flag=true .
           Specify any other controls you want.

     Click Add.

     Service Manager returns you to the Query window and displays the Query
     added to querystored file message.

     You can click Execute Search to run the saved query at this point, or click Back
     to exit.

Run a stored query

Applies to User roles: System Administrator

Depending on your permissions, you can add, edit, or run stored queries from the
Query window, which is accessible from the form in Database Manager or from the
Application search form. Data entered on the form is automatically entered into the
Query window to form the query. Depending on your permissions, you can edit and
run that query, or select a query from a list of stored queries.

Example: Selecting and running a stored query.

In this example, a stored query for Incident Management (the probsummary file) is
selected and run.

   1. Open the query window.

           To open the query window from a Service Manager application:
              1. Open the application Search form. For this example, click Incident
                 Management > Search Incidents.
              2. Open the More Actions menu.
              3. Select Expert Search.

           To open the query window from a Database Manager search form:
              1. Open the form in Database Manager. For this example, type
                  =probsummary in the Form field, and then press Enter.
              2. Open the More Actions menu.
              3. Select Expert Search.

     The Query window opens.

   2. Click Select to display the list of stored queries for the associated file.
   3. Double-click a query to select it. For this example, select status.resolved. The

     Stored Query record opens.


   4. Click Select.

     Service Manager returns you to the Query window.

   5. Click Execute Search to run the stored query.

     Records matching the query display in a record list.

           If only one record matches your search criteria, that record opens.
           If no records match, the server displays the following message: No
           records found .

Related topics

Using stored queries in display objects
Menu option searches
Grant access to stored queries
Create stored queries from the Query Maintenance form
````
