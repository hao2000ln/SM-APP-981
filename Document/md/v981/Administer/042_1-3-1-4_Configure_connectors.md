---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.3.1.4 .. 1.3.1.6
printed_pages: 956-992
---

# 1.3.1.4 Configure connectors

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.1.4. Configure connectors

User Role: Administrator
To enable search actions among different data sources, you need to configure different
connectors and servers, and monitor their working status. You can get the URL information from
the respective .cfg file of the connectors after you have configured them on your servers.
Configure SharePoint Connector
Configure Web Connector
Configure File System Connector
Configure Oracle Connector
Configure Confluence Connector


1.3.1.4.1. Configure SharePoint Connector

To configure SharePoint Connector, follow these steps:
   1. Make sure that the OMNI Group Server and SharePoint Connector components were
     included when Smart Analytics was installed.

                   Note

                You can install OMNI Group Server and SharePoint connector either along with
                other components by using the All in One install template, or install them
                separately by using the Customize install template through advanced
                installation.

  2. Go to <Smart Analytics Installation>/SharepointRemoteConnector, locate the
      SharepointRemoteConnector.cfg file, and then configure the [FetchTasks] and [MyTask]
     sections as needed.
     Sample code:

          [FetchTasks]
          Number=1
          0=MyTask
          [Default]
          [MyTask]
          SharepointOnline=false
          SharepointUrlType=SiteCollection
          SharepointUrl=http://<SharePoint URL>/
          Username=<username>
          Password=<password>
          IndexSites=true
          IndexLists=true
          IndexFolders=true
          IndexAttachments=true
          IndexUserProfiles=false
          MappedSecurity=true
          EncryptACLEntries=true
          //Domain=DOMAIN
          IncludeProviderNameInACLs=true
          GroupServerDebugOutputFile=SynchronizeGroupsDEBUG.log
          ScheduleCycles=-1
          UseEmailAsGroupName=true

     Sample screenshot:


3. Restart your Smart Analytics SharePoint Connector service.
4. If you want to use OMNI Group Server, continue the following steps:

     1. Go to <Smart Analytics installation>/OmniGroupServer, locate the
         OmniGroupServer.cfg file, and then configure the [LDAP] and [Sharepoint]
        sections as needed
        Sample code:


  [LDAP]
  ActiveDirectory=True
  GroupServerLibrary=ogs_ldap.dll
  //GroupServerCycles=1
  LDAPServer=abc.asciapacific.example.net
  LDAPPort=389
  LDAPUserBase=OU=CN,OU=Users,OU=Accounts,DC=asicapacific,DC=exampl
  e,DC=net
  LDAPGroupBase=CN=PDL@example.com, OU=Managed
  Groups,OU=Accounts,DC=asicapacific,DC=example,DC=net
  //UserFilter=(objectClass=<objectClass>)
  //GroupFilter=(objectClass=<objectClass>)
  LDAPUsername=user@example.com
  LDAPPassword=<password>
  ExtractDomainFromDN=true
  LDAPMode=Group
  PageSize=10000
  KeyUserName=sAMAccountName
  LDAPEnableReverseLookup=true

  [SharePoint]
  GroupServerJobType=Connector
  ConnectorHost=<ConnectorHost>
  ConnectorPort=36000
  ConnectorTask=MyTask

Sample screenshots:


               Note

             Make sure that the value of ConnectorTask is consistent with
              <TaskName> in the [FetchTasks] section of the
              SharepointRemoteConnector.cfg file.

2. Go to <Smart Analytics installation>/IDOL, locate the IDOLServer.cfg file, uncomment
   GroupServerHost and GroupServerPort , and then specify OMNI Group Server Host
  and Port as needed.
  Sample code:

      [SharePoint]
      //Authentication
      Library=C:\Program Files (x86)\OpenText\Service Manager
      9.xx\SmartAnalytics/modules/user_ldapsecurity
      V4=TRUE
      EnableLogging=TRUE
      DocumentSecurity=true
      CaseSensitiveUserNames=False
      CaseSensitiveGroupNames=False
      SecurityFieldCSVs=username,group
      DocumentSecurityType=SharePoint
      GroupServerHost=<GroupServerHost>
      GroupServerPort=5057
      GroupServerRepository=Combine
      //SyncRolesFromGroups=true
      EnableLogging=TRUE
      EscapedEntries=true

  Sample screenshot:

     3. Restart the Smart Analytics Server and the OMNI Group Server services.
5. Sign in to Service Manager, and then click System Administration > Ongoing Maintenance

  > Smart Analytics > Smart Search. The Smart Search configuration page appears.
6. Click the Connector Configuration link to open the connector configuration page.


7. From the CFS Server tab, a list of all CFS server URLs is provided. You can click the Refresh
  Status button to refresh the URL list. Connectors need CFS servers to transfer data, so after
  you add a new connector, the corresponding CFS server information is added to this list.

               Note

             If there two or more connectors that are installed on the same machine and
             share one CFS server, there is no new URLs added to the list.

