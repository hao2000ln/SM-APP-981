---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.1.6.2 .. 1.1.6.4
printed_pages: 72-105
---

# 1.1.6.2 Single servlet implementation

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.6.2. Single servlet implementation

In a single servlet implementation you manage all client connections with one
multithreaded process.

The key features of this implementation are:

     The Service Manager system consists of one Service Manager instance running
     on one physical host
     One dedicated servlet container process manages all client connections
     The implementation allows administrators to specify the communication ports
     the system uses
     The implementation allows administrators to specify a system connection limit
     The Service Manager system can manage a number of concurrent client
     connections up to the number of threadsperprocess

A single servlet implementation is a typically used for development environments or
small production environments because it is easy to setup and manage.

You can convert a single servlet implementation into any of the other servlet
implementations with the addition of a load balancer process and one or more
additional servlet container instances.

Single servlet implementation diagram

The Single servlet implementation diagram is a reference diagram for implementers
who are responsible for installing and configuring Service Manager. The guide shows
the configuration settings and network connections required for a single server
running a single servlet container implementation.




Related topics

Example: Setting up a single servlet implementation
Server implementation options
Requirements for a single servlet implementation


1.1.6.2.1. Example: Setting up a single
servlet implementation

The following example describes how to set up a single servlet implementation that
accomplishes the following:

     Manages all client connections with one multithreaded process
     Supports up to 50 concurrent client connections
     Allows an administrator to specify the communications ports the Service
     Manager implementation uses
     Provides a simple configuration to test servlet features

You can use this example to configure the implementation depicted in the Single
servlet implementation diagram.

   1. Install Service Manager on one host. For example, myserver1.
   2. Sign in to the operating system of the Service Manager server host and change

     directories to the Service Manager RUN folder. For example:

          C:\Program Files\OpenText\Service Manager\server\RUN

   3. Open the Service Manager configuration file (sm.cfg or smstart) in a text editor.
   4. Add the following line:

          sm -httpPort:13081 -httpsPort:13082

     The httpPort:13081 parameter specifies that the servlet container process listens
     to client connection requests on HTTP port 13081. This communications port
     must be unique on the host on which you start the servlet container.
     The httpsPort:13082 parameter specifies that the servlet container process
     listens to client connection requests on HTTPS port 13082. This communications
     port must be unique on the host on which you start the servlet container.
   5. Save the Service Manager configuration file.
   6. Open the Service Manager initialization file (sm.ini) in a text editor.
   7. Add the RDBMS connection settings. For example:


        [oracle10]
        sqldb:ora102
        sqllogin:sm7user/password
        sqllibrary:SQORACLE.OCI10.DLL
        sqldictionary:oracle10

 8. Add the following lines:

        threadsperprocess:50
        sessiontimeout:3

    The threadsperprocess:50 parameter defines the number of threads each
    process supports. A value of 50 threads assumes that the Service Manager host
    has the minimum recommended system memory available for servlet container
    processes.
    The sessiontimeout:3 parameter defines the number of minutes that the client
    connection can remain unresponsive before the server closes the connection. A
    value of 3 minutes assumes that most network latency issues are quickly and
    easily resolved.
 9. Save the Service Manager initialization file.
10. Start the Service Manager server.
11. Sign in to the operating system of the Service Manager Web tier host and
    change directories to the Service Manager WEB-INF folder. For example:

        C:\apache-tomcat-<version>\webapps\sm\WEB-INF

12. Open the Web configuration file (web.xml) in a text editor.
13. Set the following parameter values:

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

14. Save the Web configuration file.
15. Start the Service Manager Web tier.
16. Open Service Manager Windows clients and set the Service Manager hostname

    and communication port values:

Field                                   Value
Server host name                        myserver1
Server port number                      13081

 17. Connect to the Service Manager host.

Related topics

Server implementation options
Servlet implementation
Single servlet implementation
Requirements for a single servlet implementation


