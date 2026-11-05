---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.3.1.3.21 .. 1.1.3.1.3.27
printed_pages: 353-386
---

# 1.1.3.1.3.21 HTML Viewer control

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.3.1.3.21. HTML Viewer control

Use this control to add an HTML Viewer that enables users to view the HTML created
using the HTML Editor.
To place an HTML Viewer on a form, click HTML Viewer and then click the form.
Be sure to put the name of the database field or variable that you want to associate
with this control into the Input property.
Warning: Keep in mind that text you copy and paste from other sources may contain
formatting tags, even if it looks like plain text.

Property                                                                                        Service Manager 9.81
Accessible Description
                                        Usage
Height
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

                                        Specify the height of the object in
                                        alignment grid units.

 Property                                                                                       Service Manager 9.81
 HTML-Generating Script
                                        Usage
 Input
 Name                                   A Javascript function that generates
 Tab Stop                               the content for the HTML Viewer. For
                                        example, open the form
This PDF was generated on May 23, 2026  "configurationItem" in Forms Designer.
                                        On the "CI Changes" notebook page
                                        there is an HTML Viewer which has
                                        "configurationManagement.getPending
                                        Changes" for that property. To see this
                                        function, type sl in the command line,
                                        and then type
                                        configurationManagement in the
                                        Name field. Click Search, and then
                                        scroll down. You will see the
                                        "getPendingChanges" function.

                                        Specify the database field or variable
                                        to associate with this control.

                                        Specify a unique identifier for the
                                        object on the screen. (Optional)

                                        This name is used by external
                                        applications, such as RAD, to
                                        dynamically change the properties of
                                        the object.

                                        Specify the tab sort order for this field.
                                        By default, the TAB key navigates the
                                        focus on a form from top to bottom and
                                        left to right. Objects that have a non-
                                        zero Tab Stop are visited first, in
                                        ascending order. For a button, file,
                                        radio button or checkbox, you will
                                        almost always use the default of 0.

                                                                                                                        Page 171 of 369
 Property                                                                                       Service Manager 9.81
 Use client styling
                                        Usage
 Visible
 Visible Condition                      Select this option to display an HTML
 Width                                  snippet.
 X                                      The viewer will display the text
                                        respecting the font, font size, margins
This PDF was generated on May 23, 2026  and background color set in the client.
                                        A fully defined HTML document may
                                        not display correctly.

                                        Note: Mark the checkbox for Service
                                        Catalog.

                                        Clear the checkbox to display a fully
                                        defined HTML document. A fully
                                        defined HTML document contains &ltl>
                                        <head></head><body></body>
                                        </html>. If the input doesn't contain
                                        any HTML formatting it will display
                                        plain text.

                                        Note: Clear the checkbox for
                                        Knowledge Management.

                                        Select this option to make the object
                                        visible on the form. Clear the checkbox
                                        to hide the object from view on the
                                        form.

                                        Specify an expression to override the
                                        Visible property when that expression
                                        evaluates to true.

                                        Specify the width of the object in
                                        alignment grid units.

                                        Specify the object’s horizontal position
                                        based on the left edge of the object.

                                                                                                                        Page 172 of 369
Property                                                                                        Service Manager 9.81
Y
Frameborder                             Usage

Standards Mode                          Specify the object’s vertical position
                                        based on the top edge of the object.

                                        Specify whether a border is displayed
                                        around the HTML viewer. If you don't
                                        specify anything or enter 1, a border is
                                        displayed. If you enter 0, there is no
                                        border.

                                        Select this option if you want the web
                                        browser to render the HTML document
                                        in Standards Mode. When this option is
                                        selected, a DOCTYPE is added to the
                                        beginning of the document.


1.1.3.1.3.22. Image control

Use this control to add an image from a Microsoft Windows image file.
To place an image on a form, click Image and then click the form.
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
 Input                                  dynamically change the properties of
 Read-Only                              the object.

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

                                                                                                                        Page 175 of 369
Property                                                                                        Service Manager 9.81
Read-Only Condition
                                        Usage
Image
                                        Specify an expression to override the
                                        Read-Only property when that
                                        expression evaluates to true.

                                        Specifies the name of an image file to
                                        display on the control. The image file
                                        must reside in any of the following
                                        paths, in which Service Manager looks
                                        for the image:

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

                                                   When you specify the
                                                   image file for this property,
                                                   you need to provide both
                                                   the file name and the file
                                                   name extension.

Property                                                                                        Service Manager 9.81
Image Condition
                                        Usage

                                        Specify an expression to override the
                                        Image property when that expression
                                        evaluates to true.

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
Attachments control
Forms Designer controls and tools


1.1.3.1.3.23. Journal Updates Viewer
control

