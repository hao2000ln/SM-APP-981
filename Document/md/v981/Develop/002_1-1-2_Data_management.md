---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.2 .. 1.1.2.2
printed_pages: 32-57
---

# 1.1.2 Data management

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.2. Data management

These topics focus on data management within the system. The main utilities that
comprise data management are:

     Cascade updates — alters the data in one or more dependent files to match
     changes made to data in a source file.
     Data Policy — applies values, sets mandatory fields, and validates at the table
     level.
     Data validation — defines a field’s valid values.
     Global lists — predefined lists within the system.
     Customizing the Help system — provides administrators with instructions on
     how to customize the online Help system.
     Sequential numbers — used in conjunction with Format Control to generate
     sequence numbers for records in a database.
     Stored queries — retrieves and displays information by using predefined search
     parameters.

Related topics

Tailoring
Cascade Updates
Data Policy
Data validation
Global lists
Sequential number setup
Stored queries


1.1.2.1. Fields and Keys tab

The Fields and Keys tab describes the properties of all fields and keys in a Service
Manager table. For administrators, this tab gathers field-related tasks into a central
point of access.

The Fields and Keys tab contains the following sections and links. Some sections or
links may not appear unless they relate to the selected field.

Fields section

View, add, delete, or edit a field or array. A question mark decorator on the field icon
indicates that there is a default help record for the field.

Button or property                      Button functionality         Comments
New field
                                        Create a field in the tree.  Each field must a have
Delete                                                               Service Manager data
New array                                                            type. To create a new
                                                                     array use the New Array
Search field                                                         option first and then add
                                                                     fields to the array.

                                        Remove a field.              Unavailable if the table
                                                                     contains records or the
                                                                     field is a key.

                                        Create an array and a        You must choose a type
                                        child node (inner field)     for the child node after
                                        that has the same name       you save the array.
                                        and an unspecified data
                                        type.

                                        Search for a field or alias  Look for the field by
                                        that contains a specified    name, partial name,
                                        string value.                index value, alias, or
                                                                     Web Services API name.

Keys section
View, add, delete, or edit keys.


Button or property                      Button functionality   Comments
New
                                        Create a new empty key. You must choose a key
Delete                                                                 type after you save it.
Up
                                        Remove a key.
Down
                                        Move the key position  Not available for the first
                                        up.                    key.

                                        Move the key position  Not available for the last
                                        down.                  key.

General properties section (fields and arrays)

View or edit the Service Manager definition of fields and arrays. The System
Definition utility displays these properties when you select a field.


Button or property                      Button functionality        Comments
Name
Type                                    Unique field name.

Index                                   Specify the Service         The Service Manager
Caption                                 Manager data type of the    data types are
                                        field.                      abstractions of the
Unique in domain                                                    RDBMS data types.
Rename the field
                                        Identifies the order field  The index of an unsaved
                                        within the Service          field is -1 until you save
                                        Manager definition.         the field.

                                        Specify an optional         Forms Designer uses this
                                        default label for this      value to create default
                                        field.                      column labels and chart
                                                                    titles. If you omit this
                                                                    information, Forms
                                                                    Designer creates a
                                                                    caption from the field
                                                                    name.

                                        Appears only for a field
                                        in a structured array.

                                        Click to change the field   If Service Manager has
                                        name. Proceed with          add permissions on the
                                        caution. Renaming a field   back-end RDBMS, it
                                        can invalidate existing     automatically creates the
                                        queries.                    new field. Alternatively,
                                                                    the Service Manager
                                                                    administrator can
                                                                    provide the RDBMS
                                                                    administrators with DDL
                                                                    for field name change.


Button or property                      Button functionality        Comments
Create/Edit default help
on this field                           Click to open the field
                                        Help Editor where you
Search for specific help                can view, add, delete, or
on this field in forms.                 edit field Help content.
                                        Service Manager
                                        accesses this help
                                        record whenever the
                                        field appears in a form.

                                        Link to the field Help
                                        Editor where you can
                                        click Search to view a
                                        list of other help records
                                        that will override the
                                        default help record for
                                        the field. The best
                                        practice is to create only
                                        one help record for each
                                        field. If you customize
                                        the same definition for
                                        each form where the
                                        field appears, field help
                                        maintenance increases
                                        dramatically.

