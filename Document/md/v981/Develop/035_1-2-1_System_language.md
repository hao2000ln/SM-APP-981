---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.1 .. 1.2.1.3
printed_pages: 941-977
---

# 1.2.1 System language

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.1. System language

The System language (RAD) provides the ability for administrators to manipulate the
Service Manager processes and workflows using a programming language with a
syntax that's similar to the C programming language. Administrators and
implementers use this language daily to apply Service Manager to a specific purpose
or enterprise. The key to Service Manager’s remarkable flexibility can be found in the
proper use of the system language.

The System language creates RAD applications that contain application panels
(records) linked together in a logical flow. Each panel performs a specific function.
When the function is complete, the application exits to another panel. The field value
within the exit is a label name of another panel.

The parameter panel defines local variables passed to it by a calling application. In
general, two kinds of local variables exist: those used within an application, and those
used as exits. Normally, the exit variables are $normal (in the normal exit) and $error
(in the error exit).

The first command panel, where execution begins, is always labeled start. Execution
continues at a panel’s normal exit (or another exit depending on conditions). When
that exit is defined as $normal, execution of the panel is complete. If an error is
encountered, then the $error exit is taken.

            Note

           You must have a RAD license to view and modify the RAD applications
           with the RAD editor.


1.2.1.1. Data types

The Service Manager data type specifies the expected format of a field's data. The
data type determines the possible range of values of the set, the operations that can
be performed on the values, and the way values are stored in memory. Defining a
data type enables the system to manipulate the data appropriately. The values are
denoted either by literals or variables. They also can be obtained as a result of
operations. Data types can be either primitive or compound.

            Note

           System Administrators and implementers should only use types 1 through
           4 or 8 to 10.

List: Data types

Data type    Numeric                    Compound /         Service Manager 9.81
number       representation             Primitive
                                                    Purpose
             1                          Primitive
                                                    Used for all
character    2                          Primitive   numeric type
                                        Primitive   data.
time (date/time) 3
                                                    Used for
Boolean (logical) 4                     Primitive   character strings.
                                        Primitive
label        5                          Compound    Used for absolute
                                        Compound    dates and times
File/record  6                                      as well as relative
                                                    time intervals.
Offset       7
                                                    Used to represent
Array        8                          Compound    true or false.
                                        Compound
Structure    9                                      Used to define
                                                    exits.
This PDF was generated on May 23, 2026
                                                    used to define a
                                                    table or record.

                                                    This is the
                                                    compiled version
                                                    of a label. It is
                                                    used within the
                                                    code for the go to
                                                    statements.

                                                    Used to represent
                                                    multiple fields of
                                                    the same data
                                                    type.

                                                    Used to represent
                                                    a collection of
                                                    fields of the same
                                                    or different data
                                                    types.

                                                                             Page 222 of 254
Data type       Numeric                 Compound /         Service Manager 9.81
Operator        representation          Primitive
Expression                                          Purpose
                10                      Primitive
                                                    Used in
                11                      Primitive   expressions.

Pseudo field    12                      Compound    Used to represent
                                        Compound    parsed Rapid
Global variable 13                      Compound    Application
                                                    Development
Local variable  14                                  (RAD) language
                                                    expressions.

                                                    Used similarly to
                                                    functions, it
                                                    converts input
                                                    data into output
                                                    data.

                                                    Used for
                                                    variables visible
                                                    to the whole
                                                    system.

                                                    Used for
                                                    variables only
                                                    visible to the RAD
                                                    application


1.2.1.1.1. Data type: Primitive

Primitive data types consist of one element. Service Manager internally represents
each data type by its numeric representation. Certain functions ( val() and type() )
allow the user to determine or modify the numeric representation of a data type, thus
changing the data type.

Data type: Number

The number data type is a primitive data type represented by the number 1 in the
database dictionary. A number indicates an amount and can be either a whole
number, a positive or negative number, or a floating point number. Enter numbers with
an optional sign (+ or -) followed by digits which are optionally followed by a decimal
point, then more digits which are optionally followed by the letter E and an exponent.

The following number formats display valid numbers accepted by RAD.

Description                             Valid literal examples
Integer                                 1
Negative Integer                        -1
Fixed Point                             32.1
Floating Point                          1.257E05

