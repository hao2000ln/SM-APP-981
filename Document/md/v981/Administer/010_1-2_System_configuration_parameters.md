---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2 .. 1.2.9
printed_pages: 227-249
---

# 1.2 System configuration parameters

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2. System configuration parameters

The topics in this section describe the parameters that control your Service Manager
system, and how to set them. There are two basic types of parameters: system
parameters and web tier parameters.

     System parameters change the behavior of Service Manager. There are
     hundreds of system parameters, each of which is designed to assist system
     administrators and users.
     Web tier parameters control the behavior and appearance of the Service
     Manager web tier, a web-based client interface.

Parameters that you set when you start the Service Manager server retain their values
for as long as the server is running. To reset a startup parameter, restart the server.
You can set startup parameters from either the server's operating system command
prompt or from the Service Manager initialization file (sm.ini).

Related topics

System parameters
Web tier parameters
Enter a parameter in the sm.ini file
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Enter a parameter in sm.cfg or the server’s OS command prompt
View parameters by function


1.2.1. Service Manager Server and Web
Tier configuration files

The following table describes the configuration files of the Service Manager (SM)
Server and Web Tier.

Component  Location                     File           Service Manager 9.81
Server                                  sm.ini
           <SM installation                     Description
           path>/Server/RU
           N/                                   Service Manager
                                                Server
Server     <SM installation             sm.cfg  configuration file.
           path>/Server/RU                      For more
           N/                                   information, see
                                                Enter a parameter
                                                in the sm.ini file.

                                                Service
                                                Manager Server
                                                configuration file.

                                                Parameters
                                                behave in the
                                                same way no
                                                matter whether
                                                they are specified
                                                in the server's
                                                operating system
                                                command prompt
                                                or in the sm.cfg
                                                file.

                                                For more
                                                information, see
                                                Enter a parameter
                                                in sm.cfg or the
                                                server’s OS
                                                command
                                                prompt.


Component  Location                     File             Description
Server                                  lwssofmconf.xml
           <SM installation                              Service Manager
Web Tier   path>/Server/RU                               Server LW-SSO
           N/                                            configuration file.

                                                         For more
                                                         information, see
                                                         Configure LW-
                                                         SSO in the
                                                         Service Manager
                                                         server.

           <Web                         web.xml          Web Tier
           Tier>/WEB-INF/                                configuration file.
                                                         For more
                                                         information, see
                                                         Web tier
                                                         parameters.


Component  Location                                   File                Description
Web Tier
                                        Default:      webtier.properties  Web Tier
                                        <Web                              configuration file.
                                        Tier>/WEB-                        For more
                                        INF/                              information, see
                                        Custom:                           Web tier
                                        <customize-                       parameters.
                                        folder>/conf
                                        ig/

Component  Location                     File         Service Manager 9.81

This PDF was generated on May 23, 2026        Description

                                                          Import
                                                          ant

                                                         The
                                                         web.x
                                                         ml file
                                                         define
                                                         s lots
                                                         of
                                                         para
                                                         meter
                                                         s
                                                         (cont
                                                         ext-
                                                         para
                                                         m of
                                                         the
                                                         web
                                                         applic
                                                         ation
                                                         and
                                                         init-
                                                         para
                                                         m of
                                                         servle
                                                         ts), all
                                                         of
                                                         which
                                                         excep
                                                         t the
                                                         custo
                                                         mize-
                                                         folder
                                                         para
                                                         meter
                                                         can
                                                         be
                                                         overri
                                                         dden
                                                         by the
                                                         same

                                                                         Page 15 of 208
Component  Location                     File         Service Manager 9.81

This PDF was generated on May 23, 2026        Description

                                                         para
                                                         meter
                                                         s
                                                         define
                                                         d in
                                                         the
                                                         webti
                                                         er.pro
                                                         pertie
                                                         s file.
                                                         We
                                                         stron
                                                         gly
                                                         recom
                                                         mend
                                                         that
                                                         you
                                                         config
                                                         ure
                                                         your
                                                         Web
                                                         Tier
                                                         using
                                                         webti
                                                         er.pro
                                                         pertie
                                                         s
                                                         instea
                                                         d of
                                                         web.x
                                                         ml to
                                                         simpli
                                                         fy
                                                         future
                                                         Web
                                                         Tier
                                                         upgra
                                                         des.

                                                                         Page 16 of 208

Component  Location                     File                   Description

