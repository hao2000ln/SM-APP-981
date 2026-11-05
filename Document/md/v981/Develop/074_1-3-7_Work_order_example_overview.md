---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.3.7 .. 1.3.7.12
printed_pages: 1958-1984
---

# 1.3.7 Work order example overview

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.7. Work order example overview

What's a work order? A work order is a specific task assigned to a single engineer that identifies some
activity necessary to resolve an incident or possibly any other module if the work order system were
extended to include changes, problems, or known errors. The following example is based onService
Manager version 7.11 and was written to enable users to create, update, and close work orders for Incident
Management. It can be modified easily for another Service Manager application.

This example creates a work order system to demonstrate how to use the Document Engine. This work
order system will enable users to create work orders for an incident and view the status of these work
orders. The work order system also enables users to view and update a work order from Incident
Management. All work orders are associated with a particular incident in the system, and the incident can't
be closed until all work orders for the incident are closed.

This example is intended for users who tailor or customize the system. You should have a good
understanding of the following tailoring functions:

     Database Dictionary to create a new table
     Forms Designer to modify out-of-box forms and create new forms.
     Wizard creation tool

The work order example walks you through the following steps:

     Create a new database dictionary (dbdict) using the dbdict utility
     Specify the key fields for the table
     Create a EXWorkOrder form for the EXWorkOrder table using Forms Designer
     Create a Sequential Number File
     Modify the form to include drop-down lists
     Create a link for the EXWorkOrder form
     Create a form for the wizard to use to collect information for the work order.
     Modify the close and update incident forms
     Create aliases to link work orders to incidents
     Create State definitions
     Create Display Application Screen Definitions for open, close, and view
     Create Display Application Option Definition of Add, Cancel, Fill and Find for open, close and view.
     Modify the Process definition record im.set.close
     Test the work order example


1.3.7.1. Create a table

Use the dbdict utility to create a new table. In this example you will create a table named EXWorkOrder.
Before you can create this table, you need to know what fields are needed and the attributes of the fields.In
this example, the table stores the data for work orders associated with incidents.
To create a table, follow these steps:

   1. From the System Navigator, click Tailoring > Database Dictionary to open the Database Dictionary.
   2. Type EXWorkOrder in the File Name field.
   3. Click New.
   4. On the Fields tab, enter the following information after clicking NewField/Key.

       Field                                                                                Service Manager 9.81
       ID
       RelatedID                        Description
                                        Will be filled from the number file.
       status                           Type: character
       initiator
       assignee.name                    Will be filled by the unique ID of the related
       description                      record. For example: incident number.
                                        Type: character
       category
       RelatedCIs                       Used to store the status of the work order.
                                        Type: character
       impact
       urgency                          The operator who opened the work order.
       priority                         Type: character
       closure.code
                                        The operator assigned to the work order.
This PDF was generated on May 23, 2026  Type: character

                                        Used to hold the description of the work to do
                                        for the work order.
                                        Type:array of character

                                        Filled from the category of the related record.
                                        Type: character

                                        Used for the list of Configuration Items (CIs)
                                        associated with the work order.
                                        Type: array of character
                                        Type: character
                                        Type: character
                                        Type: character
                                        Type: character

                                                                                                                   Page 106 of 200

Field                                   Description
deadline
                                        Date by which the work order must be
                                        completed and filled on open.
                                        Type: date/time

est.finish                              The assignee's estimate for completion.
                                        Type: date/time

update.action                           Type: array of character
closure.comments                        Type: array of character

5. After you have added the fields to the table you need to add keys to the table. You should not exit
  Database Dictionary utility until you have done this for the EXWorkOrder table. See Add key fields to
  table for the detailed information.


1.3.7.2. Add key fields to a table

Use the dbdict utility to add keys to a new table. After you create a table named EXWorkOrder, you need to
add keys to the table. Keys are used to enable indexed searches as well as ensure data consistency.

To add keys to a table, follow these steps:

   1. From the Database Dictionary, click the Keys tab.
   2. Select the first available entry for a new key field.
   3. Click the New Field/Key.

   4. Enter the following information for each key you create or edit.

