---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.3.2.9 .. 1.3.2.14
printed_pages: 1061-1087
---

# 1.3.2.9 Back up and restore content data

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.2.9. Back up and restore content data

User Role: Administrator
This section describes how to backup and restore content data, and how to reindex delta data.
Topics in this section include:
Back up content data
Restore content data
Reindex delta data


1.3.2.9.1. Back up content data

User Role: Administrator
To ensure that you always have up-to-date copies of the data that the IDOL Server stores, we
recommend that you back up the IDOL Server at regular intervals. This section describes two
methods to back up and restore content data:

Enabling scheduled backup

To enable scheduled backup, follow these steps:
   1. Open the <Smart Analytics Installation>\Content<x>\Content<x>.cfg files of the content
     servers.
   2. Locate the [schedule] section. Insert the following lines, and then update the values if
     needed.

          [Schedule]
          Backup=true
          BackupTime=10:50
          //0 means daily backups
          BackupInterval=0
          BackupRetryAttempts=3
          BackupRetryPause=5
          NumberOfBackups=7
          BackupDir0=C:\idolbak\content1\Backup0
          BackupDir1=C:\idolbak\content1\Backup1
          BackupDir2=C:\idolbak\content1\Backup2
          BackupDir3=C:\idolbak\content1\Backup3
          BackupDir4=C:\idolbak\content1\Backup4
          BackupDir5=C:\idolbak\content1\Backup5
          BackupDir6=C:\idolbak\content1\Backup6


Parameter                               Description
BackupInterval
                                        The interval that the system creates
BackupRetryAttempts                     backup files.
BackupRetryPause
NumberOfBackups                         If you set the value of this parameter to 0,
                                        the system will automatically create a
                                        backup every 24 hours.

                                        The number of retry attempts when a
                                        backup task fails.

                                        The interval (seconds) between retry
                                        attempts when a backup task fails.

                                        The number of backup files that are
                                        created by the system.

                                        If you set the value of this parameter to 7,
                                        the first 7 backup schedules create new
                                        backup files respectively. The eighth
                                        backup operation overwrites the first
                                        backup, the nineth backup operation
                                        overwrites the second backup, and so on.

   3. Restart the content servers.

After you enable scheduled backup, the system automatically creates a series of backup files for
the content server. See the following screenshot as an example:

Using commands

To back up content data, you can export all contents index and category files with commands. To
do this, run the following actions by using the Smart Analytics Assistant (SAA) utility:

To export contents index:


http://<idolhost>:<MainIDOLServerIndexPort>/DREEXPORTIDX?
filename=c:\BackupFolderName\File&HostDetails=true
To export category files:
http://<idolhost>:
<MainIDOLServerPort>/action=CategoryExportToXML&Output=File&FileName=c:\\<folder>\\
<subfolder>\\<xxx.xml>&IncludeCatID=true

            Note

                By default, the port number for < MainIDOLServerIndexPort > is 9001.
                By default, the port number for <MainIDOLServerPort> is 9000.

To restore the content data backed up using this method, you can run the following action by
using Smart Analytics Assistant (SAA) utility:
http://<idolhost>:<ACIPort>/DREADD?/<path>/<xxx.idx.gz>&CreateDatabase=True
For example:
http://<idolhost>:<Content1indexport>/DREADD?/home/Jora/BackupFolderName/FilePrefix-
SGDLITVM0772-10010-0.idx.gz&CreateDatabase=True
http://<idolhost>:<Level2proxyindexport>/DREADD?/home/Jora/BackupFolderName/FilePrefix-
SGDLITVM0772-30010-0.idx.gz&CreateDatabase=True
http://<idolhost>:<Level2proxyindexport>/DREADD?/home/Jora/BackupFolderName/FilePrefix-
SGDLITVM0772-30020-0.idx.gz&CreateDatabase=True

            Note

                By default, the port number for < Content1IndexPort > is 10011.
                By default, the port number for <Level2proxyIndexPort> is 20011.


