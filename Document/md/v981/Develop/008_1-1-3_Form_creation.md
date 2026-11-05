---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.3 .. 1.1.3.1.2.8
printed_pages: 190-214
---

# 1.1.3 Form creation

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.3. Form creation

These topics focus on creating and customizing forms within the system. The tools
that are used in form creation are:

     Forms Designer — alters the data in one or more dependent files to match
     changes made to data in a source file.
     Dynamic View Dependencies (DVD) — applies values, sets mandatory fields,
     and validates at the table level.
     Format Control — defines a field’s valid values.

Related topics

Tailoring
Forms Designer
Creating and editing forms
Forms Designer best practices
Building accessible forms
Dynamic View Dependencies
Format Control
Access Forms Designer
Create a form using the Form Wizard
Add a dynamic form to a form
Forms Designer controls and tools


1.1.3.1. Forms Designer

Forms Designer is the utility you use to design, create, and update Service Manager
forms. This utility gives access to a drawing canvas upon which you construct your
forms, a design toolbar from which you access controls and layout objects, and a
properties view that you use to set attributes for each control or layout object. Forms
Designer provides a Form Wizard that you can use to automatically create forms
based on a particular database dictionary.

Related topics

Form creation
Creating and editing forms
Forms Designer best practices
Building accessible forms
Dynamic View Dependencies
Format Control
Access Forms Designer
Create a form using the Form Wizard
Forms Designer controls and tools


1.1.3.1.1. Access Forms Designer

Applies to User roles: System Administrator

You can open Forms Designer using one of the following methods:

     To access Forms Designer from the System Navigator, click Tailoring > Forms
     Designer.
     To access Forms Designer from the Service Manager command line, type fd
     and press Enter.

From this screen, you can create a new form or search for an existing form.

Related topics

Form creation
Forms Designer
Creating and editing forms
Using the drawing canvas
Forms Designer properties view
Setting properties
Forms Designer best practices
Building accessible forms
Dynamic View Dependencies
Format Control
Create a form using the Form Wizard
Update a form
Add a dynamic form to a form
Forms Designer controls and tools


1.1.3.1.2. Creating and editing forms

The Form Wizard enables you to create forms based on a particular Service Manager
table. You can automatically create both table–type record lists and single–record
display forms. You can only use the Form Wizard to create new forms; it can't modify
existing forms.

Forms Designer design mode contains a Drawing Canvas, Properties view, and
Design toolbar. You use them to create, design and modify Service Manager forms.

Forms Designer enables you to use the forms you create in three basic ways. A form
can be used as a stand-alone, as a subform embedded in a parent form, or as a pop-
up.

Related topics

Form creation
Forms Designer
Using pop-ups
Using the drawing canvas
Forms Designer best practices
Access Forms Designer
Create a form using the Form Wizard
Add a dynamic form to a form
Add a subform to a form
Forms Designer controls and tools


1.1.3.1.2.1. Create a form using the Form
Wizard

Applies to User roles: System Administrator

You use the Form Wizard to create a new form for an existing database table. You
must use the Windows client to create a new form in Forms Designer.

To create a form using the Form Wizard:

   1. Click Tailoring > Forms Designer in the System Navigator, or type fd on the
     Service Manager command line and then press Enter.

   2. Click New.
   3. Click Yes to use the Form Wizard.
   4. Type the name of the new form and click OK.
   5. Type or select the name of the table you want to associate with the form, and

     click OK.
   6. You can create a form that displays a single record or a form that displays a list

     of records. Select the type of form you want to create and click OK.
   7. Select a size for the form.
   8. Change the true to false in the Show (t/f) column if you don't want a

     particular field included on the completed form.
   9. Change the text in the Field Label column to update the label on the form.
 10. Click Proceed. The new form opens in Design mode.
 11. Add a field to the new form, as follows:

        1. Drag the control to its approximate location, select the field, and then
           modify its Properties.

        2. To modify a field, select it and then modify the value of the Property you
           want to adjust.

        3. To delete a field, select it and press Delete.
        4. Click Web Preview to see what the form will look like in the Web client.
        5. Click OK to see what the form will look like in the Windows client.
        6. Click OK to save your changes.
 12. Open the form using Database Manager to test your changes:
        1. Click Tailoring > Database Manager.
        2. Click Search. Service Manager opens a list of forms.
        3. Click the form you just created to open it.

