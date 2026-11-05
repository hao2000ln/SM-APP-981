---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.1.6 .. 1.1.6.1
printed_pages: 43-72
---

# 1.1.6 Server implementation options

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.6. Server implementation options

Service Manager supports several different implementation options to manage client
connections to the server. The following is a list of the most common server
implementation options and the features they offer.


Feature             Single servlet                  Vertical scaling  Horizontal
                    implementation                  implementation    scaling
                                                    Yes               implementation
Specify all         Yes                             Yes               Yes
                                                    Yes               Yes
communication                                       No                Yes
                                                    No                Yes
ports used?                                                           Yes
                                                    Yes
Specify             Yes                                               Yes
                                                         Horizontal
connection limit?                                        scaling      Not applicable

Load balances No
client
connections?

Implementation No
uses multiple
hosts?

Allows dynamic No
addition and
removal of hosts
to virtual group?

Allows dynamic No
addition and
removal of servlet
container
processes to
virtual group?

Options available                       Vertical
to convert current                      scaling
implementation                          Horizontal
into new one                            scaling

Related topics


Configuring installation and setup options
Horizontal scaling implementation
Single servlet implementation
Vertical scaling implementation
Vertical scaling and required SSL implementation


1.1.6.1. Horizontal scaling implementation

In a horizontal scaling implementation you maximize the number of client connections
supported across multiple hosts.

The key features of this implementation are:

     The Service Manager system consists of multiple Service Manager servlet
     container processes running on separate physical hosts
     The implementation allows administrators to specify a system connection limit
     The Service Manager system can manage a number of concurrent client
     connections up to the number of servlet container processes times the threads
     per process value (For example, 6 servlet container processes supporting 50
     threads per process can support up to 300 client connections)
     The implementation allows administrators to specify the communication ports
     the system uses
     A dedicated load balancer process manages and routes client connections to
     available servlet container processes
     Administrators can dynamically add and remove Service Manager instances
     from a virtual group

            Note

           Service Manager doesn't support automatic switching between two hosts.

A horizontal scaling implementation is typically used in large 24 by 7 environments
where system scalability and resilience is a concern. A horizontal scaling
implementation can support as many client connections as the sum of the individual
Service Manager instances can support (for example, if each instance can support 50
client connections and there are 6 instances then the total system can support 300
client connections). A horizontal scaling implementation has improved resilience
features such as the ability to stop and start the load balancer process without
causing a total system outage and the ability to add a new servlet container process
to a virtual group while the system is running.

Each host in a horizontal scaling implementation can also support a vertical scaling
implementation with the addition of the appropriate servlet implementation
parameters. This allows each Service Manager host to support multiple servlet
container processes and to make the best use of the available system resources.


Note: There can be only one kmupdate process running at any time regardless of the
number of hosts. Starting more than one kmupdate process causes unpredictable
behavior on the search engine server.

Horizontal scaling implementation diagram

The horizontal scaling implementation diagram is a reference diagram for
implementers who are responsible for installing and configuring Service Manager.
The guide shows the configuration settings and network connections required for
multiple servers running multiple servlet containers implementation.

Related topics

Example: Setting up a horizontal scaling implementation
Server implementation options
Startup options for servlet container processes
Configuring a horizontal scaling environment


1.1.6.1.1. Example: Setting up a horizontal
scaling implementation

The following example describes how to set up a horizontal scaling implementation
that accomplishes the following:

     Maximizes the number of client connections supported across multiple hosts
     Allows an administrator to specify the communications ports the Service
     Manager implementation uses