1.3.2.9.2. Restore content data

User Role: Administrator

            Important

           The content data restore process described in this document doesn't apply to the
           following scenario:

              1. The original content sever is running alive and the system performs a scheduled
                backup

              2. You click the Full Reindex button, the system performs a full re-index
              3. The content server crashes before the next scheduled backup

           In this case, skip both this topic and Reindex delta data, and then perform a full re-
           index again to restore data on the content server.

To restore content data during a disaster recovery process, follow these steps:

   1. Depending on which content server is crashed, you may need to stop either the KMUpdate
     scheduler or the SMIDOL* in SMIS:

           If the crashed content server is related to Hot Topic Analytics or Smart Ticket (by
           default, Content1), stop the SMIDOL* in SMIS by following the instructions as
           described in Service Manager Help Center > Troubleshooting: Smart Analytics
           background schedule in SMIS.
           If the crashed content server is related to Smart Search (by default, Content2 or
           Content3), stop the KMUpdate scheduler by following the instructions as described in
           Service Manager Help Center > Stop a process.

   2. Clear the corrupted data on the crashed content server.

        1. Open the crashed content server (for example, <Smart Analytics
           Installation>/Content1), and then remove all folders except the main folder. See the
           following screenshot as an example:


2. Open the main folder, and then remove all files except qssp.db. See the following
  screenshot as an example:

3. Start the service of the crashed content server in Windows services. For example, SM
  Smart Analytics Content1.

4. From the System Navigator, click System Administration > Ongoing Maintenance > Smart
  Analytics > Configuration.

5. Click More > Restore Smart Analytics Data.

6. Click Add and Start Task to open the Add a New Restore Task wizard. You need to provide
  the following information:

       Field                                                                                Service Manager 9.81
       Task name
       Endpoint                         Description

       Port                             Specify a name for the restore task.

       Restore File Name                Specify the host name of the
       Task Type                        corresponding IDOL content server. For
                                        example, http://abc.softwarelab.net/. Note
This PDF was generated on May 23, 2026  that this URL must end with a slash (/).

                                                    Tip

                                                   You can check the host name
                                                   by using Smart Analytics
                                                   Assistant.

                                        Specify the port number of the crashed
                                        content server.

                                                    Tip

                                                   You can check the port
                                                   number by using Smart
                                                   Analytics Assistant. Follow
                                                   these steps:

                                                      1. Type SAA in the Service
                                                        Manager command line,
                                                        and then press Enter. The
                                                        system displays
                                                        configuration and status
                                                        of all IDOL components.

                                                      2. Check the corresponding
                                                        port number in Smart
                                                        Ticket & Hot Topic
                                                        Content and Smart
                                                        Search Content.

                                        Specify the name and path of the latest
                                        restored file. For example,
                                        C:\idolbak\content1\backup5.

                                        Select Restore Content from the drop-
                                        down list.

                                                                                                                   Page 158 of 279

 7. Click Next.

 8. Review the restore task details, and then click Finish.

 9. The system displays the restore task on top of the task list.

10. Start the KMUpdate scheduler, or start the SMIDOL* instance in SMIS.

          Note

         If the restored data consists of knowledge articles that are expired after the latest
         backup date, you need to run the DREEXPIRE command (such as http://<IDOLhost>:
         <indexPort>/DREEXPIRE) to manually retire these articles. Alternatively, you can wait
         till the system performs the next expiration schedule.

          Note

         Consider the following scenario:

            1. The original content severs (content2 and content3) are running alive and the
               system performs a scheduled backup.

            2. You install another content server (for example, content4) so that the data is
               distributed in the three content servers.

            3. Content2 or Content3 crashes before the next scheduled backup and you
               perform data restore.

            4. The data is restored to content2 or content3 only. This is not consistent with the
               situation before data restore.

         In this case, do the following:

            1. Clear the data on the three content servers.
            2. Restore content data to content2 and content3.
            3. Redistribute the data on the three content servers.