Related topics


Form creation
Forms Designer
Creating and editing forms
Using the drawing canvas
Forms Designer properties view
Setting properties
Forms Designer best practices
Building accessible forms
Proprietary records
Access Forms Designer
Update a form
Add a dynamic form to a form
Forms Designer controls and tools
HTML Editor controls
HTML Editor keyboard shortcuts


1.1.3.1.2.2. Using the drawing canvas

When you access Form Designer to create a new form, you are provided with a
drawing canvas on which you build the form.

To work effectively with the canvas, you should know the following:

     The structure of the canvas.
     How to size your forms on the canvas.
     How to position multiple objects.

The canvas contains a grid to which all design objects are referenced. Click Grid
Preview to see the grid.

     The grid coordinates start at (0,0) in the top left corner of the canvas. The X
     (horizontal) coordinates increase as you move to the right. The Y (vertical)
     coordinates increase as you move down.
     There is approximately a 3 to 1 ratio between X units and Y units. For example,
     30 X units cover approximately the same amount of space as 10 Y units.
     For best results, try to use even X Y coordinates for objects you place on the
     canvas. The space required to display one character is 2x2 and, overall, the
     client displays better when you use even coordinates.

Related topics

Form creation
Forms Designer
Creating and editing forms
Forms Designer properties view
Setting properties
Forms Designer best practices
Building accessible forms
Access Forms Designer
Create a form using the Form Wizard
Update a form
Forms Designer controls and tools


1.1.3.1.2.3. Forms Designer properties
view

The Properties view enables you to examine and set the property value for each
object on your form. The values in the property fields determine how the object
appears on the form, and how the object interrelates with the user and with the
database.

The Properties view displays a window containing two columns, a property column
and a value column. You can click the Property tab to sort the properties
alphabetically or by category.

Like any view in the client, you can undock the properties view and move it to
anywhere on your desktop.

Note: You can turn on the properties view and use it outside of Forms Designer to
determine form field properties for any object in focus. However, since labels can't
gain focus, you can't view properties for labels outside of Forms Designer.

The Properties view includes property specific in–place editors for changing values.
There are six types of property editors:

     Text
     Boolean (checkbox)
     Color swatches
     Comboboxes
     Lists (with editor window)
     Images preview

Related topics

Form creation
Forms Designer
Creating and editing forms
Using the drawing canvas
Setting properties
Building accessible forms
Access Forms Designer
Create a form using the Form Wizard
Forms Designer controls and tools


1.1.3.1.2.4. Setting properties

When you select a control object, the properties view displays the type of control you
have selected and the properties that apply to that object. Some properties are
common to all control or layout objects, while others are object specific. The Forms
Designer online Help contains a description of each control and its corresponding
properties.

You can use the dynamic view dependencies feature to conditionally display some
controls or conditionally change how some controls appear on a form.

Properties for a design object can be divided into the following categories:

     Common properties
     Font properties
     Box properties
     Object specific properties

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
Forms Designer controls and tools


1.1.3.1.2.5. Enabling HTML in forms

Forms Designer has an HTML Editor and an HTML Viewer that you can add to forms.

     The HTML Editor enables users to add and edit HTML text in Service Manager
     forms. It uses standard HTML formatting.
     The HTML Viewer enables users to view (but not edit) the formatted HTML text
     entered by using the HTML Editor.

Using the HTML Editor

To add HTML, type or paste text into the HTML Editor and format it as desired. The
Knowledge Management and Knowledge Management Extended toolbars enable you
to switch between source and WYSIWYG mode. If you have a Knowledge
Management toolbar, you can view the HTML source code and edit it directly.

            Note

           While in WYSIWYG mode, the editor makes choices about how to apply
           the tags you select. If you want more control over how the tags are
           applied, ask your administrator for a Knowledge Management toolbar and
           use source mode for editing.

