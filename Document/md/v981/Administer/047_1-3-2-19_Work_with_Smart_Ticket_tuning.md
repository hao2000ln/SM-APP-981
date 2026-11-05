---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.3.2.19 .. 1.3.3
printed_pages: 1098-1133
---

# 1.3.2.19 Work with Smart Ticket tuning

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.2.19. Work with Smart Ticket tuning

The company provides a Smart Ticket tuning toolkit to assist in tuning your Smart Ticket
configuration and improving the Smart Ticket classification accuracy. This toolkit includes a data
distribution analysis tool that can provide reports on your data distribution and a visualization tool
that can generate a confusion matrix based on a set of sample test data. Additionally, this toolkit
can help you achieve better results by modifying certain IDOL configuration parameters from the
Smart Ticket configuration UI.
To work with the Smart Ticket tuning toolkit, refer to the following topics:
Use the data distribution analysis tool
View data distribution analysis results
Configure the best Source Data Coverage percentage
Prepare your training samples
Use the Confusion Matrix tool
Access Confusion Matrix data
Understand Confusion Matrix data
How to use Confusion Matrix
New configurations
Updated configurations
Move trained intelligence from staging to production


1.3.2.19.1. Use the data distribution analysis tool

In a Smart Ticket configuration, on the Training Optimization tab, the Source Data Coverage
parameter has a default value of 90, which means 90% of the total source data records are used
to build a classification system.
The default value of 90 is the recommended value, which means with 90 percent of the training
samples, the system can capture the best description of your data to build the intelligence, which
will be used to categorize new tickets later. However, it may not always work well for all customer
scenarios, and this is where the data distribution analysis tool can help. The data distribution
analysis tool can help you visualize your tickets distribution among all of your categories, and
render the results in descending order.


1.3.2.19.1.1. View data distribution analysis
results

Follow these steps to view data distribution results:
   1. Go to System Administration > Ongoing Maintenance > Smart Analytics > Smart Ticket.
   2. Click Search.
   3. Select a Smart Ticket task from the list, and then click View Distribution.

The following figure shows an example based on the out-of-box data.

The columns of Category, Subcategory, and Area are different levels in the category hierarchy
of the interactions in the OOB system, the “Amount” column is the number of tickets of each
category, and the column of “Accumulation” is the accumulated percentage of interactions of the
total records.

We can see that 90% means the categories of the first 14 rows constitute the majority of the OOB
interactions. So, with this data distribution analysis tool, you can get a better understanding of


your tickets, which can in turn help you better train your Smart Analytics system from the
following perspectives.
You can perform the following tuning tasks based on your data distribution results.


1.3.2.19.1.2. Configure the best Source Data
Coverage percentage

In the visualized results, you can have a clear understanding of which of the 90% training
samples are mapped to which categories and how many. And you can adjust this configuration
according to your own situation. Take the previous screenshot of the OOB data for example, we
can find, from row 6 to row 14, those categories don't contain many tickets. We can regard them
as minor categories, so we can set the “Source data coverage” to 61%. In this way, we can cover
the major categories and reduce noises as well.


1.3.2.19.1.3. Prepare your training samples

If some of your categories are too similar, they're not good training samples. For instance,
“laptop” and “desktop” are too similar to be distinguished from each other. However, in most
customer systems, they are normally treated as two different categories and most likely linked to
the same supporting group. Therefore, training the system with this kind of data will lead to low
accuracy test results, but has no impacts on the ticket assignment.
For such situations, we recommend you consider combining these similar categories before
starting training.


1.3.2.19.2. Use the Confusion Matrix tool

When working with Smart Ticket, you may want to know more about how Smart Analytics works.
The most frequently asked questions are: Why our tickets get classified into certain categories?
Why our Smart Ticket has a lower testing accuracy? How do I tune Smart Ticket to get a better
categorization accuracy?
The Confusion Matrix tool aims to help you understand what happens under the hood, and to
guide you to further tune Smart Ticket to achieve a satisfactory categorization accuracy.
A Confusion Matrix is basically a table to show users one specific test result. You can find out
which categories are good or bad in this test, and then tune the system accordingly.


