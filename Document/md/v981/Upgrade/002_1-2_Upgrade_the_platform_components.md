---
source: Document/pdf/v981/Upgrade.pdf
version: 9.81
sections: 1.2 .. 1.2.5.1
printed_pages: 8-37
---

# 1.2 Upgrade the platform components

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2. Upgrade the platform components

Before you can upgrade the applications, you must upgrade the Service Manager
Server and Windows Client. Additionally, you may also want to or need to upgrade
other components, such as the Web Tier, or Smart Analytics. In this section, "platform
components" refers to the Service Manager components other than the applications.

            Note

           For an RDBMS upgrade, see your specific database documentation. For
           applications upgrade, see Upgrade the applications.

A platform upgrade may include the following components.
Upgrade the Service Manager Server
Upgrade the Windows Client
Upgrade the Web Tier
Upgrade the Mobility Client
Upgrade Smart Analytics
Upgrade Service Manager Collaboration
Install platform unloads


1.2.1. Upgrade the Service Manager
server

Upgrade from a version earlier than 9.80

To upgrade the Service Manager Server from a version earlier than 9.80 to version
9.81, you must first install Service Manager 9.80, and then upgrade to Service
Manager 9.81. To do this, follow these steps:

  1. Before you install the Service Manager Server, make a backup of your existing
     Server installation folder.

                  Note

                If you have a horizontally scaled system, be sure to back up the
                server installation folder for each server instance.

  2. Install the Service Manager 9.80 Server. For detailed steps, see the "Install
     the Service Manager 9.80 Server" section in Install the Service Manager Server.
     At this point, perform the server installation only and skip the database
     configuration task, which you will need to perform after applying the Service
     Manager 9.81 Server patch.

  3. Merge your old Service Manager Server configuration files in the Server's RUN
     folder, including the sm.ini and sm.cfg files.

                  Note

                If you have changed the smmasterkey storage location in previous
                version (in this case, the sm.ini file doesn't include
                the smmasterkey parameter, and the keystorage parameter is
                flagged as 1), you need to firstly use the sm -keyexport command to
                export the master key, then use the sm -keyimport command to
                migrate the key to the upgraded system. See Import the master key.

  4. If you have configured SSL or single sign-on, you must copy the following files
     from the previous installation folder to the new installation folder (your own
     keystore file names may differ):

          <SM_install>\Server\RUN\cacerts
          <SM_install>\Server\RUN\server.keystore


          <SM_install>\Server\RUN\trustedclients.keystore
  5. Restart the Service Manager server.
  6. Follow the steps in the Upgrade from version 9.80 section to upgrade the Server

     to version 9.81.

Check and update your custom JavaScript code

            Important

           The embedded Mozilla SpiderMonkey JavaScript engine was upgraded to
           a higher version in the 9.80 server. In order to avoid any potential
           problems, you need to check your existing scripts and pay attentions
           when you add new scripts. See JavaScript tailoring guideline.

Upgrade from version 9.80

To upgrade the Service Manager Server from version 9.80, you can use a patch
installation tool or perform the upgrade manually. In addition, you need to upgrade IR
Expert if you have not already done so in a previous upgrade.

Install the rng-tools package

Before you start, you need to ensure that the the rngd service is enabled in the
system if your Service Manager Server is installed on a Linux system, .

The rng-tools package can increase the entropy collected into the /dev/random file
and improve the performance of Service Manager.

If you haven't installed the rng-tools package, run the following command to install:

    For RedHat or Oracle Linux:
    sudo yum install rng-tools
    For SUSE:
    sudo zypper install rng-tools

After you install the rng-tools package, run the systemctl start rngd command to
start the rngd service.

Upgrade the server by using the server patch installation tool

To upgrade the Service Manager server from version 9.80 to version 9.81, follow
these steps:

  1. Stop all Service Manager clients.
  2. Stop the Service Manager Server.


