---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.2.5.2.6 .. 1.6.2.5.2.9
printed_pages: 1118-1149
---

# 1.6.2.5.2.6 How to add a CI attribute to the integration for data push

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.2.5.2.6. How to add a CI attribute to the
integration for data push

You can use the following steps to add a CI attribute to the integration.

   1. Does the CI attribute already exist in the UCMDB class model?
     Yes. Go to Step 3.
     No. Go to Step 2.

   2. Add the CI attribute to the UCMDB class model.
     See How to add the CI attribute to the UCMDB class model below.

   3. Add the CI attribute to the query layout.
     See How to add a CI attribute to the query layout below.

   4. Add a web service field for the Service Manager CI type.
     See How to add a Web Service field for the Service Manager CI type below.

   5. Map the CI attribute to the Service Manager web service field.
     See How to map the CI attribute to a Service Manager Web Service field below.

How to add the CI attribute to the UCMDB class model

The integration only uses a subset of the CI attributes available from your UCMDB system.
Out-of-the-box, the integration consists of CI attributes that are typically managed from a
Service Manager system such as host name and host DNS name. Before creating a new
UCMDB CI attribute, you should determine if there are any existing CI attributes in your UCMDB
system that provide the data you want. In most cases, there is an existing attribute tracking the
data that you want to add to the integration. For example, the Node CI type contains many
attributes that you can add to the integration.


The following steps illustrate how to add a new CI attribute to an existing CI type. This is not
the expected typical scenario. Typically, you would add an existing CI attribute to the
integration, which means you don't need to perform these steps.

            Note

           The integration doesn't require any special steps to add a CI attribute to the
           UCMDB class model. You can use the standard CI attribute creation procedures to
           add a CI attribute. For more information on CI attribute creation, see the UCMDB
           Help Center.

As an example, the following steps will add an attribute named comments to the Business
Service CI type.

To add a CI attribute to the UCMDB class model:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > CI Type Manager.
   3. Select the CI type to which you want to add a new CI attribute from the CI Types

     navigation tree. For example, ConfigurationItem > BusinessElement > BusinessService.
   4. Click the Attributes tab.

   5. Click the Add icon.

     The Add Attribute window opens.

   6. In Attribute Name, type the unique name you want to use for the new CI attribute. For
     example, comments.


                   Caution

                The name can't include any of the following characters: ‘ / \ [ ] : | < > + = ; , ?
                *.

   7. In Display Name, type the name that you want UCMDB to display in the interface. For
     example, Comments.

   8. (Optional) In Description, type a description of the new CI attribute.
   9. In Attribute Type, select Primitive or Enumeration/List depending on the data type of the

     attribute. For example, select Primitive and select string.
 10. In Value Size, type the maximum character length that the attribute can have. For

     example, 300.
 11. Select the Enable default value option, and enter a default value. Or, don't select this

     option to leave the default value blank.
 12. Click OK to save the attribute.
 13. Click the Save icon to save attribute changes to the CI type.

Now, the attribute has been added to the CI type. Next, you need to add the attribute to a query
that synchronizes the CI type. See How to add a CI Attribute to the query layout below.

How to add a CI attribute to the query layout

To add an existing CI attribute to the integration, you must add this attribute to the layout
setting from the query that synchronizes the CI type. You must know which CI type contains
the CI attributes that you want to add to the integration.

To add a CI attribute to the query layout:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > Modeling Studio.
   3. For Resource Type, select Queries.
   4. From the Queries navigation tree, click Integration > Service Manager.
   5. Select the query that manages the CI type whose attributes you want to add to the

     integration. For example, Push > SM Computer Push 2.0. UCMDB displays the TQL layout
     of the query.
   6. Select the node from the query layout that contains the CI attribute that you want to add
     to the integration. For example, Root.
   7. Right-click the node and select Query Node Properties. The Query Node Properties
     window opens.
   8. Select the CI type (Database in this example), and click the Element Layout tab.

   9. Select the CI attribute that you that want to include in the integration from the Available
     Attributes list, and click the Add icon to add it to Specific Attributes list. For example,
     Comments.


 10. Click OK to save the node properties.

 11. Click the Save icon to save the query.

