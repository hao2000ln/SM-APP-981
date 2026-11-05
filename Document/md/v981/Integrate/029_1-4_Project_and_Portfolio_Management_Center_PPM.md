---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.4 .. 1.4
printed_pages: 787-819
---

# 1.4 Project and Portfolio Management Center (PPM)

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.4. Project and Portfolio Management Center
(PPM)

The SM-PPM Center Project Proposal Integration Solution aims to submit project proposals
from Service Manager to PPM Center, and send the proposal’s status (rejected or approved)
from PPM Center to Service Manager.
This section includes the following topics.
Configuring Service Manager
Configuring PPM Center
Upgrading SM Service Catalog-PPM Center Project Proposal Integration Solution
Customizing SM Project Proposal Catalog Item Fields


1.4.1. Configuring Service Manager

This chapter provides configuration information on the Service Manager side. You need to set
up an integration instance based on the SM-PPM integration template, and then add the
Service Manager Web tier server URL to the system information record.
For the supported Service Manager versions, refer to the Support Matrix section on Service
Catalog to Project Proposal (SM - PPM).


1.4.1.1. Add an integration instance

To add a new integration instance for the SM Service Catalog-PPM Project Proposal Integration
Solution, follow these steps:

   1. Sign in to Service Manager as a System Administrator.
   2. Go to Tailoring > Integration Manager.
   3. Click Add. The Integration Template Selection page displays.
   4. Select SMPPM from the Integration Template list, and then select the Import Mapping

     checkbox.
   5. Click Next. The Integration Instance Information page displays.

   6. In the Integration Instance Information page, some fields are already populated with
     default settings provided with the template. Review the values and make changes as
     necessary. Provide values for other required fields, including Interval Time, Max Retry
     Times, SM Server, Endpoint Server, Log Level, and Log File Directory.

                   Note

                The Log File Directory must exist on the Service Manager server. Otherwise,
                the log files will get lost.

   7. Click Next. The Integration Instance Parameters page displays.
   8. In the General Parameters and Secure Parameters tabs, modify parameter values as

     described in the table below:


Parameter                               Value

user                                    A PPM Center user account for Service

                                        Manager to connect to PPM Center, for

                                        example, admin.

PPMServerURL

                                          http://<PPM_server>:<port>

                                        For example,
                                        http://example.domain.com:8080 .

PPMRequestType                          PPM Request Type, for example, PFM–
password                                Proposal.

                                        Password of the PPM Center user
                                        account for Service Manager to connect
                                        to PPM Center.

 9. Click Next. The Integration Instance Fields page displays.
10. In the Integration Instance Fields page, you can see pre-defined SM Fields and PPM

    Center (Endpoint) Fields provided with the integration instance template. You can modify
    or delete these fields or add new fields as necessary.
11. Click Next. The Integration Instance Mapping page displays.

12. In the Integration Field Mapping page, you can see pre-defined mappings between SM
    Fields and PPM Center (Endpoint) Fields.

    You can modify the pre-defined field mappings and value mappings between SM fields
    and PPM Center fields. You can also add your own field mappings and value mappings.

    For detailed instructions on configuring field mappings and value mappings, seeService
    Manager Integration Suite (SMIS).

13. Click Finish. The new integration instance is added.
14. With the new integration instance highlighted, click Enable to enable or disable the new

    SM Service Catalog-PPM Center Project Proposal Integration Solution instance.


1.4.1.2. Configure the Service Manager Web
tier server URL

Follow these steps:

   1. Sign in to Service Manager as a System Administrator.
   2. Go to System Administration > Base System Configuration > Miscellaneous > System

     Information Record.
   3. Click the Active Integrations tab.
   4. In the WebServer URL field, enter the URL of the Service Manager Web tier application

     server. For example, http://16.187.191.84:8080/webtier980/index.do.

                   Note

                Do not enter localhost as the Web tier server address even if the Web tier
                application server is on the same host machine as the Service Manager
                server is on. The Web tier server address must be the real hostname or IP
                address of the host machine.

   5. Click Save.
   6. Sign out and sign in to Service Manager again.


1.4.2. Configuring PPM Center

This chapter provides configuration information on the PPM Center side, including
configuration of the PPM Workbench and the PPM Server.
For the supported PPM Center versions, refer to the Support Matrix section on Service
Catalog to Project Proposal (SM - PPM).
If you encounter any problems when synchronizing the requests from PPM to SM, you can
navigate to <PPM_HOME>\logs and then check the logs starting with REQ_ . For example,
<PPM_HOME>/logs/REQ_30244.


1.4.2.1. Configuring the PPM Workbench

Perform the following steps to configure the PPM Workbench:
   1. Sign in to PPM Center as an administrator.
   2. In the navigation pane, go to Administration > Open Workbench. The Project and
     Portfolio Management Workbench application launches.

3. In the left navigation pane, click Demand Mgmt > Requets Types. The Request Type
  Workbench window opens.


4. Click List to list all request types in PPM Center.