3. Extract the Server patch ( sm9.81.XXXX_Windows_Server.zip or
   sm9.81.XXXX_Linux.tar.xz ) to a directory on the Server host, and then do the
  following:
  Note: You may use the tar -xvf command to extract the .tar.xz file for Linux.

        Windows: Run the PatchSetup.bat file.
        Linux: Run the PatchSetup.sh file. The file is located in the Service
        Manager 9.81 Server patch directory. If you do not have an OpenJDK JRE or
        Oracle JRE installed, you cannot run the PatchSetup.sh file. Instead, you
        need to upgrade the server manually.

               Note

             Running these tools will overwrite the configuration files (such as the
             LWSSO configuration file and XML files for Jgroups) in the RUN
             directory in the Service Manager server installation directory.
             Remember to reapply any changes that you have made to these files
             after you run the patch installation or uninstallation tool.

4. When prompted, enter the full path of the current Service Manager server
  installation directory and the full path of the Service Manager server backup
  directory.

5. Wait for the tool to run. When it has run successfully, the message "Finished
  applying the SM Server patch" is displayed. If the tool cannot run successfully,
  an error message is displayed and the details are recorded in the PatchSetup.log
  file.

6. If you have made any customizations or changes to the original RUN/tomcat
  folder, restore them in the new RUN/tomcat folder.

7. Your old schemastub.xml file (in the <SM_Server_Home>\RUN\km\styles\
  directory) has been updated to a newer version. Either keep your old file by
  copying it back or keep the updated version (a full reindex for the
  knowledgebases is then required).

8. Run the sm -unlockdatabase command.

               Note

              This step is required only the first time you upgrade to 9.30p4 or
             later; it is also required whenever you change the server’s IP address
             after your upgrade to 9.30p4 or later. The purpose of this step is to
             prevent stale license information from being kept in the system. In a
             scaling implementation, you can run this command from any one of
             your servers.


  9. Restart the Service Manager server.
10. Restart the Service Manager clients.

11. Verify the server version by using either of the following methods:

          From the Windows client, click Help > About Service Manager Server.

          From the server's RUN folder, run the sm -version command.

Upgrade the server manually

Instead of running the server patch installation tool, you may still follow the manual
steps used to upgrade earlier versions of Service Manager. However, if you perform
the upgrade manually, you will not be able to use the server patch uninstallation tool
to back out the patch.

Follow these steps to upgrade the server manually:

  1. Stop the Service Manager server.
  2. Backup the Server folder.
  3. Delete the RUN/tomcat directory.
  4. Delete the RUN/lib directory.
  5. Delete the RUN/jre directory. This is to avoid conflicts between the old JRE and

     the new JRE.
  6. Extract the compressed files for your operating system to the main Service

     Manager directory on the server.
  7. (For Linux system only) Execute removeLinks.sh and setupLinks.sh in the RUN

     folder to remove old soft links and setup the new soft links.
  8. If you have made any customizations or changes to the original RUN/tomcat

     folder, restore them in the new RUN/tomcat folder.

(Optional) Upgrade IR Expert

    If you are using the legacy IR search (version before 9.62), you may run the IR
    Upgrade utility to enable the new IR solution. See Upgrade the legacy IR to
    the new IR solution.
    If you are using the new IR solution, after upgrading applications or after adding IR
    keys, you need to regenerate the IR indexes. See Regenerate the IR indexes.


1.2.2. Upgrade the Windows client

To upgrade the Windows client, you need to install the new Windows client. To do
this, follow these steps:

   1. Make a backup copy of the following items of your existing Windows client.

           Your Windows client home folder. For example, C:\Users\
           <username>\ServiceManager . This folder stores your connections and
           personalized settings.

                         Note

                      This is the out-of-the-box home directory, and could differ from
                      yours if you made changes to
                       <Client>\configuration\config.ini file. If so, back up the files
                      from the location specified in that file.

           Your certificate configuration files if any (Window > Preferences > Service
           Manager > Security). For example, your CA certificates file and client
           keystore file.
           The following folder:
            <Client>\plugins\com.hp.ov.sm.client.eclipse.user_x.xx.xxxx\src\resources
           \icons\obj16\ .
   2. Uninstall the existing Windows client. The system retains your connection and
     personalized settings.
   3. Install the new Windows client. For detailed steps, see Install the Service
     Manager Windows Client.
   4. Copy the backup items of your old Windows client to the new Windows client,
     and restore the configurations.
   5. Check the version in Help > About Service Manager.


