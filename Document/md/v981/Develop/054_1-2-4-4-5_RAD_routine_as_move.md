---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.4.4.5 .. 1.2.4.4.12
printed_pages: 1434-1466
---

# 1.2.4.4.5 RAD routine: as.move

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.4.4.5. RAD routine: as.move

A RAD routine used to move an element from one position in an array to another by
creating a copy and then deleting the original. This routine is used in conjunction with
as.copy, as.insert, and as.delete.
Routine
as.move
Parameters
The following parameters are valid for the as.move routine:

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
                                                  cursor.field.name(
                                                  1) function. The
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

                                                                           Page 102 of 269
Name  Data type                         Required         Service Manager 9.81

                                                  Description

                                                             as.get
                                                             .name
                                                             applic
                                                             ation
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

                                                                           Page 104 of 269
Name  Data type                         Required         Service Manager 9.81

                                                  Description

                                                    val("n", 1)

                                                  Where the value
                                                  of n = the
                                                  number of lines in
                                                  the subform, and
                                                  1 indicates a
                                                  data type of
                                                  number.


1.2.4.4.6. RAD routine: as.options

A RAD routine used to display all available arrayed structure options one rio (Record
Display/Input) Command panel.

            Note

           The as.options routine provides the control needed to copy, insert, delete,
           and move fields. It's not necessary to run as.copy, as.move, as.insert,
           and as.delete in conjunction with this routine.

Routine
as.options
Parameters
The following parameters are valid for the as.options routine:

Name  Data type                         Required         Service Manager 9.81
file  record                            No
                                                  Description
name  character                         No
                                                  The file variable
                                                  currently being
                                                  edited. The value
                                                  is always $file
                                                  when called from
                                                  Format Control.

                                                  Passes the name
                                                  of the current
                                                  form. If left blank,
                                                  the default is the
                                                  result of
                                                  executing the
                                                  current.format()
                                                  function.

Name        Data type                   Required         Service Manager 9.81
cond.input  Boolean                     No
                                                  Description

                                                  Allows the user to
                                                  edit the data
                                                  record when the
                                                  Arrayed structure
                                                  maintenance
                                                  options are
                                                  displayed. The
                                                  default value is
                                                  true .

Name  Data type                         Required         Service Manager 9.81

                                                  Description

                                                              Note

                                                             When
                                                             callin
                                                             g the
                                                             applic
                                                             ation
                                                             from
                                                             Forma
                                                             t
                                                             Contr
                                                             ol, the
                                                             value
                                                             must
                                                             be
                                                             passe
                                                             d as a
                                                             data
                                                             type
                                                             of 4
                                                             (logic
                                                             al) by
                                                             using
                                                             the
                                                             follow
                                                             ing
                                                             synta
                                                             x:

                                                                   va

                                                                   l(

                                                                   "f

                                                                   al

                                                                   se

                                                                   ",

                                                                   4)

Name   Data type                        Required         Service Manager 9.81
index  number                           No
                                                  Description
This PDF was generated on May 23, 2026
                                                  The number of
                                                  lines in the
                                                  subform that
                                                  displays the
                                                  arrayed structure.
                                                  For example, if
                                                  the arrayed
                                                  structure subform
                                                  has data on lines
                                                  1 and 2, then the
                                                  parameter is 2.
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

                                                                           Page 110 of 269
Name  Data type                         Required         Service Manager 9.81

                                                  Description

                                                    val("n", 1)

                                                  Where:
                                                  The value of n is
                                                  the number of
                                                  lines in the
                                                  subform, and one
                                                  ( 1 ) indicates a
                                                  data type of
                                                  number.


1.2.4.4.7. RAD routine: as.sort

A RAD routine used to sort a structure that includes an array. It sorts based on the
contents of a particular field within the array of the structure. This routine supports
major, minor, and intermediate sorting by allowing you to sort multiple array fields in
the structure with one pass of the routine. You can also specify an ascending or
descending sort order. You must call this routine from Format Control or RAD on an
as-needed basis.

Routine

as.sort

Parameters
The following parameters are valid for the as.sort routine:

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

                                                  The name of the
                                                  structure you
                                                  want to sort. This
                                                  name
                                                  corresponds to
                                                  the input field of
                                                  the subform
                                                  object in the form
                                                  to which the
                                                  Format Control
                                                  record is
                                                  attached.

