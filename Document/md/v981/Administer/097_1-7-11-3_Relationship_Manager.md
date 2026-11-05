---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.11.3 .. 1.7.11.3
printed_pages: 2436-2446
---

# 1.7.11.3 Relationship Manager

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.11.3. Relationship Manager

Relationship Manager is a tool that can automatically discover entity relationships between tables and fields in your Service
Manager system by querying the erddef, link, and relatedObjectMap tables, and then save the results in the relation table. It
also enables you to manually create relationships and manage them.
Also, Relationship Manager provides output that's consumed by the Missing Reference Report utility and Entity Relationship
Diagram utility.

            Note

           To use Relationship Manager, you must have the SysAdmin capability word.

Using Relationship Manager, you can perform the following tasks:

     Automatically trigger a reload of all relationships in your system. See Build relationships .
     Find entity relationships for tables and fields with other tables. See Search for relationships between specific tables and
     fields.
     Manually add relationships. See Add a relationship record.
     Update invalid or fixed relationships. See Update an invalid or fixed relationship.
     Update the relationship definition of a relationship record. See Access the relationship definition of a relationship record.

Related topics

Missing Reference Report utility
Entity Relationship Diagram utility


1.7.11.3.1. Build relationships

Applies to User roles: System Administrator

Relationship Manager can discover all relationships that are defined by the erddef, link, and relatedObjectMap tables. When
upgrading to or installing the Service Manager applications, the Build Relationships functionality is automatically executed to
load all relationships and save them in the relation table. When the Build Relationships functionality is executed, the
following rules apply:

     Relationships that were manually created are retained, and all other previously built relationships are cleared and then
     rebuilt.
     Duplicate relationships from multiple sources are saved, and identified by the unique key, id.

     Relationship Manager generates a pair of relationship records for both relationship directions from one erddef definition.
     See the following table for an example.

Source Table  Source Field              Target Table  Target Field  Definition Type  Relationship
category      name                      probsummary   category      erddef           One to Many
probsummary   category                  category      name          erddef           Many to One

Relationships without a SQL name for any of the Source Table, Source Field, Target Table, or Target Field fields are
saved as an invalid relationship. The following figure shows an example, in which the source field uses a variable.

     Links that have a post expression are saved with the Has Post Expression field set to true.
     The Enable Data Reference Check setting (true or false) is retained when rebuilding each relationship. See Skip data
     reference checking for a relationship.
     While relationships are being built, messages are displayed, showing the building progress. If an error occurs, you are
     prompted to fix it and retry.

There may still be times when your system contains outdated relationship records. The Build Relationships option allows you
to manually trigger a reload of all relationship records in your system. To manually build relationships, follow these steps:

   1. Navigate to Tailoring > Tailoring Tools > Relationship Manager to open Relationship Manager.

   2. Click the Build Relationships button.

     Service Manager starts to purge all relationships that were not manually created, and then reload all the relationships in
     your system. This process may take a while. When the building process is complete, a "done" message is displayed.

     If an error occurs, you are prompted to fix it and retry.

Once all relationships are discovered and saved in the relation table, you can search for all relationships or relationships
between specific tables and fields. See Search for relationships between specific tables and fields.

Related topics

Relationship Manager
Search for relationships between specific tables and fields


Skip data reference checking for a relationship


1.7.11.3.2. Search for relationships between specific tables
and fields

Applies to User roles: System Administrator
In Relationship Manager, you can search for relationships by one or more of the following fields: Table Name, Field Name,
Definition Type, and Status.
To search for relationships between specific tables and fields, follow these steps:

   1. Navigate to Tailoring > Tailoring Tools > Relationship Manager to open Relationship Manager.
   2. In the Table Name field, type the name of either the source or the target table. For example, operator.
   3. In the Field Name field, type the name of a field in the table you specified. For example, name.
   4. In the Definition Type field, select a definition type: link, erddef, relatedObjectMap, or manual.
   5. In the Status field, select a status: new, invalid, or fixed.
   6. Click Search.

     A list of records is displayed, showing the relationships between the specified field and fields in other tables.

                   Note

                You can also perform a search by leaving some or all of the search fields empty. We strongly recommend
                that you review all relationships to ensure they are correct, because some other features (such as the Entity
                Relationship Diagram utility and the Missing Reference Report utility) heavily rely on the correctness of your
                relationship records.

   7. Double-click a record from the list to open the details page and view the details.
     A relationship record may contain the following fields.


