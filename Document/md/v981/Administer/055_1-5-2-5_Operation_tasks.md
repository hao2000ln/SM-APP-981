---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.5.2.5 .. 1.5.2.9
printed_pages: 1338-1368
---

# 1.5.2.5 Operation tasks

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.5.2.5. Operation tasks

The following table lists maintenance tasks that a System Administrator needs to
perform in the Operation area. For information about other areas, see Areas of
maintenance tasks.

Event or frequency                      Task                   Automatable
On Demand                                                      No
On Demand                               Start Service Manager  No

On Demand                               Shut down Service      No
                                        Manager

                                        Switch servlets to
                                        quiesce mode

Related topics

Areas of maintenance tasks


1.5.2.5.1. Start Service Manager

To start a Service Manager system, do one of the following:

     Start Windows service "Service Manager <version> Server" on Windows
     Execute the smstart script on Linux systems

Single servlets can be started by command line (the executable sm in the RUN
directory) for a limited amount of time.

Service Manager is using a JGroups open source component to build a reliable
cluster of Service Manager servlets. In case Service Manager must be stopped
completely, the JGroups cluster is shutdown as well.

When a servlet is started, it tries to join an already existing JGroups cluster, otherwise
it will create a new cluster that others can join. To create a cluster, a valid license
must exist for the host and the grouplicenseip parameter must include the IP address
of the host.

Related topics

Operation tasks
Startup and shutdown
Parameter: grouplicenseip


1.5.2.5.2. Shut down Service Manager

To shut down a Service Manager system, do one of the following:
     Stop Windows service “Service Manager <version> Server” on Windows
     Execute the smstop script on Linux systems

Alternatively, you can also use the shutdown commands to shutdown the complete
Service Manager system, a group of servers, all servlets running on a host, or single
servlets identified by process id.

  sm -shutdown [-group:<group>][-host:<host>][-pid:<pid>]

Related topics

Operation tasks
Startup and shutdown


1.5.2.5.3. Switch servlets to quiesce mode

In quiesce mode, all users or all users except those with the SysAdmin capability may
not connect. You can set quiesce mode for a single, multiple or all servlets. This
allows the System Administrator to apply maintenance changes without being
interfered by or interfering with other sessions.
Command line:

  sm –quiesce:<mode> [-group:<group>][-host:<host>]

Whether the servlet that the current session is running on is in quiesce mode or not
can by tested by the sysinfo.get(“Quiesce”) system language function.
The following table describes different restriction levels of quiesce mode.

 Restriction level                                                                              Service Manager 9.81
 Level 0
 Level 1                                Description

 Level 2                                Service Manager has no login
                                        restrictions and accepts all logins
Related topics                          normally.

Operation tasks                         Service Manager restricts login to
System quiesce: Login restrictions      operators who have the SysAdmin
                                        capability word. Service Manager
This PDF was generated on May 23, 2026  denies login to all other operators and
                                        displays the message:
                                        System quiesced, you can't login at
                                        this time.
                                        When you issue sm -quiesce:1 -group
                                        on a primary or secondary host, all
                                        Service Manager processes (except
                                        the Service Manager load balancer) are
                                        set to quiesce mode 1. The Service
                                        Manager load balancer updates its list
                                        of available nodes to 0. If users try to
                                        connect to the Service Manager load
                                        balancer at this time, they receive the
                                        following message, because there are
                                        no Service Manager processes
                                        currently available:
                                        Max sessions exceeded.

                                        Service Manager denies login to all
                                        operators and displays the message:
                                        System quiesced, login restricted at
                                        this time.

                                                                                                                        Page 154 of 191

Startup parameter: quiesce
RAD function: sysinfo.get("Quiesce")
Quiesce all servlet container processes in a servlet implementation
Quiesce all servlet container processes on a host


1.5.2.6. Configuration tasks

The following table lists maintenance tasks that a System Administrator needs to
perform in the Configuration area. For information about other maintenance areas,
see Areas of maintenance tasks.


Event or frequency                      Task                     Automatable
                                                                 No
Before going to                         Log file configuration   No
production
                                                                 No
Before going to                         Set up one Service
production                              Manager account for      No
                                        each incoming            No
                                        integration              No
                                                                 No
Before going to                         Configure SSL            No
production                              encryption for Service   No
                                        Manager clients and
                                        integrations

Before going to                         Restrict JavaScript
production                              access to the operating
                                        system

Before going to                         Review security
production                              configuration options
                                        and the security guide

After modifying                         Encrypt all credentials
credentials

Before going to                         Define a batch size for
production                              sequential number
                                        records

Before going to                         Set up the
production                              certExpireWarningDays
                                        parameter

Before going to                         Review known issues
production

Related topics

