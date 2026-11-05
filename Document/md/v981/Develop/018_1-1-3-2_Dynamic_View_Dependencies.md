---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.3.2 .. 1.1.3.2
printed_pages: 465-497
---

# 1.1.3.2 Dynamic View Dependencies

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.3.2. Dynamic View Dependencies

Steps taken to ensure better data entry and form usability are critical to a database.
This includes visual enhancements and form modifications based on user input.
Dynamic View Dependencies (DVD) is a feature of Forms Designer that enables you
to display objects and their attributes on a form depending on user interaction.

DVD enables you to create control or layout objects with properties that are evaluated
when the form appears to control the appearance of these objects on the form.

You can use dynamic view dependencies to:

     Dynamically determine the properties of a field based on the DVD condition.
     Make a field visible only when another field contains a certain value.
     Dynamically determine the choices in a drop-down list based on the choice in
     another combo box.
     Dynamically set the font or color of a field based on the value of another field.
     Dynamically set the font or color of a field based on its value.

Note: DVD select statements can only be used on text fields.

You create dynamic view dependencies by specifying conditional statements for
properties of a control. The three types of conditional statements for a property are
described in the following table.


Conditional Statements Syntax                                      Example

Simple expression (Field                FIELD [OPERATOR            [$invisible] = 0
comparisons):                           VALUE]                     [$invisible] <> 1
                                                                   [$L.one.click]
     Enable you to                           FIELD: Any valid      <>true &
     specify                                 input field or        [$quantity]>1&
     comparisons of                          variable enclosed in  [$orderonbehalf.ma
     equality or                             brackets.             rker]<>true
     inequality.                             OPERATOR: = , > ,
     Evaluate to “true”                       < , <> , or #
     or “false” at                           VALUE: Any quoted
     runtime.                                string or number

                                        Note: You can use | or
                                        & to concatenate
                                        multiple expressions.

                                        For more information,
                                        see Field comparisons.

Value:Display                           FIELD ? ValueList :        [$severity]?
expression (Field value                 DisplayList                "sev1","sev2","sev3" :
matching)                                                          1,7,2,13
                                             FIELD: Any valid
     Enable you to                           input field or        This example returns a
     specify matching                        variable enclosed in  value as follows:
     output values for                       brackets.
     various input                           ValueList and              1 if
     values.                                 DisplayList: Zero or       $severity="sev1"
     Return a single                         more comma                 7 if
     value or a list of                      separated values.          $severity="sev2"
     values when                                                        2 if
     evaluated at                       For more information,           $severity="sev3"
     runtime.                           see Field value                 13 if $severity is
                                        matching.                       none of the listed
                                                                        "sev" values


Conditional Statements Syntax                                    Example

Function call (Dynamic                  FUNCTION(ParaList)       select( "subcategory",
functions):                                                      "subcategory",
                                             FUNCTION: A valid   "category", [$category] )
     Enable you to call a                    function name (for
     function that                           example, select )   This example returns a
     evaluates a result                      ParaList: Zero or   list of subcategory
     dynamically.                            more comma          names from the
                                             separated VALUEs    subcategory table,
                                                                 whose category equals
                                        For more information,    the $category value.
                                        see Dynamic functions.

Service Manager includes a form, dep.g, which demonstrates Dynamic View
Dependencies.


1.1.3.2.1. Use form dep.g to demonstrate
Dynamic View Dependencies

The form dep.g has been prepared to demonstrate Dynamic View Dependencies. You
can interact with this form to see the DVD examples this form uses and the dynamic
effects they create.

To understand DVD examples on the dep.g form:

   1. Click Tailoring > Forms Designer.

   2. Type dep.g in the Form field, and click Search.

     The dep.g form opens.

   3. Select the Instructions tab for instructions on how to use three types of DVD
     conditional statements. For more information, see Dynamic View Dependencies.

   4. Follow the instructions and interact with the different fields to observe how the
     View properties change dynamically.

   5. Click Design.

   6. Inspect Properties View to see what values are assigned to create the effects.
     The following tables explain those properties that create the dynamic effects on
     different tabs of the form.

     Labels and Fields tab:


Control Name                            Property: Value        Explanation
Providers > Caption                          Visible: 1
text box                                     Input: $caption        This text box is
(Text22)                                                            always visible.
                                             Visible: 1             The value you