Now, the CI attribute has been added to the relevant query layout. Next, you need to add a
Service Manager web service field that will be mapped to this UCMDB CI attribute.

How to add a Web Service field for the Service Manager
CI type

The integration uses only a subset of the CI attributes available from your Service Manager
(SM) system. CI attributes must be mapped between UCMDB and SM. Before creating a new
SM CI attribute that will be mapped to the UCMDB CI attribute you added previously, you must
determine if there are any existing CI attributes in your Service Manager system that provide
the data you want. In most cases, there is an existing attribute tracking the data that you want
to add to the integration. For example, the Computer CI type contains many attributes that you
can add to the integration.


If you decide to use an existing attribute instead of creating a new one, you can directly modify
the web service definition in Service Manager to expose that attribute, and then map this SM
attribute to the UCMDB attribute by using the UCMDB Visual Mapping tool (see How to map the
CI attribute to a Service Manager Web Service field below).

If you decide to add a new attribute, follow the steps below. The steps vary depending on the
data type of the attribute: simple (string, for example), or complex (array of structure or
structure).

Add a simple attribute to the SM CI type

As an example, the following steps illustrate how to add a simple attribute (comments) to an
existing CI type (Business Service).

   1. Sign in to UCMDB as a system administrator.

   2. Click Data Flow Management > Adapter Management, and then select
     ServiceManagerEnhancedAdapter 9-x to open the corresponding XML mapping file (SM
     Business Service 2.0.xml in this example) with the Visual Mapping tool editor.

   3. On the External Class Model pane, select the CI type (bizservice).


4. On the left-side Attributes pane (which displays the fields that are retrieved from the
  Service Manager web service object for the Business Service CI type), click the Add New
  Attribute to Selected External Node icon.

5. Type a name and display label for the new attribute, and click OK.

               Caution

             If the you enter a name that duplicates or is part of an existing field name in
             the attribute table of the Service Manager CI type or in the device table, an
             error will occur indicating the attribute could not be created.

   6. Click OK again to confirm the attribute creation.  Page 1123 of 1727

This PDF was generated on May 23, 2026

The new attribute (mycomments) appears in the Service Manager attribute list.

At the same time, UCMDB invokes the Service Manager Web Service API to add the new
attribute, expose it in the Web Service API and set it as a managed field. You can open
the web service object in Service Manager to verify the new attribute (Tailoring > Web
Services > Web Service Configuration).

                   Note

                The caption for the istatus field must be AssetStatus. Do not update this
                caption. Otherwise, the data push and data population may fail.

   7. Save the configuration file.

Add an array of structure or structure to the CI type


Service Manager uses an Array of Structure or Structure to store complex attributes, for
example, the ports of a Computer CI. You can also create such kind of complex attributes
through the Visual Mapping tool in UCMDB.

The following steps illustrate how to add an attribute named comport to the Computer CI type.

   1. Sign in to UCMDB as a system administrator.

   2. Open the corresponding XML mapping file (SM Computer Push 2.0.xml in this example),
     with the Visual Mapping tool editor.

   3. Select the CI type (computer), and click the Add New CI Type to External Class Model
     icon.

   4. In the child CI type creation dialog that appears, enter a name and description for the
     attribute, select Many to One for Relation with Parent if the attribute data type is array of
     structure or select One to One if the data type is structure.

5. Click OK. The attribute is created on the Service Manager side.

6. Select the new attribute in the External Class Model pane, and click the Add New
  Attribute to Selected External Node icon.


7. Add a field (httpPort) to the array of structure, and click OK. Click OK again to confirm
  the attribute creation.

8. Repeat the previous two steps to add more fields to the array of structure as needed.


