---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.2 .. 1.6.2.1
printed_pages: 897-924
---

# 1.6.2 Using the ServiceManagerEnhancedAdapter9.41 adapter

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.2. Using the
ServiceManagerEnhancedAdapter9.41
adapter

This section describes how to implement an integration between Service Manager and
UCMDB by using the ServiceManagerEnhancedAdapter9.41 adapter.
How to upgrade your integration
Integration setup
Multi-tenancy (Multi-company) setup
Standards and best practices
Tailoring the integration


1.6.2.1. How to upgrade your integration

This section describes the upgrade steps required to use the
ServiceManagerEnhancedAdapter9.41 adapter with Service Manager, including steps to adapt
the integration to the logical name solution introduced in Service Manager 9.41 and steps to
migrate from an XSLT-based adapter to a generic adapter.

The logical name solution contains significant CI related code changes. For example, prior to
version 9.41, Service Manager used the logical.name field in the device table to store CI
names. The logical.name field must be unique in the Service Manager system, but UCMDB
allows duplicate CI names. As a result, CIs may have to be renamed when they are pushed
from UCMDB to Service Manager. Starting with version 9.41, Service Manager stores CI names
in the display.name field in the device table, and stores unique CI identification numbers in the
logical.name field. The display.name field allows duplicate values if they are pushed from
UCMDB, and requires unique values for CIs that are created from Service Manager (unless
they're not of the same CI type).

Before you proceed to the upgrade steps described in this section, make sure you have a good
understanding of the logical name solution and its impact on the SM-UCMDB integration. For
details, see the Service Manager Logical Name Solution white paper.

Perform the following tasks to upgrade your integration to use the
ServiceManagerEnhancedAdapter9.41 adapter.

Task 1. Close All SM unplanned Changes and Incidents created for CI modifications

Task 2. Upgrade Service Manager

(Optional) Task 3. Copy data to the joinnode table

Task 4. Update the DEM rules in Service Manager

Task 5. Enable the Restful API for custom CI types in Service Manager

Task 6. Upgrade UCMDB

Task 7. Upgrade the configurations for custom CI types in UCMDB

Task 8. Upgrade field mapping

Task 9. Reconfigure an integration point

Task 10. Run a full push to resynchronize CI names

Task 11. Restore the DEM rules in Service Manager


1.6.2.1.1. Task 1. Close all SM unplanned
Changes and Incidents created for CI
modifications

Before you upgrade Service Manager (SM), close all unplanned Change and Incident records
that were created due to CI modifications. After the system upgrade, you will run a full data
push to resynchronize CI names from UCMDB to the display.name field in the Service
Manager device table.


1.6.2.1.2. Task 2. Upgrade Service Manager

If you want to use the ServiceManagerAdapter9.41 adapter for the integration, you must
upgrade Service Manager to version 9.41 or later, which uses display.name instead of
logical.name for field mapping between UCMDB and Service Manager.

            Note

           The upgrade includes the SM server, Windows and web clients, applications, and
           Mobility client. If you upgrade only the server and clients and your applications
           version is still earlier than 9.41, you can only use an old adapter rather than any of
           the Service Manager 9.41 adapters.

For information about how to upgrade Service Manager, see Upgrade.


1.6.2.1.3. (Optional) Task 3. Copy data to the
joinnode table

Service Manager uses the joinnode table to replace the mainframe, networkcomponents,
storage, and computer tables. If you are upgrading from Service Manager 9.31 or earlier and
want to migrate to the joinnode-based data mappings, you need to copy data to the joinnode
table.

            Note

           If you want to use the original tables instead of joinnode, this task is not needed.
           Instead, you need to modify the data mappings of your Service Manager adapter in
           UCMDB.

To copy your data to the joinnode table, follow these steps:

   1. Sign in to Service Manager as a system administrator.
   2. Open Database Manager
   3. Enter cidatacopy in the Table field, and then click Search. The Copy CI Type Data form

     opens.
   4. Click Search. A list of records is displayed: joincomputer, joinmainframe,

     joinnetworkcomponents, and joinstorage.
   5. Select each record from the list, update or add source/target fields as needed, and click

     the Copy Data button. One of the following messages is displayed:
           A message that resembles “<XXX> records were successfully copied, and <YYY>
           records were ignored within xxx ms”, where XXX and YYY represent the numbers of
           records copied and ignored, respectively.
           “Configuration validation failed, and no records were copied. Please check your
           Source Fields/Target Fields settings and run Copy Data again.”

   6. If the error message is displayed, correct your Source Fields/Target Fields settings, and
     click Copy Data again until all of your records have been successfully processed.


1.6.2.1.4. Task 4. Update the DEM rules in
Service Manager

Service Manager 9.41 or later uses an updated CI form which may rename CI names in the
logical.name field. Hence, you may want to correct these CI names and update the CI Display
Name (display.name) field values in SM by using the new field mapping.
To do this, you need to run a full data push to resynchronize the CIs to Service Manager.
Before doing so, you must update the Discovered Event Manager (DEM) rules to avoid creating
unwanted Change or Incident records due to the CI name changes.

   1. Sign in to Service Manager as a System Administrator.
   2. Navigate to Tailoring > Web Services > Discovered Event Manager Rules.
   3. Click Search.
   4. For each DEM rule record, select Log Results and update record for Action if record

     exists but unexpected data discovered.


1.6.2.1.5. Task 5. Enable the Restful API for
custom CI types in Service Manager

If your existing UCMDB-SM integration environment uses any custom CI types, you need to
update the External Access Definition of each custom CI type in Service Manager to enable its
RESTful API for using a generic adapter. A Service Manager generic adapter requires the
ucmdbIntegration RESTful APIs to work.

The following table describes the parameters that you need to update in each External Access
Definition in Service Manager (System Administration > Tailoring > Web Services > External
Access Definition).


Parameter                               Description                   Example Value

RESTful Enabled                         Enables the RESTful API       true

                                        (must be set to true to

                                        enable the RESTful API)

Resource Collection Name                Specifies a unique name for   ucmdbATMs
                                        the resource collection. The
                                        following convention is
                                        recommended: <WS Object
                                        Name>+'s'

Resource Name                           Specifies a name for the      ucmdbATM
                                        resource. The following
                                        convention is
                                        recommended: <WS Object
                                        Name>

Unique Keys                             Unique keys of the relevant logical.name
                                        device table

Max Records Returned in Maximum number of                             1000

Query                                   returned records in one

                                        query

Resource Collection Actions Action to invoke for a POST               Create

- POST                                  request on the resource

                                        collection

Resource Actions - POST                 Action to invoke for a POST Create
                                        request on the resource

Resource Actions - PUT                  Action to invoke for a PUT    Update
                                        request on the resource

Resource Actions - DELETE               Action to invoke for a        Delete
                                        DELETE request on the
                                        resource

To access these parameters, follow these steps:

   1. Open the External Access Definition for the custom CI type.
        1. Click Tailoring > Web Services > Web Service Configuration to open the External
           Access Definition form.
        2. In the Service Name field, type ucmdbIntegration.


     3. In the Name field, select the table for the custom CI type.
     4. In the Object Name field, type the relevant web service object name.
     5. Click Search.
2. Click the Restful tab, and update the parameters.
  As an example, the following figure shows the external access definition of a custom CI
  type named ATM Machine.



1.6.2.1.6. Task 6. Upgrade UCMDB

Service Manager 9.41 or later can work with XSLT-based adapters and generic adapters
specifically designed for Service Manager 9.41 or later:

     ServiceManagerAdapter9.41 for UCMDB 10.01, 10.11, 10.20, 10.21, or 10.30

                   Note

                These are four XSLT-based adapters, one for each of the UCMDB versions.

     ServiceManagerEnhancedAdapter9.41 for UCMDB 10.20, 10.21, or 10.30

                   Note

                These are two generic adapters based on the UCMDB generic framework,
                one for each of UCMDB 10.20 and 10.21.

For more information, see Integration Requirements.


1.6.2.1.7. Task 7: Update the configurations for
custom CI types in UCMDB

The configurations for all out-of-the-box CI types in UCMDB 10.20 are already based on the
Service Manager Enhanced Generic Adapter. However, you still need to perform the following
steps to manually update the configurations for your custom CI types in UCMDB.

Step 1. Convert the mapping scripts from XSLT to XML
and Groovy.

The old Service Manager adapters use XSLT scripts for field mapping between UCMDB and
SM. Most of the mapping scripts were developed for the four typical mapping scenarios
described in the following table.

Scenario                                Notes
One to One field mapping
                                             One field in one side is mapped to one
                                             field in the other side
                                             The value is synchronized between
                                             UCMDB and SM directly (without value
                                             conversion)

One to Many field mapping               One field in one side is mapped to
                                        many fields in the other side
                                        The value of the one field is calculated
                                        based on the values of many fields

Many to Many field mapping              Multiple fields are defined as a child CI
                                        type of the relevant CI type
                                        A single record has multiple child
                                        instances

Value Conversion                        The value of one field is converted to
                                        another value based on a specific
                                        algorithm
                                        Value conversion can happen on all
                                        kinds of field mappings (one to one,
                                        one to many, and many to many)


The Service Manager Enhanced Generic Adapter uses XML and Groovy mapping scripts. Old
mapping scripts for the out-of-the-box CI types have been converted to XML and Groovy by
default. However, you still need to convert your existing custom scripts to XML and Groovy.

To convert a custom mapping script, you need to identify its mapping scenario (One to One,
One to Many, Many to Many, or Value Conversion) first; then you can convert the script by
referring to the following sample scripts for your specific scenario.

            Tip

           In all mapping scenarios, you can use the Visual Mapping tool to generate an XML
           script skeleton. Compared with the use of an old XSLT adapter, this is much easier
           as you can drag and drop the mapped fields to generate the script instead of
           writing every code line from scratch. For details about how to use XML and Groovy
          scripts in the UCMDB integration framework, see the Universal CMDB 10.20
          Developer Reference Guide.

            Tip

           The Service Manager Enhanced Generic Adapter has four out-of-the-box Groovy
           scripts, which you can use as a reference:

                SMUtils.groovy: defines common methods used for push, population, and
                federation.
                SMPushFunctions.groovy: defines the methods used in the out-of-the-box
                push mapping scripts.
                SMPopulateFunctions.groovy: defines the methods used in the out-of-the-
                box population mapping scripts.
                SMFederationFunctions.groovy: defines the methods used in the out-of-the-
                box federation mapping scripts.

           Additionally, the SMFederationConverter.groovy script defines value conversions
           for federation.

Field mapping must use the correct data type for each attribute. It is convenient to determine
the data type for an attribute by using the Visual Mapping tool. The following figure illustrates
the data type for the CIIdentifier attribute. You can either find the data type from the External
Class Model Attributes pane or simply drag and drop the attribute from that pane to the Visual
Mapping area to automatically get the correct data type.


One to One Field Mapping
Sample Script in XSLT:

  <Type>computer</Type>

Or

  <UCMDBId><xsl:value-of select="@id"/></UCMDBId>

Or

  <xsl:for-each select="@display_label">
  <DisplayName><xsl:value-of select="."/></DisplayName>

  </xsl:for-each>

Sample Script in XML (Groovy is not required in this scenario):

  <target_mapping datatype="STRING" name="DisplayName"
  value="Root['display_label']"/>

Where: The datatype must be the correct data type defined in Service Manager for the
attribute. You can find the data type from the Visual Mapping tool interface.

One to Many Field Mapping


Sample Script in XSLT:

  <xsl:variable name="prefix" select="'Value&gt;'"/>
  <xsl:variable name="suffix" select="'&lt;/Value'"/>
  <Subtype>
  <xsl:choose>
  <xsl:when
  test="contains(@node_role,concat($prefix,'desktop',$suffix))">Desktop</
  xsl:when>
  <xsl:when test="@os_family">
  <xsl:value-of select="@os_family"/>
  </xsl:when>
  <xsl:otherwise>Server</xsl:otherwise>
  </xsl:choose>
  </Subtype>

Sample Script in XML:

  <target_mapping datatype="STRING" name="Subtype"
  value="SMPushFunctions.getSubType('computer',Root['node_role'],Root['os
  _family'])"/>

Sample Script in Groovy:
You must develop a groovy function to implement the mapping logic. Usually the relevant fields
in the counterpart system will be used as the parameters of the Groovy function.

Many to Many Field Mapping

Sample Script in XSLT:

<xsl:for-each select="cpus">
<cpu>
<xsl:for-each select="cpu">
<cpu>
<CpuID><xsl:value-of select="@cpu_id"/></CpuID>
<CpuName><xsl:value-of select="@name"/></CpuName>
<CpuClockSpeed>
<xsl:value-of select="@cpu_clock_speed"/>
</CpuClockSpeed>
</cpu>
</xsl:for-each>
</cpu>
</xsl:for-each>


Sample Script in XML:

  <for-each-source-entity count-index="i" source-entities="Root.Cpu">
  <target_entity name="cpu">
  <target_mapping datatype="STRING" name="CpuID" value="Root.Cpu[i]
  ['cpu_id']"/>
  <target_mapping datatype="STRING" name="CpuName" value="Root.Cpu[i]
  ['name']"/>
  <target_mapping datatype="STRING" name="CpuClockSpeed"
  value="Root.Cpu[i]['cpu_clock_speed']"/>
  </target_entity>
  </for-each-source-entity>

Where: <source-entities> (Root Cpu) comes from the local TQL query structure, while
<target_entity name> (cpu) comes from the <cpu> tag in the XSLT file.

            Note

           Groovy scripts aren't required for this scenario.

Value Conversion

Sample Script in XSLT:

  <xsl:if test="@customer_id">
  <xsl:variable name="ucmdbCustomerId" select="@customer_id"/>
  <xsl:variable name="tenantMappingEntry"
  select="document('SM_MT_mapping.xml')/list['TenantMapping']/entry[@ucmd
  b=$ucmdbCustomerId]"/>
  <xsl:choose>
  <xsl:when test="$tenantMappingEntry">
  <CustomerId><xsl:value-of select="$tenantMappingEntry/@sm"/>
  </CustomerId>
  </xsl:when>
  <xsl:otherwise>
  <CustomerId><xsl:value-of select="@customer_id"/></CustomerId>
  </xsl:otherwise>
  </xsl:choose>
  </xsl:if>

