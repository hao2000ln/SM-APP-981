---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1 .. 1.1.4
printed_pages: 1-20
---

# 1 Administer

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1. Administer

This section provides information on how to administer Service Manager.
Configuring installation and setup options
System configuration parameters
Smart Analytics administration
Mobile Applications administration
Service Manager maintenance tasks
Application setup
Database administration
System security
Server performance tuning
Scheduled maintenance
Status and notifications
Delta Migration Tool
Calendar administration
Time Period management


1.1. Configuring installation and setup
options

Service Manager system installation and setup includes a number of implementation
options you can configure after installation. The following table lists the options you
can enable or configure from a new development environment installation.


Feature                                 Description                 Default state in new
                                                                    installations

Computer Telephony                      An integration option       Disabled
Integration (CTI) with the              allowing Web clients to
Web client                              access telephony
                                        software

Encryption of                           A security option that      Disabled
configuration file                      protects values listed in
settings                                the configuration file

Encryption of operator                  A security option that      Enabled
passwords
                                        protects the passwords

                                        listed in operator records

Event Services                          A group of applications     Disabled
                                        that allow Service
                                        Manager to send data to
                                        and to receive data from
                                        external systems

Lightweight Directory                   An integration option that  Disabled
Access Protocol (LDAP)                  allows Service Manager
                                        to access data stored in
                                        external directory
                                        services

Horizontal scaling                      An implementation           Disabled
implementation                          option that uses servlet
                                        implementation features
                                        to manage Service
                                        Manager instances
                                        running on multiple hosts

Servlet implementation                  An implementation           Enabled
Single servlet                          option where a single
implementation                          servlet container
                                        process manages all
                                        client connections


Feature                                 Description                 Default state in new
                                                                    installations

Requirements for a                      A vertical scaling          Disabled
vertical scaling and                    implementation option
required SSL                            running in combination
implementation                          with the "Required SSL"
                                        security option where
                                        two or more servlet
                                        container processes
                                        manage all client
                                        connections on a single
                                        host

External Web Services                   An integration option that  Enabled
                                        allows Service Manager
                                        to send data to and to
                                        receive data from
                                        external Web Services

Web Services                            An integration option that  Disabled
                                        allows Web Services
                                        clients to access Service
                                        Manager applications

Related topics

Servlet implementation
Server implementation options
Upgrade Service Manager


1.1.1. AutoPass licensing

All Service Manager installations include a bundled version of AutoPass that no longer
requires a separate installation of the AutoPass software. AutoPass is a license
retrieval method offered by the company. The bundled version of AutoPass is
specifically for verifying the Service Manager license and as such requires you to
place the LicFile.txt file in your server's RUN folder. For information about
AutoPass settings and options, see Generate and install your Service Manager
licenses in Install the Service Manager Server.


1.1.2. JRE support

Service Manager supports Open Java Development Kit (OpenJDK) for all
SM components that require a JRE or JDK to work.

            Important

           Out-of-box, an OpenJDK JRE is bundled with the Windows Server, Linux
           Server, and Windows Client so that you don't have to manually install a
           JRE for them. However, if the bundled JRE has a vulnerability over time,
           we recommend you download the latest version of the supported JRE and
           replace the bundled one. For the other components, you need to manually
           install either an OpenJDK JRE or Oracle JRE.

You have the option to use either Oracle JRE or OpenJDK JRE with Service Manager.
For the supported versions of Oracle JRE and OpenJDK JRE, see the Support matrix.

JRE bitness

For the Server (both Windows and Linux) and Windows Client: use 64-bit JRE.

For the rest of the components: use a JRE with the same bitness as the operating
system.

How to use Oracle JRE or OpenJDK JRE with Service
Manager

Component                                                                                       Service Manager 9.81
Windows Server
                                        Instructions
Windows Client
                                        An OpenJDK jre folder is already
                                        bundled with this component. You can
                                        follow these steps to replace the
                                        bundled JRE with the latest version.

                                           1. Rename the <SM Server
                                             installation path>\RUN\jre folder
                                             to create a backup copy.

                                           2. Download the latest version of
                                             64-bit JRE 17.

                                           3. Copy the jre folder to the SM
                                             Server's RUN folder.

                                        An OpenJDK jre folder is already
                                        bundled with this component. You can
                                        follow these steps to replace the
                                        bundled JRE with the latest version.

                                           1. Rename the <Service Manager
                                             installation path>\Client\jre folder
                                             to create a backup copy.

                                           2. Download an appropriate version
                                             of 64-bit JRE 17.

                                           3. Copy the jre folder to the
                                             <Service Manager installation
                                             path>\Client folder.

