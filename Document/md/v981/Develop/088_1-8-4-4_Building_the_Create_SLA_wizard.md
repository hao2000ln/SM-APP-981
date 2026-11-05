---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.8.4.4 .. 1.8.4.4.5
printed_pages: 2310-2339
---

# 1.8.4.4 Building the Create SLA wizard

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.8.4.4. Building the Create SLA wizard

This example describes how to use the Wizard tool to design each panel of the Create
SLA wizard. Most of the panels involve prompting the user to provide information, so
they also require us to use the Forms Designer to design the form controls for the
subformat that's displayed within the wizard panel.
Each of the overview steps listed below corresponds to a box on the flowchart in the
previous section. These steps, along with the specific tasks that need to be done
using the Wizard Tool and Forms Designer, are listed below.
Step 1: Define the start node of the wizard
Step 2: Prompt the user to select SLA type
Step 3: Prompt for customer information
Step 4: Prompt for SLA title and description
Step 5: Prompt for effective dates
Step 6: Ask about agreement documents
Step 7: Prompt to add agreements
Step 8: Save new SLA and prompt for SLTs
Step 9: Call the Availability SLT wizard
Step 10: Prompt for another Availability SLT
Step 11: Call the Response SLT wizard
Step 12: Prompt for another Response SLT
Step 13: Display new SLA number and title
Step 14: Set menu to call the new SLA wizard


1.8.4.4.1. Step 1: Define the start node of
the wizard

This first task creates the first wizard panel the user sees when executing the Create
New SLA wizard. You use the Wizard Tool to define this first wizard panel.
To create a wizard to prompt for SLA type, follow these steps:

   1. Click Tailoring > Wizards. The Wizard information form opens.
   2. Select the Wizard Info tab.
   3. In the Wizard Name field, type SLA Create 1, and then click Add.

                   Caution

                If you use an existing SLA record to create a new SLA wizard panel,
                click Add rather than Save. If you click Save, you will replace the
                existing record with the new record you are attempting to add.

   4. In the Wizard Info tab, complete the following fields.


Field                                   Value
Start Node?                             Select this checkbox to set to true,
Brief Description                       as this wizard is the first in a series
                                        of wizard panels.
Window Title
Title                                   Type:
                                        This wizard will create an SLA
                                        record and guide the user through
                                        creating associated SLTs.

                                        Type:
                                        Create New SLA

                                        Type:
                                        Create New SLA

5. Select the File Selection tab and the Select $L.file by subtab to complete the
  following fields:

Field                                   Value
Create a record
                                        Select this option to indicate that the
of type                                 wizard will create a record. You must
(for Create a record)                   enter or select the record type in the
                                        record "of type" field. This becomes
                                        $L.file.

                                        Click Fill to select the type of record
                                        to be created, and select sla.

6. Select the Usage tab and complete the following fields to determine the action
  that Service Manager should take when the wizard is run:


Field                                   Value
Request user input
                                        Select this field to prompt the user
Sub Format to Display                   for information.

                                        Enter a subformat name of the
                                        format to display. Type:
                                        sla.create.type

7. Select the Next Wizard tab and complete the following fields:

Field                                   Value
Wizard Name
                                        This is the name of the next wizard
                                        in a series of wizards. Type:
                                        SLACreate 2

Condition                               The condition determines what
                                        happens next. In this case, you can
                                        enter the next wizard in sequence
                                        and an expression that evaluates to
                                        "true." Alternatively, you can specify
                                        different wizards, based on user
                                        actions or selections. Type:

                                        true

   8. When you are finished, click Save.

You have created the first wizard panel. However to improve the appearance and
behavior of the panel you will use Forms Designer to create the subformat to display
in this wizard panel.


1.8.4.4.2. Step 2: Prompt the user to
select SLA type

The purpose of this step is to refine the first wizard panel to prompt the user to select
the SLA type: Service or Customer.
Use the Forms Designer to design the subformat that's displayed in the wizard panel:

For this task, you will use Forms Designer to create the form controls that prompt the
user to select the SLA type. These form controls, together with the window title,
prompt, buttons, and other choices you made in the wizard record, will be displayed
to the end user as the screen shown above.

To create a new form for the SLA type wizard, follow these steps:

   1. Start the Forms Designer.

   2. In the Form field, type sla.create.type.

     Best Practice: Because the form name must match the subformat display entry
     exactly, you can copy the subformat display entry in the Usage tab and paste it
     into the Form field. This helps avoid spelling errors.


3. Click New.
4. Click No for Forms wizard.
5. Create the following for this form. When you start to design the new form, make

  sure the X and Y coordinates are at 0 (zero).


       Property                         Value
       Wrap Label
       Caption                          Type:
                                        Select the SLA type. The available
       Visible                          types are Service and Customer. A
       Label                            Service SLA is related to the Service
       Caption                          CI, and a Customer SLA is related to
       Visible                          the specific contract.
       Combo Box
                                        Select.
       Display List
                                        Type:
       Input                            SLA Type :
       Mandatory
                                        Select.
