---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.3.2.2 .. 1.3.2.8
printed_pages: 1029-1061
---

# 1.3.2.2 Validate Smart Analytics configurations

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.2.2. Validate Smart Analytics configurations

User Role: Administrator
Starting from Service Manager 9.51, you can validate your Smart Analytics configurations when
the setup is finished, to make sure that Smart Analytics works properly.
To validate Smart Analytics configurations, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Smart Analytics > Configuration.
     The Smart Analytics Configuration page opens.

   2. From the toolbar, click the Validate button.
   3. Follow the on-screen instructions to fix issues if the validation fails.


1.3.2.3. Add a content server for Smart Ticket

User Role: System Administrator
The initial setting deploys one content server at the main level, and two content servers at the
Smart Search level. It's advisable to store no more than 3 million records for each content server.
You may need to add one or more content servers if your data size is huge for Smart Ticket.
To add a content server for Smart Ticket, follow these steps:

   1. Install a content server by using the Smart Analytics installer. For details about installing a
     content server, see Install Smart Analytics on Windows or Install Smart Analytics on Linux.

   2. After you start the new content server, add it to the Smart Analytics main server by editing
     the <Smart Analytics Installation>/IDOL/IDOLServer.cfg file as follows:
          a. Increase the value of Number by 1 in the DistributionIDOLServers section:

          [DistributionIDOLServers]
          Number=3

          b. Add a new section of [IDOLServerN], and then replace N with the number of your
          server.

          [IDOLServerN]
          Name=ContentN
          Host=ContentHostAddress
          Port=ContentPort
          DistributeByFieldsValues=CONTENTN

          c. Map virtual databases to the new server as needed, and then replace N with the
          number of your server.

          [VDB<x>]
          DbName=my_database
          Type=Combinator
          MapsTo=N:my_database

                        Note

                     Do not map virtual databases of one library to different content servers.

   3. Restart the OpenText SM Smart Analytics Main Server service.


1.3.2.4. Configure TSL/SSL for two-way
authentication

User Role: Administrator

TLS/SSL creates encrypted connections that allow private and sensitive information to be
transmitted without the risk of eavesdropping, data tampering, or message forgery. We
recommend setting up a TLS/SSL connection between Service Manager and the Smart Analytics
main server, the Connector Framework Server (CFS)/connectors, or the Media Server. In the
TLS/SSL connection, Service Manager acts as the client, and Smart Analytics acts as the server.

To do this, see the following steps for different scenarios.

Between Service Manager and Smart Analytics

To Configure TSL/SSL for two-way authentication between Service Manager and Smart
Analytics, follow these steps as an example:

Step 1 Create certificates

Create a signed Service Manager server certificate and Smart Analytics certificate using the
certificate generation toolkit. See work with the certificate generation toolkit.

After you generate the certificates, do the following:

  1. Open the smartanalytics.key file.
  2. Remove the redundant contents before the -----BEGIN PRIVATE KEY----- section.
  3. Save this file as exported_rsa.key .
  4. Open the smartanalytics.crt file. Save this file as smartanalytics.pem .
  5. Open the smrootca.crt file. Save this file as smrootca.pem .

Step 2 Configure SM server

Configure the Service Manager server to use the server certificate and to trust the client
certificate.

  1. Copy the following files to the Service Manager server host and put them under the RUN
     directory:

      \certs\cacerts
      \certs\trustedclients.p12
      \certs\smserver.p12

  2. Go to the RUN directory of the SM server, then add below configuration into sm.ini file:


         sslConnector:1
         ssl:1
         ssl_reqClientAuth:2
         sslEnabledProtocols:TLSv1.2,TLSv1.3
         ciphers:TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256,TLS_DHE_RSA_WITH
         _AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RS
         A_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_
         ECDHE_ECDSA_WITH_AES_128_GCM_SHA256

         keystoreFile:smserver.p12
         keystorePass:serverkeystore
         truststoreFile:cacerts
         truststorePass:changeit
         ssl_trustedClientsJKS:trustedclients.p12
         ssl_trustedClientsPwd:trustedclients

     The ciphers parameter in this example allows strong cipher suites only. If you remove this
     parameter, the system allows all cipher suites of TLSv1.2 and TLSv 1.3.
     If you don't want to restrict access to the server to only those clients whose certificates are
     in a list of trusted clients, set the ssl_reqClientAuth parameter to 1, and you don't need to
     configure the ssl_trustedClientsJKS and ssl_trustedClientsPwd parameters.
  3. Comment out the old value sslConnector:0 save the sm.ini file.
  4. Restart SM Server.

Step 3 Configure Smart Analytics components

