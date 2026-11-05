---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.3.1.3.28 .. 1.1.3.1.3.34
printed_pages: 386-418
---

# 1.1.3.1.3.28 Notebook tab control

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.3.1.3.28. Notebook tab control

Use this control to add a tab to an existing notebook. Navigate to each page of the
notebook by selecting its tab.

Click to the right of the last tab on the notebook to open the notebook's properties.
Click the notebook tab and then the blank area below the tab to open the notebook
tab's properties.

Best practices

Forms with tabs should include a header section which is not part of the tab. This
header should include important description information about the record. For
example, incident records should show, at a minimum, the incident number.

To place a tab on a notebook, click Notebook tab and then click the notebook.
Be sure to put the name of the database field or variable that you want to associate
with this control into the Input property.

 Property                                                                                       Service Manager 9.81
 Name
                                        Usage
 X
 Y                                      Specify a unique identifier for the
 Width                                  object on the screen. (Optional)
 Height
 Visible                                This name is used by external
 Visible Condition                      applications, such as RAD, to
 Tab Stop                               dynamically change the properties of
                                        the object.
This PDF was generated on May 23, 2026
                                        Specify the object’s horizontal position
                                        based on the left edge of the object.

                                        Specify the object’s vertical position
                                        based on the top edge of the object.

                                        Specify the width of the object in
                                        alignment grid units.

                                        Specify the height of the object in
                                        alignment grid units.

                                        Select this option to make the object
                                        visible on the form. Clear the checkbox
                                        to hide the object from view on the
                                        form.

                                        Specify an expression to override the
                                        Visible property when that expression
                                        evaluates to true.

                                        Specify the tab sort order for this field.
                                        By default, the TAB key navigates the
                                        focus on a form from top to bottom and
                                        left to right. Objects that have a non-
                                        zero Tab Stop are visited first, in
                                        ascending order. For a button, file,
                                        radio button or checkbox, you will
                                        almost always use the default of 0.

                                                                                                                        Page 203 of 369

Related topics

Form creation
Forms Designer
Creating and editing forms
Using the drawing canvas
Forms Designer properties view
Setting properties
Forms Designer best practices
Building accessible forms
Access Forms Designer
Create a form using the Form Wizard
Update a form
Notebook control
Forms Designer controls and tools


1.1.3.1.3.29. Notebook control

Use this control to subdivide the contents of a screen into logical groups or
categories. Notebooks provide an aesthetic way of organizing large amounts of data
into small spaces.
Click to the right of the last tab on the notebook to open the notebook properties.
Click the tab and then the blank area below the tab to open the notebook tab
properties.
To place a notebook on a form, click Notebook and then click the form.

Best practice

Do not place notebooks next to other form elements or other notebooks.

 Property                                                                                       Service Manager 9.81
 Name
                                        Usage
 X
 Y                                      Specify a unique identifier for the
 Width                                  object on the screen. (Optional)
 Height
 Visible                                This name is used by external
 Visible Condition                      applications, such as RAD, to
 Tab Stop                               dynamically change the properties of
                                        the object.
This PDF was generated on May 23, 2026
                                        Specify the object’s horizontal position
                                        based on the left edge of the object.

                                        Specify the object’s vertical position
                                        based on the top edge of the object.

                                        Specify the width of the object in
                                        alignment grid units.

                                        Specify the height of the object in
                                        alignment grid units.

                                        Select this option to make the object
                                        visible on the form. Clear the checkbox
                                        to hide the object from view on the
                                        form.

                                        Specify an expression to override the
                                        Visible property when that expression
                                        evaluates to true.

                                        Specify the tab sort order for this field.
                                        By default, the TAB key navigates the
                                        focus on a form from top to bottom and
                                        left to right. Objects that have a non-
                                        zero Tab Stop are visited first, in
                                        ascending order. For a button, file,
                                        radio button or checkbox, you will
                                        almost always use the default of 0.

                                                                                                                        Page 206 of 369
Property                                                                         Service Manager 9.81
Group rendering enabled
                         Usage
Lock rendering style
Heading Level            Causes the notebook to be displayed
                         as a group rather than a tabbed
                         notebook. The contents of each tab are
                         displayed as separate sections of the
                         group. The notebook tabs that were
                         arranged from left to right inside the
                         notebook are displayed from top to
                         bottom in the group.

                         Adds the ability to switch between the
                         Group style and the Tab style for a
                         Notebook control in the web client.

                         Specify the heading level for this
                         control so that a corresponding HTML
                         heading tag (<h1> to <h6>) is
                         generated.

                                     Note

                                    This function is only
                                    supported by the Web
                                    client.

