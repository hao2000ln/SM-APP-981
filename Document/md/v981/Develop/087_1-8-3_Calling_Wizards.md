---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.8.3 .. 1.8.4.3
printed_pages: 2295-2310
---

# 1.8.3 Calling Wizards

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.8.3. Calling Wizards

The RAD application in charge of executing wizards is called wizard.run. You can call
this application from:

     Menus
     Display Options
     Format Control
     Process Records

The sections following this one explain the steps required in calling wizards from
these areas.

Wizards themselves can call:

     Format Control records
     Processes
     Other wizards.

Wizards don't allow direct calls to RAD applications.

            Note

           Warning: It is possible to send a wizard into an infinite loop. For example,
           this would happen if you called wizard.run from a process to execute a
           wizard that in turn calls the originating process.


1.8.3.1. Call a wizard from menus

To set up a wizard to be called from menus, follow these steps:

   1. Click Tailoring > Tailoring Tools > Menus.
   2. Select a menu record.
   3. Add an option number; a group, if necessary; and a description with the name

     that you want to display on the menu.
   4. Enter wizard.run for the application.
   5. In the Parameter Name field, specify the name of the parameters to pass to the

     application. The name of the parameters to pass to the application should be
     enclosed with quotes "" and curly brackets {}. The available parameters for the
     wizard.run application are: file, name, text, and prompt.
   6. In the Parameter Value field, specify the value of the parameter being passed,
     enclosed with quotes "" and curly brackets {}. For example, {"createUser Pre"}.

Example:

In this example, a wizard is set up to be called from the SYSTEM ADMINISTRATION
menu through the option Quick Add Utility. Once the wizard is set up, the user clicks
the following:

System Administration > Ongoing Maintenance > User Quick Add Utility

When the user clicks User Quick Add Utility on the menu, a wizard opens with a
predefined set of steps that assist the user in populating information and completing
the task of adding an operator.

To see how this wizard has been set up to be called from menus, follow these steps:

   1. Click Tailoring > Tailoring Tools > Menus.
   2. Open the SYSTEM ADMINISTRATION menu record.
   3. The Description field displays User Quick Add Utility.
   4. The Application field specifies wizard.run, the RAD application called from the

     menu.
   5. The Parameter Name field specifies the name of a single parameter to pass to

     the menu item. In this example, {"name"} represents the name of the wizard. The
     name is enclosed with quotes "" and curly brackets {}.
   6. The Parameter Value field specifies the value of the parameter being passed. In
     this example, {"createUser Pre"}. The name is enclosed with quotes "" and curly
     brackets {}.



1.8.3.2. Call a wizard from display options

To set up a wizard to be called from display options, follow these steps:

   1. Click Tailoring > Tailoring Tools > Display Options.
   2. Select the display option that you want to use to call a wizard.
   3. Select the Rad tab.
   4. In the RAD Application field, enter the RAD Application wizard.run.
   5. The Names field specifies the parameters to pass to the RAD application. The

     available parameters are: file, name, text, and prompt. The name parameter is
     required.
   6. The Values field specifies the values of the parameters being passed to the RAD
     application.
   7. Click Save.
   8. Click OK.

Example: Set up a wizard to be called from display options

In this example, a wizard is set up to be called from the display application
wizard.display.kmsearch, so that when an operator selects the "Search Again"
option, the wizard "KM choose shared content" is called.

To set up a wizard to be called from display options, follow these steps:

   1. Click Tailoring > Tailoring Tools > Display Options.
   2. Select the wizard.display.kmsearch, Text Option definition 7500.
   3. Select the Rad tab.
   4. In the RAD Application field, enter the RAD Application wizard.run.
   5. The Names field specifies the parameters to pass to the RAD application. The

     available parameters are: file, name, text, and prompt. The name parameter is
     required.

   6. In this example, the following values are specified for each parameter named.

Name of parameter                       Value of the parameter
file                                    $L.file

name                                    KM choose shared content


7. Click Save.
8. Click OK.


1.8.3.3. Call a wizard from Format Control

To call a wizard from Format Control, follow these steps:

   1. Click Tailoring > Format Control.
   2. Select the Format Control where you want to call a wizard.
   3. Click Subroutines.

     The Format Control Maintenance - Subroutines form opens.
   4. In the Application field, enter the application wizard.run.
   5. In the Names field, enter the name of the parameter(s) to pass data to the

     subroutine application (name, file, text, and prompt).
   6. In the Values field, enter the parameters to pass to the subroutine application.

     The type of parameters in this field must match the type of parameters in the
     Names field.
   7. Specify the condition for each parameter. When a condition is set to "true" and a
     user clicks Save, Format Control runs every section or expression where the
     Update field is set to true before it updates the record.


