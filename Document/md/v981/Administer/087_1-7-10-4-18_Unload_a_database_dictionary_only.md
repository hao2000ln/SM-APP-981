---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.10.4.18 .. 1.7.10.4.23
printed_pages: 2137-2166
---

# 1.7.10.4.18 Unload a database dictionary only

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.10.4.18. Unload a database dictionary
only

Applies to User Roles: System Administrator

To unload a database dictionary only:

   1. Click Tailoring > Database Manager.
   2. Type the form or file name that contains the records to unload.
   3. Select the Administration Mode option. You must select this option to ensure

     that Service Manager displays the unload options in the target form.
   4. Click Search.
   5. Select the form to use to search for records. Do not type or select any search

     criteria from this form.
   6. Click More or the More Actions icon, and then select Export/Unload.
   7. Click Unl Dbdict.

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
                                        This field is obsolete
This PDF was generated on May 23, 2026
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

                                                                                                                 Page 218 of 307

Field                                   Description
Export Mode — Binary
Export Mode — Text                      Select this option to save the
                                        external file in Service Manager’s
Export Mode — Formatted Text            binary unload format. Only the
                                        Service Manager Database Manager
Form Name                               can read this binary file format.

Dbdict Load Options — Create file if    Select this option to save the
not there, and update if present        external file in Service Manager’s
                                        text format. This format is human
                                        readable but is not intended for
                                        export to other applications other
                                        than Service Manager’s Database
                                        Manager.

                                        Select this option to save the
                                        external file in a user-defined text
                                        format. This format is intended for
                                        export to other applications. If you
                                        select this option, you must type a
                                        valid Service Manager form name in
                                        the Form Name field.

                                        Type the name of the Service
                                        Manager form to use when exporting
                                        records as formatted text. This
                                        option is only valid with the
                                        Formatted Text option is selected. If
                                        the text format description doesn't
                                        already exist, Service Manager
                                        prompts you to create it.

                                        Select this option if the data saved in
                                        this external file should replace
                                        existing data in the target Service
                                        Manager system.


Field                                   Description

Dbdict Load Options — Create file if    Select this option to ignore data
not there, but don't update if present  saved in the external file that already
                                        exists in the target Service Manager
                                        system.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including keys                          existing data in the target Service
                                        Manager system including the
                                        database keys.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including SQL mapping                   existing data in the target Service
                                        Manager system including the
                                        database SQL mapping.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including keys AND SQL mapping          existing data in the target Service
                                        Manager system including the
                                        database SQL mapping and the
                                        database keys.

Record Load Options — Add/update        Select this option if the records
record                                  saved in this external file are to
                                        replace any existing records in the
                                        target Service Manager system.

Record Load Options — Only add          Select this option to ignore records
new records                             saved in the external file that already
                                        exist in the target Service Manager
                                        system.

   9. Click Unload/export.
     Service Manager saves the select records to an external file.

Related topics


Data maps
Exporting records
Export descriptor records
Unload files
Importing records
Purging and archiving records
Unload script utility
Load/unload implications of case-sensitivity
Add an export descriptor record
Export a record list to a text file
Export a record list to an Excel file
Export a record list using an export description record
Export an individual record using an export descriptor record
Export selected records from a table using an export descriptor record
Schedule the exporting of records using an export descriptor record
Schedule the unloading of records
Unload a record list
Unload an individual record
Unload records from multiple files
Unload selected records from a file
Update an export descriptor record
Unload error messages


1.7.10.4.19. Unload a record list

Applies to User Roles: System Administrator

To unload a record list:

   1. Click Tailoring > Database Manager.
   2. Type the form or file name that contains the records to unload.
   3. Select the Administration Mode option. You must select this option to ensure

     that Service Manager displays the unload options in the target form.
   4. Click Search.
   5. Click the form used to search for records.
   6. Fill in optional search criteria.
   7. Click Search.
   8. Click More or the More Actions icon for record list, and then select Mass

     Unload.

   9. Fill in the following fields.

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
                                        Select the operating system file
                                        format for the external file.

                                        Select this option to add records to
                                        the end of an external file of the
                                        same name. If an external file of the
                                        same name doesn't exist, Service
                                        Manager creates a new file. If this
                                        field is cleared, Service Manager
                                        overwrites any existing file of the
                                        same name.

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

                                                                                                                 Page 223 of 307

Field                                   Description
Export Mode — Binary
Export Mode — Text                      Select this option to save the
                                        external file in Service Manager’s
Export Mode — Formatted Text            binary unload format. Only the
                                        Service Manager Database Manager
Form Name                               can read this binary file format.

