---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.4.4 .. 1.4.4
printed_pages: 1212-1246
---

# 1.4.4 Mobile Applications Form Widgets

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.4.4. Mobile Applications Form Widgets

This section provides detailed information about the widgets on Service Manager
Mobile Applications forms.

This section includes:

     Label control
     Text control
     Text area control
     Date control
     Combo Box control
     Comfill control
     Group control
     Button control
     Check box control
     Table control
     Table column control
     Subform control
     Dynamic Form control
     Notebook control
     Notebook tab control


1.4.4.1. Label control

Use this control to add a label. A label is a single line of text you can use to give titles
to forms, give labels to objects within the form, or otherwise place text on the form.

Refer to the following screenshot as an example of the label control widget on a
Mobile Applications form:

Property                                Usage
Name
                                        (Optional) Specify a unique identifier
Caption                                 for the object on the screen.
Input
Label For                               This name is used by external
                                        applications, such as RAD, to
                                        dynamically change the properties of
                                        the object.

                                        (Required) Specify a text caption for
                                        the object.

                                        (Optional) Specify the database field or
                                        variable to associate with this control.
                                        When input is specified, the Label will
                                        be displayed as a read-only Text.

                                        (Optional) Specify the widget which the
                                        label belongs to.


Note

A label which is neither referred by any field or variable nor belongs to
any other widget will not be displayed on a Mobile Applications form.


1.4.4.2. Text control

Use this control to add a text box that displays the contents of a text field and
conditionally enables users to enter or modify its contents.

Refer to the following screenshot as an example of the text control widget on a Mobile
Applications form:


Property                                Usage
Name
                                        (Optional) Specify a unique identifier
Input                                   for the object on the screen.
Read-Only
Mandatory                               This name is used by external
                                        applications, such as RAD, to
                                        dynamically change the properties of
                                        the object.

                                        This name is also used by the Label For
                                        property to specify the label of this
                                        widget.

                                        Specify the database field or variable
                                        to associate with this control.

                                        Select this option to disable editing
                                        capabilities and provide only viewing
                                        access to the field.

                                        Setting Mandatory to Yes by selecting
                                        the checkbox indicates that the field is
                                        required and therefore an asterisk
                                        indicating a required field is displayed.
                                        This is a visible change only. To make
                                        the field mandatory for any form it
                                        appears on, use the System Definition
                                        Utility. To make the field mandatory for
                                        a small number of forms only, use
                                        Format Control.

Note

If the text is too long for a mobile device to display in one line, use a Text
area control instead.


1.4.4.3. Text area control

Use this control to add a text area that displays the contents of a text field and
conditionally enables users to input several lines of data. This object contains scroll
bars and allows text wrapping.

Refer to the following screenshot as an example of the text area control widget on a
Mobile Applications form:

Property                                                                                        Service Manager 9.81
Name
                                        Usage
Input
Read-Only                               (Optional) Specify a unique identifier
Mandatory                               for the object on the screen.

                                        This name is used by external
                                        applications, such as RAD, to
                                        dynamically change the properties of
                                        the object.

                                        This name is also used by the Label For
                                        property to specify the label of this
                                        widget.

                                        Specify the database field or variable
                                        to associate with this control.

                                        Select this option to disable editing
                                        capabilities and provide only viewing
                                        access to the field.

                                        Select this option so that a red asterisk
                                        indicating a required field is displayed.
                                        This is a visible change only.

                                             To make the field mandatory for
                                             any form it appears on, use the
                                             System Definition Utility.
                                             To make the field mandatory for a
                                             small number of forms only, use
                                             Format Control.


1.4.4.4. Date control

Use this control to add a text box that displays and enables users to update the
contents of a date field.

Refer to the following screenshot as an example of the date control widget on a
Mobile Applications form:

Refer to the following screenshot as an example of the date selector on a Mobile
Applications form:

Refer to the following screenshot as an example of the time selector on a Mobile
Applications form:

Property                                                                                        Service Manager 9.81
Name
                                        Usage
