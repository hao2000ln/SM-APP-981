---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.4.2 .. 1.1.4.2
printed_pages: 565-596
---

# 1.1.4.2 Link maintenance

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.4.2. Link maintenance

One of the advantages of a relational database is the elimination of redundant
information. You accomplish this by storing information about a particular subject in
one place or file that has links to other subjects. Links are a combination of data and
link definitions, sets of conditions containing the relationships for linked information.
Use links in Incident Management and Configuration Management environments to
relate information in one file to information in another.

Related topics

Data relationships and the link file
Us.link
Variables used in links
Access the link record


1.1.4.2.1. Data relationships and the link
file

Link maintenance involves establishing relationships between data so that information
residing in one file can form the link query that selects, displays, or copies information
from another file.

A separate link definition can occur for each form.

When a field is linked to more than one table, the order in which the entries appear in
the link record determines the order in which Service Manager searches them. First,
Service Manager searches the table at the top of the list. If no records are found to
satisfy the link query, it searches the tables lower in the list, from top to bottom. It
stops searching when the query is satisfied, or it finishes searching all tables in the
list.

Related topics

Link maintenance
Us.link
Access the link record


1.1.4.2.2. Types of links

Find, Fill, and virtual join links are the basis for the most powerful features of Service
Manager.

     The Find function uses the value of the field in which the cursor is placed to
     query for information based on data stored in existing records. Security
     parameters restrict a user’s access to the requested data. If information is found,
     a record list of matching configuration item (CI) records opens. If no information
     is found, a negative message opens.
     The Fill function selects information from existing records and copies it into the
     current record. For example, incident documents are populated with device
     information when a logical name (logical.name) is specified.
     The virtual join combines information from many files and presents the results
     on a single form. At the service desk, a vendor’s telephone number can display
     in an incident document without occupying any space in the actual record. The
     information presented doesn't reside in long-term memory and is another way of
     viewing Configuration Management data.

Linking ensures current and consistent data across all incident documents. A change
to the original configuration item (CI) record automatically updates the incident
document. Each time an incident document opens or updates, the applicable fields
displaying linked data pick up the most recent Configuration Management data.

Important: Queries for Find, Fill and virtual joins are performed only when run on
fields that have been set up as unique keys in the database dictionary record for the
target files. These unique key definitions allow data to be stored using certain
markers. Link queries need to locate these markers in order to retrieve the applicable
data.

Search the Help for more information on setting up unique keys and other definitions
in the database dictionary record.

Related topics

Link maintenance
Find functionality
Fill functionality
Virtual joining functionality
Us.link
Variables used in links


Calling us.link
Find from and Fill to a $ variable


1.1.4.2.3. Find functionality

Using the information in the link record, Find (us.link) locates and displays information
in another record (or records) based on the contents of the current record.

In an Incident Management example, the source record could contain pc in the field
labeled Affected CI (logical.name field). The link record relates the logical.name field
in the SOURCE record to the logical.name field in the vendor (TARGET) file.

All device records containing logical.name fields beginning with pc are selected and
displayed in a record list for the user to select.

The user selects the specific device sought and opens the applicable device record.

Find uses the field name of the text box where the cursor currently is, in order to
determine what relationship to establish. To select the device records with names that
begin with pc, the cursor must be in the CI Name field that contains pc.

It builds the following query:
logical.name field in device file begins with "pc"

That translates into the following link query that executes against the vendor file:
device#"pc"

Note: Using advanced features in Link Maintenance, you can apply rules to use a
more complex link query for data selection. Refer to Using Advanced Link Editing
Features Help for more information.

The Find option is available throughout the system. It is subject to security restrictions
within the application. For example, Database Manager controls the Find option
through the use of Format Control. In Incident Management, the profile determines
whether Find is available for the current user and how it behaves.

The selected data records can be manipulated in accordance with security
restrictions. Changes made to these records DO NOT modify the source record unless
the user selects from an available list of options that allow updated information to be
posted to the specific configuration item record. For more information on posting,
refer to Format Control and Display Options Help.