This PDF was generated on May 23, 2026  The Combo Box should be place to
                                        the right of the Regular label box and
                                        contains a list of choices that are
                                        associated with the label.

                                        Type two entries (each with an initial
                                        capital letter):

                                             Service
                                             Customer

                                        Type:
                                        type

                                        Select.

                                                                                                                 Page 262 of 341

Property                                Value
Select Only
Value List                              Select.

Visible                                 Type two entries (all lowercase
                                        letters):

                                             service
                                             customer

                                        Select.

   6. Click OK twice to save the new form and exit.

You have completed creating the form for the first panel of the Create New SLA
wizard.


1.8.4.4.3. Step 3: Prompt for customer
information

The purpose of this step is to create the panel prompting the user to enter customer,
service contract, and service hours.

            Note

           You can use the record you just created, SLA Create 1, as a starting point,
           and revise the fields to reflect the information below. It is very important
           to remember to click the Add button after you start to make changes so
           that you don't overwrite the SLA Create 1 record.

Perform the following two tasks to design a wizard panel that gathers customer
information.

Task 1: Create a wizard to gather customer
information

For this task, you will create the next wizard panel the users will see, prompting them
to enter customer, service contract, and service hours.
To create a wizard to gather customer information, follow these steps:

   1. Click Tailoring > Wizards. The Wizard information form opens.
   2. Select the Wizard Info tab.
   3. In the Wizard Name field, type SLA Create 2, and then click Add.

                   Caution

                If you use an existing SLA record to create a new SLA wizard panel,
                click Add rather than Save. If you click Save, you will replace the
                existing record with the new record you are attempting to add.

   4. In the Wizard Info tab, complete the following fields.


Field                                   Value
Start Node?                             Leave this option unchecked.
Brief Description
                                        Type:
Window Title                            This wizard panel prompts for the
                                        customer name, service contract,
Title                                   and service hours.

                                        Type:
                                        Create New SLA - Customer
                                        Information

                                        Type:
                                        Create New SLA - Customer
                                        Information

5. Select the File Selection tab and the Select $L.file by subtab to complete the
  following field:

Field                                   Value
$L.file passed in
                                        Select this option to indicate that the
                                        $L.file variable should be passed to
                                        the wizard from a previous wizard.

6. Select the Usage tab and complete the following fields to determine the action
  that Service Manager should take when the wizard is run.

7. Select the Actions tab and the Format Control/Process Name subtab to define
  the actions when a user clicks Next, Cancel, or Previous within the wizard.
  Complete the following field:


Field                                   Value
Perform Actions On
                                        Here you can specify which
                                        record(s) will be affected by the
                                        action that's being performed. This
                                        can either be the current file, the list
                                        selected (as a whole) or an action to
                                        be performed on every single record
                                        selected.

                                        Select Current File ($L.file).

8. Select the Next Wizard tab and complete the following fields:

Field                                   Value
Wizard Name
                                        This is the name of the next wizard
                                        in a series of wizards. Type:
                                        SLACreate 3

Condition                               The condition determines what
                                        happens next. In this case, you
                                        entered the next wizard in sequence
                                        and an expression that evaluates to
                                        "true." Alternatively, you can specify
                                        different wizards, based on user
                                        actions or selections. Type:

                                        true

   9. When you are finished, click Save.

You have created the customer information wizard panel. Next, you will create the
new wizard form in Forms Designer.

Task 2: Create a form to gather customer
information


For this task, you will use Forms Designer to create controls that prompt the user to
supply basic customer information. These form controls, together with the window
title, prompt, buttons, and other choices you made in the wizard record, will be
displayed to the end user as the screen shown below.

To create a new SLA form to gather customer information,follow these steps:

   1. Start the Forms Designer.

   2. In the Form field, type sla.create.customer.

     Best Practice: Because the form name must match the subformat display entry
     exactly, you can copy the subformat display entry in the Usage tab and paste it
     into the Form field. This will help you to avoid spelling errors.

   3. Click New.
   4. Click No for Forms wizard.

   5. Create the following for this form. When you start to design the new form, make
     sure the X and Y coordinates are at 0 (zero).


       Property                         Value
       Label
       Caption                          Type:
                                        Select the customer:
       Visible
       Comfill                          Select.
       Combo Button Visible
       Input                            Select.
       Mandatory                        customer
       Select Only                      Select.
       Third Button Visible             Select.
       Value List                       Select.

       Visible                          Type:
       Label                            $lo.colist
       Caption
                                        Select.
       Visible
       Comfill                          Type:
                                        Select the Service Contract, if