Component                                                                                       Service Manager 9.81
Linux Server
                                        Instructions

                                        An OpenJDK jre folder is already
                                        bundled with this component. You can
                                        follow these steps to replace the
                                        bundled JRE with the latest version.

                                           1. Rename the <SM Server
                                             installation path>\RUN\jre folder
                                             to create a backup copy

                                           2. Download an appropriate version
                                             of 64-bit JRE 17.

                                           3. Copy the jre folder to the SM
                                             Server's RUN folder.

                                           4. From the Server's RUN directory,
                                             run the following commands as
                                             the owner of the Service Manager
                                             installation directory. This will
                                             create a symbolic link for the new
                                             JRE.
                                                   removeLinks.sh jre
                                                   setupLinks.sh jre


 Component                              Instructions
 Web tier
 Mobility Client                                 Note

Related topics                                  If the web tier or Mobility
                                                Client is deployed on
Deployment architecture                         WebSphere, you must use
                                                IBM JDK instead.

                                        1. Download and install an
                                          appropriate version of JRE
                                          17 according to the operating
                                          system bitness of the Tomcat
                                          host.

                                        2. Update the JAVA_HOME variable
                                          on the Tomcat host to make it
                                          point to the new JRE.


1.1.3. Hardware load balancers

Horizontal or vertical scaling implementations can now use a supported third-party
hardware load balancer in place of a Service Manager load balancer process.
Hardware load balancers can offer the following advantages over a Service Manager
load balancer process:

     Offer a variety of load balancing algorithms
     Offer SSL acceleration or offloading capabilities
     Offer error detection and correction functionality
     Increase system resources available on a Service Manager host by removing a
     load balancer process
     Reduce the number communications ports required between Service Manager
     clients and servers
     Offers option to run Service Manager from a private network with the hardware
     load balancer acting as a network gateway

            Note

           F5 hardware load balancer is the certified load balancer for Service
           Manager. For other types of hardware load balancers, you may
           apply the transparent technology.

            Note

           Some customers may choose to omit the web server component in their
           implementations and the exact reasons for choosing such a configuration
           vary. While this is a viable configuration, it's advisable to implement the
           SM web tier product in a standard web server with Java application server
           configuration. In other words, you should use a combination of products,
           such as an Apache HTTP Server and Apache Tomcat to host the SM web
           tier. This is particularly important when there is a requirement to
           implement SSO or TSO functionality in your environment.

Related topics

Servlet implementation options
Horizontal scaling implementation
Configuring a horizontal scaling environment


1.1.4. Configure an F5 hardware load
balancer

The following topics describe how to configure an F5 HWLB to work with Service
Manager.
Configure an HWLB to accept client requests in HTTP mode
Configure an HWLB for SSL offloading
Configure an HWLB for SSL between an F5 HWLB and a Service Manager server
Configure an HWLB Health Monitor for the Service Manager server


1.1.4.1. Configure an HWLB to accept
client requests in HTTP mode

This topic applies to Windows clients and to Service Manager web tier clients.

Prerequisites

Before you begin this process, verify that the following conditions are true:

     The F5 management URL can be accessed through the management IP.
     A VLAN is created on the interfaces.
     Static IPs are available for the interfaces.

Step 1: Configure Secure Network Address
Translation (SNAT)

If the server and client are located in the same local network, SNAT is required. To
determine whether you must configure SNAT, please consult your Network
Engineering team.

To configure SNAT, follow these steps:

   1. Click Local Traffic > SNATs > SNAT Pool List.
   2. Type TEST_SNAT in the Name field, type the IP address of the Virtual Server IP

     in the IP Address field, and then click Add.
   3. Click Finished.

Step 2: Configure an iRule to enable session
persistence