Web Tier   <Web                         application-           Web Tier Single
           Tier>/WEB-                   context.xml            Sign-On
           INF/classes/                                        configuration file
                                                               (TSO, LW-SSO,
                                                               and CAC)

Web Tier   <Web                         lwssofmconf.xml Web Tier LW-SSO
           Tier>/WEB-                                          configuration file
           INF/classes/

Related topics

System configuration parameters
System parameters
Web tier parameters
Enter a parameter in the sm.ini file
Enter a parameter in the web.xml file
Enter a parameter in sm.cfg or the server’s OS command prompt


1.2.2. System parameters

System parameters define either server or client properties.

     Other parameters don't have a value unless a system administrator sets one. For
     example, the system parameter determines the port that clients use to access
     the Service Manager server. The initial value for this parameter is set during
     installation and stored in the sm.ini file. If no value is set for the system
     parameter in the sm.ini file, then Service Manager clients don't know what port
     to connect to on the server.
     Some parameters affect the server and all the clients that connect to it, while
     others only affect a particular client or connection.
     Furthermore, a particular parameter can affect all connections or a particular
     connection, based on where it is set.

Parameters provide a method to handle each of the following requirements:

     In a production environment, the system administrator may want to prevent all
     client connections from printing or unloading data.
     In a production environment, a user may want to change the font within Service
     Manager.
     In a development or testing environment, the system administrator may want to
     grant all developers certain debugging capabilities.
     In a development or testing environment, an application developer may want
     additional debugging capabilities.

System parameters change the behavior of the Service Manager components.
Parameters are typically designed to affect one of these components. The following
table lists the components that can be influenced by system parameters.


Component                               Method to set            Type of parameter
Service Manager server                  parameter value or
                                        default file location

                                        In the C:\Program        client and server
                                        Files\OpenText\Ser
                                        vice Manager
                                        <x.xx>\Server\RUN
                                        \sm.ini file on the
                                        Service
                                        Manager server
                                        By using the
                                        operating system
                                        command line

Windows client                                                   client
                                        In the C:\Program
                                        Files\OpenText\Ser
                                        vice Manager
                                        <x.xx>\Server\RUN
                                        \sm.ini file on the
                                        Service
                                        Managerserver
                                        By using the
                                        operating system
                                        command line
                                        In the Windows
                                        client, from the
                                        Window >
                                        Preferences menu

Web application server                  In the                   web

                                        ..webtier_<x.xx>/WEB-

                                        INF/web.xml file on the

                                        web application server


Component                               Method to set            Type of parameter
Web client                              parameter value or       web
                                        default file location
Help Center
                                             In the
                                             ..webtier_<x.xx>/
                                             WEB-INF/web.xml
                                             file on the web
                                             application server
                                             In the URL

                                                                 web
                                        In the Windows
                                        client, from the
                                        Window >
                                        Preferences menu
                                        In the
                                        ..webtier_<x.xx>/
                                        WEB-INF/web.xml
                                        file on the web
                                        application server

Because system parameters can be set from a variety of locations and by a variety of
people, the values that are set may conflict. Therefore, it is important to know which
parameter values take precedence when a conflict exists.

     Parameters that you set from the operating system command line or
     configuration file take precedence over parameters that are set in the sm.ini file
     on the server. You can use parameters from the command line or configuration
     file to override the standard sm.ini settings.
     Parameters that you set in the sm.ini file on the server take precedence over the
     preferences that are set in the Windows client.
     Parameters that you set in the sm.ini file on the server take precedence over the
     parameters that you set in the web.xml file on the web application server.
     Parameters you set in the URL of the web client take precedence over
     parameters that you set in the web.xml file on the web application server.

Getting help with parameters


Service Manager includes two sources of information about parameters. This Help
Center is one of those sources. Additionally, you can open a command line on the
Service Manager server, navigate to the C:\Program Files\OpenText\Service
Manager <x.xx>\Server\RUN directory, and then run the sm -helpall command that
is, an sm command with the helpall parameter). Help provides detailed descriptions
of each parameter and its use, while helpall provides a list of parameters and a brief
description of each.

Related topics

System configuration parameters
Web tier parameters
Enter a parameter in the sm.ini file
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Enter a parameter in sm.cfg or the server’s OS command prompt
View parameters by function


1.2.3. Web tier parameters

Web parameters change the behavior of the web clients that connect to the web tier.
You can set these parameters from the web tier configuration file web.xml or
webtier.properties, and override some of these parameters (connection-specific
parameters) from the web client login URL.

