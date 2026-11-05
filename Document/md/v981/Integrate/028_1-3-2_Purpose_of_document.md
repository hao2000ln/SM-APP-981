---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.3.2 .. 1.3.2
printed_pages: 748-787
---

# 1.3.2 Purpose of document

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.2. Purpose of document

This section describes various Incident Exchange user scenarios between Service Manager
and SAP Solution Manager Service Desk and is intended for the following audiences:

     Incident Analysts (and others involved in Incident Management, such as operators)
     Solution Manager User
     System Administrators (for installation and initial configuration)


1.3.2.1. Prerequisites

Refer to Incident Exchange (SM - SAP Solution Manager) for the supported component
versions.


1.3.2.2. Architecture

SMSSMEX integrates a single Service Manager server with multiple external help desk
systems.


Service Manager Server is the OpenText service desk system.
Service Manager DB provides persistent storage for Service Manager.
SMSSMEX Client Code consists of RAD and Java scripts, table definitions and GUI
formats. The SMSSMEX webservices are called from this client code.
WebServer is a Tomcat Web Application Server or WebLogic Application Server that
hosts the SMSSMEX WebService (deployed as a .war file).
SMSSMEX WebService exposes the incident webservice of Service Manager in the SAP
format and transfers client requests to SAP Solution Manager webservices.
SMSSMEX Database provides persistent storage for the SMSSMEX WebService.
SAP Solution Manager is the Service Desk.


1.3.2.3. Use cases

This section discusses two use cases for Service Manager Exchange with SAP Solution
Manager that demonstrate the integration scenarios.

Use Case 1: Incident Originates from Solution Manager

In this use case, a user reports an issue to SAP Solution Manager. The Solution Manager
generates a new incident and sends the incident to Service Manager to request a solution for
the issue.


Use Case 2: Incident Originates from Service Manager

In this use case, the user issue is captured and sent to Service Manager. An incident is
generated in Service Manager and is sent to Solution Manager to request a solution for the
issue.



Contents

     1 Use Case 1: Incident Originates from Solution Manager
     2 Use Case 2: Incident Originates from Service Manager


1.3.2.4. User scenarios

Set up SAP Instance CI in Service Manager
SM 9.x to SAP Solution Manager 7.1
Create an incident in Service Manager
Open a new incident to send to SAP
Open the incident in Solution Manager
Check updates in Service Manager
Synchronize new information with Solution Manager
Check updates from Service Manager
Update the incident status in Solution Manager
Close the incident in Service Manager
Check the incident's status in Solution Manager
SAP Solution Manager 7.1 to SM 9.x
Create incident in Solution Manager
Send Solution in Service Manager
Check the solution from Service Manager
Send the incident back to Service Manager
Send the incident back to Solution Manager again
Close the incident in Solution Manager
Check the incident's status in Service Manager


1.3.2.4.1. Set up SAP Instance CI in Service
Manager

Follow these steps:
   1. Sign in to Service Manager as Config.Manager.
   2. Click Configuration Management > Search CIs.
   3. Set SAPInstance for the Type field.
   4. Click New.
   5. Create a SAPInstance CI, and then enter SAP Instance Info.

To get System ID, Installation Number and Client information from SAP:
   1. Sign in to Service Manager as Config.Admin.
   2. Click Configuration Management > Configuration Item Relationships.
   3. Select MyDevices as the Upstream CI.


4. Select the SAPInstance CI as the Downstream CI.
5. Fill in other fields.
6. Click Add.
7. Click OK.


1.3.2.4.2. SM 9.x to SAP Solution Manager 7.1

Create an incident in Service Manager
Open a new incident to send to SAP
Open the incident in Solution Manager
Check updates in Service Manager
Synchronize new information with Solution Manager
Check updates from Service Manager
Update the incident status in Solution Manager
Close the incident in Service Manager
Check the incident's status in Solution Manager


1.3.2.4.2.1. Create an incident in Service
Manager

Follow these steps:
   1. Sign in to Service Manager as Incident.Manager.
   2. Click Incident Management > Open New Incident. Click the Incident category. The
     incident ticket quick form opens.

3. Fill in required fields for the new incident as necessary:
     1. Click Fill to select a Subcategory, and then select an Area.
     2. Click Fill to select the applicable Affected Service, “MyDevices”.
     3. Click Fill to select the Affected CI. The CI describes the client information of
        Solution Manager, such as SystemID, Installation Number, and Client.

                      Caution

                   You should first select Affected Service and then select Affected CI.
                   Please follow the sequence.

     4. Type a Title for the incident.

                      Note

                   The Default Impact and Priority values of the affected CI are
                   automatically populated to the Impact and Urgency fields of the incident
                   record. You can manually change these automatically populated values
                   if needed.


                      Caution

                   If you specify the Impact and Urgency values first and then specify an
                   Affected CI with an empty Default Impact or Priority value, the system
                   clears the Impact or Urgency value you selected for the incident record.

     5. Type a Description for the incident.
     6. Click Search Knowledge icon to see if the issue is already logged in the knowledge

        base.
     7. Complete the required fields in the Incident Details section.
     8. Complete the form with any other relevant information.
