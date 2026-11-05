---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.11.4 .. 1.11.6
printed_pages: 2765-2799
---

# 1.11.4 Server log file

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.11.4. Server log file

The Service Manager server log file provides detailed information and error messages
about the server and clients, which can assist support engineers and System
Administrators in troubleshooting.

By default, the server log file (sm.log) is located in <Service Manager
home>\Server\logs.

You can change the log file path by setting the startup parameter log , and you can
also enable log switching for the server.

Related topics

Log switching
Stack traces
Trace JavaScript execution
View the Web clients connected to the server


1.11.4.1. Log switching

A system administrator can enable log switching to have Service Manager write log
information to a new file when the current log file reaches a pre-defined size limit

Log switching is particularly useful for systems that run continuously and don't have
downtime for system administrators to back up or delete logs. If you don't enable log
switching, Service Manager will add all log messages to the one log file defined in the
initialization file.

Configure log switching by the maximum log size

Applies to User Roles: System Administrator

To configure log switching by the maximum log size, follow these steps:

   1. Stop the Service Manager server.

   2. Open the sm.ini file in a text editor.

     This file is in your Service Manager RUN directory.

   3. Type the following system parameter:

System parameter                        Description
maxlogsize: n
                                        For n, type the maximum log size in
                                        bytes you want Service Manager to
                                        use as the log size threshold. The
                                        default value is 5MB. Service
                                        Manager switches the log when the
                                        log size reaches the maximum size
                                        defined by this parameter.

Caution

You must have configured the numberoflogfiles parameter to
enable log switching.

4. Save your changes.
5. Restart Service Manager.


     Service Manager uses your new log file settings.

Enable log switching

Applies to User roles: System Administrator
To enable log switching, follow these steps:

   1. Stop the Service Manager server.
   2. Open the sm.ini file in a text editor.

     This file is in your Service Manager RUN directory.
   3. Type the following system parameter.

System parameter                        Description
numberoflogfiles: n
                                        For n, type the number of log files
                                        you want Service Manager to
                                        maintain. The minimum value is 0
                                        (disables log switching) and the
                                        maximum value is 100. The default
                                        value is 0. If the specified number
                                        exceeds the maximum value,
                                        Service Manager uses a value of 7.

                                        Service Manager switches the log
                                        when the log size reaches the
                                        maximum size defined by the
                                        maxlogsize parameter. When this
                                        happens, the current log file is
                                        archived to the log file ending with 1,
                                        and the existing log files are
                                        renamed to the next higher number,
                                        so that the archive log file n+1
                                        always contains older data than
                                        archive file n.

4. Save your changes.
5. Restart Service Manager.


     Service Manager uses your new log file settings.

Disable log switching

Applies to User roles: System Administrator
To disable log switching, follow these steps:

   1. Stop the Service Manager server.
   2. Open the sm.ini file in a text editor.

     This file is in your Service Manager RUN directory.
  3. Locate the numberoflogfiles parameter, and set its value to "0".
   4. Save your changes.
   5. Restart Service Manager.

     Service Manager uses your new log file settings.

Related topics

Server log file


1.11.4.2. Stack traces

Service Manager automatically copies any stack trace produced by a general
protection fault (GPF) to the Service Manager log file (by default, sm.log). You can
use this information to troubleshoot your server and to pass information to Customer
Support.

Related topics

Log switching
Startup parameter: log


1.11.4.3. View the Web clients connected
to the server

When users log on to Service Manager through Web clients, Service Manager
automatically detects the web browsers and web application servers accessing the
server, and logs web browser name and version, web application server (or web
server) name and version, as well as Web Services client agent information (if
available) to the server log file (by default, sm.log). Support personnel can view
information about the connected web clients from the server log without the need to
consult users.
See the following for some examples (where xxx.xx.xx.xx represents IP addresses).

  RTE I SOAP client information scguiwweb 9.71.1006 (P1) at

  xxx.xx.xx.xx Browser Firefox 106.0 AppServer Apache Tomcat 9.0.65

  ESSToolbarButton Disabled(Client Enabled, Server Disabled)
  RTE I SOAP client information scguiwweb 9.71.1006 (P1) at

  xxx.xx.xx.xx Browser Chrome 106.0.0.0 AppServer Apache Tomcat

  9.0.65 ESSToolbarButton Disabled(Client Enabled, Server
  Disabled)
  RTE I SOAP client information scguiwweb 9.71.1006 (P1) at

  xxx.xx.xx.xx Browser Edge 106.0.1370.47 AppServer Apache Tomcat

  9.0.65 ESSToolbarButton Disabled(Client Enabled, Server
  Disabled)