Configure the Smart Analytics components to use the client certificate and to trust the server
certificate.

  1. Create a new folder named sslCertificate in the <Smart Analytics Installation> directory.
  2. Copy the following files to the <Smart Analytics Installation>\sslCertificate folder on your

     Smart Analytics local machine.
      certs\smartanalytics.pem

          certs\smrootca.pem

          exported_rsa.key
  3. Configure all content components to use the certificates by setting the <Smart Analytics

     Installation>\Content#\Content#.cfg file. Search the file for the sections listed below, and
     then configure the parameters under them. If a section already exists, update the section;
     otherwise add the section. The same rule applies for the parameters. When copying lines, be
     sure not to create duplicate sections or parameters. Note that the following example
     uses the TLS 1.3 protocol. You may change SSLMethod to TLSV1.2 if required.
      [SSLOption1]


   SSLMethod=TLSV1.3
   SSLCertificate=<Smart Analytics Installation>\sslCertificate\smartanalytics.pem
   SSLPrivateKey=<Smart Analytics Installation>\sslCertificate\exported_rsa.key
   SSLCACertificate=<Smart Analytics Installation>\sslCertificate\smrootca.pem
   SSLCheckCertificate=TRUE
   [IndexServer]
   SSLConfig=SSLOption1
   [Server]
   SSLConfig=SSLOption1
  Note If a section (such as the [IndexServer] section) doesn't exist in the out-of-box
  configuration files, you need to add the section manually with the settings described in this
  help topic.
4. Configure the Smart Search proxy to use the certificates by setting the <Smart Analytics
  Installation>\level2proxy\IDOLServer.cfg file. Note that the following example uses the TLS
  1.3 protocol. You may change SSLMethod to TLSV1.2 if required.
   [SSLOption1]
   SSLMethod=TLSV1.3
   SSLCertificate=<Smart Analytics Installation>\sslCertificate\smartanalytics.pem
   SSLPrivateKey=<Smart Analytics Installation>\sslCertificate\exported_rsa.key
   SSLCACertificate=<Smart Analytics Installation>\sslCertificate\smrootca.pem
   SSLCheckCertificate=TRUE
   [IndexServer]
   SSLConfig=SSLOption1

       [Service]

       SSLConfig=SSLOption1
   [Server]
   SSLConfig=SSLOption1
   SSLIDOLComponents=TRUE
   [IDOLServerN]
   SSLConfig=SSLOption1


5. Configure the Smart Analytics main server to use the certificates by setting the <Smart
  Analytics Installation>\IDOL\IDOLServer.cfg file. Note that the following example uses the
  TLS 1.3 protocol. You may change SSLMethod to TLSV1.2 if required.
   [SSLOption1]
   SSLMethod=TLSV1.3
   SSLCertificate=<Smart Analytics Installation>\sslCertificate\smartanalytics.pem
   SSLPrivateKey=<Smart Analytics Installation>\sslCertificate\exported_rsa.key
   SSLCACertificate=<Smart Analytics Installation>\sslCertificate\smrootca.pem
   SSLCheckCertificate=TRUE
   [IndexServer]
   SSLConfig=SSLOption1
   [DataDRE]
   SSLConfig=SSLOption1
   [CatDRE]
   SSLConfig=SSLOption1
   [AgentDRE]
   SSLConfig=SSLOption1
   [Server]
   SSLConfig=SSLOption1
   SSLIDOLComponents=TRUE
   [IDOLServerN]
   SSLConfig=SSLOption1
   [Agent]
   SSLConfig=SSLOption1

6. Change the <Smart Analytics Installation>\IDOL\agentstore\agentstore.cfg file. Note that the
  following example uses the TLS 1.3 protocol. You may change SSLMethod to TLSV1.2 if
  required.
   [SSLOption1]
   SSLMethod=TLSV1.3
   SSLCertificate=<Smart Analytics Installation>\sslCertificate\smartanalytics.pem
   SSLPrivateKey=<Smart Analytics Installation>\sslCertificate\exported_rsa.key


      SSLCACertificate=<Smart Analytics Installation>\sslCertificate\smrootca.pem
      SSLCheckCertificate=TRUE
      [IndexServer]
      SSLConfig=SSLOption1
      [Server]
      SSLConfig=SSLOption1
      SSLIDOLComponents=true
  7. Configure the Connector Framework Server (CFS) to use the certificates by setting
     the <Smart Analytics Installation>\CFS\CFS.cfg file. Note that the following example uses the
     TLS 1.3 protocol. You may change SSLMethod to TLSV1.2 if required.
      [SSLOption1]
      SSLMethod=TLSV1.3
      SSLCertificate=<Smart Analytics Installation>\sslCertificate\smartanalytics.pem
      SSLPrivateKey=<Smart Analytics Installation>\sslCertificate\exported_rsa.key
      SSLCACertificate=<Smart Analytics Installation>\sslCertificate\smrootca.pem
      SSLCheckCertificate=TRUE
      [Server]
      //to make CFS ACI port ssl encrypted.
      SSLConfig=SSLOption1
      [idolserver]
      SSLConfig=SSLOption1
  8. Restart the corresponding services for the Smart Analytics components that you modified.

Between Service Manager and CFS/connectors

To Configure TSL/SSL for two-way authentication between Service Manager and the
CFS/connectors, follow these steps as an example:

Step 1 Create certificates

Make sure you have performed the above steps in Between Service Manager and Smart
Analytics > Step 1 Create certificates.

Step 2 Configure SM server

Configure the Service Manager server to use the server certificate and to trust the client
certificate.


  1. Copy the following files to the Service Manager server host and put them under the RUN
     directory:
      \certs\cacerts
      \certs\trustedclients.p12
      \certs\smserver.p12

  2. Go to the RUN directory of the SM server, then add below configuration into sm.ini file:

         sslConnector:1
         ssl:1
         ssl_reqClientAuth:2
         sslEnabledProtocols:TLSv1.2,TLSv1.3
         ciphers:TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256,TLS_DHE_RSA_WITH
         _AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RS
         A_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_
         ECDHE_ECDSA_WITH_AES_128_GCM_SHA256

         keystoreFile:smserver.p12
         keystorePass:serverkeystore
         truststoreFile:cacerts
         truststorePass:changeit
         ssl_trustedClientsJKS:trustedclients.p12
         ssl_trustedClientsPwd:trustedclients

     The ciphers parameter in this example allows strong cipher suites only. If you remove this
     parameter, the system allows all cipher suites of TLSv1.2 and TLSv1.3.
     If you don't want to restrict access to the server to only those clients whose certificates are
     in a list of trusted clients, set the ssl_reqClientAuth parameter to 1, and you don't need to
     configure the ssl_trustedClientsJKS and ssl_trustedClientsPwd parameters.
  3. Comment out the old value sslConnector:0 save the sm.ini file.
  4. Restart SM Server.

Step 3 Configure Smart Analytics CFS/connectors

Configure the Smart Analytics Connector Framework Server (CFS) or connectors to use the client
certificate and to trust the server certificate.

  1. Copy the following files to the <Smart Analytics Installation>\sslCertificate folder on your
     Smart Analytics local machine:
      certs\smartanalytics.pem

          certs\smrootca.pem

          exported_rsa.key


  2. Configure the Connector Framework Server (CFS) to use the certificates by setting the
     <Smart Analytics Installation>\CFS\CFS.cfg file. Note that the following example uses the
     TLS 1.3 protocol. You may change SSLMethod to TLSV1.2 if required.
      [SSLOption1]
      SSLMethod=TLSV1.3
      SSLCertificate=<Smart Analytics Installation>\sslCertificate\smartanalytics.pem
      SSLPrivateKey=<Smart Analytics Installation>\sslCertificate\exported_rsa.key
      SSLCACertificate=<Smart Analytics Installation>\sslCertificate\smrootca.pem
      SSLCheckCertificate=TRUE

  3. [Server]
      //to make CFS ACI port ssl encrypted.
      SSLConfig=SSLOption1
      [IdolServer]
      SSLConfig=SSLOption1

  4. Configure the connectors to use the certificates by setting the <connector>.cfg file. Note
     that the following example uses the TLS 1.3 protocol. You may change SSLMethod
     to TLSV1.2 if required.
      [SSLOption1]
      SSLMethod=TLSV1.3
      SSLCertificate=<Smart Analytics Installation>\sslCertificate\smartanalytics.pem
      SSLPrivateKey=<Smart Analytics Installation>\sslCertificate\exported_rsa.key
      SSLCACertificate=<Smart Analytics Installation>\sslCertificate\mycacert .pem
      SSLCheckCertificate=TRUE
      [Server]
      SSLConfig=SSLOption1
      [Ingestion]
      //If CFS ACI port is ssl encrypted
      IngestSSLConfig=SSLOption1

  5. Restart the corresponding CFS and connector services.

Between Service Manager and Media Server


To Configure TSL/SSL for two-way authentication between Service Manager and the Media
Server, follow these steps as an example.

Step 1 Create certificates

Make sure you have performed the above steps in Between Service Manager and Smart
Analytics > Step 1 Create certificates.

Step 2 Configure SM server

Configure the Service Manager server to use the server certificate and to trust the client
certificate.

  1. Copy the following files to the server host and put them under the RUN directory:
      \certs\cacerts

          \certs\trustedclients.p12

          \certs\smserver.p12
  2. Go to the RUN directory of the SM server, then add below configuration into sm.ini file:

         sslConnector:1
         ssl:1
         ssl_reqClientAuth:2
         sslEnabledProtocols:TLSv1.2,TLSv1.3
         ciphers:TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256,TLS_DHE_RSA_WITH
         _AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RS
         A_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_
         ECDHE_ECDSA_WITH_AES_128_GCM_SHA256

         keystoreFile:smserver.p12
         keystorePass:serverkeystore
         truststoreFile:cacerts
         truststorePass:changeit
         ssl_trustedClientsJKS:trustedclients.p12
         ssl_trustedClientsPwd:trustedclients

     The ciphers parameter in this example allows strong cipher suites only. If you remove this
     parameter, the system allows all cipher suites of TLSv1.2 and TLSv1.3.
     If you don't want to restrict access to the server to only those clients whose certificates are
     in a list of trusted clients, set the ssl_reqClientAuth parameter to 1, and you don't need to
     configure the ssl_trustedClientsJKS and ssl_trustedClientsPwd parameters.
  3. Comment out the old value sslConnector:0 save the sm.ini file.
  4. Restart SM Server.