Field                                   Description
ID                                      Type: unique
RelatedID                               Type: no nulls
RelatedCIs                              Type: nulls & duplicates
assignee.name                           Type: nulls & duplicates

5. Click OK.


1.3.7.3. Create a form

Go to Forms Designer to create a form for the EXWorkOrder table. Utilizing the wizard to create the form
select Detail of a single record and proceed. This creates a basic form with all of the fields which can be
modified as needed. Below is an example for the EXWorkOrder form.

To create a form, follow these steps:

   1. From the System Navigator, click Tailoring >Forms Designer to open Forms Designer.
   2. Type EXWorkOrder in the Form Name field.
   3. Click New.
   4. Click Yes to use the Form Wizard.
   5. Type EXWorkOrder for the name of the table for which to create a form.
   6. Select Detail of a Single Record for the type of form you want to create.
   7. Click OK.
   8. Click Proceed to accept the defaults for the fields to include on the form.
   9. Use the Forms Designer tool to modify the form layout. Below is an example of the EXWorkOrder

     form.

 10. The values for Status are:

           New (default status)
           Open
           Ready
           Closed

 11. The Values for the Closure Code are:

           Implemented
           Canceled
           Rollback

The following is a sample EXWorkOrder form.



1.3.7.4. Create a copy of a form

In Forms Designer create the sc.manage.WorkOrder form by making a copy of sc.manage.problem. Modify
the table column inputs to use the fields from the EXWorkOrder table.

To create a new form from a copy of a form, follow these steps:

   1. From the System Navigator, click Tailoring > Forms Designer to open Forms Designer.
   2. Type sc.manage.problem in the Form field.
   3. Click Search.
   4. Select sc.manage.problem.g.
   5. Click Copy/Rename in the detail Options menu.
   6. Type sc.manage.WorkOrder in the New Name field.
   7. Click OK.
   8. In Forms Designer, update the input fields for the columns using the EXWorkOrder table.

           Incident ID - ID
           Category - category
           Related Id - RelatedID
           Status - status
           Assignee - assignee.name
           Description - description,1
           Priority - priority
           Impact - impact
           Urgency - urgency
   9. Click OK.


1.3.7.5. Create a link for the WorkOrder form

One of the advantages of a relational database is the elimination of redundant information. You accomplish
this by storing information about a particular subject in one place or table that has links to other subjects.
Links are a combination of data and link definitions with sets of conditions containing the relationships for
linked information.

To create a link for the work order form, follow these steps:

   1. From the System Navigator, click Tailoring > Tailoring Tools > Links to open the Link File form.
   2. Type EXWorkOrder in the Name field.
   3. Add a description in Description.
   4. Click New.

   5. Enter the following information.

Source Field Name                       Target File Name  Target Field Name
initiator                               operator          name
assignee.name                           operator          name
RelatedCIs                              device            logical.name

6. Select the initiator row (highlight) then right click initiator and choose Select Line.

7. In the link.structure.g form enter the following information for initiator. Then repeat Step 6 for
  assignee.name and RelatedCIs and use the following information for those fields, respectively.

Source Field (Fill To/Post From)        Target Field Name (Fill To/Post From)
initiator                               name
assignee.name                           name
RelatedCIs                              logical.name

8. Click Save.
9. Click OK.


1.3.7.6. Create a sequential number file

Create sequential number file to generate sequence numbers for the records in the EXWorkOrder table.

To create a sequential number file, follow these steps:

   1. From the System Navigator, click Tailoring > Tailoring Tools > Sequential Numbers to open the
     Sequential Number File form.

   2. Type EXWorkOrder in the Class field.
   3. Type 1 in the Last Number field.
   4. Type Number for WorkOrder in the Description field.
   5. Type 5 in the Length field.
   6. Type WO in the Prefix field.
   7. Click Add.


1.3.7.7. Create an Object definition

The purpose of this Object is to define the characteristics and behavior of the EXWorkOrder Object that
determines what data needs to be included in a work order record and how the system will process work
orders.

            Note

           See Object Definition form and fields for the Object definition field descriptions.

To create an Object definition, follow these steps:

   1. From the System Navigator, click Tailoring > Document Engine > Objects to open the Object
     Definition form.

   2. Type EXWorkOrder in the File Name field.
   3. Click Add to create the Object record.

   4. On the Object Info tab, enter the following information.