Or


  <xsl:if
  test="contains(@node_role,concat($prefix,'virtualized_system',$suffix))
  ">
  <IsVisualization>true</IsVisualization>
  </xsl:if>

Sample Script in XML:

  <target_mapping datatype="STRING" name="CustomerId"
  value="SMPushFunctions.getCustomerId(CustomerInformation)"/>

Or

  <target_mapping datatype="BOOLEAN" name="IsVisualization"
  value="SMPushFunctions.isVisualization(Root['node_role'])"/>

            Note

           Usually the relevant field in the counterpart system will be used as one of the
           parameters of the Groovy function.

Sample Scripts in Groovy:


  /**
  * Priority Mapping
  * [uCMDB value : SM value ]
  */
  private static final def PriorityMapping = [
  "1_critical":"1",
  "2_high":"2",
  "3_average":"3",
  "4_low":"4"];

  /**

  * Convert the Priority value from uCMDB to SM
  *
  * @param priority uCMDB Priority value
  * @return SM Priority value
  */
  public static String convertPriority(String priority, DataAdapterLogger
  log) {
  return convertEnumValue(priority,"Priority");
  }

Step 2. Update the configuration files.

Update the files as described in the following table.

File                                                                                             Service Manager 9.81
icon.properties
sm.properties                           Description