1.2.3. Upgrade the web tier

Tip:

You can define all context parameters of the web application and initialization
parameters of Servlets from both the web.xml file and the webtier.properties file,
except that you can define the <customize-folder> parameter only in the web.xml file.
The parameters configured in these files take precedence in the following order:

     Custom webtier.properties located in the <customize-folder>/config folder
     Default webtier.properties located in the <web tier>/WEB-INF folder
     The web.xml file located in the <web tier>/WEB-INF folder

You can define web tier parameters in your custom webtier.propteries file to easily
restore your web tier configurations during an upgrade.

To upgrade the Service Manager web tier, follow these steps:

   1. Before deploying the new web tier, make a backup of the following items:

           web.xml file
           application-context.xml
           log4j2.properties
           splash screen
           style sheets
           The folder that's defined in the customize-folder parameter in the web.xml
           file or the <web tier>\WEB-INF\webtier.properties file if the customize-
           folder parameter isn't specified
           any other customizations you made, including your webtier-
           <version>.war file.

   2. Delete or uninstall the existing web tier .war file.

   3. Clear the cache of your web application server.

   4. Deploy the new webtier-x.xx.war file. For details, see Install the Service Manager
     web tier.

                   Note

                It's best practice to deploy with a unique context root. For example,
                /webtier-9.80.


5. Use a diff utility to compare the new web tier’s web.xml and webtier.properties
  files with your backed-up version to make sure that any new parameters are
  properly merged into the files used in your final deployment. Do this for
  application-context.xml as well as any other files you may have customized
  (such as style sheets and splash screens).

6. Make any new customizations that are necessary for your deployment.

7. Restart the web application server.

8. Check the version by clicking the company logo (About Service Manager) icon.

         Caution

        After you upgrade the web tier to version 9.80, if you have deployed the
       web tier behind a reverse proxy or a load balancer, you must set the X-
       Forwarded-Proto and the X-Forwarded-Host request headers
        appropriately in the reverse proxy or in the load balancer. For detailed
        instructions, see Configure a web server to redirect requests to the web
        tier.


1.2.4. Upgrade the Mobility client

To upgrade the Mobility client (also referred to as the "Mobile Applications Client"),
follow these steps:

   1. Make a backup copy of your old Mobility client deployment folder.
   2. Deploy the new Mobility client. For detailed steps, see Install the Mobile

     Applications client.
   3. Restore your old configurations in the new deployment.


1.2.5. Upgrade Smart Analytics

Upgrade path for Smart Analytics installer 9.80

 Smart Analytics Installer Source       How to upgrade to version 9.80
 Version
 9.34                                   Uninstall and reinstall
 9.35
 9.40                                   Uninstall and reinstall
 9.41
 9.50                                   Upgrade using new installer
 9.51
 9.52                                   Upgrade using new installer
 9.60
 9.64.p1                                Upgrade using new installer

 9.70                                   Upgrade using new installer

 9.71.p1                                Upgrade using new installer

Related topics                          Upgrade using new installer

                                        The Smart Analytics 9.71.p1 installer is
                                        basically the same as the 964.p1
                                        installer, except that patch 1 includes a
                                        Confluence connector. Hence, run the
                                        9.71.p1 installer only if you need a
                                        Confluence connector.

                                        The Smart Analytics 9.71.p1 installer is
                                        basically the same as the 9.70 installer,
                                        except that patch 1 includes a
                                        Confluence connector. Hence, run the
                                        9.71.p1 installer only if you need a
                                        Confluence connector.

                                        Upgrade using new installer


Upgrade Smart Analytics on Windows
Upgrade Smart Analytics on Linux


1.2.5.1. Upgrade Smart Analytics on
Windows

If you have installed an earlier version of Smart Analytics, follow the instructions in
this section to upgrade to Smart Analytics that is shipped with Service Manager 9.81.

