---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.3.4 .. 1.3.5
printed_pages: 1133-1163
---

# 1.3.4 Smart Analytics tailoring

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.4. Smart Analytics tailoring

This section provides the following tailoring best practices for Smart Analytics:
Extend Smart Ticket to other modules
Execute OCR in other processes
Implement OCR in a field other than the Description field
Add filters to the Hot Topic Analytics form
Enable Hot Topic Analytics for other modules
Customize actions in hot topic map
Configure Smart Analytics to support more languages


1.3.4.1. Extend Smart Ticket to other modules

User Role: Administrator

In the out-of-box system, Smart Ticket (auto-classification) is only enabled for the Service Desk
module. If you want to use this feature in other modules, you can tailor your Service Manager
system.

For example, if you want to automatically classify Change category with Process Designer
enabled, follow these steps:

   1. Define the Smart Ticket task for the Change Management module:

        1. From the System Navigator, click System Administration > Ongoing Maintenance >
           Smart Analytics > Configuration > Smart Tickets.

        2. Select Blank, and then click the Add button.
        3. In the Add Smart Ticket Task form, fill in the task name with any words meaningful to

           you.
        4. In the Configuration tab, choose Change as Module Name.

        5. In the Training Sample Query field, provide a query by using Query Builder. This query
           decides which Change records will be sent to Smart Analytics for Smart Ticket
           training.

        6. Enter the fields in the Change module that you want to be automatically filled by Smart
           Ticket. For example, category.

        7. Enter the fields in the Change module that you want to use as the inputs for Smart
           Analytics to provide suggestions. For example, description.

   2. Create new Smart Ticket rule sets for the Change workflow by referring to the following out-
     of-box Smart Ticket rule sets as examples.

Rule Set                                Description

sd.idol.ocr                             This rule triggers Optical Character
                                        Recognition (OCR) and auto-classification
                                        to fill the fields defined in the Smart Ticket
                                        definitions.

sd.idol.tuning.action                   This rule sends the record to the tuning
                                        list.


               Tip

             For information about how the design workflows and rule actions, refer to the
             Process Designer documents in the Service Manager help center.

3. Add the Smart Ticket rule sets that you created to the Change workflow:
     1. From Change Management > Configuration > Change Workflows, select the
        workflow to which you want to apply the Smart Ticket rule. For example, standard
        change.
     2. Select the Registration and Categorization phase.
     3. Click the Rule Sets tab in the property section.
     4. Select the On Exit event.
     5. Select the Smart Ticket rule that you created.

4. Create a new form or update the existing form to use the new Smart Ticket task for the
  Change Management module. You can refer to the "Create Smart interaction" form
  (idol.quick.new.interaction) as an example.


1.3.4.2. Execute OCR in other processes

User Role: Administrator
Optical Character Recognition (OCR) is an out-of-box feature for Smart Ticket, which can extract
texts from images, and then put the text into the interaction records when submitting requests by
using Smart Ticket.
If you want to execute OCR when proceeding with other processes such as escalating, saving, or
closing records, you can refer to the following example to tailor your Service Manager.
The following example describes how to execute OCR when escalating an interaction to an
incident in different Service Manager modes. You need to make changes accordingly if you want
to execute OCR on other actions in different modules.

Execute OCR when escalating an interaction to an incident
in the Service Manager Classic or Hybrid mode

To execute OCR when escalating an interaction to an incident in Service Manager Classic, follow
these steps:

   1. Add a new ScriptLibrary, such as IDOL_OCR_Esclation, as follows:

          function processOCRNonPD(interaction, language) {
          var ocrResult = lib.IDOL_Utilities.processOCR(interaction,
          'description', language);
          if (ocrResult) {
          interaction.doSave();
          system.functions.rtecall("refresh", vars['$L.errorcode'],
          interaction);
          }
          }

   2. Update the "cc.first.log2" process:
        1. Open the "cc.first.log2" process, and then go to the RAD tab.
        2. Locate the "cc.save" RAD application.
        3. In the Post RAD Expressions section of the "cc.save" RAD application, add the
           following statement:
            if ($L.exit="normal") then ($L.void=jscall("IDOL_OCR_Esclation.processOCRNonPD",
           $L.file, $G.my.language))

Execute OCR when escalating an interaction to an incident
in the Service Manager Codeless mode


