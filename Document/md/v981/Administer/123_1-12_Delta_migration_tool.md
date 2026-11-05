---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.12 .. 1.13.2
printed_pages: 3092-3115
---

# 1.12 Delta migration tool

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.12. Delta migration tool

Service Manager provides a delta migration tool to transfer the “delta data” from one
Service Manager system (original system) to another (new system).

Typical scenario

There are times where you need to migrate data from one Service Manager server to
another. Take the following scenario:

     The original system is running live
     You make a copy of it
     You make changes to the workflow in the copy
     You replace the original live system with the copy that has the new workflow

Of course from the time you made a copy until the time the new system goes live, end
users are making changes. The following figure depicts this scenario.

            Tip

           You can also use this tool to keep the data in a “test” system in sync with
           a “production” system or a “development” system in sync with a “test”
           system.

Data migration methods

The delta migration tool enables you to keep the original system and the copy in sync
in either of the ways:

     Allowing manual export or import of changed records


     Scheduling an automated export or import

            Caution

           For a table without the “sysmodtime” field, the tool can't migrate “delta
           data” from the original system.

Prerequisites

There are some prerequisites for using this tool. For details, see Installing the delta
migration tool .

Supported applications versions

You can find the latest DeltaMigrationTool.unl in the latest Service Manager Upgrade
package root folder.

Related topics

Delta migration methods
Installing the delta migration tool
Troubleshooting delta migration


1.12.1. Installing the delta migration tool

To install the latest delta migration tool, you need to deploy
the DeltaMigrationTool.unl package. This package is available in the upgrade folder,
along with the other Service Manager application upgrade utility files. To install the
delta migration tool, follow these steps:

   1. Sign in to the Service Manager system as an administrator.
   2. Open Database Manager, right-click, and then select Import/Load.
   3. Select DeltaMigrationTool.unl, and then click Load FG to deploy it.

Related topics

Delta migration tool
Delta migration methods
Troubleshooting delta migration


1.12.2. Delta migration methods

There are two methods to complete the delta migration:

Method 1: Manually export and import a single UNL file

You need to use the delta migration tool to generate an unload script, and then use
this unload script to export and import data manually. This method is simple and you
can use it to migrate delta data between two systems with similar versions (for
example, from Service Manager 9.60 to Service Manager 9.61).

            Note

           If the table structures of the new and original Service Manager systems
           are different, use method 2 to migrate the delta data.

Method 2: Automatically export and import multiple UNL files

You need to create background schedules to export the tables that contain the delta
data into the UNL files in a specified original folder. Then, move the entire folder to the
new Service Manager system and create background schedules to import them.

Migration by using this method uses the background schedule tasks to export and
import the delta data, so it has minimal performance impact on the running production
system. You can apply this method to migrate delta data between two systems with
different versions (for example, from Service Manager 9.41 to Service Manager 9.61).
Most of Service Manager upgrade projects should use method 2.

Prerequisites for using the delta migration tool

Before you use the delta migration tool to migrate the delta data, the following
prerequisites must be met.

            Note

           Only the first requirement applies to both method 1 and method 2, while
           the other four requirements apply only to method 2.

Make sure that the new Service Manager system is clean and doesn't contain
any test records.

Before the delta migration, the new Service Manager system should include only
the records or modifications from the original system. You must remove any test


data that was created or modified on the new system during the delta data
period.

If there are some test records added to the new system during the delta data
period, as shown in the following figure, then the delta data from the original
Service Manager system can't be migrated to the new system because of a data
conflict. Even if you decide to use the delta data from the original Service
Manager system to overwrite the test records, there is a risk of a data integrity
violation.

For example, a new incident IM12345 (called IM_A) is created in the original
system during delta data period, and another test record IM12345 (called IM_B)
is created in the new system, with several activity logs. If you then use IM_A in
the original system to overwrite IM_B in the new system, you will find that IM_A
in the new system contains some incorrect activity logs, which belong to IM_B.

Make sure that the date format of the original Service Manager system doesn't
have the y2k problem. To do this, follow these steps:

   1. Open System Navigator > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Go to Data Info.
     If the date format contains only two digits for the year value, such as
     "mm/dd/yy", change it to four digits (for example, "mm/dd/yyyy").

   3. Save the modification and restart the Service Manager service.

Create a new administrator's account in the original Service Manager system.
The date format and time zone settings of this account should be the same as
those in System Information Record.


     Because background tasks will use the default time zone and date format in the
     System Information Record, creating a new admin account with the same time
     zone setting and date format of System Information Record will avoid missing
     data.

     Make sure that the five background schedulers (bg_load_unload 1, ...,
     bg_load_unload 5) have been started in both of the Service Manager systems. If
     the background schedulers haven been started, they should be visible in the
     System Status record. If they're not there, click Start Scheduler and select
     dmt.unload.load.

     Make sure that an empty folder is created on the original Service Manager
     system for exporting the delta data.

