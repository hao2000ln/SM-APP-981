---
source: Document/pdf/v981/Upgrade.pdf
version: 9.81
sections: 1.2.5.2 .. 1.2.7
printed_pages: 37-64
---

# 1.2.5.2 Upgrade Smart Analytics on Linux

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.5.2. Upgrade Smart Analytics on Linux

If you have installed an earlier version of Smart Analytics, follow the instructions in
this section to upgrade to Smart Analytics that is shipped with Service Manager 9.81.

To upgrade your Smart Analytics on a Linux system, follow these steps:

   1. Before you upgrade your Smart Analytics, complete these tasks:

        1. Make sure that all the index tasks are finished.
        2. Stop all the Smart Analytics services.
        3. Back up all the Smart Analytics files.

   2. Obtain the Smart Analytics installer for Linux.

   3. Unpack the .zip file and then execute the binary file
     ( setupSmartAnalyticsLinuxX64.bin ) from the command line.

   4. Read the introduction, and then press Enter.
   5. Read the License Agreement, and then press Enter repeatedly until you see DO

     YOU ACCEPT THE TERMS OF THIS LICENSE AGREEMENTS? (Y/N).
   6. Type Y, and then press Enter.
   7. Type 2 to select Upgrade, and then press Enter.

   8. Choose the version of Smart Analytics installed by typing the corresponding
     number, and then press Enter:

           1-Smart Analytics 9.40
           2-Smart Analytics 9.41
           3-Smart Analytics 9.50 or later

   9. Continue with on-screen instructions, which vary based on the Smart Analytics
     version you selected in the previous step. See the following sections below.

           Smart Analytics 9.40
           Smart Analytics 9.41
           Smart Analytics 9.50 or later
 10. Wait for the installation to complete, and then press Enter to exit the installer.

Smart Analytics 9.40

If you select Smart Analytics 9.40, continue with these steps:

   1. Choose the current architecture of the Smart Analytics installed typing the
     corresponding number, and then press Enter:


        1-Standalone
        2-Distributed

2. Specify the IP address of the machine on which you have installed Service
  Manager server, and then press Enter.

  You need to specify the IP addresses (or hostnames) of the Service Manager
  servers that are permitted to send administrative and query actions to the Smart
  Analytics servers. Use commas to separate multiple addresses (do not use a
  space before or after a comma).

               Note

             Use a valid FQDN or IP address for the server address. Do not use
             the localhost or 127.0.0.1.

3. Select the components that you want to upgrade by typing the corresponding
  numbers. Use commas to separate multiple choices (do not use a space before
  or after a comma). The servers that are available for upgrade vary depending on
  the Smart Analytics architecture you specified.

               Note

                   For Smart Analytics components that were installed in the same
                   root folder, upgrade them at the same time in a single upgrade
                   process. Otherwise, components may not be uninstalled
                   completely when you uninstall Smart Analytics.

                   Upgrade the components separately by performing the
                   upgrade process multiple times under the following conditions:

                         Your current version of Smart Analytics is 9.34
                         The Smart Analytics components to be upgraded are
                         installed in different parent folders or physical machines


Architecture                            Components Available for Upgrade
Standalone
                                        IDOL Server
Distributed                             Media Server

                                        Smart Analytics Proxy
                                        Content Server
                                        Media Server
                                        Media Proxy Server

4. Specify the parent folder where the selected Smart Analytics components are
  installed, and then press Enter.

               Note

                   If you are upgrading the Smart Analytics proxy server, the
                   folder should include the IDOL folder.
                   If you are upgrading a distributed content server, the folder
                   should be the parent of the content folder.

5. Follow the configuration steps to configure the components you selected. Press
  Enter after each configuration step.

               Note

             The number of copies (that is, the value of Replicas plus one) must
             be no more than the number of child servers. If you create more
             copies than there are child servers, DIH does not start.

   6. Check the pre-upgrade summary, and then press Enter.

Post-upgrade actions

Perform the following actions after you upgrade your Smart Analytics:
     When the installation is complete, do the following:


     Check the StartAll.sh and StopAll.sh files under <Smart Analytics
     Installation>/Scripts folder for any commands that start or stop services
     not on your local machine. Delete or comment out such commands and
     then add source ./Start[Service Name of your previous content] or
      source ./Stop[Service Name of your previous content] as needed.
     Delete all the start[Name of Service not on local machine].sh and stop
     [Name of Service not on local machine].sh files under <Smart Analytics
     Installation>/Scripts folder.