Related topics

Server log file
Log switching
Startup parameter: log


1.11.4.4. View diagnostic counter
information

As a System Administrator or support engineer, you can view diagnostic counter
information in the console or server log (default:sm.log) to assist in investigating
system stability or performance issues.
Service Manager provides the following diagnostic counter information:

     Web services transaction count / size (max size of a web service transaction /
     average size)
     Session login/logout count
     Database client transmission volume / size (network traffic)
     Heartbeat interval - request response count (only servlet container process
     information is printed)
     event-in / event-out count
     email-in / email-out count

            Note

           All the above diagnostic counter information is retrieved for the time since
           system startup.

Retrieval of diagnostic counter information

Service Manager retrieves diagnostic counter information as follows:

     When you run the sm -reportdiagnostics command, Service Manager prints
     diagnostic counter information to the console and also writes the information to
     the server log.

                   Note

                By default, the Diagnostic Service is disabled. Before running the sm
                -reportdiagnostics command, administrators must specify
                 debugdiagnostics:1 to enable the Diagnostic Service.

     When the servlet node or SCAuto listener or emailout process terminates,
     Service Manager writes diagnostic counter information to the server log.


Sample diagnostic counter information

See the following scripts for sample information.


Web Service Diagnostics Summary(Bytes):

Pid:4010 Command:/home/fpeSM/sm930/RUN/smserver

Name:ThreadControllerId-16080

Count:1 Request Total(MIME/MTOM Attachment):721(0/0) Request

Avg(MIME/MTOM Attachment):721(0/0) Response Total(MIME/MTOM

Attachment):238(0/0) Response Avg(MIME/MTOM Attachment):238(0/0)

Pid:4095 Command:/home/fpeSM/sm930/RUN/smserver system.start

Name:ThreadControllerId-background

Count:0 Request Total(MIME/MTOM Attachment):0(0/0) Request

Avg(MIME/MTOM Attachment):0(0/0) Response Total(MIME/MTOM

Attachment):0(0/0) Response Avg(MIME/MTOM Attachment):0(0/0)

Pid:14273 Command:/home/fpeSM/sm930/RUN/smserver -

reportdiagnostics Name:

Count:0 Request Total(MIME/MTOM Attachment):0(0/0) Request

Avg(MIME/MTOM Attachment):0(0/0) Response Total(MIME/MTOM

Attachment):0(0/0) Response Avg(MIME/MTOM Attachment):0(0/0)

Sessions Diagnostics Detail:

Pid:4010 Command:/home/fpeSM/sm930/RUN/smserver

Name:ThreadControllerId-16080

Session Login: 22, Logout: 18

Pid:4095 Command:/home/fpeSM/sm930/RUN/smserver system.start

Name:ThreadControllerId-background

Session Login: 0, Logout: 0

Pid:14273 Command:/home/fpeSM/sm930/RUN/smserver -

reportdiagnostics Name:

Session Login: 0, Logout: 0

Database Statistics:

Pid:4010 Command:/home/fpeSM/sm930/RUN/smserver

Name:ThreadControllerId-16080

FileName                                      Selects Inserts Updates Deletes

Counts Sorts Finds Fetchs Inits Cache Inits Terms

Cache Terms Cache Finds

dbdict                                        2    0    0      0                    12

0         58                            1084  53   2       44                  48

6

triggers                                      111  0    0      0                    0

0         0                             334   44   0       38                  38

0

datadict                                      19   0    0      0                    0

0         566                           0     88   783     74                  865


4732

scldapconfig                                 44  0     0       0       0
                                                  0
0         0                             0    88            76     88
                                                 0
0                                                 0

code                                         0   0     0       0       0
                                                  118
0         57                            0    54            46     48
                                                 0
0                                                 167

format                                       3   0     0       0       0
                                                  0
0         344                           61   75            64     185
                                                 0
1146                                              119

link                                         0   0     0       0       0
                                                  88
0         110                           0    96            78     253
                                                 0
207                                               1

ScriptLibrary                                0   0     0       0       0
                                                  0
0         14                            0    48            41     42
                                                 0
520                                               0

