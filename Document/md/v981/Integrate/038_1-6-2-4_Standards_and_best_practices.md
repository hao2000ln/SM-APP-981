---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.2.4 .. 1.6.2.4
printed_pages: 1035-1071
---

# 1.6.2.4 Standards and best practices

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.2.4. Standards and best practices

This section provides best practices for using the integration.
UCMDB-SM configuration best practices
Centralized CI type management
Bi-directional data synchronization recommendations
Push scheduling recommendations
Push in clustered environments
Initial load configurations
How to configure Differential or Delta Load DEM rules
Fault detection and recovery for push
How to enable Lightweight Single Sign-On (LW-SSO) configuration
Frequently asked questions
When is a new CI created in Service Manager?
Can I analyze the reason for a CI deletion in SM?
How do I monitor relationship changes Between UCMDB and SM?
What kinds of relationships are pushed from UCMDB to SM?
What is a root CI node?
What is a root relationship?
What is the "Virtual-Compound" relationship type used in a UCMDB-SM integration query?
When do I need the population feature?
Can I populate physically deleted CIs from SM to UCMDB?
How do I keep the outage dependency setting of a CI Relationship in SM?
How do I create an XML configuration file?
How do I use the Load Fields button to add multiple managed fields?
What is the purpose of the <container> element in the population configuration file
(smPopConf.xml)?
Can I populate sub-item deletions?
What will happen if a population job fails or succeeds with warnings?


1.6.2.4.1. UCMDB-SM configuration best
practices

This section provides best practices and recommendations for successfully implementing this
integration in various environments. This section provides you with valuable understandings
and techniques that will enhance the UCMDB-SM integration as well as solve common
problems by providing solutions and workarounds to these issues. These practices and
recommendations may vary slightly according to each implementation, as the specific system
requirements and settings alter per system environment.

This section includes:

     Bi-directional data synchronization recommendations
     Push scheduling recommendations
     Push in clustered environments
     Initial load configurations
     How to configure Differential or Delta Load DEM rules
     Fault detection and recovery for push
     How to enable Lightweight Single Sign-On (LW-SSO) configuration


1.6.2.4.1.1. Centralized CI type management

The Service Manager Enhanced Generic Adapter allows centralized CI type management.
Centralized CI type management enables you to manage CI types from UCMDB without the
need to do much tailoring work on the Service Manager (SM) side. You can then synchronize
CIs from UCMDB to SM through data push.

Managing Out-Of-the-Box CI Types

Service Manager and UCMDB provide out-of-the-box CI types, as well as mapping files for
them. To modify an out-of-the-box CI type (for example, adding new attributes according to
your business needs), you only need to open the Visual Mapping tool, manually add new
attributes to this CI type, and then apply the update without leaving UCMDB. The new attribute
will be automatically added to the relevant web service object on the SM side.

Managing New Custom CI Types

To add a new CI type according to your business needs, you only need to add a new CI type
and create a TQL query in UCMDB, and then create a matching SM CI type by using the Visual
Mapping Tool without the need to leave UCMDB.

When you create a new SM CI type in the UCMDB Visual Mapping Tool interface, all relevant
SM objects (DBDICT, JoinDef, Web Service API, DEM Rule, and so on) for the new CI type are
automatically created on the SM side, except the format and icon (the new CI type uses the
configurationItem format by default).

            Note

           The population feature enables you to synchronize CIs from SM to UCMDB. For
           information about the circumstances under which you need to use the population
           feature, see When do I need the population feature?.

Visual Mapping tool

The UCMDB generic adapter framework comes with a Visual Mapping tool, which provides a
graphic user interface for you to configure value and field mappings for complex data push or
population configurations.

The following table describes the panes of this graphic user interface.

Pane                                                                                             Service Manager 9.81
Local Query
Local Query Attributes                  Description
Visual Mapping
                                        Displays a hierarchical tree structure of the
XML Editor                              local TQL query in the CMDB.
External Class Model
                                        This is the Attributes pane for the Local
External Class Model Attributes         Query pane. It displays attributes of a local
                                        integration TQL query.

                                        Allows you to establish mapping for items
                                        you select from the Local Query pane and
                                        the External Class Model pane through a
                                        drag and drop.

                                        Allows to you edit XML mapping files in a
                                        text editor.

                                        Displays a hierarchical tree structure of the
                                        external class model. For the UCMDB-
                                        SM integration, this pane displays
                                        supported CI types from the Service
                                        Manager (SM) side.

                                        The Attributes pane for the External Class
                                        Model pane displays attributes of an
                                        external class model. For the UCMDB-
                                        SM integration, this pane displays attributes
                                        from the SM side.