Furthermore, each bullet shows different representations of the same number:

     1 = 1.0 = 1E0 = 1.0E0
     -1 = -1.0 = -1E0 = -1.0E0
     32.1 = 32.10 = 3.21E1
     -32.1 = -32.10 = -3.21E1
     1.257E05 = 125700 = 1.25700E5

Data type: Character

The character data type is a primitive data type represented by the number 2 in the
database. A character data type is typically expressed as a character string. A
character string has the following characteristics:

     It must be enclosed in double quotation marks.


     It can be any combination of letters, digits spaces, or special characters.
     It can contain any special characters including those used as operators.
     It can contain a double quotation mark, but it must be preceded by a backslash
     (\) to enable the system to distinguish between double quotation marks as part
     of the string and a double quote at the beginning or end of the string. For
     example, "Vendor=\"473\"" denotes the string: Vendor="473" .
     It can contain non-characters, such as two hexadecimal digits preceded by a
     backslash.
     It can treat any special or reserved character as a literal character by preceding
     it with a backslash.
     It can present a literal backslash (\) by containing a double backslash (\\).
     It can be any length, including zero.
     An empty (for example, length of zero) character string is not the same as a
     character string with a NULL value.

The following table presents some examples.

Description                             Literal examples
Alphabetic                              "abcde"
Numeric                                 "12379"
Alphanumeric                            "a1276b45"
Special                                 "$%=+*#@/"
Mixed                                   "$vendor"
Mixed                                   "$12379@6:54"
Mixed                                   "A1276%#B"
Hexadecimal                             "\01\ff\c2"
Containing backslash                    "C:\\Program Files\\OpenText\\Service
                                        Manager 9.80\\Server\\RUN\\sm.ini"
Containing double quote                 "Enter the \"uid\" in the Unique ID
                                        field"


Data type: Time

The Time data type is a primitive data type represented by the number 3 in the
database dictionary. In all of the examples in this topic, the following acronyms apply:
MM=month; DD=day; DDD=day; YY=year; HH=hours; MM=minutes; SS=seconds.
Furthermore, MM/DD/YY is collectively referred to as date and HH:MM:SS is
collectively referred to as time. The following rules govern the use of the time data
type:

     Time must be enclosed in single quotation marks.
     Time is recorded on a 24-hour clock. '00:00:00' is midnight, '12:00:00' is noon,
     '18:00:00' is 6 p.m.
     Enter absolute time in the following format: 'MM/DD/YY HH:MM:SS'. The
     format's sequence is affected by the set.timezone() function. It determines the
     order of date (MM/DD/YY). Note that absolute time is stored as GMT notation.
     Enter relative time in the following format: 'DDD HH:MM:SS'
     The use of seconds is optional. If you don't use seconds, the default is :00.
     The use of time is optional in absolute time. If you omit time, it defaults to
     00:00:00. For example, 'MM/DD/YY' is 'MM/DD/YY 00:00:00'.
     The use of days is optional in relative time. If you omit days, the default is 0. For
     example '12:00' is zero days and 12 hours, '345 03:00' is 345 days and 3 hours.
     Use $time = '00:00' to set a time variable to a 0 (zero) value.

The following date/time formats show valid times/dates accepted by RAD:

Date/time format                        Description                Valid literal examples
Absolute time                                                      '07/16/83 04:30:00'
Relative time                           Indicates a specific date
Relative time                           and time                   '197 05:00' (means 197
                                                                   days and 5 hours)
                                        Indicates an amount of     '1 00:00:00' (means 1
                                        time                       day)

                                        Indicates an amount of
                                        time

Data type: Boolean

The Boolean or logical data type is a primitive data type represented by the number 4
in the database dictionary. A Boolean indicates true, false or unknown (of
undetermined truth value). The rules for forming a Boolean are as follows:


     Enter the Boolean directly as true, false, NULL, unknown (t, f or u).
     Enter the Boolean in either upper or lowercase characters.

The following formats are accepted.

Description                             Valid literal examples
True
                                        t = T= true = TRUE = y = Y = yes =
False                                   YES

NULL                                    f = F = false = FALSE = n = N = no =
Unknown                                 NO

                                        Null = NULL

                                        u = U = unknown = UNKNOWN

Data type: Label

The label data type is a primitive data type represented by the number 5 in the
database dictionary. Labels are used to define exits. The following examples are valid
labels.

     $exit
     $normal
     <panel name>


1.2.1.1.2. Data type: Compound

Compound data types consist of more than one element. You may combine primitive
data types to form compound data types. Any compound data type can have
elements of any other valid data types.


