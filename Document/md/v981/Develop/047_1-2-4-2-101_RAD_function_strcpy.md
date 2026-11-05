---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.4.2.101 .. 1.2.4.2.115
printed_pages: 1261-1286
---

# 1.2.4.2.101 RAD function: strcpy

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.4.2.101. RAD function: strcpy

A RAD function that replaces a part of a string with a substring.
Function
strcpy
Format

$L.void=strcpy($target, $tindex, $source, $sindex, $number)

Parameters
The following parameters are valid for the strcpy function:

Parameter                               Data type            Description
$L.void=                                Not applicable.
$target                                 String               A syntax requirement
$tindex                                 Number               only, doesn't affect the
                                                             outcome of the function.
$source                                 String
$sindex                                 String               The string being
$number                                 Number               modified.

                                                             The position in $target
                                                             to begin copying a
                                                             substring from
                                                             $source .

                                                             The string supplying a
                                                             substring.

                                                             The beginning position
                                                             of the substring within
                                                             $source .

                                                             The number of
                                                             characters to copy from
                                                             $source .


Example

  $target="Hewlett-Packard"
  $tindex=4
  $source="falcon"
  $sindex=2
  $number=3
  $L.void=strcpy($target, $tindex, $source, $sindex, $number)

After execution, value of $target is Hewalct-Packard .


1.2.4.2.102. RAD function: strdel

A RAD function that deletes a number of characters from a specific location in a
string.

Function

strdel

Format

$L.void=strdel($string, $index, $number)

Parameters
The following parameters are valid for the strdel function:

Parameter                               Data type            Description
$L.void=                                Not applicable.
                                                             A syntax requirement
$string                                 String               only, doesn't affect the
$index                                  Number               outcome of the function.

$number                                 Number               The string being
                                                             modified.

                                                             The location in $string
                                                             from which characters
                                                             are to be deleted.

                                                             The number of
                                                             characters to delete from
                                                             $string .

Example

$string="Hewlett-Packard"
$index=6
$number=8
$L.void=strdel($string, $index, $number)


After execution, the value of $string is Hewletd .


1.2.4.2.103. RAD function: strins

A RAD function that inserts a substring into another string.
Function
strins
Format

$L.void=strins($target, $tindex, $source, $sindex, $number)

Parameters
The following parameters are valid for the strins function:

Parameter                               Data type            Description
$L.void=                                Not applicable.
$target                                 String               A syntax requirement
$tindex                                 Number               only, doesn't affect the
                                                             outcome of the function.
$source                                 String
$sindex                                 String               The string being
$number                                 Number               modified.

                                                             The position in $target
                                                             to begin inserting a
                                                             substring from
                                                             $source .

                                                             The string supplying a
                                                             substring.

                                                             The beginning position
                                                             of the substring within
                                                             $source .

                                                             The number of
                                                             characters to insert from
                                                             $source .


Example

  $target="Hewlett-Packard"
  $tindex=4
  $source="falcon"
  $sindex=2
  $number=3
  $L.void=strins($target, $tindex, $source, $sindex, $number)

After execution, value of $target is Hewalclett-Packard .


1.2.4.2.104. RAD function: strpadl

A RAD function that pads a string with leading blanks until the string is a specified
size.

Function

strpadl

Format

$L.void=strpadl($string, $size)

Parameters
The following parameters are valid for the strpadl function:

Parameter                               Data type        Description
$L.void=                                Not applicable.
                                                         A syntax requirement
$string                                 String           only, doesn't affect the
$size                                   Number           outcome of the function.

                                                         The string being
                                                         modified.

                                                         The desired size of
                                                         $string .

Example

  $string="Hewlett-Packard"
  $size=20
  $L.void=strpadl($string, $size)

After execution, value of $string is (space)(space)(space)(space)(space)Hewlett-
Packard .


1.2.4.2.105. RAD function: strpadr

A RAD function that pads a string with trailing blanks until the string is a specified
size. If the string is longer than the size desired, it is truncated.

Function