info                                         28  0     0       0       0
                                                  0
0         3                             15   67            56     181
                                                 0
116                                               0

tzfile                                       0   0     0       0       0
                                                  0
0         2                             0    67            56     151

132

joindefs                                     2         0       0       2

0         1                             68   4             0      3

0

erddef                                       4         0       0       0

0         0                             121  5             3      5

0

sctypecheck                                  1         0       0       0

0         0                             7    2             0      2

0

scmandant                                    1         0       0       0

0         0                             0    1             0      1

0

scaccess                                     1         0       0       0

0         0                             134  2             0      2

0

licenseinfo                                  1         56      0         1
                                                                  42
0         79                            0    47            36

0


userinfo                                   1     22    19       18       0
                                            104   0
0         59                            0                  95       40
                                           0     0
0                                           44    0

SYSPUBLISH                                 2     0     0        0        0
                                            4     0
0         0                             0                  38       38
                                           0     0
0                                           35    0

scversion                                  0     0     0        0        2
                                            88    107
0         0                             3                  0        3
                                           0     0
0                                           22    0

scmessage                                  22    0     0        0        0
                                            44    0
0         3451                          0                  30       30
                                           0     0
29997                                       23    0

operator                                   0     0     22       0          0
                                            264   45                183
0         100                           0                  72
                                           0     0
0                                           24    0

scsecuritygroup                            0     0     0        0        0
                                            352   22
0         22                            0                  18       22
                                           0     0
0                                           24    0

cmcontrol                                  0     0     0        0        0
                                            22    0
0         0                             0                  36       40
                                           22    0
0

currency                                               0        0        0

0         1                             0                  19       23

22

environment                                            0        0        0

0         11                            0                  216      261

308

smenv                                                  0        0        0

0         2                             0                  20       20

22

tableAccess                                            0        0        0

0         0                             0                  288      310

0

pmenv                                                  0        0        0

0         2                             0                  20       20

22

category                                               0        0        0

0         0                             0                  18       18

0

globallists                                            0        0        0


0         72                            2860  66    50       54     116

0                                                  0
                                                    0
locallist                                     0          0       0       0
                                                   0
0         44                            0     66    0        54     58

0                                                  0
                                                    114
TodoMap                                       22         0       0       0
                                                   0
0         0                             242   44    224      36     44

0                                                  0
                                                    22
Object                                        19         0       0       0
                                                   0
0         34                            437   80    215      70     192

256                                                0
                                                    0
dataaccess                                    0          0       0       0
                                                   0
0         108                           0     22    0        18     246

492                                                0
                                                    0
cm3profile                                    44         0       0       0
                                                   0
0         0                             0     44    0        36     58

0                                                  0
                                                    0
stathistory                                   171        16      0         0
                                                   0                256
0         0                             0     41    0        35

0                                                  0
                                                    0
language                                      34         0       0       0

0         0                             80    68             60     64

0

kmprofile                                     22         0       0       0

0         0                             0     66             54     58

0

sapconfig                                     22         0       0       0

0         0                             0     44             36     40

0

ApprovalDelegation                            88         0       0       0

0         0                             0     88             72     72

0

slacontrol                                    22         0       0       0

0         0                             0     44             36     40

0

slaprofile                                    0          0       0       0

0         22                            0     44             36     40

0

rcenv                                         0          0       0       0

0         2                             0     24             20     20


22

ocmprofile                                 66    0     0       0       0
                                            66    22
0         0                             0                  54     76
                                           0     0
0                                           24    0

ctenv                                      0     0     0       0       0
                                            24    0
0         2                             0                  20     20
                                           0     22
22                                          44    1

icmenv                                     6     0     0       0       0
                                            9     0
0         2                             0                  20     20
                                           22    0
22                                          29    5

syslog                                     47    0     0       0       0
                                            46    79
0         0                             0                  36     45
                                           0     0
0                                           50    2

counters                                   22    0     7       0       0
                                            22    0
0         7                             3                  6      7
                                           3     0
0                                           37    111

mail                                       466   0     0       0       22
                                            205   57
0         0                             0                  25     34
                                           0     0
0                                           21    0

formatctrl                                 0     0     0       0       0
                                            38    5
0         12                            0                  38     125

98

contacts                                               0       0       0

0         24                            0                  42     48

0

dept                                                   0       0       0

0         0                             0                  18     22

0