1.1.6.2.2. Requirements for a single servlet
implementation

This configuration is intended for customers who:

     Want to manage all client connections with one multithreaded process
     Only expect up to 50 concurrent client connections
     Want to specify the communications ports the Service Manager implementation
     uses
     Want a simple configuration to test servlet features

Number of Service Manager hosts required

     This implementation requires the following number of hosts.
     1

Parameters required in sm.cfg

     You must set the following configuration parameters.

          sm -httpPort:<value> - httpsPort:<value>

           httpPort – identify the communications port that a servlet container process
           uses to communicate with clients using HTTP. The servlet container
           communications port must be unique on the host on which you start the
           servlet container.
           httpsPort – identify the communications port that a servlet container
           process uses to communicate with clients using HTTPS. The servlet
           container communications port must be unique on the host on which you
           start the servlet container.

Parameters required in sm.ini

     You must set the following initialization parameters.
           sessiontimeout – define the number of minutes a client connection can
           remain unresponsive before the server closes the connection.
           threadsperprocess – identify the total number of threads the servlet
           container process supports. Use a value of threads that maximizes the
           system resources of your Service Manager host.
           The default value for the parameter threadsperprocess is 250. For more


           sizing information using this parameter, refer to Service Manager server
           (servlet container).

Parameters required in web.xml

     You must set the following Web parameters.
           serverHost – identify the host name of the Service Manager host
           serverPort – identify the communications port on which the Service
           Manager host listens for client connections requests

Windows client preferences required

     You must set the following preferences from the Connection menu.
           Server host name – identify the host name of the Service Manager host
           Server port number – identify the communications port on which the
           Service Manager host listens for client connections requests

Related topics

Servlet implementation
Servlet implementation options
Parameter: httpPort
Parameter: httpsPort


1.1.6.3. Vertical scaling implementation

In a vertical scaling implementation you maximize the number of client connections
supported on a single host.

The key features of this implementation are:

     The Service Manager system consists of several servlet container processes
     running on one physical host
     The implementation allows administrators to specify a system connection limit
     The Service Manager system can manage a number of concurrent client
     connections up to the number of servlet container processes times the
     threadsperprocess value (For example, 6 servlet container processes supporting
     50 threadsperprocess can support up to 300 client connections)
     The implementation allows administrators to specify the communication ports
     the system uses
     A dedicated load balancer process manages and routes client connections to
     available servlet container processes
     Administrators can dynamically add and remove Service Manager instances
     from a virtual group

A vertical scaling implementation is typically used in small to medium environments
where hardware system resources are limited. A vertical scaling implementation can
support as many client connections as the Service Manager host has available system
resources.

You can convert a vertical scaling implementation into a horizontal scaling
implementations with the addition of virtual grouping parameters and one or more
additional servlet container instances installed on separate physical hosts.

Note: There can be only one kmupdate process running at any time regardless of the
number of hosts. Starting more than one kmupdate process causes unpredictable
behavior on the search engine server.

Vertical scaling implementation diagram

The Vertical scaling implementation diagram is a reference diagram for implementers
who are responsible for installing and configuring Service Manager. The guide shows
the configuration settings and network connections required for a single server
running multiple servlet containers implementation.

Related topics


Example: Setting up a vertical scaling implementation
Server implementation options
Startup options for servlet container processes
Configuring a vertical scaling environment


1.1.6.3.1. Example: Setting up a vertical
scaling implementation

The following example describes how to set up a vertical scaling implementation that
accomplishes the following:

     Maximizes the number of client connections supported on a single host
     Allows an administrator to specify the communications ports the Service
     Manager implementation uses