Name  Data type                         Required         Service Manager 9.81

                                                  Description

                                                              Note

                                                             If the
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
                                                             as.ge
                                                             t.nam
                                                             e
                                                             applic
                                                             ation
                                                             execu
                                                             tes
                                                             again
                                                             st the
                                                             data.

Name     Data type                      Required         Service Manager 9.81
numbers                                 Yes
         array                                    Description
         (numbers)
                                                  Specifies the field
                                                  numbers on
                                                  which to sort
                                                  within the arrayed
                                                  structure. In
                                                  Format Control,
                                                  you must first
                                                  define a
                                                  $variable in the
                                                  Initializations
                                                  form for the array
                                                  of numbers. Next,
                                                  pass that variable
                                                  to the numbers
                                                  input field in the
                                                  Additional
                                                  Options
                                                  definition.

Name  Data type                         Required         Service Manager 9.81

                                                  Description

                                                              Note

                                                             Field
                                                             numb
                                                             ers
                                                             corre
                                                             spond
                                                             to the
                                                             index
                                                             numb
                                                             ers
                                                             listed
                                                             in the
                                                             datab
                                                             ase
                                                             dictio
                                                             nary
                                                             and
                                                             not to
                                                             the
                                                             seque
                                                             nce in
                                                             which
                                                             they
                                                             appea
                                                             r on
                                                             the
                                                             form.

Name       Data type                    Required         Service Manager 9.81
condition                               No
           array                                  Description
           (Boolean)
                                                  Specifies either
This PDF was generated on May 23, 2026            ascending or
                                                  descending order
                                                  for each field
                                                  being sorted in
                                                  the arrayed
                                                  structure, as
                                                  specified in the
                                                  numbers
                                                  parameter. To
                                                  specify an
                                                  ascending order,
                                                  pass a value of
                                                  true . To specify
                                                  descending order,
                                                  pass a value of
                                                  false . The
                                                  default value is
                                                  true .

                                                  Each element in
                                                  this array has a
                                                  direct correlation
                                                  with the elements
                                                  of the numbers
                                                  parameter. In
                                                  Format Control,
                                                  you must first
                                                  define a
                                                  $variable in the
                                                  Initializations
                                                  screen that
                                                  defines the
                                                  Boolean array.
                                                  Next, pass the
                                                  variable to this
                                                  input field in the
                                                  Additional

                                                                           Page 118 of 269
Name  Data type                         Required         Service Manager 9.81

                                                  Description
                                                  Options
                                                  definition.


1.2.4.4.8. RAD routine: axces.apm

A RAD routine that creates or updates an incident based on an Event Services eventin
record.
Routine
axces.apm
Parameters
The following parameters are valid for the axces.apm routine:

Name      Data type                     Required         Service Manager 9.81
record    record                        Yes
text      character                     No        Description
prompt    character                     No
query     character                     No        Identifies the
                                                  eventin record to
string1   character                     No        pass.
boolean1
          Boolean                       No        Provides the
                                                  specific action to
                                                  take.

                                                  Indicates the Map
                                                  Name used in
                                                  event registration.

                                                  Indicates the
                                                  query to use to
                                                  find the pre-
                                                  existing record
                                                  updated by this
                                                  Input event.

                                                  Identifies the
                                                  Service Manager
                                                  file where the
                                                  data is recorded.

                                                  An error occurs if
                                                  this is not set. If
                                                  the value is set to
                                                  NULL , change
                                                  to close . If
                                                  evstatus begins
                                                  with error, the
                                                  value is false . If
                                                  evstatus doesn't
                                                  begin with error,
                                                  the value is true .


1.2.4.4.9. RAD routine:
axces.cm3.cts.write

A RAD routine that creates a schedule record that processes alerts for Change
Management records.
Routine
axces.cm3.cts.write
Parameters
The following parameters are valid for the axces.cm3.cts.write routine:

Name    Data type                       Required         Service Manager 9.81
record  record                          No
name                                              Description
        character                       No
prompt                                            Indicates what file
        character                       No        variable passes to