5. Double-click the PFM–Proposal entry, or select it and then click Open.


               Note

             If you can't find the PFM-Proposal entry, contact your PPM administrator for
             best practices of installation.

6. Go to the Fields tab and click New. Add a new field CallID: for the PFM–Proposal Request
  Type, and provide values for required fields as shown below.


7. Click OK to save the modification.

8. In the left navigation pane, click Configuration > Workflows to launch the Workflow
  Workbench window.

9. Click List to list all workflows. Locate the PFM–Proposal entry from the list, and double-
  click on it or click Open.


10. In the Workflow Step Sources sub-window, select the Executions node in the Workflow
    Step Sources item tree.


11. Click New to create a new workflow step source SMCatalog_Reject.

12. Click New Cmd to add a new command, and provide values for the corresponding fields:
          Command: close_smcatalog
          Condition: '[REQD.P.CALLID]' IS NOT NULL


Command Steps: Locate the script with the [command 1] marker in command.txt ,
then copy and paste the entire section of script directly to this field.

            Note

           To facilitate your configuration effort, all scripts that may cause errors
           during your copy and paste operation are provided in command.txt
           under the <SMPPMIntegration_installDir>\doc directory.


          The following is the detailed script ( [command 1] in command.txt ):

               ksc_local_exec sh "
               [AS.BASE_PATH]/integration/smcatalog/smcatalog.sh"
               "[AS.BASE_PATH]" "[AS.KINTANA_SERVER_NAME]"
               "[AS.SM_URL]/sc62server/PWS/ServiceDeskForPPM"
               "[AS.SM_USERNAME]" "[AS.SM_PASSWORD]"
               "[REQD.P.CALLID]" "Request Rejected"
               "Proposal has been rejected."

13. In the Workflow Step Sources sub-window, select the newly added SMCatalog_Reject
    item.


14. Click Copy to create a new workflow step source SMCatalog_Approve . Locate the script
    with the [command 2] marker in command.txt , then copy and paste the entire section
    of script directly to the Command Steps field.


    The following is the detailed script ( [command 2] in command.txt ):

        ksc_local_exec sh "
        [AS.BASE_PATH]/integration/smcatalog/smcatalog.sh"
        "[AS.BASE_PATH]" "[AS.KINTANA_SERVER_NAME]"
        "[AS.SM_URL]/sc62server/PWS/ServiceDeskForPPM"
        "[AS.SM_USERNAME]" "[AS.SM_PASSWORD]"
        "[REQD.P.CALLID]" "Proposal approved"
        "Proposal has been approved."

15. In the Workflow Step Sources sub-window, select the Decisions node.


16. Click New. In the Decision dialogue box, create a new workflow step source
    SMCatalog_Retry.

17. For the Validation field, click New to create a new validation SMCatalog_Retry for the
    SMCatalog_Retry workflow step resource, and click New to add two entries in Validation
    Values as shown below.


18. Click OK to close the Validation dialog.

19. Click OK to close the Decision dialog.

20. In the PFM–Proposal sub-window, drag-and-drop the newly added workflow step
    resources SMCatalog_Reject, SMCatalog_Approve, and SMCatalog_Retry from the
    Workflow Step Sources sub-window to the PFM–Proposal workflow. The Workflow Step
    window pops up.


21. Click Security and then click New. For the Security Group field, select PPM Userfrom the
    pop-up window and click the right arrow to add PPM User to Security Group.

22. Click OK in the Validate and Workflow Step windows. PPM User is added to Security
    Group.


23. To add transitions between workflow steps, right-click a step, and select Add
    Transitionfrom the menu.

24. After adding all the steps in the PFM–Proposal workflow, click Save to save the
    modification to the workflow. The configuration of the PPM Workbench is finished.




1.4.2.2. Configuring the PPM Server

            Note

           Be sure to complete the following preliminary tasks before configuring the PPM
           server:

              1. Install AXIS2 (axis2-1.7.4) and ANT (apache-ant-1.9.7).
              2. Configure AXIS2_HOME , ANT_HOME , and add $AXIS2_HOME/bin ,

                 $ANT_HOME/bin to PATH.
              3. Install JDK and set JAVA_HOME to the location where the JDK is installed.
              4. Make sure both the SM-PPM adapter and the PPM server use the same

                JAVA_HOME. Otherwise, the status synchronization from PPM to SM will fail
                with the following error message:
                 Exception in thread "main" java.lang.UnsupportedClassVersionError:
                com/hp/smppm/ws/CloseSMInteraction : Unsupported major.minor version
                52.0

Perform the following steps to configure the PPM server:

   1. Create a folder smcatalog under <PPM_HOME>\integration . For example,
      C:\ITG\integration\smcatalog .

   2. Navigate to the <Release_Package>\SMPPM\PPM_configuration directory, and then copy
     the stub folder, smcatalog.sh, build.xml, WebServiceStubGenerator.sh, and
     properties.conf to the smcatalog folder.

   3. Configure SM Web service URL and PPM Server in the properties.conf file.
           Configure SM Web service URL: Update this value to http://<SM Server Address>:
           <port>/sc62server/PWS/ServiceDeskForPPM.wsdl. For example,
            http://smserver01:13080/sc62server/PWS/ServiceDeskForPPM.wsdl .
           Enter PPM Server Name: Enter the PPM Server name.