Field                                   Description                           Notes
Source Table
                                        One of the following fields
Source Field                            depending on the definition type of
                                        the relationship record (see
Relationship Type                       Definition Type in this table):
Target Table
                                             First Filename in the erddef
Target Field                                 definition
                                             Name in the link definition
                                             Source Table in the
                                             relatedObjectMap definition

                                        One of the following fields           System-generated
                                        depending on the definition type of
                                        the relationship record:

                                             Field Names from First
                                             Filename in the erddef
                                             definition
                                             Source Field Name in the link
                                             definition
                                             Source Field in the
                                             relatedObjectMap definition

                                        The type of the relationship. It can
                                        have one of the following values:

                                             One to Many
                                             Many to One
                                             One to One
                                             Many to Many

                                        One of the following fields
                                        depending on the definition type of
                                        the relationship record:

                                             Second Filename in the erddef
                                             definition
                                             Target File Name in the link
                                             definition
                                             To Table in the
                                             relatedObjectMap definition

                                        One of the following fields
                                        depending on the definition type of
                                        the relationship record:

                                             Field Names from Second
                                             Filename in the erddef
                                             definition
                                             Target Field Name in the link
                                             definition
                                             To Field in the
                                             relatedObjectMap definition


Field                                   Description                             Notes
Definition Type
                                        The type of the relationship            System-generated
Status                                  definition, which indicates how the
                                        relationship is defined:
Has Post Expression
                                             link: the relationship is defined
