---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.3.5.2.9 .. 1.6.4
printed_pages: 1378-1412
---

# 1.6.3.5.2.9 How to add a CI type to the integration for population

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.3.5.2.9. How to add a CI type to the
integration for population

You can use the following steps to add a CI type to the integration for the population.

   1. Create a query to populate the CI type.

     See Create a query to populate the CI type below.

   2. Map the CI type's query to an XSL transformation file.

     See How to map the CI type's query to an XSL transformation file below.

   3. Map the CI type's attributes to web service fields.

     See How to map the CI type's attributes to Web Service fields below.

Create a query to populate the CI type

Unlike for push, for population the integration doesn't require you to create custom queries in
Universal CMDB to save CI attribute values.

The population feature only needs the smPopConfFile.xml file and population XSL
transformation files to synchronize CI/CI Relationship types and attributes; however for each
CI/CI Relationship type you still need to define a query mapping in the smPopConfFile.xml file,
and the query doesn't necessarily have to exist in UCMDB. It is simply a query name, which will
appear in the query list when you add queries to a population job.

We still recommend you create queries to help you better understand what CI types or
attributes are part of the population. For information on how to create a query in UCMDB, see
How to create a query to synchronize the CI type.

How to map the CI type's query to an XSL transformation
file

The integration uses a configuration file called smPopConfFile.xml to map each Universal
CMDB query to an XSL transformation file. In order for custom queries to be part of the
integration, you must add a mapping entry for each query in the configuration file.

To map the query rdbmsData described in previous sections to the Service
ManagerucmdbRDBMS web service:

To map a query to an XSL transformation file:

   1. Sign in to UCMDB with an administrator account.
   2. Navigate to Data Flow Management > Adapter Management >

     ServiceManagerAdapter9.41 > Configuration Files > smPopConfFile.xml.


3. Add a query mapping element by copying an existing one. A query mapping element uses
  the following format:

      <tql name="Query" xslFile="XSL_File">
                            <request type="Retrieve"

           dataType="Data_Type"
                  retrieveFileList="Retrieve_SM_Tables"
                  retrieveKeysQueryName="Retrieve_keys_web_service"
                  retrieveListQueryName="Retrieve_Objects_web_service"
                  ballQueryCondition="Full_Query_Condition"
                  changedUpdateQueryCondition="Changed_Update_Condition"
                  changedDeletionQueryCondition="Changed_Deletion_Condition"/>

      </tql>

   Query is a query name. The query doesn't have to exist in UCMDB.
   XSL_File is the name of the XSL transformation file that the integration will use to map
  Service Manager web service fields to Universal CMDB attributes.
   Data_Type is the type of the object retrieved from Service Manager. The possible values
  are ci and relationship .
   Retrieve_SM_Tables is the table name list in the Service Manager web service
  configuration; if you define the WSDL on a join definition, you need to list all the table
  names of the join definition to which the fields of XSLT mapping belongs; if you define the
  WSDL on a simple table, simply leave Retrieve_SM_Tables empty. You can also check this
  by opening the WSDL URL: http://<SM server>:<port>/SM/7/<object name>.wsdl . For
  example, out-of-the-box, the instance type of ucmdbNode is as shown in the following
  figure, so the Retrieve_SM_Tables value is file.device, file.node .
  SM tables of the ucmdbNode instance type in the ucmdbNode WSDL are illustrated in
  the following screenshot:


Retrieve_keys_web_service is the name of the Service Manager web service that you
want the integration to use to retrieve a CI Key list from Service Manager.

Retrieve_Objects_web_service is the name of the Service Manager web service that you
want the integration to use to retrieve a CI Object list from Service Manager.

Basic_Query_Condition is an internal Query Condition of Service Manager that you want
the integration to use to retrieve a CI list from Service Manager for a CI type; it is used as
the basic condition for a full or changes population.

Full_Query_Condition is an additional internal Query Condition of Service Manager. Along
with the Basic_Query_Condition, it is used to retrieve a list of all CIs from Service Manager
for a full population.

