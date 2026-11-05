---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.6.3.5 .. 1.6.3.5
printed_pages: 1528-1550
---

# 1.6.3.5 Task Planner

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.3.5. Task Planner

Task Planner enables you to schedule tasks in Service Manager modules such as
Change Management and Request Fulfillment.

Task Planner graphical interface

Task Planner graphical interface supports panning and zooming.

     To zoom in or zoom out Task Planner graphical interface, click Zoom in or Zoom
     out in the toolbar.
     To reposition the workflow within the graphical interface, move the outline box at
     the top right of the graphical interface, or click and drag the workflow
     background.

The following table describes the various statuses of a task and their appearance in
the graphical interface.

Task status                             Graphic style                          Service Manager 9.81
0-Waiting
                                                       Remarks
0-Planned (opened)                                     This style appears when
                                                       a task is created but still
 1-Ready                                               in Planned status
 2-Assigned                                            because it is dependent
 3-In Progress                                         on another task.
 4-Blocked
 20-Completed                                                                                      Page 150 of 162
 21-Completed with
 problem
 30-Canceled
 31-Withdrawn
 32-Failed

Related topics

This PDF was generated on May 23, 2026

Process Designer
Process Designer security model
Create a rule set


1.6.3.5.1. Plan a task with Task Planner

Applies to User Roles: System Administrator, Implementer
You can use Task Planner to plan tasks for current or future phases of records that
support tasks.
To plan a task by using Task Planner, follow these steps:

   1. Open the record for which you want to plan a task.
     For example, click Change Management > Change Queue, and then select a
     Change record from the queue. Or, click Request Fulfillment > Search
     Requests, enter your search criteria, and then click Search.

   2. Click the Tasks tab in the record, and then click Edit in the Planned Tasks pane
     to open Task Planner.

                   Note

                If you open Task Planner before a record is created (that is, a new
                record that you have not yet saved) or after a record is closed, Task
                Planner is read-only. In this situation, the Add Task and Save
                buttons are invisible.

   3. Click Add Task, and then do the following:
        1. Type the task title in the Description text box.
        2. Select task category from the Task Category drop-down list.
        3. Select a phase to start the task from the Open In Phase drop-down list.


Note

                         If you plan a large number of tasks for a single phase in a
                         workflow, you may experience slow performance.
                         Therefore, we recommend that you don't create more
                         than ten tasks that start in the same phase.

                         If the start phase in the task is the same as the current
                         phase of the parent record, the task is created with a task
                         number assigned. Otherwise, the task remains in the
                         planned status until the parent record reaches the start
                         phase (the "open in" phase) defined for this task.

     4. Select a phase to end the task from the Close By Phase drop-down list.

                      Note

                   The end phase must be no earlier than the start phase. If left
                   blank, the end phase matches the start phase.

4. To add another task, click Add Task. To add a dependent task, hover the mouse
  on an existing task until you see a hand symbol, and then drag the mouse
  pointer to add the new sequential task.

5. Click Save to save the planned tasks.


Note

                      After you finish adding tasks, you can click Auto Layout to
                      automatically arrange the tasks and dependencies in the
                      workflow.
                      Once the task record is created, you can't delete the task or
                      modify its properties in Task Planner. You can click the task
                      number in the graphical interface to modify the details of a
                      created task record.
                      The Mark as required/Set properties as read-only in change
                      field can only be set for tasks that are defined in Task Planner
                      in the change model and request model. These fields are read-
                      only in Task Planner, and are displayed for your reference.
                      If a task is not marked as required in a change model or request
                      model and has not been created, you can modify the properties
                      of this planned task, or you can click Delete to remove the task.
                      However, you can't move the "open in" phase of a planned task
                      to a phase prior to the current phase of the record.

Related topics

Process Designer
Process Designer security model


1.6.3.5.2. Setting the input and output
data in Task Planner

The Input and Output fields in Task Planner enable you to configure the information
that's pulled from the parent record into a task record, or pushed from the task record
to the parent record.

Task Planner shares the following types of information between the parent and task
records:

     Values in fields in the parent record
     User options
     Additional properties

Information that's pulled into the task record from the parent record ("input") is
displayed in a read-only field in the Additional Properties tab of the task record. If
you configure "output" (information that's pushed from the task record to the parent
record), an editable field is displayed in the Additional Properties tab of the task
record. Values that you enter into this field are shared with the parent record.

