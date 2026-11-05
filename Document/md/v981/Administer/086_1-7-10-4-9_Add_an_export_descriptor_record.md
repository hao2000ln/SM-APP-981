---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.10.4.9 .. 1.7.10.4.17
printed_pages: 2107-2137
---

# 1.7.10.4.9 Add an export descriptor record

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.10.4.9. Add an export descriptor record

Applies to User Roles: System Administrator
To add an export descriptor record:

   1. Click Tailoring > Database Manager.
   2. In the Form field, type =export, and click Search.

     A list of existing export descriptor records is displayed.
   3. Select a record from the list, and update the following fields.

Field                                                                                     Service Manager 9.81
Export Descriptor Record
Service Manager File Name               Description
Format Control Record Name
                                        Type the unique name for this
Field Name                              record.

Field Type                              Type the name of the Service
                                        Manager database table exporting
                                        records.

                                        Type the name of the optional
                                        Format Control record to use with
                                        the export process. This Format
                                        Control record determines how
                                        Service Manager formats exported
                                        records.

                                        Type the database dictionary name
                                        of the fields exporting data. If the
                                        field is part of a structure, include
                                        the structure name before the field
                                        name. If the field is part of an
                                        arrayed structure, type only the field
                                        name.

                                        Service Manager fills this field
                                        automatically using the database
                                        dictionary definition of the field. You
                                        don't need to type any information in
                                        this field.

Field                                                                                     Service Manager 9.81
Start Pos
                                        Description
Fld Lng
Array Type                              Type the number of space
                                        characters between the start of a
                                        line and the information Service
                                        Manager exports from the selected
                                        field. This information determines
                                        which column and line number
                                        Service Manager uses to export the
                                        field information.

                                        Note: Most external files use a
                                        standard of 80 characters per line. If
                                        you type a value greater than 80
                                        then each record will use multiple
                                        lines.

                                        Type the number of characters
                                        Service Manager has to write
                                        information from the exported field
                                        into the external file.

                                        Service Manager fills in the value of
                                        this field automatically based on the
                                        database dictionary definition of the
                                        field. You don't need to manually
                                        type any information in this field.

       Field                                                                              Service Manager 9.81
       Array Occ
       Date Format                      Description

This PDF was generated on May 23, 2026  Type the number of elements in an
                                        array that you want Service Manager
                                        to export. You can use the Array Occ
                                        value to determine the start position
                                        of the next field. For example, if you
                                        want to export five elements from an
                                        array and you allocated 80 character
                                        spaces for each element, this field
                                        requires a total of 400 character
                                        spaces. The next field should begin
                                        more than 400 characters spaces
                                        from the start of the file.

                                        Type the date and time format for
                                        date and time fields. You can use the
                                        following tokens to represent units
                                        of time:

                                        dd — two-digit day
                                        mm — two-digit month
                                        yy — two-digit year
                                        yyyy — four-digit year
                                        hh — hours
                                        ii — minutes
                                        ss — seconds

                                        You can use any character to
                                        separate these tokens. For example,
                                        mm/dd/yyyy hh:ii:ss exports dates
                                        and times with slashes between the
                                        month, day, and four-digit year and
                                        colons between the hours, minutes,
                                        and seconds.

                                        Note: If you don't include a time
                                        format, then Service Manager
                                        doesn't export any time information.

                                                                                                                 Page 190 of 307

   4. Click Add.

Related topics

Data maps
Export descriptor records
Exporting records
Importing records
Purging and archiving records
Unload files
Unload script utility
Unload error messages
Export a record list to a text file
Export a record list to an Excel file
Export a record list using an export description record
Export an individual record using an export descriptor record
Export selected records from a table using an export descriptor record
Schedule the exporting of records using an export descriptor record
Schedule the unloading of records
Unload a database dictionary only
Unload a record list
Unload an individual record
Unload records from multiple files
Unload selected records from a file
Update an export descriptor record


1.7.10.4.10. Delete an export descriptor
record

Applies to User Roles: System Administrator

To delete an export descriptor record:

   1. Click Tailoring > Database Manager.
   2. Type =export in the Form field.
   3. Select Administration Mode. You must select this option for Service Manager to

     display the Delete button.
   4. Click Search.

   5. Click Search again to display a list of export descriptor records.

     Note: You may need to click Document > Restore to see the list of export
     descriptor records.

   6. Select the export descriptor record to be deleted.
   7. Click Delete.
   8. Click Yes to confirm the deletion.

Related topics

