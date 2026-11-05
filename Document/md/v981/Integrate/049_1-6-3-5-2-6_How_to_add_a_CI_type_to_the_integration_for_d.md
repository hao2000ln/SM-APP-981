---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.3.5.2.6 .. 1.6.3.5.2.8
printed_pages: 1346-1378
---

# 1.6.3.5.2.6 How to add a CI type to the integration for data push

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.3.5.2.6. How to add a CI type to the
integration for data push

You can use the following steps to add a CI type to the integration.
   1. Does the CI type already exist in the UCMDB class model?
     Yes. Go to Step 3.
     No. Go to Step 2.
   2. Add the CI type to the UCMDB class model.
     See How to add the CI type to the UCMDB class model below.
   3. Add CI attributes to the CI type as needed.
     See How to add a CI attribute to the integration for data push.
   4. Create a query to synchronize the CI type.
     See How to create a query to synchronize the CI type below.
   5. Add the CI type's attributes to the query layout.
     See How to add the CI type's attributes to the query layout below.
   6. Add the CI type to Service ManagerService Manager.
     See How to add the CI type in Service Manager below.
   7. Create web service fields to support the CI type.
     See How to create Web Service fields to support the CI type below.
   8. Add managed fields to support the CI type.
     See How to add managed fields to support the CI type below.
   9. Map the CI type's query to an XSL transformation file.
     See How to map the CI type's query to an XSL transformation file below.
 10. Map the CI type's attributes to web service fields.
     See How to map the CI type's attributes to Web Service fields below.
 11. Add custom queries to integration data push jobs.
     See How to add custom queries to data push jobs below.

How to add the CI type to the UCMDB class model


Before creating a new UCMDB CI type, you should determine if there are any existing CI types
in your UCMDB system that provide the CI attributes you want. In most cases, you can create
links to one or more existing CI types to create a new logical CI type for use by the integration.

The following steps illustrate how to create a new CI type called SM RDBMS based on an
existing CI type called database.

            Note

           The integration doesn't require any special steps to add a CI type to the UCMDB
           class model. You can use the standard CI type creation procedures to add a CI
          type. For more information on CI type creation, see the Universal CMDB CI
          Attribute Customization Guide.

To add a CI type to the UCMDB class model:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > CI Type Manager.
   3. Select the base CI type you want to use for your new CI type from the CI Types

     navigation tree: Managed Object > ConfigurationItem > Infrastructure Element >
     Running Software > Database.

   4. Click the New button .

     The Create Configuration Item Type window opens.

   5. In Name, type the unique name you want to use for the new CI type. For example,
     sm_rdbms.

                   Caution

                The name can't include any of the following characters: '' / \ [ ] : | < > + = ; , ?
                *.

   6. In Display Name, type the name you want UCMDB to display in the interface. For example,
     SM RDBMS.

   7. In Description, type a description of the new CI type. This is an optional field. For
     example, Hosts running relational databases.

   8. In Base CI Type, verify that the proper base CI type is selected. Your new CI type will
     inherit the attributes of the base CI type you select here. For example, Database.

   9. Click Next. The wizard displays a list of CI attributes from the base CI type.
 10. Add, edit, or remove CI attributes as needed for the new CI type. For example, accept the

     default attributes inherited from Database.
 11. Click Next. The wizard displays a list of qualifiers from the base CI type.
 12. Add or remove qualifiers as needed for the new CI type. For example, accept the default

     qualifiers.
 13. Click Next. The wizard displays a list of icons associated with the CI type.


14. Select the icons associated with this CI type. For example, accept the default abstract
    class icon.

15. Click Next to add any menu item properties or label definitions as needed. For example,
    accept the default settings from the base CI type.

16. Click Finish to create the CI type.

17. Select your new CI type from the tree. For example, SM RDBMS.
18. Browse to an existing CI type you want to link to, and control-click it to add it to your

    selection. For example, Node.

                 Note

               Choose an existing CI type that has the attributes that you want to be part of
               your new logical CI type.

19. Right-click one of the selected CI types, and click Add/Remove Relationship. The
    Relationships window opens.

20. Create an SM Link relationship from the existing CI type to the new CI type. For example,
    from Node to SM RDBMS.

                 Note

               You need to create a new SM Link relationship if it doesn't exist.


 21. Click OK to create the relationship.
 22. Click the Save button to save the CI type.

