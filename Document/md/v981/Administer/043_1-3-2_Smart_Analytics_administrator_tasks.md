---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.3.2 .. 1.3.2.1
printed_pages: 992-1029
---

# 1.3.2 Smart Analytics administrator tasks

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.2. Smart Analytics administrator tasks

The following sections describe tasks for a Smart Analytics administrator:
Work with Smart Search
Validate Smart Analytics configurations
Add a content server for Smart Ticket
Configure TSL/SSL for two-way authentication
Get ports occupied by Smart Analytics
Use Smart Analytics Assistant
Check Smart Analytics log files
Manage Smart Analytics background schedule in SMIS
Back up and restore content data
Back up and restore connector data
Back up and restore category data
Perform indexing of large-scale knowledgebases
Encrypt Smart Analytics index data
Modify Stop Words for IDOL search engine
Transfer Smart Analytics intelligence between systems
Set stop phrases for Hot Topic Analytics
Configure user assess to stop phrases for Hot Topic Analytics
Configure asynchronous analysis
Work with Smart Ticket tuning


1.3.2.1. Work with Smart Search

To work with Smart Search, refer to the following topics:
Manage Smart Search Knowledgebases
Index Smart Search knowledgebases
View index job status
Customize Smart Search actions and settings
Customize context-aware search
Add a content server for Smart Search
Remove a content server for Smart Search
Modify Smart Search content servers and weight for data


1.3.2.1.1. Manage Smart Search
Knowledgebases

User Role: Administrator

You can add five types of Smart Search knowledgebases to Smart Analytics: an sclib
knowledgebase, an fsyslib knowledgebase, a weblib knowledgebase, an splib knowledgebase,
and an okmlib knowledgebase. An sclib knowledgebase is created from a table in Service
Manager. For example, the out-of-the-box Incident_Library uses the probsummary table. A
weblib knowledgebase is created by using web crawling to browse and index an external web
site. The system creates an fsyslib knowledgebase when it crawls a file system. An splib
knowledgebase is created to browse and index a SharePoint connector. An okmlib
knowledgebase is created to browse and index an Oracle connector.

Add a new Smart Search knowledgebase

To add a new Smart Search knowledgebase, follow these steps:

   1. From the System Navigator, click System Administration > Ongoing Maintenance > Smart
     Analytics > Smart Search.

     The Smart Search Configuration page opens.

   2. From the Add Knowledgebase section, type a unique name for the new Smart Search
     knowledgebase in the Knowledgebase name field (required).

   3. Select the knowledgebase type from the Type field drop-down list.
   4. Click Add. The new IDOL knowledgebase record is added and a new knowledgebase

     maintenance page is displayed.

   5. Configure the required knowledgebase information. The field availability varies for different
     knowledgebase types.

       Field                                                                                Service Manager 9.81
       Display Name
       Refresh Interval                 Description

       Connector                        Types a display name for the IDOL
       (not for sclib)                  knowledgebase.

       Task                             Displays the number of interval unit used
       (not for sclib)                  to update the selected knowledgebase
                                        index. One interval unit is 5 minutes.
       Table Name (only for sclib)      Default number of interval is 1. You may
                                        increase the interval, which extends time
This PDF was generated on May 23, 2026  delay between updates, by increasing this
                                        number. Setting this number to 0 (zero)
                                        disables updates to the index. To re-start
                                        indexing, reset the interval to a value
                                        greater than zero.

                                        Selects the specified connector from the
                                        configured connectors according to the
                                        knowledgebase type:

                                             weblib: Web connector
                                             splib: SharePoint connector
                                             fsylib: File System connector
                                             okmlib: Oracle connector
                                        The connector selected here should be
                                        the be consistent with the configurations
                                        in the .cfg files of related remote
                                        connectors. For more information about
                                        configuring Smart Analytics connectors,
                                        see Configure connectors.

                                        Selects the task that connects the Smart
                                        Analytics server and other data sources.

                                        The task selected here should be
                                        consistent with the configurations in the
                                        .cfg files of related remote connectors. For
                                        more information about Smart Analytics
                                        connectors, see Configure connectors.

                                        The table that will be indexed. A valid
                                        Service Manager table is required.

                                                                                                                     Page 86 of 279
Field                                                                                       Service Manager 9.81
Skip These Extensions (only for sclib)
                                        Description

                                        A semicolon-separated list of file
                                        extensions that should not be indexed or
                                        extracted. Certain file types either can't be
                                        indexed, or provide no relevance. By
                                        providing these extensions, you can
                                        increase index performance.

                                                    Note

                                                   Sample gif;jpg without any
                                                   spaces.