To add an image, save the image locally, upload it as an attachment, and then add a
<img> tag that points to the attachment in the HTML editor. In the web client, you
can also use the copy and paste function to paste the image into the HTML Editor
directly. The image is uploaded as an attachment automatically, and a <img> tag
containing a link to the image is displayed in the HTML Editor.


            Note

           Out-of-box, the copy and paste function is only available in Knowledge
           Management. To enable this functionality for other modules, you must
           meet the following prerequisites:

                You are running the Service Manager 9.52 (or later) web client and
                server.
                The form contains an Attachment Container control.
                The Insert Image Option property is defined for the HTML Editor
                control on the form.

           Currently, this functionality is unsupported in HTML email.

In the Windows client and web client, press Enter for a new paragraph <p> and
press Shift+Enter for a line break <br> . To exit a numbered or bulleted list and start a
new paragraph <p> , you can press Enter twice.

The HTML Viewer will render valid HTML, but you must ensure that the HTML you
enter is valid and is properly integrated into the HTML document. For example:

     If you paste in HTML containing a JavaScript requiring a file provided by another
     application, that JavaScript will not work in the HTML Viewer.
     If you copy an HTML form with buttons, the form will render, but the buttons will
     not work in the HTML Viewer.

In the Windows client, if you paste text from a Microsoft Word document into the
HTML Editor, the editor opens a window that allows you to select options to clean the
HTML work created.

Add an HTML Editor or Viewer to a form

Applies to User Roles: System Administrator

To Add an HTML Editor or Viewer to a form:

   1. Click Tailoring > Forms Designer in the System Navigator, or type fd on the
     Service Manager command line and then press Enter.

   2. Type a form name and click Search.

     Service Manager opens a list of forms. Click the form you want to update to
     open it.

   3. Click Design to open design mode.


   4. Drag the HTML Editor icon to the desired location.

     Or

     Drag the HTML Viewer icon to the desired location.

   5. Type the name in the Value text box of the Name property.
   6. Specify the field or variable in which to store the HTML in the Value text box of

     the Input property.
   7. Specify the height, width, and other properties of the HTML Editor or viewer, as

     desired.
   8. Click Web Preview to see what the form will look like in the Web client.
   9. Click OK to see what the form will look like in the Windows client.
 10. Click OK to save your changes.
 11. Open the form using Database Manager to test your changes:

        1. Click Tailoring > Database Manager

        2. Click Search. Service Manager opens a list of forms.

        3. Click the form you just created to open it.

Enable HTML Editor allowlist

The HTML Editor enables users to visually add and edit rich text content formatted
with HTML tags. Though the HTML Editor is powerful, web sites may be abused
without a proper security control. Therefore you can use the HTML Editor allowlist to
define a list of allowed HTML elements.

            Note

           If your Service Manager platform components are upgraded to 9.81 or
           higher version, while your application version is lower than SM9.81, you
           need to manually add the <s> , <a rel> , and <span contenteditable>
           attributes to HTML Editor allowlist, so that the "Strikethrough", "Insert
           link", and "Insert Field" functions can work properly.

To enable the HTML Editor allowlist and define a list of allowed HTML elements, follow
these steps:

   1. Sign in to Service Manager as a system administrator.
   2. Click Tailoring > Allowlist > HTML Editor Allowlist.
   3. Select the Enable HTML Editor Allowlist checkbox. By default, this checkbox is

     checked.
   4. Define a list of allowed HTML Tags and attributes in the Allowed

     Tags/Attributes section. For example, add script as an allowed tag so that you


     are able to input the <script> tag by using the HTML Editor.
   5. Define a list of allowed URL protocols for some elements in the Allowed URL

     Protocols section. For example, add a as an allowed tag, specify href as the
     attribute, and then specify one or more protocols that are used by the href
     attribute, such as http, https, mailto, and ftp.
   6. Click Save and OK.
   7. Do either of the following to make the customized HTML Editor allowlist
     effective.

           Restart the web application server if you are working with the Service
           Manager web client.
           Sign out and then sign in to the Service Manager Windows client again.

     Note: The Journal Updates Viewer and Activities Viewer widgets in the
     Activities tab will get the allowlist from cached data. So after the allowlist is
     updated, it will take 5 minutes to refresh the cached data and reflect the updated
     allowlist.