Data maps
Exporting records
Export descriptor records
Unload files
Importing records
Purging and archiving records
Unload script utility
Add an export descriptor record
Export a record list to a text file
Export a record list to an Excel file
Export a record list using an export description record
Export an individual record using an export descriptor record
Export selected records from a table using an export descriptor record
Schedule the exporting of records using an export descriptor record
Schedule the unloading of records
Unload a database dictionary only
Unload a record list
Unload an individual record


Unload records from multiple files
Unload selected records from a file
Update an export descriptor record
Unload error messages


1.7.10.4.11. Export a record list to a text file

Applies to User Roles: All users
To export a record list to a text file:
Open a list of records. For example, open a list of open incident records.

   1. Click Incident Management > Search Incidents.
   2. Select Open status, and then click Search.

     A list of incident records opens.
     Note: You can click More or the More Actions icon and then click Modify
     Columns, so that only those columns containing data that you intend to export
     are displayed. You must keep the column that contains the key field.
   3. From the record list, click More or the More Actions icon, and then choose
     Export to Text File.
   4. Fill in the following fields.


Field                                   Description
Filename
Comma Separated Value (CSV)             Type, or browse to, the path and
Semicolon Separated CSV                 name of the new text file.

Tab                                     Select this option to use the comma
Asterisk                                character as a field delimiter.
Caret
Other                                   Select this option to use the
                                        semicolon character as a field
                                        delimiter.

                                        Select this option to use the tab
                                        character as a field delimiter.

                                        Select this option to use the asterisk
                                        character as a field delimiter.

                                        Select this option to use the caret
                                        character as a field delimiter.

                                        Select this option to use a
                                        designated character as a field
                                        delimiter. Type the character
                                        delimiter.

   5. Do one of the following to save the file:

           For Windows clients:

           In the Filename field, specify a path and name for the text file, and then
           click OK.

           For Web clients:

           Click OK. Save the file when a download job starts in your Web browser.

Related topics

Data maps
Exporting records
Export descriptor records
Unload files


Importing records
Purging and archiving records
Unload script utility
Add an export descriptor record
Export a record list to an Excel file
Export a record list using an export description record
Export an individual record using an export descriptor record
Export selected records from a table using an export descriptor record
Schedule the exporting of records using an export descriptor record
Schedule the unloading of records
Unload a database dictionary only
Unload a record list
Unload an individual record
Unload records from multiple files
Unload selected records from a file
Update an export descriptor record
Unload error messages


1.7.10.4.12. Export a record list to an Excel
file

Applies to User Roles: All users
Note: You must have the Microsoft Excel application program on your computer.
To export a record list to an Excel file:

Windows client:

   1. Go to Window > Preferences, and make sure that the Client side load/unload
     option is selected.

   2. Open a list of records. For example, open a list of open incident records.
     Note: You can use Modify Columns, so that only those columns containing data
     that you intend to export displays. You must keep the column that contains the
     key field.

   3. From the record list, click the More Actions icon, and choose Export to Excel.
   4. In the Filename field, specify a path and name for the file, and then click OK.

     Note: If you specify a file that doesn't exist, Service Manager will create it.
     Service Manager exports the record list to a CSV file and opens it in Excel.

Web client:

For a Web tier client, export the record list to a text file, and then open the text file in
Excel. Do the following:

   1. From the record list, click More and choose Export to Text File.
   2. Fill in the following fields.


Field                                   Description
Filename
Comma Separated Value (CSV)             Type, or browse to, the path and
Semicolon Separated CSV                 name of the new text file.

Tab                                     Select this option to use the comma
Asterisk                                character as a field delimiter.
Caret
Other                                   Select this option to use the
                                        semicolon character as a field
                                        delimiter.

                                        Select this option to use the tab
                                        character as a field delimiter.

                                        Select this option to use the asterisk
                                        character as a field delimiter.

                                        Select this option to use the caret
                                        character as a field delimiter.

                                        Select this option to use a
                                        designated character as a field
                                        delimiter. Type the character
                                        delimiter.

   3. Open the Excel application, and then click Open.
   4. Select All files to see a list of all files in your directory.
   5. Select the new text file of the records list that you just created.
   6. Answer the Excel program prompts to import your text file. For example, select

     Delimited, so that characters such as commas or semicolons separate each
     field.
   7. When you are done making your selections, click Finish.

   8. Click OK.

     Your record list is imported into the Excel spreadsheet.

Related topics

Data maps
Exporting records