Note

The current version of IDOL has a limitation that the system doesn't respond to the
status checking request during the restore process. In this case, you have to check
the IDOL log to get the restore status. Follow these steps:

   1. Open the content.cfg file with a text editor, and then update LogLevel=normal
     to LogLevel=full .

   2. Navigate to the %SmartAnalytics directory%/content<X>/logs directory, and
     then open the application.log file with a text editor.

   3. Check the following messages:

      06/06/2018 16:35:34 [1] 00-Always: Recovering from backup...

      06/06/2018 16:35:34 [1] 10-Full: Copying "Main" files from C:\IDOLBackup\main
     to C:\IDOLInstallation\main <-These messages indicate the progress.

      06/06/2018 16:35:34 [1] 10-Full: Copying "Status" files from
     C:\IDOLBackup\status to C:\IDOLInstallation\status

      06/06/2018 16:35:34 [1] 10-Full: Copying "Dynterm" files from
     C:\IDOLBackup\dynterm to C:\IDOLInstallation\dynterm

      06/06/2018 16:36:20 [1] 10-Full: Copying "Nodetable" files from
     C:\IDOLBackup\nodetable to C:\IDOLInstallation\nodetable

      06/06/2018 16:36:59 [1] 10-Full: Copying "Refindex" files from
     C:\IDOLBackup\refindex to C:\IDOLInstallation\refindex

      06/06/2018 16:36:59 [1] 10-Full: Copying "Numeric" files from
     C:\IDOLBackup\numeric to C:\IDOLInstallation\numeric

      06/06/2018 16:37:00 [1] 10-Full: Copying "Bitfield" files from
     C:\IDOLBackup\bitfield to C:\IDOLInstallation\bitfield

      06/06/2018 16:37:00 [1] 10-Full: Copying "Geospatial" files from
     C:\IDOLBackup\geoindex to C:\IDOLInstallation\geoindex

      06/06/2018 16:37:00 [1] 10-Full: Copying "Secindex" files from
     C:\IDOLBackup\secindex to C:\IDOLInstallation\secindex

      06/06/2018 16:37:00 [1] 10-Full: Copying "TagIndex" files from
     C:\IDOLBackup\tagindex to C:\IDOLInstallation\tagindex

      06/06/2018 16:37:01 [1] 10-Full: Copying "SortField" files from
     C:\IDOLBackup\sortfield to C:\IDOLInstallation\sortfield

      06/06/2018 16:37:01 [1] 10-Full: Copying "IndexQueue" files from
     C:\IDOLBackup\indexqueue to C:\IDOLInstallation\indexqueue

      06/06/2018 16:37:01 [1] 10-Full: Copying "storedstate" files from
     C:\IDOLBackup\storedstate/current to C:\IDOLInstallation\storedstate\current


   06/06/2018 16:37:01 [1] 10-Full: Copying "storedstateref" files from
  C:\IDOLBackup\storedstate to C:\IDOLInstallation\storedstate

   06/06/2018 16:37:01 [1] 30-Normal: Recovered from backup successful. <-
  This message doesn't indicate a full completion because the engine starts after
  this. It may take a long time or a short while depending on your configuration.

4. Navigate to the %SmartAnalytics directory%/content<X>/logs directory, and
  then open the index.log file with a text editor.

5. Check the following messages:

   06/06/2018 16:35:31 [1] 30-Normal: Index Queue Command: DREINITIAL?
  Path=D:\IDOLBackup

   06/06/2018 16:37:36 [1] 30-Normal: Index command finished. Took 124.91 s
    <- This message indicates a full completion.


1.3.2.9.3. Reindex delta data

Applies to User Role: Administrator

