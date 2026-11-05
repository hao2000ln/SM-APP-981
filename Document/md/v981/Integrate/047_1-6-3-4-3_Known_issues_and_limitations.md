---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.3.4.3 .. 1.6.3.5.1
printed_pages: 1288-1316
---

# 1.6.3.4.3 Known issues and limitations

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.3.4.3. Known issues and limitations

The following table lists the known issues and limitations of this integration.

Global ID                                   Known Issues and Limitations                          Service Manager 9.81
QCCR1E72246
                                        Known Issue/Limitation            Workaround

                                        [Population Adapter]              In UCMDB, manually delete
                                        Cannot populate deleted           all CIs that were populated
                                        CIs in a full population.         from SM by using
                                                                          appropriate filter criteria
                                        While you run a full              and then run a full
                                        population, if there are CIs      population.
                                        that have been deleted
                                        since the last job run in         Warning: You must be very
                                        Service Manager, the              careful when using this
                                        deleted CIs in Service            workaround.
                                        Manager will not be
                                        populated to UCMDB.

                                        However, the data push
                                        feature first pushes deleted
                                        CIs while running a full
                                        push.


Global ID                               Known Issue/Limitation       Workaround
QCCR1E72222
                                        NodeRole is case-sensitive   Use lower-case names for
                                        when mapping Node's          NodeRole (printer).
                                        NodeRole in UCMDB to
                                        Node's Subtype in SM.

                                        Steps to reproduce this
                                        issue:

                                           1. Create a Node in
                                             UCMDB.

                                           2. Set the Node's
                                             NodeRole property to
                                             "Printer".

                                           3. Run a data push in
                                             UCMDB to push Node
                                             CIs.

                                           4. Check the CI's
                                             attributes in SM.

                                        Result: The CI's subtype is
                                        "Node", which should be
                                        "Net Printer".

                                        When the NodeRole is
                                        "printer", the result is
                                        correct.


Global ID                               Known Issue/Limitation          Workaround
QCCR1E72327
                                        When you run a full             Not available at this time.
                                        population for the first time
                                        to synchronize a large
                                        amount of CIs, if some of
                                        the CIs have an invalid
                                        attribute value (for example,
                                        IP address), the population
                                        job will ignore such CIs and
                                        run to completion with a
                                        Failed status and with errors
                                        logged on the Job Errors
                                        tab; In addition, the last job
                                        execution time will not be
                                        logged because the job is
                                        run for the first time but
                                        fails.

                                        As a result, after fixing the
                                        invalid attribute values in
                                        Service Manager, you will
                                        not have a chance to re-
                                        populate the failed CIs
                                        through a change (delta)
                                        population. This is because
                                        when you run a change
                                        population, a full population
                                        will be executed instead
                                        (because the last job
                                        execution time is null).


Global ID                               Known Issue/Limitation        Workaround
QCCR1E72511
                                        If you set the use.global.id  Set the parameter to False