How to create a query to synchronize the CI type

The integration uses queries to gather CI attribute values and pass them to your Service
Manager system. You must create a query for any CI type you add to the integration. Any
query you create must conform to the Query requirements.

The following steps illustrate how to create a new query called rdbmsData for the SM RDBMS
CI type described in previous sections.

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > Modeling Studio.
   3. From the Queries navigation tree, click Integration > SM Sync.

   4. Right-click SM Sync, and select the New > Query.

     The Query Definition window opens.

   5. Find the CI type that will be the root node of your query from the CI Type Selector. This CI
     type is typically the one that provides the most attributes for the CI. For example,
     Managed Object > ConfigurationItem > InfrastructureElement > RunningSoftware >
     Database > SM RDBMS.

   6. Drag the root CI type from the CI Type Selector and drop it into the empty Editing pane.
     UCMDB displays the icon of the CI type.


7. Select the CI type, and click Edit from the Information Pane. The Node properties window
  opens.

8. Change the Element name to Root.

9. Click OK to save the node properties.

10. Find any additional CI types you want to add to the query from the CI Type Selector.
    These CI types typically provide additional CI attributes. For example, Managed Object >
    ConfigurationItem > Infrastructure Element > Node.

11. Drag the additional CI type from the CI Type Selector and drop it into the empty Editing
    pane. UCMDB displays the icon of the additional CI type.


12. Create relationships between the Root CI type and the additional CI types as needed. For
    example, create an SM Link between Root and Node.
       1. Select Root and control-click the additional CI type. For example, Node.
       2. Right-click one of the selected items, and click Add Relationship. The Add
          Relationship window opens.
       3. Select SM Link.
       4. Type a Relationship Name. For example SM Link.
       5. Click OK to add the relationship.

13. Repeat step 10 to step 12 for each additional CI type you want to add to the query. For
    example, SM RDBMS doesn't need any additional CI types.

 14. Click the Save button to save the query.  Page 1351 of 1727

This PDF was generated on May 23, 2026

 15. In Query Name, type the unique name you want to use for the new query. For example,
     rdbmsData.

 16. In Description, type a description of the new query. This is an optional field. For example,
     Query for hosts running relational databases.

 17. In the folder tree, select the folder in which you want to save the query. For example, Root
     > Integration > SM Sync.

 18. Click OK. UCMDB adds your new query to the Queries list.

How to add the CI type's attributes to the query layout

To add a CI attribute to the integration, you must enable the calculation layout setting from the
query that synchronizes the CI type. Because you must enable calculation for each attribute
you want to add to the integration, you should be familiar with the integration CI types and the
CI attributes that they contain.

            Tip

           Keep a list of the attributes that you enable, because you will need to create a
           matching XSL transformation for each one.

The following steps illustrate how to enable calculation for attributes of the SM RDBMS CI type
described in previous sections.

To add a CI type's attributes to the query layout:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > Modeling Studio.
   3. From the Queries navigation tree, click Integration > SM Sync.
   4. Select the query that manages the CI type whose attributes you want to add to the

     integration. For example, rdbmsData. UCMDB displays the query for the integration.
   5. Select the Root node from the query layout, and then click the Edit button from the

     Information Pane. The Node properties window opens.

                   Caution

                Your integration query must contain a node called Root. See Query
                requirements for more information.

   6. Click the Element Layout tab, and select the option Select attributes for layout.

   7. Select Specific Attributes from the Attributes condition list, and from the Available
     Attributes list select each CI attribute you want to add to the Specific Attributes list. For
     example, select the Product Name, Application Version Description, Vendor, Version,
     Description, The Database Instance Name, and Port attributes.


   8. Click OK to save the query node properties.
   9. Select any additional nodes that contain CI attributes you want to add to the integration.

     For example, Node.
 10. Click the Edit button from the Information Pane. The Node properties window opens.
 11. Click Element Layout tab, and select the option Select attributes for layout.
 12. Select Specific Attributes in Attributes condition, and from the Available Attributes list

     select each CI attribute you want to add to the Specific Attributes list. For example, select
     attributes for the OS Vendor, and name attributes.
 13. Click OK to save the query node properties.
 14. Repeat step 9 to step 13 for each additional node that contains CI attributes that you want
     to add to the integration.

 15. Click the Save button to save the query .