menu                                                   0       0       0

0         15                            0                  32     146

139

inbox                                                  0       0

399       0                             0              49         51

104           0

inboxgrid                                              0       0       0

0         6                             0                  18     19

38

docenv                                                 0       0       0

0         0                             0                  34     41

0


ViewDefault                                  0      0     0      0      0

0         19                            0    19     0        17     17

0

Todo                                         19     0     0      0      0

0         0                             26   38     38       34     74

0

displaymaster                                0      0     0      0      0

0         2                             0    21     0        18     19

19

displayscreen                                3      0     0      0      0

0         0                             0    25     9        22     32

0

displayoption                                3      0     0      0      0

0         0                             0    21     13       19     34

0

displaycache                                 0      0     0      0      0

0         6                             0    25     8        20     31

29

displayevent                                 2      0     0      0      0

0         0                             2    22     8        18     28

0

systext                                      23     0     0      0      0

0         0                             69   28     9        24     37

0

distgroup                                    0      0     0      0      0

0         0                             0    3      0        3      3

0

eventregister                                4      0     0      0      6

0         0                             189  6      1        4      5

0

eventout                                     3      2     0      1      0

0         0                             2    9      10       4      19

0

number                                       0      0     2      0      0

0         2                             0    4      1        0      3

0

eventmap                                     173    0     0      0
                                              5675   175
376       0                             0                 1         4

5              0

typecheck                                    0      0     0      0      0


0         0                             0    2    2       2      4

0                                                0
                                                  0
config                                       0         0      0       0
                                                 6
0         1                             0    2    0       2      2

0                                                7
                                                  0
uimpages                                     2         0      0       0
                                                 1
0         6                             13   7    6       7      7

0                                                0
                                                  1
schedule                                     0         0      0       0
                                                 0
0         0                             0    3    0       3      3

0                                                0
                                                  7
uimuserpreferences                           3         2      0       0
                                                 0
0         5                             6    5    4       5      11

0                                                0
                                                  4
uimcompdefinitions                           3         0      0       0
                                                 0
0         0                             16   4    13      4      5

0                                                0
                                                  383
uimpagecategories                            1         0      0       0
                                                 0
0         0                             0    1    13      1      1

0                                                0
                                                  0
uimpagecatspages                             8         0      0       0

0         0                             0    1            1      8

0

uimuserpagecontent                           6         0      0       0

0         0                             0    2            2      6

0

extaccess                                    6         0      0       0

0         0                             0    4            4      8

0

States                                       0         0      0       0

0         13                            0    11           7      24

21

help                                         3         0      0       0

0         382                           525  4            4      387

0

probsummary                                  2         0      0       0

0         0                             0    14           14     15

0

sqlsystemtables                              0         0      0       0

0         2                             0    2            2      2


0

status                                       0     0    0       0                 0

0         0                             0    2     0       2                  2

0

incidents                                    1     0    0       0                 0

0         0                             0    5     5       5                  6

0

SearchConfig                                 1     0    0       0                 0

0         1                             28   2     1       0                  3

0

AdvFilter                                    0     0    0       0                 0

0         0                             0    1     0       0                  1

0

eventin                                      0     1    0       0                 0

0         1                             0    3     1       0                  2

0

Pid:4095 Command:/home/fpeSM/sm930/RUN/smserver system.start

Name:ThreadControllerId-background

FileName                                     Selects Inserts Updates Deletes

Counts Sorts Finds Fetchs Inits Cache Inits Terms

Cache Terms Cache Finds

dbdict                                       0     0    0       0                 0

0         53                            0    19    0       2                  2

0

triggers                                     55    0    0       0                 0

0         0                             187  19    0       2                  2

0

datadict                                     0     0    0       0                 0

0         61                            0    1150  222     950                1186

1734

scldapconfig                                 19    0    0       0                 0

0         0                             0    38    0       6                  38

0

code                                         0     0    0       0                 0

0         71                            0    28    0       4                  11

0

format                                       0     0    0       0                 0

0         27                            0    30    0       5                  13

135

link                                         0     0    0       0                 0


0         1                             0  35    0         3      4

15

ScriptLibrary                              0     0   0        0        0

0         6                             0  22    0         3      5

192

info                                       57    0   1        0        0

0         1                             0  60    76        8      100

20

tzfile                                     0     0   0        0        0

0         0                             0  30    96        5      118

82