Service Manager provides the Reindex delta data option to reindex the “delta data”. Delta data
refers to the gap between the selected backup data in Smart Analytics and the latest Service
Manager data during a disaster recovery process. Consider the following scenario:

     The original IDOL system is running alive and you enable scheduled backup
     The original IDOL system is down
     You roll back the Smart Analytics data from the latest backup
     The end users are making changes from the time the original IDOL system is down to the
     time the new IDOL system goes live

The following figure depicts this scenario:

To reindex the delta data for the Smart Analytics content server, follow these steps:

   1. Form the System Navigator, click System Administration > Ongoing Maintenance > Smart
     Analytics > Configuration.

   2. Depending on which content server crashes, click Hot Topic Analytics for the Content1
     server, or click Smart Search for the Content2/Content3 server.

   3. Click More > Reindex Delta Data.

  4. If you click Hot Topic Analytics in step 2, you must select a start date which is earlier than
     that of the latest backup data you’ve specified in Restore content data > step 6. This
     procedure ensures that all delta data created after the content restore is reindexed into
     IDOL.

     For example, if the latest backup file C:\idolbak\content1\backup5 is created on 04/08/18
     13:57:00, you can do either of the following:

           Select a time earlier than 04/08/18
           Select 04/08/18 and then update the start time to 13:50:00

     If you click Smart Search in step 2, you must select a start date which is earlier than that of
     the latest backup data you’ve specified in Restore content data > step 6. Meanwhile, your
     selected date must be in the delta data recycle time scope.


  For example, if the latest backup file C:\idolbak\content1\backup5 is created on 04/08/18
  13:57:00, and you set the value of the Smart Search delta data recycle time (days): option
  to 7, you can do either of the following:

        Select a time between 04/08/18 and 04/01/18.
        Select 04/08/18 and then update the start time to 13:50:00

               Important

             In case the IDOL server and the Service Manager server are running in different
             time zones, you must calculate the time difference when selecting a start date in
             this step.

5. Click Finish. The delta data will be reindexed the next time the KMUpdate scheduler or the
  SMIDOL* instance runs.

6. Perform global search or Hot Topic Analytics search to check whether the delta data is
  reindexed. Otherwise, check the sm.log file for related debugging messages.


1.3.2.10. Back up and restore connector data

User Role: Administrator

Back up connector data

To enable scheduled backup, follow these steps:
   1. Click System Administration > Ongoing Maintenance > Smart Analytics > Smart Search >
     More > Tailoring.
   2. Type a daily backup time in the Connector daily backup time field. For example, 12:00 .
   3. Specify a backup folder in the Connector daily backup folder field. For example,
      C:\\BackupFolder .

                   Note

                You must have read and write permissions to the specified connector data
                backup folder. On the Linux system, it's advisable that this data backup folder is
                at the same level as the IDOL installation directory.

   4. Click Save and OK.
After you enable scheduled backup, the system automatically creates a series of zipped backup
files for the connectors. See the following screenshot as an example:

Restore connector data

To restore connector data during a disaster recovery process, follow these steps:
   1. Stop the KMUpdate scheduler.
   2. Clear the corrupted data on the crashed connector server.


SharePoint connector, Web connector, File System connector, Oracle connector (for
Service Manager 9.60 and later), and Confluence connector:

Open the crashed connector folder (for example, <Smart Analytics
Installation>/SharepointRemoteConnector ), and then remove all folders except the acidlls
folder. In addition, remove the *.db files. See the following screenshot as an example for the
SharePoint connector:

OmniGroupServer:

Open the crashed OmniGroupServer folder, and then remove all folders. See the following
screenshot as an example:


3. Start the crashed connector server in Windows services. For example, SM Smart Analytics
  SharePoint connector.

4. From the System Navigator, click System Administration > Ongoing Maintenance > Smart
  Analytics > Configuration.

5. Click More > Restore Smart Analytics Data.

6. Click Add and Start Task to open the Add a New Restore Task wizard. You need to enter the
  following information:

Field                                                                                       Service Manager 9.81
Task name
Endpoint                                Description

                                        Specify a name for the restore task.

                                        Specify the corresponding connector's
                                        URL. For example,
                                        http://abc.softwarelab.net/ . Note that this
                                        URL must end with a slash (/).

                                                    Tip

                                                   You can check this URL in
                                                   Smart Search Configuration >
                                                   Connector Configuration.

Port                                    Specify the port number of the crashed

                                        content server.

                                        Tip

                                        You can check the port
                                        number in Smart Search
                                        Configuration > Connector
                                        Configuration as well.

Restore File Name                       Specify the name and path of the latest
Task Type                               restored file. For example, C:\
                                        20180708T190041_16.188.188.123_5678.zi
                                        p.

                                        Select Restore Connector from the drop-
                                        down list.

7. Click Next.

8. Review the restore task details, and then click Finish.

9. The system displays the restore task on top of the task list. Select this task and then click
  Refresh to check the task status.


1.3.2.11. Back up and restore category data

User Role: Administrator

Back up category data

To enable scheduled backup, follow these steps:
   1. Click System Administration > Ongoing Maintenance > Smart Analytics > Smart Ticket >
     More > Tailoring.
   2. Specify a folder to store daily backups in the Category backup folder field. For example,
     c:/backupFolder.
   3. Click Save and OK.
   4. Select a task in the Current Configuration List, and then perform either training or tuning.
     The system automatically creates a zipped backup file for the category server. See the
     following screenshot as an example:

Restore category data

To restore category data during a disaster recovery process, follow these steps:
   1. Stop the main server.
   2. Clear the corrupted data on the crashed category server.
     Open the crashed category folder (for example, <Smart Analytics
     Installation>/IDOL/category), and then remove all folders. See the following screenshot as
     an example:


3. Navigate to the category backup folder, and then extract the latest restored file.
4. Copy the category folder back to <Smart Analytics Installation>/IDOL/category. See the

  following screenshot as an example:
5. Start the main server.


1.3.2.12. Perform indexing of large-scale
knowledgebases

User Role: Administrator
Performing a full index of a large knowledgebase may take hours or even days to complete
depending on the scale of your knowledgebases, which may have a significant impact on system
resources. As of version 9.50, Service Manager provides a ScriptLibrary AddToKMBUTable,
allowing you to perform incremental index of knowledgebases. If you plan to perform full index of
a large knowledgebase, it is recommended that you perform full indexing on a small amount of
records first, and then perform several incremental indexing tasks for the rest records by using
the ScriptLibrary AddToKMBUTable.
The following section is an example of how to perform full indexing of a large scale
knowledgebase.
Suppose there are 4 million records in your Interaction_Library which were created in the past 12
months, and you want to perform full indexing on all these records. To reduce potential
downtime, you can perform the full index as follows:

   1. Perform a full index on records created within 3 months.
        1. Open the Smart Search Configuration page.
        2. In the Current Knowledgebase List section, click the corresponding link to open
           Interaction_Library. Then, the Knowledgebase maintenance page is displayed.
        3. In the Table Query field, specify a Service Manager style query so that only records
           created within 3 months are indexed, as shown below:

                 open.time>='05/25/16'

           Modify other fields as necessary.
        4. Click the Full Reindex button.
        5. Wait for Service Manager to finish indexing the records that match specified

           conditions.
   2. Perform incremental index on records created within 6 months but older than 3 months.

        1. Once the index status turns to Finished, re-specify the Table Query to set the time
           frame to 6 months since now, as shown below:

                 open.time>='02/25/16'

        2. Open the AddToKMBUTable ScriptLibrary.


3. Locate the following function:

  function addRecordToKBU(filename,query)

Then, update the value to perform incremental index on records that have not been full
re-indexed while you have re-specified in the Table Query field, as shown below:

             function addRecordToKBU("incidents",open.time>='02/25/16' and
             open.time<='05/25/16')

     4. Click Execute