How to add the CI type in Service Manager

Before creating a new Service Manager CI type, you should determine if there are any existing
CI types in your Service Manager system that provide the CI attributes you want. In most
cases, you can reuse the existing CI types for the integration.

The integration doesn't require any special steps to add a CI type to Service Manager. You can
use the standard CI type creation procedures to add a CI type. For more information on CI type
creation, see the Service Manager online help.


To add a new CI type in Service Manager:

   1. Create a table for storing the specific attributes of this new CI type.
   2. Create a join definition to join the device table.
   3. Create an erddef definition that defines a relationship between the two tables.
   4. Create a view form and a bulk update form for the new CI type.
   5. Add the CI type.

The following steps illustrate how to create a new CI type called RDBMS.

            Note

           This example is provided only as an illustration of the steps. The best practice is to
           reuse the existing Service Manager CI type RunningSoftware to map with UCMDB
           CI type SM RDBMS.

To create a table in Service Manager:

1. Sign in to Service Manager as a system administrator.
2. Navigate to Tailoring > Database Dictionary.
3. In File Name, type the table name you want to add. For example, rdbms.

4. Click the New button                 .

5. Click the Fields tab.

6. Click the New Field/Key button. The Add Field window opens.

7. In Name, type a field name you want to add. For example, logical.name, which is

mandatory for joining the device table.

       Caution

       The name can't include any of the following characters: ' / \ [ ] : | < > + = ; , ?
       *.

8. In Type, select a type from the list. For example, select character.

9. Click the Add Field button              to save the attribute.

10. Repeat step 7 to step 9 for each attribute you wish to add. For example, dbinstance and

port.

11. Click the Keys tab.

12. Place the cursor on the first line of the structure, and click the New Field/Key button. The

Add Key window opens.

13. In Type, select primary from the list.

14. In Fields list, type the name of a field that you want to use as the primary key. For

example, logical.name.

15. Click Add Key button                to save the key.

16. Click the OKbutton to save attribute changes to the table.


To create a join definition in Service Manager:

1. Sign in to Service Manager as a system administrator.
2. Navigate to Tailoring > Database Manager.
3. In Table, type the table name joindefs.

4. Click the Search button              .

5. In Join Table Name, type a name for the join definition. For example, joinRDBMS.

6. In File Names, select the names of the tables to join. For example, device and rdbms.

7. Click Add to save the join definition.

To create an ERD definition in Service Manager:

1. Sign in to Service Manager as a system administrator.
2. Navigate to Tailoring > Database Manager.
3. In Table, type the table name erddef.

4. Click the Search button              .

5. In First Filename, type the name of the first table of the join definition. For example,

device.

6. In Second Filename, type the name of the second table of the join definition. For example,

rdbms.

7. In Relationship type, select a value from the list. For example, One to One.

8. In Field Names from First Filename, add the unique field name of first table. For example,

logical.name.

9. In Field Names from Second Filename, add the unique field name of the second table. For

example, logical.name.

10. Click the Add button to save the ERD definition.

To create forms for view and bulk update in Service Manager:

Create a view form named configurationItemRDBMS, and a bulk update form named
device.rdbms.bulkupdate.

You can create them in Forms Designer based on existing view forms and bulk update forms.
To view the form names of an existing CI type in Service Manager, click Configuration
Management > Resources > CI Types > Search, and then open the CI type record.

To access Forms Designer in Service Manager, type fd in the command line or go to Tailoring
> Forms Designer.

For more information about creating forms in Service Manager, see the Service Manager online
help and Tailoring Best Practices.

To add a CI type to Service Manager:

1. Sign in to Service Manager as a system administrator.
2. Navigate to Configuration Management > Administration > Add New CI Type, and click

  Next.


   3. In the CI Type Name field, type a descriptive name for the new CI type. For example,
     RDBMS.

   4. In the CI Type field, type a name for the new CI type. For example, rdbms.
   5. Click Next.
   6. In View Form, type the name of the view form you created for the new CI type. For

     example, configurationItemRDBMS.
   7. In Bulk Update Form, type the name of the bulk update form you created for the new CI

     type. For example, device.rdbms.bulkupdate.
   8. Click Next.
   9. In Attribute File, select the table you created for the CI type. For example, rdbms.
 10. Click Next.
 11. Click Next to keep the default setting for Fields Specific to the Attribute File.
 12. In the Join Def Record field, select the join definition you created for this CI type. For

     example, joinRDBMS.
 13. Click Next.
 14. In the Subtypes field, add necessary subtypes for the CI type. For example, Oracle and

     SQL Server.
 15. Click Next.
 16. Check the Activate CI Type checkbox.
 17. Click Next to save the new CI type.

