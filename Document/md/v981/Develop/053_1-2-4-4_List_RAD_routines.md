---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.4.4 .. 1.2.4.4.4
printed_pages: 1404-1434
---

# 1.2.4.4 List: RAD routines

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.4.4. List: RAD routines

This section provides a list of RAD routines, a brief definition of each, and a link to a
detailed description of their use.

 Routine                                                                                        Service Manager 9.81
 as.copy
 as.delete                              Description
 as.get.name
 as.insert                              Copies an element from one position to
 as.move                                another, leaving the original in place.
 as.options
 as.sort                                Deletes an element from an array.
 axces.apm
 axces.cm3                              Returns the structure name of the
 axces.cm3.cts.write                    arrayed structure in which the cursor is
 axces.database                         located.

This PDF was generated on May 23, 2026  Inserts a NULL element.

                                        Moves an element from one position in
                                        an array to another by creating a copy
                                        and then deleting the original

                                        Displays all available arrayed structure
                                        options on the rio (Record
                                        Display/Input) Command panel.

                                        Sorts an arrayed structure based on
                                        the contents of a particular field within
                                        the arrayed structure.

                                        Creates or updates an incident based
                                        on an Event Services eventin record.

                                        Creates or updates a change request
                                        based on an Event Services eventin
                                        record.

                                        Creates a schedule record that
                                        processes alerts for Change
                                        Management records.

                                        Adds, updates or deletes records from
                                        Service Manager files using Event
                                        Services.

                                                                                                                          Page 70 of 269
 Routine                                                                                        Service Manager 9.81
 axces.email
 axces.move.intoout                     Description
 axces.rm
 axces.sap.hybrid.evin                  Creates an eventout record based on
 axces.software                         the Service Manager mail record that
                                        was passed in.
 axces.sm
 axces.write                            Copies an eventin record to the
 database                               eventout file and changes the evtype.
 es.approval
 fill.fc                                Creates or updates Request
                                        Management quotes via Event Services
This PDF was generated on May 23, 2026  eventin record.

                                        Breaks events into appropriate
                                        constituent parts.

                                        Adds, updates, or deletes a software
                                        configuration item that an external
                                        agent (other than ServerView or
                                        StationView) discovers to the pcfiles
                                        file if the filter criteria are satisfied.

                                        Creates or updates Service Desk
                                        interactions based on an eventin record
                                        using Event Services.

                                        Build the eventout record used by the
                                        SCAutomate interface.

                                        Provides access to other tables from a
                                        particular record.

                                        Processes approvals for Request
                                        Management and Change
                                        Management.

                                        Copies data from a target file to the
                                        current file, using predefined links
                                        under user control.

                                                                                                                          Page 71 of 269
Routine                                                                                         Service Manager 9.81
getnumb.fc
marquee.publish                         Description
marquee.send
message.fc                              Establishes the numbering sequence in
post.fc                                 sequential numbering.

publish                                 Sends a marquee message.
query.stored
scauto.inventory                        Reads the schedule record and initiate
sort.array                              the marquee.publish routine.

us.js.call                              Sends messages under user control.

validate.fields                         Executes the posting routine from the
                                        subroutines process (automatic
                                        posting) and from the additional
                                        options process (manual posting).

                                        Publishes a variable into SYSPUB.

                                        Accesses all queries for a specific file
                                        or to execute a specific stored query.

                                        Provides access to configuration items.

                                        Sorts simple arrays (number, character,
                                        date/time) in either ascending or
                                        descending order.

                                        A RAD routine that can invoke any
                                        JavaScript function in the ScriptLibrary.
                                        This routine enables you to run a
                                        JavaScript function without connecting
                                        to the Service Manager server via a
                                        client.

                                        Validates fields in a form.


Routine                                 Description
wmi.inventory.checks
                                        Checks the eventin record for status
                                        information from a type of scan. It also
                                        processes the information from the
                                        scan into the Configuration
                                        Management application using the
                                        scauto.inventory RAD routine.

RAD input and output conversion

Input conversion

