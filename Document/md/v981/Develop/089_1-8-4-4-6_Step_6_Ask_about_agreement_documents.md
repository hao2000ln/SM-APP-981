---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.8.4.4.6 .. 1.8.4.4.10
printed_pages: 2339-2373
---

# 1.8.4.4.6 Step 6: Ask about agreement documents

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.8.4.4.6. Step 6: Ask about agreement
documents

The purpose of this step is to create a wizard panel that asks the user whether they
want to copy text from an agreement document.
Perform the following two tasks to design a wizard panel asks users about
agreements and other documents related to the SLA.
>

Task 1: Create a wizard to ask about agreements

The purpose of this task is to create a wizard panel that asks users if they want to
copy text from agreement documents to this SLA.
To create the panel, follow these steps:

   1. Click Tailoring > Wizards. The Wizard information form opens.
   2. Select the Wizard Info tab.
   3. In the Wizard Name field, type SLA Create 5, and then click Add.

                   Caution

                If you use an existing SLA record to create a new SLA wizard panel,
                click Add rather than Save. If you click Save, you will replace the
                existing record with the new record you are attempting to add.

   4. In the Wizard Info tab, complete the following fields.


Field                                   Value
Start Node?
Brief Description                       Leave this option unchecked.

Window Title                            Type:
                                        This wizard will ask the user whether
Title                                   they want to copy text from
                                        Agreement documents or attach
                                        other documents to the SLA.

                                        Type:
                                        Create New SLA - Copy
                                        Agreements?

                                        Type:
                                        Create New SLA - Copy
                                        Agreements?

5. Select the File Selection tab to complete the following fields:

Field/Subtab                            Value
Initial Expressions subtab
                                        Type:
                                        $L.agreement.docs=false

Select $L.file by subtab                Select the $L.file passed in option to
                                        indicate that the $L.file variable
                                        should be passed to the wizard from
                                        a previous wizard.

6. Select the Usage tab and complete the following fields to determine the action
  that Service Manager should take when the wizard is run:


Field                                   Value
Request user input
                                        Select this field to prompt the user
Sub Format to Display                   for information.

                                        Enter a subformat name of the
                                        format to display. Type:
                                        sla.create.ask.agreements

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

8. Select the Next Wizard tab and complete the following fields:


Field                                   Value
Wizard Name
Condition                               This is the name of the next wizard
                                        in a series of wizards. Type:
Wizard Name                             SLA Create 6a
Condition
                                        The condition determines what
                                        happens next. In this case, you
                                        entered the next wizard in sequence
                                        and an expression that evaluates to
                                        "true." Alternatively, you can specify
                                        different wizazrds, based on user
                                        actions or selections. Type:
                                        $L.agreement.docs=true

                                        This is the name of the next wizard
                                        in a series of wizards. Type:
                                        SLA Create 7

                                        Type:
                                        true

   9. When you are finished, click Save.

This completes the wizard panel that asks users about attachments. The next step
creates the corresponding new wizard form in Forms Designer.

Task 2: Create a form to ask about agreement

For this task, you will use Forms Designer to create the form controls that ask users to
whether they want top copy text from agreements to the SLA. These form controls,
together with the window title, prompt, buttons, and other choices you made in the
wizard record, will be displayed to the end user as the screen shown below.


To create a new form for the SLA wizard that asks about agreements, follow these
steps:

   1. Start the Forms Designer.

   2. In the Form field, type sla.create.ask.agreements.

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
                                        Do you want to copy text from
       Visible                          Agreement documents into this SLA?
       Radio Button
       Caption                          Select.

       Input                            Type:
                                        Yes
       Value
                                        Type:
       Visible                          $L.agreement.docs
       Radio Button
       Caption                          Type:
                                        true
       Input                            Select.

This PDF was generated on May 23, 2026  Type:
                                        No
                                        Type: $L.agreement.docs

                                                                                                                 Page 290 of 341

Property                                Value
Value
                                        Type:
                                        false

Visible                                 Select.

   6. Click OK twice to save the new form and exit.

You have finished creating one of the forms needed for the SLA wizard.

Contents

     1 Task 1: Create a wizard to ask about agreements
     2 Task 2: Create a form to ask about agreement


1.8.4.4.7. Step 7: Prompt to add
agreements

The purpose of this step is to create the wizard panel that prompts the user to add
agreements related to the SLA if they answered Yes on the previous panel. The user
does this by copying and pasting text into the entry field.
Perform the following two tasks to design a wizard panel to prompt the user to add
agreements.

Task 1: Create a wizard to add agreements