time1                                             the application.
        time                            No
                                                  Indicates the
                                                  System ID of the
                                                  system to send
                                                  the message to
                                                  and where to
                                                  calculate the
                                                  schedule time.

                                                  Indicates the
                                                  Client of the
                                                  system to send
                                                  the message to
                                                  and where to
                                                  calculate the
                                                  schedule time.

                                                  What's the target
                                                  time for this
                                                  event? Use the
                                                  tod() function to
                                                  indicate to the
                                                  system that the
                                                  message sends at
                                                  the next
                                                  acceptable time.

Name      Data type                     Required         Service Manager 9.81
query     character                     No
                                                  Description
boolean1  Boolean                       No
                                                  Once you find the
                                                  next acceptable
                                                  time for this
                                                  System ID and
                                                  client
                                                  combination, a
                                                  new schedule
                                                  record generates
                                                  for a message of
                                                  this type.

                                                  When set to
                                                  true , the
                                                  rescheduling
                                                  portion of the
                                                  code is bypassed
                                                  and all messages
                                                  occur as soon as
                                                  possible.


1.2.4.4.10. RAD routine: axces.cm3

A RAD routine that creates or updates a change request based on an Event Services
eventin record.
Routine
axces.cm3
Parameters
The following parameters are valid for the axces.cm3 routine:

Name      Data type                     Required         Service Manager 9.81
string1   character                     No
                                                  Description
record    record                        No
prompt                                            Identifies the area
text      character                     No        of CM3 to work in
boolean1                                          and where to
string1   character                     No        record data for
                                                  branching or
query     Boolean                       No        changing tasks
                                                  (cm3r or cm3t).
          character                     No
                                                  Indicates eventin
          character                     No        record to
                                                  process.

                                                  What map
                                                  interprets the
                                                  incoming
                                                  message?

                                                  What map
                                                  interprets the
                                                  incoming
                                                  message?

                                                  Are Output events
                                                  created?

                                                  Identifies the area
                                                  of CM3 to work in
                                                  and where to
                                                  record data for
                                                  branching or
                                                  changing tasks
                                                  (cm3r or cm3t).

                                                  The query for
                                                  existing change
                                                  record.


1.2.4.4.11. RAD routine: axces.database

A RAD routine called by many Event Services events to add, update or delete records
from Service Manager tables using Event Services.
Routine
axces.database
Parameters
The following parameters are valid for the axces.database routine:

Parameter Name Data type                Required         Service Manager 9.81
                                        Yes
record   file                                     Description
         record                         Yes
                                                  Identifies the
prompt   character                                eventin record to
                                                  pass.
string1  character                      Yes
text                                              Identifies the Map
         character                      Yes       name used in
                                                  Event
query    character                      No        Registration. The
                                                  event map name
                                                  must end with a
                                                  for add events
                                                  and must end
                                                  with u for update
                                                  events.

                                                  Identifies the
                                                  Service Manager
                                                  table to populate
                                                  with data.

                                                  Provides the
                                                  specific action to
                                                  take, such as the
                                                  following:

                                                       add
                                                       delete
                                                       update

                                                  Indicates the
                                                  query to use to
                                                  find the existing
                                                  record to update.

Parameter Name Data type                Required         Service Manager 9.81
                                        No
boolean1    Boolean                               Description

cond.input  Boolean                     No        When flagged,
                                                  the value is true
name        character                   No        and Service
                                                  Manager writes
                                                  an eventout
                                                  record. When not
                                                  flagged, the value
                                                  is false and no
                                                  eventout record is
                                                  written.

                                                  Specifies the
                                                  behavior to follow
                                                  when more than
                                                  one record
                                                  matches the
                                                  query. When
                                                  flagged true ,
                                                  Service Manager
                                                  processes more
                                                  than one record.
                                                  When not flagged
                                                  (value is false ),
                                                  Service Manager
                                                  processes only
                                                  the first record
                                                  found.

                                                  Indicates the
                                                  Format Control
                                                  record to use.


1.2.4.4.12. RAD routine: axces.email

A RAD routine that creates an eventout record based on the Service Manager mail
record that was passed in.
Routine
axces.email
Parameters
The following parameters are valid for the axces.email routine:

Name    Data type                       Required  Description
record  record                          No
                                                  Writes the unique
text    character                       No        record identifier
                                                  to the eventin
                                                  record. Set up the
                                                  $axces variable
                                                  using Format
                                                  Control to create
                                                  the intended
                                                  result.

                                                  Indicates the
                                                  delimiter
                                                  character.
````
