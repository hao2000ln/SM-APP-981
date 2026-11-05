---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.1.12 .. 1.1.12
printed_pages: 174-198
---

# 1.1.12 Startup and shutdown

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.12. Startup and shutdown

There are several methods you can use to start and stop the Service Manager server
and associated background processes depending upon the operating system on
which your system runs. See the topics associated with your Service Manager
server's operating system for more information.

Related topics

Starting Service Manager on Linux
Starting Service Manager on Windows
Stopping Service Manager on Linux
Stopping Service Manager on Windows


1.1.12.1. Starting Service Manager on Linux

You must start the Service Manager server before users can connect with client
sessions. You can also manually start the Service Manager server from the following
interface:

     Linux command line

Related topics

Start the server from the Linux command line
Stop the server from the Linux command line


1.1.12.1.1. Start the server from the Linux
command line

Applies to User roles: System Administrator
You must start the Service Manager server before users can connect with client
sessions. You must have administrative access to the server operating system to use
this procedure.
To start the server from the Linux command line:

   1. Change directories to your Service Manager Run directory. For example:

          cd /MicroFocus/Service Manager x.xx/Run

   2. Type the following command:

          smstart

   3. Press ENTER.

Related topics

Stop the server from the Linux command line


1.1.12.2. Starting Service Manager on
Windows

You must start the Service Manager server before users can connect with client
sessions. By default, the Service Manager server runs as an automatically starting
service on Windows. The Service Manager server will start every time that you restart
your server. You can also manually start the Service Manager server from the
following interfaces:

     Windows services
     Windows command prompt

Related topics

Start the server from the Windows command prompt
Start the server from Windows services
Stop the server from the Windows command prompt
Stop the server from Windows services


1.1.12.2.1. Configure the Service Manager
service to run as a Windows user

Applies to User Roles: System Administrator

You must have administrative access to the server operating system to use this
procedure.

To configure the Service Manager service to run as a Windows user:

   1. Open the Services applet by doing either of the following:
           Click Start > Programs > Administrative Tools > Services
           Click Start > Settings > Control Panel > Administrative Tools > Services

   2. In the services list, click Service Manager.
   3. Click the Stop service button or click Action > Stop to stop the service.
   4. Edit the service properties by doing either of the following:

           Click the Properties button.
           Click Action > Properties
   5. Click the Log On tab.
   6. In the Log on as: This Account field, click Browse. Windows displays a list of
     local domains and user accounts.
   7. Select the domain and user account you want to use to run Service Manager.
   8. Click OK.
   9. Type the user account password and password confirmation.
 10. Click OK.
 11. Start the service by doing either of the following:
           Click the Start service button
           Click Action > Start

Related topics

Start the server from Windows services


1.1.12.2.2. Start a Service Manager client
listener

Applies to user roles: System Administrator
You can start one or more client listeners to manage your system's Web and Windows
client connection requests. The number of client listeners you need to start depends
upon the type of servlet implementation you are running.

            Note

           The client listener can't accept connection requests from legacy
           integration products such as ServiceCenter Automation (SCAuto). For
           these SCAuto connections, you must start an SCAuto listener
           (scautolistener).

You must have administrative access to the server operating system to use this
procedure.
To start a Service Manager client listener:

   1. Stop the Service Manager server.
   2. Open the Windows command prompt.
   3. Change directories to the RUN folder of your Service Manager installation. For

     example:

          cd C:\Program Files\OpenText\Service Manager\server\RUN

   4. Type one of the following commands:


Servlet implementation option           Command line parameters or
Single servlet implementation           configuration file entries

Horizontal or vertical scaling            sm -httpPort:13081
implementations                           httpsPort:13082

                                          sm -httpPort:13080 -
                                          loadbalancer
                                          sm -httpPort:13081 -
                                          httpsPort:13082

     Each client listener listens to client connection requests on a separate
     communications port. You can specify your own communications port for the
     example port in the table.

Related topics

Servlet implementation options
Startup and shutdown
Start the server from the Linux command line
Start the server from the Windows command prompt
Startup parameter: scautolistener


1.1.12.2.3. Start the server from the
Windows command prompt

Applies to User roles: System Administrator
You must have administrative access to the server operating system to use this
procedure.
To start the server from the Windows command prompt:

   1. Open the Windows command prompt.
     Click Start > Programs > Accessories > Command Prompt.

   2. Change directories to the RUN folder of your Service Manager installation. For
     example:

          cd C:\Program Files\OpenText\Service Manager x.xx\Server\RUN

   3. Type the following command:

          sm -httpPort:13080 -httpsPort:13081

     Tip: You can omit the httpPort and httpsPort parameters if you have specified
     them in the Service Manager initialization file ( sm.ini ).
   4. Press Enter.
     Caution: You must leave the command prompt window open while the Service
     Manager server runs. Closing the command prompt window stops Service
     Manager immediately without cleaning up any processes or releasing any record
     locks.

