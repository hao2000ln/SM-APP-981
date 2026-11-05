---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.3 .. 1.3.1.4
printed_pages: 631-660
---

# 1.3 SAP Solution Manager

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3. SAP Solution Manager

Businesses today increasingly rely on their mission-critical SAP applications. Disruptions in the
SAP environment have a severe business impact. Keeping the system continuously available
has never been more vital for success. In any SAP landscape, business process disruptions
caused by an application or infrastructure incident must be proactively prevented. If
disruptions do occur, they need to be quickly and efficiently resolved. OpenText and SAP have
teamed up to solve this issue.

Incident management in enterprises today consists of disconnected incident management
systems that often implement divergent processes. This situation diminishes collaboration
within IT operations, lowers quality of service and productivity. The integration of SAP Solution
Manager Service Desk with Service Manager provides a cohesive Incident and Service
Request Management solution for the entire enterprise, resulting in higher enterprise
availability, improved service quality and reduced IT costs.

Incident Exchange builds a dynamic link between Service Manager Software and SAP Solution
Manager Service Desk and improves the Incident and Service Request Management Process
throughout the entire enterprise Incident Exchange offers dynamic integration between Service
Manager and SAP Solution Manager Service Desk for improved incident workflow.

The interface to exchange support messages between Service Manager and SAP Solution
Manager Service Desk was designed and developed jointly by OpenText and SAP and is
certified by SAP.


1.3.1. Install and administer Service Manager
Exchange with SAP Solution Manager

This section describes the installation, configuration, administration and maintenance of
Incident Exchange and the Incident Exchange web service. Information in this section is
intended only for use by software consultants and application administrators that install and
maintain Incident Exchange. We strongly recommend you to read this section carefully before
installation and follow the instructions herein because SMSSMEX 1.40 significantly differs from
the previous releases.


1.3.1.1. Existing fragmented Incident
Management workflow

Performance monitoring of an SAP environment must include SAP and non-SAP applications.

SAP Solution Manager Service Desk

To monitor and manage SAP environments, IT operations management uses the SAP Solution
Manager Service Desk to collect information about SAP systems and serves as an internal help
desk for SAP installations. Users and administrators can create support messages from any
SAP system. The messages are processed centrally in the Solution Manager Service Desk.

If the support message involves an SAP application, a solution may be available in the SAP
Service Marketplace or from SAP Active Global Support or from the in-house SAP support
team. But if the issue is not caused by the SAP application, the message will be forwarded to
the administrators responsible for the non-SAP systems. The support call needs to be entered
in a second or third service desk and tracked until resolved. In the meantime, the SAP Service
Desk team waits for feedback before closing the call and informing the originator, who is
temporarily left “in the dark”.

Service Manager

An incident can also be reported to the service desks monitoring non-SAP applications and
infrastructure hardware and software. Many SAP customers have integrated these tasks in
Service Manager, which is able to support nearly all IT application and infrastructure
components.

If a support call, for example, pertains to a “printing issue from an SAP application” and the
Service Manager team detects no issue with the printer hardware or software, the call will be
forwarded to the SAP service desk team to check whether it is related to the SAP application.
Again the service call must be re-entered in a service desk, in this case in the SAP Solution
Manager Service Desk. Additional information or attachments regarding the error or error
resolution must be forwarded manually. The Service Manager team has to wait for feedback
before informing the requesting user and closing the call.

In both cases the disconnected service desks and the fragmented incident management
workflow impede the service desk team’s ability to resolve problems. Disadvantages of this
non-integrated workflow are:

     Only limited and often inconsistent information about the incident is available.
     It is difficult to monitor, track and report incidents or to work together toward resolution.
     Manual workarounds are required for the handover of incidents between the SAP and
     non-SAP service desks and for information updates.
     There is insufficient synchronization. The same incident may get reported, recorded and
     tracked in separate service desks, or the incidents may get lost or ‘dropped’.


     Expertise about the interrelationships of SAP applications with non-SAP applications and
     other IT components is lost.
This results in productivity loss and reduced quality of service.


1.3.1.2. Deployment scenarios

High level overview

SMSSMEX integrates a single Service Manager server with multiple external help desk
systems.


Components

The following diagram shows the component details.

Service Manager Server is the OpenText service desk system.
Service Manager DB provides persistent storage for Service Manager.
SMSSMEX Client Code consists of RAD and Java scripts, table definitions and GUI
formats. The SMSSMEX webservices are called from this client code.
WebServer is a Tomcat Web Application Server or WebLogic Application Server that
hosts the SMSSMEX WebService (deployed as a .war file).
SMSSMEX WebService exposes the incident webservice of Service Manager in the SAP
format and transfers client requests to SAP Solution Manager web services.
SMSSMEX Database provides persistent storage for the SMSSMEX WebService.
SAP Solution Manager is the Service Desk.


