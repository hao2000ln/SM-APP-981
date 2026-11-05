---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.7.2 .. 1.7.4
printed_pages: 2129-2161
---

# 1.7.2 Best practices for configuring task planner

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.2. Best practices for configuring task
planner

Task Planner enables you to schedule tasks in Service Manager modules such as
Change Management or Request Management. This section provides information
about the best practices for using the Task Planner. For example, you can configure
shared information across multiple tasks, or you can use record context to drive
workflows.

Configure shared information across tasks

You can use Task Planner to configure information shared by multiple tasks.

The following three types of information from a record can be shared by the tasks of
a record:

     Record fields, for example, the request fields or the change fields
     User selections, which are input by the end user when they use Service
     Manager
     Record context, which are additional properties defined in Task Planner. The
     values of these properties are populated during task implementation and then
     shared across the tasks of a record.

The following diagram demonstrates how these three types of information of a
Request are shared among its tasks.

Each task can have its own input and output data. The input fields are used to receive
data from other tasks, and can trigger the execution of the current task. The output


fields are used to populate shared data to the record during task execution, and the
data can then be shared by other tasks.
You can launch the Record Context (Ticket Context or Additional Properties) definition
page from the Task Planner. The page is shown as follows:

On the definition page of the Task Planner, you can configure the input and output
fields. The Record Context fields of a record can be used as the input or output fields
of a task, and the output fields can be used in subsequent tasks as the input fields.

The following Task Context page shows the run-time result of a task, which contains
the input and output fields/values. The input fields are read-only, while the output
fields can be edited with appropriate values that can be populated to the next task
later.


Use record context fields in Condition Editor

