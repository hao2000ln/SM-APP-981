---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.2.5.2.10 .. 1.6.3.1
printed_pages: 1149-1166
---

# 1.6.2.5.2.10 How to add an attribute of a supported CI type for federation

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.2.5.2.10. How to add an attribute of a
supported CI type for federation

Out-of-the-box, the integration supports federation for three external CI types in UCMDB:
Incident, Problem, and RequestForChange. For each of the supported CI types, there is a list
of attributes in UCMDB that you can map to Service Manager web service objects for
federation. The following figure shows the out-of-the-box UCMDB CI attributes available for
the Incident CI type.

For example, to add an SM Incident attribute for federation, you need to expose the field in the
SM UcmdbIncident web service object and then map it to an appropriate UCMDB attribute. If
one doesn't already exist, you need to create it in UCMDB first.

The following figure shows the fields that are exposed in the UcmdbIncident web service
object in Service Manager.


You can expose more fields to federate more Incident attributes to UCMDB. As an example, the
following describes how to add the action field in the Service Manager probsummary
(Incident) file for federation, by mapping it to a new UCMDB attribute named details .

            Note

           On the Incident form in Service Manager, the action field has a Description label.
           SM uses this field to describe the Incident record in more detail. See the following
           figure as an example.

To add an attribute of a supported CI type for federation:

   1. Add the SM attribute to its web service object.

     The following example describes how to expose the SM action field of Incident in
     UCMDBIncident Web Service object.


1. Sign in to Service Manager as a system administrator.
2. Navigate to Tailoring > Web Services > Web Service Configuration.
3. Enter the following field values, and then click Search.

        Service Name: ucmdbIntegration
        Name: probsummary
  Service Manager displays the UCMDBIncident web service object.
4. On the Fields tab, add the following row:
        Field: action
        Caption: Description

     5. Save the web service object.
2. Map the SM attribute to a UCMDB attribute.

  The following example describes how to map the SM action attribute to a new UCMDB
  attribute named details.

     1. Sign in to UCMDB as an administrator.
     2. Navigate to Modeling > CI Type Manager.
     3. Navigate to ItProcessRecord > Incident, and open its properties pane.
     4. Click the Add icon to add a new attribute named details to the Incident CI type.


name: details
Display Name: Details
Description: Incident details
Attribute Type: select Primitive > String
Value Size: 500

5. Save the Incident CI type record.

6. Navigate to Data Flow Management > Adapter Management >
  ServiceManagerEnhancedAdapter9.41 > Configuration Files.

7. Edit the relevant federation mapping file
  ( ServiceManagerEnhancedAdapter9.41/mappings/federation/SM Incident 2.0.xml )
  to add a mapping entry for the new attribute.


<target_entities>

<source_instance query-name="SM Incident 2.0" root-element-

name="ucmdbIncident">

<target_entity name="incident">

<target_mapping name="reference_number"      datatype="STRING"

value="ucmdbIncident['IncidentID']"/>

<target_mapping name="name"                  datatype="STRING"

value="ucmdbIncident['BriefDescription']"/>

<target_mapping name="priority"              datatype="STRING"

value="SMFederationFunctions.getEnumValue(ucmdbIncident['Priori

tyCode'],'Priority')"/>

<target_mapping name="incident_status"

datatype="STRING"

value="SMFederationFunctions.firstLetterToLowerAndReplaceSpaceW

ithUnderscore(ucmdbIncident['IMTicketStatus'])"/>

<target_mapping name="category"              datatype="STRING"

value="SMFederationFunctions.replaceSpaceWithUnderscore(ucmdbIn

cident['Category'])"/>

<target_mapping name="closed_time"           datatype="DATE"

value="SMFederationFunctions.convertDate(ucmdbIncident['ClosedT

ime'])"/>

<target_mapping name="create_time"           datatype="DATE"

value="SMFederationFunctions.convertDate(ucmdbIncident['OpenTim

e'])"/>

<target_mapping name="last_modified_time"    datatype="DATE"

value="SMFederationFunctions.convertDate(ucmdbIncident['Updated

Time'])"/>

<target_mapping name="impact_scope"          datatype="STRING"

value="SMFederationFunctions.getEnumValue(ucmdbIncident['Impact

Scope'],'ImpactScope')"/>

<target_mapping name="urgency"

datatype="STRING"

value="SMFederationFunctions.getEnumValue(ucmdbIncident['Urgenc

y'],'Urgency')"/>

<target_mapping name="details" datatype="STRING"

value="ucmdbIncident['Description']"/>

</target_entity>