1.3.2.19.2.1. Access Confusion Matrix data

The Confusion Matrix tool analyzes data against a Smart Ticket task. Follow these steps to view
confusion matrix data for a Smart Ticket task:

   1. Go to System Administration > Ongoing Maintenance > Smart Analytics > Smart Ticket.
   2. Select a Smart Ticket task from the list, and then click Visualize.

     If your Service Manager is in the multi-company mode and you have added multiple
     companies to the Smart Ticket task, you need to select a company after you click Visualize.

                   Note

                This Visualize functionality is available only after you run a test against the
                categorizer (Smart Ticket task).

   3. If needed, modify the following settings for Confusion Matrix.

Field                                                                                       Service Manager 9.81
Top N Categories
                                        Description

                                        This field indicates how many categories
                                        you want to analyze with the Confusion
                                        Matrix tool. For example, if you select a
                                        value of 10, only the top 10 categories in
                                        your data distribution analysis report will
                                        be analyzed.

                                                    Caution

                                                   Selecting a large number of
                                                   categories may lead to slow
                                                   page rendering. Normally, you
                                                   need to take care of your
                                                   major categories only.

       Field                                                                                Service Manager 9.81

       Display Format                   Description

This PDF was generated on May 23, 2026              Note

                                                   Both the row number and the
                                                   column number in a Confusion
                                                   matrix are less than the
                                                   minimum value of the current
                                                   predictable category count
                                                   and the Top N Categories
                                                   value. If the previous testing
                                                   version has unpredictable
                                                   categories, the number of
                                                   rows and columns in the
                                                   Confusion Matrix based on the
                                                   previous test result will not
                                                   match the Top N Categories
                                                   settings.

                                                   For example, there are 13
                                                   categories in the first round
                                                   testing result. The system
                                                   administrator changes the
                                                   data source coverage from 90
                                                   to 50, and then only 7
                                                   categories are predictable.
                                                   Consequently, after training
                                                   and testing, the system
                                                   displays a 7*7 Confusion
                                                   Matrix table for both the first
                                                   round and the second round
                                                   testing result even though the
                                                   system administrator sets the
                                                   Top N Categories value to 13.

                                        There are two options:

                                        • By Error Count: Show the confusion
                                        matrix data by number of error tickets.

                                        • By Error Ratio (%): Show the confusion
                                        matrix data by test error ratio
                                        (percentage).

                                                                                                                   Page 198 of 279
Field                                                                                       Service Manager 9.81
Medium Error Threshold
                                        Description
High Error Threshold
                                        This is the minimum error count or error
                                        ratio (depending on the display format)
                                        that you want to assign a medium severity.

                                                    Note

                                                   In the Confusion Matrix table,
                                                   numeric values between this
                                                   field value and the High Error
                                                   Threshold value are
                                                   highlighted in yellow.

                                        This is the minimum error count or error
                                        ratio (depending on the display format)
                                        that you want to assign a high severity.

                                                    Note

                                                   In the Confusion Matrix table,
                                                   numeric values no less than
                                                   this field value are highlighted
                                                   in red.

4. Click Confusion Matrix to view the Confusion Matrix results.


1.3.2.19.2.2. Understand Confusion Matrix data

The following figure shows an example Confusion Matrix.

A Confusion Matrix is a two-dimensional matrix: each column header is a true Category ID and
each row header is a predicted Category ID. Each intersection cell lists the number (or ratio) of
records that actually belong to the column category but are predicted as the row category.

Each value on the diagonal line indicates the number (or ratio) of correctly predicted tickets for
this category, and is highlighted in green.

Each of other values indicates the number (or ratio) of incorrectly predicted tickets for the
category, and is highlighted in light yellow, dark yellow, or red, based on the Medium Error
Threshold and High Error Threshold values that you have defined.