This PDF was generated on May 23, 2026  available:

                                        Select.

                                                              Page 268 of 341
Property                                                                                  Service Manager 9.81
Combo Button Visible
Fill Button Visible                     Value
Input                                   Select.
                                        Select.
Select Only                             Type:
Third Button Visible                    service.contract
Value List Condition                    Select.
                                        Select.
Visible                                 Type:
Label                                   select("contract.id","servicecontract
Caption                                 ","provider",[customer])
                                        Select.
Visible
Comfill                                 Type:
Combo Button Visible                    Select the Service Hours, if
Fill Button Visible                     available:
                                        Select.

                                        Select.
                                        Select.


Property                                Value
Input
                                        Type:
Select Only                             service.hours
Third Button Visible
Value List                              Select.
                                        Select.

                                        Type:
                                        $G.calendars

Visible                                 Select.
Display List Condition
                                        select("name","servicecontract","pro
                                        vider",[customer])

   6. Click OK twice to save the new form and exit.

You have completed creating one of the forms needed for the SLA wizard.

Contents

     1 Task 1: Create a wizard to gather customer information
     2 Task 2: Create a form to gather customer information


1.8.4.4.4. Step 4: Prompt for SLA title and
description

The purpose of this step is to create the next wizard step, prompting the user to enter
a title and description for the SLA.
Perform the following two tasks to design a wizard panel for the user to enter an SLA
title and description.

Task 1: Create a wizard for SLA description

For this task, you will create a wizard panel that prompts the user to enter a title and
description for the new SLA.
To create a wizard panel for the SLA title and description, follow these steps:

   1. Click Tailoring > Wizards. The Wizard information form opens.
   2. Select the Wizard Info tab.
   3. In the Wizard Name field, type SLA Create 3, and then click Add.

                   Caution

                If you use an existing SLA record to create a new SLA wizard panel,
                click "Add" rather than save. If you click Save, you will replace the
                existing record with the new record you are attempting to add.

   4. In the Wizard Info tab, complete the following fields.


Field                                   Value
Start Node?                             Leave this option unchecked.
Brief Description
                                        Type:
Window Title                            This wizard panel will prompt the
                                        user to enter a title and description
Title                                   for the SLA.

                                        Type:
                                        Create New SLA - Description

                                        Type:
                                        Create New SLA - Description

5. Select the File Selection tab and the Select $L.file by subtab to complete the
  following field:

Field                                   Value
$L.file passed in
                                        Select this option to indicate that the
                                        $L.file variable should be passed to
                                        the wizard from a previous wizard.

6. Select the Usage tab and complete the following fields to determine the action
  that Service Manager should take when the wizard runs.


Field                                   Value
Request user input
                                        Select this field to prompt the user
Sub Format to Display                   for information.

                                        Enter a subformat name of the
                                        format to display. Type:
                                        sla.create.description

7. Select the Actions tab to define the actions when a user clicks Next, Cancel, or
  Previous within the wizard. Complete the following field:

Field                                   Value
Perform Actions On
                                        Here you can specify which
                                        record(s) will be affected by the
                                        action that's going to be performed.
                                        This can either be the current file,
                                        the list selected (as a whole), or an
                                        action to be performed on every
                                        single record selected.

                                        Select Current File ($L.file).

8. Select the Next Wizard tab and complete the following fields:


Field                                   Value
Wizard Name
                                        This is the name of the next wizard
Condition                               in a series of wizards. Type:

                                        SLACreate 4

                                        The condition determines what
                                        happens next. In this case, you
                                        entered the next wizard in sequence
                                        and an expression that evaluates to
                                        "true." Alternatively, you can specify
                                        different wizards, based on user
                                        actions or selections. Type:

                                        true

   9. When you are finished, click Save.

You have created the new wizard panel. Next, you will create the new wizard form in
Forms Designer.

Task 2: Create a form for SLA description

For this task, you will use Forms Designer to create controls that prompt the user to
enter a title and description. These form controls, together with the window title,
prompt, buttons, and other choices you made in the wizard record, will be displayed
to the end user as the screen shown below.


To create a new form to display the SLA description wizard, follow these steps:

   1. Start the Forms Designer.

   2. In the Form field, type sla.create.description.

     Best Practice: Because the form name must match the subformat display entry
     exactly, you can copy the subformat display entry in the Usage tab and paste it
     into the Form field. This will help you to avoid spelling errors.

   3. Click New.
   4. Click No for Forms wizard.

   5. Create the following for this form. When you start to design the new form, make
     sure the X and Y coordinates are at 0 (zero).


Property                                Value
Label
Caption                                 Type:
                                        Enter a title.
Visible                                 Select.

Text                                    Type:
Input                                   title
                                        Select.
Visible
Label                                   Type:
Caption                                 Enter a detailed description.

Visible                                 Select.
Text Area
Input                                   Type:
                                        description

Visible                                 Select.

   6. Click OK twice to save the new form and exit.
You have created one of the forms needed for the SLA wizard.


Contents

     1 Task 1: Create a wizard for SLA description
     2 Task 2: Create a form for SLA description


1.8.4.4.5. Step 5: Prompt for effective
dates

The purpose of this step is to create the next wizard step, prompting the user to enter
the starting and ending dates the SLA.
Perform the following two tasks to design a wizard panel for the user to indicate the
effective dates of the SLA:

Task 1: Create a wizard for SLA effective dates

For this task, you will create a wizard that prompts the user to enter valid start and
end dates.
To create a wizard for valid start and end dates, follow these steps:

   1. Click Tailoring > Wizards. The Wizard information form opens.
   2. Select the Wizard Info tab.
   3. In the Wizard Name field, type SLA Create 4, and then click Add.

                   Caution

                If you use an existing SLA record to create a new SLA wizard panel,
                click Add rather than Save. If you click Save, you will replace the
                existing record with the new record you are attempting to add.

   4. In the Wizard Info tab, complete the following fields.


Field                                   Value
Start Node?                             Leave this option unchecked.
Brief Description
                                        Type:
Window Title                            This wizard panel will prompt the
                                        user to enter the beginning and
Title                                   ending dates of the SLA.

                                        Type:
                                        Create New SLA - Effective Dates

                                        Type:
                                        Create New SLA - Effective Dates

5. Select the File Selection tab and the Select $L.file by subtab to complete the
  following fields:

Field                                   Value
$L.file passed in
                                        Select this option to indicate that the
                                        $L.file variable should be passed to
                                        the wizard from a previous wizard.

6. Select the Usage tab and complete the following fields to determine the action
  that Service Manager should take when the wizard is run:


Field                                   Value
Request user input
                                        Select this field to prompt the user
Sub Format to Display                   for information.

                                        Enter a subformat name of the
                                        format to display. Type:
                                        sla.create.validfromto

7. Select the Actions tab and the Format Control/Process Name subtab to define
  the actions when a user clicks Next, Cancel, or Previous within the wizard.
  Complete the following field:

Field                                   Value
Perform Actions On
                                        Here you can specify which
                                        record(s) will be affected by the
                                        action that's going to be performed.
                                        This can either be the current file,
                                        the list selected (as a whole), or an
                                        action to be performed on every
                                        single record selected.

                                        Select Current File ($L.file).

8. Select the Next Wizard tab and complete the following fields:


Field                                   Value
Wizard Name
                                        This is the name of the next wizard
Condition                               in a series of wizards. Type:

                                        SLACreate 5

                                        The condition determines what
                                        happens next. In this case, you
                                        entered the next wizard in sequence
                                        and an expression that evaluates to
                                        "true." Alternatively, you can specify
                                        different wizards, based on user
                                        actions or selections. Type:

                                        true

   9. When you are finished, click Save.

You have created the valid From and To dates wizard panel. Next, you will create the
new wizard form in Forms Designer.

Task 2: Create a form for SLA effective dates

For this task, you will use Forms Designer to create the form controls that prompt the
user to indicate the effective dates of the SLA. These form controls, together with the
window title, prompt, buttons, and other choices you made in the wizard record, will
be displayed to the end user as the screen shown below.


To create a new form for the SLA effective dates wizard, follow these steps:

   1. Start the Forms Designer.

   2. In the Form field, type sla.create.validfromto.

     Best Practice: Because the form name must match the subformat display entry
     exactly, you can copy the subformat display entry in the Usage tab and paste it
     into the Form field. This will help you to avoid spelling errors.

   3. Click New.
   4. Click No for Forms wizard.

   5. Create the following for this form. When you start to design the new form, make
     sure the X and Y coordinates are at 0 (zero).


       Property                         Value
       Label
       Caption                          Type:
                                        SLA will be in effect from:
       Visible
       Comfill                          Select.
       Fill Button Visible
       Input                            Select.
       Mandatory                        start
       Visible                          Select.
       Label                            Select.
       Caption
                                        Type:
       Visible                          SLA will expire on:
       Comfill                          Select.
       Fill Button Visible
       Input                            Select.
                                        Type:
This PDF was generated on May 23, 2026  expiration

                                                                                                                 Page 283 of 341

Property                                Value
Mandatory                               Select.
Visible                                 Select.

   6. Click OK twice to save the new form and exit.

You have finished creating one of the forms needed for the SLA wizard.

Contents

     1 Task 1: Create a wizard for SLA effective dates
     2 Task 2: Create a form for SLA effective dates
````
