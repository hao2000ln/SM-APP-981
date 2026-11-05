---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.3.1.3.5 .. 1.1.3.1.3.8
printed_pages: 263-286
---

# 1.1.3.1.3.5 Chart control

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.3.1.3.5. Chart control

Use this control to add a chart that displays the contents of a numeric array as a two–
dimensional, color–coded bar chart with optional, definable buttons.
To place a chart on a form, click Chart and then click the form.
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
Caption                                 the object.

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

                                        Specify a list of values to display in the
                                        chart.
                                        Example: 3;4;10;3

 Property                                                                                       Service Manager 9.81
 Input
                                        Usage
 Tab Stop
                                        Specify the database field or variable
 Foreground Color                       to associate with this control.
 Balloon Help                           For more information on what to pass
 Bar Width                              to the field or variable refer to the
 Scale Max                              Publish and Subscribe Help.
 Button Base
                                        Specify the tab sort order for this field.
This PDF was generated on May 23, 2026  By default, the TAB key navigates the
                                        focus on a form from top to bottom and
                                        left to right. Objects that have a non-
                                        zero Tab Stop are visited first, in
                                        ascending order. For a button, file,
                                        radio button or checkbox, you will
                                        almost always use the default of 0.

                                        Select the text color from the drop-
                                        down list.

                                        Specify the text string to display when
                                        the cursor is held over the button to
                                        offer more information about the
                                        button’s function.

                                        Specify the width of bars in alignment
                                        grid units.

                                        Specify the maximum vertical bar
                                        height. Columns that exceed the Scale
                                        Max setting appear clipped. A setting
                                        of 0 causes the chart to automatically
                                        scale vertically to the tallest column.

                                        Select this option to enable a row of
                                        buttons across the base of the chart,
                                        one button per column.

                                                                                                                          Page 81 of 369
 Property                                                                                       Service Manager 9.81
 Base Button ID
                                        Usage
 Color List
                                        Specify the Control ID for the left-most
 Color Scale                            chart button. It is incremented by one
 Color Percent                          from left to right. Using the default
                                        value of 801 as an example, the left-
Related topics                          most button would transmit 801, the
                                        second button from the left would
This PDF was generated on May 23, 2026  transmit 802, the third 803, and so
                                        forth.

                                        The Base Button ID relates to an option
                                        number in the menu record. Assign
                                        Button IDs to the chart and create an
                                        associated option number in the menu
                                        record, so that each button calls a
                                        stored query.

                                        Specify a list of semicolon delimited
                                        colors. The Color Scale and Color
                                        Percent properties determine how the
                                        list is applied to the columns. The
                                        available colors are: black, red, green,
                                        blue, gray, light gray, dark gray, yellow,
                                        cyan, magenta, white, forest, navy,
                                        purple, teal, brick, and manila.

                                        Specify a list of semicolon delimited
                                        numeric values to determine the color
                                        of a column.

                                        Select this option to use the Color
                                        Scale property a list of percentages
                                        from 1 to 100.

                                                                                                                          Page 82 of 369

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
Button control
Forms Designer controls and tools


1.1.3.1.3.6. Checkbox control

Use this control to add a checkbox that displays and enables users to update the
contents of a Boolean (logical) field, which can evaluate to true, false, unknown, or
null.

To place a checkbox on a form, click Checkbox and then click the form.
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

                                                                                                                          Page 85 of 369
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
                                        Web client to get this information, and
                                        use it to present it to the user in a
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
                                        get this information. The client uses
                                        that information to present data to the
                                        user in a variety of ways. For example,
                                        speech simulation software will say the
                                        name and the type of component when
                                        the component gets focus, based on
                                        the settings in the Accessible Name
                                        and Accessible Description fields.

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

                                                                                                                          Page 87 of 369
 Property                                                                                       Service Manager 9.81
 Read-Only
 Read-Only Condition                    Usage
 Array Length
                                        Select this option to disable editing
 Data Changed Event                     capabilities and provide only viewing
                                        access to the field. Give read–only