Routine                                 Description
input.accum.types
input.backslash                         Validates the entry of accumulator
input.date                              types in the Report Writer.
input.edate
input.fdate                             Looks for ending backslash on query,
input.number                            appends another backslash.
input.percent
input.time                              Allows entry of dates in various
input.underlines                        formats.

                                        Allows entry of European dates in the
                                        format DD/MM/YY(YY) HH:MM:SS.

                                        Allows entry of European dates in the
                                        format YY(YY)/MM/DD HH:MM:SS.

                                        Input Number from character field
                                        ($4.33=4.33).

                                        Edits numbers into valid percent
                                        values.

                                        Append a time entered by a user to the
                                        current date.

                                        Convert Embedded Spaces to
                                        Underlines.


Output conversion

 Routine                                                                                        Service Manager 9.81
 output.all.caps
 output.asterisk                        Description
 output.backslash
 output.date                            Converts to all caps.
 output.edate
                                        Boolean Data Output Conversion
 output.exdate                          Routine (Converts 'true' to *).
 output.fdate
                                        Looks for ending backslash on query,
 output.fm                              appends another backslash.
 output.init.caps
 output.money                           Converts a standard SM date to one of
 output.money.save                      a number of specified formats.
 output.money3
 output.no.caps                         Converts a standard SM date to the
                                        following European date:
This PDF was generated on May 23, 2026  DD/MM/YY(YY) HH:MM:SS.

                                        Converts a standard SM date to: DD
                                        MMM YYYY.

                                        Converts a standard SM date to the
                                        following French date: YY(YY)/MM/DD
                                        HH:MM:SS.

                                        Displays numbers as money fields
                                        using specified mask.

                                        Converts to initial caps.

                                        Displays numbers as money fields
                                        using specified mask.

                                        Displays numbers as money fields
                                        using specified mask.

                                        Displays numbers as money fields
                                        using specified mask.

                                        Converts to all lowercase.

                                                                                                                          Page 75 of 269
Routine                                                                                         Service Manager 9.81
output.percent
output.privilege                        Description
output.time.adj
output.yn                               Edits numbers entered as percentages
output.zf                               and then displays them.
output.strip.htmltags
                                        Converts all except true, false,
                                        unknown and NULL to *.

                                        Converts a standard SM date to one of
                                        a number of specified formats.

                                        Converts 'true/false' to 'yes/no' and
                                        leaves 'unknown' alone.

                                        Edits strings entered with specified
                                        mask.

                                        Strips away HTML tags from the text.


1.2.4.4.1. RAD routine: as.copy

A RAD routine that copies an element within an array or structure from one position to
another, leaving the original in place. This routine is used in conjunction with
as.delete, as.insert, and as.move routines.
Routine
as.copy
Parameters
The following parameters are valid for the as.copy routine:

Name  Data type                         Required         Service Manager 9.81
file  record                            No
                                                  Description

                                                  The file variable
                                                  that you are
                                                  currently editing.
                                                  The value is
                                                  always $file
                                                  when called from
                                                  Format Control.

Name  Data type                         Required         Service Manager 9.81
name  character                         No
                                                  Description

                                                  Data is not
                                                  normally passed
                                                  to this parameter.
                                                  The default is the
                                                  result of
                                                  executing the
                                                  cursor.field.name
                                                  (1) function. The
                                                  application
                                                  as.get.name then
                                                  executes against
                                                  this result.

Name  Data type                         Required         Service Manager 9.81

This PDF was generated on May 23, 2026            Description

                                                              Note

                                                             You
                                                             can
                                                             pass
                                                             the
                                                             name
                                                             of a
                                                             specif
                                                             ic
                                                             array
                                                             ed
                                                             struct
                                                             ure. If
                                                             the
                                                             data
                                                             passe
                                                             d to
                                                             this
                                                             para
                                                             meter
                                                             doesn
                                                             't
                                                             contai
                                                             n
                                                             comm
                                                             as, it
                                                             is
                                                             consi
                                                             dered
                                                             to be
                                                             an
                                                             array
                                                             ed
                                                             struct
                                                             ure
                                                             name.
                                                             If a
                                                             comm
                                                             a is
                                                             found

                                                                             Page 80 of 269
