---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.3.1.3.35 .. 1.1.3.1.3.41
printed_pages: 418-451
---

# 1.1.3.1.3.35 Table control

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.3.1.3.35. Table control

Use this control to add a table that displays one or more columns of data in a
scrollable pane. The tables you create in the Form Designer appear as a rectangular
region subdivided by rows and columns. The look and feel mimics tables in Microsoft
Office applications, such as Excel.

Table have the following features:

     Cells may display text or images.
     Columns may vary in width. The user can resize the columns using the mouse.
     Columns may have an optional heading button, which can be mapped to perform
     an action.
     All rows are the same height, defined by the table's font.
     The user can scroll through data by use of scroll bars or the keyboard.
     All expected keyboard navigation is supported (Up, Down, Next, Prev, Last, First,
     and so forth)
     You can edit cells or make them read-only.
     Selecting a read-only cell results in a highlight of the entire row.
     Selecting an cell to edit results in the in-place creation of an edit field or drop-
     down Combo Box that lets the user edit the cell.
     Users can edit a field by clicking on it or by pressing the Enter key while the
     table has focus. Tabbing events received while the table is in edit mode result in
     navigation from one cell to the next. Pressing Enter while a cell is being edited
     results in the changes being accepted and the cell‘s row being highlighted.
     Tabbing events received when a row is highlighted are handled by passing focus
     to the next object in the window.

            Note

           To avoid unpredictable behavior, don't set a DVD condition to use a
           variable that's based on a record displayed in the Table widget. The only
           exception is the Foreground Color Condition property, which takes effect
           at the record level.

To place a table on a form, click Table and then click the form.

Property                                                                                        Service Manager 9.81
Name
                                        Usage
X
Y                                       Specify a unique identifier for the
Width                                   object on the screen. (Optional)
Height
Visible                                 This field is required if you enable the
                                        Multiple Selection property. This name
Visible Condition                       is used by external applications, such
                                        as RAD, to dynamically change the
                                        properties of the object.

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

Property                                                                                        Service Manager 9.81
Tab Stop
                                        Usage
Font
Foreground Color Condition              Specify the tab sort order for this field.
Bold Condition                          By default, the TAB key navigates the
Italic Condition                        focus on a form from top to bottom and
Font Increase                           left to right. Objects that have a non-
Read-Only                               zero Tab Stop are visited first, in
                                        ascending order. For a button, file,
                                        radio button or checkbox, you will
                                        almost always use the default of 0.

                                        Select a font for the text of your label,
                                        table, timer, or marquee caption from
                                        the drop-down list.

                                        Specify a formula to evaluate the
                                        ForeColor property at run time. The
                                        result of this evaluation overrides the
                                        value assigned to the property.

                                        Specify an expression to override the
                                        Bold property when that expression
                                        evaluates to true.

                                        Specify an expression to override the
                                        Italic property when that expression
                                        evaluates to true.

                                        Specify the amount, in points, to
                                        increase or decrease the standard font
                                        size.

                                        Select this option to disable editing
                                        capabilities and provide only viewing
                                        access to the field. Give read–only
                                        fields a tab–stop value of –1 to prevent
                                        users from tabbing into them.

Property                                                                                        Service Manager 9.81
Read-Only Condition
                                        Usage
Columns
Column Headings                         Specify an expression to override the
                                        Read-Only property when that
                                        expression evaluates to true.

                                        Specify a list of columns in the table.

                                        Select this option to make the column
                                        headings appear above the columns.

 Property                                                                                       Service Manager 9.81
 Multiple Selection
                                        Usage
 Selection Field
                                        Select this option to allow the user to