To execute OCR when escalating an interaction to an incident in Service Manager Codeless,
follow these steps:

   1. Add a new ScriptLibrary, such as IDOL_OCR_Esclation, as follows:

          function processOCRPD(interaction, language) {
          var ocrResult = lib.IDOL_Utilities.processOCR(interaction,
          'description', language);
          if (ocrResult) {
          interaction.doSave();
          system.functions.rtecall("refresh", vars['$L.errorcode'],
          interaction);
          }
          }

   2. Update the "sd.escalate" process:
        1. Open the "sd.escalate" process, and then go to the RAD tab.
        2. Locate the "se.view.engine" RAD application.
        3. In the Post RAD Expressions section of the "se.view.engine" RAD application, add the
           following statement:
            if ($L.es.action={"added", "normal", "resetrec"}) then
           ($L.void=jscall("IDOL_OCR_Esclation.processOCRPD", $L.file, $G.my.language))

Contents

     1 Execute OCR when escalating an interaction to an incident in the Service Manager Classic
     or Hybrid mode
     2 Execute OCR when escalating an interaction to an incident in the Service Manager
     Codeless mode


1.3.4.3. Implement OCR in a field other than the
Description field

User Role: System Administrator
Optical Character Recognition (OCR) is an out-of-box feature for Smart Ticket, which can extract
texts from images, and then put the text into the interaction records when you submit requests by
using Smart Ticket.

In an out-of-box Service Manager system, the Smart Ticket OCR feature saves and displays the
extracted image content in the Description field. The subsequent Smart Interaction suggestions
are also based on the Description field. However, if you want to use a field other than the
Description field for the Smart Interaction OCR feature, you can follow the instructions in this
section to tailor your system.

To use a field other than the Description field for the Smart Interaction OCR feature, follow these
steps:

   1. Add your new field to the “incidents” table:

        1. From the System Navigator, click Tailoring > Database Dictionary.

        2. Search for and open the “incidents” table.
        3. Add a new field in the table. For example, you can use “description.ocr” as the name of

           the new field.

                         Note

                      To ensure the new field can store the strings extracted from images, we
                      recommend that when you add the new field, select the array data type
                      first, and then select the character data type.

        4. Save the table.

   2. Add new Smart Ticket configuration tasks for your new field:
        1. From the System Navigator, click System Administration > Ongoing Maintenance >
           Smart Analytics > Smart Ticket.

        2. Delete the out-of-box “Standard category field” and “Service category field”
           configuration tasks.

        3. Add a new “Category” configuration, and then add “Description Ocr” to the Content
           Fields list on the Configurations tab.

        4. Add a new “Affected Service” configuration, and then add “Description Ocr” to the
           Content Fields list on the Configurations tab.


3. Add the new “description.ocr” field to the OCR related Java scripts. To do this, follow the
  steps that are appropriate for your environment:
  Service Manager Codeless
     1. From the System Navigator, click Tailoring > Process Designer > Rule Sets.
     2. Search for and clone the “sd.idol.ocr” rule set.

                      Note

                   The out-of-box rule sets and workflows are Proprietary, you need to clone
                   the related rule sets and workflows, and then make changes as necessary
                   so that your tailoring can take effect.

     3. From the cloned the rule set, open the OCR rule, and then add the description.ocr
        parameter as appropriate to the “lib.IDOL_SMIS.addOCRTask” JS call.


if (vars.$G_src && (system.vars.$lo_idol_img_enabled ||
system.vars.$lo_idol_enabled)) {

              if (vars['$G.multi']) {
              company = vars['$lo.operator']['company'];
              lib.IDOL_SMIS.addOCRTask(vars['$L.file'], 'OCR', company,
'description.ocr');
} else {
              lib.IDOL_SMIS.addOCRTask(vars['$L.file'], 'OCR', '',
'description.ocr');
}
} else {
              var attachments = record.getAttachments();
              var attLen = 0;
              for (var i = 0; i < attachments.length; i++) {

                             if (lib.IDOL_Utilities.isImage(attachments[i])){
                                           attLen++;
                                           break;

                             }
              }
              //call OCR interface
              if (vars.$G_ess && (system.vars.$lo_idol_img_enabled ||
system.vars.$lo_idol_enabled) && attLen > 0)
              {
              if (vars['$G.multi']) {

                             company = vars['$lo.operator']['company'];
                             lib.IDOL_SMIS.addOCRTask(record, 'OCR', company,
'description.ocr');
              } else {
                             lib.IDOL_SMIS.addOCRTask(record, 'OCR', '',
'description.ocr');
              }
              } else if ((vars.$G_ess &&
(system.vars.$lo_idol_img_enabled ||
system.vars.$lo_idol_enabled) && attLen === 0)) {
                             if (vars['$G.multi']) {
                             company = vars['$lo.operator']['company'];
                             lib.IDOL_SMIS.addOCRTask(record, 'AutoFill',
company, 'description.ocr');
              } else {
                             lib.IDOL_SMIS.addOCRTask(record, 'AutoFill', '',
'description.ocr');
              }
              }
}


   4. Search for and clone the “sd.idol.ocr.action” rule set. Then, from the cloned rule set, in
     the Process OCR rule, add the “description.ocr” parameter to the
     “lib.IDOL_Utilities.processOCRFG” JS call.

          lib.IDOL_Utilities.processOCRFG(record, 'description.ocr')

   5. Make other changes as necessary so that the updated rule sets can take effect. For
     example, clone the related workflow, and then insert the updated rules sets to the
     cloned workflow.