Document ID Field (only for sclib)      Every table in Service Manager has a
                                        unique ID field and this field identifies the
Index Attachments (only for sclib)      field name of the ID field. The indexer
Index Chat History (only for sclib)     uses this field to uniquely identify each
                                        document in the index. This is a required
                                        field for indexing a knowledgebase.

                                        If the table being indexed has
                                        attachments, select this checkbox to have
                                        the attachments indexed.

                                        If you have Microsoft Teams integrated,
                                        select this checkbox to index the
                                        conversation history in Teams. This will
                                        allow you to search for the keywords in
                                        the chat history by using Smart Search.

Field                                                                                          Service Manager 9.81

Max threads for full reindex (only for     Description
sclib)
                                           Specifies the number of threads to
                                           process the records in the library for
                                           Smart Search indexing.

                                           The default value is 1, which means the
                                           system creates one back-end process
                                           (worker) to send the data in the library
                                           from Service Manager to Smart Analytics.

                                                       Note

                                                      For performance
                                                      considerations, we
                                                      recommend that the total
                                                      number of threads for all the
                                                      libraries is less than 20.

 Full reindex batch size (only for sclib)  Specifies the number of documents that
 Table Query (only for sclib)              the SM server sends to IDOL at a time.
Status                                     The default value is 1000. If an out-of-
                                           memory issue occurs during indexing, you
                                           can reduce this value to a smaller size,
                                           such as 500 or 250.

                                           Specifies a Service Manager style query
                                           to limit what records in the table are
                                           indexed. For example, a query to return
                                           only documents that are neither draft nor
                                           retired in the kmdocument table: status ~=
                                           "draft" and status ~="retired". A blank
                                           query indicates that all records will be
                                           indexed.

 Field                                                                                      Service Manager 9.81
 Full Reindex:
                                        Description
 Refresh Statistics
Field Definitions (only for sclib)      When clicked, the search engine performs
                                        a full re-index of a knowledgebase. If the
                                        index doesn't exist in IDOL, an index will
                                        be created. If the index does exist, Smart
                                        Analytics replaces the existing database
                                        with the new index.

                                        When clicked, the search engine refreshes
                                        the statistics for this library.

Field                                                                                       Service Manager 9.81
Field Name
Alias                                   Description
Type
                                        Specifies the field name in the Service
Display in Results                      Manager table to be included in the index.

                                        Specifies the name that the field is to be
                                        indexed as.

                                        Indicates whether the field is a plain text
                                        string, a rich text string, or a date type.
                                        The indexer ignores HTML markup in rich
                                        text strings and indexes plain text strings
                                        completely.

                                        Rich text: When the field type is Rich Text,
                                        it means the field may contain HTML
                                        code. HTML tags will be removed during
                                        index..

                                        Reference: Select Reference only when
                                        the current field is a CI logical name. Thus
                                        the Display Name of a CI can be indexed.

                                        Defines what fields are available in the
                                        search results. Fields marked as "true" in
                                        this column are available to be included on
                                        a search results. The information for these
                                        field is displayed at the bottom of the
                                        search result.

       Field                                                                                Service Manager 9.81
       Index weight
                                        Description
       Match
                                        Defines the sequence of the search
       Sort                             results which are displayed on the search
       Data cleansing                   hitlist. You can assign different index
                                        weight to adjust the display sequence. If
This PDF was generated on May 23, 2026  the sort value of a field is assigned as
                                        level 4, the search results of this field is
                                        displayed at the top of the list. No index
                                        means that this field is not used for
                                        search.

                                                    Note

                                                   We recommend you to tune
                                                   this field according to your
                                                   own business use cases.

                                        By setting the field in this column to "true,"
                                        the system indexes the field's content as
                                        an advanced search filter for Smart
                                        Search in this knowledgebase. The search
                                        engine searches this individual field with
                                        the Advanced Search filter. For example, if
                                        you set the Category field as true, this
                                        field is used as an advanced search filter.
                                        If you leave this value as empty, it applies
                                        the false value.

                                        Defines the sequence of the search
                                        results which are displayed on the search
                                        hitlist. If you set multiple fields as hitlist,
                                        you can decide the display sequence by
                                        assigning different sort values for these
                                        fields. If the sort value of a field is
                                        assigned as 1, the search results of this
                                        field is displayed at the top of the list.

                                        Used to remove text which matches the
                                        data cleansing rules from the table before
                                        indexing.

                                                                                                                     Page 91 of 279

