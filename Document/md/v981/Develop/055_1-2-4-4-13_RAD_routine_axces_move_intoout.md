---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.4.4.13 .. 1.2.4.4.24
printed_pages: 1466-1493
---

# 1.2.4.4.13 RAD routine: axces.move.intoout

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.4.4.13. RAD routine:
axces.move.intoout

A RAD routine that copies an eventin record to the eventout file and changes the
evtype.
Routine
axces.move.intoout
Parameters
The following parameters are valid for the axces.move.intoout routine:

Name    Data type                       Required  Description
record  record                          Yes
                                                  Identifies the
name    character                       No        eventin record to
                                                  pass.

                                                  Identifies the
                                                  eventout type.


1.2.4.4.14. RAD routine: axces.rm

A RAD routine that creates or updates Request Management quotes via Event
Services eventin record.
Routine
axces.rm
Parameters
The following parameters are valid for the axces.rm routine:

Name      Data type                     Required         Service Manager 9.81
record    record                        No
                                                  Description
text      character                     No
                                                  This parameter
prompt    character                     No        identifies which
query                                             eventin record to
string1   character                     No        pass.

          character                     No        Provides the
                                                  specific action to
boolean1  Boolean                       No        take, such as add,
                                                  open, update,
This PDF was generated on May 23, 2026            close, approve,
                                                  disapprove or
                                                  unapprove.

                                                  Indicates the Map
                                                  name in event
                                                  registration.

                                                  The query string
                                                  used to select a
                                                  pre-existing
                                                  record to update.

                                                  Identifies the
                                                  Service Manager
                                                  table (ocmq,
                                                  ocmo, or ocml)
                                                  where data is
                                                  recorded.

                                                  The logical
                                                  parameter flag,
                                                  true or false ,
                                                  that indicates
                                                  whether to write
                                                  the eventout
                                                  record on
                                                  transaction
                                                  completion.

                                                                           Page 133 of 269
Name  Data type                         Required         Service Manager 9.81
name  character                         No
                                                  Description

                                                  Identifies the
                                                  operator (security
                                                  profile) in Service
                                                  Manager to use
                                                  and which userID
                                                  to stamp on
                                                  records that are
                                                  processed using
                                                  this event.


1.2.4.4.15. RAD routine:
axces.sap.hybrid.evin

A RAD routine that splits events out into the appropriate constituent parts.
Routine
axces.sap.hybrid.evin
Parameters
The following parameters are valid for the axces.sap.hybrid.evin routine:

Name    Data type                       Required  Description
record  record                          No
                                                  A hybrid event
prompt  character                       No        that calls the
name                                              appropriate
        character                       No        routines for
                                                  header and detail
                                                  events. This
                                                  parameter
                                                  expects one
                                                  header and any
                                                  number of
                                                  properly-formed
                                                  detail events.

                                                  Identifies the
                                                  eventregister that
                                                  interprets the
                                                  detail portion of
                                                  the event
                                                  message.

                                                  Identifies the
                                                  eventregister that
                                                  interprets the
                                                  header portion of
                                                  the event stream.



1.2.4.4.16. RAD routine: axces.sm

A RAD routine that creates or updates Service Desk interactions based on an eventin
record using Event Services.
Routine
axces.sm
Parameters
The following parameters are valid for the axces.sm routine:

Name      Data type                     Required         Service Manager 9.81
record    record                        Yes
prompt                                            Description
string1   character                     No
query                                             Identifies the
          character                     No        eventin record to
boolean1                                          pass.
          character                     No
text                                              Indicates the Map
          Boolean                       No        name used in
                                                  event registration.
          character                     No
                                                  Identifies the
                                                  Service Manager
                                                  file where data is
                                                  recorded.

                                                  Indicates the
                                                  query to use to
                                                  find the pre-
                                                  existing record
                                                  that this Input
                                                  event updates.

                                                  A logical
                                                  parameter flag,
                                                  true or false ,
                                                  that indicates
                                                  whether the
                                                  eventout record
                                                  writes on
                                                  transaction
                                                  completion.

                                                  Designates the
                                                  output event
                                                  type.


1.2.4.4.17. RAD routine: axces.software

A RAD routine that adds, updates, or deletes a software configuration item (CI) that an
external agent discovers to the pcfiles file once the filter criteria are satisfied.
Routine
axces.software
Parameters
The following parameters are valid for the axces.software routine:

Name      Data type                     Required         Service Manager 9.81
record    record                        No
                                                  Description
prompt    character                     No
string1                                           Writes the unique
          character                     No        record identifier
query                                             to the eventin
boolean1  character                     No        record. Set up the
                                                  $axces variable
          Boolean                       No        using Format
                                                  Control to create
                                                  the intended
                                                  result.

                                                  Indicates the Map
                                                  name used in
                                                  event registration.

                                                  Identifies the
                                                  software file in
                                                  Service Manager
                                                  where the
                                                  configuration item
                                                  (CI) data is
                                                  recorded.

                                                  In this case,
                                                  logical.name = 1
                                                  and
                                                  description = 9
                                                  in $axces.fields.

                                                  A logical
                                                  parameter flag,
                                                  true or false ,
                                                  that indicates
                                                  whether the
                                                  eventout record
                                                  writes on
                                                  transaction
                                                  completion.