1.3.1.3. Install and configure SMSSMEX

This chapter describes how to install and configure SMSSMEX.


1.3.1.3.1. Install SMSSMEX

The Service Manager Exchange with SAP Solution Manager product DVD includes an autorun
program for installation.

Prerequisites

It is NOT recommended to install SMSSMEX and Service Manager on the same server.

Install SMSSMEX

   1. Sign in to the operation system as a super user.
   2. The installer is in:

           <SMSSMEX Release Package>\InstData\Windows\install.exe (Windows Server 2008
           and 2012)
           <SMSSMEX Release Package>\InstData\Linux\install.bin (Linux)
   3. Run install.bin or install.exe. The Introduction dialog appears.
   4. Click Next. The license agreement appears.
   5. Select I Accept the terms of License Agreement.
   6. Click Next. The Choose Install Folder page displays. For example, the default installation
     folder on Windows Server 2012 is C:\Program Files (x86)\Micro Focus\SMSSMEX.
   7. Click Next. Review the summary information.
   8. Click Install. The files are installed.
   9. Click Done to close the installer when the Install Complete dialog appears.

Uninstall SMSSMEX

To uninstall SMSSMEX on Windows, execute <SMSSMEX_installDir>\Uninstall
SMSSMEX\Uninstall SMSSMEX.exe or simply go to Start > Programs > SMSSMEX > Uninstall
SMSSMEX.

To uninstall SMSSMEX on Unix, execute <SMSSMEX_installDir>/Uninstall
SMSSMEX/Uninstall_SMSSMEX.

SMSSMEX installed files

After installation, the SMSSMEX folder has the following contents.


Directory                                                                                        Service Manager 9.81
bin
                                        Content
config                                  Executable commands and product
                                        description file
sql
unloads                                 Web service configuration files
log                                     The config\exthd1 folder stores the template
jdk                                     for an external helpdesk configuration
tomcat
Uninstall SMSSMEX                       Database table creation/deletion scripts
                                        Service Manager customization unload files
                                        Log files
                                        Internal JDK 11
                                        Tomcat 9
                                        Executable file for uninstallation


1.3.1.3.2. Configuring Tomcat

The connector for deploying the web service must be enabled. Uncomment the port
specification in <SMSSMEX_installDir>\tomcat\conf\server.xml. For example:

  <Connector port="8080"
  redirectPort="8443"
  maxThreads="150" minSpareThreads="25" maxSpareThreads="75"
  enableLookups="false" acceptCount="100" debug="0"
  connectionTimeout="20000" disableUploadTimeout="true" />

You can modify the ports as necessary.


1.3.1.3.3. Setting up database

This section describes how to setup the database.

            Note

           The SMSSMEX web service uses a database to store metadata. The SMSSMEX
           web service must be able to read table v$database (Oracle) or execute function
           SERVERPROPERTY('ProductVersion') (SQLServer). These system tables are
           queried when validating the database connections.


1.3.1.3.3.1. Oracle

To setup the Oracle database do the following:
   1. Create a user.

2. Give the user the right to do a select on table v$database . This system table is queried
  by the SMSSMEX web service to validate database connections.

3. Login as the user and run the script create_tables_oracle.sql (log in from path
  <SMSSMEX_installDir>\sql so that the script is found). This creates all required tables.