</source_instance>

</target_entities>

   8. Click Save to save the file.

Now you have added the Description (field name: action) attribute of SM Incident to the
integration for federation. You can run an Incident federation query in the UCMDB


Modeling Studio to see if the SM Description data is normally federated. For information
about how to run a federation query, see Examples of Using Federation.
The following figure shows an example where SM has federated the Description of an
Incident record to UCMDB as Details.


1.6.2.5.2.11. How to enable the automatic
deletion of CI relationships from UCMDB

This task explains how to configure an SM-UCMDB integration so that CI relationships that are
deleted from Service Manager are automatically removed from UCMDB after you next run a
population job. This functionality requires configuration of the Service Manager Enhanced
Adapter in UCMDB, and also of Service Manager if you are using Service Manager 9.60 or an
earlier version.

Configure the Service Manager enhanced adapter

            Note

           Before you begin, we recommend that you back up your existing adapter. To do
           this, open the Admin UI, go to Administrator > Package Manager, right-click
           ServiceManagerEnhancedAdapter9-41, and then select Export Package.

   1. Stop the SM-UCMDB integration.

   2. Turn on the switch that enables CI relationship deletion.

        1. In the Admin UI, go to Data Flow Management > Adapter Management, expand
           Service Manager Enhanced Adapter 9-41, expand Configuration Files, and then
           double-click Service Manager Enhanced Adapter 9-41/sm.properties.

        2. Change the value of the pop.only.use.full.pop.switch field to true (Default: false),
           and then click Save.

   3. Modify the smPopConf.xml file.

        1. Go to Data Flow Management > Adapter Management, expand Service Manager
           Enhanced Adapter 9-41, expand Configuration Files, and then double-click Service
           Manager Enhanced Adapter 9-41/smPopConf.xml.

        2. Set the value of the fullQueryCondition field in every <tql></tql> section to "" ,
           with the exception of the following two sections:

                 "SM CLIP Down Time Population 2.0"
                 "SM CI Connection Down Time CI 2.0"


        3. Click Save.
   4. Restart the integration.

Configure Service Manager

            Important

           Perform these steps only if you are using Service Manager 9.60 or an earlier
           version.

   1. In Service Manager, go to Tailoring > Web Services > Web Service Configuration, and
     then search for "ucmdbIntegration" in the Service Name field.

   2. Select ucmdbBusinessService in the Object Name list.
   3. In the External Access Definition pane, select the Fields tab, add a new field called

     "istatus", set the new field's caption to "AssetStatus", and then click Save.
   4. Select ucmdbRunningSoftware in the Object Name list.
   5. In the External Access Definition pane, select the Fields tab, add a new field called

     "istatus", set the new field's caption to "AssetStatus", and then click Save.

Troubleshooting

If CI relationships aren't removed from UCMDB after you have configured UCMDB and Service
Manager, run the UCMDBPopulationHelper script check the consistency of the data in the
cirelationship1to1 table against the data in the CI device table.

The script checks the endpoint CIs of the relationship record from the cirelationship1to1 table,
and will remove the relationships if the endpoint CIs were already retired on a set date.


Important

The UCMDBPopulationHelper script is not included in Service Manager 9.60 or in
earlier versions. If you are running one of these versions, you must add it manually.
to do this, follow these steps:

   1. Open the Service Manager ScriptLibrary. To do this, type "sl" in the command
     box, and then press Enter.

   2. In the Name field, type "UCMDBPopulationHelper".
   3. In the Package field, select Integrations.
   4. Copy the following code into the input field:

          function deleteRelation1to1ByDevice(startDate) {
                        var deviceSql = 'istatus="Retired/Consumed"';
                        if(startDate) {
                        deviceSql += ' and sysmodtime

          >=\''+startDate+'\'';
                        }

                        lib.c.$('device',
          SCFILE_READONLY).setFields('logical.name').select(deviceSq
          l).
          iterate(function(d){

                        var logicalName =
          lib.StringUtil.escapeAllStr(d.logical_name)

                        var sql = '(upstreamci.logical.name="' +
          logicalName + '" or
          downstreamci.logical.name="'+logicalName+'") and
          status="In Used"';

          lib.c.$('cirelationship1to1').select(sql).iterate(function
          (item){

                        item.doDelete();
                        });
                        });
          }
          deleteRelation1to1ByDevice('01/07/10 22:15:37');

                   Note

                Replace the date in the last line of this script with the date for
                which you are having issues.

   5. Select Add.