Service Manager maintenance tasks
Areas of maintenance tasks



1.5.2.6.1. Log file configuration

Log files grow over time and consume disc space. If no disc space is available
components may start failing.
Configure the log files especially for Service Manager server and web tier. The web
tier log file configuration depends on the web application server. For instructions,
refer to your web application server documentation.

Server log file configuration

The server log file configuration includes the following tasks.
Separate the log files
By default, all servlets running on a host write to a single log file (sm.log) in the logs
subdirectory of the Service Manager installation, which is specified in the “log”
parameter in the sm.ini file. For more information, see Startup parameter: log.
At least for servlets dedicated for integrations or background processes, you should
write a separate log file. To configure this, in the sm.cfg file of the servlet, add to the
startup command the “-log” parameter with the log file path relative to the RUN
directory.
Here is an example:

  sm -startup -log:..\logs\background.log

            Tip

           A common practice is to write a separate log file for each servlet.

Set up log file rotation
As the log files grow large over time, it is recommended to set up log rotation. This
guards against a log file size generating disc space shortage. For more information,
see Log switching.
When setting up log rotation, calculate the required disc space for all servlets and
make sure it is available with a buffer for the unforeseen. For example:


  sm -httpPort:13080 -numberoflogfiles:10 -maxlogsize:52428800 -
  logqueuesize:2000

This command will start a servlet keeping up to 10 log file copies. Log file switch will
happen when the log file size reaches 50MB. So the total amount of disc space
required for this servlet is 500MB.
The -logqueuesize parameter controls the number of messages buffered in memory
before being written to the log file. It helps to avoid performance impact of switching
larger log files to user sessions. For more information, see Parameter: logqueuesize.
Activate proactive trace parameters
Review the list of proactive trace parameters, and decide which are helpful to monitor
and maintain the administrated system. For details, see Trace parameters that can be
proactively activated.

            Tip

           It is recommended to activate only traces whose information is reviewed
           periodically.

Web tier log file configuration

The web tier log file configuration includes the following.

     Web server and web application server logging
     Refer to the documentation of the web server and the web application server
     regarding log file configuration and set it up as appropriate.

     Logging for the Service Manager web client application
     The Service Manager web client application uses the <Webtier_Home>\WEB-
     INF\log4j2.properties configuration file, where you can specify web application
     specific log parameters.

Related topics

Service Manager maintenance tasks
Configuration tasks


1.5.2.6.2. Setup one Service Manager
account for each incoming integration

When external systems access Service Manager, provide valid credentials for the
account they are running in. It is best security practice to not reuse an account and
password, but create a unique account for each integration. This helps managing
account privileges, tracking access, and analyzing issues in log files.

Related topics

Service Manager maintenance tasks
Configuration tasks


1.5.2.6.3. Configure SSL encryption for
Service Manager clients and integrations

Make sure the clients and integrations are using SSL encryption for security reasons.

Related topics

Configuration tasks
Secure Sockets Layer (SSL) encryption
TLS 1.2 support and configuration
Enable SSL encryption for published Web Services


1.5.2.6.4. Review security configuration
options and the security guide

The system administrator is responsible for operational security of the installation,
and is required to be familiar with security requirements and configurations.

For more information, see Service Manager Security Guide white paper.

Especially, planning and setting up the TLS/SSL security between the components of
the Service Manager Environment is required. In an out-of-box installation, there is no
TLS/SSL security configured by default. For more information, see Secure Sockets
Layer (SSL) encryption and TLS 1.2 support and configuration.

Related topics

Service Manager maintenance tasks
Configuration tasks
System Security
TLS 1.2 support and configuration
Service Manager Security Guide


1.5.2.6.5. Restrict JavaScript access to
the operating system

JavaScript implementation can access operating system resources using the
following global functions: readFile(),uncompressFile() , writeFile(),writeFile(),
deleteFile(), makeDir(), writeAttachmentToFile(), and sysExec().
This access can be restricted using the following sm.ini parameters:
jsaccessfilereadregex , jsaccessfilewriteregex, and jsaccesscmdregex. For more
information, see Startup parameters: JavaScript access.
Define exactly which operating system resources are required to be accessed from
implementations inside the Service Manager applications.

            Tip

           For operating system command line access that's required, write shell
           scripts in the Service Manager Server's RUN directory and set up the
           jsaccesscmdregex parameter to only allow access to these shell scripts.

Related topics

Configuration tasks
Startup parameters: JavaScript access


1.5.2.6.6. Encrypt all credentials

Parameters in configuration files for credentials must not be stored in clear text for
security reasons. The same applies to the location in the database to store credentials
for external applications that Service Manager integrates with.

Credentials stored in configuration files

