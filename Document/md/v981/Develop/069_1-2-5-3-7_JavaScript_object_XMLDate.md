---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.5.3.7 .. 1.2.5.4
printed_pages: 1838-1864
---

# 1.2.5.3.7 JavaScript object: XMLDate

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.5.3.7. JavaScript object: XMLDate

The following JavaScript object is unique to Service Manager.

With no arguments, the XMLDate() constructor creates an empty XMLDate object.

With a DateObject argument, the XMLDate() constructor converts a JavaScript date
object to an XMLDate object.

With an ISO8601DateTimeOrDurationString argument, the XMLDate() constructor
converts an XML schema date object to an XMLDate object.

With a DateTimeDatum argument, the XMLDate() constructor converts a Service Manager
date object to an XMLDate object.

This object's methods use the Service Manager-defined global return codes.

Constructor

new XMLDate();
new XMLDate( DateObject );
new XMLDate( ISO8601DateTimeOrDurationString );
new XMLDate( DateTimeDatum );

Arguments
The following arguments are valid for this object:

Argument                                Data type               Description
DateObject                              JavaScript date object
                                                                Passes a JavaScript date
ISO8601DateTimeOrDurat XML schema date                          object to the XMLDate
ionString                                                       constructor.

DateTimeDatum                           Service Manager Datum   Passes an XML schema
                                        object                  date, time, datetime, or
                                                                duration string to the
                                                                XMLDate constructor.

                                                                Passes a Service Manager
                                                                datum object formatted as
                                                                a TIME type to the
                                                                XMLDate constructor.


Properties
None
Methods
The following methods are valid for this object:

Defined method                                                                                   Service Manager 9.81
getISODateTimeString
getISODate                              Description
getISOTime
getISOYear                              This method passes a JavaScript Date
getISOMonth                             object to the constructor.
getISODay
getISODateTimeWithSMTZString            This method returns the indicated
getDatum                                portions of the XMLDate value.
getSCDateTimeString
getGMTSCDateTimeString                  This method returns the indicated
                                        portions of the XMLDate value.
toSCDuration
addDuration( iso8601durationstring )    This method returns the indicated
                                        portions of the XMLDate value.
JSDate
                                        This method returns the indicated
                                        portions of the XMLDate value.

                                        This method returns the indicated
                                        portions of the XMLDate value.

                                        This method passes a JavaScript Date
                                        object to the constructor.

                                        This method returns an SCDatum object.

                                        This method returns a datetime string in
                                        Service Manager format.

                                        This method returns the Greenwich Mean
                                        Time (GMT) datetime in Service Manager
                                        format.

                                        This method converts an ISO duration
                                        string to a Service Manager duration.

                                        This method adds the indicated duration
                                        to the contained value in the XMLDate
                                        object.

                                        This method returns a JavaScript date
                                        object.


Defined method                          Description
getDate
                                        This method returns a JavaScript date
                                        object (same as the JSDate method).

Example
This example does the following:

     Creates an SCFile object from the cm3r table
     Creates an XMLDate object
     Sets the value of two fields to the XMLdate

This example requires the following sample data:

     A valid duration

/* Instantiate a new SCFile object with records of the cm3r table */
var changeRequest = new SCFile("cm3r");
/* Set the Service Manager fields date.entered and planned.start to
today's date.
* The dots in Service Manager field names must be converted to
underscores */
var theXMLDate = new XMLDate( new Date() );
var todaysDate = theXMLDate.getDatum();
changeRequest.header.date_entered = todaysDate;
changeRequest.header.planned_start = todaysDate;
/* Increment the value of the planned.end field to be a week later.
* P is the addDuration parameter for duration
* 7D is the addDuration parameter for 7 days
* See the addDuration method for additional information */
theXMLDate.addDuration('P7D');
var nextWeeksDate = theXMLDate.getDatum();
changeRequest.header.planned_end = nextWeeksDate;
changeRequest.doInsert();


1.2.5.3.7.1. JavaScript method:
XMLDate.addDuration()

This method returns an XMLDate object containing the new date/time after adding the
duration from the duration argument.

Syntax

XMLDate.addDuration( duration );

Arguments
The following arguments are valid for this function:

Argument  Data type                     Required      Description
duration                                Yes
          ISO 8601 duration                           This argument
          string                                      contains the ISO
                                                      8601 duration
                                                      string or variable
                                                      value you want the
                                                      script to add to an
                                                      XMLDate object.