You can use this example to configure the implementation depicted in the Vertical
scaling implementation diagram.

   1. Install Service Manager on one host. For example: myserver1.
   2. Sign in to the operating system of the Service Manager server host and change

     directories to the Service Manager RUN folder. For example:

          C:\Program Files\OpenText\Service Manager\server\RUN

   3. Open the Service Manager configuration file (sm.cfg or smstart) in a text editor.
   4. Add the following lines:

          sm -loadBalancer -httpPort:13080
          sm -httpPort:13081 -httpsPort:13082
          sm -httpPort:13083 -httpsPort:13084

     The loadBalancer parameter creates a special servlet container process to route
     client connection requests to other available servlet container processes. A
     vertical scaling implementation only needs one load balancer.
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

 5. Save the Service Manager configuration file.
 6. Open the Service Manager initialization file (sm.ini) in a text editor.
 7. Verify that the auth parameter has a valid authorization code.

 8. Add the RDBMS connection settings. For example:

        [oracle10]
        sqldb:ora102
        sqllogin:sm7user/password
        sqllibrary:SQORACLE.OCI10.DLL
        sqldictionary:oracle10

 9. Add the following lines:

        threadsperprocess:50
        sessiontimeout:3

    The threadsperprocess:50 parameter defines the number of threads each
    process supports. A value of 50 threads assumes that the Service Manager host
    has the minimum recommended system memory available for servlet container
    processes.
    The sessiontimeout:3 parameter defines the number of minutes that the client
    connection can remain unresponsive before the server closes the connection. A
    value of 3 minutes assumes that most network latency issues are quickly and
    easily resolved.

10. Save the Service Manager initialization file.
11. Start the Service Manager server.
12. Sign in to the operating system of the Service Manager Web tier host and

    change directories to the Service Manager WEB-INF folder. For example:


        C:\apache-tomcat-<version>\webapps\sm\WEB-INF

13. Open the Web configuration file (web.xml) in a text editor.
14. Set the following parameter values:

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

15. Save the Web configuration file.
16. Start the Service Manager Web tier.
17. Open Service Manager Windows clients and set the Service Manager hostname

    and communication port values:

Field                                       Value
Server host name                            myserver1
Server port number                          13080

 18. Connect to the Service Manager host.

Related topics

Server implementation options
Servlet implementation
Servlet implementation options
Vertical scaling implementation
Configuring a vertical scaling environment


1.1.6.3.2. Configuring a vertical scaling
environment

This configuration is intended for customers who:

     Want to maximize the number of client connections supported on a single host
     Have a host with enough system resources to manage all concurrent client
     connections

Terminology

     Group: A group of Service Manager server processes running on one or more
     hosts and connecting to one database to serve Service Manager server
     processes within a group.
     Node: A Service Manager server process within a group.
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

Commands required in sm.cfg

     You must set the following configuration commands.

          sm -loadBalancer -httpPort:<value>

          sm -httpPort:<value> -httpsPort:<value>

          sm system.start

      sm -loadBalancer -httpPort:<value> - Is a special Service Manager servlet
     process that redirects client connections requests to other available Service
     Manager processes.
      sm -httpPort:<value> -httpsPort:<value> - Specifies the HTTP or HTTPS
     communications port for one Service Manager servlet process. Each Service


     Manager process by default can host 50 users. You can start as many Service
     Manager servlet processes as you want, as long as your server has enough
     physical memory and resources to start the processes. You can also change the
     number of users hosted on one Service Manager servlet process by setting the
      threadsperprocess parameter.

Optional parameters in sm.ini

The following initialization parameters are optional.

  threadsperprocess:<value>

  preferredFQHN:<value>

  groupbindaddress:<value>

      threadsperprocess - Defines the maximum number of concurrent user
     sessions per Service Manager servlet process. Use a value that maximizes the
     system resources of your Service Manager host. The default value for the
     parameter threadsperprocess is 250. For more sizing information using this
     parameter, refer to Service Manager server (servlet container).
      preferredFQHN - Specifies the fully qualified host name you want Service
     Manager clients to use when communicating with the server. Service Manager
     loadBalancer redirects client requests to the target host with the target host's
     preferredFQHN. You only need to set this parameter if your Service Manager
     host is identified by multiple names in the network.
      groupbindaddress - Defines the TCP/IP address of the network adapter you
     want Service Manager processes to use to communicate with other processes in
     the group.