You can use this example to configure the implementation depicted in the
horizontal scaling implementation diagram.

   1. Install Service Manager on the first host in the virtual group. For example,
     myserver1.
     The host must be on the same subnet as the other hosts in the virtual group.

   2. Sign in to the Software Licenses and Downloads and obtain a license file for this
     host.

                   Note

                After you obtain a license file for this host, it becomes the primary
                host of the horizontal scaling implementation. You must start this
                host first when starting a horizontal scaling implementation for the
                first time.

   3. Copy the license file you obtain onto a network share accessible to the other
     servers that will make up the horizontal scaling implementation.

   4. Sign in to the operating system of the primary host and change directories to the
     Service Manager Server's RUN folder.

   5. Paste the license file (LicFile.txt) into the RUN folder.
   6. In the RUN folder, open the Service Manager configuration file (sm.cfg) in a text

     editor.

   7. Edit the file so that only the following lines appear:


        sm -loadBalancer -httpPort:13080

        sm -httpPort:13081 -httpsPort:13082

        sm -httpPort:13083 -httpsPort:13084

        sm system.start

    The loadBalancer parameter creates a special servlet container process to route
    client connection requests to other available servlet container processes. A
    horizontal scaling implementation only needs one load balancer.

    The httpPort:13080 parameter specifies that the load balancer process listens to
    client connection requests on HTTP port 13080. This communications port must
    be unique across all hosts that you want to join the Service Manager virtual
    group.

    The httpPort:13081 parameter specifies that the servlet container process listens
    to client connection requests on HTTP port 13081. This communications port
    must be unique on the host on which you start the servlet container.

    The httpsPort:13082 parameter specifies that the servlet container process
    listens to client connection requests on HTTPS port 13082. This communications
    port must be unique on the host on which you start the servlet container.

    The httpPort:13083 parameter specifies that the servlet container process
    listens to client connection requests on HTTP port 13083. This communications
    port must be unique on the host on which you start the servlet container.

    The httpsPort:13084 parameter specifies that the servlet container process
    listens to client connection requests on HTTPS port 13084. This communications
    port must be unique on the host on which you start the servlet container.

    The system.start parameter specifies that the host system should start all the
    background processes in the system.start script file. This host will be the only
    host in the virtual group that runs the background processes. The configuration
    file should already list this line.

 8. Save the Service Manager configuration file.
 9. Open the Service Manager initialization file (sm.ini) in a text editor.

10. Add the RDBMS connection settings. For example:


        [oracle10]
        sqldb:ora102
        sqllogin:sm7user/password
        sqllibrary:SQORACLE.OCI10.DLL
        sqldictionary:oracle10

11. Add the following lines:

        grouplicenseip:10.0.0.135
        groupname:mygroup1
        groupmcastaddress:224.0.1.255
        groupsubnetaddress:255.255.255.0
        groupport:13100
        threadsperprocess:50
        sessiontimeout:3
        system:13080

                 Note

               This example assumes the host system has only one network
               adapter card and therefore doesn't need the groupbindaddress
               parameter. If your host has multiple network adapter cards, you must
               add the groupbindaddress parameter to specify which network
               adapter the virtual group will use for communications.

    The grouplicenseip:10.0.0.135 parameter defines the TCP/IP address of the
    Service Manager host with a valid AutoPass license for the virtual group. The
    value of this parameter must match the IP address specified in the AutoPass
    license.
    The groupname:mygroup1 parameter creates a virtual group that servlet
    container processes across multiple systems can join for horizontal scaling
    purposes. The value is arbitrary and can be any text value without spaces.
    The groupmcastaddress:244.0.1.255 parameter defines the TCP/IP address that
    servlet container processes can use to communicate with the load balancer
    process. The TCP/IP address must be consistent with the UDP multicasting
    protocol.


The groupsubnetaddress:255.255.255.0 parameter defines the subnet mask that
servlet container processes can use to communicate with the load balancer
process. The subnet mask must be consistent with the IPv4 protocol.

            Note

           You only have to define the subnet address if you are using subnet
           masking on your IP addresses.

    The groupport:13100 parameter defines the communications port that servlet
    container processes can use to communicate with the load balancer process.
    The communications port can be any available communications port.

    The threadsperprocess:50 parameter defines the number of threads each
    process supports. A value of 50 threads assumes that the Service Manager host
    has the minimum recommended system memory available for servlet container
    processes.

    The sessiontimeout:3 parameter defines the number of minutes that the client
    connection can remain unresponsive before the server closes the connection. A
    value of 3 minutes assumes that most network latency issues are quickly and
    easily resolved.

    The system:13080 parameter defines a numerical identifier for the system, in
    this case the HTTP port of the load balancer process. The value of this
    parameter must match for each system in the virtual group.

12. Save the Service Manager initialization file.