Method 1: Manually export/import a single UNL file

The following flow chart illustrates how the operator migrates the delta data by using
method 1.

To export the delta data by using method 1, follow these steps:

   1. Sign in to the original Service Manager system.
   2. Click System Administraton > Ongoing Maintenance > Upgrade Utility > Delta

     Migration Export. A welcome page appears showing the instructions for


     migration.
   3. Click Next on the welcome page and select Method 1: Manually export/import a

     single UNL file.
   4. Click Next to check the steps of using method 1.
   5. Click Next to specify the time range of the delta data. The delta migration tool

     will generate an unload script to extract all the delta data within this range.
   6. Click Next to generate the unload script.
   7. Open the generated unload script, and then run it to generate an UNL file.
   8. Copy the UNL file to the new system.

To import the delta data by using method 1, follow these steps:

   1. Sign in to the new Service Manager system as an administrator.
   2. Click System Administraton > Ongoing Maintenance > Upgrade Utility > Delta

     Migration Import.
   3. Select Method 1: Manually import a single UNL file, and then select the unl file

     to import.
   4. Click Next to import the unload data.
   5. Sign out and then sign in to the new Service Manager system again.

Method 2: Automatically export and import multiple
UNL files

The following flow chart illustrates how the operator migrates the delta data by using
method 2.


To export the delta data by using method 2, follow these steps:

   1. Sign in to the original Service Manager system.
   2. Click System Administraton > Ongoing Maintenance > Upgrade Utility > Delta

     Migration Export. A welcome page appears showing the instructions for
     migration.
   3. Click Next on the welcome page, and then select Method 2: Automatically
     export/import multiple UNLs.
   4. Click Next to check the steps of using method 2.
   5. Click Next to specify a folder for the exported delta data, and then specify the
     time range of the delta data.
   6. Click Next to verify the provided migration suggestions after the tool checks the
     tables. You can ignore some tables even if they contain some delta data.
   7. Click Next to verify the final confirmation for the migration. The message
     displays the number of tables that will be migrated and the time that the
     exporting will take.
   8. Click Next to start background schedule tasks to export the delta data.

   9. Click Finish to exit the tool when the overall progress reaches 100%.


                   Note

                To check the export status, go to the selected folder and open
                Overall Export Status Report.html.

 10. Copy the whole folder to the new Service Manager system.

To import the delta data by using method 2, follow these steps:

   1. Sign in to the new Service Manager system as an administrator.
   2. Click System Administration > Ongoing Maintenance > Upgrade Utility > Delta

     Migration Import. A welcome page appears showing the instructions for
     migration.
   3. Select Method 2: Automatically import multiple UNL files, and then click Next
     to specify the folder that contains the exported delta data.
   4. Click Next to select the tables to migrate. If the table structures are different, we
     recommend that you click Click here to check the table structure mismatch…
     link, to acknowledge the detailed difference, the risk, and then decide if you
     migrate or not.

                   Note

                If the table structure mismatch may introduce risks, and you decide
                not to migrate, then try to migrate the data in these tables by other
                methods to avoid data loss. For more information about how to do
                this, see Cannot handle skipped tables.

   5. Click Next to check the final confirmation for the migration. The message
     displays the number of tables that will be imported.

   6. Click Next to start background schedule tasks to import the delta data.

   7. Click Finish to exit the tool when the overall progress reaches 100%.

                   Note

                To check the importing status, go to the selected folder and open
                Overall Import Status Report.html.


            Note

           If tables are ignored during the export operation because they have no
           last modification time field, then check if a full-table migration is needed.

Related topics

Delta migration tool
Installing the delta migration tool
Troubleshooting delta migration


1.12.3. Delta migration FAQ

Where can I check the status of the background
export/import tasks?

During the import and export operations, there is a real-time report Overall Export
Status Report.html or Overall Import Status Report.html located under the specified
folder. Open the file and check the overall status at the top of it. If your browser warns
you about the script or ActiveX controller on the webpage, allow it. When the overall
status changes to 100%, all the background export/import tasks have finished.

What files are included as the output materials?

After a successful export operation, the materials in the user specified folder should
include the following files.

File name                                                                                       Service Manager 9.81
readme.txt
                                        Description
Overall Export Status Report.html
Overall Import Status Report.html       Records of the basic information of this
                                        folder
                                        This file includes the time range of the
                                        exported UNL files.

                                        A real-time report for the export
                                        operation

                                        A real-time report for the import
                                        operation

                                                    Note

                                                   This file only appears
                                                   during the import
                                                   operation.

<SM table name>_unload_result.txt       A record of how many UNLs are to be
<SM table name>_unload_structure.txt    exported for a specified table

                                        A description of the table structure of
                                        the original Service Manager system

                                        This information is used for
                                        comparison with the table structure in
                                        the new Service Manager system, and
                                        to help to decide if the delta data in
                                        table should be migrated here.