Name  Data type                         Required         Service Manager 9.81

                                                  Description

                                                             , the
                                                             applic
                                                             ation
                                                             as.get
                                                             .name
                                                             is
                                                             execu
                                                             ted
                                                             again
                                                             st the
                                                             data.

Name   Data type                        Required         Service Manager 9.81
index  number                           No
                                                  Description
This PDF was generated on May 23, 2026
                                                  The number of
                                                  lines (height
                                                  property) in the
                                                  subform that
                                                  displays the
                                                  arrayed structure.
                                                  For example, if
                                                  the arrayed
                                                  structure subform
                                                  contains data on
                                                  lines 1 and 2, then
                                                  this parameter is
                                                  2. The default
                                                  value is 1.

                                                              Note

                                                             This
                                                             is not
                                                             the
                                                             windo
                                                             w size
                                                             that
                                                             displa
                                                             ys the
                                                             array
                                                             ed
                                                             struct
                                                             ure.

                                                  When calling the
                                                  application from
                                                  Format Control,
                                                  the value must be
                                                  passed as a
                                                  number by using
                                                  the following
                                                  syntax:

                                                                             Page 82 of 269
Name  Data type                         Required         Service Manager 9.81

                                                  Description

                                                    val("n", 1)

                                                  Where:
                                                  The value of n is
                                                  the number of
                                                  lines in the
                                                  subform, and 1
                                                  indicates a data
                                                  type of number.


1.2.4.4.2. RAD routine: as.delete

A RAD routine that deletes an element from an array. This routine is used in
conjunction with as.copy, as.insert, and as.move.
Routine
as.delete
Parameters
The following parameters are valid for the as.delete routine:

Name  Data type                         Required         Service Manager 9.81
file  record                            No
                                                  Description

                                                  The file variable
                                                  currently being
                                                  edited. The value
                                                  is always $file
                                                  when called from
                                                  Format Control.

Name  Data type                         Required         Service Manager 9.81
name  character                         No
                                                  Description

                                                  Data is not
                                                  normally passed
                                                  to this parameter.
                                                  The default is the
                                                  result of
                                                  executing the
                                                  cursor.field.name
                                                  (1) function . The
                                                  application
                                                  as.get.name then
                                                  executes against
                                                  this result.

Name  Data type                         Required         Service Manager 9.81

This PDF was generated on May 23, 2026            Description

                                                              Note

                                                             You
                                                             can
                                                             pass
                                                             the
                                                             name
                                                             of a
                                                             specif
                                                             ic
                                                             array
                                                             ed
                                                             struct
                                                             ure. If
                                                             the
                                                             data
                                                             passe
                                                             d to
                                                             this
                                                             para
                                                             meter
                                                             doesn
                                                             't
                                                             contai
                                                             n
                                                             comm
                                                             as, it
                                                             is
                                                             consi
                                                             dered
                                                             to be
                                                             an
                                                             array
                                                             ed
                                                             struct
                                                             ure
                                                             name.
                                                             If a
                                                             comm
                                                             a is
                                                             found

                                                                             Page 87 of 269
Name  Data type                         Required         Service Manager 9.81

                                                  Description

                                                             , the
                                                             applic
                                                             ation
                                                             as.get
                                                             .name
                                                             execu
                                                             tes
                                                             again
                                                             st the
                                                             data.

Name   Data type                        Required         Service Manager 9.81
index  number                           No
                                                  Description
This PDF was generated on May 23, 2026
                                                  The number of
                                                  lines (height
                                                  property) in the
                                                  subform that
                                                  displays the
                                                  arrayed structure.
                                                  For example, if
                                                  the arrayed
                                                  structure subform
                                                  contains data on
                                                  lines 1 and 2, then
                                                  this parameter is
                                                  2. The default
                                                  value is 1.

                                                              Note

                                                             This
                                                             is not
                                                             the
                                                             windo
                                                             w size
                                                             that
                                                             displa
                                                             ys the
                                                             array
                                                             ed
                                                             struct
                                                             ure.

                                                  When calling the
                                                  application from
                                                  Format Control,
                                                  the value must be
                                                  passed as a
                                                  number by using
                                                  the following
                                                  syntax:

                                                                             Page 89 of 269