This PDF was generated on May 23, 2026  select several rows in the table. Clear
                                        the checkbox to allow the user to
                                        select just one row.

                                                    Note

                                                        If you enable this
                                                        option, you must enter
                                                        the associated table's
                                                        name in the Name
                                                        property.
                                                        The Multiple Selection
                                                        property in Forms
                                                        Designer has no
                                                        effect on enabling or
                                                        disabling the multi-
                                                        select capability when
                                                        performing a fill from
                                                        an array field.
                                                        The Multiple Selection
                                                        functionality applies
                                                        to multiple rows in a
                                                        single table only. Even
                                                        if this option is
                                                        enabled, selecting
                                                        multiple rows in
                                                        multiple tables will
                                                        lead to unexpected
                                                        results.

                                        Select this option to allow the user to
                                        select several rows in the table. Clear
                                        the checkbox to allow the user to
                                        select just one row.

                                                                                                                        Page 238 of 369
 Property                                                                                       Service Manager 9.81
 Default Button ID
 Double–Click Button ID                 Usage
 Double–Click Field
 Accessible Description                 When an individual column Button ID is
                                        set to 0, the Default Button ID is used.
This PDF was generated on May 23, 2026
                                        Specify the Button ID returned by the
                                        double-click action.

                                        Specify the field to return to
                                        cursor.field.contents() which can then
                                        be used in a query to find the record.

                                        Specify a component description for
                                        use with accessibility software (JAWS).
                                        (Optional)

                                                    Note

                                                   This function is supported
                                                   only by the web client.

                                        If no description is present, the Web
                                        client uses the default table summary
                                        as described below:

                                             For a record list on a list page or
                                             on the list panel of a list-detail
                                             page: Record List + [grouped by]
                                             + [sorted by] +
                                             [ascending/descending].
                                             Example: Record List Sorted by
                                             Update Time Ascending 11x51
                                             For a Table widget on a detail
                                             form: Table.
                                             Example: Table 4x3

                                                                                                                        Page 239 of 369

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
Table column control
Forms Designer controls and tools


1.1.3.1.3.36. Text control

Use this control to add a text box that displays the contents of a text field and
conditionally enables users to enter or modify its contents.
To place a text box on a form, click Text and then click the form.
Be sure to put the name of the database field or variable that you want to associate
with this control into the Input property.

 Property                                                                                       Service Manager 9.81
 Name
                                        Usage
 X
 Y                                      Specify a unique identifier for the
 Width                                  object on the screen. (Optional)
 Height
 Visible Condition                      This name is used by external
 Visible                                applications, such as RAD, to
                                        dynamically change the properties of
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

                                        Specify an expression to override the
                                        Visible property when that expression
                                        evaluates to true.

                                        Select this option to make the object
                                        visible on the form. Clear the checkbox
                                        to hide the object from view on the
                                        form.

                                        Specify a text caption for the object.

                                        Specify an expression to override the
                                        Caption property when that expression
                                        evaluates to true.

                                        Specify the database field or variable
                                        to associate with this control.

                                                                                                                        Page 242 of 369
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
 Read-Only                              Specify a component description for
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
                                        get this information and use it to
                                        present it to the user in a variety of
                                        ways. For example, when a component
                                        gets focused, speech simulation
                                        software will say the name and the
                                        type of component, based on the
                                        settings in the Accessible Name and
                                        Accessible Description fields.

                                        Specify the tab sort order for this field.
                                        By default, the TAB key navigates the
                                        focus on a form from top to bottom and
                                        left to right. Objects that have a non-
                                        zero Tab Stop are visited first, in
                                        ascending order. For a button, file,
                                        radio button, or checkbox, you will
                                        almost always use the default of 0.

                                        Select this option to disable editing
                                        capabilities and provide only viewing
                                        access to the field. Give read-only
                                        fields a tab–stop value of –1 to prevent
                                        users from tabbing into them.

                                                                                                                        Page 244 of 369
Property                                                                                        Service Manager 9.81
Read-Only Condition
Mandatory                               Usage

Mandatory Condition                     Specify an expression to override the
Password                                Read-Only property when that
Maximum Chars                           expression evaluates to true.
Maximum Characters Beep
Case Conversion                         Setting Mandatory to Yes by checking
                                        the box indicates that the field is
                                        required and therefore a red asterisk
                                        indicates a required field is displayed.
                                        This is a visible change only. To make
                                        the field mandatory for any form it
                                        appears on, use the System Definition
                                        Utility. To make the field mandatory for
                                        a small number of forms only, use
                                        Format Control.

                                        Specify an expression to override the
                                        Mandatory property when that
                                        expression evaluates to true.

                                        Select this option to make the text
                                        entered in the field a series of asterisks
                                        on the screen. The data is not
                                        encrypted, just transposed.

                                        Specify the number of characters the
                                        user can enter in the field. The default
                                        is 0 (unlimited).

                                        Select this option to notify the user by
                                        sounding a beep that they reached the
                                        maximum number of characters. This is
                                        unavailable on UNIX systems.

                                        Specify how to change the case of text
                                        entered in the field. The choices are
                                        None, Upper, Lower.