This PDF was generated on May 23, 2026  fields a tab–stop value of –1 to prevent
                                        users from tabbing into them.

                                        Specify an expression to override the
                                        Read-Only property when that
                                        expression evaluates to true.

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

                                        Specify the option number (such as
                                        Button ID) to call if the data contained
                                        in the object changed. This sends an
                                        event to the display RAD application.

                                                                                                                          Page 88 of 369

1.1.3.1.3.7. CMS Topology control

Use this control to add a CMS Topology that enables Web client users to view the
Topology and Impact through the UCMDB Gateway.
To place a CMS Topology on a form, click CMS Topology and then click the form.

 Property                                                                                       Service Manager 9.81
 Name
 X                                      Usage
 Y
 Width                                  (Optional) Specify a unique identifier
 Height                                 for the object on the screen.
 Visible
                                        Specify the object’s horizontal position
 Visible Condition                      based on the left edge of the object.
 Input
                                        Specify the object’s vertical position
 Customer Id                            based on the top edge of the object.
 Type
                                        Specify the width of the object in
This PDF was generated on May 23, 2026  alignment grid units.

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
                                        to associate with the global ID. Only the
                                        value corresponding to the global ID in
                                        UCMDB is valid.

                                        Specify the customer ID.

                                        Specify the type of the CMS Topology.
                                        Select Impact to view the Show Impact
                                        widget, or select Topology to view the
                                        Topology widget.

                                                                                                                          Page 90 of 369
Property                                                                                        Service Manager 9.81
Tab Stop
                                        Usage
Accessible Description
                                        Specify the tab sort order for this field.
                                        By default, the TAB key navigates the
                                        focus on a form from top to bottom and
                                        left to right. Objects that have a non-
                                        zero Tab Stop are visited first, in
                                        ascending order. For a button, file,
                                        radio button, or checkbox, you will
                                        almost always use the default of 0.

                                        (Optional) Specify a component
                                        description for use with accessibility
                                        software.

                                        Note: This function is only supported
                                        by the Web client.

                                        If no description is present, the Web
                                        client defaults to looking for a nearby
                                        label to use for the name of the
                                        component. For buttons, checkboxes,
                                        or radio buttons, the Web client will use
                                        the component's text. Accessibility
                                        software can query the Web client to
                                        get this information and use it to
                                        present it to the user in a variety of
                                        ways. For example, when a component
                                        gets focus, speech simulation software
                                        will say the name and the type of
                                        component, based on the settings in
                                        the Accessible Name and Accessible
                                        Description fields.


1.1.3.1.3.8. Combo Box control

Use this control to add a Combo Box that enables users to click a button and select
from a drop-down list. The items in the list are associated with a database field or
variable. Users can also type in a value if the checkbox in the selectonly property is
cleared (set to false).

To place a Combo Box on a form, click Combo Box and then click the form.
Be sure to put the name of the database field or variable that you want to associate
with this control into the Input property.

Best practice

Use eight drop–down lines unless the drop–down set contains a fixed number of
elements less than or equal to seven, in which case the number of lines should be
equal to the number of elements in the drop–down set.

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

                                                                                                                          Page 93 of 369
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

                                                                                                                          Page 95 of 369
Property                                                                                        Service Manager 9.81
Read-Only Condition
Mandatory                               Usage

Mandatory Condition                     Specify an expression to override the
Mandatory For Read-Only                 Read-Only property when that
                                        expression evaluates to true.

                                        Select this option so that a red asterisk
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

                                        If you set this option to true, the system
                                        displays the mandatory icon on the
                                        read-only Combo Box widgets. You
                                        must add appropriate accessible
                                        descriptions to guide users how to fill
                                        the value for the mandatory and read-
                                        only fields.

                                                    Note

                                                   This function is only
                                                   supported by the Web
                                                   client.

 Property                                                                                       Service Manager 9.81
 Array Length
                                        Usage
 Password
 Maximum Chars                          Specify the size of the scrolling region
 Maximum Characters Beep                used to view array entries. A scroll bar
 Case Conversion                        appears beside the fields to allow users
                                        to view the array entries.
