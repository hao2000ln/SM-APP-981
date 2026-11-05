---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.3.2.15 .. 1.3.2.18
printed_pages: 1087-1098
---

# 1.3.2.15 Transfer Smart Analytics intelligence between systems

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.2.15. Transfer Smart Analytics intelligence
between systems

User Role: Administrator
As an administrator, you may want to transfer the intelligence in Smart Analytics from one
environment to another environment. For example, when you finish testing Smart Analytics in
your test environment, you may want to migrate the configured Smart Analytics to your
production environment.

Precondition

If you need to keep changes to production Service Manager in Smart Search during Smart
Analytics intelligence testing and migration, do the following in your production Service Manager
immediately after you start copying data to test Service Manager for Smart Analytics testing:

     If you have enabled Solr search engine, stop the backend schedule for KM index updating.
     If you have enabled IDOL search engine, make sure the libraries status is NOT offline, and
     then stop the backend schedule for KM index updating.
     If you have not enabled Knowledge Management, add the following section in script
     KMLanguages:

          if(vars.$G_kmsearchengine ==null) {
                                       vars.$G_kmsearchengine = "IDOL";

                        }

     Then, add a script which contains the following code and run it:


          function knowledgebase() {

          function getKBs(kbnames) {
          var sql = 'kbname isin ' + kbnames + '';
          if(kbnames==null || '' == kbnames) {
          sql = 'true';
          }
          var f = lib.FileUtil._file('kmknowledgebase').select(sql);
          return f;
          };
          function changeStatus(kbnames, status) {
          var kbs = getKBs(kbnames);
          kbs.iterate(function(kb){
          kb['indexstatus'] = status;
          print('Status of ' + kb.kbname + ' change to ' + status );
          kb.doUpdate();
          }) ;
          };
          return {'getKbBs':getKBs, 'changeStatus':changeStatus}
          }
          var knows = new knowledgebase();
          // NOTE: Change the libraries you want to change the status here.
          // Status value could be 'indexing', 'not started', 'offline',
          'finished'
          var list = ['Incident_Library',
          'Interaction_Library','Knowledge_Library'];
          knows.changeStatus('{"'+ list.join('","') + '"}','finished');

Prepare the test Service Manager

   1. In your test Service Manager, configure, index, tune and test Smart Analytics as needed.
   2. In your test Service Manager, click Tailoring > Unload Script Utility. Search for the out-of-

     box unload script IDOL_KM_Config_Export or add an new unload script using the following
     query:


File name                               Query

idolcategorytest                        true
idolserverinfo
number                                  true

                                        name="cate2idolid" or
                                        name="cate2idoltestid" or name#"idol"

cate2idol2                              true

counters                                true

idolDataFilter                          true

idoladapter                             true

idolindex                               true

idolpbmhunter                           true

idolsecgroup                            true

idoltestresult                          true

idoltestsample                          true

idoltuning                              true

kmknowledgebaseupdates                  true

kmknowledgebase                         true

SmartTicketCategorySnapshot             true

SmartTicketTestResults                  true

SmartTicketTestRounds                   true

3. Run the unload script to get a .unl file. For details, see Run an unload script.


Transfer the configured Smart Analytics from test
environment to production environment

If you use your test Smart Analytics server as the production Smart Analytics server, follow these
steps to transfer Smart Analytics from test environment to production environment:

   1. Import the .unl file into your production Service Manager by using Unload Manager. For
     details, see Load an unload file.

                   Note

                      You need to resolve any conflicts that are detected.
                      Make sure that the kmknowledgebaseupdates table contains the latest
                      data from the database of production Service Manager instead of the test
                      Service manager.

   2. Log off and then log back onto your production Service Manager.
   3. In your production Service Manager, configure Smart Analytics to connect to the address of

     your production Smart Analytics server. Log off and then log back onto the production
     Service Manager
   4. In the file system of your Smart Analytics server, configure production Service Manager IP
     address for section Service in the configuration files of idolserver, level2server, content
     and other components.
   5. Synchronize category. To do this, run the following commands by using Smart Analytics
     Assistant (SAA) utility in your production Service Manager: http://<idolhost>:
     <MainProxyPort>/action=CategorySyncCatDRE

   6. After you finish transferring the configured Smart Analytics, delete the following section
     from script KMLanguages if you added it in Precondition, and then run script KMLanguages
     again:

          if(vars.$G_kmsearchengine ==null) {
                                       vars.$G_kmsearchengine = "IDOL";

          }

   7. Start the backend schedule for KM index updating in the Service Manager
     production environment.

If you use a different server other than your test Smart Analytics server as the production Smart
Analytics server, follow these steps to transfer Smart Analytics from test environment to
production environment:

   1. Export all contents index and category files. To do this, run the following actions by using
     the Smart Analytics Assistant (SAA) utility in your test Service Manager:

     To export contents index:


http://<idolhost>:<MainIDOLServerIndexPort>/DREEXPORTIDX?
filename=c:\BackupFolderName\File&HostDetails=true
To export category files:
http://<idolhost>:
<MainIDOLServerPort>/action=CategoryExportToXML&Output=File&FileName=c:\\
<folder>\\<subfolder>\\<xxx.xml>&IncludeCatID=true

            Note

                 <idolhost> is the address of the test Smart Analytics server.
                The file path should be specified to a location in the file system of the test
                Smart Analytics server.
                By default, the port number for < MainIDOLServerIndexPort > is 9001.
                By default, the port number for <MainIDOLServerPort> is 9000.

            Tip

           In the file system of the test Smart Analytics server, properly configure the IDOL
           server configuration file ( /IDOL/IDOLserver.cfg ) to make sure that the value for
           AllowedOutputDirectoryCSVs is valid as shown below:
           AllowedOutputDirectoryCSVs=C:\<folder>\<subfolder>
           Otherwise, you might receive the following error message:

                 <autnresponse xmlns:autn="http://schemas.autonomy.com/aci/">
                 <action>CATEGORYEXPORTTOXML</action>
                 <response>ERROR</response>
                 <responsedata>
                 <error>
                 <errorid>IDOLPROXYCATEGORYEXPORTTOXML-2147483386</errorid>
                 <rawerrorid>0x80000106</rawerrorid>
                 <errorstring>Bad value in parameter FILENAME</errorstring>
                 <errordescription>Output to the specified file is forbidden
                 by configuration.</errordescription>
                 <errorcode>ERRORPERMISSION</errorcode>
                 <errortime>27 Apr 16 15:02:13</errortime>
                 </error>
                 </responsedata>
                 </autnresponse>

  For information about how to use the SM SAA utility, see Use Smart Analytics Assistant.

2. Import the .unl file into your production Service Manager by using Unload Manager. For
  details, see Load an unload file.


               Note

                   You need to resolve any conflicts that are detected.
                   Make sure that the kmknowledgebaseupdates table contains the latest
                   data from the database of production Service Manager instead of the test
                   Service manager.

3. Log off and then log back onto the Service Manager production environment.
4. In your production Service Manager, configure Smart Analytics to connect to the address of

  your production Smart Analytics server, if needed. Log off and then log back onto the
  production Service Manager
5. Import all content index that you exported in step 1. To do this, run the following action by
  using Smart Analytics Assistant (SAA) utility in your production Service Manager:
   http://<idolhost>:<ACIPort>/DREADD?/<path>/<xxx.idx.gz>&CreateDatabase=True
  For example:

      http://<idolhost>:
      <Content1indexport>/DREADD?/home/Jora/BackupFolderName/FilePrefix-
      SGDLITVM0772-10010-0.idx.gz&CreateDatabase=True
      http://<idolhost>:
      <Level2proxyindexport>/DREADD?/home/Jora/BackupFolderName/FilePrefix-
      SGDLITVM0772-30010-0.idx.gz&CreateDatabase=True
      http://<idolhost>:
      <Level2proxyindexport>/DREADD?/home/Jora/BackupFolderName/FilePrefix-
      SGDLITVM0772-30020-0.idx.gz&CreateDatabase=True

  If you have exported more than one file in step 1, namely xxx-0.idx.gz, xxx-1.idx.gz, and
  xxx-2.idx.gz, the example may look as follows:


      http://<idolhost>:
      <Content1indexport>/DREADD?/home/Jora/BackupFolderName/FilePrefix-
      SGDLITVM0772-10010-0.idx.gz&CreateDatabase=True
      http://<idolhost>:
      <Content1indexport>/DREADD?/home/Jora/BackupFolderName/FilePrefix-
      SGDLITVM0772-10010-1.idx.gz&CreateDatabase=True
      http://<idolhost>:
      <Content1indexport>/DREADD?/home/Jora/BackupFolderName/FilePrefix-
      SGDLITVM0772-10010-2.idx.gz&CreateDatabase=True

      http://<idolhost>:
      <Level2proxyindexport>/DREADD?/home/Jora/BackupFolderName/FilePrefix-
      SGDLITVM0772-30010-0.idx.gz&CreateDatabase=True
      http://<idolhost>:
      <Level2proxyindexport>/DREADD?/home/Jora/BackupFolderName/FilePrefix-
      SGDLITVM0772-30010-1.idx.gz&CreateDatabase=True
      http://<idolhost>:
      <Level2proxyindexport>/DREADD?/home/Jora/BackupFolderName/FilePrefix-
      SGDLITVM0772-30010-2.idx.gz&CreateDatabase=True

      http://<idolhost>:
      <Level2proxyindexport>/DREADD?/home/Jora/BackupFolderName/FilePrefix-
      SGDLITVM0772-30020-0.idx.gz&CreateDatabase=True
      http://<idolhost>:
      <Level2proxyindexport>/DREADD?/home/Jora/BackupFolderName/FilePrefix-
      SGDLITVM0772-30020-1.idx.gz&CreateDatabase=True
      http://<idolhost>:
      <Level2proxyindexport>/DREADD?/home/Jora/BackupFolderName/FilePrefix-
      SGDLITVM0772-30020-2.idx.gz&CreateDatabase=True

               Note

                    <idolhost> is the address of the production Smart Analytics server.
                   The file path should be specified to a location in the file system of the
                   production Smart Analytics server.
                   By default, the port number for < Content1IndexPort > is 10011.
                   By default, the port number for <Level2proxyIndexPort> is 20011.

