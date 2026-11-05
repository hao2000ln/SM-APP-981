---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.13.3 .. 1.13.3.4
printed_pages: 3115-3144
---

# 1.13.3 Calendar administration tasks

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.13.3. Calendar administration tasks

Before users can use the calendar, administrators must set up the following
configurations.

     Enable or disable the calendar

     Enable or disable the Service Manager calendar.

     Configure calendar settings

     Configure the settings of the calendar, such as the objects (for example, Change
     and Incident) that can be mapped with time periods, and the maximum number
     of records returned in each calendar object query or calendar time period query.

     Display records from an application module in the calendar

     Define a mapping record for the Time Period object, and for each object mapped
     with it. Each mapping record defines a field mapping between the object and
     Time Period, and determines how the calendar displays records of the object.

     Display an embedded calendar on an incident form, an interaction form, or a
     problem form

     Display an embedded calendar on an incident form, an interaction form, or a
     problem form.

     Configure search filters for the full calendar

     Configure a single filter mapping record for the full calendar and the embedded
     calendar.

     For the full calendar, specify some fields of the specified objects as filter fields
     so that users can create filtered views of the full calendar. For the embedded
     calendar, define filters for the specified objects so that the embedded calendar
     automatically displays different filtered views in different records.

     Localize a filter field

     Create localized versions of the field labels if the environment needs to support
     multiple languages.

     Test your calendar

     Test the calendar to see if it works properly.


1.13.3.1. Enable or disable the calendar

The Enable Calendar and Time Period Management checkbox enables or disables
Service Manager Calendar. By default, this checkbox is selected, which means
Service Manager Calendar is enabled. To disable Service Manager Calendar, follow
these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the General tab.
   3. Clear the Enable Calendar and Time Period Management checkbox.
   4. Click Save.

Related topics

Calendar Administration
Full calendar and embedded calendar
Calendar security area and role
Configure calendar settings
Display an embedded calendar on an incident form, an interaction form, or a problem
form
Display records from an application module in the calendar
Configure search filters for the full calendar
Localize a filter field
Test your calendar


1.13.3.2. Configure calendar settings

Administrators configure the calendar settings to define the overall look and feel of
Service Manager Calendar.
To configure the calendar settings, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Calendar
     Administration > Settings.

   2. Edit the fields as needed.
     The following table describes each field.


Field                                   Description       Default         Notes
Module
                                        The name of the   Calendar        This setting is
Area                                    module to which                   system
                                        this record                       generated and is
First Day of                            belongs                           not editable.
Week
                                        The security      Calendar        This setting is
                                        area to which     Administration  system
                                        this record                       generated and is
                                        belongs                           not editable.

                                        The first day of Sunday           This setting
                                        the week                          takes effect only
                                                                          on the calendar,
Max Records                             Determines the 50                 not on the date-
                                                                          picker.
Returned in                             maximum
                                                                          Must be a
                                                                          positive integer.

Calendar Object number of

Query                                   object records

                                        that a calendar

                                        query can

                                        return.

                                        This setting
                                        limits the
                                        number of
                                        object records
                                        (for example,
                                        Change and
                                        Incident
                                        records) that
                                        can be
                                        displayed in the
                                        calendar.


Field                                   Description        Default        Notes
Max Records                                                25             Must be a
Returned in                             Determines the                    positive integer.
Time Period                             maximum
Query                                   number of time                    Select a value
                                        period records                    from the list.
Time Range in                           that a calendar
Day View                                query can
                                        return.

                                        This setting
                                        limits the
                                        number of time
                                        period records
                                        that can be
                                        displayed in the
                                        calendar.

                                        Determines how     Every 6 hours
                                        the calendar
                                        daily view
                                        divides a day. By
                                        default, one day
                                        is divided into
                                        four sessions:

                                        • 00:00-06:00
                                        • 06:00-12:00
                                        • 12:00-18:00
                                        • 18:00-24:00


Field                                   Description      Default           Notes