Input
Read-Only                               (Optional) Specify a unique identifier
Mandatory                               for the object on the screen.

                                        This name is used by external
                                        applications, such as RAD, to
                                        dynamically change the properties of
                                        the object.

                                        This name is also used by the Label For
                                        property to specify the label of this
                                        widget.

                                        Specify the database field or variable
                                        to associate with this control.

                                        Select this option to disable editing
                                        capabilities and provide only viewing
                                        access to the field.

                                        Select this option so that a red asterisk
                                        indicating a required field is displayed.
                                        This is a visible change only.

                                             To make the field mandatory for
                                             any form it appears on, use the
                                             System Definition Utility.
                                             To make the field mandatory for a
                                             small number of forms only, use
                                             Format Control.


1.4.4.5. Combo Box control

Use this control to add a Combo Box that enables users to click a button and select
from a drop-down list. The items in the list are associated with a database field or
variable. Users can also type in a value if the checkbox in the Select Only property is
cleared (set to false).

Refer to the following screenshot as an example of the Combo Box control widget on
a Mobile Applications form:

Refer to the following screenshot as an example of the Combo Box selector on a
Mobile Applications form:

Property                                                                                        Service Manager 9.81
Name
                                        Usage
Input
Read-Only                               (Optional) Specify a unique identifier
Mandatory                               for the object on the screen.

                                        This name is used by external
                                        applications, such as RAD, to
                                        dynamically change the properties of
                                        the object.

                                        This name is also used by the Label For
                                        property to specify the label of this
                                        widget.

                                        Specify the database field or variable
                                        to associate with this control.

                                        Select this option to disable editing
                                        capabilities and provide only viewing
                                        access to the field. Give read–only
                                        fields a tab–stop value of –1 to prevent
                                        users from tabbing into them.

                                        Select this option so that a red asterisk
                                        indicating a required field is displayed.
                                        This is a visible change only.

                                             To make the field mandatory for
                                             any form it appears on, use the
                                             System Definition Utility.
                                             To make the field mandatory for a
                                             small number of forms only, use
                                             Format Control.

 Property                                                                                       Service Manager 9.81
 Value List
                                        Usage
This PDF was generated on May 23, 2026
                                        In conjunction with the Input property,
                                        defines how the Display List values are
                                        identified in the database. Value and
                                        Display Lists are entered using the Edit
                                        List dialog box. You can enter hard
                                        coded entries for each list, or you can
                                        supply a variable as the first and only
                                        entry. The run time values of the
                                        variable are used to populate these
                                        lists.

                                                    Note

                                                   When defining Value List
                                                   and Display List properties,
                                                   you should avoid using the
                                                   following reserved
                                                   characters:

                                                        semicolon (;)
                                                        tab key
                                                        newline (carriage
                                                        return)
                                                        form feed
                                                        backspace
                                                        equal sign (=)

                                                    Caution

                                                   Do not use keys (such as
                                                   backspace). The system
                                                   can't process their ASCII
                                                   representation entries
                                                   correctly, which may lead
                                                   to unpredictable results.

                                                                                                                          Page 35 of 191

Property                                Usage
Display List
                                        Specify the values that appear in the
                                        drop-down list at run time. There must
                                        be a one–to–one correspondence
                                        between the values for Value List and
                                        for Display List. If the Display List is the
                                        only populated property, the display
                                        values are written to the database.

                                                    Note

                                                   When defining Value List
                                                   and Display List properties,
                                                   you should avoid using the
                                                   following reserved
                                                   characters:

                                                        semicolon (;)
                                                        tab key
                                                        newline (carriage
                                                        return)
                                                        form feed
                                                        backspace
                                                        equal sign (=)

                                               Caution

                                               Do not use keys (such as
                                               backspace). The system
                                               can't process their ASCII
                                               representation entries
                                               correctly, which may lead
                                               to unpredictable results.


Note

Combo box is always select-only on Service Manager Mobile
Applications.


1.4.4.6. Comfill control

Use this control to add a combination Combo Box and Fill button. Comfill has all the
properties of a Combo Box, plus the capability for Fill button. You can select which
comfill buttons to display. For example, to display just a Fill button, set the Third
Button Visible property to true by selecting the checkbox and set the Combo Button
Visible property to false, by clearing the checkbox.

            Note

           As of Service Manager 9.41, the display name of a CI can be displayed in
           comfill for mobility. You can fill a CI by its display name.

