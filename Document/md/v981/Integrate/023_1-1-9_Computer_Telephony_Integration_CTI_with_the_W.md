---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.9 .. 1.2
printed_pages: 607-631
---

# 1.1.9 Computer Telephony Integration (CTI) with the Web client

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.9. Computer Telephony Integration (CTI)
with the Web client

The Service Manager web client can integrate with a Computer Telephony Integration (CTI)
application in two ways: inbound and outbound. Inbound CTI can automate the creation of
interactions, whereas outbound CTI can automate dialing.

The web client inbound CTI implementation provides the following method. To support inbound
CTI, the web tier URL must have ?telephonyuser=1 appended.

Method      Technology                  Supported     Supported
New method                              functions     browsers

            Uses native HTML            System event  Firefox, Chrome,
            and JavaScript              Transact      and Edge
            instead of the CTI
            applet. Only Service
            Manager 9.50 or
            later supports this
            method. This
            method doesn't
            require the
            installation of any
            CTI support code
            the first time users
            connect using the
            telephony URL.

            For details, see Use
            the new CTI
            method.

            Important

           Oracle has announced that the existing Applet support in Java SE 8 will continue
           through March 2019, after which it's subject to removal at any time. For more
           information, see the Java Client Roadmap Update white paper. By following the
           overall approach, it's highly advisable that the customers adopt the new method.
           You must upgrade both the Service Manager platform and the applications to
           version 9.50 or later.

Meanwhile, the web client outbound CTI implementation provides the following method:

Method         Technology               Supported          Service Manager 9.81
URI protocols                           functions
                                                   Supported
               Uses the URI             Transact   browsers
               (Uniform Resource                   Firefox, Chrome,
               Identifier) protocols               and Edge
               to start telephone
               calls or dialogues.
               This method
               doesn't rely on the
               browser's ability to
               support Java applet
               technology. You
               must install a
               telephony client
               locally on your
               computer to handle
               and manage the
               calls or dialogues.

               For details, see Use
               URI protocols.


1.1.9.1. Use the new CTI method

You are recommended to use the new Computer Telephony Integration (CTI) method instead of
the legacy one, for the following reasons:

     The new method uses native HTML and JavaScript instead of the CTI applet, and
     therefore eliminates the dependency on your browser's ability to support Java applet
     technology.
     The new method can automate not only the creation and update of interactions and
     incidents, but also the action of a toolbar button or a More menu option in an active
     record detail form.

For more information about the two methods, see Computer Telephony Integration (CTI) with
the Web client.

Click the following links to learn more about the new CTI method:

How the new CTI method works

How to use the new CTI method
How to test the new CTI method


1.1.9.1.1. How the new CTI method works

The new CTI implementation enables Service Manager to receive requests from the
CTI application as system events. The out-of-box system events are described in the following
table.

            Tip

           To access the system events, enter db in the Service Manager command line and
           press Enter to open the Database Manager, and then enter SystemEvents in the
           Table field and then click Search.

System event     Call application       Call script    Description

EditIncident     script.execute.event EditIncident     Edit the specified
                                                       incident

EditInteraction  script.execute.event EditInteraction  Edit the specified
                                                       interaction

ReceiveIncident  script.execute.event ReceiveIncident  Create a new
                                                       incident

ReceiveInteraction script.execute.event ReceiveInteraction Create a new
                                                                             interaction

ReceiveInteractionS script.execute.event ReceiveInteractionS Create a new

treamlined                              treamlined     streamlined

                                                       interaction

ReceiveInteractionLi script.execute.event ReceiveInteractionLi Search interactions

st                                      st             based on the

                                                       specified criteria

Each of these system events calls the script.execute.event RAD application, which calls a
same-name script to fulfill the system event. These scripts are defined in the scripts table.

    Tip

    To access these scripts, enter scripts in the Service Manager command line, and
    then press Enter. To access a specific script, in the Script Name field, enter the
    script name (for example, ReceiveInteraction), and then click Search.


Each of these scripts defines the mapping between parameters and fields in the Interaction or
Incident dbdict (incidents or probsummary). The following figure shows the mapping defined
in the ReceiveInteraction script. For example, the Caller Name parameter is mapped to the
contact.name field in the incidents dbdict.

The following diagram shows how the new CTI method works.

The working process is as follows:
   1. The user is logged in to the Service Manager web tier client with the telephony URL. For
     example:

          http://smwebtierhost:8080/webtier-9.80/index.do?telephonyuser=1


               Note

             To take a telephony call, the user must be logged in to the Service Manager
             web client. Otherwise, the call is ignored.