Related topics                                   Page 207 of 369

Form creation
Forms Designer
Creating and editing forms
Using the drawing canvas
Forms Designer properties view
Setting properties
Forms Designer best practices
Building accessible forms Access Forms Designer
Create a form using the Form Wizard
Update a form

This PDF was generated on May 23, 2026

Notebook Tab control
Forms Designer controls and tools


1.1.3.1.3.30. Radio Button control

Use this control to add a radio button to a form. A radio button enables the user to
select one value from a set of mutually exclusive values. The items in the set are
associated with a database field or variable. Use radio buttons to give the user a
quick way to choose one option from a set of fixed and mutually exclusive string
values. It is a good practice to group related radio buttons within a frame.
Note: Radio buttons aren't supported on record lists.

Best practices

     If the choice is logical (true or false), use a checkbox instead.
     If choices are extensive or if the user may need to enter a choice manually, use
     a Combo Box instead.

To place a radio button on a form, click Radio button and then click the form.
Be sure to put the name of the database field or variable that you want to associate
with this control into the Input property.

 Property                                                                                       Service Manager 9.81
 Name
                                        Usage
 X
 Y                                      Specify a unique identifier for the
 Width                                  object on the screen. (Optional)
 Height
 Visible                                This name is used by external
                                        applications, such as RAD, to
 Visible Condition                      dynamically change the properties of
 Caption                                the object.
 Caption Condition
 Input                                  Specify the object’s horizontal position
                                        based on the left edge of the object.
This PDF was generated on May 23, 2026
                                        Specify the object’s vertical position
                                        based on the top edge of the object.

                                        Specify the width of the object in
                                        alignment grid units.

                                        Specify the height of the object in
                                        alignment grid units.

                                        Select this option to make the object
                                        visible on the form. Clear the checkbox
                                        to hide the object from view on the
                                        form.

                                        Specify an expression to override the
                                        Visible property when that expression
                                        evaluates to true.

                                        Specify a text caption for the object.

                                        Specify an expression to override the
                                        Caption property when that expression
                                        evaluates to true.

                                        Specify the database field or variable
                                        to associate with this control.

                                                                                                                        Page 210 of 369
Property                                                                                        Service Manager 9.81
Accessible Name
                                        Usage

                                        Specify a component name for use
                                        with accessibility software. (Optional)

                                        Note: This function is only supported
                                        by the Web client.

                                        If no name is present, the Web client
                                        defaults to looking for a nearby label to
                                        use for the name of the component. For
                                        buttons, checkboxes, or radio buttons,
                                        it uses the component’s text.
                                        Accessibility software can query the
                                        Web client to get this information and
                                        use it to present data to the user in a
                                        variety of ways. For example, speech
                                        simulation software says the name and
                                        the type of component when the
                                        component has focus.

 Property                                                                                       Service Manager 9.81
 Accessible Description
                                        Usage
 Tab Stop
 Foreground Color                       Specify a component description for
                                        use with accessibility software.
This PDF was generated on May 23, 2026  (Optional)

                                        Note: This function is only supported
                                        by the Web client.

                                        If no description is present, the Web
                                        client defaults to looking for a nearby
                                        label to use for the name of the
                                        component. For buttons, checkboxes,
                                        or radio buttons, the Web client will use
                                        the component’s text. Accessibility
                                        software can query the Web client to
                                        get this information, and use it to
                                        present it to the user in a variety of
                                        ways. For example, when a component
                                        gets focus, speech simulation software
                                        will say the name and the type of
                                        component, based on the settings in
                                        the Accessible Name and Accessible
                                        Description fields.

                                        Specify the tab sort order for this field.
                                        By default, the TAB key navigates the
                                        focus on a form from top to bottom and
                                        left to right. Objects that have a non-
                                        zero Tab Stop are visited first, in
                                        ascending order. For a button, file,
                                        radio button or checkbox, you will
                                        almost always use the default of 0.

                                        Select the text color from the drop-
                                        down list.

                                                                                                                        Page 212 of 369
 Property                                                                                       Service Manager 9.81
 Read-Only
                                        Usage
 Read-Only Condition
 Mandatory                              Select this option to disable editing
                                        capabilities and provide only viewing
 Mandatory Condition                    access to the field. Give read–only
 Data Changed Event                     fields a tab–stop value of –1 to prevent
 Value                                  users from tabbing into them.

