---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7 .. 1.7.6
printed_pages: 1836-1868
---

# 1.7 Database Administration

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7. Database Administration

This section contains information about converting, maintaining, tuning, and
troubleshooting your Relational Database Management System (RDBMS). The topics
are intended for experienced Service Manager system and database administrators
responsible for installing and implementing databases or individuals hosting Service
Manager data and assisting in database conversion.

Other information contained in this section:

     Information required to configure and use Service Manager databases
     Practical information to learn about various methods used to perform queries
     against information contained in the database
     Information and steps used to import, export, purge, and archive records
     Information and steps used to run the Service Manager out-of-box maintenance
     utilities
     Information about how to use IR Expert
     Database tuning and troubleshooting tips
     Best practices and examples using out-of-box data

            Note

           To migrate your database from Oracle to PostgreSQL,
           see https://softwaresupport.softwaregrp.com/doc/KM03319848.

Related topics

Database dictionary
Database performance tuning
Database record auditing
Exporting records
Importing records
IR Expert
Keys and indexes in Service Manager
Purging and archiving records
Queries
Record retrieval
Stored queries
Supported RDBMS
Time zones
Triggers


UTF-8 (Unicode) support
Work schedules
Backups


1.7.1. Supported RDBMS

For a list of supported Relational Database Management Systems (RDBMS) for all
versions of Service Manager, view the Support matrix.
Service Manager doesn't replicate vendor documentation or tasks used to maintain a
Relational Database Management System (RDBMS). For the latest information, see
your RDBMS Vendor documentation and the RDBMS Vendor support Web site.


1.7.2. Microsoft SQL Server database
Unicode support

Prior to version 9.40, Service Manager used the VARCHAR, CHAR, and TEXT data
types to store text strings in a Microsoft SQL Server database. Microsoft SQL Server
relies on database collation to support a specific language. Although some languages
share the same collation, most languages don't. As a result, Service Manager didn't
support multiple languages when running on a SQL Server database.

We have enhanced Service Manager 9.40 to support the Unicode data type on SQL
Server. You can store text strings in multiple languages by using the Unicode data
type. When you run the server configuration utility, if you select the Use Unicode
Data Type checkbox for SQL Server (see the following figure), Service Manager
creates data with the Unicode data type when it loads the applications and demo
data.


The following table provides the mapping between the old and new data types.

Non-Unicode                             Unicode
VARCHAR                                 NVARCHAR
CHAR
                                        NCHAR
                                        This occurs only when the CHAR field
                                        length is greater than 1.

TEXT                                    NVARCHAR(MAX)

The operation is not reversible, which means once you have enabled this option, you
must use the Unicode data type when adding new data. When your SQL Server
database uses the Unicode data type, the read-only flag Use Unicode Data Type in
the sqlserver record of the sqldbinfo table is automatically turned on.

      Note

      The following four system tables will not use Unicode: dbdict,
      licenseinfo, lock, and lockshared.

The Unicode data type support is available only for new installations of the Service
Manager 9.40 or later applications. If you are upgrading from a previous version of
the applications, this option is unavailable.

For information about how to enable the Unicode support, see Install the Service
Manager Server.

Related topics

Database Administration
Prepare your RDBMS


1.7.3. High availability PostgreSQL with
Patroni

Patroni is a tool for deploying PostgreSQL servers in high-availability mode.

Patroni architecture

The following diagram illustrates the installation of a highly available PostgreSQL
cluster using Patroni and HAProxy.
Alternatively, you can deploy a hardware load balancer to replace the HAProxy in the
following diagram. In our lab environment, we have validated the configurations and
deployments with an F5 load balancer.

Deployment

The following guide describes the installation of a highly available PostgreSQL cluster
using Patroni and HAProxy/F5 load balancer on RHEL8 in a lab environment.
The parameters are set for 2000 concurrent users for Service Manager.