General properties section (keys)

View or edit the Service Manager definition of keys. The System Definition utility
displays these properties when you select a key.


Button or property                      Button functionality          Comments
Type
                                        Specify the data type of      Be sure to understand
Add                                     the key.                      the data in the field
                                                                      before you change the
                                                                      Service Manager field
                                                                      type so that you can
                                                                      select a compatible data
                                                                      type. Hewlett-Packard
                                                                      recommends that you
                                                                      don't change the data
                                                                      type for any unique keys
                                                                      in out–of–box tables.

                                        Add a field to the key        If Service Manager has
                                        from a list of valid fields.  add permissions on the
                                                                      back-end RDBMS, it
                                                                      automatically creates a
                                                                      new index based on the
                                                                      key. Alternatively, the
                                                                      Service Manager
                                                                      administrator can
                                                                      provide the RDBMS
                                                                      administrators with DDL
                                                                      for the new index.


Button or property                      Button functionality     Comments
Remove                                  Remove a field from the
                                        key.                     If Service Manager has
Up                                                               add and drop
                                        Move the field up one    permissions on the back-
                                        level within the key.    end RDBMS, it
                                                                 automatically removes
                                                                 the existing index
                                                                 corresponding to the key
                                                                 and creates a new index.
                                                                 Alternatively, the Service
                                                                 Manager administrator
                                                                 can provide the RDBMS
                                                                 administrators with DDL
                                                                 for the new index after
                                                                 the key has been
                                                                 removed.

                                                                 If Service Manager has
                                                                 add and drop
                                                                 permissions on the back-
                                                                 end RDBMS, it
                                                                 automatically removes
                                                                 the existing index
                                                                 corresponding to the key
                                                                 and creates a new index.
                                                                 Alternatively, the Service
                                                                 Manager administrator
                                                                 can provide the RDBMS
                                                                 administrators with DDL
                                                                 for the updated index.


Button or property                      Button functionality        Comments
Down
                                        Move the field down one     If Service Manager has
                                        level within the key.       add and drop
                                                                    permissions on the back-
                                                                    end RDBMS, it
                                                                    automatically removes
                                                                    the existing index
                                                                    corresponding to the key
                                                                    and creates a new index.
                                                                    Alternatively, the Service
                                                                    Manager administrator
                                                                    can provide the RDBMS
                                                                    administrators with DDL
                                                                    for the updated index.

Aliases section
View, add, delete, or rename an alias for a field.

Button or property                      Button functionality        Comments
New
                                        Creates a separate name     Field aliases must be
Delete                                  (alias) that Service        unique within a table.
Rename                                  Manager applications
                                        can use to find the field.

                                        Removes the selected        Deleting an alias doesn't
                                        field alias.                delete the original field.

                                        Renames the selected        Field aliases must be
                                        field alias                 unique within a table.

SQL Mapping section
View or edit the SQL mapping of Service Manager fields in a back-end RDBMS.


Button or property                      Button functionality        Comments
SQL table alias
                                        Type the 3 character        Service Manager uses
SQL field name                          name that Service           this name to look up the
SQL data type                           Manager uses to identify    actual table name from
                                        what type of back-end       the RDBMS.
SQL data length                         RDBMS table the field
                                        definition relates to. For
                                        example, m1 refers to the
                                        first main table and a1 to
                                        the first alias table.

                                        Type the name of the        Make sure that the you
                                        column in the back-end      don't use any special
                                        RDBMS you want to map       characters or reserved
                                        to this field.              words that your RDBMS
                                                                    excludes.

                                        Type the RDBMS data         Do not include the length
                                        type you want to use for    as part of the data type.
                                        this field. You can leave   Use the SQL data length
                                        this value blank for new    field for this information.
                                        fields and Service
                                        Manager will assign a
                                        default data type.

                                        Type the number             Do not include the
                                        characters you want this    RDBMS data type as part
                                        field to use. You can       of the field length. Use
                                        leave this value blank for  the SQL data type field
                                        new fields and Service      for this information.
                                        Manager will assign a
                                        default data length.