The attribute is also automatically added to the corresponding web service object in
Service Manager.


   9. Save the configuration file.

Next, you need to map this Service Manager CI type attribute to the one you added previously
in UCMDB.

How to map the CI attribute to a Service Manager Web
Service field

The integration uses an adapter to transform UCMDB CI attributes to web services objects
recognized by Service Manager. The adapter in turn specifies what XML transformation files
the integration should use to convert UCMDB queries into properly formatted Service Manager
web services messages.

Out-of-the-box, each integration query has a corresponding XML configuration file that maps
to a particular CI type in UCMDB. In addition, each attribute for which you enabled calculation
requires its own entry in the XML configuration file. Without an XML transformation entry,
Service Manager can't receive any CI attribute updates from your UCMDB system.

If you want to add a new attribute to the integration, you must edit the XML configuration file
for the parent CI type and add an entry for the CI attribute. For information about which CI
types each query manages, see Queries for push.

The following steps illustrate how to map UCMDB CI attribute Comments (which you added
previously) to the MyComments Service Manager attribute (which you created in the previous
step).


To map a UCMDB CI attribute to an SM CI attribute:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Adapter Management >

     ServiceManagerEnhancedAdapter9.41 > Configuration Files.
   3. Double-click the XML configuration file that manages the parent CI type of your CI

     attribute. For example, open SM Business Service Push 2.0.xml to add an attribute to the
     SM Business Service Push 2.0 query.

   4. Select the relevant CI type in the External Class Model pane (bizservice in this example),
     and drag and drop the attribute (mycomments) from the left-side Attributes pane into the
     Visual Mapping pane.

5. Select the relevant Node in the Local Query panel (Root in this example), and drag and
  drop the attribute (comments in this case) into the mapping entry that you created in the
  previous step.


6. Save the XML configuration file. The Comments attribute in UCMDB is now mapped to
  the MyComments attribute in Service Manager.

               Note

             When you create or edit and then save a configuration file in Adapter
             Management, UCMDB automatically restarts the adapter with the new
             configuration file.


1.6.2.5.2.7. How to add a CI type to the
integration for data push

You can use the following steps to add a CI type to the integration.
   1. Does the CI type already exist in the UCMDB class model?
     Yes. Go to Step 3.
     No. Go to Step 2.
   2. Add the CI type to the UCMDB class model.
     See How to add the CI type to the UCMDB class model below.
   3. Create a query to synchronize the CI type.
     See How to create a query to synchronize the CI type below.
   4. Add the CI type’s attributes to the query layout.
     See How to add the CI type’s attributes to the query layout below.
   5. Add the CI type to Service ManagerService Manager.
     See How to add the CI type to Service Manager below.
   6. Map the CI type’s attributes to web service fields.
     See How to map the CI type’s attributes to Web Service fields below.
   7. Add custom queries to integration data push jobs.
     See How to add a custom query to an integration job below.

How to add the CI type to the UCMDB class model

Before creating a new UCMDB CI type, you should determine if there are any existing CI types
in your UCMDB system that provide the CI attributes you want. In most cases, you can create
links to one or more existing CI types to create a new logical CI type for use by the integration.
The following steps illustrate how to create a new CI type called SM RDBMS based on an
existing CI type called database.

            Note

           The integration doesn't require any special steps to add a CI type to the UCMDB
           class model. You can use the standard CI type creation procedures to add a CI
           type. For more information on CI type creation, see the UCMDB Help Center.

To add a CI type to the UCMDB class model:


 1. Sign in to UCMDB as an administrator.
 2. Navigate to Modeling > CI Type Manager.
 3. Select the base CI type you want to use for your new CI type from the CI Types

    navigation tree: Managed Object > ConfigurationItem > Infrastructure Element >
    Running Software > Database.

 4. Click the New icon .

    The Create Configuration Item Type window opens.

 5. In Name, type the unique name you want to use for the new CI type. For example,
    sm_rdbms.

                 Caution

               The name can't include any of the following characters: ‘ / \ [ ] : | < > + = ; , ?
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
 22. Click the Save icon to save the CI type.