Step 3 Configure Smart Analytics Media Server

Configure the Smart Analytics Media Server to use the client certificate and to trust the server
certificate.

  1. Copy the following files to the <Smart Analytics Installation>\sslCertificate folder on your
     Smart Analytics local machine:
      certs\smartanalytics.pem

          certs\smrootca.pem

          exported_rsa.key
  2. Configure the Media Server to use the certificates by setting the <Smart Analytics

     Installation>\MediaServer1\MediaServer1.cfg file. Note that the following example uses the
     TLS 1.3 protocol. You may change SSLMethod to TLSV1.2 if required.
      [SSLOption1]
      SSLMethod=TLSV1.3
      SSLCertificate=<Smart Analytics Installation>\sslCertificate\smartanalytics.pem
      SSLPrivateKey=<Smart Analytics Installation>\sslCertificate\exported_rsa.key
      SSLCACertificate=<Smart Analytics Installation>\sslCertificate\smrootca.pem
      SSLCheckCertificate=TRUE
  3. [Server]
      SSLConfig=SSLOption1
  4. Restart the Media Server service.


1.3.2.5. Get ports occupied by Smart Analytics

To get ports occupied by Smart Analytics, follow these steps:

Systems based on Windows

Using PowerShell

   1. Run the script shown below to obtain the process IDs of <Smart
     Analytics>IDOL\IDOLServer.exe and <Smart Analytics>\level2proxy\IDOLServer.exe .

      gwmi win32_process -filter "Name LIKE '%IDOL%'"|select ProcessID,Name|Sort-Object
     ProcessID | ft -AutoSize

     The following information appears on the console:

ProcessID                               Name
---------                               ----
<PID1>                                  IDOLServer.exe
<PID2>                                  IDOLSE~1.EXE

2. Run the script shown below to find all process IDs for components called by <Smart
  Analytics>IDOL\IDOLServer.exe and <Smart Analytics>\level2proxy\IDOLServer.exe .

   gwmi win32_process -filter "ParentProcessID=<PID>"|select
  ProcessID,ParentProcessID,Name |where {$_.ParentProcessID -eq <PID>}|Sort-Object
  ProcessID | ft -AutoSize

Note

<PID> here is the process ID obtained in Step 1.

The following information appears on the console:

ProcessID                               ParentProcessID  Name
---------                               ---------------  ----
<PID1>                                  <PID>            view.exe
<PID2>                                  <PID>            agentstore.exe
<PID3>                                  <PID>            dah.exe
<PID4>                                  <PID>            community.exe
<PID5>                                  <PID>            dih.exe
<PID6>                                  <PID>            category.exe
<PID7>                                  <PID>            conhost.exe

3. Run: netstat -anot | findstr <PID> to get ports occupied by the components found in step
  2:


        Note

        <PID> here is the process ID you got from both step 1 and step 2.

The following information appears on the console:

TCP 0.0.0.0:<PORT1>                     0.0.0.0:0                 LISTENING         <PID>
InHost                                  0.0.0.0:0                 LISTENING         <PID>
TCP 0.0.0.0:<PORT2>                     0.0.0.0:0                 LISTENING         <PID>
InHost                                  [::]:0                    LISTENING         <PID>
TCP 0.0.0.0:<PORT3>                     [::]:0                    LISTENING         <PID>
InHost                                  [::]:0                    LISTENING         <PID>
TCP [::]:<PORT1>
InHost
TCP [::]:<PORT2>
InHost
TCP [::]:<PORT3>
InHost

     The ports listed here are used by Smart Analytics.
If PowerShell isn't installed, you can find all the process IDs from Task Manager.

Systems based on Linux

Using Bash
Run: ps -ef | grep IDOL [OR: Content, Connector, etc.]
You will get a list similar to the following:

<USER>  <PID1>                          1 0 14:06 pts/0 00:00:00

/opt/MicroFocus/ServiceManager9.xx/SmartAnalytics/level2proxy/dah/dah.exe

-idolcomponent -configfile

/opt/MicroFocus/ServiceManager9.xx/SmartAnalytics/level2proxy/IDOLServer.

cfg -aciport <PORT1> -serviceport <PORT2>

<USER>  <PID2>                          1 0 14:06 pts/0 00:00:01

/opt/MicroFocus/ServiceManager9.xx/SmartAnalytics/level2proxy/dih/dih.exe

-idolcomponent -configfile

/opt/MicroFocus/ServiceManager9.xx/SmartAnalytics/level2proxy/IDOLServer.

cfg -aciport <PORT3> -indexport <PORT2> -serviceport <PORT3>

All the ports listed here are used by Smart Analytics.


1.3.2.6. Use Smart Analytics Assistant

