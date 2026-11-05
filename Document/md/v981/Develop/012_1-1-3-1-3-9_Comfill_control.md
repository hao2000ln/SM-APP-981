---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.3.1.3.9 .. 1.1.3.1.3.13
printed_pages: 286-321
---

# 1.1.3.1.3.9 Comfill control

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.3.1.3.9. Comfill control

Use this control to add a combination Combo Box and Fill button. Comfill has all the
properties of a Combo Box, plus the capability for Fill button. You can select which
comfill buttons to display. For example, to display just a Fill button, set the Third
Button Visible property to true by selecting the checkbox and set the Combo Button
Visible property to false, by clearing the checkbox.

You can specify a form to display as a pop-up when the user hovers over the comfill.
Subforms displayed as pop-ups are read-only; users can't interact with them. If you
want your users to be able to interact with the form, you must display the subform on
another form instead of as a pop-up. To display the form as a subform, use the
subform control.

To place a comfill box on a form, click Comfill and then click the form.

Put the name of the database field or variable that you want to associate with this
control into the Input property.

Best practice

Use image id=7 for fill boxes. Find and Fill buttons should not use the down arrow
icon, because it makes the Find or Fill look like a Combo Box.

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

                                        Unused.

                                        Unused.

                                        Specify the database field or variable
                                        to associate with this control.

                                                                                                                        Page 103 of 369
Property                                                                                        Service Manager 9.81
Accessible Name
                                        Usage

                                        Specify a component name for use
                                        with accessibility software. (Optional)

                                                    Note

                                                   This function is only
                                                   supported by the Web
                                                   client.

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
                                        Specify a component description for
This PDF was generated on May 23, 2026  use with accessibility software.
                                        (Optional)

                                                    Note

                                                   This function is only
                                                   supported by the Web
                                                   client.

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

                                                                                                                        Page 105 of 369
Property                                                                                        Service Manager 9.81
Read-Only
Read-Only Condition                     Usage
Mandatory
                                        Select this option to disable editing
Mandatory Condition                     capabilities and provide only viewing
                                        access to the field. Give read–only
                                        fields a tab–stop value of –1 to prevent
                                        users from tabbing into them.

                                        Specify an expression to override the
                                        Read-Only property when that
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

 Property                                                                                       Service Manager 9.81
 Mandatory For Read-Only
 Array Length                           Usage

This PDF was generated on May 23, 2026  If you set this option to true, the system
                                        displays the mandatory icon on the
                                        read-only Comfill widgets. You must
                                        add appropriate accessible
                                        descriptions to guide users how to fill
                                        the value for the mandatory and read-
                                        only fields.

                                                    Note

                                                   This function is only
                                                   supported by the Web
                                                   client.

                                        Specify the size of the scrolling region
                                        used to view array entries. A scroll bar
                                        appears beside the fields to allow users
                                        to view the array entries.

                                             If a field is assigned an Array
                                             Length of 5, the form stacks five
                                             fields vertically to allow users to
                                             view the five array entries.
                                             If the Input data type is scalar,
                                             only a single text box appears.

                                                    Note

                                                   The screen object must be
                                                   associated with an array
                                                   data structure.

                                        The default is 0, which means one
                                        vertical line of information appears.
                                        You can set this value to any positive
                                        integers.

                                                                                                                        Page 107 of 369
Property                                                                                        Service Manager 9.81
Password
Maximum Chars                           Usage
Maximum Characters Beep
Case Conversion                         Select this option to make the text
Decimals                                entered in the field a series of asterisks
                                        on the screen. The data is not
Parse                                   encrypted, just transposed.

Data Changed Event                      Specify the number of characters the
                                        user can enter in the field. The default
                                        is 0 (unlimited).

                                        Select this option to notify the user by
                                        sounding a beep that they reached the
                                        maximum number of characters.

                                        Specify how to change the case of text
                                        entered in the field. The choices are
                                        None, Upper, Lower.

                                        Specify the number of decimal points
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

                                                                                                                        Page 109 of 369
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

                                                                                                                        Page 110 of 369
Property                                                                                        Service Manager 9.81
Display List Condition
Box Lines                               Usage
Select Only
                                        Specify an expression to override the