8. Go to the SharePoint Connector tab, perform the following actions:
        Add a SharePoint connector: Type a configured SharePoint connector URL here. The
        format is http://<Smart Analytics server address>:<SharePoint Connector server
        port>.For example, http://192.168.255.255:36000/. You can click Test connection to
        test the URL connection status, and then click Add to add this URL to the current list.
        Sample screenshot:

            Note

                The "/" at the end of the URL is mandatory.
                Make sure the status for SharePoint is online.
                To get the URL information for the SharePoint connector you have
                configured, check the following configuration file:
                <Smart Analytics
                Installation>/SharepointRemoteConnector/SharepointRemoteConnect
                or.cfg

sAMAccountName Field: Choose the field type from the drop-down list. This field is
the mapping field of SharePoint and SM users.

    If SharePoint on premise is used, configure this field to the domain account field of
    the SM operator table.
    If SharePoint Online is used only, there is no need to set this field as operator email
    field is used for user mapping.
    Sample screenshot:


          Delete: Select a SharePoint connector URL and then click this button to delete it from
          the list.
          Refresh Status: Click to refresh the status of the URL list.
 9. From the OMNI Group Server tab, a Repository list of all OMNI group servers is provided.
    OMNI Group Server provides the LDAP configuration information which may be required for
    SharePoint sign in. You can also check the target task of a repository and its working status.
    You can click the Refresh Status button to refresh the URL list.
10. (For Security SharePoint), go to <Smart Analytics installation>/OmniGroupServer, locate the
     OmniGroupServer.cfg file, and specify FiledName0 to the option you selected for the
    sAMAccountName Field.

    Sample code:

        ExtractDomainFromDN=true
        LDAPMode=Group
        PageSize=10000
        KeyUserName=sAMAccountName
        LDAPEnableReserveLookup=true
        KeyGroupName=mail
        KeyMember=member
        LDAPDebugLogging=TRUE
        FieldKey0=sAMAccountName
        FieldName0=Email
        FieldKey1=mail
        FieldName1=mail
        FieldKey2=cn
        FieldName2=cn
        GroupServerMaxDatastoreQueue=100000
        //remove domain prefix for groups
        GroupServerOp0=StartAfter
        GroupServerOpParam0=0;\
        GroupServerOpApplyTo0=GROUP
        //Just to avoid unnecessary queries for members that don't exist.
        //This might not have any effect if the group members are properly
        managed.
        DisableUserFromDNSearch=TRUE
        DisableGroupFromDNSearch=TRUE


Sample screenshot:

11. Restart the Smart Analytics OMNI Group Server service.

12. Do the following to add a splib library for the sharepoint connector:

       1. go to Smart Search Configuration page.
       2. Specify Knowledgebase Name,
       3. Select splib for Type

       4. Click Add. The Knowledgebase Maintenance page opens.

13. Specify Connector and Task, and then select the Do not use OmniGroupServer for access
    count checkbox.


14. Click Save.
15. Click Full Reindex and Refresh Status.
16. You can perform the search when the status changes to Indexing and Doc Count for this

    library is greater than 1.

                 Note

               Sign out and then sign in to your Service Manager again if you can't find the
               library in your Smart Search library list.


1.3.1.4.2. Configure Web Connector

To configure the Web Connector, follow these steps:
   1. Make sure that the Web Connector component was included when Smart Analytics was
     installed.

                   Note

                You can install Web Connector either along with other components by using the
                All in One install template or install the connector separately by using the
                Customize install template through advanced installation. For more details, see
                section of Advanced Installation in Install Smart Analytics

  2. Go to <Smart Analytics Installation>/WebConnector, locate the WebConnector.cfg file, and
     then configure the [FetchTasks] and [ MyTask ] sections as needed.
     See IDOL 12.3 Documentation for detailed information.
     Sample code for one task:

          [FetchTasks]
          SSLMethod=SSLV23
          Number=1
          0=MyTask
          WkoopPath=WKOOP/WKOOP.exe

          [MyTask]
          Url=http://www.example.com/
          SpiderUrlCantHaveRegex=.*\.css|.*\.js|.*.js\?.*
          StayOnSite=True
          Depth=99
          ProxyHost=<ProxyHost>
          ProxyPort=8080
          ...

     To configure multiple tasks, for example, two tasks, configure the .cfg file as follows:


  [FetchTasks]
  SSLMethod=SSLV23
  Number=2
  0=MyTask1
  1=MyTask2
  WkoopPath=WKOOP/WKOOP.exe

  [MyTask1]
  ...

  [MyTask2]
  ...

The following table describes the parameters of the [ MyTask ] section in the
webconnector.cfg file. If you want to configure multiple tasks for one connector, you just
need to copy the content in the [ MyTask ] section and rename the section.