13. If the host runs on a Linux operating system and uses an SSL implementation,
    edit the /etc/hosts file to list the fully qualified domain name of each host in the
    virtual group. For example:

        127.0.0.1 localhost
        127.0.0.2 myserver2.mydomain.com myserver2 loghost
        127.0.0.3 myserver3.mydomain.com myserver3 loghost

    Caution: Do not edit the /etc/hosts file unless your system is running an SSL
    implementation.

14. Start the Service Manager server.
15. Install Service Manager on the next host in the virtual group. For example:

    myserver2.


    The host must be on the same subnet as the other hosts in the virtual group.
16. Sign in to the operating system of the Service Manager server host and change

    directories to the Service Manager Server's RUN folder.
17. Open the Service Manager configuration file (sm.cfg or smstart) in a text editor.
18. Edit the file so that only the following lines appear:

        sm -httpPort:13081 -httpsPort:13082
        sm -httpPort:13083 -httpsPort:13084
        sm -sync

                 Note

               You don't need the system.start line on this host as only one host in
               the virtual group needs to run the background processes.

    The httpPort:13081 parameter specifies that the servlet container process listens
    to client connection requests on HTTP port 13081. This communications port
    must be unique on the host on which you start the servlet container.
    The httpsPort:13082 parameter specifies that the servlet container process
    listens to client connection requests on HTTPS port 13082. This communications
    port must be unique on the host on which you start the servlet container.
    The httpPort:13083 parameter specifies that the servlet container process
    listens to client connection requests on HTTP port 13083. This communications
    port must be unique on the host on which you start the servlet container.
    The httpsPort:13084 parameter specifies that the servlet container process
    listens to client connection requests on HTTPS port 13084. This communications
    port must be unique on the host on which you start the servlet container.
    The sync parameter specifies that the host system should start the sync
    background process to identify and remove unused processes.
19. Save the Service Manager configuration file.
20. Open the Service Manager initialization file (sm.ini) in a text editor.
21. Add the RDBMS connection settings. For example:


        [oracle10]
        sqldb:ora102
        sqllogin:sm7user/password
        sqllibrary:SQORACLE.OCI10.DLL
        sqldictionary:oracle10

22. Add the following lines:

        grouplicenseip:10.0.0.135
        groupname:mygroup1
        groupmcastaddress:224.0.1.255
        groupsubnetaddress:255.255.255.0
        groupport:13100
        threadsperprocess:50
        sessiontimeout:3
        system:13080

                 Note

               This example assumes the host system has only one network
               adapter card and therefore doesn't need the groupbindaddress
               parameter. If your host has multiple network adapter cards, you must
               add the groupbindaddress parameter to specify which network
               adapter the virtual group will use for communications.

    The grouplicenseip:10.0.0.135 parameter defines the TCP/IP address of the
    Service Manager host with a valid AutoPass license for the virtual group. The
    value of this parameter must match the IP address specified in the AutoPass
    license.
    The groupname:mygroup1 parameter creates a virtual group that servlet
    container processes across multiple systems can join for horizontal scaling
    purposes. The value is arbitrary and can be any text value without spaces.
    The groupmcastaddress:244.0.1.255 parameter defines the TCP/IP address that
    servlet container processes can use to communicate with the load balancer
    process. The TCP/IP address must be consistent with the UDP multicasting
    protocol.


    The groupsubnetaddress:255.255.255.0 parameter defines the subnet mask that
    servlet container processes can use to communicate with the load balancer
    process. The subnet mask must be consistent with the IPv4 protocol.

                 Note

               You only have to define the subnet address if you are using subnet
               masking on your IP addresses.

    The groupport:13100 parameter defines the communications port that servlet
    container processes can use to communicate with the load balancer process.
    The TCP/IP address can be any available communications port.

    The threadsperprocess:50 parameter defines the number of threads each
    process supports. A value of 50 threads assumes that the Service Manager host
    has the minimum recommended system memory available for servlet container
    processes.

    The sessiontimeout:3 parameter defines the number of minutes that the client
    connection can remain unresponsive before the server closes the connection. A
    value of 3 minutes assumes that most network latency issues are quickly and
    easily resolved.

    The system:13080 parameter defines a numerical identifier for the system, in
    this case the HTTP port of the load balancer process. The value of this
    parameter must match for each system in the virtual group.