Script                                  Description
 Field
 Knowledgebase access script            This script specifies the script the system
 Category index script                  uses to determine if a particular user has
                                        rights to access the knowledgebase. See
 Search security script                 the default script for detailed information.

 Default Locale                         This script processes the document
                                        category so that the indexer can translate
                                        the document’s category into a string that
                                        the search engine can use later to find the
                                        document based on the user’s category
                                        access.

                                        This script is used to build and return a
                                        string of library-specific query values that
                                        were entered by the user under the tabs in
                                        the Advanced Search screen. Tailor this
                                        script when a knowledgebase has a tab in
                                        the Advanced Search screen and you wish
                                        to modify the fields available for Advanced
                                        Search.

                                        Specifies the default language used by the
                                        search engine when searching and
                                        indexing. By default, the language code is
                                        English.

Language Settings (only for Catalog Library)

The settings only work when you enter values for both the default language and available
languages.

Field                                                                                       Service Manager 9.81
Default Language
                                        Description
                                        Only English is available.


Field                                   Description
Available Languages
                                        You may configure non-English languages
                                        that users may set when log in to Service
                                        Portal or SM web client.

                                        The language settings affect the search
                                        results as below:

                                             If a user logs in to Service Portal or
                                             SM web client with one of the
                                             languages configured in the available
                                             language list, when the user
                                             performs a search,

                                                   an English document is
                                                   displayed if a document is only
                                                   available in English.
                                                   a document in the user's
                                                   login language is displayed if
                                                   the document in available in
                                                   English and the user's login
                                                   language.
                                             If a user logs in to Service Portal or
                                             SM web client with a language that's
                                             not configured in the available
                                             language list, when the user
                                             performs a search,
                                                   no document is displayed if a
                                                   document is only available in
                                                   English.
                                                   a document in the user's
                                                   login language is displayed if
                                                   the document in available in
                                                   English and the user's login
                                                   language.

                                        For example, if Spanish and German are
                                        configured in the available language list,
                                        after a full reindex process completes,
                                        when a user logs in to Service Portal or
                                        SM web client with language set as
                                        German and performs a search, English
                                        document is displayed if a document is
                                        available in English and Spanish.

6. Click Save to save your modifications and perform a full reindex.


Modify a current Smart Search knowledgebase

To modify a current Smart Search knowledgebase, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Smart Analytics > Smart Search.
     The Smart Search Configuration page opens. The current knowledgebase list is displayed
     on the Smart Search Configuration page.

   2. Click a Smart Search knowledgebase to open the knowledgebase maintenance page.
   3. Configure the required knowledgebase information. The field availability varies for different

     knowledgebase types.
   4. Click Save to save your modifications.

Sample configuration of the Smart Search knowledgebase
for survey

This section provides a configuration example of the Smart Search knowledgebase for survey.

Document ID Field:

number

Field Definitions tab:

Field        Alias  Type                Display Index Match Sort                     Data
                                                                                     Cleansi
Name                                    In       Weight                              ng
                                                                                     false
                                        Results
                                                                                     false
referenc referenc String                true     Level 1 false
                                                                                     false
e.numbe e_numb

r            er

commen commen String                    false    Level 4 false

ts           ts

status status String                    true     Default true

Script tab:

Knowledgebase access script                      Survey_Library_kmaccess
Category index script                            Survey_Library_kmcategoryidxscript
Search security script                           Survey_Library_kmsearchsecurity
Default Locale                                   English


1.3.2.1.2. Index Smart Search knowledgebases

User Role: Administrator

