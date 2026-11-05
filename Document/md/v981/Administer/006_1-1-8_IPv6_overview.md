---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.1.8 .. 1.1.10
printed_pages: 128-148
---

# 1.1.8 IPv6 overview

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.8. IPv6 overview

As of version 9.32, Service Manager supports IPv4/IPv6 as a dual stack network. This
addresses the needs of being able to run Service Manager infrastructure in an
organization where both IPv6 and IPv4 are enabled in parallel.

            Note

           In a dual stack network, the required IPv4 configuration is the same as
           before.

Recommended Topologies

We recommend that your implementation follow these topology guidelines:

Topology 1

     Service Manager run-time environment, underlying RDBMS, and all
     Application/Web Servers in a pure IPv4 environment use IPv4.
     The clients in a pure IPv4 environment using IPv4.

Topology 2

     Service Manager run-time environment, underlying RDBMS, and all
     Application/Web Servers in a dual IPv4/IPv6 environment use IPv4.
     The clients in pure a IPv4 environment or in a dual IPv4/IPv6 environment both
     use IPv4.

Topology 3

     Service Manager run-time environment, underlying RDBMS, and all
     Application/Web Servers in a dual IPv4/IPv6 environment use IPv6.
     The clients in a pure IPv4 environment use IPv4.
     The clients in a dual (IPv4/IPv6) environment use IPv6.

Contents

     1 Recommended Topologies
           1.1 Topology 1
           1.2 Topology 2
           1.3 Topology 3


1.1.8.1. IPv6 supported address formats

IPv6 in Service Manager supports the following IP address formats.

Text representation

Service Manager supports text representation of IPv6 formats as defined in RFC 4291
(IP Version 6 Addressing Architecture).
IPv6 addresses are 128-bit identifiers for interfaces and sets of interfaces. In general,
the standard IPv6 address is x:x:x:x:x:x:x:x where each x represents 1 to 4
hexadecimal digits, as shown in the following example:

  2001:DB8:0:0:8:800:200C:417A

It's not necessary to specify the leading zeros of an individual field. However, you
must have at least one hexadecimal character in each field. You can use :: to
represent one or more groups of 16 bits of zeros to avoid specifying the entire IPv6
address. However, you can only use the :: one time. You may also use :: to
compress the leading or trailing zeros of the IPv6 address. For example, the following
two IPv6 addresses are equivalent:

  FF01:0:0:0:0:0:0:101

  FF01::101

            Note

           You can use either of these representations when you configure IPv6 for
           use in Service Manager.

Address representation in mixed IPv4/IPv6
environments

According to the RFC 4291 (IP Version 6 Addressing Architecture) standard, the
following format is used to handle mixed IPv4/IPv6 environments:


  x:x:x:x:x:x:d.d.d.d

In this case, the xs are placeholders for the hexadecimal values of the six high-order
16-bit pieces of the address, and the ds are the decimal values of the four low-order
8-bit pieces of the address, which is the standard IPv4 representation. Therefore, you
can specify an old IPv4 address in a mixed IPv4/IPv6 environment in either of the
following, equivalent ways:

  0:0:0:0:0:0:13.1.68.3

  ::13.1.68.3 //Uses :: to minimize the leading zeros of the IPv6
  address.

            Note

           In Service Manager, this mixed use IPv4/IPv6 is unsupported.

IPv6 addresses with a port number

To specify an IPv6 address together with a port number, enclose the IPv6 address in
brackets as shown in the following example:

  [2001:db8::1]:80

Contents

     1 Text representation
     2 Address representation in mixed IPv4/IPv6 environments
     3 IPv6 addresses with a port number


1.1.8.2. IPv6 configuration

The following topics provide basic information on how to configure Service Manager
to use IPv6:
Configure the Service Manager server for IPv6
Configure the Windows client for IPv6
Configure the Web clients for IPv6
Configure IPv6 to work with Service Manager integrations
Configure IPv6 for Mobility


1.1.8.2.1. Configure the Service Manager
server for IPv6

To configure the Service Manager server to use IPv6, specify an IPv6 address in the
groupbindaddress parameter in the sm.ini file where the Service Manager server is
installed. The following example shows a valid IPv6 address:

  groupbindaddress:2620:0:a17:e006:1060:cb7b:590a:4388

            Note

           If the groupbindaddress parameter is specified with an IPv6 address,
           Service Manager will listen for both IPv4/IPv6 addresses. If no value is
           specified, or if an IPv4 address is specified, Service Manager will listen
           only for IPv4 addresses.