23. Save the Service Manager initialization file.
24. If the host runs on a Linux operating system and uses an SSL implementation,

    edit the /etc/hosts file to list the fully qualified domain name of each host in the
    virtual group. For example:

        127.0.0.1 localhost
        127.0.0.2 myserver2.mydomain.com myserver2 loghost
        127.0.0.3 myserver3.mydomain.com myserver3 loghost

                 Caution

               Do not edit the /etc/hosts file unless your system is running an SSL
               implementation.


25. Sign in to the operating system of the Service Manager server host and copy the
    primary host's license file (LicFile.txt) from the network share.

26. Change directories to this Service Manager Server's RUN folder.
27. Paste the primary host's license file into this server's RUN folder.
28. Start the Service Manager server.

                 Note

               The primary host must be running in order for this host to validate
               the license file and start up.

29. Install Service Manager on the next host in the virtual group. For example:
    myserver3.
    The host must be on the same subnet as the other hosts in the virtual group.

30. Sign in to the operating system of the Service Manager server host and change
    directories to the Service Manager RUN folder. For example:

        C:\Program Files\OpenText\Service Manager 9.xx\Server\RUN

31. Open the Service Manager configuration file (sm.cfg or smstart) in a text editor.
32. Edit the file so that only the following lines appear:

        sm -httpPort:13081 -httpsPort:13082
        sm -httpPort:13083 -httpsPort:13084
        sm -sync

                 Note

               You don't need the system.start line on this host as only one host in
               the virtual group needs to run the background processes.

    The httpPort:13081 parameter specifies that the servlet container process listens
    to client connection requests on HTTP port 13081. This communications port
    must be unique on the host on which you start the servlet container.
    The httpsPort:13082 parameter specifies that the servlet container process
    listens to client connection requests on HTTPS port 13082. This communications
    port must be unique on the host on which you start the servlet container.


    The httpPort:13083 parameter specifies that the servlet container process
    listens to client connection requests on HTTP port 13083. This communications
    port must be unique on the host on which you start the servlet container.
    The httpsPort:13084 parameter specifies that the servlet container process
    listens to client connection requests on HTTPS port 13084. This communications
    port must be unique on the host on which you start the servlet container.
    The sync parameter specifies that the host system should start the sync
    background process to identify and remove unused processes.
33. Save the Service Manager configuration file.
34. Open the Service Manager initialization file (sm.ini) in a text editor.
35. Add the RDBMS connection settings. For example:

        [oracle10]
        sqldb:ora102
        sqllogin:sm7user/password
        sqllibrary:SQORACLE.OCI10.DLL
        sqldictionary:oracle10

36. Add the following lines:

        grouplicenseip:10.0.0.135
        groupname:mygroup1
        groupmcastaddress:224.0.1.255
        groupsubnetaddress:255.255.255.0
        groupport:13100
        threadsperprocess:50
        sessiontimeout:3
        system:13080

                 Note

               This example assumes the host system has only one network
               adapter card and therefore doesn't need the groupbindaddress
               parameter. If your host has multiple network adapter cards, you must
               add the groupbindaddress parameter to specify which network
               adapter the virtual group will use for communications.


    The grouplicenseip:10.0.0.135 parameter defines the TCP/IP address of the
    Service Manager host with a valid AutoPass license for the virtual group. The
    value of this parameter must match the IP address specified in the AutoPass
    license.

    The groupname:mygroup1 parameter creates a virtual group that servlet
    container processes across multiple systems can join for horizontal scaling
    purposes. The value is arbitrary and can be any text value without spaces.

    The groupmcastaddress:244.0.1.255 parameter defines the TCP/IP address that
    servlet container processes can use to communicate with the load balancer
    process. The TCP/IP address must be consistent with the UDP multicasting
    protocol.

    The groupsubnetaddress:255.255.255.0 parameter defines the subnet mask that
    servlet container processes can use to communicate with the load balancer
    process. The subnet mask must be consistent with the IPv4 protocol.

                 Note

               You only have to define the subnet address if you are using subnet
               masking on your IP addresses.

    The groupport:13100 parameter defines the communications port that servlet
    container processes can use to communicate with the load balancer process.
    The TCP/IP address can be any available communications port.

    The threadsperprocess:50 parameter defines the number of threads each
    process supports. A value of 50 threads assumes that the Service Manager host
    has the minimum recommended system memory available for servlet container
    processes.

    The sessiontimeout:3 parameter defines the number of minutes that the client
    connection can remain unresponsive before the server closes the connection. A
    value of 3 minutes assumes that most network latency issues are quickly and
    easily resolved.

    The system:13080 parameter defines a numerical identifier for the system, in
    this case the HTTP port of the load balancer process. The value of this
    parameter must match for each system in the virtual group.