strpadr

Format

$L.void=strpadr($string, $size)

Parameters
The following parameters are valid for the strpadr function:

Parameter                               Data type             Description
$L.void=                                Not applicable.
                                                              A syntax requirement
$string                                 String                only. It doesn't affect the
$size                                   Number                outcome of the function.

                                                              The string being
                                                              modified.

                                                              The desired size of
                                                              string.

Examples

  $string="Hewlett-Packard"
  $size=20
  $L.void=strpadr($string, $size)

After execution, the value of $string is Hewlett-Packard(space)(space)(space)
(space)(space) .


    $string="Hewlett-Packard"
  $size=10
  $L.void=strpadr($string, $size)

After execution, the value of $string is Hewlett-Pa .


1.2.4.2.106. RAD function: strraw

A RAD function that exports array-type data to a delimiter-separated string.
Function
strraw
Format

$result = strraw($array [,$delim])

Parameters
The following parameters are valid for the strraw function.

Parameter                               Data type            Description
$result                                 Character
$array                                  Array                Returns a Character type
                                                             value.
$delim                                  Character
                                                             The array from which the
                                                             delimited string is
                                                             created.

                                                             The delimiter that
                                                             separates the elements
                                                             of the array in the result
                                                             string. The default value
                                                             is a space.

         Note

         Null elements are handled as an empty string.

Example

  $result=strraw({“a”,2,,true},”;”)

After execution, $result contains a;2;;true.



1.2.4.2.107. RAD function: strrep

A RAD function that returns a string after replacing a specified character sequence
with another string.

Function

strrep

Format

strrep($target,$string1,$string2)

Parameters
The following parameters are valid for the strrep function:

Parameter                               Data type            Description
$target                                 String
                                                             The string containing the
$string1                                String               characters specified to
$string2                                String               be replaced.

                                                             The string within
                                                             $target to be replaced.

                                                             The string replacing
                                                             $string1.

Example

  $s=strrep("Personnel","sonnel","formance")

After execution, the value of $s is Performance .


1.2.4.2.108. RAD function: strtml

A RAD function that removes all leading blanks from a string.
Function
strtrml
Format

$L.void=strtrml($string)

Parameters
The following parameters are valid for the strtrml function:

Parameter                               Data type             Description
$L.void=                                Not applicable.
                                                              A syntax requirement
$string                                 String                only. It doesn't affect the
                                                              outcome of the function.

                                                              The string being
                                                              modified.

         Note

         This RAD function is unavailable as a JavaScript system.functions call.

Example

  $string="Hewlett-Packard"
  $L.void=strtrml($string)

After execution, the value of $string is Hewlett-Packard .


1.2.4.2.109. RAD function: strtrmr

A RAD function that removes all trailing blanks from a string.
Function
strtrmr
Format

$L.void=strtrmr($string)

Parameters
The following parameters are valid for the strtrmr function:

Parameter                               Data type             Description
$L.void=                                Not applicable.
                                                              A syntax requirement
$string                                 String                only, doesn't affect the
                                                              outcome of the function.

                                                              The string being
                                                              modified.

         Note

         This RAD function is unavailable as a JavaScript system.functions call.

Example

  $string="Hewlett-Packard "
  $L.void=strtrmr($string)

After execution, the value of $string is Hewlett-Packard .


1.2.4.2.110. RAD function: substr

A RAD function that extracts a substring from a string.
Function
substr
Format

substr(string, beginning position, length)

Parameters
The following parameters are valid for the substr function:

Parameter                               Data type            Description
$string                                 String
                                                             The string being
beginning position                      Number               modified.

length                                  Number               The position in the string
                                                             where the substring is to
                                                             begin.

                                                             The total number of
                                                             characters you want the
                                                             substring to contain. The
                                                             default behavior is to
                                                             include all remaining
                                                             characters in the string
                                                             from the starting
                                                             position. You can use the
                                                             length parameter to
                                                             specify a shorter substr
                                                             length.