4. Click Save&Exit and then click Open New Incident to create an incident.


1.3.2.4.2.2. Open a new incident to send to
SAP

   1. Click Incident Management > Search Incidents. The Display Which Incident Tickets form
     opens.

   2. In the Incident ID textbox, type the ID of the new incident created in step 1 and click
     Search. The incident opens.

   3. Extend the Sap Solution Manager tab and select a Solution Manager client in the SAP
     Solution Manager drop-down list.

4. Update the Status field to Work In Progress, fill in other fields, and then click Save.

5. Click Send Incident to send the incident to SAP.

6. Service Manager receives the Request accepted message after the incident is sent to
  middleware successfully. Click Save & Exit to close the incident window.


7. After a few minutes, re-open the incident to check whether it is sent to SAP.
  If the incident is sent successfully, Service Manager receives the Incident ID message
  from SAP.

8. Click Cancel to close the incident window.


1.3.2.4.2.3. Open the incident in Solution
Manager

Follow these steps:
   1. Sign in to Solution Manager.
   2. Click Work Center > SAP Solution Manager: Work Center (SAP GUI) to open Solution
     Manager Work Center.

3. Click Common Tasks > IT Service Management. The SAP Solution Manager IT Service
  Management page opens in Explorer.


4. Click Search > Incidents to open the search window.

5. Type the incident ID in Search Criteria and then click Search. The Result List displays the
  incident.

6. Click the incident ID link to open the incident.
7. Fill in the required fields (Reporter) and change the Status to In Process.


8. Click Add Text in the Text drop-down section to add a description of the incident.
9. Add Refresh in Ext. Service Desk scheduled action.

10. Click Save. The incident information synchronizes with Service Manager automatically.

                 Note

               Solution Manager saves the text field automatically and periodically. The text
               field saved automatically isn't synchronized with Service Manager.

11. Click Display to switch the incident to view mode.


1.3.2.4.2.4. Check updates in Service
Manager

Follow these steps:
   1. Click Incident Management > Search Incidents. The Display Which Incident Tickets form
     opens.
   2. In the Incident ID field, type the ID of the new incident created in step 1 and click Search.
     The incident opens.
   3. Extend the Sap Solution Manager tab to view the incident’s status from Hidden Metadata.
          • Requester: Indicates Service Manager has sent the incident. Solution Manager is
          the provider.
          • ProviderProcessing: Indicates Solution Manager is processing the incident.

   4. Extend the Activities tab to view the message of Journal Updates. Service Manager
     receives the Desc from Solution Manager message from Solution Manager. The read-
     only Journal Updates field displays messages from Solution Manager every time it
     updates the incident.


1.3.2.4.2.5. Synchronize new information with
Solution Manager

   1. Extend Activities tab to input “Update from Service Manager” message into New Update
     textbox.

   2. Click Add Info to synchronize with Solution Manager and then Service Manager receives
     the message “being processed”.

   3. Click Cancel to close the incident window.


1.3.2.4.2.6. Check updates from Service
Manager

   1. Search the incident and then open it.
   2. As shown in the following screenshot, Solution Manager receives update from Service

     Manager.


1.3.2.4.2.7. Update the incident status in
Solution Manager

   1. Search the incident and open it.
   2. Click Edit to switch to the edit mode.
   3. Change the status to Customer Action and then save it.

     The incident’s status must be changed to Customer Action or Proposed Solution in
     Solution Manager if the incident is closed in Service Manager.
   4. Click Display to switch to the view mode.


1.3.2.4.2.8. Close the incident in Service
Manager

Follow these steps:

   1. Click Incident Management > Search Incidents. The Display Which Incident Tickets form
     opens.

   2. In the Incident ID textbox, type the ID of the new incident created in step 1 and click
     Search. The incident opens.

   3. Update Status to Resolved, and provide solution.
   4. Click Save.
   5. Click Close SAP Incident to close the incident in Service Manager.

            Caution

           The incident status in SAP Solution Manager MUST be Customer Action or
           Proposed Solution, then the incident can be closed in Service Manager side.

            Note

           Wait for a few minutes after you clicked the Close SAP Incident button. The Close
           Incident action is unsynchronized between Service Manager and SAP Solution
           Manager.


1.3.2.4.2.9. Check the incident's status in
Solution Manager

   1. Search the incident and then open it.
   2. Solution Manager displays the message “The message is already closed”.
   3. The incident’s status is changed to Confirmed.


1.3.2.4.3. SAP Solution Manager 7.1 to SM 9.x

Create incident in Solution Manager
Send Solution in Service Manager
Check the solution from Service Manager
Send the incident back to Service Manager
Send the incident back to Solution Manager again
Close the incident in Solution Manager
Check the incident's status in Service Manager


1.3.2.4.3.1. Create incident in Solution
Manager

Follow these steps:
   1. Sign in to Solution Manager.
   2. Click Work Center > SAP Solution Manager: Work Center (SAP GUI) to open Solution
     Manager Work Center.

3. Click Common Tasks > IT Service Management. The SAP Solution Manager IT Service
  Management page opens in Explorer.


4. Click Create > Incident. The Incident: New page opens.