Applies to User Role: System administrator

Smart Analytics Assistant (SAA) is a built-in tool that enables administrators to interactively
perform IDOL administrative actions in Smart Analytics. For example, you can use this tool for
content server maintenance, system status checking, and troubleshooting.

In the SAA interface, there is a command line to enable the administrator to send IDOL actions to
IDOL components. The most frequently used actions are included in the drop-down list. You can
get more actions and information from IDOL reference guides.

Service Manager provides five blocks to fulfill different functionality. For each component in all
blocks, you can click the underlined name to get detail status.


Block                                   Description
Main Proxy
Smart Ticket and Hot Topic content      Top level proxy status that shows the
                                        component name, host, port, and status. If
Smart Search Proxy                      any component is down, you need to
Smart Search Content                    perform further investigation.

Media Server                            By default, one content store is used for
                                        Smart Ticket and Hot Topic Analytics. It must
                                        always be online. If you need more content
                                        stores to host more databases, you can click
                                        the “Add” link. Each content store to be
                                        added to the system has to be installed and
                                        running on another machine.

                                        The second level proxy that's dedicated to
                                        Smart Search. Only DAH and DIH are
                                        included in this proxy.

                                        By default, two content stores are used for
                                        Smart Search. You can add more content
                                        stores by clicking the “Add” link. Each
                                        content store to be added to the system has
                                        to be installed and running on another
                                        machine.

                                        By default, one media server is installed for
                                        OCR purposes. If you want to improve the
                                        performance, you can add more media
                                        servers. Each media server to be added to
                                        the system has to be installed and running on
                                        another machine. If you want to use two or
                                        more media servers, you need to install a
                                        media proxy server too.

To use Smart Analytics Assistant, follow these steps:

   1. Type saa in the Service Manager command line, and then press Enter. The Smart Analytics
     Assistant interface is launched.

   2. Use Smart Analytics Assistant to perform the administrative tasks . For example, you can
     select an action from the drop-down list.


      Note

     Replace <Host>, <port>, <variable_value> in the following action examples with
     the corresponding values that you can find from the corresponding status
     blocks.

Backup Component
Creates a backup that can be used to restore the component’s state. You can use this
action for the Content, Category, Agent and Community components, but you must
send the action to the component ACI port, rather than to the IDOL Proxy port. The
backup file is stored in the path that you specified.
For example, to backup category,
http://<Host>:<CategoryPort>/action=BackupServer&path=c:\backup_category

            Note

           By default, the Smart Analytics server CategoryPort is 9020.

Backup Database
Exports all the index documents of a database from the Smart Analytics content server
to a series of compressed files in the defined backup directory. This action is
appropriate for backing up an individual database. If you want to back up all databases
on a content server, use the action Backup Component as mentioned above.
Action example:
http://<Host>:<indexPort>/DREEXPORTIDX?
filename=c:/BackupFolderName/FilePrefix&DatabaseMatch=
<Database_name>&HostDetails=true

            Note

           In this example, the filename is a combination of the path and basic file
           name. Make sure you specify parameter
           DatabaseMatch=DatabaseName .

Restore Component or Category step 1
Imports backup files of component that was backed up by using the Backup
Component action. It could be the Content, Category, or Community component. For
the Category component, you need an extra step to synchronize it.
Action example:


http://<Host>:
<CategoryPort>/action=RestoreServer&filename=c:\backup_category\***.zip
Restore Category step 2 - Synchronize
After you restore the category component, you need to synchronize and build the
category.
Action example:
http://<Host>:<MainProxyACIPort>/action=CategorySyncCatDRE

            Note

           By default, the port number is 9000.

Restore Database
Restores the index IDX exported before. If no DREDbName is specified, use the
dbname of the indexed file.
Action example:
http://<MainProxyHost>:<IndexPort>/DREADD?c:\\path\to\<xxx.idx>&DREDbName=
<variable_value>&CreateDatabase=True

            Note

           By default, the port number is 9001.

View Index Status
Checks the status of index actions in the Smart Analytics index queue.
Action:
http://<Host>:<port>/action=indexerGetStatus
View Action History
Displays a log of requests, including the date and time that a request was made, the IP
address of the client that made the request, and the internal thread that handled the
action.
Action example:
http://<Host>:<port>/action=GRL&format=xml
View Root Category Detail
Displays the root categories after training.
Action example:


http://<Host>:<port>/action=CategoryGetHierDetails
View Status
Requests details about all components. Indicates whether all components are up and
running; indicates how many documents are stored in each database.
Action example:
http://<Host>:<port>/action=GetStatus

            Note

           If any component is offline, check the corresponding log file and fix it to
           bring it online. During indexing, the DIH periodically checks whether all the
           connected content servers are available. If a content server is unavailable,
           the DIH queues the data that this content server normally receives, and
           when the content server starts operating again, the DIH indexes the
           queued data into it.

