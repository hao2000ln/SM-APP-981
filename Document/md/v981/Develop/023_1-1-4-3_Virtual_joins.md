---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.4.3 .. 1.1.4.4
printed_pages: 596-628
---

# 1.1.4.3 Virtual joins

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.4.3. Virtual joins

Virtual joins allow you to display data fields from several different database files on a
single form. Virtual joins don't allow data entry into the joined fields; they only display
information from other files into a format for reference purposes.

Virtual joins can be used on any format. They are established when data from a
record is displayed without the need to use the Find and Fill functions of the link
utility.

You create a virtual join by adding a subform to any form, and displaying the desired
data there.

Related topics

Understanding subforms
Example: Creating a virtual join
Build the sales form
Create the sales file
Create the sales record list
Add data to the sales file
Create the sales1 subform
Create the orders form
Build the virtual join into the form
Build the link
Use the virtual join
Verify that the sales1 form works


1.1.4.3.1. Understanding subforms

Subforms allow the creation of multi-part forms, where sections of the form can be
reproduced in other forms. These modular forms enable the simultaneous display of
data from numerous database records via virtual joins. Subforms are also useful in
constructing multiple views of the same subform data, for example, Incident
Management views.

You construct subforms the same way as standard forms, with the exception that you
create them to appear within another, larger, form. Subforms can be micro versions of
larger forms, containing specific key information that's valuable for display on other
forms. For example, Configuration Management subforms that appear on incident
record forms.

You can create a subform on any form as long as it is properly placed using Forms
Designer. Data from a record can open in a subform automatically or through the use
of the Find and Fill function keys of the Link utility.

Related topics

Virtual joins
Forms Designer
Example: Creating a virtual join
Build the sales form
Create the sales file
Create the sales record list
Add data to the sales file
Create the sales1 subform
Create the orders form
Build the virtual join into the form
Build the link
Use the virtual join
Verify that the sales1 form works
Subform control


1.1.4.3.2. Example: Creating a virtual join

Applies to User roles: System Administrator

The tasks listed below illustrate the steps involved in retrieving data from a file called
sales and displaying data in a form called orders.

The forms and subforms that you need to build to create a virtual join include:

     sales: You create the main sales form, and then you create a database
     dictionary file so data can be entered through the form and recorded to the
     database. The file in the database associated with this form is the target file
     from which data will be retrieved to display in the orders file.
     sales1 subform: When you create the sales1 subform, it is a copied and modified
     version of the original form (sales). It is already associated with the sales
     database dictionary record.
     orders: When you create the orders form, you will add fields for customer name,
     contact, phone number, and order amount.

Note: Code must be a single Unique key (not concatenated) in the target file. Also,
the source and target fields must be scalar (non-array).

To complete building the necessary forms and creating the virtual join in order to
retrieve data from the sales file and display data in the order forms, perform the
following tasks:

   1. Build the sales form
   2. Create the sales file
   3. Create the sales record list
   4. Add data to the sales file
   5. Create the sales1 subform
   6. Create the orders form
   7. Build the virtual join into the form
   8. Build the link
   9. Verify that the sales1 form works

Related topics

Virtual joins
Understanding subforms
Build the sales form
Create the sales file


Create the sales record list
Add data to the sales file
Create the sales1 subform
Create the orders form
Build the virtual join into the form
Build the link
Use the virtual join
Verify that the sales1 form works


1.1.4.3.2.1. Build the sales form

Applies to User roles: System Administrator
When you create the main sales form, you need to create a database dictionary file so
data can be entered through the form and recorded to the database.

   1. Click Tailoring > Forms Designer.
   2. Type sales in the Form field, and then click New.
   3. Click No at the Forms Wizard prompt. A new blank form opens.
   4. Using the Label tool, add a title across the top. For example, Sales Personnel

     Information.
   5. Create two tabs by selecting the Notebook button. Name the front tab

     Name/Code and the back tab Manager/Commission by changing the Caption
     property.
   6. Select the Name/Code tab and do the following:

          a. Add a Text box and place a Label called Sales Code.
          b. Place a Text box next to the Label with the input value code.
          c. Add a Text box and place a Label called Seller Name.
          d. Place a Text box next to the Label with the input value name.
          e. Add a Combo Box. Place a Label called Location and add a list of at least
          four city names in both the Displaylist and Valuelist fields.
          f. Place a Combo Box next to the Label with the input value commission.
          g. Add a Text box and place a Label called Sales Commission %.
          h. Place a Text box next to the Label with the input value commission.
   7. Select the Manager/Commission tab. Add a Text box and place a Label called
     Manager. Next, place a Text box next to the Label with the input value manager.
   8. Click OK to confirm the new form.
   9. Click OK again to exit Forms Designer and save your new form.