Prerequisites

   1. Prepare 6 virtual machines(VMs) or physical hosts – In this guide, we use 6 VMs
     prepared with Red Hat Enterprise Linux release 8(or 5 VMs+load balancer):
           2 VMs for Patroni and Postgresql – Postgresql operation orchestrator: it
           supports bootstrapping, automatic failover, streaming replication.
           3 VMs for Etcd – Manages the cluster: an open-source distributed key-
           value store providing a hub for cluster coordination and state management.
           It handles leader elections during network partitions and it can tolerate
           machine failure.
           1 VM for HAProxy or a load balancer – Load Balancer: it offers load
           balancing and proxying for TCP and HTTP based applications.

   2. Run the following commands for each VM allow the specific inbound port:
      sudo firewall-cmd --add-port={2379,2380,5432,5000,7000,8080}/tcp --
     permanent

          sudo firewall-cmd --reload

          sudo dnf -y update

          sudo reboot
   3. In the following case, we use Red Hat Enterprise Linux release 8.2, Patroni 1.6.5,

     PG12, Etcd 3.3.11, and HAProxy1.8.23/F5 load balancer as example versions.
   4. The parameters in the example are set for 2000 concurrent users for Service

     Manager.
     Note: Be sure to change the parameters according to your environment. These
     values are highlighted in red for your reference.

Install Etcd

   1. Run the following command to install Etcd:
      sudo dnf -y
     install http://mirror.centos.org/centos/7/extras/x86_64/Packages/etcd-3.3.11-
     2.el7.centos.x86_64.rpm

   2. Modify the /etc/etcd/etcd.conf file on all Etcd hosts based on your host
     addresses:

      #[Member]

          #ETCD_CORS=""


     ETCD_DATA_DIR="/var/lib/etcd/default.etcd"
     #ETCD_WAL_DIR=""
     ETCD_LISTEN_PEER_URLS="http://<host address>:2380"
     ETCD_LISTEN_CLIENT_URLS="http://<host
address>:2379,http://127.0.0.1:2379"
     #ETCD_MAX_SNAPSHOTS="5"
     #ETCD_MAX_WALS="5"
     ETCD_NAME="etcd1"
     #ETCD_SNAPSHOT_COUNT="100000"
     #ETCD_HEARTBEAT_INTERVAL="100"
     #ETCD_ELECTION_TIMEOUT="1000"
     #ETCD_QUOTA_BACKEND_BYTES="0"
     #ETCD_MAX_REQUEST_BYTES="1572864"
     #ETCD_GRPC_KEEPALIVE_MIN_TIME="5s"
     #ETCD_GRPC_KEEPALIVE_INTERVAL="2h0m0s"
     #ETCD_GRPC_KEEPALIVE_TIMEOUT="20s"
     #
     #[Clustering]
     ETCD_INITIAL_ADVERTISE_PEER_URLS="http://<host address>:2380"
     ETCD_ADVERTISE_CLIENT_URLS="http://<host address>:2379"
     #ETCD_DISCOVERY=""


          #ETCD_DISCOVERY_FALLBACK="proxy"

          #ETCD_DISCOVERY_PROXY=""

          #ETCD_DISCOVERY_SRV=""

          ETCD_INITIAL_CLUSTER="etcd1=http://<host
     address>:2380,etcd2=http://<host address>:2380,etcd3=http://<host
     address>:2380"

          ETCD_INITIAL_CLUSTER_TOKEN="etcd-cluster"

          ETCD_INITIAL_CLUSTER_STATE="new"
   3. Run the following command to reload changed files:

      sudo systemctl daemon-reload
   4. Repeat step 1 to step 3 for the other 2 VMs.
   5. Start 3 VMs simultaneously:

      sudo systemctl start etcd
   6. Check Etcd status:

      sudo systemctl status etcd
   7. Show etcd member list:

      etcdctl member list
   8. Show etcd cluster heath:

      etcdctl cluster-health

            Note

           After you make any changes for the configurations of Etcd cluster, you
           need to run the following command to clear previous temporary
           configurations:
           sudo rm -rf /var/lib/etcd/default.etcd

Install PostgreSQL

   1. Run the following command to add the PostgreSQL Yum Repository:
      sudo dnf -y
     install https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-
     x86_64/pgdg-redhat-repo-latest.noarch.rpm

   2. Disable the built-in PostgreSQL module:
      sudo dnf -qy module disable postgresql


   3. Install both client and server packages:
      sudo dnf -y install postgresql12-server postgresql12 postgresql12-
     devel postgresql12-contrib