Field                                   Value
Unique key                              Automatically filled (ID)
Common name                             Automatically filled (EXWorkOrder)
Description field                       Table to hold work orders that can relate to any
                                        of the modules
Profile application                     db.environment
Profile variable                        $L.env
Number record name                      EXWorkOrder
Category table name                     category
Primary format control                  EXWorkOrder
Status field                            status
Assigned to fields                      assignee.name
Open state                              EXWorkOrder.open
Close state                             EXWorkOrder.close
Default state                           EXWorkOrder.view
Search state                            EXWorkOrder.search

5. Click Save.
6. Click the Manage Queues tab, and then enter the following information.

    Field                                                                                   Service Manager 9.81
    Manage condition
    Manage display format               Value
    Manage default query                true
    Allow add condition                 sc.manage.WorkOrder
    Default query description           assignee.name=operator()
                                        false
7. Click Save.                          My WorkOrders
8. Click OK.


1.3.7.8. Create an Initialization Process definition

These Process definitions for the work order example specifies what initial expressions and RAD
applications to use when a user opens a work order record.

To create a Process definition for initialization, follow these steps:

   1. From the System Navigator, click Tailoring > Document Engine > Processes to open the Process
     Definition form.

   2. Type EXWorkOrder.open.initial in the Process Name field.
   3. Click Add.
   4. Type $L.format="EXWorkOrder" in the Initial Expressions tab.
   5. Click Save.

   6. Enter the following information in the RAD tab.

Field                                   Value
Expressions evaluated before RAD call   $L.number.record="EXWorkOrder";$L.number.t
                                        ype="string"
RAD Application                         getnumb
Parameter Names                         Parameter Values
name                                    $L.number.record
index                                   ID in $L.file
text                                    $L.number.type

7. Click Save.


1.3.7.9. Create display application screen definition

You create the display application screen definitions for open, close, and view screens for the work order
forms that allow users to open, close, and view work order records.

To create a screen application definition for open, close, and view, follow these steps:

   1. From the System Navigator, click Tailoring > Tailoring Tools > Display Screens to open the Display
     Application Screen Definition form.

   2. Type EXWorkOrder.open in Screen ID.

   3. Enter the following information:

Field                                   Value
Screen ID                               EXWorkOrder.open
Title                                   Create New Work Order
Format                                  $L.format
I/O (If RIO)                            true
On option 0:                            redraw screen
Language                                ENG

   4. Click Add and then click OK.

For this example you also need to create display application screen definitions for a close screen.

   1. From the System Navigator, click Tailoring > Tailoring Tools > Display Screens to open the Display
     Application Screen Definition form.

   2. Use the following information:

Field                                   Value
Screen ID                               EXWorkOrder.close
Title                                   Close Work Order
Format                                  $L.format
I/O (If RIO)                            true
On option 0:                            redraw screen
Language                                ENG

   3. Click ADD and then click OK.
For this example you need to create display application screen definitions for view screen also.


1. From the System Navigator, click Tailoring > Tailoring Tools > Display Screens to open the Display
  Application Screen Definition form.

2. Use the following information:

Field                                   Value
Screen ID                               EXWorkOrder.view
Title                                   View New Work Order
Format                                  $L.format
I/O (If RIO)                            true
On option 0:                            redraw screen
Language                                ENG

3. Click Add and then clickOK.


1.3.7.10. Create display application option definitions

This procedure provides step-by-step instructions for creating add, cancel, fill, and find display application
option definitions for the following WorkOrder definitions:

     open
     close
     view

In doing this, you will repeat the same steps four times for each of the WorkOrder screen definitions (open,
close, view). However, each time you enter different values in the fields on the Display Application Option
Definition form. The tables below the steps provide the values you need to configure the display application
options.

For additional information about the display application options, see the online help topics for the display
application on the Service Manager online help server.

After you create the display application screen definitions for open, close, and view, you need to create
display application options for the open, close, and view screens.

To create a display application option definition, follow these steps:

   1. From the System Navigator, click Tailoring > Tailoring Tools > Display Options to open the Display
     Application Screen Definition form.

   2. Type EXWorkOrder.open in Screen ID.

   3. Enter the following information.