Dbdict Load Options — Create file if    Select this option to save the
not there, and update if present        external file in Service Manager’s
                                        text format. This format is human
                                        readable but is not intended for
                                        export to other applications other
                                        than Service Manager’s Database
                                        Manager.

                                        Select this option to save the
                                        external file in a user-defined text
                                        format. This format is intended for
                                        export to other applications. If you
                                        select this option, you must type a
                                        valid Service Manager form name in
                                        the Form Name field.

                                        Type the name of the Service
                                        Manager form to use when exporting
                                        records as formatted text. This
                                        option is only valid with the
                                        Formatted Text option is selected. If
                                        the text format description doesn't
                                        already exist, Service Manager
                                        prompts you to create it.

                                        Select this option if the data saved in
                                        this external file should replace
                                        existing data in the target Service
                                        Manager system.


Field                                   Description

Dbdict Load Options — Create file if    Select this option to ignore data
not there, but don't update if present  saved in the external file that already
                                        exists in the target Service Manager
                                        system.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including keys                          existing data in the target Service
                                        Manager system including the
                                        database keys.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including SQL mapping                   existing data in the target Service
                                        Manager system including the
                                        database SQL mapping.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including keys AND SQL mapping          existing data in the target Service
                                        Manager system including the
                                        database SQL mapping and the
                                        database keys.

Record Load Options — Add/update        Select this option if the records
records                                 saved in this external file are to
                                        replace any existing records in the
                                        target Service Manager system.

Record Load Options — Only add          Select this option to ignore records
new records                             saved in the external file that already
                                        exist in the target Service Manager
                                        system.

 10. Click Unload/export.                                           Page 225 of 307
     Service Manager saves the select records to an external file.

This PDF was generated on May 23, 2026

Related topics

Data maps
Exporting records
Export descriptor records
Unload files
Importing records
Purging and archiving records
Unload script utility
Load/unload implications of case-sensitivity
Add an export descriptor record
Export a record list to a text file
Export a record list to an Excel file
Export a record list using an export description record
Export an individual record using an export descriptor record
Export selected records from a table using an export descriptor record
Schedule the exporting of records using an export descriptor record
Schedule the unloading of records
Unload a database dictionary only
Unload an individual record
Unload records from multiple files
Unload selected records from a file
Update an export descriptor record
Unload error messages
Load error messages and notifications


1.7.10.4.20. Unload an individual record

Applies to User Roles: System Administrator

To unload an individual record:

   1. Click Tailoring > Database Manager.
   2. Type the form or file name that contains the record to unload.
   3. Select the Administration Mode option. You must select this option to ensure

     that Service Manager displays the unload options in the target form.
   4. Click Search.
   5. Click the form used to search for the record.
   6. Fill in optional search criteria.
   7. Click Search.
   8. Select the record to unload.
   9. Click More or the More Actions icon for the record, and then select

     Export/Unload.

 10. Fill in the following fields.

Field                                                                                     Service Manager 9.81
External File Name
Member                                  Description
Unload Type
Append to File                          Type the name and path of the file
                                        used to save the record. By default,
Use Data Map                            this file is located in the RUN folder
                                        of the Service Manager server.
Prompt for Data Map
                                        This field is obsolete.
Suppress Messages
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


Field                                   Description
Export Mode — Binary
Export Mode — Text                      Select this option to save the
                                        external file in Service Manager’s
Export Mode — Formatted Text            binary unload format. Only the
                                        Service Manager Database Manager
Form Name                               can read this binary file format.

Dbdict Load Options — Create file if    Select this option to save the
not there, and update if present        external file in Service Manager’s
                                        text format. This format is human
                                        readable but is not intended for
                                        export to other applications other
                                        than Service Manager’s Database
                                        Manager.

                                        Select this option to save the
                                        external file in a user-defined text
                                        format. This format is intended for
                                        export to other applications. If you
                                        select this option, you must type a
                                        valid Service Manager form name in
                                        the Form Name field.

                                        Type the name of the Service
                                        Manager form to use when exporting
                                        records as formatted text. This
                                        option is valid only with the
                                        Formatted Text option is selected. If
                                        the text format description doesn't
                                        already exist, Service Manager
                                        prompts you to create it.

                                        Select this option if the data saved in
                                        this external file should replace
                                        existing data in the target Service
                                        Manager system.


Field                                   Description