To run the UCMDBPopulationHelper script, follow these steps:

   1. Open the Service Manager ScriptLibrary. To do this, type "sl" in the command box, and
     then press Enter.

   2. Type "UCMDBPopulationHelper" in the Name field, and then press Enter.
   3. Select Compile, and then select Execute.


1.6.3. Using the ServiceManagerAdapter9.41
adapter

This section describes how to implement an integration between the Service Manager and
UCMDB by using the ServiceManagerAdapter9.41 adapter.
How to upgrade yourintegration
Integration setup
Multi-tenancy (Multi-company) setup
Standards and best practices
Tailoring the integration


1.6.3.1. How to upgrade your integration

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

Perform the following steps to upgrade your integration to use the ServiceManagerAdapter9.41
adapter.

Task 1. Close all unplanned Changes and Incidents
related to CI modifications in Service Manager

Before you upgrade to Service Manager (SM) 9.41 or later, close all unplanned change and
incident records that were created due to CI modifications. After upgrading to version 9.41 or
later, you will run a full data push to resynchronize CI names from UCMDB to the display.name
field in the Service Manager device table.

Task 2. Upgrade Service Manager

If you want to use the ServiceManagerAdapter9.41 adapter for the integration, you must
upgrade Service Manager to version 9.41 or later, which uses display.name instead of
logical.name for field mapping between UCMDB and Service Manager.

            Note

           The upgrade includes the SM server, Windows and web clients, applications, and
           Mobility client. If you upgrade only the server and clients and your applications
           version is still earlier than 9.41, you can only use an old adapter rather than any of
           the Service Manager 9.41 adapters.

Task 3. Copy data to the joinnode table

Starting with version 9.32, Service Manager uses the joinnode table to replace the mainframe,
networkcomponents, storage, and computer tables. If you are upgrading from Service
Manager 9.31 or earlier and want to migrate to the joinnode-based data mappings, you need to
copy data to the joinnode table.


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
           A message that resembles <XXX> records were successfully copied, and <YYY>
           records were ignored within xxx ms , where XXX and YYY represent the numbers of
           records copied and ignored, respectively.
            Configuration validation failed, and no records were copied. Please check your
           Source Fields/Target Fields settings and run Copy Data again.

   6. If the error message is displayed, correct your Source Fields/Target Fields settings, and
     click Copy Data again until all of your records have been successfully processed.

Task 4. Update the DEM rules in Service Manager

Service Manager 9.41 or later uses an updated CI form, so you may want to correct the CI
names in the logical.name field that have been renamed, and update the CI Display Name
(display.name) field values in Service Manager by using the new field mapping.

To do this, you need to run a full data push to resynchronize the CIs to Service Manager.
Before doing so, you must update the DEM rules to prevent unwanted Change or Incident
records from being created due to the CI name changes.

   1. Sign in to Service Manager as a System Administrator.
   2. Navigate to Tailoring > Web Services > Discovered Event Manager Rules.
   3. Click Search.
   4. For each DEM rule record, select Log Results and update record for Action if record

     exists but unexpected data discovered.

Task 5. Upgrade UCMDB

Service Manager 9.41 can work with the following XSLT-based adapters and generic adapters
specifically designed for Service Manager 9.41:

     ServiceManagerAdapter9.41 for UCMDB 10.01, 10.11, 10.20, or 10.21


                   Note

                These are four XSLT-based adapters, one for each of the UCMDB versions.

     ServiceManagerEnhancedAdapter9.41 for UCMDB 10.20 or 10.21

                   Note

                These are two generic adapters based on the UCMDB generic framework,
                one for each of UCMDB 10.20 and 10.21.

For more information, see Integration Requirements.

Task 6. Upgrade field mapping

The out-of-box mapping files in the Service Manager 9.41 adapters are already updated to
align with the logical name solution. You need to make similar updates to your own field
mapping.

            Note

                In Service Manager 9.41 or later, the original CI Name field (id in the device
                table) is removed from the Configuration Item detail form in Service Manager.
                No updates are need for CI Relationship push mapping files or federation
                mapping files.