Changed_Update_Condition is an additional internal Query Condition of Service
Manager; along with the Basic_Query_Condition, it is used to retrieve a list of updated CIs
from Service Manager since the last job execution; it includes both updated CIs and
newly created CIs. It is used for a changes population.

Changed_Deletion_Condition is an additional internal Query Condition of Service
Manager; along with the Basic_Query_Condition, it is used to retrieve a list of deleted CIs
from Service Manager since the last job execution. It is used for a changes population.


The following figure shows an excerpt of the smPopConfFile.xml :

4. Add or update query mapping elements for each query you want to add to the integration.
  For example, the following query creates a mapping between the rdbmsData query and
  the rdbms_population.xslt file.

      <tql name="rdbmsData" xslFile="rdbms_population.xslt">
             <request type="Retrieve" dataType="ci"
                    retrieveFileList="file.device,file.rdbms"
                    retrieveKeysQueryName="RetrieveucmdbRDBMSKeysListRequest"
                    retrieveListQueryName="RetrieveucmdbRDBMSListRequest"
                    basicQueryCondition="type#&quot;rdbms&quot;"
                    fullQueryCondition="istatus~=&quot;Disposed/Retired&quot;"
                    changedUpdateQueryCondition="(devicemodtime>'{fromDate}' or

      (devicemodtime=NULL and created.by.date>'{fromDate}')) and
      istatus~=&quot;Disposed/Retired&quot;"

                    changedDeletionQueryCondition="devicemodtime>'{fromDate}'
      and istatus=&quot;Disposed/Retired&quot;"/>
      </tql>

  The following figure shows the above-mentioned query mapping elements in the
   smPopConfFile.xml file:

The following figure shows an excerpt of the ucmdbRDBMS WSDL for your reference:


   5. Save the configuration file.

            Note

           When you create/edit and then save a configuration file in Adapter Management,
           UCMDB automatically restarts the adapter with the new configuration file.

How to map the CI type's attributes to Web Service fields

The integration uses the Service Manager Adapter to transform Service Manager web services
objects to Universal CMDB CI attributes. The Service Manager Adapter uses XSL
transformation files to convert a properly formatted Service Manager web services messages
into Universal CMDB CI. Out-of-the-box, each integration query has a corresponding XSL
transformation file. In addition, each attribute you want to populate to Universal CMDB requires
its own entry in the XSL transformation file.

If you want to add a CI type to the integration, you must create a matching XSL transformation
file that defines how the Service Manager Adapter transforms each Service Manager web
service field into a CI type. In order to create a proper XSL mapping, you must be familiar with
the service and object names that Service Manager publishes as Web services. For information
on publishing tables and columns as Web service fields, see Service Manager Web Services.


To create an XSL transformation file for the SM RDBMS CI type, which is described in previous
sections:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Adapter Management.
   3. Click the Create new resource button .
   4. Select New Configuration File.
   5. Select the ServiceManagerAdapter9.41 package.
   6. Enter the full file name using this format: <AdapterID>/<filename>. For example,

      ServiceManagerAdapter9.41/rdbms_population.xslt .
   7. Copy the content of an existing XSL transformation file to use it as a template to create

     the new transformation file. For example, copy the content of
      business_service_population.xslt to the new file.

   8. Find the web service response name definition element, which uses the following format:

          <xsl:template match="/SM_WEBSERVICE_RESPONSE_NAME">

      SM_WEBSERVICE_RESPONSE_NAME is the name of web service response in the
     Service Manager system.

     The following figure shows an example of Web Service response definition in
      business_service_population.xslt :

 9. Update the web service response name to match the response name that you want to add
    to the integration. For example, you can create the following CI type definition element to
    add the database response of retrieve object list to the integration.

        <xsl:template match="/RetrieveucmdbRDBMSListResponse">

10. Find the Universal CMDB CI type definition element, which uses the following format:


  <ci class="UCMDB_CI_TYPE_NAME">