Install Patroni

   1. Run the following command to install Python, Python pip and other
     dependencies:
      sudo dnf install python3-pip

          sudo yum install python3-devel

          sudo dnf install gcc
   2. Install Patroni by using Python pip .

      sudo pip3 install patroni[etcd]

          sudo dnf -y install https://github.com/cybertec-postgresql/patroni-
     packaging/releases/download/1.6.5-1/patroni-1.6.5-1.rhel7.x86_64.rpm
   3. Patroni uses the YAML file to store its configuration. So, you need to run the
     following command to create a configuration file:
      sudo cp -p /opt/app/patroni/etc/postgresql.yml.sample
     /opt/app/patroni/etc/postgresql.yml
   4. Next, edit the postgresql.yml file:
      sudo vi /opt/app/patroni/etc/postgresql.yml
   5. Set the configuration parameters:

      scope: postgres

          namespace: /pg_cluster/

          name: pg_node1
      restapi:

            listen: <host address>:8008

            connect_address: <host address>:8008
      etcd:

            hosts: <etcd1 host address>:2379, <etcd2 host address>:2379, <etcd3
     host address>:2379


bootstrap:
      dcs:
       ttl: 30
       loop_wait: 10
       retry_timeout: 10
       maximum_lag_on_failover: 1048576
       synchronous_mode: false
       postgresql:
         use_pg_rewind: true
         use_slots: true
         parameters:
          shared_buffers: "16GB" #Recommended value: 25% of physical

memory
          work_mem: "4MB"
          maintenance_work_mem: "1GB"
          max_worker_processes: 16 #Recommended value: 200% of CPU

number
          wal_buffers: "64MB"
          max_wal_size: "2GB"
          min_wal_size: "1GB"
          effective_cache_size: "32GB" #Recommended value: 50% of physical

memory


         fsync: on
         checkpoint_completion_target: 0.9
         log_rotation_size: "100MB"
     listen_addresses: "*"
     max_connections: 2000
     temp_buffers: "4MB"

 initdb:
      - encoding: UTF8
      - data-checksums

 pg_hba:
      - host replication replicator 127.0.0.1/32 md5
      - host replication replicator <Patroni host1 address> md5
      - host replication replicator <Patroni host2 address> md5
      - host all all 0.0.0.0/0 md5

users:
     admin:
      password: admin
      options:
        - createrole
        - createdb

postgresql:

            listen: <host address>:5432                    Service Manager 9.81
            connect_address: <host address>:5432                            Page 119 of 191
            data_dir: /var/lib/pgsql/12/data
            bin_dir: /usr/pgsql-12/bin
            pgpass: /tmp/pgpass
            authentication:
             replication:

              username: replicator
              password: replicator
             superuser:
              username: postgres
              password: postgres
         rewind: # Has no effect on postgres 10 and lower
          username: pgrewind
          password: pgrewind
      tags:
            nofailover: false
            noloadbalance: false
            clonefrom: false
            nosync: true
   6. Run the following command to start Patroni:
      sudo systemctl daemon-reload

This PDF was generated on May 23, 2026

          sudo systemctl enable patroni

          sudo systemctl start patroni

          sudo systemctl status patroni
   7. Repeat step 1 to step 6 for the other Patroni host.

Install HAProxy

   1. Run the following command to install HAProxy:
      sudo yum -y install haproxy

   2. Back up the existing HAProxy configuration file on the HAProxy instance:
      sudo cp -p /etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg.bkp

   3. Run the following command to update your HAProxy configuration file:
      sudo vim /etc/haproxy/haproxy.cfg

   4. Update the values highlighted in red according to your network setup:
      global

            log 127.0.0.1 local2
       chroot /var/lib/haproxy

            pidfile /var/run/haproxy.pid
       maxconn 6000

            user haproxy

            group haproxy

            daemon
       stats socket /var/lib/haproxy/stats
      defaults

            mode tcp

            log global

            retries 3


      timeout queue 1m
      timeout connect 10s
      timeout client 31m #Recommended value: Greater than session timeout