3. Perform incremental index on records created within 9 months but older than 6 months.
4. Perform incremental index on records created within 12 months but older than 9 months.


1.3.2.13. Encrypt Smart Analytics index data

User Role: Administrator

You can choose whether to configure the IDOL content component to encrypt your index data,
256-bit AES encryption is used and the following data are encrypted:

     document data in the index
     temporary data in the index cache
     value mapping files used by the parametric, match, and security indexes
     the term dictionary
     the unstemmed term tree
     the geospatial index
     any data sent with index actions that are stored in your index queue before processing

            Caution

           If you lose your encryption keys after you enable the encryption, you can't recover
           your data.

Enable index encryption

   1. Create a key file (.ky) with a key of length is 64, for
     example: D15B643D5332BB9B9871EB1828D91367FA5419FD7179C8254AA4CCB647AB8009

   2. Open the Smart Analytics Content component configuration file in a text editor one by one
     such as content1.cfg, content2.cfg, content3.cfg...
     Add a [DataEncryption] section to the configuration file one by one:
      [DataEncryption]

          AESKeyFile=<key file path>
     For example:
      [DataEncryption]

          AESKeyFile=C:\idoldata\keys\indexkey.ky
   3. Save and close the configuration file.
   4. Restart the Smart Analytics Content component for your changes to take effect.


            Note

           When the AES encryption is enabled in an index with contents:
                Smart Analytics IDOL Server encrypts the value mapping and geospatial index
                files at startup.
                Document data encryption applies only to new data. Any unprocessed data in
                your index queue remains unencrypted.
                Smart Analytics IDOL Server does not encrypt the unstemmed term tree unless
                you regenerate it (see Regenerate with a Server Restart).
                Smart Analytics IDOL Server encrypts the term dictionary when it next flushes
                the terms to disk during index, or when you run index compaction.

           To ensure that all your data are encrypted, you need to enable the encryption in
           an empty index.

Check Your Encryption Status

You can check the encryption status of your Content index by sending the GetStatus action.
The response for Content includes a data_encryption section, which can have one of the
following values:

     false. The index is not encrypted.
     true. All data in the index are encrypted.
     partial. Some data in the index are encrypted, but there are also some unencrypted data.
For example:
<data_encryption>

  <activated>true</activated>

  <nodetable_encrypted>partial</nodetable_encrypted>

  <indexqueue_encrypted>partial</indexqueue_encrypted>

  <diskindex_encrypted>true</diskindex_encrypted>

  <unstemmed_encrypted>false</unstemmed_encrypted>

  <geoindex_encrypted>true</geoindex_encrypted>

</data_encryption>

Each time you start Content, it verifies your encryption key to ensure that it matches the existing
settings. The following table describes the errors you can find in the application.log in the
content folder when the content can't be started.


Error                                     Cause
                                          The path for the key file is wrong.
Key file '<path>indexkey1.ky' not found.
                                          The length of the key is wrong, the correct
Encryption key from <path>indexkey.ky is  length is 64.
the wrong length.
                                          The key is mismatched.
Encryption key from <path>indexkey.ky
failed to match previous data encryption  The encryption can't be turned off when the
configuration.                            content index isn't empty.

Error: Data encryption was previously
enabled, but no encryption key found.

Similarly, when you attempt to use the DREINITIAL index action with a backup path, Content
checks the encryption settings in the backup directory before it restores the index. If the target
index has incompatible encryption settings, the DREINITIAL index action fails with a Bad
Parameter error.

            Note

           Content stores only a hash generated from the encryption key on disk, so you can't
           recover the original encryption keys from the saved information.

When you export data from Content by using DREEXPORTIDX or DREEXPORTXML, the exported
content is unencrypted. We recommend that you use appropriate authorization roles to ensure
that only authorized users can export content from your index.

