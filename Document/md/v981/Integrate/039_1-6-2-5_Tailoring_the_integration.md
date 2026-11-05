---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.2.5 .. 1.6.2.5.1
printed_pages: 1071-1094
---

# 1.6.2.5 Tailoring the integration

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.2.5. Tailoring the integration

You can tailor the UCMDB-SM integration to meet your business needs by adding or removing
managed CI types, attributes, and relationship types. This section describes the integration
architecture and tailoring options for data push, population, and federation.
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
How to add Discovery Event Manager rules
How to add a CI relationship type to the integration for data push
How to add a CI attribute to the integration for data push
How to add a CI type to the integration for data push
How to add a CI type, attribute, or relationship type to the integration for population
How to enable or disable UCMDB ID pushback for a CI type
How to add an attribute of a supported CI type for federation
How to enable the automatic deletion of CI relationships from UCMDB


1.6.2.5.1. Integration architecture

Before you tailor the integration, you should understand how the following components of the
out-of-the-box integration work.

     Integration class model
     Integration queries
     Service Manager Web Services
     Service Manager reconciliation rules
     Service Manager Discovery Event Manager rules


1.6.2.5.1.1. Integration class model

UCMDB 9.x or later no longer uses a private class model of CI types to manage integration CIs,
as was required in prior versions. Instead, the integration uses the standard UCMDB managed
objects and maps them to Service Manager CI types and attributes with queries and
transformation files.


1.6.2.5.1.2. Integration queries

This section describes out-of-the-box queries used for data push, Actual State, federation, and
population.

Queries for push

For the push feature, the integration uses a collection of queries to gather CI attribute
information from Universal CMDB and send it to the Service Manager system.

To access the out-of-the-box data push queries, navigate to Modeling > Modeling Studio,
select Queries for Resource Type, and then navigate to the Root > Integration > Service
Manager > Push folder.

If you want to change what CI types, Relationship types or attributes are part of the integration,
you must also edit the integration queries to support your updated CI types, CI Relationship
types and attributes.

            Note

           The Service Manager Enhanced Generic Adapter has been introduced since
           UCMDB version 10.20. This adapter can coexist with an old XSLT adapter. In order
           to distinguish its queries from those of an XSLT adapter, all queries of the
           enhanced adapter are suffixed with 2.0.

Query name                                                                                       Service Manager 9.81
SM Local Printer Push 2.0
SM Net Printer Push 2.0                 Description

SM Mainframe Push 2.0                   This query gathers CI attributes from printer
                                        CIs. It also gathers related CI attributes from
SM Mobile Device Push 2.0               the Node CI type.

                                        This query gathers CI attributes from Node
                                        CI types whose NodeRole contains
                                        “printer.”

                                        It also gathers related CI attributes from the
                                        following CI types through containers and
                                        links: IPAddress, Interface, CPU,
                                        FileSystem, DiskDevice, and Location.

                                        This query gathers CI attributes from the
                                        following Node CI types: Mainframe Logical
                                        Partition, and Mainframe CPC.

                                        It also gathers related CI attributes from the
                                        following CI types through containers and
                                        links: IPAddress, Interface, CPU,
                                        FileSystem, DiskDevice, and Location.

                                        This query gathers CI attributes from Node
                                        CI types whose NodeRole contains
                                        “pda_handheld.”
                                        It also gathers related CI attributes from the
                                        following CI types through containers and
                                        links: IPAddress, Interface, CPU,
                                        FileSystem, DiskDevice, and Location.

Query name                                                                                       Service Manager 9.81
SM Network Component Push 2.0
                                        Description
SM Cluster Push 2.0
SM Computer Push 2.0                    This query gathers CI attributes from Node
                                        CI types whose NodeRole contains router,
                                        adsl_modem, appletalk_gateway,
                                        bandwith_manager, cable_model, csu_dsu,
                                        ethernet, fddi, firewall, hub, kvm_switch,
                                        load_balancer, multicast_enabled_router,
                                        nat_router, token_ring, undefined_network_
                                        component, voice_gateway, voice_switch,
                                        or vpn_gateway.

                                        It also gathers related CI attributes from the
                                        following CI types through containers and
                                        links: IPAddress, Interface, CPU,
                                        FileSystem, DiskDevice, and Location.

                                        This query gathers CI attributes from the
                                        following Node CI type:
                                        ClusterResourceGroup.

                                        It also gathers related CI attributes from the
                                        following CI types through containers and
                                        links: IPAddress, Interface, CPU,
                                        FileSystem, DiskDevice, Location, and
                                        Cluster.

                                        This query gathers CI attributes from the
                                        node CI type with NodeRole containing
                                        “desktop”, “server”, “virtualized_system” or
                                        not set. It also gathers related CI attributes
                                        from the following CI types through
                                        containers and links: IPAddress, Interface,
                                        CPU, FileSystem, DiskDevice, and Location.