If you upgrade from Smart Analytics 9.40 to Smart Analytics 9.81, then during
the upgrade process, the existing configuration files would be renamed to
<component name>.cfg.bak . After you finish the upgrade, compare it with the
new configuration file. If there is any customized change made in the previous
.cfg file and it is still valid, manually add it back to the new .cfg file.

If you upgraded from Smart Analytics 9.40 to Smart Analytics 9.81, you need to
re-index the Hot Topic Analytics data. However, do not start training for Smart
Ticket.

If you upgraded a distributed Smart Analytics proxy server with version 9.40, the
previous configuration files would be renamed to <component name>.cfg.bak ,
and you need to manually modify the following configurations in the
<SmartAnalytics>/IDOL/IDOLServer.cfg file:


Configurations after                    Configurations in your  You need to modify
upgrade                                 previous file           the value to
                                        (<component
VirtualDatabases=1                      name>.cfg.bak)

                                        VirtualDatabases=<x> VirtualDatabases=<x>

[vdb0]                                  [VDB0]                  Do not change
dbname=Users                            DbName=News
type=combinator                         Type=Combinator
mapsto=0:Userss                         MapsTo=0:News


Configurations after                    Configurations in your  You need to modify
upgrade                                 previous file           the value to
                                        (<component
                                        name>.cfg.bak)

                                        [VDB<x>]                [VDB<x>]

                                        DbName=my_database      DbName=my_database
                                        Type=Combinator         Type=Combinator

                                        MapsTo=                 MapsTo=
                                        <y>:my_database         <y+1>:my_database

                                        Note

                                        The
                                        number of
                                        x starts
                                        from 1.


Configurations after                    Configurations in your  You need to modify
upgrade                                 previous file           the value to
                                        (<component
                                        name>.cfg.bak)

                                                                Note

                                                                     You
                                                                     must

                                                                     add
                                                                     the
                                                                     VDB

                                                                     config
                                                                     uratio

                                                                     ns by
                                                                     their
                                                                     numb

                                                                     er
                                                                     seque

                                                                     nce.
                                                                     There
                                                                     may

                                                                     be
                                                                     other

                                                                     conte
                                                                     nt
                                                                     betwe

                                                                     en
                                                                     two
                                                                     VDB

                                                                     config
                                                                     uratio

                                                                     n
                                                                     sectio
                                                                     ns.

                                                                     Make
                                                                     sure

                                                                     the
                                                                     total
                                                                     numb

                                                                     er of
                                                                     the

                                                                     VDB


Configurations after                    Configurations in your  You need to modify
upgrade                                 previous file           the value to
                                        (<component
                                        name>.cfg.bak)                          config
                                                                                uratio
                                                                                n
                                                                                sectio
                                                                                ns
                                                                                equal
                                                                                s to
                                                                                the
                                                                                numb
                                                                                er
                                                                                specif
                                                                                ied in
                                                                                the
                                                                                Virtual
                                                                                Datab
                                                                                ases
                                                                                param
                                                                                eter.
                                                                                There
                                                                                is no
                                                                                differ
                                                                                ence
                                                                                if you
                                                                                use
                                                                                the
                                                                                upper
                                                                                or
                                                                                lower
                                                                                case
                                                                                for
                                                                                the
                                                                                sectio
                                                                                n
                                                                                name
                                                                                of
                                                                                [VDB
                                                                                <x>].


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
Name=Content1                                                    Name=Content<x+1>
Host=127.0.0.1                          Host=12.3.4.56           Host=12.3.4.56
Port=                                                            Port=20010
DistributeByFieldsValue                 Port=20010               DistributeByFieldsValue
s=CONTENT1                                                       s=CONTENT<x+1>
                                        DistributeByFieldsValue
                                        s=CONTENT<x>

                                                    Note

                                                   The
                                                   number of
                                                   x starts
                                                   from 0.


Configurations after                    Configurations in your  You need to modify
upgrade                                 previous file           the value to
                                        (<component
                                        name>.cfg.bak)

                                                                Note

                                                                     You
                                                                     must

                                                                     add
                                                                     the
                                                                     IDOL

                                                                     server
                                                                     config

                                                                     uratio
                                                                     ns by
                                                                     their

                                                                     numb
                                                                     er

                                                                     seque
                                                                     nce.
                                                                     Make

                                                                     sure
                                                                     the

                                                                     total
                                                                     numb
                                                                     er of

                                                                     the
                                                                     IDOL
                                                                     server

                                                                     config
                                                                     uratio

                                                                     n
                                                                     sectio
                                                                     ns

                                                                     equal
                                                                     s to

                                                                     the
                                                                     numb
                                                                     er

                                                                     specif
                                                                     ied in

                                                                     the


