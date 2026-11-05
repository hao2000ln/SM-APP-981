---
source: Document/pdf/v981/Upgrade.pdf
version: 9.81
sections: 1.3.8.2 .. 1.3.8.2
printed_pages: 196-234
---

# 1.3.8.2 Optional manual migration tasks

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.8.2. Optional manual migration tasks

Configure the Change Management module to use
the new Task Planner

            Note

           The following step applies only to customers who upgrade to Service
           Manager Hybrid from a 9.3x system that has PDCP3 or PDCP4 installed.
           If you are upgrading to Service Manager 9.80 Hybrid from a Classic
           version of Service Manager, you must add the Task Planner form to your
           Change format, and then run the "Legacy change/task data to new
           taskplanner" data migration script, if you want to use the new Task
           Planner.

An improved version of the Task Planner was introduced in Service Manager 9.40. To
use it, make sure that the following code elements are successfully implemented (this
disables the previous version of the Task Planner). To do this, you can use conflict
resolution or manually change the code elements according to following table.


Record type  Record name                Modifications         Comments
Object       changeModel
                                        Uses the "Change
                                        Model" workflow,
                                        the workflow
                                        location is "In
                                        Object," and the
                                        file-level rule sets
                                        are configured to
                                        use the new Task
                                        Planner.


Record type  Record name                Modifications         Comments
Object       cm3t
                                        The following
                                        object-level rule
                                        sets are
                                        configured to use
                                        the new Task
                                        Planner:

                                             After
                                             successful
                                             add:

                                              .common.ta
                                             skplan.none
                                             plantasktoch
                                             angeplan

                                             On enter:

                                              .common.ta
                                             skplan.valid
                                             ateoutputont
                                             ask

                                             After
                                             successful
                                             enter:

                                              .common.ta
                                             skplan.sync.
                                             task.titleand
                                             status.
                                             tochangepla
                                             n

                                              .common.ta
                                             skplan.updat
                                             edependentt
                                             askstatus

                                             Initialization:


Record type  Record name                Modifications        Comments
Process
                                              .common.ta
                                             skplan.taskti
                                             cket.init

                                             On display:

                                              .common.w
                                             orkflow.init.v
                                             ars

                                             On update:

                                              .common.ta
                                             skplan.save
                                             contextconfi
                                             g

                                             After
                                             successful
                                             update:

                                              .common.ta
                                             skplan.sync.
                                             task.titleand
                                             status.tocha
                                             ngeplan

             changeModel.buil           The following        This record was
             dtable                     initial JavaScript   used by optionid
                                        is commented:        441 to save
                                                             taskxml files to
                                        lib.changeModel.     the changeModel
                                        saveFromXML(tru      table for the
                                        e);                  Classic Task
                                                             Editor.


Record type  Record name                Modifications       Comments
Process      changeModel.init
                                        The following       This record was
Process                                 initial JavaScript  used to initialize a
                                        is commented:       taskxml file to be
                                                            displayed by the
                                        lib.changeModel.    Classic Task
                                        createXML(vars.$    Editor.
                                        L_file);

             changeModel.sav            The following       This record was
             e                          initial JavaScript  used to save
                                        is commented:       taskxml files to
                                                            the changeModel
                                        lib.changeModel.    table.
                                        saveFromXML();


Record type  Record name                Modifications  Comments
Process
             change.open.sav            RAD
             e                          expressions
                                        are
                                        evaluated
                                        before the
                                        change.ope
                                        nPlanTasks
                                        RAD call.

                                        The
                                        following
                                        expression
                                        is removed:

                                        if
                                        ($L.exit="ad
                                        ded" and
                                        filename($L.
                                        file)="cm3r"
                                        ) then
                                        ($L.changeP
                                        lan=jscall("c
                                        hangePlan.c
                                        reatePlan",
                                        $L.file,
                                        changeMod
                                        el in
                                        $L.file);$L.v
                                        oid=rtecall("
                                        copycurrent
                                        ",
                                        $L.errcode,
                                        $L.phase.sa
                                        ve,
                                        $L.phase))

                                        Disabled
                                        calling the
                                        change.ope