Providers > Severity                         Input: $severity       type in this text
text box                                                            box (disabled,
(Text25)                                                            big, bold, or
                                                                    italic) is assigned
                                                                    to the $caption
                                                                    variable, which is
                                                                    referenced in
                                                                    other conditional
                                                                    statements on the
                                                                    same screen.

                                                                    This text box is
                                                                    always visible.
                                                                    The value you
                                                                    type in this text
                                                                    box (sev1, sev2,
                                                                    sev3, or any other
                                                                    value) is assigned
                                                                    to the $severity
                                                                    variable, which is
                                                                    referenced in
                                                                    other conditional
                                                                    statements on the
                                                                    same screen.


Control Name                            Property: Value         Explanation
Providers > Disabled                         Visible: 1
checkbox                                     Input: $disabled        This checkbox is
(CheckBox28)                                                         always visible.
                                             Visible: 1              When you select
Providers > Invisible                        Input: $invisible       or clear this
checkbox                                                             checkbox, 1 or 0
(CheckBox30)                                                         is assigned to the
                                                                     $disabled
                                                                     variable, which is
                                                                     referenced in
                                                                     other conditional
                                                                     statements on the
                                                                     same screen.

                                                                     This checkbox is
                                                                     always visible.
                                                                     When you select
                                                                     or clear this
                                                                     checkbox, 1 or 0
                                                                     is assigned to the
                                                                     $invisible
                                                                     variable, which is
                                                                     referenced in
                                                                     other conditional
                                                                     statements on the
                                                                     same screen.


Control Name                            Property: Value          Explanation

Dependents > Caption                         Visible Condition:       This label is
label                                        [$invisible] = 0         visible only when
(Label33)                                    Caption                  the Providers >
                                             Condition:               Disabled
                                             [$caption]               checkbox
                                             Foreground Color         (CheckBox28) is
                                             Condition:               not selected.
                                             [$severity]              The value you
                                                                      type in the
                                                                      Providers >
                                                                      Caption text box
                                                                      (Text22) is
                                                                      automatically
                                                                      populated as the
                                                                      caption of this
                                                                      label.
                                                                      The font color of
                                                                      the label caption
                                                                      changes with a
                                                                      color ID number
                                                                      (1, 2, 3 and so on)
                                                                      you type in the
                                                                      Providers >
                                                                      Severity text box.


Control Name                            Property: Value     Explanation

Dependents                              Visible Condition:  This label is
> Expression label                      [$invisible] = 0    visible only when
(Label35)                               Foreground Color    the Providers >
                                        Condition:          Disabled
                                        [$severity] ?       checkbox
                                        "sev1","sev2","sev  (CheckBox28) is
                                        3" : 1, 7, 2, 13    not selected.
                                        Bold Condition:     The font color of
                                        [$caption]="bold"   the label caption
                                        Italic Condition:   changes with the
                                        [$caption]="italic  value you type in
                                        "                   the Providers >
                                        Font Increase       Severity text box
                                        Condition:          (Text25): color 1
                                        [$caption] ?        for sev1, color 7
                                        "big" : 5, 0        for sev2, color 2
                                                            for sev3, and
                                                            color 13 for any
                                                            other entries.
                                                            The label caption
                                                            is bolded if you
                                                            type bold in the
                                                            Providers >
                                                            Caption text box
                                                            (Text22).
                                                            The label caption
                                                            is in italic if you
                                                            type italic in the
                                                            Providers >
                                                            Caption text box
                                                            (Text22).
                                                            The font size of
                                                            the label caption
                                                            is increased by 5
                                                            only when you
                                                            type big in the
                                                            Providers >


Control Name                            Property: Value          Explanation

Dependents > Disable                         Visible Condition:       Caption text box
Checkbox text box                            [$invisible] = 0         (Text22).
(Text37)                                     Read-Only
                                             Condition:               This text box is
                                             [$disabled]              visible only when
                                             Input: $x                the Providers >
                                                                      Disabled
                                                                      checkbox
                                                                      (CheckBox28) is
                                                                      not selected.
                                                                      This text box is
                                                                      read-only when
                                                                      the Providers >
                                                                      Disabled
                                                                      checkbox
                                                                      (CheckBox28) is
                                                                      selected.
                                                                      The value you
                                                                      type in this text
                                                                      box is assigned to
                                                                      the $x variable,
                                                                      which is also the
                                                                      Input of the
                                                                      Disable Caption
                                                                      text box (see
                                                                      below).


Control Name                            Property: Value        Explanation
Dependents > Disable
Caption text box                        Visible Condition:     This text box is
(Text39)                                [$invisible] <> 1      visible only when
                                        Input: $x              the Providers >