Related topics

Start the server from Windows services
Stop the server from the Windows command prompt
Stop the server from Windows services


1.1.12.2.4. Start the server from Windows
services

Applies to User Roles: System Administrator

You can to use this procedure to run the Service Manager Server service as an
administrator user. If you need to run the Service Manager Server service as a non-
administrator user, follow the steps in Run the Service Manager Server using
Windows Service.

To start the server from Windows services:

   1. Open the Services applet.
           Click Start > Programs > Administrative Tools > Services
           –or–
           Click Start > Settings > Control Panel > Administrative Tools > Services

   2. In the services list, click Service Manager.
   3. Start the service.

           Click the Start Service link
           –or–
           Click Action > Start
     Windows displays a message that the Service Manager service is starting. After
     several seconds, the service starts and displays Started in the Status field. If the
     Service Manager service doesn't start, contact customer support with any error
     messages.

Related topics

Start the server from the Windows command prompt
Stop the server from the Windows command prompt
Stop the server from Windows services


1.1.12.3. Stopping Service Manager on
Linux

Stopping the Service Manager server immediately disconnects all client sessions and
ends all currently running Service Manager processes. By default, the Service
Manager server runs continuously and has no scheduled shutdown times.

There are two methods for stopping Service Manager:

     Server shutdown with a warning message — allows the administrator to
     broadcast a warning message before stopping the server
     Server stop from outside a client — allows the administrator to stop the server
     without first connecting to the server through a client

Server shutdown with a warning message

When Service Manager is running on a Linux server, you can issue a shutdown
warning from the following interfaces:

     From a Service Manager client when you are logged in as a user with system
     administrator capabilities.
     From the Linux command line when you use the smstop script

Either shutdown option allows you to broadcast a warning message to currently
connected users letting them know that you are planning to shut the server down.
However, only the shutdown option from the client also allows you to specify in
advance when you want to shut a server down.

There are three types of shutdown available to administrators from the client:

     Immediate — stops the server as soon as the administrator confirms the
     shutdown request. The server issues no warning messages before stopping.
     Delayed — stops the server after a delay specified by the administrator. The
     server issues a warning message every minute during the warning interval. The
     warning interval determines how many minutes before stopping the server that
     the server starts issuing warning messages.
     Scheduled — stops the server at a specified date and time. The server issues a
     warning message every minute during the warning interval. The warning interval
     determines how many minutes before stopping the server that the server starts
     issuing warning messages.


The shutdown option from the Linux command line doesn't allow you to delay or
schedule a server shutdown.

Server stop from outside a client

You must have administrative access to the server operating system to stop the
Service Manager server outside of a client. If you want to issue a warning message
before stopping the server, you must use the smstop script. Unless you know that
there are no active client connections, it is generally preferable to shutdown a server
with a warning message rather than stop it.

You can stop a Service Manager server running on Linux from the following interface
without using a client connection:

     Linux command line

Related topics

Start the server from the Linux command line
Stop the server from the UNIX command line


1.1.12.3.1. Stop the server from the Linux
command line

Applies to User roles: System Administrator
You must have administrative access to the server operating system to use this
procedure.
To stop the server from the Linux command line:

            Note

           This procedure stops the server without displaying any warnings to
           currently connected users. If you want to broadcast a warning message
           before stopping the server, use one of the shutdown options available
           from the Service Manager clients.

   1. Change directories to your Service Manager Run directory. For example:

          cd /MicroFocus/Service Manager x.xx/Run

   2. Type one of the following commands:

       Command                                                                            Service Manager 9.81
       sm
       -shutdown                        Description
       sm
       -shutdown                        Immediately stops the Service
       -group                           Manager server and all related
       smstop                           processes.

This PDF was generated on May 23, 2026  Used in a horizontally-scaled
                                        environment. Immediately stops the
                                        Service Manager server and all
                                        related processes, including Service
                                        Manager processes on remote hosts
                                        in the same group.

                                        The script attempts to do a normal
                                        shutdown of the Service Manager
                                        system and, if successful, stops any
                                        remaining Service Manager
                                        processes and cleans up IPC
                                        resources.

                                        Note: The scdb.system record in
                                        the info table acts as a Service
                                        Manager database lock, preventing
                                        multiple Service Manager groups
                                        from connecting to the same
                                        database. This record will only be
                                        removed during normal shutdown
                                        and when there are no more Service
                                        Manager processes connecting to
                                        that database. In a vertically-scaled
                                        environment, normal shutdown
                                        during sm -shutdown , smstop , or
                                        smstop -f removes this record. In a
                                        horizontally-scaled environment,
                                        only a normal shutdown ( sm -
                                        shutdown -group ) shuts down the
                                        whole group.

                                                                                                                 Page 186 of 217