Related topics


Virtual joins
Understanding subforms
Forms Designer
Example: Creating a virtual join
Create the sales file
Create the sales record list
Add data to the sales file
Create the sales1 subform
Create the orders form
Build the virtual join into the form
Build the link
Use the virtual join
Verify that the sales1 form works
Subform control


1.1.4.3.2.2. Create the sales file

Applies to User roles: System Administrator
To create the sales file:

   1. Sign in to the Service Manager Windows client.
   2. Click Tailoring > Forms Designer.
   3. In the Form field, type sales , and then click Search.
   4. Go to the Detail menu to create a file. Either right-click in the sales form or select

     the Detail menu button in the top right corner, and then select Create File.
   5. Type sales as the filename, and then click OK.

     If the file name is already prepopulated with sales , click OK to confirm.
     This creates a valid sales file. The database dictionary file (dbdict record)
     generates automatically and displays in the System Definition Utility, with the
     exception of the No Nulls key for the location field. It becomes the target file for
     your subform when it appears on other forms.
   6. Click the Fields and Keys tab to see field definitions and keys. It contains one
     key on field "code," which is a type "unique."
   7. In the Keys section, click New.
     Service Manager displays the General section.
   8. In the Type field of the General section, select No nulls, and then click Add.
   9. Select location, and then click OK.
 10. Click Save.
     A warning appears, stating that the pending changes in the keys definitions for
     this dbdict record require a tableregen.
 11. Click OK, and then close the System Definition Utility window.

The main sales data form and file are now complete.

Related topics

     Virtual joins
     Understanding subforms


Forms Designer
Example: Creating a virtual join
Build the sales form
Create the sales record list
Add data to the sales file
Create the sales1 subform
Create the orders form
Build the virtual join into the form
Build the link
Use the virtual join
Verify that the sales1 form works
Subform control


1.1.4.3.2.3. Create the sales record list

Applies to User roles: System Administrator

To create the sales record list:

   1. Click Tailoring > Forms Designer.
   2. In the Form field, type sales.qbe, and then click New.
   3. Click No at the Forms Wizard prompt.
   4. Draw a table on the design space.
   5. Type Code and Location in the Columns field of the Table properties window.

     These are the two database dictionary keys for the sales file.
   6. Type code in the Code column input field.
   7. Type location in the Location column input field.
   8. Click OK to finish.

Related topics

Virtual joins
Understanding subforms
Forms Designer
Example: Creating a virtual join
Build the sales form
Create the sales file
Add data to the sales file
Create the sales1 subform
Create the orders form
Build the virtual join into the form
Build the link
Use the virtual join
Verify that the sales1 form works
Subform control


1.1.4.3.2.4. Add data to the sales file

Applies to User roles: System Administrator

To add data to the sales file:

   1. Click Tailoring > Forms Designer.
   2. In the Form field, type sales, and then click Search.
   3. Click More or the More Actions icon and then select Database Manager.
   4. Create at least two new sales personnel records. Be sure to fill in the fields on

     both tabs.
   5. Click OK to return to Forms Designer.

Related topics

Virtual joins
Understanding subforms
Forms Designer
Example: Creating a virtual join
Build the sales form
Create the sales file
Create the sales record list
Create the sales1 subform
Create the orders form
Build the virtual join into the form
Build the link
Use the virtual join
Verify that the sales1 form works
Subform control


1.1.4.3.2.5. Create the sales1 subform

Applies to User roles: System Administrator