Memory requirements

For an out-of-box environment (limited to 50 concurrent users), a servlet container
requires approximately 8GB of RAM, which is distributed in the following ways:

     Java virtual machine requirement, the Java heap size is 2 GB.
     User session memory usage:

           For Windows platform, the memory usage is 40 MB - 55 MB per user
           session.
           For Linux platform, the memory usage is 55MB - 70MB per user session.
     Shared_memory setting value is equal to or greater than 512 MB (Counted only
     once for all servlet containers on a single computer)


For information on sizing, refer to the sizing guide.

Licensing requirements

Obtain an AutoPass license for your vertical scaling environment. On Windows
platforms, AutoPass installs as part of the server installation. On Linux platforms, you
must install it manually before you can run Service Manager. For more information,
see Install. AutoPass includes this host's IP address in the LicFile.txt file.

Do the following:

   1. Get a license.
   2. Copy the primary server's IP address to get the license and save it as the

     primary server's LicFile.txt file. The default directory for this file is as follows:
           On Windows: C:\Program Files\Common Files\Hewlett-
           Packard\HPOvLIC\data\LicFile.txt
           On Linux: /var/opt/OV/HPOvLIC/LicFile.txt

Related topics

Servlet implementation
Servlet implementation options
Parameter: httpPort
Parameter: httpsPort
Parameter: loadBalancer
Install


1.1.6.4. Vertical scaling and required SSL
implementation

In a vertical scaling and required SSL implementation you maximize the number of
client connections supported on a single host and provided SSL-encrypted security
between client and server communications.

The key features of this implementation are:

     The Service Manager system consists of several servlet container processes
     running on one physical host
     The implementation allows administrators to specify a system connection limit
     The Service Manager system can manage a number of concurrent client
     connections up to the number of servlet container processes times the
     threadsperprocess value (For example, 6 servlet container processes supporting
     50 threadsperprocess can support up to 300 client connections)
     The implementation allows administrators to specify the communication ports
     the system uses
     The implementation requires SSL-encrypted communications between Service
     Manager clients and servers
     A dedicated load balancer process manages and routes client connections to
     available servlet container processes
     Administrators can dynamically add and remove Service Manager instances
     from a virtual group

A vertical scaling implementation is typically used in small to medium environments
where hardware system resources are limited. A vertical scaling implementation can
support as many client connections as the Service Manager host has available system
resources.

You can convert a vertical scaling implementation into a horizontal scaling
implementations with the addition of virtual grouping parameters and one or more
additional servlet container instances installed on separate physical hosts.

Vertical scaling and required SSL implementation
diagram

The Vertical scaling and required SSL implementation diagram is a reference diagram
for implementers who are responsible for installing and configuring Service Manager.
This diagram shows the configuration settings and network connections required for
a single server running multiple servlet containers in a required SSL implementation.




Related topics

Servlet implementation
Servlet implementation options
Startup options for servlet container processes


1.1.6.4.1. Example: Setting up a vertical
scaling and required SSL implementation

The following example describes how to set up a vertical scaling and required SSL
implementation that accomplishes the following:

     Maximizes the number of client connections supported on a single host
     Allows an administrator to specify the communications ports the Service
     Manager implementation uses
     Require SSL encryption for all connections
     Protects against complex SSL-related attacks
     Authenticates that the Service Manager server is a valid host