1.8.3.4. Call a wizard from process
records

To set up a wizard to be called from process records, follow these steps:

   1. Click Tailoring > Document Engine > Processes.
   2. Select a process record.
   3. Select the RAD tab.
   4. In the RAD Application field, enter the RAD Application wizard.run to associate

     the wizard with this record.
   5. In the Condition field, enter the condition associated with the RAD Application

     field. For example, "true".
   6. In the Parameter Names field, enter the parameter names to pass to the RAD

     application.
   7. In the Values field, enter the parameter values to pass to the RAD application.
   8. Click Save.
   9. Click OK.

Example:

In this example, a wizard is set up to be called from the add.device Process record.
The add.device Process record is opened to evaluate the RAD call.

To set up a wizard to be called from process records, follow these steps:

   1. Click Tailoring > Document Engine > Processes.
   2. Open the add.device Process record.
   3. Select the RAD tab.
   4. In the RAD Application field, enter the RAD Application wizard.run to associate

     the wizard with this record.
   5. The Condition field contains the name of the parameters to be used (file and

     name).
   6. In the Parameter Names field, enter the parameter names to pass to the RAD

     application.

   7. The Values field specifies the values of the parameters being passed to the RAD
     application. In this example, the following values are specified for each
     parameter named.

    Name of parameter                                                                     Service Manager 9.81
    file
                                        Value of the parameter
    name                                $L.file
8. Click Save.                          "Add Device"
9. Click OK.


1.8.4. Example: Creating a Wizard that
creates a new SLA

In this example, you will create a wizard that defines a new SLA record by prompting
the user to enter the necessary data for a new SLA and then saving that data to the
database.

Out of box, a Service Manager user creates a new SLA by clicking Service Level
Management > Service Level Agreements > Create New SLA. The user then fills in
the required fields and any relevant optional fields in the Service Level Agreement
entry form.

The new wizard will guide users through supplying the necessary SLA record
information by presenting a series of wizard panels. When all the information has
been supplied by the user, the wizard process saves the SLA record to the database.


1.8.4.1. Adding Service Level Targets to
the SLA

SLAs generally have Service Level Targets (SLTs) associated with them. Service
Manager includes two out-of-box wizards for adding SLTs: Response SLT and
Availability SLT.
After creating an SLA by filling out the Service Level Agreement form, the user can
then go to the SLA record and click the Add SLT buttons in the Response and
Availability tabs to launch the out-of-box Add Response and Add Availability SLT
wizards. The Create SLA wizard will call the out-of-box Add SLT wizards so that the
user can go seamlessly from creating a new SLA to adding any SLTs related to it.


1.8.4.2. Designing the SLA wizard

It is helpful to design a new wizard by considering the overall process flow that must
occur, including both what the end user needs to do, and any background processes
that need to take place.
In this case, we will need to create a series of consecutive wizard steps or panels to
display to users to prompt them to enter the basic information needed for the new
SLA record. When the required information has been gathered, the new SLA record
must be saved by a Document Engine process to the database.
The wizard must then ask users if they want to add any availability or response SLTs.
If they do, it will call the out-of-box SLT wizards, first for availability SLTs, and then for
response SLTs.
Finally the wizard should display the record number and title of the newly-created
SLA, and then provide a button for the user to view the record details.
The overall design of the new Create SLA wizard is shown in the following flowchart.




1.8.4.3. Planning the SLA wizard panels

In addition to the high-level wizard design, it is helpful to plan the function of each of
the wizard panels.The general purpose of the wizard panels will be to prompt the user
to enter the required fields for an SLA record:

     SLA type (service or customer)
     Customer
     Title and description
     SLA effective dates

In addition, although it's not required, many users will want to copy and paste from
the Agreement documents into the SLA record , so the wizard will also present panels
to prompt the user for that information.

The names of the wizard panels will be consecutive (SLA Create 1, SLA Create 2, and
so on) so that it is clear that these individual wizard panels connect together to form
the Create SLA wizard that will be displayed to the end user.

The flowchart below shows the planned wizard panels and the function that each will
perform. Each of the boxes in the flowchart also corresponds to the steps required to
build the SLA wizard, described in the Building the SLA wizard section.

SLA Wizard Panel Names and their Associated Functions
````