Name  Data type                         Required         Service Manager 9.81

                                                  Description

                                                    val("n", 1)

                                                  Where:
                                                  The value of n is
                                                  the number of
                                                  lines in the
                                                  subform, and 1
                                                  indicates a data
                                                  type of number.


1.2.4.4.3. RAD routine: as.get.name

A RAD routine that returns the structure name of the arrayed structure where the
cursor is located.
Routine
as.get.name
Parameters
The following parameters are valid for the as.get.name routine:

Name    Data type                       Required  Description
name    character                       No
                                                  The structure
prompt  character                       No        name of the
                                                  arrayed structure.
                                                  The default is the
                                                  result of
                                                  executing the
                                                  cursor.field.name
                                                  (1) function .

                                                  The returned
                                                  structure name of
                                                  the arrayed
                                                  structure. This is
                                                  a data return
                                                  parameter, data
                                                  should not be
                                                  passed to it.


1.2.4.4.4. RAD routine: as.insert

A RAD routine used to insert a NULL element. It is used in conjunction with as.copy,
as.delete, and as.move.
Routine
as.insert
Parameters
The following parameters are valid for the as.insert routine:

Name  Data type                         Required         Service Manager 9.81
file  record                            No
                                                  Description

                                                  The file variable
                                                  currently being
                                                  edited. The value
                                                  is always $file
                                                  when called from
                                                  Format Control.

Name  Data type                         Required         Service Manager 9.81
name  character                         No
                                                  Description

                                                  Data is not
                                                  normally passed
                                                  to this parameter.
                                                  The default is the
                                                  result of
                                                  executing the
                                                  cursor.field.name
                                                  (1) function. The
                                                  application
                                                  as.get.name then
                                                  executes against
                                                  this result.

Name  Data type                         Required         Service Manager 9.81

This PDF was generated on May 23, 2026            Description

                                                              Note

                                                             You
                                                             can
                                                             pass
                                                             the
                                                             name
                                                             of a
                                                             specif
                                                             ic
                                                             array
                                                             ed
                                                             struct
                                                             ure. If
                                                             the
                                                             data
                                                             passe
                                                             d to
                                                             this
                                                             para
                                                             meter
                                                             doesn
                                                             't
                                                             contai
                                                             n
                                                             comm
                                                             as, it
                                                             is
                                                             consi
                                                             dered
                                                             an
                                                             array
                                                             ed
                                                             struct
                                                             ure
                                                             name.
                                                             If a
                                                             comm
                                                             a is
                                                             found
                                                             , the

                                                                             Page 95 of 269
Name  Data type                         Required         Service Manager 9.81

                                                  Description

                                                             applic
                                                             ation
                                                             as.get
                                                             .name
                                                             execu
                                                             tes
                                                             again
                                                             st the
                                                             data.

Name   Data type                        Required         Service Manager 9.81
index  number                           No
                                                  Description
This PDF was generated on May 23, 2026
                                                  The number of
                                                  lines (height
                                                  property) in the
                                                  subform that
                                                  displays the
                                                  arrayed structure.
                                                  For example, if
                                                  the arrayed
                                                  structure subform
                                                  has data on lines
                                                  1 and 2, then this
                                                  parameter is 2 .
                                                  The default value
                                                  is 1 .

                                                              Note

                                                             This
                                                             is not
                                                             the
                                                             windo
                                                             w size
                                                             that
                                                             displa
                                                             ys the
                                                             array
                                                             ed
                                                             struct
                                                             ure.

                                                  When calling the
                                                  application from
                                                  Format Control,
                                                  the value must be
                                                  passed as a
                                                  number by using
                                                  the following
                                                  syntax:

                                                                             Page 97 of 269
Name  Data type                         Required         Service Manager 9.81

                                                  Description

                                                    val("n", 1)

                                                  Where:
                                                  The value of n =
                                                  the number of
                                                  lines in the
                                                  subform, and 1
                                                  indicates a data
                                                  type of number.
````