UCMDB_CI_TYPE_NAME is the CI type name in the Universal CMDB System.
The following figure shows an example CI type definition in
business_service_population.xslt :

11. Update the Universal CMDB CI type definition name to match the name you want to add
    to the integration. For example, create the following CI type definition element to add the
    database response of retrieve object list to the integration.

        <ci class="sm_rdbms">

                 Note

               Do not use any variables in the CI type definition name. The CI type definition
               name must be a fixed value.

12. Find the elements that transform Service Manager web service fields into Universal
    CMDB CI attributes. The CI attribute transformation elements use the following format:

        <attribute name="UCMDB_CI_attribute_name"
        type="UCMDB_CI_attribute_type" ignoreCIIfEmpty="true">
        <xsl:value-of select="SMAttributeName "/></attribute>

     UCMDB_CI_attribute_name is the name of the CI attribute in the Universal CMDB system.
     UCMDB_CI_attribute_type is the type of the CI attribute in the Universal CMDB system
    that this integration supports. Currently the following types are supported: String,
    StringList, Integer, Long, Double, Boolean, IPAddress, Date, Float, and IntList.


ignoreCIIfEmpty is a parameter that specifies whether or not to ignore the CI during
population if this attribute has an empty value (true: ignore; false: not ignore).

            Note

                A StringList is a list of strings separated by a semicolon (;). For example,
                str1;str2;str3. An IntList is a list of integers separated by a semicolon (;).
                For example, 1;2;3.
                For information about setting a time zone and date format for the Date
                type, see How to Update the Time Zone and Date Format for the
                Integration Adapter.
SMAttributeName is the name of a web service attribute published by the Service
Manager system.
See the following figure for an example of CI attributes in
business_service_population.xslt :

Refer to the following screenshot to match CI attributes in the Universal CMDB
BusinessService CI type:


Refer to the following screenshot to match CI attributes in the Service Manager
ucmdbBusinessService web service:

13. In the SM RDBMS population example, there are no sub items of a CI. If you want to
    populate the sub items of a CI, for example, to populate the IP addresses of a computer
    together with the computer CI, you need to add a "link" element under the "ci" element. A
    link transformation element uses the following format:


  <link direction="Link_Direction" linkType="UCMDB_Link_Type">
         <ci class="UCMDB_SUB_CI_TYPE_NAME">
             <attribute name="UCMDB_CI_attribute_name"

  type="UCMDB_CI_attribute_type">
  <xsl:value-of select="SMAttributeName "/></attribute>

             <attribute name="UCMDB_CI_attribute_name2"
  type="UCMDB_CI_attribute_type2">
  <xsl:value-of select="SMAttributeName 2"/></attribute>

        </ci>
        </xsl:for-each>
  </link>

Link_Direction is the direction between a parent CI and sub CI. The supported directions
are:

     outgoing: The link direction is from an upstream CI to the current downstream CI (for
     example, from node to ip_address).
     incoming: The link direction is from a downstream CI to the current upstream CI.
UCMDB_Link_type is the relationship type in the Universal CMDB system.
The following figures show the out-of-the-box configurations for populating the
Computer CI together with its IP addresses:


Link definition in the import xslt file ( ips_mapping_population.xslt ) is illustrated in the
following screenshot:

Refer to the following screenshot to match CI attributes and links in the Service Manager
WSDL(http://<SM server>:<port>/SM/7/ucmdbNode.wsdl):


Refer to the following screenshot to match CI links in UCMDB at the TQL level:

            Note

           The figure above is provided only to give you a graphic view of how relevant
           CIs are stored in UCMDB. You don't need to create the query, since the
           population feature doesn't require it.

Refer to the following screenshot to match CI type and attributes in the UCMDB CI Type
( IpAddress ):


14. Add or update the CI attribute transformation elements for each CI attribute you want to
    add to the integration. For example, you can use the following XSL transformation
    elements for the database CI type.

UCMDB attribute                                                                                                                          Service Manager 9.81

                                        Sample XSL transformation elements for database CIs

                                                               Sample transformation elements

discovered_product_name

                                        <attribute
                                        name="discovered_product_name
                                        " type="String">
                                        <xsl:value-of
                                        select="file.device/CIIdentif
                                        ier"/></attribute>

product_name

                                        <attribute
                                        name="product_name"
                                        type="String">
                                        <xsl:value-of
                                        select="file.device/Applicati
                                        onName"/></attribute>

application_version

                                        <attribute
                                        name="application_version"
                                        type="String">
                                        <xsl:value-of
                                        select="file.device/ProductVe
                                        rsion"/></attribute>

vendor

                                        <attribute name="vendor"
                                        type="String">
                                        <xsl:value-of
                                        select="file.device/Vendor"/>
                                        </attribute>

version

                                        <attribute name="version"
                                        type="String">
                                        <xsl:value-of
                                        select="file.device/Version"/
                                        ></attribute>


UCMDB attribute                         Sample transformation elements
dbinstance
                                          <attribute name="dbinstance"
port                                      type="String">
                                          <xsl:value-of
description                               select="file.rdbms/DBInstance
                                          "/></attribute>

                                          <attribute name="port"
                                          type="String">
                                          <xsl:value-of
                                          select="file.rdbms/Port"/>
                                          </attribute>

                                          <attribute name="description"
                                          type="String">
                                          <xsl:value-of
                                          select="file.rdbms/Descriptio
                                          n"/></attribute>

Attribute mappings in rdbms_population.xslt are illustrated in the following screenshot:


15. Save the XSL transformation file.

          Note

         When you create/edit and then save a configuration file in Adapter Management,
         UCMDB automatically restarts the adapter with the new configuration file.


1.6.3.5.2.10. How to add a CI type’s
relationship types to the integration for
population

Once you have added a new CI type to the integration for population, you need to add the new
CI type’s relationship types to the integration. For each relationship type, perform the following
tasks.

As an example, the following steps describe how to add the Ownership relationship type to the
integration; these steps assume that you have already added the Cost and CostCategory CI
types to the integration for population.

   1. Create an XSL transformation file to map each relationship type’s attributes to web
     service objects.

     See How to map each relationship type's attributes to Web Service objects below.

   2. Add a query mapping for each relationship type to the population configuration file.

     See How to define a query mapping for each relationship type below.

How to map each relationship type's attributes to Web
Service objects

This example illustrates how to create an XSL transformation file to map the attributes of the
Ownership relationship type to web service objects.

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Adapter Management.
   3. Click the Create new resource button .
   4. Select New Configuration File.
   5. Select the ServiceManagerAdapter9.41 package.
   6. Enter the full file name using this format: <AdapterID>/<filename>. For example,

      ServiceManagerAdapter9.41/cost_to_costcategory_population.xslt .
   7. Click Yes to ignore the file extension warning. The file is added to the Configuration Files

     folder.

   8. Copy the content of an existing relationship population XSLT file (for example,
      computer_to_computer_connects_population.xslt ) to the new XSLT file.

                   Note

                In the next step, you will update the <ci class> names and linkType value.


      <xsl:stylesheet version="1.0"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

             <xsl:template match="/Retrievecirelationship1to1ListResponse">
                    <topology>
                            <xsl:for-each select="instance">
                                   <ci class="node">
                                          <attribute name="name" type="String">

      <xsl:value-of select="upstreamci.logical.name"/></attribute>
                                          <attribute name="sm_id" type="String">

      <xsl:value-of select="upstreamci.id"/></attribute>
                                          <link direction="outgoing" linkType="tcp">
                                                 <ci class="node">
                                                         <attribute name="name" type="String">

      <xsl:value-of select="downstreamci.logical.name"/></attribute>
                                                         <attribute name="sm_id" type="String">

      <xsl:value-of select="downstreamci.id"/></attribute>
                                                 </ci>

                                          </link>
                                 </ci>
                            </xsl:for-each>
                    </topology>
             </xsl:template>
      </xsl:stylesheet>

9. Change the <ci class> names to cost and cost_category , and linkType to ownership .

      ...
      <ci class="cost">

                                          <attribute name="name" type="String">
      <xsl:value-of select=
      "upstreamci.logical.name"/></attribute>

                                          <attribute name="sm_id" type="String">
      <xsl:value-of select=
      "upstreamci.id"/></attribute>

                                          <link direction="outgoing"
      linkType="ownership">

                                                 <ci class="cost_category">
      ...

   ci class : the name (not display name) of the each CI type involved in the relationship. It
  should be the Name field value on the General Details tab of the CI type definition.
   linkType : the name of the relationship type. It should be the Name field value on the
  General Details tab of the relationship type definition.


                   Note

                In this example, you don't need to change the link direction (outgoing). This is
                because the relationship (Ownership) direction is from cost to cost_category,
                that is, from a <ci class> outside of the <link> element to a <ci class> inside
                it).

 10. Save the XSL transformation file.