Show Smart Search content server status
Displays the status of the Smart Search content server.
Action example:
http://SmartSearchProxyHost:DIHPort(20080)/action=EngineManagement&EngineActi
on=showstatus

            Tip

           To view the status for different Smart Analytics components, instead of
           using the action command, you can easily click the component link on the
           Smart Analytics Assistant form.

Add Smart Search Content servers dynamically
To add a Smart Search content server dynamically, follow these steps:

   1. Run the following action:
      http://SmartSearchProxyHost:DIHPort(20080)/action=EngineManagement&Engi
     neAction=Add&Host=ContentServerHost&Port=ContentServerPort&weight=1

   2. Run the following action:
      http://SmartSearchProxyHost:DAHPort(20070)/action=EngineManagement&Engi
     neAction=EngineAdd&EngineHost=ContentServerHost&EnginePort=ContentServ
     erPort

   3. Repeat previous steps until all content servers are added.


           4. After you add the new content servers, click the Redistribute link in saa to
              redistribute data among all Smart Search content servers.

3. Click Run. The result of the action is displayed.


1.3.2.7. Check Smart Analytics log files

The log files from the Smart Analytics servers provide details to help you identify possible
problems or invalid configurations. By default, you can find these log files under corresponding
folders in which different Smart Analytics components are installed, such as <SmartAnalytics
Installation>\IDOL, <SmartAnalytics Installation>\MediaServer, and <SmartAnalytics
Installation>\Content1. Each connector also has its own log folder. All the log files that are related
to content are now in the corresponding content folder.

Some log files in the IDOL Server are listed here as examples for your better understanding of the
details:

 File name                                                                                       Service Manager 9.81
 action.log
 agentstore_application.log             Description
 agentstore_index.log
 agentstore_query.log                   Logs all the actions on IDOL Server.
 application.log
 category_application.log               Logs general application errors, warnings
                                        and information relating to the agent index.
 category_category.log
                                        Logs messages relating to the indexing,
 category_cluster.log                   deletion and updating of agents.

 category_schedule.log                  Logs messages relating to the querying of
                                        agents.
 category_taxonomy.log
                                        Logs general application errors, warnings
 community_action.log                   and information relating to indexes.
 community_application.log
 community_term.log                     Logs general application errors, warnings
 community_user.log                     and information relating to the category
                                        index.
This PDF was generated on May 23, 2026
                                        Logs messages relating to category actions
                                        that read or manipulate the categories,
                                        including errors, warnings and progress
                                        information.

                                        Logs messages relating to cluster actions,
                                        including errors, warnings and progress
                                        information.

                                        Logs messages relating to the running of the
                                        Analysis Schedules that are specified in the
                                        configuration file.

                                        Logs messages relating to the
                                        TaxonomyGenerate action, including errors,
                                        warnings and progress information.

                                        Logs all the actions relating to communities.

                                        Logs general application errors, warnings
                                        and information relating to the communities.

                                        Logs terms as they are added to profiles and
                                        agents.

                                        Logs when users and agents are added or
                                        deleted (or when this fails).

                                                                                                                         Page 140 of 279

File name                               Description
dah_action.log
dah_application.log                     Logs all the actions relating to DAH.
dih_application.log
dih_index.log                           Logs general application errors, warnings
dih_query.log                           and information relating to DAH.
index.log
                                        Logs general application errors, warnings
                                        and information relating to DIH.

                                        Logs messages relating to the indexing,
                                        deletion and updating of DIH.

                                        Logs messages relating to the querying of
                                        DIH.

                                        Logs the index actions that the Smart
                                        Analytics server receives.

The following items are the default logging configuration of the Smart Analytics servers:

LogArchiveDirectory=./logs/archive
LogDirectory=./logs
LogTime=TRUE
LogEcho=FALSE
LogLevel=normal
LogExpireAction=Day
LogMaxOldFiles=7
LogOldAction=delete
LogMaxSizeKBs=102400


            Note

           By default, the log files are compressed and deleted as follows:

              1. Smart Analytics keeps the log files in the ./logs folder. A log file is compressed
                into a .zip file under any of the following conditions:
                      The size of the log file reaches 102400 KBs.
                      The size of the log file is less than 102400KBs, and there are log entries in
                      the subsequent day. Then, the log file is compressed at the beginning of
                      the second day.
                      The size of the log file is less than 102400KBs, and there are no log entries
                      in the subsequent day. Then, the log file is compressed at the time when
                      new entries are logged.

              2. A maximum of 6 zipped log files and 1 log file are stored in the ./logs folder.
                The .zip file's name starts with the log file's name and ends with the current
                timestamp in the format of yyyy.mm.dd. When there are more than 1 .zip file
                compressed from a log file, the timestamp in the new .zip files is followed by a
                two-digit number from 00 to 05 depending on the sequence of the .zip file. The
                oldest .zip file is automatically deleted when the number of such.zip files
                reaches 7. The 7 .zip file names are reused in sequence during the process.

You can customize the settings according to your requirements. For example, if you want to
delete history log files automatically whenever the number of log files is more than 100, you can
configure LogOldAction=Delete and LogMaxOldFiles=100 in the .cfg file.