Refer to the following screenshot as an example of the non-array comfill widget with
popup form enabled on a Mobile Applications form:

Refer to the following screenshot as an example of the array comfill widget on a
Mobile Applications form:

Refer to the following screenshot as an example of the array comfill widget after
clicking:

Property                                                                                        Service Manager 9.81
Name
                                        Usage
Input
Read-Only                               (Optional) Specify a unique identifier
Mandatory                               for the object on the screen.

                                        This name is used by external
                                        applications, such as RAD, to
                                        dynamically change the properties of
                                        the object.

                                        This name is also used by the Label For
                                        property to specify the label of this
                                        widget.

                                        Specify the database field or variable
                                        to associate with this control.

                                        Select this option to disable editing
                                        capabilities and provide only viewing
                                        access to the field.

                                        Select this option so that a red asterisk
                                        indicating a required field is displayed.
                                        This is a visible change only.

                                             To make the field mandatory for
                                             any form it appears on, use the
                                             System Definition Utility.
                                             To make the field mandatory for a
                                             small number of forms only, use
                                             Format Control.

 Property                                                                                       Service Manager 9.81
 Array Length
                                        Usage
 Value List
                                        Specify the size of the scrolling region
This PDF was generated on May 23, 2026  used to view array entries. A scroll bar
                                        appears beside the fields to allow users
                                        to view the array entries.

                                             If a field is assigned an Array
                                             Length of 5, the form stacks five
                                             fields vertically to allow users to
                                             view the five array entries.
                                             If Array Length is set to -1, the
                                             form dynamically creates as many
                                             fields as there are entries in the
                                             array.
                                             If the Input data type is scalar,
                                             only a single text box appears.

                                                    Note

                                                   The screen object must be
                                                   associated with an array
                                                   data structure.

                                        The default is 0, which means one
                                        vertical line of information appears.

                                        In conjunction with the Input property,
                                        defines how the Display List values are
                                        identified in the database. Value and
                                        Display Lists are entered using the Edit
                                        List dialog box. You can enter hard
                                        coded entries for each list, or you can
                                        supply a variable as the first and only
                                        entry. The run time values of the
                                        variable are used to populate these
                                        lists.

                                                                                                                          Page 40 of 191
Property                                                                                        Service Manager 9.81
Display List
                                        Usage
Combo Button Visible
                                        Specify the values that appear in the
Fill Button ID                          drop-down list at run time. There must
Fill Button Visible                     be a one–to–one correspondence
Popup Subform Format                    between the values for Value List and
Popup Subform Input                     for Display List. If the Display List is the
Popup Subform Enabled                   only populated property, the display
                                        values are written to the database.

                                        Select this option to make the Combo
                                        Button visible when the form opens.

                                                    Note

                                                   When this property is
                                                   enabled, the Fill Button
                                                   Visible property is no
                                                   longer effective.

                                        Specify a Control ID to transmit when
                                        clicked.

                                        Select this option to make the Fill
                                        Button visible when the form opens.

                                        Specify the form to display.

                                        Specify the database field or variable
                                        to associate with this control.

                                        Select this option to enable the Popup
                                        Subform for this control.


1.4.4.7. Group control

Use this control to add a container that enables you to logically group associated
items. In the Windows client the Group has a rectangular border with a text label at
the top.

Refer to the following screenshot as an example of the group control widget on a
Mobile Applications form:

Property                                Usage
Name
                                        (Optional) Specify a unique identifier
                                        for the object on the screen.

                                        This name is used by external
                                        applications, such as RAD, to
                                        dynamically change the properties of
                                        the object.

Caption                                 (Required) Specify a text caption for
                                        the object.

         Note

              Do not nest field groups.
              For usability and performance issues, don't include more than ten
              fields in a group.
              If there is one field group defined on a form at a minimum, the
              widgets which aren't included in this group will not be displayed on a
              Mobile Applications form.



1.4.4.8. Button control

Use this control to add an input field that displays and enables users to update the
contents of a numeric field and offers spinner buttons to increase or decrease a
value.

Refer to the following screenshot as an example of the button control widget on a
Mobile Applications form:

Property                                Usage
Name
                                        (Optional) Specify a unique identifier
Caption                                 for the object on the screen. This name
Button ID                               is used by external applications, such
                                        as RAD, to dynamically change the
                                        properties of the object.

                                        Specify a text caption for the object.

                                        Specify a numeric identification that
                                        specifies a Control ID to transmit when
                                        clicked.


1.4.4.9. Check box control

Use this control to add a checkbox that displays and enables users to update the
contents of a Boolean (logical) field, which can evaluate to true, false, unknown, or
null.

Refer to the following screenshot as an example of the checkbox control widget on a
Mobile Applications form:

Property                                Usage
Name
                                        (Optional) Specify a unique identifier
Caption                                 for the object on the screen.
Input
Read-Only                               This name is used by external
                                        applications, such as RAD, to
                                        dynamically change the properties of
                                        the object.

                                        Specify a text caption for the object.

                                        Specify the database field or variable
                                        to associate with this control.

                                        Select this option to disable editing
                                        capabilities and provide only viewing
                                        access to the field. Give read–only
                                        fields a tab–stop value of –1 to prevent
                                        users from tabbing into them.


1.4.4.10. Attachments control

Use this control to add a box into which users can place non-Service Manager
documents (For example, from Microsoft Word or Microsoft Excel).

To place an attachment container on a form, click Attachments, and then click the
form.

Refer to the following screenshot as an example of the Attachments control widget on
a Mobile Applications form:

Property                                                                                        Service Manager 9.81
Name
                                        Usage
Visible
Read-Only                               (Optional) Specify a unique identifier
                                        for the object on the screen.

                                        This identifier is used by external
                                        applications, such as RAD, to
                                        dynamically change the properties of
                                        the object.

                                        Select this option to make the object
                                        visible on the form. Clear the checkbox
                                        to hide the object from view on the
                                        form.

                                        Disable the editing capability of the
                                        control.

                                        Users can only view the attached
                                        documents when this option is
                                        selected. To prevent users from using
                                        the Tab key to enter the control, you
                                        can assign the value of -1 to the Read-
                                        Only field.

Property                                                                                        Service Manager 9.81
Maximum Attachment Size
                                        Usage

                                        Specify the maximum size of an
                                        attachment, in bytes.

                                                    Note

                                                   Size limits defined in the
                                                   Maximum Attachment Size
                                                   field in a user's operator
                                                   record override the size
                                                   limit specified in the
                                                   Company record.

                                                   A non-zero value overrides
                                                   any values specified in the
                                                   Company or Operator
                                                   record.

Total Attachment Size                   Specify the maximum amount of
Maximum Attachments Allowed             memory (in bytes) that all attachments
                                        in a form can use. The total size of all
                                        attachments must be lower than this
                                        threshold or the form no longer accepts
                                        additional attachments.

                                        Select whether you want to allow one
                                        or any number of attachments.

                                        Known issue: This property is
                                        unsupported in Mobile Applications.


1.4.4.11. HTML Viewer control

Use this control to add an HTML Viewer that enables users to view the HTML created
by using the HTML Editor.
To place an HTML Viewer on a form, click HTML Viewer, and then click the form. Be
sure to put the name of the database field or variable that you want to associate with
this control into the Input property.
Refer to the following screenshot as an example of the HTML Viewer control widget
on a Mobile Applications form:

Property                                                                                        Service Manager 9.81
Input
Name                                    Usage
Visible
                                        Specify the database field or variable
                                        to associate with this control.

                                        (Optional) Specify a unique identifier
                                        for the object on the screen.

                                        Make the object visible or invisible on
                                        the form.
                                        Selecting the checkbox makes the
                                        object visible and clearing the
                                        checkbox makes it invisible.


1.4.4.12. Table control

Use this control to add a table that displays one or more columns of data in a
scrollable pane. The tables you create in the Form Designer appear as a rectangular
region subdivided by rows and columns. The look and feel mimics tables in Microsoft
Windows applications like Excel.

Refer to the following screenshot as an example of the table control widget in List
view:

Refer to the following screenshot as an example of the table control widget in Detail
view:

Refer to the following screenshot as an example of the table control widget after
clicking:


Property                                Usage
Name
                                        (Optional) Specify a unique identifier
Read-Only                               for the object on the screen.
Columns
                                        This field is required if you enable the
                                        Multiple Selection property. This name
                                        is used by external applications, such
                                        as RAD, to dynamically change the
                                        properties of the object.

                                        This name is also used by the “Label
                                        For” property to specify the label of
                                        this widget.

                                        Always read-only.

                                        Specify a list of columns in the table.


1.4.4.13. Table column control

Use this control to add a column to an existing table.

Property                                Usage
Name
                                        (Optional) Specify a unique identifier
                                        for the object on the screen.

                                        This name is used by external
                                        applications, such as RAD, to
                                        dynamically change the properties of
                                        the object.

Caption                                 Specify a text caption for the object.
Input
Field                                   Specify the database field or variable
Display List                            to associate with this control.

Read-Only                               In the case where the array specified in
                                        the input property is an array of
                                        structure, it specifies the field in the
                                        structure for this object.

                                        Specify the values that appear in the
                                        drop-down list at run time. There must
                                        be a one–to–one correspondence
                                        between the values for Value List and
                                        for Display List. If the Display List is the
                                        only populated property, the display
                                        values are what were written to the
                                        database.

                                        Always read-only.


1.4.4.14. Subform control

Use this control to display a subform on another form.

Property                                Usage
Name
                                        (Optional) Specify a unique identifier
Format                                  for the object on the screen. This name
Virtual Join                            is used by external applications, such
                                        as RAD, to dynamically change the
Display Using Table                     properties of the object.
Input
                                        Specify the form to display. Be sure
                                        you type the exact form name.

                                        Select this option to associate virtual
                                        join run time processing with the
                                        subform object. Clear the checkbox to
                                        use a same-file join.

                                        Select this option to display the
                                        subform in table format.

                                        Specify the database field or variable
                                        to associate with this control.


1.4.4.15. Dynamic Form control

Use this control to add a dynamic form that becomes visible when populated by XML
from a RAD application or JavaScript. The aspect and content of the dynamic form
depend on the XML.

To place a dynamic form on a form, click Dynamic Form and then click the form.

Be sure to put the name of the database field or variable that you want to associate
with this control into the Input property.

Property                                Usage
Name
                                        (Optional) Specify a unique identifier
Visible                                 for the object on the screen. This name
Read-Only                               is used by external applications, such
Input                                   as RAD, to dynamically change the
                                        properties of the object.

                                        Select this option to make the object
                                        visible on the form. Clear the checkbox
                                        to hide the object from view on the
                                        form.

                                        In this release, we doesn't support
                                        change user options from mobile. All
                                        the contents inside the dynamic form
                                        will be read-only.

                                        Specify the database field or variable
                                        to associate with this control.


1.4.4.16. Notebook control

Use this control to subdivide the contents of a screen into logical groups or
categories. Notebooks provide an aesthetic way of organizing large amounts of data
into small spaces.

Click to the right of the last tab on the notebook to open the notebook properties.
Click the tab and then the blank area below the tab to open the notebook tab
properties.

To place a notebook on a form, click Notebook and then click the form.

Property                                Usage
Name
                                        (Optional) Specify a unique identifier
Visible                                 for the object on the screen. This name
                                        is used by external applications, such
                                        as RAD, to dynamically change the
                                        properties of the object.

                                        Select this option to make the object
                                        visible on the form. Clear the checkbox
                                        to hide the object from view on the
                                        form.


1.4.4.17. Notebook tab control

Use this control to add a tab to an existing notebook. Navigate to each page of the
notebook by selecting its tab.

Click to the right of the last tab on the notebook to open the notebook's properties.
Click the notebook tab and then the blank area below the tab to open the notebook
tab's properties.

Property                                Usage
Name
                                        (Optional) Specify a unique identifier
Caption                                 for the object on the screen. This name
Visible                                 is used by external applications, such
                                        as RAD, to dynamically change the
                                        properties of the object.

                                        (Required) Specify a text caption for
                                        the object.

                                        Select this option to make the object
                                        visible on the form. Clear the checkbox
                                        to hide the object from view on the
                                        form.
````
