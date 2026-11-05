---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.4.2 .. 1.2.4.2.11
printed_pages: 1093-1120
---

# 1.2.4.2 List: RAD functions

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.4.2. List: RAD functions

A RAD function is an operand, which means that it can be used in any expression on
the right hand side of an equals sign. Functions provide a method of performing
certain commands that will return a value when executed. For example:

     operator()--returns the logged-on operator ID.
     tod()--returns the current date and time.
     option()--returns GUI option number of the last displayoption selected.

RAD functions can be used in statements to further define selection criteria and/or
execute commands, initialize values, and perform calculations. Service Manager
syntax rules must be followed. For example, the result of a RAD function can be
assigned to a variable using the assign (=) assignment statement:
$string.length=lng($string)

In most cases, there is a JavaScript function that can do the same operation as a RAD
function. If you prefer to work with JavaScript rather than RAD, see Using RAD
functions in JavaScript for more information.

 Function                                                                                       Service Manager 9.81
 add.graphnodes(xml)
 cache.flush                            Description
 clean.display.value
 cleanup                                Returns XML to the Run-Time
 contents                               Environment (RTE) for the expand
 copyright                              action on a node in the graph diagram.
 currec
 current.device                         Removes the specified item from the
                                        memory cache.
 current.format
 cursor.field.contents                  Cleans up (clears) the display value of
                                        a field in a file.
 cursor.field.display.content
                                        Frees the storage associated with a
This PDF was generated on May 23, 2026  variable.

                                        Returns a structure containing the
                                        current record in a file variable.

                                        Returns a string with the company's
                                        copyright notice.

                                        Represents the current file handle in
                                        queries.

                                        Returns a string with the type of
                                        system the user is using to log in to
                                        Service Manager, such as "SOAP-
                                        Windows Vista."

                                        Returns a string containing the name of
                                        the current format.

                                        Returns a string containing the
                                        contents of the input field in which the
                                        cursor was positioned when the last
                                        interrupt key was pressed.

                                        Returns a string that contains the
                                        display value of the field where the
                                        cursor is currently positioned.

                                                                                                                        Page 119 of 207
 Function                                                                                       Service Manager 9.81
 cursor.field.display.content.set
 cursor.field.name                      Description

 cursor.field.name.set                  Sets the display value of the field
 cursor.field.readonly                  where the cursor is currently
 cursor.line                            positioned.

 date                                   Returns a string containing the name of
 datecmp                                the field in which the cursor was
 day                                    positioned when the last interrupt key
 dayofweek                              was pressed.
 dayofyear
 dbdict.helper(“db.type”)               Moves the cursor to a field.

This PDF was generated on May 23, 2026  Returns true if the selected field is
                                        read-only. Returns false if the selected
                                        field is not read only.

                                        Returns the number of the line, relative
                                        to the screen, in which the cursor was
                                        positioned when the last interrupt key
                                        was pressed.

                                        Returns the date portion of a date/time
                                        variable and defaults time portion to
                                        ’00:00:00‘.

                                        Translates the date/time fields to the
                                        correct SQL statement dialect.

                                        Returns the day of the month for a date
                                        regardless of the date format.

                                        Returns a number from 1 to 7
                                        representing the day of the week for a
                                        specific date.

                                        Returns the day of the year for a date
                                        regardless of the date format.

                                        Helps retrieve the current RDBMS type.

                                                                                                                        Page 120 of 207
Function                                                                                        Service Manager 9.81
dbdict.helper(“field.type”)
dbdict.helper(“is.alias”)               Description
dbdict.helper(“joinfile.names”)
dbdict.helper(“unique.key”)             Helps retrieve the field type property
delete                                  efficiently.
denull
descriptor                              Helps determine whether a field is an
display.value.copy                      alias or not.
evaluate
evaluate.query                          Helps retrieve an array of names of the
exists                                  sub files that belong to a join file.
fduplicate
filename                                Helps retrieve the first unique key or
                                        the primary key of a file efficiently.

                                        Returns an array with specific elements
                                        deleted.

                                        Returns an array with all trailing NULL
                                        entries deleted.

                                        Returns the database dictionary
                                        descriptor record for a file variable.

                                        Copies all of the display values from
                                        one file to another.

                                        Executes a specific string as though it
                                        were a processing statement.

                                        Evaluates a query against a record.

                                        Checks for the existence of a field in a
                                        file.

                                        Copies an entire file variable from one
                                        record to another.

                                        Returns a string containing the name of
                                        the file for a specified file variable.

 Function                                                                                       Service Manager 9.81
 filequeryex
 frestore                               Description
 genout
 get.base.form.name                     Returns the query parameters of a file
 get.dateformat                         variable.
 get.display.value
 get.graph.action                       Restores all fields in a file variable to
 get.graph.id                           their original database values.
 get.graphnode.id
 get.graph.target                       Generates a formatted string based on
 get.lock.owner                         a record and format name passed as
                                        parameters.