37. Save the Service Manager initialization file.


38. If the host runs on a Linux operating system and uses an SSL implementation,
    edit the /etc/hosts file to list the fully qualified domain name of each host in the
    virtual group. For example:

        127.0.0.1 localhost
        127.0.0.2 myserver2.mydomain.com myserver2 loghost
        127.0.0.3 myserver3.mydomain.com myserver3 loghost

    Caution: Do not edit the /etc/hosts file unless your system is running an SSL
    implementation.
39. Sign in to the operating system of the Service Manager server host and copy the
    primary host's license file (LicFile.txt) from the network share.
40. Change directories to this Service Manager Server's RUN folder.
41. Paste the primary host's license file into this server's RUN folder.
42. Start the Service Manager server.
    Note: The primary host must be running in order for this host to validate the
    license file and start up.
43. Sign in to the operating system of the Service Manager Web tier host and
    change directories to the Service Manager WEB-INF folder. For example:

        C:\<Tomcat>\webapps\sm\WEB-INF

44. Open the Web configuration file (web.xml) in a text editor.
45. Set the following parameter values:

Parameter                               Default value                      Service Manager 9.81
secureLogin                             true
                                                       Description
sslPort                                 8443
serverHost                              localhost      Controls the encryption
serverPort                              13080          of network
                                                       communication
                                                       between the web
                                                       application server and
                                                       the web browser. Set it
                                                       to false if you don't use
                                                       Secure Sockets Layer
                                                       (SSL) connections to
                                                       the web server.

                                                       Note: To use secure
                                                       login, you must enable
                                                       SSL on your web
                                                       application server. For
                                                       details, refer to your
                                                       web application server
                                                       documentation.

                                                       This parameter is
                                                       needed only when
                                                       secureLogin is set to
                                                       true. Set it to the SSL
                                                       port of the web
                                                       application server.

                                                       Specifies the name of
                                                       the Service Manager
                                                       host server.

                                                       Specifies the
                                                       communications port
                                                       number to which the
                                                       Service Manager
                                                       server listens.


        ...
        <context-param>
        <param-name>secureLogin</param-name>
        <param-value>true</param-value>
        </context-param>
        <context-param>
        <param-name>sslPort</param-name>
        <param-value>8443</param-value>
        </context-param>
        ...
        <param-name>serverHost</param-name>
        <param-value>myserver1</param-value>
        </init-param>
        <init-param>
        <param-name>serverPort</param-name>
        <param-value>13080</param-value>
        </init-param>

46. Save the Web configuration file.
47. Start the Service Manager Web tier.
48. Open Service Manager Windows clients and set the Service Manager host name

    and communication port values:

Field                                         Value
Server host name                              myserver1
Server port number                            13080

 49. Connect to the Service Manager host.

Related topics

Horizontal scaling implementation
Server implementation options
Servlet implementation
Servlet implementation options
Configuring a horizontal scaling environment
Webware software licensing center



1.1.6.1.2. Configuring a horizontal scaling
environment

This configuration is intended for customers who:

     Want to maximize the number of client connections supported across multiple
     hosts
     Have multiple hosts available to manage all concurrent client connections

Terminology

     Group: A group of Service Manager server processes running on one or more
     hosts and connecting to one database to serve Service Manager server
     processes within a group.
     Node: A Service Manager server process within a group.
     Primary host: The host in the Service Manager horizontal scaling group whose
     IP is bound to the Service Manager AutoPass license.
     Secondary host: The host in the Service Manager horizontal scaling group
     whose IP is not bound to the Service Manager AutoPass license. The Service
     Manager processes on this host depend on running Service Manager processes
     on the primary host to validate the Service Manager AutoPass license.
     Service Manager servlet process: A Service Manager server process that
     embeds the Tomcat application server and serves Service Manager Windows
     clients and Web clients, as well as Web Services requests. It is also generally
     referred to as a Service Manager process.
     Service Manager background process: Background processes that wake up
     periodically to execute a particular RAD application, or Service Manager runtime
     environment routine. For example: sm -sync .
     Service Manager transient process: A Service Manager server process that
     executes a RAD application or Service Manager runtime environment routine
     only once, not periodically. For example: sm -reportlbstatus .