Field                                   Value
Unique ID                               Automatically generated
                                        (EXWorkOrder.open_add)
Action                                  add
GUI option                              4
Text Option                             4
Bank                                    1
Condition                               true
Default Label                           Add

4. Click Add.
5. Click OK.
6. Continue to follow steps 1 through step 6 for each of the following display option definitions using the

  values provided in the table.


Note

In some cases the value required for the Action field is unavailable in the drop-down list, but
you can type the applicable value in the field.

Open - Cancel                           Value
      Field                             EXWorkOrder.open
      Screen ID                         Generated by the system.
      Unique ID                         (EXWorkOrder.open_cancel)
                                        back
      Action                            3
      GUI option                        3
      Text Option                       1
      Bank                              true
      Condition                         Cancel
      Default Label
                                        Value
Open - Fill                             EXWorkOrder.open
      Field                             Generated by the system.
      Screen ID                         (EXWorkOrder.open_fill)
      Unique ID                         fill
                                        9
      Action                            9
      GUI option                        1
      Text Option                       true
      Bank                              Fill
      Condition
      Default Label

Open - Find                                                                                  Service Manager 9.81
      Field
      Screen ID                         Value
      Unique ID                         EXWorkOrder.open
                                        Generated by the system.
      Action                            (EXWorkOrder.open_find)
      GUI option                        find
      Text Option                       8
      Bank                              8
      Condition                         1
      Default Label                     true
                                        Find
Close - Cancel
      Field                             Value
      Screen ID                         EXWorkOrder.close
      Unique ID                         Generated by the system.
                                        (EXWorkOrder.close_cancel)
      Action                            back
      GUI option                        3
      Text Option                       3
      Bank                              1
      Condition                         true
      Default Label                     Cancel

Close - Close

      Field                                                                                  Service Manager 9.81
      Screen ID
      Unique ID                         Value
                                        EXWorkOrder.close
      Action                            Generated by the system.
      GUI option                        (EXWorkOrder.close_close)
      Text Option                       close
      Bank                              5
      Condition                         5
      Default Label                     1
                                        true
Close - Fill                            Close
      Field
      Screen ID                         Value
      Unique ID                         EXWorkOrder.close
                                        Generated by the system.
      Action                            (EXWorkOrder.close_fill)
      GUI option                        fill
      Text Option                       9
      Bank                              9
      Condition                         1
      Default Label                     true
                                        Fill
Close - Find

      Field                                                                                  Service Manager 9.81
      Screen ID
      Unique ID                         Value
                                        EXWorkOrder.close
      Action                            Generated by the system.
      GUI option                        (EXWorkOrder.close_find)
      Text Option                       find
      Bank                              8
      Condition                         8
      Default Label                     1
                                        true
View - Cancel                           Find
      Field
      Screen ID                         Value
      Unique ID                         EXWorkOrder.view
                                        Generated by the system.
      Action                            (EXWorkOrder.view_cancel)
      GUI option                        back
      Text Option                       3
      Bank                              3
      Condition                         1
      Default Label                     true
                                        Cancel
View - Fill

      Field                                                                                  Service Manager 9.81
      Screen ID
      Unique ID                         Value
                                        EXWorkOrder.view
      Action                            Generated by the system.
      GUI option                        (EXWorkOrder.view_fill)
      Text Option                       fill
      Bank                              9
      Condition                         9
      Default Label                     1
                                        true
View - Next                             Fill
      Field
      Screen ID                         Value
      Unique ID                         EXWorkOrder.view
                                        Generated by the system.
      Action                            (EXWorkOrder.view_next)
      GUI option                        next
      Text Option                       10
      Bank                              10
      Condition                         1
      Default Label                     true
                                        Next
View - Find

      Field                                                                                  Service Manager 9.81
      Screen ID
      Unique ID                         Value
                                        EXWorkOrder.view
      Action                            Generated by the system.
      GUI option                        (EXWorkOrder.view_find)
      Text Option                       find
      Bank                              8
      Condition                         8
      Default Label                     1
                                        true