How to create a query to synchronize the CI type

The integration uses queries to gather CI attribute values and pass them to your Service
Manager system. You must create a query for any CI type you add to the integration. Any
query you create must conform to the Query requirements.

The following steps illustrate how to create a new query named rdbmsData for the SM RDBMS
CI type described in previous sections.

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > Modeling Studio.
   3. From the Queries navigation tree, click Integration > Service Manager.

   4. Right-click Service Manager, and select the New > Query.

     The Query Definition window opens.

   5. Find the CI type that will be the root node of your query from the CI Type Selector. This CI
     type is typically the one that provides the most attributes for the CI. For example,
     Managed Object > ConfigurationItem > InfrastructureElement > RunningSoftware >
     Database > SM RDBMS.

   6. Drag the root CI type from the CI Type Selector and drop it into the empty Editing pane.
     UCMDB displays the icon of the CI type.


7. Right-click the CI type icon, and select Query Node Properties. The Node Properties
  window opens.

8. Change the Element Name to Root.
9. Click OK to save the node properties.

10. Find any additional CI types you want to add to the query from the CI Type Selector.
    These CI types typically provide additional CI attributes. For example, Managed Object >
    ConfigurationItem > Infrastructure Element > Node.

11. Drag the additional CI type from the CI Type Selector and drop it into the Query Definition
    pane. UCMDB displays the icon of the additional CI type.


12. Create relationships between the Root CI type and the additional CI types as needed. For
    example, create an SM Link between Root and Node.
       1. Select Root and control-click the additional CI type. For example, Node.
       2. Right-click one of the selected items, and click Add Relationship. The Add
          Relationship window opens.
       3. Type a Relationship Name. For example SM Link.
       4. Select the relationship direction.

       5. Click OK to add the relationship.

13. Repeat step 10 to step 12 for each additional CI type you want to add to the query. For
    example, SM RDBMS doesn't need any additional CI types.

14. Click the Save icon to save the query.
       1. In Query Name, type the unique name you want to use for the new query. For
          example, rdbmsData.


        2. In the folder tree, select the folder in which you want to save the query. For example,
           Root > Integration > Service Manager > Push.

        3. Click OK. UCMDB adds your new query to the query list.

How to add the CI type’s attributes to the query layout

To add a CI attribute to the integration, you must enable the calculation layout setting from the
query that synchronizes the CI type. Because you must enable calculation for each attribute
you want to add to the integration, you should be familiar with the integration CI types and their
attributes.

The following steps illustrate how to enable calculation for attributes of the SM RDBMS CI type
described in previous sections.

To add a CI type’s attributes to the query layout:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > Modeling Studio.
   3. From the Queries navigation tree, click Integration > Service Manager.
   4. Double-click the query that manages the CI type whose attributes you want to add to the

     integration. For example, rdbmsData. UCMDB displays the TQL layout of the query.
   5. Right-click the Root node from the query layout, and then select Query Node Properties.

     The Query Node Properties window opens.

                   Caution

                Your integration query must contain a node called Root. See Query
                requirements for more information.

   6. Click the Element Layout tab, and select the Select attributes for layout option.

   7. Select Specific Attributes from the Attributes condition list, and from the Available
     Attributes list select the attributes you want and move them to the Specific Attributes list.
     For example, add the Product Name, Application Version Description, The Database
     Instance Name, and Port attributes.


   8. Click OK to save the query node properties.
   9. Select any additional node that contains the attributes you want to add to the integration.

     For example, Node.
 10. Repeat step 4 through step8 for each additional node.
 11. Click OK to save the query node properties.
 12. Repeat step 9 to step 13 for each additional node that contains the attributes you want to

     add to the integration.

 13. Click the Save icon to save the query .

How to add the CI type to Service Manager

Before creating a new Service Manager CI type, you should determine if there are any existing
CI types in your Service Manager system that provide the CI attributes you want. In most
cases, you can reuse the existing CI types for integration.