Contents                                Specify an expression to override the
                                        Read-Only property when that
     1 Best practices                   expression evaluates to true.

This PDF was generated on May 23, 2026  Select this option so that a red asterisk
                                        indicating a required field is displayed.
                                        This is a visible change only.
                                        - To make the field mandatory for any
                                        form it appears on, use the System
                                        Definition Utility.
                                        - To make the field mandatory for a
                                        small number of forms only, use Format
                                        Control.

                                        Specify an expression to override the
                                        Mandatory property when that
                                        expression evaluates to true.

                                        Specify the option number (such as
                                        Button ID) to call if the data contained
                                        in the object changed. This sends an
                                        event to the display RAD application.

                                        Specify the value to assign to the field
                                        or variable specified in the Input
                                        property when a user selects this radio
                                        button.

                                                                                                                        Page 213 of 369

1.1.3.1.3.31. Selection tool

This button enables you to select, deselect, and modify design objects.
To select a control, click Selection tool and then click the control.
Switch from selection mode to creation mode
If you want to create multiple instances of an object, hold down the Ctrl key and click
anywhere on the drawing canvas.
Select one object
Click on the object. Grab points are displayed indicating that the object is selected.
Or, hold down the left mouse button and drag a lasso across any part of the object.
After lassoing the object, handles are displayed.
Select multiple objects
Hold down the Ctrl key and click on multiple objects one at a time. Grab points are
displayed on each object. The properties view displays the common properties of the
objects selected.
Or, drag and release a lasso across any part of the desired objects. After lassoing the
objects, handles are displayed on each object.
Clear one object
Hold down the Ctrl key and click on the object. Grab points disappear, indicating that
the object is no longer selected.
Clear multiple objects
Click on a blank area of the drawing canvas.
Position one object
Click on the object and continue holding down the left mouse button. Drag the object
to the desired position.
Position multiple objects
Hold down the Ctrl key and one at a time, click on the multiple objects you want to
position. The movement cursor appears when you hover over the selected objects.
At this point, you can drag and drop the objects as a group anywhere on the drawing
canvas.


Or, hold down the Ctrl key and one at a time, click on the multiple objects you want to
position. Then enter the X or Y coordinate for all the items in the properties editor. For
example, if you want to position multiple objects with the same left border, set the X
property. The Y property can be used in a similar way to position objects with the
same top border.

Resize an object

Select the object. Drag the object handles to resize the object.

Delete one or more objects

Select the object(s). Press the Delete key.

Related topics

Form creation
Forms Designer
Creating and editing forms
Using the drawing canvas
Forms Designer properties view
Setting properties
Forms Designer best practices
Building accessible forms
Access Forms Designer
Create a form using the Form Wizard
Update a form
Forms Designer controls and tools
Grid view tool
Web Preview tool


1.1.3.1.3.32. Script control

Use this control to add a color-coded syntax editor to a form. This enables the user to
enter JavaScript.
To place a script on a form, click Script and then click the form.
Be sure to put the name of the database field or variable that you want to associate
with this control into the Input property.

Property                                                                                        Service Manager 9.81
Name
                                        Usage
X
Y                                       Specify a unique identifier for the
Width                                   object on the screen. (Optional)
Height
Visible                                 This name is used by external
                                        applications, such as RAD, to
Visible Condition                       dynamically change the properties of
Input                                   the object.

                                        Specify the object’s horizontal position
                                        based on the left edge of the object.

                                        Specify the object’s vertical position
                                        based on the top edge of the object.

                                        Specify the width of the object in
                                        alignment grid units.

                                        Specify the height of the object in
                                        alignment grid units.

                                        Select this option to make the object
                                        visible on the form. Clear the checkbox
                                        to hide the object from view on the
                                        form.

                                        Specify an expression to override the
                                        Visible property when that expression
                                        evaluates to true.

                                        Specify the database field or variable
                                        to associate with this control.

Property                                                                                        Service Manager 9.81
Tab Stop
                                        Usage