Configure an iRule to enable session persistence for HTTP requests, based on the
JSESSIONID cookie that the Service Manager server provides. To do this, follow these
steps:

   1. Click Local Traffic > Virtual Servers > iRules > iRule List.
   2. Click Create, and then type TEST_JSESSION_IRULE in the Name field.
   3. If OneConnect transformations are enabled in the default HTTP profile, create an

     HTTP profile to disable the OneConnect transformations. To do this, Click Local
     Traffic > Profiles > Services > HTTP.
   4. Copy the following text into the Definition area:
      when HTTP_REQUEST { if {[HTTP::cookie "JSESSIONID"] ne ""}{ persist uie


     [string tolower [HTTP::cookie "JSESSIONID"]] 300 } else { set jsess [findstr
     [string tolower [HTTP::path]] "jsessionid=" 11 ";"] if { $jsess != "" } { persist uie
     $jsess 300 } } }when HTTP_RESPONSE { if {[HTTP::cookie "JSESSIONID"] ne ""}
     { persist add uie [string tolower [HTTP::cookie "JSESSIONID"]] 300 } }
   5. Click Finished.

Step 3: Disable OneConnect transformations

If OneConnect transformations are enabled in the default HTTP profile, you must
create a new HTTP profile. To do this, follow these steps:

   1. Click Local Traffic > Virtual Servers > Profiles > Services > HTTP.

   2. Click Create, and then type the TEST_HTTP in the Name field.

   3. Click the Custom checkbox.
   4. Disable the OneConnect Transformations, and then click Finish.

                   Note

                Only complete step 4 (above) on HWLB configurations that use
                HTTP mode to connect to a web service.

Step 4: Create a new TCP-based health monitor

A TCP-based health monitor detects whether the Service Manager process is already
listening to the port. You can also use the interface provided by Service Manager to
check the RTE servlet status. For more information, see Configure an HWLB Health
Monitor for the Service Manager server.

To create a new TCP-based health monitor, follow these steps:

   1. Click Local Traffic > Monitors.
   2. Click Create, and then type TEST_TCP in the Name field.
   3. Select tcp in the Type field, and then click Finished.

Step 5: Create a node

To create a node, follow these steps:

   1. Click Local Traffic > Nodes > Node List.
   2. Click Create, and then type the SM server host IP address.


            Note

                 There may be many Service Manager nodes (for example, in a
                horizontally-scaled Service Manager system).
                You may add as many nodes as are required by your deployment.

Step 6: Configure a pool member

To configure a pool member, follow these steps:

   1. Click Local Traffic > Nodes > Pool List.
   2. Click Create, and then type TEST_POOL in the Name field.
   3. Select TEST_TCP as the health monitor.
   4. Type your server node and port, click Add, and then click Finished.
   5. On the Members tab, select TEST_POOL in the Pool list. Verify the members,

     and then click Enable.

Step 7: Create a new virtual server

To create a new virtual server, follow these steps:

   1. Click Local Traffic > Virtual Servers > Virtual Server List.
   2. Click Create, and then type TEST_VS in the Name field.
   3. Specify a virtual server IP address and port number.
   4. Select oneconnect as the OneConnect profile.
   5. Select TEST_HTTP as the HTTP Profile option.
   6. Select TEST_SNAT as the SNAT Pools option.
   7. Enable the TEST_JSESSION_IRULE iRule that you created previously.
   8. Select TEST_POOL as the Default Pool option.
   9. Click Finished.


1.1.4.2. Configure an HWLB for SSL
offloading

You must implement the F5 HWLB’s SSL offloading feature to ensure that the load
balancer can correctly inspect HTTPS traffic. This is required in order to maintain
session persistence.

Prerequisites

Before you begin this process, verify that the following conditions are true:

     The HWLB is configured to accept client requests in HTTP Mode. For more
     information about how to do this, see Configure an HWLB to accept client
     requests in HTTP mode.

     The required Service Manager certificates are generated. For more information
     about how to do this, see the following article in the knowledge base:

     https://softwaresupport.softwaregrp.com/km/KM00488034

Configure the virtual server to use the SSL profile
(client)

To configure the virtual server to use the SSL profile for the client, follow these steps:

   1. Click Local Traffic > Virtual Servers > Virtual Server List.
   2. Select the virtual server that you use to load balance client requests to Service

     Manager servlets.
   3. In the SSL Profile (Client) drop-down list, select TEST_SSL_CLIENT, and then

     click Update.

            Note

           You can use the JSession Persistence iRule to maintain session
           persistence.


