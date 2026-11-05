---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.5 .. 1.1.5
printed_pages: 391-407
---

# 1.1.5 Dynamic Data Exchange (DDE)

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.5. Dynamic Data Exchange (DDE)

Create DDE client support in a Service Manager RAD (Rapid Application Development)
application.

DDE support in Service Manager works two ways: create a DDE script to call against Service
Manager from a Windows application or create a script using the DDE script panel to make a
DDE call within Service Manager. The difference is which application originates the call. For
example, a Service Manager client in a Windows environment can push information to
Microsoft® Excel or Excel can pull from Service Manager.

            Note

           Prior to version 9.30, Service Manager used client-side DDE to export data to
           Excel. As of version 9.30, the Export to Excel functionality has been redesigned so
           that the Service Manager server process exports the data as a CSV (comma
           separated file) on the server side and transports the file to the client side. The
           Service Manager client saves the file on the client system and launches Microsoft
           Excel to display the content of the file. With this redesigned functionality, the
           Service Manager server and client performance are both improved by using file
           exchange and eliminating XML exchange for exported data.

Service Manager DDE server support provides an interface to applications outside Service
Manager, allowing the use of DDE functions like poke and execute.

Related topics

DDE server
Usage notes
Executes


1.1.5.1. Architecture

In the case of Service Manager Telephony (standard system), the following occurs when a
phone call comes in to the Windows client (Web Client):

     RTE (Java telephony applet) generates a ReceiveInteraction event

                   Note

                In the Web client, the Java telephony applet prompts the user to save before
                receiving the call.

     RTE (Java telephony applet) passes the event to the System Event Handler (SEH)
     SEH starts the us.router RAD application in a new RAD thread

When you make a phone call, the RAD application sends a MakeCall event to the SEH, which
invokes an RTE function (Java telephony applet).
While system events are normally communicated between the application layer and the RTE
(Java telephony applet), they can also pass events between RAD applications and between
RTE (Java telephony applet) functions.
To send a system event from RAD, use the event.send RAD Command panel. You must use -2
as the Thread ID. Fill in the Event Name with the name of the event and pass any parameters in
the Names and Values arrays. Since each event is arbitrary, so are the parameters it requires.
When receiving a system event in a RAD application, use the event.name() and event.value()
functions to get the event name and parameters for that event.

Related topics

Dynamic Data Exchange (DDE)


1.1.5.2. DDE client

There are six different actions associated with a DDE client conversation that initiate from a
DDE RAD panel. The actions are the standard DDE actions:

     Initiate
     Advise
     Request
     Poke
     Execute
     Terminate

            Note

           Constructing a DDE RAD application requires you follow RAD conventions. For a
           complete description of programming in RAD, along with requirements for any RAD
           application to function, refer to the System Language help in the Tailoring module.

Related topics

Dynamic Data Exchange (DDE)


1.1.5.2.1. DDE RAD panel

The DDE RAD panel performs DDE commands. The RAD start panel sets variables referenced
on this panel and later in the RAD application.

Related topics

Dynamic Data Exchange (DDE)


1.1.5.2.2. FrameRestore option

The FrameRestore option directs Service Manager to take the focus when a DDE advise hot
link updates. For example, if the FrameRestore parameter is added to an advise DDE RAD
panel, a software telephone being used by an agent to receive a call takes the focus. This
allows the agent to answer the call without searching for the soft phone application.
To activate the FrameRestore option in RAD, enter FrameRestore as the fifth input value
parameter in the appropriate DDE advise panel.

Related topics

Dynamic Data Exchange (DDE)


1.1.5.2.3. PassFocus option

The PassFocus option directs Service Manager to pass the focus when a DDE terminate
command issues. For example, if the PassFocus parameter is added to a terminate DDE RAD
panel, the focus stays on the receiving application and focus doesn't return to Service
Manager. Without the Passfocus command, Service Manager gains the focus.
To activate the PassFocus option in RAD, type PassFocus as the second argument of a DDE
terminate panel.

Related topics

Dynamic Data Exchange (DDE)


1.1.5.2.4. Process panel

A process panel is a type of RAD panel that initializes or sets variables used later in your RAD
application. Process panels also process expressions.

Related topics

Dynamic Data Exchange (DDE)


1.1.5.2.5. Structure support option

The structure support option allows a DDE advise action to use a user-defined data format. For
example, DF,129, UL, I, SZ33. All values are comma delimited.

Sample values:

Value                                   Description
DF                                      Identifies the string as a data format
129                                     Integer value for the clipboard data format
                                        value required for the advise action.
UL                                      Unsigned long integers
I                                       Integers
SZ33                                    Null terminated string 33 characters long

Related topics

Dynamic Data Exchange (DDE)


1.1.5.2.6. Usage notes

To use the DDE Server functionality, the Service Manager Windows client must be started and
a user should be logged in. DDE doesn't automatically start the server (as OLE does). The user
must be logged in so that the environment is set up for the Service Manager user.
The DDE server can also handle DDE client transactions that perform:

     Requests: Get the value of a named item and return it as a string
     Pokes: Set the value of a named item
     Executes: Ask the GUI to execute a transaction or set the focus to a named item