For this task, you will create a wizard panel that prompts users to copy and paste text
from agreements related to the SLA, if they answered Yes in the previous panel.
To create a wizard panel that prompts users to attach agreement documents, follow
these steps:

   1. Click Tailoring > Wizards. The Wizard information form opens.
   2. Select the Wizard Info tab.
   3. In the Wizard Name field, type SLA Create 6a, and then click Add.

                   Caution

                If you use an existing SLA record to create a new SLA wizard panel,
                click Add rather than Save. If you click Save, you will replace the
                existing record with the new record you are attempting to add.

   4. In the Wizard Info tab, complete the following fields.


Field                                   Value
Start Node?                             Leave this option unchecked.
Brief Description
                                        Type:
Window Title                            This wizard will prompt the user to
                                        copy and paste text from Agreement
Title                                   documents.

                                        Type:
                                        Create New SLA - Agreement
                                        Documents

                                        Type:
                                        Create New SLA - Agreement
                                        Documents

5. Select the File Selection tab and the Select $L.file by subtab to complete the
  following field:

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
                                        sla.create.add.agreements

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

8. Select the Next Wizard tab and complete the following fields:


Field                                   Value
Wizard Name
                                        This is the name of the next wizard
Condition                               in a series of wizards. Type:

                                        SLA Create 7

                                        The condition determines what
                                        happens next. In this case, you
                                        entered the next wizard in sequence
                                        and an expression that evaluates to
                                        "true." Alternatively, you can specify
                                        different wizards, based on user
                                        actions or selections. Type:

                                        true

   9. When you are finished, click Save.

You have created the wizard panel that prompts users to attach agreement
documents. Next, you will create the new wizard form in Forms Designer.

Task 2: Create a form to add agreements

For this task, you will use Forms Designer to create the form controls that prompt the
user to copy and paste text from agreement documents related to the SLA. These
form controls, together with the window title, prompt, buttons, and other choices you
made in the wizard record, will be displayed to the end user as the screen shown
below.


To create a new form to display the wizard that prompts users to add agreement
document text, follow these steps:

   1. Start the Forms Designer.

   2. In the Form field, type sla.create.add.agreements.

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
                                        Copy and paste text from Agreement
Visible                                 documents related to this SLA:

                                        Select.

Text Area                               Type:
Input                                   agreements

Visible                                 Select.

   6. Click OK twice to save the new form and exit.
You have finished creating one of the forms needed for the SLA wizard.


1.8.4.4.8. Step 8: Save new SLA and
prompt for SLOs

At this point, all of the information needed for the new SLA has been collected. The
next task is create a process in Document Engine to save the new SLA to the
database.

Additionally this task asks the user if they want to add SLTs to the SLA.

Perform the following three tasks to complete this step.

Task 1: Create a process to save the new SLA

For this task, you will create a process to save the new SLA record that you just
created.

To create a process to save the new SLA record, follow these steps:

   1. Click Tailoring > Document Engine > Processes. The Process Definition form
     opens.

   2. In the Process Name field, type sla.save.from.wizard.

   3. In the RAD tab, type the following expressions in the first two rows of the
     Expressions evaluated before RAD call section:

     $L.action="add"

   4. In the RAD Application section of the RAD tab, type se.view.engine as the RAD
     application to be called, and then type true as the condition to execute it. Then
     enter the following parameter names and values:

Parameter Name                          Parameter Value
file
                                        Type:
                                        $L.file

description                             $L.action


   5. In the Post RAD Expressions section of the RAD tab, type
     $L.new.sla=agreement.id in $L.file.

   6. Click Add.
   7. When you are finished, click OK.

You have created the process to save the new SLA record to the database.

Task 2: Create a wizard to check SLT requirements

For this task, you will create a wizard to call the save process, and then create a
subformat that asks users whether they want to add SLTs and check the SLT
requirements.

To create a wizard to call the save process and check SLT requirements, follow these
steps:

   1. Click Tailoring > Wizards. The Wizard information form opens.
   2. Select the Wizard Info tab.

   3. In the Wizard Name field, type SLA Create 7, and then click Add.

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
                                        they want to create Availability or
Title                                   Response SLTs.

                                        Type:
                                        Create New SLA - Check SLT
                                        Requirements

                                        Type:
                                        Create New SLA - Check
                                        SLT Requirements

5. Select the File Selection tab to complete the following fields:

Field/Subtab                            Value
Initial Expressions subtab
                                        Type:
                                        $L.create.response.slo=false
                                        $L.create.avail.slo=false

Select $L.file by subtab                Select the $L.file passed in option to
                                        indicate that the $L.file variable
                                        should be passed to the wizard from
                                        a previous wizard.