You can find the following information from the header of Confusion Matrix form.


Item                                    Description
Comment
                                        In this field, you can add comments for this
Test Time                               test round.
Test Result
                                        Timestamp of this test round.

                                        The accuracy results of this test round,
                                        including the following:

                                             First hit count: number of tickets that
                                             succeeded in the first recommended
                                             category

                                             Correctness Ratio: first hit count/total
                                             number of test samples (%)

                                             Second hit count: number of tickets
                                             that succeeded in the second
                                             recommended category

                                             Correctness Ratio: sum of first and
                                             second hit counts/total number of test
                                             samples (%)

                                             Third hit count: number of tickets that
                                             succeeded in the third recommended
                                             category

                                             Correctness Ratio: sum of the first,
                                             second and third hit counts/total
                                             number of test samples (%)

                                             Missed count: number of tickets that
                                             have no recommended categories

                                             Missed Ratio: Missed count/total
                                             number of test samples (%)

Also, at the bottom of the Confusion Matrix table, there are several other things, which are
aligned to each category:


Item                                              Description

No suggestion                                     This is the number of tickets in this category
                                                  that the system did not provide a suggested
                                                  category.

Count                                             This is the total number of test tickets in this
                                                  category, including successful, failed, and no
                                                  suggestion ones.

Precision                                         A precision value indicates the ratio of the
                                                  number of correctly predicted records in a
                                                  row (the green number in a row) to the sum
                                                  of all predicted records in the same row (sum
                                                  of the row).

Recall                                            A recall value indicates the ratio of correctly
                                                  predicted records (the green number in a
                                                  column) to the sum of all records in this
                                                  category (sum of the column).

Category Tuning form

In a Confusion Matrix, category IDs in both the column headers and the row headers are
clickable. You can click a category ID in a Confusion Matrix to open a Category Tuning form.

This form contains the following fields or tabs.               Page 202 of 279

This PDF was generated on May 23, 2026
 Field / Tab                                                                                     Service Manager 9.81
 Category
 Categorizer                            Description
 Category Name
 Document Count                         The ID of the current category.
 Training Document
 Category Trainings                     The Smart Ticket task that's used for this test
                                        round.
 Testing Samples
                                        The name of the current category.
This PDF was generated on May 23, 2026
                                        The total number of documents within this
                                        category.

                                        The number of documents used to train this
                                        category.

                                        In this tab, you can find all training
                                        documents for this category, as well as their
                                        ticket ID, status and training text.

                                             You can use the Add Training
                                             Document button to add more
                                             documents or the Delete Training
                                             Document button to delete existing
                                             documents, and then click the Apply
                                             Changes button to tune this category.
                                             The Confusion Matrix tool can help you
                                             decide which tickets should be deleted
                                             by calculating the relevance of chosen
                                             tickets against the current category.
                                             You can select training tickets and click
                                             the Evaluate Relevance button to get
                                             the results.

                                        This tab contains all tickets used to test this
                                        category, as well as their ticket ID, title, and
                                        body.

                                             You can use the Add Test Sample
                                             button to add more documents to
                                             trigger a new round of test.
                                             You can also use the Delete Test
                                             Sample button to delete any existing
                                             test samples that are appropriate for
                                             this category.

                                                                                                                         Page 203 of 279
Field / Tab                                                                                      Service Manager 9.81
Category Terms
                                        Description

                                        This tab contains all terms related to the
                                        current category, and their weights.

                                             You can add new terms to the system
                                             with a specified weight by using the
                                             Add Term button.
                                             You can modify the weight for existing
                                             terms by specify a new weight in the
                                             Modified Term Weight column and the
                                             clicking Save Term Weights. Such
                                             modifications will adjust the
                                             classification results regarding this
                                             category.
                                             You can use the Reset Terms button to
                                             revert the weights of all terms to their
                                             generated term weights. This will revert
                                             your manual term weight changes.
                                             You can choose one term and click the
                                             View Selected Term Occurrence button
                                             to see the exact places where this term
                                             occurs.
                                             You can use the View History button to
                                             view all category tuning snapshots of
                                             the current category.