Use this functionality to script user interaction for common operations such as closing a
record, which may require several fields to be filled in and several transactions to be made.

            Note

           This functionality works for the Windows client only. It doesn't work for the web
           client.

Related topics

Dynamic Data Exchange (DDE)


1.1.5.3. DDE server

Integration with external Windows applications is achieved using the DDE server functionality
of the Service Manager Windows client.

Applications that implement the Microsoft Windows DDE server permit external applications to
get and set data, as well as execute commands. Typical use of get and set is to inspect and
change data that's part of a document. For example, Excel allows the contents of spreadsheet
cells to be read and written. Use the DDE execute facility to issue commands such as File >
Save. There is little standardization between DDE server applications either in capabilities
offered or the formatting of the commands sent over the DDE link.

DDE clients contact DDE servers using an application and topic name. The application name
must be unique on the machine and the topic is typically the name of a document or the
“Actions” topic.

Implementation - system events

System events permit Service Manager to react to events on client platforms external to the
Service Manager system. System events are an arbitrary set of events that are sent to and
from either RAD or the RTE. They are used to start new RAD applications.

DDE server implementation provides the DDE execute facility. Service Manager’s DDE service
name is "HP_Service_Manager" and the topic name is "Actions". The DDE execute facility
initiates Service Manager system events.

For example, the CTI implementation creates a system event to start a RAD application when
the phone rings to handle the call. RAD programs written to extract the system event
parameters and act upon them handle system events. With the DDE server functionality, an
external application such as Excel, Access, or Delphi, connects to Service Manager using
application Service Manager and topic Actions to trigger system events.

Related topics

Dynamic Data Exchange (DDE)


1.1.5.3.1. Executes

Executes are the DDE mechanisms for requesting that an application process data or perform
an action. Service Manager provides the Transact execute capability.

Transact

The Transact execute function directs Service Manager to execute a transaction as though a
user had pressed a function key or button. The Transact execute function requires one
operand that designates the number of the function key or button ID of the button that was
pressed. This example in Visual Basic for Applications shows how to tell Service Manager that
the “fill” key was pressed:

  DDEExecute nChannel, “[Transact( ““9”” )]” ’issue a fill command

Related topics

Dynamic Data Exchange (DDE)


1.1.5.3.2. SystemEvents file

You define system events in the SystemEvents file. This file contains records that have an
Event Name and a RAD Application name. When the system receives an event, the
corresponding RAD application invokes a new RAD thread. The SystemEvents file contains all
the events that invoke a RAD application. The events used to invoke a RTE function register
themselves upon start-up of the client. If you edit a system event record, you must re-login
before the system recognizes the changes.

            Note

           You can have multiple records for one event; each application invokes a separate
           RAD thread.

Related topics

Dynamic Data Exchange (DDE)


1.1.5.3.3. Requests and pokes

Requests and Pokes are Dynamic Data Exchange (DDE) mechanisms for obtaining a copy of or
setting the value of named items. Service Manager uses the widget's input property to name
the item. For example, to set the user name on the Service Manager login screen, use the
following DDE command (this example is in Visual Basic for Applications): DDEPoke nChannel,
"$user.id", "falcon"
Requests and pokes take and return data of string type.

Related topics

Dynamic Data Exchange (DDE)


1.1.5.3.4. DDE example

This example uses Visual Basic for Applications.

            Note

           Note: The Service Manager server must be running in order for the following
           example to work.

The format of the Service Manager execute command string for system events is:
SystemEvent( event name, parameter name, parameter value, ...)
Where event name corresponds to the event name in the Service Manager SystemEvents table
and parameter name / value pairs are known to the RAD program.

  Sub ReceiveInteraction()
                 channel = DDEInitiate("Service Manager", "Actions")
                 DDEExecute channel, "[SystemEvent(""ReceiveInteraction"",

  ""Caller Name"", ""KENTNER"" )]"
                 DDETerminate channel
                 End Sub

The example above:
     Initiates a conversation with the Service Manager system.
     Executes a DDE command starting the system event ReceiveInteraction, passing the
     parameter name Caller Name with the parameter value of Kentner.
     Terminates the conversation.

Related topics

Dynamic Data Exchange (DDE)


1.1.5.3.5. Access the script panel

Applies to User roles: System Administrator
The DDE script panel, dde.script.g, assists in creating Service Manager DDE scripts for DDE
calls inside Service Manager against an outside application such as Excel.
To access the DDE script panel, click Tailoring > Tailoring Tools > DDE Script.

Related topics

Dynamic Data Exchange (DDE)


1.1.5.3.6. Access system events records

Applies to User roles: System Administrator
To access system events records:

   1. Type db in the command line, and click the Execute Command button. The Database
     Manager dialog box opens.

   2. Type SystemEvents in the Form field.
   3. Click Search. A blank system events record opens.
   4. Type the name of the record you want to view, or click Search to display a record list of

     all events in the system.

Related topics

Dynamic Data Exchange (DDE)
````