value
      timeout server 31m #Recommended value: Greater than session timeout
value
      timeout check 10s
      maxconn 3000
listen stats
      mode http
      bind *:7000
      stats enable
      stats uri /
listen postgres
      bind *:5000
      option httpchk
      http-check expect status 200
      default-server inter 3s fall 3 rise 2 on-marked-down shutdown-sessions
      server pg_node1 <PGnode1 IP address>:5432 maxconn 2000 check port
8008
      server pg_node2 <PGnode2 IP address>:5432 maxconn 2000 check port
8008


   5. Create a
      dir/file:/etc/systemd/system/haproxy.service.d/haproxy.conf configuration file
     that contains the following information:

      [Service]

          LimitNOFILE=6000

   6. Run the following command to reload the system daemon:
      sudo systemctl daemon-reload

   7. Start the HAProxy service and enable it to start at system reboot:
      sudo systemctl start haproxy

          sudo systemctl enable haproxy

   8. Verify the status of the HAProxy service
      sudo systemctl status haproxy

   9. Check the maximum number of open files:
      cat /proc/haproxy pid/limits|grep open
     For example:
      [sm972@haproxy ~]$ cat /proc/2893/limits|grep open

          Max open files 20037 20037 files

Note: When the "Failed to bind to port" error occurs, run the following command to
disable the SELinux boolean:

    sudo setsebool -P haproxy_connect_any=1

Configure hardware load balancer

Alternatively, you can deploy a hardware load balancer to replace HAProxy.

In our lab environment, we have validated the configurations and deployments with an
F5 load balancer.

See the following documents for F5 configurations and deployments:
Configure an F5 hardware load balancer

Common F5 hardware load balancer deployments

You may refer to the following screenshots as a typical example to connect to
Postgres cluster:


Before you start, you need to assign an virtual address to the physical address of F5
network interface. The newly added virtial address will be used for the virtual server
later on.

   1. Configure Secure Network Address Translation (SNAT) and create a new health
     monitor:

   2. Create the node list based on the health monitor:


3. Configure a pool member
4. Create a TCP profile from Local Traffic > Virtual

  Servers > Profiles > Protocol > TCP
        Set Idle Timeout to Indefinite
        Set Keep Alive Interval to Indefinite

5. Create a new virtual server based on the pool member, the SNAT, and the TCP
  profile (Protocol Profile (Client) and Protocol Profile (Server)) created above.




1.7.4. Support of SQL Server AlwaysOn

Service Manager supports SQL Server AlwaysOn for SQL Server 2012 and later
versions. As a high availability solution for SQL Server databases, AlwaysOn refers to
two separate but related technologies: AlwaysOn Failover Clustering and AlwaysOn
Availability Groups. For more information, refer to the Microsoft SQL Server
documentation.
To support SQL Server AlwaysOn, make sure your Service Manager environment
meets the following conditions.

     Microsoft ODBC Driver 17 for SQL Server (or a later version) is installed. You can
     download it from the Microsoft website.

                   Caution

                Do not use the ODBC SQL Server Driver or SQL Server Native Client
                ODBC Driver.

     A system DSN is added using Microsft ODBC Driver 17 for SQL Server (or later).
     Pay special attention to the following settings when creating the system DSN:

           You must select ODBC Driver 17 for SQL Server (or later).

In the Server field, you must specify the SQL availability group client
access point (for example, SqlFailOver), instead of the SQL Server


instance. You need to create a client access point when enabling AlwaysOn
for the SQL Server database cluster.


You must select the Multi-subnet failover option.


The Use strong encryption for data option is selected by default. If
required, you may unselect this option based on business needs.

     The following lines are added in the Service Manager Server configuration file
     (sm.ini):

          sqlalwayson:1

     The sm.ini file should resemble the following example:

          [sqlserver]
          sqldb:xxxx
          *sqllogin:xxxxxx
          sqlalwayson:1

For detailed steps to set up SQL Server AlwaysOn for Service Manager, refer to the
Enabling SQL Server AlwaysOn for Service Manager white paper.

Related topics

Parameter: sqlalwayson


1.7.5. Case-Sensitivity