Property                                                                                        Service Manager 9.81
Decimals
                                        Usage
Parse
Array Length                            Specify the number of decimal points
                                        for numbers in this field.

                                        Service Manager modifies numbers
                                        entered in the field to the number of
                                        decimal points you specify.

                                        Select this option to verify that the text
                                        entered in a field is the correct syntax.
                                        The syntax for the field is defined by
                                        the type of field it displays (date,
                                        expression, number, and so forth).

                                        Specify the size of the scrolling region
                                        used to view array entries. A scroll bar
                                        appears beside the fields to allow users
                                        to view the array entries.

                                        - If a field is assigned an Array Length
                                        of 5, the form stacks five fields
                                        vertically to allow users to view the five
                                        array entries.
                                        - If Array Length is set to -1, the form
                                        dynamically creates as many fields as
                                        there are entries in the array.
                                        - If the Input data type is scalar, only a
                                        single text box appears.

                                        Note: The screen object must be
                                        associated with an array data structure.

                                        The default is 0, which means one
                                        vertical line of information appears.

Property                                                                                        Service Manager 9.81
Input Conversion
                                        Usage
Mask
                                        Specify the name of an
                                        Input Conversion routine. This property
                                        is used by RAD subroutines that mask
                                        the display of data on an input field or
                                        check and validate the entry of data
                                        into an input field. If specified, the
                                        routine is called at runtime to convert
                                        the contents of the field before it is
                                        displayed on the screen. For more
                                        information, refer to RAD input and
                                        output conversion.

                                        Specify the mask value (the condition
                                        that sets a value to be passed for this
                                        field to the input and output conversion
                                        routines). When a field has a mask
                                        value and you save the record, the
                                        format of the mask value displays in
                                        the field. For example, you decide to
                                        update the purchase cost information
                                        of a contract in Configuration
                                        Management. You enter a date in the
                                        Currency EX Date field of the Financial
                                        tab as 02/26/09. The condition for the
                                        mask value is set as xxx dd,yyyy.
                                        When you save the record, the
                                        Currency Ex Date field displays the
                                        date format of February 26, 2009. Valid
                                        values for the mask vary depending on
                                        the routine being called.

Property                                                                                        Service Manager 9.81
Output Conversion
                                        Usage
Placeholder
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

                                        Specify the placeholder that is
                                        displayed in the text control.


1.1.3.1.3.37. Text area control

Use this control to add a text area that displays the contents of a text field and
conditionally enables users to input several lines of data. This object contains scroll
bars and allows text wrapping.

            Note

           A field associated to a text area must be defined as an array of characters
           in the dbdict.

To place a text area on a form, click Text area and then click the form.
Be sure to put the name of the database field or variable that you want to associate
with this control into the Input property.

Using URLs in text areas

Text areas (including those in dynamic forms) support clickable URLs. When a text
area is not in focus (that is, when it is in view mode), URLs in the text area are
displayed as hyperlinks. Clicking the hyperlink opens the URL in a new page of the
browser. When a text area is in focus (that is, when it is in edit mode), you can modify
the text in the text area, but the URL is not displayed as a hyperlink and is not
clickable.

The following URL protocols are clickable when used in text areas:

     http://
     https://
     ftp://
     notes://

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

                                                                                                                        Page 250 of 369
Property                                                                                        Service Manager 9.81
Accessible Name
                                        Usage

                                        Specify a component name for use
                                        with accessibility software. (Optional)

                                        Note:This function is only supported by
                                        the web client.

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
 Read-Only                              Specify a component description for
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

                                        Select this option to disable editing
                                        capabilities and provide only viewing
                                        access to the field. Give read–only
                                        fields a tab–stop value of –1 to prevent
                                        users from tabbing into them.

                                                                                                                        Page 252 of 369