1.2.1.1.2.1. Data type: File/Record

The File/Record data type is a compound data type represented by the number 6 in
the database dictionary. A file is a set of related records treated as a single unit and is
stored on disk. A file is a particular kind of structure, but a structure is not a kind of
file.

The term file is synonymous with the terms relation or table and is sometimes used
interchangeably with the term table because of the legacy file system (P4) in Service
Manager.

Every table must have a table name and other descriptive data in the database
dictionary. For example, the name of the contacts table is contacts. The contacts
table has keys, fields with index numbers, and a descriptor. Table variables are the
mechanism you use to make changes to tables. Always create table variables on the
rinit command panel. The table variable stores one record at any given point in time.
The record resides in memory for display or modification. For additional information,
see Database administration.

File variables

A file variable is an instance of a single record in a file. It's not an array, but it is
conceptually similar. A file variable contains the dbdict name, the data, and the
structure of an entire record as it would be stored in the database according to the
dbdict. A file variable has four parts:

     File name in the database dictionary The RAD Database Manager requires this
     to be a single word without spaces or periods. The rinit command panel binds
     the file variable to a file. The file name of a file variable can be accessed either
     by using the pseudo field or using the filename() RAD function.
     List: records selected from the file When executed, a select command panel
     retrieves the file’s records from the database and sets up the list. When
     executed, a fdisp (File Display) command panel displays summary information
     from records in the list.
     Current record A file variable can only contain one record from a file at a time.
     You can move to the next record in the list of records by using the next
     command panel (Read Next Record). You can move to the previous record in the
     list by using the previous command panel (Read Previous Record). The select
     command panel always sets the current record to the first record that satisfies
     the selection query. The fdisp (File Display) command panel sets the current
     record to the record selected by the cursor when the user presses Enter.


     Descriptor The descriptor enables fields to be extracted by name. Each record
     is a structure and has the structure delimiter {[ ]}. The field names in the
     structure are listed in the database dictionary.

For example:

     $file is a file variable.
     lastname is a field name listed in the database dictionary for the file that $file
     has been bound to using the rinit command panel.
     lastname in $file is a valid expression whose value is the lastname field in the
     current record in $file, or the nth field, based on the index of the lastname field
     in the descriptor.

            Note

           Service Manager is case-sensitive. The case for field names, file names,
           and other elements must match. For example, STATUS.CUST is not the
           same as status.cust.


1.2.1.1.2.2. Data type: Offset

The Offset data type is a legacy compound data type represented by the number 7 in
the Database Dictionary. Offset fields aren't supported by RDBMS tables.


1.2.1.1.2.3. Data type: Array

The array data type is a compound data type represented by the number 8 in the
database dictionary. Arrays store a list of elements of the same data type accessed
by an index (element) number. The term array is synonymous with the terms list,
vector, and sequence. Elements in arrays can be of any data types (including arrays
or structures). A fully qualified array name (array field in $file) can be used in place of
an array variable. The number of items in an array can vary and doesn't have to be
allocated in advance. Arrays are delimited by curly braces ({ }). The following table
shows some examples.

Description                             Literal examples
Numeric                                 {1,2,3}
Character                               {"a","b","c","f","e","h"}
Boolean                                 {true, true, unknown}
Time                                    {'12/7/42 00:00', '1/3/62 00:00'}
Nested                                  {{1,2},{3,4}}
Structures                              {{[1,"a"]},{[2,"b"]}}
                                        {{[1,"a",true]},{[2,"b",false]},
                                        {[3,"c",unknown]}}

Empty                                   {}

You can use either of the following equivalent syntaxes to access an element in an
array:

     $array[element_number]
     element_number in $array

For example, to extract the value of the first customer number (2753) in the array
$customer with value {2753, 2842, 2963}, use any of the following equivalent
syntaxes:


     1 in $customer
     $customer[1]

If the accessed array element doesn't exist, the element is created and set to NULL.
This effectively extends the array. To insert a value into an array use the insert RAD
function. To delete an element from an array, use the delete RAD function.

            Tip

           You can use the denull RAD function to remove any null values from the
           end of an array before assigning the array to a record or adding it to the
           database.


1.2.1.1.2.4. Data type: Structure