Service Manager works with both case-sensitive and case-insensitive databases,
enabling you to set things up the way that best meets your needs. Your users will be
able to search for data case-sensitively or insensitively, as you choose. To achieve
this, all servers and clients must be set to the same sensitivity.

Service Manager supports both case-sensitive and case-insensitive databases. You
can configure the case-sensitivity of your database when you set it up. For more
information, refer to Install.

     Prior to converting a system to be case-insensitive, you must first ensure that
     your RDBMS supports case-insensitivity.
     We recommend implementing case-insensitive searching on a test system prior
     to setting it up on your production system.

Related topics

JavaScript/RAD implications of a case-insensitive database environment
Load/unload implications of case-sensitivity
Oracle case-sensitivity
Prepare your RDBMS


1.7.5.1. Load/unload implications of case-
insensitivity

When you load/unload data from a Service Manager system that connects to a case-
sensitive database and load it into one that connects to a case-insensitive database,
you can choose whether you want to Add and Update records or to Only add new
records.

     If you select Record Load Options - Add/update records, the new records will
     be inserted into the table and the existing records will be updated.

           Example 1: Suppose that you use a case-sensitive database to create an
           unload file that has two operator records - "operator01" and "operator02".
           You then load this unload file into a case-insensitive database which
           already has an operator record "OPERATOR01". In this case,
           "OPERATOR01" will be updated by "operator01" and "operator02" will be
           added.

           Note: If you try to load records with unique IDs that differ only in case from
           records that already exist in the case-insensitive database, the data in the
           unload will update the data in the current system.

           Example 2: Suppose that you use a case-sensitive database to create an
           unload file that has two operator records - "operator01" and
           "OPERATOR01". You then load this unload file into a case-insensitive
           database which already has an operator record "OPERATOR01". In this
           case, "OPERATOR01" will be updated by "operator01" and subsequently by
           "OPERATOR01", or visa-versa depending on the order of those records in
           the unload file.

           Note: If you try to add/update two records with unique IDs that differ only
           in case to a case-insensitive database, the second record loaded will
           update the first record loaded.

     If you select Record Load Options - Only add new records, the new records will
     be inserted into the table.

           Example 1: Suppose that you use a case-sensitive database to create an
           unload file that has two operator records - "operator01" and "operator02".
           You then load this unload file into a case-insensitive database which
           already has an operator record "OPERATOR01". In this case,
           "OPERATOR01" will remain unchanged and "operator02" will be added.


           Note: If you try to load records with unique IDs that differ only in case from
           records that already exist in the case-insensitive database, the data in the
           unload will add only the records which don't yet exist in the case-
           insensitive database.

           Example 2: Suppose that you use a case-sensitive database to create an
           unload file that has two operator records - "operator01" and
           "OPERATOR01". You then load this unload file into a case-insensitive
           database which doesn't have either operator record "OPERATOR01" or
           "operator01". In this case, "operator01" will be added but "OPERATOR01"
           will not be.

           Note: If you try to add two records with unique IDs that differ only in case
           to a case-insensitive database, the second record will not be added.

Related topics

Case-Sensitivity
JavaScript/RAD implications of a case-insensitive database environment
Oracle case-sensitivity


1.7.5.2. JavaScript implications of case-
insensitivity

In a case-insensitive environment, such as when Service Manager is set up to
connect to Microsoft SQL Server with a case-insensitive code page or Oracle with
case-insensitive settings, you should be aware that:

     Only Service Manager queries are evaluated case-insensitively.
     All Service Manager expressions are still evaluated case-sensitively.

This includes RAD expressions, JavaScript expressions as well as the expressions
within DVD conditions in Service Manager forms.

For example, given a database that contains a contacts record where the actual
last.name is stored in the database as "Smith," the following code will successfully
select the record but fail the Java Script test:

var contactList = new SCFile( "contacts" );

var findContact = contactList.doSelect( "last.name=\"SMITH\"" );

var lastName = "SMITH";

if ( lastName == findContact.last_name )     // This

expression is evaluated case-sensitively.

{

print("Hello!");                             // This code

will never be executed.

}