Dependents > Visible                    Read-Only              Disabled
label                                   Condition:             checkbox
(Label41)                               [$caption] =           (CheckBox28) is
                                        "disabled"             not selected.
                                                               The input of this
                                                               text box is $x,
                                                               which is same as
                                                               the value in the
                                                               Dependents >
                                                               Disable Checkbox
                                                               text box (Text37).
                                                               This text box
                                                               becomes read-
                                                               only when you
                                                               type disabled in
                                                               the Providers >
                                                               Caption text box
                                                               (Text22).

                                        Visible: 1             This label is
                                        Caption                always visible.
                                        Condition:             The caption of
                                        [$invisible] ? 0, 1 :  this label is Yes
                                        "Yes" ,"No"            when the
                                                               Providers >
                                                               Disabled
                                                               checkbox
                                                               (CheckBox28) is
                                                               not selected, and
                                                               No when the
                                                               checkbox is
                                                               selected.

Select Function tab:


Control Name                            Property: Value     Explanation

Categories combo box                    Input: $category    The value you
(ComboBox51)                            Value List          select in this
                                        Condition: select(  combo box is
                                        "name",             assigned to the
                                        "category",         $category
                                        "category", *)      variable, which is
                                                            referenced in the
                                                            Value List
                                                            Condition
                                                            property of the
                                                            Subcategories
                                                            combo box.
                                                            This select
                                                            function returns
                                                            all category
                                                            names from the
                                                            category table
                                                            (that is, the
                                                            category field
                                                            can be any value
                                                            (*)).


Control Name                            Property: Value     Explanation
Subcategories combo
box                                     Input: $x           The value you
(ComboBox53)                            Value List          select in this
                                        Condition: select(  combo box is
Operator combo box                      "subcategory",      assigned to the
(ComboBox57)                            "subcategory",      $x variable
                                        "category",         (which is not
                                        [$category] )       referenced in any
                                                            other conditional
                                                            statements on the
                                                            same screen
                                                            though).
                                                            This select
                                                            function returns,
                                                            from the
                                                            subcategory
                                                            table, the
                                                            subcategories of
                                                            a category you
                                                            specify in the
                                                            Category combo
                                                            box ($category).

                                        Input: $operator    The value you
                                        Value List          select in this
                                        Condition: select(  combo box is
                                        "name",             assigned to the
                                        "operator",         $operator
                                        "name", *)          variable.
                                                            This select
                                                            function returns
                                                            the login names
                                                            of all records in
                                                            the operator
                                                            table (that is, the
                                                            login name can
                                                            be any value (*)).


 Control Name                           Property: Value     Explanation
 Capabilities text area
 (MultiText59)                          Caption             This select function
                                        Condition: select(  returns the capability
Buttons tab:                            "cap.exec",         words (the cap.exec
                                        "operator",         field in the operator
                                        "name",             table) of the operator
                                        [$operator] )       that you select in the
                                                            Operator combo box
                                                            into the Capabilities
                                                            text area.


Control Name                            Property: Value        Explanation
Ok radio button                              Input: $buttonID
(Radio70 )                                   Value: Ok              The input value of
                                                                    this radio button
Cancel radio button                          Input: $buttonID       is assigned to the
(Radio72)                                    Value: Cancel          $buttonID
                                                                    variable.
Design radio button                          Input: $buttonID       When selected,
(Radio73)                                    Value: Design          this radio button
                                                                    has an input value
                                                                    of Ok.

                                                                    The input value of
                                                                    this radio button
                                                                    is assigned to the
                                                                    $buttonID
                                                                    variable.
                                                                    When selected,
                                                                    this radio button
                                                                    has an input value
                                                                    of Cancel.

                                                                    The input value of
                                                                    this radio button
                                                                    is assigned to the
                                                                    $buttonID
                                                                    variable.
                                                                    When selected,
                                                                    this radio button
                                                                    has an input value
                                                                    of Design.


Control Name                            Property: Value        Explanation

None radio button                            Input: $buttonID       The input value of
(Radio74)                                    Value: None            this radio button
                                                                    is assigned to the
                                                                    $buttonID
                                                                    variable.
                                                                    When selected,
                                                                    this radio button
                                                                    has an input value
                                                                    of None.


Control Name                            Property: Value      Explanation