SYSPUBLISH                                 0     0   0        0        0

0         0                             0  19    0         2      2

0

scmessage                                  0     0   0        0        0

0         112                           0  16    0         2      2

4941

schedule                                   5889  33  2649     40       0

0         0                             0  33    16        5      21

0

counters                                   5     0   26       0          0
                                                                  4
0         26                            3  7     0         2

0

anubissystemstate                          2     0   2        0        0

0         0                             0  2     1         2      3

0

syslog                                     0     17  0        0        0

0         0                             0  2     16        2      18

0

marquee                                    31    0   0        0        0

0         0                             0  2     29        1      31

0

shutdown                                   1     0   0        0        0

0         0                             0  2     0         2      2

0

cmcontrol                                  15    0   0        0        0

0         0                             0  30    0         3      16

0

currency                                   0     0   0        0        0

0         1                             0  16    0         2      16


15

environment                                   0             0      0         0       0

0         11                            0     145           32           13     45

175

smenv                                         14            0      0         0       0

0         1                             0     29            0            3      15

14

tableAccess                                   0             0      0         0       0

0         0                             0     197           10           16     32

0

operator                                      0             0      0         0       0
                                                             165
0         229                           0     54                         6      189

0

pmenv                                         0             0      0         0       0

0         1                             0     16            0            1      2

15

category                                      298           0      0         0       0
                                                             296
0         0                             1788  18                         3      300

0

globallists                                           1505  0      1192      0         0
                                        41882 51             2080               2129
0         15                                                             7

0

locallist                                     0             0      0         0       0

0         30                            0     45            0            6      19

0

TodoMap                                       15            0      0         0       0

0         0                             165   30            0            4      30

0

Object                                        0             0      0         0       0
                                                             111
0         8                             0     18                         2      129

160

dataaccess                                    156           0      0         0       0
                                                             145
0         110                           0     15                         2      160

164

cm3profile                                    30            0      0         0       0

0         30                            0     30            15           2      17

0

stathistory                                   0             10     0         0       0

0         0                             0     16            40           2      56

0


sapconfig                                    15   0     0     0       0
                                                   0
0         0                             0    30            3     16
                                                  0
0                                                  0

ApprovalDelegation                           60   0     0     0       0
                                                   0
0         0                             0    60            8     8
                                                  0
0                                                  0

slacontrol                                   15   0     0     0       0
                                                   0
0         0                             0    30            3     16
                                                  0
0                                                  0

slaprofile                                   0    0     0     0       0
                                                   0
0         15                            0    30            3     16
                                                  0
0                                                  0

formatctrl                                   0    0     0     0       0
                                                   9
0         16                            0    16            1     2
                                                  0
30                                                 0

contacts                                     0    0     0     0       0
                                                   0
0         15                            0    15            1     1
                                                  0
0                                                  297

dept                                         15   0     0     0       0
                                                   39
0         0                             705  30            4     30
                                                  0
0

rcenv                                        0          0     0       0

0         2                             0    11            1     3

9

ocmprofile                                   0          0     0       0

0         54                            0    27            3     12

0

ctenv                                        9          0     0       0

0         2                             0    18            3     10

9

icmenv                                       9          0     0       0

0         2                             0    18            3     10

9

patcotask                                    298        0     0       0

0         0                             0    1             0     298

0

msgclass                                     40         0     0       0

0         0                             40   2             0     41

0

msgtype                                      0          0     0       0


0         40                            0    2    39         0     41

0

msglog                                       0    25    0       0       0

0         0                             0    2    24         0     26

0

erddef                                       1    0     0       0       0

0         0                             0    1    0          0     1

0

applicationfields                            298  0     0       0       0
                                                   297
0         0                             11026 2              1     299

0

eventin                                      298  0     1       0       0
                                                   298
0         1                             1    2               0     300

0

contract                                     60   0     0       0       0

0         0                             0    1    59         0     60

0

expline                                      30   0     0       0       0

0         0                             0    1    29         0     30

0

agent                                        269  0     0       0       0
                                                   268
0         0                             0    1               0     269

0

outage                                       10   0     0       0       0

0         0                             0    1    9          0     10

0

sloavail                                     10   0     0       0       0

0         0                             0    1    9          0     10

0

slo                                          10   0     0       0       0

0         0                             790  2    9          0     11

0

slaresponse                                  840  0     790     0       0