In this example:

     The query in contactList.doSelect() will be evaluated case-insensitively,
     therefore findContact will get the record back.
     All other JavaScript expressions will evaluate case-sensitively. Therefore,
     statements within the "if" block will never be executed.

Related topics

Case-Sensitivity
Load/unload implications of case-sensitivity
Oracle case-sensitivity


1.7.5.3. Oracle case-sensitivity

You can set the Oracle database to the desired case-sensitivity when you create it.
Refer to Prepare an Oracle database for instructions.

Refer to the Case-sensitivity section of the Service Manager Support Matrix for
versions of Oracle for which Service Manager supports case-insensitive mode.

Requirements for using a case-insensitive Oracle
database

If you want to use a case-insensitive Oracle database with Service Manager, you
must meet the following requirements:

          NLS_SORT=BINARY_CI and NLS_COMP=LINGUISTIC must be set in the
          Oracle instance level.

                If these values are set as given above, Service Manager will issue an
                ALTER SESSION statement to match the NLS_SORT and NLS_COMP
                session parameter with the NLS_SORT and NLS_COMP instance
                parameter.
                If these values aren't set or are different from the given values, Service
                Manager will treat it as case-sensitive Oracle and issue an ALTER
                SESSION statement to modify those parameters to be
                NLS_SORT=BINARY and NLS_COMP=BINARY.
          This ensures that all Service Manager server processes within a horizontal
          or vertical scaling group have consistent Oracle case-sensitivity settings.
          All unique keys in Service Manager tables must have a matching case-
          insensitive unique index.

Limitations of case-insensitive Oracle

You will not be able to rename or change a column size of keyed fields from the
Service Manager Dbdict Utility when using a case-insensitive Oracle instance.
Instead, select generate DDL when modifying columns from Dbdict Utility. An Oracle
database administrator can then drop affected function based index, apply the DDL,
and recreate the function based index on the Oracle database.

Validate case-insensitive unique indexes

During the initial system load, Service Manager created a set of case-insensitive
indexes for each table, based on the keys in that table. Service Manager logs these


indexes first time reads a table when the sqldebug:1 parameter is in the sm.ini file.
You can review the settings created for each table by viewing the sm.log file .
The case-insensitive unique indexes should be created as Oracle function based
indexes where the Column Expression is NLSSORT("<field
name>",'nls_sort=BINARY_CI').
To verify whether the case-insensitive unique indexes are being with the correct
column expression:

   1. Set sqldebug:1 in the sm.ini file, located in the
      <SM_install_location>\Server\RUN directory.

   2. Start Service Manager.
   3. Check the sm.log file, located in the <SM_install_location>\Server\logs

     directory.

The following entry in the log file indicates that the Oracle instance is set to case
insensitive, and that you were able to connect to it successfully.

  RTE I Oracle server settings for language, territory and
  character set: AMERICAN_AMERICA.AL32UTF8 (AL16UTF16)
  RTE I OCI Client settings for language, territory and character
  set: AMERICAN_AMERICA.AL32UTF8 (UTF16)
  ....
  RTE I Oracle instance setting for NLS_SORT is set to BINARY_CI
  RTE I Oracle instance setting for NLS_COMP is set to LINGUISTIC
  ...
  RTE I Oracle session is set up in CASE INSENSITIVE mode

The following information in the log file indicates that the Dbdict table has an index,
DBDICTM1C989DE64, with a key called "NAME", which is case-insensitive.


RTE D Table Name: DBDICTM1

RTE D Schema Name                       Index Name

Type Column Name                        Column Expression

RTE D ------------------------------ ---------------------------

--- ---- ------------------------------ ------------------------

----------------

RTE D SMDB                              DBDICTM1C989DE64

U SYS_NC00003$

NLSSORT("NAME",'nls_sort=''BINARY_CI''')

RTE D ------------------------------ ---------------------------

--- ---- ------------------------------ ------------------------

----------------

Related topics

Case-Sensitivity
JavaScript/RAD implications of a case-insensitive database environment
Load/unload implications of case-sensitivity


1.7.6. Backups

When deciding what files you need to back up, note that the following file types are
essential to run Service Manager:

     sm.ini
     sm.cfg
     All RDBMS data files

Related topics

Database Administration
````