The Structure data type is a compound data type represented by the number 9 in the
database dictionary. A structure is a group of named elements of (possibly) differing
data types accessed by an index (element) number. Structures are delimited with both
curly braces and square brackets ({[ ]}). Note the following examples:

     {[1,"a",true]}
     {[true,‘10/16/90 00:00’,false]}
     {[1,1,"b",0]}

You can use either of the following syntaxes to extract an element from a structure:

     $structure[index of field]
     index of field in $structure

For example, to extract the value of the part number (672) in the part.no field within
the structure $order.line1 with the value of {[672,10,"ball.bearings"]} with the field
names part.no, quantity and description, use either of the following syntaxes:

     $order.line1[1]
     1 in $order.line1

In addition, elements of structures may be extracted using their numeric order in the
structure . For example, the 1 in $order.line1 is the same as part.no in $order.line1.

Field names are contained in the database dictionary and can only be used when
associated with a file variable.

Assuming that the table contains a structure called part and within the structure and
there is field called part.no, this command works because it is associated with a file
variable.

  $x=part,part.no in $file

These commands don't work because the second command is not associated with a
file variable.

  $y=part in $file


$x=part.no in $y


1.2.1.1.2.5. Data type: Operator

The Operator data type is any expression that's parsed and returns a value, such as
tod() , gui() , rtecall() , = (comparison). An operator is a special symbol or function
commonly used in expressions. Service Manager uses several different operators:

     arithmetic operators
     logical operators
     relational operators
     special operators
     string operators

The following table presents a list of operators used in Service Manager.

Type        Name                        Character         Service Manager 9.81
Arithmetic  Addition                    +
Arithmetic                                         Description
            Subtraction                 -
Arithmetic                                         Indicates that two
            Multiplication              *          numbers are to
                                                   be added
                                                   together.
                                                   Example:

                                                     49 + 51 =
                                                     100

                                                   Indicates that one
                                                   number is to be
                                                   subtracted from
                                                   another number.
                                                   To distinguish
                                                   subtraction from
                                                   a minus sign, the
                                                   subtraction
                                                   operator must be
                                                   followed by a
                                                   space.
                                                   Example:

                                                     40 - 20 =
                                                     20

                                                   Indicates that one
                                                   number is to be
                                                   multiplied by
                                                   another number.
                                                   Example:

                                                     5 * 5 = 25

Type        Name                        Character         Service Manager 9.81
Arithmetic  Division                    /
                                                   Description
Arithmetic  Exponentiation **
                                                   Indicates that one
                                                   number is to be
                                                   divided by
                                                   another number.
                                                   Example:

                                                     300 / 10 =
                                                     30

                                                   Indicates that the
                                                   exponential value
                                                   of a number is to
                                                   be calculated.
                                                   Example:

                                                     2 **5 = 32

Type        Name                        Character         Service Manager 9.81
Arithmetic  Modulus                     mod or %
                                                   Description

                                                   The modulus is
                                                   the remainder of
                                                   a division
                                                   operation. You
                                                   may specifically
                                                   want the
                                                   remainder for a
                                                   division
                                                   operation, or you
                                                   may want to
                                                   generate a
                                                   circular number
                                                   sequence within a
                                                   given range.

                                                   Example:

                                                     5 mod 2 = 1

                                                     or 5 % 2 =
                                                     1

Type    Name                            Character         Service Manager 9.81
String  Concatenate                     +
                                                   Description

                                                   Indicates that two
                                                   strings or two
                                                   arrays are to be
                                                   combined
                                                   (concatenated)
                                                   into a single
                                                   string.
                                                   Example:

                                                     "a" + "b" =
                                                     "ab"
                                                     {"a", "b",
                                                     "c",} +
                                                     {"d", "e"}
                                                     = {"a",
                                                     "b", "c",
                                                     "d", "e"}

Type     Name                           Character         Service Manager 9.81
Logical  not                            !
                                                   Description

                                                   Inverts the
                                                   Boolean value of
                                                   the Boolean
                                                   expression. If the
                                                   expression is
                                                   true, the system
                                                   returns FALSE. If
                                                   the expression is
                                                   false, the system
                                                   returns TRUE.

                                                   Example:

                                                     not TRUE =
                                                     FALSE
                                                     ~ FALSE =
                                                     TRUE (UNIX
                                                     only)
                                                     UNKNOWN =
                                                     UNKNOWN
                                                     ~ UNKNOWN =
                                                     UNKNOWN

