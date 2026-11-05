---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.1.9 .. 1.1.2
printed_pages: 254-263
---

# 1.1.1.9 Running Web Services on a dedicated port (servlet)

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.1.9. Running Web Services on a dedicated
port (servlet)

To create a separate servlet within a horizontally or vertically scaled Service Manager system,
add the debugnode parameter to the dedicated servlet container. The debugnode parameter
stops the load balancer from distributing client load to this node. This can be used to set up a
dedicated servlet for tracing and logging without adding an uncontrollable amount of load to
that servlet. Another use is to create a dedicated servlet for a special purpose within the scaled
solution. As an example, refer to the following sm.cfg file:

  #load Balancer Port
  sm -loadBalancer -httpPort:13080
  #Ports for loadBalanced Connections
  sm -httpPort:13081 -httpsPort:13082
  sm -httpPort:13083 -httpsPort:13084
  sm -httpPort:13085 -httpsPort:13086
  #Port for Web Services
  sm -httpPort:13087 -debugnode

Current limitations of running Web Services through the load balancer:

     The HTTP 307 redirect is not fully compliant with the specifications which can affect Web
     Services integrations through the Service Manager Load Balancer. The workaround is to
     connect directly to one of the Service Manager Application server servlets.
     Web Services through the Service Manager Load Balancer aren't possible when SSL is
     enabled on the server.

     Web Services through the Service Manager Load Balancer aren't possible for Web
     Services clients that can't handle a redirect.


1.1.1.10. Debugging SOAP errors

The best practice for troubleshooting SOAP errors is to start a new client connection process
with a dedicated log file associated with it. Opening a new client connection process allows
you to isolate any faulty client traffic from your regular client traffic.

   1. To set up your system to debug SOAP traffic, do one of the following:

     Start HTTP debugging for the entire system. Type the following command on a single line
     in the sm.ini file and then save the file.

debughttp:1

Debug parameters in the sm.ini file affect all Service Manager processes and the log files
record all send/receive messages. This method is not recommended for a busy server
however, since you have to restart the server for the debugging parameter to take effect.

     Start a separate client connection process to troubleshoot your SOAP errors. Type the
     following command in the operating system command line:

sm -httpPort:unique portnumber -sslConnector:0 -debughttp:1
-log:../logs/debug.log

where

-httpPort identifies a port where Web Services clients can connect
-log defines a path to store the logs for this process

Normally, all client connection processes for a particular Service Manager installation use the
parameter values listed in the sm.ini file. This means that all client connections share the same
log file specified in the sm.ini file. By starting a new client connection process with a different
log parameter value, you can isolate the logs for a particular group of clients. Choose a port
number that's not likely to be used by any other process.

   2. Recreate the error.
   3. Review the http.log, sm.log and log files from the Web Services consumer or publisher

     that Service Manager is communicating with and server, and client log files for
     information about the SOAP error. The HTTP log is in the server's RUN folder. The server
     logs are in the path you specified with the log parameter. The client logs are located in the
     following paths:

     For a Web Services client, see your Web Services client log
     For a Web client, see the log filed specified in the log.properties file on the web tier
     system


     For a Windows client, see the .log on the Windows client system

SOAP messages: Debugging HTTP traffic problems

If, after reviewing the client logs, you discover that there is an error in the HTTP transfer of
SOAP messages, you must manually enable the HTTP debugging option on the Service
Manager server. This option allows you to trace all HTTP and SOAP messages between the
Service Manager server and client. You can trace HTTP traffic in one of two ways.

     Trace all HTTP connections to the server
     Trace a dedicated connection to the server

To review all the HTTP traffic, you can enable the debughttp parameter from the Service
Manager initialization file ( sm.ini ) file. This causes the server to record all messages sent
from and to the server to the following log files.

     logs\sm.log
     RUN\TEST.log

This method of debugging SOAP messages traces all Service Manager processes, but
significantly reduces system performance because the log files the server produces contain all
HTTP traffic, including HTTP headers and attachments. For this reason it is recommended that
you not enable this parameter on production systems, but rather in test environments only.

To review HTTP traffic use the -httpPort paremeter as in the sample below. In addition, you can
create a dedicated log file for this connection. By starting a new Service Manager process and
specifying a separate log parameter, you reduce the amount of system resources needed to
produce debugging output. For example, you can enter the following command from the server
OS command line to create a dedicated servlet and log file.

  sm -httpPort:portnumber -debughttp:1 -log:../logs/debug.log

For portnumber, type a communications port number on which you want the server to use for
SOAP requests. You can use the -log parameter to define a path to any log file you want.

SOAP messages: Debugging problems with RAD
applications

If your review of the client logs reveals potential problems in the RAD applications, you can
enable the logging of RAD application messages by adding the rtm startup parameter to the
Service Manager initialization file. This parameter causes the server to record all application-
generated messages to sm.log file. For example, to receive detailed information about the
RAD applications, add the following command to the Service Manager initialization file (sm.ini).

rtm:3

