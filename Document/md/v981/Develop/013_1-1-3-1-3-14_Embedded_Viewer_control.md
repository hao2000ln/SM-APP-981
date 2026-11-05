---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.3.1.3.14 .. 1.1.3.1.3.20
printed_pages: 321-353
---

# 1.1.3.1.3.14 Embedded Viewer control

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.3.1.3.14. Embedded Viewer control

Use this control to add an Embedded Viewer that enables Web client users to view
integrations.
To place an Embedded Viewer on a form, click Embedded Viewer and then click the
form.
Be sure to put the name of the database field or variable that you want to associate
with this control into the Input property.

 Property                                                                                       Service Manager 9.81
 Accessible Description
                                        Usage
 Frameborder
 Height                                 Specify a component description for
 Input                                  use with accessibility software.
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

                                        Specify whether a border is displayed
                                        around the embedded viewer. If you
                                        don't specify anything or enter 1, a
                                        border is displayed. If you enter 0,
                                        there is no border.

                                        Specify the height of the object in
                                        alignment grid units.

                                        Specify the database field or variable
                                        to associate with this control.

                                                                                                                        Page 138 of 369
 Property                                                                                       Service Manager 9.81
 Name
                                        Usage
 Tab Stop
                                        Specify a unique identifier for the
 Use client styling                     object on the screen. (Optional)
 Visible
 Visible Condition                      This name is used by external
 Width                                  applications, such as RAD, to
 X                                      dynamically change the properties of
                                        the object.
This PDF was generated on May 23, 2026
                                        Specify the tab sort order for this field.
                                        By default, the TAB key navigates the
                                        focus on a form from top to bottom and
                                        left to right. Objects that have a non-
                                        zero Tab Stop are visited first, in
                                        ascending order. For a button, file,
                                        radio button or checkbox, you will
                                        almost always use the default of 0.

                                        Select this option to display content
                                        with the font, font size, margins and
                                        background color set in the client.

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

                                                                                                                        Page 139 of 369
Property                                                                                        Service Manager 9.81
Y
                                        Usage
                                        Specify the object’s vertical position
                                        based on the top edge of the object.


1.1.3.1.3.15. File control

Use this control to enable users to launch a File Open dialog box and upload or
download files.

To place a file on a form, click File and then click the form.
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
Mandatory
                                        Usage
Mandatory Condition
Transfer direction                      Select this option so that a red asterisk
                                        indicating a required field is displayed.
File Directory                          This is a visible change only.

                                        - To make the field mandatory for any
                                        form it appears on, use the System
                                        Definition Utility.
                                        - To make the field mandatory for a
                                        small number of forms only, use Format
                                        Control.

                                        Specify an expression to override the
                                        Mandatory property when that
                                        expression evaluates to true.

                                        Specify whether you want the user to
                                        be able to download or upload the file.
                                        The default is download.

                                        Note: If you don't have the transfer
                                        direction set properly, the user will get
                                        an error message and will not be able
                                        to upload/download the file. For
                                        example, if pressing the Specify File
                                        button gets the following error
                                        message, "File not found. Please verify
                                        the correct file name was given.", you
                                        may need to change the transfer
                                        direction from upload to download.

                                        Specify the absolute path to a
                                        directory. For example, c:/temp. If no
                                        directory is specified, the Service
                                        Manager RUN directory defaults.

Property                                                                                        Service Manager 9.81
File Type
                                        Usage
Title
                                        Specify the MIME–type of the file the
                                        File Open dialog prompts for. For
                                        example, .txt for text files. If no MIME
                                        type is specified, the default is All Files
                                        (*.*) .

                                        Specify the name of the file you want
                                        to transfer.


1.1.3.1.3.16. Frame control

Use this control to add a container that creates a cosmetic rectangular border. Use
bevel frames to make your forms more attractive or easier to understand.
To place a frame on a form, click Frame and then click the form.

 Property                                                                                       Service Manager 9.81
 Name
                                        Usage
 X
 Y                                      Specify a unique identifier for the
 Width                                  object on the screen. (Optional)
 Height
 Visible                                This name is used by external
 Visible Condition                      applications, such as RAD, to
 Background Color                       dynamically change the properties of
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

                                        Specify the Background Color. You
                                        must select the Opaque property
                                        checkbox for the Back Color to have an
                                        effect. The only Background Color
                                        available for a Windows client marquee
                                        is black.

                                                                                                                        Page 148 of 369
Property                                                                                        Service Manager 9.81
Outer Bevel Width
                                        Usage
Inner Bevel Width
                                        Specify the amount, in points, to
                                        increase or decrease the standard font
                                        size.

                                        Specify an expression to override the
                                        Font Increase property when that
                                        expression evaluates to true.

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
Group control
Subform control
Forms Designer controls and tools


1.1.3.1.3.17. Graph control