To configure the input and output of planned tasks, follow these steps:

   1. Open the record for which you want to plan a task.

     For example, click Change Management > Change Queue, and then select a
     Change record from the queue. Or, click Request Fulfillment > Search
     Requests, enter your search criteria, and then click Search.

   2. Click the Tasks tab in the record, and then click Edit in the Planned Tasks pane
     to open Task Planner.

   3. Select the task for which you want to configure input or output, and then open
     the Input-Output tab.

                   Note

                You can't configure the input and output of active tasks.

   4. To configure input, click the icon at the right of the Input field, and then select
     one or more values from the drop-down list. If the value that you require doesn't
     appear in the list, you must create it as an additional property. For more
     information about how to do this, see the "" section.


     To configure output, click the icon at the right of the Output field, and then
     select one or more values from the drop-down list.

                   Note

                The output field supports additional properties only.

   5. Click Save in the toolbar to save your changes.

Related topics

Process Designer
Process Designer security model
Configure the additional properties in Task Planner


1.6.3.5.3. Configure the recommended
maximum number of tasks

Service Manager processes planned tasks sequentially. Therefore, if you plan a large
number of tasks for a single phase in a workflow, you may experience slow
performance when a record moves to that phase and the tasks are processed.
To help prevent users from planning too many tasks and degrading the system
performance, you can configure the recommended maximum number of tasks for
phases. When a record that has more than the maximum recommended number of
tasks is saved, a warning message is displayed to the current user.
To configure the recommended maximum number of tasks, follow these steps:

   1. Click Tailoring > Process Designer > Configuration > Settings.
   2. In the Suggested Maximum Task Number in Task Planner field, enter the

     desired maximum number of tasks for each phase. By default, the value is 10.

                   Note

                We don't recommend that you configure a value over 10.

   3. Click Save in the toolbar to save your changes and exit.


1.6.3.5.4. Configuring Task Planner

You can perform the following tasks to configure Task Planner to your requirements:

     Add fields to Task Planner
     Edit additional fields in Task Planner
     Remove additional fields from Task Planner
     Configure the status mapping between the task file and Task Planner
     Configure the additional properties in Task Planner

Related topics

Process Designer
Process Designer security model


1.6.3.5.4.1. Add fields to Task Planner

You can add fields to Task Planner, and determine whether they are mandatory or not.
Additional fields are associated with a specific type of task file (for example, the
change task file), and can be configured at both the file and task category level. This
determines whether the additional field is displayed whenever Task Planner is started
for that type of task file, or whether the field is displayed once the user has entered a
value in the Task category field.

            Note

           You can't remove or modify the fields that are present by default (that is,
           the Title, Task Category, Open In Phase, Close By Phase, Task template,
           Task Condition, and Assignment Rule fields).

The following example adds the Assignment Group field in the requestTask table to
Task Planner.

To add a field to Task Planner, follow these steps:

   1. Click Tailoring > Process Designer > Configuration > Predefined Additional
     Task Fields.

   2. Select requestTask from the File Name drop-down list, and then click the New
     icon.

   3. If you want to configure an additional field at the file level, leave the Task
     Category Name field empty. If you want to configure an additional field that
     applies only to a specific task category, click Fill to select a task category in the
     Task Category Name field.

                   Note

                If one field is defined at both the file and category levels, the setting
                in the category level overrides the setting in the file level.

   4. Click Add Field.
   5. In the Field Name drop-down list, select the field that you want to add to Task

     Planner. For example, select Assignment Group.

   6. If you want this additional field to be mandatory, select the Mandatory option.


7. If this field has a link definition defined, select the Is Record in Table? checkbox.
  For example, a link definition exists for the Assignment Group field because the
  values of this field should be retrieved from the assignment table.

  The Record Information area appears. If only one relationship record of this field
  exists in Relationship Manager, this area is automatically populated with the
  relationship information. If multiple relationship records exist, you need to click
  the Fill icon in the Relationship Id field to select the correct relationship record.
  If no relationship records of this field exist in Relationship Manager, no
  relationship information is displayed.

  See the following table for more information.

Field                                   Description              Example value
Relationship Id
                                        This is the Id of the    5914