Service Manager encrypts credentials in configuration files stored in the file system
automatically using a randomly generated master key. For more information, see
Randomly generated master keys.

The Service Manager administrator must be familiar with this concept, and the risk of
making the system inaccessible by accident. The administrator needs to know how to
make Service Manager recreate the master key, and the importance to take
precautions and store credentials at a safe place. See also Document credentials in a
safe place.

Credentials stored in dbdicts

Credentials of external applications that Service Manager integrates with are stored in
the RDBMS. Examples include Service Manager Integration Suite (SMIS) integrations,
or integrations implemented in JavaScript (both based on web services or REST).

Credentials of external applications used by Service Manager are stored in the
database, and transmitted in HTTP message headers. The passwords are required to
be protected in both.

Passwords for external applications using SMIS are stored as encrypted in the
database. In the wizard to set up an integration instance, these parameters appear on
the Secure parameters tab.

When implementing a web service or RESTful integration directly, the implementer is
responsible for storing the credentials securely. When using the RunWSDL2JS wizard
to produce JavaScript code to interface with an external application, the credentials
get stored as plain text in the generated ScriptLibrary record.

The transmission of credentials in HTTP messages is also not secure: The
Authorization header property is not securely encrypted. Secure transmissions
require TSL/SSL configuration.

Related topics


Service Manager maintenance tasks
Configuration tasks
Randomly generated master keys
Document credentials in a safe place


1.5.2.6.7. Define batch size for sequential
number records

For a dbdict using the sequential numbering mechanism to assign unique numbers to
an identifier field, define a batch size for sequential number generation when the
dbdict has a high creation rate of new records.

            Note

           When using a batch size, only the uniqueness of the numbers is
           guaranteed. Later requested numbers aren't necessarily greater numbers.

Related topics

Sequential numbers


1.5.2.6.8. Set up certExpireWarningDays
parameter

Expired SSL certificates may cause system unavailability. Service Manager prints a
warning before certificate expiration. The timing of the warning is configured in the
certExpireWarningDays parameter.

Related topics

Configuration tasks
Parameter: certExpireWarningDays


1.5.2.6.9. Review known issues

Review the list of known issues documented for the Service Manager version used.
This list can be found in the Service Manager Help Center for Service Manager 9.50
or later.

            Note

           For releases earlier than 9.50, the known issues can be found in their
           specific release notes in PDF format. See Service Manager Document
           Matrix for their download links.

Related topics

Configuration tasks
Known issues
Service Manager Document Matrix


1.5.2.7. Fallback strategy tasks

The following table lists tasks that a System Administrator needs to perform in the
Fallback Strategy area. For information about other maintenance areas, see Areas of
maintenance tasks.

Event or Frequency                      Task  Automatable

Before going to                         Unload falcon and fail- No
production                              safe operator records

Before going to                         Set up backup strategies No
production
                                        Test fallback procedures No
Quarterly

Create a “fail-safe” administrative operator

The Database Manager (RAD application: database) allows an operator with the
SysAdmin capability to access all contents of the Service Manager system, even if
menus and the system navigator should not be available.

Therefore, a copy of the falcon operator with startup application database is a
valuable fallback for emergency scenarios.

Unload falcon and fail-safe operator records

In case operator records get corrupted or deleted, an unload of an operator record
with the SysAdmin capability will enable you to gain back access to the system.

To load this file from the operating system command line (the RUN directory), use
following command:

  sm file.load operator.unl NULL NULL winnt -bg

or

  sm file.load operator.unl NULL NULL unix

Set up backup strategies


As any computer system may fail with the risk of data loss, it is important to take
precautions for the data managed by Service Manager system, as well as all
information to run it.

This includes:

     Data stored in the RDBMS system. Work with the database administrator to set
     up a backup strategy that can meet the business requirement, and to document
     the restoration practice.
     All documentation about the system such as configuration diagrams,
     configuration settings, tailoring, and maintenance concept. Work with the IT
     department to set up a strategy about the backup and restoration of this kind of
     data.

Test fallback procedures

In case of an outage, the prepared fall back strategies must work in order to prevent
data loss and ensure quick service reestablishment. Therefore, it is important that all
fall back procedures are tested periodically.

Related topics

Service Manager maintenance tasks
Areas of maintenance tasks


1.5.2.8. Documentation tasks

The following table lists maintenance tasks that the System Administrator needs to
perform in the Documentation area. For information about other areas, see Areas of
maintenance tasks.

Event or frequency                      Task                     Automatable
Before going to                                                  No
production                              Document fallback        No
On demand                               procedures
                                                                 No
On demand                               Document the             No
                                        application of patches,
After modifying                         hotfixes, and custom
credentials                             tailoring

                                        Document all automated
                                        administrative tasks

                                        Document credentials in
                                        a safe place