1.6.2.4.1.2. Bi-directional data synchronization
recommendations

UCMDB-SM integration supports bi-directional data synchronization between UCMDB and
Service Manager (SM). We recommend that you follow the following best practices to avoid
unnecessary problems due to improper use of the data push and population features:

     For CIs/CI Relationships that UCMDB can automatically discover, use UCMDB as the data
     source. Do not make changes to them in Service Manager; instead, always let UCMDB
     discover their changes and push the changes to SM.
     For CIs/CI Relationships that UCMDB can't automatically discover, use SM as the data
     source. Do not make changes to them in UCMDB; instead, always make changes to them
     in SM and populate the changes to UCMDB.
     For CIs/CI Relationships that are already created in SM and UCMDB can automatically
     discover, run a one-time population to synchronize them to UCMDB, and then use
     UCMDB as their data source.


Caution

Problems like the following may occur if you don't follow these best practices:

Problem 1:

[Population Adapter] After CIs/CI Relationships are pushed from UCMDB, if you
directly make changes in SM to these records without ever populating them back
to UCMDB first, the changes may not be populated to UCMDB.

Workaround:

Changing these UCMDB records in SM is not recommended; however if you need
to do so you can do the following to solve this issue: After the records are pushed
to SM, populate them back to UCMDB first before making any changes to them in
SM. This way the changes can then be populated to UCMDB.

Problem 2:

[Population Adapter] After a Composition relationship between a Node CI (node 1)
and Running Software CI is pushed to SM, if you change the upstream CI of the
relationship from node 1 to node 2 in SM and then run a change population to
populate this change, the Running Software CI will be removed in UCMDB.

Workaround:

It is recommended that you remove the running software in UCMDB and create a
new one instead of directly replacing the container of the running software in SM.
If you can't avoid doing so, do the following:

After you change the upstream CI of the relationship from node 1 to node 2, don't
directly run the change population. Follow these steps to avoid this issue:

   1. Update the Running Software CI in SM (or simply save it to mark it as
     updated).

   2. Run a Running Software CI change population. This will create a new
     Composition relationship between node 2 and this Running Software CI.

   3. Run a delta population to synchronize the relationship change to UCMDB. The
     relationship between node 1 and the Running Software CI will be removed,
     and the new relationship created in step 2 will remain.

If you have run a delta population after changing the upstream CI of the
relationship from node 1 to node 2, and as a result the Running Software CI has
been removed in UCMDB, follow these steps to solve this issue:

   1. Update the Running Software CI in SM (or simply save it to mark it as
     updated).

   2. Run a Running Software CI change population. This will create the Running
     Software CI, and a new Composition relationship between node 2 and this
     Running Software CI.


1.6.2.4.1.3. Push scheduling recommendations

Push jobs are run using two main methods, the first of which is manually executing the push
job and the second is scheduling the push job.

All push jobs can potentially produce a strain on the UCMDB and SM systems; We recommend
that you adhere to the following guidelines.

Scheduler time frames

It is important for you to understand the function of the Scheduler “time frame” concept.
Running push jobs creates an increase in system activity and may affect application
responsiveness. In order to enable users to effectively interact with applications We
recommend the following guidelines:

In order to reduce system strain, schedule the UCMDB to SM push to run at non-peak usage
hours, preferably when system usage is at a minimum.

Scheduler frequency

It is important to be aware of the business requirements when configuring the schedule
frequency. The scheduler frequency depends on infrastructure environment changes that must
be synchronized between UCMDB and SM.

Define the scheduling frequency based on the business requirements for consuming up-to-
date CI information. Most implementations require a daily update. When scheduling small IT
systems that are prone to frequent changes, the scheduling frequency may need to be
increased.

Push Job dependencies

UCMDB Push Jobs don't support dependencies between each other. Each “Push Job” is
considered a separate task and users can't define job dependencies. For example, that one job
is dependent on another or upon completion before the next job is run.

It is important that both CI queries and their dependent Relationship queries exist in the same
Job in order to avoid relationships not being pushed to Service Manager. You can change the
position of each query in the list to define an appropriate execution sequence. See the
following figure for an example.