To upgrade your Smart Analytics, follow these steps:

   1. Before you upgrade your Smart Analytics, complete these tasks:

        1. Make sure that all the index tasks are finished.

        2. Stop and then delete all the Smart Analytics services.

           Note To delete a service, run sc delete "SERVICE_NAME" in the command
           window.

        3. Back up all the Smart Analytics files.

   2. Obtain the Smart Analytics installer for Windows.

   3. Unpack the .zip file and then double-click the setup application
     ( setupSmartAnalyticsWindowsX64.exe ).

   4. Read the introduction, and then click Next.
   5. Read the License Agreement. To continue the installation, select I accept the

     terms of the License Agreement, and then click Next.
   6. Select Upgrade, and then click Next.
   7. Review the message on the Preparation for Upgrade dialog box, and then click

     Next.

   8. Specify the version of Smart Analytics installed by selecting Smart Analytics
     9.40, Smart Analytics 9.41, or Smart Analytics 9.50 or later, and then click
     Next.

   9. Continue with prompted upgrade steps, which vary based on the Smart
     Analytics version you selected in the previous step. See the following sections
     below.

           Smart Analytics 9.40
           Smart Analytics 9.41
           Smart Analytics 9.50 or later
 10. Wait for the upgrade to complete, and then click Done.


Smart Analytics 9.40

If you are upgrading from Smart Analytics 9.40, continue with these steps:

   1. Choose the current architecture of the Smart Analytics installed:

           Standalone
           Distributed

   2. Specify the IP address of the machine on which you have installed Service
     Manager server.

     You need to specify the IP addresses (or host names) of the Service Manager
     servers that are permitted to send administrative and query actions to the Smart
     Analytics servers. Use commas to separate multiple addresses (do not use a
     space before or after a comma).

     Note use a valid FQDN or IP address for the server address. Do not use the
     localhost or 127.0.0.1.

   3. Select the components that you want to upgrade. The servers that are available
     for upgrade vary depending on the Smart Analytics architecture you specified:

     Note

           For Smart Analytics components that were installed in the same root folder,
           upgrade them at the same time in a single upgrade process. Otherwise,
           components may not be uninstalled completely when you uninstall Smart
           Analytics.

           Upgrade the components separately by performing the upgrade process
           multiple times under the following conditions:

                 Your current version of Smart Analytics is 9.34
                 The Smart Analytics components to be upgraded are installed in
                 different parent folders or physical machines


Architecture                            Components Available for Upgrade
Standalone
                                        IDOL Server
Distributed                             Media Server

                                        Smart Analytics Proxy
                                        Content Server
                                        Media Server
                                        Media Proxy Server

   4. Specify the parent folder where the selected Smart Analytics components are
     installed, and then click Next.

     Note

           If you are upgrading the Smart Analytics proxy server, the parent folder
           should include the IDOL folder.
           If you are upgrading a distributed content server, the folder should be the
           parent of the content folder.

   5. Follow the on-screen steps to configure the components you selected. Click
     Next after each step.

     Note The number of copies (that is, the value of Replicas plus one) must be no
     more than the number of child servers. If you create more copies than there are
     child servers, DIH does not start.

   6. Review the pre-installation summary, and then click Install. If you want to
     change your configuration, click Previous.

Post-upgrade actions

Perform the following actions after you upgrade your Smart Analytics:

     When the installation is complete, check the Start.bat and Stop.bat files under
     the <Smart Analytics Installation>/Scripts folder for any commands that start or
     stop services not on your local machine. Delete or comment out such
     commands and then add sc start "[Service Name of your previous content]" or
      sc stop "[Service Name of your previous content]" as needed.


If you upgraded from Smart Analytics 9.40 to Smart Analytics 9.81, then during
the upgrade process, the existing configuration files would be renamed to
<component name>.cfg.bak . After you finish the upgrade, compare it with the
new configuration file. If there is any customized change made in the previous
.cfg file and it is still valid, manually add it back to the new .cfg file.

If you upgraded from Smart Analytics 9.40 to Smart Analytics 9.81, you need to
re-index the Hot Topic Analytics data. However, do not start training for Smart
Ticket.