Field / Tab                                                                                      Service Manager 9.81

                                        Description

                                                    Note

                                                        The Weight column
                                                        indicates the current weight
                                                        of the term, the Generated
                                                        Term Weight column
                                                        indicates the system-
                                                        generated weight for the
                                                        term, and the Modified
                                                        Term Weight column allows
                                                        you to specify a new weight
                                                        for the term.
                                                        Term weights may change
                                                        accordingly after training
                                                        with new training samples;
                                                        however, if you adjust a
                                                        term weight manually, it
                                                        becomes a fixed value and
                                                        will not be automatically
                                                        changed.

                                                        If a term is a stop word after
                                                        stemming, the system
                                                        displays the following error
                                                        message when you click
                                                        this term:

                                                         No valid query text
                                                        supplied All terms were
                                                        invalid, through being stop
                                                        words, too short, or
                                                        incorrectly formatted .

Smart Ticket Test Result form

From within the confusion matrix table, if you hover over a non-zero number, a tip message is
displayed to explain the expected category and actual recommended category in this test round.
Clicking the number will direct you to the Smart Ticket Test Result form:


The first half of this page is a list of test documents, and the second half is the detail form of the
selected test document in the list.
The test document detail form provides the following information.

 Field                                                                                           Service Manager 9.81
 Test Round
 Test Record                            Description
 Categorizer
 Category                               The ID of this test.
 Predicted Category
 Prediction Score                       The ID of the current test document.
 Category Predictions
                                        The name of the categorizer (Smart Ticket
 Test Document Body                     task) used for the current test.
 Test Document Terms
                                        The expected category for the current test
 Errors                                 document.

Category Snapshot form                  The actual recommended category for the
                                        current test document.

                                        The confidence score of this prediction.

                                        This tab contains a list of all predicted
                                        categories from Smart Ticket for the current
                                        test document, sorted by prediction score.
                                        You can also find the key words used to
                                        match the current test document to each
                                        predicted category.

                                        This tab contains the test document body
                                        text. Out of box, the text comes from the title
                                        and description of the ticket.

                                        This tab contains a list of terms extracted
                                        from the current test document, as well as
                                        their following information:

                                             Weight: term weight
                                             Document Occurrences: number of
                                             occurrences in the current document
                                             Total Occurrences: total number of
                                             occurrences in the system

                                        This tab contains log information if any errors
                                        occur during the test.


Click the View History button on the Category Tuning form to drill down to the Category
Snapshot form.

On this form, you can find all of the tuning rounds for the current category that are recorded in
the system. You can choose the best round and click the Rollback button to change the category
training state to that tuning round.

            Note

           The rollback action affects the current selected category only, and you can only roll
           back the modifications made by the system administrator. If an agent uses the Add to
           Tuning Records option to add a record to the training sample and the system
           administrator has applied this change, this modification can't be rolled back.


1.3.2.19.2.3. How to use Confusion Matrix

Training document management

Training documents are the source of the intelligence Smart Analytics learns from. That said, the
better you choose the training documents, the higher categorization accuracy you will achieve.
Good training document management will eventually improve your IT help desk working
efficiency.

In the Category Tuning form, the Category Trainings tab displays all of the documents/tickets that
the system uses to train the current category.

If the categorization accuracy is unacceptable, you can do the following:

   1. Check the Confusion Matrix table to identify the test values highlighted in red, and perform
     the following steps for each corresponding expected category.

   2. Click the corresponding expected category to drill down to the category tuning page.
   3. Review all current training documents. If you find any unreasonable training documents,

     delete them by clicking the Delete Training Document button to improve the training quality.
     If you find there aren't adequate number of training documents for the category, add more
     by using the Add Training Document button to tune this category.
   4. Click Apply Changes to make your training changes take effect.