After the HTML Editor allowlist became effective, you are only allowed to input the
elements as listed in the allowlist when editing HTML contents using the HTML Editor.
The system automatically validates your inputs and displays some warning messages
if there are tags, attributes or protocols that violate the allowlist. For example:

The HTML document contains some tags <script>,<javascript> that aren't allowed
by the system. Contact your Service Manager system administrator for assistance.

The HTML document contains some attributes for tags (<tag attribute...>) <div
onlick>,<p onerror> that aren't allowed by the system. Contact your Service Manager
system administrator for assistance.

The HTML document contains some values in the attributes of tags (<tag attribute>)
<img src>,<a href> that aren't allowed by the system. Contact your Service Manager
system administrator for assistance.

You must review your input and avoid using these invalid tags, attributes, or protocols.
Alternatively, you can ask your Service Manager system administrator to include
these tags, attributes or protocols to the allowlist. Otherwise, the system automatically
removes these invalid elements from your input after you click Save in the HTML
editor.

HTML Editor controls

The HTML Editor has the following formatting controls. Their availability depends on
the Keyboard property selected in the HTML Editor control on the form you are using.


Icon                                    Name              Function

                                        Bold              Makes the selected text

                                                          bold.

                                        Italic            Makes the selected text

                                                          italic.

                                        Underline         Underlines the selected
                                                          text.

                                        Strikethrough     Strikes through the
                                                          selected text.

                                        Text Color        Makes the selected text
                                                          the specified color.

                                        Background Color  Sets the background of
                                                          the selected text to the
                                                          specified color.

                                        Font Size         Sets the selected text to
                                                          the specified font size.

                                        Clear Formatting  Removes formatting from
                                                          the selected text.

                                        More Text         Select more text options:
                                                          Subscript, Superscript,
                                                          or Font Family.

                                        Subscript         To lower the text below
                                                          the line of text.

                                        Superscript       To raise the selected text
                                                          above the line of text.

                                        Font Family       Sets the selected text to
                                                          the specified font.


Icon                                    Name                    Function

                                        Paragraph Format        Sets the selected
                                                                paragraphs to the
                                                                specified format.

                                        Insert/Remove Ordered   Makes the selected
                                        List                    paragraphs into a
                                                                ordered list.

                                        Insert/Remove Bulleted  Makes the selected
                                        List                    paragraphs into a
                                                                bulleted list.

                                        Decrease Indent         Decreases the indent of
                                                                the selected paragraph.

                                        Increase Indent         Increases the indent of
                                                                the selected paragraph.

                                        Align Left              Left-aligns the selected
                                                                paragraphs.

                                        Center                  Center the selected
                                                                paragraphs.

                                        Align Right             Right-aligns the selected
                                                                paragraphs.

                                        More Paragraph          Select more paragraph
                                                                options: Quote, Align
                                                                Justify, or Line Height.

                                        Quote                   Creates an indented
                                                                quote style.

                                        Align Justify           Fully justifies the
                                                                selected paragraphs.

                                        Line Height             Sets the line height of
                                                                the selected paragraph.


Icon                                    Name                      Function

                                        Insert an image           Inserts an image at the
                                                                  cursor location. Forms
                                                                  Designer stores the
                                                                  images in the
                                                                  SYSATTACHMENTS
                                                                  table.

                                        Insert a link toward an   Inserts a link to an
                                        attached file             attachment at the cursor
                                                                  location. Forms Designer
                                                                  stores the attachments in
                                                                  the SYSATTACHMENTS
                                                                  table.

                                        Insert a link toward      Inserts a link to a record
                                        another record            at the cursor location.

                                        Link                      Inserts a hyperlink at the

                                                                  cursor location or edits

                                                                  the selected hyperlink. A

                                                                  user can jump to the

                                                                  associated anchor by

                                                                  clicking this hyperlink.

                                        Insert Table              Inserts a table at the
                                                                  cursor location.

                                                                  Note: Right-click the
                                                                  table to access the
                                                                  columns, rows, cells, and
                                                                  editing commands.

                                        Insert Special Character  Inserts a specified
                                        Insert Horizontal Line    character at the cursor
                                                                  location.

                                                                  Inserts a horizontal bar
                                                                  at the cursor location.