Number of Service Manager hosts required

This configuration can be set up on one or more hosts.

Commands required in sm.cfg on primary host

You must set the following configuration commands.


  sm -loadBalancer -httpPort:<value>
  sm -httpPort:<value> -httpsPort:<value>
  sm system.start

Commands required in sm.cfg on secondary host

  sm -httpPort:<value> -httpsPort:<value>

  sm -sync

      sm -loadBalancer -httpPort:<value> - Is a special Service Manager process
     that redirects client connections requests to other available Service Manager
     processes.
      sm -httpPort:<value> -httpsPort:<value> - Specifies the HTTP or HTTPS
     communications port for one Service Manager process. Each Service Manager
     process by default can host 50 users. You can start as many Service Manager
     processes as you want, as long as your server has enough physical memory and
     resources to start the processes. You can also change the number of users
     hosted on one Service Manager process by setting the
      threadsperprocess parameter.
      sm system.start - Starts one Service Manager process that contains all
     background processes.
      sm -sync - Identifies defunct Service Manager processes on the host and
     frees the shared resources that were allocated for it. The sm -sync process
     needs to start only one per host. Since the sm system.start process includes
     the sm -sync background process, the sm -sync command should not be
     included in the sm.cfg file that has the sm system.start command.

Parameters required in sm.ini

You must set the following initialization parameters.

  system:<value>

  grouplicenseip:<value>

  groupname:<value>

  groupmcastaddress:<value>

  groupport:<value>

      system - Defines a unique numerical ID for the system. The value of this
     parameter must be identical in the sm.ini files for each host in the horizontal


     scaling group.
      grouplicenseip - The value should be the primary host IP.
      groupname - Creates a group name as the horizontal scaling group identifier
     that the Service Manager processes use to identify the group. The value of this
     parameter is only alphanumeric characters.
      groupmcastaddress - Defines the TCP/IP multicast address that all Service
     Manager processes within the horizontal scaling group use to communicate with
     each other.
      groupport - Defines the communications port that all Service Manager
     processes use to communicate with all other Service Manager processes within
     the horizontal scaling group.
      [RDBMS Settings] - Define the RDBMS connection and authorization
     parameters.

Optional parameters in sm.ini

The following initialization parameters are optional.

  threadsperprocess:<value>

  preferredFQHN:<value>

  groupbindaddress:<value>

      threadsperprocess - Defines the maximum number of concurrent user
     sessions per Service Manager process. Use a value that maximizes the system
     resources of your Service Manager host. The default value for the parameter
      threadsperprocess is 250. For more sizing information using this parameter,
     refer to Service Manager server (servlet container).
      preferredFQHN - Specifies the fully qualified host name you want Service
     Manager clients to use when communicating with the server. Service Manager
     loadBalancer redirects client requests to the target host with the target host's
     preferredFQHN. You only need to set this parameter if your Service Manager
     host is identified by multiple names in the network.
      groupbindaddress - Defines the TCP/IP address of the network adapter you
     want Service Manager processes to use to communicate with other processes in
     a horizontal scaling group. If your Service Manager hosts contain multiple
     network adapters, you must specify the IP address of the network adapter you
     want the horizontal scaling group to use with the groupbindaddress parameter.

Operating system requirements


All hosts in the horizontally-scaled environment must run on the same operating
system version and run at the same patch level. Minimum patch level for each
operating system is specified in the support matrix. See Support Matrices on the
Software Support Online site.

Caution: Running Service Manager in a horizontally-scaled environment and using
different operating systems can corrupt your data. You can also run into problems
when upgrading to the latest patches. Most of the time, Service Manager patches are
released on all operating systems. However, in some cases, patches may be delivered
to a particular operating system. When mixing operating systems, applying patches
will become more complex as you need to test on multiple platforms.

Network requirements

All hosts in the horizontal scaling group must run from the same subnet on the
network in order for the Service Manager processes to communicate with one
another.