Use this control to add a Journal Updates Viewer that enables users to view the
journal updates.
To place a Journal Updates Viewer on a form, click Journal Updates Viewer and then
click the form.

Property                                                                                        Service Manager 9.81
Name
X                                       Usage
Y
Width                                   (Optional) Specify a unique identifier
Height                                  for the object on the screen.
Visible
                                        Specify the object’s horizontal position
Visible Condition                       based on the left edge of the object.

Input                                   Specify the object’s vertical position
Tab Stop                                based on the top edge of the object.

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

                                        Specify the tab sort order for this field.
                                        By default, the TAB key navigates the
                                        focus on a form from top to bottom and
                                        left to right. Objects that have a non-
                                        zero Tab Stop are visited first, in
                                        ascending order. For a button, file,
                                        radio button, or checkbox, you will
                                        almost always use the default of 0.

Property                                                                                        Service Manager 9.81
Accessible Description
                                        Usage
Login Name Conversion
                                        (Optional) Specify a component
                                        description for use with accessibility
                                        software.

                                        Note: This function is only supported
                                        by the web client.

                                        If no description is present, the web
                                        client defaults to looking for a nearby
                                        label to use for the name of the
                                        component. For buttons, checkboxes,
                                        or radio buttons, the web client will use
                                        the component's text. Accessibility
                                        software can query the web client to
                                        get this information and use it to
                                        present it to the user in a variety of
                                        ways. For example, when a component
                                        gets focus, speech simulation software
                                        will say the name and the type of
                                        component, based on the settings in
                                        the Accessible Name and Accessible
                                        Description fields.

                                        Select this option to display the
                                        operator’s Full Name for updates. If not
                                        selected, the operator’s name will be
                                        displayed according to the environment
                                        settings.


1.1.3.1.3.24. Label control

Use this control to add a label. A label is a single line of text you can use to give titles
to forms, give labels to objects within the form, or otherwise place text on the form.

To place a label on a form, click Label and then click the form.
Be sure to put the name of the database field or variable that you want to associate
with this control into the Input property.

Best practices

     Use black for label text.
     Left-align label text and end it with a colon.
     Do not create colored text "drop shadows." These don't render well in the Web
     client.
     Labels on menu forms (for example, menu.gui.home) should have a font
     increase of 2.

 Property                                                                                       Service Manager 9.81
 Name
                                        Usage
 X
 Y                                      Specify a unique identifier for the
 Width                                  object on the screen. (Optional)
 Height                                 This name is used by external
 Visible                                applications, such as RAD, to
                                        dynamically change the properties of
 Visible Condition                      the object.
 Caption
 Caption Condition                      Specify the object’s horizontal position
 Input                                  based on the left edge of the object.

This PDF was generated on May 23, 2026  Specify the object’s vertical position
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

                                                                                                                        Page 182 of 369
Property                                                                                        Service Manager 9.81
Label for
                                        Usage
Foreground Color
Foreground Color Condition              Specify the name of a control that uses
Background Color                        this label.
Background Color Condition
                                        If you want to use this label for multiple
                                        controls, you need to specify
                                        semicolon-separated control names.

                                                    Note

                                                   If you specify a variable for
                                                   this label, you need to
                                                   provide a valid value here.
                                                   Otherwise, the label can't
                                                   be read by JAWS.

                                        Select the text color from the drop-
                                        down list.

                                        Specify a formula to evaluate the
                                        ForeColor property at run time. The
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

Property                                                                                        Service Manager 9.81
Background Style
                                        Usage
Font
Bold                                    Applies to the display of the label in the
Bold Condition                          Web client only. Select Underline to
Italic                                  display the label as underlined text.
Italic Condition                        Select Solid Background to display the
Font Increase                           label background as a solid colored
Font Increase Condition                 bar.

                                        Select a font for the text of your label,
                                        table, timer, or marquee caption from
                                        the drop-down list.

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

                                        Specify the amount, in points, to
                                        increase or decrease the standard font
                                        size.

                                        Specify an expression to override the
                                        Font Increase property when that
                                        expression evaluates to true.

 Property                                                                                       Service Manager 9.81
 Array Length
                                        Usage
 Heading Level
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

                                        The default value is 0, which means
                                        one vertical line of information
                                        appears.

                                                    Note

                                                   The screen object must be
                                                   associated with an array
                                                   data structure.

                                        Specify the heading level for this
                                        control so that a corresponding HTML
                                        heading tag (<h1> to <h6>) is
                                        generated.

                                                    Note

                                                   This function is only
                                                   supported by the Web
                                                   client.

                                                                                                                        Page 185 of 369