Icon                                    Name        Function

                                        Undo        Revert to last saved

                                                    record.

                                        Redo        Redoes the reverted

                                                    action.

                                        Code View   Toggles between source
                                                    code mode and wysiwyg
                                                    mode for editing.

      /                                 Fullscreen  Switch between full
                                                    screen and normal

                                                    screen modes.

HTML Editor keyboard shortcuts

See Keyboard shortcuts for HTML Editor for detailed information.

Related topics

Form creation
Forms Designer
Web client forms
Building accessible forms
Access Forms Designer
Create a form using the Form Wizard
HTML Editor control
HTML Viewer control
Forms Designer controls and tools


1.1.3.1.2.6. Add a subform to a form

Applies to User roles: System Administrator

Subforms enable you to create a form once and then use it in other forms. You
construct a subform in the same way as you would a standard form. You display a
subform on another form by calling it with a subform widget embedded in the form.

Limitation: If a subform contains only a table, make sure that the table and subform
have the same height. This way, a vertical scroll bar will appear for the table if needed
when the total height of all table rows exceeds the specified table height. If you
specify a table height greater than the subform height, the table rows may overflow
outside the subform and overlap other fields on the form. If a subform contains
multiple widgets, make sure that the subform height is set to be large enough to hold
all the widgets; otherwise overlaps may also occur.

To add a subform to a form:

Follow these steps to add a subform to a form.

   1. Click Tailoring > Forms Designer in the System Navigator, or type fd on the
     Service Manager command line and then press Enter.

   2. Type a form name and click Search.

     Service Manager opens a list of forms. Click the form you want to update to
     open it.

   3. Click Design to open design mode.

   4. Add a subform widget, or select an existing subform.

     The properties for the comfill appear in the properties view.

   5. Specify the database field to access in the Value text box of the Input property.

   6. Specify the name of the form you want to display when the user hovers over the
     comfill in the Subform Format field.

   7. Specify the virtual join field to associate with the comfill in the Subform Input
     field.

   8. Mark the Subform Enabled checkbox.

   9. Click Web Preview to see what the form will look like in the Web client.

 10. Click OK to see what the form will look like in the Windows client.


 11. Click OK to save your changes.

 12. Open the form using Database Manager to test your changes. Click Tailoring >
     Database Manager and then click Search. Service Manager opens a list of
     forms. Click the form you just created to open it.

Sort the data in a subform

Applies to User roles: System Administrator

You can configure the default sort order of the data that's displayed in a subform. To
do this, configure the following two drop-down lists in the Link form of the subform:

     Sort Field(To/Target)

Sets the field by which the subform is sorted

     Sort Order(To/Target)

Sets the order in which the field is sorted

            Note

                If multiple links are defined for a field in the Link file of the subform,
                you must use the first link to define the default sort field and sort
                order.
                You can't sort array fields in Service Manager 9.32. Therefore, you
                should not configure an array field as the default sort field.
                You may experience slow performance if you configure a long text
                field (for example, the Description field) as the default sort field.

Related topics

Form creation
Forms Designer
Using pop-ups
Using the drawing canvas
Access Forms Designer
Create a form using the Form Wizard
Update a form
Forms Designer controls and tools
Comfill control
Subform control


1.1.3.1.2.7. Using pop-ups

You can display a form as a pop-up by embedding the comfill widget in the form.
Pop-up forms enable you to create a form once, and then use it in other forms.
Construct a pop-up form in the same way as you would a standard form.
Forms displayed as pop-ups are read-only; users can't interact with them. If you want
your users to be able to interact with the form, display the form as a standalone of
another form instead of as a pop-up.

     Pop-ups only display one record. If the virtual join returns zero or multiple
     records, the pop-up form will display an error message.
     Only a single pop-up can be active at a time.