Command                                                                                   Service Manager 9.81
smstop -d
                                        Description
smstop -f
                                        The script runs the shutdown script
                                        in debug mode. The system
                                        produces verbose output messages
                                        in debug mode.

                                        The script forces a shutdown of the
                                        Service Manager system if the
                                        normal shutdown process fails. By
                                        default, the script will wait for up to
                                        ten minutes for the normal shutdown
                                        process to complete. To change the
                                        wait time, you can set the
                                        SMSTOP_WAIT environment variable
                                        with the number of seconds you
                                        want the script to wait for the
                                        completion of the normal shutdown
                                        process (the default value is 600
                                        seconds). For example, to change
                                        the wait time to 15 minutes, you can
                                        use the following command:

                                          SMSTOP_WAIT=900 smstop -f


Command                                       Description
smstop -F
                                              The script immediately forces a
                                              shutdown of the Service Manager
                                              system, bypassing the normal
                                              shutdown process.

                                              Caution: Forcing a system shutdown
                                              can result in file corruption if there is
                                              file regeneration in progress at the
                                              time of the shutdown. We
                                              recommend using the Service
                                              Manager status and system.monitor
                                              functions to determine if there are
                                              any active processes running prior
                                              to forcing a system shutdown.

smstop -h                                     Displays help information for the
smstop -q                                     smstop script.

                                              Runs the shutdown script in quiet
                                              mode. The system doesn't produce
                                              output messages in quiet mode.

   3. Press ENTER.

Related topics

Start the server from the Linux command line


1.1.12.4. Stopping Service Manager on
Windows

Stopping the Service Manager server immediately disconnects all client sessions and
ends all currently running Service Manager processes. By default, the Service
Manager server runs continuously and has no scheduled shutdown times.

There are two methods for stopping Service Manager:

     Server shutdown with a warning message — allows the administrator to
     broadcast a warning message before stopping the server
     Server stop from outside a client — allows the administrator to stop the server
     without first connecting to the server through a client

Server shutdown with a warning message

When Service Manager is running on a Windows server, you can only issue a
shutdown warning from a Service Manager client, and then only if you are logged in
as a user with system administrator capabilities. The shutdown option allows you to
broadcast a warning message to currently connected users letting them know that
you are planning to shut the server down. The shutdown option also allows you to
specify in advance when you want to shut a server down.

There are three types of shutdown available to administrators:

     Immediate — stops the server as soon as the administrator confirms the
     shutdown request. The server issues no warning messages before stopping.
     Delayed — stops the server after a delay specified by the administrator. The
     server issues a warning message every minute during the warning interval. The
     warning interval determines how many minutes before stopping the server that
     the server starts issuing warning messages.
     Scheduled — stops the server at a specified date and time. The server issues a
     warning message every minute during the warning interval. The warning interval
     determines how many minutes before stopping the server that the server starts
     issuing warning messages.

Server stop from outside a client

You must have administrative access to the server operating system to stop the
Service Manager server outside of a client. When Service Manager is running on a
Windows server, you can't issue a warning message if you stop the server outside of


a client. Unless you know that there are no active client connections, it is generally
preferable to shutdown a server with a warning message rather than stop it.

You can stop a Service Manager server running on Windows from the following
interfaces without using a client connection:

     Windows services
     Windows command prompt

Related topics

Start the server from the Windows command prompt
Start the server from Windows services
Stop the server from the Windows command prompt
Stop the server from Windows services


1.1.12.4.1. Stop the server from the
Windows command prompt

Applies to User roles: System Administrator
You must have administrative access to the server operating system to use this
procedure.
To stop the server from the Windows command prompt:
Warning: This procedure stops the server without displaying any warnings to
currently connected users. If you want to broadcast a warning message before
stopping the server, use one of the shutdown options available from the Service
Manager clients.

   1. Open another Windows command prompt.
     Click Start > Programs > Accessories > Command Prompt.
     Caution: Don't close the command prompt window running Service Manager.
     Closing the command prompt window stops Service Manager immediately
     without cleaning up any processes or releasing any record locks.

   2. Change directories to the RUN folder of your Service Manager installation. For
     example:

          cd C:\Program Files\OpenText\Service Manager x.xx\Server\RUN

   3. Type the following command:

          sm -shutdown:0

   4. Press ENTER.

Related topics

Start the server from the Windows command prompt
Start the server from Windows services
Stop the server from Windows services


1.1.12.4.2. Stop the server from Windows
services

You must have administrative access to the server operating system to use this
procedure.

