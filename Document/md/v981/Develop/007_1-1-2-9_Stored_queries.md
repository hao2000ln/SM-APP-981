---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.2.9 .. 1.1.2.9
printed_pages: 174-190
---

# 1.1.2.9 Stored queries

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.2.9. Stored queries

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


1.1.2.9.1. Stored Query Maintenance utility

The Stored Query Maintenance utility allows designated users to define and store
queries that display lists of specific records or populate dynamic display objects such
as charts and marquees.

Stored queries commonly run from the following features in Service Manager:

     Advanced and Expert Search menu options
     Display objects
     Buttons
     Scripts

You could use a stored query to do any of the following:

     Search for incident records that have reached a certain status
     Populate a chart that displays open records by category
     Display a list of change requests assigned to a particular approval group at the
     click of a button

Related topics

Using stored queries in display objects
Using stored queries in scripts
Menu option searches


1.1.2.9.2. Using stored queries in display
objects

An administrator can use stored queries to retrieve and display dynamic data using
menu buttons, charts, and marquees. Stored queries applied in this manner aren't
accessible to the user and operate in the background to retrieve records from the
database.

For example, you could place a dynamic chart on a supervisor’s startup menu
showing all open records by category. By placing buttons that run individual stored
queries on the bottom of the chart, the supervisor could display lists of records by
category.

Using menu buttons to run stored queries

Buttons that run stored queries from a menu must have a button ID defined in a menu
record. Use the following values to run a stored query from a menu:

     Application: query.stored
     Parameter Name: text
     Parameter Value: <stored query name>
     Condition: true (or a condition statement that checks for a particular query
     group)

Using stored queries to produce charts and
marquees

Stored queries produce dynamic information that the system gathers and displays in a
bar chart. Agent records that reference each display object in Forms Designer define
these queries.

A marquee runs one stored query at a time and can't provide access to actual
records. Queries run from marquees that display messages about records.

Contents

     1 Using menu buttons to run stored queries
     2 Using stored queries to produce charts and marquees


1.1.2.9.3. Using stored queries in scripts

You can use a stored query to execute a script, and you can write a script that uses a
stored query to locate specific records.

A script calls stored queries to populate forms with useful data. Use this capability to
grant limited database access to certain users.

For example: You could allow Level 1 technicians access to a user information form
through which they can update selected elements of a caller’s contact record. The
script calls the stored query. The query retrieves and displays the data from the
contacts file. The technician makes the updates and saves them. The script then
continues walking the Level 1 technician through the normal workflow.

Related topics

Stored queries
Using stored queries in display objects
Menu option searches


1.1.2.9.4. Menu option searches

Users can run stored queries from the Expert Search menu option in search forms for
the principal Service Manager applications (for example, Incident Management,
Change Management, and Configuration Management) or from the Advanced Search
menu option in the Database Manager. The appearance of these options and the
features they control depend on the capabilities defined for each user in the operator
record.

Related topics

Stored queries
Using stored queries in display objects
Using stored queries in scripts
More Actions menu


1.1.2.9.5. Define which system processes
manage message traffic

Follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Message Processors tab.
   3. In the Processor Name field, type the names of the background or scheduler

     processes that are to manage message traffic. The processor name must match
     the class name specified for the message class processor.
   4. Click Save.
   5. Start the message processors.

Service Manager rotates messages among all the processes you define. If you don't
define any message processors, then Service Manager uses the problem processor
to manage all message traffic.

Related topics

Notifications
Start a scheduled process
Add a message record
Add a notification delivery method
Create an on-call schedule
Create a distribution group
Send a notification using Format Control


1.1.2.9.6. Grant access to stored queries

To grant access to stored queries, add the appropriate capability words to the user’s
operator record.

     QueryAdmin: Grants administrative access to query options and maintenance
     and the ability to create and modify stored queries.
     query.stored: Enables a user to run stored queries that are assigned to the user
     (or the user's group).
     query.stored.mod: Enables a user to run and to temporarily modify stored
     queries that are assigned to the user (or the user's group). The user can't save
     the modified stored query.
     query.window: Grants access to the Query window.

Related topics

Stored queries
Using stored queries in display objects
Using stored queries in scripts
Menu option searches


1.1.2.9.7. Create stored queries from the
Query Maintenance form

You can add, edit or run stored queries from the Query window, which is accessible
from the form in Database Manager or from the Application search form. Data entered
into the form is automatically entered into the Query window to form the query.
Depending on your permissions, you can edit and run that query, or select a query
from a list of stored queries.

   1. Click Tailoring > Tailoring Tools > Stored Queries.

     A blank Stored Query Maintenance form opens.

   2. Click Search.

     A list of existing queries opens.

   3. You can copy an existing query, create a brand new query, or create a new
     query from an existing query.

                   Note

                In Service Manager, you can use field name information in field help
                to identify the field names you want to use in your stored queries. To
                display field name information in field help, make sure one of the
                following conditions is fulfilled:

                      In the Windows client, the “Show context-sensitive help debug
                      information” preference is enabled.
                      In the Web client, “viewcontexthelp=true” is appended to the
                      URL before you log in.

   4. Click Save to save any changes.

     Caution: If you are creating a new stored query from an existing query, make
     sure you click Add instead of save. If you click save, you will replace the existing
     stored query with the new stored query you are attempting to add.

   5. Click Add to add a new query.

     You receive a message that states the record has been added to the querystored
     file.

Related topics


Stored queries
Using stored queries in display objects
Using stored queries in scripts
Menu option searches
````