Configure IPv6 for horizontally-scaled
environments

Make sure that you configured Service Manager as described at the beginning of this
topic. To configure IPv6 for horizontally scaled environments, you must also specify
the following parameters on each horizontally scaled server:


Parameter                               Value
groupbindaddress
                                        Specify an IPv6 address in the
grouplicenseip                          groupbindaddress parameter in the
groupmcastaddress                       sm.ini file where the Service Manager
                                        server is installed.

                                        Set as the valid IPv6 or IPv4 address of
                                        the machine where the licenses are
                                        stored.

                                        By default, this parameter is set to
                                        FF02::1 after the groupbindaddress
                                        parameter is specified. If needed, you
                                        can modify this parameter according to
                                        the following
                                        standard: http://www.iana.org/assignm
                                        ents/ipv6-multicast-addresses/ipv6-
                                        multicast-addresses.xml#ipv6-
                                        multicast-addresses-1

Note

All other configurations steps are the same as in an IPv4 environment.

Configure IPv6 for vertically-scaled environments

Make sure that you configured Service Manager as described at the beginning of this
topic. To configure IPv6 for vertically-scaled environments, you must also specify the
following variables:

Parameter                               Value
groupbindaddress
                                        Specify an IPv6 address in the
                                        groupbindaddress parameter in the
                                        sm.ini file where the Service Manager
                                        server is installed.


Note

All other configuration steps are the same as in an IPv4 environment.


1.1.8.2.2. Configure the Windows client for
IPv6

To configure the Service Manager Windows client to use IPv6, follow these steps:
   1. Navigate to File > Connect.. > Connections.
   2. In the Connections dialog, enter a valid IPv6 in the "Server host name" field.


1.1.8.2.3. Configure the Web clients for
IPv6

Application Server

The steps that you use to configure IPv6 depends on the Application server that you
are using. Choose the appropriate instructions for your environment.

Tomcat 8.x

The default installation of Tomcat doesn't support listening on the IPv6 protocol.
Therefore, you must download latest APR library (tcnative-1.dll) and add an address
parameter for the connector in the server.xml file. To do this, follow these steps:

   1. Download latest APR library as appropriate for your architecture.

Architecture                            Download location:
x86
                                        http://archive.apache.org/dist/tomca
x64                                     t/tomcat-
IA64                                    connectors/native/1.1.20/binaries/wi
                                        n32/tcnative-1.dll

                                        http://archive.apache.org/dist/tomca
                                        t/tomcat-
                                        connectors/native/1.1.20/binaries/wi
                                        n64/x64/tcnative-1.dll

                                        http://archive.apache.org/dist/tomca
                                        t/tomcat-
                                        connectors/native/1.1.20/binaries/wi
                                        n64/ia64/tcnative-1.dll

2. Replace the default APR library with the one you downloaded.

      $Tomcat_Installation$\bin\tcnative-1.dll

3. Add an address parameter for the connector in the server.xml file as follows:


          <Connector address="[::]" port="8081" protocol="HTTP/1.1"
          maxThreads="400"
          connectionTimeout="20000"
          redirectPort="8443" />

   4. Add an address parameter for the AJP connector in the server.xml file as
     follows:

          <Connector address="[::]" port="8008" protocol="AJP/1.3"
          redirectPort="8443" />

                   Note

                Modify the server.xml file for each for Tomcat instance. To revert to
                IPv4, remove address parameter in the server.xml file.

   5. Set serverHost parameter of the WEB-INF\web.xml to a valid IPv6 address:

          <param-name>serverHost</param-name>
          <param-value>2620:0:a17:e006:d024:1d09:c2f9:f03f</param-
          value>

                   Note

                You don't need to use enclose the IPv6 address in the brackets ([]).

   6. Access the Service Manager Web tier by using a correct URL as shown in the
     following example:

          http://[2620:0:a17:e006:4a8:91c1:c9cb:93dd]:8080/webtier-
          9.xx/index.do

WebSphere 8.5

To configure WebSphere for IPv6, follow these steps:
   1. Set the serverHost parameter of the WEB-INF\web.xml file to a valid IPv6
     address:


          <param-name>serverHost</param-name>
          <param-value>2620:0:a17:e006:d024:1d09:c2f9:f03f</param-
          value>

                   Note

                You don't need to use enclose the IPv6 address in the brackets ([]).

   2. Access the Service Manager Web tier by using a correct URL as shown in the
     following example:

          http://[2620:0:a17:e006:4a8:91c1:c9cb:93dd]:8080/webtier-
          9.xx/index.do