Parameter                                                                                   Service Manager 9.81
Url
SpiderUrlCantHaveRegex                  Description
UrlMustHaveRegex
                                        The URL of the page to start crawling
UrlCantHaveRegex                        from. You can specify multiple URLs to
                                        start crawling from by setting a comma-
PageMustHaveRegex                       separated list of values or using a
PageCantHaveRegex                       numbered list of parameters (Url0=, Url1=,
                                        and so on).

                                        A regular expression to restrict the pages
                                        that are crawled by the connector. The full
                                        URL of a page must match the regular
                                        expression, otherwise it is not
                                        downloaded, crawled, or ingested.

                                        A regular expression to restrict the content
                                        retrieved by the connector. The full URL of
                                        a page must match the regular expression,
                                        otherwise the page is not ingested. This
                                        parameter applies to all file types, for
                                        example HTML pages, images, text
                                        documents, and so on.

                                        A regular expression to restrict the content
                                        retrieved by the connector. If the full URL
                                        of a page matches the regular expression,
                                        the page is not ingested. This parameter
                                        applies to all file types, for example HTML
                                        pages, images, text documents, and so
                                        on.

                                        A regular expression to restrict the content
                                        retrieved by the connector. The content of
                                        a page must match the regular expression,
                                        otherwise the page is not ingested. This
                                        parameter applies to all file types.

                                        A regular expression to restrict the content
                                        retrieved by the connector. If the content
                                        of a page matches the regular expression,
                                        the page is not ingested. This parameter
                                        applies to all file types.

       Parameter                                                                            Service Manager 9.81
        ContentTypeMustHaveRegex
       ContentTypeCantHaveRegex         Description

        PageDelay                       The connector can also accept or reject
                                        pages based on the Content-Type
        StayOnSite                      header that is returned with the page. This
        SiteDuration                    a good way to filter out certain types of
        MaxPages                        content, such as scripts. The
        MinPageSize                     ContentTypeCantHaveRegex and
        MaxPageSize                     ContentTypeMustHaveRegex parameters
        MaxLinksPerPage                 are also set as regular expressions. The
                                        following example is a good starting point
This PDF was generated on May 23, 2026  that attempts to filter out stylesheets,
                                        XML, and javascript files:
                                        ContentTypeCantHaveRegex=
                                        (application|text)/(javascript|xml|x-
                                        javascript|css)(;.*)?

                                        Specify a time interval that a synchronize
                                        thread must wait between requests. If you
                                        set a delay of 5 seconds ( PageDelay=
                                        5s ), each synchronize thread must wait at
                                        least one second between requests.

                                        When StayOnSite=TRUE , the connector
                                        doesn't follow links to other sites,
                                        including other sub-domains of the same
                                        site.

                                        Maximum ammount of time to spend
                                        crawling, 0 indicating unlimited.

                                        Maximum number of pages to ingest per
                                        synchronize run, 0 indicating unlimited.

                                        Minimum size that a page must be for it to
                                        be ingested.

                                        Maximum size that a page must be for it to
                                        be ingested, 0 indicating unlimited

                                        Maximum number of links a page can
                                        have before it is not ingested, 0 indicating
                                        unlimited.

                                                                                                                     Page 59 of 279
       Parameter                                                                            Service Manager 9.81
        FollowRobotProtocol
        UserAgent                       Description
        Depth
                                        If FollowRobotProtocol=true, the system
        FollowFlash                     will follow robots.txt and ROBOTS meta
        LinkElementMustHaveRegex        tag commands.
       LinkElementCantHaveRegex
                                        The UserAgent sent in the request
        LinkAttributes                  headers. For example, UserAgent=Autn-
        Clipped                         WKOOP

This PDF was generated on May 23, 2026  The maximum depth to which the
                                        connector follows links when crawling. For
                                        example, to index all pages that can be
                                        reached from the Url by following no more
                                        than three links, set Depth=3. If the value
                                        of this parameter is set to -1, there is no
                                        limit for the maximum depth.

                                        If FollowFlash=true, the system will follow
                                        links found in flash content.

                                        Regexes to restrict which element types
                                        are crawled for links.

                                        For example, you can use the
                                        LinkElementMustHaveRegex and
                                        LinkAttributes parameters to follow only
                                        certain types of hyperlinks (in this
                                        example, <a href="..."> ) in the page
                                        source. LinkElementMustHaveRegex is
                                        set as a regular expression and
                                        LinkAttributes accepts a comma-
                                        separated list of attribute names:

                                        LinkElementMustHaveRegex=^a$

                                                            LinkAttributes=href

                                        HTML tag attribute names to be treated as
                                        containing a link to be followed. For
                                        example, LinkAttributes=href

                                        This parameter is used to enable web
                                        page clipping. To clip pages automatically,
                                        add Clipped=TRUE to your task
                                        configuration.

                                                                                                                     Page 60 of 279