Service Manager Classic or Hybrid
   1. From the System Navigator, click Tailoring > Document Engine > Processes.
   2. Search for and open the “cc.first.log” process.
   3. Go to the Final Javascript tab.
  4. Add the description.ocr parameter to the “lib.IDOL_SMIS.addOCRTask” JS call.


if (vars['$L.action'] == 'logcatalog'){
return;
}

if (vars.$lo_idol_img_enabled || vars.$lo_idol_enabled) {
//if is src, add to smis task
if (vars.$G_src) {
if (vars['$G.multi']) {
company = vars['$lo.operator']['company'];
lib.IDOL_SMIS.addOCRTask(vars['$L.file'], 'OCR', company,
'description.ocr');
} else {
lib.IDOL_SMIS.addOCRTask(vars['$L.file'], 'OCR', '',
'description.ocr');
}
return;
}
var attachments = vars['$L.file'].getAttachments();
var attLen = 0;
for (var i = 0; i < attachments.length; i++) {
if (lib.IDOL_Utilities.isImage(attachments[i])){
attLen++;
break;
}
}
//call OCR interface
if (vars.$G_ess && attLen > 0) {
if (vars['$G.multi']) {
company = vars['$lo.operator']['company'];
lib.IDOL_SMIS.addOCRTask(vars['$L.file'], 'OCR', company,
'description.ocr');
} else {
lib.IDOL_SMIS.addOCRTask(vars['$L.file'], 'OCR', '',
'description.ocr');
}
} else if (vars.$G_ess && attLen === 0) {
if (vars['$G.multi']) {
company = vars['$lo.operator']['company'];
lib.IDOL_SMIS.addOCRTask(vars['$L.file'], 'AutoFill', company,
'description.ocr');
} else {
lib.IDOL_SMIS.addOCRTask(vars['$L.file'], 'AutoFill', '',
'description.ocr');
}


             }
             }

4. Re-train the two new Smart Ticket configurations that you added in step 2.
5. When the training is finished, try the OCR related feature. The Smart Ticket OCR feature

  now saves and displays the extracted image content in the new Description Ocr field.


1.3.4.4. Add filters to the Hot Topic Analytics
form

User Role: Administrator

In the out-of-box system, the Hot Topic Analytics form contains some pre-defined filter fields. If
you want to add more filter fields, follow these steps:

   1. From the System Navigator, click System Administration > Ongoing Maintenance > Smart
     Analytics > Hot Topic Analytics.

   2. Select and open a Hot Topic Analytics configuration record from the configuration list. For
     example, Incident.

   3. Go to the Filter Fields tab.
   4. In the Properties Fields section, select fields that can be used for advanced filtering in Hot

     Topic Analytics. For example, you can define Category or Priority as filter.
     Note: Start from 9.52p3 and 9.61 release, the following two filters are introduced so that
     HTA can generate a better Hot Topic Analytics map:

           Min doc of topic: Controls the minimal number of records in each topic. This filter
           helps you configure the minimal number of records to generate the topic.
           Topic number: Controls the number of topic blocks in the current Hot Topic Analytics
           map.
   5. Click Save to save your modification.
   6. Click the Start Index button to re-index the module for the new filter fields to take effects.
   7. Go to Forms Designer, and then add the new filter fields into the "Hot Topic Analytics" forms
     that are used for the specific module. You can search for "idol.hta" in Forms Designer to get
     a list of the "Hot Topic Analytics" forms. For example, the format name of the Hot Topic
     Analytics for incidents is "idol.hta.im.pd.advcontent" for Service Manager Codeless or
     Hybrid, and "idol.hta.im.advcontent" for Service Manager Classic.


1.3.4.5. Enable Hot Topic Analytics for other
modules

User Role: Administrator

In the out-of-box system, Hot Topic Analytics is available in the Service Desk, Incident
Management, Problem Management, and Survey modules. If you want to use Hot Topic Analytics
to help you identify hot topics in other modules such as Change Management, you can tailor your
Service Manager system.