To index Smart Search knowledgebases, follow these steps:

   1. Make sure that you have backed up your content data before performing a full reindex on
     the knowledgebases. For more information, see Back up content data.

   2. Make sure that the KMReindex process is running in System Status.

   3. From the System Navigator, click System Administration > Ongoing Maintenance > Smart
     Analytics > Smart Search.

     The Smart Search Configuration page is displayed.

   4. (Only for the sclib libraries) Do one of the following to schedule the full reindex.

           If you want to start indexing immediately, select the Run full reindex immediately
           checkbox.
           If you want to start indexing based on a pre-defined schedule, clear the Run full
           reindex immediately checkbox, and then click the Schedule Full Reindex button to
           update the time period record:

              1. Add rules. For how to define a rule, see Create a time period.

              2. Approve the time period. For details, see Submit a time period for approval and
                 Approve a time period.

                 In this case, the full reindexing process only runs between the start time and the
                 end time of each occurrence for the time period.

                                Note

                                  When you create the time period, the total time for all the
                                  occurrences should be long enough to index the selected
                                  libraries based on the data column. If all the occurrences have
                                  finished but the system doesn't complete indexing, you can
                                  update the time period record to add more occurrences with
                                  more time.
                                  If two occurrences are overlapping, the system only runs the
                                  indexing process in the first occurrence and skips the second
                                  one.

   5. Click the Save button.

   6. From the Current Knowledgebase List section, select the knowledgebases that you want to
     index, and then click the Full Reindex button.


               Tip

             Alternatively, you can click the knowledgebase name in the list to open the
             Knowledgebase Maintenance page of a knowledgebase, configure the index
             conditions as needed, and then click the Full Reindex button on the
             Knowledgebase Maintenance page.
             On the Knowledgebase Maintenance page, you can also configure some
             advanced settings such as the number of threads for indexing the sclib library.
             For more information, seeManage Smart Search Knowledgebases.

               Tip

             If you want to index multiple libraries at one time, we recommend that you select
             the libraries with similar data volume.

  After you click the Full Reindex button, for the sclib libraries, the system creates one or
  multiple back-end processes (workers) that send the data in batches (jobs) from Service
  Manager to the Smart Analytics database for indexing, starting with the latest records.
7. To make sure that the data is successfully indexed to the Smart Analytics database, check
  the overall index status for each knowledgebase from the Current Knowledgebase List
  section of the Smart Search Configuration page.
  From the Current Knowledgebase List section, you can check the following information.

Field                                                                                       Service Manager 9.81
Knowledgebase Name
                                        Description
Type
Display Name                            Specifies the name of the Smart Search
Interval                                knowledgebase.

                                                    Note

                                                   When the administrator adds a
                                                   new library, users can only
                                                   see this library available on the
                                                   list after next login.

                                        Specifies the type of the Smart Search
                                        knowledgebase.

                                        Specifies the display name for the Smart
                                        Search knowledgebase. You can change
                                        this value from a knowledgebase details
                                        page.

                                        Displays the current interval used to
                                        update the selected knowledgebase
                                        index. Each interval unit is 5 minutes
                                        (default). You can change this value from
                                        a knowledgebase details page.

Field                                                                                       Service Manager 9.81
Index Status
                                        Description

                                        Displays the current index status of the
                                        library. A library has the following four
                                        index status:

                                             Offline: the library is newly added.

                                             Not started: the Full Reindex button
                                             is clicked for the library and the
                                             indexing is in the queue. If the
                                             indexing is not started for the library,
                                             users can still use Smart Search for
                                             this library based on the previous
                                             indexed result.

                                             Indexing: the indexing for the library
                                             is ongoing.

                                                           Tip

                                                        If you want to stop
                                                        indexing before the
                                                        process is finished, click
                                                        the library link to open
                                                        the Knowledgebase
                                                        Maintenance page, and
                                                        then click More > Force
                                                        Stop.

                                             Finished: the indexing for the library
                                             is finished.

Field                                                                                       Service Manager 9.81
Doc Count
                                        Description

                                        Displays the current number of records in
                                        the library.

                                        The number of the records is affected by
                                        the replica settings. When a content
                                        server is disabled, the number may be
                                        incorrect before you redistribute the
                                        server data. In addition, the doc count
                                        keeps changing during indexing process
                                        or even after the Index Status is displayed
                                        as "Finished". For example, if the full
                                        reindex has completed but later you
                                        successfully perform indexing for some
                                        failed jobs, the Doc Count will increase.

                                                    Tip

                                                   If "Doc Count" is empty, check
                                                   the status of the Smart Search
                                                   server to see if it is offline.

Thread Count                            Displays the number of worker threads to
Last Index Time                         process the records in the library.

                                        Displays the time when the library
                                        completes its last indexing.

Tip

You can also check the index job status for the knowledgebase libraries in the
"sclib" type. For more information, see View index job status.


1.3.2.1.3. View index job status

User Role: Administrator

You can check the status for each index job of a Smart Search knowledgebase library in the
"sclib" type.

To view index job status for a Smart Search knowledgebase, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Smart Analytics > Smart Search.
     The Smart Search Configuration page is displayed.

   2. From the Current Knowledgebase List section, click the knowledgebase library that's in the
     the "sclib" type. Then, the Knowledge Maintenance page is displayed.

   3. In the Status section, click the Jobs tab, and then click the Refresh Statistics button. The
     following information is displayed.

                   Note

                The Job tab is only available for the libraries in the "sclib" type, not for the
                external libraries.

Status                                                                                      Service Manager 9.81
Total
                                        Description
Planned
Sending                                 Indicates the number of total jobs that
Indexing                                Smart Analytics creates to index this
                                        knowledgebase. One job can index a