1.6.2.4.1.4. Push in clustered environments

A clustered SM environment is comprised of multiple servlets running in parallel with a load
balancer that dispatches user requests to any available servlet. You must configure the
UCMDB-SM integration to point to a specific servlet and not to the SM loadBalancer. In order to
perform this, you must first create a dedicated web service listener.

Dedicated Web Services

A Service Manager system configured for vertical or horizontal scaling uses a load balancer to
redirect client connection requests to an available SM process. However, most Web Services
clients can't handle a redirect request and will fail if they use the SM load balancer as the
endpoint URL.

We recommend creating one or more SM processes dedicated to Web Services requests. The
user must configure the relevant external web service clients to connect directly to the
dedicated Service Manager processes.

Step-by-step cluster configuration process

This section describes the steps to configure a cluster environment for the integration.

How to configure web clients

To configure the relevant external web clients:

   1. Stop the Service Manager service.

   2. Open the sm.cfg file, and create a dedicated SM process to listen for Web Services
     requests using the -debugnode parameter.

     The following entries create a dedicated process listening on ports 13085 and 13445.

Explanation

The code excerpt illustrates the various settings for each of the SM process listeners
(web services) that enable SM clients to connect to the SM service.

Line 01 defines the load balancer port (13080).

Lines 02 and 03 define the SM ports to which non-dedicated SM clients are redirected by
the SM load balancer.

Line 04 defines the debugnode port that's utilized by the dedicated SM clients.


            Note

           Debugnode parameter
           The debugnode parameter tells the SM load balancer not to forward any client
           connection requests to this Service Manager process. Only clients that directly
           connect to the process can access this port.

How to configure the debugnode

To configure the debugnode:

   1. Start the SM service.
   2. Configure any external web service clients to connect directly to the SM processes

     running in debugnode. When performing an integration using UCMDB, the Service
     Manager Adapter for SM should be configured to connect to the debugnode port.
     For example, for normal connections set the endpoint URL to:
      http://<fully qualified host name>:13085/SM/9/rest/<Service Name>
     and for SSL-encrypted connections set the URL to:

      https://<fully qualified host name>:13445/SM/9/rest/<Service Name>
     These clients may include UCMDB (for push purposes), Connect-It, and additional
     applications.

Connecting to multiple SM processes

If you want to improve performance, you can connect to multiple Service Manager processes.
The integration supports both Service Manager vertical and horizontal load balancer
environments.
You can create more than one SM process that's dedicated to Web Services requests, and
configure the URL Override field of the integration point with the dedicated SM processes. This
field value (if any) overrides the Hostname/IP and Port settings.
The following is an example value of this field, which connects two SM processes:

http://<fully qualified host name1>:13080/SM/9/rest;http://<fully qualified host
name2>:13082/SM/9/rest


1.6.2.4.1.5. Initial load configurations

Before the configuration process can begin, you must first assess the amount of CI and
relationship data to be transferred from UCMDB to SM and ascertain the iteration process
that's required based on the volume.

You must first assess whether or not all of the data can be pushed in a single iteration. This is
ascertained by the amount of data that's included in the push queries and the amount of time
you have to push this data.

            Note

           The performance data presented in this document is based on tests that were
           performed in the lab and are provided for reference only. The integration
           performance may significantly differ in your environment depending on your
           hardware configuration.

Push performance in a single-threaded environment

The Push of 22,500 UCMDB root CIs (roots in queries) and/or Relationships in a single-
threaded environment takes about an hour and is performed in a linear fashion. See the
following table.

                                        Performance data in a single-threaded environment

Number of root CIs/CI Relationships     Multi-Threading Settings in sm.properties
Pushed per Hour

22,500

                                        number.of.concurent.sending.thr
                                        eads=1
                                        min.objects.for.concurent.sendi
                                        ng=50
                                        number.of.chunks.per.thread=3
                                        recommended.min.cis.per.chunk=5
                                        0

To view or edit the sm.properties file in UCMDB, navigate to Data Flow Management >
Adapter Management > ServiceManagerEnhancedAdapter9.41 > Configuration Files >
sm.properties.

Number of Root CIs and Relationships/22,500

The push time (in hours) in any given environment is calculated as follows:

If the push of a single planned query has the potential of breaching the permitted time frame,
the data must be divided into several queries. Each query must be pushed individually.