6. Select the Usage tab and complete the following fields to determine the action
  that Service Manager should take when the wizard is run:


Field                                   Value
Request user input
                                        Select this field to prompt the user
Sub Format to Display                   for information.

                                        Enter a subformat name of the
                                        format to display. Type:
                                        sla.create.ask.slos

7. Select the Actions tab to define the actions when a user clicks Next, Cancel, or
  Previous within the wizard. Complete the following field:


Field                                   Value
Perform Actions On
                                        Here you can specify which
Format Control/Process Name             record(s) will be affected by the
subtab                                  action that you are going to perform.
Process Name                            This can either be the current file,
                                        the list selected (as a whole), or an
Wizard Variables                        action to be performed on every
                                        single record selected.
                                        Select Current File ($L.file).

                                        Define the actions when a user
                                        clicks Next, Cancel, or Previous
                                        within the wizard. Complete the
                                        following field:

                                        To specify that this wizard can run a
                                        process after completing, type:
                                        sla.save.from.wizard

                                        $L.create.response.slo
                                        $L.crate.avail.slo
                                        $L.new.sla

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

                                        Type:
                                        SLA Create 8

                                        Type:
                                        true


You have created the wizard panel that calls the save process and checks SLT
requirements. Next, you will create the new wizard form in Forms Designer.

Task 3: Create a form to check SLT requirements

For this task, you will use Forms Designer to create form controls that ask users if
they want to create Service Level Targets related to the SLA.

To create a new form for the wizard that calls the save process and checks SLT
requirements:

   1. Start the Forms Designer.

   2. In the Form field, type sla.create.ask.slos.

     Best Practice: Because the form name must match the subformat display entry
     exactly, you can copy the subformat display entry in the Usage tab and paste it
     into the Form field. This helps avoid spelling errors.

   3. Click New.
   4. Click No for Forms wizard.

   5. Create the following for this form. When you start to design the new form, make
     sure the X and Y coordinates are at 0 (zero).


       Property                         Value
       Group
       Caption                          Type:
                                        Do you want to create Service Level
       Visible                          Targets based on Help Desk
       Radio Button                     response times?
       Caption
       Input                            Select.
       Value
       Visible                          Type:
       Radio Button                     Yes
       Caption
                                        Type:
This PDF was generated on May 23, 2026  $L.create.response.slo

                                        Type:
                                        true
                                        Select.

                                        Type:
                                        No

                                                                Page 305 of 341
       Property                                                                           Service Manager 9.81
       Input
                                        Value
       Value                            Type:
                                        $L.create.response.slo
       Visible
       Group                            Type:
       Caption                          false
                                        Select.
       Visible
       Radio Button                     Type:
       Caption                          Do you want to create Service Level
                                        Targets based on service
       Input                            availability?

       Value                            Select.

       Visible                          Type:
                                        Yes
This PDF was generated on May 23, 2026
                                        Type:
                                        $L.create.avail.slo

                                        Type:
                                        true
                                        Select.

                                                             Page 306 of 341

Property                                Value
Radio Button

Caption                                 Type:
                                        No

Input                                   Type:

                                        $L.create.avail.slo

Value                                   Type:

                                        false

Visible                                 Select.

   6. Click OK twice to save the new form and exit.

You have finished creating one of the forms needed for the SLA wizard.

Contents

     1 Task 1: Create a process to save the new SLA
     2 Task 2: Create a wizard to check SLT requirements
     3 Task 3: Create a form to check SLT requirements


1.8.4.4.9. Step 9: Call the Availability SLT
wizard

The next step is to create a wizard panel to call the existing out-of-box Availability
Wizard for those users who answered that they did want an availability SLT.
Because this wizard panel only performs the background task of calling another
wizard, there is no screen to show the end user. Thus there is no task requiring the
use of Forms Designer in this step.

Task: Create a wizard to call an Availability SLT

For this task, you will create a wizard that will call the existing out-of-box Availability
SLT wizard.
To create a wizard that calls the existing out-of-box Availability SLT wizard, follow
these steps:

   1. Click Tailoring > Wizards. The Wizard information form opens.
   2. Select the Wizard Info tab.
   3. In the Wizard Name field, type SLA Create Availability 1, and then click Add.

                   Caution

                If you use an existing SLA record to create a new SLA wizard panel,
                click Add rather than Save. If you click Save, you will replace the
                existing record with the new record you are attempting to add.

   4. In the Wizard Info tab, complete the following fields.


Field                                   Value
Start Node?                             Leave this option unchecked.
Brief Description
                                        Type:
Window Title                            This wizard calls the existing wizard
                                        to create an Availability SLT.