Testing data management

The Confusion Matrix tool can keep all your test tickets, which enqables you to review the test
accuracy results and then troubleshoot the causes of bad test results.

The following is one possible scenario:

   1. Find one red value in the Confusion Matrix.
   2. Click the expected category in the same column where the red value is located to drill down

     to the Category Tuning page for the expected category.
   3. Click the Test Samples tab to review all of the test documents for the current category and

     identify those unreasonable test tickets. In reality, there might be some tickets mistakenly
     categorized by IT agents, and these tickets aren't appropriate for testing the current
     category.
   4. Select these unreasonable tickets and then click Delete Test Sample to delete them.

Another way to identify those bad test tickets is as follows:

   1. Find one red value in the Confusion Matrix.
   2. Click the predicted category in the same row where the red value is located to drill down to

     the “Smart Ticket Test Result” page, where you can see a whole list of test tickets that failed
     the test.
   3. Review the detail information of these test tickets.


   4. If a test ticket demonstrates some characteristics that are unknown to the system, click the
     Add to Tuning button to add this ticket to the training sample pool.

   5. If you find that a test ticket was put in this category by mistake, click the Remove Test
     Sample button to delete it to improve the test accuracy.

Term management

Sometimes you may know the typical terms for one specific category. In this case, you can add
these terms directly to the system and bind them to this category.

It may also happen that when you review the terms for one specific category in the Category
Terms tab, you know exactly that some terms should not have been related to this category. In
this case, you can change its weight to 0 to remove it from the categorization process.

Category similarity analysis

With the Confusion Matrix tool, you can find out that some test errors are caused by the high
similarity of some categories that the system can hardly distinguish.

Normally, if you notice some red blocks in the Confusion Matrix table, it means a category has a
lot of test errors. You can then click those two relevant categories to drill down to the pages
where you can find the terms that Smart Analytics extracted for them. Most likely, most of those
terms are the same, which means the training samples that you provide to Smart Analytics for
those two categories have very similar descriptions. You need to think about whether it is proper
to keep them as two separate categories.

Contents

     1 Training document management
     2 Testing data management
     3 Term management
     4 Category similarity analysis


1.3.2.19.3. New configurations

This section describes the new configurations introduced by the Smart Ticket tuning tool.

Suggestion Threshold

Smart Ticket classifies every ticket with a prediction score, which indicates how confident Smart
Ticket is when making this prediction (suggestion).

The Suggestion Threshold setting is introduced for you to control whether Smart Ticket makes a
suggestion based on the prediction score or not. If you have configured the Suggestion
Threshold value, the system automatically adds the Threshold parameter to the
CategorySuggestFromText action when making a prediction. All the returned categories include
the related prediction scores (the weight value). If the prediction score of a predicted category is
less than this threshold value, Smart Ticket will ignore this predicted category.

Follow these steps to configure this setting:

   1. Go to System Administration > Ongoing Maintenance > Smart Analytics > Smart Ticket.
   2. Select a task from the list.
   3. On the Configurations tab, enter an integer between 0 and 100 in the Suggestion

     Threshold field.
   4. Click Save.

The Suggestion Threshold value in Smart Ticket tasks is null by default, which means that the
system will not add the Threshold parameter when making a prediction. In this case, the default
value is 0.

Prefilled parent category testing

            Note

           The Prefilled checkbox is used only for testing Smart Ticket.

By default, Smart Ticket assigns Categories to generic support tickets, and uses this information
in the prediction process. However, the Category, Subcategory, and Area fields of tickets
submitted by users are often already filled. To more closely replicate the results of end-user
prediction, you can select the first Prefilled checkbox so that Smart Ticket uses information
entered by end-users instead of the automatically-assigned information. However, this will make
the results of Smart Ticket prediction less accurate.