2. The user's client system takes a telephone call.
3. The CTI application is triggered to call a VBA function (for example, CreateInteraction).

  The parameters defined in the function are sent along with the web tier telephony URL.
  The URL uses the following syntax:

      http://<SM web tier host>:<port>/<SM web tier name>/telephony.html?
      SystemEvent=”EVENTNAME”,”Parameter1”,”Parameter1
      Value”,”Parameter2”,”Parameter2 Value”, … “Parameterx”, “Parameterx
      Value”

  For example:

      http://smwebtierhost:8080/webtier-9.80/telephony.html?
      SystemEvent=”ReceiveInteraction”,”Caller Name”,”AGENT
      SERVICEDESK”,”Category Type”,”incident”

4. Service Manager receives the request as a system event (for example, a system event
  named ReceiveInteraction).

5. The web server calls the script.execute.event RAD application, which calls the script with
  the same name of the system event (for example, ReceiveInteraction).

6. The Document Engine creates a new record or edits an existing record based on the
  parameter-field mapping defined in the script.

         Tip

        For information about how to use and test this method, see How to use the new CTI
        method and How to test the new CTI method.


1.1.9.1.2. How to use the new CTI method

The new CTI implementation requires a system administrator to configure the CTI application
to call a system event before each client system can take telephony calls.
The new CTI method also requires users to append ?telephonyuser=1 to the web tier client
URL. When users access the telephony URL from a browser that supports Java applet
technology, JVM is started to check the Java version installed on the client system. This
checking is not needed for the new CTI method, which doesn't use the CTI applet. To skip this
unnecessary checking, a system administrator must disable the legacy CTI method when using
the new method.
Each client system doesn't require any configurations except that a browser setting must be
enabled when Firefox is used as the browser.
The following describes the detailed steps for a system administrator and client users.

Disable the legacy CTI method

Perform the following steps:

   1. In the Service Manager web tier's webtier.properties file, set the enableLegacyTelephony
     parameter to false:

          enableLegacyTelephony=false

                   Note

                If this parameter is not specified, the default value (true) is used.

   2. Restart the web tier application server.

(Optional) Edit or create system events

The new CTI implementation uses system events to create or edit records in Service Manager.
Optionally, a system administrator can edit the out-of-box system events or create new ones to
better suit your needs. For information about the out-of-box events, see How the new CTI
method works.
You can edit the parameters in an out-of-box system event by updating the same-name script.
To do this, follow these steps:

   1. Enter scripts in the Service Manager command line, and then press Enter.
   2. In the Script Name field, enter the script name (for example, ReceiveInteraction), and

     then click Search.


   3. Click the Pre RAD Statements tab, and then update the parameters and map them to
     specific fields in the incidents or probsummary dbdict as appropriate.

You can also add new system events. To do this, follow these steps:

   1. Enter db in the Service Manager command line, and press Enter. The Database Manager
     opens.

   2. In the Table field, enter SystemEvents.
   3. Click Search.
   4. Select an existing record, update the name, and then click Add.
   5. Save the new system event.
   6. Enter scripts in the Service Manager command line, and then press Enter.
   7. In the Script Name field, enter the name of the system event that you created, and then

     click Add.
   8. On the Pre RAD Statements tab, define your parameters and map them to appropriate

     fields in the corresponding dbdict.
   9. Save the script.

Next, you need to configure the CTI application to call a function that triggers a desired system
event.

Configure the CTI application

A system administrator can perform the following tasks to configure the CTI application.

Configure the CTI application to create or edit a record

To create or edit a record (for example, create a new interaction) with the new method, a
system administrator must configure the CTI application by adding the following functions to
the telephony call VBA script:


Public Sub SendSystemEvent(params, browser)
baseUrl = "http://smwebtierhost:8080/sm/telephony.html?SystemEvent="
url = baseUrl & params
url = CreateObject("htmlfile").parentWindow.encodeURI(url)
If browser = "chrome" Then
OpenChrome (url)
Else
If browser = "firefox" Then
OpenFirefox (url)
Else
If browser = "edge" Then
OpenEdge (url)
Else
OpenIE (url)
End If
End If
End If
'MsgBox "Creates an Interaction"
Exit Sub
error_handler:
Debug.Print Err.Description
End Sub
Public Function OpenIE(url)
Set IE = CreateObject("InternetExplorer.Application")
IE.Visible = True
IE.Navigate (url)
End Function
Public Function OpenChrome(url)
Shell ("C:\Program Files\Google\Chrome\Application\chrome.exe" & " " &
url)
End Function
Public Function OpenFirefox(url)
Shell ("C:\Program Files\Mozilla Firefox\firefox.exe" & " " & url)
End Function
Public Function OpenEdge(url)
Set wshShell = CreateObject("WScript.Shell")
wshShell.Run Chr(34) & "C:\Windows\System32\cmd.exe" & Chr(34) & " /c
start microsoft-edge:" & url, 0
End Function
Sub ReceiveInteraction()
params = """ReceiveInteraction"",""Caller Name"",""AGENT,
SERVICEDESK"",""Category Type"",""incident"""


  Call SendSystemEvent(params, "edge")
  End Sub

