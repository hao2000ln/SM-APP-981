---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.7.7 .. 1.7.7
printed_pages: 1485-1489
---

# 1.7.7 Example: launching automated implementation for change and request

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.7. Example: launching automated
implementation for change and request tasks

This example describes how to launch automated change task implementation and request
task fulfillment when Service Manager is integrated with Operations Orchestration (OO). In this
example, automated implementation is launched for tasks related to the following two out-of-
box service items:

     Restart Tomcat Service
     Password Reset

            Note

           The Restart Tomcat Service and the Password Reset items used in this example are
           only provided in Service Manager 9.51 and later versions. Two OO flows are
           configured for these two items respectively in the out-of-box Service Manager.

Precondition

Before you start, make sure that necessary content packs are deployed in your Operations
Orchestration client. If not, follow these steps to deploy the content packs.

   1. Sign in to Operations Orchestration as an Administrator.
   2. Click Content Management on the left-hand panel.
   3. Click the Content Pack tab.
   4. Click the Add icon to add the contents.
   5. Go to <OO Installation folder>/content, and then select the following content files of

     which the extensions end with .jar:
           oo10-base-cp-1.8.0.jar
           oo10-sm-cp-1.0.3.jar
           oo-microsoft-office-365-cp-1.0.1.jar
           oo-saw-cp-2.0.0.jar
           oo-servicenow-cp-1.0.0.jar
           oo10-request-fulfillment-cp-2.0.3.jar

   6. Click OK.
   7. Click Save.

Add an Operations Orchestration instance in Service
Manager

To add an Operations Orchestration instance in Service Manager, see Add an Operations
Orchestration integration.

Enable OO flow automation for change tasks


To enable OO flow automation for change tasks, see Enable OO flow automation for change
tasks.

Start the AutomationTaskUpdate backend schedule

   1. From the System Navigator, click Miscellaneous > System Status > Start Scheduler.
   2. Select AutomationTaskUpdate to start the schedule.

When this schedule is started, the status of the change task can be automatically updated after
the OO flow execution.

Launch automated task implementation

Launch automated implementation for change tasks related to the
Restart Tomcat Service item

To launch automated implementation for change tasks related to Restart Tomcat Service,
follow these steps:

   1. Open the change task for which you want to launch automated implementation.

     If there are no change tasks related to Restart Tomcat Service, order the Restart Tomcat
     Service item from Service Catalog to create a change record first, then generate a
     change task from the change record:

        1. From the Service Manager System Navigator, click Service Catalog > Order from
           Catalog.

        2. The Service Catalog Entries page opens.

        3. Search for and then open the Restart Tomcat Service item.

        4. Specify the fields on the form.

5. Click Add to Cart.
6. Click View Cart/Checkout, and then open the Restart Tomcat Service item.
7. Specify the fields and then click Submit. Remember the ID of the request for later

  use, for example, SD10219.


        8. Sign in to Service Manager as SDApprover using another session. From the System
           Navigator, click Service Catalog > Search Request to search for the request
           created, for example, SD10219.

        9. The request should be in the Pending Approval status. Approve the request.
       10. Switch back to the session where you submitted the order and wait for a few

           seconds. Then, there should be a change record in the Related Records tab. Click
           the related record ID, for example, C10061.
       11. In the change record form, move the change to Execution Phase. Then, click the
           Task tab. A task should be found there.
   2. Click the task ID to open the task details page. The phase should be in Execution.
   3. Wait for a few minutes for the OO task to complete. The task should go to the Completion
     phase if service is restarted successfully or the Review phase if not.

Launch automated implementation for request tasks related to the
Password Reset item

To launch automated implementation for request tasks related to Password Reset, follow these
steps:

   1. Open the request task for which you want to launch automated implementation.

     If there are no request tasks related to Password Reset, order the Password Reset item
     from Service Catalog to create a request record first, then generate a request task from
     the request record:

        1. From the Service Manager System Navigator, click Service Catalog > Order from
           Catalog.

        2. The Service Catalog Entries page opens.

        3. Search for and then open the Password Reset item.

        4. Specify the fields on the form, such as host name, user name, and user mail
           address.

5. Click Add to Cart.
6. Click View Cart/Checkout, and then open the Password Reset item.


     7. Specify the fields and then click Submit. Remember the ID of the request for later
        use, for example, SD10220.

     8. Sign in to Service Manager as SDApprover using another session. Click Service
        Catalog > Search Request to search for the request created, for example, SD10220.

     9. The request should be in Pending Approval status. Approve the request.
    10. Switch back to the session where you submitted the order and wait for a few

        seconds. Then, there should be a request record in the Related Records tab. Click
        the related record ID, for example, RF10016.
    11. In the request record form, move the change to Fulfillment Phase. Then, click the
        Task tab. A task should be found there.
2. Click the task ID to open the task details page. The phase should be in Execution.
3. Wait for a few minutes for the OO task to complete. The task should go to the Completion
  phase if the password is reset successfully or the Review phase if not. An email with new
  password will be sent to the user once the password is reset.
````