Parameter                               Description
ClipPageUsingCssSelect
ClipPageUsingCssUnselect                If Clipped=true , the area of the page that
IgnoreCanonicalLinks                    is kept/removed can be specified using
RedirectAsLink                          css2 selectors.
                                        If these parameters are left empty, the
IncludeMetaTagsInMetadata               SmartPrint algorithm is used to determine
                                        which parts of the page are kept/removed.
IncludeLinksInMetadata
MetadataSelector0                       Set IgnoreCanonicalLinks=true to ignore
                                        canonical links in web page headers or
                    MetadataFieldName0  meta tags.
MetadataSelectorExtractPlainText
                                        If RedirectAsLink=true , the system will
RemoveScripts                           treat redirection as a page with a single
RemoveNoscripts                         link that should be followed, but not
                                        ingested so that content from a single
                                        redirection target from multiple source
                                        pages is not duplicated across multiple
                                        documents.

                                        Set IncludeMetaTagsInMetadata=true to
                                        include a metadata field for each <meta
                                        name=".." content="..." /> element in the
                                        html head.

                                        Set IncludeLinksInMetadata=true to
                                        include a LINK metadata field for each
                                        link found on a page.

                                        Extract custom metadata from each page
                                        using css2 selectors.

                                        Set
                                        MetadataSelectorExtractPlainText=true
                                        to extract plain text from the HTML
                                        elements identified by the
                                        MetadataSelector parameters above.

                                        Set RemoveScripts=true to remove all
                                        <script> elements from indexed pages.

                                        Set RemoveNoscripts=true to remove all
                                        <noscript> elements from indexed
                                        pages.


Parameter                               Description
RemoveNoframes
                                        Set RemoveNoframes=true to remove all
RankPages                               <noframes> elements from indexed
                                        pages.
ProxyHost
                                        If RankPages=true , the system will add
ProxyPort                               a AUTN_RANK field to indexed pages,
ProxyUsername                           giving each a rank based on a number of
                                        factors.
ProxyPassword
                                        The hostname or IP address of the proxy
AuthUser                                server to use. For example,
                                        ProxyHost=PROXY.COM
                AuthPassword
                                        The port of the proxy server to use. For
                                        example, ProxyPort=80

                                        The user name to use to authenticate with
                                        the proxy server. For example,
                                        ProxyUsername=username

                                        The password to use to authenticate with
                                        the proxy server. For example,
                                        ProxyPassword=password

                                        To sign in to a Web site that uses Basic,
                                        HTTP Digest, or NTLM version 2
                                        authentication, specify a username and
                                        password by setting the configuration
                                        parameters AuthUser and AuthPassword.
                                        For example:
                                        AuthUser=user

                                        AuthPassword=pass

3. Restart the Smart Analytics Web Connector service.
4. Sign in to Service Manager, and then click System Administration > Ongoing Maintenance

  > Smart Analytics > Smart Search. The Smart Search configuration page appears.
5. Click the Connector Configuration link to open the connector configuration page.

6. From the Web Connector tab, a list of all connector URLs and their status is provided. You
  can perform the following actions:

        Add a web connector: Type a new Web connector URL here. The format is
        http://<Smart Analytics server address>:<Web Connector server port>. For example,


          http://192.168.255.255:5678/. You can click Test connection to test the URL
          connection status, and click Add to add this URL to the current list.

                        Note

                          The “/” at the end of the URL is mandatory.
                          Make sure the status for the web connector URL is online.
                          To get the URL information for the web connector you have
                          configured, check the following configuration file:
                          <Smart Analytics Installation>/WebConnector/WebConnector.cfg

          Delete: Select a web connector URL, and then click this button to delete it from the list.
          Refresh Status: Click to refresh the status of the URL list.
 7. Do the following to add a weblib library for the web connector:
       1. Go to Smart Search Configuration page.
       2. Specify Knowledgebase Name
       3. Select weblib for Type,
       4. Click Add. The Knowledgebase Maintenance page opens.
 8. Specify Connector and Task.
 9. Click Save.
10. Click Full Reindex and Refresh Status.

11. You can perform the search when the status changes to Indexing and Doc Count for this
    library is greater than 1.


Note

Sign out and then sign in to your Service Manager again if you can't find the
weblib library in your Smart Search library list.


1.3.1.4.3. Configure File System Connector