You can set web tier parameters from the following files:

     The web.xml and webtier.properties files that are provided under the <web
     tier>/WEB-INF folder when you deploy the Service Manager web tier.
     The custom webtier.properties file under the <customize-folder>/config folder
     which you defined using the customize-folder parameter.

To configure the customize-folder parameter, see Web parameter: customize-folder.

Override precedence

Except the customize-folder context parameter, you can define all other context
parameters of the Web application and initialization parameters of Servlets from both
the web.xml file and the webtier.properties files. The parameters configured in these
files take precedence in the following order:

     Custom webtier.properties located in the <customize-folder>/config folder
     Default webtier.properties located in the <web tier>/WEB-INF folder
     Web.xml located in the <web tier>/WEB-INF folder

Parameters with higher precedence override parameters with lower precedence.

As parameters defined in custom webtier.properties (<customize-
folder>/config/webtier.properties) take the highest precedence, the customize-folder
parameter itself can't be overridden.

            Note

           It is recommended that you configure these parameters in the custom
           webtier.properties file for the ease of future webtier upgrade.

Naming convention for parameters in
webtier.properties


The context parameters of the Web application and initialization parameters of the HP
Service Manager Web servlet keep their names unchanged. Names for initialization
parameters of other servlets should conform to the format of <servlet name>.<init-
param-name>. For example:

     The name of the jsDebug context parameter in web.xml should be jsDebug in
     webtier.properties.
     The name of the serverHost initialization parameter of the HP Service
     Manager Web servlet should be serverHost in webtier.properties.
     The name of the disableCompression initialization parameter of the
      FileDownload servlet should be FileDownload.disableCompression parameter
     in webtier.properties.

Setting web tier parameters in webtier.properties

When you enter parameters into the webtier.properties file, make sure you configure
the parameters in the format of <parameter name>=<parameter value>. For example,
the following code sets the rememberLang parameter to true:

rememberLang=true

Setting web tier parameters in web.xml

When you enter parameters into the web.xml file, ensure that the values you enter
conform to valid XML standards.

            Note

           All init-param tags must be children of the <servlet> tag and must use
           the following syntax:

                 <servlet>
                    <init-param>
                        <param-name>serverHost</param-name>
                        <param-value>myhost.mydomain.com</param-value>
                    </init-param>

                 <servlet>

To ensure that your web application server uses the new settings, restart your web
application server whenever you make changes to the web.xml or the
webtier.properties file.


Setting web tier parameters from the web browser
URL

You can provide connection-specific web tier parameters in the web browser URL.
These parameters override the values that are set in web.xml or webtier.properties.
For example, the following URL changes the connection to host "mycompany" on port
13082 for this client session:

  http://localhost:8080/sm/index.do?
  serverHost=mycompany.mydomain.com&serverPort=13082

Related topics

System configuration parameters
System parameters


1.2.4. Enter a parameter in the web client
URL

Applies to User roles: System Administrator

You can enter web client parameters in the web client's URL. These parameters are
only valid for the current web client session, and revert to the default values (as
defined in the web.xml file) when the session closes.

To enter a parameter in the web client URL, type the parameter at the end of the URL
after a question mark (?). To do this, use the following syntax:

http://servername:portnumber/sm/index.do?<parameter_name>=
<parameter_value>

You can also use the ampersand (&) character to enter multiple parameters in a single
URL. To do this, use the following syntax:

http://servername:portnumber/sm/index.do?<parameter_name>=
<parameter_value>&<parameter_name>=<parameter_value>

Related topics

System configuration parameters
System parameters
Web tier parameters
Enter a parameter in the sm.ini file
Enter a parameter in the web.xml file
Enter a parameter in sm.cfg or the server’s OS command prompt
View parameters by function
Client parameters for web clients


1.2.5. Enter a parameter in the sm.ini file

Applies to User roles: System Administrator
You can store parameters in the sm.ini file. To do this, follow these steps:

   1. Open the sm.ini file. By default, the file is located on the Service Manager server
     in the C:\Program Files\OpenText\Service Manager\Server\RUN folder.

   2. Enter the parameter and value in the file. Enter one parameter per line. Use a
     colon (:) to separate the parameter from the value. When you enter paths, enter
     them relative to the location of the Service Manager executable file. Use the
     following syntax:

         <parameter name>:<parameter value>

     The following excerpt is an example of parameters and their values in the sm.ini
     file.

        shared_memory:32000000
       ntservice: Service Manager
       log:..\logs\sm.log
       system:13080