You can find these configuration items in the [Logging] section of the configuration file under the
servers folders. For example, the .cfg file of IDOL Server is located in the following path by
default:

<SmartAnalytics Installation>\IDOL\IDOLServer.cfg

The following table lists the description for these configuration items:

Parameter                                                                                        Service Manager 9.81
LogArchiveDirectory
                                        Description
LogDirectory
LogTime                                 Path to log archive directory. Type the
                                        directory in which you want the application
LogEcho                                 to archive old log files when LogOldAction is
                                        set to Move .
                                        Path to log directory.

                                        Displays time with each log entry. Enable this
                                        parameter to display the current time next to
                                        each log entry in the log file.
                                        Possible values: TRUE or FALSE

                                        Displays logging messages on the console.
                                        Possible values: TRUE or FALSE

 Parameter                                                                                       Service Manager 9.81
 LogLevel
                                        Description
This PDF was generated on May 23, 2026
                                        The log levels are hierarchical from least
                                        logging to most logging. You can use the
                                        LogLevelMatch parameter to specify which
                                        messages are reported relative to the
                                        specified LogLevel. For example, if
                                        LogLevelMatch=LessThan and
                                        LogLevel=Warning , "Normal" and "Full"
                                        message types are reported.
                                        The following are the possible values for this
                                        parameter:

                                              Always
                                             Basic processes are logged.

                                                           Note

                                                        This produces only minimal
                                                        logging and no errors are
                                                        logged.

                                              Error
                                             Errors are logged.
                                              Warning
                                             Errors and warnings are logged.
                                              Normal
                                             Errors, warnings, and basic processes
                                             are logged.
                                              Full
                                             Every occurrence is logged.

                                                           Note

                                                        This produces a large log
                                                        file and can affect
                                                        performance.

                                                                                                                         Page 144 of 279
 Parameter                                                                                       Service Manager 9.81
 LogExpireAction
                                        Description
This PDF was generated on May 23, 2026
                                        Determines how log files are handled when
                                        they exceed the maximum size. Type one of
                                        the following to determine how log files are
                                        handled when they exceed the
                                        MaxLogSizeKBs size:

                                              Compress

                                             The log file's name is appended with a
                                             timestamp, compressed and saved in
                                             the log directory. By default, this is a
                                             ZIP file. Use the LogCompressionMode
                                             parameter to specify another
                                             compression format.
                                              Consecutive
                                             The log file's name is appended with a
                                             number and saved in the log directory.
                                             When the next log file reaches its
                                             LogMaxSizeKBs size, it is appended
                                             with the next consecutive number.

                                              Datestamp
                                             The log file's name is appended with a
                                             timestamp and saved in the log
                                             directory.
                                              Previous
                                             The log file's name is appended with
                                             .previous and saved in the log directory.
                                             Every time a log file reaches its
                                             LogMaxSizeKBs size, it is given the
                                             same postfix so that it overwrites the
                                             old log file.

                                              Day
                                             Only one log file is created for each day
                                             and is appended with the current
                                             timestamp. Log files are archived after
                                             they reach the LogMaxSizeKBs size.

                                                                                                                         Page 145 of 279
Parameter                                                                                        Service Manager 9.81
LogOldAction
LogMaxSizeKBs                           Description

                                                           Note

                                                        The LogMaxSizeKBs
                                                        parameter takes
                                                        precedence over the
                                                        LogExpireAction parameter.
                                                        Therefore, if you set
                                                        LogExpireAction to Day, and
                                                        the value for
                                                        LogMaxSizeKBs results in
                                                        more than one log file,
                                                        multiple log files are
                                                        generated for each day.

                                        Determines how log files are handled when
                                        the maximum number of log files is
                                        exceeded. Type one of the following to
                                        determine how log files are handled when
                                        the LogDirectory has reached the maximum
                                        number of log files, as determined by the
                                        LogMaxOldFiles parameter:

                                              Delete

                                             The log files are deleted.

                                              Move

                                             The log files are moved to the specified
                                             LogArchiveDirectory.

                                        Maximum log file size (in kilobytes). If you
                                        don't want to restrict the log file size, type
                                        -1 .

                                        The LogExpireAction parameter determines
                                        how a log file is handled after it has reached
                                        its maximum size.

Parameter                                                                                        Service Manager 9.81
LogMaxOldFiles
                                        Description

                                        Maximum number of log files in the log
                                        directory. The maximum number of log files
                                        the specified LogDirectory can store before
                                        the application runs the specified
                                        LogOldAction. If you don't want to restrict
                                        how many log files the LogDirectory can
                                        store, type -1 .


1.3.2.8. Manage Smart Analytics background
schedule in SMIS