To configure File System Connector, follow these steps:
   1. Make sure that the Smart Analytics installation includes the File System Connector
     component.

                   Note

                You can install File System Connector either along with other components by
                using the All in One install template, or install the connector solely by using the
                Customize install template through advanced installation.

  2. Go to <Smart Analytics Installation>/FileSystemConnector , locate the
      filesystemconnector.cfg file, and then configure the [FetchTasks] and [MyTask]
     sections as needed.
     Sample code:


  [FetchTasks]
  Number=1
  0=MYTASK
  [MYTASK]
  //specifies the interval (in seconds) between scheduled synchronize
  actions.
  ScheduleRepeatSecs=300
  //specifies whether the connector searches subfolders.
  DirectoryRecursive=TRUE
  //The DirectoryPathCSVs parameter specifies a comma-separated list of
  folders to search for files.
  DirectoryPathCSVs=\\JORA7\ShareDirectory
  //A regular expression that specifies the folders to search for
  files. The connector only searches folders
  //that are within the location specified by DirectoryPathCSVs
  //where the full path of the folder matches the regular expression
  //where the full path of all parent folders (up to the folder
  specified by DirectoryPathCSVs) match the regular expression.
  PathCrawlRegex=.*
  //A regular expression that specifies the folders to ignore. The
  connector ignores any folders where the path matches the regular
  expression.
  //If a folder is ignored, all of its subfolders are also ignored.
  //PathCrawlRegex=
  //The DirectoryFileMatch parameter limits the files that are
  retrieved by the connector. The value of this parameter is a wildcard
  expression
  //The filename of a file must match the wildcard expression,
  otherwise the file is ignored. default to all files
  DirectoryFileMatch=*.pdf,*.doc,*.ppt,*.log

Sample screenshot:

   3. Save your changes, and then restart the File System Connector service.  Page 66 of 279

This PDF was generated on May 23, 2026

4. Sign in to Service Manager, and then click System Administration > Ongoing Maintenance
  > Smart Analytics > Smart Search. The Smart Search configuration page appears.

5. Click the Connector Configuration link to open the connector configuration page.

6. The File System Connector tab provides a list of all connector URLs and their status. You
  can perform the following actions:

        Add a File system connector: Type a new file system connector URL here. The format
        is http://<Smart Analytics server address>:<File System Connector server port> . For
        example, http://192.168.255.255:1234/ . You can click Test connection to test the URL
        connection status, and click Add to add this URL to the current list.

                      Note

                         The “/” at the end of the URL is mandatory.
                         Make sure the task status is online.
                         To get the URL information for the file system connector you have
                         configured, check the following configuration file:
                          <Smart Analytics
                         Installation>/FileSystemConnector/filesystemconnector.cfg

        Delete: Select a file system connector URL, and then click this button to delete it from
        the list.
        Refresh Status: Click to refresh the status of the URL list.

               Note

             When the fileserver connectors (including CFS server) and the fileserver share
             folders are on the same machine, Service Manager supports the Uniform
             Naming Convention (UNC) path ( DirectoryPathCSVs=\\path\to\shared\folder )
             by using the web browser.

7. Do the following to add a fsyslib library for the file system connector:
     1. Go to Smart Search Configuration page.
     2. Specify Knowledgebase Name.


3. Select fsylib for Type.
4. Click Add. The Knowledgebase Maintenance page opens.

 8. Specify Connector and Task.
 9. Click Save.

10. Click Full Reindex and Refresh Status.

11. You can perform a search when the status changes to Indexing and Doc Count for this
    library is greater than 1.

                 Note

               Sign out and then sign in to your Service Manager again if you can't find weblib
               library in your Smart Search library list.


1.3.1.4.4. Configure Oracle Connector

To install and configure the Oracle Connector, follow these steps:

   1. Stop Service Manager and Smart Analytics.
   2. Follow these steps to install the Oracle Client:

                   Note

                      This step uses the Linux operating system as an example.
                      To retrieve information from an Oracle database, you must install Oracle
                      Client version 11 on the same computer where you have installed the IDOL
                      Oracle connector. The connector can use the Oracle Client version 11
                      libraries to retrieve information from Oracle Database version 9, 10, or 11.

        1. Sign in to the Linux server where you have installed Smart Analytics.
        2. Download the Oracle Client 11.1.0.7.0 (64-bit) zip file for Linux from the following Oracle

           website:
           https://www.oracle.com/database/technologies/instant-client/linux-x86-32-
           downloads.html
           You can only use this Oracle Client version for the IDOL Oracle Connector.
        3. Unzip instantclient-basic-linux-11.1.0.7.0.zip and instantclient-sqlplus-linux-
           11.1.0.7.0.zip into the same directory. For example, ../OracleClient/ .
        4. Navigate to ../OracleClient/instantclient_11_1/ , and then create the network/admin
           directory . Copy the tnsnames.ora file from Oracle database to
            ../OracleClient/instantclient_11_1/network/admin/ .
        5. Configure the environment variables for the Oracle client.
           For example, modify /etc/profile as follows if you are using CentOS, and then run the
           source /etc/profile command.

                 export ORACLE_HOME=/root/OracleClient/instantclient_11_1
                 export LD_LIBRARY_PATH=LD_LIBRARY_PATH:$ORACLE_HOME
                 export PATH=$PATH:${K8S_HOME}/bin:$ORACLE_HOME

        6. Check LD_LIBRARY_PATH by running the echo $LD_LIBRARY_PATH command. The
           output is /root /OracleClient/instantclient_11_1 .

        7. Verify the Oracle Client installation.
           For example, the following screenshot illustrates a successful Oracle Client installation:


3. Install the IDOL Oracle Connector.

               Note

             This step uses the Linux operating system as an example.

     1. Sign in to the Linux server where you have installed Smart Analytics.
     2. Refer to Install Smart Analytics on Linux to install the Oracle connector. Make sure that

        you select Advanced install as your installation type, and then select Oracle
        Connector in the Choose Distributed Components step.
     3. Navigate to the ../OracleConnector directory, and then open the
         OracleConnector.cfg file. You can update the ConnectionString value as necessary.
        For more information, refer to the Documentation.zip file in the Oracle Connector
        installation directory.
     4. Update the SQL query according to your requirements.
     5. You also can add a task for another query. Refer to the following sample codes:

             Number=2
             0=mytask
             1=mytask1
             [mytask1]
             IngestActions=LUA:okmparse.lua
             ConnectionString = username/passwords@net_service_name
             #used your own Oracle username,passwords and net_service_name.
             SQL=select field_names from table_name
             PrimaryKeys=PK_field
             Template=template.tmpl
             SubTables= sub_table
             [sub_table]
             Template=sub.tmpl
             SQL=sub_query

4. Start the IDOL Oracle Connector.


               Note

             This step uses the Linux operating system as an example.

     1. Start Service Manager and Smart Analytics.
     2. Navigate to the ../OracleConnectorCFS directory, and then run the

        StartOracleConnector.sh command to start the Oracle Connector Connector
        Framework Server (CFS).
5. Configure the IDOL Oracle Connector.
     1. Sign in to Service Manager as a system administrator, and then click System
        Administration > Ongoing Maintenance > Smart Analytics > Smart Search. The
        Smart Search configuration page appears.
     2. Click the Connector Configuration link to open the connector configuration page.
     3. Go to the Oracle Connector tab, type a configured Oracle connector URL in the Add
        an Oracle connector field. For example, http://<hostname.domain>:5555/ . You can
        click Test connection to test the URL connection status, and then click Add to add this
        URL to the current list. Note that the connector's status must be Online.
        Sample screenshot:

6. Do the following to add an okmlib library for the Oracle connector:
     1. Go to the Smart Search Configuration page.
     2. Specify the Knowledgebase Name.
     3. Select okmlib for Type.
     4. Click Add. The Knowledgebase Maintenance page opens.
     5. Specify Connector URL, Task, and Refresh Interval.


     6. Click Save.
7. (Optional) Modify the Knowledgebase access script if you want to further control access

  permissions to this Oracle knowledge base.

  For example, you can add the following codes to prevent the ESS users from accessing the
  okm_test1 library:

      if (system.functions.nullsub(vars.$G_ess,false))
                        return false;

      else
      return true;

8. Modify the Knowledgebase feature script to further configure the current Oracle knowledge
  base.
     1. The Oracle KM view base url is the base URL for the article page in the Oracle KM
        system. For example: https://<FQDN>/infocenter/index . You can configure the Oracle
        KM application base URL in the getOKMViewUrl function.
     2. You can configure the Lua script in the getOKMParseScriptName function. For more
        information about how to apply the Lua script to manipulate documents, refer to the
         Documentation.zip file in the Oracle Connector installation directory.

9. Click Full Reindex and Refresh Status.


1.3.1.4.5. Configure Confluence Connector

To configure Confluence Connector, follow these steps:
   1. Make sure that the Confluence Connector components are included when you install Smart
     Analytics.

                   Note

                You can install the Confluence connector either along with other components by
                using the All in One install template or install them separately by using the
                Customize install template through advanced installation. For more details, see
                the Advanced Installation section in Install Smart Analytics.

  2. Go to the <Smart Analytics Installation>/ConfluenceRESTConnector directory. Locate the
      ConfluenceRESTConnector.cfg file, and then configure the [FetchTasks] and [MyTask]
     sections as needed.
     Sample code:


  [FetchTasks]
  Number=2
  0=CloudConfluence
  1=OnPremisesConfluence

  [CloudConfluence]
  MappedSecurity=false
  UseSecureConnection=true
  ConfluenceHost=<cloud Confluence url(For example,
  mfli.atlassian.net)>
  ConfluencePort=443
  BasicUsername=<cloud Confluence user name>
  BasicPassword=<cloud Confluence api token>
  //if we need to use proxy
  //ProxyHost=
  //ProxyPort=
  KMSourceIdentityName=confluenceCloud
  SSLConfig=SSLSettings
  ConfluenceApiRoot=wiki

  [SSLSettings]
  SSLMethod=TLSV1.3
  SSLCACertificate=cloud.cer

  [OnPremisesConfluence]
  MappedSecurity=false
  UseSecureConnection=false
  ConfluenceHost=<Confluence IP or host>
  ConfluencePort=<Confluence port. Default is 8090>
  BasicUsername=<Confluence user name>
  BasicPassword=<Confluence password>
  //ignore all attachment
  AttachmentCantHaveRegex=.*.*