0         0                             790  3    18         0     20

0

clocks                                       0    0     0       0       0

0         0                             0    1    9          0     10

0

sloresponse                                  790  0     0       0       0

0         0                             0    2    1578       0     1580


0

sla                                         10  0  0      0                      0

0         0                             50  2   9      0                     11

0

slamonthly                                  50  0  0      0                      0

0         0                             0   1   9      0                     10

0

slamonthlyag                                0   0  50     0                      0

0         50                            0   2   9      0                     11

0

ocmq                                        0   0  0      0                      0

0         0                             0   1   0      0                     1

0

ocml                                        1   0  0      0                      0

0         0                             0   1   0      0                     1

0

eventregister                               1   0  0      0                      0

0         0                             1   2   0      0                     2

0

mail                                        0   0  0      0                      0

0         0                             0   3   0      0                     2

0

eventmap                                    1   0  0      0                      0

0         0                             5   2   0      0                     2

0

SYSATTACHMENTS                              1   0  0      0                      0

0         0                             0   1   0      0                     1

0

Pid:14273 Command:/home/fpeSM/sm930/RUN/smserver -

reportdiagnostics Name:

FileName                                    Selects Inserts Updates Deletes

Counts Sorts Finds Fetchs Inits Cache Inits Terms

Cache Terms Cache Finds

dbdict                                      0   0  0      0                      0

0         0                             0   1   0      0                     0

0

triggers                                    0   0  0      0                      0

0         0                             0   1   0      0                     0

0

datadict                                    0   0  0      0                      0


0       0                               0  1        0     0         0

7

scldapconfig                               1        0  0     0         0

0       0                               0  2        0     0         2

0

code                                       0        0  0     0         0

0       0                               0  1        0     0         0

0

format                                     0        0  0     0         0

0       0                               0  1        0     0         0

0

link                                       0        0  0     0         0

0       0                               0  1        0     0         0

0

ScriptLibrary                              0        0  0     0         0

0       0                               0  1        0     0         0

0

info                                       0        0  0     0         0

0       0                               0  1        1     0         2

2

tzfile                                     0        0  0     0         0

0       0                               0  1        1     0         2

2

SYSPUBLISH                                 0        0  0     0         0

0       0                               0  1        0     0         0

0

Apps Statistics:

Pid:4010 Command:/home/fpeSM/sm930/RUN/smserver

Name:ThreadControllerId-16080

Module                                     Name              Count

Pid:4095 Command:/home/fpeSM/sm930/RUN/smserver system.start

Name:ThreadControllerId-background

Module                                     Name              Count

Event Services                             emailin           1

Event Services                             eventin           1

Pid:14273 Command:/home/fpeSM/sm930/RUN/smserver -

reportdiagnostics Name:

Module                                     Name              Count

Heartbeat Diagnostics Detail:

Pid:4010 Command:/home/fpeSM/sm930/RUN/smserver


Name:ThreadControllerId-16080

Heart Beat Count: 1028                  Heart Beat Interval: 15

Related topics

Server log file
Log switching
Startup parameter: log
Special parameters: reportdiagnostics
Parameter: debugdiagnostics


1.11.4.5. Trace JavaScript execution

If you are a Service Manager JavaScript developer and want to trace JavaScript
execution invoked from within RAD, specify rtm:3 in the sm.ini configuration file.
This enables Service Manager to log tracing information in the Service Manager
server log file (default: <Service Manager home>\Server\logs\sm.log).
The following is an example of the log information:

  RTE D SCRIPTTRACE: localizeTable.getLocalizedValues entered,
  line 210
  RTE D Parameter type:STRING value:categories
  RTE D Parameter type:ARRAY value:{"complaint", "incident",
  "problem", "request for change", "request for information"}
  RTE D SCRIPTTRACE: localizeTable.getLocalizedValues exited, line
  219 elapsed: 110 ms

This example indicates that the getLocalizedValues function in script localizeTable
has been invoked, starting from line 210; the execution completes at line 219, which
might be the last line of this function; The execution consumes 110 ms in total. In
addition, the parameters passed to this function are also dumped into the log file: the
first one is STRING type, with a value of "categories"; the other one is an ARRAY, with
its parameters enclosed in braces by their order in the array.

Related topics

Server log file
Enter a parameter in the sm.ini file


1.11.4.6. View the system log file

Applies to User Roles: System Administrator