In Smart Analytics, some background processes are managed by Integration Manager, which is a
plug-in based platform called Service Manager Integration Suite (SMIS). In the out-of-box
system, Smart Analytics have three types of SMIS instances:

     SMIDOL

     The SMIDOL instance is for the training, testing, index, and tuning processes, which are
     triggered in Smart Analytics Configuration. Normally, one Service Manager server only has
     one SMIDOL instance named as SMIDOL*. The asterisk sign is the sequence number, which
     is usually 0.

     SMIDOLOCR

     The SMIDOLOCR instance is for the image analyzing process, which is triggered when users
     submit requests from the ESS portal (including the Mobility client). For performance
     consideration, you can have multiple SMIDOLOCR instances for one Service Manager
     server. The number of instances equals to the thread number of the Media Servers. If the
     Media Servers can't be connected, only one instance is created. The instance name is
     SMIDOLOCR* (The asterisk is the sequence number). The Optical Character Recognition
     (OCR) task will be added to one of these instances after an interaction is created in ESS,
     depending on which instance has the least tasks in queue.

     SMIDOLAutoFill

     The SMIDOLAutoFill instance is for the auto-fill process. If an interaction is submitted to ESS
     without an attachment, a task will be added into this instance. In addition, if SMIDOLOCR is
     done, a SMIDOLAutoFill task will be also added . For performance consideration, one SM
     server has multiple SMIDOLAutoFill instances. The number of instances equals to the thread
     number of the IDOL Server. If the IDOL Server can't be connected, only one instance will be
     created. The instance name is SMIDOLAutoFill* (The asterisk is the sequence number).

You can check the following topics on troubleshooting Smart Analytics background schedule in
SMIS:

Manually create and enable an instance in SMIS

The SMIDOL and SMIDOLAutoFill instances are created and enabled automatically when you
enable Smart Analytics in the Smart Analytics Configuration menu. The SMIDOLOCR is created
and enabled automatically when you enable the Media Server in the Smart Analytics
Configuration menu. These instances are also created when corresponding processes are
triggered, such as the training, testing, tuning, index, or image process.

If the instance is not created automatically or you want do some troubleshooting, you can
manually start up these SMIS instances for Smart Analytics.

To create and enable a SMIS instance for Smart Analytics manually, follow these steps:


   1. Do one of the following to access Integration Manager:
           Click Tailoring > Integration Manager.
           Type smis in the command line, and then press Enter.

   2. Click Add.
   3. Select the SMIDOL , SMIDOLAutoFill, or SMIDOLOCR template, and then click Next. The

     Integration Instance Information screen is displayed.
   4. Change the configuration as needed, and then click Next. The Parameters screen is

     displayed.
   5. Do not change anything and click Next. The Fields screen is displayed.
   6. Do not change anything and click Next. The Mapping screen is displayed.
   7. Click Finish. The main SMIS configuration screen is displayed.
   8. Click Enable to enable the instance.

Manually disable and remove an instance in SMIS

The SMIDOL and SMIDOLAutoFill instances are removed when you disable Smart Analytics while
the SMIDOLOCR instances are removed when you disable the Media Server in the Smart
Analytics Configuration menu.

If you want to manually disable or delete an SMIS instance, follow these steps:

   1. Do one of the following to access Integration Manager:
           Click Tailoring > Integration Manager.
           Type smis in the command line, and then press Enter.

   2. Select an instance, and then click Disable or Remove.

Configure the SMIS instances

If the SMIDOL, SMIDOLAutoFill, and SMIDOLOCR instances are created automatically, the default
configuration is defined as follows:

Name:                                                                                            Service Manager 9.81

                                        SMIDOL*, SMIDOLAutoFill*, or SMIDOLOCR*

                                                    Note

                                                   The asterisk sign (*) is the
                                                   sequence number starting from
                                                   0.

Interval Times:                         30s

Max Retry Times:                        5

Log Level:                              INFO

Log File Directory:                     N/A

Run as system startup:                  true

To change the settings for performance tuning or troubleshooting, follow these steps:

   1. Do one of the following to access Integration Manager:
           Click Tailoring > Integration Manager.
           Type smis in the command line, and then press Enter.

   2. Select an instance, and then click Disable.
   3. Select the disabled instance, and then click Edit.
   4. Change the configuration, and then click Finish.

Check task logs in SMIS

To view all the task logs, click Tailoring > Integration Manager, and then click Log.

For training, testing, tuning, and index operations, check the log for the SMIDOL* instance to
identify the corresponding task.

For image operation, you have to check all the SMIDOLOCR* instances to identify the
corresponding task.


Tip

     Besides the task log, the program executed by SMIS prints log to sm.log by
     default. You can define another file to print all SMIS logs by specifying the log
     file directory in the SMIS instance.
     By default, if SMIS fails to execute a task after five retries, the task is set as
     expired and will never be triggered automatically. However, you can retry the
     task manually.
     If a SMIS instance is always running and obviously no background process of
     this instance is running, this instance may be dead due to some exception that
     can't be caught. In this case, you can't disable or delete the instance from the
     SMIS configuration page. The workaround is to kill the corresponding SMIS
     process from the Service Manager System Status page.
````