Export descriptor records
Unload files
Importing records
Purging and archiving records
Unload script utility
Add an export descriptor record
Export a record list to a text file
Export a record list using an export description record
Export an individual record using an export descriptor record
Export selected records from a table using an export descriptor record
Schedule the exporting of records using an export descriptor record
Schedule the unloading of records
Unload a database dictionary only
Unload a record list
Unload an individual record
Unload records from multiple files
Unload selected records from a file
Update an export descriptor record
Unload error messages


1.7.10.4.13. Export a record list using an
export description record

Applies to User Roles: System Administrator

To export a record list using an export description record:

   1. Click Tailoring > Database Manager.
   2. Type the form or table name that contains the records to be unloaded.
   3. Select the Administration Mode option. You must select this option to ensure

     that Service Manager displays the unload options in the target form.
   4. Click Search.
   5. Select the form used to search for records.
   6. Fill in optional search criteria, and then click Search.
   7. A record list appears. Click Mass Unload.

   8. Fill in the following fields.

       Field                                                                              Service Manager 9.81
       External File Name
       Member                           Description
       Unload Type
       Append to File                   Type the name and path of the file
                                        used to save the record list. By
       Use Data Map                     default, this file is located in the RUN
                                        folder of the Service Manager
       Prompt for Data Map              server.
       Suppress Messages
                                        This field is obsolete.
This PDF was generated on May 23, 2026
                                        Select the operating system file type
                                        for the external file.

                                        Select this option to add records to
                                        the end of an external file of the
                                        same name. If an external file of the
                                        same name doesn't exist, Service
                                        Manager creates a new file. If this
                                        field is cleared, then Service
                                        Manager overwrites any existing file
                                        of the same name.

                                        Select this option to use a pre-
                                        defined data map when unloading
                                        the selected records. Using a data
                                        map may result in Service Manager
                                        unloading more records than you
                                        originally selected to unload.

                                        Select this option to enable a
                                        confirmation message to use a data
                                        map for each record unloaded. This
                                        option is only valid if the Use Data
                                        Map option is also enabled.

                                        Select this option to hide all
                                        messages that the unload process
                                        generates.

                                                                                                                 Page 201 of 307

Field                                   Description
Export Mode — Formatted Text
                                        Select this option to save the
Form Name                               external file using an export
                                        descriptor record. This format is
                                        intended for export to other
                                        applications.

                                        Type the name of the export
                                        descriptor record. This option is
                                        valid only when the Formatted Text
                                        option is selected. If the export
                                        descriptor record doesn't exist,
                                        Service Manager prompts you to
                                        create it.

   9. Click Export Ext.
 10. If Service Manager displays a list of existing export descriptor records, select

     the export descriptor record to use.
 11. Do one of the following:

           To change the export descriptor record, click Edit Recordto edit the fields.
           To export the record, click Export.
           Service Manager saves the select records to an external file.

Related topics

Data maps
Exporting records
Export descriptor records
Unload files
Importing records
Purging and archiving records
Unload script utility
Add an export descriptor record
Export a record list to a text file
Export a record list to an Excel file
Export an individual record using an export descriptor record
Export selected records from a table using an export descriptor record
Schedule the exporting of records using an export descriptor record
Schedule the unloading of records


Unload a database dictionary only
Unload a record list
Unload an individual record
Unload records from multiple files
Unload selected records from a file
Update an export descriptor record
Unload error messages


1.7.10.4.14. Export an individual record
using an export descriptor record

Applies to User Roles: System Administrator

To export an individual record using an export descriptor record:

   1. Click Tailoring > Database Manager.
   2. Type the form or table name that contains the record to be unloaded.
   3. Select the Administration Mode option. You must select this option to ensure

     that Service Manager displays the unload options in the target form.
   4. Click Search.
   5. Select the form used to search for the record.
   6. Fill in optional search criteria, and then click Search.
   7. Select the record to unload.
   8. Click More or the More Actions icon, and then select Export/Unload.

   9. Fill in the following fields.

Field                                                                                     Service Manager 9.81
External File Name
Member                                  Description
Unload Type
Append to File                          Type the name and path of the
                                        destination file. By default, this file is
Use Data Map                            located in the RUN folder of the
                                        Service Manager server.
Prompt for Data Map
                                        This field is obsolete.