These tables are created within the schema of the database user (the tables are logically
separated and don't interfere with each other).



1.3.1.3.3.2. MS-SQL

Do the following to create the required separate database for SMSSMEX tables:
   1. Launch SQL Server Management Studio.

2. Create a new database ( ovictex ). Right-click on Databases and choose New Database.


3. Create a database user ( ovictexuser ) with permission for database ovictex . Right-click
  on Security/Login and select New Login.



4. Create the SMSSMEX tables.

     1. Click New Query on the toolbar and select database ovictex.
     2. Copy and execute the SQL scripts under folder

        <SMSSMEX_installDir>\sql\create_tables_sqlserver.sql.


1.3.1.3.4. Configuring ovictex.properties

File <SMSSMEX_installDir>/config/ovictex.properties must specify the local helpdesk
installation. The file comments describe how to do this.

            Caution

           To configure the passwords, use command line application
           <SMSSMEX_installDir>/bin/encryptPasswords.bat|sh (don't enter the password
           directly in the file; passwords are stored in encrypted format). There are several
           sensitive fields that must be encrypted. These fields are discussed below. For more
           information about using encryptPasswords.bat|sh , see Tools.

The following parameters must be configured:
     Service Manager web service endpoint
     To connect to Service Manager:

          sc.webservice.endpoint = http://<ServiceManager host>:
          <Port>/sc62server/PWS

     The following are the required parameters:
      sc.user=<web service endpoint access user name>
      sc.password=<encrypted password>

                   Note

                 sc.password must be filled by encryptPasswords.bat|sh . SMSSMEX
                supports SSL connections to Service Manager, but the parameter values are
                different than above and additional parameters must be set (see Security
                between SAP Solution Manager and Tomcat).

     SMSSMEX database configuration information:

          ovictex.db.type= <oracle | sqlserver>
          ovictex.db.host=<database server address>
          ovictex.db.port=<database server port number>
          ovictex.db.instance=<sqlserver database server instance>
          ovictex.db.name=<database name or oracle DB SID>
          ovictex.db.user=<database user name>
          ovictex.db.password=<database password>


            Note

           ovictex.properties contains examples. ovictex.db.password must be filled
           by encryptPasswords.bat|sh .

One or more External Helpdesk instance names.

     Parameters are exthd.instances.id.<number> , where <number> is a number
     {1,…,n}.
     The first number must be 1 and each number must be greater than the previous.
      ExtHdInstanceName differentiates multiple External Helpdesks and is the name of
     the subfolder in <SMSSMEX_installDir>/config and the ExtHd configuration file.
Incident category in Service Manager.
Property ovhd.incident.informationlog.entry.separator should be configured to a unique
value that's not contained in messages exchanged between Helpdesks. By default, it is
configured to " ---- ". Service Manager must be configured to use this separator to
append information to the Journal. If this separator is contained in a message then
duplicate information could be sent to the external Helpdesk (no data is lost).


1.3.1.3.5. Configuring File
ovictexInternal.properties

The property file for internal configurations is in the <SMSSMEX_installDir>/config directory of
the SMSSMEX installation. There is typically no need to configure this file.


1.3.1.3.6. External Helpdesks

Main configuration file <SMSSMEX_installDir>/config/ovictex.properties must define all
External Helpdesk Instances. For example:

      exthd.instances.id.1 = exthd1
      exthd.instances.id.2 = SAP_exthd2
      exthd.instances.id.3 = NY200BM
Each external helpdesk has the following configuration files:

      <ExtHdInstanceName>.properties

          FieldMapping.xml

                   Note

                The same names (such as exthd1 , SAP_exthd2 , NY200BM ) must be used
                for the names of subfolders with specific configuration file names. The names
                must not contain spaces or special characters. The default configuration
                comes with a defined exthd1 sample External Helpdesk configuration.

To create a new instance:

   1. Add a new line in the ovictex.properties file for the new ExtHd.

      exthd.instances.id.2 = exthd2

   2. Create the new subfolder <SMSSMEX_installDir>/config/exthd2.
   3. Copy the configuration files for exthd1 to exthd2 .
   4. Rename <SMSSMEX_installDir>/config/exthd2/exthd1.properties to

     <SMSSMEX_installDir>/config/exthd2/exthd2.properties.
   5. Make the required changes to the new files.


6. The following parameters must be configured in <ExtHdInstanceName>.properties:
   exthd.webservice.endpoint = http://<SolutionManager host>:
  <Port>/sap/bc/srt/rfc/sap/ICT_SERVICE_DESK_API?SAP-CLIENT=<SAP client number>
   exthd.webservice.authentication.scheme = BASIC
   exthd.webservice.authentication.username = <SAP client user name>
   exthd.webservice.authentication.password = <encrypted SAP client user password>
  IMG activity guides you to SAP transaction /nsmicm. Select the activity in menu Goto >
  Services.

  This transaction shows the host and port for access to the SAP Solution Manager Service
  Desk web service. Specify the host/port in <ExtHdInstanceName>.properties as the
  endpoint entry.

               Note

              exthd.webservice.authentication.password must be filled by
              encryptPasswords.bat|sh .


1.3.1.3.7. Configuring FieldMapping.xml

The FieldMapping.xml file, which locates in the
<SMSSMEX_installDir>/config/<ExtHdInstanceName>directory, must be adjusted to
send/receive special/customized fields to/from the external Helpdesk. For detailed information
see Field mapping configuration.


1.3.1.3.8. Verifying Configuration

Verify the configuration with the checker tool before trying to exchange incidents between
Service Manager and SAP Solution Manager. The checker error messages are much more
helpful for troubleshooting than Service Manager and Solution Manager error messages.

To execute the checker, run the following command:

<SMSSMEX_installDir>/bin/checker.bat|sh

Checker checks the environment, database and HTTP connections and configuration of
Service Manager. No incidents are exchanged. The following are the possible results:

     OK
     ERROR (partial failure; checks that the check depends on have failed)
     FAIL (with troubleshooting recommendations)

You can re-run a check by passing the number of the check to the executable. You can also
examine the Incident Exchange log messages or run a trace. For more information about using
checker.bat|sh, see Tools.


1.3.1.3.9. Deploying on WebLogic

1. Before starting the WebLogic server, set an environment variable named
  "SMSSMEX_HOME" to the pathname where this application is installed.

  For example, if the WebLogic server is installed in the /opt/Micro Focus/SMSSMEX
  directory, set the environment variable to the following:

   $ export SMSSMEX_HOME=/opt/MicroFocus/SMSSMEX

2. Start the WebLogic server and launch the WebLogic administration console.

3. Deploy the ovictex.war file in the /opt/MicroFocus/SMSSMEX/war directory. See the
  following steps for an example:

     1. Select Domain Structure > Deployments and click Install.
     2. Use the Install Application Assistant to locate the ovictex.war file.
     3. Select Install this deployment as an application and click Next until last step.
     4. Click Finish to exit the installation wizard.

  For advanced configuration, refer to BEA WebLogic Server Administration Console Online
  Help for more information.

               Note

             We recommend that you deploy SMSSMEX on WebLogic 12 or later because
             there is a known issue QCCR1E128427 for WebLogic 11(version: 10.3.6.0).


1.3.1.3.10. Starting/Stopping SMSSMEX
(Tomcat only)

Starting from Windows:
<SMSSMEX_installDir>\bin\setup startup
Stopping from Windows:
<SMSSMEX_installDir>\bin\setup shutdown
Starting from Linux:
<SMSSMEX_installDir>/bin/setup.sh startup
Stopping from Linux:
<SMSSMEX_installDir>/bin/setup.sh shutdown


1.3.1.4. Upgrading to SMSSMEX V1.40

Follow these stesp to upgrade to SMSSMEX v1.40 on Tomcat:

   1. Stop the SMSSMEX old version.
   2. Back up the following configuration files:

           All files in the <SMSSMEX_installDir>\config folder.
           (Optional) The <SMSSMEX_installDir>\tomcat\conf\server.xml file.

                         Note

                      If you have not customized the Tomcat configurations, skip this step.

           Other configuration files which have been customized.
   3. Backup the database.
   4. Uninstall the SMSSMEX old version.
   5. (Optional) Uninstall OpenView Autopass if it is used by SMSSMEX only. Otherwise, if

     another OpenText product on this computer also use Autopass for license management,
     don't uninstall Autopass.
   6. Install SMSSMEX v1.40.
   7. Configure SMSSMEX v1.40.
     You can copy parameter values from the backup configuration files to configure
     SMSSMEX v1.40. Do not just copy and replace ovictex.properties and FieldMapping.xml
     because these files have been updated in SMSSMEX v1.40.
     For example, some differences between the configuration files in SMSSMEX v1.10 and
     v1.40 are listed as follows:

           SMSSMEX v1.40 adds the following codes to the ovictex.properties file:
            # default category
            ovhd.incident.default.category = incident
           SMSSMEX v1.40 introduces the following code changes to the FieldMapping.xml
           file:


v1.10                                           v1.10 patch 2/v1.40

<FieldMapping                                   <FieldMapping
ExtHDField="IctHead/                            ExtHDField="IctHead/
AgentId">                                       AgentId">
<OutOvHDField>AssigneeName<                     <OutOvHDField>Assignee</Out
/                                               OvHDField>
OutOvHDField>                                   <OutDataType>Person</OutDat
<OutDataType>Person</OutDat                     aType>
aType>                                          <InOvHDField>Assignee</InOv
<InOvHDField>AssigneeName</                     HDField>
InOvHDField>                                    <InDataType>Person</InDataT
<InDataType>Person</InDataT                     ype>
ype>                                            </FieldMapping>
</FieldMapping>

<FieldMapping                                   <FieldMapping
ExtHDField="IctHead/                            ExtHDField="IctHead/
ShortDescription">                              ShortDescription">
<OutOvHDField>BriefDescript                     <OutOvHDField>Title</OutOvH
ion</                                           DField>
OutOvHDField>                                   <InOvHDField>Title</InOvHDF
<InOvHDField>BriefDescripti                     ield>
on</                                            </FieldMapping>
InOvHDField>
</FieldMapping>

<FieldMappingExtHDField="Ic                     <FieldMapping
tIncident                                       ExtHDField="IctIncidentStat
Statement/Text">                                ement/
<OutOvHDField>Resolution</                      Text">
OutOvHDField>                                   <OutOvHDField>Solution</Out
<InOvHDField>Resolution</                       OvHDField>
InOvHDField>                                    <InOvHDField>Solution</InOv
<KeyFieldOutVal>SU99</                          HDField>
KeyFieldOutVal>                                 <KeyFieldOutVal>SU99</KeyFi
<KeyFieldInVal>SU01</KeyFie                     eldOutVal>
ldInVal>                                        <KeyFieldInVal>SU01</KeyFie
</FieldMapping>                                 ldInVal>
                                                </FieldMapping>

8. Manage the license. See License Management.
9. Start SMSSMEX v1.40.
````