This query division is performed by creating several queries, each with different node
conditions that enable data filtering. Once all queries are pushed for the first time, the Initial
Load process is complete.

            Note

           When applying node conditions to the various Service Manager queries, you must
           make sure that all of the information is included in the queries, so that all relevant
           data is copied to Service Manager.

Implementing multi-threading

In order to improve performance, the Service Manager adapter utilizes multiple threads for the
push of CI and Relationship data to SM. The following section explains these settings and how
to configure them for maximum performance.

The multi-threading configuration is defined in the sm.properties file on the UCMDB server. To
view or edit the file in UCMDB, navigate to Data Flow Management > Adapter Management >
ServiceManagerEnhancedAdapter9.41 > Configuration Files > sm.properties.
The following are example multi-threading definitions in the sm.properties file:

  01 number.of.concurrent.sending.threads=6
  02 min.objects.for.concurrent.sending=50
  03 number.of.chunks.per.thread=3
  04 recommended.min.cis.per.chunk=50

Explanation

The code excerpt illustrates the relevant multi threading settings on the UCMDB server.

     Line 01 defines the number of parallel threads UCMDB will open to SM for CI push.
     Setting this parameter to 1 disables multi-threading, while a values of 2 or higher enables
     multi-threading.
     Line 02 defines the minimum number of SM objects needed to use multiple threads as
     opposed to a single thread.
     Line 03 defines the number of chunks per thread. This number multiplied by the number
     of threads gives you the total number of CI data chunks.
     Line 04 defines the recommended minimum number of CIs per CI data chunk.

The total number of chunks = number.of.chunks.per.thread *
number.of.concurrent.sending.threads

The integration implements a queue mechanism as follows:
The data passed from UCMDB to SM is divided into equal chunks, and these chunks are
placed in a queue.


Each available thread pulls the next chunk from the queue until all threads are available. Once
this process has completed, the push is complete.

The mechanism is designed to minimize idle time of each thread. As each thread processes its
chunk in parallel, some threads may finish before others and it is inefficient for them to wait for
each other.

            Caution

           Defining too many threads

           It is ineffective to over-increase the number of threads as this causes the SM
           server to overload. In enterprise environments where the SM server processing the
           push data is very robust the number of threads can be increased to 10 and in some
           cases even 20; however, you must take into account that increasing the number of
           threads raises CPU usage on the SM server during push, which may reduce
           application performance.

Push performance in multi-threaded environments

The push of 60,000 UCMDB root CIs (roots in queries) and/or Relationships in an out-of-the-
box multi-threaded environment takes about an hour and is performed in a linear fashion. See
the following table.

          Performance Data in an Out-Of-The-Box Multi-Threaded Environment

Number of Root CIs/Relationships Pushed Multi-Threading Settings in sm.properties

per Hour                                (Default)

60,000

                                        number.of.concurrent.sending.th
                                        reads=6
                                        min.objects.for.concurrent.send
                                        ing=50
                                        number.of.chunks.per.thread=3
                                        recommended.min.cis.per.chunk=5
                                        0

The push time (in hours) in any given environment is calculated as follows:

Number of Root CIs and Relationships/60,000

Push performance in multiple SM processes
environments

The Push of 190,000 UCMDB root CIs (roots in queries) and/or Relationships in a multi-
threaded environment with multiple SM processes takes about an hour and is performed in a
linear fashion. See the following table:


         Performance data in a multiple SM processes environment

Number of root                          SM processes               Multi-threading settings in
CIs/Relationships pushed                                           sm.properties (default)
per hour

160,000                                 2 server hosts, with each
                                        host running 4 processes
                                                                   number.of.concurren
                                                                   t.sending.threads=6
                                                                   0
                                                                   min.objects.for.con
                                                                   current.sending=50
                                                                   number.of.chunks.pe
                                                                   r.thread=3
                                                                   recommended.min.cis
                                                                   .per.chunk=50

                                                                   Data Push Chunk Size =
                                                                   4000 (in Integration
                                                                   Settings in UCMDB)

For more information about defining multiple SM processes for the integration, see How to
create an integration point in UCMDB.

The push time (in hours) in any given environment is calculated as follows:

Number of Root CIs and Relationships/160,000

How to set up SM DEM rules for initial loads

SM Discovered Event Manager Rules (DEM Rules) enable the user to define the appropriate
action to take for each event type that's reported to SM.