If you upgraded from a distributed Smart Analytics from 9.40 to Smart Analytics
9.81, add the following lines before the [actions] section in the <Smart
Analytics Installation>/Content#/Content#.cfg file for the system to clean up
expired documents:

  //--------------------------- Schedules --------------------

  --//

  //expire and compact data everyday

  [Schedule]

  Expire=TRUE

  ExpireTime=23:00

  ExpireInterval=24:00

Note With this configured, the system automatically deletes all the expired
documents at 23:00 every day. By default, the expiration date for documents is
set to 365 days.

If you upgraded from a standalone Smart Analytics from 9.40 to Smart Analytics
9.81, you need to manually modify the following configuration in the
<SmartAnalytics>/IDOL/IDOLServer.cfg file:


If you upgraded a distributed Smart Analytics proxy server from 9.40 to Smart
Analytics 9.81, the previous configuration files would be renamed to
<component name>.cfg.bak , and you need to manually modify the following
configurations in the <SmartAnalytics>/IDOL/IDOLServer.cfg file:


Configurations after                    Configurations in your  You need to modify
upgrade                                 previous file           the value to
                                        (<component
VirtualDatabases=1                      name>.cfg.bak)

                                        VirtualDatabases=<x> VirtualDatabases=<x>

[vdb0]                                  [VDB0]                  Do not change
dbname=Users                            DbName=News
type=combinator                         Type=Combinator
mapsto=0:Users                          MapsTo=0:News


Configurations after                    Configurations in your  You need to modify
upgrade                                 previous file           the value to
                                        (<component
                                        name>.cfg.bak)

                                        [VDB<x>]                [VDB<x>]

                                        DbName=my_database      DbName=my_database

                                        Type=Combinator         Type=Combinator

                                        MapsTo=                 MapsTo=
                                        <y>:my_database         <y+1>:my_database

                                        Note The number of x         You must add the
                                        starts from 1.               VDB
                                                                     configurations by
                                                                     their number
                                                                     sequence.
                                                                     There may be
                                                                     other content
                                                                     between two VDB
                                                                     configuration
                                                                     sections.
                                                                     Make sure the
                                                                     total number of
                                                                     the VDB
                                                                     configuration
                                                                     sections equals to
                                                                     the number
                                                                     specified in the
                                                                     VirtualDatabases
                                                                     parameter.
                                                                     There is no
                                                                     difference if you
                                                                     use the upper or
                                                                     lower case for the
                                                                     section name of
                                                                     [VDB<x>].


Configurations after                    Configurations in your  You need to modify
upgrade                                 previous file           the value to
                                        (<component
                                        name>.cfg.bak)

[DistributionIDOLServe [DistributionIDOLServe [DistributionIDOLServe

rs] Number=2                            rs] Number=<x>          rs] Number=<x+1>

[IDOLServer0]                                                   Do not change
Name=SmartSearch
Host=127.0.0.1
Port=20010
DistributeByFieldsValue
s=GlobalSearch


Configurations after                    Configurations in your   You need to modify
upgrade                                 previous file            the value to
                                        (<component
                                        name>.cfg.bak)

[IDOLServer1]                           [IDOLServer<x>]          [IDOLServer<x+1>]
Name=Content1
Host=127.0.0.1                          Host=12.3.4.56           Name=Content<x+1>
Port=
DistributeByFieldsValue                 Port=20010               Host=12.3.4.56
s=CONTENT1
                                        DistributeByFieldsValue  Port=20010
                                        s=CONTENT<x>
                                                                 DistributeByFieldsValue
                                        Note The number of x     s=CONTENT<x+1>
                                        starts from 0.
                                                                 Note

                                                                      You must add the
                                                                      IDOL server
                                                                      configurations by
                                                                      their number
                                                                      sequence.
                                                                      Make sure the
                                                                      total number of
                                                                      the IDOL server
                                                                      configuration
                                                                      sections equals to
                                                                      the number
                                                                      specified in the
                                                                      [DistributionIDOL
                                                                      Servers] Number
                                                                      parameter.

After upgrading your Smart Analytics, you need to manually add
*/TITLE_INDEX to the following files if you have scaled out the Content server:

     <SmartAnalytics>/Content2/Content2.cfg
     <SmartAnalytics>/Content3/Content3.cfg
     <SmartAnalytics>/IDOL/IDOLServer.cfg