Example


  $a=substr(" Service Manager", 9)
  $b=substr(" Service Manager", 1, 7)

After execution, the value of $a is Manager and the value of $b is Service .


1.2.4.2.111. RAD function: substrb

A RAD function that extracts a substring from a multibyte character or binary string.
Function
substrb
Format

  substrb(string, beginning position, length)

Parameters
The following parameters are valid for the substr function:

Parameter                               Data type                          Service Manager 9.81
string                                  String
                                                   Description
beginning position                      Number
                                                   The string being
                                                   modified.

                                                   The position in the string
                                                   where the substring is to
                                                   begin.

Parameter                               Data type                          Service Manager 9.81
length                                  Number
                                                   Description

                                                   The total number of
                                                   bytes you want the
                                                   substring to contain. The
                                                   default behavior is to
                                                   include all remaining
                                                   bytes in the string from
                                                   the starting position. You
                                                   can use the length
                                                   parameter to specify a
                                                   shorter byte length.

Parameter                               Data type                          Service Manager 9.81

This PDF was generated on May 23, 2026             Description

                                                               Caution

                                                              You should
                                                              choose a
                                                              length value
                                                              that takes
                                                              into account
                                                              the number
                                                              of bytes
                                                              available in
                                                              the source
                                                              string. If you
                                                              choose too
                                                              low a value
                                                              the
                                                              substituted
                                                              string may
                                                              contain
                                                              corrupted
                                                              data
                                                              because the
                                                              function did
                                                              not have
                                                              enough
                                                              bytes to
                                                              substitute a
                                                              multibyte
                                                              character.
                                                              Refer to a
                                                              UTF-8 or
                                                              UTF-16
                                                              character
                                                              encoding
                                                              map to see
                                                              how many
                                                              bytes a
                                                              particular
                                                              multibyte
                                                              character
                                                              requires. It is
                                                              recommende

                                                                                                 Page 98 of 153
Parameter                               Data type                          Service Manager 9.81

                                                   Description

                                                              d that you
                                                              only use this
                                                              function on
                                                              strings of a
                                                              fixed byte
                                                              length to
                                                              avoid
                                                              possible data
                                                              corruption. If
                                                              you want to
                                                              replace a
                                                              fixed number
                                                              of characters
                                                              use the
                                                              substr
                                                              function
                                                              instead.

Example

  $a=substrb("abcÄÖÜdef", 5)
  $b=substrb("abcÄÖÜdef", 1, 7)

After execution, the value of $a is ÖÜdef and the value of $b is abcÄÖ .
For the string $b, setting the length value to 4 or 6 would lead to data corruption
because there aren't enough bytes available to contain the multi-byte characters Ä
and Ö respectively.


1.2.4.2.112. RAD function:
sysinfo.get("ActiveFloatUsers")

A RAD function that returns the total number of floating users currently active.
Function
sysinfo.get("ActiveFloatUsers")
Format

  $info=sysinfo.get("ActiveFloatUsers")


1.2.4.2.113. RAD function:
sysinfo.get("Active Licenses")

A RAD function that returns the total number of licenses currently active.
Function
sysinfo.get("ActiveLicenses")
Format

  $info=sysinfo.get("ActiveLicenses")


1.2.4.2.114. RAD function:
sysinfo.get("ActiveNamedUsers")

A RAD function that returns the total number of named users currently active.
Function
sysinfo.get("ActiveNamedUsers")
Format

  $info=sysinfo.get("ActiveNamedUsers")


1.2.4.2.115. RAD function:
sysinfo.get("AuthMode")

A RAD function that returns the authentication mode of the current user:
     Returns db if using password authentication and the password exits in
     database.
     Returns ldap if using password authentication and the password exits in LDAP.
     Returns tso if using TSO.
     Returns lwsso if using LWSSO.

Function
sysinfo.get("AuthMode")
Format

  $info=sysinfo.get("AuthMode")

Example

  $info=sysinfo.get("AuthMode")

After execution, the value of $info is set to the authentication mode of the current
user.
````