The following widgets are supported for pop-ups. Use a regular subform instead of a
pop-up subform for any widget not on this list. If you use a non-supported widget, the
pop-up will display an error message.

     Checkbox
     Date
     Group/Frame
     Image
     Label
     Table
     Text
     TextArea
     Wrap Label

Note: For the Web client, the allowed maximum width of a pop-up form is 500 pixels.
When designing a pop-up form for the Web client, make sure that the pop-up form is
not too wide; otherwise, it may not appear correctly on the Web client.

Add a pop-up to a form

Applies to User roles: System Administrator

To add a pop-up to a form:

   1. Click Tailoring > Forms Designer in the System Navigator, or type fd on the
     Service Manager command line and then press Enter.

   2. Type a form name and click Search.


     Service Manager opens a list of forms. Click the form you want to update to
     open it.

   3. Click Design to open design mode.

   4. Add a comfill widget, or select an existing comfill.

     The properties for the comfill appear in the properties view.

   5. Specify the name of the form you want to display when the user hovers over the
     comfill in the Pop-up Subform Format field.

   6. Specify source field name to associate with the comfill in the pop-up Subform
     Input field.

     Note: This field should exist on the link record.

   7. Click the Pop-up Subform Enabled box.
   8. Click Web Preview to see what the form will look like in the Web client.
   9. Click OK to see what the form will look like in the Windows client.
 10. Click OK to save your changes.
 11. Open the form using Database Manager to test your changes:

        1. Click Tailoring > Database Manager

        2. Click Search.

           Service Manager opens a list of forms.

        3. Click the form you just modified to open it.

When the user hovers over the comfill control that you placed on the form, if the
virtual join returns a single record, Service Manager will display it in a pop-up
subform.

Related topics

Form creation
Forms Designer
Using the drawing canvas
Access Forms Designer
Create a form using the Form Wizard
Add a subform to a form
Add a dynamic form to a form
Forms Designer controls and tools
Comfill control
Subform control



1.1.3.1.2.8. Add a dynamic form to a form

Applies to User Roles: System Administrator

            Tip

           For the format for the XML that describes the dynamic form, refer to
           plugins\com.hp.ov.sm.client.common_<VERSION>\src\resources\schema
           \dynamicForm.xsd .

To add a dynamic form to a form, follow these steps:

   1. Click Tailoring > Forms Designer in the System Navigator, or type fd on the
     Service Manager command line and then press Enter.

   2. Type a form name and click Search.
     Service Manager opens a list of forms. Click the form you want to update to
     open it.

   3. Click Design to open design mode.
   4. Drag the Dynamic form icon to the desired location.
   5. Click the dynamic form field to select it.
   6. Type the name of the form in the Value text box of the Name Property.
   7. Type the name of the field in which to store the XML in the Value text box of the

     Input property

   8. Specify the height, width, and other properties of the dynamic form, as desired.

                   Note

                Forms designer sets the widget size set to the maximum size the
                dynamic form (once stretched) can occupy. You can resize the
                widget, but if you set the size too small, the dynamic form will
                appear truncated.

   9. Click Web Preview to see what the form will look like in the Web client.
 10. Click Ok to see what the form will look like in the Windows client.
 11. Click Ok to save your changes.
 12. To see the dynamic form, open the form on which it is located with Database

     Manager.


     Each time you save changes in Forms Designer, exit the form and reload it in
     Database Manager.

Best practice

To see the XML and the dynamic form at the same time for testing purposes, create a
form with a regular text input field and a dynamic form widget for the same data field.
Since the Web client doesn't allow you to use the same field name more than once on
a form, alias the field, making the input property for the dynamic forms widget the
alias and the input property for the text file the field itself. Be sure to make one of
these read-only, so that they don't interfere with each other. Put your XML into the
text field. You can use the magnify option to open a large text box to edit the XML.

Once you have created an acceptable dynamic form, you can generate the XML with
a RAD or JavaScript application.

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
Dynamic Form control
Forms Designer controls and tools
````