Note: This procedure stops the server without displaying any warnings to currently
connected users. If you want to broadcast a warning message before stopping the
server, use one of the shutdown options available from the Service Manager clients.

   1. Open the services applet.
           Click Start > Programs > Administrative Tools > Services
           –or–
           Click Start > Settings > Control Panel > Administrative Tools > Services

   2. In the services list, click Service Manager.
   3. Stop the service.

           Click the Stop Service button
           –or–
           Click Action > Stop
     Windows displays a message that the Service Manager service is stopping. After
     several seconds, the service stops and displays a blank entry in the Status field.
     If you see any error messages, contact customer support with the message.

Related topics

Start the server from the Windows command prompt
Start the server from Windows services
Stop the server from the Windows command prompt


1.1.12.5. Server shutdown

A system administrator can shutdown a Service Manager server from any client.
Shutting down a server differs from manually stopping a server in the following ways:

     You can schedule a shutdown in advance
     The server can broadcast warning messages to all connected users before the
     server stops
     The server stops all active processes before shutting down

In a production environment, it is generally preferable to shutdown a server rather
than to stop it to ensure data integrity and to allow users to log off.

            Note

           When the Service Manager server is running on Windows system and
           started with Windows service, only SM processes can be stopped
           through Windows client. The process called smservice.exe can only be
           shutted down through Windows service. Such situation doesn't occur on
           Linux system.

Related topics

Startup and shutdown
Do an immediate shutdown of the server
Do a delayed shutdown of the server
Do a scheduled shutdown of the server


1.1.12.5.1. Do an immediate shutdown of
the server

Applies to User Roles: System Administrator

You must have the SysAdmin capability word to use this procedure.

Note: This procedure stops the server without displaying any warnings to currently
connected users. If you want to broadcast a warning message before stopping the
server, use the broadcast form (system.status.broadcast) before you shut down the
server.

To do an immediate shutdown of the server:

   1. Click System Administration > Ongoing Maintenance > System > Shutdown.
     The System Shutdown Confirmation form opens.

   2. Click Shutdown Now.

   3. Click Confirm.
     The Service Manager server stops disconnecting all currently connected clients
     and refusing any further client connections until the server has been restarted.

     Note: Service Manager also disconnects the client you used to shut down the
     server.

Related topics

Server shutdown
Do a delayed shutdown of the server
Do a scheduled shutdown of the server


1.1.12.5.2. Do a delayed shutdown of the
server

Applies to User Roles: System Administrator

You must have the SysAdmin capability word to use this procedure.

To do a delayed shutdown of the server:

   1. Click System Administration > Ongoing Maintenance > System > Shutdown.
     The System Shutdown Confirmation form opens.

   2. Click Advise and Shutdown.
   3. In the text field provided, type the number of seconds you want the system to

     wait before it shuts down.

   4. Click Advise and Shutdown.

     Service Manager broadcasts the following message to all connected users:

     System will SHUTDOWN in <n> seconds; please finish and log off.

     The value <n> is the number of seconds you entered for the delay. After the
     specified number of seconds passes, Service Manager stops disconnecting all
     currently connected clients and refusing any further client connections until the
     server has been restarted.

     Note: Service Manager also disconnects the client you used to shutdown the
     server.

Related topics

Server shutdown
Do a scheduled shutdown of the server
Do an immediate shutdown of the server


1.1.12.5.3. Do a scheduled shutdown of the
server

Applies to User Roles: System Administrator

You must have the SysAdmin capability word to use this procedure.

To do a scheduled shutdown of the server:

   1. Click System Administration > Ongoing Maintenance > System > Schedule
     Shutdown.
     The Automatic Shutdown Information form opens.

   2. Click Search.

     Service Manager displays a list of existing shutdown records.

     Note: Service Manager can only have one active shutdown record at a time. If a
     shutdown record already exists, update the existing record rather than creating a
     new one.

   3. Type or select the following information.
           Shutdown Date — type the date and time you want the server to shutdown
           Auto-Shutdown — select this option if you want the shutdown to be
           automatic
           Reschedule Interval — type or select the number of days you want the
           server to wait for the next scheduled shutdown. If you leave this entry
           blank, then Service Manager uses the default value of one day.
           Shutdown Warning — type or select the number of minutes you want the
           server to issue shutdown warnings, if any

   4. Do one of the following:
           If there is no existing shutdown record, click Add.
           Service Manager displays the following message:
           shutdown record added.
           If there is an existing shutdown record, click Save.
           Service Manager displays the following message:
           shutdown record updated.

   5. From the pull-down options menu, click Update schd.
     Service Manager displays the following message:
     shutdown record updated.
     At the specified date and time, Service Manager stops disconnecting all


     currently connected clients and refusing any further client connections until the
     server has been restarted.

Related topics

Server shutdown
Do a delayed shutdown of the server
Do an immediate shutdown of the server
````