The following section provides two examples of how to enable Hot Topic Analytics for a module,
one for Change Management and the other for Knowledge Management.

Enable Hot Topic Analytics for KM feedback

If you want to enable Hot Topic Analytics to help you identify hot topics in KM feedback and
create incident records and KM articles from suggested candidates, follow these steps:

1. Add a new Hot Topic Analytics configuration record for the for kmfeedback, and index.

1. From the System Navigator, click System Administration> Ongoing Maintenance >
  Smart Analytics > Hot Topic Analytics.

2. In the Add Configuration drop-down list, select kmfeedback, and then click Add.

3. Enter information for all the required fields such as the title, contents, time stamp, and
  properties fields, as follows.

Field                                   Analytic Corpus section

                                                   Value

Title Field                             Kmdocumentid

Contents Fields                         Feedbacktext

Index Condition                         True

                                        Note: You can define index conditions
                                        per business requirements.

Field                                                                                                    Service Manager 9.81
Timestamp Field
Properties Field                        Filter Fields section

                                                 Value

                                                 Create Time

                                                 Author
                                                 Kmdocumentid
                                                 Useful
                                                 Tip: To fill in these fields, you can refer
                                                 to the out-of-box Hot Topic Analytics
                                                 configuration, and then use the same or
                                                 similar settings.

     4. Click Add
     5. Click Start Index to start indexing.
2. Add a menu item to the System Navigator to display Hot Topic Analytics for kmfeedback.
     1. From the System Navigator, click Tailoring > Tailoring Tools > Menus.
     2. In the Menu Name field, type the parent menu where you want to add the new Hot

        Topic Analytics for Kmfeedback menu item, and then click Search to open the menu.

                      Tip

                   For example, you can type HOME to add the new Hot Topic Analytics for
                   Kmfeedback menu item to the main menu.

3. Add a new row at the end of the menu table by entering information for the following
  settings:

Setting                                 Value
Description                             Hot Topic Analytics for Kmfeedback
Application                             launch.idol.problem.hunter
Parameter Name                          {"name","query"}
Parameter Value                         {"kmfeedback","true"}
Condition                               true

4. Click Save.


3. Tailor the IDOLModuleConfiguration script file so that it can work for the knowledge
  feedback in the Knowledge Management module:
     1. Click Tailoring > Script Library.
     2. In the Name field, type IDOLModuleConfiguration, and then click Search. The detailed
        script is displayed.
     3. Add the following code in the MODULE_CONFIGS section:

             //km feedback
             "kmfeedback": {
             actions : [{
             id: 'idol-action-list',
             text: scmsg(1033, 'idol'),
             aria: scmsg(1033, 'idol'),
             process: 'idol.hot.topic.view'
             },{
             id: 'idol-action-link-incident',
             text: scmsg(1025, 'idol'),
             aria: scmsg(1025, 'idol'),
             process: function() {
             return PDE.isIncidentEnabled() ?
             'idol.hot.topic.create.pd.incident' :
             'idol.hot.topic.create.incident';
             }
             },{
             id: 'idol-action-link-article',
             text: scmsg(1029, 'idol'),
             aria: scmsg(1029, 'idol'),
             process: function() {
             return 'idol.hot.topic.create.document';
             }
             }],
             displayscreen : "idol.hta.kmfeedback",
             next : function() { return generateTicketID("kmfeedback"); }
             }

                      Note

                   In out-of-box systems, the IDOLModuleConfiguration script file enables
                   Hot Topic Analytics only for incidents, problems, interactions and surveys.

4. Create a message List Kmfeedback for the List Kmfeedback button that you plan to display
  on the Hot Topic Analytics for Kmfeedback page:


     1. Click Tailoring > Database Manager. Or, type db in the command line, and then
        press Enter.

     2. Type scmessage in the Table field, and click the Search icon.
     3. Open the message.edit format. The Search Message Records page opens.
     4. Type idol in the Class field, and then click Search.
     5. Specify the text and message number which was specified for the List Kmfeedback

        button in the script file in step 3.c. Click Add.