Query name                                                                                       Service Manager 9.81
SM Storage Push 2.0
                                        Description
SM Running Software Push 2.0
SM Switch Push 2.0                      This query gathers CI attributes from the
                                        Node CI type whose NodeRole contains
SM Service Element Push 2.0             san_switch, san_gateway, san_router, or
SM Business Service Push 2.0            whose Display Name is Storage Array.
SM Layer2 Topology Relations Push 2.0
                                        It also gathers related CI attributes from the
                                        following CI types through containers and
                                        links: IPAddress, Interface, CPU,
                                        FileSystem, DiskDevice, and Location.

                                        This query gathers CI attributes from
                                        Running Software CIs.

                                        This query gathers CI attributes from the
                                        Node CI type whose NodeRole contains
                                        atm_switch, frame_relay_switch, or
                                        lan_switch.

                                        It also gathers related CI attributes from the
                                        following CI types through containers and
                                        links: IPAddress, Interface, CPU,
                                        FileSystem, DiskDevice, and Location.

                                        This query gathers CI attributes from the
                                        Business Element CI type.

                                        This query gathers CI attributes from the
                                        Business Service CI type.

                                        This query gathers relationships between
                                        the following components: Two or more
                                        nodes. The query includes compound
                                        relationships because the relationships can
                                        extend through a group.

Query name                                                                                       Service Manager 9.81
SM Business Service Relations Push 2.0
                                        Description
SM CRG Relations Push 2.0
SM Node Relations Push 2.0              This query gathers relationships between
                                        the following components:

                                             Business Service and Running
                                             Software CIs
                                             Business Service and Node CIs
                                             Two or more Business Services

                                        The query includes compound relationships
                                        because the relationships can extend
                                        through a group.

                                        This query gathers relationships between
                                        the following components: Node and
                                        Cluster Resource Group CIs.
                                        The query includes compound relationships
                                        because the relationships can extend
                                        through a group.

                                        This query gathers relationships between
                                        the following components:

                                             Node and Printer CIs
                                             Node and RunningSoftware CIs

                                        The root class of the relationship is
                                        composition.

Query name                                                                                       Service Manager 9.81
SM ASM Relations Push 2.0
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

Queries for Actual state

Out-of-the-box, the queries in the following table are used for retrieving CI information from
UCMDB to the Actual State section of the Service Manager Configuration Item (CI) form.
Service Manager retrieves CI Actual State information by calling a UCMDB web service that
retrieves CI data according to these queries.

The queries are located in the Integration > SM Query folder in the UCMDB Modeling Studio.


Query name                              Description

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

Queries for federation

Each generic adapter stores the out-of-box federation queries in the Integration > Service
Manager > Federation folder in the Modeling Studio.

For UCMDB 10.20, the generic adapter has defined a large number of out-of-box federation
queries. These queries are for the out-of-the-box CI Types in UCMDB. Due to a technical
limitation in UCMDB 10.20, you still need to define static federation queries for each of your
custom CI types. For information on how to define static federation queries, see the Achieving
Data Federation Using the Generic Adapter section in the Universal CMDB Developer
Reference Guide.

Starting with UCMDB 10.21, you don't need to create additional static queries. The following
out-of-box static federation queries are used for all CI types:

     SM Incident 2.0
     SM Incident To CI 2.0
     SM Problem 2.0
     SM Problem To CI 2.0
     SM RFC 2.0
     SM RFC To CI 2.0

Queries for population

For CI/CI Relationship population, the integration uses the following queries to save CI/CI
Relationship attribute information to UCMDB.

Query Name                                                                                         Service Manager 9.81
SM Business Service Population 2.0
SM Business Application Population 2.0    Description
SM Infrastructure Service Population 2.0
SM Running Software Population 2.0        Defines the CI store structure of business
SM Computer Population 2.0                service CIs.
SM CLIP Down Time Population 2.0
SM Biz Containment Biz 2.0                Defines the CI store structure of Application
                                          Service CIs.
SM Biz Usage Biz 2.0
                                          Defines the CI store structure of
SM Biz Containment Computer 2.0           Infrastructure Service CIs.

SM Biz Containment Software 2.0           Defines the CI store structure of running
                                          software CIs.
SM Biz Usage Computer 2.0
                                          Defines the CI store structure of computer