You can use the RAD application logging messages to determine if any tailoring changes you
made are the cause of SOAP faults.


Contents

     1 SOAP messages: Debugging HTTP traffic problems
     2 SOAP messages: Debugging problems with RAD applications


1.1.1.11. Debugging RESTful API

This section provides information about how to debug RESTful API issues.

Debugging parameters

The following three parameters are most frequently used for debugging RESTful API:

     debugrest

     Add debugrest in sm.ini or in the dedicated servlet container line of the sm.cfg file, restart
     the Service Manager and re-run the RESTful Web service application to invoke debugging
     parameter. It provides more detailed log trace for diagnostics.

     dao_threadsperprocess

     Similar to debugrest, it can be set in sm.ini or in the dedicated servlet container line of
     sm.cfg file.

     It means the maximum number of threads allowed concurrently running in the process for
     RESTful Web Service application. It can be defined in sm.ini and the default value is 80. It
     is better to start enough server threads to handle requests (suggest to maintain the buffer
     of 30%~ 40% spare capacities).

     dao_sessiontimeout

     Like debugrest, the dao_sessiontimeout parameter can be set in sm.ini or in the dedicated
     servlet container line of sm.cfg file.

     It indicates the seconds to wait before terminate the RESTful threads. It can be defined in
     sm.ini and the default value is 15 seconds. Unless the client sends subsequent requests
     within the timeout, the Service Manager server will recycle the session for re-use and re-
     allocate it on demand.

     If there is big divergence, it is recommended to connect several servlets with different
     thresholds.

It is also useful to use the msglog:1 parameter to have all messages written to the sm.log as
well.

Web services with a proxy server

If you are using web services with a proxy server, incorrect proxy server settings will cause
your web service calls to fail. For details, see Web Services with a proxy server.


1.1.1.12. Syntax for entity references in xml

Character represented                   Entity Reference  xml code
>                                       greater than      &gt;
<                                       less than         &lt;
“                                       Quotation marks   &quot;
&                                       ampersand         &amp;
‘                                       apostrophy        &apos;


1.1.1.13. Definitions, acronyms, and
abbreviations

Term                                    Definition
Consuming
Publishing                              Using a Web Service by calling its methods,
WSDL                                    supplying the appropriate calling
REST                                    parameters

                                        Providing a service over the Web by making
                                        public the services operations and objects
                                        in a Web Service.

                                        Web Services Description Language, which
                                        is a standard, structured way of describing
                                        SOAP messages and Web Services

                                        Representational State Transfer.


1.1.1.14. Web Services resources

You can use the following resources to develop and publish your own Web Services.

The World Wide Web Consortium (W3C) has existed for almost ten years. Its objective is to
develop common protocols and to recommend standards that promote Internet interoperability.
There are over 400 member organizations who contribute to forming recommendations for
standards and best practices among Internet developers. The W3C provides leadership in an
array of Web technologies (including XML, HTML, and similar areas of interest) by creating
working groups that gather and publish information and recommendations.

You can find the WSDL schema and SOAP schemas published and propagated by IBM and
Microsoft at schemas.xmlsoap.org. The W3C has complete descriptions of the schema
elements for both SOAP and WSDL. See the W3C Web site for the most recent working draft of
SOAP and WSDL recommendations.

There are third party tool kits that simplify creating a Web Service. For example, Apache Axis
and Microsoft Visual Studio .NET are development tool kits you can use to create a custom
Web Services client directly from the Service Manager Web Services API WSDL.

If you are interested in examples of working Web service WSDL files, programmatic interfaces,
tutorials, samples, and a list of available Web services, see the Xmethods Web site. Also see
the resources listed below:

     Service-Oriented Architecture : A Field Guide to Integrating XML and Web Services, April
     2004, Prentice Hall Publishing
     Web Services: A Technical Introduction, August 2004, Prentice Hall Publishing
     Java Web Services, March 2004, O’Reilly
     Apache Axis
     Microsoft Visual Studio .NET
     schemas.xmlsoap.org
     SOAP schemas
     World Wide Web Consortium
     Gzip Web site
     Apache Wink
     Representational state transfer
     Hypertext Transfer Protocol


1.1.2. Connect-It

Connect-It is an integration platform that exposes technology infrastructure data as common
business objects. The Connect-It family of connectors leverages industry-standard protocols
and connects with third-party information systems in order to integrate technology
infrastructure products with external information systems to align business processes and
synchronize relevant data.

Key features and benefits:

     Integrates ITSM solutions with almost any data source
     Leverages industry-standard protocols
     Helps Managers make informed business decisions
     Improves data quality and integrity
     Includes built-in best practice integrations
     Reduces implementation time
     Provides the power of an enterprise application integration (EAI) tool at the cost of a
     gateway

For more information, refer to the Connect-IT documentation available at the ITOM Practitioner
Portal.

            Note

           The OOB design doesn't trigger activities when creating or updating data through
           an event (which is sent from CIT to SM). Hence, there is no log on the Activity tab.
````