How to define a query mapping for each relationship
type

For each relationship type of the new CI type, you need to define a query mapping in the
smPopConfFile.xml file.

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Adapter Management >

     ServiceManagerAdapter9.41 > Configuration Files > smPopConfFile.xml.
   3. In the smPopConfFile.xml file, add a query mapping for the relationship type, by copying

     an existing query mapping element.

                   Note

                In the next step, you will update the highlighted values with values of the new
                relationship type.


      <tql name="SM Biz To Biz With Usage"
      xslFile="businessservice_to_businessservice_usage_population.xslt">

           <request type="Retrieve" dataType="relationship"

      retrieveKeysQueryName="Retrievecirelationship1to1KeysListRequest"

      retrieveListQueryName="Retrievecirelationship1to1ListRequest"
                  basicQueryCondition="upstreamci.type=&quot;bizservice&quot;

      and
      downstreamci.type=&quot;bizservice&quot; and
      relationship.subtype=&quot;Usage&quot;"

                  fullQueryCondition="status~=&quot;Removed&quot;"

      changedCreationQueryCondition="create.datetime&gt;'{fromDate}' and
      status~=&quot;Removed&quot;"

      changedUpdateQueryCondition="created.datetime&lt;='{fromDate}' and
      update.datetime&gt;'{fromDate}' and status~=&quot;Removed&quot;"

      changedDeletionQueryCondition="update.datetime&gt;'{fromDate}' and
      status=&quot;Removed&quot;"/>
      </tql>

4. Update the TQP mapping element with the values of the new relationship type.

               Note

             For the query name, you can enter any descriptive name as you like (for
             example, SM Cost to CostCategory with Ownership). This query doesn't really
             exist, since population doesn't require it.
             The upstreamci.type, downstreamci.type, and relationship.subtype values are
             defined in the cirelationship1to1 table in Service Manager.


          <tql name="SM Cost to CostCategory with Ownership"
          xslFile="cost_to_costcategory_population.xslt">

               <request type="Retrieve" dataType="relationship"

          retrieveKeysQueryName="Retrievecirelationship1to1KeysListRequest"

          retrieveListQueryName="Retrievecirelationship1to1ListRequest"
                      basicQueryCondition="upstreamci.type=&quot;cost&quot; and

          downstreamci.type=&quot;costcategory&quot; and
          relationship.subtype=&quot;Ownership&quot;"

                      fullQueryCondition="status~=&quot;Removed&quot;"

          changedCreationQueryCondition="create.datetime&gt;'{fromDate}' and
          status~=&quot;Removed&quot;"

          changedUpdateQueryCondition="created.datetime&lt;='{fromDate}' and
          update.datetime&gt;'{fromDate}' and status~=&quot;Removed&quot;"

          changedDeletionQueryCondition="update.datetime&gt;'{fromDate}' and
          status=&quot;Removed&quot;"/>
          </tql>

   5. Save the population configuration file.

                   Note

                When you create/edit and then save a configuration file in Adapter
                Management, UCMDB automatically restarts the adapter with the new
                configuration file.