Table
Field                                   relationship record,

                                        which you can find in

                                        Relationship Manager

                                        by performing a

                                        search. For example,

                                        for the Affected CI

                                        (logical.name) field in

                                        cm3t, enter table name

                                        cm3t and field name

                                        logical.name, and then

                                        click Search.

                                        This is the name of the  assignment
                                        other table in the
                                        relationship record.

                                        This is the name of      name
                                        mapping field in the
                                        other table.

You can define a query by clicking Edit Query so that only values that meet the
specified conditions will be available for selection in Task Planner. For example,
you can specify this query:

( Time Zone = "US/Pacific" )


                 Caution

               If you want to add an array field (for example, Affected CI) to Task
               Planner, don't select the Is Record in Table option. Additionally, in
               Task Planner, you can't select values for the field by clicking Fill;
               instead, you can only manually enter values by using one of the
               following formats depending on the array type:

               • array character {"a","b"}
               • array number {1,2}
               • array datetime {'09/02/15 13:35:42'}
               • array boolean {true, false}

 8. Click OK. The field is now added.

                 Tip

               You can click Edit Field to edit the field or click Delete Field to delete
               the field. You can also click Add Field to add more fields.

 9. Click Save to save the record.

10. Verify that the field is added to Task Planner.
        a. Go to Request Fulfillment > Configuration > Request Models, and open
        a request model record by performing a search. For example, open the out-
        of-box Application Access request model.

        b. Go to the Task section and click Edit to open Task Planner.

        c. Select a task. For example, select the out-of-box Enable Access task. The
        field you added (Assignment Group in this example) is displayed on the
        Task-Properties tab. If you click Fill in this field, a list of values based on the
        query conditions you set is displayed.


          d. If you select a value for the field and then save the request model record,
          the task record is automatically populated with this field value when created
          later.

Related topics

Process Designer
Process Designer security model


1.6.3.5.4.2. Edit additional fields in Task
Planner

To edit an additional field in Task Planner, follow these steps:

   1. Click Tailoring > Process Designer > Configuration > Predefined Additional
     Task Fields.

   2. Select a task file type from the File Name drop-down list, and then click the
     Search icon to display the additional fields that are configured for that type of
     task file.

   3. In the table of additional fields, select the row that describes the field that you
     want to edit, and then click Edit Field.

   4. Make your desired changes, and then click OK.
   5. Click OK in the toolbar to save your changes.

            Note

           You can't remove or modify fields in Task Planner that are present by
           default. These fields are Title, Task Category, Open In Phase, Close By
           Phase, Task template, Task Condition, and Assignment Rule.


1.6.3.5.4.3. Remove additional fields from
Task Planner

To remove an additional field from Task Planner, follow these steps:

   1. Click Tailoring > Process Designer > Configuration > Predefined Additional
     Task Fields.

   2. Select a task file type from the File Name drop-down list, and then click the
     Search icon to display the additional fields that are configured for that type of
     task file.

   3. In the table of additional fields, select the row that describes the field that you
     want to remove, and then click Delete Field.

   4. Click OK in the toolbar to save your changes.

            Note

           You can't remove or modify fields in Task Planner that are present by
           default. These field are Title, Task Category, Open In Phase, Close By
           Phase, Task template, Task Condition, and Assignment Rule.


1.6.3.5.4.4. Configure the mapping
between the parent file and the task file

The different statuses through which tasks in Service Manager pass don't correspond
exactly to the different statuses that Task Planner uses to describe the progress of
tasks. In order for the Task Planner graphical interface to display the correct status for
each task, you must map the statuses of each task file type to the statuses in Task
Planner.

            Tip

           Mapping records for both Change Tasks and Request Tasks are included
           in out-of-box Service Manager systems.

For more information about the Task Planner graphical interface and a list of the task
statuses, see Task Planner.

To create a new map between the statuses of a task and the statuses displayed in
Task Planner, follow these steps:

   1. Click Tailoring > Process Designer > Configuration > Task Planner Mapping.
   2. Click New in the toolbar.
   3. In the Parent File Name drop-down list, select the type of record with which the

     task is associated. For example, select request.
   4. In the Model File Name field, select the model level for the task. For example,

     requestModel.
   5. In the Task File Name field, select the name of the task file. For example,

     requestTask.
   6. In the Task Status Field Name, select the field in the task record that contains

     the task status. For example, select Status. The left-hand Task Status column in
     the table is populated with all the values that are defined in the global list for that
     field.
   7. In the right-hand Task Planner Status column, select the Task Planner status to
     which you want to map the corresponding task status. For example, map the
     CMDB Update task status to the In Progress Task Planner status. Repeat this
     until you have mapped all task statuses to a Task Planner status.
   8. Click Save in the toolbar to save your changes.