Use this control to display a diagram of connected nodes representing a system of
two or more interrelated things. To add a graph to a form, either click on the control in
the toolbar and then click on the drawing canvas, or, drag and drop the control from
the toolbar to the drawing canvas.

            Note

           Service Manager discontinues the support of Internet Explorer 11. The
           previous Applet-sensitive features (including telephony (CTI), workflows,
           and CI visualization) in Service Manager have alternative solutions or new
           implementations.

           Therefore, the implementation of graph control has changed as well. The
           embedded toolbar in the graph control is slightly different between the
           Windows client and the web client. In the Windows client, the graph
           control provides a toolbar that is more comprehensive, including Zoom In,
           Zoom Out, Fit Content, Select Mode, Windows Area Mode, View Drag
           Mode, Drill Down Mode, Overview, Show Node Labels, Show Edge Labels,
           Print Preview, and a layout selection drop-down list. In the web client, the
           graph control provides a toolbar that includes Zoom In, Zoom Out, Fit
           Content, Show Overview, and Show Edge Labels only. The web client
           displays all base CI images hierarchically.

Property                                                                                        Service Manager 9.81
Name
                                        Usage
X
Y                                       (Optional) Specify a unique identifier
Width                                   for the object on the screen.
Height                                  This name is used by external
Input                                   applications, such as RAD, to
                                        dynamically change the properties of
                                        the object.

                                        Specify the object’s horizontal position
                                        based on the left edge of the object.

                                        Specify the object’s vertical position
                                        based on the top edge of the object.

                                        Specify the width of the object in
                                        alignment grid units.

                                        Specify the height of the object in
                                        alignment grid units.

                                        Specify the database field or variable
                                        to associate with this control. The
                                        primary use for this property is to set
                                        the focus on the graph.

 Property                                                                                       Service Manager 9.81
 Accessible Description
                                        Usage
 Visible
 Visible Condition                      (Optional) Specify a component
                                        description for use with accessibility
Related topics                          software.
                                        Note: This function is only supported
Form creation                           by the web client.
Forms Designer                          If no description is present, the web
Creating and editing forms              client defaults to looking for a nearby
Using the drawing canvas                label to use for the name of the
                                        component. For buttons, checkboxes,
This PDF was generated on May 23, 2026  or radio buttons, the web client will use
                                        the component’s text. Accessibility
                                        software can query the web client to
                                        get this information and use it to
                                        present it to the user in a variety of
                                        ways. For example, when a component
                                        gets the focus, speech simulation
                                        software will say the name and the
                                        type of component, based on the
                                        settings in the Accessible Name and
                                        Accessible Description fields.

                                        Select this option to make the object
                                        visible on the form. Clear the checkbox
                                        to hide the object from view on the
                                        form.

                                        Specify an expression to override the
                                        Visible property when that expression
                                        evaluates to true.

                                                                                                                        Page 152 of 369

Forms Designer properties view
Setting properties
Forms Designer best practices
Building accessible forms
Access Forms Designer
Create a form using the Form Wizard
Update a form
Set the focus on the graph
Attachments control
Forms Designer controls and tools


1.1.3.1.3.18. Grid view tool

This button enables you to view the alignment grid while designing a form.

Click the Grid Preview icon to overlay the design area with a grid.
Click the icon again to remove the overlay.

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
Selection tool
Web Preview tool


1.1.3.1.3.19. Group control

Use this control to add a container that enables you to logically group associated
items. In the Windows client the Group has a rectangular border with a text label at
the top.

            Note

           In the Web client, a group can be displayed as a collapsible section; see
           the last three properties listed in the table below.

            Caution

           When designing forms with collapsible sections, use the following
           guidelines to avoid formatting problems when the form is displayed in the
           Web client.

     All groups on the form should be marked as Collapsible-enabled.
     All widgets must be placed in a collapsible group box; no widgets should remain
     floating independently on the form.
     Do not stack or mix collapsible group boxes with non-collapsible group boxes.
To place a group on a form, click Group and then click the form.

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
 Foreground Color                       Specify the object’s horizontal position
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

                                        Select the text color from the drop-
                                        down list.

                                                                                                                        Page 156 of 369
Property                                                                                        Service Manager 9.81
Foreground Color Condition
                                        Usage
Background Color
                                        Specify a formula to evaluate the
Background Color Condition              ForeColor property at run time. The
Font                                    result of this evaluation overrides the
Bold                                    value assigned to the property.
Bold Condition
Italic                                  Specify the Background Color. You
Italic Condition                        must select the Opaque property
                                        checkbox for the Back Color to have an
                                        effect. The only Background Color
                                        available for a Windows client marquee
                                        is black.

                                        Specify an expression to override the
                                        BackColor property when that
                                        expression evaluates to true.

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

Property                                                                                        Service Manager 9.81
Heading Level
                                        Usage