Now the relationship type is added to the integration for population. Next, you need to add the
relationship query name you specified in the population configuration file (in this example, SM
Cost to CostCategory with Ownership) to a relationship population job, so that the integration
can populate this type of relationships to UCMDB. See the following figure and also How to add
custom queries to integration population jobs.
Refer to the following screenshot to add a new relationship query name to a relationship
population job:



1.6.3.5.2.11. How to customize UCMDB ID
pushback for a CI type

Out-of-the-box, UCMDB pushes the UCMDB ID of each CI type back to Service Manager
during population, by calling a Service Manager web service ( ucmdbIDPushBack ) based on
the ucmdbid.pushback.request and ucmdbid.pushback.xslt settings in the sm.properties
file in UCMDB. See How to update the integration adapter configuration file (sm.properties).
To better suit your business needs, you can make the following tailorings to the ucmdb id
pushback feature, using the <idPushbackConfigurations> element in the
ServiceDeskConfiguration.xml file:

     How to disable the UCMDB ID pushback feature for a specific CI type
     How to define a custom pushback Web Service and xslt file for a specific CI type

            Note

           For a specific UCMDB class (CI type), its definitions in the
           ServiceDeskConfiguration.xml file supercede the following global settings in the
           sm.properties file:

                idPushbackEnable: In the sm.properties file, this setting is not present;
                however, out-of-the-box, it is set to true for all CI types.
                idPushbackRequest: In the sm.properties file, its out-of-the-box value is
                UpdateucmdbIDPushBackRequest.
                idPushbackXSLT: In the sm.properties file, the out-of-the-box value is
                ucmdbid_pushback.xslt.

How to disable the UCMDB ID pushback feature for a
specific CI type

You may want to disable the pushback feature for certain UCMDB CI types, for example,
UCMDB classes that are mapped to a sub-item type (IP Address, CPU, etc.) in Service
Manager. Doing so can aviod unnecessary system overload.

To disable the pushback feature for a UCMDB CI type (class), use this format:

  <idPushbackConfiguration ucmdbClassName="<ucmdbClassName>"
  idPushbackEnable="false"/>

Where, <ucmdbClassName> is the name of the UCMDB CI type.
Here are the out-of-the-box settings in the ServiceDeskConfiguration.xml file:


  <idPushbackConfigurations>
                 <idPushbackConfiguration ucmdbClassName="interface"

  idPushbackEnable="false"/>
         <idPushbackConfiguration ucmdbClassName="cpu"

  idPushbackEnable="false"/>
      <idPushbackConfiguration ucmdbClassName="disk_device"

  idPushbackEnable="false"/>
      <idPushbackConfiguration ucmdbClassName="file_system"

  idPushbackEnable="false"/>
      <idPushbackConfiguration ucmdbClassName="ip_address"

  idPushbackEnable="false"/>
  </idPushbackConfigurations>

To enable the pushback feature for a CI type, set idPushbackEnable="true" for it.

How to define a custom pushback Web Service and xslt
file for a specific CI type

There are occasions when you need to define a custom pushback web service and XSLT for a
specific CI type (class), for example, when a CI type you want to populate is not stored in the
device table in Service Manager. This is because the out-of-the-box ucmdbIDPushBack web
service is based on the device table.
For example, you have tailored the integration in order to populate the Functional Group from
Service Manager to UCMDB. If the Functional Group in Service Manager is not stored in the
device table, you can define a custom web service and XSLT like the following:

  <idPushbackConfigurations>
               <idPushbackConfiguration ucmdbClassName="functional_group"

  idPushbackEnable="true"
  idPushbackRequest="UpdateucmdbIDPushBackForFunctionalGroupRequest"
  idPushbackXSLT="ucmdbid_pushback_functionalgroup.xslt"/>
  ......
  </idPushbackConfigurations>

            Note

           To support your pushback customizations, you need to create the specified
           custom web service record in Service Manager and XSLT file in UCMDB.


1.6.3.5.2.12. How to add custom queries to
integration population jobs