You also need to modify the scaled content to add */TITLE_INDEX .

Existing configurations                                                                   Service Manager 9.81

                                        You need to modify the
                                        configuration to

[SetTitleFields]                        [SetTitleFields]
// The one field per                    // The one field per
document that is to be                  document that is to be
stored                                  stored
as the autn:title value                 as the autn:title value
Property=TitleFields                    Property=TitleFields
PropertyFieldCSVs=*/DRETIT              PropertyFieldCSVs=*/DRETIT
LE,*/TITLE,*/DRETITLE_WEIG              LE,*/TITLE,*/DRETITLE_WEIG
HT*,                                    HT*,
*/TITLE_WEIGHT*                         */TITLE_WEIGHT*,*/TITLE_IN
                                        DEX

Smart Analytics 9.41

If you are upgrading from Smart Analytics 9.41, continue with these steps:

   1. Specify the parent folder where the current Smart Analytics is installed, and then
     click Next.

   2. The installer automatically detects and lists which components have been
     installed. Review the detected components, and then click Next.

   3. Specify content folder names as needed. By default, the installer automatically
     specifies all the content folder names.

   4. Specify media server folder names as needed. By default, the installer
     automatically specifies all the media server folder names.

   5. Review the message that Smart Analytics is ready to upgrade, and then click
     Next.

   6. Check the pre-installation summary, and then click Install. If you want to change
     your configuration, click Previous.

Post-upgrade actions

Perform the following actions after you upgrade your Smart Analytics:

     When the installation is complete, check the Start.bat and Stop.bat files under
     the <Smart Analytics Installation>/Scripts folder for any commands that start or
     stop services not on your local machine. Delete or comment out such
     commands and then add sc start "[Service Name of your previous content]" or
      sc stop "[Service Name of your previous content]" as needed.


If you upgrade from Service Manager 9.41 to Service Manager 9.81, you need to
perform full re-index of Catalog_Library after you upgrade to Smart Analytics
9.81.
If you upgraded from a distributed Smart Analytics from 9.41 to Smart Analytics
9.81, add the following lines before the [actions] section in the <Smart
Analytics Installation>/Content#/Content#.cfg file for the system to clean up
expired documents:

  //--------------------------- Schedules --------------------
  --//
  //expire and compact data everyday
  [Schedule]
  Expire=TRUE
  ExpireTime=23:00
  ExpireInterval=24:00

Note With this configured, the system automatically deletes all the expired
documents at 23:00 every day. By default, the expiration date for documents is
set to 365 days.
If you upgrade from Smart Analytics 9.41 to Smart Analytics 9.81, you need to
manually modify the following configuration sections:
In the <SmartAnalytics>/IDOL/IDOLServer.cfg file:

Existing configurations                                                                   Service Manager 9.81

                                        You need modify the configuration
                                        to

[IndexQueue]                            [IndexQueue]
IndexQueueInitialSize=1024              IndexQueueInitialSize=1024
0                                       0
IndexQueueMaxHistorySize=5              IndexQueueMaxHistorySize=1
00                                      0240
IndexQueueMaxPendingItems=              IndexQueueMaxPendingItems=
10240                                   0
[SetDateFields]                         [SetDateFields]
// Fields containing the                // Fields containing the
document date                           document date
Property=DateFields                     Property=DateFields
PropertyFieldCSVs==*/DREDA              PropertyFieldCSVs=*/DREDAT
TE,*/DREDATE_*,*/DATE,*/DA              E,*/DREDATE_*,*/DATE,*/DAT
TE_*,*/*_DATE,*/*_TIME                  E_*,*/*_DATE,*/*_TIME,*/MO
[Logging]                               DIFIED_EPOCH,*/LASTMODIFIE
LogExpireAction=compress                D
LogOldAction=move                       [Logging]
LogMaxSizeKBs=20480                     LogExpireAction=Day
                                        LogMaxOldFiles=7
                                        LogOldAction=delete
                                        LogMaxSizeKBs=102400

In the <SmartAnalytics>/Level2proxy/IDOLServer.cfg file:

Existing configurations                                                                   Service Manager 9.81

                                        You need modify the configuration
                                        to