Where you need to configure the following parameter values:
     Update the baseUrl parameter to http://<your web tier host>:<port>/<web tier name>.
     Example: http://smwebtierhost:8080/webtier-9.80
     At the end of the script above, ReceiveInteraction represents the out-of-box system
     event with the same name. You can replace this part with another system event and its
     parameters. For example, you can replace it with any of the following out-of-box system
     events:

          Sub ReceiveInteractionList()
          params = """ReceiveInteractionList"",""Caller Name"",""CAFFREY,
          AARON"",""Open Value"",""Assign"""
          Call SendSystemEvent(params, "chrome")
          End Sub
          Sub ReceiveInteractionStreamlined()
          params = """ReceiveInteractionStreamlined"",""Caller
          Name"",""CAFFREY, AARON"",""Category Type"",""incident"""
          Call SendSystemEvent(params, "chrome")
          End Sub
          Sub EditInteraction()
          params = """EditInteraction"",""Number"",""SD10002"""
          Call SendSystemEvent(params, "chrome")
          End Sub
          Sub ReceiveIncident()
          params = """ReceiveIncident"",""Caller Name"",""CAFFREY, AARON"""
          Call SendSystemEvent(params, "chrome")
          End Sub
          Sub EditIncident()
          params = """EditIncident"",""Number"",""IM10002"""
          Call SendSystemEvent(params, "chrome")
          End Sub

     In addition to the parameters defined in the system event script, you also need to specify
     a browser to send the system event: specify "chrome" for Chrome, "firefox" for Firefox, or
     "edge" for Edge.
     For Chrome, Firefox, or Edge, you need to update the browser installation path to your
     own in the OpenChrome(url) function, the OpenFirefox(url) function, or the
     OpenEdge(url) function, repectively.


                   Note

                This configuration requires that all telephony web clients use the same
                browser and the same browser installation path. If this is not the case, you
                need to configure the CTI application to allow each user to specify their
                specific browser and browser installation path.

Configure the CTI application to execute a transaction

The new CTI method also enables the CTI application to execute the Transact capability, which
performs the action of a toolbar button or More menu option on a record detail form, such as
an Interaction or Incident record detail form.
To do this, call the following sub function:

  Sub ButtonTransferCallFromCTI()
  params = """Transact"",""3"""
  Call SendSystemEvent(params, "chrome")
  End Sub

Where:
     The Transact parameter value ("3" in the example above) represents the option ID of a
     button or menu option. You need to replace it with the option ID of your desired toolbar
     button or More menu option. For example, on the Interaction form, the Back button has an
     option ID of "3".

                   Note

                This function is supported for all modules, not only the Interaction module.
                Additionally, multi-level menu options are supported.

     The parameter value of "chrome" represents the browser that the web client is using.
     Change it to "firefox" if Firefox is used.

How to determine the option ID of a button or menu option

Each option ID is defined either in the corresponding Display Screen record or in the
corresponding Process Designer workflow (the Actions tab). The following are two examples.
The following figure shows that the option ID of the Back button is defined in the sd.new
Display Screen record.


The following figure shows that the option ID of the Escalate button is defined in the
ServiceDesk workflow.


Configure the client system when using Firefox

The new CTI implementation doesn't require any configurations on each web client system.
The user is only required to log in to the web tier client with ?telephonyuser=1 appended to
the web tier client URL.

However, when using Firefox, when the client system takes a telephony call, a blank page
opens and remains open. This could be annoying when the client system takes multiple calls.
To avoid this from happening, enable the dom.allow_scripts_to_close_windows setting in
Firefox. To do this, follow these steps:

   1. In the Firefox address bar, type about:config.
   2. Change the dom.allow_scripts_to_close_windows setting from false to true.

When this setting is true, the blank page is closed immediately after it opens.


Note

You can test the new CTI method using Microsoft Word and a web browser. For
details, see How to test the new CTI method.


1.1.9.1.3. How to test the new CTI method