Data policy section
View or edit data policy rules for a field.


Button or property                      Button functionality       Comments
Default value
                                        Specify a default value    Not valid for a field in a
Data encrypted                          for the field.             structured array. Enter
Match table                                                        an expression by
Match field                                                        preceding it with a carat
                                                                   (^). For example,
                                                                   ^operator() specifies that
                                                                   the field contains the
                                                                   current user log-on
                                                                   name.

                                        Encrypt the data in the    Not valid for a field in a
                                        field.                     structured array.

                                        Specify the name of a      Not valid for a field in a
                                        table that has a key       structured array.
                                        relationship with the new
                                        field.

                                        Specify the name of the    Not valid for a field in a
                                        field within the match     structured array.
                                        table that has a key
                                        relationship.

Editing rules section

Describes the rules for viewing or editing a field. Specify true, false, or a Boolean
expression.


Button or property                      Button functionality          Comments
Mandatory                                                             Not valid for a field in a
Validation rule                         The field must appear if      structured array.
                                        the value is true.            Not valid for a field in a
Read-only                                                             structured array.
Invisible                               Specify the Boolean
Available in lists                      expression that must be       Not valid for a field in a
                                        true for the field to         structured array.
                                        appear.                       Not valid for a field in a
                                                                      structured array.
                                        The field can't change if
                                        the value is true.            Not valid for a field in a
                                                                      structured array.
                                        The field must not
                                        appear if the value is
                                        true.

                                        The field must appear in
                                        a list if the value is true.

Structured array properties

Create a separate table that you can access independently. For example, the
computer table contains structured arrays that you can access directly through
System Definition > Table Editor.


Button or property                      Button functionality       Comments
Separate table
Unique table                            Check to create a table    Valid only for a field in a
                                        that you can access        structured array.
Attribute table                         through the Table
                                        Definition section of the
                                        System Navigator.

                                        The name of the            Valid only for a field in a
                                        separated table. This      structured array.
                                        name is
                                        parent_table_name+stru
                                        ctured_array_name+uniq.
                                        For example,
                                        computerdriversuniq.

                                        The name of the attribute  Valid only for a field in a
                                        table. This name is        structured array.
                                        parent_table_name+stru
                                        ctured_array_name+attr.
                                        For example,
                                        computerdriversattr.

IR properties

View or edit information retrieval rules for the table. This section appears only when
you select the IR key definition for the table.


Button or property                      Button functionality      Comments
Condition
                                        Specify a Boolean
Detail form                             expression that must be
                                        true if a table is
List form                               searchable.
Return field
                                        Specify the form that
                                        displays any record in
                                        the list generated by a
                                        query.

                                        Specify the form that
                                        displays the record list
                                        generated by a query.

                                        Specify the name of the
                                        field to be written back
                                        to the data source.

If you make any changes to fields or keys, click Save.


1.1.2.1.1. Add a field to a table

Note: You must use the Windows client whenever you need to add a new field/key to
a database dictionary table.

   1. From the System Navigator, click Tailoring > Database Dictionary.

   2. Place the cursor in the File Name field, and then click Search.

   3. Select any table from the record list.

   4. Click the Fields tab.

   5. Place the cursor in a type structure to add a field to the structure.

   6. Click New Field/Key.

   7. Specify information for all required fields.

     • Choose a data Type from the list. For an array, choose the appropriate data
     type if all elements are the same type. Otherwise, choose Text for an array of
     different data types, or choose Structure for an array of structures.
     • Type a field Caption.
     • Click Rename field if you decide to change the name of the field.
     • Specify Data policy settings as needed for Default value, Validation rule, and
     Data encrypted (encryption status).
     • Specify Match table and Match field values to define or enforce foreign key
     relationships. For example, you can specify that the contact.name field in one
     table must match a valid contact.name field from another table.
     • Specify Editing rules (display properties) for Mandatory display, Read-only,
     Availability, and Invisibility.
     • If necessary, specify one or more Alias fields with a different name but the
     same index, level, and type as a selected field.

   8. Click Save.

Tip: You can edit any field or key directly from the System Navigator. Double-click the
field or key to view the details with the Table Editor.

Related topics