5. Create a new display screen idol.hta.kmfeedback by copying the idol.hta.pm display screen:

     1. Type ds in the command line, and then press Enter.
     2. In the Screen ID field, type idol.hta.pm, and then click Search.
     3. Rename Screen ID as idol.hta.kmfeedback , click Add, then you will be asked if you

        would also like to copy display options and display event. Select Yes. The system
        automatically creates display events and display options for the idol.hta.kmfeedback
        display screen.
  Then, modify the display screen accordingly. For the Initialization Expressions tab, modify
  as follows:

      $L.title=scmsg(605, "idol")
      $L.start.search=nullsub($L.start.search, false)
      if ($L.start.search=true) then
      ($hta.analytics.action=nullsub($hta.analytics.action, "action"))
      if ($L.start.search=true) then ($idol.ph.is.advfiler=false;if (not
      (null($search.field.fromdate))) then ($idol.ph.is.advfiler=true);if
      (not (null($search.field.todate))) then ($idol.ph.is.advfiler=true))
      if ($L.start.search=true) then if (not
      (null($search.field.advquery.cond))) then ($idol.ph.is.advfiler=true)
      if ($L.start.search=true) then
      ($L.format="idol.hta.kmfeedback.content";if
      ($idol.ph.is.advfiler=true) then
      ($L.format="idol.hta.kmfeedback.advcontent"))
      if ($L.start.search=true) then (if null($search.field.keyword) then
      ($search.field.keyword="*");$L.void=jscall("IDOL_Help.clickSearch4Pro
      blemHunter"))
      $L.start.search=false

6. Create a message Hot Topic Analytics for Kmfeedback for the idol.hta.kmfeedback display
  screen. The message number should be consistent with that defined in the Initialization
  Expressions tab of the idol.hta.kmfeedback display screen described in step 5, , as shown
  below:

      $L.title=scmsg(605, "idol")


7. Create two formats idol.hta.kmfeedback.content and idol.hta.kmfeedback.advcontent for
  the kmfeedback HTA filters and advanced filters by copying the idol.hta.pm.content and the
  idol.hta.pm.pd.advcontent. formats respectively:

     1. Type fd in the command line, and then press Enter.
     2. In the Form field, type idol.hta.pm.content, and then click Search.
     3. Click More or the More Actions icon, and then select Copy/Rename. Rename the

        format as idol.hta.kmfeedback.content and then click Copy.
     4. Repeat step a to c to create the idol.hta.kmfeedback.advcontent format.

  Modify the controls in the two kmfeedback formats accordingly:

        Rename the caption name as Hot Topic Analytics for Kmfeedback.

        (For idol.hta.kmfeedback.advcontent only) Delete the original filter controls and add
        filter controls for Kmfeedback.

                      Note

                   Filter fields defined here should be consistent with those defined in
                   Properties Fields under the Filter Fields section of the Hot Topic Analytics
                   configuration record, as described in step 1.

        (For idol.hta.kmfeedback.advcontent only) In the properties window of the Edit Query
        control, configure both the Query Table Name and the Current Record Table Name
        properties as kmfeedback.

8. Modify the following configurations for the display options created in step 5:


Unique ID (Alternative text/label)           Value in RAD > Pre Rad Expressions

idol.hta.kmfeedback_advfilter (Adv Filters)

                                             $idol.ph.is.advfiler=true
                                             $L.format="idol.hta.kmfeedback
                                             .advcontent"

idol.hta.kmfeedback_hideadv (hide            $idol.ph.is.advfiler=false
advanced search)                             $L.format="idol.hta.kmfeedback
                                             .content"

idol.hta.kmfeedback_clearfilter (Clear       Modify the expressions as follows:
filters)
                                               $idol.ph.is.advfiler.old=$idol
                                               .ph.is.advfiler
                                               $idol.ph.has.advfiler.value=fa
                                               lse
                                               if (not
                                               (null($search.field.fromdate))
                                               or not
                                               (null($search.field.todate))
                                               or not (null(author in
                                               $L.file)) or not
                                               (null(kmdocumentid in
                                               $L.file))) then
                                               ($idol.ph.has.advfiler.value=t
                                               rue)
                                               $search.field.fromdate=NULL
                                               $search.field.todate=NULL
                                               $search.field.advquery.cond=NU
                                               LL
                                               $search.field.advquery.conddes
                                               c=NULL
                                               $xmlString2=NULL
                                               $L.company=NULL
                                               author in $L.file=NULL
                                               kmdocumentid in $L.file=NULL
                                               useful in $L.file=NULL
                                               $idol.ph.is.advfiler=true
                                               $L.format="idol.hta.kmfeedback
                                               .advcontent"

                                             $L.format="idol.hta.kmfeedback
                                             .advcontent"


Unique ID (Alternative text/label)       Value in RAD > Pre Rad Expressions

idol.hta.kmfeedback_findhottopics (Find    $idol.ph.is.advfiler=false
Hot Topics)                                if (not
                                           (null($search.field.fromdate))
                                           ) then
                                           ($idol.ph.is.advfiler=true)
                                           if (not
                                           (null($search.field.todate)))
                                           then
                                           ($idol.ph.is.advfiler=true)
                                           if (not (null(useful in
                                           $L.file))) then
                                           ($idol.ph.is.advfiler=true)
                                           if (not (null(kmdocumentid in
                                           $L.file))) then
                                           ($idol.ph.is.advfiler=true)
                                           if (not (null(author in
                                           $L.file))) then
                                           ($idol.ph.is.advfiler=true)
                                           if null($search.field.keyword)
                                           then
                                           ($search.field.keyword="*")
                                           $L.void=jscall("IDOL_Help.clic
                                           kSearch4ProblemHunter")

9. Create a new screlconfig record for recording relationship between km feedback and
  incidents.

  You can create the record by copying an existing one in the system, as follows:

     1. Type db in the command line, and then press Enter.
     2. In the Table field, type screlconfig, and then click Search. A list of screlconfig records

        is displayed.
     3. Open a rootcause record whose open.application type is document.new and

        view.application type is se.search.engine, rename the record as kmfeedbackand then
        click Add.

  Modify the record as needed and ensure of the following:.

        File names and table names defined in the record are kmfeedback.

        For example, the table name for the View Names and View Values under the View tab
        should be kmfeedback:


View names                              Value
text
                                          kmfeedback
query                                     $L.query

Unique field name in the queries and script snippets here is consistent with that
specified in the Unique Field Name field.

For example, if you specify Id in the Unique Field Name field, the Query and script in
the expressions should be similar to the following:

Field                                   Value
Query
                                          "id isin
                                          "+str($L.unique.array)

Post Open Expressions

                                        depend in $L.relation=str(id
                                        in $L.related)

Pre View Expressionss

                                        if (filename($L.primary)=
                                        {"kmfeedback"}) then
                                        ($L.number=id in $L.primary)
                                        if (filename($L.related)=
                                        {"kmfeedback"}) then
                                        ($L.number=id in $L.related)
                                        $L.query=nullsub("id=\""+$L.
                                        number+"\"", "true"

Active Condition

                                                                True

          The filters defined for the Descriptions field are consistent with those defined in
          Properties Fields under the Filter Fields section of the Hot Topic Analytics
          configuration record, as described in step 1.

10. Modify the vj.number.1 source field of the probsummary link file to display related
    kmfeedback in incident records:

       1. Type link in the command line, and then press Enter. The Link File search page is
          displayed.


       2. In the Name field, type probsummary, and then click Search. A list of source field
          records is displayed.

       3. Move the cursor to the vj.number.1 record, right-click the mouse and then click Select
          Line. The record opens.

       4. In the Query field, add the following code at the end:

          or depend.filename="kmfeedback"

11. Add a kmmapping record of kmfeedback for opening km article from knowledge feedback:

       1. Type db in the command line, and then press Enter. The Link File search page is
          displayed.

       2. In the Table field, type kmmapping, and then click Search. The Knowledge
          Management Mapping Record search page is displayed.

       3. In the Map Name field, type kmfeedback and then click New.The record is created.

       4. Configure the Search and the Create Solutions tabs accordingly, as follows:

          For the Search tab:

Source Field in Current Record                        Target Search Field
feedbacktext
                                                        query

id

                                                                contexttag

For the Create Solutions tab:

Document Type                           Source Field in Current  Target Search Field
all                                     Record
                                                                   tite
                                        feedbacktext

reference                               feedbacktext

                                                                            reference

 12. Log off and log back on to Service Manager. Now you can access and use Hot Topic
     Analytics for kmfeedback from the System Navigator.

Enable Hot Topic Analytics for Change Management

If you want to enable Hot Topic Analytics to help you identify hot topics in Change Management,
follow these steps:


1. Add a new Hot Topic Analytics configuration record for the Change Management module:
     1. From the System Navigator, click System Administration> Ongoing Maintenance >
        Smart Analytics > Hot Topic Analytics.
     2. In the Add Configuration drop-down list, select cm3r, and then click Add.
     3. Enter information for all the required fields such as the title, contents, time stamp, and
        properties fields, and then click Add.

                      Tip

                   To fill in these fields, you can refer to the out-of-box Hot Topic Analytics
                   configuration, and then use the same or similar settings.

     4. Click Start Index to start indexing.
2. Add a menu item to the System Navigator to display Hot Topic Analytics for Changes:

     1. From the System Navigator, click Tailoring > Tailoring Tools > Menus.
     2. In the Menu Name field, type the parent menu where you want to add the new Hot

        Topic Analytics for Changes menu item, and then click Search to open the menu.

                      Tip

                   For example, you can type HOME to add the new Hot Topic Analytics for
                   Changes menu item to the main menu.

3. Add a new row at the end of the menu table by entering information for the following
  settings:

Setting                                 Value
Description                             Hot Topic Analytics for Changes
Application                             launch.idol.problem.hunter
Parameter Name                          {"name","query"}
Parameter Value                         {"cm3r","true"}
Condition                               true

     4. Click Save.

3. Tailor the IDOLModuleConfiguration script file so that it can work for the change records in
  the Change Management module:

     1. Click Tailoring > Script Library.


     2. In the Name field, type IDOLModuleConfiguration, and then click Search. The detailed
        script is displayed.

     3. Modify the script accordingly.

                      Note

                   In out-of-box systems, the IDOLModuleConfiguration script file enables
                   Hot Topic Analytics only for incidents, problems, interactions and surveys.

                      Tip

                   You can search for rootcause in the script file to see where you need to
                   make changes for the script to support other modules.

4. Create a message for the button that you plan to create on the display screen of Hot Topic
  Analytics for Changes.
     1. Click Tailoring > Database Manager. Or, type db in the command line, and then
        press Enter.
     2. Type scmessage in the Table field, and click the Search icon.
     3. Open the message.edit format. The Search Message Records page opens.
     4. Type idol in the Class field, and then click Search.
     5. Specify the message number and text as needed. Click Add.

5. Create a new display screen for Change module in the following way:
     1. Type ds in the command line, and then press Enter.
     2. Specify the fields on the definition form as needed.
     3. Click Add.

               Tip

             You refer to the idol.hta.pm display screen for configuration.

6. Create display options for the display screen which is added in step 5.
     1. Type do in the command line, and then press Enter.
     2. Specify the fields on the definition form as needed.
     3. Click Add.

               Tip

             You can refer to the Options tab in the idol.hta.pm display screen for the
             definitions of options.

7. Create display events for the display screen which is added in step 5.


       1. Type de in the command line, and then press Enter.
       2. Specify the fields on the definition form as needed.
       3. Click Add.

                 Tip

               You can refer to the Events tab in the dol.hta.pm display screen for the
               definitions of events.

 8. Create formats for the Change module filters and advanced filters respectively. For detailed
    information, see Create a form using the Form Wizard.

                 Tip

               You can refer to the idol.hta.pm.content and idol.hta.pm.advcontent formats
               as examples for your tailoring.

 9. Create processes which you used for Change Module in the IDOLModuleConfiguration
    script file as described in step 3. For detailed information, see Create and modify a Process.

                 Note

               Ignore this step if you used OOB processes when modifying the
                IDOLModuleConfiguration script file.

10. Log off and log back on to Service Manager. Now you can access and use Hot Topic
    Analytics for Changes from the System Navigator.


1.3.4.6. Customize actions in hot topic map

User Role: Administrator
If you want to customize the actions available in the hot topic map, you can tailor the out-of-box
Hot Topic Analytics. For example, for the out-of-box Hot Topic Analytics for Incidents, the Create
Problem action (button) is available. You can change this action or add a new action according to
your business needs.
To customize the actions in hot topic map, follow these steps:

   1. Click Tailoring > Script Library.
   2. In the Name field, type IDOLModuleConfiguration, and then click Search. The detailed script

     is displayed.
   3. Locate the "MODULE_CONFIGS" Javascript Object. Inside MODULE_CONFIGS, you can see

     the configuration entries for different modules. The entry "key" must correspond to the
     table name of an SM module. For example: "probsummary."
     The "actions" configuration section is a Javascript array. The items defined in this array will
     be rendered as "the action button" in the Hot Topic Analytics chart. For example, you can
     see the following lines in the script:

               actions : [{
          id: 'idol-action-list',
          text: scmsg(1023, 'idol'),
          aria: scmsg(1023, 'idol'),
          process: 'idol.hot.topic.view'
          }, {
          id: 'idol-action-link-incident',
          text: scmsg(1025, 'idol'),
          aria: scmsg(1025, 'idol'),
          process: function() {
          return PDE.isIncidentEnabled() ?
          'idol.hot.topic.create.pd.incident' :
          'idol.hot.topic.create.incident';
          }
          }]

   4. Modify the "actions" configuration section to add the definition for the new action. The
     parameters that you need to specify are described in the following table.


Parameter                               Description
id
                                        A unique value to identify which "action
text                                    button" is clicked. The "id" value also has
aria                                    the CSS style attached. Currently, two
process                                 styles are available:

                                             "idol-action-list" has an "Open" icon.
                                             "idol-action-link" has a "Link" icon.

                                        The "action button" label that's displayed
                                        on the chart

                                        Texts used for accessibility

                                        Represents the SM process name. The
                                        process is invoked when the "action
                                        button" is clicked. The configuration value
                                        can be either a text string or a function
                                        that returns a text string. When the
                                        process is invoked, two additional
                                        variables are available:

                                             "$L.idol.selected.filename": the
                                             current module table name
                                             "$L.idol.selected.query": the SM
                                             query to retrieve the selected
                                             records in the Hot Topic Analytics
                                             chart

For example, you can modify the following lines accordingly and add them to the script:

      {
      id: 'idol-action-link-others',
      text : 'Link to some other module',
      aria : 'Link to some other module',
      process : 'idol.link.to.other.module'
      }

5. Click Save to save your change in the script file.
6. Create the process that you use for the new action button. For example, you need to create

  the "idol.link.to.other.module" process that you specified in step 4. In the process, you can
  define the behaviors when the action button is clicked.


Add more "Analytics Action" in the Hot Topic Analytics for
Incidents

In the out-of-box system, the Analytics Action setting in the Hot Topic Analytics for incidents
includes the following three out-of-box actions: Set Parent, Create Problem, and Create
Change/Article.
If you want to add more custom action queries in the Hot Topic Analytics for Incidents, follow
these steps:

   1. Tailor the form of the Hot Topic Analtyics for Incidents to add one more option to the drop-
     down list of "Analytics Action".

   2. Add the new action to the "IDOL HTA Action Type" globallist that's used in the Hot Topic
     Analytics configuration record for the Incident module.

   3. In the Advanced tab of the Hot Topic Analytics configuration record for Incidents, select the
     new action that you added, and then define the query for this newly added action.

                   Tip

                The query also supports jscall function.

   4. From the script library, open "IDOLModuleConfiguration" and then configure which actions
     can be shown in the action form. For example:

            if (vars['$hta.analytics.action']==="createproblem") {
          return [list, createProblem];
          }

Contents

     1 Add more "Analytics Action" in the Hot Topic Analytics for Incidents


1.3.4.7. Configure Smart Analytics to support
more languages

User Role: Administrator
With the out-of-box configuration, Smart Analytics supports the same language list that Service
Manager supports. If the texts entered in the records (such as in title and description) aren't in a
language that's included in the supported language list of Service Manager, these texts can't be
indexed and analyzed by Smart Analytics.
However, Smart Analytics can be configured to index and analyze texts in other languages in
addition to the out-of-box supported languages. To do this, follow these steps:

   1. In the IDOL configuration file (<Smart Analytics>/IDOL/IDOLServer.cfg), add the desired
     language type into the [LanguageTypes] section. For example, if you want to support
     Vietnamese, you can add the following line into the [LanguageTypes] section:

          19=Vietnamese

   2. Add encoding format and stoplist into the [LanguageTypes] section. For example, you can
     add the flowing configurations for Vietnamese:

          [vietnamese]
          Encodings=UTF8:vietnameseUTF8
          Stoplist=vietnamese.dat

                   Note

                The stoplist file is a text file placed in the <Smart Analytics>/langfiles folder,
                which contains words that you don't want to be treated as keywords in the
                query requests to IDOL.

   3. Save the file.

            Note

           The IDOLServer.cfg configuration file doesn't affect the language support for the
           Optical Character Recognition (OCR) feature. OCR recognizes images based on the
           language setting specified in the contact record of a user in Service Manager. If no
           language is set in the user’s contact record, English is used as the default value in
           image recognition by Smart Analytics.



1.3.5. Limitations

Smart Analytics contains the following limitations in the current release:

     Smart Ticket

     If your Service Manager is upgraded from Service Manager non-PD environment, IT agents
     are unable to use the Optical Character Recognition (OCR) feature when creating
     interactions for users in the out-of-box environment. However, when Process Designer is
     enabled, IT agents can use the “Image2Text” feature to copy and paste messages to the
     interaction records.

     Smart Search

     In this release, Service Manager indexes Service Catalog capability words into IDOL content
     server. When an end user searches for catalog items, IDOL returns only catalog items with
     capability words that match the current login user. However, when there are catalog items
     with expressions specified in Access Filter that IDOL is not able to evaluate, such catalog
     items are also returned to Service Manager for further permission checking in the
     applications server. If the end user has no permission to such catalog items, Service
     Manager doesn't return them to the end user. Therefore, sometimes the search result
     returns empty, or has less than 10 records, but still has next page.
````
