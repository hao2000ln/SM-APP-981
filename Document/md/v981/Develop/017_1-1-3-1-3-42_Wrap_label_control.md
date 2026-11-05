---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.3.1.3.42 .. 1.1.3.1.5
printed_pages: 451-465
---

# 1.1.3.1.3.42 Wrap label control

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.3.1.3.42. Wrap label control

Use this control to add a multi–line label. You can use this label to give a title to the
form, give labels to objects within the form, or otherwise place text on the form.
To place a wrapping label on a form, click Wrap label and then click the form.
Be sure to put the name of the database field or variable that you want to associate
with this control into the Input property.

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

                                                                                                                        Page 268 of 369
 Property                                                                                       Service Manager 9.81
 Label for
                                        Usage
 Foreground Color
 Foreground Color Condition             Specify the name of a control that uses
 Background Color                       this label.

 Background Color Condition                         Note
 Font
 Bold                                              If you specify a variable for
                                                   this label, you need to
This PDF was generated on May 23, 2026             provide a valid value here.
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

                                        Select a font for the text of your label,
                                        table, timer, or marquee caption from
                                        the drop-down list.

                                        Select this option to apply bold to the
                                        label, default text, frame caption, or
                                        marquee caption.

                                                                                                                        Page 269 of 369
Property                                                                                        Service Manager 9.81
Bold Condition
Italic                                  Usage
Italic Condition
Font Increase                           Specify an expression to override the
Font Increase Condition                 Bold property when that expression
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

                                                                                                                        Page 271 of 369

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
Label control
Link label control
Forms Designer controls and tools


1.1.3.1.4. Forms Designer best practices

Forms Designer can produce portable forms that render successfully in the Windows
and Web clients if you follow a few design suggestions. To ensure all forms are
portable, test each new or upgraded form with both clients.

Hint: You can cut or copy and paste existing objects onto other forms.

Printing forms: printing is designed to work nicely with label/inputs; however, it will
NOT work with arbitrary positioning of widgets in the form. If you want to print a table,
make it a table - don't simulate one with "cleverly" placed labels.

Using pop-up subforms can save screen real estate, and can be helpful for
performance because the query to obtain the subform information is not made until
the data is needed for display.

Form design

The right edge of any form should be at grid unit 156. The bottom of any form should
be at grid unit 42. Forms which follow this guideline will fit in the default fonts at
640x480 and 800x600. Additionally, these forms provide enough room along the
edges for a scroll bar if required.

When placing controls on forms, make all character dimensions (coordinates for
placement on the screen, height, width) even numbers, because the space required
to display one character is 2x2. When the ArrayLength of a field is set to be a number
greater than 0 and the field is situated at an odd coordinate, it will automatically shift
to an even coordinate.

Important: Each field needs a unique name property. You can change the value in the
name property, but don't delete it.

Things to keep in mind when designing forms.

     Provide logical navigation buttons in all forms. For example, the Back, Cancel,
     Submit buttons.
     Use a Submit or Search button where appropriate instead on relying solely on
     the ENTER key.
     Stack wide elements like text areas used for descriptions. Multiple wide fields
     can make a form to wide. Stacking is easier to read than wide elements placed
     side-by-side.
     Avoid creating wide forms. Recent surveys show that the majority of users don't
     use monitor settings greater than 1024x768.


     Avoid three–column layouts. Scrolling vertically is more acceptable to most
     people that scrolling horizontally.
     Avoid adding too many fields, widgets, and notebook tabs to a single form.
     Simplify forms by breaking it up into smaller forms that link to other forms
     through a logical flow. Too much information is overwhelming to most users and
     results in a less productive application. Too many controls on a form can
     severely degrade performance on the Web client.
     Avoid placing elements too close to each other. Forms are easier to read and use
     when the text and fields are spaced out. When users increase font sizes this
     becomes more apparent. This can translate into overlapping form elements, text,
     and containers in the Web and Windows clients.
     Printing works well with label/inputs. It does NOT work with arbitrary positioning
     of widgets in the form. If you want to print a table, make it a table. Do not
     simulate one with cleverly placed labels.
     When you design a QBE list form that contains a table, don't enclose the table in
     a Frame or Group; otherwise the QBE list form will not function properly.