Configurations after                    Configurations in your  You need to modify
upgrade                                 previous file           the value to
                                        (<component
                                        name>.cfg.bak)                          [Distri
                                                                                bution
                                                                                IDOLS
                                                                                ervers
                                                                                ]
                                                                                Numb
                                                                                er
                                                                                param
                                                                                eter.

If you upgraded from a distributed Smart Analytics to Smart Analytics 9.81, add
the following lines before the [actions] section in the content[x].cfg file for the
system to clean up expired documents:

  //--------------------------- Schedules --------------------
  --//
  //expire and compact data everyday
  [Schedule]
  Expire=TRUE
  ExpireTime=23:00
  ExpireInterval=24:00

            Note

           With this configured, the system automatically deletes all the expired
           documents at 23:00 every day. By default, the expiration date for
           documents is set to 365 days.

After upgrade your Smart Analytics, you need to manually add */TITLE_INDEX
to the following files if you have scaled out the Content server:

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

Smart Analytics 9.41

If you select Smart Analytics 9.41, continue with these steps:

   1. Specify the parent folder where the current Smart Analytics is installed, and then
     press Enter.

   2. The installer automatically detects and lists which components have been
     installed. Review the detected components, and then press Enter.

   3. Specify content folder names as needed, and then press Enter. By default, the
     installer automatically specifies all the content folder names.

   4. Specify media server folder names as needed, and then press Enter. By default,
     the installer automatically specifies all the media server folder names.

   5. Review the message that Smart Analytics is ready to upgrade, and then press
     Enter.

   6. Check the pre-installation summary, and then press Enter.

Post-upgrade actions

Perform the following actions after you upgrade your Smart Analytics:

     When the installation is complete, do the following:

           Check the StartAll.sh and StopAll.sh files under <Smart Analytics
           Installation>/Scripts folder for any commands that start or stop services
           not on your local machine. Delete or comment out such commands and


     then add source ./Start[Service Name of your previous content] or
      source ./Stop[Service Name of your previous content] as needed.
     Delete all the start[Name of Service not on local machine].sh and stop
     [Name of Service not on local machine].sh files under <Smart Analytics
     Installation>/Scripts folder.
If you upgrade from Service Manager 9.41 to Service Manager 9.81, you need to
do full re-index of Catalog_Library after you upgrade to Smart Analytics 9.80.

If you upgrade from Smart Analytics 9.41 to Smart Analytics 9.81, you need to
manually modify the following configuration sections:

In the <SmartAnalytics>/IDOL/IDOLServer.cfg file:

Existing configurations                 You need to modify the
                                        configuration to

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

                                        You need to modify the
                                        configuration to

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

                                        You need to modify the
                                        configuration to

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


Existing configurations                 You need to modify the
                                        configuration to

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

If you upgraded from a distributed Smart Analytics to Smart Analytics 9.81, add
the following lines before the [actions] section in the content[x].cfg file for the
system to clean up expired documents:

//--------------------------- Schedules --------------------
--//
//expire and compact data everyday
[Schedule]
Expire=TRUE
ExpireTime=23:00
ExpireInterval=24:00


Note

With this configured, the system automatically deletes all the expired
documents at 23:00 every day. By default, the expiration date for
documents is set to 365 days.

After upgrade your Smart Analytics, you need to manually add */TITLE_INDEX
to the following files if you have scaled out the Content server:

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

Smart Analytics 9.50 or later

If you select Smart Analytics 9.50 or later, continue with these steps:

   1. Specify the parent folder where the current Smart Analytics is installed, and then
     press Enter.

   2. The installer automatically detects and lists which components have been
     installed. Review the detected components, and then press Enter.

   3. Specify content folder names as needed, and then press Enter. By default, the
     installer automatically specifies all the content folder names.


   4. Specify media server folder names as needed, and then press Enter. By default,
     the installer automatically specifies all the media server folder names.

   5. Review the message that Smart Analytics is ready to upgrade, and then press
     Enter.

   6. Check the pre-installation summary, and then press Enter.

Post-upgrade actions