Related topics

System configuration parameters
System parameters
Web tier parameters
Enter a parameter in the web.xml file
Enter a parameter in sm.cfg or the server’s OS command prompt
View parameters by function


1.2.6. Enter a parameter in the web.xml
file

Applies to User roles: System Administrator
You can store web parameters in the web.xml file. When you do this, make sure that
you use valid XML code. Specifically, parameter tags must be children of servlet tags.
To enter a parameter in the web.xml file, follow these steps:

   1. Open the web.xml file. By default, the file is located on the web application
     server in the ..sc/WEB-INF/web.xml directory.

   2. Type the parameter information. For example, the following XML code sets value
     of the serverHost parameter to "localhost":

          <servlet>
             <init-param>
                 <param-name>serverHost</param-name>
                 <param-value>localhost</param-value>
             </init-param>

          <servlet>

Related topics

System configuration parameters
System parameters
Web tier parameters
Enter a parameter in the sm.ini file
Enter a parameter in the web client URL
Enter a parameter in sm.cfg or the server’s OS command prompt
View parameters by function


1.2.7. Enter a parameter in the
webtier.properties files

Applies to User roles: System Administrator
You can store web parameters in the webtier.properties files. When you do this, make
sure you configure the parameters in the format of <parameter name>=<parameter
value>.

To enter a parameter in webtier.properties, follow these steps:

   1. Open the webtier.properties file where you want to enter the parameter:

           Custom webtier.properties located in the <customize-folder>/config folder

           Default webtier.properties located in the <webtier .war>/WEB-INF folder

   2. Type the parameter information. For example, the following code sets the value
     of the rememberLang parameter to true:

          rememberLang=true

Related topics

System configuration parameters
System parameters
Web tier parameters
Web parameter: customize-folder
Enter a parameter in the sm.ini file
Enter a parameter in the web.xml file
Enter a parameter in the web client URL
Enter a parameter in sm.cfg or the server’s OS command prompt
View parameters by function


1.2.8. Enter a parameter in sm.cfg or the
server’s OS command prompt

Applies to User roles: System Administrator

You can enter client and server parameters in the server's sm.cfg file or operating
system command line. When you do this, prefix each parameter with a space and a
dash (-).

To enter a parameter in sm.cfg or the server’s operating system command prompt,
follow these steps:

   1. Open the operating system command prompt, and then navigate to the directory
     in which the Service Manager executable file is located. By default, the file is
     located in the C:\Program Files\OpenText\Service Manager
     <x.xx>\Server\RUN folder.

     Alternatively, open the <Service Manager installation
     directory>\Server\RUN\sm.cfg file in a text editor.

   2. Type the command and the parameters, as demonstrated in the following
     examples:

           One parameter

           sm -<parameter_name>:<parameter_value>

           Multiple parameters

           sm -<parameter_name>:<parameter_value> -<parameter_name>:
           <parameter_value>

Setting startup parameters from the server's
operating system command prompt

Startup parameters that you set by using the server's operating system command
prompt must always follow the sm command. Precede startup parameters with a dash
(-) when you call them from the command line.

When you call a startup parameter from the server's operating system command
prompt, use the following syntax:


  C:\<Service Manager installation directory>\RUN>sm -<start up
  parameter>:<setting>

For example, you type the following command:

  <Service Manager installation directory>\Server\RUN>sm -
  httpPort:12345

Related topics

System configuration parameters
System parameters
Web tier parameters
Enter a parameter in the sm.ini file
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
View parameters by function


1.2.9. View parameters by function

Applies to User roles: System Administrator
To view parameters arranged by function, follow these steps:

   1. Open an operating system command prompt, and navigate to the Service
     Manager RUN folder. For example, type the following command and then press
     Enter.
      cd C:\Program Files\OpenText\Service Manager <x.xx>\Server\RUN

   2. Type the following command, and then press Enter:

         sm -help<type>

     For example, to view SSL parameters, type the following command and then
     press Enter:

          sm -helpssl

Related topics

     System configuration parameters
     System parameters
     Web tier parameters
     Enter a parameter in the sm.ini file
     Enter a parameter in the web client URL
     Enter a parameter in the web.xml file
     Enter a parameter in sm.cfg or the server’s OS command prompt
````