Form layouts

Follow these guidelines to generate forms that display well on a variety of platforms
and with different screen resolutions and fonts.

The size of Service Manager forms and the objects on them are defined in terms of
grid units. For instance, a combo box may be defined to be 36 units wide and 2 units
tall. Objects are also placed on forms using the same units. For example, the same
combo box may have its upper left corner at a location 5 units to the right of the form
edge and 4 units beneath the top of the form.

The size of a grid unit varies depending upon the currently selected Service Manager
font. The grid unit is always defined as being half as wide as the lower case e in the
current font, and half as tall as the lower case e in the current font. Thus, in a font
whose letter e is 8 pixels wide by 12 pixels tall, the grid unit is 4 pixels wide and 6
pixels tall.

Changing the system’s font changes the size of a form on the screen. Just as
importantly, it may change the relative shape of the objects therein. If a screen’s grid
unit goes from 4x4 to 6x8, then objects on the screen becomes 50% taller, and
doubles in width. Thus, the screen appears to stretch and have different proportions
than it did originally.

An important point to recognize is that Windows true-type fonts are non-
deterministic. Each video driver manufacturer can bundle its own hardware mapping
of common fonts, and most modern video cards do so. Many manufacturers improve


upon the base Microsoft Windows definition of what constitutes a particular font.
Thus, the letter e in Arial 8 pt. bold when displayed at 640x480 on one video card
may have a different metric than the same letter displayed at the same resolution on a
different video card.

Use easy to understand names and descriptions for buttons and links. Acronyms and
cryptic language makes it is difficult or impossible to know what's going to happen if
you click the link or press the button.

Fonts

Using font styles such as Bold or Italic affects the spacing of the characters on a
form. If labels are truncated in forms, select a different font, style, or size. You can
also increase the width of the form to accommodate a different font, style, or size by
specifying an increased width percentage in Service Manager preferences.

Web client forms

The Service Manager Web tier offers automatic support for existing applications and
their forms. The Web tier generates dynamic HTML that approximates the exact
layout of forms as you define them with Forms Designer. The default application
forms are portable from the Windows client to the Web client with no required
modification.

If you upgrade an existing system, you will find that Service Manager clients
automatically support and display your customized forms. However, there may be
cases when further form modification is necessary to correct cosmetic issues that
appear when you view the form with the Web client. The following table describes
common form revisions that might be required.

Area                                                                                            Service Manager 9.81
Overlapped objects
Dynamic resizing                        Correction

Graphics and images                     Ensure that form objects don't overlap
                                        each other. The Windows client makes
                                        slight adjustments to correct for
                                        overlapped objects, but these design
                                        issues are exposed on a web browser.

                                        The Windows client dynamically
                                        resizes objects such as text areas and
                                        notebooks when you resize the
                                        window. The Web client doesn't resize
                                        most objects and doesn't support
                                        elastic properties as you resize the
                                        browser window. Therefore, ensure
                                        that you assign a default initial size.

                                        Size any graphics and images to fit
                                        conservatively in the form. The
                                        Windows client supports scaled images
                                        used as buttons. However, the Web
                                        client displays these images in their
                                        native size. The button grows to
                                        accommodate the size of the image.

Area                                                                                            Service Manager 9.81