File name                                                                                       Service Manager 9.81

<SM table                               Description
name>_unload_structure_new.txt
                                        Describe the table structure of the new
                                        Service Manager system

                                                    Note

                                                   These files only appear
                                                   during the import
                                                   operation.

<SM table name>_<start time>_<end       Unloaded UNL files
time>.UNL
                                        The format of the start and the end
                                        time is "yyyymmdd_hhMMss"

table_exported.txt                      A list of tables for which the delta data
                                        is exported

                                        The timestamp field in each table is
                                        also recorded in this file

How can I decide if the data in a specified table
should be unloaded/loaded or not?

If the table has a sysmodtime field, and if the structure of the table is the same in the
original system and in the new system, then the delta data can be migrated without
problem. Simply migrate the data according to the suggestions made by the tool.

If a table has no sysmodtime field, the tool will suggest that you don't migrate the
data in it. If the information in the table is not time-sensitive or is not changed very
often, you can migrate all data in it to the new system by using a Service Manager
unload script or by using the database functions.

If a table structure has changed, but the tool reports no risk to the import operation,
then you can migrate the table. However, if the tool reports risks, don't import the
table. For more information, see Cannot handle skipped tables.


1.13. Calendar Administration

As of version 9.34, Service Manager additionally provides a calendar (referred to as
Service Manager Calendar) that's based on a calendar widget.

Service Manager Calendar can display time period records and associated business
records in a graphic and intuitive user interface. It enables users in different locations
and departments of your organization to perform the following tasks and optimize
their task planning accordingly:

     To easily see how their activities will be affected in a specific time range. For
     example, they can see if a performance degradation or service outage will
     happen during the first week of May.
     To easily see which business records (changes, incidents, interactions, and so
     on) are scheduled for or associated with a specific time range. For example, they
     can see if a change is planned to start or end during the first week of May.
     To directly view important details of time period records and associated records
     from tooltips.
     To directly open records from the calendar to view their details.
     To view time conflicts of object records from conflict icon tooltips and shadow
     bars.

Service Manager Calendar also allows high-level tailoring through a set of
configurations. For time period records and associated records, you can set color
preferences, maximum number of records to display, field mappings, filters, and so
on.

Related topics

Full calendar and embedded calendar
Calendar security area and role


1.13.1. Full calendar and embedded
calendar

Service Manager Calendar has two views: Full Calendar and Embedded Calendar.

Full calendar

This is a complete view of the calendar, accessible from Miscellaneous > Calendar,
or from a button in the embedded calendar.
The following figure illustrates the full calendar.

The following table describes the major areas of the calendar.

Callout                                                                                         Service Manager 9.81
1
2                                       Description