How to create Web Service fields to support the CI type

In order to add a CI type to the integration, you must create a Service Manager web service
object for each CI attribute for which you created an XSL transformation on the UCMDB
system. Service Manager uses the web service object to determine which Service Manager
table and column to store the incoming CI attribute values.

The following steps illustrate how to create a web service object necessary to support the SM
RDBMS CI type described in previous sections.

            Note

           This example of creating a new web service object (ucmdbRDBMS) is provided
           only as an illustration of the steps. The best practice is to reuse the existing
           Service Manager web service object ucmdbRunningSoftware to map with
           Universal CMDB CI type SM RDBMS.

To create web service fields to support your new CI type:

   1. Sign in to Service Manager with an administrator account.
   2. Navigate to Tailoring > Web Services > WSDL Configuration.
   3. In Service Name, type ucmdbIntegration.
   4. In Name, select the name of the join file you have created for the new CI type. For

     example, joinRDBMS.
   5. In Object Name, type a name. For example, ucmdbRDBMS.


6. Click the Allowed Actions tab, and specify the actions as shown in the following figure.

Caution

For UCMDB integration WSDL configurations, be sure to use the "Create only"
action type for the "add" and "save" actions, and "Application Pass Through"
for the "delete" action. For more information about the action types, see
Service Manager Web Services.

7. Click Add to create the WSDL configuration.

8. Click the Fields tab, select fields from the list and type a caption for each of them, as
  shown in the following table.

Field                                   Caption
ucmdb.id                                UCMDBId
ci.name                                 ApplicationName
type                                    Type
subtype                                 SubType
company                                 CustomerId
sm.device.display.name                  DisplayName
description                             Description

   9. Click Save to save WSDL configuration changes.
     The new web service fields are now available to the integration.

How to add managed fields to support the CI type


In order for your custom CI type to trigger the automated Change Management validation and
verification processes, you must add a managed field for each CI attribute within your CI type.
Service Manager managed fields are part of the Discovery Event Manager Rules. For a list of
fields that trigger Change Management validation and verification, see Service Manager
Discovery Event Manager rules.

The following steps illustrate how to add the managed fields for the SM RDBMS CI type
described in the previous sections.

To add managed field to support your CI type:

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to Tailoring > Web Services > Discovered Event Manager Rules.
   3. In ID, type the ID you want to create for the new Discovered Event Manager Rule. For

     example, ucmdbRDBMS.
   4. In Table Name, select the table or join definition you want to associate to the new

     Discovered Event Manager Rule. For example, joinRDBMS.
   5. Click New.
   6. Click Next.
   7. Click the Managed Fields tab.

                   Note

                The list of fields you will add here will trigger Change Management validation
                and verification.

   8. Select an empty row in the Managed Fields list.
   9. For Field Name, select the caption names of the Service Manager fields that you

     previously selected to store the incoming CI attribute values. See How to create Web
     Service fields to support the CI type.

                   Note

                Service Manager displays the fields from all join tables associated with the
                table specified in the Table Name field. For example, for the joinRDBMS table,
                the fields from the device and rdbms tables are available from the Field Name
                list.

                   Tip

                If you want to add all fields that are exposed in the WSDL definition, you can
                click the Load Fields button. For more information, see How do I use the Load
                Fields button to add multiple managed fields.


10. If the field you use to store the incoming CI attribute is an array of structure, use the
    Structure field to select the name of the array of structure where the column can be
    found. For example, Vendor is a primitive character field and therefore doesn't need to
    identify an array of structure name.

11. If the field you use to store the incoming CI attribute is an array of structure, use the Index
    field to select the index number that identifies the column in the array of structure. For
    example, Vendor is a primitive character field and therefore doesn't need to identify an
    array of structure index.

12. Click Save.

How to map the CI type's query to an XSL transformation
file