This PDF was generated on May 23, 2026
                                        Returns the base name of a form,
                                        stripping off the form extension for GUI
                                        or Web forms.

                                        Returns the date format of the current
                                        operator ID.

                                        Returns the display value of a field in a
                                        Service Manager file.

                                        Returns the activated action on a node
                                        in the graph diagram.

                                        Returns the value of the graph ID for
                                        the expand action on a node in the
                                        graph diagram.

                                        Returns the value of the node ID for the
                                        expand action on a node in the graph
                                        diagram.

                                        Returns the target for an activated
                                        action on a node in the graph diagram.

                                        Returns the name of the owner of a
                                        resource lock.

                                                                                                                        Page 122 of 207
 Function                                                                                       Service Manager 9.81
 get.timezoneoffset
 get.uid                                Description
 get.web.url
 gui                                    Returns the absolute time difference
 index                                  between GMT and the time zone of the
 insert                                 operator.
 iscurrent
 isExpressionValid                      Returns a 24-character identifier that's
 isfileexist                            unique to an installation of Service
 jscall                                 Manager
 lioption
                                        Returns the URL of the web client.
This PDF was generated on May 23, 2026
                                        Determines whether or not Service
                                        Manager is running in GUI mode.

                                        Returns the element number of an
                                        array or the position in a string that
                                        matches a specified string.

                                        Returns a modified array with a
                                        specified number of new elements
                                        inserted at a specified location.

                                        Determines if the record with which
                                        you are working is identical to the
                                        version stored in the database.

                                        Determines in a RAD expression is a
                                        valid expression of a specified data
                                        type.

                                        Determines whether a file exists or not.

                                        Enables you to invoke JavaScript from
                                        within RAD.

                                        Indicates whether a given input value is
                                        a licensed option on the current
                                        system.

                                                                                                                        Page 123 of 207

Function                                Description
lng
locks                                   Returns the number of elements in an
logoff                                  array or characters in a string.
logon
mandant                                 Returns array of current outstanding
max                                     locks.
messages
                                        Logs a user off.
min
modtime                                 Logs a user on.
month
multiselect.selection("fieldcontents")  Allows an application to create a subset
multiselect.selection("fieldname")      of the current Mandanten values.

                                        Returns the largest value in a list of
                                        values or in an array.

                                        Provides logging functions for use in
                                        the memory message log. The log is
                                        implemented as a wrap-around cache
                                        of the x most recent messages (error,
                                        informational, and action).

                                        Returns the smallest value in a list of
                                        values or in an array.

                                        Returns the time a record was last
                                        modified.

                                        Returns the month of year for a date
                                        regardless of the date format.

                                        Returns the contents of the fields
                                        associated with the multiselection.

                                        Returns the field name of the column
                                        associated with the multiselection. The
                                        associated column name is set using
                                        the Forms Designer property "Selection
                                        Field."

Function                                                                                        Service Manager 9.81
multiselect.selection("rows")
multiselect.selection("selected")       Description
multiselect.selection("selections")
multiselect.selection("tablename")      Returns an array of row numbers that
null                                    were selected.