Follow these steps to improve test results:

   1. Go to System Administration > Ongoing Maintenance > Smart Analytics > Smart Ticket.
   2. Select a task from the list.


   3. On the Configurations tab, select the Prefilled checkbox to the right of the Level 1 and
     Level 2 fields.
     If Subcategory is not prefilled, don't select the checkbox for Level 2.

Contents

     1 Suggestion Threshold
     2 Prefilled parent category testing


1.3.2.19.4. Updated configurations

This section describes the configuration changes that you need to make because of the
introduction of this Smart Ticket tuning toolkit.

Transliteration

In the content.cfg file, remove the Transliteration=false line:

[LanguageTypes]
GenericTransliteration=TRUE

Define the removed line only in a specific language section if you don't want that language to use
"transliteration".
You can find a detailed description of this configuration in the following document:

<Smart Analytics install
directory>/IDOL/help/IDOLServerReference#Configuration/LanguageTypes/Languages/Transliter
ation.html

Stemming

In the content.cfg file, use the following configuration for stemming:

GenericStemming=true
GenericFullStemming=true

You can find a detailed description of this configuration in the following document:
<Smart Analytics install
directory>/IDOL/help/IDOLServerReference#Configuration/LanguageTypes/Languages/Stemmin
g.html

Propername

The ProperNames configuration parameter controls whether terms are created from pairs of
consecutive words in index fields.

In the content.cfg file, configure the following parameter:

ProperNames

You can find a detailed description of this configuration in the following document:
<Smart Analytics install
directory>/IDOL/help/IDOLServerReference#Configuration/LanguageTypes/Languages/ProperNa
mes.html

Hyphenchars and AugmentSeparators


In the content.cfg file, you can configure how Smart Analytics should handle hyphens.
Configure the following parameters:

      HyphenChars
      AugmentSeparators

You can find detailed descriptions of this configuration in the following documents:

      <Smart Analytics install
     directory>/IDOL/help/IDOLServerReference#Configuration/LanguageTypes/Languages/Hyp
     henchars.html
      <Smart Analytics install
     directory>/IDOL/help/IDOLServerReference#Configuration/LanguageTypes/Languages/Aug
     mentSeparators.html

Number index

You can find a detailed description of this configuration in the following document:

<Smart Analytics install
directory>/IDOL/help/IDOLServerReference#Configuration/LanguageTypes/Languages/IndexNu
mbers.html


1.3.2.19.5. Move trained intelligence from
staging to production

For information on how to perform this task, refer to Transfer Smart Analytics intelligence.


1.3.3. Smart Analytics best practices

This section provides the following best practices on how you can configure and use Smart
Analytics so that it brings more value to your business:
Improving accuracy for Smart Ticket
Improve Smart Analytics query performance


1.3.3.1. Improve accuracy for Smart Ticket