When you create the sales1 subform, it is a copied and modified version of the
original form (sales). It is already associated with the sales database dictionary
record.

To create the sales1 subform:

   1. Click Tailoring > Forms Designer.
   2. In the Form field, type sales, and then click Search.
   3. Click Copy/Rename from the More Actions menu.
   4. Make a copy of the sales form.

        1. In the New Name field, type sales1.
        2. Click Copy in the Format field.
        3. Click OK to confirm the creation of the duplicate form.
   5. Click Design.
   6. Cut the Seller Name label and field, as well as the Sales Commission % label and
     field from the notebook tabs, and then paste them somewhere on the form.
   7. Remove everything from the form except Seller Name and Sales Commission %.
   8. Click OK to confirm changes to sales1.

Related topics

Virtual joins
Understanding subforms
Forms Designer
Example: Creating a virtual join
Build the sales form
Create the sales file
Create the sales record list
Add data to the sales file
Create the orders form
Build the virtual join into the form
Build the link
Use the virtual join
Verify that the sales1 form works
Subform control


1.1.4.3.2.6. Create the orders form

Applies to User roles: System Administrator

To create the orders form:

   1. Click Tailoring > Forms Designer.

   2. In the Form field, type orders, and then click New.

     If you have another form named orders, return to the Form field and rename this
     new form.

   3. Click No at the Forms Wizard prompt.
   4. Select the Frame tool and do the following:

        1. Draw a group on the screen and give it a label name Customer Order.
        2. Draw a frame on the screen for the Customer Order fields.
        3. Add fields and label the form. The inputs for the text box fields are as

           follows:
                 customer.name
                 contact
                 phone.number
                 order.amount

   5. Click OK.

Related topics

Virtual joins
Understanding subforms
Forms Designer
Example: Creating a virtual join
Build the sales form
Create the sales file
Create the sales record list
Add data to the sales file
Create the sales1 subform
Build the virtual join into the form
Build the link
Use the virtual join
Verify that the sales1 form works
Subform control


1.1.4.3.2.7. Build the virtual join into the
form

Applies to User roles: System Administrator
To build the virtual join into the form:

   1. Open the orders form (created in Create the orders form) in Forms Designer.

   2. Click Design.

   3. Select the Group tool and Frame tool to create a frame on the screen where you
     want the seller data to appear. Give it the caption/title Seller Data.

   4. Select the Label tool and create a label named Seller Code.

   5. Select the Comfill tool and create a fillable input field. This enables you to
     choose from a list of seller codes.

   6. In the Property box, type code in the input value and 9 (fill) in the ButtonID
     field. Click Y to confirm the addition.

   7. Click OK to save changes to the form.

Subform placement

   1. Select the Subform tool.

   2. Position the cursor on the screen where you want to begin your virtual join, and
     then create a square where you want the virtually joined subform to appear.

   3. In the Property box for the subform, type code in the Input field.

     The input field value (code) is the same as the previous input field value,
     because a link needs to be established with the target file. The Virtual Join tool
     uses the link with the code key on the sales file to pull in the information
     requested by the sales1 form, namely values for the name and commission
     fields.

   4. Type sales1 in the Form field to indicate which form should appear in the
     subform area.

   5. Click Yes in the Virtual Join field of the Property box to activate the virtual join
     functions on the subform.

   6. Click OK to save changes to the orders form.


     Note: You can't see the subform at this point. The subform data fields don't
     appear until you enter data through the Database Manager.

   7. From the orders form, click More or the More Actions icon and then select
     Create file.

     The Database Dictionary (dbdict) utility opens.

   8. Create an orders file in the database dictionary.

          a. Type orders as the filename, and then click OK. If the name is
          prepopulated with orders, click OK to confirm.

            This creates a valid "orders" file. The dbdict record for it is now displayed
            in the System Definition Utility. In the Fields and Keys tab, you can look at
            field definitions and keys. It contains one key on field "customer.name,"
            which is type "unique."

          b. In the orders file, ensure there is a line for the code field at the bottom of
          the list. If there is not, in the Fields section click New Field, and then create
          a new character field called "code."

          c. Click Save to save your changes.

   9. Close the System Navigator to leave the System Navigator utility and return to
     Forms Designer.