Suppress Messages
                                        Select the operating system file type
                                        for the external file.

                                        Select this option to add records to
                                        the end of an external file of the
                                        same name. If a external file of the
                                        same name doesn't exist, Service
                                        Manager creates a new file. If this
                                        field is cleared, then Service
                                        Manager overwrites any existing file
                                        of the same name.

                                        Select this option to use a pre-
                                        defined data map when unloading
                                        the selected records. Using a data
                                        map may result in Service Manager
                                        unloading more records than you
                                        originally selected to unload.

                                        Select this option to enable a
                                        confirmation message to use a data
                                        map for each record unloaded. This
                                        option is only valid if the Use Data
                                        Map option is also enabled.

                                        Select this option to hide all
                                        messages that the unload process
                                        generates.


Field                                   Description
Export Mode — Formatted Text
                                        Select this option to save the
Form Name                               external file using an export
                                        descriptor record. This format is
                                        intended for export to other
                                        applications.

                                        Type the name of the export
                                        descriptor record to use. This option
                                        is only valid with the Formatted Text
                                        option is selected. If the export
                                        descriptor record doesn't already
                                        exist, Service Manager prompts you
                                        to create it.

 10. Click Export Ext.
 11. If Service Manager displays a list of existing export descriptor records, select

     the export descriptor record to use.
 12. Do one of the following:

           To change the export descriptor record, click Edit Record.
           To export the record, click Export.
           Service Manager saves the select records to an external file.

Related topics

Data maps
Exporting records
Export descriptor records
Unload files
Importing records
Purging and archiving records
Unload script utility
Add an export descriptor record
Export a record list to a text file
Export a record list to an Excel file
Export a record list using an export description record
Export an individual record using an export descriptor record
Schedule the exporting of records using an export descriptor record
Schedule the unloading of records


Unload a database dictionary only
Unload a record list
Unload an individual record
Unload records from multiple files
Unload selected records from a file
Update an export descriptor record
Unload error messages


1.7.10.4.15. Export selected records from a
table using an export descriptor record

Applies to User Roles: System Administrator

To export selected records from a table using an export descriptor record:

   1. Click Tailoring > Database Manager.
   2. Type the form or table name that contains the records to unload.

   3. Select the Administration Mode option.

     Note: You must select this option to ensure that Service Manager displays the
     unload options in the target form.

   4. Click Search.
   5. Select the form used to search for records. Do not type or select any search

     criteria from this form.
   6. Click More or the More Actions icon, and then select Export/Unload.

   7. Fill in the following fields.

Field                                   Description
Field Name
                                        Type the name of the field
Field Values                            containing the selection criteria.

                                        Type a unique value for each record
                                        unloaded from the Field Name.

 8. Click Unl Records.
    Service Manager displays a record list of the records you selected.

 9. From the record list, select the form, click More or the More Actions icon, and
    then select Mass Unload.

10. Fill in the following fields.

       Field                                                                              Service Manager 9.81
       External File Name
       Member                           Description
       Unload Type
       Append to File                   Type the name and path of the
                                        destination file to contain the record
       Use Data Map                     list. By default, this file is located in
                                        the RUN folder of the Service
       Prompt for Data Map              Manager server.
       Suppress Messages
                                        This field is obsolete.
This PDF was generated on May 23, 2026
                                        Select the operating system file type
                                        to use for the external file.

                                        Select this option to add records to
                                        the end of an external file of the
                                        same name. If a external file of the
                                        same name doesn't exist, Service
                                        Manager creates a new file. If this
                                        field is cleared, then Service
                                        Manager overwrites any existing file
                                        of the same name.

                                        Select this option to use a pre-
                                        defined data map when unloading
                                        the selected records. Using a data
                                        map may result in Service Manager
                                        unloading more records than you
                                        originally selected to unload.

                                        Select this option to enable a
                                        confirmation message to use a data
                                        map for each record unloaded. This
                                        option is only valid if the Use Data
                                        Map option is also enabled.

                                        Select this option to hide all
                                        messages that the unload process
                                        generates.

                                                                                                                 Page 209 of 307

Field                                   Description
Export Mode — Formatted Text
                                        Select this option to save the
Form Name                               external file using an export
                                        descriptor record. This format is
                                        intended for export to other
                                        applications.

                                        Type the name of the export
                                        descriptor record to use. This option
                                        is only valid with the Formatted Text
                                        option is selected. If the export
                                        descriptor record doesn't already
                                        exist, Service Manager prompts you
                                        to create it.

 11. Click Export Ext.
 12. If Service Manager displays a list of existing export descriptor records, select

     the export descriptor record to use.
 13. Do one of the following:

           To change the export descriptor record, click Edit Record.
           To export the record, click Export.
           Service Manager saves the select records to an external file.