The integration uses a configuration file called smSyncConfFile.xml to map each Universal
CMDB query to an XSL transformation file. In order for custom queries to be part of the
integration, you must add a mapping entry for each query in the configuration file.

The following steps illustrate mapping the query rdbmsData described in previous sections to
the Service ManagerucmdbRDBMS web service.

            Tip

           When adding a query name in the smSyncConfFile.xml file, you can use a
           wildcard (an asterisk) in the query name. This is helpful in the debugging phase
           when you may have updated an out-of-the-box query and saved it as several
           query names. For example, if you have saved the <Query_name> query to
           <Query_name>_1, and <Query_name>_2, you can specify the query name as
           <Query_name>* in the configuration file, and the integration will automatically use
           this mapping entry on all of the three queries.


            Note

           Out-of-the-box, all query names in the smSyncConfFile.xml file are suffixed with
           a wildcard (an asterisk).

To map a query to an XSL transformation file:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Adapter Management >

     ServiceManagerAdapter9.41 > Configuration Files.
   3. Click the smSyncConfFile.xml file.
   4. Add a query mapping element to the file by copying an existing one. A query mapping

     element uses the following format:

          <tql name="Query" xslFile="XSL_File">
          <!-- Description of mapping -->
          <request type="Create" name="Create_web_service"/>
          <request type="Update" name="Update_web_service"/>
          <request type="Delete" name="Delete_web_service"/>
          </tql>

      Query is the name of the UCMDB query you created.
      XSL_File is the name of the XSL transformation file the integration will use to map
     Universal CMDB attributes to Service Manager web service fields.
      Create_web_service is the name of the Service Manager web service you want to the
     integration to use to create CIs from this query.
      Update_web_service is the name of the Service Manager web service you want to the
     integration to use to update CIs in this query.
      Delete_web_service is the name of the Service Manager web service you want to the
     integration to use to delete CIs from this query.
     See the following screenshot for an excerpt of smSynchConfFile.xml :


   5. Add or update query mapping elements for each query you want to add to the integration.
     For example, the following query creates a mapping between the rdbmsData query and
     the rdbms_push.xslt file.

          <tql name="rdbmsData" xslFile="rdbms_push.xslt">
          <!-- this is database tql -->
          <request type="Create" name="CreateucmdbRDBMSRequest"/>
          <request type="Update" name="UpdateucmdbRDBMSRequest"/>
          <request type="Delete" name="DeleteucmdbRDBMSRequest"/>
          </tql>

   6. Save the configuration file.

                   Note

                When you create/edit and then save a configuration file in Adapter
                Management, UCMDB automatically restarts the adapter with the new
                configuration file.

How to map the CI type's attributes to Web Service fields

The integration uses the Service Manager Adapter to transform UCMDB CI attributes to web
services objects recognized by Service Manager. The Service Manager Adapter uses XSL
transformation files to convert UCMDB queries into a properly formatted Service Manager web
services messages. Out-of-the-box, each integration query has a corresponding XSL
transformation file. In addition, each attribute you enable for synchronization from Advanced
layout settings requires its own entry in the XSL transformation file.


If you want to add a CI type to the integration, you must create a matching XSL transformation
file that defines how the Service Manager Adapter transforms each CI type into a Service
Manager web service object. See Integration queries for information about which CI types
each query manages. In order to create a proper XSL mapping, you must be familiar with the
service and object names Service Manager publishes as Web services. See the Service
Manager help for information on publishing tables and columns as Web service objects.

The following steps illustrate creating an XSL transformation file for the rdbmsData query
described in previous sections.

To map a CI type's attributes to web service fields:

   1. Sign in to UCMDB with an administrator account.
   2. Navigate to Data Flow Management > Adapter Management.
   3. Click the Create New Resource button .
   4. Select New Configuration File.
   5. Select the ServiceManagerAdapter9.41 package.
   6. Enter the full file name: <AdapterID>/<filename>. For example,

     ServiceManagerAdapter9.41/rdbms_push.xslt.
   7. Copy the content of an existing XSL transformation file (for example,

      runningsoftware_push.xslt ) to the new XSL transformation file.
   8. Find the CI type definition element in the new file. The CI type definition element uses the

     following format:

          <xsl:template match="/CI_type_name">

      CI_type_name is the name of CI type in the UCMDB system.
     The following is an example from the runningsoftware_push.xslt file:

          <xsl:template match="/running_software">

   9. Update the CI type name to match the CI type you want to add to the integration. For
     example, create the following CI type definition element to add the database CI type to
     the integration.

          <xsl:template match="/sm_rdbms">

 10. Add or update table naming elements as needed. By default, UCMDB sends CI attribute
     data to the Service Manager device table. If you want to send CI attributes to one of the
     join tables of device, you must add an element to specify the table name using the format
     <file.table_name>. For example, you don't need to specify an additional jointable to
     define a database CI type since Service Manager doesn't use a separate jointable to
     manage database CI types.