Related topics

Virtual joins
Understanding subforms
Forms Designer
Example: Creating a virtual join
Build the sales form
Create the sales file
Create the sales record list
Add data to the sales file
Create the sales1 subform
Create the orders form
Build the link
Use the virtual join
Verify that the sales1 form works
Subform control


1.1.4.3.2.8. Build the link

Applies to User roles: System Administrator

To build the link record:

   1. Click Tailoring > Forms Designer.

   2. Type orders in the Form field, and then click Search.

     The orders form opens.

   3. Click More or the More Actions icon and then select Link.

     The link record for the orders file opens.

   4. Create a link for the code field. Link the (Seller Code) code field on the order file
     to the (Seller Code) code field on the sales file.

   5. Click Save.
   6. Click Back to exit the link record and return to Forms Designer.

Note: Use $file in virtual join link line queries and $File in fill and find link line queries.

Related topics

Virtual joins
Understanding subforms
Forms Designer
Example: Creating a virtual join
Build the sales form
Create the sales file
Create the sales record list
Add data to the sales file
Create the sales1 subform
Create the orders form
Build the virtual join into the form
Use the virtual join
Verify that the sales1 form works
Subform control


1.1.4.3.2.9. Use the virtual join

Applies to User roles: System Administrator

Once you save the record, you see the virtual join information whenever you select,
add, or update the record.

To create a new orders record using the orders form.

   1. Click Tailoring > Database Manager.

   2. Type orders in the Form field, and then click Search.

     The "orders" form opens.

   3. Type the name of a customer in the Customer Name field.
   4. Type a contact for that customer in the Contact field.
   5. Type a number for the Phone field.
   6. Type any number for the Order Amount value.
   7. In the Seller Code field, select a seller code from the record list of seller codes.
   8. Click Add to save the new orders record.

The new orders record appears with the sales file data virtually joined in the subform
at the bottom.

The Seller name and commission fields aren't stored with the record in the order file.
They are only referenced and are noneditable. To make changes or updates to the
seller data, use the sales form.

Note: If you delete this record, Seller name and commission don't delete because
they are stored in the sales file.

Related topics

Virtual joins
Understanding subforms
Example: Creating a virtual join
Build the sales form
Create the sales file
Create the sales record list
Add data to the sales file
Create the sales1 subform
Create the orders form
Build the virtual join into the form


Build the link
Verify that the sales1 form works


1.1.4.3.2.10. Verify the sales1 form works

Applies to User roles: System Administrator

To verify that the sales1 form works:

   1. Click Tailoring > Database Manager.
   2. Open the sales1 form.
   3. Click Search and select a record from the record list.

The first sales form inputs sales personnel data that's retrieved through the sales1
subform. The sales1 subform is virtually joined to the orders form.

Related topics

Virtual joins
Understanding subforms
Example: Creating a virtual join
Build the sales form
Create the sales file
Create the sales record list
Add data to the sales file
Create the sales1 subform
Create the orders form
Build the virtual join into the form
Build the link
Use the virtual join


1.1.4.4. Entity Relationship Diagram
creation utility

An Entity Relationship Diagram (ERD) is a graphic description of the logical structure
of a database. Database administrators often rely on conceptual and physical data
models to understand the relationships among tables, records, and data, and to
produce reports.

The Entity Relationship Diagram (ERD) Creation utility enables you to generate
Database Definition Language (DDL) statements that you can import into any tool
that's capable of producing this type of conceptual data model. For example, Erwin
Data Modeler can create a visual Service Manager data model when you import a
DDL file created by the ERD Creation utility. If you have administrative rights, you can
customize the files and links used to create the component DDL statements.

Related concepts

DDL mode
What's the required input for ERD Create?
Checklist: Creating an ERD record for an application
Checklist: Generating a DDL file
Associate a data policy record with an application
Create an ERD record
Create manual relationships
Generate a DDL file
Import a DDL file into a database modeling tool
Modify an ERD record


1.1.4.4.1. Checklist: Creating an ERD
record for an application