Available objects                       The table names  cm3r,cm3t,        You can specify
for Calendar                            of the objects   incidents,probsu  any tables
Mapping                                 that can be      mmary,rootcaus    (objects).
                                        mapped with the  e
                                        Time Period                        This setting
                                        object.                            takes effect for
                                                                           both the full
                                        The names are                      calendar and the
                                        comma-                             embedded
                                        separated.                         calendar.

                                                                           Example Values:

                                                                           cm3r,
                                                                           probsummary,
                                                                           rootcause,
                                                                           incidents

   3. Save the record.

     Now, you have completed the global settings for the calendar. Next, you need to
     configure calendar mapping. See Display records from an application module in
     the calendar.

Related topics

Enable or disable the calendar
Display an embedded calendar on an incident/interaction/problem form
Display records from an application module in the calendar
Configure search filters for the full calendar
Localize a filter field
Test your calendar


1.13.3.3. Display records from an
application module in the calendar

The purpose of calendar mapping is to ensure that certain objects of Service
Manager (such as Incident, Changes, and Time Periods) are properly displayed in the
calendar. This feature also links the Time Period object with other objects in the
system. Before proceeding with this task, you, as a system administrator, should have
already specified the objects that you want to map with the Time Period object. See
Configure calendar settings.
Now, you need to create a mapping record for each of these objects, including the
Time Period object.

            Caution

           Create only one mapping record for each object; otherwise, a duplicate
           record error occurs.

The Calendar Mapping form is accessible from System Administration > Ongoing
Maintenance > Calendar Administration > Calendar Mappings. By default, there are
three mapping records for Time Period, Change, and Change Task, respectively.
The following table describes the sections of the calendar mapping form.

Section                                                                                         Service Manager 9.81
Header
Restricting Query Configuration         Description

Title Configuration                     Displays general information of the
                                        mapping record, such as the ID,
                                        associated object, active or inactive
                                        state, and description.

                                        This is a default query that allows only
                                        relevant records of the selected object
                                        to be displayed in the calendar.

                                        The query must use this format:
                                        field="value" , where field is the
                                        name of a field in the object table, and
                                        value can be a static value, a RAD
                                        expression (for example, affected.item
                                        in $L.file ), or a JavaScript call (for
                                        example, jscall("JS method"); ); or you
                                        can enter true for no restrictions.
                                        Example value:

                                          status="closed" and
                                          category="Application"

                                        Specifies which fields of the object to
                                        display in the Title area (record list
                                        area) of the calendar.

                                        All available fields of the selected
                                        object are displayed in the Available
                                        Fields box, and the fields that are used
                                        in the Title area are displayed in the
                                        Selected Fields box.

                                                    Note

                                                   This is a mandatory setting.

Section                                                                                         Service Manager 9.81
Tooltip Configuration
Color Preferences                       Description