You can add a new CI type to Service Manager by using the Visual Mapping tool in UCMDB,
which means you don't have to sign out of UCMDB and then sign in to Service Manager.

The following steps illustrate how to create a new CI type called RDBMS.


         Note

        This example is provided only as an illustration of the steps. The best practice is to
        reuse the existing Service Manager CI type RunningSoftware to map with UCMDB
        CI type SM RDBMS.

1. Sign in to UCMDB as an administrator.
2. Open an existing XML mapping file (SM Computer Push 2.0.xml, for example) with the

  Visual Mapping tool editor.
3. Select the Root node in the External Class Model panel, and click the Add New CI Type to

  External Class Model icon.
4. Enter parameter values as follows.

  Name: rdbms
  Description: CI type for RDBMS
  table: smrdbms
  subtype: Oracle, SQL Server


5. Click OK.
6. Click OK again to confirm the CI type creation. The CI type is automatically created in

  Service Manager, as shown in the following figure.

     What happens on the Service Manager (SM) side?

     All relevant SM objects (DBDICT, JoinDef, Web Service API, DEM Rule, and so on) for the
     new CI type are automatically created on the SM side, except the format. The new CI type
     will use configurationItem as the default format.

     If you want to use custom formats in SM for the new CI type, you have to create them
     manually. You can create the formats in Forms Designer based on existing view forms and
     bulk update forms. To access Forms Designer in Service Manager, type fd in the
     command line or navigate to Tailoring > Forms Designer. For more information about
     creating forms in Service Manager, see Tailoring best practices.

How to map the CI type’s attributes to Web Service fields

The integration uses the Service Manager Adapter to transform UCMDB CI attributes to web
services objects recognized by Service Manager. The Service Manager Adapter uses XML
configuration files to convert UCMDB queries into a properly formatted Service Manager web
services messages. Out-of-the-box, each integration query has a corresponding XML
configuration file. In addition, each attribute you enable for synchronization from advanced
layout settings requires its own entry in the XML configuration file.

If you want to add a CI type to the integration, you must create a matching XML configuration
file that defines how the Service Manager Adapter transforms each CI type into a Service
Manager web service object. See Integration queries for information about the CI types each
query manages.


The following steps illustrate how to create an XML configuration file for the rdbmsData query
described in previous sections.

To map a CI type’s attributes to web service fields:

   1. Sign in to UCMDB with an administrator account.
   2. Navigate to Data Flow Management > Adapter Management >

     ServiceManagerEnhancedAdapter9.41, and select the adapter.
   3. Click the Create New Resource icon .
   4. Select New Configuration File.
   5. Enter the full file name: <AdapterID>/mappings/push/<filename>. For example,

     ServiceManagerEnhancedAdapter9.41/mappings/push/SM RDBMS Push.xml.
   6. Click OK. The mapping file is created.
   7. Double-click the new mapping file to open it with the Visual Mapping tool editor.

   8. In the Local Query pane, click the Add TQL Queries icon to add the rdbmsData query.

   9. Click OK.                         Page 1141 of 1727

This PDF was generated on May 23, 2026

10. Drag and drop the node “Root” from the Local Query pane into the mapping area.
11. Drag and drop the node “RDBMS” from the External Class Model pane into the mapping

    area.
12. Drag and drop SM attributes you want into the mapping area.

13. Drag and drop the relevant UCMDB attributes into the mapping area.


 14. Save the new mapping file.

                   Note

                When you create or edit and then save a configuration file in Adapter
                Management, UCMDB automatically restarts the adapter with the new
                configuration file.

Using Groovy scripts in XML Configuration Files

The Service Manager Enhanced Generic Adapter uses XML and Groovy mapping scripts for
four field mapping scenarios: One to One, One to Many, Many to Many, and Value Conversion.
Groovy scripts have to be used for complex scenarios. For more information, see Task 7:
Update the configurations for custom CI types in UCMDB.