Accessible Name
                                        Specify the tab sort order for this field.
                                        By default, the TAB key navigates the
                                        focus on a form from top to bottom and
                                        left to right. Objects that have a non-
                                        zero Tab Stop are visited first, in
                                        ascending order. For a button, file,
                                        radio button or checkbox, you will
                                        almost always use the default of 0.

                                        Specify a component name for use
                                        with accessibility software. (Optional)

                                        Note: This function is only supported
                                        by the Web client.

                                        If no name is present, the Web client
                                        defaults to looking for a nearby label to
                                        use for the name of the component. For
                                        buttons, checkboxes, or radio buttons,
                                        it uses the component’s text.
                                        Accessibility software can query the
                                        Web client to get this information and
                                        use it to present data to the user in a
                                        variety of ways. For example, speech
                                        simulation software says the name and
                                        the type of component when the
                                        component has focus.

Property                                                                                        Service Manager 9.81
Accessible Description
                                        Usage

                                        Specify a component description for
                                        use with accessibility software.
                                        (Optional)

                                                    Note

                                                   This function is only
                                                   supported by the Web
                                                   client.

                                                   If no description is present,
                                                   the Web client defaults to
                                                   looking for a nearby label
                                                   to use for the name of the
                                                   component. For buttons,
                                                   checkboxes, or radio
                                                   buttons, the Web client will
                                                   use the component’s text.
                                                   Accessibility software can
                                                   query the Web client to get
                                                   this information, and use it
                                                   to present it to the user in a
                                                   variety of ways. For
                                                   example, when a
                                                   component gets focus,
                                                   speech simulation software
                                                   will say the name and the
                                                   type of component, based
                                                   on the settings in the
                                                   Accessible Name and
                                                   Accessible Description
                                                   fields.

Property                                                                                        Service Manager 9.81
Script
                                        Usage

                                        Specify the type of script. The default
                                        is js for JavaScript.

                                        The Script Control on the Windows
                                        client has the following features:

                                             Content assist
                                             Syntax highlighting
                                             Quick outline
                                             Hyperlink
                                             Keyboard shortcuts
                                             Folding

                                        The Script Control on the web client
                                        has the following features:

                                             Syntax highlighting
                                             Keyboard shortcuts


1.1.3.1.3.33. Subform control

Use this control to display a subform on another form.
Subforms displayed on forms have full functionality. Subforms displayed as pop-ups
are read-only; users can't interact with them. To display the subform as a pop-up, use
the Comfill control instead.
To place a subform on a form, click Subform and then click the form.
Put the name of the database field or variable that you want to associate with this
control into the Input property.

 Property                                                                                       Service Manager 9.81
 Name
                                        Usage
 X
 Y                                      Specify a unique identifier for the
 Width                                  object on the screen. (Optional)
 Height
 Visible                                This name is used by external
 Visible Condition                      applications, such as RAD, to
 Format                                 dynamically change the properties of
 Virtual Join                           the object.

This PDF was generated on May 23, 2026  Specify the object’s horizontal position
                                        based on the left edge of the object.

                                        Specify the object’s vertical position
                                        based on the top edge of the object.

                                        Specify the width of the object in
                                        alignment grid units.

                                        Specify the height of the object in
                                        alignment grid units.

                                        Select this option to make the object
                                        visible on the form. Clear the checkbox
                                        to hide the object from view on the
                                        form.

                                        Specify an expression to override the
                                        Visible property when that expression
                                        evaluates to true.

                                        Specify the form to display. Be sure
                                        you type the exact form name.

                                        Select this option to associate virtual
                                        join run time processing with the
                                        subform object. Clear the checkbox to
                                        use a same-file join.

                                                                                                                        Page 222 of 369
Property                                                                                        Service Manager 9.81
Display Blank
                                        Usage
Display Using Table
Input                                   Select this option to display the
                                        subform even if no records were found
                                        for the virtual join. Clear the checkbox
                                        to skip display of the format if there are
                                        no matching records.

                                        Note: Used only for virtual joins.

                                        Select this option to display the
                                        subform in table format.

                                        Specify the database field or variable
                                        to associate with this control.

Related topics

Form creation
Forms Designer
Creating and editing forms
Using the drawing canvas
Forms Designer properties view
Forms Designer best practices
Building accessible forms
Access Forms Designer
Create a form using the Form Wizard
Update a form
Add a subform to a form
Forms Designer controls and tools
Comfill control


1.1.3.1.3.34. Table column control

Use this control to add a column to an existing table.

            Note

           To avoid unpredictable behavior, don't set a DVD condition to use a
           variable that's based on a record displayed in the Table widget.

To add a column to a table, click Table column and then click the table.
Be sure to put the name of the database field or variable that you want to associate
with this control into the Input property.

Best practice