smFedConf.xml                           This configuration file defines the UCMDB
                                        icons that will be displayed in the mapping
                                        tool for Service Manager CI Types. If you
                                        have defined any custom CI types in SM,
                                        you can update this configuration file to
                                        assign them appropriate icons.

                                        For more information, see the Universal
                                        CMDB Data Flow Management Guide.

                                        This is the integration adapter configuration
                                        file. If you have modified the out-of-the-box
                                        settings in your old sm.properties file (for
                                        example, the number of concurrent
                                        threads), you need to update this
                                        configuration file accordingly for those
                                        options that are still valid in the Service
                                        Manager Enhanced Generic Adapter.

                                        For more information, see How to update
                                        the integration adapter configuration file
                                        (sm.properties).

                                        This configuration file is used for federation
                                        and is introduced by the Service Manager
                                        Enhanced Generic Adapter. If you have any
                                        custom logic for the federation feature,
                                        such as custom fields for federation CIs,
                                        you need to update this configuration file.


File                                    Description
smPopConf.xml
                                        This configuration file is used for population
                                        and replaces the old smPopConfFile.xml
                                        configuration file. If you have any custom
                                        logic for the population feature, such as
                                        custom query conditions, you need to
                                        update this configuration file.

                                        For more information, see the following
                                        topics:

                                        What is the purpose of the <container>
                                        element in the population configuration file
                                        (smPopConf.xml)?

                                        No TQL query configured in smPopConf.xml