Dbdict Load Options — Create file if    Select this option to ignore data
not there, but don't update if present  saved in the external file that already
                                        exists in the target Service Manager
                                        system.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including keys                          existing data in the target Service
                                        Manager system including the
                                        database keys.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including SQL mapping                   existing data in the target Service
                                        Manager system including the
                                        database SQL mapping.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including keys AND SQL mapping          existing data in the target Service
                                        Manager system including the
                                        database SQL mapping and the
                                        database keys.

Record Load Options — Add/update        Select this option if the records
records                                 saved in this external file are to
                                        replace any existing records in the
                                        target Service Manager system.

Record Load Options — Only add          Select this option to ignore records
new records                             saved in the external file that already
                                        exist in the target Service Manager
                                        system.

 11. Click Unload/export.

Related topics


Data maps
Exporting records
Export descriptor records
Unload files
Importing records
Purging and archiving records
Unload script utility
Load/unload implications of case-sensitivity
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
Unload records from multiple files
Unload selected records from a file
Update an export descriptor record
Unload error messages


1.7.10.4.21. Unload records from multiple
files

Applies to User Roles: System Administrator
To unload records from multiple files:

   1. Click Tailoring > Unload Script Utility.
   2. Fill in the following fields.

Field                                                                                     Service Manager 9.81
Unload Script
Unload?                                 Description
Purge?
Show Unload Records                     Type a name or label to identify your
                                        unload script. This name can include
Filename                                spaces.

Query                                   Select this option to create an
                                        external unload file from the records
                                        queried by this script.

                                        Select this option to delete the
                                        records queried by this script.

                                        Select this option to display the
                                        Filename, Query, and Data Map
                                        fields. These fields enable you to
                                        specify the tables and queries to use
                                        when unloading records.

                                        Specify the name of the table to
                                        unload records. This field is visible
                                        only if you select Show Unload
                                        Records.

                                        Type the SQL query to select
                                        records for unloading. You can use
                                        Service Manager operators and
                                        variables in this field. This field is
                                        visible only if you select Show
                                        Unload Records.


Field                                   Description
Datamap
                                        Specify true or false to specify
Show Protected Formats                  whether Service Manager should
Protected Formats                       use the data map file to unload any
                                        associated records. You must have
                                        previously defined a data map for
                                        the listed file in order to use this
                                        feature. By default, Service Manager
                                        reads a blank entry in this field as
                                        false. This field is only visible if you
                                        have select Show Unload Records.

                                        Select this option to display the
                                        Protected Formats field. This field
                                        enables you to specify the forms to
                                        protect from purging.

                                        Type the names of the forms to
                                        protect when you purge records
                                        from this script.

   3. Click Add.

Related topics

Data maps
Exporting records
Export descriptor records
Unload files
Importing records
Purging and archiving records
Unload script utility
Load/unload implications of case-sensitivity
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
Unload selected records from a file
Update an export descriptor record
Unload error messages
Load error messages and notifications


1.7.10.4.22. Unload selected records from
a file

Applies to User Roles: System Administrator

To unload selected records from a file:

   1. Click Tailoring > Database Manager.
   2. Type the form or file name that contains the records to unload.
   3. Select the Administration Mode option. You must select this option to ensure

     that Service Manager displays the unload options in the target form.
   4. Click Search.
   5. Select the form used to search for records.
   6. Click More or the More Actions icon, and then select Export/Unload.

   7. Fill in the following fields.

Field                                   Description
Field Name
                                        Type the name of the field used as
Field Values                            the selection criteria. This field
                                        contains the values you list in the
                                        Field Values field.

                                        Type a unique value for each record
                                        to unload from the Field Name.

 8. Click Unl Records.
 9. Select the form, click More or the More Actions icon, and then select Mass

    Unload.

10. Fill in the following fields.

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

                                                                                                                 Page 237 of 307

Field                                   Description
Export Mode — Binary
Export Mode — Text                      Select this option to save the
                                        external file in Service Manager’s
Export Mode — Formatted Text            binary unload format. Only the
                                        Service Manager Database Manager
Form Name                               can read this binary file format.

Dbdict Load Options — Create file if    Select this option to save the
not there, and update if present        external file in Service Manager’s
                                        text format. This format is human
                                        readable but is not intended for
                                        export to other applications other
                                        than Service Manager’s Database
                                        Manager.

                                        Select this option to save the
                                        external file in a user-defined text
                                        format. This format is intended for
                                        export to other applications. If you
                                        select this option, you must type a
                                        valid Service Manager form name in
                                        the Form Name field.

                                        Type the name of the form to use
                                        when exporting records as
                                        formatted text. This option is valid
                                        only when you select the Formatted
                                        Text option. If the text format
                                        description doesn't already exist,
                                        Service Manager prompts you to
                                        create it.

                                        Select this option if the data saved in
                                        this external file should replace
                                        existing data in the target Service
                                        Manager system.