Button                                  Caption              The caption of
(Button71)                              Condition:           this button
                                        [$buttonID]          dynamically
                                        Button ID            changes to the
                                        Condition:           value of the
                                        [$buttonID] ?        $buttonID
                                        "Ok", "Cancel",      variable (Ok,
                                        "Delete",            Cancel, Design,
                                        "Design" : 3, 5, 4,  or None).
                                        9, 50
                                                             The ID of this
                                                             button changes
                                                             dynamically with
                                                             the $buttonID
                                                             variable value as
                                                             follows:

                                                                  3 when the
                                                                  $buttonID
                                                                  value is Ok;
                                                                  5 when the
                                                                  $buttonID
                                                                  value is
                                                                  Cancel;
                                                                  4 when the
                                                                  $buttonID
                                                                  value is
                                                                  Delete;
                                                                  9 when the
                                                                  $buttonID
                                                                  value is
                                                                  Design;
                                                                  50 when the
                                                                  $buttonID
                                                                  value is
                                                                  none of the
                                                                  above-listed
                                                                  values

 Control Name                           Property: Value                      Service Manager 9.81
Bitmaps tab:
                                                         Explanation

                                                              When you press
                                                              the button, it
                                                              functions as the
                                                              Ok, Cancel, or
                                                              Design button
                                                              accordingly.


Control Name                            Property: Value   Explanation

Provider > Ticket                       Input:            The value you
Severity combo box                      $ticketSeverity   select in this
(ComboBox79)                            Value List:       combo box is
                                        ok;warning;alert  assigned to the
                                        Display List:     $ticketSeverity
                                        Low;Medium;High   variable.
                                                          The available
                                                          selections are: ok,
                                                          warning, and
                                                          alert.
                                                          The available
                                                          selections are
                                                          displayed as: Low,
                                                          Medium, and
                                                          High.


Control Name                            Property: Value      Explanation

Dependents > chart                      Caption              Note: The Properties
(Chart81)                               Condition:           pane of this chart
                                        [$ticketSeverity] ?  doesn't currently
                                        "ok", "warning",     display the complete
                                        "alert" :            property information.
                                        "1","5","10","0"     You can open the
                                                             dep.g form in non-
                                        Color                Design mode and click
                                        List=green;yellow    Format Detail from the
                                        ;red                 More Actions menu to
                                                             view the complete
                                        Color                property information of
                                        Scale=1;5;10         this chart.

                                                                  A value displays
                                                                  in the column of
                                                                  the chart as
                                                                  follows:

                                                                        1 when
                                                                        $ticketSever
                                                                        ity is "ok"
                                                                        (that is,
                                                                        when you
                                                                        select Low
                                                                        in the Ticket
                                                                        Severity
                                                                        combo box);
                                                                        5 when
                                                                        $ticketSever
                                                                        ity is
                                                                        "warning"
                                                                        (that is,
                                                                        when you
                                                                        select
                                                                        Medium in
                                                                        the Ticket

Control Name                            Property: Value                      Service Manager 9.81

This PDF was generated on May 23, 2026                   Explanation

                                                                    Severity
                                                                    combo box);
                                                                    10 when
                                                                    $ticketSever
                                                                    ity is "alert"
                                                                    (that is,
                                                                    when you
                                                                    select High
                                                                    in the Ticket
                                                                    Severity
                                                                    combo box);
                                                                    0 when
                                                                    $ticketSever
                                                                    ity is none of
                                                                    the above-
                                                                    listed values
                                                                    (that is,
                                                                    when the
                                                                    Ticket
                                                                    Severity
                                                                    combo box
                                                                    is empty).

                                                              A list of colors is
                                                              applied to the
                                                              chart column:
                                                              green, yellow, and
                                                              red.

                                                              The color of the
                                                              chart column is
                                                              determined as
                                                              follows:

                                                                    Green when
                                                                    the column
                                                                    value is 1;
                                                                    Yellow when
                                                                    the column
                                                                    value is 5;

                                                                                                Page 300 of 369

Control Name                            Property: Value      Explanation

                                                                        Red when
                                                                        the column
                                                                        value is 10.

Dependents > image                      Image Condition:     This image dynamically
(Graph82)                               [$ticketSeverity]    changes with the
                                                             option you select in the
                                                             Ticket Severity combo
                                                             box: Low (ok.gif),
                                                             Medium (warning.gif),
                                                             or High (alert.gif).