[Server]                                [Server]
[IndexQueue]                            //store index data on disk
IndexQueueInitialSize=1024              only when the index cache
0                                       is full or when the
IndexQueueMaxHistorySize=5              MaxSyncDelay(120 seconds
00                                      by default) is reached.
IndexQueueMaxPendingItems=              DelayedSync=TRUE
10240                                   [IndexCache]
[Logging]                               IndexCacheMaxSize=102400
LogExpireAction=compress                [IndexQueue]
LogOldAction=move                       IndexQueueInitialSize=1024
LogMaxSizeKBs=20480                     0
                                        IndexQueueMaxHistorySize=1
                                        0240
                                        IndexQueueMaxPendingItems=
                                        0
                                        [Logging]
                                        LogExpireAction=Day
                                        LogMaxOldFiles=7
                                        LogOldAction=delete
                                        LogMaxSizeKBs=102400

In the <SmartAnalytics>/Content<x>/Content<x>.cfg file:

Existing configurations                                                                   Service Manager 9.81

                                        You need modify the configuration
                                        to

[IndexQueue]                            //The amount of memory to
IndexQueueInitialSize=1024              allocate to store the most
0                                       commonly occurring terms.
IndexQueueMaxHistorySize=5              (using 500MB as term cache
00                                      here, recommended range is
IndexQueueMaxPendingItems=              10240 to 2048000. )
10240                                   [TermCache]
[SetDateFields]                         TermCachePersistentKB=5120
// Fields containing the                00
document date                           //------------------------
Property=DateFields                     --- Schedules ------------
PropertyFieldCSVs=*/DREDAT              ----------//
E,*/DREDATE_*,*/DATE,*/DAT              //expire and compact data
E_*,*/*_DATE,*/*_TIME                   everyday
[SetMatchFields]                        [Schedule]
PropertyFieldCSVs=*/*_MATC              Expire=TRUE
H,*/EDK_*,*/*_MATCH_INDEX,              ExpireTime=23:00
*/*_MATCH_WEIGHT*,*/*_BOOL              ExpireInterval=24:00
EAN                                     [IndexQueue]
[Logging]                               IndexQueueInitialSize=1024
LogExpireAction=compress                0
LogOldAction=move                       IndexQueueMaxHistorySize=1
LogMaxSizeKBs=20480                     0240
[LanguageTypes]                         IndexQueueMaxPendingItems=
GenericTransliteration=TRU              0
E                                       [SetDateFields]
Transliteration=false                   // Fields containing the
                                        document date
                                        Property=DateFields
                                        PropertyFieldCSVs=*/DREDAT
                                        E,*/DREDATE_*,*/DATE,*/DAT
                                        E_*,*/*_DATE,*/*_TIME,*/MO
                                        DIFIED_EPOCH,*/LASTMODIFIE
                                        D
                                        [SetMatchFields]
                                        PropertyFieldCSVs=*/*_MATC
                                        H,*/EDK_*,*/*_MATCH_INDEX,
                                        */*_MATCH_WEIGHT*,*/*_BOOL
                                        EAN,*/IMPORTMAGICEXTENSION


Existing configurations                 You need modify the configuration
                                        to

                                          [Logging]
                                          LogExpireAction=Day
                                          LogMaxOldFiles=7
                                          LogOldAction=delete
                                          LogMaxSizeKBs=102400
                                          [LanguageTypes]
                                          GenericTransliteration=TRU
                                          E
                                          Transliteration=true

After you modify the configurations, restart all related Smart Analytics
components of which such configuration are modified. Then, on the machine
where level2proxy is located, reload updated configuration files dynamically and
regenerate match index by visiting the following URLs :

     Reload updated configuration files dynamically:

      http://localhost:20011/DRERESET

     Regenerate the match fields:

      http://localhost:20011/DREREGENERATE?Type=Match

     Wait for a few minutes for the regeneration to complete.

After upgrading your Smart Analytics, you need to manually add
*/TITLE_INDEX to the following files if you have scaled out the Content server:

     <SmartAnalytics>/Content2/Content2.cfg
     <SmartAnalytics>/Content3/Content3.cfg
     <SmartAnalytics>/IDOL/IDOLServer.cfg