Source SQL Table                             in a link record.
Source SQL Field                             erddef: the relationship is
Target SQL Table                             defined in an erddef record.
Target SQL Field                             relatedObjectMap: the
                                             relationship is defined in a
                                             relatedObjectMap record.
                                             manual: the relationship is
                                             manually defined.

                                        The status of the relationship:         System-generated

                                             new: the relationship was
                                             automatically created and
                                             contains valid data.
                                             fixed: the relationship was
                                             manually created or updated
                                             and contains valid data.
                                             invalid: the relationship was
                                             automatically created and
                                             contains invalid data (any of
                                             the SQL table names or SQL
                                             field names can't be found).

                                        Indicates if the link record of the     System-generated
                                        relationship has a post expression
                                        defined. Applicable only for
                                        relationships whose definition type
                                        is link:

                                             true
                                             false

                                        Note

                                        A post expression is an
                                        expression that's
                                        executed after the link
                                        function is triggered by
                                        clicking Fill.

                                        The SQL Table name of the source        System-generated
                                        table                                   System-generated
                                                                                System-generated
                                        The SQL Name of the source field        System-generated

                                        The SQL Table name of the target
                                        table

                                        The SQL Name of the target field


Field                                   Description                            Notes
Definition Query                                                               System-generated
                                        The query of the relationship
                                        definition

                                                    Note

                                                   This field is empty if the
                                                   relationship is manually
                                                   created.

Enable Data Reference Check             This option indicates if this          System-generated
                                        relationship is skipped when you run
                                        a data reference check against its
                                        source file or target file:

                                             If this option is selected: not
                                             skipped
                                             If this option is not selected:
                                             skipped

                   Note

                You can use one of the following methods if you have any invalid relationships:

                      Update its relationship definition using the Goto Definition button. See Access the relationship
                      definition of a relationship record.
                      Add a new relationship for it by using the Copy button. See Add a relationship record.
                      Update the relationship if the Definition Type is link. See Update an invalid or fixed relationship.

Related topics

Relationship Manager
Access the relationship definition of a relationship record
Add a relationship record
Update an invalid or fixed relationship


1.7.11.3.3. Access the relationship definition of a relation
record

Applies to User roles: System Administrator
For relationships whose Definition Type is not manual, Relationship Manager provides a Goto Definition button, which
enables you to view the relationship definition and update it if needed.

            Note

           Manually created relationships, that is, relationships whose Definition Type is manual, don't have a Goto
           Definition button.

To access the relationship definition of a relationship, follow these steps:
   1. Navigate to Tailoring > Tailoring Tools > Relationship Manager.
   2. Complete the Table Name and Field Name fields.

                   Note

                This step is optional. You can leave one or both of the fields empty.

   3. Click Search. A list of relationships is displayed.
   4. Select the relationship record from the list, and click Goto Definition in the toolbar of the relationship detail pane.
   5. View the relationship definition, and perform any of the following tasks if needed:

           Update the relationship definition and then click Add to save it as a new relationship definition.
           Update the relationship definition and click Save to save your changes to the existing relationship definition.
           Click Delete to delete the relationship definition.

Related topics

Relationship Manager


1.7.11.3.4. Add a relationship record

Applies to User roles: System Administrator
Relationship Manager allows you to manage not only relationships that are defined by the erddef, link, and relatedObjectMap
tables, but also relationships that you manually create. You can manually add a relationship record, and then update it or
delete it as needed.

            Note

           Manually created relationship have a Definition Type of manual. You can update or delete this type of
           relationships .

To add a relationship record, follow these steps:
   1. Navigate to Tailoring > Tailoring Tools > Relationship Manager to open Relationship Manager.
   2. In the Table Name field, type the name of the table for which you want to add a relationship. For example, operator.
   3. (Optional) Enter other search fields as needed.
   4. Click Search to display a list of relationships.
   5. Select a record from the list, and click Copy.
   6. Change the values of the following fields as needed: Source Table, Source Field, Target Table, and Target Fields.
   7. Click Add. Service Manager adds the relationship record.

                   Caution

                If your input contains wrong data, data validation fails and the system doesn't add the record.

     The Relationship Type and Status fields are automatically populated with manual and fixed, respectively.
   8. The Data Reference Check option is automatically selected. If you want to skip this relationship for data reference

     checking, click Skip Data Reference Check, and then click Save. See Skip data reference checking for a relationship.
   9. Verify the new record. To do so, click OK to return to Relationship Manager. Perform a search to locate the record you

     added. The record should have the following values:
     • Relationship Type: manual
     • Status: fixed
 10. If needed, you can further update the record, and then click Save.
 11. If you no longer want to keep the record, click Delete to delete it.

Related topics

Relationship Manager
Update an invalid or fixed relationship


1.7.11.3.5. Update an invalid or fixed relation

Applies to User roles: System Administrator
In Relationship Manager, you can update only relationship records that have either of the following:

     a Status of invalid and Definition Type of link
     a Status of fixed

            Note

           You can't update a relationship whose status is new.

To update a relationship record, follow these steps:
   1. Navigate to Tailoring > Tailoring Tools > Relationship Manager to open Relationship Manager.
   2. Optionally, enter or select a value in the Table Name and Field Name fields.
   3. In the Status field, select fixed or invalid.
   4. If you selected invalid in the Status field, select link in the Definition Type field.
   5. Click Search. A list of relationships is displayed.
   6. Select the record that you want to update, and update the relationship record as needed.
   7. Click Save to save your changes.
     If the record had an invalid status, it now changes to a fixed status. If it had a fixed status, the status doesn't change.

                   Caution

                If your input contains incorrect data, data validation fails and the record is not updated.

                   Note

                If you no longer want to keep the record, click Delete to delete the record.

Related topics

Relationship Manager
Add a relationship record
Access the relationship definition of a relationship record
Build relationships
````