Dependents > marquee                    Caption              The caption of this
(Marquee83)                             Condition:           marquee dynamically
                                        [$ticketSeverity] ?  changes with the
                                        "ok","warning","al   option you select in the
                                        ert" : "Severity is  Ticket Severity combo
                                        low ...","Severity   box:
                                        is medium
                                        ...","Severity is         Severity is low ...
                                        HIGH!!"                   when you select
                                                                  Low (ok);
                                                                  Severity is
                                                                  medium ...when
                                                                  you select
                                                                  Medium
                                                                  (warning);
                                                                  Severity is HIGH!!
                                                                  when you select
                                                                  High (alert).

Circular Dependencies tab

Control Name                            Property: Value                         Service Manager 9.81
Hello checkbox                               Input: $hello
(CheckBox88)                                 Selected       Explanation
                                             Condition:
World checkbox                               [$world]            The input value of
(CheckBox89)                                                     this checkbox (0
                                             Input: $world       or 1) is assigned
                                             Selected            to the $hello
                                             Condition:          variable.
                                             [$hello]            This checkbox is
                                                                 selected or
                                                                 deselected when
                                                                 the value of the
                                                                 $world variable is
                                                                 1 or 0 (that is,
                                                                 when the World
                                                                 checkbox is
                                                                 selected or
                                                                 deselected).

                                                                 The input value of
                                                                 this checkbox (0
                                                                 or 1) is assigned
                                                                 to the $world
                                                                 variable.
                                                                 This checkbox is
                                                                 selected or
                                                                 deselected when
                                                                 the value of the
                                                                 $hello variable is
                                                                 1 or 0 (that is,
                                                                 when the Hello
                                                                 checkbox is
                                                                 selected or
                                                                 deselected).


Control Name                            Property: Value          Explanation

I am my number one                           Input: $self             The input value of
fan! checkbox                                Selected                 this checkbox (0
(CheckBox91)                                 Condition: [$self]       or 1) is assigned
                                                                      to the $self
                                                                      variable.
                                                                      This checkbox is
                                                                      selected or
                                                                      deselected when
                                                                      the value of the
                                                                      $self variable is 1
                                                                      or 0 (that is,
                                                                      select or deselect
                                                                      of this checkbox
                                                                      is independent of
                                                                      any other
                                                                      controls).

Note: The fields in dep.g use variables because dep.g is not associated to a dbdict.
You can use field names on forms that do have an associated dbdict.


1.1.3.2.2. Setting Dynamic View
Dependencies properties

You can set up a number of properties for dynamic evaluation using the Properties
window of Forms Designer. For example, the Caption property that you set for a Label
specifies the text to display on the screen. Under the “Caption” property there is a
property named “Caption Condition.” This associated property enables you to specify
a condition evaluated dynamically to compute a caption for the label. These two
properties are paired for the purpose of DVD conditions. There are several other
property pairings as well.

Several Forms Designer controls have “property” and “property condition” pairs. In
each case, you can specify a special conditional statement that specifies the run-time
value for the property.

DVD conditional property pairings and examples of their supported types of controls
are listed in the following table.


Property                                Property Condition       Examples of supported
Caption                                                          control types
                                        Caption Condition
Value List                                                       Button, Check Box,
Display List                            Value List Condition     Combo Box, Label,
Visible                                 Display List Condition   Marquee, Radio Button,
                                        Visible Condition        Text, and Text Area
Foreground Color
Background Color                        Foreground Color         Combo Box
Bold                                    Condition
Italic                                  Background Color         Combo Box
Font Increase                           Condition
Read-Only                               Bold Condition           Button, Check Box,
                                        Italic Condition         Combo Box, Label,
Button ID                               Font Increase Condition  Marquee, Radio Button,
Image File                              Read-Only Condition      Text, and Text Area
-
                                        Button ID Condition      Label
                                        Image Condition
                                        Selected Condition       Label

                                                                 Label

                                                                 Label

                                                                 Label

                                                                 Check Box, Combo Box,
                                                                 Radio Button, Text, and
                                                                 Text Area

                                                                 Button

                                                                 Button

                                                                 Check Box

Property                                Property Condition                           Service Manager 9.81
Mandatory                               Mandatory Condition
Enabled                                 Enabled Condition    Examples of supported
                                                             control types

                                                             Combo Box, Radio
                                                             Button, Text, and Text
                                                             Area

                                                             Button


1.1.3.2.3. Using Dynamic View
Dependencies vs. Data Policy

Overuse of DVD on forms can result in performance problems. For example:

     Using the select function or a $ variable that's not on the form requires an
     interaction with the server. On connections with slow network response the use
     of these types of DVD statements can significantly impact performance.
     Using Focus In/Out or Data Changed Events also causes a server interaction.
     During design, the response time may seem adequate. However on a network
     with a half second response, it can be cumbersome.

