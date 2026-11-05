---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.13.3.5 .. 1.13.4
printed_pages: 3144-3179
---

# 1.13.3.5 Configure search filters for the full calendar

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.13.3.5. Configure search filters for the
full calendar

The Calendar Filter Mapping feature enables users to manage filtered views of
Service Manager Calendar, so that Service Manager Calendar displays only
information of their interest.

Before users can do so, you, as an administrator, should configure filter mapping
through the Calendar Filter Mapping form. This form is accessible from System
Administration > Ongoing Maintenance > Calendar Administration > Calendar Filter
Mappings. The following table describes the sections of this form.

Section                                                                                         Service Manager 9.81
Header
                                        Description
Filter Fields Configuration
                                        This section includes a description and
                                        data modification information of the
                                        filter mapping record.

                                        This section specifies the fields for the
                                        filter form in the calendar, and maps
                                        the fields in the filter form to a real field
                                        in the database.

                                        A list of specified fields appear on the
                                        Add Filter Field window, which is
                                        accessible from the filter area of the
                                        calendar. The following figure is an
                                        example of the Add Filter Field window.

Embedded Calendar Configuration         Each panel represents an object. Fields
                                        that appear on the Common panel are
                                        those configured for all available
                                        objects.

                                        This section specifies the filters for
                                        displaying the correct records in the
                                        embedded calendar when the calendar
                                        is displayed initially.

                                        The predefined filters are executed as
                                        soon as you launch the embedded
                                        calendar. With this filter setting, you
                                        can configure a query to display other
                                        related records in the calendar.


Example: Configure search filters for the full
calendar

Before proceeding with this configuration task, make sure that you have already
completed the following tasks:

     Configure calendar settings
     Display records from an application module in the calendar

This example assumes that you have already configured a calendar mapping record
for Time Period and Change. In this example, you will define filter fields and field
mappings for each object so as to filter which related records are displayed on the full
calendar.

   1. Click System Administration > Ongoing Maintenance > Calendar
     Administration > Calendar Filter Mappings to open the Calendar Filter
     Mapping form.

   2. In the Header section, type a description in the Description field (optional).
   3. In the Filter Fields Configuration section, add filter fields and field mappings.

        1. Click Add Filter Fields to open the Calendar Filter Field form. By default,
           the Active option is selected.

                         Note

                      Only active filter fields are used for filtering.

        2. Complete the fields on this form.

             Field                                                                  Service Manager 9.81
             Field ID
             Label                      Description
             Panel
                                        Type a unique identification name
             Sequence                   for the field. This internal ID is
                                        used for filter mapping in the next
This PDF was generated on May 23, 2026  step.
                                        Example: Change ID .

                                        Type a display name for the field
                                        ID. This field is mandatory.
                                        Example: Change ID .

                                        Select a panel from the list. This is
                                        the name of a tab of the Add
                                        Filter Fields window, which is
                                        displayed when you click the Add
                                        Filter Fields button. The list
                                        includes the following panels:

                                             Time Period
                                             Common
                                             Objects specified in the
                                             Available Objects for
                                             Calendar Mapping field
                                             (Calendar Administration >
                                             Calendar Settings).
                                        Example: Change .

                                        This is the order in which the field
                                        is displayed in the Add Filter
                                        Fields window.
                                        Example: 1 .

                                                                                                             Page 97 of 220
             Field                                                                  Service Manager 9.81
             Field Type
                                        Description
This PDF was generated on May 23, 2026
                                        Select a field type to define the
                                        layout of the values of the field on
                                        the filter form. The following
                                        types are supported:

                                             Text: Allows you to enter a
                                             text string as a value for the
                                             field.

                                             Box Selector: Allows you to
                                             select a value for the field
                                             using a list of checkboxes.

                                                           Note

                                                        We recommend
                                                        that you use this
                                                        type for a field
                                                        that has no more
                                                        than 10 values.
                                                        Displaying a
                                                        large number of
                                                        values in a Box
                                                        Selector may
                                                        cause usability
                                                        issues.

                                             Advanced Selector: Allows
                                             you to select one or more
                                             values for the field from a list
                                             of available values.

                                             Date Time: Allows you to
                                             specify a date/time or
                                             date/time range value for the
                                             field.

                                        Example: Advanced Selector .

                                                                                                             Page 98 of 220