Justification
Font Increase                           Specify the heading level for this
Font Increase Condition                 control so that a corresponding HTML
                                        heading tag (<h1> to <h6>) is
                                        generated.

                                                    Note

                                                   This function is only
                                                   supported by the Web
                                                   client.

                                        Specify the justification for the object
                                        label as Left, Right, or Center.

                                        Specify the amount, in points, to
                                        increase or decrease the standard font
                                        size.

                                        Specify an expression to override the
                                        Font Increase property when that
                                        expression evaluates to true.

Property                                                                                        Service Manager 9.81
Array Length
                                        Usage

                                        Specify the size of the scrolling region
                                        used to view array entries.

                                        A scroll bar appears beside the fields
                                        to allow users to view the array entries.

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

                                                   Note: The screen object
                                                   must be associated with an
                                                   array data structure.

                                        The default is 0, which means one
                                        vertical line of information appears.

 Property                                                                                       Service Manager 9.81
 Floating group enabled
                                        Usage
 Collapse enabled
 Default to Expanded                    This option enables the group to
                                        change its relative position on the form
This PDF was generated on May 23, 2026  so that it's not hidden when sections
                                        above it expand downward, and
                                        doesn't leave a blank spot after being
                                        collapsed.

                                                    Note

                                                   This function is only
                                                   supported by the Web
                                                   client.

                                        This option enables the group to be
                                        displayed as a collapsible section that
                                        can be expanded and collapsed by the
                                        user.

                                                    Note

                                                   This function is only
                                                   supported by the Web
                                                   client.

                                        Displays a collapsible group as
                                        expanded, by default. The user can
                                        close it if desired.

                                                    Note

                                                   This function is only
                                                   supported by the Web
                                                   client.

                                                                                                                        Page 160 of 369
Property                                                                                        Service Manager 9.81
Radio Group
                                        Usage
Radio Group Orientation
                                        If you set this option to true, the system
                                        regards the Group widget as a radio
                                        group and you are only allowed to add
                                        radio buttons to the Group widget. In
                                        addition, you must set identical values
                                        for the Input property of these radio
                                        buttons. If set this option to false,
                                        ignore the following three properties as
                                        described in this table.

                                                    Note

                                                   This function is only
                                                   supported by the Web
                                                   client.

                                        Specify the aria-orientation attribute for
                                        the Radio Group. If not specified, the
                                        orientation is assumed to be vertical.

                                                    Note

                                                   This function is only
                                                   supported by the Web
                                                   client.

Property                                                                                        Service Manager 9.81
Mandatory
                                        Usage
Mandatory Condition
                                        Setting Mandatory to Yes by checking
                                        the box indicates that the Radio Group
                                        is required and therefore a red asterisk
                                        indicating a required field is displayed.
                                        This is a visible change only.

                                                    Note

                                                   This function is only
                                                   supported by the Web
                                                   client.

                                        Specify an expression to override the
                                        Mandatory property when that
                                        expression evaluates to true.

                                                    Note

                                                   This function is only
                                                   supported by the Web
                                                   client.

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


Frame control
Subform control
Forms Designer controls and tools


1.1.3.1.3.20. HTML Editor control

Use this control to add an HTML Editor that enables users to add standard HTML to
the form. Service Manager displays the rendered HTML in the HTML Viewer.
To place an HTML Editor on a form, click HTML Editor and then click the form.
Be sure to put the name of the database field or variable that you want to associate
with this control into the Input property.
Important: For Accessibility, the HTML Editor must be the last widget in its form or
page, because you will not be able to tab to any widgets placed under it.

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
Accessible Description
                                        Specify the tab sort order for this field.
                                        By default, the TAB key navigates the
                                        focus on a form from top to bottom and
                                        left to right. Objects that have a non-
                                        zero Tab Stop are visited first, in
                                        ascending order. For a button, file,
                                        radio button or checkbox, you will
                                        almost always use the default of 0.

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

Property                                                                                        Service Manager 9.81
Toolbar Configuration
                                        Usage
Insert Image Option
Insert Attachment Option                Enables you to select an HTML Editor
Insert Link Option                      Toolbar from the available toolbars.

                                        - Standard includes options for the
                                        most common HTML tags that enable
                                        you to add font style (bold, italic, color,
                                        and underscore) and hyperlinks to
                                        texts.
                                        - Knowledge Management includes
                                        options for the HTML tags required for
                                        Knowledge Management plus the
                                        Standard tags.
                                        - Knowledge Management Extended
                                        includes options Knowledge
                                        Management development, plus the
                                        Knowledge Management and Standard
                                        tags.

                                        This property is for internal Service
                                        Manager development use only. It
                                        functions properly only in association
                                        with appropriate application code.

                                        This property is for internal Service
                                        Manager development use only. It
                                        functions properly only in association
                                        with appropriate application code.

                                        This property is for internal Service
                                        Manager development use only. It
                                        functions properly only in association
                                        with appropriate application code.

 Property                                                                                       Service Manager 9.81
 Value List
                                        Usage
 Display List
                                        In conjunction with the Input property,
This PDF was generated on May 23, 2026  defines how the Display List values are
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

                                                                                                                        Page 168 of 369
````