Dynamic View Dependency (DVD)           Correction
conditions
                                        Hidden data with DVD conditions may
                                        be exposed if the form permits the user
                                        to make changes.

                                                    Note

                                                   If you are using visible DVD
                                                   and the system has
                                                   dynamically changed the
                                                   read-only attribute of a UI
                                                   component by using
                                                   JavaScript, the value of this
                                                   component is still possible
                                                   to be changed. For
                                                   sensitive field data,
                                                   administrators should
                                                   consider the use of Data
                                                   Policy expressions instead
                                                   of DVD or a combination of
                                                   the two to ensure data
                                                   integrity. Don't rely on DVD
                                                   alone to ensure data
                                                   integrity for sensitive field
                                                   data as it may be changed
                                                   by users familiar with
                                                   browser developer tools.

Collapsible sections

In the Web client, groups of items can be displayed in collapsible sections. To display
such items, use the Group control in Forms Designer, and check the Collapse Enabled
property.

When designing forms with collapsible sections, use the following guidelines to avoid
formatting problems when the form is displayed in the Web client.

Important guidelines

     All groups on the form should be marked as Collapsible-enabled.


     All widgets must be placed in a collapsible group box; no widgets should remain
     floating independently on the form.
     Do not stack or mix collapsible group boxes with non-collapsible group boxes.

Sizing graphics

When creating or placing images in the Service Manager GUI, create the image in the
size needed. Do not create oversized or undersized images and expect Service
Manager to resize them properly. There are several important reasons for this.

     When scaling images, the quality of the image distorts.
     The size of the image is not changed and thus may be a performance
     consideration.
     The Web client has no way of resizing the image. For example, in the Service
     Manager GUI, if you placed a large image in a button, the GUI and the Windows
     client size it properly based on the button container. The Web client doesn't do
     this and has no way of scaling the image to the size of the parent container.
     Thus the image appears as its original size in the Web client. The bigger the
     original size, the bigger it appears in the Web client. On the Web this can also be
     a major performance issue because large images require more bandwidth and
     cause slow browser performance.

Form naming conventions

Form names incorporate the application or feature identification as a prefix in the form
name. Look for these prefixes to identify updated or new forms.

Application                             Form prefix  Related table
Problem Management                      PM
                                                     knownerror
                                                     rootcause
                                                     rootcausetasks

Service Level                           sla          sla

Management                                           incidents
                                                     probsummary
Service Desk                            SM

Incident Management IM


1.1.3.1.5. Building accessible forms

You can use the Forms Designer to make your system more accessible. In addition to
the accessible attributes, you can customize forms for easier readability and
information manipulation.

Attribute name                          Definition
accessiblename option
                                        Give a form element a name
accessibledescription option            compatible with a screen reader.

                                        Give a form element a description
                                        compatible with a screen reader.

Accessible Web client forms

The accessible mode of the Web client allows users that require different levels of
accessibility to apply personal preferences to improve their user experience. The
accessible Web client also enables accessibility tools, such as screen readers, to
work with Service Manager. The accessible Web client omits the graphical workflow
feature, and thread navigation links, which are the tabs that identify open forms in the
Windows client.

If you are designing forms for accessible use, these are the most important design
requirements:

     High-contrast color graphics
     Larger default fonts
     Larger form spacing (more white space)
     Simplified navigation (fewer buttons, objects and icons)
     Browser settings must be able to control

           Resizing fonts
           Foreground and background color selection

A visually impaired user might want a well–designed form that reads left to right with
labels announcing the name of the subsequent form object and tables with row labels
that read horizontally (not by column). This user might also want to specify a black
background with white text in a 14–point bold font, instead of the default color and
font combinations.


Putting the HTML Editor on accessible forms

The HTML Editor must be the last widget in its form for reverse tabbing to work
properly. Widgets placed under it can't be tabbed.

The Accessible Web client ignores the tab stop information set in the Form definition.
Instead, the tabbing always moves from left to right and top to bottom so that the
tabbing order matches the order in which the widgets are described by a screen
reader.

For complex editing requiring 508 compliance, edit the text in a 508 compliant
HTML Editor and then paste it into the HTML Editor.

Contents

     1 Accessible Web client forms
           1.1 Putting the HTML Editor on accessible forms
````