You also need to modify the scaled content to add */TITLE_INDEX .

Existing configurations                                                                   Service Manager 9.81

                                        You need to modify the
                                        configuration to

[SetTitleFields]                        [SetTitleFields]
// The one field per                    // The one field per
document that is to be                  document that is to be
stored                                  stored
as the autn:title value                 as the autn:title value
Property=TitleFields                    Property=TitleFields
PropertyFieldCSVs=*/DRETIT              PropertyFieldCSVs=*/DRETIT
LE,*/TITLE,*/DRETITLE_WEIG              LE,*/TITLE,*/DRETITLE_WEIG
HT*,                                    HT*,
*/TITLE_WEIGHT*                         */TITLE_WEIGHT*,*/TITLE_IN
                                        DEX

Smart Analytics 9.50 or later

If you are upgrading from Smart Analytics 9.50 or later, continue with these steps:

   1. Specify the parent folder where the current Smart Analytics is installed, and then
     click Next.

   2. The installer automatically detects and lists which components have been
     installed. Review the detected components, and then click Next.

   3. Specify content folder names as needed. By default, the installer automatically
     specifies all the content folder names.

   4. Specify media server folder names as needed. By default, the installer
     automatically specifies all the media server folder names.

   5. Review the message that Smart Analytics is ready to upgrade, and then click
     Next.

   6. Check the pre-installation summary, and then click Install. If you want to change
     your configuration, click Previous.

Post-upgrade actions

Perform the following actions after you upgrade your Smart Analytics:

     When the installation is complete, check the Start.bat and Stop.bat files under
     the <Smart Analytics Installation>/Scripts folder for any commands that start or
     stop services not on your local machine. Delete or comment out such
     commands and then add sc start "[Service Name of your previous content]" or
      sc stop "[Service Name of your previous content]" as needed.


If you have installed Portal Content in Smart Analytics 9.50 or Smart Analytics
9.51, you need to manually modify the following configuration sections:

In the <SmartAnalytics>/IDOL/IDOLServer.cfg file:

Existing configurations                 You need to modify the
                                        configuration to

//The following parameter               //The following parameter
is required for                         is required for
the DAH if mirrormode is                the DAH if mirrormode is
set to false                            set to false
VirtualDatabases=<x>                    VirtualDatabases=<x+1>

Add the following configuration:

[vdb<x>]
dbname=SearchHistory
type=combinator
mapsto=2:SearchHistory

Note

     You must add the VDB configurations by their number sequence.
     There may be other content between two VDB configuration sections.
     Make sure the total number of the VDB configuration sections equals to the
     number specified in the VirtualDatabases parameter.
     There is no difference if you use the upper or lower case for the section
     name of [VDB<x>].

In the <SmartAnalytics>/Content-SMSP/Content-SMSP.cfg file:

Existing configurations                 You need to modify the
                                        configuration to

     [Databases]                        [Databases]
     NumDBs=<x>                         NumDBs=<x+1>

Add the following configuration:


[Database<x>]
Name=SearchHistory

After upgrading your Smart Analytics, you need to manually add
*/TITLE_INDEX to the following files if you have scaled out the Content server:

     <SmartAnalytics>/Content2/Content2.cfg
     <SmartAnalytics>/Content3/Content3.cfg
     <SmartAnalytics>/IDOL/IDOLServer.cfg

You also need to modify the scaled content to add */TITLE_INDEX .

Existing configurations                 You need to modify the
                                        configuration to

[SetTitleFields]                        [SetTitleFields]
// The one field per                    // The one field per
document that is to be                  document that is to be
stored                                  stored
as the autn:title value                 as the autn:title value
Property=TitleFields                    Property=TitleFields
PropertyFieldCSVs=*/DRETIT              PropertyFieldCSVs=*/DRETIT
LE,*/TITLE,*/DRETITLE_WEIG              LE,*/TITLE,*/DRETITLE_WEIG
HT*,                                    HT*,
*/TITLE_WEIGHT*                         */TITLE_WEIGHT*,*/TITLE_IN
                                        DEX
````