Column headings should follow book title capitalization rules, for example, File Name
not file name or file.name.

 Property                                                                                       Service Manager 9.81
 Name
                                        Usage
 X
 Y                                      Specify a unique identifier for the
 Width                                  object on the screen. (Optional)
 Height
 Visible                                This name is used by external
                                        applications, such as RAD, to
 Visible Condition                      dynamically change the properties of
 Caption                                the object.
 Caption Condition
 Input                                  Specify the object’s horizontal position
                                        based on the left edge of the object.
This PDF was generated on May 23, 2026
                                        Specify the object’s vertical position
                                        based on the top edge of the object.

                                        Specify the width of the object in
                                        alignment grid units.

                                        Specify the height of the object in
                                        alignment grid units.

                                        Select this option to make the object
                                        visible on the form. Clear the checkbox
                                        to hide the object from view on the
                                        form.

                                        Specify an expression to override the
                                        Visible property when that expression
                                        evaluates to true.

                                        Specify a text caption for the object.

                                        Specify an expression to override the
                                        Caption property when that expression
                                        evaluates to true.

                                        Specify the database field or variable
                                        to associate with this control.

                                                                                                                        Page 225 of 369
Property                                                                                        Service Manager 9.81
Accessible Name
                                        Usage

                                        Specify a component name for use
                                        with accessibility software. (Optional)

                                        Note: This function is only supported
                                        by the Web client.

                                        If no name is present, the Web client
                                        defaults to looking for a nearby label to
                                        use for the name of the component. For
                                        buttons, checkboxes, or radio buttons,
                                        it uses the component’s text.
                                        Accessibility software can query the
                                        Web client to get this information and
                                        use it to present data to the user in a
                                        variety of ways. For example, speech
                                        simulation software says the name and
                                        the type of component when the
                                        component has focus.

 Property                                                                                       Service Manager 9.81
 Accessible Description
                                        Usage
 Field
 Column Width Percent                   Specify a component description for
 Minimum Column Width                   use with accessibility software.
 Clickable Title                        (Optional)

This PDF was generated on May 23, 2026  Note: This function is only supported
                                        by the Web client.

                                        If no description is present, the Web
                                        client defaults to looking for a nearby
                                        label to use for the name of the
                                        component. For buttons, checkboxes,
                                        or radio buttons, the Web client will use
                                        the component’s text. Accessibility
                                        software can query the Web client to
                                        get this information, and use it to
                                        present it to the user in a variety of
                                        ways. For example, when a component
                                        gets focus, speech simulation software
                                        will say the name and the type of
                                        component, based on the settings in
                                        the Accessible Name and Accessible
                                        Description fields.

                                        In the case where the array specified in
                                        the input property is an array of
                                        structure, it specifies the field in the
                                        structure for this object.

                                        Enables you to set the column width to
                                        a percentage of the page.

                                        Enables you to set the minimum width
                                        of the column in a table.

                                        Select this option to allow the user to
                                        click the title.

                                                                                                                        Page 227 of 369
Property                                                                                        Service Manager 9.81
Button ID
Show Title                              Usage
Value List
                                        When an individual column Button ID is
                                        set to 0, the Default Button ID is used.

                                        Select this option to make the title
                                        appear in the table.

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

                                        This property is supported only in
                                        association with the toolbar
                                        configuration Knowledge Management
                                        Extended, which is not intended to be
                                        used outside of the out-of-box
                                        Knowledge Management module.

 Property                                                                                       Service Manager 9.81
 Image File
                                        Usage
This PDF was generated on May 23, 2026
                                        Specifies the name of an image file to
                                        display on the control. The image file
                                        must reside in one of the following
                                        paths:

                                        Windows client:

                                             <Service
                                             Manager>\Client\plugins\com.hp.
                                             ov.sm.client.common_x.xx.xxx\src
                                             \resources\icons
                                             A local directory on the client
                                             machine, which is specified in the
                                             Image path field (Window >
                                             Preferences). For example:
                                             C:\smCustomImages.

                                        Web client:

                                             <Service Manager web
                                             tier>\images. For example:
                                             <Tomcat>\webapps\webtier-
                                             x.xx\images.

                                                    Note

                                                   You don't need to include
                                                   the image file suffix for this
                                                   property; the image file
                                                   name must be unique.

                                        For example, you would like to display
                                        an image instead of text for the Priority
                                        column. To do this, follow these steps:

                                           1. Open the probsummary.qbe.g
                                             form in the Design view of Forms
                                             Designer

                                                                                                                        Page 229 of 369