Return values
An XMLDate object or null .
The method returns an XMLDate object or null if conversion fails.

Example

This example does the following:

     Creates a new XMLDate object containing today's date
     Adds 1 year, 2 months, 3 days, and 4 hours to the XMLDate object then displays the
     result


print( "Creating XMLDate object..." );
var d = new XMLDate( new Date() );
print( "The value of the new XMLDate object is: " + d );
print( "Adding 1 year, 2 months, 3 days, and 4 hours to date..." );
var dur = d.addDuration( "P1Y2M3DT4H" );
print( "The value of the new XMLDate object is: " + dur );


1.2.5.3.7.2. JavaScript method:
XMLDate.getDate()

This method returns a JavaScript date/time object.
Syntax

  XMLDate.getDate();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a JavaScript date/time object or null if conversion fails.
Example
This example does the following:

     Creates a new XMLDate object containing today's date
     Converts the XMLDate object to JavaScript date/time object then displays the result

  print( "Creating XMLDate object..." );
  var d = new XMLDate( new Date() );
  print( "The value of the new XMLDate object is: " + d );
  print( "Converting the XMLDate to a JavaScript object..." );
  var js = d.getDate();
  print( "The JavaScript date/time object is: " + js );


1.2.5.3.7.3. JavaScript method:
XMLDate.getDatum()

This method returns an Service Manager-formatted date/time Datum object.
Syntax

  XMLDate.getDatum();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a Service Manager-formatted date/time Datum object or null if the
conversion fails.
Example
This example does the following:

     Creates a new XMLDate object containing today's date
     Converts the XMLDate object to Service Manager-formatted date/time Datum object
     then displays the result

  print( "Creating XMLDate object..." );
  var d = new XMLDate( new Date() );
  print( "The value of the new XMLDate object is: " + d );
  print( "Converting the XMLDate to a Service Manager Datum..." );
  var sm = d.getDatum();
  print( "The Service Manager Datum object is: " + sm );


1.2.5.3.7.4. JavaScript method:
XMLDate.getGMTSCDateTimeString()

This method returns Service Manager-formatted date/time string in Greenwich Mean Time
(GMT).
Syntax

  XMLDate.getSCDateTimeString();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a Service Manager-formatted date/time string or null if the