Default Sort Preferences                Specifies which fields are displayed in
                                        the tooltip when you hover your mouse
                                        over a record (or a record bar) of the
                                        selected object in the calendar.

                                        All available fields of the selected
                                        object are displayed in the Available
                                        Fields box, and the fields that are used
                                        in the tooltip are displayed in the
                                        Selected Fields box.

                                        Specifies color settings for the selected
                                        object.

                                        To cover different requirements, you
                                        can enter a condition for each color.
                                        The conditions are evaluated in top-to-
                                        bottom order. As soon as one condition
                                        evaluates to true, the evaluation of the
                                        color preferences is stopped.

                                        If you specify no color preferences, a
                                        default color is used. In the Default
                                        Color field, you can configure a default
                                        color by using HTML color codes (for
                                        example, #000000 ).

                                        Specifies the default sort preferences
                                        for the Title area and calendar entry
                                        area in the calendar.

                                        If you specify no default sort
                                        preferences, records will be sorted by
                                        record ID in ascending order.

 Section                                                                                        Service Manager 9.81
 Time Period Field Mapping
                                        Description
This PDF was generated on May 23, 2026
                                        This section is available only for
                                        objects other than Time Period. It
                                        creates a link between Time Period and
                                        the object. The mapping is used for
                                        conflict detection and overlapping
                                        functionality in the calendar.

                                             Field for Start Date and Field for
                                             End Date (Mandatory): Specify
                                             which fields of the object are
                                             mapped with the Start Date and
                                             End Date of the Time Period
                                             object. The calendar displays
                                             records of the object as a record
                                             bar whose length is calculated
                                             based on the Start Date and End
                                             Date values.

                                             Time Period Mapping Query: This
                                             query defines which time period
                                             objects are used for detecting the
                                             conflict for the object. When a
                                             conflict is detected, the calendar
                                             displays a conflict icon for a
                                             record. It also displays a gray
                                             background bar ("overlap shadow
                                             bar") behind the record bar when
                                             the record either overlaps with,
                                             exceeds, or misses a freeze
                                             window or maintenance window
                                             (see the Conflict Icon Custom
                                             Messages row for more
                                             information). You can use $L.file
                                             as a reference to the current
                                             record.

                                             The following is a query example:

                                                                                                                          Page 74 of 220
Section                                                                                         Service Manager 9.81

                                        Description

                                              current.phase="published" and
                                             (affected.services=affected.item
                                             in $L.file or
                                             affected.services="all") and
                                             (location=location.full.name in
                                             $L.file or location="all")

                                             Query for Time Period Conflict
                                             Calculation: You can enter a query
                                             against the selected object to
                                             restrict the records for conflict
                                             calculation with Time Period.

                                             The following is aquery example :

                                              category in $L.file ~={"CI
                                             Group","Default","KM
                                             Document","Unplanned
                                             Change","Subscription"} and
                                             open in $L.file=true

Section                                                                                         Service Manager 9.81
Conflict Icon Custom Messages
                                        Description

                                        A conflict icon refers to a small red or
                                        yellow triangle icon that's displayed at
                                        the top left corner of an object record
                                        cell (see Full calendar and embedded
                                        calendar). The red triangle indicates
                                        the current record overlaps with one or
                                        more time periods of the Freeze Period
                                        type, while the yellow triangle indicates
                                        the record either exceeds or misses
                                        one or more time periods of the
                                        Maintenance Window type. When both
                                        types of conflicts occur, only the red
                                        triangle is displayed. The icon tooltip
                                        displays specific conflict information of
                                        the record.

                                        You can configure additional custom
                                        messages to be displayed as part of
                                        the tooltip of a conflict icon. For
                                        example, you can specify the following
                                        configuration so that the "This is an
                                        emergency change" message is
                                        displayed in the conflict icon tooltip for
                                        each Emergency Change record.

                                             Condition: emergency in
                                             $L.file=true
                                             Message:
                                              scmsg(1,"timeperiodCalendarMa
                                             pping")

Section                                                                                         Service Manager 9.81

                                        Description

                                                    Note

                                                   If a record has no conflicts
                                                   with any time periods but
                                                   has one or more custom
                                                   messages configured, a
                                                   blue triangle is displayed
                                                   instead of the red or yellow
                                                   one.

Example: Display Time Period, Change, and
Incident in the calendar

This example configuration assumes that you have specified the cm3r (Change) and
probsummary (Incident) objects for calendar mapping in the calendar global
settings. Now you need to configure a mapping record for each of the objects: Time
Period, Change, and Incident.

By default, there are two mapping records for Time Period and Change, respectively.
You may want to edit the existing mapping records to better suit your needs, and add
one new mapping record for Incident.

To display Time Period, Change, and Incident in the calendar, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Calendar
     Administration > Calendar Mappings.

   2. Click Search.

     A list of existing mapping records is displayed. Out-of-the-box, only the mapping
     records for Time Period, Change and Change task are displayed.

   3. Edit the CALMAP01 (for Time Period), the CALMAP02 (for Change), and the
     CALMAP03 (for Change Task) records as needed.

        1. In the Header section, edit the optional Description field and make sure the
           Active option is selected.

           Only active objects can be displayed in the calendar. Canceling this option
           will disallow records of the object to appear in the calendar.


2. In the Restricting Query Configuration section, enter a query. See the
  following table for examples.

Object                                  Restricting Query  Note
Time Period                             Configuration
                                        true               This query filters the
Change                                                     records to be
Change Task                             true               retrieved from the
                                                           timeperiodDefinition
                                        true               table.

                                                           This query filters the
                                                           records to be
                                                           retrieved from the
                                                           cm3r table.

                                                           This query filters the
                                                           records to be
                                                           retrieved from the
                                                           cm3t table.

3. In the Title Configuration section, enter a field separator or leave the field
  empty to use the default (a hyphen), and move the fields that you want to
  display in the Title area to the Selected Fields box. See the following table
  for examples.


Object                                  Selected Fields
Time Period
                                          ID
Change                                    Name

Change Task                               Change ID
                                          Title

                                          Incident ID
                                          Title

4. In the Tooltip Configuration section, move the fields that you want to
  display in the object's tooltip (hover-over text) to the Selected Fields box,
  and use the up/down arrow button to change the sort order of the fields.
  See the following table for examples.


Object                                  Selected Fields
Time Period
                                          ID
Change                                    Type
Change Task                               Category
                                          Scope
                                          Name
                                          Owner Group
                                          Services

                                          Change ID
                                          Title
                                          Description
                                          Service

                                          Status
                                          Priority
                                          Affected Services

5. In the Color Preferences section, click Add to add color preferences. See
  the following table for examples, where you specify three colors for three
  types of time periods, and one color for all change records.


Object                                  Color       Name           Condition
Time Period                             #FF0000
                                                    Freeze Period  (type in
                                                    (Red)          CurrentRecord
                                                                   = "nogo")

Time Period                             #018424     Maintenance    (type in
                                                    Window         CurrentRecord
                                                    (Green)        = "go")

Time Period                             #0197D6     Neutral Period (type in
                                                    Period (Blue) CurrentRecord

                                                                        = "neutral")

Change                                  #FFD800     Hardware       ( assign.dept
                                                    (Yellow)       in
                                                                   CurrentRecord
                                                                   = "Hardware")

Change Task #FFB11B                                 Hardware       ( assign.dept in
                                                    (Yellow)       CurrentRecord
                                                                   = "Hardware")