Note

The PPM Server name can be found under <PPM_HOME>\server\ . If
the PPM server name can't be recognized, run the following command
line before this step:

  dos2unix -o *.sh

4. Run the dos2unix properties.conf command.

5. Run the dos2unix WebServiceStubGenerator.sh command.
6. Run the dos2unix smcatalog.sh command.
7. Run the sh WebServiceStubGenerator.sh command to generate SM WSDL stub.
8. Open the server.conf file in the PPM Center installation root path (for example,

   c:\ITG\server.conf ).

     1. Set the com.kintana.core.server.ENABLE_WEB_SERVICES to true to support the
        Web Service function in PPM Center.

             com.kintana.core.server.ENABLE_WEB_SERVICES=true


2. Add the following to the end of the server.conf file:

com.kintana.core.server.SM_URL=http://<SM server address>:
<port>

com.kintana.core.server.SM_USERNAME=<SM user account>

  com.kintana.core.server.SM_PASSWORD=<SM user account password>

Replace the italic content in angle brackets with the actual values of the Service
Manager server and user account information which will be integrated with PPM
Center.
Example

  com.kintana.core.server.SM_URL=http://tvm001:13080

com.kintana.core.server.SM_USERNAME=falcon

               com.kintana.core.server.SM_PASSWORD=1Qaz2wsx3edc

                        Note

                     Unexpected errors may occur if the SM user account password is blank.

 9. Run the ./kStop.sh -now -user <ppm_account> command, and then provide
    <ppm_password> as prompted. For example: ./kStop.sh -now -user admin.
    You can run the ./kStatus.sh command to check the status of stop process.

10. Run the ./kUpdateHtml.sh command, and then run the ./kStart.sh script to restart the
    PPM server for the configuration to take effect.


1.4.3. Upgrading SM Service Catalog-PPM
Center Project Proposal Integration Solution

To upgrade the SM Service Catalog - Project and Portfolio Management (PPM) Center Project
Proposal Integration Solution from v1.01 to v1.02, perform the following steps:

   1. Sign in to PPM Center as an administrator.
   2. Configure the PPM Workbench again. Refer to Configuring the PPM Workbench for

     detailed instructions.
   3. Configure the PPM Server again. Refer to Configuring the PPM Server for detailed

     instructions.


1.4.4. Customize SM Project Proposal Catalog
Item Fields

Perform the following steps to customize SM Project Proposal Catalog Item fields:
   1. Sign in to Service Manager as a System Administrator.
   2. Go to Service Catalog > Administration > Manage Catalog. The Search Catalog Item
     Definitions form opens.
   3. Type Project Proposal in the Name field, and click Search. The Project Proposal Catalog
     Item Definition tab window displays. Click the User Selections tab.
   4. On this page, you can click menu items on the right side of the window to edit fields of
     the Project Proposal Catalog Item, or simply double-click the entry you want to edit.
     For example, if you need to add a Region field, perform the following steps:
     a. Click Add User Selection, and then enter values as required.

b. Click Next. In the value list table, and then enter optional values for the Region field.
The values added will be available in the Project Proposal Catalog Item drop-down list for
users to select.


            Note

           The value provided in the Value column must be the same as that in the
           Project and Portfolio Management Center (PPM) field on the web page.

c. Click Next, and select a type from the Type drop-down list. You may also select the
Mandatory checkbox as necessary.


d. Click Next to finish the wizard.

e. Click Save. Now the system adds the Please enter the Region field in the Project
Proposal Catalog Item.

5. After the custom fields are added to the Project Proposal Catalog Item, configure the
  fields mapping in the Service Manager Integration Suite (SMIS) framework. To do so, go
  to Tailoring > Integration Manager.


6. Double-click the SMCatalog_PPMProjectProposal entry.

7. Click Next.

8. Click Next again. The Integration Instance Fields page displays.

9. In the SM Fields tab, add the created fields (for example, Region) to the Project Proposal
  Catalog Item.


10. Click the Endpoint Fields tab, and add PPM fields that map to the fields added to the
    Project Proposal Catalog Item. For example, REQ.P.KNTA_REGION is a field in PPM
    mapping to Region of the Service Manager Project Proposal Catalog Item.


11. Click Next.
12. In the Field Mapping pane, map the fields of the Service Manager Project Proposal

    Catalog Item to PPM Project Proposal fields.

Note

The CallID field is mandatory. PPM Center uses the mapping field
REQD.P.CALLID to synchronize the status back to Service Manager.

For more information about configuring field mappings or value mappings,
see Service Manager Integration Suite (SMIS).
````