Ensure that you consider the following items prior to creating an ERD record for an
application.

   1. Identify all files that are related to the application name.
   2. Identify the primary link records for all files listed on the Files tab. Primary link

     records are the link records with the same name as the application files.
   3. Identify all link records that are associated with any file listed. The ERD Creation

     utility associates these link records by the format name.

Related concepts

DDL mode
Entity Relationship Diagram creation utility
What's the required input for ERD Create?
Checklist: Generating a DDL file
Associate a data policy record with an application
Create an ERD record
Create manual relationships
Generate a DDL file
Import a DDL file into a database modeling tool
Modify an ERD record


1.1.4.4.2. What's the required input for
ERD Create?

The ERD Create utility uses a variety of input to generate DDL statements. The
following list describes the basic input requirements.

     The list of files specified in the erdcreate record and all fields in these files.
     The relationships among these files determined by the link records specified in
     the erdcreate record.
     If specified, the relationships among the files specified by joindef and erddef
     records.
     If specified, the relationships among the files specified by the Match Fields
     section of Data Policy.
     If specified, the relationships manually defined by the database administrator.

Related topics

DDL mode
Entity Relationship Diagram creation utility
Checklist: Creating an ERD record for an application
Checklist: Generating a DDL file
Associate a data policy record with an application
Create an ERD record
Create manual relationships
Generate a DDL file
Import a DDL file into a database modeling tool
Modify an ERD record


1.1.4.4.3. Create an ERD definition

Applies to User roles: System Administrator

An Entity Relationship Diagram (ERD) is a graphic description of the logical structure
of a database. Database administrators often rely on conceptual and physical data
models to understand the relationships among tables, records, and data, and to
produce reports.

To create an ERD definition:

   1. From the System Navigator, click Tailoring > Database Manager.
   2. In the Form field, type erddef and click Search.
   3. From the Associated Forms section, double-click the erddef.g form.
   4. Enter the First Filename, Second Filename, and Relationship Type.
   5. In the Field Names from First Filename text box, enter the fields for which you

     want to create the join.
   6. Enter the fields for which you want to create the join in the Field Names from

     Second Filename text box.
     In this example, the contact.name field in the probsummary table contains the
     same data as the contact.name field in the contacts table.
   7. Click Add.

For additional information about relationship types, see Create a join in the related
topics.


1.1.4.4.4. Create an ERD record

Applies to User Roles: System Administrator

An Entity Relationship Diagram (ERD) is a graphic description of the logical structure
of a database. Database administrators often rely on conceptual and physical data
models to understand the relationships among tables, records, and data, and to
produce reports.

To create an ERD record:

   1. Click Tailoring > Tailoring Tools > ERD Create Records.
   2. Type the Name (usually the application name) for the ERD Create record.

   3. Click More or the More Actions icon and then select Add Files for Module.

     Note: The Add Files process will fail if the name of the ERD record is not
     associated with one or more Data Policy records.

   4. Click More or the More Actions icon and then select Add Master Links.
   5. Click More or the More Actions icon and then select Add all Related Links.
   6. Click Add.
   7. Click OK.

Note: You can add relationships manually from the Manual Relationships tab. Use this
tab to define relationships that don't occur in any of the automatically discovered
categories. Each relationship that you create manually also appears in the ERD.

Related topics

DDL mode
Entity Relationship Diagram creation utility
What's the required input for ERD Create?
Checklist: Creating an ERD record for an application
Checklist: Generating a DDL file
Associate a data policy record with an application
Create manual relationships
Generate a DDL file
Import a DDL file into a database modeling tool
Modify an ERD record


1.1.4.4.5. Modify an ERD record

Applies to User Roles: System Administrator

An Entity Relationship Diagram (ERD) is a graphic description of the logical structure
of a database. Database administrators often rely on conceptual and physical data
models to understand the relationships among tables, records, and data, and to
produce reports.

To modify an ERD record using the Entity Relationship Diagram (ERD) Creation utility:

   1. Click Tailoring > Tailoring Tools > ERD Create Records.
   2. To locate an existing ERD record, click Search.
   3. Select a record from the record list.
   4. Click More or the More Actions icon, and choose Add Files for Module.
   5. From the More Actions menu, choose Add Master Links.
   6. From the More Actions menu, and choose Add all Related Links.
   7. Click Save.
   8. Click OK.