Completed                               maximum of one thousand records.
Failed
                                        Indicates the number of jobs that are
                                        created and queued in Service Manager.

                                        Indicates the number of jobs that are
                                        sending data out to the Smart Analytics
                                        database from Service Manager.

                                        Indicates the number of jobs that have
                                        sent out data from Service Manager, and
                                        the data is being indexed by Smart
                                        Analytics.

                                        Indicates the number of jobs that
                                        successfully index the knowledgebase
                                        data in the Smart Analytics database.

                                        Indicates the number of jobs that aren't
                                        sent out from Service Manager, or fail to
                                        index the knowledgebase data in the
                                        Smart Analytics database.

                                                    Note

                                                   The Failed category also
                                                   includes the jobs in the "Plan
                                                   to Transfer" and "Transferred"
                                                   statuses. That is, if you
                                                   manually retry a failed job, the
                                                   job will still remain in the
                                                   Failed category.

4. Click the number area for the jobs in one status to view the detailed information for each job
  such as query condition, status, start time, end time, and failure message.

  If a job fails, you can perform a manual retry:


When the knowledgebase library is still in the progress of indexing, manually change
the job status from "Failed" to "Planned" and save your change.

When the knowledgebase library has completed indexing, manually change the job
status from "Failed" to "Plan to Transfer" and save your change. When the retry
completes, the job status changes to "Transferred", which means the recods
previously in the failed job are added to the incremental indexing queue.

            Note

           To retry a failed job after the knowledgebase library has completed
           indexing, be sure that the KMReindex process is still running in System
           Status.


1.3.2.1.4. Customize Smart Search actions and
settings

User Role: Administrator
Service Manager provides out-of-box pre-defined filters and actions for different libraries. The
information of pre-defined filters and actions is saved in the smartsearchpreconditions and
smartsearchaction tables. To perform Smart Search for a record, you can customize the Smart
Search pre-defined filters to narrow down the library scope, and you can customize the Smart
Search actions to pre-define the possible actions based on your search conditions and results.

Customize Smart Search actions

To customize Smart Search actions, follow these steps:
   1. Click Smart Analytics > Smart Search > More > Smart Search Action.
     The Smart Search Action page opens.
   2. Click Search to open all the available action records.
   3. Double-click a record to view or change it. Service Manager displays each record in its
     appropriate form.
   4. Update any field within the record.

                   Note

                The integration with Operations Orchestration Flow in context-aware search is
                supported in Incident only.

   5. If you make changes, click Save.

Customize Smart Search settings

To customize Smart Search settings, follow these steps:
   1. Click Smart Analytics > Smart Search > More > Tailoring.
     The Smart Search Settings page opens.
   2. Update the following fields as needed.


Field Name                               Description
Automatically detect language in search
terms                                    The default value is true.

Enable phrase queries                    If you select this checkbox, Smart Search
                                         automatically detects the language to use.
Enable instant search                    If you clear this checkbox, Smart Search
                                         performs a search based on the
                                         DefaultLanguageType parameter defined
                                         in the content.cfg file.

                                         Example usage:

                                         To improve the search accuracy in
                                         Japanese, you can uncheck this option
                                         and update the related configurations as
                                         instructed here.

                                         The default value is false.

                                         If you select this checkbox, Smart Search
                                         automatically adds quotations to the
                                         search criteria.

                                         Example usage:

                                         If you select this checkbox and then enter
                                         mobile phone in the search box, Smart
                                         Search will send out search request with
                                         the query text of mobile phone and then
                                         displays the results that exactly match the
                                         search criteria on top of the result list.

                                         The default value is true.

                                         If you select this checkbox, Smart Search
                                         is automatically triggered as you type in
                                         the search text box or the specified field
                                         of a record, for example the Title field of a
                                         km record.

                                         If you clear this checkbox, you need to
                                         press Enter to trigger a Smart Search.

Field Name                                                                                  Service Manager 9.81
Ignore certain special characters
                                        Description