Related topics


Process Designer
Process Designer security model


1.6.3.5.4.5. Configure the additional
properties in Task Planner

The additional properties in Task Planner enable you to share information between
task records and parent records, and also between task records. When you configure
the input and output of a planned task, the options available for selection are typically
user options or fields in the parent record. In order to make other options available,
you must configure the additional properties.

Add an additional property

To add an additional property, follow these steps:

   1. Open the record for which you want to plan a task.

     For example, click Change Management > Change Queue, and then select a
     Change record from the queue. Or, click Request Fulfillment > Search
     Requests, enter your search criteria, and then click Search.
   2. Click the Tasks tab in the record, click Edit, and then click Additional Properties
     to open the Additional Properties information page.

   3. In the toolbar, click Add Additional Properties to open the New Additional
     Property page.

   4. In the ID field, type an identifier for the additional property.

                   Note

                The identifier can't start with either a number or a punctuation mark.

   5. In the Display Label field, type the name of the field as you want it to appear in
     the Additional Properties tab of the task record.

   6. In the Type drop-down list, select the type of data that you want to share, and
     then click Next.

     Depending on the type of data that you choose, you may have to enter further
     information. For example, if you select Record, you must then specify the table
     and the field in which the record is located.


                   Note

                If you select Date/Time in the Type drop-down list, you can only
                enter a static date/time value, for example: 07/31/2019 00:00:00 .
                The value you entered will be parsed according to the Date Format
                defined in your operator record.

   7. (Optional) If the additional property requires validation, enter the validation script
     into the Validation Script field.

   8. Click Finish to save your changes.

The additional property is now available for selection when you configure input and
output values in Task Planner.

Edit an additional property

To edit an additional property, follow these steps:

   1. Open the record for which the task that contains the additional property is
     configured.

     For example, click Change Management > Change Queue, and then select a
     Change record from the queue. Or, click Request Fulfillment > Search
     Requests, enter your search criteria, and then click Search.

   2. Click the Tasks tab in the record, click Edit, and then click Additional Properties
     to open the Additional Properties information page.

   3. In the toolbar, click Edit Additional Properties to open the New Additional
     Property page.

   4. Make the required changes to the additional properties definition.
   5. Click Finish to save your changes.

Delete an additional property

To delete an additional property, follow these steps:

   1. Open the record for which the task that contains the additional property is
     configured.

     For example, click Change Management > Change Queue, and then select a
     Change record from the queue. Or, click Request Fulfillment > Search
     Requests, enter your search criteria, and then click Search.


   2. Click the Tasks tab in the record, click Edit, and then click Additional Properties
     to open the Additional Properties information page.

   3. In the toolbar, click Edit Additional Properties to open the New Additional
     Property page.

   4. Click Remove This Additional Property, and then click Yes to confirm the
     deletion.

Related topics

Process Designer
Process Designer security model
Setting the input and output data in Task Planner


1.6.3.5.4.6. Configure child task behavior
when the parent task is not created

If you have a number of interdependent tasks in Service Manager, a situation may
arise in which a parent task is not created. You can configure the behavior of the child
task in this situation.

For example, assume that you use Task Planner to add three tasks (T1, T2, and T3) to
a Request model. T2 is dependent on T1, and T3 is dependent on T2. Additionally, T2
includes a condition that evaluates to "false," so that when you create a Request by
using this Request model, T1 is created, T2 is not created, and T3 is created in the
"Waiting" state. If you then close T1 and refresh the Request, T3 is moved to the
"Active" state by default. However, you can configure Task Planner to leave T3 in the
"Waiting" state in this situation.

To configure the behavior of child tasks when the parent task is not created, follow
these steps:

   1. In System Navigator, click Tailoring > Process Designer > Configuration >
     Settings.

   2. Select the Enable Strong Task Dependency in Task Planner option if you want
     the child task to remain in the "Waiting" state.

     Clear the Enable Strong Task Dependency in Task Planner option if you want
     the child task to move to the "Active" state.

                   Note

                The Enable Strong Task Dependency in Task Planner option is not
                selected by default.

   3. Click Save.

Related topics

Process Designer
Create a workflow
Create a request model
Create a request task
````