Memory requirements

We recommend around 1.5 GB RAM per Service Manager process. This is based on
the expected user load. For example, if you have 10 processes each running with a
50-user load, the minimum required RAM would be 1.5 GB per Service Manager
process, 10x1.5 GB RAM. For information on sizing, see Sizing.

Licensing requirements

Obtain an AutoPass license for one host in your horizontal scaling group. On Windows
platforms, AutoPass installs as part of the server installation. On Linux platforms, you
must install it manually before you can run Service Manager. For more information,
see Install. This host becomes the primary host of the horizontal scaling group and
AutoPass includes this host's IP address in the LicFile.txt file. You must start the
primary host first when starting the horizontal scaling group. Copy the LicFile.txt file
from the primary host's AutoPass directory to the AutoPass directory of each
secondary host in the horizontal scaling group. Each secondary host must have a
copy of the primary host's LicFile.txt file in order to start.

The summary steps are as follows:

   1. List all hosts in your horizontal scaling environment to determine the primary
     server and all secondary servers.

   2. Get a license.


3. Copy the primary server's IP address to get the license and save it as the
  primary server's LicFile.txt file.

4. Copy the primary server's LicFile.txt file on all secondary servers. The default
  directory for this file is as follows:

          <Service Manager server installation path>/RUN/LicFile.txt

   5. Add the following parameter in the sm.ini file:
      grouplicenseip:Primary_Servers_IpAddress

To start the horizontal scaling group

   1. Start the Service Manager server on the primary server.
     Note: The primary server must be started prior to starting any of the secondary
     servers.

   2. Start the Service Manager server on the secondary servers, in no particular
     order.

To establish the horizontal scaling group, the first node of the group should be started
on the primary host. When the group is established on the primary host, Service
Manager server processes on secondary hosts can start to join the group. Once the
whole group is established, the primary host can be brought down for maintenance,
and then rejoin the rest of the running group when it is restarted. As long as there is a
member Service Manager server process running in the group, Service Manager
server processes on another secondary host with the same grouplicenseip:<primary
host IP> can join the group. The primary host is not required to be running. Another
secondary host can be started, even if the primary host is down for any reason.
However, when the group is down (for example, there are no nodes running in the
group), then the group has to be reestablished from the primary host first.

Other requirements

Install the applicable database client software on each host of the horizontal scaling
group so that they can access the Service Manager RDBMS. See your RDBMS vendor
documentation for instructions.

Related topics

Servlet implementation
Parameter: httpPort
Parameter: httpsPort
Parameter: loadBalancer


Parameter: grouplicenseip
Parameter: groupbindaddress
Parameter: groupmcastaddress
Parameter: groupname
Parameter: groupport
Install


1.1.6.1.3. Configuring SSL and LW-SSO in a
horizontal scaling environment

In a horizontally scaled environment, you use the Service Manager software load
balancer in front of a virtual group to redirect client requests among the server nodes
in the group. The load balancer server is called the primary server, while the other
servers in the group are called secondary servers.

Important Requirements

     On a horizontally scaled system, it is very important that all certificates are
     created from the same machine. Ensure to not copy any files to their target
     directories until all certificates for all server machines (the primary server and
     secondary server machines) in the horizontally scaled environment are created.
     For each server host (primary or secondary), you need a unique server
     certificate.
     For each Windows client machine you need a unique client certificate.
     For each Service Manager Web application server host you need a unique client
     certificate.

Best Practice recommendation

When generating each Windows or web client certificate, prefix the keystore,
certificate request and certificate names with the FQDN name of the client machine to
make them unique and easy to distinguish.

If a Windows client and the Web application server are on the same physical machine,
it is possible to use the same cacerts and clientcerts files for both, rather than
creating two sets of nearly identical keystores. In such a case, copy the files created
for the Windows or Web client – whichever was created first– into either the <Service
Manager Client>/plugins/com.hp.ov.sm.client.common_x.xx directory or the Service
Manager/WEB-INF folder of the Web application server.