Record type  Record name                Modifications    Comments

                                             nPlanTasks
                                             RAD.


Record type  Record name                Modifications  Comments
Process
             change.update.sa           RAD
             ve                         expressions
                                        are
                                        evaluated
                                        before the
                                        apm.mb.ok
                                        RAD call.

                                        The
                                        following
                                        expressions
                                        are
                                        removed:

                                              if
                                             (filena
                                             me($L.
                                             file)="c
                                             m3r")
                                             then
                                             ($L.cha
                                             ngePla
                                             n=jscal
                                             l("chan
                                             gePlan.
                                             getPlan
                                             ",
                                             $L.file)
                                             )

                                              $L.tas
                                             k.list =
                                             "";if
                                             (filena
                                             me($L.
                                             file) =
                                             "cm3r"
                                             and
                                             not


Record type  Record name                Modifications        Comments

                                                   (same(
                                                   current
                                                   .phase
                                                   in
                                                   $L.file,
                                                   $L.orig
                                                   .phase)
                                                   )) then
                                                   ($L.tas
                                                   k.list =
                                                   jscall("
                                                   change
                                                   Plan.ge
                                                   tNeedT
                                                   oClose
                                                   TaskLis
                                                   t",
                                                   $L.orig
                                                   .phase,
                                                   $L.cha
                                                   ngePla
                                                   n,
                                                   nullsub
                                                   (allow.
                                                   open.ta
                                                   sks in
                                                   $L.pha
                                                   se,
                                                   false),
                                                   workflo
                                                   wName
                                                   in
                                                   $L.wfP
                                                   hase,
                                                   current
                                                   .phase
                                                   in


Record type  Record name                Modifications        Comments

                                                   $L.file)
                                                   )

                                                    if
                                                   ($L.tas
                                                   k.list~=
                                                   "")
                                                   then
                                                   ($L.co
                                                   ntinue
                                                   =
                                                   false;$
                                                   L.exit=
                                                   "bad.v
                                                   al";
                                                   $L.ope
                                                   ntask.
                                                   msg =
                                                   scmsg(
                                                   550,
                                                   "cm3",
                                                   {$L.tas
                                                   k.list})
                                                   )

                                                    if
                                                   ($L.co
                                                   ntinue=
                                                   false
                                                   and
                                                   not
                                                   (null($
                                                   L.opent
                                                   ask.ms
                                                   g)) and
                                                   $G.bg)
                                                   then
                                                   ($L.voi
                                                   d=rtec


Record type  Record name                Modifications        Comments

                                                   all("ms
                                                   g",
                                                   $L.rc,
                                                   $L.ope
                                                   ntask.
                                                   msg))
                                             Disabled
                                             calling the
                                             apm.mb.ok
                                             RAD

                                             RAD
                                             expressions
                                             are
                                             evaluated
                                             before the
                                             change.ope
                                             nPlanTasks
                                             RAD call.

                                             The
                                             following
                                             expression
                                             is removed:

                                              if
                                             (filename($L
                                             .file)="cm3r
                                             ") then
                                             ($L.success.
                                             flg=rtecall("r
                                             efresh",
                                             $L.errcode,
                                             $L.changePl
                                             an))

                                             Disabled
                                             calling the
                                             change.ope


Record type  Record name                Modifications    Comments

                                             nPlanTasks
                                             RAD


Record type  Record name                Modifications  Comments
Process
             changePlan.buildt          RAD            This record is
             able                       expressions    used by optionid
                                        are            441 to save
                                        evaluated      taskxml files into
                                        before the     the changeModel
                                        change.ope     table for the
                                        nPlanTasks     legacy Task
                                        RAD call:      Editor.

                                        The
                                        following
                                        expression
                                        is removed:

                                              if
                                             (filena
                                             me($L.
                                             file)="c
                                             m3r")
                                             then
                                             ($L.cha
                                             ngePla
                                             n=
                                             jscall("
                                             change
                                             Plan.ge
                                             tPlan",
                                             $L.file)
                                             )

                                        Post RAD
                                        expressions:
                                        the following
                                        expressions
                                        are
                                        removed:

                                              $L.voi
                                             d=jscal


Record type    Record name              Modifications        Comments

                                                   l("chan
                                                   gePlan.
                                                   create
                                                   XML",
                                                   $L.file
                                                   )

                                                    $L.exit
                                                   ="refre
                                                   sh"

                                             Disabled
                                             calling the
                                             change.ope
                                             nPlanTasks
                                             RAD

                                             The
                                             following
                                             initial
                                             JavaScript is
                                             commented:

                                              lib.changeP
                                             lan.saveFro
                                             mXML(true)
                                             ;

ScriptLibrary  ApplyChangeMod           The following
               el                       script is
                                        commented:

                                        addTasksToChan
                                        gePlan(change,
                                        changeModel);

Additionally, you must check that the following code elements are correctly
implemented before you use the new Task Planner. To do this, you can use conflict
resolution or manually change the code elements according to following table.


Record type  Record name                Modifications      Comments
format
             chm.cm3r.tasks.h           The old Task       These are the
             orz                        Editor widget is   out-of-box
                                        replaced with the  formats.
                                        new Task Planner   Customize your
                                        widget.            own formats
                                                           accordingly if
                                                           you're not using
                                                           out-of-box
                                                           formats.


Record type  Record name                Modifications       Comments
format
             chm.task                   A new Task tab is   These are the
                                        added to            out-of-box
             chm.standard.regi          dynamically displ   formats.
             stration                   ay context-         Customize your
                                        related record      own formats
             chm.standard.pln.          information that's  accordingly if
             sch                        planned during      you're not using
                                        the task plan.      out-of-box
             chm.standard.exe                               formats.
             cution

             chm.standard.pir

             chm.standard.bac
             kout

             chm.normal.regist
             ration

             chm.normal.rsk.i
             mp

             chm.normal.tcab.
             approval

             chm.normal.build.
             test

             chm.normal.dcab.
             approval

             chm.normal.deplo
             yment

             chm.normal.back
             out

             chm.normal.pir

             chm.emergency.r
             egistration

             chm.emergency.r
             sk.imp


Record type  Record name                Modifications       Comments
Triggers
             chm.emergency.a
             pproval

             chm.emergency.b
             uild.test

             chm.emergency.i
             mplmt

             chm.emergency.b
             ackout

             chm.emergency.p
             ir

             trigger.name="tri          A new trigger is
             gger.changeMod             added to remove
             el.remove.taskpla          task plan-related
             n"                         information once
                                        a changeModel
             and                        record is deleted.
             table.name="cha
             ngeModel"

Update your customized formats

If you don't plan to use the out-of-box ChangeModel or Task formats, you must
configure the Task Planner widget in your tailored ChangeModel and Task formats as
described in the following table.


Task Planner property                   Value in ChangeModel  Value in Task format
                                        format
Editor type                             Model                 Ticket
Category                                Category              Header/category
ID                                      id                    Header/number
Editable                                Yes                   Yes
Parent file                             cm3r                  cm3r

Additionally, you must manually add the "Additional Properties" tab to the Change and
Task details forms, in order to display the Additional Properties information for
Changes and Tasks. To do this, manually add references to the following subformats
in the relevant formats:

     Change format

      common.taskplan.parent.InputOutput.subform

     Task format

      common.taskplan.task.InputOutput.subform

Data migration

For more information about how to migrate your data, refer to Appendix B: Data
migration.

Upgrade to the Process Designer related record
subform

The functionality of related records in Process Designer-based systems and in
Classic systems is different. However, Classic related record functionality still works
in Process Designer-based environments, and it is therefore not mandatory for you to
replace this functionality.

Caution

If you decide not to use the Process Designer-based related record
functionality, rule types such as "Run Action" will not work.


To use the Process Designer-based related record functionality, simply update the
"Related Records tab" in the corresponding forms to implement the Process
Designer-based related record subform (for example, im.incident.subform.related
for the Incident module). Then, migrate the related record data.

Use the Process Designer workflow viewer in your
Change Management forms

When you view a record in a Process Designer-based module, the form uses the new
Workflow Viewer widget to display the workflow history of the record. The
Applications Upgrade Utility updates your forms during the upgrade process to
enable this feature.

However, if you previously customized Service Manager so that the
cm3r.sub.workflow.g subform was not used to hold the Classic workflow widget in the
Change Management module, you must manually implement the new Workflow
Viewer widget in your Change Management forms.

To do this, follow these steps:

   1. In Forms Designer, open the "chm.cm3r.sub.workflow.g" out-of-box Process
     Designer workflow subform. Then, use design mode to copy the content of this
     subform.

   2. In Forms Designer, open the form to which you want to add the new Workflow
     Viewer widget. Then, overwrite the content for the existing Classic workflow
     widget subform with the content that you copied from the
     "chm.cm3r.sub.workflow.g" subform.

Configure the Search form

Search forms in Process Designer-based systems and in Classic systems are
different. For example, the Process Designer-based Incident module uses the
"im.advFind.incident.search" search form, instead of the "advFind.incident.search"
search form. If you had previously customized some fields in a search form, you must
manually add these fields to the Process Designer-based version of the search form.

We recommend that you use the Process Designer search form. However, if you want
to continue to use the Classic search form, you must update the SearchConfig record
to revert the changes applied by the Applications Upgrade Utility. To do this, set the
value of the Search Format field to the appropriate Classic search form for that table.

The following table lists the mapping between Process Designer-based search forms
and their Classic equivalents.


Table name                              Classic search form  Process Designer
                                                             search form

probsummary                             advFind.incident.search im.advFind.incident.sear
                                                                       ch

cm3r                                    advFind.search.change advFind.search.chm

cm3t                                    advFind.search.task  advFind.search.task

incidents                               advFind.SD.search    sd.advFind.search

rootcause                               advFind.search.problem pbm.advFind.search.pro
                                                                       blem

rootcausetask                           advFind.search.problem. pbm.advFind.search.pro

                                        task                 blem.task

Migrate the solution matching configuration from
security profiles to security settings

The Incident solution matching functionality in Process Designer-based systems and
in Classic systems is different.

We recommend that you use Process Designer solution matching. However, if you
want to use Classic solution matching, you must manually migrate the security
configuration from Classic security profiles to Process Designer security roles. This is
necessary because Classic solution matching is configured in security profiles (for
example, pmenv), which aren't used in Process Designer security roles.

The following example uses the "Check similar problems" Incident solution matching
setting to demonstrate how to perform the migration.

   1. The field name of the "Check similar problems" setting is "check.rc." To add a
     setting with the same name in the "Incident" security area, search for the
     "Incident" security area. From the More menu, click Administration > Add New
     Setting, and then add a new setting.

   2. Set the security rights value for this new Setting.
   3. Check all your Incident Management security profile records (in an out-of-box

     system, there are 49) to identify all the records in which "Check similar
     problems" is selected. For example, if "Check similar problems" is selected in


  the sysadmin profile, you need to set the area of the sysadmin security role to
  "Incident," and select the "Check similar problems" setting.
4. After you manually migrate the "Check similar problems" setting, perform the
  same tasks for the following settings:

        Check similar incidents
        Check incident duplicates on configuration item
        Check incident duplicates on related configuration item

              Max levels
              Max hits

Update reports to use Process Designer-based
category tables

If you plan to use Process Designer-based Incident, Service Desk, and Problem
category tables in your reports, you must update your reports to use the new tables.

The following table describes the mapping between category tables in Process
Designer-based and Classic systems.

Classic table                           Incident module

                                                Process Designer-based table

Category                                imCategory

subcategory                             imSubcategory

producttype                             imArea

Classic table                           Service Desk module
Category
subcategory                                       Process Designer-based table
producttype                                       sdCategory
                                                  sdSubcategory
                                                  sdArea


Classic table                           Problem module
Category
Subcategory                                     Process Designer-based table
producttype                                     pbmCategory
                                                pbmSubcategory
                                                pbmArea

Make the Category field in the Interaction and
Incident forms read-only

In Classic systems, the category field in the Interaction and Incident forms aren't
read-only; users can change the category of an interaction. However, in Process
Designer-based systems, this field is used to determine the specific workflow that the
interaction or incident follows. If the category changes, the interaction may need to
use a new workflow and forms, but this will not happen if the field is modified directly
in the form. Therefore, we recommend that you make the Category field read-only.

To correctly change the category of an interaction or incident, use the new Change
Category menu option that's automatically created by the Applications Upgrade
Utility. This ensures that the correct workflow is used.

Revert to using the "escalate to Change" wizard

The escalation to change process in Process Designer-based systems and in Classic
systems is different. After you upgrade to Service Manager 9.80 Hybrid, the
escalation wizard no longer appears when you click Escalate in an Interaction, and
the Change is not created in the background. Instead, the Change form is launched
for you to input the details.

To revert to using the Classic escalation wizard, follow these steps:

   1. Open the "escalate.interaction" process, and modify the condition so that it
     evaluates to "true" for escalation to change. This ensures that the escalation
     wizard is displayed.

     For example, modify the condition from
      $L.use.legacy.sd.solution.matching=true and ($L.string="create" and
     $exit.code.fc="normal") to ($L.use.legacy.sd.solution.matching=true or
     category in $L.file="request for change") and ($L.string="create" and
     $exit.code.fc="normal") .


   2. Open the "cc.createchange" process, and modify the expression that's
     evaluated before the RAD call from $escalation.wizard.call=false to
      $escalation.wizard.call=true . This ensures that the change is created in the
     background.

   3. If it doesn't already exist, add the following expression to the "number" link line
     of the "screlate.incidents.cm3r" link:

      requestedDate in $L.related=nullsub($requested.end.date, tod())

                   Note

                You can further tailor "escalate to Change" wizard by adding
                additional expressions or field mapping to copy data to change
                records.

Remove the button in the Incident form that cancels
the Interaction escalation process

The Interaction escalation process in Process Designer-based systems and in Classic
systems is different. In Process Designer-based systems, the interaction is added to
database before the Process Designer solution matching form is displayed, and the
Incident form is displayed when you select to create a new Incident (there is no longer
an Escalate button on the Interaction form). When you save the Incident, the Incident
is created and associated with the Interaction. If you don't want to escalate the
Interaction to an Incident, you can click Cancel in the Incident form. In Classic
systems, the Incident is created in the background without displaying the Incident
form to the end user.

To revert to the old behavior, you must add the Escalate button back to the Interaction
form and remove the Cancel button from the Incident form. To do this, follow these
steps:

   1. To add the Escalate button back to the Interaction form, update the user
     condition in the "cc.edit.incident_escalate" display option to the following:

      evaluate($L.tableAccess.view) and (nullsub($G.ess, false)=false and ess.entry
     in $L.filed and nullsub($isnewweb, false)=true or
     jscall("sdUtil.isInteractionEscalatedOrFulfilled", $L.file)=false) and
     nullsub(category in $L.filed, "unknown")~="service catalog" and open in
     $L.file~="Closed"


2. Remove the Cancel button from the Incident form. To do this, set a flag variable
  in the "escalate.interaction" process. For example, set the following flag:
   $isSDEscalatingIncident=true

Then, check the following flag in the condition of the Cancel button
("apm.first_back" display option):

nullsub($isSDEscalatingIncident, false)=false

Migrate any customization of the knownerror table

The Process Designer-based Problem module stores Known Error records and
Problem records in the same table (rootcause), whereas the Classic Problem module
stores Known Error records in the knownerror table. Therefore, if you have made any
customizations to the Classic knownerror table that you want to retain, you must
manually reapply these customizations to the rootcause table.

Remove the Classic Request Management
dashboard and report definitions


After you upgrade to Service Manager Hybrid, the Classic Request Management
dashboard and report definitions remain in the system. If you don't want to run the
Classic Request Management and Process Designer-based Request Fulfillment
modules in parallel, you can remove the Classic Request Management dashboard and
report definitions.

To remove the Classic Request Management dashboard definition record, follow
these steps:

   1. In the System Navigator, click Reporting > Search Dashboard, and then search
     for ID "10000468."

   2. Click Delete, and then click Yes to remove the Dashboard record.

To remove the Classic Request Management report definition records, follow these
steps:

   1. In the System Navigator, click Reporting > Search Report, and then search for
     ID "10000460."

   2. Click Delete, and then click Yes to remove the Report record.
   3. Repeat steps 1 and 2 for the following IDs:

           10000461
           10000462
           10000463
           10000466
           10000467

Enable Classic Request Management and Process
Designer-based Request Fulfillment to run in
parallel

Migration from Classic Request Management to Process Designer-based Request
Fullfillment is a manual process that can be time-consuming if you have heavily
tailored the Request Management module. In order to ease this transition Service
Manager Hybrid enables you to run the Classic Request Management and the Process
Designer-based Request Fulfillment modules in parallel. To do this, follow these steps.

Step 1: Set the value of the global flag to "true"

In the ProcessDesignerEnablement Script Library, locate the
isNonPDRequestInParallel function, un-comment the line
$G.nonpd.request.in.parallel variable , and then set its value to "True."


Step 2: Restore the non-Process Designer Request menu
items

Request module menu items

To restore these menu items, search for menu records that have the parameter value
"RM PD." In out-of-box systems, there are three such records. Add the Classic
"Request Management" menu item back to the menu.

Request environment menu items

These menu items are located at System Administration > Ongoing Maintenance >
Environment Records. To restore these menu items, search for the "ENV RECORDS"
menu, and then add the Classic request menu items.

Request profile menu items

These menu items are located at System Administration > Ongoing Maintenance >
Profiles. To restore these menu items, search for the "MODULE PROFILES" menu, and
then add the Classic request menu items.

Models menu item

This menu item is located at System Administration > Base System Configuration.
To restore this menu item, search for the "SYSTEM ADMINISTRATION" menu, and
then add the Classic Request menu items.

Step 3: Update the queries in Inbox views

   1. Search all Approval inboxes andcheck the query condition in each record to
     determine whether it uses only Classic global variables ( $G.ocmq.environment ,
      $G.ocmo.environment , and $G.ocml.environment ) or Process Designer-
     based global variables ( $G.request.environment and
      $G.requestTask.environment ). If so, modify the queries to use both sets of
     global variables.

     For example, this query in the "All my Approvals" inbox contains a condition that
     resembles the following:

      (file.name="request" and (current.pending.groups isin approval.groups in
     $G.request.environment or current.pending.groups isin {$lo.user.name})

     In this situation, you need to change the query to the following:

      (file.name="request" and (current.pending.groups isin approval.groups in
     $G.request.environment or current.pending.groups isin {$lo.user.name}) or


     (file.name="ocmq" and (current.pending.groups isin approval.groups in
     $G.ocmq.environment or current.pending.groups isin {$lo.user.name})

   2. In the "My Group's To Do List" Inbox view, restore itemType="ocmq" or
     itemType="ocml" to the query, and make sure that the "request" and
     "requestTask" item types are included in the query.

   3. In the "My Pending Delegated Approvals" Inbox view, append the following
     string to the query:

      or (file.name="ocmq" and current.pending.groups isin
     $G.delegated.ocmq.groups

     In the "My Pending Approvals" Inbox view, append the following string to the
     query:

      or (file.name="ocmq" and (current.pending.groups isin approval.groups in
     $G.ocmq.environment or current.pending.groups isin {$lo.user.name})

Step 4: Restore the "OCM Create Order" schedule record

To restore the "OCM Create Order" schedule record, you must unload the record from
your system before you upgrade to Service Manager Hybrid, and then load it to your
system after the upgrade process is complete.

You also can unload this record from a previous version of Service Manager.

Step 5: Configure search

Search for SearchConfig records that have a table name that begins with "ocm," and
then remove the "false" condition in the Allow Advanced Find query.

Step 6: Add display options

These display options are located at More > Scheduled Maintenance > Generate
Recurring > Request in CI record display forms.

The sub-menu in the following illustration refers to Request table records.


Create a copy of the display option for this sub-menu, and then modify it to refer to
the OCMQ table records, as demonstrated in the following image.

When you have done this, two sub-menus are displayed in the CI form. One sub-
menu refers to the Request table records, and the other sub-form refers to the OCMQ
table records.

Step 7: Rename the connector

Rename the Process Designer catalog connector. For example, name the connector
"Open New PD Request."

If you customized the "Open New Request" catalog connector, the out-of-box
Process Designer catalog connector is named "NEW980Open New PD Request" after
the migration process.

If you did not customize the "Open New Request" catalog connector, the out-of-box
Process Designer catalog connector is named "Open New Request" after the
migration process. In this case, you need to rename the catalog connector to
"NEW980Open New PD Request," and then restore the non-Process Designer catalog
connector.


Step 8: Modify the connector wizard

   1. In the "svcCat Select Connector" wizard, click File Selection > JavaScript, and
     then change the connector name for the bundle catalog in the connector list
     from "Open New Request" to "Open New PD Request" (or to the name that you
     used in step 6).

   2. Click the Next Wizard tab, and then change the connector name for Process
     Designer Request from "Open New Request" to "Open New PD Request" (or to
     the name that you used in step 6).

   3. Restore the Next wizard for Request Management.

Step 9: Restore the Classic Request profile setting to the
Operator form

Update the JavaScript of the "operator.view" and "operator.search" display screens
as follows.

Before update

if(lib.ProcessDesignerEnablement.isRequestEnabled())

{

vars['$L.showRMProfile']=false;

}

After update

if(lib.ProcessDesignerEnablement.isRequestEnabled() &&
vars['$G.nonpd.request.in.parallel']!==true)

{

vars['$L.showRMProfile']=false;

}

Step 10: Use the model table for Classic Request
Management

After you run the Applications Upgrade Utility, Process Designer-based Request
Fulfilment uses the new productCatalog table instead of the model table. Additionally,
the tool updates all references to the model table to refer to the productCatalog table.

In order for the Classic Request Management to work in parallel with Process
Designer-based Request Fulfilment, the two modules must use the two tables


separately.
To achieve this, first restore the links that reference the model table.
Links that must be updated


Link name                               Field
"ocmlrec"                               part.no
"ocml.view.summary"                     part.no
"ocml.view.space"                       model
"ocml.view.space"                       part.no
"ocml.view.sap"                         part.no
"ocml.view.detail"                      parts.part.no
"ocml.view.detail"                      part.no
"ocml.view.default.workorder"           parts.part.no
"ocml.view.default.workorder"           model
"ocml.view.default.workorder"           part.no
"ocml.view.default.telecom"             parts.part.no
"ocml.view.default.telecom"             part.no
"ocml.view.default.office.move"         parts.part.no
"ocml.view.default.office.move"         part.no
"ocml.view.default.internal"            parts.part.no
"ocml.view.default.internal"            part.no
"ocml.view.default"                     parts.part.no
"ocml.view.default"                     model
"ocml.view.default"                     part.no
"ocml.search"                           part.no

 Link name                                                                                      Service Manager 9.81
 "ocml.copy.model"
 "ocml"                                 Field
 "ocmco"                                number
 "ocmco"                                part.no
 "model"                                part.no
 "model"                                parent.parts
 &quot;model"                           component.part.no
 "advFind.search.line.item"             parent.parts
Links to update (optional)              model
                                        part.no

 Link name                                                                                      Service Manager 9.81
 "Survey.CFG.addFilter"
 "stock"                                Field
 "software.counter"                     part.no
 "software.counter"                     part.no
 "problem"                              installation.models
 "problem"                              license.models
 "pc.software.files"                    failing.component
 "modelvendor.lkup"                     model
 "modelvendor"                          part.no
 "model.icm"                            part.no
 "IM.summary"                           part.no
 "IM.master.update"                     model
 "IM.master.open"                       model
 "IM.master.link"                       model
 "IM.master.close"                      model
 "furnishings"                          model
 "device2"                              model
 "device.template"                      model
 "device.template"                      model
 "device.telecom"                       bios.model
                                        part.no
This PDF was generated on May 23, 2026  part.no

                                                                                                                        Page 228 of 294
 Link name                              Field        Service Manager 9.81
 "device.storage"                       part.no                       Page 229 of 294
 "device.softwarelicense"               part.no
 "device.officeelectronics"             print.model
 "device.officeelectronics"             part.no
 "device.networkcomponents"             part.no
 "device.mainframe"                     part.no
 "device.handhelds"                     part.no
 "device.furnishings"                   part.no
 "device.example"                       bios.model
 "device.example"                       part.no
 "device.displaydevice"                 part.no
 "device.display"                       part.no
 "device.computer"                      bios.model
 "device.computer"                      part.no
 "device"                               part.no
 "DEFAULT ICM"                          model
 "dec.device.pc"                        part.no
 "contract.template"                    part.no
 "contract.template"                    model
 "contract"                             part.no

This PDF was generated on May 23, 2026

Link name                               Field
"contract"                              model
"configurationItemNode"                 bios.model
"configurationItemNode"                 part.no
"configurationItem"                     bios.model
"configurationItem"                     part.no
"cm3t"                                  part.no
"cm3t"                                  product.no.
"cm3r"                                  part.no
"cm3r"                                  product.no.
"advFind.search.contract"               part.no
"advFind.search.contract"               model
"advFind.search.ci"                     part.no

Next, configure synchronization between the "model" and "productCatalog" tables.
Classic Request Management and Process Designer-based Request Fullfillment use
the two tables separately, but you must ensure that the data in the two tables is
consistent.

Step 11: Modify the KM knowledge base

After you run the Applications Upgrade Utility, the "Request_Library" KM knowledge
base is updated to use the request table. You must add another library that uses the
OCMQ table, so that the KM knowledge base can support both Classic and Process
Designer-based request.

For example, you might create the following knowledgebase:

     Knowledgebase Name: Quote_Library
     Display Name: Quote
     Type: sclib


     Search Server Name: <your search server name>
Then, in the Field Definitions tab, configure the following field definitions.


Field  Alias                            Type  Hitlist Index Match Sort

name                                                 weight

number id                               String true  Level 4 false

status problem String true                           No Index true
             status;k
             mstatus

current. phase String true                           No Index true
phase

brief.des title                         String true  Level 4 false
cription

descripti descripti String false                     Level 3 false

on     on

requeste requeste String true                        Default false

d.for  dfor

requesto requesto String true                        Default false
r.name rname

requeste requeste Date                        true   No Index false

d.date ddate

compan compan String true                            No Index false

y      y

assigne assignm String true                          Default true
d.dept ent

assigne assignee String true                         Default false
d.to

priority priority String true                        No Index true

justificat justificat String false                   Default false

ion    ion


Field  Alias                            Type  Hitlist Index Match Sort

name                                                weight

sysmodt sysmodt Date                          true  No Index false

ime    ime

Step 12: Ensure the related record functionality works
correctly

For more information about how to update your forms to use the new related record
functionality, refer to Upgrade to the Process Designer related record subform above.

If you want your system to allow the creation of related records between the Classic
Request Management and Process Designer-based Request Fullfillment modules, you
must configure the screlationtype table appropriately. For example, if you want to
allow the creation of related quotes from Incident records, you must add a new record
in the screlationtype table.

For more information about how to perform data migration for screlation records, refer
to Related Records data migration.

After you have done this, you can create related quotes from incident records.

Step 13: Restart the server

After you have configured Request Management and Request Fulfillment to run in
parallel, you must restart the Service Manager server.
````