1.1.4.3. Configure an HWLB for SSL
between an F5 HWLB and a Service
Manager server

Prerequisites

Before you begin this process, verify that the following conditions are true:

     The HWLB is configured for SSL offloading. For more information about how to
     do this, see Configure an HWLB for SSL offloading.
     The required Service Manager certificates are generated. For more information
     about how to do this, see the following article in the knowledge base:

     https://softwaresupport.softwaregrp.com/km/KM00488034

Step 1: Create a pool that contains an HTTPS port

To create a pool that contains an HTTPS port, follow these steps:

   1. Click Pools > Pool list.
   2. Click Create, and then type TEST_SSL_SERVER in the Name field.
   3. Select a health monitor. For more information, see Configure an HWLB Health

     Monitor for the Service Manager server.
   4. In the address field, type the IP address of the Service Manager server, and

     then set the server port to the HTTPS port of the Service Manager server.
   5. Click Add.

            Note

           You can add as many pool list items as your deployment requires.

Step 2: Configure the session persistence type

To configure the session persistence type, follow these steps:

   1. Click Local Traffic > Profiles > Persistence.
   2. Click Create.
   3. In the Name field, type TEST_COOKIE_INSERT.
   4. In the Persistence Type drop-down list, select Cookie.
   5. Click to select the Custom option on the right-hand side.


   6. In the Cookie Method drop-down list, select HTTP Cookie Insert.
   7. Click Finish.

Step 3: Configure the virtual server to use the SSL
profile (Server)

To enable the virtual server to use the server SSL profile, follow these steps:

   1. Click Local Traffic > Virtual Servers > Virtual Server List.
   2. Select the virtual server that you use to load balance client requests to Service

     Manager servlets.
   3. Select oneconnect as the OneConnect profile.
   4. In the SSL Profile (Client) drop-down list, select TEST_SSL_CLIENT.
   5. In the SSL Profile (Server) drop-down list, select TEST_SSL_SERVER.
   6. Set the SNAT Pool to TEST_SNAT, and then click Update.
   7. On the Resource tab, select the default Pool that contains the HTTPS port of the

     Service Manager server.
   8. Set the Default Persistence Profile to TEST_COOKIE_INSERT.


1.1.4.4. Configure an HWLB Health
Monitor for the Service Manager server

The health monitor helps the HWLB to identify whether a Service Manager servlet can
accept a new connection. This prevents the servlet returning errors if the HWLB
directs a request to the servlet when the servlet is at full capacity or when Service
Manager is running in Quiesce mode.

This section describes how to configure and use a health monitor with an F5 HWLB.

Prerequisites

Before you begin this process, verify that the HWLB is configured to accept client
requests in HTTPS mode (if you use an SSL port) or in HTTP mode (if you use a non-
SSL port). For more information about how to do this, see Configure an HWLB to
accept client requests in HTTP mode.

Step 1: Create the health monitor on the F5 HWLB

To create the health monitor on the F5 HWLB, follow these steps:

   1. Click Local Traffic > Monitors > Create.
   2. Type a name for the health monitor, such as TEST_MONITOR.
   3. Select HTTP or HTTPS as the type, depending on the connection type between

     the F5 HWLB and the Service Manager server.
   4. In the Send String field, type:

     GET /mbeanclient-X.XX/Action?getattribute=AcceptNewConnection\r\n
   5. In the Receive String field, type true.
   6. If you use an SSL connection between the F5 HWLB and the Service Manager

     server, select TEST_SSL_SERVER in the Client Certificate and Client Key fields.
   7. Click Finished.

Step 2: Update the pool list

   1. Click Pools > Pool List.
   2. Select the pool that your virtual server uses.
   3. In the Health Monitors section, move TEST_MONITOR from the Available side

     to the Active side.
   4. Click Update.


Step 3: Modify the sm.ini file and restart Service
Manager

   1. Add the following line to the sm.ini file:

          JVMOption999:../../lib/mbeanclient-X.XX.war

   2. Restart the Service Manager servers.

Related topics

Access Service Manager through an F5 HWLB in HTTP mode
Access Service Manager on a Windows client through an F5 HWLB in HTTP mode
Access Service Manager on a web client through an F5 HWLB in HTTP mode
````