Each CI and relationship record pushed from UCMDB to SM is analyzed against the existing SM
records and open Change requests. SM rules define the appropriate action to be taken for
each type of CI data update that's sent to SM.

To view or update the SM Discovered Event Manager Rules:

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to Tailoring > Web Services > Discovered Event Manager Rules.

   3. Press ENTER or click the Search button.

     A list of all the Discovered Event Manager Rules is displayed. Each rule is usually linked to
     a CI Type or a subset of CIs of the same type.

   4. Click the individual CI Discovered Event Manager Rule to view its details.

To set up DEM Rules for initial loads:


            Tip

           When performing an Initial Loadwe recommend setting the SM Discovered Event
           Manager Rules to add newly reported CIs as described below. This minimizes the
           “noise” of an Initial Load, which could potentially create tens of thousands of
           Changes or Incidents.

For each of the Discovered Event Manager Rules, perform the following steps:

   1. Select the relevant Discovered Event Manager Rule.
   2. Go to the Action if matching record doesn't exist section, select the Add the record

     option.
   3. In the Action if record doesn't exist but unexpected data discovered section, select the

     Log Results and Update Record option.
   4. In the Action if record is to be deleted section, select the Delete Record option.
   5. Save the Discovered Event Manager Rule record.


1.6.2.4.1.6. How to configure Differential or
Delta Load DEM rules

Tip: Once the Initial Load or Data Load of the CI data has completed, it's advisable to apply
Differential or Delta Load settings. These settings apply to all data loaded from UCMDB to SM.
These loads send only updates regarding modifications discovered in the IT infrastructure from
UCMDB to SM.

To set up the SM Discovered Event Manager (DEM) Rules for Differential or Delta Loads:

   1. Sign in to Service Manager as a system administrator.

   2. Navigate to Tailoring > Web Services > Discovered Event Manager Rules.

   3. Press Enter or click the Search button.

     Service Manager displays a list of all the Discovered Event Manager Rules.

   4. For each of the Discovered Event Manager Rules, perform the following steps:

        1. Select the relevant Discovered Event Manager Rule.
        2. In the Action if matching record doesn't exist section, select the appropriate action

           required for each newly detected CI. If uncertain, select the Add the record option.
        3. In the Action if record does exist but unexpected data discovered section, select

           the appropriate action for each CI that was already modified, resulting in an
           unexpected or wrong result. The recommended best practice is to select the Open a
           Change option.
        4. In the Action if record is to be deleted section, select the appropriate action
           required for each CI that was already removed. The recommended best practice is
           to select the Delete Record option for CI Relationships, and select the Update
           record to the selected status option for CIs.
        5. Save the Discovered Event Manager Rule record.


1.6.2.4.1.7. Fault detection and recovery for
push

Universal CMDB has provided a fault detection and recovery mechanism since version 9.05:
individual CI failures no longer cause the entire push to fail, and you can review all failed CIs in
the Universal CMDB studio and then re-push them.


1.6.2.4.1.8. How to enable Lightweight Single
Sign-On (LW-SSO) configuration

You can enable LW-SSO for the integration so that users can directly view UCMDB CI records
from the Service Manager web client by clicking the View in UCMDB UI button, without
providing a UCMDB UI username and password.

            Note

           LW-SSO is unsupported for the Service Manager Windows client.

To enable LW-SSO for the integration:

   1. For each Service Manager user account that needs LW-SSO, create a user account in
     UCMDB with the same username. The passwords in the two systems can be different.

   2. Enable LW-SSO in the Service Manager Web tier. For details, see Configure LW-SSO on
     the Service Manager Web tier.

  3. Enable LW-SSO in UCMDB. For details, see the Enable login to UCMDB with LW-SSO
     topic in the Universal Discovery and CMDB Help Center.


1.6.2.4.2. Frequently asked questions

This section provides answers to frequently asked questions about the UCMDB-SM
integration.

This section includes:

     When is a new CI created in Service Manager?
     Can I analyze the reason for a CI deletion in SM?
     How do I monitor relationship changes between UCMDB and SM?
     What kinds of relationships are pushed from UCMDB to SM?
     What is a root CI node?
     What is a root relationship?
     What's the “Virtual-Compound” relationship type used in a UCMDB-SM integration
     query?
     When do I need the population feature?
     Can I populate physically deleted CIs from SM to UCMDB?
     How do I keep the outage dependency setting of a CI relationship in SM?
     How do I create an XML configuration file?
     How do I use the Load Fields button to add multiple managed fields?
     What is the purpose of the <container> element in the population configuration file
     (smPopConf.xml)?
     Can I populate sub-item deletions?
     What happens if a population job failed or completed?