Related topics

Link maintenance
Types of links
Fill functionality


Virtual joining functionality
Us.link
Variables used in links
Calling us.link
Find from and Fill to a $ variable


1.1.4.2.4. Fill functionality

Using information in the link file, Fill (us.link) locates information in another record and
copies it into the current record.

Fill does the following:

     Starts on a source record.
     Accesses a record in a secondary (target) file based on data in the source
     record (usually the contents of the input field selected by the cursor).
     Copies (fills) data from that target record back to the source record.

The link record for the probsummary file is used in Incident Management.

In the following example, Fill populates fields in an incident document based on the
value of the field labeled CI Name.

Rather than selecting the device record for display, fields in the device (TARGET) file
that have the same name as the fields in the problem (SOURCE) file project into the
source record.

Fields on the source form populate automatically with data directly from the
applicable device record. For example, CI Name (logical.name) on the incident record
fills with the value of Configuration Item (logical.name) from the device record. The
Type field on the incident form fills with the value of Type from the device record, and
the value for the Category field copies from the device record to the incident record.

Through this transfer, the TARGET record is unchanged but the SOURCE record
modifies to reflect the values of fields in the TARGET record.

The resulting modified SOURCE record is not written to the database until some
action instructs the system to do so. For example, open or update the incident.

The Fill option uses the value in the field where the cursor is positioned to determine
which link relationship to use. This example assumes that the cursor is in the CI Name
(logical.name) input field when you select the Fill option.

Use Fill when it is necessary to store information in the source record so that it can be
changed or used as a link to other information. If you simply need to display the
information in a form, use Virtual Join.

Related topics

Link maintenance
Types of links


Find functionality
Virtual joining functionality
Us.link
Variables used in links
Calling us.link
Find from and Fill to a $ variable
Find from and Fill to an array structure


1.1.4.2.5. Fill functionality with multi-
select

The Fill Selected option is available from record lists resulting from a fill on an array
field. When one or more records from a list are selected, the user can choose the Fill
Selected option to fill the array with only the selected records.

     A multi-select fill will not overwrite the existing content of an array. The records
     selected will be inserted into the array from the element where the fill was
     initiated.
     The multi-select capability for a record list is determined by the field that the fill
     is being performed from.

           If the field is a scalar the capability is disabled.
           If the field is an array the capability is enabled.
     The multi-select functionality is disabled in system-generated record lists. The
     System Administrator needs to create a form with a table for the capability to be
     available.
     When a Fill All or Fill Selected is performed, a message indicating how many
     records were filled displays in the message area.
     The post expressions defined in a link line are executed as each record is filled
     into an array when performing a Fill All or Fill Selected.

Related topics

Fill functionality
Turn off multi-select functionality
Link maintenance
Types of links
Find functionality
Us.link
Variables used in links
Find from and Fill to a $ variable
Find from and Fill to an array structure


1.1.4.2.6. Turn off multi-select
functionality

The Fill Selected option is available by default whenever a fill is performed on an array
field. System Administrators can disable this option by setting the variable $fill.mult
to false in the expressions of the link line for the field where the fill is being
performed.

Note: The Multiple Selection property in Forms Designer has no effect on enabling or
disabling the multi-select capability when performing a fill from an array field.

Related topics

Fill functionality
Fill functionality with multi-select
Link maintenance
Types of links
Find functionality
Us.link
Variables used in links
Find from and Fill to a $ variable
Find from and Fill to an array structure


1.1.4.2.7. Virtual joining functionality

The Virtual Join function allows a single form to display information from many files.
You can't modify virtually joined information but it can link with other files using Find
and Fill.

There are special requirements for virtual joins when specifying link information:

     The TARGET Format/File Name value in the link record must contain a file name
     not a form name.
     The target field must be a non-concatenated key in the target file.
     The target field must be the first instance of the key in the database dictionary’s
     key array.
     The target field must be a scalar field (non-array).
     Virtual Join only executes simple links.

While the appearance of virtually joined information is the same as if it exists in the
open record, the information is stored in one place and displayed on demand to
another.