Notes:

     You can add relationships manually from the Manual Relationships tab. Use this
     tab to define relationships that don't occur in any of the automatically
     discovered categories. Each relationship that you create manually also appears
     in the ERD record.
     The ERD record creation process will fail if the name of the ERD record is not
     associated with one or more Data Policy records.

Related topics

DDL mode
Entity Relationship Diagram creation utility
What's the required input for ERD Create?
Checklist: Creating an ERD record for an application
Checklist: Generating a DDL file

Associate a data policy record with an application
Create an ERD record
Create manual relationships
Generate a DDL file
Import a DDL file into a database modeling tool


1.1.4.4.6. Create manual relationships

Applies to User Roles: System Administrator

An Entity Relationship Diagram (ERD) is a graphic description of the logical structure
of a database. Database administrators often rely on conceptual and physical data
models to understand the relationships among tables, records, and data, and to
produce reports.

To create manual relationships in the ERD definition:

   1. Click Tailoring > Tailoring Tools > ERD Create Records.
   2. Click Search to display a list of existing records.
   3. Select an application name, and then select the Manual Relationships tab.

     Note: The Manual Relationships tab enables you to define any relationship that's
     not automatically detected by Service Manager through link, erddef, and
     datadict records. You must identify the two files that are related and the specific
     fields that create the relationship.
   4. Type a user-defined unique Name for the relationship.
   5. Type the name of a source file where the relationship originates in the From File
     text box.
   6. Type the name of a field in this file in the From Field text box.
   7. Type the name of a target file in the To File text box.
   8. Type the name of a field in this file in the To Field text box.
   9. Click Save.
 10. Click OK.

Related topics

DDL mode
Entity Relationship Diagram creation utility
What's the required input for ERD Create?
Associate a data policy record with an application
Create an ERD record
Generate a DDL file
Import a DDL file into a database modeling tool
Modify an ERD record


1.1.4.4.7. What are primary link records?

Primary link records are link records that have the same name as the associated file.
For example, the primary link record for the contacts file is the contacts link record.

Related topics

DDL mode
Entity Relationship Diagram creation utility
What are related link records?
What's the required input for ERD Create?
Checklist: Creating an ERD record for an application
Checklist: Generating a DDL file
Associate a data policy record with an application
Create an ERD record
Create manual relationships
Generate a DDL file
Import a DDL file into a database modeling tool
Modify an ERD record


1.1.4.4.8. What are related link records?

Related link records are form records that relate to the associated files and link
records that relate to these form records. The ERD Create utility collects related link
records by finding all forms associated with the selected files, and then locating any
link records associated with these forms.

Related topics

DDL mode
Entity Relationship Diagram creation utility
What's the required input for ERD Create?
Checklist: Creating an ERD record for an application
Checklist: Generating a DDL file
Associate a data policy record with an application
Create an ERD record
Create manual relationships
Generate a DDL file
Import a DDL file into a database modeling tool
Modify an ERD record


1.1.4.4.9. Associate a data policy record
with an application

Applies to User Roles: System Administrator

Every data policy record doesn't automatically have associated applications. You may
need to complete Step 4 to ensure there is a link between the data policy record and
the appropriate application. When the ERD Creation Utility runs for a named
application, the utility looks for all data policy records with links to that application to
generate the list of associated files.

To associate a data policy record with an application:

   1. Click Tailoring > Data Policy.
   2. Click Search to generate a list of existing data policy records.
   3. When you select a data policy record from the list, the fields in this record

     appear in the Data Policy form.
   4. The General tab shows the current applications associated with the data policy

     record. To add another application, insert the cursor in a blank Modules row.
     Click the drop-down list to choose a Service Manager application.
   5. Click Save.
   6. Click OK.

Related topics

DDL mode
Entity Relationship Diagram creation utility
What's the required input for ERD Create?
Checklist: Creating an ERD record for an application
Checklist: Generating a DDL file
Create an ERD record
Create manual relationships
Generate a DDL file
Import a DDL file into a database modeling tool
Modify an ERD record