Smart Analytics provides several methods to help you to increase Smart Ticket accuracy
according to different data sets. This section provides some best practices for you to improve the
accuracy of Smart Ticket.

     Set up data cleansing rules

     Data cleansing can help you prepare the data that you want to send to Smart Analytics for
     indexing, training, and analyzing. By setting up proper data cleansing rules, you can have
     better data quality, which is critical to the best accuracy of auto-suggestion. To set up data
     cleansing rules, see Configure data cleansing.

     Choose best sample data

     In the definition for Smart Ticket or Hot Topic Analytics, you can specify a sample data
     query, through which you can decide what kind of data that you want to use as sample data
     to teach Smart Analytics to build the intelligence out of your large data volume.

     For example, you may have an "Other" category in your Service Manager implementation to
     accommodate the interactions for which the Service Desk agents can't find a better, more
     accurate category. Normally, the interactions in this "Other" category aren't considered as
     good sample data for Smart Ticket. We recommend that you add a filtering clause such as
      category~="Other" into the Training Sample Query field to exclude those records.

     Another example is that you can choose the records logged by Subject Matter Experts
     (SME) as the training samples for Smart Tickets. In this way, you can have sample data with
     better quality for categorization.

     Apply rule based training for Smart Ticket

     The basic training of Smart Ticket is meaning based training, which means Smart Analytics
     builds its intelligence based on the text information of your data. On top of meaning based
     intelligence, Smart Analytics also supports you to add rule based training to the Smart
     Ticket. Those rules will further increase the suggestion accuracy, especially in the case that
     multiple suggestion results have the same relevancy with the new record. The typical
     scenario is that if one particular record has the same relevancy within several categories,
     you can append a rule to one specific category to improve the categorization accuracy.

     For how to apply a rule to the Smart Ticket task definition, see Apply a rule-based training.

     Optimize your training for Smart Ticket

     Several advanced parameters defined in the Smart Ticket task definition are used to
     optimize the accuracy of auto suggestion. Note that these settings are tradeoffs between
     training time and accuracy, which means higher accuracy is achieved at the cost of longer
     training time. Listed below are some best practices for these optimization configurations.

           Training by documents or training by terms


     Choose “best term” for a faster training process if you have huge data volume; choose
     "training documents" for a higher accuracy with a slower training process.

     Training sample per category

     The maximum records for each category, normally more training sample per category
     leads to higher accuracy but longer training time.

     Source data coverage

     The percentage of records out of the total source data that are used to create
     categories. Normally higher percentage means higher accuracy, but there is a
     threshold point. When the training source data percentage exceeds the threshold, the
     margin contribution will be lowered remarkably. The out-of-box value for this
     configuration is 90%, which is a best number tested in the lab. You can use the
     “source data coverage calculator” tool to find the best number for your data set.

     Document weight and term weight

     Enable "Adjust term weight from test result" to automatically adjust the term weight for
     some terms in some categories based on the testing result, which may help improve
     accuracy.

     Enable "Remove low weight document" to help reduce the disturbance of low
     relevance training samples and improve accuracy.

     By default, these two parameters are disabled in the out-of-box environment.

     These advanced features need your experiment to get best results. You may enable
     either one or both.

Perform tuning periodically

Tuning the training result is a mechanism to continuously improve the accuracy of auto
suggestion. For information about how to tune the training result, see Perform tuning in the
Smart Ticket definition.


1.3.3.2. Improve Smart Analytics query
performance

User Role: Administrator
Caching some match fields into memory can accelerate the query speed of Smart Analytics. To
achieve this, you can modify the configuration files and corresponding sections of the content
servers for which you want to accelerate the query speed.
To configure cache settings for match fields, follow these steps:

   1. Open the <SmartAnalytics>/Content<x>/Content<x>.cfg files of the content servers for
     which you want to accelerate the query speed.

   2. Configure the cache settings for match fields as follows:

          [server]
          NodeTableCacheFields=True
          NodeTablePrepopulateCache=True
          //--------------------------- Cache Settings ------------------------
          ---------//
          //Maximum size of the field cache (in KB). Increasing the size of the
          cache can improve performance. However, you must ensure the host
          machine has sufficient available memory.
          [MemoryCache]
          EvictWhenFull=True
          MaxSize=1024000
          [FieldProcessing]
          23=SetCachedFields
          [SetCachedFields]
          Property=CachedFields
          PropertyFieldCSVs=*/*_MATCH,*/IMPORTMAGICEXTENSION
          //---------------------------Properties------------------------------
          -//
          [CachedFields]
          MemCachedType=True

   3. Restart the content servers for which you modified the configuration files.


                   Note

                It takes a while for the content servers to get restarted. For example, it takes
                about 35 minutes if you restart content servers on an environment with 1G
                memory cache. You can monitor the restart status by checking the <Smart
                Analytics>/Content<x>/logs/application.log file. If the caching is successful,
                you can see log information similar to the following:

                        22/09/2016 16:45:50 [1] 30-Normal: Indexing nodetable memory
                        information for 2268213 documents.
                        22/09/2016 16:46:26 [1] 30-Normal: Indexing information from
                        documents 10% complete.
                        22/09/2016 16:47:35 [1] 30-Normal: Indexing information from
                        documents 20% complete.
                        22/09/2016 16:49:31 [1] 30-Normal: Indexing information from
                        documents 30% complete.
                        22/09/2016 16:53:39 [1] 30-Normal: Indexing information from
                        documents 40% complete.
                        22/09/2016 16:58:10 [1] 30-Normal: Indexing information from
                        documents 50% complete.
                        22/09/2016 17:02:05 [1] 30-Normal: Indexing information from
                        documents 60% complete.
                        22/09/2016 17:06:28 [1] 30-Normal: Indexing information from
                        documents 70% complete.
                        22/09/2016 17:10:51 [1] 30-Normal: Indexing information from
                        documents 80% complete.
                        22/09/2016 17:15:11 [1] 30-Normal: Indexing information from
                        documents 90% complete.
                        22/09/2016 17:19:34 [1] 30-Normal: Populated nodetable
                        memory cache.
                        22/09/2016 17:19:34 [1] 30-Normal: Writing out stateinfo
                        22/09/2016 17:19:34 [1] 00-Always: Initialized memory.