11. Find the elements that transform UCMDB CI attributes into Service Manager web service
    fields. The CI attribute transformation elements use the following format:

        <xsl:for-each select="@CI_attribute_name">
        <WSFieldName><xsl:value-of select="."/></WSFieldName>
        </xsl:for-each>

     @CI_attribute_name is the name of the attribute in the UCMDB system.
     WSFieldName is the name of a web service field published by the Service Manager
    system.
    The following figures show an example for CI attributes in runningsoftware_push.xslt :

Refer to the following screenshot to map CI attributes in the ucmdbRunningSoftware
web service object:


Refer to the following screenshot to map CI attributes in the UCMDB RunningSoftware CI
type:

12. Add or update CI attribute transformation elements for each CI attribute you want to add
    to the integration. For example, create the following XSL transformation elements for the
    database CI type.

UCMDBattribute                                                                                                                           Service Manager 9.81
port
database_dbsid                          Sample XSL transformation elements for database CIs

description                                                    Sample transformation elements

                                                                         <xsl:for-each select="@port">
                                                                               <Port><xsl:value-of

                                                                         select="."/></Port>
                                                                         </xsl:for-each>

                                                                         <xsl:for-each
                                                                         select="@database_dbsid">

                                                                           <DBInstance><xsl:value-of
                                                                         select="."/></DBInstance>
                                                                         </xsl:for-each>

                                                                         <xsl:for-each
                                                                         select="@description">

                                                                                        <Description>
                                                                         <xsl:value-of select="."/>
                                                                         </Description>
                                                                         </xsl:for-each>

New attribute mappings in rdbms_push.xslt are illustrated in the following screenshot:


 13. Save the new XSL transformation file.

                   Note

                When you create/edit and then save a configuration file in Adapter
                Management, UCMDB automatically restarts the adapter with the new
                configuration file.

How to add custom queries to data push jobs

In order for the integration to send your custom CI types and attributes to your Service
Manager system, you must add your custom queries to the data push job between your
Changes data store and your Service Manager data store. The following steps illustrate how to
add an custom query named rdbmsData, which is described in the previous sections.

To add custom queries to a data push job:


 1. Sign in to UCMDB as an administrator.
 2. Navigate to Data Flow Management > Integration Studio.
 3. Click the name of your Service Manager integration point. For example, SM Integration.
 4. Click the Data Push tab.
 5. Click the name of your data push job. For example, SM Configuration Item Push job.
 6. Click the Edit button .
 7. Click the Add button.
 8. Click Integration > SM Sync > rdbmsData.
 9. Click OK to add the custom query.
10. Enable the Allow Integration Job to delete removed data option for the query.
11. Click OK to close the Update Job Definition window.


1.6.3.5.2.7. How to add a CI type's relationship
types to the integration for data push

Once you have added a new CI type to the integration and have created relationships between
it and other CI types in UCMDB, for each of these relationship types you need to perform the
following tasks so that UCMDB can push the relationships to Service Manager.
As an example, the following steps illustrate how you add a relationship type named Ownership
(between the Cost and CostCategory CI types) to the integration for data push. These steps
assume that you have already added the Cost and CostCategory CI types to the integration
and have created an Ownership relationship between them in UCMDB.

   1. Add a mapping entry for each relationship type in the push relationship mapping
     definition file.
     See How to add a push mapping entry for each relationship type of the CI type below.

   2. Create a query to push relationships of the CI type.
     See How to create a query to push each relationship type of the CI type below.

   3. Map the relationship query to an XSL transformation file in the push configuration file.
     See How to map each relationship type query to an XSL transformation file below.

How to add a push mapping entry for each relationship
type of the CI type