smPushConf.xml                          This configuration file is used for
                                        relationship data push and replaces the old
                                        smSyncConfFile.xml configuration file.

                                        For more information about this file, see the
                                        following topics:

                                        How to map a relationship type query to the
                                        Service Manager Web Service object

                                        Query not configured in smPushConf.xml

Step 3. Enable Push, Population, and Federation for CI
types.

Once you have completed the tasks described above, you must edit your integration point to
add Push and Population jobs for the CI types, as well as enable Federation for supported CI
types. For details, see the following topics:

How to create an integration point in UCMDB

How to define data push jobs in UCMDB

How to define population jobs in UCMDB

How to add an attribute of a supported CI type for federation


1.6.2.1.8. Task 8. Upgrade field mapping

The out-of-box mapping files in the Service Manager 9.41 adapters are already updated to
align with the logical name solution. You need to make similar updates to your own field
mapping.

            Note

           In Service Manager 9.41 or later, the original CI Name field (the id field in the
           device table) is removed from the Configuration Item detail form.

Upgrading the field mappings includes the following steps.

Step 1. Upgrade your data push field mapping

To update your CI push mapping files, follow these steps:

   1. Switch the mapping field from CIIdentifier to DisplayName.
     For example, from
      <target_mapping name="CIIdentifier" datatype="STRING"
     value="Root['display_label']"/>
     to:
      <target_mapping name="DisplayName" datatype="STRING"
     value="Root['display_label']"/>

   2. (Optional) Simplify the business logic for DisplayName.
     If you have customized the original CIIdentifier field values to append more fields so that
     they are unique and not renamed by Service Manager, you can remove such business
     logic. This is because the DisplayName field in Service Manager now supports duplicate
     values.