In this example, you can configure one for more tasks for cloud or on-premises Confluence.
The basicpassword value for cloud is the API token. You need to visit
https://id.atlassian.com/manage-profile/security/api-tokens to create an API token, and then
use this API token as the password. Meanwhile, you can encrypt the BasicPassword value.
For detailed instructions, download the Confluence REST Connector document and then
refer to the Encrypt Passwords section.
The cloud Confluence also needs SSL configurations and SSLCACertificate is a certificate
file that locates in <Smart Analytics Installation>/ConfluenceRESTConnector. In the above
example, the value for SSLCACertificate is cloud.cer . To generate this file, follow these
steps:


1. Open the cloud Confluence URL in a web browser. For example, mfli.atlassian.net.
2. Click the View site information (lock) icon from the address bar and then select

  Certificate.
3. Click the Certification Path tab to view the certificate chain. You need to export all

  certificates except the last one. In this example, you need to export two certificates:
  DigiCert and DigiCert SHA2 High Assurance Server CA.

        First, export the DigiCert certificate. Select the DigiCert certificate, click View
        Certificate, and then click Copy to File… on the Details tab.
        Click Next, and then select the Base-64 encoded X.509(.CER) format to export the
        certificate to a file. For example, 01.cer .
        Similarly, export the second certificate to a file. For example, 02.cer .

     4. Open the two certificate files in a text editor. Copy and append the content of 01.cer
        to the content of 02.cer , and then save the 02.cer file.
        Now, the 02.cer file is the certificate file you need. Rename it to cloud.cer if you are
        using cloud.er in the cfg file.

     5. Copy cloud.cer to the ;<Smart Analytics Installation>/ConfluenceRESTConnector
        directory.

3. Restart your Smart Analytics Confluence Connector service.


4. Go to <Smart Analytics installation>/IDOL, and then open the IDOLServer.cfg file. Add the
  following line under the [Server] section.

      HasConfluence=true

  Save your changes. Don't restart IDOL. Sign out and then sign in to Service Manager again.
5. Sign in to Service Manager, and then click System Administration > Ongoing Maintenance

  > Smart Analytics > Smart Search. The Smart Search configuration page opens.
6. Click the Connector Configuration link to open the connector configuration page.
7. Go to the Confluence Connector tab, perform the following actions:

        Add a Confluence connector: Type a configured Confluence connector URL here. The
        format is http://<Confluence Connector server address>:<Confluence Connector
        server port>. For example, http://192.168.3.4:7128/. You can click Test connection to
        test the URL connection status, and then click Add to add this URL to the current list.
        Sample screenshot:

                      Note

                         The "/" at the end of the URL is mandatory.
                         Make sure the status for Confluence is online.
                         To get the URL information for the Confluence connector you have
                        configured, check the <Smart Analytics
                        Installation>/ConfluenceRESTConnector/ConfluenceRESTConnector.
                         cfg configuration file.

        Delete: Select a Confluence connector URL and then click this button to delete it from
        the list.
        Refresh Status: Click to refresh the status of the URL list.

8. Do the following to add a confluencelib library for the Confluence connector:

     1. Go to Smart Search Configuration page.
     2. Specify Knowledgebase Name,
     3. Select confluencelib for Type
     4. Click Add. The Knowledgebase Maintenance page opens.


9. Specify Connector and Task, and then select the Do not use OmniGroupServer for access
  control checkbox.

    For cloud Confluence, you must select the Do not use OmniGroupServer for access control
    checkbox for access control.

    For on-premises confluence, you can unselect the Do not use OmniGroupServer for
    access control checkbox. This implies that you will use OmniGroupServer for access
    control. The system reads user information from OmniGroupServer and only allows these
    users to search for documents. If you unselect select this checkbox, you must perform the
    following steps:

       1. Change MappedSecurity=true in the Confluence connector configuration file.
       2. Install and configure OmniGroupServer by following similar procedures for the

          Sharepoint connector.
       3. Add GroupServer configuration to the Confluence connector configuration file. Refer

          to the Confluence REST Connector document for detailed instructions.
       4. Install the security plugin for on-premises Confluence. You can find the plugin at

          <Smart Analytics Installation>/
          ConfluenceRESTConnector/MicroFocusConfluenceConnectorSecurityPlugin.jar .
10. Click Save.
11. Click Full Reindex and Refresh Status.


12. You can perform the search when the status changes to Indexing and Doc Count for this
    library is greater than 1.


1.3.1.5. Configure Smart Search