Field                                                                               Service Manager 9.81
Data Source Type
                                        Description
Data Source Value
                                        This field is available only when
                                        the Field Type is Box Selector or
                                        Advanced Selector. The following
                                        types are supported:

                                             Global List
                                             RAD Expression

                                             Query

                                        This field is available only when
                                        the Data Source Type is Global
                                        List or RAD Expression.

                                             Global List: Specifies the
                                             global list to store the value
                                             list and display list.

                                             RAD Expression: Specifies a
                                             RAD expression that returns
                                             a JSON object that contains
                                             the value list and display list.
                                             The format of the returned
                                             JSON object is as follows:

                                             {"values":
                                             ["value1","value2"], "labels":
                                             ["display1", "display2"]}

                                             Below is an example RAD
                                             expression:

                                              jscall("CalendarFieldValueJ
                                             SCall.getMyAssignmentGrou
                                             pOperators")

Field                                                                               Service Manager 9.81
Query Configuration
                                        Description

                                        These settings are available only
                                        when the Data Source Type is
                                        Query. It specifies a query against
                                        the data in a field of a table, which
                                        retrieves a value list and display
                                        list for the field.

                                             File: the name of the table to
                                             be queried. For example,
                                              device .
                                             List Field: the name of the
                                             field that stores the value
                                             list. For example,
                                              logical.name .

                                             Display Field: the name of
                                             the field that stores the
                                             display list. If it is specified,
                                             the calendar displays the
                                             values of this field for users
                                             to select from. For example,
                                              id .

                                             If it's not specified, the
                                             calendar uses the List Field
                                             instead.

                                             Limiting SQL: a condition of
                                             the query. For example,
                                              type="bizservice" .
                                             Sort By: the name of the
                                             sort-by field of the query
                                             results. If it's not specified,
                                             the List Field is used.

Field                                                                               Service Manager 9.81
Multiple Select
                                        Description

                                        This option is available only when
                                        the Data Source Type is Box
                                        Selector.
                                        Select this option if the filter field
                                        supports the selection of multiple
                                        values.

Extended Values                         An additional user-defined list of
Extended Labels                         values and their display labels.
                                        The labels are displayed at the top
                                        of the list of values to select for
                                        the filter field.

                                        For example, you can define the
                                        following extended value and
                                        label for the Time Period module
                                        so that each user can choose to
                                        display only time period records
                                        valid for the user's own
                                        department.

                                             Extended Value: $lo.dept
                                             Extended Label: My
                                             department

     3. Click Save. An ID is automatically assigned to the filter field.

     4. Click Add Field Mappingto open the Calendar Field Mapping form.
     5. Select a module and a mapping field, and click Save to add the calendar

        filter field mapping. By default, the Active option selected.
     6. If needed, continue to follow step d and step e to map this field to multiple

        modules.
     7. Click Save & Exit.

4. If needed, continue to follow step 1 to step 3 to add multiple fields to the filter
  form.


                   Tip

                If you want to specify a filter field for multiple modules (for example,
                a filter field for affected.item in Change and affected.services in
                Time Period), you can specify the field for the Common panel, and
                then add mappings for each relevant module.

   5. Save the calendar filter mapping.

Now, you have completed your calendar configurations. Next, you can test your
calendar. See Test your calendar.

Related topics

Enable or disable the calendar
Configure calendar settings
Display an embedded calendar on an incident/interaction/problem form
Display records from an application module in the calendar
Localize a filter field
Test your calendar


1.13.3.6. Localize a filter field

Once you have added a filter field in the Calendar Filter Field form, you may need to
create localized versions of the field labels if your environment needs to support
multiple languages.

To create a localized version of a filter field, follow these steps:

   1. Identify the message ID of the filter field.

        1. Click System Administration > Ongoing Maintenance > Calendar
           Administration > Calendar Filter Mappings.

        2. Click the field ID in the Filter Fields Configuration section to open the field
           detail form.

        3. Click Localize.
        4. Make a note of the message ID, and then click Cancel.

   2. Make sure the target language you need is activated.

        1. In Database Manager, type language in the Table field, and then double-
           click language to open the Language Identification form.

        2. In the Language field, type the language name. For example, Japanese.
        3. Select Active for login option.
        4. Click Save and OK.
   3. In Database Manager, type scmessage in the Table field, and click Search.
   4. Click message.edit.

   5. Add a record for the language.

        1. Type the required field values. See the following table.


Field                                   Value
Language Code
                                        The language code of the target
ID                                      language. For example, jp.

                                        The original En message ID you
                                        recorded in step 1.

Class                                   Always type

                                        local:calendarFilterEditForm

Text                                    Type the field label in the target

                                        language.

        2. Click Add.

   6. Go back to the filter field detail form, and click Localize.

     The localized version is now displayed in the list.

   7. Restart the Service Manager web application server or the Windows client for
     the changes to take effect.

Related topics

Calendar Administration
Full calendar and embedded calendar
Calendar security area and role
Enable or disable the calendar
Configure calendar settings
Display an embedded calendar on an incident form, an interaction form, or a problem
form
Display records from an application module in the calendar
Configure search filters for the full calendar
Test your calendar


1.13.3.7. Test your calendar

Once you have completed your Service Manager Calendar setup, test your calendar
to see if it works properly.

Prepare data

Prepare data so that you can see records of your configured objects in the calendar
and test them.

   1. Create time period records for testing.

                   Tip

                You may want to create time periods with a daily recurrence type so
                that you can easily verify your test results.

   2. Create new records or update existing records for objects that you have
     configured for calendar mapping.

Test the full calendar

To test the full calendar, follow these steps:

   1. Click Miscellaneous > Calendar.
   2. Switch the calendar to a desired day, week, or month view, where you expect to

     see some Time Period, Incident, and Change records you previously created.
   3. Go to the left-side filter area, click the Choose Objects button, and check that all

     objects you configured are displayed and selected in the list.

                   Tip

                If an object is missing from the list, clear your browser cache and try
                again.

   4. Select all or some objects, and check that the calendar automatically refreshes
     to display the records as expected, based on their Restricting Query
     Configuration, Title Configuration, Tooltip Configuration, and Color Preferences
     settings.


5. Click the Add Filter Fields button, and in the pop-up window, check that the
  filter fields and panels are displayed as expected.

Test the embedded calendar

            Note

           Out-of-the-box, the embedded calendar is available only for Change and
           Change Task.

To test the embedded calendar, follow these steps:

   1. Open a record.
   2. Expand the Calendar section.
   3. Check that the embedded calendar displays the correct information (based on

     your Embedded Calendar Configuration for the corresponding module).

Related topics

Calendar Administration
Full calendar and embedded calendar
Calendar security area and role
Enable or disable the calendar
Configure calendar settings
Display an embedded calendar on an incident/interaction/problem form
Display records from an application module in the calendar


Configure search filters for the full calendar
Localize a filter field


1.13.4. Working with the calendar

Once your system administrator has set up the calendar, you can perform the
following tasks. For an overview of the calendar and its components, see Calendar
Administration.

     Launch the calendar
     Understand the calendar data
     Switch to a desired time slot
     Select a year, month, or date from the date picker (full calendar only)
     Collapse and expand panels (full calendar only)
     View tooltip information
     View time conflicts and custom messages
     Access a record from the calendar
     Drill down to the Day view
     Select the objects (full calendar only)
     Create a filter (full calendar only)
     Clear the current filter
     Manage favorites (full calendar only)

            Note

           Some tasks are allowed only in the full calendar or the embedded
           calendar, while some are allowed in both. Unless otherwise noted in the
           task heading, a task is allowed in both.

            Tip

           Before you work with the calendar, click the Refresh button ( ) at the
           upper right corner of the calendar, to get the up-to-date data.


1.13.4.1. Launch the calendar

Full calendar

To launch the full calendar, click Miscellaneous > Calendar.

Embedded calendar

To launch the embedded calendar, follow these steps:
   1. Open a change record or a change task record.
   2. Expand the Calendar section.

                   Tip

                To view the same calendar data in the full calendar, click the Launch
                full calendar button ( ) on the upper right corner of the
                embedded calendar. The full calendar displays the same data from
                the embedded calendar (because it inherits the data filter from the
                embedded calendar).

Related topics

Calendar Administration
Full calendar and embedded calendar


1.13.4.2. Understand the calendar data

Full calendar

When initially opened, the full calendar displays information about published time
periods and object records (such as Change records) for the current week.

Embedded calendar

Initially, the embedded calendar displays data according to the Field for Initial Date
value in the current record. For example, if your administrator has configured the
Scheduled Implementation Start field as the Field for Initial Date for the Change
object (see Configure search filters for the full calendar), when you view the
embedded calendar from a Change record whose Scheduled Implementation Start
date is 22 May 2013, the embedded calendar will initially display data for the Day,
Week, or Month of 22 May 2013 (the Default View value determines whether a Day,
Week or Month view is initially displayed).

What record data to display in the embedded calendar is determined by the
Embedded Calendar Configuration (Calendar Administration > Calendar Filter
Mappings). See the following figure for an example. The example filter query
indicates that the embedded calendar will display only records whose mapping fields
for service and location either have the same value as the current Change record's
affected.item field and location.full.name field respectively or have the " all " value.

The embedded calendar displays data only for Time Period and for objects that are
selected as Calendar Entries (see the figure above). The way an object's records
display depends on the whether an active field mapping of each Filter Query field has
been defined for the object.


     If there is an active mapping for each Filter Query field defined for the object,
     records of this object are displayed in the current record only when they match
     the Filter Query;
     If there is not an active mapping record, the current record will not display the
     embedded calendar widget.
To see if the query fields are mapped to an object, navigate to Calendar
Administration > Calendar Filter Mapping, and then open the filter query field in the
Filter Fields Configuration section. The following figure shows an active field mapping
of query field service for the Time Period object.

Related topics

Calendar Administration
Full calendar and embedded calendar
Calendar security area and role


1.13.4.3. Switch to a desired time slot

You can display the calendar in one of these time range views: Day, Week, and
Month.

            Tip

           In the full calendar, in addition to the steps below, you can directly select
           a year, month, and date in the Date Picker panel. See Select a year,
           month, or date from the date picker (full calendar only).

To switch the calendar to a desired time slot, follow these steps:

   1. Click Day, Week, or Month to select a time range view as needed.

     The full calendar is displayed in the Week view by default, while the embedded
     calendar is initially displayed in the Default View defined in the Embedded
     Calendar Configuration. The full calendar displays a view based on today's date,
     while the embedded calendar displays data based on the Field for Initial Date
     value of the current record. See Embedded Calendar Configuration.

   2. Click the left or right arrow button next to the Day and Month buttons
     respectively to switch to the desired time slot.

Related topics

Calendar Administration
Full calendar and embedded calendar
Calendar security area and role
Working with the calendar
Launch the calendar
Understand the calendar data
Select a year, month, or date from the date picker (full calendar only)
Collapse and expand panels (full calendar only)
View tooltip information
View time conflicts and custom messages
Access a record from the calendar
Select the objects (full calendar only)
Drill down to the Day view
Create a filter (full calendar only)


Clear the current filter
Manage favorites (full calendar only)


1.13.4.4. Select a year, month, or date
from the date picker (full calendar only)

The calendar provides a Date Picker panel at the upper left corner, which allows you
to quickly select a year, month, and date.

To select a year, month, or date from the date picker, follow these steps:

1. On the Date Picker panel, click the down arrow to the right of the currently

displayed month and year (for example,           ).

The Date Picker panel switches to a month and year selection window, where
the current month and year are selected by default.

2. Select a month and year, and then click OK.

3. Select a date.

     The calendar automatically switches to the selected year, month, or date.

Related topics

Launch the calendar
Understand the calendar data
Switch to a desired time slot
Collapse and expand panels (full calendar only)
View tooltip information
View time conflicts and custom messages
Access a record from the calendar
Select the objects (full calendar only)
Drill down to the Day view
Create a filter (full calendar only)
Clear the current filter
Manage favorites (full calendar only)


1.13.4.5. Collapse and expand panels (full
calendar only)

By default, the calendar is displayed with all panels expanded. You can collapse the
following panels to provide more space to display other parts of the calendar:

The time period panel, which consists of the time period list area and graphic
view area

To collapse it, click the               button.

The left-side panel, which consists of the date picker panel and the filter panel

     To collapse it, click the button.

Once a panel is collapsed, an expand button displays instead to allow you to expand it
again.

For the locations of the two collapse buttons, see Full calendar and embedded
calendar.

Related topics

Launch the calendar
Understand the calendar data
Switch to a desired time slot
Select a year, month, or date from the date picker (full calendar only)
View tooltip information
View time conflicts and custom messages
Access a record from the calendar
Select the objects (full calendar only)
Drill down to the Day view
Create a filter (full calendar only)
Clear the current filter
Manage favorites (full calendar only)


1.13.4.6. View tooltip information

To view the tooltip information of a record (time period, change, and so on), hover
your mouse over the record in the record list area or over the record bar in the graphic
view area.
The following screen shot illustrates the tooltip information of a time period record.

Related topics

Launch the calendar
Understand the calendar data
Switch to a desired time slot
Select a year, month, or date from the date picker (full calendar only)
Collapse and expand panels (full calendar only)
View time conflicts and custom messages
Access a record from the calendar
Select the objects (full calendar only)
Drill down to the Day view
Create a filter (full calendar only)
Clear the current filter
Manage favorites (full calendar only)


1.13.4.7. View time conflicts and custom
messages

When the calendar detects that an object record has time conflicts with a time period
record of the Freeze Period or Maintenance Window type, a red or yellow conflict icon
is displayed for the record; if an object record has no conflicts but has one or more
custom messages configured, a blue icon is displayed instead.
To view time conflict information for a record, hover your mouse over the conflict icon
of the record. Custom messages, if any, are also displayed at the bottom of the
tooltip.

You can also view the conflicts indicated by gray shadow bars, directly from the
record bar area.

For more information, see Full calendar and embedded calendar and Display records
from an application module in the calendar.

Related topics

Launch the calendar
Understand the calendar data
Switch to a desired time slot
Select a year, month, or date from the date picker (full calendar only)


Collapse and expand panels (full calendar only)
View tooltip information
Access a record from the calendar
Select the objects (full calendar only)
Drill down to the Day view
Create a filter (full calendar only)
Clear the current filter
Manage favorites (full calendar only)


1.13.4.8. Access a record from the
calendar

You can access a record (for example, a time period or change record) from the
calendar, to view its details or update it.

   1. In the calendar, click the record from the record list area or from the graphic
     view area.

   2. View or update the record as needed.

Related topics

Working with the calendar
Launch the calendar
Understand the calendar data
Switch to a desired time slot
Select a year, month, or date from the date picker (full calendar only)
Collapse and expand panels (full calendar only)
View tooltip information
View time conflicts and custom messages
Select the objects (full calendar only)
Drill down to the Day view
Create a filter (full calendar only)
Clear the current filter
Manage favorites (full calendar only)


1.13.4.9. Drill down to the Day view

You can drill down to the Day view of a specific day from a Week or Month view.

     In the Week view, click the name of the day on the header.
     In the Month view, click the number of the day.

Related topics

Launch the calendar
Understand the calendar data
Switch to a desired time slot
Select a year, month, or date from the date picker (full calendar only)
Collapse and expand panels (full calendar only)
View tooltip information
View time conflicts and custom messages
Access a record from the calendar
Select the objects (full calendar only)
Create a filter (full calendar only)
Clear the current filter
Manage favorites (full calendar only)


1.13.4.10. Select the objects (full calendar
only)

By default, the calendar displays data for all available objects. You can select to
display only objects of your interest.

   1. On the upper right corner of the filter panel, click the Select Objects button (
           ).

   2. Select the objects you want.

     The calendar is refreshed and displays only the data of the selected objects.

Related topics

Launch the calendar
Understand the calendar data
Switch to a desired time slot
Select a year, month, or date from the date picker (full calendar only)
Collapse and expand panels (full calendar only)
View tooltip information
View time conflicts and custom messages
Access a record from the calendar
Drill down to the Day view
Create a filter (full calendar only)
Clear the current filter
Manage favorites (full calendar only)


1.13.4.11. Create a filter (full calendar only)

To view specific data only, you can create a filter by adding individual filter fields, or
filter field groups, or both.

            Note

           When filtering data, the calendar performs a logical AND operation on all
           individual filter fields and field groups, while performs a logical OR
           operation on all fields within each group.

To create a filter, follow these steps:

   1. Add individual filter fields as needed.
        1. Click Miscellaneous > Calendar to launch the calendar.
        2. Click the Add Filter Fields button.
        3. Click each tab, and select the fields you want.
        4. Click OK. The selected fields are displayed in the filter panel.

   2. Add field groups as needed.
        1. Click the Add Field Group button, select the fields that you want to add to a
           group, and then click OK. The fields are added to the filter panel as a
           group.
           Alternatively, if you want to add an existing individual filter field to a group,
           click the down arrow button of the field, and select In Group. The field is
           added to the filter panel as a group.

                         Note

                      Each group is identified by - [Group], under which the group
                      fields are nested. Clicking the minus icon will collapse the
                      group.

        2. If you still want to add more fields to the group, click the down arrow button
           of the group, select Add Fields, and then select more fields.


                      Note

                   To delete a field from the group, click the down arrow button of
                   the field, and then click Delete.

                      Note

                   To delete a group, click the down arrow button of the group,
                   and select Delete Group.

3. Repeat the steps above to add more fields or groups as needed.
4. Specify one or more values as needed for each individual filter field and group

  field.
     1. Click a field.
        A value selection window opens, which can be a text input box, a Box
        Selector, an Advanced Selector, or a Date Picker, depending on the Field
        Type your administrator configured when adding the filter field.
        Text input box:

        Box Selector:

        Advanced Selector:


Date Picker (where you can specify a date range):

        2. Enter a text value (for text type only), or select one or multiple values for
           the field.

        3. Repeat the steps above for the rest of the fields.

The filter is created, and the calendar automatically refreshes based on the filter.

You can further save the current filtered view as a private or public favorite for later
reuse. For details, see Manage favorites (full calendar only).

Related topics

Launch the calendar
Understand the calendar data
Switch to a desired time slot
Select a year, month, or date from the date picker (full calendar only)
Collapse and expand panels (full calendar only)
View tooltip information


View time conflicts and custom messages
Access a record from the calendar
Select the objects (full calendar only)
Drill down to the Day view
Clear the current filter
Manage favorites (full calendar only)


1.13.4.12. Clear the current filter

To clear the current filter, click the Clear Filter button and then click Yes to confirm
the deletion. All filter fields and groups are removed from the filter panel.

Related topics

Launch the calendar
Understand the calendar data
Switch to a desired time slot
Select a year, month, or date from the date picker (full calendar only)
Collapse and expand panels (full calendar only)
View tooltip information
View time conflicts and custom messages
Access a record from the calendar
Select the objects (full calendar only)
Drill down to the Day view
Create a filter (full calendar only)
Manage favorites (full calendar only)


1.13.4.13. Manage favorites (full calendar
only)

Once you have created a filter, you can save the filtered data view as a favorite for
reuse. The Manage Favorites feature enables you to add, update, delete, and open
favorites.

            Note

           To add, delete, or update a public favorite, you need the following security
           rights respectively, which are defined in the Calendar Administration
           security area (see Calendar security area and role):

                Add Public Favorite
                Delete Public Favorite
                Update Public Favorite

To add a favorite, follow these steps:

   1. Open the calendar, and create a filter. For details, see Create a filter (full
     calendar only).

   2. Click Manage Favorites > Add.
   3. Enter a name and description for the favorite, and select Public to make it public

     or leave Public unselected to make it private.

                   Note

                A public favorite is accessible to all calendar users, while a private
                one is accessible only to the user who created it.

   4. Click Save.

To update a favorite, follow these steps:

   1. Click Select Favorite, and then select a favorite from the list.
     Alternatively, click Manage Favorites > Organize, click the Refresh button,
     select a favorite, and then click the Open button.
     The calendar switches to the data view of the favorite.


   2. On the filter panel, update the filter as needed. For example, add or delete filter
     fields/groups or update filter field values. For details, see Create a filter (full
     calendar only).

   3. Click Manager Favorites > Update.
   4. Optionally, update the name, description, and privacy setting.
   5. Click Save. The favorite is updated.

To delete a favorite, follow these steps:

   1. Click Manage Favorites > Organize.

   2. Click Refresh to refresh the favorite list.

     A refresh is needed in case other users create or update public filters while you
     are working with the calendar.

   3. Select a favorite, and click the Delete button.
   4. Click Yes to confirm the deletion. The favorite is deleted.

Related topics

Launch the calendar
Understand the calendar data
Switch to a desired time slot
Select a year, month, or date from the date picker (full calendar only)
Collapse and expand panels (full calendar only)
View tooltip information
View time conflicts and custom messages
Access a record from the calendar
Select the objects (full calendar only)
Drill down to the Day view
Create a filter (full calendar only)
Clear the current filter
````
