---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.4.2.116 .. 1.2.4.2.135
printed_pages: 1286-1306
---

# 1.2.4.2.116 RAD function: sysinfo.get("ClientNetAddress")

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.4.2.116. RAD function:
sysinfo.get("ClientNetAddress")

A RAD function that returns the Service Manager client network IP address as a
character string.
Function
sysinfo.get("ClientNetAddress")
Format

  $info=sysinfo.get("ClientNetAddress")

Example

  $x.clientNetAddress=sysinfo.get("ClientNetAddress")


1.2.4.2.117. RAD function:
sysinfo.get("ClientOSName")

A RAD function that returns the name of the operating system (OS) that Service
Manager is running on, such as Windows XP or Mac OS.
Function
sysinfo.get("ClientOSName")
Format

  $info=sysinfo.get("ClientOSName")


1.2.4.2.118. RAD function:
sysinfo.get("ClientPID")

A RAD function that returns the Process ID (PID) for RAD. The client PID is the same
as the server PID.
Function
sysinfo.get("ClientPID")
Format

  $info=sysinfo.get("ClientPID")

Example

  $x.clientPid=sysinfo.get("ClientPID")


1.2.4.2.119. RAD function:
sysinfo.get("ClientVersion")

A RAD function that returns the version number of the client software as a string in
the release.version.level form. For example, 7.0.1 .
Function
sysinfo.get("ClientVersion")
Format

  $info=sysinfo.get("ClientVersion")


1.2.4.2.120. RAD function:
sysinfo.get("Display")

A RAD function that returns the following:
     Returns gui if the user is running a GUI client.
     Returns text if the process is not running through a GUI client, such as a
     background process.

Function
sysinfo.get("Display")
Format

  $info=sysinfo.get("Display")

Example

  $display=sysinfo.get("display")

After execution, the $display variable is gui if the user is running a Windows
session.

  If sysinfo.get("Display")="gui" then (...)

  If index(sysinfo.get("Display"), "gui")>0 then (...)

  If sysinfo.get("Display")~="text" then (...)


1.2.4.2.121. RAD function:
sysinfo.get("Environment")

A RAD function that returns the following:
     Returns scserver if your session is a client application connection, for example,
     ConnectIT.
     Returns sm if your session is a background process such as a scheduler.
     Returns scguiwswt if your session is a Windows client connection.
     Returns scguiwweb if your session is a Web client connection.

Function
sysinfo.get("Environment")
Format

  $info=sysinfo.get("Environment")


1.2.4.2.122. RAD function:
sysinfo.get("languagecode")

A RAD function that returns the server session language code value used for localized
forms and messages.
Function
sysinfo.get("languagecode")
Format

  $info=sysinfo.get("languagecode")

            Note

           If no language has been set, en is returned.


1.2.4.2.123. RAD function:
sysinfo.get("MaxFloatUsers")

A RAD function that returns the total number of floating users logged on since startup.
Function
sysinfo.get("MaxFloatUsers")
Format

  $info=sysinfo.get("MaxFloatUsers")


1.2.4.2.124. RAD function:
sysinfo.get("MaxLicenses")

A RAD function that returns the maximum number of licenses used since startup.
Function
sysinfo.get("MaxLicenses")
Format

  $info=sysinfo.get("MaxLicenses")


1.2.4.2.125. RAD function:
sysinfo.get("Mode")

A RAD function that returns the following:
     Returns server if RAD is running in server mode.
     Returns sm if RAD is running on a sm process.
     Returns SOAP if RAD is running on a Windows or Web client.
     Returns express if RAD is running in express mode.

Function
sysinfo.get("Mode")
Format

  $info=sysinfo.get("Mode")

Examples

  $mode=sysinfo.get("mode")

Returns SOAP if the user is running on a Windows or Web client.

  If sysinfo.get("mode")="client" then (...)

  If (index(sysinfo.get("mode"),{"sm","server",
  "express"})>0 then (...)


1.2.4.2.126. RAD function:
sysinfo.get("PrevLabel")

A RAD function that returns the label name of the last RAD panel executed, thus
helping determine where errors occur. A RAD program may also require the label of
the last RAD panel that was executed.
Function
sysinfo.get("PrevLabel")
Format

  $info=sysinfo.get("PrevLabel")

Example

  $L.lastlabel = sysinfo.get("prevlabel")

The panel name is the last panel executed in the RAD program called. At the start
panel for any application, the name is the calling panel name from the parent
application.


1.2.4.2.127.
RAD Function: sysinfo.get("PKMode")

A RAD function that returns the primary key mode for the system. Returned values are
of the following types:

      true : indicates that the system is running in primary key mode.

                   Note

                In Service Manager 9.4x, the primary key feature is always enabled
                and therefore a value of true is always returned.

      false : indicates that the system is not running in primary key mode
     ( primary_key_mode=0 in sm.ini).

                   Note

                Starting with Service Manager 9.34p4 (for 9.3x) and 9.40 (for 9.4x),
                the primary_key_mode parameter is obsolete and removed.

Function
sysinfo.get("PKMode")
Format

  $info=sysinfo.get("PKMode")

Example

  <variable> = sysinfo.get("pkmode")


1.2.4.2.128. RAD function:
sysinfo.get("PrintOption")

A RAD function that returns printing option information. The return is either client or
server , depending on how the system is set.
Function
sysinfo.get("PrintOption")
Format

  $info=sysinfo.get("PrintOption")


1.2.4.2.129. RAD function:
sysinfo.get("Quiesce")

A RAD function that returns true if the system is quiesced and false if the system is
not quiesced. When the system is quiesced, it is readonly.
Function
sysinfo.get("Quiesce")
Format

  $info=sysinfo.get("Quiesce")


1.2.4.2.130. RAD function:
sysinfo.get("RecList")

A RAD function that returns true if record list is enabled and false if record list is
disabled.
Function
sysinfo.get("RecList")
Format

  $info=sysinfo.get("RecList")


1.2.4.2.131. RAD function:
sysinfo.get("ServerNetAddress")

A RAD function that returns the Service Manager server network IP address in the
form of a character string.
Function
sysinfo.get("ServerNetAddress")
Format

  $info=sysinfo.get("ServerNetAddress")


1.2.4.2.132. RAD function:
sysinfo.get("ServerNetPort")

A RAD function that returns the Service Manager server port used by the connected
client or the system name when called by a background process.
Function
sysinfo.get("ServerNetPort")
Format

  $info=sysinfo.get("ServerNetPort")

Factors
Returns either the port number or the service name, as specified .
Examples
The system started with:

  sm -httpPort:12932

A connected client issuing this RAD function returns 12932 .
The system started with:

  sm -httpPort:scport1

A connected client issuing this RAD function returns scport1 .


1.2.4.2.133. RAD function:
sysinfo.get("ServerPID")

A RAD function that returns the Process ID (PID) of the server, in the form of a
number.
Function
sysinfo.get("ServerPID")
Format

  $info=sysinfo.get("ServerPID")


1.2.4.2.134. RAD function:
sysinfo.get("ThreadID")

A RAD function that returns the number of the current RAD thread.
Function
sysinfo.get("ThreadID")
Format

  $info=sysinfo.get("ThreadID")

Example

  $x=sysinfo.get("ThreadID")

After execution, the value of $x is set to the number ID of the current RAD thread.


1.2.4.2.135. RAD function:
sysinfo.get("TotalFloatUsers")

A RAD function that returns the total number of floating users allowed.
Function
sysinfo.get("TotalFloatUsers")
Format

  $info=sysinfo.get("TotalFloatUsers")
````