6. Copy and paste the following VDB settings to the configuration file ( /IDOL/IDOLserver.cfg )
  in the file system of your production Smart Analytics server:
        The [vdb#] settings that are located at the end of the configuration file
        ( /IDOL/IDOLserver.cfg ) in the file system of your test Smart Analytics server.


           The value of VirtualDatabases for [DistributionSetting] section of the configuration
           file ( /IDOL/IDOLserver.cfg ) in the file system of your test Smart Analytics server.
   7. Import category files that you exported in step 1. To do this, run the following action by
     using Smart Analytics Assistant (SAA) utility in your production Service Manager:
      http://<idolhost>:
     <MainIDOLServerPort/action=CategoryImportFromXML&ImportFilename=c:\\<folder>\\
     <subfolder>\\<xxx.xml>&BuildNow=true
   8. Check the consistence of category in your test Service Manager and production Service
     Manager.
      http://<idolhost>:<MainIDOLServerPort>/action=CategoryGetHierDetails&expand=all
     Make sure the results are the same. Otherwise, repeat this step.
   9. After you finish transferring the configured Smart Analytics, delete the following section
     from script KMLanguages if you added it in Precondition, and then run script KMLanguages
     again:

          if(vars.$G_kmsearchengine ==null) {
                                       vars.$G_kmsearchengine = "IDOL";

          }

 10. Start the backend schedule for KM index updating in the Service Manager
     production environment.

Now, your production Service Manager works for Smart Search, Smart Ticket, and Hot Topic
Analytics as your test Service Manager does.


1.3.2.16. Set stop phrases for Hot Topic
Analytics

User Role: Administrator
Adding stop phrases is a way to hide particular words from appearing in the Hot Topic Analytics
topic map. The stop phrases are still retained in the Smart Analytics data set.
To add stop words for Hot Topic Analytics, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Smart Analytics > Hot Topic
     Analytics.

   2. Click Stop Phrase. The Configure Stop Phrase page opens.
   3. Add the words that you identified as stop phrases to this page. These words must exactly

     match the key words to find hot topics, and each word must start with a new line.

                   Note

                You can't use wildcards in stop phrases.

   4. Click Save. The system automatically saves the stop words in alphabetical order.
     Alternatively, you can click Save & Exit to close the Configure Stop Phrase page.

   5. Run Hot Topic Analytics again. Now, those stop phrases are no longer displayed in the topic
     map.


1.3.2.17. Configure user assess to stop phrases
for Hot Topic Analytics

Hot Topic Analytics provides many out-of-the-box stop words. Only the authorized Smart
Analytics users can add some stop phrases to an analysis by using the Add Stop Phrase button
on a Hot Topic Analytics form.
Follow these steps to configure users' assess to stop words:

   1. Click Tailoring > Script Library.
   2. Type IDOL_Help in the Name field, and then click Search.
   3. Locate the canAddStopWords function.
   4. Configure a proper capability word in the line. For example, return

     system.functions.index("SysAdmin", vars['$lo.ucapex'])>0; .
     The default configuration is SysAdmin .
   5. Click Save and OK.


1.3.2.18. Configure asynchronous analysis

Hot Topic Analytics supports asynchronous analysis, which means that HTA will run in the
background and allows you to perform other tasks in the Service Manager system. This feature
helps to avoid an unresponsive system especially when you have huge volumes of data for
analysis. You can decide to run HTA asynchronously or synchronously according to the actual
needs.

Follow these steps to enable asynchronous analysis:

   1. Click System Administration > Ongoing Maintenance > Smart Analytics > Hot Topic
     Analytics.

   2. Select a module in the Current Configuration List, and then click the Advanced tab.
   3. Select the Analyze Asynchronously checkbox.
   4. Click Save & Exit.
   5. Add a SMIS (Integration Instance Manager) scheduler.

        1. Open SMIS page.
        2. Click Add.
        3. Select HTALDA in the Integration Template drop-down list.
        4. Fill in the mandatory fields. In particular, you must configure the Interval Time (s) field

           to control the running frequency of the back ground HTA job.
        5. Accept other default values, and then click Finish to create the scheduler.

            Tip

           If you don't select the Analyze Asynchronously checkbox and use the synchronous
           analytics mode, you can test in your own environment to find a proper number which
           can have an acceptable response time.
````