To improve the Smart Search response performance, you need to update the following
configuration files in all content servers and the Smart Analytics Main server:

     <SmartAnalytics>/Content1/Content1.cfg
     <SmartAnalytics>/Content2/Content2.cfg
     <SmartAnalytics>/Content3/Content3.cfg
     <SmartAnalytics>/IDOL/IDOLServer.cfg
     Scaled content server

Follow these steps:

   1. Update the existing parameters as highlighted in bold, or add the highlighted parameters if
     they don't exist:


IndexCacheMaxSize=512000
Sample code:

//--------------------------- Cache Settings --------------------
---------//
[IndexCache]
IndexCacheMaxSize=512000

         PropertyFieldCSVs=*/*_MATCH,*/EDK_*,*/*_MATCH_INDEX,
        */*_MATCH_WEIGHT*,*/*_BOOLEAN,*/IMPORTMAGICEXTENSION
        Sample code:

             [SetMatchFields]
             // Specify fields whose entire value is frequently used as a
             restriction in a search and are thus
             // stored for optimised matching.
             // NB Such fields can't be numeric and can only be parametric if
             parametricnumericmapping=false.
             Property=MatchFields
             PropertyFieldCSVs=*/*_MATCH,*/EDK_*,*/*_MATCH_INDEX,
             */*_MATCH_WEIGHT*,*/*_BOOLEAN,*/IMPORTMAGICEXTENSION

2. Locate the [DateFields] section under the Properties separation line, and then add a new
  parameter Index=TRUE :


          //---------------------------Properties------------------------------
          -//
          [IndexFields]
          Index=TRUE
          [IndexWeightFields2]
          Index=TRUE
          Weight=2
          [IndexWeightFields4]
          Index=TRUE
          Weight=4
          [IndexWeightFields8]
          Index=TRUE
          Weight=8
          [IndexWeightFields16]
          Index=TRUE
          Weight=16
          [SectionFields]
          SectionBreakType=TRUE
          [DateFields]
          DateType=TRUE
          Index=TRUE

   3. Restart the content server and the IDOL server.
   4. Perform a full re-index for Smart Search.
To improve Smart Search performance, you need to update the following configuration files:

     <SmartAnalytics>/Content1/Content1.cfg
     <SmartAnalytics>/Content2/Content2.cfg
     <SmartAnalytics>/Content3/Content3.cfg
     Scaled content server
Follow these steps:
   1. Update the Schedules section as follows:

          //--------------------------- Schedules ----------------------//
          //expire and compact data everyday
          [Schedule]
          Expire=TRUE
          ExpireTime=23:00
          ExpireInterval=24:00
          Compact=True
          CompactTime=00:00
          CompactInterval=24:00


2. Restart the content servers.
````