Instant search delay time (ms)
                                        The default value is false.

                                        If you select this checkbox, Smart Search
                                        interprets special elements as normal
                                        characters instead of a query syntax.
                                        These elements include asterisks (*),
                                        question mark (?), colon (:), double
                                        quotation marks ("), brackets, boolean,
                                        and proximity operators such as AND,
                                        NOT, OR, EOR, XOR, NEAR, DNEAR,
                                        WNEAR, BEFORE, and AFTER. Select this
                                        checkbox to disable wildcards, phrase
                                        queries, field restrictions and boolean
                                        operations.

                                        Example usage:

                                        If you select this checkbox and then enter
                                        mobile AND phone in the search box,
                                        Smart Search displays the search results
                                        which contain either mobile or phone .

                                        If you clear this checkbox and then enter
                                        mobile AND phone in the search box,
                                        Smart Search displays the search results
                                        which contain both mobile and phone .

                                                    Note

                                                   If you select this checkbox,
                                                   the system ignores the setting
                                                   of Enable phrase queries and
                                                   doesn't add quotations to the
                                                   query text.

                                        The default value is 300.

                                        Specifies the time that Smart Search waits
                                        for when the typing stops, before it
                                        processes the search query.


Field Name                                     Description

Smart Search behavior for high-frequency       The default value is "wait for previous
queries                                        query to respond."

                                               Indicates the Smart Search reaction in the
                                               case of high-frequency queries.

Page size for drop-down list of library field  The default value is 100.
filters
                                               Specifies the number of items that can be
                                               displayed in the drop-down list of a field
                                               when you click the Set Filters icon for a
                                               selected library in the general Smart
                                               Search page.

Search query timeout limit (ms):               The default value is 3000.

                                               Specifies the time duration after which a
                                               search query times out.

Maximum number of characters displayed         The default value is 300.
in a Smart Search result
                                               Specifies the maximum number of
                                               characters that each general Smart
                                               Search result can contain.

Search result page size                        The default value is 10.

                                               Specifies the number of search results
                                               that can be displayed.

Search string spell check character            The default value is 50.
threshold
                                               The spell check is disabled when the
                                               number of characters in a search string
                                               exceeds this limit.


Field Name                                  Description
SuggestOnText character threshold
                                            The default value is 400.
                                            The SuggestOnText function is triggered
                                            when the number of characters in a
                                            search string exceeds this limit.

Minimum search results relevance            The default value is 30. The value must
threshold                                   between 0 and 100. Negative numbers or
                                            any numbers that are greater than 100
                                            aren't allowed.

                                            Specifies the minimum percentage of the
                                            relevance that the search results must
                                            have to the query.

The displayevent that opens records in the  Read-only. The value in the current setting
search results                              is se.global_open.

                                            Indicates the displayevent that's triggered
                                            to open a record in the search results.

The displayevent that supports Smart        Read-only. The value in the current setting
Search actions                              is se.global_context_aware.

                                            Indicates the displayevent that's triggered
                                            to support Smart Search actions.

                                                        Note

                                                       Only available when you select
                                                       Use displayevent
                                                       (se.global_context_aware) for
                                                       Smart Search action handler.


Field Name                              Description
Smart Search delta data recycle time
(days)                                  The default value is 11.
                                        This field is used for content data backup
Connector daily backup time             and restore. You can set a time to clear
                                        data for the history index action. The
Connector daily backup folder           history index action data will be deleted
                                        once it exists over the defined time.

                                        The default value is 19:00.
                                        Specifies the daily backup time of the
                                        connectors.

                                        The default value is
                                        c:\BackupFolderName.
                                        Specifies the backup folder of the
                                        connectors.

3. Click Save.
4. Log off and then log onto Service Manager for the changes to work.

         Note

        To make Enable phrase queries, Ignore certain special characters, and Minimum
        search results relevance threshold effective for Smart Email search, you must follow
       these additional steps after step 4:

           1. Click Tailoring > Integration Manager, and then restart the Smart Email
             integration instance.

           2. Click System Status, and then restart the Emailout.startup,
             SmartEmail.Processor, and the Smart Email records.


1.3.2.1.5. Customize context-aware search

User Role: Administrator
Context-aware search enables users to view records and search results in the same window.
Users can copy a solution from the search results to the working record or trigger automated
tasks. Depending on configurations of Smart Search action handler in the Smart Search Tailoring
page, you can enable the context-aware search icon inside a record by performing either of the
following :

     Add the 9527 display option to the specific display screen.
     Customize the Enable Condition field in the Smart Search Predefined Filters page.

Customize Smart Search pre-defined filters

To customize Smart Search pre-defined filters, follow these steps:
   1. Click Smart Analytics > Smart Search > More > Predefined Filters.
     The Smart Search Predefined Filters page opens.
   2. Click Search to open all the available pre-defined filter records.
   3. Double-click a record to view or change it. Service Manager displays each record in its
     appropriate form.
   4. Update any field within the record.
   5. If you make changes, click Save.

            Note

           Make sure that the filename record is already defined as a Knowledge Management
           Mapping Record. Otherwise, you must define the file name from Knowledge
           Management > Configuration > Integration Mapping.

Customize context-aware search related settings

To customize context-aware search related settings in Smart Search, follow these steps:
   1. Click Smart Analytics > Smart Search > More > Tailoring.
     The Smart Search Settings page opens.
   2. Update the following fields as needed.

Field Name                                                                                  Service Manager 9.81
Smart Search action handler
                                        Description

                                        The default value is "Use displayoption
                                        (9527)."

                                        If you select the "Use displayoption
                                        (9527)" option, you need to configure the
                                        9527 display option for each
                                        displayscreen of a module to enable the
                                        context-aware search icon inside a record.

                                        If you select the other option "Use
                                        displayevent (se.global_context_aware)",
                                        you can enable the context-aware search
                                        icon for all displayscreens of a record in a
                                        specified module by configuring the
                                        Enable Condition field in the Smart Search
                                        Predefined Filters page only.


Field Name                                Description

Display the number of records that match  The default value is true.
filter conditions
                                          Displaying count number can impact
                                          performance. Only disable counting when
                                          performance is low.

                                          If this checkbox is selected, you can see
                                          the following:

                                               For context-aware search, the
                                               number of records that match filter
                                               conditions is displayed next to the
                                               selected knowledgebase libraries.
                                               For Smart Search, the number of
                                               records that match filter conditions is
                                               displayed next to the selected
                                               knowledgebase libraries. Smart
                                               Search automatically filters the
                                               search results based on the field
                                               filters you select under the
                                               corresponding library.

                                          If this checkbox is cleared, you can see
                                          the following:

                                               For context-aware search, the
                                               number of records that match filter
                                               conditions is not displayed next to
                                               the selected KM libraries.
                                               For Smart Search, the number of
                                               records that match filter conditions is
                                               displayed next to the selected KM
                                               libraries only when you click the Set
                                               Filters icon on the right and is
                                               automatically hidden when you start
                                               a new search. When you select a
                                               field filter under a selected library,
                                               you need to manually filter the
                                               search results by clicking the Search
                                               button at the bottom of the field
                                               filters window.


Field Name                               Description
Enable context-aware search in ESS
                                         The default value is true.
                                         If you select this checkbox, context-aware
                                         search is enabled in self-service user view
                                         (ess.do).

Manually trigger context-aware search    The default value is false.

                                         If you select this checkbox, context-aware
                                         search is not automatically triggered as
                                         you type in the specified field of a record,
                                         for example the Title field of a km record.
                                         You need to trigger context-aware search
                                         manually by clicking the Context-aware
                                         Search icon.

Maximum number of characters displayed   The default value is 200.
in a context-aware search result
                                         Specifies the maximum number of
                                         characters that each context-aware
                                         search result can contain.

Maximum number of characters to display  The default value is 600.
in expanded view
                                         Specifies the maximum number of
                                         characters that can be displayed in the
                                         expanded view of a context-aware search
                                         result.

Maximum number of characters to display  The default value is 200.
in the field area:
                                         Specifies the maximum number of
                                         characters that can be displayed in the
                                         fields area at the bottom of a context-
                                         aware search result.


Field Name                              Description

Maximum number of records whose         The default value is 50.
context-aware search results can be
stored:                                 Specifies the maximum number of records
                                        for which Smart Search can store context-
                                        aware search results.

                                        When you switch between open records
                                        for which you used context-aware search,
                                        the respective search result for the current
                                        open record is retrieved and displayed on
                                        the right panel. If you switch from an open
                                        record for which you used context-aware
                                        search to an open record for which you
                                        did not use context-aware search, the
                                        context-aware search window is hidden.

   3. If you make any changes, click Save.
   4. Log off and then log onto Service Manager for the changes to work.

Contents

     1 Customize Smart Search pre-defined filters
     2 Customize context-aware search related settings


1.3.2.1.6. Add a content server for Smart Search

User Role: System administrator
The initial setting deploys one content server at the main level, and two content servers at the
Smart Search level. If the default or existing smart search content servers aren't enough for the
indexed data, you may need to add additional content server(s).
To add a content server for Smart Search, follow these steps:

   1. Install a content server by using Smart Analytics installer. For details about installing a
     content server, see Install Smart Analytics on Windows or Install Smart Analytics on Linux.

                   Note

                Make sure the content server configured the Service Manager server and Smart
                Search proxy server as its client. These configuration are set in content’s
                configuration file.
                Make sure Smart Search proxy also configured the new content server as its
                client (in the level2proxy\IDOLServer.cfg file). Service Manager Server uses
                load balance, therefore, you need to specify all slave Service Manager
                addresses in these configuration files and corresponding sections.
                The following are configuration items about clients:

                        [Service]
                        ServiceStatusClients=127.0.0.1, SmarSearchProxyAddress,
                        SMServerAddress,SmartAnalytivsServerAddress.*
                        ServiceControlClients=127.0.0.1, SmarSearchProxyAddress,
                        SMServerAddress,SmartAnalytivsServerAddress.*
                        [AdminRole]
                        Clients=127.0.0.1,SmarSearchProxyAddress,SMServerAddress,Sma
                        rtAnalyticsServerAddress.*
                        [QueryRole]
                        Clients=127.0.0.1,SmarSearchProxyAddress,SMServerAddress,Sma
                        rtAnalyticsServerAddress.*
                        [IndexRole]
                        Clients=127.0.0.1,SmarSearchProxyAddress,SMServerAddress,Sma
                        rtAnalyticsServerAddress.*

2. Make sure the Smart Search proxy server has configured the new content servers as its
  clients. You need to configure the IPv4 and IPv6 addresses for the new content server in the
   level2proxy\IDOLServer.cfg file for the following items.

   ServiceStatusClients

       ServiceControlClients


       [AdminRole]...Clients

       [QueryRole]...Clients

       [IndexRole]...Clients
  You may need to restart the Smart Search proxy server after you update the configuration
  file.

               Note

             If you use FQDN instead of IP addresses, make sure that your DNS is correctly
             configured to revolve the FQDN.

3. After you start a new content server, go to the Smart Analytics Assistant page to add it to
  the Smart Search Content by clicking the Add link in the Smart Search Content section. For
  details about using Smart Analytics Assistant, see Use Smart Analytics Assistant.

4. Repeat the previous steps if you want to add more content servers.
5. Click the Redistribute link to balance data distribution. This step is mandatory to mark the

  new content server active.

               Note

             We recommend that you back up your existing content servers before you run
             the Redistribute action. It may take a long time to redistribute your data among
             all Smart Search content servers.


1.3.2.1.7. Remove a content server for Smart
Search

User Role: Administrator
To remove a content server for Smart Search, follow these steps:

   1. Update the data weight of the content server that you want to remove to 0.
     Action example:
      http://<Smart Search Host>:<dih
     port>/action=EngineManagement&EngineAction=Edit&ID=2&Weight=0

   2. Redistribute data among the remaining contents servers.
     Action example:
      http://<Smart Search Host>:<dih port>/DREREDISTRIBUTE

   3. Remove the content server.
     Action example:
      action=EngineManagement&EngineAction=Remove&ID=2


1.3.2.1.8. Modify Smart Search content servers
and weight for data

User Role: Administrator

Smart Search uses consistent hashing for distribution of data. In consistent hashing mode, you
can add, remove, or change the weight of child servers in your DIH without having to reindex all
your content.

In this mode, DIH distributes documents among a large, fixed number of virtual nodes (4096),
and then assigns these nodes to one or more child servers. When you change the number or
weight of the child servers, you can use the DREREDISTRIBUTE index action to redistribute the
virtual nodes between the new set of servers without reindexing all the data.

In consistent hashing mode, all content is distributed in virtual nodes, which the DIH assigns to
one or more child servers. When you run the DREREDISTRIBUTE index action, DIH checks
whether the child server architecture has changed. If there is a change, DIH automatically exports
and indexes the content in virtual nodes to redistribute your data evenly between the available
child servers.

You can check current Smart Search contents and their ratio of data (including the information of
data weight and vnode) by sending an action to the Smart Search proxy DIH server (20080 by
default):

Action example:

http://<Smart Search Host>:<dih port>/action=enginemanagement&engineaction=showstatus

To modify the Smart Search content servers and the weight for data distribution, use the
EngineMangement&EngineAction=Edit action.

     Change the weight of data distribution.

     Action example:

      http://<Smart Search Host>:<dih
     port>/action=EngineManagement&EngineAction=Edit&ID=2&Weight=2

     Update only this content server (receives document updates but doesn't receive new
     documents):

     Action example:

      http://<Smart Search Host>:<dih
     port>/action=EngineManagement&EngineAction=Edit&ID=2&UpdateOnly=true

     Disable this content server (mark it as offline):


            Note

           When a child server is disabled, the DIH continues to assign documents to it,
           and queue up index actions, but it doesn't attempt to send them until the child
           server is enabled again.

Action example:
http://<Smart Search Host>:<dih
port>/action=EngineManagement&EngineAction=Edit&ID=2&Disabled=true
````
