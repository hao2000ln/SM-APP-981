---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.3.7.13 .. 1.5
printed_pages: 1984-2014
---

# 1.3.7.13 Create a wizard for the work order

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.7.13. Create a wizard for the work order

This examples uses a wizard to create a work order because a wizard simplifies the task of opening a work
order for the user and the functionality is already available in the system.

This example uses the wizard creation tool to create a wizard to allow users to create a work order from the
Incident Management module. When a user creates a work order from an incident, the wizard prompts the
user for information and auto-fills some of the fields in the work order.

To create a wizard for the work order form, follow these steps:

   1. From the System Navigator, click Tailoring > Wizards to open the Wizard Information form.
   2. Type Create Workorder - 1 in the Wizard Name field.
   3. Click Add to create the Wizard record.

   4. On the Wizard Info tab, enter the following information:

Field                                                  Value
Brief Description
Window Title                                           Create a new work order.
Title
Start Node                                             Create Workorder

                                                       Create Workorder

                                                       Select (set to true) to indicate that this is the
                                                       first wizard in a series of wizards in cases
                                                       where you have a series of wizard records.

5. Click Save.
6. In the File Selection tab of the Wizard Information form, select the Select $L.file by tab.

7. On the Select $L.file by tab, enter the following information:

Field                                                  Value
Create a record                                        true
of type                                                EXWorkOrder

8. Click Save.
9. On the Usage tab, enter the following information:


Field                                                     Value
Wizard Usage
                                                          Click Request user input in the Wizard Usage
Sub Format to Display                                     section.
Display Screen
Activate "Finish" option                                  Type createWO.assigneeAndCIs

                                                          Type wizard.display

                                                          Select (set to true) to have a Finish button on
                                                          the wizard form.

10. Click Save.
11. On the Actions tab, enter the following information:

Field                                                     Value
Perform Actions On                                        Select Current File ($L.file).
Actions to Perform >
Expressions                                               initiator in $L.file=operator()
                                                          status in $L.file="New"
                                                          RelatedID in $L.file=number in $relatedRec
                                                          category in $L.file=category in $relatedRec
                                                          impact in $L.file=initial.impact in $relatedRec
                                                          urgency in $Lfile=severity in $relatedRec
                                                          priority in $L.file=priority.code in $relatedRec

Display Record(s) when complete?                          Click Display Record(s) when complete?
Mode                                                      Select Add.

12. Click Save.
13. On the Cancel Expressions tab, enter the following information:

Field                                                     Value
Expressions Executed on Cancel                            cleanup($relatedRec)

14. Click Save and then OK.



1.3.7.14. Add a Process definition record

The Process definition record defines how the system responds to a user's action. The Process definition
uses RAD expressions, JavaScript, and calls to existing RAD applications to perform actions against the
current record, in this case, a work order record.
To add a process definition record, follow these steps:

   1. From the System Navigator, click Tailoring > Document Engine > Processes to open the Process
     Definition form.

   2. Type create.WorkOrder in the Process Name field.
   3. Click Add.
   4. On the Initial Expressions tab, type the following expression:

           $L.void=fduplicate($relatedRec, $L.file)
           $relatedCIs={}
   5. Click Save.
   6. On the Initial Javascript tab, type the following expression:
     system.vars.$relatedCIs=system.library.BSGFunctions.getMembers(system.vars.$L_file.affected_item,
     false, 3

                   Note

                This expression must be entered on one line.

   7. Click Save.
   8. On the RAD tab, enter the following information:

Field                                                                                       Service Manager 9.81
Expressions evaluated before RAD call
                                        Value

                                        Type the following two expressions:
                                        $L.wiz.name="Create Workorder-1"
                                        if (not null(logical.name in $L.file)) then
                                        ($relatedCIs=insert ($RelatedCIs, 1, 1,
                                        logical.name in $L.file))

                                                    Note

                                                   Be sure to enter this expression on
                                                   one line. Also note that when
                                                   entering this expression, there is no
                                                   space after the word insert. For
                                                   example, the expression above
                                                   continues at the word 'insert' as
                                                   follows:
                                                   insert($RelatedCIs, 1, 1,
                                                   logical.name in $L.file))

RAD Application                         wizard.run
Parameter Names                         name
Parameter Values                        $L.wiz.name
Parameter Names                         text
Parameter Values                        $L.exit
Condition                               true

 9. Click Save.
10. On the Final Expressions tab, type cleanup($relatedRec).
11. Click Save and then OK.