Field                                   Description

Dbdict Load Options — Create file if    Select this option to ignore data
not there, but don't update if present  saved in the external file that already
                                        exists in the target Service Manager
                                        system.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including keys                          existing data in the target Service
                                        Manager system including the
                                        database keys.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including SQL mapping                   existing data in the target Service
                                        Manager system including the
                                        database SQL mapping.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including keys AND SQL mapping          existing data in the target Service
                                        Manager system including the
                                        database SQL mapping and the
                                        database keys.

Record Load Options — Add/update        Select this option if the records
records                                 saved in this external file are to
                                        replace any existing records in the
                                        target Service Manager system.

Record Load Options — Only add          Select this option to ignore records
new records                             saved in the external file that already
                                        exist in the target Service Manager
                                        system.

 11. Click Unload/export.
     Service Manager saves the select records to an external file.

Related topics


Data maps
Exporting records
Export descriptor records
Unload files
Importing records
Purging and archiving records
Unload script utility
Load/unload implications of case-sensitivity
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
Update an export descriptor record
Unload error messages
Load error messages and notifications


1.7.10.4.23. Update an export descriptor
record

Applies to User Roles: System Administrator
To update an export descriptor record:

   1. Select the records to export.
   2. From the file.prompt.dbu.g form, also known as the unload/export utility, click

     Export Ext.
   3. If Service Manager displays a list of existing export descriptor records, select

     the export descriptor record to use.
   4. Click Edit Record.

   5. Fill in the following fields.

Field                                                                                     Service Manager 9.81
Export Descriptor Record
File Name                               Description
Format Control Record Name
                                        Type the name used to identify this
Field Names                             record uniquely.

Field Type                              Type the name of the Service
                                        Manager table used to export
                                        records.

                                        Type the name of the optional
                                        Format Control record to use with
                                        the export process. This Format
                                        Control record determines how
                                        Service Manager formats exported
                                        records.

                                        Type the database dictionary name
                                        of the Service Manager field used to
                                        export records. If the field is part of
                                        a structure, include the structure
                                        name before the field name. If the
                                        field is part of an arrayed structure,
                                        you only need to type the field
                                        name.

                                        Service Manager fills in the value of
                                        this field automatically based on the
                                        database dictionary definition of the
                                        field. You don't need to manually
                                        type any information in this field.

       Field                                                                              Service Manager 9.81
       Start Pos
                                        Description
       Fld Lng
       Array Type                       Type the number of space
       Array Occ                        characters between the start of a
                                        line and the information Service
This PDF was generated on May 23, 2026  Manager exports from the selected
                                        field. This information determines
                                        which column and line number used
                                        to export the field information. Most
                                        external files use a standard of 80
                                        characters per line. If you type a
                                        value greater than 80 then each
                                        record uses multiple lines.

                                        Type the number of characters
                                        Service Manager has to write
                                        information from the exported field
                                        into the external file.

                                        Service Manager fills in the value of
                                        this field automatically based on the
                                        database dictionary definition of the
                                        field. You don't need to manually
                                        type any information in this field.

                                        Type the number of elements from
                                        an array to be exported for this field.
                                        You can use the Array Occ value to
                                        determine the start position of the
                                        next field. For example, if you want
                                        to export five elements from an array
                                        and you allocated 80 character
                                        spaces per element, this field
                                        requires a total of 400 character
                                        spaces. The next field should start
                                        more than 400 characters spaces
                                        from the start of the file.

                                                                                                                 Page 243 of 307
       Field                                                                              Service Manager 9.81
       Date Format
                                        Description
   6. Click Save.
                                        Type the date and time format for
Related topics                          date and time fields. You can use the
                                        following tokens to represent units
Data maps                               of time:
Exporting records                       dd — two digit day
Export descriptor records               mm — two digit month
Unload files                            yy — two digit year
Importing records                       yyyy — four digit year
Purging and archiving records           hh — hours
Unload script utility                   ii — minutes
Add an export descriptor record         ss — seconds
Export a record list to a text file     You can use any character to
Export a record list to an Excel file   separate these tokens. For example,
                                        mm/dd/yyyy hh:ii:ss exports dates
This PDF was generated on May 23, 2026  and times with slashes between the
                                        month, day, and four-digit year and
                                        colons between the hours, minutes,
                                        and seconds.
                                        Note: If you don't include a time
                                        format, then Service Manager
                                        doesn't export any time information.

                                                                                                                 Page 244 of 307

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
Unload error messages
Load error messages and notifications
````
