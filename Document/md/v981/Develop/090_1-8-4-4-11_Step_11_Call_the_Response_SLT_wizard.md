---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.8.4.4.11 .. 1.8.4.4.14
printed_pages: 2373-2393
---

# 1.8.4.4.11 Step 11: Call the Response SLT wizard

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.8.4.4.11. Step 11: Call the Response SLT
wizard

The next step is to create a wizard panel to call the existing out-of-box Response
Wizard for those users who answered that they did want to add a Response SLT.
Because this wizard panel only performs the background task of calling another
wizard, there is no screen to show the end user. Thus there is no task requiring the
use of Forms Designer in this step.

Task: Create a wizard to call a Response SLT

For this task, you will create a wizard that will call the existing out-of-box Response
SLT wizard.
To create a wizard to call the existing out-of-box Response SLT wizard, follow these
steps:

   1. Click Tailoring > Wizards. The Wizard information form opens.
   2. Select the Wizard Info tab.
   3. In the Wizard Name field, type SLA Create Response 1, and then click Add.

                   Caution

                If you use an existing SLA record to create a new SLA wizard panel,
                click Add rather than Save. If you click Save, you will replace the
                existing record with the new record you are attempting to add.

   4. In the Wizard Info tab, complete the following fields.


Field                                   Value
Start Node?                             Leave this option unchecked.
Brief Description
                                        Type:
Window Title                            This wizard will call the out-of-box
                                        wizard that creates a Response SLT.
Title
                                        Type:
                                        Create Response SLT

                                        Type:
                                        Create Response SLT

5. Select the File Selection tab and the Select $L.file by subtab to complete the
  following field:

Field                                   Value
$L.file passed in                       checked

6. Select the Usage tab and complete the following fields to determine the action
  that Service Manager should take when the wizard is run:

Field                                   Value
Skip Display
                                        Select this option as this panel
                                        doesn't include a form that needs to
                                        be displayed to the user.

7. Select the Actions tab to define the actions when a user clicks Next, Cancel, or
  Previous within the wizard. Complete the following field:


Field                                   Value
Perform Actions On
                                        Here you can specify which
Format Control/Process Name             record(s) will be affected by the
subtab                                  action that you are going to perform.
Process Name                            This can either be the current file,
                                        the list selected (as a whole), or an
                                        action to be performed on every
                                        single record selected.

                                        Select Current File ($L.file).

                                        Define the actions when a user
                                        clicks Next, Cancel, or Previous
                                        within the wizard. Complete the
                                        following field:

                                        To specify that this wizard can run a
                                        process after completing, type:

                                        slo.add.resp.sla

8. Select the Next Wizard tab and complete the following fields:


Field                                   Value
Wizard Name
                                        This is the name of the next wizard
Condition                               in a series of wizards. Type:

                                        SLA Create Response 2

                                        The condition determines what
                                        happens next. In this case, you
                                        entered the next wizard in sequence
                                        and an expression that evaluates to
                                        "true." Alternatively, you can specify
                                        different wizazrds, based on user
                                        actions or selections. Type:

                                        true

   9. When you are finished, click Save.

You have created the wizard that will call the existing out-of-box Response SLT
wizard. A new form is not needed for this wizard.


1.8.4.4.12. Step 12: Prompt for another
Response SLT

The next step is to ask the user if they want to add another response SLT. If they do,
this panel must call the out-of-box Reponse SLT wizard again. If they don't want to
add any more response SLTs, they should be shown the final wizard screen.
Perform the following two tasks to design a wizard panel to prompt for another
Response SLT.

Task 1: Create a wizard for more Response SLTs

For this task, you will create a wizard so that users can create more Response SLTs.
To create a wizard so that users can create more Response SLTs, follow these steps:

   1. Click Tailoring > Wizards. The Wizard information form opens.
   2. Select the Wizard Info tab.
   3. In the Wizard Name field, type SLA Create Response 2, and then click Add.

                   Caution

                If you use an existing SLA record to create a new SLA wizard panel,
                click Add rather than Save. If you click Save, you will replace the
                existing record with the new record you are attempting to add.

   4. In the Wizard Info tab, complete the following fields.


Field                                   Value
Start Node?                             Leave this option unchecked.
Brief Description
                                        Type:
Window Title                            This wizard panel will ask the user if
                                        they want to add another Response