3                                       The date picker panel. You can use the
                                        arrow buttons on this panel to quickly
                                        jump to a specific year/month/date.

                                        The Time Period record list panel,
                                        which is the upper part of the record
                                        list area. Note that the record list area
                                        is also referred to as the "Title area" of
                                        the calendar.

                                        This panel lists the time period records
                                        being displayed in the current calendar
                                        view, based on the settings in the Title
                                        Configuration section in System
                                        Administration > Ongoing
                                        Maintenance > Calendar
                                        Administration > Calendar Mappings.

                                        The Time Period graphic view panel,
                                        which is the upper part of the right-
                                        side area of the calendar ("calendar
                                        entry area"). This panel displays time
                                        period occurrences as a single-color
                                        bar, and the length of each bar
                                        represents an occurrence duration.

                                                    Note

                                                   This panel displays only
                                                   active time period
                                                   occurrences.

Callout                                                                                         Service Manager 9.81
4
                                        Description
5
6                                       The time zone area, which displays the
                                        time zone that's defined in the current
                                        user's operator record, or the one
                                        defined in the System Information
                                        Record if the former doesn't exist.

                                                    Note

                                                   If neither exists, this area
                                                   displays Time Zone
                                                   (undefined) .

                                        The Refresh button, used to fresh the
                                        calendar display.

                                        The filter panel, used to manage
                                        filtered views of the calendar. This
                                        filtering feature helps users locate data
                                        of their interest.
                                        On the filter panel, users can add
                                        individual filter fields and field groups.

Callout                                                                                         Service Manager 9.81
7
                                        Description
8
                                        Conflict icons. Each of these icons
                                        indicates that the current record has
                                        conflicts with one or more time periods
                                        of the Freeze Period or Maintenance
                                        Window type, or has one or more
                                        custom messages configured, or both.
                                        These icons have tooltips that show
                                        specific conflict information and
                                        custom messages.

                                        A record that has conflicts is one that
                                        exceeds, or misses, or overlaps with a
                                        Freeze Period or Maintenance Window
                                        time period. When it has conflicts only
                                        with maintenance windows, a yellow
                                        icon is displayed; as long as it has
                                        conflicts with freeze periods, a red icon
                                        is displayed; if it has no conflicts but
                                        has only custom messages configured,
                                        a blue icon is displayed.

                                        Conflicts and overlaps are also
                                        indicated by gray background bars
                                        ("shadow bars") behind the records
                                        bars. The more time periods a record
                                        has conflicts with, the darker the
                                        shadow bar becomes.

                                        This button collapses the entire left-
                                        side panel (which consists of the date
                                        picker panel and the filter panel).


Callout                                 Description

9                                       The object record list panel, which is

                                        the lower part of the record list panel

                                        ("Title area"). This panel lists object

                                        records that are associated with the

                                        current time range. For example, this

                                        panel may list a Change record whose

                                        Scheduled Implementation Start or

                                        Scheduled Implementation End time

                                        falls into the currently displayed time

                                        range. The Calendar Settings and

                                        Calendar Mappings configurations

                                        determine which records are displayed

                                        in this area.

10                                      This button collapses the entire time

                                        period panel.

11                                      The graphic view panel of object

                                        records, which is the lower part of the

                                        "calendar entry area". This panel

                                        displays relevant object records as a

                                        single-color bar to provide an intuitive

                                        view of the start and end times of these

                                        records. Administrators can use

                                        different colors to identify different

                                        records.

Embedded calendar

The embedded calendar is a simplified view of the calendar, accessible only from
certain objects. For example, from the calendar section in a Change or a Change Task
record. The embedded calendar displays information about time periods and object
records in a way that's more relevant to the current record. This is implemented
through Embedded Calendar Configuration, which allows you to configure a filter
query to display related records in the embedded calendar.


            Note

           The embedded calendar doesn't contain the date picker panel and filter
           panel that exist in the full calendar; however, if you want to view the same
           data in the full calendar, click the Launch full calendar button ( ) at the
           top right corner. The full calendar inherits the data filter of the embedded
           calendar.

            Caution

           Calendar consumes a certain amount of system resources (memory and
           CPU). Therefore, if you plan to embed the calendar in forms that are
           heavily used in your organization’s daily operation (such as incident or
           interaction forms), and if your server already runs at high capacity, we
           recommend that you analyze and understand the impact before
           deployment.

The following figure shows the embedded calendar that's displayed in a Change
record.

Related topics                          Page 61 of 220

Calendar Administration
Calendar security area and role
Working with the calendar
Calendar administration tasks

This PDF was generated on May 23, 2026

1.13.2. Calendar security area and role

The default Calendar Administration security area and Calendar Administrator
security role are defined for Service Manager Calendar.

Security area

The default Service Manager Calendar uses the following security area.

Area                                    Description
Calendar Administration
                                        This area contains the default security
                                        rights that will be applied to all of the
                                        roles created for the Calendar area.

To access the Calendar Administration security area, follow these steps:

   1. Navigate to System Administration > Security > Areas.
   2. In the Name field, select Calendar Administration.
   3. Click Search.

Security rights and settings

The following table describes the security rights and settings used in Service
Manager Calendar.


Setting/Right                           Description

View                                    Can view Calendar Filter Mapping, and

                                        Calendar Mapping records as well as

                                        their related records (such as filter

                                        field, filter mapping, embedded

                                        configuration records)

New                                     Can add Calendar Filter Mapping, and

                                        Calendar Mapping records as well as

                                        their related records (such as filter

                                        field, filter mapping, and embedded

                                        configuration records)

Delete/Close                            Can delete Calendar Filter Mapping,
                                        and Calendar Mapping records as well
                                        as their related records (such as filter
                                        field, filter mapping, and embedded
                                        configuration records)

Expert                                  Unused

Admin                                   Unused

Modify Template                         Unused

Add Public Favorite                     Can create public favorites

Delete Public Favorite                  Can delete public favorites

Update Public Favorite                  Can update public favorites

Security role

Out-of-the-box, the following security role is available for Service Manager Calendar.

Role                                    Description                          Service Manager 9.81

Calendar Administrator Full rights                   Default Rights/Setting in
                                                     the Calendar
                                                     Administration Area

                                                          View
                                                          New
                                                          Update (Always)
                                                          Delete/Close
                                                          (Always)
                                                          Expert
                                                          Admin
                                                          Modify Template
                                                          Add Public Favorite
                                                          Delete Public
                                                          Favorite
                                                          Update Public
                                                          Favorite

To access the Calendar Administrator security role, follow these steps:

   1. Navigate to System Administration > Security > Roles.
   2. In the Name field, select Calendar Administrator.
   3. Click Search.

Related topics

Calendar Administration
Full calendar and embedded calendar
````