You can use this example to configure the implementation depicted in the Vertical
scaling and required SSL implementation diagram.

   1. Install Service Manager on one host. For example: myserver1.
   2. Sign in to the operating system of the Service Manager server host and change

     directories to the Service Manager RUN folder. For example:

          C:\Program Files\OpenText\Service Manager x.xx\Server\RUN

   3. Open the Service Manager configuration file (sm.cfg or smstart) in a text editor.
   4. Add the following lines:

          sm -loadBalancer -httpPort:13080
          sm -httpPort:13081 -httpsPort:13082
          sm -httpPort:13083 -httpsPort:13084

           The loadBalancer parameter creates a special servlet container process to
           route client connection requests to other available servlet container
           processes. A vertical scaling implementation only needs one load balancer.
           The httpPort:13080 parameter specifies that the load balancer process
           listens to client connection requests on HTTP port 13080. This
           communications port must be unique across all hosts that you want to join
           the Service Manager virtual group.
           The httpPort:13081 parameter specifies that the servlet container process
           listens to client connection requests on HTTP port 13081. This


        communications port must be unique on the host on which you start the
        servlet container.
        The httpsPort:13082 parameter specifies that the servlet container process
        listens to client connection requests on HTTPS port 13082. This
        communications port must be unique on the host on which you start the
        servlet container.
        The httpPort:13083 parameter specifies that the servlet container process
        listens to client connection requests on HTTP port 13083. This
        communications port must be unique on the host on which you start the
        servlet container.
        The httpsPort:13084 parameter specifies that the servlet container process
        listens to client connection requests on HTTPS port 13084. This
        communications port must be unique on the host on which you start the
        servlet container.
5. Save the Service Manager configuration file.
6. Open the Service Manager initialization file (sm.ini) in a text editor.

7. Add the RDBMS connection settings. For example:

      [oracle10]
      sqldb:ora102
      sqllogin:sm7user/password
      sqllibrary:SQORACLE.OCI10.DLL
      sqldictionary:oracle10

8. Add the following lines:

      threadsperprocess:50
      sessiontimeout:3
      truststoreFile:cacert.keystore
      truststorePass:<cacert password>
      keystoreFile:scserver.keystore
      keystorePass:<server certificate password>
      ssl:1

        The threadsperprocess:50 parameter defines the number of threads each
        process supports. A value of 50 threads assumes that the Service Manager
        host has the minimum recommended system memory available for servlet
        container processes.


          The sessiontimeout:3 parameter defines the number of minutes that the
          client connection can remain unresponsive before the server closes the
          connection. A value of 3 minutes assumes that most network latency
          issues are quickly and easily resolved.
          The truststoreFile:cacert.keystore parameter defines the file name and path
          to the keystore containing a list of trusted CA certificates. This value
          assumes you are using the default trust store file provided in the Service
          Manager server's RUN folder. This parameter must not be encrypted with
          the new initialization parameter encryption feature or the Java components
          will not be able to find the trust store file.
          The truststorePass:<cacert password> parameter specifies the password
          to the trust store file. This parameter must not be encrypted with the new
          initialization parameter encryption feature or the Java components will not
          be able to read the password value.
          The keystoreFile:scserver.keystore parameter defines the file name and
          path to the keystore containing the server's certificate file and private key.
          This value assumes you are using the default trust store file provided in the
          Service Manager server's RUN folder. This parameter must not be
          encrypted with the new initialization parameter encryption feature or the
          Java components will not be able to find the keystore file.
          The keystorePass:<server certificate password> parameter specifies the
          password to the keystore file. This parameter must not be encrypted with
          the new initialization parameter encryption feature or the Java components
          will not be able to read the password value.
          The ssl:1 parameter requires the Service Manager server to use a signed
          server certificate for SSL-encryption of all client-server communications.
          Each client connection validates the server's certificate against the signing
          certificate authority. You must also use the keystoreFile and keystorePass
          parameters to define the location of the server certificate and private key.
 9. Save the Service Manager initialization file.
10. Start the Service Manager server.