System Definition
Table tab
Fields and Keys tab


Edit a field in a table
Edit a record key


1.1.2.1.2. Edit a field in a table

Note: You must use the Windows client whenever you need to add or edit a field/key
in a database dictionary table.

   1. From the System Navigator, click Tailoring > Database Dictionary.
   2. Place the cursor in the File Name field and click Search.
   3. From the System Definition utility overview, click the Fields tab.
   4. Click Edit Field/Key.
   5. If necessary, click the plus sign (+) to expand array structures.
   6. Click a field to view its general properties, data policy, and editing rules on the

     right side of the window. Add or update any of the following settings.


Field                                   General properties

                                                 Description

Type                                    You can change the type if the field

                                        is one of these types:

                                        Boolean
                                        Date time
                                        Decimal
                                        Text

Caption                                 Changing the data type can produce
Rename the field                        unpredictable results. Proceed with
                                        caution.
Create (or Edit) default help on this
field                                   Field caption
Search for specific help on this field
in forms                                You can rename the field; however,
                                        proceed with caution. Renaming a
                                        field can invalidate existing queries.

                                        Create a new Help record or edit the
                                        existing Help record.

                                        You can search for an existing field
                                        help topic to apply to this field. Click
                                        Search to generate a record list of
                                        available field help topics.


Field                                   Aliases
New
Delete                                      Description
Rename
                                            Click New, type a new alias name,
                                            and click OK.

                                            Select an existing alias and click to
                                            remove it.

                                            Select an existing alias, click
                                            Rename, type a new alias name, and
                                            click OK.

Field                                   Data policy

                                              Description

Default value                           A default value for the field is
                                        optional.

Data encrypted (encryption status). Select or clear the checkbox.

Match table                             Define or enforce foreign key
Match field                             relationships. For example, you can
                                        specify that the contact.name field
                                        in one table must match a valid
                                        contact.name field from another
                                        table.


Field                                   Editing rules
Mandatory
Validation rule                                Description
Read-only
Invisible                                      Type true if the field must appear on
Available in lists                             the form.

                                               Specify a condition that's true or
                                               false.

                                               Type true if users can't change the
                                               field value.

                                               Type true if the field should be
                                               invisible.

                                               Type true if the field should appear
                                               in a list.

   7. If you make any updates, click Save.

Tip: You can edit any field or key directly from the System Navigator. Double-click the
field or key to view the details with the System Definition utility.

Related topics

Fields and Keys tab
Add a field to a table
Edit a record key


1.1.2.1.3. Edit a record key

Applies to User roles: System Administrator

We recommend that you don't change the data type for any unique keys in out–of–
box tables.

To edit a record key:

   1. Click Tailoring > Database Dictionary.
   2. Type a file name and then use search to find the table.
   3. Select a record to edit.
   4. Click the Keys tab to edit.
   5. Click a key to view or change its general properties.

           Change the key type as needed. Proceed with caution if you change the
           key type to a more restrictive value.
           Click Add or Remove to change the content of the key.
           For IR keys, you can also edit the associated IR properties.
   6. To add a key, click New. A new key position appears in the Keys tree structure.
   7. To remove a key, click Delete.
   8. If a key is eligible to change position, click Up or Down.


1.1.2.1.4. Update the size of a field

Applies to User Roles:
System Administrator
To update the length of a field in a table:

   1. Click Tailoring > Database Dictionary.
   2. Type the name of the table in File Name. For example, use rootcause to update

     the size of a field in this table.
   3. Click Search.
   4. Select the field to update, dump for example.
   5. Change the field SQL type from VARCHAR(30) to VARCHAR(100), for example.
   6. Click OK.


1.1.2.2. Cascade Updates

The Cascade Update utility allows Administrators to maintain database integrity and
consistency by altering or deleting the data in one or more dependent files to match
changes made to data in a source file.

For example, incident records are linked to the contacts table by the contact name
(probsummary, contact.name = contacts, contact.name). If someone were to edit the
contact record and change contact.name, the associated incident records would lose
their link and become orphaned. You could set up a Cascade Update record to
monitor the contact.name field in contacts and change the contact.name field in
related incident records to match accordingly.