nullsub                                 Returns true or false if the provided file
operator                                variable has multiple records selected.
option
parse                                   Returns the number of rows selected.
perf
policyread                              Returns the Table ID associated with
processes                               the multiselection.
prof
                                        Returns true if the value of a variable is
                                        NULL. Returns false if the value of a
                                        variable or field is not NULL.

                                        Substitutes a null field with the value
                                        given.

                                        Returns the string of the name of the
                                        currently logged on operator.

                                        Returns the number of the last option
                                        key pressed.

                                        Returns an evaluative expression from
                                        a given string value.

                                        Evaluates system performance and
                                        writes the information to disk.

                                        Reads the data policy from a datadict
                                        table.

                                        Returns array of current logged on
                                        processes.

                                        Returns the value requested on various
                                        system performance profiles.

 Function                                                                                       Service Manager 9.81
 recordcopy
 recordtostring                         Description
 round
 same                                   Copies a set of fields from one record
 scmsg                                  to another record.

 set.display.value                      Takes the value of a field from an array
 set.timezone                           and appends the value to a string.
 setsort
 shutdown                               Returns a number rounded to a
 simple file load                       specified number of digits.
 sleep
                                        Compares two compound or null
This PDF was generated on May 23, 2026  values. Returns true if two values are
                                        identical, otherwise returns false.

                                        Returns a text string matching the
                                        format of the message ID number and
                                        message class specified. The function
                                        replaces any variables in the message
                                        with the text specified in an array of
                                        values.

                                        Sets the display value for a field in a
                                        file.

                                        Sets time zone and other system
                                        parameters.

                                        Sorts the fields of an array in a file.

                                        Shuts down Service Manager from
                                        inside the system. This function
                                        doesn't return any values.

                                        Loads an unload file containing only
                                        data records of one file into a target
                                        file.

                                        Temporarily ceases the execution of an
                                        executing thread for the specified
                                        number of seconds.

                                                                                                                        Page 126 of 207
 Function                                                                                       Service Manager 9.81
 str
 stradj                                 Description
 strchrcp
 strchrin                               Returns a string of a string or non-
 strclpl                                string data variable.
 strclpr
 strcpy                                 Makes a string a specific length by
 strdel                                 either clipping or adding trailing blanks.
 strins
 strpadl                                Replaces part of a string with copies of
 strpadr                                another string.
 strraw
 strrep                                 Inserts copies of a string into another
                                        string.
This PDF was generated on May 23, 2026
                                        Clips a number of characters from the
                                        beginning of a string.

                                        Clips a number of characters from the
                                        ending of a string.

                                        Replaces part of a string with a
                                        substring.

                                        Deletes a number of characters from a
                                        specific spot in a string.

                                        Inserts a substring into another string.

                                        Pads a string with leading blanks until
                                        the string is a certain size.

                                        Pads a string with trailing blanks until
                                        the string is a certain size.

                                        Exports array data to a delimiter-
                                        separated string.

                                        Returns a string, replacing a specified
                                        character sequence with another
                                        string.

                                                                                                                        Page 127 of 207
Function                                                                                        Service Manager 9.81
strtrml
strtrmr                                 Description
substr
substrb                                 Removes all leading blanks from a
sysinfo.get(“ActiveFloatUsers”)         string.
sysinfo.get(“ActiveLicenses”)
sysinfo.get(“ActiveNamedUsers”)         Removes all trailing blanks from a
sysinfo.get("AuthMode")                 string.
sysinfo.get(“ClientNetAddress”)
                                        Returns a string from a portion of a
sysinfo.get(“ClientOSName”)             string.

sysinfo.get(“ClientPID”)                Extracts a substring from a multibyte
sysinfo.get(“ClientVersion”)            character or binary string.
sysinfo.get(“Display”)
                                        Returns the total number of currently
                                        active floating users.

                                        Returns the total number of currently
                                        active licenses.

                                        Returns the total number of currently
                                        active named users.

                                        Returns the authentication mode of the
                                        current user.

                                        Returns the Service Manager client
                                        network IP address as a character
                                        string.

                                        Returns the name of the operating
                                        system that Service Manager is running
                                        on.

                                        Returns the PID for RAD.

                                        Returns the version number of the
                                        client software as a string.

                                        Returns “GUI” or “text”, depending on
                                        the type of client that's running.

Function                                                                                        Service Manager 9.81
sysinfo.get(“Environment”)
sysinfo.get(“languagecode”)             Description

sysinfo.get(“MaxFloatUsers”)            Returns the name of the environment in
                                        which the client is operating.
sysinfo.get(“MaxLicenses”)
sysinfo.get(“Mode”)                     Returns the server session language
sysinfo.get(“PrevLabel”)                code value that's used for localized
sysinfo.get(“PrintOption”)              forms and messages.