The Condition Editor does not support using the value of a record context field
directly as part of the condition, so you have to manually retrieve the value and put it
into a Service Manager variable, and then you can use this variable in Condition
Editor.
For example, if you want to use the record context field “employeeType” as part of the
condition in the Request workflow, you need to execute the following JavaScript code
before your condition is evaluated:

  vars[“$ticketcontext.cnd1”] =
  lib.c.$("#taskPlannerService").getTicketContextFieldValue("reque
  st", record.number, "employeeType");

Or you can use the JavaScript below in the Request Task workflow:

  vars[“$ticketcontext.cnd1”] =
  lib.c.$("#taskPlannerService").getTicketContextFieldValue("reque
  st", record.parent_request, "employeeType");

Finally, you can configure the condition to something in the Condition Editor as shown
below:


Use predefined additional task fields

When you plan a task in Task Planner, you might want to use fields that are not
available in the out-of-box configuration. In this case, you can define new fields for
Task Planner at the object level or category level.
For example, in the following screenshot you can see that a field is defined at the
object level – if you do not specify any value for the Task Category Name field, the
field is defined at the object level, which applies to all category tasks.

And as shown in the following screenshot, if you specify a value for the Task
Category Name field, the field is defined at the category level, which applies only to
this task category.


At run time, the predefined fields at both the object level and the category level are
merged together and displayed in Task Planner. If a field is defined at both levels, the
definition at the category level is used.

After being defined, the predefined additional task fields are displayed at the bottom
of the Task-Properties tab. Your entered data is inserted into the task that is created
in Task Planner.

Plan appropriate number of tasks in a same open
phase

When you define a task plan, you can specify the “Open in Phase” field of a task,
which means this task is created at run time when the workflow of the record moves
to the phase. Currently all the tasks you plan with the same “Open in Phase” value are
created immediately when the record moves to the corresponding phase.

Too many tasks for a phase may result in decreased performance. For example, if you
plan more than 10 tasks, the operator might feel obvious performance downgrade
when the record is moved to that phase. To ensure the best performance, it is
recommended that no more than 10 tasks are automatically started once a phase is
entered.


Note

Note: The performance of generating tasks in Task Planner is not only
affected by the number of planned tasks, but also by the business logic
you plan for task creation. The more complex and time-consuming the
logic is, the more performance downgrade you might encounter.


1.7.3. Best practices for using the
condition editor

The Condition Editor enables you to build a condition without any knowledge of
programming languages. Conditions always evaluate to True or False. When a
condition evaluates to True, the system runs the rule or applies an action that the
condition controls. This section provides information about the best practices of using
the Condition Editor.

Use cross-table fields in Condition Editor

Cross-table fields, which are defined by a reference record, are the fields of related
tables. The table relationship is maintained by the Relation Manager in Service
Manager. You can use cross-table fields in Condition Editor to configure various
conditions.

To configure the cross-table fields as part of a condition, you can select the cross-
table field names in Condition Editor. However, using cross-table fields might be time-
consuming because the system needs to prepare the variable of the reference record
at run time. For example, an incident record has the field “Contact”, which refers to
the Contact record. You can configure the Rule condition to use the Location of the
Contact record directly, as shown below:

At run time, the expression is evaluated to something as follows:  Page 81 of 341
location in $L.file.contact.name.contacts.contact.name="Asia"

This PDF was generated on May 23, 2026

The variable $L.file.contact.name.contacts.contact.name is prepared by the rule
engine.

If you use the Condition in your own scenario, be sure to invoke the JavaScript
method below at run time before evaluating the condition expression, which
automatically prepares the cross-table reference record for you:

lib.Workflow.initVarForCondition(conditionXml);

Use user option fields in Condition Editor

You can configure the User Option fields as part of a condition by specifying the
names and values of the user option fields in Condition Editor.

However, using the user option fields might be time-consuming because the system
needs to prepare variables for the user option fields at run time. For example, you
configure to use the User Option as part of a task condition in Task Planner as
follows:

At run time, the expression is evaluated to something as follows:

$L.UO.EmployeeType="Regular"

The variable $L.UO.EmployeeType is prepared by the system.

If you use the condition in your own scenario, make sure that you invoke the
JavaScript method below at run time before evaluating the condition expression,
which automatically prepares the user option variable for you:

lib.Workflow.initVarForCondition(conditionXml);


            Note

           Note: The instance data of a user option is stored as a string value in the
           file userOption, and thus at run time, when the user option value is
           evaluated, it is also treated as a string value.

Contents

     1 Use cross-table fields in Condition Editor
     2 Use user option fields in Condition Editor


1.7.4. Consider rule set execution
sequence

A rule set contains a list of rules that you may run against a record. Rules implement
business logic to drive a workflow or a process. In Service Manager, you can define
rule sets at the object level, workflow level, or phase level. The rule sets defined at
different levels are executed in order. For example, rule sets defined at the object level
are executed first. The following diagram illustrates this execution order (from top to
bottom):

For each action in Service Manager, such as creating a record, rule sets defined at
different levels might be executed. The following table provides a high level view of
the execution order of these rule sets:


Action                                  Execution order of the rule sets (from
Create a record                         left to right)

Update a record                         On add, On enter, Format control (add),
                                        After successful add, After successful
Search and access a record              enter, Format control (subroutine after
Fill, find, screen-redraw               add), Initialization, Format control
                                        (initial), On display, Format Control
                                        (display)

                                        On update, Format control (update),
                                        After successful update, Format control
                                        (subroutine after update), Initialization,
                                        Format control (initial), On display,
                                        Format control (display)

                                        Initialization, Format control (initial), On
                                        display, Format control (display)

                                        On display, Format control (display)

Move from one phase to another          On exit (global + old phase), Transition,
Close record (inactive)                 On enter (global + new phase), Format
                                        control (update), Format control
                                        (subroutine after update), Initialization,
                                        Format control (initial), On display,
                                        Format control (display)

                                                    Note

                                                   Note: The term "global"
                                                   means rule sets defined at
                                                   the object level or the
                                                   workflow level.

When you define your own rule sets in Service Manager, you might need to consider
the execution order of the rule sets, so that you can optimize the definition of your
own rule sets accordingly.


The following tables provides a more detailed view of the execution order of the rule
sets that are executed for each action. The events and their corresponding rule sets
are executed from top to bottom.

Open an existing record

Events                                  Rule sets
Initialization
                                             Initialization rule sets at the object
                                             level
                                             Initialization rule sets at the
                                             workflow level
                                             Initialization rule sets at the phase
                                             level
                                             Primary format control
                                             initialization
                                             Format control initialization for the
                                             form of the phase

Display                                 On-display rule sets at the object
                                        level
                                        On-display rule sets at the
                                        workflow level
                                        On-display rule sets at the phase
                                        level
                                        Primary format control display
                                        Format control display for the
                                        form of the phase

Create a new record (launched from
document.new)


Events                                  Rule sets
Initialization
                                             Initialization rule sets at the object
                                             level
                                             Initialization rule sets at the
                                             workflow level
                                             Initialization rule sets at the phase
                                             level
                                             Primary format control
                                             initialization
                                             Format control initialization for the
                                             form of the phase

Display                                 On-display rule sets at the object
                                        level
                                        On-display rule sets at the
                                        workflow level
                                        On-display rule sets at the phase
                                        level
                                        Primary format control display
                                        Format control display for the
                                        form of the phase

Add a record and stay in the logging phase

Events                                                                                          Service Manager 9.81
On-add
                                        Rule sets
Add the record to the database
Note: This is a user action, not an          On-add rule sets at the object
event.                                       level
After-add                                    On-add rule sets at the workflow
                                             level
                                             On-enter rule sets at the object
                                             level
                                             On-enter rule sets at the workflow
                                             level
                                             On-enter rule sets at the phase
                                             level
                                             Primary format control on-add
                                             Format control on-add for the
                                             form of the phase

                                        N/A

                                             After-successful-add rule sets at
                                             the object level
                                             After-successful-add rule sets at
                                             the workflow level
                                             After-successful-enter rule sets at
                                             the object level
                                             After-successful-enter rule sets at
                                             the workflow level
                                             After-successful-enter rule sets at
                                             the phase level
                                             Primary format control subroutine
                                             after-add
                                             Format control subroutine after-
                                             add for the form of the phase


Events                                  Rule sets
Initialization
                                             Initialization rule sets at the object
                                             level
                                             Initialization rule sets at the
                                             workflow level
                                             Initialization rule sets at the phase
                                             level
                                             Primary format control
                                             initialization
                                             Format control initialization for the
                                             form of the phase

Display                                 On-display rule sets at the object
                                        level
                                        On-display rule sets at the
                                        workflow level
                                        On-display rule sets at the phase
                                        level
                                        Primary format control display
                                        Format control display for the
                                        form of the phase

Add a record and automatically move to next phase

Events                                                                                          Service Manager 9.81
Old phase on-add
                                        Rule sets

                                             On-add rule sets at the object
                                             level
                                             On-add rule sets at the workflow
                                             level
                                             On-enter rule sets at the object
                                             level
                                             On-enter rule sets at the workflow
                                             level
                                             On-enter rule sets at the phase
                                             level
                                             Primary format control on-add
                                             Format control on-add for the
                                             form of the phase

Events                                                                                          Service Manager 9.81
To phase on-enter
                                        Rule sets

                                             On-exit rule sets at the object
                                             level
                                             On-exit rule sets at the workflow
                                             level
                                             On-exit rule sets in the "from
                                             phase"
                                             Transition rule sets
                                             On-enter rule sets at the object
                                             level
                                             On-enter rule sets at the workflow
                                             level
                                             On-enter rule sets in the "to
                                             phase"

                                                    Note

                                                   In this event, if you need to
                                                   use the current phase of
                                                   the record in the rule sets
                                                   or format control, the value
                                                   of the current.phase field in
                                                   the "current record" is the
                                                   name of the "to phase,"
                                                   and the value of the
                                                   current.phase field in the
                                                   "saved record" is the name
                                                   of the "from phase."

Add the record to the database Note: N/A
This is a user action, not an event.

Events                                                                                          Service Manager 9.81
From phase after-add
                                        Rule sets
To phase post
                                             After-successful-add rule sets at
                                             the object level
                                             After-successful-add rule sets at
                                             the workflow level
                                             After-successful-enter rule sets at
                                             the object level
                                             After-successful-enter rule sets at
                                             the workflow level
                                             After-successful-enter rule sets at
                                             the phase level
                                             Primary format control subroutine
                                             after-add
                                             Phase form’s format control
                                             subroutine after-add

                                             After-successful-enter rule sets at
                                             the object level
                                             After-successful-enter rule sets at
                                             the workflow level
                                             After-successful-enter rule sets at
                                             the phase level
                                             Primary format control subroutine
                                             after- add
                                             Phase form’s format control
                                             subroutine after-add


Events                                  Rule sets
To phase initialization
                                             Initialization rule sets at the object
                                             level
                                             Initialization rule sets at the
                                             workflow level
                                             Initialization rule sets at the phase
                                             level
                                             Primary format control
                                             initialization
                                             Format control initialization to the
                                             form of the phase

To phase display                        On-display rule sets at the object
                                        level
                                        On-display rule sets at the
                                        workflow level
                                        On-display rule sets at the phase
                                        level
                                        Primary format control display
                                        Format control display to the form
                                        of the phase

Save a record and stay in current phase

Events                                                                                          Service Manager 9.81
On-update
                                        Rule sets
Save the record to the database
Note: This is a user action, not an          On-update rule sets at the object
event.                                       level
After-update                                 On-update rule sets at the
                                             workflow level
                                             On-update rule sets at the phase
                                             level
                                             Primary format control on-update
                                             Format control on-update for the
                                             form of the phase

                                        N/A

                                             After-successful-update rule sets
                                             at the object level
                                             After-successful- update rule sets
                                             at the workflow level
                                             After-successful-update rule sets
                                             at the phase level
                                             Primary format control subroutine
                                             on-update
                                             Format control subroutine on-
                                             update for the form of the phase


Events                                  Rule sets
Initialization
                                             Initialization rule sets at the object
                                             level
                                             Initialization rule sets at the
                                             workflow level
                                             Initialization rule sets at the phase
                                             level
                                             Primary format control
                                             initialization
                                             Format control initialization for the
                                             form of the phase

Display                                 On-display rule sets at the object
                                        level
                                        On-display rule sets at the
                                        workflow level
                                        On-display rule sets at the phase
                                        level
                                        Primary format control display
                                        Format control display for the
                                        form of the phase

Save a record and automatically move to the next
phase

Events                                                                                          Service Manager 9.81
From phase on-update
                                        Rule sets

                                             On-update rule sets at the object
                                             level
                                             On-update rule sets at the
                                             workflow level
                                             On-update rule sets at the phase
                                             level
                                             Primary format control on-update
                                             Format control on-update for the
                                             form of the phase

Events                                                                                          Service Manager 9.81
To phase on-enter
                                        Rule sets

                                             On-exit rule sets at the object
                                             level
                                             On-exit rule sets at the workflow
                                             level
                                             On-exit rule sets in the "from
                                             phase"
                                             Transition rule sets
                                             On-enter rule sets at the object
                                             level
                                             On-enter rule sets at the workflow
                                             level
                                             On-enter rule sets in the "to
                                             phase"

                                                    Note

                                                   In this event, if you need to
                                                   use the current phase of
                                                   the record in the rule sets
                                                   or format control, the value
                                                   of the current.phase field in
                                                   the "current record" is the
                                                   name of the"to phase", and
                                                   the value of the
                                                   current.phase field in the
                                                   "saved record" is the name
                                                   of the "from phase".

Update the record to the database       N/A

Note: This is a user action, not an
event.

 Events                                                                                         Service Manager 9.81
 From phase after-update
 To phase post                          Rule sets
 To phase initialization
                                             After-successful-update rule sets
This PDF was generated on May 23, 2026       at the object level
                                             After-successful-update rule sets
                                             at the workflow level
                                             After-successful-update rule sets
                                             at the phase level
                                             Primary format control subroutine
                                             after-update
                                             Format control subroutine after-
                                             update for the form of the phase

                                             After-successful-enter rule sets at
                                             the object level
                                             After-successful-enter rule sets at
                                             the workflow level
                                             After-successful-enter rule sets in
                                             the "to phase"
                                             Primary format control subroutine
                                             after-update
                                             Format control subroutine after-
                                             update from the form of the phase

                                             Initialization rule sets at the object
                                             level
                                             Initialization rule sets at the
                                             workflow level
                                             Initialization rule sets at the phase
                                             level
                                             Primary format control
                                             initialization
                                             Format control initialization to the
                                             form of the phase

                                                                                                                          Page 98 of 341

Events                                  Rule sets
To phase display
                                             On-display rule sets at the object
                                             level
                                             On-display rule sets at the
                                             workflow level
                                             On-display rule sets at the phase
                                             level
                                             Primary format control display
                                             Format control display to the form
                                             of the phase

Manual transition without selecting “Save record
prior to executing the transition”

Events                                                                                          Service Manager 9.81
To phase on-enter
                                        Rule sets
Save the record to the database
Note: This is a user action, not an          On-exit rule sets at the object
event.                                       level
                                             On-exit rule sets at the workflow
                                             level
                                             On-exit rule sets in the "from
                                             phase"
                                             Transition rule sets
                                             On-enter rule sets at the object
                                             level
                                             On-enter rule sets at the workflow
                                             level
                                             On-enter rule sets in the "to
                                             phase"
                                             Primary format control On-update
                                             Format control on-update from
                                             the form of the phase

                                                    Note

                                                   In this event, if you need to
                                                   use the current phase of
                                                   the record in the rule sets
                                                   or format control, the value
                                                   of the current.phase field in
                                                   the "current record" is the
                                                   name of the"to phase", and
                                                   the value of the
                                                   current.phase field in the
                                                   "saved record" is the name
                                                   of the "from phase".

                                        N/A


Events                                  Rule sets
To phase after-enter
                                             After-successful-enter rule sets at
                                             the object level
                                             After-successful-enter rule sets at
                                             the workflow level
                                             After-successful-enter rule sets in
                                             the "to phase"
                                             Primary format control subroutine
                                             after-update
                                             Format control subroutine after-
                                             update from the form of the phase

Manual transition with “Save record prior executing
the transition” selected

Events                                                                                          Service Manager 9.81
From phase on-update
                                        Rule sets
Save the record to the database
Note: This is a user action, not an          On-update rule sets at the object
event.                                       level
From phase after-update                      Workflow level on-update rule
                                             sets
                                             On-update rule sets in the "from
                                             phase"
                                             Primary format control On-update
                                             Format control on-update from
                                             the form of the phase

                                        N/A

                                             After-successful-update rule sets
                                             at the object level
                                             After-successful-update rule sets
                                             at the workflow level
                                             After-successful-update rule sets
                                             in the "from phase"
                                             Primary format control subroutine
                                             after-update
                                             Format control subroutine after-
                                             update from the form of the phase

Events                                                                                          Service Manager 9.81
To phase on-enter
                                        Rule sets
Save the record to the database
Note: This is a user action, not an          On-exit rule sets at the object
event.                                       level
                                             On-exit rule sets at the workflow
                                             level
                                             On-exit rule sets in the "from
                                             phase"
                                             Transition rule sets
                                             On-enter rule sets at the object
                                             level
                                             On-enter rule sets at the workflow
                                             level
                                             On-enter rule sets in the "to
                                             phase"
                                             Primary format control on-update
                                             Format control on-update from
                                             the form of the phase

                                                    Note

                                                   In this event, if you need to
                                                   use the current phase of
                                                   the record in the rule sets
                                                   or format control, the value
                                                   of the current.phase field in
                                                   the "current record" is the
                                                   name of the"to phase", and
                                                   the value of the
                                                   current.phase field in the
                                                   "saved record" is the name
                                                   of the "from phase".

                                        N/A

 Events                                                                                         Service Manager 9.81
 To phase after-enter
                                        Rule sets
Back end transition
                                             After-successful-enter rule sets at
                                             the object level
                                             After-successful-enter rule sets at
                                             the workflow level
                                             After-successful-enter rule sets in
                                             the "to phase"
                                             Primary format control subroutine
                                             after-update
                                             Format control subroutine after-
                                             update from the form of the phase

Events                                                                                          Service Manager 9.81
From phase initialization
                                        Rule sets
To phase on-enter
                                             Initialization rule sets at the object
Save the record to the database              level
Note: This is a user action, not an          Initialization rule sets at the
event.                                       workflow level
                                             Initialization rule sets in the "from
                                             phase"
                                             Primary format control
                                             initialization
                                             Format control initialization from
                                             the form of the phase

                                             On-exit rule sets at the object
                                             level
                                             On-exit rule sets at the workflow
                                             level
                                             On-exit rule sets in the "from
                                             phase"
                                             Transition rule sets
                                             On-enter rule sets at the object
                                             level
                                             On-enter rule sets at the workflow
                                             level
                                             On-enter rule sets in the "to
                                             phase"
                                             Primary format control On-update
                                             Format control on-update from
                                             the form of the phase

                                        N/A

Events                                                                                          Service Manager 9.81
To phase after-enter
                                        Rule sets

                                             After-successful-enter rule sets at
                                             the object level
                                             After-successful-enter rule sets at
                                             the workflow level
                                             After-successful-enter rule sets in
                                             the "to phase"
                                             Primary format control subroutine
                                             after-update
                                             Format control subroutine after-
                                             update from the form of the phase
````