1.1.4.4.10. Checklist: Generating a DDL file

Ensure that you consider the following items prior to generating a DDL file for an
application.

   1. Ensure that there is one or more data policy record associations for the
     application.

   2. Create a new ERD record that lists all related files and fields.
   3. Define any additional manual relationships.
   4. Use the ERD Create utility to generate a DDL file that contains DDL statements.
   5. Open the DDL file to import the DDL statements into a database modeling tool.

Related topics

DDL mode
Entity Relationship Diagram creation utility
What's the required input for ERD Create?
Checklist: Creating an ERD record for an application
Associate a data policy record with an application
Create an ERD record
Create manual relationships
Generate a DDL file
Import a DDL file into a database modeling tool
Modify an ERD record


1.1.4.4.11. DDL mode

The DDL mode describes how the ERD Create utility creates foreign key definitions.
You can select from one of two modes, Full mode or Simple mode.

     Full mode

     Full mode creates one foreign key definition for each unique field or file
     relationship. In Full mode, you can have multiple links between two files.

     Simple mode

     Simple mode creates one foreign key definition for each file-to-file relationship
     within each relationship type.

Related topics

Entity Relationship Diagram creation utility
What's the required input for ERD Create?
Checklist: Creating an ERD record for an application
Checklist: Generating a DDL file
Associate a data policy record with an application
Create an ERD record
Create manual relationships
Generate a DDL file
Import a DDL file into a database modeling tool
Modify an ERD record


1.1.4.4.12. Generate a DDL file

Applies to User roles: System Administrator

Database administrators often rely on conceptual and physical data models to
understand the relationships among tables, records, and data, and to produce reports.
If you have administrative rights, you can customize the files and links used to create
the component Database Definition Language (DDL) statements.

To generate DDL statements in a file using the Entity Relationship Diagram (ERD)
Creation utility:

   1. Click Tailoring > Tailoring Tools > ERD Create Records.
   2. Choose the correct export mode for the DDL statements.

           Full mode: Creates one foreign key definition for each unique field or file
           relationship. You can have multiple links between two files.
           Simple mode: Creates one foreign key definition for each relationship
           between the files within each relationship type.
   3. From the ERD Creator Definition form, click the More Actions menu.
   4. Select one of the following:
           Create/Export DDL > Full.
           Create/Export DDL > Simple.

The output of the ERD Create utility automatically resides at the root level of the
Service Manager client installation folder. The file name is the DDL file name with a
.sql file extension. For example:

..\Program Files\OpenText\Service Manager x.xx\Client\ddl_name.sql

Related topics

     DDL mode
     Entity Relationship Diagram creation utility
     What's the required input for ERD Create?
     Checklist: Creating an ERD record for an application
     Checklist: Generating a DDL file
     Associate a data policy record with an application
     Create an ERD record
     Create manual relationships
     Modify an ERD record
     Import a DDL file into a database modeling tool


1.1.4.4.13. Import a DDL file into a
database modeling tool

To import a Database Definition Language (DDL) file into a database modeling tool,
this example uses Erwin Data Modeler. Other tools may have different steps.

   1. From the Erwin Data Modeler, click File > Open.

   2. Change the file type to SQL DDL.

   3. Browse to locate the DDL file.

     By default, Service Manager stores these files at the root level of the client
     installation folder. For example, ..\Program Files\OpenText\Service Manager
     x.xx\Client\

   4. Click the file to select, and then click Open.

     The Erwin Data Modeler displays the Reverse Engineer - Select Template wizard.

   5. Select the appropriate Database and Version in the Target Database section.

   6. Click Next.

   7. Select the appropriate values.

   8. Click Next.

     The resulting Entity Relationship Diagram (ERD) opens. You can use the Zoom
     tool to view the content of each entity in the diagram.

Related topics

     DDL mode
     Entity Relationship Diagram creation utility
     What's the required input for ERD Create?
     Checklist: Creating an ERD record for an application
     Checklist: Generating a DDL file
     Associate a data policy record with an application
     Create an ERD record
     Create manual relationships
     Generate a DDL file
     Modify an ERD record
````