Perform the following actions after you upgrade your Smart Analytics:

     When the installation is complete, do the following:

           Check the StartAll.sh and StopAll.sh files under <Smart Analytics
           Installation>/Scripts folder for any commands that start or stop services
           not on your local machine. Delete or comment out such commands and
           then add source ./Start[Service Name of your previous content] or
            source ./Stop[Service Name of your previous content] as needed.
           Delete all the start[Name of Service not on local machine].sh and stop
           [Name of Service not on local machine].sh files under <Smart Analytics
           Installation>/Scripts folder.

     If you upgraded from a distributed Smart Analytics to Smart Analytics 9.81, add
     the following lines before the [actions] section in the content[x].cfg file for the
     system to clean up expired documents:

          //--------------------------- Schedules --------------------
          --//
          //expire and compact data everyday
          [Schedule]
          Expire=TRUE
          ExpireTime=23:00
          ExpireInterval=24:00

                   Note

                With this configured, the system automatically deletes all the expired
                documents at 23:00 every day. By default, the expiration date for
                documents is set to 365 days.

     If you installed Portal Content in Smart Analytics 9.50 or Smart Analytics 9.51,
     you need to manually modify the following configuration sections:


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

     You must add the VDB configurations by their number
     sequence.
     There may be other content between the two VDB
     configuration sections.
     Make sure the total number of the VDB configuration sections
     equals the number specified in the VirtualDatabases parameter.
     There is no difference if you use the upper or lower case for
     the section name of [VDB<x>].

In the <SmartAnalytics>/Content-SMSP/Content-SMSP.cfg file:

Existing configurations                 You need to modify the
                                        configuration to

[Databases]                             [Databases]
NumDBs=<x>                              NumDBs=<x+1>

     Add the following configuration:                           Page 56 of 294

This PDF was generated on May 23, 2026

[Database<x>]
Name=SearchHistory

After upgrade your Smart Analytics, you need to manually add */TITLE_INDEX
to the following files if you have scaled out the Content server:

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


1.2.6. Upgrade Service Manager
Collaboration

Important:

     Collaboration versions earlier than 9.41 (which is base on the legacy Enterprise
     Collaboration Server) are no longer supported. If you are upgrading from the
     legacy EC-based Collaboration, you only need to migrate the EC data. You can
     use the migration tool in Service Manager 9.62 to migrate the EC data to 9.62
     first, and then upgrade to Service Manager 9.80 Collaboration.
     You must upgrade the chat server to version 9.80 if you have upgraded the
     Service Manager server to 9.80.

Upgrade the chat server

Follow these steps to upgrade the chat server to 9.80:

   1. Stop your existing chat server.

   2. (Windows Only) Open a DOS command prompt. Navigate to the %
     OLD_CHAT_SERVER_HOME%\bin directory, and then run the nssm remove
     SmChatServer command to remove the old service.

   3. Make a backup of the following items:

           %OLD_CHAT_SERVER_HOME%\conf\*.*
           %OLD_CHAT_SERVER_HOME%\plugins\lwssoplugin\lwssofmconf.xml
           %OLD_CHAT_SERVER_HOME%\lib\ojdbc-xxxx.jar (the JDBC driver if you
           copied it to this folder before)
           %OLD_CHAT_SERVER_HOME%\resources\security\*.*
           Any other customizations that you made
   4. Save the chat server installer from the Service Manager 9.80 installation
     package to your computer.
   5. Extract the chat-server-9.80.zip file to any folder. For example, C:\chatserver980
     or /opt/chatserver980/. The following sections refer to this directory as
     %CHAT_SERVER_HOME%.

  6. Copy the files you have backed up in step 3 (except lwssofmconf.xml,
     openfire.xml, and security.xml) to the corresponding directories in
     %CHAT_SERVER_HOME%.


                   Note

                      Open the %CHAT_SERVER_HOME%\conf\lwssofmconf.xml file
                      with a text editor, and then make the same changes.
                      Use a diff utility to compare the old out-of-the-box openfire.xml
                      file and the security.xml file to your backed-up version. Make
                      sure to apply your customizations to the new files properly so
                      that you can use these files in your final deployment.
                      As Lync Agent is obsoleted in this release,
                      the <lyncIntegration> section is also removed from the
                      openfire.xml file.

   7. Windows: Run the %CHAT_SERVER_HOME%/bin/install-
     service.bat command to install the Windows service for the new chat server.

     Linux: Open the /etc/sysconfig/openfire file in a text editor, and then change
     value of the environment variable OPENFIRE_HOME to
      %CHAT_SERVER_HOME% .

   8. Start the new chat server.

Upgrade the chat service