1.3.7.15. Create an input form for the wizard

This form is the first form to display in the work order wizard. The user enters the information the user
needs to provide for the wizard to create the work order record. Use Forms Designer to create this form.
For this example, the form name is createWO.assigneeAndCIs.

To create an input form for the wizard, follow these steps:

   1. From the System Navigator, click Tailoring > Forms Designer to open Forms Designer.
   2. Type createWO.assigneeAndCIs in the Form for the form name.
   3. Click New. You don't need to use the Forms Designer wizard for this form.
   4. Create the following input fields on the form:

           Description (Please enter a description of the work to be done)
           Due date (Please enter the due date for this work order)
           Assignee (Please enter the assignee for this work order)
           CIs (Please enter the CIs this work order is for)
   5. The Properties for this form should include:
           Input: RelatedCIs
           Value List: $relatedCIs
           Sortable: checked
   6. Click Save.

The following figure shows a sample createWO.assigneeAndCIs form for the EXWorkorder wizard input
form.


1.3.7.16. Modify the close and update incident forms

For the work order example, you need to modify the close incident and update incident form so that you
can view the work orders assigned to the incident and then double click and read or edit the work order
from the incident. Use Forms Designer to update the IM.update.incident and IM.close.incident form. To do
this you must add a tab and then a form on the tab on both the IM.update.incident and IM.close.incident
forms.
To modify update incident form ,follow these steps:

            Note

           Use these same general procedures to update the close incident form.

   1. From the System Navigator, click Tailoring > Forms Designer to open the Forms Designer search
     form.

   2. Type IM.update.incident in the Form for the form name.
   3. Click Search.
   4. Click Design.
   5. Add a new tab to the existing notebook.
   6. Set the caption of the tab to WorkOrder.
   7. Add a subformat with the following properties:

           Visible: checked
           Format: WorkOrder.vj
           Virtual Join: checked
           Display Blank: checked
           Display Using Table: checked
           Input: number.WO.vj
   8. Click Save.
   9. Use the Forms Designer tool to create the WorkOrder.vj form:
           WorkOrderID: ID
           WorkOrder Deadline: deadline
           WorkOrder Status: status
           WorkOrder Assignee: assign.name
           WorkOrder Description: description
 10. Continue to follow steps 1 through step 8 for IM.close.incident.

                   Note

                You can use the WorkOrder.vj form created in step 9 for the virtual join.

The following figures show samples of the tabs to add.




1.3.7.17. Create alias in probsummary table for link

In the work order example, users need to be able to access a work order from an incident record when the
incident has a work order associated with it. In order to do this, you must create an alias in the
probsummary table and then use that alias to create a link between the probsummary table and the
EXWorkOrder table.

To add an alias to the probsummary table, follow these steps:

   1. From the System Navigator, click Tailoring > Database Dictionary to open the Database Dictionary
     form.

   2. Type probsummary in the File Name field.
   3. Click Search.
   4. On the Fields tab, select the number field and click Edit Field/Key.
   5. Click Create Alias and type number.WO.vj for name and character for type.
   6. Click OK.

To link the EXWorkOrder table with the probsummary table, follow these steps:

   1. From the System Navigator, click Tailoring > Tailoring Tools > Links to open the Link File form.
   2. Type probsummary in the Name field.
   3. Click Search.
   4. Click after the last entry to create a blank line for a new entry.
   5. In the Source field, type number.WO.vj.
   6. Select the entire new line and then click Select Line.

   7. Enter the following information:

Field                                                     Value
Field (From/Source)                                       number.WO.vj
File (To/Target)                                          EXWorkOrder
Field (To/Target)                                         RelatedID
Query                                                     $query
Expressions                                               $query="RelatedID=\""+number in $File+"\""

 8. Click Save and then Back.
 9. Repeat steps to create a link line for the ID field.

10. Enter the following information.

      Field                                                                                 Service Manager 9.81
      Field (From/Source)
      File (To/Target)                  Value
      Field (To/Target)                 ID
      Query                             EXWorkOrder
      Expression                        ID
                                        $query
11. Click Save and then Back.           $query="ID=\""+nullsub(cursor.field.contents(),
                                        "xxx")+"\""


1.3.7.18. Modify im.set.close Process definition

This process needs to be modified so that a user can't close an incident if there are work orders still open
for the incident.