Property                                                                                        Service Manager 9.81
Read-Only Condition
Mandatory                               Usage

Mandatory Condition                     Specify an expression to override the
Password                                Read-Only property when that
Maximum Chars                           expression evaluates to true.
Maximum Characters Beep
Case Conversion                         Select this option so that a red asterisk
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

                                        Select this option to make the text
                                        entered in the field a series of asterisks
                                        on the screen. The data is not
                                        encrypted, just transposed.

                                        Specify the number of characters the
                                        user can enter in the field. The default
                                        is 0 (unlimited).

                                        Select this option to notify the user by
                                        sounding a beep that they reached the
                                        maximum number of characters. This is
                                        unavailable on UNIX systems.

                                        Specify how to change the case of text
                                        entered in the field. The choices are
                                        None, Upper, Lower.

Property                                                                                        Service Manager 9.81
Decimals
                                        Usage
Parse
Extend Enabled                          Specify the number of decimal points
                                        for numbers in this field.

                                        Service Manager modifies numbers
                                        entered in the field to the number of
                                        decimal points you specify.

                                        Select this option to verify that the text
                                        entered in a field is the correct syntax.
                                        The syntax for the field is defined by
                                        the type of field it displays (date,
                                        expression, number, and so forth).

                                        Select this option to display two
                                        buttons (Expand and Restore) above
                                        this control in the web client. Each time
                                        you click the Expand button, the height
                                        of the text area is increased by 40px.
                                        After clicking the Restore button, the
                                        height is restored to the initial value.


1.1.3.1.3.38. Tag control

Use this control to add a text box that displays the contents of a text field and
conditionally enables users to enter one or more tags.
To place a text box on a form, click Tag and then click the form.
Be sure to put the name of the database field or variable that you want to associate
with this control into the Input property.

Property                                                                                        Service Manager 9.81
Name
                                        Usage
X
Y                                       (Optional) Specify a unique identifier
Width                                   for the object on the screen.
Height
Visible Condition                       This name is used by external
Visible                                 applications, such as RAD, to
                                        dynamically change the properties of
Input                                   the object.

                                        Specify the object's horizontal position
                                        based on the left edge of the object.

                                        Specify the object's vertical position
                                        based on the top edge of the object.

                                        Specify the width of the object in
                                        alignment grid units.

                                        Specify the height of the object in
                                        alignment grid units.

                                        Specify an expression to override the
                                        Visible property when that expression
                                        evaluates to true .

                                        Select this option to make the object
                                        visible on the form. Clear the checkbox
                                        to hide the object from view on the
                                        form.

                                        Specify the database field or variable
                                        to associate with this control.

Property                                                                                        Service Manager 9.81
Tab Stop
                                        Usage
Read-Only
Read-Only Condition                     Specify the tab sort order for this field.
Mandatory                               By default, the TAB key navigates the
                                        focus on a form from top to bottom and
Mandatory Condition                     left to right. Objects that have a non-
                                        zero Tab Stop are visited first, in
                                        ascending order. For a button, file,
                                        radio button, or checkbox, you will
                                        almost always use the default of 0.

                                        Select this option to disable editing
                                        capabilities and provide only viewing
                                        access to the field. Give read-only
                                        fields a tab-stop value of -1 to prevent
                                        users from tabbing into them.

                                        Specify an expression to override the
                                        Read-Only property when that
                                        expression evaluates to true .

                                        Setting Mandatory to Yes by checking
                                        the box indicates that the field is
                                        required and therefore a red asterisk
                                        indicating a required field is displayed.
                                        This is a visible change only. To make
                                        the field mandatory for any form it
                                        appears on, use the System Definition
                                        Utility. To make the field mandatory for
                                        a small number of forms only, use
                                        Format Control.

                                        Specify an expression to override the
                                        Mandatory property when that
                                        expression evaluates to true .


1.1.3.1.3.39. Timer control