For data push, the SM_CIT_Subtype_list.xml file defines how UCMDB relationship types are
mapped to SM ones.

            Note

           This XML file can be found from Adapter Management >
           ServiceManagerAdapter9.41 > Configuration Files.

If this file doesn't contain a mapping entry for a new relationship type, you need to add an
entry for it.
To add a push mapping entry for the Ownership relationship type:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Adapter Management >

     ServiceManagerAdapter9.41 > Configuration Files.
   3. Double-click the SM_CIT_Subtype_list.xml file.
   4. Go to the RelationshipType list section, and add a mapping entry for Ownership.


  <list name="RelationshipType">

  <!--ucmdb is link display lable, ucmdbType is link type, sm is the
  relationship type.
  compound link will use root_* as the lable -->

         <entry ucmdb="Aggregation" ucmdbType="aggregation"
  sm="Aggregation" />

         ...

  <entry ucmdb="Ownership" ucmdbType="ownership" sm="Ownership" />

         ...

  </list>

Where:
ucmdb: the display name of the UCMDB relationship type. Name and Display Name of
Ownership are illustrated in the following screenshot:

   5. Click OK to save the file.

How to create a query to push each relationship type of
the CI type

Once you have created CI Relationship types for the new CI type, you must create a query for
each relationship type to push it to Service Manager.

            Note

           Any query you create must conform to the Query requirements.


To create a new query called cost_costcategory_ownership_relation_push for Ownership
relationships between the Cost and CostCategory CI types:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > Modeling Studio.
   3. Click New > Query. The Query Definition pane displays.
   4. From the CI Type Selector, drag the Cost and CostCategory CI types to the query pane.

5. Create an Ownership relationship from Cost to CostCategory.
     1. Click the Create Relationship button.
     2. Click the Cost node, and drag the arrow from it to the CostCategory node.
     3. Select Regular Relationship, and click OK.

     4. Select Connection > Ownership, and click OK. An Ownership relationship is created
        between the CI types.

6. Right-click the relationship arrow, and select Relationship Properties.

7. Change the element name from Ownership to Root (or a name starting with "Root_"), and
  then click OK.


8. Click the Save button, and save the query as described in the following.
     1. Enter a query name. For example, cost_costcategory_ownership_relation_push.
     2. Select the Integration > SM Sync > 9.xx folder.
     3. Click OK.

The query is now created. You are ready to map this query to an XSL transformation file.

How to map each relationship type query to an XSL
transformation file

Once you have created a query for a relationship type, you need to map the query to an XSL
transformation file as described in the following steps.

            Tip

           Out-of-the-box, there is a common XSL transformation file
           ( common_relations.xslt ), which is used for pushing all types of CI relationships.
           For this reason, you don't need to create a new XSL transformation file; instead,
           you only need to map the new relationship query to this existing XSLT file.


   1. Navigate to Data Flow Management > Adapter Management >
     ServiceManagerAdapter9.41 > Configuration Files.

   2. Click the smSyncConfFile.xml file.
   3. Add a query mapping entry by copying an existing one for relationship push. For example,

     copy the following query mapping entry.

          <tql name="SM Layer2 Topology Relations Push*"
          xslFile="common_relations.xslt">

                                <request type="Create" name="CreateRelationship"/>
                                <request type="Update" name="UpdateRelationship"/>
                                <request type="Delete" name="DeleteRelationship"/>
          </tql>

   4. Change the query name to the name of the query you created for the relationship type.
     For example, cost_costcategory_ownership_relation_push.

          <tql name="cost_costcategory_ownership_relation_push"
          xslFile="common_relations.xslt">

                                <request type="Create" name="CreateRelationship"/>
                                <request type="Update" name="UpdateRelationship"/>
                                <request type="Delete" name="DeleteRelationship"/>
            </tql>

   5. Click OK to save the configuration file.
Now, you have added the new relationship type to the integration. Next, you need to add the
new relationship query to a data push job (see the following figure and How to add custom
queries to data push jobs).
Refer to the following screenshot to add a new relationship query to a data push job.



1.6.3.5.2.8. How to Add a CI Attribute to the
Integration for Population

To add a CI attribute to the integration for population, perform the following tasks:

   1. Create a web service field to support the CI attribute.

     See Create a Web Service field to support the CI attribute below.

   2. Map the CI attribute to the web service field.

     See How to map the CI attribute to the Web Service field below.