1.6.2.4.2.1. When is a new CI created in
Service Manager?

CIs are created in SM under the following circumstances:

     A CI is manually added to SM through the Configuration Management module or the
     Request module.
     UCMDB reports a newly discovered CI according to the following:

           When a new CI is reported and the Discovered Event Manager Rules are set to Add
           the Record.
           When a new CI is reported, the Discovered Event Manager Rules are set to Open an
           Incident and the Incident has been closed.
           When a new CI is reported, the Discovered Event Manager Rules are set to Open a
           Change and the Change has been verified.


1.6.2.4.2.2. Can I analyze the reason for a CI
deletion in SM?

No.
SM opens a change request on the deleted CI and includes the following information:
“Delete event for CI “CI Name” triggered by discovery”.
Workaround
An SM change request doesn't contain a description of the reason for deletion, however it is
possible to extract specific information about CI deletions from the UCMDB History Database.
UCMDB data provides information about the user or the discovery pattern that initiated the CI
deletion.


1.6.2.4.2.3. How do I monitor relationship
changes between UCMDB and SM?

To understand the relationship change in SM, a distinction must be made between the various
types of Relationship Changes:

     The second endpoint of the relationship has Changed, so instead of CI X being linked to
     CI Y through a relationship, now CI X is related to CI Z.
     An attribute of the relationship has changed.

The first type of Relationship change is supported by the UCMDB-SM integration, therefore,
such “Relationship Changes” can either invoke CI relationship updates, or perform the creation
of Incidents or Changes, which are then reviewed and monitored.

The second is also supported, but it's not covered out-of-the-box; you can configure the
Universal CMDB query to expose such attributes of the relationship, and configure the Service
Manager WSDL to expose the mapped field, and then configure the adapter mapping
configuration in the XML and Groovy. However such a Relationship Attribute Change can't
perform the creation of Incidents or Changes, and only supports invoking CI relationship
updates directly.


1.6.2.4.2.4. What kinds of relationships are
pushed from UCMDB to SM?

Any kinds of relationships are pushed from UCMDB to SM under the following conditions:

     The relationship appears in a Push Query located in the Service Manager > Push folder
     in the UCMDB Query Manager.
     The relationship is named Root in the Push Query.
     The relationship is mapped to an appropriate target in SM in the UCMDB configuration
     files (XML and Groovy files).

The out-of-the-box relationships that are pushed from UCMDB to SM are relationships
between two CIs such as:

     Between Business Services and Applications;
     Between Business Service and Host;
     Between an Application and a Network Component; or
     Between Host, Network Components and Printers.


1.6.2.4.2.5. What is a Root CI node?

A Root node is a TQL query node that represents the CI type that's created through push to SM
from the TQL query structure. The rest of the TQL query structure contains information that
can be incorporated within the Root CI type and is used to enrich the record in SM with
additional information and or attributes.


1.6.2.4.2.6. What is a Root relationship?

A Root relationship is a relationship within a query and created in SM through push. It
represents a relationship between two Root CIs. Only the relationships marked with Root are
pushed to SM.


1.6.2.4.2.7. What's the “Virtual-Compound”
relationship type used in a UCMDB-SM
integration query?

When more than two UCMDB CI entities are connected in series, the “Virtual-Compound”
represents the relationship between the first and last entities. This is a virtual relationship, as
no physical representation exists.
The “Virtual-Compound” relationship type is a relationship that links two CI type entities that
have a logical relationship. See the following figure.

Explanation
The illustration shows an example of a Virtual-Compound relationship. The relationship in SM is
created directly between the Host and the Business Service.


1.6.2.4.2.8. When do I need the population
feature?

You need the population feature under any of the following circumstances:

     You have done modeling in SM, especially when you are in the planning and design
     phases, and you want your models to be reflected in UCMDB;
     You want to implement the UCMDB-SM integration, however you have already invested in
     your SM CMDB and don't want to lose that investment;
     You want to continue to maintain some parts of the SM CMDB while maturing your
     UCMDB/Discovery implementation.