Document fallback procedures

All fallback strategies must be documented to cover their applicable scenarios,
precautions to be taken, and restoration procedures, so that they are available when
needed.

Document the application of patches, hotfixes, and
custom tailoring

The administrator is responsible for documenting all changes applied to the system,
such as the application of patches and hotfixes, or custom tailoring releases. This
includes the following information:

     Date and time of the application
     Information about the change
     Status after the application (error or warning messages, and results of initial
     functionality tests)

This document is required for analysis if an issue is observed.


            Note

          The standard question from Software Support engineers about the last
          change before first observation is directly referring to this document.

Document all automated administrative tasks

Diligence in implementation, documentation, and maintenance of these automated
tasks is important because changes of the system configuration, or tailoring may
directly result in a requirement to modify automated maintenance tasks as well.

Document credentials in a safe place

Service Manager automatically encrypts credentials in configuration files and in the
Service Manager Integration Suite (SMIS) configuration. Therefore, credentials can no
more be looked up from these files or SMIS.

These credentials include credentials for the relational database, LDAP server, SSL
keystore files, or external applications that Service Manager integrates with.

To address the risk of not being able to access required resources because of failure,
document all credentials in a secure place.

Related topics

Areas of maintenance tasks
System information record
Encrypt all credentials


1.5.2.9. Change control tasks

The following table lists maintenance tasks that a System Administrator needs to
perform in the Change Control area. For information about other areas, see Areas of
maintenance tasks.

Event or frequency                      Task                    Automatable
On demand                                                       No
On demand                               Apply Service Manager   No
On demand                               Server patches          No
On demand                                                       No
                                        Apply Service Manager
On demand                               application patches     Yes

                                        Apply Service Manager
                                        web tier patches

                                        Apply JRE updates on
                                        the Service Manager
                                        Server

                                        Apply operating system
                                        patches or hardware
                                        updates

Related topics

Areas of maintenance tasks
JRE support
Operation tasks


1.5.2.9.1. Apply Service Manager Server
patches

Updating the Service Manager server by a patch or hotfix is the replacement of
executable files in the Service Manager server's RUN directory on each host. The
files replaced include among others the sm executable, and the contents of the
RUN/lib directory.

The java archive files (*.jar) contained in the RUN/lib directory are the company's or
third-party files with a version number in the file name. For this reason, only copying
the patch into an existing RUN/lib directory is not replacing all existing files when the
version has been updated, and the file with the older number has to be removed
manually. A good practice therefore is to rename the RUN/lib directory before patch
application.

When a parameter in sm.ini refers to a Java archive file in the RUN/lib directory, the
parameter needs to be updated when the version of this file changes. An example is
the Service Manager mbeanclient JAR file, which is required when Service Manager
is running with a hardware load balancer:

JVMOption999:./lib/mbeanclient-<version>.war

            Note

           Always follow the installation advice provided with the patch.

Related topics

Change control tasks


1.5.2.9.2. Apply Service Manager
application patches

Application patches or hotfixes update the implementation data stored in the
database. Customization and tailoring implementations may be affected by
application of a patch. For this reason, conflicts between the current application and
the patch need to be identified and resolved. The Application Patch Manager utility
supports this process.

            Note

           Always follow the installation advice provided with the patch.

Related topics

Change control tasks


1.5.2.9.3. Apply JRE updates on the
Service Manager server

Each Service Manager servlet starts a Java Runtime Environment (JRE). The
installation directory of this JRE is:
<Service Manager installation path>/RUN/jre
When installing Service Manager on Windows, a JRE is installed as well.
When a JRE update is required, verify first that Service Manager supports the Java
version by consulting the Support Matrix.

Related topics

Change control tasks
JRE support


1.5.2.9.4. Apply Service Manager web tier
patches

Service Manager web tier patches or hotfixes are shipped as web application archive,
and therefore a complete replacement of the existing Service Manager web tier files.
The web tier patch must be applied on all web application server instances of the
Service Manager installation.
Only save the files you made configuration changes before such as in the web.xml file
in order to apply the same configuration to the new web application deployment.

            Note

           Always follow the installation advice provided with the patch.

Related topics

Change control tasks
Upgrade the Web Tier


1.5.2.9.5. Apply operating system patches
or hardware updates

The operating system (OS) administrator is responsible for applying OS patches.
The application of an OS patch may require a restart of the server. Because of that,
there are some considerations regarding the Service Manager systems.

If Service Manager is installed as a horizontally scaled environment, it may be shut
down on a host for maintenance, while it is still accessible on other hosts. The only
requirement is to not shut down all hosts concurrently, which keep the JGroups
cluster of the Service Manager servlets running.

Related topics

Change control tasks
Start Service Manager
````