If you want to turn off encryption or change your encryption settings, you must export your data
and index into an empty content index as follows:

   1. On the Smart Analytics server, open a browser and go to http://localhost:
     <index_port>/DREEXPORTIDX? (by default, content1 index port is 10011, content2 index port
     is 30011, and content3 index port is 30021). This index action exports all IDX documents to a
     series of compressed files in the content directory. The file names are AUTN-IDX-EXPORT-
     <host name>-<content server port>-<dd.mm.yy>-<hh-mm-ss>-0.idx.gz , AUTN-IDX-
     EXPORT-<host name>-<content server port>-<dd.mm.yy>-<hh-mm-ss>-1.idx.gz and so
     on.

   2. Stop the server and remove all the folders under Content.
   3. Remove the [DataEncryption] section from the configuration files to turn off the encryption

     or modify the [DataEncryption] section in the configuration files to change the encryption
     settings.


4. Start the server and open a browser, run http://localhost:<index_port>/DREADD?Filename=
  <path of the file you exported in step 1> , for example, http://localhost:index_port/DREADD?
  Filename=C:\Program%20Files%20(x86)\Micro%20Focus\Service%20Manager%209.64\S
  martAnalytics\Content2\AUTN-IDX-EXPORT-SHCLITVM0030-30020-25.03.2021-06.24.17-
  0.idx.gz


1.3.2.14. Modify Stop Words for IDOL search
engine

User role: System Administrator

A stop-word list is a list of terms that can be ignored when the search engine is searching or
indexing. Typically, stop-word lists include short and common words or prepositions, such as "a,"
"the," or "with" in English. However, they may also include longer words, such as long number
strings, or words that are too common to be useful as search targets, such as the term "internet."
Stop words are removed from words entered in the "Search for" box unless they are enclosed in
double quotes (phrase search). They're not removed during indexing to allow for phrase
searching.

Smart Search applies both the Smart Analytics stop words and the Service Manager stop words.
However, some stop words used in Service Manager conflict with the stop words logic used in
Smart Search. For example, "before" is a stop word defined in Service Manager, which means
that "before" in a search string is ignored. However, in Smart Search, it supports the search string
as "A BEFORE B", which means that Smart Search returns the results in which A comes before B.
If "before" is not removed from the Service Manager stop words list, the returned results aren't
as expected. To avoid this problem, when you enable Smart Analytics, some of the English stop
words are removed. To obtain a list of the removed stop words, search for
"stop_words_to_remove" in the "IDOL_EnableKM" script library.

If you want to keep all the Service Manager stop words when you upgrade your Smart Analytics
server, back up the stop words list before upgrade and import it after upgrade.

When you search by the IDOL search engine, if the search word is a stop word defined in IDOL
search engine only, a warning message is displayed.

Stop words are stored in Service Manager in lists by specific language. Not all languages support
stop words (for example, Japanese and Chinese). Adjust the list of stop words by either adding or
removing words from this list.

The stop-word list for your log-in language is used by default, and is loaded once when you first
log in. Changing the query language parameter on the advanced search screen changes the
stop-word list used. The new stop-word list is loaded each time you search in a language other
than your log-in language. This may cause a delay in your search being submitted as the stop-
word list is loaded. If you need to perform extensive searches in a language other than your log-
in language, we recommend that you log out and then log back in with the other language to
reduce this delay.

To modify Service Manager stop words:

   1. Click Smart Analytics > Smart Search > More > Stop Words.
   2. Click Search.
   3. Select the record for the language code you wish to change.
   4. Add a new word or modify an existing word.
   5. Click Save.


To modify Smart Analytics stop words:

  1. Open the <Smart Analytics Installation>/lanfiles folder.
     The stop words lists are saved as the <language name>.dat file in this folder.

   2. Open the language file that you wish to change.
   3. Add a new word or modify an existing word.
   4. Click Save.
````
