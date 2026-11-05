---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.4.4.25 .. 1.2.4.4.33
printed_pages: 1493-1516
---

# 1.2.4.4.25 RAD routine: message.fc

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.4.4.25. RAD routine: message.fc

A RAD routine used to send messages under user control.
Routine
message.fc
Parameters
The following parameters are valid for the message.fc routine:

Name    Data type                       Required         Service Manager 9.81
index   number                          No
                                                  Description
prompt  character                       No
                                                  Select one of
                                                  three message
                                                  levels:

                                                        1 for
                                                       information,
                                                       this is the
                                                       default.
                                                        2 for
                                                       action.
                                                        3 for error.

                                                  In Text mode,
                                                  message levels
                                                  may appear in
                                                  different colors.

                                                  Enter a message
                                                  class that
                                                  matches one of
                                                  the records in the
                                                  msgclass table,
                                                  such as
                                                  problemclose. To
                                                  send email
                                                  messages, there
                                                  must be a
                                                  msgclass record
                                                  with a type of
                                                  email for the
                                                  message class
                                                  name specified.
                                                  The default value
                                                  is msg .

Name  Data type                         Required         Service Manager 9.81
text  character                         Yes
                                                  Description
name  character                         No
                                                  The text of the
This PDF was generated on May 23, 2026            message can be
                                                  a string or an
                                                  array. For
                                                  example,
                                                  generate an array
                                                  of the screen
                                                  contents using
                                                  the genout()
                                                  function and then
                                                  insert lines of text
                                                  at the top of the
                                                  array.

                                                  This value can
                                                  contain either a
                                                  list of operator
                                                  names or a single
                                                  name. For internal
                                                  Service Manager
                                                  messages, the
                                                  names must be
                                                  operator ID's
                                                  defined in the
                                                  operator table.
                                                  For email, the
                                                  names can either
                                                  be operator ID's
                                                  or contact names
                                                  (contact.name)
                                                  defined in the
                                                  contacts table; an
                                                  email address
                                                  must be specified
                                                  in the relevant
                                                  table. The default
                                                  is operator() .

                                                                           Page 160 of 269
Name     Data type                      Required         Service Manager 9.81
string1  character                      No
                                                  Description
number1  number                         No
                                                  The message
query    character                      No        name parameter
                                                  identifies the
                                                  message. Use the
                                                  name of the
                                                  Service Manager
                                                  application or
                                                  application area
                                                  that generates
                                                  the message.

                                                  The message
                                                  number
                                                  parameter
                                                  identifies a
                                                  message within
                                                  the area specified
                                                  by the string1
                                                  parameter.

                                                  The mail class
                                                  parameter is used
                                                  within Incident
                                                  Management
                                                  applications to
                                                  identify the
                                                  record number so
                                                  that mail already
                                                  sent can be
                                                  selected and
                                                  updated. It must
                                                  contain the string
                                                  pm.main and a
                                                  Mail Target must
                                                  be defined.

Name     Data type                      Required         Service Manager 9.81
names,1                                 No
         array                                    Description
         (characters)
                                                  The mail target
                                                  parameter must
                                                  contain the
                                                  incident record
                                                  number.


1.2.4.4.26. RAD routine: post.fc

A RAD routine used to execute the posting routine from the subroutines process
(automatic posting) and from the additional options process (manual posting).
Routine
post.fc
Parameters
The following parameters are valid for the post.fc routine:

Name  Data type                         Required         Service Manager 9.81
file  record                            Yes
                                                  Description
name  character                         No
                                                  The value is
                                                  always $file
                                                  when calling
                                                  post.fc through
                                                  the Additional
                                                  Options process.
                                                  In most cases,
                                                  the variable is
                                                  $file when
                                                  calling post.fc
                                                  through the
                                                  Subroutine
                                                  process;
                                                  however, it could
                                                  be $file1 , or
                                                  another file
                                                  variable
                                                  established by
                                                  Format Control or
                                                  custom RAD
                                                  processing.

                                                  Defaults to the
                                                  name of the
                                                  currently open
                                                  form. You can
                                                  override this
                                                  default by
                                                  passing a string
                                                  of the specific
                                                  Link record you
                                                  want to use.