Create a Web Service field to support the CI attribute

UCMDB uses the Service Manager ucmdbIntegration web service to retrieve CI data from
Service Manager. This web service publishes the objects that match the out-of-the-box CI
types and CI attributes provided by the UCMDB integration.

If you want to populate an additional CI attribute from Service Manager to your Universal
CMDB system, you must create a corresponding web service field on your Service Manager
system to provide the CI data from Service Manager. Each web service field must map to a
valid Service Manager table and column.

For the steps of creating a web service field, see How to create a Web Service field to support
the CI attribute.

How to map the CI attribute to the Web Service field

The integration uses an adapter to transform Service Manager web service fields to Universal
CMDB CI attributes. The adapter in turn specifies what XSL transformation files the integration
should use to convert Service Manager web services messages into a properly formatted
Universal CMDB CI and/or relationship.

Out-of-the-box, each integration query has a corresponding XSL transformation file that maps
to a particular CI type in Universal CMDB. Without an XSL transformation entry, Universal
CMDB can't receive any CI attribute updates from your Service Manager system.

Unlike the Push feature, you don't need to create real queries for Population on the UCMDB
server.

If you want to add a new attribute to the integration, you must edit the XSL transformation file
for the parent CI type and add an entry for the CI attribute. For information about which CI
types each population query manages, see Integration queries. In order to create a proper XSL
mapping, you must be familiar with the service and object names that Service Manager
publishes as Web services. For information on publishing tables and columns as Web service
fields, see the Service Manager help.


The following steps illustrate how to map a UCMDB CI attribute called host_vendor to a Service
Manager web service field called OSVendor.

To map a CI attribute to a web service field:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Adapter Management.
   3. Navigate to the Service Manager Adapter configuration files path:

      ServiceManagerAdapter9.41 > Configuration Files .
   4. Click the XSL transformation file that manages the parent CI type of your CI attribute. For

     example, open computer_population.xslt to add an attribute to the SM Computer
     Population query.
   5. Find the element that defines the name of the Universal CMDB CI Type where the
     integration will store CI attribute values. For example, the element <ci class="node">
     will store CI attributes in the Universal CMDB Node CI Type.

   6. Within the ci naming element ( <ci class="node"> ), you will see an element of the
     following format that defines how to transform each web service field into an Universal
     CMDB CI attribute:

          <attribute name="UCMDB_CI_attribute_name"

          type="UCMDB_CI_attribute_type" ignoreCIIfEmpty="true">

          <xsl:value-of select="SMAttributeName "/></attribute>

      UCMDB_CI_attribute_name is the name of attribute in the Universal CMDB system.

      UCMDB_CI_attribute_type is the type of attribute of the Universal CMDB system which
     this integration supports. Currently the following types are supported: String, StringList,
     Integer, Long, Double, Boolean, IPAddress, Date, Float, and IntList.

      ignoreCIIfEmpty is a parameter that specifies whether or not to ignore the CI during
     population if this attribute has an empty value (true: ignore; false: not ignore).

                   Note

                      A StringList is a list of strings separated by a semicolon (;). For example,
                      str1;str2;str3. An IntList is a list of integers separated by a semicolon (;).
                      For example, 1;2;3.
                      For information about time zone and date format configuration of the
                      Date type, see How to update the time zone and date format for the
                      integration adapter.

      SMAttributeName is the name of a web service attribute published by the Service
     Manager system.

     CI attributes in the computer_population.xslt file are illustrated in the following
     screenshot:


Refer to the following screenshot to match CI attributes in the ucmdbNode web service
object:

7. Copy an existing XSL transformation element to use it as a template to create a new
  transformation entry.

8. Paste the new XSL transformation element within the proper table naming element. For
  example, <ci class="node">.


   9. Update the CI attribute name and web service field name within the new element to match
     the attribute you want to add to the integration. For example, create the following XSL
     transformation element to add the os_vendor attribute to the integration.

          <attribute name="os_vendor" type="String"><xsl:value-of
          select="file.node/OSVendor"/></attribute>

     New attribute in the computer_population.xslt file is illustrated in the following
     screenshot:

 10. Save the XSL transformation file.
When you create/edit and then save a configuration file in Adapter Management, UCMDB
automatically restarts the adapter with the new configuration file.
````