Title
                                        Type:
                                        Create Availability SLT

                                        Type:
                                        Create Availability SLT

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

                                        slo.add.avail.sla

8. Select the Next Wizard tab and complete the following fields:


Field                                   Value
Wizard Name
                                        This is the name of the next wizard
Condition                               in a series of wizards. Type:

                                        SLA Create Availability 2

                                        The condition determines what
                                        happens next. In this case, you
                                        entered the next wizard in sequence
                                        and an expression that evaluates to
                                        "true." Alternatively, you can specify
                                        different wizazrds, based on user
                                        actions or selections. Type:

                                        true

   9. When you are finished, click Save.

You have created a wizard panel that calls the existing out-of-box Availability SLT. A
new form is not needed for this wizard.

Contents

     1 Task: Create a wizard to call an Availability SLT


1.8.4.4.10. Step 10: Prompt for another
Availability SLT

The next step is to ask the user if they want to add another availability SLT. If they do,
this panel must call the out-of-box Availability SLT wizard again. If they don't, the
wizard must call the out-of-box Response SLT if the user indicated they wanted to
add a Response SLT, or else go to the final wizard screen.
Perform the following two tasks to design a wizard panel to prompt for another
Availability SLT.

Task 1: Create a wizard for more Availability SLTs

For this task, you will create a wizard so users can create more Availability SLTs.
To create a wizard so users can create more Availability SLTs, follow these steps:

   1. Click Tailoring > Wizards. The Wizard information form opens.
   2. Select the Wizard Info tab.
   3. In the Wizard Name field, type SLA Create Availability 2, and then click Add.

                   Caution

                If you use an existing SLA record to create a new SLA wizard panel,
                click Add rather than Save. If you click Save, you will replace the
                existing record with the new record you are attempting to add.

   4. In the Wizard Info tab, complete the following fields.


Field                                   Value
Start Node?                             Leave this option unchecked.
Brief Description
                                        Type:
Window Title                            This wizard panel asks the user if
                                        they want to create another
Title                                   Availability SLT.

                                        Type:
                                        Create another Availability SLT

                                        Type:
                                        Create another Availability SLT

5. Select the File Selection tab and the Select $L.file by subtab to complete the
  following field:

Field                                   Value
Initial Expressions:
No $L.file (use typecheck)              $L.create.avail.slo=false

                                        Select this option to initialize a
                                        typecheck file, which acts as a
                                        holding file.

6. Select the Usage tab and complete the following fields to determine the action
  that Service Manager should take when the wizard is run:


Field                                   Value
Request user input
                                        Select this field to prompt the user
Sub Format to Display                   for information.

                                        Enter a subformat name of the
                                        format to display. Type:
                                        sla.create.ask.other.avail

Turn off Previous button only?          Checked

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

Wizard Variables:                       $L.create.avail.slo

8. Select the Next Wizard tab and complete the following fields:


Field                                   Value
Wizard Name
                                        This is the name of the next wizard
Condition                               in a series of wizards. Type:

                                        SLA Create Availability 1

                                        The condition determines what
                                        happens next. In this case, you
                                        entered the next wizard in sequence
                                        and an expression that evaluates to
                                        "true." Alternatively, you can specify
                                        different wizazrds, based on user
                                        actions or selections. Type:

                                        $L.create.avail.slo=true

Wizard Name                             This is the name of the next wizard
                                        in a series of wizards. Type:

                                        SLA Create 8

Condition                               true

   9. When you are finished, click Save.

You have created the wizard so users can create more Availability SLTs. Next, you will
create the new wizard form in Forms Designer.

Task 2: Create a form for more Availability SLTs

For this task, you will use Forms Designer to create form controls that ask users if
they want to create an additional Service Level Target record.

To create a new form for the wizard that creates more Availability SLTs, follow these
steps:

   1. Start the Forms Designer.

   2. In the Form field, type sla.create.ask.other.avail.


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
       Visible                          Availability SLT record?
       Radio Button
       Caption                          Select.
       Input
       Value                            Type:
       Visible                          Yes
       Radio Button
       Caption                          Type:
                                        $L.create.avail.slo
This PDF was generated on May 23, 2026
                                        Type:
                                        true
                                        Select.

                                        Type:
                                        No

                                                             Page 317 of 341

Property                                Value
Input
                                        Type:
Value                                   $L.create.avail.slo

                                        Type:
                                        false

Visible                                 Select.

   6. Click OK twice to save the new form and exit.

You have finished creating one of the forms needed for the SLA wizard.

Contents

     1 Task 1: Create a wizard for more Availability SLTs
     2 Task 2: Create a form for more Availability SLTs
````