Name  Data type                         Required         Service Manager 9.81
name  character                         No
                                                  Description

                                                  Specifies the
                                                  Format Control
                                                  record to use.


1.2.4.4.18. RAD routine: axces.write

A RAD routine used to build an eventout record used by the SCAutomate (SCAuto)
interface.
Routine
axces.write
Parameters
The following parameters are valid for the axces.write routine:

Name     Data type                      Required         Service Manager 9.81
record   record                         Yes
name                                              Description
         character                      No
string1                                           Names the record
         character                      No        to be written. In
                                                  Format Control
                                                  the record is
                                                  $file .

                                                  Names the
                                                  registration type
                                                  as it appears in
                                                  the eventregister
                                                  file. For example,
                                                  to write an
                                                  eventout record
                                                  when an incident
                                                  is opened, use
                                                  the value pmo
                                                  for this
                                                  parameter.

                                                  Defines the
                                                  separation
                                                  character. If you
                                                  define your own
                                                  character, ensure
                                                  that it doesn't
                                                  occur naturally in
                                                  fields in the
                                                  event. The default
                                                  is value is the
                                                  caret character
                                                  ( ^ ).

Name    Data type                       Required         Service Manager 9.81
text    character                       No
                                                  Description
prompt  character                       No
query                                             Defines a system
        character                       No        sequence ID with
                                                  a maximum
                                                  length of 16
                                                  characters.
                                                  Service Manager
                                                  generates the
                                                  system sequence
                                                  ID unless you
                                                  supply one.

                                                  Defines a user
                                                  sequence ID with
                                                  a maximum
                                                  length of 16
                                                  characters.

                                                  Defines the user
                                                  name. The default
                                                  value is
                                                  operator() .


1.2.4.4.19. RAD routine: database

A RAD routine used to access other tables from a particular record. For example, to
enable an option button to appear on your users’ screens, allowing them to call the
location table from the contacts table.

            Note

           This routine is only called from Additional Options in Format Control.

Routine
database
Parameters
The following parameter is valid for the database routine:

Name    Data type                       Required            Description
name    character                       No
                                                            The name of the
record  record                          No                  form you want to
                                                            open.

                                                            Specifies the
                                                            Format Control
                                                            record to use.


1.2.4.4.20. RAD routine: es.approval

A RAD routine that processes approvals for the Request Management and Change
Management applications.
Routine
es.approval
Parameters
The following parameters are valid for the es.approval routine:

Name        Data type                   Required  Description
record      record                      Yes
                                                  Identifies the
text        character                   No        eventin record to
                                                  pass.
name        character                   No
                                                  Identifies the
cond.input  Boolean                     No        Service Manager
                                                  table where data
                                                  is recorded.

                                                  Indicates the Map
                                                  name used in
                                                  event registration.

                                                  A logical
                                                  parameter, true
                                                  or false , that
                                                  specifies whether
                                                  the eventout
                                                  record writes on
                                                  transaction
                                                  completion.


1.2.4.4.21. RAD routine: fill.fc

A RAD routine that copies data from a target file to the current file using predefined
links under user control.
Routine
fill.fc
Parameters
The following parameters are valid for the fill.fc routine:

Name                 Data type          Required         Service Manager 9.81
record               record             Yes
                                                  Description
text                 character          No
                                                  The value is
string1              character          No        $file when
                                                  calling fill.fc
                                                  through the
                                                  Additional
                                                  Options process.

                                                  The name of the
                                                  field in the target
                                                  file to fill. The
                                                  default is the
                                                  current field (the
                                                  field where the
                                                  cursor is located).
                                                  If the field is an
                                                  array, the fill
                                                  operation
                                                  attempts to copy
                                                  data back to that
                                                  item in the
                                                  selected array.

                                                  The form name
                                                  that determines
                                                  which link record
                                                  to use. The
                                                  default is the link
                                                  record for the
                                                  current form.

Variables supported
$fill.replace
$project.first
$fill.exact


1.2.4.4.22. RAD routine: getnumb.fc

A RAD routine used to establish the numbering sequence in sequential numbering.
You can create simple identification numbers for database records, or complex
numbers composed of prefixes and suffixes.
Routine
getnumb.fc
Parameters
The following parameters are valid for the getnumb.fc routine:

Name    Data type                       Required         Service Manager 9.81
record  record                          Yes
name                                              Description
        character                       Yes