Step 2. Upgrade your population field mapping

You need to make the following changes to your population field mapping files:

   1. Change CIIdentifier to DisplayName .
   2. Change CIName to CIIdentifier .
   3. Make sure that the global.id field is included in the mapping files. For example:

      <target_mapping datatype="STRING" name="global_id"
     value="bizservice['UCMDBId']"/>

For the Relationship and Running Software population mapping files, perform the following
additional steps:


   1. Remove all upstream and downstream name mapping entries from all relationship
     population mapping files. The following are two example name mapping entries:

          <target_mapping name="name" datatype="STRING"
          value="cirelationship1to1['upstreamci.logical.name']"/>
          <target_mapping name="name" datatype="STRING"
          value="cirelationship1to1['downstreamci.logical.name']"/>

   2. Remove the name mapping entry (the entry in bold) from the container node in the
     running software population mapping file.

          <for-each-source-entity count-index="i" source-
          entities="runningsoftware.computer">

               <target_entity name="Node">
               <target_mapping name="name" datatype="STRING"
          value="runningsoftware.computer[i]['CIIdentifier']"/>
               <target_mapping name="global_id" datatype="STRING"
          value="runningsoftware.computer[i]['UCMDBId']"/>
               </target_entity>
          </for-each-source-entity>

Step 3. Upgrade your federation configuration files