1.6.2.4.2.9. Can I populate physically deleted
CIs from SM to UCMDB?

No.
Physical deletions of CIs are allowed in SM, but SM can't get such “deletion changes” and the
population feature will not synchronize such changes to UCMDB.
Physical deletions of CIs can be considered as exceptions, which occur only after you create
CIs by mistake. Normally, you delete a CI by setting its status to something like
Retired/Consumed. If such CIs have been populated to UCMDB, it is your responsibility to
remove them manually from UCMDB.


1.6.2.4.2.10. How do I keep the outage
dependency setting of a CI relationship in SM?

Out-of-the-box, CI relationships that are pushed from UCMDB to SM don't have outage
dependency information by default. If you need such information, you can set the Discovered
Event Manager (DEM) rule of the CI Relationship Web Services Description Language (WSDL)
as follows.

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to Tailoring > Web Services > Discovered Event Manager Rules.
   3. Open the ucmdbRelationship record.
   4. On the Rules tab, select Add the record, and set dependency as true.

     This will set the Outage Dependency of each CI Relationship to true, and set the number
     of dependent downstream CIs to 1 (because UCMDB supports only one-to-one
     relationships).

Suppose you want to set outage dependency only for some relationships. For example, if you
want to configure outage dependency for relationships that start from Business Service, you
can configure the adapter configuration file (XML) and WSDL definition. Or, you can also
configure outage dependency per relationship type (UCMDB query).

   1. In the WSDL definition, expose fields outage.dependency and outage.threshold.


2. In the XML file, set the exposed outage fields. For example, if you want to set the outage
  dependency to true and threshold to 1 for Business Service relationships, you simply need
  to change the XML mapping file SM Business Service Relations Push 2.0.xml. In the
  XML mapping file, use the following OutageDependency and OutageThreadhold
  settings:


<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<integration>
<info>
<source name="UCMDB" vendor="HP" version="10.20"/>
<target name="SM" vendor="HP" version="9.40"/>
</info>
<import>
<scriptFile path="mappings.scripts.SMPushFunctions"/>
</import>
<target_entities>
<source_instance root-element-name="Root_directly" query-
name="EA_SM Business Service Relations Push">
<target_entity name="Relationship">
<target_mapping datatype="STRING" name="RelationshipType"
value="SMPushFunctions.getDisplayName(Root_directly['element_type']
,ClassModel)"/>
<target_mapping datatype="STRING" name="ParentCI"
value="SMPushFunctions.getEndId(OutputCI.getExternalId().getEnd1Id(
))"/>
<target_mapping datatype="STRING_LIST" name="ChildCIs" value="
[SMPushFunctions.getEndId(OutputCI.getExternalId().getEnd2Id())]"/>
<target_mapping datatype="BOOLEAN" name="OutageDependency"
value="true"/>
<target_mapping datatype="NUMBER" name="OutageThreadhold"
value="1"/>
</target_entity>
</source_instance>
</target_entities>
</integration>


1.6.2.4.2.11. How do I create an XML
configuration file?

You create an XML configuration file in Adapter Management. You can copy the content of an
existing XML configuration file to the new file and then make necessary edits.
To create an XML configuration file:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Adapter Management.

     ServiceManagerEnhancedAdapter9.41 > Configuration Files.

   3. Click the Create new resource icon .
   4. Select New Configuration File.
   5. Enter a name for the file. The file name should use this format:

      <AdapterID>/mappings/<Synch Type>/<filename> . For example,
      ServiceManagerEnhancedAdapter9.41/mappings/push/SM Computer Push 2.0.xml .
   6. Click OK. The system displays a message and asks if you want to open the file in the
     Visual Mapping tool editor.
   7. Click Yes or No to continue.
     UCMDB creates the new XML configuration file in the Configuration Files folder of the
     adapter.
   8. Copy the content of an existing XML configuration file to the new file.
   9. Make necessary edits to the new file.

            Caution

           Invalid XML
           When removing XML elements from an XML file, keep in mind that the remaining
           elements must constitute a valid XML file. The system will use this file to translate
           the UCMDB Query Definition.


1.6.2.4.2.12. How do I use the Load Fields
button to add multiple managed fields?

Service Manager stores a list of managed fields in the ucmdbIntegration web service, which
consists of a number of web services objects. You can add more managed fields to DEM Rules
so that Service Manager can monitor changes in more CI attributes in UCMDB and trigger the
actions defined in relevant DEM Rules.