Note: Use virtual join in any form except record list forms. Use virtual join information
as a source field to other information using Find or Fill. Nested virtual joins aren't
supported.

Related topics

Link maintenance
Types of links
Find functionality
Fill functionality
Us.link
Variables used in links
Calling us.link
Find from and Fill to a $ variable
Find from and Fill to a $ variable


1.1.4.2.8. Us.link

This section describes the Universal Services- Link (us.link) application.

The us.link application replaces the old applications find, fill and fill.recurse for
several reasons:

     To take advantage of the current Service Manager environment in order to
     speed up transactions.
     To have a common rule base behind each of these applications.
     To make the find/fill process easier to debug.

The us.link is responsible for selecting the correct records from the correct file and
then passing control to either us.find or us.fill.

The find, fill, and fill.recurse applications are now single panels calling the us.link
routine. No changes are necessary to existing code that calls one of these routines.

Related topics

Link maintenance
Types of links
Find functionality
Fill functionality
Virtual joining functionality
Variables used in links
Calling us.link
Find from and Fill to a $ variable


1.1.4.2.9. Variables used in links

The variables used in links are listed below. The application "us.link" is in charge of
executing the link expressions using the values set in those variables. If values for the
logical variables aren't specified, they default to false. Unless noted, the special
variables used by prior applications are also used by us.link.

Variable                                Value                                  Service Manager 9.81
$fill.date.calendar                     true or false
                                                       Use
$fill.display.add                       true or false
                                                       Enables a pop-up
$fill.display                           true or false  calendar window, and is
                                                       used for date/time fields.
$fill.exact                             true or false
$find.skip                              true or false  Note: $fill.date.calendar
                                                       is no longer needed
                                                       when using 6.2 or later
                                                       clients, which allow you
                                                       to define a date/time
                                                       field on a form as a
                                                       "calendar"-type widget.

                                                       Determines whether you
                                                       can add a record if the
                                                       current link query
                                                       returns no records.

                                                       Determines whether the
                                                       record you are filling
                                                       from opens before you
                                                       copy data from it into
                                                       your source record.

                                                       Forces the project panel
                                                       to adhere strictly to data
                                                       types and index levels
                                                       during the project.

                                                       Tells the application to
                                                       skip the current entry
                                                       whenever a "find" is
                                                       performed on the field.


Variable                                Value                     Use
$fill.list
                                        An array list of values.  Enables you to fill from
$fill.recurse.msg                       For example: $fill.list=  an array list of values.
$fill.option.copy                       {"a", "b", "c"}           Target file and field
$fill.option.skip                                                 names aren't required
$fill.recurse                                                     when using this option.
                                                                  For example, $fill.list=
                                                                  {"a","b","c"} will execute
                                                                  a pop-up window where
                                                                  the user can select one
                                                                  of the array values, a, b,
                                                                  or c.

                                        A message. For example:   Defines the message to
                                        $fill.recurse.msg="Hello  appear on a recursive
                                        world"                    link (when
                                                                  $fill.recurse=true).

                                        true or false             This option is no longer
                                                                  necessary when using
                                                                  us.link.

                                        true or false             Enables the skip option
                                                                  to skip the current link
                                                                  entry and move on when
                                                                  displaying the results of
                                                                  a recursive fill.

                                        true or false             Determines whether to
                                                                  move to the next entry in
                                                                  the link record (perform
                                                                  a recursive fill).


Variable                                Value                     Use
$fill.replace
                                        true or false             Governs whether a field
$fill.search.format                                               that contains data should
                                                                  be overwritten with new
$fill.skip                                                        data (including NULL).
                                                                  Only used for the project
                                                                  portion of a fill, not fields
                                                                  specified on the fill to/fill
                                                                  from section of the link
                                                                  line.

                                        Form to use when          Defines the search
                                        performing a fill. For    screen to use when
                                        example:                  performing a fill. If this
                                        $fill.search.format="com  variable is set in the link
                                        pany"                     expression, and the field
                                                                  that you are filling is
                                                                  NULL, the indicated
                                                                  search screen opens.
                                                                  The search created here
                                                                  continues the standard
                                                                  fill process.

                                        true or false             Tells the application to
                                                                  skip the current entry
                                                                  and continue based
                                                                  upon the value of
                                                                  $fill.recurse for that
                                                                  entry.