Related topics

Exporting records
Export descriptor records
Unload files
Export a record list to a text file
Export a record list to an Excel file
Export a record list using an export description record
Export an individual record using an export descriptor record
Unload error messages


1.7.10.4.16. Schedule the exporting of
records using an export descriptor record

Applies to User Roles: System Administrator

To schedule the exporting of records using an export descriptor record:

   1. Select the records to export.
   2. From the file.prompt.dbu.g form, also known as the Service Manager

     unload/export facility, click Export Ext.
   3. If Service Manager displays a list of existing export descriptor records, select

     the export descriptor record to use.
   4. Do one of the following:

           To change the export descriptor record, click Edit Record.
           To schedule the export of records, click Schedule.

   5. Fill in the following fields.


Field                                   Description

Date/Time to Run                        Specify the date and time to unload
                                        the records.

Repeat Interval — Enter Number of D     Type the number of days, hours.
ays and Time                            minutes, and seconds to wait before
                                        repeating the unload process. Enter
                                        the interval with the following
                                        format: <Days><Hours>:<Minutes>:
                                        <Seconds>

                                        You can specify a repeat interval or
                                        select one of the pre-defined
                                        intervals. Any value you type in this
                                        field overrides the pre-defined
                                        intervals.

       Repeat Interval — Monthly        Select this option to repeat the
                                        export process every once every
       Repeat Interval — Quarterly      month from today’s date.

       Repeat Interval — Semi-Annually  Select this option to repeat the
                                        export process every once every
       Repeat Interval — Annually       quarter from today’s date.

   6. Click Confirm.                    Select this option to repeat the
                                        export process every once every six
Related topics                          months from today’s date.

Data maps                               Select this option to repeat the
Exporting records                       export process every once every
Export descriptor records               year from today’s date.


Unload files
Importing records
Purging and archiving records
Unload script utility
Unload error messages
Add an export descriptor record
Export a record list to a text file
Export a record list to an Excel file
Export a record list using an export description record
Export an individual record using an export descriptor record
Export selected records from a table using an export descriptor record
Schedule the unloading of records
Unload a database dictionary only
Unload a record list
Unload an individual record
Unload records from multiple files
Unload selected records from a file
Update an export descriptor record


1.7.10.4.17. Schedule the unloading of
records

Applies to User Roles: System Administrator
To schedule the unloading of records:

   1. Click Tailoring > Database Manager.
   2. Type the form or file name that contains the records to unload, and then click

     Search.

   3. Select a form, and then click Search again.

     A list of records opens.

   4. Select a record.
   5. Open the More Actions menu and choose Export/Unload.
   6. Fill in optional search criteria.
   7. From the file.prompt.dbu.g form, also known as the unload/export facility, click

     Schedule.

   8. Fill in the following fields.


Field                                   Description

Date/Time to Run                        Specify the date and time to unload
                                        the records.

Repeat Interval — Enter Number of D     Type the number of days, hours.
ays and Time                            minutes, and seconds to wait before
                                        repeating the unload process. Enter
                                        the interval with the following
                                        format: <Days><Hours>:<Minutes>:
                                        <Seconds>

                                        Note: You can either type in a repeat
                                        interval or select one of the pre-
                                        defined intervals. Any value you
                                        type in this field overrides the pre-
                                        defined intervals.

Repeat Interval — Monthly               Select this option to repeat the
Repeat Interval — Quarterly             unload process every once every
Repeat Interval — Semi-Annually         month from today’s date.
Repeat Interval — Annually
                                        Select this option to repeat the
                                        unload process every once every
                                        quarter from today’s date.

                                        Select this option to repeat the
                                        unload process every once every six
                                        months from today’s date.

                                        Select this option to repeat the
                                        unload process every once every
                                        year from today’s date.

   9. Click Confirm.                                 Page 215 of 307

Related topics

This PDF was generated on May 23, 2026

Data maps
Exporting records
Export descriptor records
Unload files
Importing records
Purging and archiving records
Unload script utility
Add an export descriptor record
Export a record list to a text file
Export a record list to an Excel file
Export a record list using an export description record
Export an individual record using an export descriptor record
Export selected records from a table using an export descriptor record
Schedule the exporting of records using an export descriptor record
Unload a database dictionary only
Unload a record list
Unload an individual record
Unload records from multiple files
Unload selected records from a file
Update an export descriptor record
Unload error messages
````