You can manually add managed fields that are exposed in associated WSDL definitions to DEM
Rules; however, you can use the Load Fields button to automatically (and therefore correctly)
add managed fields to DEM Rules.

   1. Click the Managed Fields tab of the DEM Rule.
   2. Click the Load Fields button.

   3. If the table (in the Table Name field) of the DEM rule record has only one WSDL definition
     associated to it, all fields exposed in the WSDL definition are immediately added to the
     Managed Fields list.

     A message is displayed: <XX> new fields loaded.

   4. If the table has more than one WSDL definition associated to it, the Managed Fields
     Importing wizard opens, and a list of WSDL definitions (ucmdbIntegration web service
     objects) is displayed.
        1. Select one or more objects, and click Next. All new fields that can be added from
           the selected web service objects are displayed.

        2. If you want to add all of the fields, click Finish; if you want to ignore some of them,
           change their Action value from Add to Ignore, and then click Finish.

           A message is displayed: <XX> new fields loaded.

   5. Save the DEM Rule record.


1.6.2.4.2.13. What is the purpose of the
<container> element in the population
configuration file (smPopConf.xml)?

Out-of-the-box, the smPopConf.xml file has a container element.

  <tql name="SM RunningSoftware Population 2.0"
  citype="running_software">
  <request type="Retrieve" dataType="ci"
  resourceCollectionName="ucmdbRunningSoftwares"
  resourceName="ucmdbRunningSoftware"
  basicQueryCondition="type=&quot;runningsoftware&quot;"
  fullQueryCondition="istatus~=&quot;Retired/Consumed&quot;"
  changedCreationQueryCondition="created.by.date&gt;'{fromDate}' and
  istatus~=&quot;Retired/Consumed&quot;"
  changedUpdateQueryCondition="created.by.date&lt;='{fromDate}' and
  devicemodtime&gt;'{fromDate}' and
  istatus~=&quot;Retired/Consumed&quot;"
  changedDeletionQueryCondition="devicemodtime&gt;'{fromDate}' and
  istatus=&quot;Retired/Consumed&quot;"/>
  <container tql="SM Computer Population 2.0"
  keyFields="CIIdentifier"
  linkTql="SM Computer Composition Software 2.0"
  linkRetrieveCondition="downstreamci.logical.name=&quot;$$$&quot; and
  upstreamci.type=&quot;computer&quot; and
  downstreamci.type=&quot;runningsoftware&quot; and
  relationship.subtype=&quot;Composition&quot;"
  linkRetrieveConditionKey="CIIdentifier"
  linkValueFields="upstreamci.logical.name"/>
  </tql>

     In UCMDB, RunningSoftware CIs must exist together with a Root Container (Node);
     however, Service Manager allows RunningSoftware CIs without a Node.
     The integration adapter synchronizes CIs and Relationships separately; when populating
     a RunningSoftware CI, the integration has no chance to check if a relationship exists
     between the CI and a Node.
With the <container> element, the integration populates RunningSoftware CIs together with a
container.


1.6.2.4.2.14. Can I populate sub-item
deletions?

Yes.

Service Manager and UCMDB store CI information in different data structures, and therefore
one SM CI may be synchronized to UCMDB as several CIs. For example, during population, an
SM computer CI record is synchronized to a Node CI in UCMDB, and the computer CI’s
attributes to CIs such as IP, Interface, Location, etc (which are referred to as sub-items of the
Node CI.). In this case, the Node CI is the root CI.

The integration allows you to populate sub-item deletions to UCMDB. For example, if you
delete the IP Address attribute value of a computer, the corresponding IP CI record in UCMDB
will be deleted too.


1.6.2.4.2.15. What will happen if a population
job fails or succeeds with warnings?

When a population job failed

The failure prevents the remaining population tasks from running. The next job run will start
from the last Success time. If pagination occurs (that is, the tasks are divided into multiple
pages), the tasks will run again and again within the first page from the last “Success” time
(once the end of the first page is reached, no new tasks will be executed).

When a population job completed

When the status of a job is "completed" (but not "completed successfully"), warnings
occurred. A warning doesn't prevent the remaining population tasks from running. The next job
run will run all tasks again starting from the last Success time. If pagination occurs (the tasks
are divided into multiple pages), the tasks on all pages will be re-run (including those that
successfully completed last time).
````