Property                                                                                        Service Manager 9.81
Justification
                                        Usage
                                        Specify the justification for the object
                                        label as Left, Right, or Center.

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
Link label control
Wrap label control
Forms Designer controls and tools


1.1.3.1.3.25. Link label control

Use this control to add a label that includes a caption and an icon that links to another
source.
To place a link label on a form, click Link label and then click the form.
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

                                                                                                                        Page 188 of 369
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
 Button ID                              Specify a component description for
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

                                        Specify a numeric identification that
                                        specifies a Control ID to transmit when
                                        clicked.

                                                                                                                        Page 190 of 369
 Property                                                                                       Service Manager 9.81
 Button ID Condition
 Image                                  Usage

 Description                            Specify an expression to override the
                                        Button ID property when that
This PDF was generated on May 23, 2026  expression evaluates to true.

                                        Specifies the name of an image file to
                                        display on the control. The image file
                                        must reside in any of the following
                                        paths, in which Service Manager looks
                                        for the image:
                                        Windows client:

                                             <Service
                                             Manager>\Client\plugins\com.hp.
                                             ov.sm.client.common_x.xx.xxx\src
                                             \resources\icons
                                             A local directory on the client
                                             machine, which is specified in the
                                             Image path field (Window >
                                             Preferences). For example,
                                             C:\smCustomImages.

                                        Web client:

                                             <Service Manager web
                                             tier>\images\obj16

                                                    Note

                                                   When you specify the
                                                   image file for this property,
                                                   you need to provide both
                                                   the file name and the file
                                                   name extension.

                                        Specify the description text for the
                                        label.

                                                                                                                        Page 191 of 369
Property                                                                                        Service Manager 9.81
Balloon Help
Button Action                           Usage
Button Action Params
                                        Specify the text string to display when
Enabled                                 the cursor is held over the button to
Enabled Condition                       offer more information about the
                                        button’s function.

                                        Specify an action for the button. The
                                        available options is Open Smart Search
                                        Widget.

                                        Specify a parameter for the button
                                        action.

                                                    Note

                                                   The button action that's
                                                   currently available doesn't
                                                   need a parameter.

                                        Specify an initial state.

                                        Specify a condition that enables the
                                        button when a table row is selected.
                                        Example: [%tablename] == "selected"
                                        or [%tablename] != "selected" where
                                        tablename is the value of the Name
                                        property of the table on the screen.


1.1.3.1.3.26. List Builder control

Use this control to add a compound widget that allows the user to construct a list of
choices.

To place a List Builder on a form, click List Builder and then click the form.

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

 Property                                                                                       Service Manager 9.81
 Accessible Description
                                        Usage
 Allow Duplicates
 Choices Name                           Specify a component description for
 Display List                           use with accessibility software.
                                        (Optional)
This PDF was generated on May 23, 2026
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

                                        Click the box to allow duplicate items.

                                        Specify a label for the Choices list.

                                        Specify the values that appear in the
                                        drop-down list at run time. There must
                                        be a one–to–one correspondence
                                        between the values for and for Display
                                        List. If the Display List is the only
                                        populated property, the display values
                                        are what is written to the database.

                                                                                                                        Page 196 of 369
Property                                                                                        Service Manager 9.81
Display List Condition
Selection Name                          Usage
Sortable
Value List                              Specify an expression to override the
                                        Display List property when that
Value List Condition                    expression evaluates to true.

                                        Specify a label for the Selections list.

                                        Click the box to allow reordering of the
                                        list items.

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

                                        Specify an expression to override the
                                        Value List property when that
                                        expression evaluates to true.


1.1.3.1.3.27. Marquee control

Use this control to add an attention–getting text message that scrolls continuously
across the screen from right to left.
To place a marquee on a form, click Marquee and then click the form. Be sure to put
the name of the database field or variable that you want to associate with this control
into the Input property.
Mozilla-based browsers don't support the marqee tag and thus can't display them in
Web client forms.

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

                                                                                                                        Page 199 of 369
Property                                                                                        Service Manager 9.81
Foreground Color
Background Color                        Usage

Font                                    Select the text color from the drop-
Bold                                    down list.
Italic
Font Increase                           Specify the Background Color. You
                                        must select the Opaque property
                                        checkbox for the Back Color to have an
                                        effect. The only Background Color
                                        available for a Windows client marquee
                                        is black.

                                        Select a font for the text of your label,
                                        table, timer, or marquee caption from
                                        the drop-down list.

                                        Select this option to apply bold to the
                                        label, default text, frame caption, or
                                        marquee caption.

                                        Select this option to apply italics to
                                        your label, default font, or caption.

                                        Specify the amount, in points, to
                                        increase or decrease the standard font
                                        size.

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
````