Perform the following steps to upgrade your own field mapping.
Step 1. Upgrade your data push field mapping
To update your CI push mapping files, follow these steps:

   1. Switch the mapping field from CIIdentifier to DisplayName.
     For example, update <CIIdentifier><xsl:value-of select="."/></CIIdentifier> to:
      <DisplayName><xsl:value-of select="."/></DisplayName>

   2. (Optional) Simplify the business logic for DisplayName.
     If you have customized the original CIIdentifier value to append more fields so that it is
     unique and not renamed by Service Manager, you can remove such business logic. This
     is because the DisplayName field in Service Manager now supports duplicate values.
     The following is an example mapping for the out-of-box Cluster CI Push.


            <CIIdentifier>
          <xsl:choose>
          <xsl:when test="ip_addresss/ip_address/@authoritative_dns_name">
          <xsl:for-each select="ip_addresss">
          <xsl:for-each select="ip_address">
          <xsl:sort select="@authoritative_dns_name"/><xsl:value-of
          select="@authoritative_dns_name"/>_</xsl:for-each>
          </xsl:for-each>
          </xsl:when>
          <xsl:otherwise>
          <xsl:for-each select="ip_addresss">
          <xsl:for-each select="ip_address">
          <xsl:sort select="@name"/><xsl:value-of select="@name"/>_</xsl:for-
          each>
          </xsl:for-each>
          </xsl:otherwise>
          </xsl:choose>
          </xsl:variable>
          <xsl:value-of select="$combinIP"/><xsl:value-of
          select="@display_label"/>
          </xsl:when>
          <xsl:otherwise><xsl:value-of select="@display_label"/>
          </xsl:otherwise>
          </xsl:choose>
          </CIIdentifier>

     You can simplify the example above as shown in the following:

          <DisplayName>
          <xsl:choose>
          <xsl:when test="clusters/cluster/@display_label">
          <xsl:value-of select="clusters/cluster/@display_label"/>
          </xsl:when>
          <xsl:otherwise><xsl:value-of select="@display_label"/>
          </xsl:otherwise>
          </xsl:choose>
          </DisplayName>

Step 2. Upgrade your population field mapping
For population, in the field mapping files you need to make the following changes:

   1. Map the "name" attribute to "DisplayName":


      <attribute name="name" type="String"><xsl:value-of select="DisplayName"/>
     </attribute>

   2. Map the "sm_id" attribute to "CIIdentifier":

      <attribute name="sm_id" type="String"><xsl:value-of select="CIIdentifier"/>
     </attribute>

   3. Add the following line to map the "global.id" attribute to "UCMDBId":

      <attribute name="global_id" type="String"><xsl:value-of select="UCMDBId"/>
     </attribute>

Step 3. Configure the UCMDB JMX console, as described in the following steps.

            Note

           This feature enables the UCMDB global ID solution for Service Manager. It is
           available only in UCMDB 10.21 or later. For this reason, a known issue
           (QCCR1E122493) exists in UCMDB versions earlier than 10.21: If two CIs with the
           same display name are pushed to Service Manager and then updated in Service
           Manager with a new display name, when you run a population job to synchronize
           the CIs back to UCMDB, the two CIs are merged in UCMDB and therefore have the
           same ucmdb.id value in Service Manager.

   1. Go to the JMX Console: http://<UCMDB server name>:<port>/jmx-console/.
   2. Enter UCMDB:service=Settings Services in the search box, and then press Enter.
   3. Click setSettingValue to go to this section.
   4. In the customerID field, enter your customer ID.
   5. In the name field, enter reconciliation.match.attributes.
   6. In the value field, enter global_id.

   7. Click Invoke.

     If the configuration is successfully completed, the following message is displayed:

      Setting [reconciliation.match.attributes] value changed successfully to [global_id]

Task 7. Reconfigure an integration point

You need to set up an integration point to use the ServiceManagerAdapter9.41 adapter, and
activate the integration point. For details, see How to create an integration point in UCMDB.

Task 8. Run a full push to resynchronize CI names

Due to the logical name solution that was introduced in Service Manager 9.41, once you have
upgraded to Service Manager 9.41 or later, you must run a full data push to resynchronize CI
names to the CI display name field in Service Manager. When performing this step, you need to
use the new integration point that you reconfigured.


To resynchronize CIs, follow these steps:

   1. Run a Full Push in UCMDB.
   2. Check the CI data in Service Manager. Perform a search to find the CIs. Verify that the

     Display Name field values of the CIs have been updated correctly.

                   Note

                The display names of Retired CIs aren't updated, because they are already
                removed from UCMDB.

Task 9. Restore the DEM rules in Service Manager

After you have run a full data push to resynchronize CI names to Service Manager, you must
restore the DEM rules to their original state so that they can function as usual.
To restore the DEM rules, follow these steps:

   1. Sign in to Service Manager as a System Administrator.
   2. Navigate to Tailoring > Web Services > Discovered Event Manager Rules.
   3. Click Search.
   4. In each DEM rule, for Action if record exists but unexpected data discovered, restore

     the setting to the original value (for example, Open a Change or Open an Incident).
````