Web Server

The steps that you use to configure IPv6 depends on the Web server that you are
using. Choose the appropriate instructions for your environment.

Apache 2.2 or 2.4

To configure Apache to use IPv6, you must download,modify, and recompile Apache.
To do this, refer to these example steps:

   1. Download and install Perl from the following web site:
     http://www.activestate.com/activeperl/downloads

   2. Download and install awk95.exe to some directory, for example, C:\Windows .
      Rename the file to awk.exe .

   3. Compile zlib. To do this, follow these steps:
        1. Download the source code for zlib from the following web site:

                 http://www.zlib.net/

        2. Unzip the file to C:\ipv6\zlib .
        3. Run the following command to compile zlib:


             C:\ipv6\zlib\nmake -f win32\Makefile.msc

     4. If you receive an nmake fatal error code 0xc0000135 , run the following
        command:

             C:\ipv6\zlib\vcvars32

4. Compile OpenSSL. To do this, follow these steps:
     1. Download the source code for OpenSSL from the following web site:

             http://www.openssl.org/

     2. Unzip the file to C:\ipv6\openssl .
     3. Run the following command to compile openssl:

             C:\ipv6\openssl\perl Configure VC-WIN32
             C:\ipv6\openssl\ms\do_ms
             C:\ipv6\openssl\nmake -f ms\ntdll.mak

5. Compile and modify Apache . To do this, follow these steps:
     1. Download the source code for Apache from the following web site:

             http://httpd.apache.org/download.cgi

     2. Unzip the file to C:\ipv6\httpd .
     3. Edit the httpd\srclib\apr\include\apr.hw file, and change the line #define

        APR_HAVE_IPV6 0 to #define APR_HAVE_IPV6 1 .
        Copy the zlib and openssl folders from the previous steps to
         httpd\srclib .
     4. Run the following command to compile Apache:

             C:\ipv6\httpd\nmake /F Makefile.win INSTDIR="C:\Apache"
             installr


                         Note

                      You may encounter issues if you try to compile Apache.
                      Specifically, you may receive the following errors:

                                C:\Program Files\Microsoft
                                SDKs\Windows\v6.0A\include\ws2def.h(91) :
                                warning C4005: 'AF_IPX' : macro redefinition
                                C:\Program Files\Microsoft
                                SDKs\Windows\v6.0A\include\winsock.h(460) : see
                                previous definition of 'AF_IPX'
                                C:\Program Files\Microsoft
                                SDKs\Windows\v6.0A\include\ws2def.h(127) :
                                warning C4005: 'AF_MAX' : macro redefinition
                                C:\Program Files\Microsoft
                                SDKs\Windows\v6.0A\include\winsock.h(479) : see
                                previous definition of 'AF_MAX'
                                C:\Program Files\Microsoft
                                SDKs\Windows\v6.0A\include\ws2def.h(163) :
                                warning C4005: 'SO_DONTLINGER' : macro
                                redefinition
                                C:\Program Files\Microsoft
                                SDKs\Windows\v6.0A\include\winsock.h(402) : see
                                previous definition of 'SO_DONTLINGER'
                                C:\Program Files\Microsoft
                                SDKs\Windows\v6.0A\include\ws2def.h(206) :
                                error C2011: 'sockaddr' : 'struct' type
                                redefinition
                                C:\Program Files\Microsoft
                                SDKs\Windows\v6.0A\include\winsock.h(485) : see
                                declaration of 'sockaddr'
                                C:\Program Files\Microsoft
                                SDKs\Windows\v6.0A\include\ws2def.h(384) :
                                error C2059: syntax error : 'constant'

                      These issue are caused by an improper include order between
                       windows.h and the winsock2.h files in the apr library. To
                      resolve this, make sure that winsock2.h is included before
                       windows.h .

IIS 8.0 or 8.5


IPv6 is unsupported for an IIS connector with Tomcat (mod_jk).

Contents

     1 Application Server
           1.1 Tomcat 8.x
           1.2 WebSphere 8.5

     2 Web Server
           2.1 Apache 2.2 or 2.4
           2.2 IIS 8.0 or 8.5


1.1.8.2.4. Configure IPv6 to work with
Service Manager integrations

Knowledge Management search server