11. Sign in to the operating system of the Service Manager Web tier host and
    change directories to the Service Manager WEB-INF folder. For example:

        <Tomcat>\webapps\webtier_x.xx\WEB-INF

12. Open the Web configuration file (web.xml) in a text editor.

13. Set the following parameter values:

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

14. Save the Web configuration file.
15. Start the Service Manager Web tier.
16. Open Service Manager Windows clients and set the Service Manager hostname

    and communication port values:

Field                                      Value
Server host name
Server port number                         myserver1
CA certificates file
                                           13080

                                           C:\Program Files\OpenText\Service
                                           Manager
                                           x.xx\Client\plugins\com.hp.ov.sm.cli
                                           ent.common_x.xx\cacerts

 17. Connect to the Service Manager host.

Related topics


Server implementation options
Servlet implementation
Servlet implementation options
Vertical scaling and required SSL implementation
Requirements for a vertical scaling and required SSL implementation


1.1.6.4.2. Requirements for a vertical
scaling and required SSL implementation

This configuration is intended for customers who:

     Want to maximize the number of client connections supported on a single host
     Have a host with enough system resources to manage all concurrent client
     connections
     Want to specify the communications ports the Service Manager implementation
     uses
     Want to require SSL encryption for all connections
     Want to protect against complex SSL-related attacks
     Want to authenticate that the Service Manager server is a valid host

Number of Service Manager hosts required

     This implementation requires the following number of hosts.
     1

Certificates required

     You must create or obtain the following certificates for SSL encryption.
           Certificate authority certificate
           Keystore containing the certificate authority's certificate
           Service Manager host certificate

Private keys required

     You must create or obtain the following private keys for SSL encryption.
           Certificate authority's private key *
           Service Manager host private key

     * This key is only necessary if you are managing your own private certificate
     authority.

Parameters required in sm.cfg

     You must set the following configuration parameters.


          sm -loadbalancer -httpPort:<value>

          sm -httpPort:<value> - httpsPort:<value>

          sm -httpPort:<value> - httpsPort:<value>

           loadbalancer – creates a special servlet container process to route client
           connection requests to other available servlet container processes
           httpPort – identify the communications port that a servlet container process
           uses to communicate with clients using HTTP
           httpsPort – identify the communications port that a servlet container
           process uses to communicate with clients using HTTPS

Parameters required in sm.ini

     You must set the following initialization parameters.
           cacertpem – identify the certificate authority's certificate
           certpem – identify the Service Manager host's certificate
           pkpem – identify the Service Manager host's private key
           pkpempass – identify the password for the Service Manager host's private
           key
           ssl:1
           sessiontimeout – define the number of minutes a client connection can
           remain unresponsive before the server closes the connection.
           threadsperprocess – identify the total number of threads the servlet
           container process supports
           The default value for the parameter threadsperprocess is 250. For more
           sizing information using this parameter, refer to Service Manager server
           (servlet container).

Parameters required in web.xml

     You must set the following Web parameters.
           cacerts – identify the keystore containing the certificate authority's
           certificate
           serverHost – identify the host name of the Service Manager host
           serverPort – identify the communications port on which the Service
           Manager host listens for client connections requests

Windows client preferences required

     You must set the following preferences from the Connection menu.
           Server host name – identify the host name of the Service Manager host


           Server port number – identify the communications port on which the
           Service Manager host listens for client connections requests
     You must set the following preference from the Window > Preferences >
     Service Manager > Security menu.
           CA certificates file – identify the keystore containing the host's certificate
           authority certificate

Other requirements

     You must do the following additional steps to ensure that Service Manager can
     use your private certificates.

           Add the certificate authority's certificate to one or more key stores that
           your Web and Windows clients can access
           Ensure that the Service Manager server's host name matches the common
           name (CN) listed in the host's signed certificate

Related topics

Servlet implementation
Servlet implementation options
Parameter: httpPort
Parameter: httpsPort
Parameter: loadBalancer
````