Follow these steps to upgrade the chat service to 9.80:

   1. Stop your existing chat service.

   2. (Windows only) Open a DOS command prompt. Navigate to
     %OLD_CHAT_SERVER_HOME%\bin, and then run the nssm remove
     SmChatService command to remove the old service.

   3. Make a backup of the following items:

           %OLD_CHAT_SERVER_HOME%\conf\*.*
           Any other customizations that you made
   4. Save the chat service installer from the Service Manager 9.80 installation
     package to your computer.
   5. Extract the chat-service-9.80.zip file to any folder. For example,
     C:\chatservice980 or /opt/chatservice980/. This directory is referred to as
     %CHAT_SERVICE_HOME% in the sections below.

  6. Copy the files that you have backed up in step 3 (except app.properties and
     config.yml) to the corresponding directories in %CHAT_SERVICE_HOME%.


                   Note

                Use a diff utility to compare the old out-of-the-box app.properties
                file and the config.yml file to your backed-up versions. Make sure
                you have applied your customizations to the new files properly so
                that you can use these files in your final deployment.

                Depending on your deployment type (HTTP or HTTPS), the new files
                to be deployed are in conf\samples\http_only or conf\samples\https.

   7. Windows: Run the %CHAT_SERVICE_HOME%/bin/install-
     service.bat command to install the Windows service for the new chat service.

     Linux: Open the /etc/sysconfig/openfire file in a text editor, and then change
     value of the the environment
     variable CHATMSVC_HOME to %CHAT_SERVICE_HOME% .

   8. Start the chat service.

   9. Sign in to Service Manager as a system administrator, and then click System
     Administration > Ongoing Maintenance > Collaboration Service Desk Chatbot.

 10. Click Search, and then click Publish AIML for every virtual agent.

Upgrade the chat UI

Follow these steps to upgrade the chat UI to 9.80:

   1. Before deploying the new chat UI, make a backup of the following item:
           %CHATUI_HOME%\conf\env.js

   2. Delete or uninstall the existing chatui.war file.
   3. Clear the cache of your web application server.
   4. Deploy the new chatui-9.80.war file. For details, see Task 4: Deploy the End

     User Chat UI.
   5. Copy the env.js file that's backed up in step 1 to the corresponding directory in

     the Chatui folder.
   6. Restart the web application server.


1.2.7. Install platform unloads

A platform component is a component other than the applications, such as the Server,
Windows Client, Web Tier, and Smart Analytics. New features and enhancements
introduced in the latest version of a platform component sometimes require upgrades
to both the component and the applications.

Some customers may select to upgrade only certain platform components and still
run an old version of the applications. For these customers to take full advantage of
the latest version of a platform component, the company provides unload files as
needed in an unloads directory in the installation package of that component. These
unload files contain the application-side changes made for the component, and you
can manually install them in your system.

            Note

           If you plan to upgrade or have already upgraded to the latest applications,
           ignore these unload files, which are already included in the latest
           applications.

The following table lists the unload files for different platform components.


Name         Applications               Applications  Component  Description
             version 9.8x               version 9.7x  Server
OCTCR19X17                                                       Fixes the
72106_SM98   9.80                       9.70, 9.71,              issue that the
0_SM970.unl                             and 9.72                 SM-OMi
                                                                 integration
OCTCR19X17 9.80                         9.70, 9.71,   Server     fails if the
78093_SM98                              and 9.72                 password of
0_SM970.unl                                                      the OMi
                                                                 integration
SmartEmail_S 9.80                       9.70          Server     user is stored
                                                                 encrypted.
M980_SM970
                                                                 Fixes the
.unl                                                             issue that
                                                                 customers
                                                                 can save
                                                                 incorrect
                                                                 date/time
                                                                 values in
                                                                 date/time
                                                                 fields.

                                                                 Fixes
                                                                 OCTFT19X115
                                                                 0262 and
                                                                 supports
                                                                 OAuth2
                                                                 Authenticatio
                                                                 n with
                                                                 Delegated
                                                                 permissions
                                                                 when using
                                                                 EWS to
                                                                 connect to a
                                                                 mailbox for
                                                                 Smart Email.


Name         Applications               Applications  Component  Description
             version 9.8x               version 9.7x  Server
OCTCR19X13                                                       Fixes the
25632_SM98   9.80                       9.70                     issue that
0_SM970.unl                                                      occasionally
                                                                 the system
                                                                 doesn't
                                                                 process a
                                                                 few eventout
                                                                 records and
                                                                 these records
                                                                 remain in the
                                                                 queue.

Review the description of each unload file to determine which unload files are needed
for your system.

For the steps to load an unload into Service Manager, see Load an unload file.
````