sysinfo.get(“Quiesce”)                  Returns the total number of floating
sysinfo.get(“RecList”)                  users logged on since the server
sysinfo.get(“ServerNetAddress”)         started.

sysinfo.get(“ServerNetPort”)            Returns the maximum number of
                                        licenses used since the server started.

                                        Returns a value that states the type of
                                        client being used.

                                        Returns the label name of the last RAD
                                        panel that was executed.

                                        Returns printing option information,
                                        “server” or “client” depending on how
                                        the system is set.

                                        Returns “true” if system is quiesced
                                        and “false” if system is not quiesced.

                                        Returns “true” if record list is enabled
                                        and “false” if record list is disabled.

                                        Returns the Service Manager server
                                        network IP address as a character
                                        string.

                                        Returns the Service Manager server
                                        port used by the connected client or
                                        the system name when called by a
                                        background process.

 Function                                                                                       Service Manager 9.81
 sysinfo.get(“ServerPID”)
 sysinfo.get(“ThreadID”)                Description
 sysinfo.get(“TotalFloatUsers”)
 sysinfo.get(“TotalLicenses”)           Returns the PID of the server as a
 sysinfo.get(“TotalNamedUsers”)         number.
 sysinfo.get(“TotalProcs”)
 sysinfo.get(“TotalSystemProcs”)        Returns the number of the current RAD
 sysinfo.get(“TotalUserProcs”)          thread.
 time
 tod                                    Returns the total number of floating
 tolower                                users allowed.
 toupper
 translate                              Returns the total number licenses
 trunc                                  allowed.

This PDF was generated on May 23, 2026  Returns the total number of named
                                        users allowed.

                                        Returns the total number of executing
                                        system and user tasks.

                                        Returns the total number of system
                                        tasks.

                                        Returns the total user tasks.

                                        Returns the time portion of a date/time
                                        variable.

                                        Returns the current date and time.

                                        Returns a string, replacing upper-case
                                        letters with lower-case letters.

                                        Returns a string, replacing lower-case
                                        letters with upper-case letters.

                                        Returns a string translated from one
                                        character set to another.

                                        Truncates the decimal digit number to a
                                        specified number of digits.

                                                                                                                        Page 130 of 207
Function                                                                                        Service Manager 9.81
type
                                        Description
updatestatus
val                                     Returns the numeric type of its
                                        argument.
version
year                                    Returns the result of the last update
                                        operation on a Service Manager file.

                                        Returns a non-string data type
                                        converted from a string.

                                        Returns a list of version information.

                                        Returns the full year for a date
                                        regardless of the date format.


1.2.4.2.1. RAD function:
add.graphnodes(xml)

Description
A RAD function that returns XML to the Run-Time Environment (RTE) for the expand
action on a node in the graph diagram.
Function
add.graphnodes()
Example

  add.graphnodes(xml)


1.2.4.2.2. RAD function: cache.flush

A RAD function that removes the specified item from the memory cache.
Function
cache.flush
Format

  cache.flush( nType, pItem )

Parameters
nType is a number from 1 to 4 representing the type of flush operation. Flush types
1, 2, and 4 remove the item from the global shared memory cache. Flush type 3
removes the item from the local format cache.

     1 flushes application/code records
     2 flushes dbdicts
     3 flushes formats
     4 flushes SQL maps
pItem is the name of the item to flush enclosed in quotation marks. Note that pItem
is not used if flush type is 3.
Factors
This function returns no value.
Example
To flush the dbdict record for the probsummary table:

  cache.flush( 2, "probsummary" )

To flush the local format cache:

  $L.type = 3
  cache.flush( $L.type )


1.2.4.2.3. RAD function:
clean.display.value

A RAD function that cleans up the internal display value cache associated with a file
variable.
Function

clean.display.value

Format

clean.display.value($file, [$fieldname])

Parameters
The following parameters are valid for this function.

Parameter                               Description
$file
                                        The file variable whose internal display
$fieldname                              value cache is to be cleaned up.

                                        The field whose display value is to be
                                        cleaned up. If this parameter is not
                                        specified, the entire internal display
                                        value cache of $file is cleaned up.

Return values
Null or the old display value.
Examples

clean.display.value($file)

clean.display.value($file, “logical.name”)


1.2.4.2.4. RAD function: cleanup