6. In the Default Sort Preferences section, select the fields by which you
  want to sort records of the object, and select Ascending or Descending
  order. See the following table for example.

Object                                  Sort Field            Sort Type
Time Period                             ID                    Ascending
Change                                  Change ID             Ascending
Change Task                             Task ID               Ascending

7. In the Time Period Field Mapping section, select the fields to map with the
  Start Date and End Date in the calendar, and specify a mapping query as
  necessary.


        Note

        The Time Period Field Mapping section is unavailable for Time
        Period objects.

See the following table for an example.

Object                                  Field for Field for  Time           Query for
Change                                  Start Date End Date  Period         Time
                                                             Mapping        Period
                                                             Query          Conflict
                                                                            Calculation

                                        Planned  Planned     current.ph     category
                                        Start    End         ase="publi     in $L.file
                                                             shed" and      ~={"CI
                                                             (affected.s    Group","De
                                                             ervices=aff    fault","KM
                                                             ected.item     Document",
                                                             in $L.file or  "Unplanne
                                                             affected.se    d
                                                             rvices="all"   Change","S
                                                             ) and          ubscription
                                                             (location=l    "} and
                                                             ocation.full.  open in
                                                             name in        $L.file=tru
                                                             $L.file or     e
                                                             location="a
                                                             ll")

8. Configure conflict icon custom messages for the Change mapping record.
  See the following table for examples.


Condition                               Message
emergency in $L.file=true
                                        scmsg(1,"timeperiodCalendarMa
foreign.id in $L.file~=NULL             pping")

                                        scmsg(2,"timeperiodCalendarMa
                                        pping") + foreign.id in $L.file

     9. Save the mapping records.

4. follow these steps to add a mapping record for Incident.

     1. Click System Administration > Ongoing Maintenance > Calendar
        Administration > Calendar Mappings.

     2. In the Object field, select Incident.
     3. In the Description field, enter a description of the mapping (optional).

     4. Click New, and then click Save.

        The record is added and automatically assigned with an ID.

     5. Select the Active checkbox.

Note

By default, each mapping record is created as Inactive. Only
active mappings take effect. Once a mapping is created, you
can update it but can no longer delete it. If a mapping is no
longer needed, disable it by clearing the Active checkbox.

6. In the Restricting Query Configuration section, enter a query. For
  example, use the default value: true .

7. In the Title Configuration section, enter a field separator or leave the field
  empty to use the default (a hyphen) , and move the fields that you want to
  display in the Title area to the Selected Fields box. See the following table
  for an example.


Object                                  Selected Fields
Incident
                                          Incident ID
                                          Title

8. In the Tooltip Configuration section, move the fields that you want to
  display in the object's tooltip (hover-over text) to the Selected Fields box,
  and use the up/down arrow to change the sort order of the fields. See the
  following table for an example.

Object                                  Selected Fields
Incident
                                          Status

                                        Priority

                                        Affected Services

9. In the Color Preferences section, configure a default color for the Incident
  object, and if needed add more color preferences.

  To configure a default color, in the Default Color field, enter an HTML color
  code (for example, FF8000 ).

  To add more color preferences, click Add, select a color from the color
  palette, enter a name for the selected color, if needed click Edit to enter a
  condition (RAD Expression) using the Condition Editor, and then click OK.

  See the following table for an example, where you specify one color for
  incident records that are in Closed status, which implies that incident
  records in any other status will display in the default color.


Object                                  Color              Name        Condition
Incident                                #01DF01
                                                           Closed      ( Expression:
                                                           Incidents   problem.status
                                                           (Green)     in $L.file =
                                                                       "Closed")

10. In the Default Sort Preferences section, select the fields by which you
    want to sort records of the object, and select the Ascending or
    Descending order. See the following table for an example.

Object                                        Sort field              Sort type
Incident                                      Incident ID             Ascending

11. In the Time Period Field Mapping section, select the fields to map with the
    Start Date and End Date of the Time Period object, and if needed specify a
    mapping query for conflict detection. See the following table for an
    example.

Object                                  Field for Start Field for End  Time Period
Incident                                                               Mapping
                                        Date               Date        Query

                                        Outage Start Outage End        true

       12. In the Conflict Icon Custom Messages section, configure messages and
           their conditions for conflict icon tooltip display.

       13. Save the mapping record.

   5. Similarly, add a mapping record for other objects (Problem, Interaction, and so
     on) as necessary.

Related topics

Calendar Administration
Full calendar and embedded calendar
Calendar security area and role
Enable or disable the calendar
Configure calendar settings


Display an embedded calendar on an incident/interaction/problem form
Configure search filters for the full calendar
Localize a filter field
Test your calendar


1.13.3.4. Display an embedded calendar
on an incident/interaction/problem form

Caution: Calendar consumes a certain amount of system resources (memory and
CPU). Therefore, if you plan to embed the calendar in forms that are heavily used in
your organization’s daily operation (such as incident or interaction forms), and if your
server already runs at high capacity, we recommend that you analyze and understand
the impact before deployment.

The default embedded calendar is accessible from the calendar section in a Change
or a Change Task record only. To display an embedded calendar on an incident form,
an interaction form, or a problem form, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Calendar
     Administration > Calendar Filter Mappings to open the Calendar Filter
     Mapping form.

   2. Go to the Embedded Calendar Configuration section, and add predefined filters
     for the embedded calendar. You may want to add one or more filters for each
     object. The default embedded calendar is available only for the Change object
     and the Change task object.

        1. Click Add Configuration.

        2. Complete the fields and select the options as described in the following
           table.

Field/Option                                                                        Service Manager 9.81
Active
                                        Description
Object
Default View                            Indicates if the configuration is
                                        active. Only active configurations
                                        take effect. By default, this option
                                        is selected when a new
                                        configuration is added.

                                                    Caution

                                                   If one or more
                                                   configuration records
                                                   of the same module is
                                                   active, the embedded
                                                   calendar is visible in
                                                   the current record.
                                                   Otherwise, it will be
                                                   invisible in the current
                                                   record.

                                        Select an object to filter against.
                                        Example: Change

                                        Select one value from the list:
                                        Day, Week, or Month.
                                        This field determines the default
                                        display view of the embedded
                                        calendar. If you leave it empty, the
                                        embedded calendar is displayed
                                        in the Week view.

             Field/Option                                                           Service Manager 9.81
             Field for Initial Date
                                        Description
This PDF was generated on May 23, 2026
                                        Select a date/time field from the
                                        list.

                                        Initially, the embedded calendar
                                        displays data based on the day or
                                        week of this field's value in the
                                        current record. For example, if
                                        you select Scheduled
                                        Implementation Start for the
                                        Change module, when users view
                                        the embedded calendar from a
                                        Change record whose Scheduled
                                        Implementation Start date is 22
                                        May 2013, the embedded
                                        calendar will initially display data
                                        for the day or week of 22 May
                                        2013 (the Default View value
                                        determines whether a daily or
                                        weekly view is initially displayed).

                                        This issue also occurs when users
                                        view the embedded calendar from
                                        another record, such as an
                                        Incident record.

                                                    Note

                                                   If you leave the Field
                                                   for Initial Date field
                                                   empty or if the
                                                   specified field of the
                                                   current record has an
                                                   empty value, the
                                                   embedded calendar
                                                   uses the user's
                                                   current date.

                                                                                                             Page 89 of 220
Field/Option                                                                        Service Manager 9.81
Filter Query
                                        Description

                                        Type a query that filters Time
                                        Period records and records of the
                                        selected objects in the Calendar
                                        Entries field. Pay attention to the
                                        following:

                                             The query field should be
                                             one of the filter fields
                                             defined in the Filter Fields
                                             Configuration.

                                             Use "=" as the operator
                                             between the field and the
                                             value, and don't miss the
                                             space before and after the
                                             "=" operator.

                                             You can use $L.file in the
                                             value as a reference to the
                                             current record.

                                             The query supports "or"
                                             inside a field group and
                                             "and" between groups and
                                             single fields. Use lower case
                                             for the " and " and " or "
                                             operators.

                                             If you are using an RAD
                                             expression, you must insert
                                             a space or a semicolon (;) at
                                             the end of the expression.

Field/Option                                                                        Service Manager 9.81
Condition
                                        Description

                                                    Tip

                                                   Click the Analyze
                                                   button to see the
                                                   logical structure of
                                                   the query. This helps
                                                   you make sure the
                                                   query is exactly what
                                                   you want. The
                                                   analysis result is
                                                   displayed in the
                                                   Analysis Result box.

                                        Example:

                                        assign.group = assignment in
                                        $L.file and (service =
                                        affected.item in $L.file or service
                                        = "all") and (location =
                                        location.full.name in $L.file or
                                        location = "all")

                                        The condition under which the
                                        filter query is executed.

                                        Example:

                                        Always (default)


Field/Option                            Description
Calendar Entries
                                        Select the objects that you want
                                        to display in the embedded
                                        calendar.

                                        Only objects that have an active
                                        Calendar Mapping record defined
                                        (in System Administration >
                                        Ongoing Maintenance > Calendar
                                        Administration > Calendar Filter
                                        Mappings) are displayed and
                                        available for your selection.

3. Click Save.

               Tip

             Immediately after you add a filter field and click Save, an Add
             button appears in the field form, allowing you to quickly add
             another new field.

4. Add more filters as needed.
  The records you added appear in the list.

               Tip

             To delete an existing filter record from the list, click the record
             to open it, and then click Delete.

   3. Save the calendar filter mapping.

Related topics

Enable or disable the calendar
Configure calendar settings
Display records from an application module in the calendar
Configure search filters for the full calendar


Localize a filter field
Test your calendar
````