Type     Name                           Character         Service Manager 9.81
Logical  and                            AND and &
                                                   Description

                                                   Evaluates two
                                                   expressions and
                                                   returns a value of
                                                   TRUE if both
                                                   expressions are
                                                   true. If one or
                                                   both of the
                                                   expressions is
                                                   false, the system
                                                   returns FALSE .

                                                   Example:

                                                     TRUE and
                                                     TRUE = TRUE
                                                     TRUE and
                                                     FALSE =
                                                     FALSE
                                                     TRUE and
                                                     UNKNOWN =
                                                     UNKNOWN
                                                     FALSE and
                                                     UNKNOWN =
                                                     FALSE

Type        Name                        Character         Service Manager 9.81
Logical     or                          <
                                                   Description
Relational  Less Than
                                                   Evaluates two
                                                   expressions and
                                                   returns a TRUE if
                                                   either or both of
                                                   the expressions is
                                                   true. If both
                                                   expressions are
                                                   false, it returns a
                                                   FALSE.
                                                   Example:

                                                     TRUE or
                                                     FALSE =
                                                     TRUE
                                                     FALSE |
                                                     FALSE =
                                                     FALSE
                                                     FALSE OR
                                                     UNKNOWN =
                                                     UNKNOWN
                                                     TRUE OR
                                                     UNKNOWN =
                                                     TRUE

                                                   Indicates that the
                                                   value of one item
                                                   is less than the
                                                   value of another
                                                   item.
                                                   Example:

                                                     400 < 500
                                                     is TRUE

Type        Name                        Character         Service Manager 9.81
Relational                              <= or =<
            Less Than or                           Description
Relational  Equal To
                                                   Indicates that the
            Equal To                    =          value of one item
                                                   is less than or
                                                   equal to the value
                                                   of another item.
                                                   Example:

                                                     400 < = 500
                                                     is TRUE
                                                     400 = < 500
                                                     is TRUE

                                                   Indicates that the
                                                   value of one item
                                                   is equal to the
                                                   value of another
                                                   item.
                                                   Example:

                                                     1 = 1 is
                                                     TRUE


Type        Name                        Character         Description
Relational  Greater than                >
                                                          Indicates that the
Relational                                                value of one item
                                                          is greater than the
Relational                                                value of another
                                                          item.

                                                          Example:

            Greater Than or             >= or =>            '08/01/83
            Equal To                                        00:00' >
                                                            '07/20/83
                                                            00:00' is
                                                            TRUE

                                                          Indicates that the
                                                          value of one item
                                                          is greater than or
                                                          equal to the value
                                                          of another item.
                                                          Example:

            Not Equal To                (¬ =) or (~=) or    600> =300
                                        (<>) or (><)
                                                            is TRUE
                                                            600= >300
                                                            is TRUE

                                                          Indicates that the
                                                          value of one item
                                                          is not equal to the
                                                          value of another
                                                          item.

                                                          Example:
                                                          1 ~=2 is TRUE
                                                          (UNIX only)

Type        Name                        Character         Service Manager 9.81
Relational                              #
            Starts With                            Description
Relational  (Truncated
            Equals)                                Indicates that the
                                                   value of the first
            Does Not Start              ¬# or ~#   string starts with
            With (Truncated                        the value of the
            Not Equal To)                          second string.
                                                   The order of the
                                                   operands affects
                                                   this operation.
                                                   Example:

                                                     "abc"#"ab"
                                                     is TRUE

                                                   Indicates that the
                                                   value of the first
                                                   string doesn't
                                                   start with the
                                                   value of the
                                                   second string.
                                                   The order of the
                                                   operands affects
                                                   this operation.
                                                   Example:

                                                     "ab" ~
                                                     #"abc" is
                                                     TRUE (UNIX
                                                     only)

Type     Name                           Character         Service Manager 9.81
Special                                 ;
         Statement                                 Description
         Separation
                                                   This operator
Special  Parentheses                    ()         separates two or
                                                   more statements
This PDF was generated on May 23, 2026             on the same line.
                                                   Example:

                                                     $A=$B+$C;$B
                                                     =$C+$D

                                                   This operator
                                                   groups together
                                                   expressions or
                                                   statements.
                                                   Service Manager
                                                   follows the
                                                   standard order of
                                                   operations:
                                                   operators inside
                                                   the parentheses
                                                   are evaluated
                                                   first. Parentheses
                                                   themselves are
                                                   evaluated from
                                                   left to right.
                                                   Example:

                                                     3*($x + $y)
                                                     IF ($x=1)
                                                     THEN
                                                     ($y="z")
                                                     ELSE ($y=3)
                                                     IF ($x=1)
                                                     THEN
                                                     ($x=2;$z=1)
                                                     ELSE ($y=3)

                                                                            Page 247 of 254