The following are example steps to test the new CTI method using Microsoft Word and
Chrome. In this example, a new interaction will be created and the action of the Back button on
the interaction detail page is executed.

            Tip

           To learn more about the new CTI method, see How the new CTI method works and
           How to use the new CTI method.

   1. Open your web tier telephony URL in Chrome. For example:

          http://smwebtierhost:8080/webtier-9.70/index.do?telephonyuser=1

   2. Sign in to the web tier client.
   3. Open Microsoft Word on your system.
   4. Open the macro editor from Word. For example, press ALT + F11 to open it.
   5. Copy and paste the script above to the editor and update the parameters. For details, see

     Configure the CTI application.
   6. In the macro editor, place your cursor in the ReceiveInteraction sub function area, and

     click Run > Run Sub/UserForm.

   7. An interaction is automatically created.  Page 621 of 1727

This PDF was generated on May 23, 2026

8. Call Service Manager with a System Event type (ButtonTransferCallFromCTI) to execute a
  Back action. To do this, follow these steps:
     1. Add the following sub function to the VBA script in Word:

             Sub ButtonTransferCallFromCTI()
             params = """Transact"",""3"""
             Call SendSystemEvent(params, "chrome")
             End Sub

        The following figure shows that the ButtonTransferCallFromCTI sub function is
        added.


2. Run the ButtonTransferCallFromCTI sub function.
3. A confirmation dialog opens, asking if you want to leave the interaction without

  creating it. This is the same dialog that would appear if you click the Back button in
  a new Interaction record.


1.1.9.2. Use URI

In addition to the HTTP and FTP protocols, Service Manager web client supports the tel and
sip URI (Uniform Resource Identifier) protocols to initiate telephone calls or dialogues. This
method doesn't rely on the browser's ability to support Java applet technology. To use this
method, the following requirements must be met:

     Install a telephony client (such as Microsoft Lync) on your computer to handle and
     manage the calls or dialogues.
     Configure RAD expressions in the Service Manager system to trigger telephone calls or
     dialogues.

Example: How to use the tel URI protocol

The following are example steps to use the tel URI protocol with Microsoft Lync. In this
example, you will add a new button to the contacts.g form, associate this button with the
updated display option definitions, and then test how the tel URI protocol works.

   1. Click Tailoring > Database Manager.

   2. Type contacts in the Form field, and then press Enter. Service Manager displays a list of
     forms matching your search criteria.

   3. Double-click contacts to open the contacts.g form.

   4. Click Search. Service Manager displays a list of all contact records.

     Take AARON, JIM as an example. Click the Contact Numbers tab to verify that the Work
     field has a valid phone number. This value will be used in the later steps.

   5. Click Tailoring > Form Designer.
   6. Type contacts.g in the Form field, and then click Search. Service Manager opens the

     Contact Information form.

   7. Click Design, and then add a button with the following sample properties:

Caption                                 Value
Visible                                 True
Caption                                 Tel
Button ID                               1111
Enabled                                 True

8. Click OK, and then click OK again on the Contact Information form.


 9. Click Tailoring > Tailoring Tools > Display Options.
10. Type contacts.view in the Screen ID field, and then click Search. Service Manager

    displays a list of display option definitions matching your search criteria.

11. Locate an option, and then enter the following information:

          General information:

Field                                       Sample value
Unique ID
Action                                      contacts.view_tel
GUI option
                                            don'thing

                                            1111

                                                        Note

                                                       You must enter the button
                                                       ID you have assigned to
                                                      the new button in step 7.

Default Label                               Tel

Condition                                   true

Click the Pre Rad Expressions tab, and then add the
$L.url="tel:%22+contact.phone in $L.file expression.

Click the Rad tab, and then enter the following information:

Field                                       Value
RAD Applications                            us.launch.external
Separate Thread?                            true
Values                                      $L.url

See the following screenshots as examples:


 12. Click Add and OK.
 13. Continue to follow step 1 to step 4 and locate the AARON, JIM contact record. Now you

     can click the Tel button to launch a Skype call with AARON, JIM using the tel URI
     protocol.

Example: How to use the sip URI protocol

The following are example steps to use the sip URI protocol with Microsoft Lync. In this
example, you will add a new button to the contacts.g form, associate this button with the
updated display option definitions, and then test how the sip URI protocol works.

   1. Click Tailoring > Database Manager.

   2. Type contacts in the Form field, and then press Enter. Service Manager displays a list of
     forms matching your search criteria.

   3. Double-click contacts to open the contacts.g form.

   4. Click Search. Service Manager displays a list of all contact records.

     Take AARON, JIM as an example. Click the Business tab to verify that the Email field
     has a valid email address. This value will be used in the later steps.

   5. Click Tailoring > Form Designer.
   6. Type contacts.g in the Form field, and then click Search. Service Manager opens the

     Contact Information form.

   7. Click Design, and then add a button with the following sample properties:

Caption                                 Value
Visible                                 True
Caption                                 Tel
Button ID                               1112
Enabled                                 True


 8. Click OK, and then click OK again on the Contact Information form.

 9. Click Tailoring > Tailoring Tools > Display Options.
10. Type contacts.view in the Screen ID field, and then click Search. Service Manager

    displays a list of display option definitions matching your search criteria.

11. Locate an option, and then enter the following information:

          General information:

Field                                       Sample value
Unique ID
Action                                      contacts.view_sip
GUI option
                                            don'thing

                                            1112

                                                        Note

                                                       You must enter the button
                                                       ID you have assigned to
                                                      the new button in step 7.

Default Label                               Tel

Condition                                   true

Click the Pre Rad Expressions tab, and then add the $L.url="sip:%22+email in
$L.file expression.

Click the Rad tab, and then enter the following information:

Field                                       Value
RAD Applications                            us.launch.external
Separate Thread?                            true
Values                                      $L.url

See the following screenshots as examples:


12. Click Add and OK.
13. Continue to follow step 1 to step 4 and locate the AARON, JIM contact record. Now you

    can click the Sip button to launch a Skype dialogue with AARON, JIM using the sip URI
    protocol.


1.1.10. Integrations and extacess records

Integrations call existing processes from the processes they define instead of modifying an
existing process.

In the situation where you need to define extaccess records that call display actions in the
record’s State there is a good chance that the process will need additional logic to properly
function. The best practice for dealing with this situation is to create and call a new process
rather than modifying an existing process with integration-specific logic.

For example, an integration wants to perform display action x, which calls Process (p), but
needs to put integration specific logic into Process (p) in order to make it perform correctly.
The best practice in this case is to:

     Create a new process record which performs the integration specific logic.
     Call the original Process (p) in the “Next Process” tab.
     Add a new action to the State record.
     Call that action from the extaccess record.

This will make the integration easier to maintain and debug.

When you add a new display action to the State record, the $L.action variable will most likely
have to be updated. Usually the integration specific process record will need to update
$L.action to match the display action being wrapped.

For example, an integration wants to call the “save” display action. A new process record called
“integration.record.save” is created, which finishes by calling “record.save” in the next process
tab. A new display action called “integration.save” is added to the State record and the
extaccess record calls that in its Allowed Actions tab. The “integration.record.save” process
record ensures that the $L.action variable is set to “save.”

In some cases, other local variables may need to be set as well. Incident Management, for
example, has a $L.mode variable that needs to be managed. Be sure to check both the existing
State and Process record when developing a new process for references to variables that may
need to be managed.

Related topics

Integrations
Display functions
Document Engine


1.2. Change Configuration and Release
Management (CCRM)

Service Manager is part of the Change Configuration and Release Management (CCRM)
solution. CCRM enables enterprise IT organizations to do the following:

     Provide the structure and formal workflow necessary to implement changes
     Reduce the risk of making changes by providing an accurate picture of IT infrastructure,
     as well as the impact that any change may have on IT services
     Enable early detection of unplanned changes
     Maintain an accurate record of IT infrastructure

To minimize incidents that result from unplanned or improperly planned changes to the
organization, an IT organization must be able to respond in the following ways to change
drivers:

     Proactively: to provide benefits to the organization, either through lower total cost of
     ownership (TCO), or by providing options that enable business to develop
     Reactively: to resolve errors that impact the level of services that are provided

CCRM offers a solution comprised of three integrated OpenText products:

     Service Manager: automates and standardizes the change process in accordance with
     ITIL best practices—from request through release and review.
     Release Control: plays a role at a specific point in the process as a decision-support tool;
     it includes risk analysis, impact assessment, collision detection, and forward schedule of
     changes.
     Universal CMDB: consists of a rich business-service-oriented data model with the built-in
     discovery of configuration items (CIs) and configuration item dependencies, visualization
     and mapping of business services, and tracking of configuration changes.

CCRM also offers an automation extension to automate change requests (through Operations
Orchestration (OO)) and another extension to provide dashboard views of assigned request
status as well as comparisons between current projects and staffing profiles (through PPM
Center).

For more information about CCRM, see the CCRM documentation available with the Service
Manager documentation from software support.
````