How to add a custom query to an integration job

In order for the integration to synchronize your custom CI types, attributes, and relationships
between your Service Manager and UCMDB systems, you must add your custom queries to a
data push or population job.

The following steps illustrate how to add a custom query named rdbmsData, which you created
previously (see How to create a query to synchronize the CI type), to a data push job. The
steps for adding a population query to a population job are similar.

To add a custom query to a data push or population job:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Integration Studio.
   3. Click the name of your Service Manager integration point. For example, sm_integration.


 4. Click the Data Push tab.

                 Note

               To add a query to a population job, click the Population tab instead.

 5. Click the name of the integration job. For example, SM Configuration Item Push job.
 6. Click the Edit icon .
 7. Click the Add icon.
 8. Click Integration > Service Manager > Push > rdbmsData.

                 Note

               For population, navigate to Integration > Service Manager > Population, and
               click the population query instead.

 9. Click OK to add the custom query.
10. Enable the Allow Deletion option for the query to allow the integration job to delete

    removed data.
11. Click OK to close the Update Job Definition window.


1.6.2.5.2.8. How to add a CI type, attribute, or
relationship type to the integration for
population

You can find all out-of-the-box mapping files for Population by navigating to Data Flow
Management > Adapter Management > ServiceManagerEnhancedAdapter9.41 >
ServiceManagerEnhancedAdapter9.41/mappings/population/<Name of Mapping File>.
With the Visual Mapping tool, you can add a CI Type, CI attribute, or relationship to the
integration for Population by following similar steps to those for data push. Additionally, you
also need to add your population queries to a population job. Refer to the following steps for
data push:

How to add a CI attribute to the integration for data push
How to add a CI type to the integration for data push

How to add a CI relationship type to the integration for data push


1.6.2.5.2.9. How to enable or disable UCMDB
ID pushback for a CI type

When a new CI is created in UCMDB, a UCMDB ID value is assigned to the CI. When CIs are
synchronized from Service Manager (SM) to UCMDB through population, the UCMDB ID
Pushback feature can push their UCMDB ID values back to SM. The UCMDB ID field is then
used as a flag to indicate if a CI has already been synchronized to UCMDB through population.
There are also cases when you don't want to enable the UCMDB ID pushback feature. For
example, the scheduled_downtime CI type in UCMDB doesn't physically exist in SM. Instead,
the integration retrieves Scheduled Downtime information from several entities in SM and then
synchronizes the information to scheduled_downtime CIs in UCMDB. For this reason, the
UCMDB ID Pushback feature is disabled by default for scheduled_downtime CIs; otherwise a
pushback error will occur during population.
To enable UCMDB ID pushback for a CI type, follow these steps:

   1. Add the following entries to your population configuration file for the CI type (for example,
     My Business Service Population.xml).

          <target_mapping name="sm_id" datatype="STRING"
          value="bizservice['CIName']"/>
          <target_mapping name="global_id" datatype="STRING"
          value="bizservice['UCMDBId']"/>

                   Note

                In this example, bizservice is the CI Type display name defined in Service
                Manager and also the external class model name displayed in the
                UCMDB Visual Mapping interface, as shown in the following figures.


   2. Save the XML configuration file.
   3. Open the smPopConf.xml file, and make sure that the UCMDB ID Pushback setting for the

     CI type is either not present or is set to true:

          <pushback>
               <type name="business_service" enable="true"/>

          </pushback>

     Where: <type name> is the name of the CI type in UCMDB.
To disable UCMDB ID Pushback feature for a CI type, follow these steps:

   1. Open the smPopConf.xml file.
   2. In the <pushback> section, insert one line for the CI type:


<config>
<pushback>
<type name="scheduled_downtime" enable="false"/>
<type name="business_service" enable="false"/>
</pushback>
<mapping>
<tql name="SM Business Service Population 2.0">
...
</tql>
…
</mapping>
</config>
````