View - Save                             Find
      Field
      Screen ID                         Value
      Unique ID                         EXWorkOrder.view
                                        Generated by the system.
      Action                            (EXWorkOrder.view_save)
      GUI option                        save
      Text Option                       4
      Bank                              4
      Condition                         1
      Default Label                     true
                                        Save


1.3.7.11. Create a State definition

These State definitions for the work order example specifies what process to use and what actions are
allowed when a user opens, closes, or views a work order record.

            Note

           See the State Definition field descriptions section in States for the State definition field
           descriptions.

To create a State definition for open, follow these steps:

   1. From the System Navigator, click Tailoring > Document Engine > States to open the State Definition
     form.

   2. Enter the following information:

Field                                                       Value
State                                                       EXWorkOrder.open
Display Screen                                              EXWorkOrder.open
Initialization Process                                      EXWorkOrder.open.initial
Format                                                      $L.format
Input Condition                                             true

   3. Click ADD.

To create a State definition for close, follow these steps:

   1. From the System Navigator, click Tailoring > Document Engine > States to open the State Definition
     form.

   2. Enter the following information:

Field                                                       Value
State                                                       EXWorkOrder.close
Display Screen                                              EXWorkOrder.close
Initialization Process                                      EXWorkOrder.close.initial
Format                                                      $L.format
Input Condition                                             true

   3. Click ADD.
To create a State definition for view, follow these steps:


1. From the System Navigator, click Tailoring > Document Engine > States to open the State Definition
  form.

2. Enter the following information:

Field                                   Value
State                                   EXWorkOrder.view
Display Screen                          EXWorkOrder.view
Initialization Process                  EXWorkOrder.view.initial
Format                                  $L.format
Input Condition                         true

   3. Click ADD.

To create a State definition for search, follow these steps:

   1. From the System Navigator, click Tailoring > Document Engine > States to open the State Definition
     form.

   2. Enter the following information:

Field                                   Value
State                                   EXWorkOrder.search
Display Screen                          db.search
Initialization Process                  EXWorkOrder.view.search
Format                                  $L.format
Input Condition                         true

3. Click OK.


1.3.7.12. Add a Close button

When a user completes the task or tasks, the work order should be closed. This procedure describes how
to put a close button on the EXWorkOrder form and update the status of the work order to close. This
procedure adds a display application option definition, adds a State definition for EXWorkOrder.view, and
adds a Process definition for EXWorkOrder.close.

            Note

           This procedure doesn't explain how to include validation for this activity. You would use Format
           Control to add validation.

To create a display application option definition for EXWorkOrder.view, follow these steps:

   1. From the System Navigator, click Tailoring > Tailoring Tools > Display Options top open the Display
     Application Screen Definition form.

   2. Type EXWorkOrder.view in the Screen ID field.

   3. Enter the following information.

Field                                   Value
Unique ID                               Automatically generated
                                        (EXWorkOrder.view_close)
Action                                  close
GUI option                              5
Text Option                             5
Bank                                    1
Condition                               true
Default Label                           Close

   4. Click Add.
   5. Click OK.

To update the EXWorkOrder.view state definition, follow these steps:

   1. From the System Navigator, click Tailoring > Document Engine > States to open the State Definition
     form.

   2. In the State field, type EXWorkOrder.view and then click Search. The EXWorkOrder.view state
     definition form opens.

   3. Add the following to update the state definition form.


Field                                   Value
Display Action                          close
Process Name                            EXWorkOrder.close
Condition                               true

   4. Click Save and then click OK.

To add a process definition record for EXWorkOrder.close, follow these steps:

   1. From the System Navigator, click Tailoring > Document Engine > Processes to open the Process
     Definition form.

   2. Type EXWorkOrder.close in Process Name.
   3. Click Add.

   4. On the Initial Expressions tab, type the following expression:

           status in $L.file="Closed"
           $L.mode="closed"
   5. Click Save.

   6. On the RAD tab, enter the following information:

Field                                   Value
Expressions evaluated before RAD call   $L.EXaction="update"
RAD Application                         se.base.method
Condition                               true
Parameter Names                         Parameter Values
file                                    $L.file
prompt                                  $L.EXaction
second file                             $L.file.save
record                                  $L.fc
second.record                           $L.object
boolean1                                false

7. Click Save and then OK.
````