Name    Data type                       Required         Service Manager 9.81
prompt  character                       No
                                                  Description

                                                  Defaults to the
                                                  name of the input
                                                  field that the
                                                  cursor is in when
                                                  the you select the
                                                  option. You can
                                                  override this
                                                  default by
                                                  passing a string
                                                  of a specific field
                                                  name you want to
                                                  use.


1.2.4.4.27. RAD routine: publish

A RAD routine used to publish a variable into SYSPUB.
Routine
publish
Parameters
The following parameters are valid for the publish routine:

Name  Data type                         Required             Description
name  character                         No
                                                             The published
text  character                         No                   variable used by
                                                             the agent to
                                                             search the
                                                             database.

                                                             The variable that
                                                             identifies the
                                                             message to be
                                                             published.


1.2.4.4.28. RAD routine: query.stored

A RAD routine used to access all queries for a specific table or to execute a specific
stored query.

Note: This routine is called only from Additional Options in Format Control.
Routine
query.stored
Parameters
The following parameters are valid for the query.stored routine:

Name  Data type                         Required  Description
name  character                         No
                                                  The name of the
text  character                         No        table you want to
                                                  enable the user to
                                                  query, for
                                                  example,
                                                  device.workstati
                                                  on .

                                                  The name of the
                                                  stored query you
                                                  want to execute,
                                                  for example,
                                                  name=operator(
                                                  ).


1.2.4.4.29. RAD routine: scauto.inventory

A RAD routine that provides access to Configuration items (CIs).
Routine
scauto.inventory
Parameters
The following parameters are valid for the scauto.inventory routine:

Name     Data type                      Required         Service Manager 9.81
record   record                         Yes
                                                  Description
prompt   character                      No
string1                                           Writes the unique
text     character                      No        record identifier
query                                             to the eventin
         character                      No        record. If you use
                                                  a variable such as
         character                      No        $axces , set it up
                                                  using Format
                                                  Control to create
                                                  the intended
                                                  result.

                                                  Indicates the Map
                                                  name in event
                                                  registration.

                                                  Identifies the
                                                  Service Manager
                                                  table name to
                                                  write to.

                                                  Provides the
                                                  specific action to
                                                  take, such as add,
                                                  update, or delete.

                                                  Indicates the
                                                  query to use to
                                                  find the pre-
                                                  existing record
                                                  that this Input
                                                  event updates.

Name      Data type                     Required         Service Manager 9.81
boolean1  Boolean                       No
                                                  Description
name      character                     No
                                                  The logical
                                                  parameter flag,
                                                  true or false ,
                                                  that indicates
                                                  whether to write
                                                  the eventout
                                                  record on
                                                  transaction
                                                  completion.

                                                  Specifies the
                                                  event registration
                                                  name.


1.2.4.4.30. RAD routine: sort.array

A RAD routine called from subroutines to sort simple arrays, such as number,
character, or date and time, in either ascending or descending order.
Routine
sort.array
Parameters
The following parameters are valid for the sort.array routine:

Name      Data type                     Required  Description
file      record                        Yes
                                                  When calling
name      character                     Yes       sort.array from
boolean1                                          Format Control,
          Boolean                       No        always pass
                                                  $file to this
                                                  parameter.

                                                  The name of the
                                                  input field (array)
                                                  in $file you want
                                                  to sort.

                                                  Controls the sort
                                                  order. A value of
                                                  true sorts in
                                                  ascending order,
                                                  and a value of
                                                  false sorts in
                                                  descending order.
                                                  The value is
                                                  expressed as
                                                  val() , for
                                                  example,
                                                  val("false", 4) .


1.2.4.4.31. RAD routine: us.js.call

A RAD routine that can invoke any JavaScript function in the ScriptLibrary. This
routine enables you to run a JavaScript function without connecting to the Service
Manager server via a client.
Routine
us.js.call
Parameters
The following parameters are valid for the us.js.call routine:


Parameter        Data type              Required         Description
script.function  string                 Yes
                                                         Refers to a script
arg,1            array                  The required     in the
                                        arguments        ScriptLibrary and
                 (characters)           depend upon the  a particular
                                        requirements of  function within
                                        the script you   the script.
                                        call.
                                                         The arguments
                                                         passed to
                                                         JavaScript. You
                                                         can pass an
                                                         infinite number of
                                                         arguments. If an
                                                         argument need
                                                         be enclosed in
                                                         double quotes in
                                                         JavaScript, use
                                                         \\\" to enclose
                                                         the argument
                                                         when you use this
                                                         routine. For
                                                         example, if a
                                                         JavaScript
                                                         function has
                                                         arguments:
                                                         {"abc", "def"} ,
                                                         specify these
                                                         arguments as
                                                         {\\\"abc\\\",
                                                         \\\"def\\\"} in this
                                                         parameter.

Parameter  Data type                    Required         Service Manager 9.81
arg,2                                   No
                                                  Description

                                                  This parameter is
                                                  for the returned
                                                  value of the
                                                  JavaScript
                                                  function. When
                                                  you use this
                                                  routine in the
                                                  operating
                                                  system's
                                                  command
                                                  prompt, set this
                                                  parameter to
                                                  NULL .


1.2.4.4.32. RAD routine: validate.fields

A RAD routine used to validate fields in a form.
Routine
validate.fields
Parameters
The following parameters are valid for the validate.fields routine:

Name         Data type                  Required         Service Manager 9.81
name         character                  No
                                                  Description
names        array (of characte No
             rs)                                  Names the field in
                                                  the current form
second.file  record                     Yes       to validate, such
                                                  as logical.name.
                                                  To name the field
                                                  in which the
                                                  cursor was last
                                                  located when an
                                                  add or update
                                                  was performed,
                                                  use the
                                                  cursor.field.name
                                                  () RAD function .

                                                  Name of the array
                                                  in the current
                                                  form containing
                                                  the field names to
                                                  validate. The line
                                                  of the array to
                                                  validate must be
                                                  defined in the
                                                  Initializations
                                                  process.

                                                  The data record
                                                  in which the field
                                                  is being validated.
                                                  The value of this
                                                  parameter must
                                                  be $file .

Name        Data type                   Required         Service Manager 9.81
cond.input  Boolean                     No
                                                  Description

                                                  The required
                                                  value of the field
                                                  defined by the
                                                  val() parameter .
                                                  For example, to
                                                  validate a
                                                  Boolean field to
                                                  true , use the
                                                  value val("true",
                                                  4) . When set to
                                                  true, the value
                                                  can be looked up
                                                  online. This
                                                  means a list of
                                                  valid values is
                                                  presented for
                                                  selection.


1.2.4.4.33. RAD routine:
wmi.inventory.check

A RAD routine that checks the eventin record for status information from a type of
scan. This routine also processes the information from the scan into the Configuration
Management application using the scauto.inventory RAD routine.
Routine
wmi.inventory.check
Parameters
The following parameters are valid for the wmi.inventory.check routine:

Name      Data type                     Required         Service Manager 9.81
record    record                        Yes
prompt                                            Description
string1   character                     No
                                                  Identifies the
text      character                     No        eventin record to
                                                  pass.
query     character                     No
                                                  Indicates the Map
          character                     No        name used in
                                                  event registration.
boolean1  Boolean                       No
                                                  Identifies the
name      character                     No        Service Manager
                                                  table where data
This PDF was generated on May 23, 2026            is recorded.

                                                  Provides the
                                                  specific action to
                                                  take, such as add,
                                                  update, or delete.

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

                                                  Identifies the
                                                  event registration
                                                  name.

                                                                           Page 179 of 269
Name        Data type                   Required         Service Manager 9.81
cond.input  Boolean                     No
                                                  Description

                                                  A logical
                                                  parameter, true
                                                  or false , that
                                                  specifies whether
                                                  or not to process
                                                  additional records
                                                  if you select more
                                                  than one record.
````