Variable                                Value                      Use
$fill.structure
                                        Specific link. For         Enables you to perform a
                                        example: $fill.structure=  find from a field that's
                                        {1,"rad"}                  part of a structured array
                                                                   and to use fill to move
                                                                   information into that
                                                                   specific element of the
                                                                   structured array when:

                                                                   - The field name to fill
                                                                   from/post to is part of
                                                                   the structured array.
                                                                   - The field name to fill
                                                                   from/post to is not used
                                                                   in any other structure of
                                                                   the database dictionary
                                                                   record.
                                                                   - The name of the
                                                                   structure must be the
                                                                   same as the name of the
                                                                   array of which it is a
                                                                   part.

                                                                   To use find/fill on a
                                                                   structured array, you
                                                                   must set up the variable
                                                                   $fill.structure in the
                                                                   expressions of the
                                                                   specific link line.
                                                                   $fill.structure is an array
                                                                   of two elements. The
                                                                   first is the index of the
                                                                   field (that's used as the
                                                                   source field) in the
                                                                   structure and is of type
                                                                   number. The second is
                                                                   the name of the structure
                                                                   and is of type character.

Variable        Value                                             Service Manager 9.81

$project.first  true or false             Use
                                          When using the fill
$fill.mult      true or false             function on a structured
                                          array, you can only
Related topics                            modify the specific line
                                          of the structure being
Link maintenance                          accessed. Instead of the
Types of links                            actual field name, use
Find functionality                        the index number of the
Fill functionality                        field within the structure.
Virtual joining functionality             This includes the source
Us.link                                   field.
Calling us.link
Find from and Fill to a $ variable        Governs whether a
Find from and Fill to an array structure  project should be done
                                          before moving any of the
This PDF was generated on May 23, 2026    fields defined in the list
                                          of fill to/fill from fields.
                                          Determines whether or
                                          not you can fill
                                          information from multiple
                                          records. True enables fill
                                          information from multiple
                                          records. The default
                                          value is true.

                                                                                        Page 29 of 168

1.1.4.2.10. Calling the us.link

Use the following parameters to call the us.link application:

            Note

           Fill and fill.recurse use different parameter names for the same fields.


Parameter Name                          Description            Default
record
name                                    Source Record (required) None

string1                                 Field name to find     Current field
second.record                           from/link to
prompt
boolean1                                Format Name            Current format
all.null
                                        Link Record (optional) None
index
                                        Action (“find” or “fill”) “find”

                                        Background flag        False

                                        Exit when closing the  None

                                        current thread

                                        Cursor line            None

Parameter Name                          Description                              Service Manager 9.81
cond.input                              Skip Exact Find
                                                         Default
                                                         False


Parameter Name                          Description                  Default

                                                    Note

                                                   This
                                                   parameter is
                                                   used only for
                                                   reference
                                                   fields (that is,
                                                   fields that
                                                   have a
                                                   referenced
                                                   table defined
                                                   in the data
                                                   policy). By
                                                   default, the
                                                   Find function
                                                   of a
                                                   reference
                                                   field
                                                   performs an
                                                   exact match
                                                   search
                                                   instead of
                                                   using the
                                                   query
                                                   defined in
                                                   the link
                                                   record. If you
                                                   want to use
                                                   the query
                                                   defined in
                                                   the link
                                                   record for a
                                                   reference
                                                   field, pass
                                                   this
                                                   parameter as
                                                   true when
                                                   calling the
                                                   us.link
                                                   application.

Parameter Name                          Description                          Service Manager 9.81

                                                     Default

            Note

           The only required parameter for us.link is the source record.

Related topics

Link maintenance
Types of links
Find functionality
Fill functionality
Virtual joining functionality
Us.link
Variables used in links
Find from and Fill to a $ variable
Find from and Fill to an array structure