Make sure that you configured Service Manager as described in the Configure the
Service Manager server for IPv6 section. To configure IPv6 in a Knowledge
Management search server, follow these steps:

   1. In the Service Manager client, navigate to System Administration > Ongoing
     Maintenance > Smart Analytics > Configuration.

   2. Configure IPv6 address for Smart Analytics, Default Connector Framework
     Server (CFS), and Image server, including the brackets, as shown:

          http://<[IPv6 address]>:<port number>/

            Note

           All other configurations steps are the same as in an IPv4 environment.

LDAP server

Make sure that you configured Service Manager as described in the Configure the
Service Manager server for IPv6 section. To configure IPv6 for an LDAP server, follow
these steps:

   1. In the Service Manager client, navigate to System Administration > Ongoing
     Maintenance > System > LDAP Mapping.

   2. Set LDAP server as the IPv6 address of the LDAP server, including the
     brackets, as shown:

          [2620:0:a17:e006:4a8:91c1:c9cb:93dd]

            Note

           All other configurations steps are the same as in an IPv4 environment.


SMTP server

Make sure that you configured Service Manager as described in the Configure the
Service Manager server for IPv6 section. To configure IPv6 for an SMTP server,
follow these steps:

   1. Specify the IPv6 address of the SMTP server in the smtphost parameter in the
      sm.ini file. The following example shows a valid IPv6 address:

          smtphost:2620:0:a17:e006:1060:cb7b:590a:4388

   2. Set the smtphost connection parameters for the emailout startup parameter
     as a valid IPv6 address:

          sm -emailout -smtphost:[2620:0:a17:e006:4a8:91c1:c9cb:93dd]
          -smtpport:25

            Note

           All other configurations steps are the same as in an IPv4 environment.


1.1.8.2.5. Configure IPv6 for Mobility

To enable IPv6 support for the Service Manager Mobile Application, follow these
steps:

   1. Enable IPv6 support in Tomcat. To do this, see the Tomcat section of Configure
     the Web clients for IPv6.

   2. Enable IPv6 in Service Manager. To do this, see Configure the Service Manager
     server for IPv6.

   3. In folder where the mobile web tier is deployed, set theendpoint in the WEB-
     INF\web.properties file to a Full Qualified Domain Name or to a valid IPv6
     address

          endpoint=[2620:0:a17:e006:4a8:91c1:c9cb:93dd]

   4. You can access the Service Manager Mobile Application by entering the valid IP
     address in your browser, as shown in the following example:

          http://[2620:0:a17:e006:4a8:91c1:c9cb:93dd]:8080/sm/std


1.1.9. Print options

Service Manager offers list view or detail view print options.

Use Search to display the list of records or a detail record. Follow the instructions
below to print in the windows client or the web client:

In the windows client:

   1. Click File > Print or click the Print icon.

   2. Select one of the following options:

           List: Print the list of records.

           You can specify the Start and Count fields to print a number of
           consecutive records in the list.

           Detail: Print a single record.
   3. Select the printer and then click Print.

In the web client:

   1. Do one of the following actions:
           Print the list of records: Click the Print icon on the Record List toolbar or
           press Ctrl+Alt+P.
           Print a single record: Click the Print icon on the Record Detail toolbar or
           press Alt+P.

   2. Perform one of the following actions in the newly-opened browser window:
           Right-click the page and then click Print.
           Press Ctrl+P.

   3. Select the printer and then click Print.

Related topics

Setting Windows client preferences from the server


1.1.10. Regional settings

Applies to User Roles: System Administrator

Regional settings define local values for month names and abbreviations, date format,
system language, and default system currency.

Define the months in the year

To define the months in the year:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Month Tables tab.

The table lists the Full Name and Abbreviation for each month.

   1. Make any necessary changes.
   2. Click Save.

Set the default date format

To set the default date format:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Date Info tab.
   3. In the Format field, type or select one of the following date formats to be the

     system default.
           mm/dd/yy — standard U.S. date format
           dd/mm/yy — standard European date format
           yy/mm/dd — optional date format
           mm/dd/yyyy — standard U.S. date format
           dd/mm/yyyy — standard European date format
           yyyy/mm/dd — optional date format

   4. Click Save.

Set the default system currency

To set the default system currency:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.


   2. Click the General tab.
   3. In the Basis Currency field, type or select one of the options from the currency

     file.
   4. Click Save.

Note: The currency setting in each individual operator record overrides the default
system currency setting.

Set the default system language

Note: The language setting in each individual operator record overrides the default
language setting.

To set the default system language:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Misc tab.
   3. In the Language Code field, type or select one of the following language

     options:
           English
           French
           German
           Italian
           Japanese

   4. Click Save.

Related topics

Calendars
Clocks
System information record
Time zones
````