To send your custom SM web service object and fields to your UCMDB system, you must add
your custom queries to the population job between your SM data store and your UCMDB data
store. The following steps illustrate how to add the custom rdbmsData query described in
previous sections.
To add custom queries to population job definitions:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Integration Studio.
   3. Double-click the name of your Service Manager integration point. For example, SM

     Integration.
   4. Click the Population tab.
   5. Select a population job. For example, SM Configuration Item Population job.

   6. Click the Edit Integration Job button .
   7. Click the Add button .

     The query names configured in the smPopConfFile.xml file are listed.
   8. Click Root > rdbmsData.
   9. Click OK to add a custom query.
 10. Click OK to close the Update Job Definition window.


1.6.3.5.2.13. How to add an attribute of a
supported CI type for federation

Out-of-the-box, the integration supports federation for three external CI types in UCMDB:
Incident, Problem, and RequestForChange.
For each of the supported CI types, there is a list of attributes in UCMDB that you can map to
Service Manager web service objects for federation. The following figure shows the out-of-
the-box UCMDB CI attributes available for the Incident CI type.
Incident CI attributes supported for federation are illustrated in the following screenshot:

For example, to add an SM Incident attribute for federation, you need to expose the field in the
SM UcmdbIncident web service object and then map it to an appropriate UCMDB attribute (if
one doesn't already exist, you need to create it in UCMDB first).

The following figure shows the fields that are exposed in the UcmdbIncident web service
object in Service Manager:


You can expose more fields so that more Incident attributes can be federated to UCMDB. As an
example, the following describes how to add the action field in the Service Manager
probsummary (Incident) file for federation, by mapping it to a new UCMDB attribute named
details.

            Note

           On the Incident form in Service Manager, the action field is labeled Description,
           which describes the incident ticket in more detail. See the following figure.

To add an attribute of a supported CI type for federation:

   1. Add the SM attribute to its web service object.

     The following example describes how to expose the SM action field of Incident in
     UCMDBIncident web service object.

        1. Sign in to Service Manager as a system administrator.
        2. Navigate to Tailoring > Web Services > WSDL Configuration.


3. Enter the following field values, and then click Search.

        Service Name: ucmdbIntegration
        Name: probsummary

  UCMDBIncident web service object is displayed.

4. On the Fields tab, add the following row:

        Field: action.
        Caption: Description

     5. Save the web service object.

2. Map the SM attribute to a UCMDB attribute.

  The following example describes how to map the SM action attribute to a new UCMDB
  attribute named details.

     1. Sign in to UCMDB as an administrator.
     2. Navigate to Modeling > CI Type Manager.
     3. Browse to ItProcessRecord > Incident, and open its properties pane.

     4. Click the Add button to add a new attribute named details to the Incident CI type.


        name: details
        Display Name: Details
        Description: Incident details
        Attribute Type: Primitive > List of strings (this is because the action field in SM
        is an array)
5. Save the Incident CI type record.
6. Navigate to Data Flow Management > Adapter Management >
  ServiceManagerAdapter9.41 > Configuration Files.
7. Click the ServiceDeskConfiguration.xml file.

8. Add a mapping entry for the details attribute in the Incident attributeMappings
  section, as shown in the following.


<ucmdbClassConfiguration ucmdbClassName="incident">
       <attributeMappings>
              <attributeMapping ucmdbAttributeName="reference_number"

serviceDeskAttributeName="IncidentID"/>
              <attributeMapping ucmdbAttributeName="name"

serviceDeskAttributeName="BriefDescription"/>
                ...

              <attributeMapping ucmdbAttributeName="incident_status"
serviceDeskAttributeName="IMTicketStatus"
converterClassName="com.mercury.topaz.fcmdb.adapters.
serviceDeskAdapter.converter.PropertyValueConverterFirstLetter
ToUpperAndReplaceUnderscoreWithSpace"
reversedConverterClassName="com.mercury.topaz.fcmdb.adapters.
serviceDeskAdapter.converter.PropertyValueConverterFirstLetter
ToLowerAndReplaceSpaceWithUnderscore"/>

                ...
            <attributeMapping ucmdbAttributeName="urgency"
serviceDeskAttributeName="Urgency"/>
<attributeMapping ucmdbAttributeName="details"
serviceDeskAttributeName="Description"/>
       </attributeMappings>


                   Tip

                The attribute mapping entry uses the following format:

                        <attributeMapping ucmdbAttributeName="details"
                        serviceDeskAttributeName="Description"/>

                Where:
                 ucmdbAttributeName is the UCMDB attribute name in the Incident CI
                type definition to which you want to map the SM attribute;
                 serviceDeskAttributeName is the field caption you defined in the SM
                web service object.
                For an SM attribute (for example, problem.status) that's a drop-down
                list, the attribute mapping uses the following format (you only need to
                change the attribute names):

                        <attributeMapping ucmdbAttributeName="incident_status"
                        serviceDeskAttributeName="IMTicketStatus"
                        converterClassName="com.mercury.topaz.fcmdb.adapters.
                        serviceDeskAdapter.converter.PropertyValueConverterFir
                        stLetter
                        ToUpperAndReplaceUnderscoreWithSpace"
                        reversedConverterClassName="com.mercury.topaz.fcmdb.ad
                        apters.
                        serviceDeskAdapter.converter.PropertyValueConverterFir
                        stLetter
                        ToLowerAndReplaceSpaceWithUnderscore"/>

   9. Click OK to save the file.
Now the Description (field name: action) attribute of SM Incident has been added to the
integration for federation. You can run an Incident federation query in the UCMDB
Modeling Studio to see if the SM Description data is properly federated. For details, see
Examples of using federation.
The following figure shows an example where the Description of an SM incident ticket has
been federated to UCMDB as Details:



1.6.4. CMS UI

The UCMDB UI is a lightweight web-based client to access UCMDB data. The UCMDB UI
provides a simple and intuitive search for Configuration Items (CIs) in UCMDB and displays
important data in the context of the selected CI. It is an ideal tool for providing quick access to
specific CI information. For each CI, relevant data is presented and gathered into information
widgets (for example, Properties, Environment, and Impact Simulation widgets). Data is
presented by default in a Preview mode, with the option to view more comprehensive data in
an Expanded mode.

How to integrate Service Manager with the UCMDB UI

You enable an integration to the UCMDB UI when enabling an integration to UCMDB. For
details, see How to add UCMDB connection information.

Supported use cases

When integrated with UCMDB UI, Service Manager provides the following out-of-box features.

Viewing CI information in the UCMDB UI

A View in UCMDB UI button is available in the Configuration Item form. This button is displayed
in each CI record that's synchronized from UCMDB. When a user clicks this button a CI, a
UCMDB UI login screen is displayed; after the user logs in with a UCMDB UI account
(username/password), the UCMDB UI opens in the context of this CI.

Retrieving primary CI change history from the UCMDB UI
The Change History widget from the UCMDB UI is displayed in a problem record whose
primary CI is synchronized from UCMDB. This widget is provided in the Primary CI History in
UCMDB tab on the Problem form. Users can view the CI changes on that primary CI for root
cause investigation.

            Note

           For accessibility support of the embedded UCMDB widget, refer to the UCMDB UI
           documentation.

Support of Automated Service Modeling (ASM)

            Note

           Automated Service Modeling requires the UCMDB ASM Enhanced package to be
           deployed in UCMDB.

Service Manager supports the ASM functionality in the UCMDB UI. Service CIs and consumer-
provider relationships that are discovered by ASM can be pushed to Service Manager;


additionally, you can tailor Service Manager such that Service Manager users can access ASM
in the context of a business service, and access Impact Simulation in the context of an affected
CI.
Support of ASM enables Service Manager users to view the accurate service trees that are
discovered by ASM and facilitates service modeling in Service Manager.
For details, see Universal CMDB.

Related topics

Universal CMDB
````