The System log (Syslog) file contains information about system events, such as failed
logon attempts.

To view or edit system events in the Syslog file, follow these steps:

   1. Click Tailoring > Database Manager. Or, type db in the command line, and then
     press Enter or click Execute Command.

   2. Type syslog in the Form field, and then press Enter.

   3. Type any search criteria in the appropriate fields, and then click Search.

     A list of events in the Syslog file is displayed.

   4. Select a system event in the list to display detailed information about the event.
     To edit the event, make the desired changes to the detailed information, and
     then click Save.

The Syslog file records the following types of event:

     Successful logon

     The following event is an example of a successful logon.

Event Start Stop                        User Termi Curre IP           PID
Type Time Time
                                        Name nal      nt       Addre
user 7/15/2
           013                          Name Status ss
           1:27:5
           6                            falcon SOAP- logge     16.158. 4
                                                   Windo d on  154.21
                                                   ws 7        3

Failed logon
The following event is an example of a failed logon.


Event Start Stop                            User Termi Curre IP          PID
Type Time Time
                                            Name nal  nt          Addre
user 7/10/2
           013                              Name Status ss
           20:12
                                            ddd SOAP- login 16.158. 4

                                            Windo failed 154.21

                                            ws 7                  3

Note

Failed logon events are recorded both when a user enters an
incorrect password and when a user enters an incorrect user name.

Logout
The following event is an example of a logout.

Event Start Stop User Termi Curre IP                                     PID

Type Time Time Name nal                               nt          Addre

                                            Name Status ss

user 7/7/20 7/7/20 falcon SOAP- logge 16.158. 4

13                                      13  Windo d off 154.21

20:36 22:33                                 ws 7                  3

Scheduler starts
The following event is an example of a scheduler starting.

Event Start Stop                            User Termi Curre IP          PID
Type Time Time
                                            Name nal  nt          Addre
sched 7/14/2
uler 013                                    Name Status ss

           0:25                             availa availa starte         3

                                            bility bility d


Note

The IP address column is populated only if the event is triggered
from a machine that's not the Service Manager server.

Scheduler terminates
The following event is an example of a scheduler terminating.

Event Start Stop User Termi Curre IP                                  PID

Type Time Time Name nal                 nt                     Addre

                                        Name Status ss

sched 7/14/2 7/14/2 KMUp SYSTE stopp                                  18

uler 013 013 date M                     ed

0:25 0:25

Note

The IP address column is populated only if the event is triggered
from a machine that's not the Service Manager server.


1.11.4.7. How to interpret http.log

The http.log may contain encoded or compressed messages from the Windows or
Web Client communication. See below to turn off SOAP compression and FastInfoset
encoding. Web Services communications aren't encoded nor compressed.

The http.log contains information on all Processes/Threads that connect to the traced
servlets. If more than one Process/Thread is traced, information in the log may
overlap from different sessions, resulting in multiple POST or GET messages together
rather than the POST – GET pair you would expect.

To turn off FastInfoset and compression for the clients, follow these steps:

   1. On the shortcut starting the Windows client, add –DFastInfoset=false to the
     target.

   2. The command line argument for the Service Manager Windows client is:

     -vmargs -option1 -option2

   3. As an example, if -DFastInfoset=false is the only command line option ensure
     your command line is:

     -vmargs -DFastInfoset=false

   4. Turn off Compress SOAP Messages on the File - Connect – Connections
     screen’s Advanced tab.

   5. For the Web client, turn off FastInfoset by setting the JAVA Option -
     DFastInfoset=false. As an example, to turn off FastInfoset on Tomcat 5.5 or later,
     follow these steps:

        1. Go to the Apache Tomcat x.x folder on the Start Menu.
        2. Start the Configure Tomcat application.
        3. Select the Java tab in the configuration dialog.

   6. Turn off the Compress SOAP Messages by editing the ...\WEB-INF\web.xml file.


<!-- Compress network communication between the application
server
and the HP Service Manager server -->
<init-param>
<param-name>compress_soap</param-name>
<param-value>false</param-value>
</init-param>


1.11.5. Client log file

Each Service Manager client has a log file, which stores client session information for
troubleshooting.

For each client, the log file is defined as follows:

     Windows client

     Go to Window > Preferences > Service Manager > Logs. The Log file field
     specifies the log file path.

     Web client

     By default, the log file is located in the Web application server's home directory:
     <Web application server home directory>/sm.log.

     For example: C:\Program Files\Apache Software Foundation\<Tomcat
     version>\sm.log.