Cascade Update example

In this Cascade Update example DEFAULT HQ has moved and now needs to update all
of their contact records to reflect the new location "DEFAULT CORPORATE". Use the
Cascade Update Utility to automatically update all DEFAULT HQ contact records when
the location has been updated in the DEFAULT HQ location record.

There are two phases to make this happen:

     Add a trigger record.

     Add a Cascade Update Configuration record.

   1. Set a trigger to monitor the location file and call the RAD application,
     cascade.update.wrapper, when the location record is updated (After Update) in
     the location file.

   2. Configure a Cascade Update Configure Record to update the location in all
     contact records associated with that same location.

   3. Test the Cascade Update.

Create a Cascade Delete

To set up a Cascade Delete between two related tables (for example, probsummary
and problem):

   1. Open the erddef table using Database Manager.

   2. Select or create the erddef record that defines the relationship between the two
     tables.


   3. Select the Cascade Delete option.
   4. Save and Exit.

Alternatively, you can use the Cascade Update tool and follow the instructions in that
tool to set up the Cascade Deletes there.

Create a Cascade Update

To create a Cascade Update:

   1. Create a trigger record to monitor the source table.
   2. Create a Cascade Update configuration record to set parameters for the update.

Create a Cascade Update/Delete Configuration
Record

   1. Click Tailoring > Tailoring Tools > Cascade Updates.
   2. Click Search.

     A list of cascade update/delete configuration records opens.
   3. Select a configuration record to open it.
   4. Fill in all necessary fields.

     Note: For more detailed information on the fields, insert your cursor in that field
     and press Ctrl+H.
   5. Click Save to save changes to an existing record.
     Caution: If you are attempting to add a new record from an existing record,
     make sure that you don't click Save because doing so will replace the existing
     record with the new record. If you are adding a new record, click Add.
   6. Click Add to add a new record.

Create the example Cascade Configuration Record

   1. Click Tailoring > Tailoring Tools > Cascade Updates.
     The Cascade Update/Delete Config Record opens.

   2. Type the following information in the Cascade Update/Delete Config Record:
          • Name: location
          • Type: After Update (Configuration Rules)


          • Target File: contacts
          • Execute Condition: location in $L.new~=location in $L.old
          • Update Type: Cascade Update
          • Source Key: location
          • Target Key: location
          • Source Fields: location
          • Target Fields: location

   3. Click Add.
     Service Manager displays the message: Cascade Update Config record
     updated.

Create the example trigger record

   1. Click Tailoring > Database Manager.

   2. In the Form field, type: triggers

   3. Press Enter.
     The trigger record opens.

   4. Type the following information in the triggers record:

          • Trigger Name: update.contact.location
          • Table Name: location
          • Trigger Type: 4 - After Update
          • Application: cascade.update.wrapper

     If you are configuring a Cascade Update for device records, type
     am.cascade.update.wrapper in the Application field. This wrapper works with
     the device joindef files.

   5. Click Add.
     The message line indicates that the trigger record was added.

Test the example Cascade Update

   1. Click Tailoring > Database Manager.

   2. In the Form field, type the following: contacts

   3. Press Enter.
     Service Manager displays a list of forms matching your search criteria.

   4. Double-click contacts. The contacts.g form opens.


 5. Click Search.
    Service Manager displays a list of all contact records.

 6. From the pull-down options menu, select Modify columns.
 7. Use the drop-down arrow to change the company field to location.
 8. Click Proceed.
 9. Click in the heading of the location column to sort the list so that all contacts

    with the same location are shown together.
10. Open a second session of Service Manager.
11. Click Tailoring > Database Manager.
12. In the Form field, type the following: =location .
13. Click Search or press Enter. The Search location records form opens.
14. Click Search.

    Service Manager displays a list of all location records.
15. Double-click on an ACME HQ record in the record list.

    The ACME HQ location details form opens.
16. Change the location by typing ACME CORPORATE in the Location field.
17. Click Save.

    Service Manager displays the message: location record updated.
18. Revert to the first session of Service Manager, which is still showing the record

    list of contact records.
19. Click Refresh.
20. All of the ACME HQ locations are now ACME CORPORATE.
````