Use this control to add a clock timer to the form. The timer initiates events at a certain
time, based on settings in the Input and Expiration Event fields.
To place a clock timer on a form, click Timer and then click the form.
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

                                                                                                                        Page 259 of 369
 Property                                                                                       Service Manager 9.81
 Font
 Foreground Color                       Usage
 Foreground Color Condition
 Background Color                       Select a font for the text of your label,
                                        table, timer, or marquee caption from
 Background Color Condition             the drop-down list.
 Bold
 Bold Condition                         Select the text color from the drop-
 Italic                                 down list.
 Italic Condition
                                        Specify a formula to evaluate the
This PDF was generated on May 23, 2026  ForeColor property at run time. The
                                        result of this evaluation overrides the
                                        value assigned to the property.

                                        Specify the Background Color. You
                                        must select the Opaque property
                                        checkbox for the Back Color to have an
                                        effect. The only Background Color
                                        available for a Windows client marquee
                                        is black.

                                        Specify an expression to override the
                                        BackColor property when that
                                        expression evaluates to true.

                                        Select this option to apply bold to the
                                        label, default text, frame caption, or
                                        marquee caption.

                                        Specify an expression to override the
                                        Bold property when that expression
                                        evaluates to true.

                                        Select this option to apply italics to
                                        your label, default font, or caption.

                                        Specify an expression to override the
                                        Italic property when that expression
                                        evaluates to true.

                                                                                                                        Page 260 of 369
 Property                                                                                       Service Manager 9.81
 Font Increase
 Font Increase Condition                Usage
 Output Conversion
 Array Length                           Specify the amount, in points, to
                                        increase or decrease the standard font
This PDF was generated on May 23, 2026  size.

                                        Specify an expression to override the
                                        Font Increase property when that
                                        expression evaluates to true.

                                        Specify the name of an
                                        Output Conversion routine. If specified,
                                        the routine is called at runtime to
                                        convert the contents of the field before
                                        it is displayed on the screen. For more
                                        information, refer to RAD input and
                                        output conversion.

                                        Specify the size of the scrolling region
                                        used to view array entries. A scroll bar
                                        appears beside the fields to allow users
                                        to view the array entries.

                                        - If a field is assigned an Array Length
                                        of 5, the form stacks five fields
                                        vertically to allow users to view the five
                                        array entries.
                                        - If Array Length is set to -1, the form
                                        dynamically creates as many fields as
                                        there are entries in the array.
                                        - If the Input data type is scalar, only a
                                        single text box appears.

                                        Note: The screen object must be
                                        associated with an array data structure.

                                        The default is 0, which means one
                                        vertical line of information appears.

                                                                                                                        Page 261 of 369
Property                                                                                        Service Manager 9.81
Expiration Color
                                        Usage
Expiration Event
                                        Specify the color that the timer should
                                        change to when it reaches zero.

                                        Specify the event to send to the server
                                        when the timer reaches zero. Specify a
                                        numeric value; for example, a button or
                                        event ID.

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
Date control
Decimal control
Forms Designer controls and tools


1.1.3.1.3.40. Visualization control

Use this control to graphically display Configuration Item (CI) relationships.

 Property                                                                                       Service Manager 9.81
 Name
                                        Usage
 X
 Y                                      Specify a unique identifier for the
 Width                                  object on the screen. (Optional)
 Height
 Visible                                This name is used by external
 Visible Condition                      applications, such as RAD, to
 Input                                  dynamically change the properties of
 Read–Only                              the object.

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

                                        Specify the database field or variable
                                        to associate with this control.

                                        Select this option to disable editing
                                        capabilities and provide only viewing
                                        access to the field. Give read–only
                                        fields a tab–stop value of –1 to prevent
                                        users from tabbing into them.

                                                                                                                        Page 264 of 369
 Property                                                                                       Service Manager 9.81

 Read–Only                              Usage

 Condition                              Specify an expression to override the
                                        Read-Only property when that
Related topics                          expression evaluates to true.

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
Attachments control
Forms Designer controls and tools


1.1.3.1.3.41. Web Preview tool

This button enables you to see a preview of what the form will look like when
displayed by the Web client. The preview doesn't take into account any active DVD on
the form.

Click Web Preview to display the form in the Web Preview tab.

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
Selection tool
````