User Role: System Administrator

Note: As of Service Manager version 9.6x, Smart Search can be used without a Smart Analytics
license. However, to enable Smart Search without the need for a Smart Analytics license on
Service Manager version 9.5x and 9.41 PD, you must apply the appropriate unload files based on
the applications version of Service Manager. These unload files are available at ITOM
Marketplace. See Step 2: Apply unload files to Service Manager in Set up SMA-SM for more
information about these unload files.

To configure Smart Search, follow these steps:

   1. From the System Navigator, click System Status , click Start Scheduler, and then click
     KMReindex to start the KMReindex process.

                   Note

                Make sure that you start only one KMReindex process in the same Service
                Manager cluster.

   2. From the System Navigator, click System Administration > Ongoing Maintenance > Smart
     Analytics > Smart Search.

     The Smart Search Configuration page opens.

   3. From the Add Knowledgebase section, specify the following settings as needed:

           Knowledgebase name: Specifies the name of the library you want to add.
           Knowledgebase type: Specifies the type of the library you want to add.

           Add: Adds the library you specified as a new knowledgebase.

           Once you click the Add button, the new IDOL knowledgebase record is added and a
           new knowledgebase maintenance page is displayed. Configure the required
           knowledgebase information on the maintenance page. For detailed information about
           different types and configuration steps of knowledgebases, see Manage Smart Search
           Knowledgebases.

   4. From the Environment Configuration section, modify the following settings as needed:

           Expiry days: Smart Search removes the data that was indexed longer than the setting
           in this field from search.
           Assign the default knowledge view group to all operators: If this option is selected,
           the default knowledge view group is assigned to all operators.
           Connector configuration: Click to configure and monitor the status of the connectors
           and servers. For detailed information, see Configure connectors.

   5. When you first install the IDOL search engine after having used the Solr search engine, you
     need to do the following:


  Check libraries in the Current Knowledgebase List. From the kmsearchsecurity script of
  each library, delete the code which you updated to enable Mandanten Security for libraries
  when using Solr, and then replace the deleted code with the following:

      function getSecurityInfo(user, record)
      {
      return "";
      }

               Note

                   Starting from Service Manager 9.41, Mandanten security control is
                   introduced as a built-in feature in Smart Search. Users no longer need to
                   implement it manually by updating the KM search security script. If you
                   keep the KM Search security script which was updated for Mandanten
                   security, the built-in Mandanten control in Smart Search doesn't work.
                   Smart Search and HTA don't support array type of mandanten in this
                   release.

6. Click Save to save your modification.
7. From the Smart Search Configuration page, select the knowledagebase libraries that you

  want to index, and then click Full Reindex.
  For the libraries in the "sclib" type, you can configure additional settings such as scheduling
  the full re-index or changing the maximum worker threads before you start indexing. For
  more information, see Index Smart Search knowledgebases and Manage Smart Search
  Knowledgebases.
  When you click the Full Reindex button, the IDOL search engine performs a full re-index of
  the selected libraries. However, because indexing runs as a background process, the search
  engine doesn't begin indexing until the specified refresh interval is reached.

               Tip

             To perform a full re-index on large-scale knowledgebases, see Perform
             indexing of large-scale knowledgebases.

8. Click the Refresh Status button to view the index status of the knowledgebases.

               Tip

             To modify settings for any current knowledgebase, click the respective link from
             the list. For detailed information about knowledgebase settings, see Manage
             Smart Search Knowledgebases.

9. Log off and then log onto Service Manager for the changes to work.


10. Perform a Smart Search to verify your configuration.

    If you encounter session time out or long response time when performing the first Smart
    Search after indexing, set a higher value for the TermCachePersistentKB parameter in the
     [TermCache] section for all content server configuration files(content<N>.cfg) and then
    restart your content servers.

                 Note

               The default value for this parameter is 512000. You can configure the parameter
               value according to system memory availability and desired querying speed. For
               example, if you selected All-in-one install template when deploying Smart
               Analytics, you can keep the default value unchanged. If you deployed your
               content servers on multiple machines, it is recommended you modify the value
               to 2097152.


1.3.1.6. Add Smart Analytics capability word for
power users

User Role: Administrator
To enable power users such as Service Desk Agent or Problem Coordinator to use the Smart
Analytics features, you need to add the "idol.assistant" capability word to their operator records.
The operators with this capability word can see Smart Analytics menus and use these features.

            Note

           ESS self-service users are able to submit Smart Request records after you enable SM
           Smart Analytics. No additional capability word is needed.

To add the "idol.assistant" capability word to an operator record, follow these steps:

   1. From the System Navigator, click System Administration > Ongoing Maintenance >
     Operators.

   2. Enter or select your search criteria, and then click Search.
   3. Select an operator from the record list to view the operator record.
   4. Click the Startup tab.
   5. Add idol.assistant in the Execute Capabilities section.
````