Title                                   SLT.

                                        Type:
                                        Create another Response SLT

                                        Type:
                                        Create another Response SLT

5. Select the File Selection tab and the Select $L.file by subtab to complete the
  following field:

Field                                   Value
Initial Expression:
No $L.file (use typecheck)              $L.create.response.slo=false

                                        Select this option to initialize a
                                        typecheck file, which acts as a
                                        holding file.

6. Select the Usage tab and complete the following fields to determine the action
  that Service Manager should take when the wizard is run:


Field                                   Value
Sub Format to Display
                                        Enter a subformat name of the
                                        format to display. Type:
                                        sla.create.ask.other.response

Request User Input                      checked.
Turn Off Previous Button Only           checked

7. Select the Actions tab to define the actions when a user clicks Next, Cancel, or
  Previous within the wizard. Complete the following field:

Field                                   Value
Perform Actions On
                                        Here you can specify which
                                        record(s) will be affected by the
                                        action that you are going to perform.
                                        This can either be the current file,
                                        the list selected (as a whole), or an
                                        action to be performed on every
                                        single record selected.

                                        Select Current File ($L.file).

Wizard Variables                        $L.create.response.slo
                                        $L.crate.avail.slo

8. Select the Next Wizard tab and complete the following fields:

    Field                                                                                 Service Manager 9.81
    Wizard Name
    Condition                           Value

    Wizard Name                         This is the name of the next wizard
    Condition                           in a series of wizards. Type:
    Wizard Name                         SLA Create Response 1
    Condition
9. When you are finished, click Save.   The condition determines what
                                        happens next. In this case, you
                                        entered the next wizard in sequence
                                        and an expression that evaluates to
                                        "true." Alternatively, you can specify
                                        different wizazrds, based on user
                                        actions or selections. Type:
                                        $L.create.response.slo=true

                                        This is the name of the next wizard
                                        in a series of wizards. Type:
                                        SLA Create Availability 1

                                        Type:
                                        $L.create.avail.slo=true

                                        This is the name of the next wizard
                                        in a series of wizards. Type:
                                        SLA Create 8

                                        Type:
                                        true


You have created the wizard so that users can create more Response SLTs. Next, you
will create the new wizard form in Forms Designer.

Task 2: Create a form for more Response SLTs

For this task, you will use Forms Designer to create form controls that ask users if
they want to create an additional Service Level Target record.

To create a new form for a wizard that creates more Response SLTs, follow these
steps:

   1. Start the Forms Designer.

   2. In the Form field, type sla.create.ask.other.response.

     Best Practice: Because the form name must match the subformat display entry
     exactly, you can copy the subformat display entry in the Usage tab and paste it
     into the Form field. This will help you to avoid spelling errors.

   3. Click New.
   4. Click No for Forms wizard.

   5. Create the following for this form. When you start to design the new form, make
     sure the X and Y coordinates are at 0 (zero).


       Property                         Value
       Group
       Caption                          Type:
                                        Would you like to create another
       Visible                          Response SLT?
       Radio Button
       Caption                          Select.
       Input
       Value                            Type:
       Visible                          Yes
       Radio Button
       Caption                          Type:
                                        $L.create.response.slo
This PDF was generated on May 23, 2026
                                        Type:
                                        true
                                        Select.

                                        Type:
                                        No

                                                                Page 328 of 341

Property                                Value
Input
                                        Type:
Value                                   $L.create.response.slo

                                        Type:
                                        false

Visible                                 Select.

   6. Click OK twice to save the new form and exit.

You have created one of the forms needed for the SLA wizard.

Contents

     1 Task 1: Create a wizard for more Response SLTs
     2 Task 2: Create a form for more Response SLTs


1.8.4.4.13. Step 13: Display new SLA
number and title

In this final wizard step, the panel will display the record number and title of the newly
created SLA, and have the record details displayed when the user clicks the Finish
button.
Complete the following tasks to perform this step.

Task 1: Create a wizard for the completed SLA

For this task, you will create a wizard panel that displays the SLA record number and
title of the newly-created SLA record to the user.
To create a wizard for the completed SLA, follow these steps:

   1. Click Tailoring > Wizards. The Wizard information form opens.
   2. Select the Wizard Info tab.
   3. In the Wizard Name field, type SLA Create 8, and then click Add.

                   Caution

                If you use an existing SLA record to create a new SLA wizard panel,
                click Add rather than Save. If you click Save, you will replace the
                existing record with the new record you are attempting to add.

   4. In the Wizard Info tab, complete the following fields.