To modify a process definition record, follow these steps:

   1. From the System Navigator, click Tailoring > Document Engine > Processes to open the Process
     Definition form.

   2. Type im.set.close in the Process Name field.
   3. Click Search.

   4. On the Initial Javascript tab, type the following JavaScript:

var WO=new SCFile ("EXWorkOrder")
var FoundOpenWO=WO.doSelect ("RelatedID=\""+system.vars.$L_
file.number + "\""+" and status ~=\"" + "Closed" + "\""
if (FoundOpenWO == RC_SUCCESS)
{
system.vars.$openWO=true;
}
else
{
system .vars.$openWO=false;
}

5. Click Save.
6. On the RAD tab, enter the following information:

Field                                                Value

Note: Some of the fields on the RAD tab are pre-filled with values that you don't need to modify

RAD Application - Select the empty section below the section calling the RAD Application
us.consume.wrapper and then enter the following information:

Expressions evaluated before RAD call                $L.text="There are still open work orders. This
                                                     incident can't be closed yet."

RAD Application                                      apm.mb.ok

Condition                                            $openWO=true

Parameter Names                                      text

Parameter Values                                     $L.text

7. Click Save.
8. On the Final Expressions tab, enter the following information:


        if ($openWO=true) then ($L.exit="badval")
        $L.exit="closestate"
9. Click Save and then OK.


1.3.7.19. Test the work order example

After you complete the tasks to create a work order system, you need to verify that it works correctly. To
verify the basic functionality of the work order example, do the following:

     In Incident Manager, find an open incident or create one.
     Use the Options menu or button on the tool bar to create a work order. Create Workorder should
     display on the Options menu.
     In the Workorder wizard, enter the data to create a work order for the incident.
     Add the work order to the incident and save the changes to the incident.
     Open the incident for editing, and from the WorkOrder tab edit the work order.
     Save your changes.
     Open the incident again, and this time edit the work order and close it.
     You should now be able to close the incident.
     Repeat these steps, but this time create two work orders for an incident.
     Close only one work order and then attempt to close the incident. The system should generate an
     error message indicating that there are still open work orders for the incident, and therefore it can't be
     closed.
     Close all work orders for the incident. You should now be able to close the incident.


1.4. Web Services

You can write Web Services and their clients in any programming language and for any platform. Service
Manager Web Services ships with examples using both the Java™ and Visual C++® programming
languages.
For information on how to publish or consume Web Services using Service Manager, see the Web Services
section. You can use the examples in this section as templates.


1.5. Service Manager Integration Suite (SMIS)

The Service Manager Integration Suite (SMIS) document aids developers in using SMIS to develop
integrations for Service Manager. This document describes the Service Provider Interface (SPI) of SMIS,
and provides instructions on how to develop a template for a schedule-based or UI-based integration, as
well as on how to register an integration template in SMIS.

Overview

Develop an integration template

Processing logic of the mapping functionality

Related topics

Integrations
Integration Manager
Integration Instance Mapping
Integration Instance Information fields
Add or delete an integration instance
Edit an integration instance
Add or delete field mappings
Edit field mappings
Configure value mappings
Configure a callback


1.5.1. Overview

Service Manager Integration Suite (SMIS) is a platform that provides centralized management of integration
instances, which fall into two categories:

     Schedule-based: runs as a schedule in the background.
     UI-based: Can be only invoked in the user interface (UI).

SMIS is also a plug-in-based development platform that enables you to complete the following tasks:

     Reuse common functions and resolves conflicts across integrations
     Customize a default controller to suit the workflow of your integrations
     Use JavaScript to develop integration templates

An integration must be registered as a template so that it can be added to SMIS. To register an integration
as a template, the integration must be developed by following the Service Provider Interface (SPI) provided
by SMIS.
The functional block diagram of SMIS and a sample integration are shown in the following figure.

SMIS SPI                                     Page 146 of 200

SMIS provides the following SPI components.

Manager SPI

This PDF was generated on May 23, 2026
The following table describes the functions used to develop a manager.          Service Manager 9.81

Function         Parameter              Return                          Description
appendTasks
                                                                        Directs the source
preProcess       task                   Boolean                         adapter to retrieve
                                        Boolean                         records, converts
process          task                                                   these records into
                                        Object                          tasks, and calls the
postProcess      task                   String                          task manager to push
                                        Boolean                         these tasks into the
getDestObj                                                              task queue.
getAction
                                                                        Prepares the destObj
isScheduleBased                                                         and actions. If it
finalize                                                                returns false, the task
initParams                                                              will be ignored and
                                                                        removed.

                                                                        Returns true or false
                                                                        when the task is or is
                                                                        not processed
                                                                        successfully.

                                                                        Performs
                                                                        postprocessing after
                                                                        the task is processed.

                                                                        SCFile or Object.

                                                                        Returns a customized
                                                                        action defined by the
                                                                        manager. Can be any
                                                                        value (for example:
                                                                        Insert/Update/Delete).

                                                                        Indicates whether the
                                                                        integration is schedule-
                                                                        based or not.

                                                                        Performs finalization
                                                                        actions.

                                                                        Initializes parameters
                                                                        when the instance is
                                                                        first added. Use
                                                                        this.configItem.setCon
                                                                        figParameterValue
                                                                        (<parameter_name>,
                                                                        <value>) to set
                                                                        parameter values.


Adapter SPI

The following table describes the functions used to develop source and destination adapters.

Function    Parameter                   Return  Description
getRecords                              Array
                                                Retrieves records from
sendRecord                                      external sources, and
                                                returns them to the
sendRecord  Record                      Object  manager.
sendRecord  Action                      String
getFields                               Array   Sends out the record
                                                according to the
                                                action. For example,
                                                sendRecord (data,
                                                "delete") .

                                                JavaScript object that
                                                contains the result data
                                                to send.

                                                Customized action. For
                                                example, insert ,
                                                update , or delete .

                                                Returns an array of
                                                field names, types, and
                                                descriptions. The field
                                                information will be
                                                used for mapping.

Mapping SPI

The following table describes the functions provided by the mapping function in SMIS.


Function        Parameter               Return                                     Description

validate                                boolean                                    Validates the input
                                                                                   values.

validate        inRecord                Object                                     Input field values.

validate        direction               tring                                      Mapping direction.

getOutRecord                            Object                                     Gets outRecord by
                                                                                   inRecord according to
                                                                                   field mapping and
                                                                                   value mapping (not
                                                                                   including callback).

getOutRecord    inRecord                Object                                     Input field values.

getOutRecord    direction               String                                     Mapping direction.

setFieldValues                                                                     The final processing
                                                                                   step of mapping, which
                                                                                   sets the mapped value
                                                                                   to destObject.

setFieldValues  inRecord                Object                                     Input field values.

setFieldValues  outRecord               Object                                     The object of
                                                                                   getOutRecord.

setFieldValues  destObject              Object                                     The final object of the
                                                                                   mapping result.

setFieldValues  smisContext             Object                                     The container that
                                                                                   contains context
                                                                                   values.

setFieldValues  direction               String                                     Mapping direction.

TaskManager SPI

The following table describes the functions provided by the task manager in SMIS.


Function        Parameter               TaskManager SPI  description

                                                Return

readTasks                               Array            Reads tasks by

                                                         instance ID.

readTasks       intId                   String           Instance ID.

removeTask+                             Object           Removes the task if it
                                                         is processed
                                                         successfully.

removeTask+     task                    Object           Task object.

setFieldValues                                           The final processing
                                                         step of mapping, which
                                                         sets the mapped value
                                                         to destObject.

updateTask                              Object           Updates the task if it is
                                                         processed
                                                         unsuccessfully.

updateTask      task                    Object           Task object.

Development procedure

Developing integrations with the SMIS SPI involves different steps for schedule-based and UI-based
integrations.

Schedule-based integrations

To develop a schedule-based integration, perform the following tasks:

   1. Initialize global variables.
   2. Develop an endpoint adapter and a Service Manager adapter.
   3. Develop a manager.
   4. Develop a custom controller.
   5. SMIS provides a default controller. Determine if the default workflow suits the integration. If not,

     develop a custom controller.
   6. Register the integration as a template.
   7. Export the integration template into an unload file.

UI-based integrations

To develop a UI-based integration, perform the following tasks:

   1. Initialize global variables.
   2. Develop a manager.
   3. Implement UI controls.
   4. Register the integration as a template.
   5. Export the integration template into an unload file.


1.5.2. Develop an Integration Template

This section describes the tasks to develop an integration template.

Initialize global variables

Each integration has global variables, which you must initialize. To initialize the global variables of an
integration, follow these steps:

   1. Add a field to the info table, using the integration template name as its name.

                   Note

                If the integration has global parameters, the field must be a structure field.

   2. If the integration has global parameters, add all these global parameter names as fields to the newly
     added structure.
     For example, an integration template named SMBSM has two global parameters: PI and BIR . You
     need to add a structure named SMBSM under the SMIS structure, and then add two fields, PI and
      BIR , to the SMBSM structure. If the template SMBSM has no global parameters, you only need to
     add one field named SMBSM to the SMIS structure.

Develop a source adapter and a destination adapter

To develop a source adapter, use readRecords to return records to the manager.
To develop a destination adapter, use sendRecord to process records from the manager.

            Note

           The getFields function defines the fields used in an integration. See smis_TestSrcAdapter
           and smis_TestDestAdapter in the Service Manager script library for examples.

Develop a manager

A manager is required for both schedule-based and UI-based integrations.
To develop a manager, follow these steps:

   1. Develop appendTasks to prepare tasks in the task queue.
   2. Put the logic in either the preprocess or process method.
   3. Do cleaning in the postProcess or finalize method.
   4. Prepare the destination object in the getDestObj method for the mapping function to set mapped

     values.
   5. Prepare the action in the getAction method to use in the mapping callback(s).
   6. Implement isScheduleBased to indicate whether the integration is schedule-based or not.

                   Tip

                See smis_TestManager in the Service Manager script library for an example.


                   Note

                For a UI-based integration, the manager only needs to implement isScheduleBased and
                add the integration-specific methods to it. See the following script for an example.
                An example manager for a UI-based integration

                        var Class = lib.smis_Prototype.getClass();
                        var PIManagerClass = Class.create(lib.smis_Manager.getClass(),
                        {
                        getUrl: function(vFile) {
                        var baseUrl = this.configItem.getConfigParameterValue("baseurl");
                        var url = baseUrl + "&IsmEntityId="+vFile["number"];
                        url += "&IsmSubject=";
                        var device = new SCFile("device");
                        var RC = device.doSelect("logical.name=\"" + vFile["logical.name"] +
                        "\"");
                        if ( RC == RC_SUCCESS && device["ucmdb.id"] != null){
                        url += device["ucmdb.id"];
                        } else {
                        url += vFile["logical.name"];
                        }
                        return url;
                        },
                        isScheduleBased: function() {
                        return false;
                        }
                        });
                        function getClass() {return PIManagerClass;}

Develop a custom controller

A controller controls interactions between the manager, source and destination adapters, mapping function,
and task manager of a schedule-based integration.

            Note

           UI-based integrations don't need a controller.

SMIS provides a default controller. The following figure shows the workflow of the default controller. If this
default workflow doesn't suit your integration, develop a custom controller.
Workflow of the Default Controller


When developing a custom controller, you can refer to smis_Controller in the Service Manager script
library.

The typical workflow of a controller is as follows:

   1. Call the manager to do the following to prepare tasks:
        1. Delegate its source adapter to retrieve data from the endpoint;
        2. Wrap the data as tasks;
        3. Pass the tasks to the taskManager to save to the failover queue.

   2. Read all the tasks from the failover queue.
   3. Pass the data in the task to the mapping function for validation.
   4. If the data passes validation, get the destRecord (which is the result of value mapping) from the

     mapping function.
   5. Call the manager to preprocess and prepare the following:

           The destObject (which is the target to save or update) ;
           The action (for example, add/save/delete) that the manager should perform to process the
           destObject.
   6. Call the mapping function to process the destObject. All the final mapped values by the final mapping
     are set to the destObject.
   7. Call the manager to process the final destObject, and to return the result (success or failure).
   8. If the result is success, remove the task from the failover queue; If the result is failure, increase the
     retry count and update it to the failover queue.
   9. Call the manager's postprocess and finalize functions to do cleaning.

Normally, you don't need to create a custom controller. You can leave some processes empty if you
don'thing in them. In some cases, you may not need a mapping function and failover queue, so you can
create a simple controller.


Implement UI controls

An integration normally comes with new UI controls, such as new menu options or buttons. To control the
behavior of these UI controls, the integration needs to interact with SMIS. The following are examples:

     Getting parameter values specified in SMIS;
     Calling some business logic in the integration's manager (for example, to prepare a URL);
     Deciding if a UI element should be visible/enabled by checking the integration's global variables
     specified in SMIS.

To illustrate new UI controls, consider the Service Manager to Business Availability Center (BAC) Problem
Isolation integration. This integration includes a new menu option to the Incident form: Launch Problem
Isolation. When you select this menu option, a new browser window opens. The URL of this window is
based on two things: the value of "baseurl" specified in SMIS and the affected CI field of the incident.

To implement this feature, you can use the Display Options tailoring tool to create a display option record, in
which the script on the Pre Javascript tab controls the above described behavior. See the following figure.

The following examples show you some of the values you can retrieve or set. This is not an exhaustive list:

     To get the enabled instance of the integration:
      var configItem =lib.smis_ConfigurationManager.getEnabledConfigItem(<templateName>) ;
     For example: var configItem =lib.smis_ConfigurationManager.getEnabledConfigItem(SMPI)
     To get a URL from the manager:
      vars.$L_url = configItem.getManager().getUrl(vars.$L_file) ;
     To get a parameter value:
      var paramValue = configItem.getConfParamaterValue(paramName)
     To set the property of a UI element:
     Each integration has global variables, which can be used in RAD expressions like SMBSM in
     vars.$G.system.info . If an integration has global parameters, they can be used the same way, for
     example: PI in vars.$G.system.info . You can use these global variables to set the property of a UI


     element (for example, to set a menu item to be visible/invisible, or to set a button to be
     enabled/disabled).

Register an integration template in SMIS

You need to register an integration as a template in SMIS before it is available in the template list in SMIS.
You can view or edit an integration template after it is registered in SMIS.

Register an integration template

To register an integration as a template, follow these steps:

   1. Register the general information of the integration template.

        1. Sign in to Service Manager as a system administrator.
        2. From Database Manager, open the SMISRegistry.g form.

        3. On the General tab, enter the following information of the integration:

Field                                         Description
Name
Version                                       Name of the integration template.
Manager Class Name
                                              Version of the integration template.
Controller Class Name
                                              Script name of the manager of the
SM Adapter                                    integration.
Endpoint Adapter
Instance Count                                Script name of the controller of the
                                              integration. If this field is left blank, a default
Category                                      controller is used.

                                              Name of the Service Manager adapter.

                                              Name of the endpoint adapter.

                                              Maximum allowed number of instances of
                                              the integration.

                                              Category of the integration (Schedule-based
                                              or UI-based).

See the following screenshot for an example.


2. Enter parameters required for the integration.

     1. Select the Parameters tab.
     2. If necessary, enter parameter categories for the integration.

     3. On the General Parameters and Secure Parameters tabs, enter parameters of the integration.

                      Note

                   Newly added parameter categories aren't available in the Category list until the
                   form is saved and then reopened.

                   There is a default Global category. SMIS will initialize all parameters of this
                   category to global variables, which can be used in Service Manager. These
                   parameters can only be set to true or false.

3. Edit the out-of-box mappings.

     1. On the General tab, click the Go to Configure Field Mapping link. The Registry Field Mapping
        page opens.

     2. On the Field Mapping tab, add or edit field mappings.

     3. On the Field Mapping tab, click Edit Callback to edit callbacks, or click Clear Callback to delete
        callbacks.


        4. On the Value Mapping tab, add or edit value mappings.
        5. Click Finish.

                   Note

                The default fields in the drop-down list are defined in the getFields method of the
                Service Manager adapter and endpoint adapter. Each mapping value can be calculated by
                combining the direct mapping value, default value, value mapping table, and callback
                value. For information about the processing logic of mapping, see Processing Logic of the
                Mapping Functionality.

View or edit a registered integration template

Once you have registered an integration template in SMIS, a record is created in the SMISRegistry.g form.
You can view or edit the integration template.
To view or edit a registered integration template, perform the following steps:

   1. Sign in to Service Manager as a system administrator.
   2. From Database Manager, open the SMISRegistry.g form.
   3. Select the Parameters tab, and remove the Global category from the Parameter Category Definition

     pane.

                   Note

                The Global category is a default category, which displays on the Parameters tab by
                default. If you don't clear it before performing a search, the search returns only those
                records with global parameters.

   4. Click Search. A list of integration templates displays.
   5. Select a record to view or edit the details.

Export an integration template into an unload file

After you have registered an integration template in SMIS, you need to export it into an unload file, which
you can then import into a testing system or production system.
To export an integration template into an unload file, follow these steps:


1. Create an unload script for the integration template. This unload script must include all the changes
  you made to the system when developing the integration template.

2. Go to Tailoring > Unload Script Utility. Select the unload script you created and export it into an
  unload file.


1.5.3. Processing Logic of the Mapping Functionality

The following diagram illustrates the processing logic of the mapping functionality.
````