View SOAP fault information in the client log

When a SOAP fault or an exception occurs on the Service Manager server, the SOAP
fault information is written to the client log file. This information can assist support
engineers and System Administrators in troubleshooting.

Service Manager logs SOAP fault information in the Windows or Web client log file
(sm.log) as follows:

     When a SOAP FAULT occurs, Service Manager logs the SOAP request, SOAP
     response, and SOAP fault information.
     When a server session ends unexpectedly and an exception is thrown, Service
     Manager logs the SOAP request, SOAP response (if any), and the exception
     information.

Example:

If a user is performing operations (such as generating charts) on the client side and
then a System Administrator kills the user's process from System Status, SOAP fault
information like the following is logged in the client log file (sm.log):


  ERROR Timer-0 com.hp.ov.sm.client.webtier.SCLogging - Jan 10,
  2022 17:58:32 GMT+08:00 [ERROR] SOAP Failure - Session no longer
  valid
  ERROR Timer-0 com.hp.ov.sm.client.webtier.SCLogging - Jan 10,
  2022 17:58:32 GMT+08:00 [ERROR] request:
  <getMessages />
  ERROR Timer-0 com.hp.ov.sm.client.webtier.SCLogging - Jan 10,
  2022 17:58:32 GMT+08:00 [ERROR] response:
  <Fault>
  <faultcode>SOAP-ENV:Server</faultcode>
  <faultstring>Session no longer valid</faultstring>
  <faultactor>Server</faultactor>
  </Fault>
  ERROR Timer-0 com.hp.ov.sm.client.webtier.SCLogging - Jan 10,
  2022 17:58:32 GMT+08:00 [ERROR] The soap fault is : SOAP-
  ENV:Server
  Session no longer valid

Related topics

Server log file


1.11.6. Message processors

Message processors are scheduled processes dedicated to managing Service
Manager messages. By default, the problem background process manages all
Service Manager messages. If your system generates enough messages, it may
create a backlog in your message queue. You can remove the message backlog by
adding additional message processors.

Each message processor must have an agent initialization record definition that
defines the name of the processor and the RAD application to call. The message
processor name must match the name listed in the System Wide Company Record for
the message processor. All message processors must call the scheduler RAD
application.

To determine if the message queue is affecting your system performance, you can
review the schedule file. If you see schedule records with the name message
processor record with an expiration time greater than a minute old, then you should
consider adding additional message processors.

Define which system processes manage message
traffic

Applies to User Roles: System Administrator

To define which system processes manage message traffic, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Message Processors tab.
   3. In the Processor Name field, type the names of the background or scheduler

     processes that are to manage message traffic. The processor name must match
     the class name specified for the message class processor.
   4. Click Save.
   5. Start the message processors.

Service Manager rotates messages among all the processes you define. If you don't
define any message processors, then Service Manager uses the problem processor
to manage all message traffic.

Add additional message processors

Applies to User Roles: System Administrator


By default, Service Manager uses the problem background process to manage all
message traffic. If your message queue grows too large, you can add additional
message processors to handle the message load.
To add additional message processors, follow these steps:

   1. Create a message processor agent record.
   2. Add the message processors to the System Wide Company record.
   3. Start the message processor processes.

                   Tip

                You can also add your message processors to the startup agent
                record to have Service Manager automatically start them.

Create a message processor agent record

Applies to User Roles: System Administrator
You can create message processor agent records to divide the message load
between multiple processes.
To create a message processor agent record, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     Agent Registry. The Background Processor Initialization Registry form opens.

   2. Click Search.
   3. Type or select the information record information.
   4. Click Add.

     Service Manager displays the message: Information record added.
   5. Repeat steps 2-3 for each message processor you wish to add.

View the messages

Service Manager notifies you when you have activity messages to review. The
messages can appear at the top of the detail window.


Information type                        Meaning
Information
                                        Information about the most recent
Warning                                 action
Error
                                        A warning about the most recent action

                                        The most recent action caused an error
                                        to occur

Note

By default, these three types of messages all appear on the top of the
detail window. You can change the default settings by modifying the
related parameters.

To view all the messages in a Service Manager session, click the message icon to
open the Messages window.

Related topics

Scheduled processes
Access the schedule file
````