Field                                   Value
Start Node?                             Leave this option unchecked.
Brief Description
                                        Type:
Window Title                            This wizard is the final panel the
Title                                   user sees, telling them the record
                                        number and name of the new SLA
                                        created.

                                        Type:
                                        Create new SLA - Done

                                        Type:
                                        Create new SLA - Done

5. Select the File Selection tab to complete the following fields:


Field                                   Value
Initial Expressions subtab              Type:
Select $L.file by subtab
Select records "of type"                Select this option and click Fill to
using query                             select sla as the record type.

                                        Type:

                                        "agreement.id="+$L.new.sla

                                                    Note

                                                   Be sure to include the
                                                   double quotes (") at
                                                   each end of
                                                   "agreement.id" as these
                                                   quotes are part of the
                                                   query.

6. Select the Usage tab and complete the following fields to determine the action
  that Service Manager should take when the wizard is run:


Field                                   Value
Request user input
                                        Select this field to prompt the user
Sub Format to Display                   for information.

                                        Enter a subformat name of the
                                        format to display. Type:
                                        sla.create.finished

Activate "Finish" option?               Since this is the final wizard in a
                                        series of wizard panels, select this
                                        option to make a "Finish" button
                                        appear on this wizard panel.

Turn off Next and Previous buttons ? Select this checkbox.

7. Select the Actions tab to define the actions when a user clicks Next, Cancel, or
  Previous within the wizard. Complete the following field:

Field                                   Value
Perform Actions On
                                        Here you can specify which
                                        record(s) will be affected by the
                                        action that you are going to perform.
                                        This can either be the current file,
                                        the list selected (as a whole), or an
                                        action to be performed on every
                                        single record selected.

                                        Select Current File ($L.file).

    Display Record(s) when complete?    Select this option (to set to true) to
8. When you are finished, click Save.   display the record to the user when
                                        the wizard completes.


You have created the last wizard panel that displays the SLA record number and title
of the newly-created SLA record. Next, you will create format for this wizard step in
Forms Designer.

Task 2: Create a form for the completed SLA

For this task, you will use Forms Designer to create form controls display the record
number and title of the new SLA record created. These form controls, together with
the window title, prompt, buttons, and other choices you made in the wizard record,
will be displayed to the end user as the wizard screen shown below.

To create a new form for the completed SLA, follow these steps:

   1. Start the Forms Designer.

   2. In the Form field, type sla.create.finished.

     Best Practice: Because the form name must match the subformat display entry
     exactly, you can copy the subformat display entry in the Usage tab and paste it
     into the Form field. This helps avoid spelling errors.

   3. Click New.
   4. Click No for Forms wizard.


5. Create the following for this form. When you start to design the new form, make
  sure the X and Y coordinates are at 0 (zero).


Property                                Value
Label
Caption                                 Type:
                                        SLA record
Visible
Text                                    Select.
Input
                                        Type:
Visible                                 agreement.id
Text
                                        Select.

Input                                   Type:

                                        title

Visible                                 Select.

Label                                   Type:
Caption
                                        has been successfully created. Click
                                        Finish to view the record.

Visible                                 Select.

6. Click OK twice to save the new form and exit.


You have finished creating the final wizard screen that's displayed for the SLA wizard.

Contents

     1 Task 1: Create a wizard for the completed SLA
     2 Task 2: Create a form for the completed SLA


1.8.4.4.14. Step 14: Set menu to call the
new SLA wizard

The purpose of this step is to associate the new wizard with the menu command:
Service Level Management > Service Level Agreements > Create New SLA. That is,
the first panel of the new wizard is to be displayed rather than the Service Level
Agreement entry form that's displayed out-of-box.

To set the menu to call the new wizard, follow these steps:

   1. Click Tailoring > Tailoring Tools > Menus.
   2. Type SLA in the Menu Name field, and then click Search.
   3. Click in the row for Option 5 – Service Level Agreements.
   4. In the Application column, replace thread.start by typing wizard.run.
   5. In the Parameter Value column, replace sla.add.object by typing SLA Create 1.
   6. Click OK to save the changes.

Now you can click Service Level Management > Service Level Agreements > Create
New SLA to confirm that the menu changes were effected and the wizard opens and
executes as expected.
````