QCCR1E73004                             parameter in the adapter's    to solve this issue.
                                        sm.properties file to True,
                                        the federation feature             When you deploy the
                                        doesn't work.                      adapter on the UCMDB
                                                                           standalone server
                                                                           (which is defined as a
                                                                           global-id generator by
                                                                           default), globalId and
                                                                           ucmdbId are the same
                                                                           thing. For this reason,
                                                                           setting this parameter
                                                                           to false can meet all of
                                                                           your needs satisfied
                                                                           by setting the
                                                                           parameter to true.
                                                                           When you deploy the
                                                                           adapter on a non-
                                                                           standalone UCMDB
                                                                           (for example, APM's
                                                                           RTSM), setting this
                                                                           parameter to true is
                                                                           unsupported. In
                                                                           addition, we don't
                                                                           recommend
                                                                           integrating the non-
                                                                           standalone CMDB (for
                                                                           example, APM's
                                                                           RTSM) with Service
                                                                           Manager.

                                        Double quotes in UCMDB CI     Not available at this time.
                                        names (for example, "laptop
                                        - 003") are removed when
                                        the CIs are synchronized to
                                        SM.


1.6.3.5. Tailoring the integration

You can tailor the Universal CMDB integration to meet your business needs by adding or
removing managed CI types, attributes, and relationship types. This section describes the
integration architecture and tailoring options for data push, population, and federation.
Integration architecture
Integration class model
Integration queries
Service Manager Web Services
Service Manager reconciliation rules
Service Manager Discovery Event Manager rules
Integration tailoring options
How to enable ASM support
How to update the integration adapter configuration file (sm.properties)
How to add DEM reconciliation rules
Add Discovery Event Manager rules
How to add a CI attribute to the integration for data push
How to add a CI type to the integration for data push
How to add a CI type's relationship types to the integration for data push
How to add a CI attribute to the integration for population
How to add a CI type to the integration for population
How to add a CI type's relationship types to the integration for population
How to customize UCMDB ID pushback for a CI type
How to add custom queries to integration population jobs
How to add an attribute of a supported CI type for federation


1.6.3.5.1. Integration architecture

Before you tailor the integration, you should understand how the following components of the
out-of-the-box integration work.

     Integration class model
     Integration queries
     Service Manager Web Services
     Service Manager reconciliation rules
     Service Manager Discovery Event Manager rules


1.6.3.5.1.1. Integration class model

UCMDB 9.x or later no longer uses a private class model of CI types to manage integration CIs,
as was required in prior versions. Instead, the integration uses the standard UCMDB managed
objects and maps them to Service Manager CI types and attributes with queries and
transformation files.


1.6.3.5.1.2. Integration queries

This section describes out-of-the-box queries used for data push, Actual State, and
population.

Queries for push

For the push feature, the integration uses a collection of queries to gather CI attribute
information from Universal CMDB and send it to the Service Manager system.

To access the out-of-the-box data push queries, navigate to Modeling > Modeling Studio,
select Queries for Resource Type, and then navigate to the Root > Integration > SM Sync >
9.xx folder.

If you want to change what CI/Relationship types or attributes are part of the integration, you
must also edit the integration queries to support your updated CI/CI Relationship types and
attributes.


Query name                              Out-of-the-box queries for data push

                                                         Description

SM Running Software Push                This query gathers CI attributes from
                                        Running Software CIs.

SM Business Service Push                This query gathers CI attributes from
                                        business service CIs.

SM Business Service Relations Push      This query gathers relationships between
                                        the following components:

                                             Business service and Running
                                             Software CIs
                                             Business service and node CIs
                                             Two or more business services

                                        The query includes compound relationships
                                        because the relationships can extend
                                        through a group.

SM Computer Push                        This query gathers CI attributes from the
                                        node CI type with NodeRole containing
                                        “desktop”, “server”, “virtualized_system” or
                                        not set.

                                        It also gathers related CI attributes from the
                                        following CI types through containers and
                                        links: IPAddress, Interface, CPU,
                                        FileSystem, DiskDevice, and Location.

SM Switch Push                          This query gathers CI attributes from the
                                        node CI type with NodeRole containing
                                        “atm_switch”, “frame_relay_switch”, or
                                        “lan_switch”.

                                        It also gathers related CI attributes from the
                                        following CI types through containers and
                                        links: IPAddress, Interface, CPU,
                                        FileSystem, DiskDevice, and Location.

 Query name                                                                                      Service Manager 9.81
 SM Storage Push
 SM Net Printer Push                    Description
 SM Mainframe Push
 SM Mobile Device Push                  This query gathers CI attributes from the
                                        node CI type with NodeRole containing
This PDF was generated on May 23, 2026  “san_switch”, “san_gateway”, “san_router”
                                        or exact CI type equal to “storage Array”.
                                        It also gathers related CI attributes from the
                                        following CI types through containers and
                                        links: IPAddress, Interface, CPU,
                                        FileSystem, DiskDevice, and Location.

                                        This query gathers CI attributes from the
                                        node CI type with NodeRole containing
                                        “printer”.
                                        It also gathers related CI attributes from the
                                        following CI types through containers and
                                        links: IPAddress, Interface, CPU,
                                        FileSystem, DiskDevice, and Location.

                                        This query gathers CI attributes from the
                                        node CI type with exact CI type equal to
                                        “Mainframe Logical Partition”, or
                                        “Mainframe CPC”.
                                        It also gathers related CI attributes from the
                                        following CI types through containers and
                                        links: IPAddress, Interface, CPU,
                                        FileSystem, DiskDevice, and Location.

                                        This query gathers CI attributes from the
                                        node CI type with NodeRole containing
                                        “pda_handheld”.
                                        It also gathers related CI attributes from the
                                        following CI types through containers and
                                        links: IPAddress, Interface, CPU,
                                        FileSystem, DiskDevice, and Location.

                                                                                                                     Page 1298 of 1727
Query name                                                                                       Service Manager 9.81
SM Network Component Push
                                        Description
SM Cluster Push
SM Node Relations Push                  This query gathers CI attributes from the
                                        node CI type with NodeRole containing
                                        “router”, “adsl_modem”,
                                        “appletalk_gateway”, “bandwith_manager”,
                                        “cable_model”, “csu_dsu”, “ethernet”, “fddi”,
                                        “firewall”, “hub”, “kvm_switch”,
                                        “load_balancer”,
                                        “multicast_enabled_router”, “nat_router”,
                                        “token_ring”,
                                        “undefined_network_component”,
                                        “voice_gateway”, “voice_switch”, or
                                        “vpn_gateway”.

                                        It also gathers related CI attributes from the
                                        following CI types through containers and
                                        links: IPAddress, Interface, CPU,
                                        FileSystem, DiskDevice, and Location.

                                        This query gathers CI attributes from the
                                        node CI type with the exact CI type equal to
                                        “ClusterResourceGroup”.

                                        It also gathers related CI attributes from the
                                        following CI types through containers and
                                        links: IPAddress, Interface, CPU,
                                        FileSystem, DiskDevice, Location, and
                                        Cluster.

                                        This query gathers relationships between
                                        the following components:

                                             Node and Printer CIs
                                             Node and RunningSoftware CIs

                                        The root class of the relationship is
                                        composition.

Query name                                                                                       Service Manager 9.81
SM CRG Relations Push
                                        Description
SM Layer2 Topology Relations Push
                                        This query gathers relationships between
SM Local Printer Push                   the following components: Node and
                                        Cluster Resource Group CIs.
                                        The query includes compound relationships
                                        because the relationships can extend
                                        through a group.

                                        This query gathers relationships between
                                        the following components: Two or more
                                        nodes.
                                        The query includes compound relationships
                                        because the relationships can extend
                                        through a group.

                                        This query gathers CI attributes from printer
                                        CIs.
                                        It also gathers related CI attributes from the
                                        Node CI type.

Query name                                                                                       Service Manager 9.81
SM ASM Relations Push
                                        Description

                                        This query gathers ASM discovered
                                        consumer-provider relationships that point
                                        from a Business Element CI to a Running
                                        Software CI.

                                                    Note

                                                   This query doesn't support
                                                   consumer-provider
                                                   relationships between a
                                                   Business Element CI and a
                                                   Cluster CI.

                                                    Note

                                                   To work correctly, this query
                                                   requires the ASM Enhanced
                                                   package to be deployed in
                                                   UCMDB. This package is
                                                   already included in
                                                   UCMDB Content Pack (CP) 17.

Queries for Actual State

Out-of-the-box, the following queries (see the table below) are used for retrieving CI
information from UCMDB to the Actual State section of the Service Manager Configuration Item
(CI) form. Service Manager retrieves CI Actual State information by calling a UCMDB web
service that retrieves CI data according to these queries.

The queries are located in the Integration > SM Query folder in the UCMDB Modeling Studio.


Query name                              Out-of-the-box queries for Actual State

                                                         Description

localPrinterExtendedData                This query gathers real-time extended
                                        information from Printer CIs in UCMDB.

applicationExtendedData                 This query gathers real-time extended
                                        information from RunningSoftware CIs in
                                        UCMDB.

businessServiceExtendedData             This query gathers real-time extended
                                        information from business service CIs in
                                        UCMDB.

hostExtendedData                        This query gathers real-time extended
                                        information (such as Asset, Party, Location,
                                        LogicalVolume, WindowsService, Printer,
                                        InstalledSoftware, FileSystem, IPAddress,
                                        Interface, DiskDevice, and Cpu) from the
                                        node CI type in UCMDB.

Queries for population

For CI/CI Relationship population, the integration doesn't need queries to save CI/CI
Relationship attribute information to Universal CMDB; however in the population configuration
file the following query names are mapped to relevant population XSL transformation files (see
the following table).


Query name                              Queries for population

                                                  Description

SM Business Service Population          This query defines the CI store structure of
                                        business service CIs.

SM Computer To Computer With ConnectM This query defines the CI store structure of

Running Software Population             running software CIs.

SM Computer Population                  This query defines the CI store structure of
                                        computer CIs.

SM Biz To Biz With Containment          This query defines the CI store structure of
                                        CI relationships in which a bizservice CI
                                        contains another.

SM Biz To Biz With Usage                This query defines the CI store structure of
                                        CI relationships in which a bizservice CI
                                        uses another.

SM Biz To Computer With Containment     This query defines the CI store structure of
                                        CI relationships in which a bizservice CI
                                        contains a computer CI.

SM Biz To Computer With Usage           This query defines the CI store structure of
                                        CI relationships in which a bizservice CI
                                        uses a computer CI.

SM Biz To Software With Containment     This query defines CI store structure of CI
                                        relationships in which a bizservice CI
                                        contains a RunningSoftware CI.

SM Biz To Software With Usage           This query defines CI store structure of CI
                                        relationships in which a bizservice CI uses a
                                        RunningSoftware CI.

SM Computer To Computer With Connects   This query defines the CI store structure of
                                        CI relationships in which a computer CI
                                        connects to another.

SM Computer To Software With            This query defines the CI store structure of
Composition                             CI relationships in which a RunningSoftware
                                        CI is contained within a computer CI and the
                                        RunningSoftware CI can't exist without the
                                        container.


Query name                              Description

CLIP Down Time Population               This query defines the CI store structure of
                                        ScheduledDowntime CIs.

CI To Down Time CI With Connection      This query defines the CI store structure of
                                        CI relationships in which a
                                        ScheduledDowntime CI connects to an
                                        affected CI.

Query requirements

The integration requires that any custom queries you create meet certain formatting
conditions. Any queries that you want to include in the integration must meet these conditions:

     To query CIs, a query must contain one CI type labeled Root. The Root node is the main
     CI that the UCMDB synchronizes. All other CIs are contained CIs of the Root CI.
     To query relationships, a query must contain one or more relationships labeled Root.
     A query must contain only the Root CI and CIs that are directly connected to it. The Root
     CI is always the top node of the TQL hierarchy.
     A TQL graph can't have cycles.
     If a query synchronizing relationships has cardinality, it must be cardinality 1...*.
     Additional cardinality entries must have an OR condition between them.
     If you only want the integration to synchronize specific CIs, you must configure the
     condition on the query to filter such CIs.


1.6.3.5.1.3. Service Manager Web Services

Service Manager uses web services messages to get and receive CI information from your
UCMDB system. Out-of-the-box, UCMDB sends more CI attribute information than the Service
Manager system actually manages. Service Manager users can view all of the CI attribute
information the UCMDB system sends from the Actual State section of the CI record.

Service Manager publishes several web services for use by the UCMDB-SM integration. The
UCMDB system uses the web services to map UCMDB CI types and CI attributes to web
services objects the Service Manager system recognizes. If you add UCMDB CI types or CI
attributes that you want Service Manager to manage, then you must update one or more of
these web services to define them as web services objects. See Service Manager Web
Services for more information about publishing web services.

Managed fields

            Note

           Managed fields are used only for the data push feature.

A Service Manager managed field is a field where the system compares the CI attribute value
in the incoming UCMDB web services message to the value in a Service Manager CI record. If
the values in the web services message don't match those in the CI record, Service Manager
runs a Discovery Event Manager (DEM) rule to determine what action to take. The DEM rule
determines which of the fields that are published as web services objects are fields managed
by the integration. Only value changes in managed fields trigger the DEM rule.

The ucmdbIntegration web service consists of a set of web services objects, each of which
defines a list of web service fields. Out-of-the-box, the integration uses only part of them (see
the Mappings between Service Manager web service objects, tables, and DEM rules table),
some of them (along with their relevant DEM Rules) are deprecated and removed from Service
Manager (see the Deprecated ucmdbIntegration web service objects for data push table), and
some are used for population or federation (see the ucmdbIntegration web service objects
used for population or federation table).


               Mappings between Service Manager web service objects, tables, and DEM rules

This web service object                 Publishes fields from this       And uses this DEM rule ID
                                        table

Relationship                            cirelationship                   ucmdbRelationship

ucmdbRunningSoftware                    device                           ucmdbRunningSoftware

ucmdbBusinessService                    joinbizservice                   ucmdbBusinessService

ucmdbNode                               joinnode                         ucmdbNode

                  Deprecated ucmdbIntegration web service objects for data push

This web service object                 Publishes fields from this       Replaced with (object)
                                        table

ucmdbApplication                        device                           ucmdbRunningSoftware

ucmdbComputer                           ucmdbComputer                    ucmdbNode

ucmdbNetwork                            joinnetworkcomponents            ucmdbNode

ucmdbPrinter                            joinofficeelectronics            ucmdbNode

                  ucmdbIntegration web service objects used for population or federation

This web service      Publishes fields                  And is used for          Requires a DEM
object                from this table                                            Rule?

cirelationship1to1 cirelationship1to1 Population                                 No

ucmdbIDPushBack device                                  Population               No

UcmdbChange           cm3r                              Federation               No

UcmdbChangeTask cm3t                                    Federation               No

UcmdbIncident         probsummary                       Federation               No

UcmdbProblem          rootcause                         Federation               No

The following sections list the fields published as web services objects used for data push (see
the Mappings between Service Manager web service objects, tables, and DEM rules table) and
indicate whether they are managed fields in an out-of-the-box Service Manager system. You
can use this reference to determine if you need to publish a field as a web service object, and
also if you need to create a DEM rule for the object.


Object Name: Relationship

Service Manager publishes the following fields from the cirelationship table:

                        Web service and managed fields of the Relationship object

Field published as web                  Caption used in web  Is the field a managed
service object                          service messages     field?

relationship.name                       RelationshipName

logical.name                            ParentCI

related.cis                             ChildCIs             Yes

relationship.subtype                    RelationshipType

Object Name: ucmdbRunningSoftware

Service Manager publishes the following fields from the device table:

                   Web service and managed fields of the ucmdbRunningSoftware object

Field published as web                  Caption used in web  Is the field a managed
service object                          service messages     field?

ucmdb.id                                UCMDBId

ci.name                                 ApplicationName

type                                    Type

subtype                                 Subtype

company                                 CompanyId

logical.name                            CIIdentifier         Yes

product.version                         ProductVersion

vendor                                  Vendor

version                                 Version

ci.name                                 ServiceName          Yes

sm.device.display.name                  DisplayName

Object Name: ucmdbBusinessService


Service Manager publishes the following fields from the joinbizservice table:

              Web service and managed fields of the ucmdbBusinessService object

Field published as web                  Caption used in web  Is the field a managed
service object                          service messages     field?

ucmdb.id                                UCMDBId

ci.name                                 ServiceName          Yes

type                                    Type

subtype                                 Subtype

company                                 CustomerId

logical.name                            CIIdentifier

vendor                                  ServiceProvider      Yes

sm.device.display.name                  DisplayName          Yes

Object Name: ucmdbNode
Service Manager publishes the following fields from the joinnode table:


                        Web service and managed fields of the ucmdbNode object

Field published as web                  Caption used in web  Is the field a managed
service object                          service messages     field?

ucmdb.id                                UCMDBId

type                                    Type

subtype                                 Subtype

company                                 CustomerId

logical.name                            CIIdentifier

default.gateway                         DefaultGateway       Yes

network.name                            DNSName              Yes

building                                Building             Yes

room                                    Room                 Yes

floor                                   Floor                Yes

location                                Location

addlIPAddr[addlIPAddress] AddlIPAddress                      Yes

addlIPAddr[addlSubnet]                  AddlSubnet           Yes

addlMacAddress                          AddlMacAddress       Yes

bios.id                                 BIOSId               Yes

operating.system                        OS                   Yes

os.version                              OSVersion            Yes

physical.mem.total                      PhysicalMemory       Yes

serial.no.                              SerialNo

vendor                                  Vendor

cpu[cpu.id]                             CpuID

cpu[cpu.name]                           CpuName

Field published as web                  Caption used in web                          Service Manager 9.81
service object                          service messages
                                                             Is the field a managed
cpu[cpu.clock.speed]                    CpuClockSpeed        field?

file.system[mount.point]                MountPoint           Yes

file.system[disk.type]                  DiskType             Yes

file.system[file.system.type] FilesystemType

file.system[disk.size]                  DiskSize

asset.tag                               AssetTag

machine.name                            HostName

disk.device[model.name] ModelName

disk.device[disk.vendor]                DiskVendor

disk.device[disk.name]                  DiskName

sm.device.display.name                  DisplayName

isVisualization                         IsVisualization

istatus                                 AssetStatus


1.6.3.5.1.4. Service Manager reconciliation
rules

Service Manager reconciliation rules allow the integration to identify CI records in your Service
Manager system that match CIs in your UCMDB system. Service Manager attempts to
reconcile CI records with every push of CI attributes from your UCMDB system. The integration
uses the following workflow to match UCMDB CIs with Service Manager CIs.

   1. The UCMDB system sends a web service message containing the latest CI attribute data
     to Service Manager.

   2. Service Manager scans the web service message for the CI ucmdb.id value.

                   Note

                The ucmdb.id field is displayed in the Actual State Section of the CI form, with
                a label of Ucmdb ID.

   3. Service Manager searches for an existing CI record that has the same ucmdb.id value.
   4. If Service Manager finds a CI that has the ucmdb.id value, no reconciliation is needed.

     Service Manager compares the UCMDB CI attributes to the Service Manager managed
     fields and runs the appropriate Discovery Event Manager (DEM) rules as needed to
     update the CI record in Service Manager.
   5. If Service Manager can't find a CI that has the ucmdb.id value, it searches for a DEM
     reconciliation rule record that's defined for the CI type.
   6. If no DEM reconciliation rule record is found, Service Manager creates the CI record
     according to the appropriate DEM rules.

   7. If a DEM reconciliation rule record is found, Service Manager evaluates the rules and
     appends (ucmdb.id=NULL or ucmdb.id~=NULL and istatus=”XXXXXX”) to the
     reconciliation rules in the backend, where the istatus value is retrieved from the DEM rule
     for deletion (for example, Retired/Consumed). If no istatus value is found in the DEM rule,
     Service Manager only appends ucmdb.id=NULL to the reconciliation rules in the backend.

   8. If no matching CI record is found by the reconciliation rules, Service Manager creates the
     CI record according to the appropriate DEM rules.

   9. If a matching CI record is found by the reconciliation rules, Service Manager updates the
     CI record according to the appropriate DEM rules.

Performance implications

Because Service Manager attempts to reconcile CIs with every push, the number of
reconciliation fields you have will affect the integration’s performance. The more reconciliation
rules you have, the more searches Service Manager must perform to match CIs. To improve
the performance of reconciliation searches, you should choose reconciliation fields that are
unique keys of the underlying Service Manager table. For example, if you want to reconcile CI


records in the device table, use the logical.name field as a reconciliation field because it is a
unique key. See How to add DEM reconciliation rules to create a reconciliation rule.

Dependence on DEM rules

Service Manager uses the “Action if matching record doesn't exist” DEM rule whenever it can't
reconcile CIs. You should review the DEM settings and decide if they meet your business
standards prior to the initial push of CIs from UCMDB to Service Manager. For example, you
can have Service Manager create a change request for every CI in the initial CI push by
selecting the “Open a change” option.


1.6.3.5.1.5. Service Manager Discovery Event
Manager rules

You only need to create Discovery Event Manager (DEM) rules if you want to accomplish any
of the following custom actions:

Change the conditions under which a DEM rule runs

Service Manager will run a DEM rule only if the condition field evaluates to true. Out-of-the-
box, no DEM rule has a condition statement that restricts when the rule runs, and all the
integration DEM rules will always run by default.

You can update a DEM rule's condition statements if you want to restrict when Service
Manager runs your DEM rules. For example, adding the following condition to the ucmdbNode
DEM rule restricts the rule to desktop CIs.

subtype in $L.file="Desktop"

You can also use the condition field to create multiple DEM rules that apply to the same table
name. For example, the following DEM rules both apply to the joinnode table.

              DEM rules using different conditions to affect the same table

DEM rule Id                             Table Name  Condition

ucmdbNode                               joinnode    subtype in
                                                    $L.file~="Desktop"

ucmdbDesktop                            joinnode    subtype in
                                                    $L.file="Desktop"

Typically, you will only need to add conditions if your business processes require the
integration to take different actions with certain CI types or SLAs.

Change the action the DEM rule takes

Out-of-the-box, the integration DEM rules take the following actions:

     Add a CI record when the UCMDB data doesn't match an existing Service Manager CI
     record
     Open a Change or log results and update a CI record when the UCMDB CI attribute data
     doesn't match the CI attribute data in the Service Manager CI record
     Delete a CI record when the UCMDB data specifies that the CI has been deleted

You can change the integration DEM rules to meet your business processes. For example, you
could use the ucmdbNode DEM rule to open a change when the integration finds a non-
desktop CI with unexpected data, and use the ucmdbDesktop DEM rule to log results and
update the record when the integration finds a desktop CI with unexpected data.


Caution

If you want to use the Change Management verification and Change Management
validation features of the integration, your DEM rules must use the Open a Change
option for the “Action if record exists but unexpected data discovered” event.

Update the list of managed fields for a CI type

If you add CI attributes to your UCMDB system that you want to include in the integration, you
must also create matching managed fields in Service Manager. Each managed field must have
a corresponding web services object definition in order to receive CI attribute updates from
your UCMDB system. See How to add a CI attribute to the integration for data push and How to
add a CI type to the integration for data push for information on how to add managed fields.

Create custom JavaScript to open Change or Incident
records

Service Manager uses the discoveryEvent JavaScript to create CI names and to set the values
of required fields when opening change or incident records. Out-of-the-box, the script uses
the following default values.

Default values to create a new CI

You can update the createCIName and populateNewCI functions to set the following CI values.

CI attribute                            Default values used to create a new CI

                                                         Default value defined in discoveryEvent

record.logical_name                     System generated ID number

record.assignment                       AUTO

record.istatus                          Installed

record.os_name                          Value in record.operating_system

Default values to create a new change

You can update the populateChange function to set the following change values.


CI attribute                            Default values used to create a new change

                                                           Default value defined in discoveryEvent

change.category                         Unplanned Change

change.reason                           Value in reason

change.initial_impact                   3

change.severity                         3

change.coordinator                      Change.Coordinator

change.requested_by                     discovery

change.status                           initial

Default values to create a new incident

You can update the populateIncident function to set the following incident values.

CI attribute                            Default values used to create a new incident

                                                           Default value defined in discoveryEvent

incident.category                       incident

incident.subcategory                    hardware

incident.product_type                   missing or stolen

incident.assignment                     Hardware

incident.initial_impact                 3

incident.severity                       3

incident.logical_name                   Value of id

incident.site_cateogry                  C

incident.contact_name                   ANALYST, INCIDENT

incident.affected_item                  MyDevices
````