prompt                                            The data record
text    character                       Yes       where the
                                                  number will be
        character                       No        placed. The value
                                                  of this parameter
                                                  must be $file .

                                                  The sequential
                                                  number Class
                                                  (category) of the
                                                  record that the
                                                  Format Control
                                                  record is
                                                  attached. This
                                                  value appears in
                                                  the Class field of
                                                  the Sequential
                                                  Numbering File.

                                                  Names the field in
                                                  the data record
                                                  where the
                                                  sequential
                                                  number appears.

                                                  Defines the data
                                                  type of the
                                                  sequential
                                                  number (number
                                                  or string).

Name     Data type                      Required         Service Manager 9.81
number1  number                         No
                                                  Description
string1  character                      No
                                                  Defines the
This PDF was generated on May 23, 2026            length of the
                                                  sequential
                                                  number. The
                                                  subroutine
                                                  prefixes as many
                                                  zeroes to the
                                                  number as
                                                  necessary to
                                                  match the
                                                  required number
                                                  of digits. Pass the
                                                  val() RAD
                                                  function to the
                                                  number1
                                                  parameter. For
                                                  example, a four-
                                                  digit number has
                                                  a value of
                                                  val("4", 1) .

                                                  Where:

                                                  The number 4 is
                                                  the length of the
                                                  number and the
                                                  number 1 is the
                                                  data type (a
                                                  number
                                                  representation).

                                                  Defines the
                                                  prefix. This is the
                                                  identifying
                                                  character string
                                                  that appears
                                                  before the
                                                  number.

                                                                           Page 151 of 269
Name       Data type                    Required         Service Manager 9.81
numbers,1  array                        No
           (numbers)                              Description

numbers,2  array                        No        Determines the
                                                  reset point for the
           (numbers)                              sequential
                                                  number. When
numbers,3  array                        No        the value passed
                                                  to the application
           (numbers)                              is reached, the
                                                  sequential
                                                  number resets to
                                                  the starting value.

                                                  Establishes a new
                                                  starting value for
                                                  the sequential
                                                  number when the
                                                  reset point is
                                                  reached.

                                                  Sets the
                                                  increment or
                                                  decrement value.
                                                  For example, if
                                                  you want to
                                                  increment by 2,
                                                  displaying odd or
                                                  even numbers
                                                  only.

Name       Data type                    Required         Service Manager 9.81
numbers,4                               No
           array                                  Description
           (numbers)
                                                  Allows the user to
                                                  increment or
                                                  decrement the
                                                  sequential
                                                  number
                                                  independent of
                                                  the number file.
                                                  Use this
                                                  parameter to
                                                  attach a specified
                                                  number to your
                                                  records without
                                                  updating the
                                                  number file.


1.2.4.4.23. RAD routine: marquee.publish

A RAD routine used to send a marquee message. This routine is always called from
within marquee.send.
Routine
marquee.publish
Parameters
The following parameters are valid for the marquee.publish routine:

Name  Data type                         Required         Service Manager 9.81
name  character                         Yes
                                                  Description
text  character                         No
                                                  The published
                                                  variable used by
                                                  the agent to
                                                  search the
                                                  database.

                                                              Note

                                                             The
                                                             syste
                                                             m
                                                             autom
                                                             aticall
                                                             y
                                                             adds
                                                             $MA
                                                             RQUE
                                                             E to
                                                             the
                                                             begin
                                                             ning
                                                             your
                                                             variab
                                                             le
                                                             name
                                                             befor
                                                             e
                                                             publis
                                                             hing
                                                             it.

                                                  A variable that
                                                  contains the
                                                  message to be
                                                  published.

Name        Data type                   Required         Service Manager 9.81
prompt      character                   No
                                                  Description
boolean1    Boolean                     No
                                                  The display color
cond.input  Boolean                     No        for your marquee
                                                  or the valid
                                                  system number in
                                                  the Color field.
                                                  The default value
                                                  is Red.

                                                  A logical field. Set
                                                  the flag to true
                                                  to add this
                                                  message to the
                                                  marquee table.
                                                  The marquee
                                                  agent then reads
                                                  the record and
                                                  publishes it. If the
                                                  flag is set to
                                                  false , the
                                                  routine
                                                  immediately
                                                  publishes your
                                                  message without
                                                  adding it to the
                                                  marquee table
                                                  (recommended
                                                  method).

                                                  A logical field. Set
                                                  the flag to true
                                                  to add the name
                                                  to the database if
                                                  that record
                                                  doesn't exist.


1.2.4.4.24. RAD routine: marquee.send

A RAD routine used to read the schedule record and initiate the marquee.publish
application.
Routine
marquee.send
Parameters
The following parameters are valid for the marquee.send routine:

Name      Data type                     Required  Description
record    character                     Yes
                                                  Schedule record
boolean1  Boolean                       No        for the marquee
                                                  process

                                                  Logical field. Set
                                                  the flag to true
                                                  to send all
                                                  marquee
                                                  messages
                                                  defined in the
                                                  schedule record.
                                                  If set to false , or
                                                  the field is
                                                  NULL , the
                                                  application
                                                  publishes only the
                                                  specific marquee
                                                  message defined
                                                  in the schedule
                                                  record
                                                  (recommended
                                                  method).
````