Property                                                                                        Service Manager 9.81
Display List
                                        Usage

                                           2. In the left-hand pane, click the
                                             Priority column header.

                                           3. In the right-hand (Table Column)
                                             pane, update the Value List option
                                             to "1;2;3;4" and the Image File
                                             option to "critical;high;mid;low".

                                           4. Add four image files (named
                                             "critical.png", "high.png",
                                             "mid.png", and "low.png") to the
                                             following paths:

                                                   Windows client:

                                                   ...\plugins\com.hp.ov.sm.clie
                                                   nt.common_x.xx\src\resourc
                                                   es\icons\obj16

                                                   Web client on Tomcat (for
                                                   example):

                                                   ...\
                                                   <Tomcat>\webapps\webtier-
                                                   x.xx\images\obj16

                                        Specify the values that appear in the
                                        drop-down list at run time. There must
                                        be a one–to–one correspondence
                                        between the values for Value List and
                                        for Display List. If the Display List is the
                                        only populated property, the display
                                        values are what is written to the
                                        database.

Property                                                                                        Service Manager 9.81
Select Only
                                        Usage
Read-Only
Maximum Chars                           Setting Select Only to Yes by checking
Maximum Characters Beep                 the box requires the user to select from
Case Conversion                         the Combo Box drop-down list. If the
                                        user makes a manual entry, the value
                                        must already exist in the drop-down list
                                        (defined in the Value List and Display
                                        List properties).

                                        Setting it to No by leaving the box
                                        unchecked allows the user to select
                                        from the drop-down list or to manually
                                        enter a value. No works with or without
                                        a drop-down list as defined in the and
                                        Display List properties.

                                        Select this option to disable editing
                                        capabilities and provide only viewing
                                        access to the field. Give read–only
                                        fields a tab–stop value of –1 to prevent
                                        users from tabbing into them.

                                        Specify the number of characters the
                                        user can enter in the field. The default
                                        is 0 (unlimited).

                                        When set to Yes by checking the box, it
                                        notifies the user by sounding a beep
                                        that they reached the maximum
                                        number of characters. Not available on
                                        UNIX systems.

                                        Specify how to change the case of text
                                        entered in the field. The choices are
                                        None, Upper, Lower.

Property                                                                                        Service Manager 9.81
Decimals
                                        Usage
Parse
                                        Specify the number of decimal points
Justification                           for numbers in this field.
Input Conversion
                                        Service Manager modifies numbers
                                        entered in the field to the number of
                                        decimal points you specify.

                                        Select this option to verify that the text
                                        entered in a field is the correct syntax.
                                        The syntax for the field is defined by
                                        the type of field it displays (date,
                                        expression, number, and so forth).

                                        Specify the justification for the object
                                        label as Left, Right, or Center.

                                        Specify the name of an
                                        Input Conversion routine. This property
                                        is used by RAD subroutines that mask
                                        the display of data on an input field, or
                                        check and validate the entry of data
                                        into an input field. If specified, the
                                        routine is called at runtime to convert
                                        the contents of the field before it is
                                        displayed on the screen. For more
                                        information, refer to RAD input and
                                        output conversion.

 Property                                                                                       Service Manager 9.81
 Mask
                                        Usage
 Output Conversion
 Password                               Specify the mask value (the condition
                                        that sets a value to be passed for this
This PDF was generated on May 23, 2026  field to the input and output conversion
                                        routines). When a field has a mask
                                        value and you save the record, the
                                        format of the mask value displays in
                                        the field. For example, you decide to
                                        update the purchase cost information
                                        of a contract in Configuration
                                        Management. You enter a date in the
                                        Currency EX Date field of the Financial
                                        tab as 02/26/09. The condition for the
                                        mask value is set as: xxx dd,yyyy.
                                        When you save the record, the
                                        Currency Ex Date field displays the
                                        date format of February 26, 2009. Valid
                                        values for the mask vary depending on
                                        the routine being called.

                                        Specify the name of an
                                        Output Conversion routine. This
                                        property is used by RAD subroutines
                                        that mask the display of data on an
                                        output field, or check and validate the
                                        entry of data into an input field. If
                                        specified, the routine is called at
                                        runtime to convert the contents of the
                                        field before it is displayed on the
                                        screen. For more information, refer to
                                        RAD input and output conversion.

                                        Select this option to make the text
                                        entered in the field a series of asterisks
                                        on the screen. The data is not
                                        encrypted, just transposed.

                                                                                                                        Page 233 of 369
````