Data Policy operates at the table level and achieves many of the same results without
the complexity and without taxing system resources. For example, one common use
of DVD is to set Visible or Readonly conditions, both of which can be set using Data
Policy. With Data Policy, the conditions are evaluated on the server before the form is
sent, thus avoiding a network interaction.


1.1.3.2.4. Field comparisons

Field comparisons use a statement to create a conditional property for a control on a
form.

Syntax: FIELD OPERATOR VALUE

     FIELD is any variable or field name surrounded by brackets, for example, [$x],
     [name], and so forth.
     OPERATOR can be = , > , < , <> , or # .
     VALUE is any quoted string or number.

Note: Field comparisons can also use complex conditions or statements to create a
conditional property for a control on a form. You can use | or & to concatenate
multiple expressions. For example: [$L.one.click]<>true &[$quantity]>1&
[$orderonbehalf.marker]<>true .

Important: In order for a property to depend on a variable (or record field), the
variable must be assigned as an input to an object on the same screen. For examples,
see Use form dep.g to demonstrate Dynamic View Dependencies.

Here are some examples of using field comparisons.

     Making a certain field visible only when the category of a record equals
     "network."

           Assume that the category can be selected via a drop-down list whose Input
           is defined as $category .
           You can specify the visibility dependency by assigning the following to the
           Visible Condition property of the field:
            [$category] = "network"
           Instead of a variable, a drop-down list can use a record field as input. If the
           field is named "category," set up the "Visible Condition" as follows:
             [category] = "network"

     Adding a DVD visible condition to a field:

[assignment]#"help"

     Specifying an inequality comparison:

[$category] <> "network" (that is, category is not network)


     Using complex conditions or statements to create a conditional property for a
     control on a form.

            [$category]="network"&[$subcategory]="modem"
            [$category]="network"|[$category]="DEFAULT"

Complex conditions are true only if both parts of the condition are true.


1.1.3.2.5. Field value matching

Field value matching enables you to specify matching output values to various input
values.

Syntax: FIELD ? ValueList : DisplayList

FIELD is any variable or file field surrounded by brackets, for example, [$x], [name] ,
and so forth.
ValueList and DisplayList are lists of comma-separated values

Use field value matching

Setting the color of a label to change based on the value of a severity field

The severity is specified in an edit field whose input is $severity. You set the Color
Condition of the label as follows:

[$severity]? "sev1","sev2","sev3" : 1,7,2

This statement tells the label to do the following:

     Use a color value of 1 (red) when $severity="sev1"
     Use a color value of 7 (yellow) when $severity="sev2"
     Use a color value of 2 (green) when $severity="sev3"

Specify a value to use if no match is found

[$severity]? "sev1","sev2","sev3" : 1,7,2, 0

This tells the system to use color 0 (black) if $severity is none of the listed "sev"
values.
Note: The $severity field must have been assigned as input to at least one field on the
screen.

Contents

     1 Use field value matching


1.1.3.2.6. Dynamic functions

The dynamic property condition statement enables you to call a function that
evaluates a result dynamically.

Syntax: FunctionName( PARM_0, ..., PARM_n )

The parameters for the function can be any string or number. One parameter may
also be a variable or record field.

The dynamic functions include:

     lang_preference(lang)
     This function returns the current language table selection. It takes as a
     parameter the current language value.
     You can use it to save new language settings in the user preferences for future
     reference. It forces the user interface to update its language table and repaint as
     necessary.

     select(return_field, file_name, select_field, select_field_value, select_field_2,
     select_field_value_2)

     This function works against many records to grab a scalar value from each one
     to make a list. You can use it to select just one record and use an array from
     within that record (for example, the cap.exec array field of the operator table)
     to make a display list.

     This function returns the value of a field ( return_field ) of a record that's from a
     table ( file_name ) and has a field ( select_field ) value equal to a specified value
     ( select_field_value ). The select_field_value can be a variable or a wildcard
     character (an asterisk). Both select_field_2 and select_field_value_2 are
     optional.

     The following are examples:

            select( "subcategory", "subcategory", "category", [$category] )
            select( "name", "operator", "name", *)
            select( "cap.exec", "operator", "name", [$operator] )

Use dynamic functions

Use the following to select all the login IDs from a department to make a list:

select("name","operator","department",[$dept])


Use the following to select all the approvers for a certain group:
select("approvers","cm3groups","name",[$cm3group])
````