This PDF was generated on May 23, 2026
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

                                        Select this option to make the text
                                        entered in the field a series of asterisks
                                        on the screen. The data is not
                                        encrypted, just transposed.

                                        Specify the number of characters the
                                        user can enter in the field. The default
                                        is 0 (unlimited).

                                        Select this option to notify the user by
                                        sounding a beep that they reached the
                                        maximum number of characters.

                                        Specify how to change the case of text
                                        entered in the field. The choices are
                                        None, Upper, Lower.

                                                                                                                          Page 97 of 369
Property                                                                                        Service Manager 9.81
Decimals
                                        Usage
Parse
Data Changed Event                      Specify the number of decimal points
                                        for numbers in this field.

                                        Service Manager modifies numbers
                                        entered in the field to the number of
                                        decimal points you specify.

                                        Select this option to verify that the text
                                        entered in a field is the correct syntax.
                                        The syntax for the field is defined by
                                        the type of field it displays (date,
                                        expression, number, and so forth).

                                        Specify the option number (such as
                                        Button ID) to call if the data contained
                                        in the object changed. This sends an
                                        event to the display RAD application.

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

                                        This property is supported only in
                                        association with the toolbar
                                        configuration Knowledge Management
                                        Extended, which is not intended to be
                                        used outside of the out-of-box
                                        Knowledge Management module.

                                        Note: When defining Value List and
                                        Display List properties, you should
                                        avoid using the following reserved
                                        characters:

                                             semicolon (;)
                                             tab key
                                             newline (carriage return)
                                             form feed
                                             backspace
                                             equal sign (=)

                                        Important: Do not use keys (like
                                        backspace), as the system can't
                                        process their ASCII representation
                                        entries correctly which causes
                                        unpredictable results.

                                                                                                                          Page 99 of 369
 Property                                                                                       Service Manager 9.81
 Value List Condition
 Display List                           Usage

This PDF was generated on May 23, 2026  Specify an expression to override the
                                        property when that expression
                                        evaluates to true.

                                        Specify the values that appear in the
                                        drop-down list at run time. There must
                                        be a one–to–one correspondence
                                        between the values for Value List and
                                        for Display List. If the Display List is the
                                        only populated property, the display
                                        values are written to the database.

                                        This property is supported only in
                                        association with the toolbar
                                        configuration Knowledge Management
                                        Extended, which is not intended to be
                                        used outside of the out-of-box
                                        Knowledge Management module.

                                        Note: When defining Value List and
                                        Display List properties, you should
                                        avoid using the following reserved
                                        characters:

                                             semicolon (;)
                                             tab key
                                             newline (carriage return)
                                             form feed
                                             backspace
                                             equal sign (=)

                                        Important: Do not use keys (like
                                        backspace), as the system can't
                                        process their ASCII representation
                                        entries correctly which causes
                                        unpredictable results.

                                                                                                                        Page 100 of 369
 Property                                                                                       Service Manager 9.81
 Display List Condition
 Box Lines                              Usage
 Select Only
                                        Specify an expression to override the
Contents                                Display List property, when the
                                        expression evaluates to True.
     1 Best practice
                                        Specify the window size of the drop-
                                        down list.

                                        Select this option to require the user to
                                        select from the Combo Box drop-down
                                        list. If the user makes a manual entry,
                                        the value must already exist in the
                                        drop-down list (defined in the Value
                                        List and Display List properties).

                                        Clear this option to allow the user to
                                        select from the drop-down list or to
                                        manually enter a value.
````