To configure SSL in a horizontal scaling implementation:

   1. Create a private key and public certificate for your private certificate authority.

   2. Update the Java cacerts file by importing your private certificate authority's
     certificate into it. The updated cacerts file will contain the certificate and private
     key of the certificate authority that signs each server/client certificate.

   3. Create a separate signed server keystore for each server machine.


  Note: In a later step, you will add each server keystore and the updated Java
  cacerts file to each server's sm.ini file as the following parameters: keystoreFile,
  and truststoreFile.

4. Create a separate signed client certificate for each Service Manager client (web
  application server or Windows client) machine and import each client certificate
  into a trusted clients keystore.

  Note: In a later step, you will add the trusted clients keystore as the following
  parameter in each server's sm.ini file: ssl_trustedClientsJKS.

5. Copy the following keystore files to each server's RUN folder:

        The server's server keystore file (unique)
        The trusted clients keystore file (same for all servers)
        The updated Java cacerts file (same for all servers and clients)

6. Copy the following keystore files to each web tier's WEB-INF folder:

        The updated Java cacerts file

        <clientcerts>.keystore – This keystore contains the signed certificate of
        your Service Manager web tier client.

7. Copy the following keystore files to each Windows client's <Windows client
  installation path>\plugins\com.hp.ov.sm.client.common_x.xx folder.

        The updated Java cacerts file

        <clientcerts>.keystore – This keystore contains the signed certificate of
        each Windows client.

8. Add the following SSL configuration lines to the sm.ini file for each of the
  primary server and secondary servers, and restart each server.

  Note: For all servers, the truststoreFile and ssl_trustedClientsJKS settings should
  be the same; however, each server should use its own server keystore
  (keystoreFile:<servercert.keystore>).


      ssl:1
      ssl_reqClientAuth:2
      sslConnector:1
      ssl_trustedClientsJKS:<trustedclients.keystore>
      ssl_trustedClientsPwd:<ClientKeyPassword>
      truststoreFile:cacerts
      truststorePass:changeit
      keystoreFile:<servercert.keystore>
      keystorePass:changeit

9. Configure each Service Manager web client to validate each server's signed
  certificate and present the signed client certificate.
     1. Stop the web application server running the web tier, open the web
        configuration file (web.xml) in a text editor.
     2. Configure the following parameters as shown below:

             <init-param>
                     <param-name>cacerts</param-name>
                     <param-value>/WEB-INF/cacerts</param-value>

             </init-param>
             <init-param>

                     <param-name>keystore</param-name>
                     <param-value>/WEB-INF/<clientcerts>.keystore</param-
             value>
             </init-param>
             <init-param>
                     <param-name>keystorePassword</param-name>
                     <param-value><<clientcerts>.keystore password>
             </param-value>
             </init-param>

     3. Set the ssl parameter to true.
     4. Set the serverHost and serverPort parameters to the fully-qualified domain

        name and port number of the primary server. For example:
        myprimaryserver.mydomain.com and 13080.
     5. Restart each web application server.


 10. Configure each Windows client to validate each server's signed certificate and
     present the signed client certificate.

        1. Click Window > Preferences > Service Manager > Security.

        2. Set CA Certificates File to the cacerts keystore you copied to the
           <Windows client installation
           path>\plugins\com.hp.ov.sm.client.common_x.xx folder.

        3. Set Keystore File to the keystore containing your Windows client's signed
           certificate, for example <clientcerts>.keystore. You created this keystore
           when you created the Windows client certificate request.

        4. Set Keystore password to the password required to access the Windows
           client keystore. For example, ClientKeyPassword. You created this keystore
           password when you created the Windows client certificate request.

        5. Update your Windows client connections by selecting Use SSL Encryption
           on their Advanced tab.

To set up LW-SSO in a horizontal scaling implementation:

   1. Enable LW-SSO on each server node. All server nodes should share the same
     initString setting. For details, see Configure LW-SSO in the Service Manager
     server.

     Note: Normally, all server nodes are in the same domain, so you can configure
     LW-SSO in one server node and then copy the server's LW-SSO configuration
     file (lwssofmconf.xml) to the rest of the nodes.

   2. If needed, enable LW-SSO in each web tier. For details, see Configure LW-SSO
     in the Service Manager Web tier.

     Note: The server nodes and web tiers should share the same initString setting.

Related topics

Configure two-way SSL
Using LW-SSO with integrations
Configure LW-SSO in the Service Manager Web tier
````