conversion fails.
Example
This example does the following:

     Creates a new XMLDate object containing today's date
     Converts the XMLDate object to Service Manager-formatted date/time string then
     displays the result

  print( "Creating XMLDate object..." );
  var d = new XMLDate( new Date() );
  print( "The value of the new XMLDate object is: " + d );
  print( "Converting the XMLDate to a Service Manager date/time
  string..." );
  var sc = d.getGMTSCDateTimeString();
  print( "The Service Manager GMT date/time string is: " + sc );


1.2.5.3.7.5. JavaScript method:
XMLDate.getISODate()

This method returns a string containing the date portion of date/time object in ISO format.
Syntax

  XMLDate.getISODate();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a string containing the ISO date of a date/time object or null if
conversion fails.
Example
This example does the following:

     Creates a new XMLDate object containing today's date
     Converts the XMLDate object to an ISO date then displays the result

  print( "Creating XMLDate object..." );
  var d = new XMLDate( new Date() );
  print( "The value of the new XMLDate object is: " + d );
  print( "Converting the XMLDate to ISO format..." );
  var ISO = d.getISODate();
  print( "The ISO date is: " + ISO );


1.2.5.3.7.6. JavaScript method:
XMLDate.getISODateTimeString()

This method returns a string containing the date and time portion of date/time object in
ISO format.
Syntax

  XMLDate.getISODateTimeString();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a string containing the ISO date and time of a date/time object or
null if the conversion fails.
Example
This example does the following:

     Creates a new XMLDate object containing today's date
     Converts the XMLDate object to an ISO date and time then displays the result

  print( "Creating XMLDate object..." );
  var d = new XMLDate( new Date() );
  print( "The value of the new XMLDate object is: " + d );
  print( "Converting the XMLDate to ISO format..." );
  var ISO = d.getISODateTimeString();
  print( "The ISO date and time is: " + ISO );


1.2.5.3.7.7. JavaScript method:
XMLDate.getISODateTimeWithSMTZString()

This method returns a string containing the date and time portion of date/time object in
ISO format with the operator's timezone.

Syntax

  XMLDate.getISODateTimeWithSMTZString();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a string containing the ISO date and time of a date/time object or
null if the conversion fails.

Example
This example does the following:

     Creates a new XMLDate object containing today's date
     Converts the XMLDate object to an ISO date and time then displays the result

  print( "Creating XMLDate object..." );
  var d = new XMLDate( new Date() );
  print( "The value of the new XMLDate object is: " + d );
  print( "Converting the XMLDate to ISO format..." );
  var ISO = d.getISODateTimeWithSMTZString();
  print( "The ISO date and time is: " + ISO );


1.2.5.3.7.8. JavaScript method:
XMLDate.getISODay()

This method returns a string containing the day portion of date/time object in ISO format.
Syntax

  XMLDate.getISODay();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a string containing the ISO day of a date/time object or null if the
conversion fails.
Example
This example does the following:

     Creates a new XMLDate object containing today's date
     Converts the XMLDate object to an ISO day then displays the result

  print( "Creating XMLDate object..." );
  var d = new XMLDate( new Date() );
  print( "The value of the new XMLDate object is: " + d );
  print( "Converting the XMLDate to ISO format..." );
  var ISO = d.getISODay();
  print( "The ISO day is: " + ISO );


1.2.5.3.7.9. JavaScript method:
XMLDate.getISOMonth()

This method returns a string containing the month portion of date/time object in ISO
format.
Syntax

  XMLDate.getISOMonth();

Arguments
There are no arguments for this method.
Return values
A string or null.
The method returns a string containing the ISO month of a date/time object or null if the
conversion fails.
Example
This example does the following:

     Creates a new XMLDate object containing today's date
     Converts the XMLDate object to an ISO month then displays the result

  print( "Creating XMLDate object..." );
  var d = new XMLDate( new Date() );
  print( "The value of the new XMLDate object is: " + d );
  print( "Converting the XMLDate to ISO format..." );
  var ISO = d.getISOMonth();
  print( "The ISO month is: " + ISO );


1.2.5.3.7.10. JavaScript method:
XMLDate.getISOTime()

This method returns a string containing the time portion of date/time object in ISO format.
Syntax

  XMLDate.getISOTime();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a string containing the ISO time of a date/time object or null if the
conversion fails.
Example
This example does the following:

     Creates a new XMLDate object containing today's date
     Converts the XMLDate object to an ISO time then displays the result

  print( "Creating XMLDate object..." );
  var d = new XMLDate( new Date() );
  print( "The value of the new XMLDate object is: " + d );
  print( "Converting the XMLDate to ISO format..." );
  var ISO = d.getISOTime();
  print( "The ISO time is: " + ISO );


1.2.5.3.7.11. JavaScript method:
XMLDate.getISOYear()

This method returns a string containing the year portion of date/time object in ISO format.
Syntax

  XMLDate.getISOYear();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a string containing the ISO year of a date/time object or null if the
conversion fails.
Example
This example does the following:

     Creates a new XMLDate object containing today's date
     Converts the XMLDate object to an ISO year then displays the result

  print( "Creating XMLDate object..." );
  var d = new XMLDate( new Date() );
  print( "The value of the new XMLDate object is: " + d );
  print( "Converting the XMLDate to ISO format..." );
  var ISO = d.getISOYear();
  print( "The ISO year is: " + ISO );


1.2.5.3.7.12. JavaScript method:
XMLDate.getSCDateTimeString()

This method returns an Service Manager-formatted date/time string.
Syntax

  XMLDate.getSCDateTimeString();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a Service Manager-formatted date/time string or null if the
conversion fails.
Example
This example does the following:

     Creates a new XMLDate object containing today's date
     Converts the XMLDate object to Service Manager-formatted date/time string then
     displays the result

  print( "Creating XMLDate object..." );
  var d = new XMLDate( new Date() );
  print( "The value of the new XMLDate object is: " + d );
  print( "Converting the XMLDate to a Service Manager date/time
  string..." );
  var sc = d.getSCDateTimeString();
  print( "The Service Manager date/time string is: " + sc );


1.2.5.3.7.13. JavaScript method: XMLDate.JSDate()

This method returns a JavaScript date/time object. This method is an alias of the getDate() method.
Syntax

  XMLDate.JSDate();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a JavaScript date/time object or null if the conversion fails.
Example
This example does the following:

     Creates a new XMLDate object containing today's date
     Converts the XMLDate object to a JavaScript date/time object then displays the result

  print( "Creating XMLDate object..." );
  var d = new XMLDate( new Date() );
  print( "The value of the new XMLDate object is: " + d );
  print( "Converting the XMLDate to a JavaScript object..." );
  var js = d.JSDate();
  print( "The JavaScript date/time object is: " + js );


1.2.5.3.7.14. JavaScript method:
XMLDate.toSCDuration()

This method converts an ISO 8601 duration string to an Service Manager duration string.
Syntax

XMLDate.toSCDuration( duration );

Arguments
The following arguments are valid for this function:

Argument  Data type                                   Required   Description
duration                                              Yes
          ISO 8601 duration                                      This argument contains
          string                                                 the ISO 8601 duration
                                                                 string or variable value
                                                                 you want the script to
                                                                 convert to a Service
                                                                 Manager duration
                                                                 string.

Return values
A string or null .
The method returns a Service Manager duration string or null if the conversion fails.
Example
This example does the following:

     Creates a new XMLDate object containing a hard-coded ISO date
     Converts the ISO date/time to a Service Manager duration string

print( "Creating XMLDate object..." );
var d = new XMLDate( "P01DT12H01M01S" );
print( "The value of the new XMLDate object is: " + d );
print( "Converting " + d.toString() + " to a SC duration..." );
var smDur = d.toSCDuration();
print( "The Service Manager duration is: " + smDur );


1.2.5.4. List: JavaScript functions

The following table lists some of the JavaScript functions available in Service Manager. These functions
provide a method of performing certain commands that will return a value when executed.

Refer to List: RAD functions for more information on using RAD functions to perform these commands
instead of JavaScript.

JavaScript function                     Description
add_graphnodes
                                        Returns XML to the Run-Time Environment (RTE)
checkAttachmentLegal                    for the expand action on a node in the graph
get_graph_action                        diagram.
get_graph_id
get_graph_node_id                       Checks if an attachment is legal.
get_graph_target
                                        Returns the activated action on a node in the
                                        graph diagram.

                                        Returns the value of the graph ID for the expand
                                        action on a node in the graph diagram.

                                        Returns the value of the node ID for the expand
                                        action on a node in the graph diagram.

                                        Returns the target for an activated action on a
                                        node in the graph diagram.


1.2.5.4.1. JavaScript function: add_graphnodes

This function returns an XML file to the Run-Time Environment (RTE) for the expand action on a node in the
graph diagram.
Function
add_graphnodes()
Example

  system.functions.add.graphnodes(String strXML)


1.2.5.4.2. JavaScript function:
checkAttachmentLegal

Description
A JavaScript function that checks if an attachment is legal before added.

The legal standard is same as the system attachment validation methods such as the attachment allowlist
and Tika.
See Support for allowing attachments with certain file extensions for more information.

Function

checkAttachmentLegal(attachmentobj);

Arguments
The following arguments are valid for this function:

Argument       Data type                    Required               Description
attachmentobj  Attachment                   Yes
                                                                   The attachment object
                                                                   to check

Return values
The return code indicates whether the attachment is legal or not.

     RC_SUCCESS, legal
     RC_ERROR, illegal

Example

var attachObj = new Attachment();
attachObj.type = "text/plain";
attachObj.name = "MyAttachment.doc";
attachObj.value = "text";

results = checkAttachmentLegal(attachObj);
print(results)

output:
-1


1.2.5.4.3. JavaScript function: get_graph_action

Description
A JavaScript function that returns the activated action on a node in the graph diagram.
Function
get_graph_action()
Example

  system.functions.get_graph_action()


1.2.5.4.4. JavaScript function: get_graph_id

Description
A JavaScript function that returns the value of the graph ID for the expand action on a node in the graph
diagram.
Function
get_graph_id.htm()
Example

  system.functions.get_graph_id.htm()


1.2.5.4.5. JavaScript function: get_graph_node_id

Description
A JavaScript function that returns the value of the node ID for the expand action on a node in the graph
diagram.
Function
get_graph_node_id()
Example

  system.functions.get_graph_node_id()


1.2.5.4.6. JavaScript function: get_graph_target

Description
A JavaScript function that returns the target for an activated action on a node in the graph diagram.
Function
get_graph_target
Example

  system.functions.get_graph_target()
````