Make the following updates to your federation configuration files:
     Update the smFedConf.xml file to change one groovy method to convertArrayOrString,
     as shown below:

          <property ucmdbName="reference_number" smName="IncidentID"
          valueConverter="convertArrayOrString"/>

     Add the following two functions to the SMFederationConverter.groovy file.


          /**
          * Convert arraylist to a string
          *
          * @param to be converted
          * @return converted string value
          */
          public static String convertArrayString(def arrStr,
          DataAdapterLogger log){
          def strList=''
          for (s in arrStr) {
          strList+='"'+s+'"'+',';
          }
          if (strList.size()&gt;0)
          strList=strList.substring(0, strList.length()-1);
          return '{' + strList +'}';
          }

          public static String convertArrayOrString(def str,
          DataAdapterLogger log){
          if (str instanceof String)
          return convertString(str, log);
          else
          return convertArrayString(str, log);
          }

Step 4. Configure the UCMDB JMX console

Configure the UCMDB JMX console, as described in the following steps.

            Note

           This feature enables the UCMDB global ID solution for Service Manager. It is
           available only in UCMDB 10.21 or later. For this reason, a known issue
           (QCCR1E122493) exists in UCMDB versions earlier than 10.21: If two CIs with the
           same display name are pushed to SM and then updated in SM with a new display
           name, when you run a population job to synchronize the CIs back to UCMDB, the
           two CIs are merged in UCMDB and therefore have the same ucmdb.id value in SM.

   1. Go to the JMX Console: http://<UCMDB server name>:<port>/jmx-console/.
   2. Enter UCMDB:service=Settings Services in the search box, and press Enter.
   3. Click setSettingValue to go to this section.
   4. In the customerID field, enter your customer ID.
   5. In the name field, enter reconciliation.match.attributes.
   6. In the value field, enter global_id.


7. Click Invoke.
  If the configuration is successfully completed, the following message is displayed:
   Setting [reconciliation.match.attributes] value changed successfully to [global_id]


1.6.2.1.9. Task 9. Reconfigure an integration
point

You need to set up an integration point to use the ServiceManagerEnhancedAdapter9.41
adapter, and activate the integration point. For details, see How to create an integration point in
UCMDB.
Once this adapter is successfully enabled, you should be able to open one of the out-of-box
mapping files in the Visual Mapping tool interface without any problems. For details on how to
use the Visual Mapping tool, refer to the Universal CMDB Data Flow Management Guide.


1.6.2.1.10. Task 10. Run a Full Push to
resynchronize CI names

Due to the logical name solution that was introduced in Service Manager 9.41, once you have
upgraded to Service Manager 9.41 or later, you must run a full data push to resynchronize
CI names to the CI display name field in Service Manager. When performing this step, you need
to use the new integration point that you reconfigured.
To resynchronize CIs, follow these steps:

   1. Run a Full Push in UCMDB.
   2. Check the CI data in Service Manager.

        1. Perform a search to find the CIs.
        2. Verify that the Display Name field values of the CIs have been updated correctly.

                         Note

                      The display names of Retired CIs aren't updated, because they are
                      already removed from UCMDB.


1.6.2.1.11. Task 11. Restore the DEM rules in
Service Manager

After running a full data push to resynchronize CI names to SM, you must restore the
Discovered Event Manager (DEM) rules to their original state. Hence, these DEM rules can
function as usual.

To restore the DEM rules, follow these steps:

   1. Sign in to Service Manager as a System Administrator.
   2. Navigate to Tailoring > Web Services > Discovered Event Manager Rules.
   3. Click Search.
   4. In each DEM rule, for Action if record exists but unexpected data discovered, restore

     the setting to the original value (for example, Open a Change or Open an Incident).
````