SM Biz Usage Software 2.0                 CIs.

                                          Defines the CI store structure of
                                          ScheduledDowntime CIs.

                                          This query defines the CI store structure of
                                          CI relationships in which a bizservice CI
                                          contains another.

                                          Defines the CI store structure of CI
                                          relationships in which a bizservice CI uses
                                          another.

                                          This query defines the CI store structure of
                                          CI relationships in which a bizservice CI
                                          contains a computer CI.

                                          Defines the CI store structure of CI
                                          relationships in which a bizservice CI
                                          contains a RunningSoftware CI.

                                          Defines the CI store structure of CI
                                          relationships in which a bizservice CI uses a
                                          computer CI.

                                          Defines the CI store structure of CI
                                          relationships in which a bizservice CI uses a
                                          RunningSoftware CI.


Query Name                              Description

SM Computer Connects Computer 2.0       Defines the CI store structure of CI
                                        relationships in which a computer CI
                                        connects to another.

SM Computer Composition Software 2.0    Defines the CI store structure of CI
                                        relationships in which a RunningSoftware CI
                                        is contained within a computer CI and the
                                        RunningSoftware CI can't exist without the
                                        container.

SM CI Connection Down Time CI 2.0       Defines the CI store structure of CI
                                        relationships in which a
                                        ScheduledDowntime CI connects to an
                                        affected CI.

Query requirements

The integration requires that any custom queries you create meet certain formatting
conditions. Any queries that you want to include in the integration must meet these conditions:

     To query CIs, a query must contain one CI type labeled Root. The Root node is the main
     CI that UCMDB synchronizes. All other CIs are contained CIs of the Root CI.
     To query relationships, a query must contain one or more relationships labeled Root.
     A query must contain only the Root CI and CIs that are directly connected to it. The Root
     CI is always the top node of the query hierarchy.
     A query layout can't have cycles.
     If a query synchronizing relationships has cardinality, it must be the cardinality 1...* .
     Additional cardinality entries must have a OR condition between them.
     If you want the integration to only synchronize specific CIs, you must configure the
     condition on the query to filter such CIs.


1.6.2.5.1.3. Service Manager Web Services

Service Manager uses Web Services messages to get and receive CI information from your
UCMDB system. Out-of-the-box, UCMDB sends more CI attribute information than the Service
Manager system actually manages. Service Manager users can view all of the CI attribute
information the UCMDB system sends from the Actual State section of the CI record.

Service Manager publishes several web services for use by the UCMDB-SM integration. The
UCMDB system uses the web services to map UCMDB CI types and CI attributes to Web
Services objects that the Service Manager system recognizes. You can add UCMDB CI types
or CI attributes that you want Service Manager to manage by using the Visual Mapping tool,
and the tool will automatically update one or more of these Web Services to define web service
objects.

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
some of them (along with their relevant DEM Rules) are deprecated and removed (see the
Deprecated ucmdbIntegration web service objects for data push table), and some are used
for population or federation (see the ucmdbIntegration web service objects used for
population or federation table).


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
indicate whether or not they are managed fields in an out-of-the-box Service Manager system.
You can use this reference to determine if you need to publish a field as a web service object,
and also if you need to create a DEM rule for the object.


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

logical.name                            CIIdentifier

product.version                         ProductVersion

vendor                                  Vendor

version                                 Version

ci.name                                 ServiceName          Yes

sm.device.display.name                  DisplayName          Yes

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

Service Manager publishes the following fields from the joinnode table.


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


Field published as web                  Caption used in web  Is the field a managed
service object                          service messages     field?

cpu[cpu.clock.speed]                    CpuClockSpeed        Yes
                                                             Yes
file.system[mount.point]                MountPoint

file.system[disk.type]                  DiskType

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

         Note

         The caption for the istatus field must be AssetStatus. Do not update this caption.
         Otherwise, the data push and data population may fail.


1.6.2.5.1.4. Service Manager reconciliation
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
     CI record according to the appropriate DEM rules

Performance implications

Because Service Manager attempts to reconcile CIs with every push, the number of
reconciliation fields you have will affect the integration’s performance. The more reconciliation
rules you have, the more searches Service Manager must perform to match CIs. To improve
the performance of reconciliation searches, you should choose reconciliation fields that are
unique keys of the underlying Service Manager table. For example, if you want to reconcile CI


records in the device table, use the logical.name field as a reconciliation field because it is a
unique key. For information about how to create a reconciliation rule, see How to add DEM
reconciliation rules.

Dependence on DEM rules

Service Manager uses the Action if matching record doesn't exist DEM rule whenever it can't
reconcile CIs. You must review the DEM settings and decide if they meet your business
standards prior to the initial push of CIs from UCMDB to Service Manager. For example, you
can have Service Manager create a change request for every CI in the initial CI push by
selecting the Open a Change option.


1.6.2.5.1.5. Service Manager Discovery Event
Manager rules

You only need to create Discovery Event Manager (DEM) rules if you want to accomplish any
of the following custom actions.

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