1.1.4.2.11. Skipping query writing

Service Manager performs the Fill action based on the query defined in the link line to
filter data against the target table. Prior to Service Manager 9.41, you usually defined
the query by ID.

As of Service Manager 9.41, a Skip Query Rewriting option is available on the Edit
Link Line form. This option is added as part of the logical name solution, which adds
the display.name field to the device table to store CI names.

            Note

           For more information about the logical name solution, see the Service
           Manager Logical Name Solution white paper.

Because CI names are now stored in the display.name field instead of the
logical.name field, Service Manager by default automatically rewrites your existing
link queries at runtime to address the impact of the logical name solution (the Skip
Query Rewriting option is disabled by default). If the Skip Query Rewriting option is
enabled, the system doesn't perform the additional operations that it does when the
option is disabled.

To access this option, open a link record in Database Manager, highlight a link line,
and then select the Select Line option from the More menu. By default, this option is
disabled.

Guidelines on editing link queries for a reference field

When writing a link query for a reference field, you need to observe different
guidelines depending on whether this option is enabled or disabled.

            Note

           The following descriptions use affected.item as an example reference
           field.

     If the Skip Query Rewriting option is disabled, update an expression such as
      logical.name#affected.item in $File to the following:
      logical.name#\""+affected.item in $File+"\""


     If the Skip Query Rewriting option is enabled, you must write a query like the
     following:

      if (not (null(get.display.value($File, "affected.item")))) then $query+=(" and
     display.name#\""+get.display.value($File, "affected.item")+"\"")

Additionally, as a system administrator, you need to understand how the Fill function
works for a reference field:

     The affected.item in $File expression will be null when the user types
     something in the format, and the system gets what the user has typed by the
     get.display.value function.
     If the Skip Query Rewriting option is disabled, the system assigns what the user
     has typed to affected.item in $File when the user clicks the Fill button, and
     then rewrites at runtime the evaluated $query from, for example,
      logical.name# DISPLAY VALUE to display.name# DISPLAY VALUE . This makes
     the original link query still work for the reference field.

Related topics

Link maintenance
Types of links
Find functionality
Fill functionality
Virtual joining functionality
Us.link
Variables used in links
Find from and Fill to a $ variable
Find from and Fill to an array structure


1.1.4.2.12. Accessing $File/dates

$File is used in Fill and Find link line queries. You can modify the $File directly using
the link expressions and the changes are automatically saved in the source record.
When performing a fill on a date field, the system first checks to see if that date field
is in the link record. If the date field is in the link record, the link expressions perform
rather than just fill the current date and time. This way it is possible to fill with
something other than tod() (such as date(tod()) or tod() + ‘7 00:00:00’).

Related topics

Link maintenance
Types of links
Find functionality
Fill functionality
Virtual joining functionality
Us.link
Variables used in links
Calling us.link
Find from and Fill to a $ variable


1.1.4.2.13. Find from and fill to a $ variable

The us.link application makes it possible to perform a find from a field that has a $
variable as an input and to use fill to move information into a $ variable field. To use a
variable as a source field, place the variable name in the Source Field column of a link
record. To fill to a specific variable, place that variable on the source field(fill to/post
from) column on the specific link line.

Note: Use $file in virtual join link line queries and $File in fill and find link line queries.

Posting doesn't allow use of $ variables at this time.

Related topics

Link maintenance
Types of links
Find functionality
Fill functionality
Virtual joining functionality
Us.link
Variables used in links
Calling us.link
Find from and Fill to an array structure


1.1.4.2.14. Find from and fill to an array
structure

The us.link application makes it possible to perform a find from a field that's part of an
array structure and to use fill to move information into that specific element of the
array structure. This can only be performed under the following circumstances:

   1. The field name to fill from/post to is part of the array structure.
   2. The field name to fill from/post to is not used in any other structure of the

     database dictionary record.
   3. The name of the structure must be the same as the name of the array of which it

     is a part.

To use find/fill on an array structure, you must set up the variable $fill.structure in the
expressions of the specific link line. $fill.structure is an array of two elements. The
first is the index of the field (that's used as the source field) in the structure and is of
type number. The second is the name of the structure and is of type character.

When using the fill function on an array structure, you can only modify the specific
line of the structure being accessed. Instead of the actual field name, use the index
number of the field within the structure. This includes the source field.

Related topics

Link maintenance
Types of links
Find functionality
Fill functionality
Virtual joining functionality
Us.link
Variables used in links
Calling us.link
Find from and Fill to a $ variable


1.1.4.2.15. The $fill.display and
$fill.display.add functionality

When using $fill.display, you can modify the data using the standard rules that apply
to that database using Format Control.

     Click OK to save the record and use the new version of the record to perform
     the Fill function, based on the associated link line.
     Click Cancel to cancel any updates. It will not fill information back into the
     source record.

When $fill.display.add is set to true and the us.link performs the standard link query
and returns no records, the form defined in the link line opens and the user can add a
record. Any information defined in the Fill to or Fill from fields copies into this record.

     Click Add to add the record while leaving the user on this form. At this point the
     rules for $fill.display are followed.
     Click OK to add the record and perform the Fill function back to the source
     record using the newly-added record.

Related topics

Link maintenance
Types of links
Find functionality
Fill functionality
Virtual joining functionality
Us.link
Variables used in links
Calling us.link
Find from and Fill to a $ variable


1.1.4.2.16. Access the link record

Applies to User roles: System Administrator

This examples uses the problem table.

Consider the case where there is a record against a user's pc. The incident record
requires information regarding the serial number, location of the pc, and its
vendor/supplier, as well as a description of the incident.

The required information for documenting an incident is often already in the database.
To find and display the information with the incident document, you must tell the
system:

     What value to use as a search argument
     Where to look for the matching information

At least two separate records store the required information for the incident
document. Therefore, you must define at least two relationships in the link record: one
to device, one to vendor/supplier, and one to any other applicable table.

The system stores this information about each configuration item in Configuration
Management and references it according to several categories of information. The
device record contains the logical name, contact, and location names. The
vendor/supplier record contains the vendor/supplier ID, location, and vendor/supplier
phone number.

There is an implied order within each link that defines these relationships. The device
record contains the name of the vendor/supplier but not the phone number of the
vendor/supplier, and the location record stores the contact name instead of the
device record.

By defining the first relationship between the incident document and the device
record, you can retrieve the data necessary to form the queries that retrieve data
through the second and third relationships.

The link record defines the relationship between the incident document and
information in the device, vendor/supplier, and other records. Although you can have
different link records for each form in Incident Management, the problem and
probsummary records always exist. These records provide a basis and example for
other Incident Management link records.

Note: If you are using IR Expert, consider building links from one of the IR fields (like
action) to itself. This allows a simple Find command to locate relevant incidents before


a record opens.

   1. Click Tailoring > Tailoring Tools > Links.
   2. In the Name field, type problem, and then click Search.
   3. Select a record from the list.

The column labeled Source Field Name contains the names of fields in the current
record (in this case problem ). The columns under the Target File Name contain the
file names and corresponding field names that define the relationship. When the link
runs, the contents of the source name in the problem record search the target table
for other information to populate the form.

The configuration items link to the incident document by the field labeled CI Name
( logical.name ) field. The first link to the device record retrieves the serial number
and location names. Subsequent links use that information to form their own
relationships.

A link to the vendor/supplier record from the field labeled Service Provider (on any
linked Incident Management form) provides the vendor/supplier phone number for the
incident document.

Configuration Management data stored on Configuration Items (CIs), vendor, and
other records can link to several forms in Incident Management in the same way
multiple relationships for the same field exist. The link record specifies these link
relationships. Links between data and forms are established in the order in which they
appear in the list. A query for a specific field can link to more than one configuration
item record in the process of searching for the necessary data.

Related topics

Link maintenance
Data relationships and the link file
Us.link
Forms Designer
Subform control
````