A RAD function that frees the storage associated with a variable.
Function
cleanup
Format

  cleanup($filename, [$fieldname], [index])

Parameters
The following parameters are valid for this function.

Parameter                                                                                       Service Manager 9.81
$filename
                                        Description
[$fieldname]
                                        The variable that you want to clean up.
                                        If only $filename is specified, this
                                        variable can be a file variable or a field.

                                        Optional.
                                        When specified, indicates the name of
                                        a field whose field value and display
                                        value (if any) are to be cleaned up.

                                                    Note

                                                   Fields that have a
                                                   referenced table defined
                                                   have a display value.

[index]                                 Optional.

                                        If the field specified in $fieldname is of
                                        the array type, the value and display
                                        value (if any) of the element that has
                                        the specified index or position number
                                        in that array are cleaned up.

Factors

If only $filename is specified when calling this function, this function returns the same
result as it would in versions earlier than 9.41.

This function doesn't return a value. It cleans up (empties) the variable or field
specified by setting the value to NULL.

You can use this function on any variable type (local, thread, or global), but it is
generally used on local and thread variables to clean up values before a user logs out.

This is the preferred way to clean up both variables and fields in records as opposed
to $x=NULL or field in $file=NULL.


Unless you run this function, variables remain in memory until their defining
environment ends.
For local variables, this is the parent RAD program. For thread variables, this is the
parent RAD thread. For global variables, this is the user session.

            Note

           This RAD function is unavailable as a JavaScript system.functions call.

Return values
None
Examples

  cleanup($file)

  cleanup($file, “logical.name”)

  cleanup($file, “assets”, 0)


1.2.4.2.5. RAD function: contents

A RAD function that returns a structure containing the contents of the current record
in a file variable.
Function
contents
Format

  contents(file variable)

file variable is the contents you want to obtain.
Factors
If you use the contents() function to compare two records, always use the denull
function on both records first to remove null values. If one record is displayed and the
other is not, the arrays in one record may contain extra null values.
Using the denull function on an empty array of structures converts the array of
structures to a simple array.

            Note

           Always test for null values first, as shown in the following example:

                 denull(contents($save.rec))=denull(contents($rec))

Example

  contents($file.variable)


1.2.4.2.6. RAD function: copyright

A RAD function that returns the company's copyright notice in a string.
Function
copyright
Format

  copyright()


1.2.4.2.7. RAD function: currec

A RAD function that represents the current file handle on queries. When used as a
select statement, it selects all records modified since the date you specify from the
current file.
Function
currec
Format

  currec()

Example

  modtime(currec())>'1/1/05'


1.2.4.2.8. RAD function: current.device

A RAD function that returns a string containing the name of the device or
Configuration item (CI) associated with the user that's currently logged on.
Function
current.device
Format

  current.device()

Factors
The value of $lo.device is set to the value of current.device upon login.
Example
current.device() returns /dev/tty00 (on Linux)


1.2.4.2.9. RAD function: current.format

A RAD function that returns a string containing the name of the most recently
displayed format.
Function
current.format
Format

  current.format()

Example
current.format( ) returns problem.open


1.2.4.2.10. RAD function:
cursor.field.contents

A RAD function that returns a string containing the contents of the field where the
cursor was last positioned when the user performed an action such as clicking Fill or
Find, or double-clicking on a QBE list. If the action opens a new form,
cursor.field.contents will return the focus on the pop-up form.

            Note

           The cursor.field.contents function doesn't support record lists in the Web
           client. For example, when you double-click a row in a record list from the
           Web client, no value is returned by the cursor.field.contents function.

Function
cursor.field.contents
Format

  cursor.field.contents()

Factors
If the field is an array, the content of the current element is returned.
Example
cursor.field.contents() returns a101a01 .


1.2.4.2.11. RAD function:
cursor.field.display.content

A RAD function that returns a string containing the display value of the field where the
cursor was last positioned when the user performed an action such as clicking Fill or
Find, or double-clicking on a QBE list. If the action opens a new form,
cursor.field.display.content will return the focus on the pop up form.
Function
cursor.field.display.content
Format

  cursor.field.display.content()

Parameters
There are no parameters for this function.
Factors
If the field is an array, the content of the current element is returned.
Return values
The display value of the current field. For example, "Adobe Reader".
````