Arithmetic operators

An arithmetic operator indicates actions to be performed under the terms of an
arithmetic expression. Arithmetic operators have the following precedence:
exponentiation, followed by multiplication, division and modulus (all equal); then
addition and subtraction (both equal). Operators with higher precedence are
evaluated first. When the operators have equal precedence, they run from left to right.

Logical operators

A logical operator evaluates one or two Boolean expressions. It determines whether
the expression is true, false, or unknown.

The logical operators are as follows (executed in the order shown):

     not
     and
     or

The unknown truth value is treated according to the Substitution Principle, which
dictates:

     If UNKNOWN occurs as a logical operand, then the result of the operation is
      TRUE if substituting TRUE or FALSE for UNKNOWN always yields TRUE .
     The result is FALSE if substituting TRUE or FALSE for UNKNOWN always
     yields FALSE .
     The result is UNKNOWN if substituting TRUE or FALSE for UNKNOWN
     sometimes yields TRUE and sometimes yields FALSE .

Relational operators

A relational operator makes a comparison, then generates logical results on whether
the comparison is true or false. An operand can be checked for null using the special
value NULL . $x=NULL is true if $x is null. Relational operators treat null operands
according to the NULL substitution principle:

     If the relation is true regardless of the value of the null operand, the result is
     true.
     If the relation is false, the result is false.
     Otherwise, the result is unknown.


1.2.1.1.2.6. Data type: Expression

Expressions are sequences of operators and operands used to compute a value. An
expression contains literals or variables. An expression can also be used with a
function call. Here are examples of expressions:

     $X * 25
     $Y > 32


1.2.1.1.2.7. Data type: Pseudo field

The pseudo field data type is a legacy compound data type represented by the
number 12 in the database dictionary. A pseudo field is similar to a function, because
it converts input data to output data and can sometimes be assigned. It can be placed
on the left-hand side of the equals (=) sign in an assignment statement. Service
Manager has pre-defined pseudo-fields (Month and Name). Pseudo fields were
supported for legacy ServiceCenter data but aren't supported by SQL tables. The
following tables describe the pseudo fields.

Month                                   Accesses the number of months from
Explanation                             the beginning of the time base in a
                                        date. Use it to increment a date by a
Format                                  period of months.

                                        Month in $time +=1

                                        This increments the current month by
                                        one.

Factors                                 The month pseudo field is useful for
                                        scheduling monthly reports, since it
                                        calculates the number of days to add to
                                        each month.

Name                                                                                            Service Manager 9.81
Explanation
Format                                  Accesses the file name in a specific file
                                        variable.
Factors                                 $filename=Name in $file
                                        This sets $filename to the name of the
                                        file bound to $file.

                                        The name pseudo field is analogous to
                                        the filename function


1.2.1.1.2.8. Data type: Global variable

The global variable data type is a compound data type represented by the number 13
in the database dictionary. Global variables begin with $G. or $lo. and persist
throughout a user session ( $lo. is an abbreviation for logged on. These variables are
set when the operator logs on). The server automatically cleans up global variables
when a user logs off the system.


1.2.1.1.2.9. Data type: Local variable

The local variable data type is a compound data type represented by the number 14 in
the database dictionary. Local variables begin with $L. and persist only within the
currently executing RAD application. The server automatically cleans up local
variables when it exits a RAD application.


1.2.1.2. Reserved words

Reserved words have special meaning in Service Manager. This meaning is defined in
RAD. They can only be used for that purpose. Do not use them for any other purpose
such as field names. Here is a alphabetical list of reserved words:

     AND
     BEGIN
     DO
     ELSE
     END
     FALSE
     FOR
     IF
     IN
     ISIN
     NOT
     NULL
     OR
     STEP
     WHILE
     THEN
     TRUE
     UNKNOWN


1.2.1.3. Literals

A literal is an explicit value. It is expressed as itself rather than as a variable's value or
as the result of an expression. Some simple examples are “23”, “2.5”, and “John.” You
can use a literal wherever you can use a variable, with one exception. A literal can't
be on the left side of an assignment statement.
````