5. Fill in the required fields for the new incident as necessary:

        Type a Description and a Reporter for the incident.
        Select a Priority in the drop-down list.
        Click Fill to select the Installed Base Component. This field describes the client
        information of Solution Manager, such as SystemID, Installation Number, and
        Client.
        Complete the form with any other relevant information.


6. Click Schedule new Action in Schedule Actions drop-down section and select Send to
  External Service Desk from the list in the new window opened.

7. As shown in the following screenshot, the new action is waiting for execution in the action
  list.

   8. Click Save to send the incident to Service Manager.  Page 776 of 1727
   9. Click Display to switch the incident to view mode.

This PDF was generated on May 23, 2026

10. After a few minutes, open the incident again to check whether it's sent to Service
    Manager.
    If the incident is successfully sent, SAP receives the Incident ID message from Service
    Manager.


1.3.2.4.3.2. Send Solution in Service Manager

Follow these steps:
   1. Sign in to Service Manager as Incident.Manager.
   2. Click Incident Management > Incident Queue. Find the incident from Solution Manager
     in the Incident Queue form.

3. Open the incident and check the updated information from Solution Manager.

4. Extend the Sap Solution Manager tab to view the incident’s status from Hidden Metadata.

        Provider: Indicates the incident is requested by Solution Manager. Service Manager
        provides the solution to Solution Manager.

        ProviderProcessing: Indicates the incident is being processed by Service Manager.

5. Extend the Activities tab to view the message of Journal Updates. Service Manager
  receives a message that displays the incident ID of Solution Manager. For example:

  Incident ID at external helpdesk is IM10146.

6. Update the status to Work In Progress and fill other fields.


7. Click Save.
8. Type solution in the Solution text box in the Proposed Solution tab.

 9. Click Save.
10. Click Send Solution to send solution provided by Service Manager to Solution Manager.

11. Click Cancel to release the incident.

12. After a few minutes, click the Sap Solution Manager tab to view the incident’s status from
    Hidden Metadata.

          SolutionProvided: Indicates the incident has been sent with solution by Service
          Manager.

And the log is recorded with the message “the solution is proved to Solution
Manager” below the Hidden Metadata textbox. The Send Solution button and the
Send Back button are unavailable and only the Add Info button is active.

Send Solution: Service Manager provides a solution to Solution Manager. The action
is unidirection. After the action, the incident in Service Manager can't send a second
solution. Only adding new information into the incident is allowed. Otherwise, the
incident will be sent back by Solution Manager.


          Add Info: Service Manager can synchronize with Solution Manager continually. The
          action is bidirection.
          Send Back: Service Manager rejects the incident from Solution Manager. The action
          is unidirection. After the action, the incident in Service Manager can't be sent back
          again to Solution Manager.
13. Click Cancel to close the incident window.


1.3.2.4.3.3. Check the solution from Service
Manager

Search the incident and open it. As shown in the following screenshot, Solution Manager
receives the message Solution from Service Manager from Service Manager.


1.3.2.4.3.4. Send the incident back to Service
Manager

   1. Search the incident and open it.
   2. Click Edit to switch the incident to edit mode.
   3. Change the status to In Process.
   4. Create a New Scheduled Action Send to External Service Desk to send the incident back

     to Service Manager.
   5. Click Display to switch the incident to view mode.


1.3.2.4.3.5. Send the incident back to Solution
Manager again

Follow these steps:
   1. Sign in to Service Manager as Incident.Manager.
   2. Click Incident Management > Incident Queue. Find the incident from Solution Manager
     in the Incident Queue form.
   3. Open the incident and check the updated information from Solution Manager.
   4. Extend the Sap Solution Manager tab to view the incident’s status from Hidden Metadata.
     The Hidden Metadata field displays Provider: ProviderProcessing, which means Solution
     Manager is waiting for the solution provided by Service Manager.

   5. Extend Activities tab to view the comments when SAP rejects the solution.

6. Click Send Back to send the incident back to Solution Manager.

7. Click Cancel to release the incident in Service Manager.

8. After a few minutes, open the incident again and extend the Sap Solution Manager tab to
  view the incident’s status from Hidden Metadata.

  The Hidden Metadata field displays Provider: RequesterProcessing, which means
  Solution Manager is processing the incident. Then Service Manager transfers the
  incident's ownership to Solution Manager.


9. Click Cancel to close the incident window.


1.3.2.4.3.6. Close the incident in Solution
Manager

   1. Search the incident and open it.
   2. Click Edit to switch the incident to edit mode.
   3. Change the status to Proposed Solution.

     The incident’s status must be change to Proposed Solution or Customer Action before
     the incident is changed to Confirmed.
   4. Change the status to Confirmed.
   5. Click Save to close the incident.


1.3.2.4.3.7. Check the incident's status in
Service Manager

Follow these steps:
   1. Sign in to Service Manager as Incident.Manager.
   2. Click Incident Management > Incident Queue. Find the incident from Solution Manager
     in the Incident Queue form.
   3. Open the incident and check the updated information from Solution Manager.

The Status field is Closed and all buttons about SAP aren't available.
````