Input Conversion                        Display List property, when the
                                        expression evaluates to True.

                                        Specify the window size of the drop-
                                        down list.

                                        Selecting the checkbox requires the
                                        user to select from the Combo Box
                                        drop-down list. If the user makes a
                                        manual entry, the value must already
                                        exist in the drop-down list (defined in
                                        the Value List and Display List
                                        properties). Before you select this
                                        option, make sure that the Combo
                                        Button Visible option is also selected.

                                        Clearing the checkbox allows the user
                                        to select from the drop-down list or to
                                        manually enter a value.

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

Property                                                                                        Service Manager 9.81
Mask
                                        Usage
Output Conversion
                                        Specify the mask value (the condition
Combo Button Visible                    that sets a value to be passed for this
Combo Button Visible Condition          field to the input and output conversion
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

                                        Select this option to make the Combo
                                        Button visible when the form opens.

                                        Specify an expression to override the
                                        ComboButton Visible property when
                                        that expression evaluates to true.

Property                                                                                        Service Manager 9.81
Fill Button ID
                                        Usage
Fill Button Image
                                        Specify a Control ID to transmit when
Fill Button Visible                     clicked. For example, 3 corresponds to
Fill Button Visible Condition           F3, and 0 corresponds to Enter.

Third Button ID                         Specify an icon to display on the field,
                                        if desired. You can select from 1 to 17.
Third Button Image                      The default value is 7.

Third Button Visible                    Select this option to make the Fill
Third Button Visible Condition          Button visible when the form opens.

Popup Subform Format                    Specify an expression to override the
Popup Subform Input                     Fill Button Visible property when that
Popup Subform Enabled                   expression evaluates to true.

                                        Specify a Control ID to transmit when
                                        clicked. For example, 3 corresponds to
                                        F3, and 0 corresponds to Enter.

                                        Specify an icon to display on the field,
                                        if desired. You can select from 1 to 17.
                                        The default value is 10.

                                        Select this option to make the Third
                                        Button visible when the form opens.

                                        Specify an expression to override the
                                        Third Button Visible property when that
                                        expression evaluates to true.

                                        Specify the form to display.

                                        Specify the database field or variable
                                        to associate with this control.

                                        Select this option to enable the Popup
                                        Subform for this control.

Property                                                                                        Service Manager 9.81
Popup Subform Enabled Condition
                                        Usage
Auto Complete
                                        Specify an expression to override the
                                        Popup Subform Enabled property when
                                        that expression evaluates to true.

                                        Enable the auto complete feature for
                                        this control.

                                                    Note

                                                   This setting takes effect
                                                   only when the
                                                   comfillAutoComplete
                                                   parameter is set to true.

Related topics

Creating and editing forms
Using the drawing canvas
Forms Designer properties view
Using pop-ups
Forms Designer best practices
Access Forms Designer
Create a form using the Form Wizard
Update a form
Add a subform to a form
Checkbox control
Combo Box control
Radio button control
Subform control
Forms Designer controls and tools


1.1.3.1.3.10. Convert Form Layout tool

This button converts all of the fields on the left side of the form into one group, and
converts each of the notebook tabs on the right into groups, arranged vertically,
under the left side fields. These groups are collapsible when displayed in the Web
client.

When you click this button, a dialog box will display to inform you that the action will
modify the form layout to use collapsible sections and that this can't be undone after
you have saved the form. If you click Yes to proceed, the new layout is displayed. All
of the fields and controls that were on the left side of the form are now contained in
one Group. Clicking at the top of the group displays the Properties for the group. You
will see that the following checkboxes are already selected:

     Floating group enabled: The group to change its relative position on the form so
     that it's not hidden when sections above it expand downward, and doesn't leave
     a blank spot after being collapsed.
     Collapse enabled: The group is displayed as a collapsible group that can be
     expanded and collapsed by the user.
     Default to Expanded: The collapsible group is expanded (open), by default. The
     user can close it if desired.

You can scroll down to see that the fields that were previously contained in the first
(leftmost) notebook tab are also now contained in a Group. The Default to Expanded
checkbox is not selected, so that this group will display as collapsed by default, until
the user opens it.

If you scroll down further you will see the contents of each of the notebook tabs,
previously displayed from left to right, are now displayed as groups, from top to
bottom.

If you want to change the order of the sections, you can do so by changing the Y
coordinate, which controls the vertical placement of the group on the form.

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


1.1.3.1.3.11. Date control

Use this control to add a text box that displays and enables users to update the
contents of a date field.
To place a date field on a form, click Date and then click the form.
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

                                                                                                                        Page 118 of 369
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

Property                                                                                        Service Manager 9.81
Accessible Description
                                        Usage
Tab Stop
                                        Specify a component description for
                                        use with accessibility software.
                                        (Optional)

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

Property                                                                                        Service Manager 9.81
Input Conversion
                                        Usage
Mask
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
                                        mask value is set as: xxx dd,yyyy.
                                        When you save the record, the
                                        Currency Ex Date field displays the
                                        date format of February 26, 2009. Valid
                                        values for the mask vary depending on
                                        the routine being called.

 Property                                                                                       Service Manager 9.81
 Output Conversion
                                        Usage
 Read-Only
 Read-Only Condition                    Specify the name of an
 Parse                                  Output Conversion routine. This
 Mandatory                              property is used by RAD subroutines
                                        that mask the display of data on an
This PDF was generated on May 23, 2026  output field, or check and validate the
                                        entry of data into an input field. If
                                        specified, the routine is called at
                                        runtime to convert the contents of the
                                        field before it is displayed on the
                                        screen. For more information, refer to
                                        RAD input and output conversion.

                                        Select this option to disable editing
                                        capabilities and provide only viewing
                                        access to the field. Give read–only
                                        fields a tab–stop value of –1 to prevent
                                        users from tabbing into them.

                                        Specify an expression to override the
                                        Read-Only property when that
                                        expression evaluates to true.

                                        Select this option to verify that the text
                                        entered in a field is the correct syntax.
                                        The syntax for the field is defined by
                                        the type of field it displays (date,
                                        expression, number, and so forth).

                                        Select this option so that a red asterisk
                                        indicating a required field is displayed.
                                        This is a visible change only.

                                        - To make the field mandatory for any
                                        form it appears on, use the System
                                        Definition Utility.
                                        - To make the field mandatory for a
                                        small number of forms only, use Format
                                        Control.

                                                                                                                        Page 122 of 369
Property                                                                                        Service Manager 9.81
Mandatory Condition
                                        Usage
Array Length
                                        Specify an expression to override the
                                        Mandatory property when that
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

 Property                                                                                       Service Manager 9.81
 Type
                                        Usage
 Time Zone
                                        Specify the format of the date value.
This PDF was generated on May 23, 2026
                                        There are three formats available:
                                        the date/time format (such as 2023/1/1,
                                        01:01:01, or 2023/1/1 01:01:01) date
                                        format (such as 2023/1/1), and the
                                        duration time format (such as 1
                                        01:01:01).

                                        When this Type value is empty, both
                                        the date/time format and the duration
                                        time format are allowed.

                                        When this Type value is set
                                        as Datetime, only the date/time format
                                        is allowed.

                                        When this Type value is set as Date-
                                        only, only the date format is allowed.

                                        When this Type value is set
                                        as Duration, only the duration time
                                        format is allowed.

                                        Specify the time zone for the date set
                                        in the Date control widgets. For
                                        example, suppose there is a Planned
                                        Start Date control on a form and you
                                        have set the Time Zone property of this
                                        control to US/Mountain . The Planned
                                        Start Date field displays the
                                        US/Mountain time zone as you
                                        specified instead of the operator’s
                                        actual time zone.

                                        Note: This Property works no matter
                                        the Duration property is selected or
                                        not.

                                                                                                                        Page 124 of 369
Property                                                                                        Service Manager 9.81
Time Zone Field
                                        Usage
Data Changed Event
                                        Specify the field that indicates the time
                                        zone for the date set in the duration
                                        property.

                                        Specify the option number (such as
                                        Button ID) to call if the data contained
                                        in the object changed. This sends an
                                        event to the display RAD application.


1.1.3.1.3.12. Decimal control

Use this control to add an input field that accepts only numeric input and offers
spinner buttons or a slider to increase or decrease a value.
To place a decimal field on a form, click Decimal and then click the form.
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

                                                                                                                        Page 127 of 369
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

Property                                                                                        Service Manager 9.81
Accessible Description
                                        Usage
Tab Stop
                                        Specify a component description for
                                        use with accessibility software.
                                        (Optional)

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

Property                                                                                        Service Manager 9.81
Input Conversion
                                        Usage
Mask
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
                                        mask value is set as: xxx dd,yyyy.
                                        When you save the record, the
                                        Currency Ex Date field displays the
                                        date format of February 26, 2009. Valid
                                        values for the mask vary depending on
                                        the routine being called.

Property                                                                                        Service Manager 9.81
Output Conversion
                                        Usage
Read-Only
Read-Only Condition                     Specify the name of an
Decimals                                Output Conversion routine. This
Parse                                   property is used by RAD subroutines
                                        that mask the display of data on an
                                        output field, or check and validate the
                                        entry of data into an input field. If
                                        specified, the routine is called at
                                        runtime to convert the contents of the
                                        field before it is displayed on the
                                        screen. For more information, refer to
                                        RAD input and output conversion.

                                        Select this option to disable editing
                                        capabilities and provide only viewing
                                        access to the field. Give read–only
                                        fields a tab–stop value of –1 to prevent
                                        users from tabbing into them.

                                        Specify an expression to override the
                                        Read-Only property when that
                                        expression evaluates to true.

                                        Specify the number of decimal points
                                        for numbers in this field.

                                        Service Manager modifies numbers
                                        entered in the field to the number of
                                        decimal points you specify.

                                        Select this option to verify that the text
                                        entered in a field is the correct syntax.
                                        The syntax for the field is defined by
                                        the type of field it displays (date,
                                        expression, number, and so forth).

Property                                                                                        Service Manager 9.81
Mandatory
                                        Usage
Mandatory Condition
Maximum Value                           Select this option so that a red asterisk
Minimum Value                           indicating a required field is displayed.
Step                                    This is a visible change only.

                                        - To make the field mandatory for any
                                        form it appears on, use the System
                                        Definition Utility.
                                        - To make the field mandatory for a
                                        small number of forms only, use Format
                                        Control.

                                        Specify an expression to override the
                                        Mandatory property when that
                                        expression evaluates to true.

                                        Set the maximum value that a spinner
                                        button or a slider can reach.

                                        Set the minimum value that a spinner
                                        button or a slider can reach.

                                        Specify a large step value to be used
                                        when pressing Page Up or Page Down.
                                        The default value is 5.

                                        Note: In this release, this value applies
                                        to the slider view only.

Property                                                                                        Service Manager 9.81
Slider View
                                        Usage

                                        Select this option to display the decimal
                                        control as a slider. If this option is not
                                        selected, the system displays the
                                        decimal control as spinner buttons.

                                        Note: You must sepcify the Maximum
                                        Value and the Minimum Value for the
                                        slider view. If these two fields are
                                        blank, the system uses the default
                                        values of 100 and 0, respectively.

                                        Note: The web client accessible mode
                                        doesn't support the slider view. In
                                        addition, the right-to-left languages
                                        doesn't support the slider view as well.


1.1.3.1.3.13. Dynamic Form control

Use this control to add a dynamic form that becomes visible when populated by XML
from a RAD application or JavaScript. The aspect and content of the dynamic form
depend on the XML.

To place a dynamic form on a form, click Dynamic Form and then click the form.
Be sure to put the name of the database field or variable that you want to associate
with this control into the Input property.

To view the dynamic form, open the form on which it is located with Database
Manager. Each time you save changes in Forms Designer, exit the form and reload it
in Database Manager.

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
Read-Only                               the object.

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

                                        Select this option to disable editing
                                        capabilities and provide only viewing
                                        access to the field. Give read–only
                                        fields a tab–stop value of –1 to prevent
                                        users from tabbing into them.

Property                                                                                        Service Manager 9.81
Read-Only Condition
Input                                   Usage
Tab Stop
                                        Specify an expression to override the
Content Always Visible                  Read-Only property when that
                                        expression evaluates to true.

                                        Specify the database field or variable
                                        to associate with this control.

                                        Specify the tab sort order for this field.
                                        By default, the TAB key navigates the
                                        focus on a form from top to bottom and
                                        left to right. Objects that have a non-
                                        zero Tab Stop are visited first, in
                                        ascending order. For a button, file,
                                        radio button or checkbox, you will
                                        almost always use the default of 0.

                                        If this option is selected, all the content
                                        inside the dynamic form will be
                                        displayed, despite the visible condition
                                        set for each widget. Usually this
                                        property is set to true only for a
                                        dynamic form in a preview page.
````
