---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.1.8 .. 1.2.1.11
printed_pages: 996-1027
---

# 1.2.1.8 List: Command line calls

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.1.8. List: Command line calls

You can use the Service Manager command line to navigate through the Service
Manager system and to run applications, wizards, and macros.

Generic command line calls

Command         RAD application         Function            Example
                called
*a<application                          Runs the            *adatabase
name>           as specified            specified RAD       accesses
                                        routine.            Database
*f<file name>   database                                    Manager.
                                        Accesses a
*q<query name> query.stored             specified file.     *fcontacts
                                                            accesses the
*s<script name> script.execute          Runs a stored       contacts file.
                                        query.
#<shortcut      non-applicable                              *qIM.open.ALL
name>                                   Runs the            displays a list of
                                        specified script.   all open incidents.

                                        Queries for a list  *socmq.open.hr.q
                                        of shortcut         uote opens an HR
                                        commands.           Request record.

                                                            #do presents a
                                                            list of commands
                                                            that start with
                                                            “do.”

Direct command line calls


Command                                 RAD application called  Function
about                                   bulletin.key
ag                                      encl.appl               Displays the system
                                                                bulletin and any active
agcompare                               compare.applications    “hot” incidents.
agentrev                                query.stored
                                                                Displays the RAD Editor
agentstat                               scauto.check.setup      prompt (formerly known
                                                                as Application
agmap                                   agmap.sched             Generator).
alert                                   database
alertdefs                               se.search.engine        Displays the RAD
alertlogs                               se.search.engine        Application Comparison
appr                                    database                form.

                                                                Executes the “agentrev”
                                                                query which displays a
                                                                list of the schedule
                                                                records for all SCAuto
                                                                agents.

                                                                Displays a currently-
                                                                available SCAuto agents.
                                                                Form includes options
                                                                for stopping agents

                                                                Displays the Application
                                                                Mapping form.

                                                                Displays the Alert
                                                                Definition form.

                                                                Displays the Alert
                                                                Definition form.

                                                                Displays the Alert Log
                                                                form.

                                                                Displays the Approval
                                                                Definition form.


Command                                 RAD application called  Function
approvaldefs                            se.search.engine
approvallogs                            se.search.engine        Displays the Approval
auditdelta                              audit.unload.front      Definition form.
audithist                               database
auditonoff                              database                Displays the Approval
audlog                                  database                Log form.
audspec                                 database
autoshut                                database                Displays the form for
                                                                unloading an Audit Delta.
bulletin                                database
calduty                                 database                Displays the Audit
calholiday                              database                History form.
call                                    exercise
                                                                Displays the Audit
                                                                Control form.

                                                                Displays the Audit Log
                                                                form.

                                                                Displays the Audit
                                                                Specification Table form.

                                                                Displays the Automatic
                                                                Shutdown Information
                                                                form.

                                                                Displays the System
                                                                Bulletin form.

                                                                Displays the Normal
                                                                Working Hours form.

                                                                Displays the Holiday
                                                                Names form.

                                                                Displays the Application
                                                                Exerciser form for
                                                                testing/running a RAD
                                                                application directly.


Command                                 RAD application called  Function
callqueue                               sc.setup.manage
chgqueue                                sc.setup.manage         Displays the Interaction)
cls                                     pm.access               queue.
cm3grp                                  database
cm3msg                                  database                Displays the Change
cm3profile                              database                queue.
cm3r                                    se.search.engine
cm3rcat                                 cm3r.category.maint     Displays the Incident
cm3renv                                 se.search.engine        queue.
cm3ropen                                cmc.open.from.menu
                                                                Displays the Change
                                                                Management Groups
                                                                Definition form.

                                                                Displays Change
                                                                Management Event
                                                                Definition form.

                                                                Displays the Change
                                                                Management (ChM)
                                                                Security Profile form.

                                                                Displays the search form
                                                                for Change Management
                                                                requests.

                                                                Displays the Change
                                                                Management Request
                                                                Category form.

                                                                Displays the Change
                                                                Management Application
                                                                Environment form.

                                                                Initiates the script for
                                                                opening a new change
                                                                request record.


Command                                 RAD application called  Function
cm3t                                    se.search.engine
cm3tcat                                 cm3t.category.maint     Displays the search form
cm3tenv                                 se.search.engine        for Change Management
                                                                tasks.
cm3topen                                cmt.open.from.menu
cmcontrol                               cm.edit.config          Displays the Change
cmdlist                                 report.exerciser        Management Task
comp                                    se.search.engine        Category form.

compare                                 compare.applications    Displays the Change
configure sla                           sla.edit.config         Management Application
                                                                Environment - Tasks
                                                                form.

                                                                Initiates the script for
                                                                opening a new change
                                                                task.

                                                                Displays the Contract
                                                                Management
                                                                Configuration form.

                                                                Executes the Menu
                                                                Command List report via
                                                                Report Exerciser.

                                                                Displays the System
                                                                Information Definition
                                                                form (system Company
                                                                record).

                                                                Displays the RAD
                                                                Application Comparison
                                                                form.

                                                                Displays the Service
                                                                Level Agreement Control
                                                                form.


Command                                 RAD application called   Function
contacts                                database
copyfile                                copy.database.file       Displays the Contacts
createschd                              database                 search form.
curalerts                               se.search.engine
curapprovals                            se.search.engine         Initiates the script for
curconvert                              database                 copying a database file.
currency                                database
datamap                                 database                 Displays the Schedule
db                                      database                 form.
dbdict                                  dbdict.utility database
de                                      database                 Displays the Alert search
                                                                 form.
delmail                                 database
                                                                 Displays the Approval
                                                                 search form.

                                                                 Displays the Currency
                                                                 Conversion search form.

                                                                 Displays the Currency
                                                                 form.

                                                                 Displays the Data Map
                                                                 form.

                                                                 Displays the Database
                                                                 Manager form.

                                                                 Displays the Database
                                                                 Dictionary prompt.

                                                                 Displays the Display
                                                                 Application Event
                                                                 Definition form.

                                                                 Displays the form for
                                                                 sending internal Service
                                                                 Manager broadcast mail.


Command                                 RAD application called  Function
dist                                    database
do                                      database                Displays the Distribution
doc                                                             Group form.
                                        menu.manager
ds                                                              Displays the Display
edit gkn                                                        Application Option
evemail                                                         Definition form.
eventbld
                                                                Displays the menu with
                                                                options for maintaining
                                                                the document engine.

                                                                            Note

                                                                           This
                                                                           command
                                                                           line call will
                                                                           only work if
                                                                           the menu
                                                                           forms are
                                                                           being
                                                                           displayed.

                                        database                Displays the Display
                                                                Application Screen
                                        database                Definition form.
                                        sca.window
                                        axces.build.maps        Displays the form for
                                                                editing core knowledge.

                                                                Displays the form for
                                                                sending an email event.

                                                                Initiates the wizard for
                                                                building event mappings.


Command                                 RAD application called  Function
eventfltr                               database
eventin                                 database                Displays the Event Filters
eventmap                                database                form.
eventout                                database
eventreg                                database                Displays the Event
evicmbld                                scauto.build.maps       Services input queue.

evwrite                                 sca.window              Displays the Event Map
                                                                form.
expline                                 database
fc                                      format.ctrl.maint       Displays the Event
fd                                      forms.designer          Services output queue.
files                                   database
                                                                Displays the Event
                                                                Registration form.

                                                                Initiates a script for
                                                                building Configuration
                                                                Management event
                                                                mappings.

                                                                Displays the form for
                                                                sending an Incident
                                                                Management,
                                                                Configuration
                                                                Management, or generic
                                                                event.

                                                                Displays the Expense
                                                                Line Information form.

                                                                Displays the Format
                                                                Control form.

                                                                Displays the Forms
                                                                Designer form.

                                                                Displays the
                                                                Configuration File form
                                                                for database unloads.


Command                                 RAD application called  Function
formatctrl                              format.ctrl.maint
forms                                   forms.designer          Displays the Format
gen core                                ke.gencore.verify       Control form.

gl                                      database                Displays the Forms
hd                                      pm.access               Designer prompt.
htopic                                  database
imapplenv                               database                Displays the prompt for
                                                                generating the core
imassign                                database                Knowledge Base.
imbuild                                 pm.build.probsum
                                                                Displays the global list
imconvert                               pm.convert.format       form.
imgroups                                database
                                                                Displays the Incident
                                                                queue.

                                                                Displays the Help topic
                                                                search form.

                                                                Displays the Incident
                                                                Management
                                                                Environment Profile
                                                                form.

                                                                Displays the Assignment
                                                                Groups form.

                                                                Initiates the script for the
                                                                building of probsummary
                                                                records.

                                                                Displays the Convert
                                                                Incident Format form.

                                                                Displays the Incident
                                                                Management Groups
                                                                form.


Command                                 RAD application called Function
improfile
imreset                                 database                 Displays the Incident
inact                                                            Management Security
incidentqueue                                                    Profile form.
info
irq                                     pm.clear.downtime        Allows for the clearing of
knowledge                                                        availability information.
link
linklist                                kill.inactive.setup      Displays the Kill Inactive
load transfer                                                    Users Setup Parameters
location                                                         form.

                                        sc.setup.manage          Displays the Incident
                                                                 queue.

                                        database                 Displays the Background
                                                                 Processor Initialization
                                                                 Registry form.

                                        ir.query.window          Displays the form for
                                                                 issuing an IR Query File
                                                                 form.

                                        get.search.application   Displays the search form
                                                                 for Knowledgebase
                                                                 information.

                                        edit.link                Displays the Link File
                                                                 form.

                                        report.exerciser         Executes the Link File
                                                                 Listing report via Report
                                                                 Exerciser.

                                        apm.upgrade.load.transf  Initiates the Service
                                        er                       Manager Upgrade Utility
                                                                 Load Transfer form.

                                        database                 Displays the Location
                                                                 form.


Command                                 RAD application called  Function
logmsg                                  database
mailmsg                                 database                Displays the “log” type
mcf                                     database                Message Class form.
menu                                    database
message                                 database                Displays the “mail” type
model                                   database                Message Class form.

modelicm                                database                Displays the Capability
                                                                Word form.
modelven                                database
monitor                                 system.monitor          Displays the Menu form.
msg                                     database
msglog                                  database                Displays the Message
msgtype                                 database                form.

                                                                Displays the
                                                                Configuration Item (CI)
                                                                Model search form.

                                                                Displays the
                                                                Configuration Item (CI)
                                                                Model search form.

                                                                Displays the Model
                                                                Vendor Information form.

                                                                Displays the system
                                                                status form.

                                                                Displays the generic
                                                                Message Class form.

                                                                Displays the Message
                                                                Log form.

                                                                Displays the Message
                                                                Type form.


Command                                 RAD application called  Function
new call                                cc.first
new incident                            apm.first               Displays a blank form to
note                                    database                create a Service Desk
number                                  database                interaction.
ocmbldlvl                               ocm.co.bld.lvls
                                                                Displays a blank incident
ocmco                                   database                form for record entry.
ocmdeliv                                report.exerciser
                                                                Displays the Notification
ocmdreqj                                report.exerciser        Definition form.
ocmdrj                                  report.exerciser
ocmevents                               database                Displays the Sequential
                                                                Number form.

                                                                Displays the prompt for
                                                                updating all of the level
                                                                numbers for all
                                                                components in the model
                                                                file.

                                                                Displays the
                                                                Configuration Item (CI)
                                                                Model search form.

                                                                Executes the Delivery
                                                                Forecast for Next 7 Days
                                                                report via Report
                                                                Exerciser.

                                                                Executes the Daily Quote
                                                                Log report via Report
                                                                Exerciser.

                                                                Executes the Daily
                                                                Receipt Journal report
                                                                via Report Exerciser.

                                                                Displays the Request
                                                                Management Events
                                                                form.


Command                                 RAD application called  Function
ocmgroups                               database
ocml                                    ocml.access             Displays the Request
ocmlcat                                 database                Management Group
ocmlcreate                              ocm.category.create     Definition form.
ocmlenvir                               query.stored
                                                                Displays the search form
ocmlmast                                database                for Request Management
ocmlphase                               database                line items
ocmlrec                                 database
ocmo                                    ocmo.access             Displays the Request
                                                                Management Line Item
                                                                Category form.

                                                                Displays the Request
                                                                Management Line Item
                                                                Category form.

                                                                Displays the Request
                                                                Management Line Items
                                                                Application Environment
                                                                form.

                                                                Displays the Request
                                                                Management Catalog
                                                                Select Categories form.

                                                                Displays the Request
                                                                Management Line Item
                                                                Phase form.

                                                                Displays the Request
                                                                Management Receiving
                                                                Log form.

                                                                Displays the search form
                                                                for Request Management
                                                                orders.


Command                                 RAD application called  Function
ocmoappr                                ocmo.access
ocmocat                                 database                Displays a list of orders
ocmocavail                              database                that have been
                                                                approved.
ocmocreate                              ocm.category.create
ocmodemand                              database                Displays the Request
                                                                Management Order
ocmoenvir                               query.stored            Category form.
ocmoopen                                ocmo.access
ocmophase                               database                Displays the Request
                                                                Management Check
                                                                Availability Order
                                                                Generation Schedule
                                                                Record.

                                                                Displays the Request
                                                                Management Order
                                                                Category form.

                                                                Displays the Request
                                                                Management
                                                                Background Order
                                                                Generation Schedule
                                                                Record form.

                                                                Displays the Request
                                                                Management Orders
                                                                Application Environment
                                                                form.

                                                                Initiates the script for
                                                                creating a new Request
                                                                Management order.

                                                                Displays the Request
                                                                Management Order
                                                                Phase form.


Command                                 RAD application called  Function
ocmpo                                   report.exerciser
ocmprofile                              database                Executes the Print
ocmq                                    ocmq.access             Purchase Orders report
ocmqcat                                 database                via Report Exerciser.
ocmqcreate                              ocm.category.create
ocmqopen                                ocmq.access             Displays the Request
ocmqphase                               database                Management Profile
ocmvenper                               report.exerciser        form.

oncall                                  database                Displays the search form
oncallsched                             database                for Request Management
                                                                quotes.

                                                                Displays the Request
                                                                Management Quote
                                                                Category form.

                                                                Displays the Request
                                                                Management Quote
                                                                Category form.

                                                                Initiates the script for
                                                                creating a new Request
                                                                Management quote.

                                                                Displays the Request
                                                                Management Quote
                                                                Phase form.

                                                                Executes the Vendor
                                                                Performance Based on
                                                                Line Item Dates report
                                                                via Report Exerciser.

                                                                Displays the On Call
                                                                Schedule contact form.

                                                                Displays the On Call
                                                                Schedule calendar form.


Command                                 RAD application called  Function
operator                                database
opn                                     pm.access               Displays the Operator
overspent                               query.stored            form.

password                                password.change         Displays the Incident
printappl                               report.exerciser        queue.
prtmsg                                  database
purgarch                                pa.main.appl            Executes the "overspent
purgeaudit                              audit.purge             contracts" query which
RAD                                     encl.appl               displays a list of all
rad                                     encl.appl               service contracts that
                                                                have exceeded their
                                                                financial budget.

                                                                Displays the prompt for
                                                                changing the login
                                                                password.

                                                                Executes the Print of
                                                                Application report via
                                                                Report Exerciser.

                                                                Displays the "print" type
                                                                Message Class form.

                                                                Displays the
                                                                Purge/Archive form.

                                                                Displays the form for
                                                                purging audit history.

                                                                Displays the RAD Editor
                                                                prompt.

                                                                Displays the RAD Editor
                                                                prompt.


Command                                 RAD application called  Function
recalc partials                         sla.recalc.totals
                                                                Displays the prompt for
review cc                               cc.setup.manage         recalculating SLA
review im                               apm.setup.manage        information over a given
rmail                                   read mail               time frame.

run                                     exercise                Displays the Service
                                                                Desk Interaction queue.
rv                                      pm.access
sch                                     database                Displays the Incident
schedule                                database                queue.
schmail                                 mail.set.schedule
scknowledge                             get.search.application  Displays the prompt for
                                                                selecting which type of
                                                                internal Service Manager
                                                                mail to read.

                                                                Displays the Application
                                                                Exerciser form for
                                                                testing/running a RAD
                                                                application directly.

                                                                Displays the Incident
                                                                queue.

                                                                Displays the Schedule
                                                                File form.

                                                                Displays the Schedule
                                                                File form.

                                                                Displays the form for
                                                                scheduling background
                                                                mail.

                                                                Displays the
                                                                Knowledgebase search
                                                                form.


Command                                 RAD application called  Function
scmsg                                   database
scripts                                 script.maint            Displays the Service
search cal                              cc.search.incidents     Manager Message form.
search calls                            cc.search.incidents
search incident                         apm.search.problems     Displays the Script
search sla                              sla.search.objects      Definition form.
servcont                                database
shutdown                                system.shutdown         Displays the search form
smail                                   mail.send.appl          for Service Desk
                                                                interactions.
smapplenv                               database
smgroups                                database                Displays the search form
                                                                for Service Desk
                                                                interactions.

                                                                Displays the search form
                                                                for Incident Management
                                                                incidents.

                                                                Displays the search form
                                                                for Service Level
                                                                Agreements.

                                                                Displays the Service
                                                                Contract form.

                                                                Initiates the process for
                                                                shutting down the
                                                                Service Manager server.

                                                                Displays the prompt for
                                                                confirming the sending
                                                                of internal Service
                                                                Manager mail.

                                                                Displays the Service
                                                                Desk Environment form.

                                                                Displays the Service
                                                                Desk Groups form.


Command                                 RAD application called  Function
smprofile                               database
                                                                Displays the Service
software                                database                Desk Security Profile
sol cans                                se.search.engine        form.
spool                                   spool.scheduler
sq                                      database                Displays the Software
                                                                Management form.
start                                   apm.upgrade.main
status                                  system.status           Displays the Pending
stdptrs                                 database                Knowledge Items form.

subtotals                               database                Displays the
syslog                                  database                Spoolheader form.
task                                    query.stored
terminals                               database                Displays the Stored
                                                                Query Maintenance
                                                                form.

                                                                Initiates the Upgrade
                                                                Utility wizard.

                                                                Displays the system
                                                                status form.

                                                                Displays the
                                                                Configuration File form
                                                                for standard printers.

                                                                Displays the Subtotal
                                                                Definition form.

                                                                Displays the System Log
                                                                form.

                                                                Displays a list of the
                                                                user’s change tasks.

                                                                Displays the Terminal
                                                                Configuration form.


Command                                 RAD application called  Function
triggers                                database
tskqueue                                sc.setup.manage         Displays the triggers
unload                                  us.unload               form.
uoperprof                               query.stored
upd                                     pm.access               Displays the Task queue.
userlevel                               us.userlevel
                                                                Displays a list of unload
userstats                               report.userstats        scripts.

usrcmr                                  cm3r.main               Displays the Operator
                                                                Status Display form.
usrdir                                  database
usricm                                  icm.access              Displays the Incident
                                                                queue.
usrknow                                 database
                                                                Displays the current user
                                                                access level and the
                                                                options for changing this
                                                                access.

                                                                Displays the prompt for
                                                                executing the Usage
                                                                Statistics report.

                                                                Initiates the script for
                                                                opening a new change
                                                                request record.

                                                                Displays the Contacts
                                                                form.

                                                                Displays the
                                                                Configuration Item
                                                                Search form.

                                                                Displays the search form
                                                                for Knowledge Base
                                                                information.


Command                                 RAD application called  Function
usrocma                                 ocmo.access
                                                                Displays a list of the
usrocmo                                 ocmo.access             current Request
                                                                Management orders.
validity                                se.search.engine
                                                                Displays the search form
vendor                                  database                for Request Management
                                                                orders.

                                                                Displays the Validity
                                                                Table Specifications
                                                                form.

                                                                Displays the
                                                                Vendor/Manufacturer
                                                                search form.

Contents

     1 Generic command line calls
     2 Direct command line calls


1.2.1.9. Call a RAD application

You can call a RAD application from the following places in Service Manager:

     Display Options
     Format Control
     Scripts
     Processes
     Triggers

When you call a RAD application, you may need to pass the required parameters.
These parameters consist of a parameter name and a value.

            Note

           Service Manager doesn't currently support calls from JavaScript on any
           RAD application that uses the rio/fdisp panels. Avoid calls from JavaScript
           on RAD applications that use the rio or fdisp panels. If you can't avoid
           doing so, always set the RunInNewThread parameter to true. This doesn't
           work for all cases.

To find view the parameters, follow these steps:

   1. Locate the RAD you want to use. See Locate a RAD function.
   2. Click View when you have the RAD application panel displayed. This displays a

     list of parameter to pass.
   3. Position the cursor on each parameter and then click Help to view the name of

     the field used as the parameter.

            Note

           To display the field help, make sure either of the following conditions is
           fulfilled:

                In the Windows client, click Preferences > Service Manager >
                Appearance and then select the Show context-sensitive help
                debug information option.
                In the Web client, viewcontexthelp=true is appended to the URL
                before you log in.


1.2.1.10. Locate a RAD function

To locate a Rapid Application Development (RAD) function, follow these steps:
   1. Click Tailoring > Database Manager.
   2. Type =application in the Form field, and then click Search.
   3. Click More or the More Actions icon and then select Expert Search. Service
     Manager displays a query window.
   4. Type one of the following in the Query field:


Desired search                          Syntax

Search for a function that's not an       index("<function name>",
rtecall function.
                                          str(contents(currec())))>0

                                        Example:
                                        index("jscall",
                                        str(contents(currec())))>0
                                        Returns all the RAD application
                                        panels that contain the jscall
                                        function (to call a JavaScript
                                        function).

Search for all instances of a             index("rtecall(\"<function
particular rtecall function. For this     name>\"",
query to run normally, a backslash
must precede each double quotation        str(contents(currec())))>0
mark within the rtecall
parentheses.                            Example:
                                        index("rtecall(\"rinit\"",
                                        str(contents(currec())))>0
                                        Returns all the RAD application
                                        panels that contain the rinit
                                        function (to initialize a file).


Desired search                           Syntax

Use this syntax to search for all          index("rtecall(\"<first
instances of all rtecall functions         letter>",
beginning with a particular letter (for
example, the letter r ). For this          str(contents(currec())))>0
query to run normally, a backslash
must precede the first set of double     Example:
quotation marks. The closed              index("rtecall(\"s",
parenthesis is unnecessary in this       str(contents(currec())))>0
syntax.                                  Returns all the RAD application
                                         panels that contain a function that
                                         starts with the letter s such as
                                         sort .

5. Click Search. Service Manager displays a record list of RAD panels matching the
  search criteria.

6. Double-click on a panel to display that instance of the function.


1.2.1.11. RAD Debugger

The RAD Debugger enables you to view and isolate RAD processes for the purpose of
troubleshooting. Information about the RAD flow opens in a separate window
containing a scrollable text field. The RAD Debugger uses its own command line
language to trace, display values, and set break points.

Start RAD Debugger

To start the RAD Debugger, follow these steps:

   1. Click Window > Show View > Other > Service Manager Administrator > RAD
     Debugger.

     The RAD Debugger command window opens.

   2. Type the desired command followed by a parameter.
   3. Press Enter.

RAD Debugger commands

The following is a list of the commands used in the RAD Debugger to troubleshoot an
application:

Command                                                                                         Service Manager 9.81
d (display)
                                        Description
dd
dq                                      Displays the contents of a variable. A
t (trace)                               common use of this command is to
                                        display the name of the Display
                                        application Screen ID attached to the
                                        current form.

                                          d $L.screen

                                        Displays the contents of a variable in
                                        the structured format.

                                          dd $L.file

                                        Displays the tag query of a variable.

                                          dq $L.file

                                        Turns tracing on or off. Tracing allows
                                        you to see every panel that the RAD
                                        flow encounters. Use the command by
                                        itself to display the status of the trace
                                        function.

                                          t on
                                          t off
                                          t

 Command                                                                                        Service Manager 9.81
 ta
                                        Description
 tar
 b (breakpoint)                         Turns panel tracing on or off for a
                                        specific RAD application. To turn
This PDF was generated on May 23, 2026  application tracing on, include the
                                        name of a RAD application. To turn
                                        application tracing off, repeat the same
                                        command combination a second time.
                                        You may have multiple traces engaged
                                        at one time. Use the command by itself
                                        to display a list of the RAD applications
                                        being traced.

                                          ta script.execute
                                          ta

                                        Removes all RAD specific panel traces.
                                        If you are tracing multiple applications,
                                        you can save time by using tar rather
                                        than using ta to turn off each trace
                                        individually.

                                        Sets a panel breakpoint. When the RAD
                                        flow encounters a panel with this label,
                                        it halts before executing the named
                                        panel and gives you an opportunity to
                                        perform debugging procedures such
                                        as displaying variables or executing
                                        statements. Repeat the command
                                        combination a second time to turn off
                                        the breakpoint. Execute the command
                                        by itself to display a list of all current
                                        breakpoints.

                                          b init.operator
                                          b

                                                                                                                          Page 48 of 207
 Command                                                                                        Service Manager 9.81
 ba
                                        Description
 bt
                                        Sets a breakpoint on a specific RAD
 bv                                     application. A breakpoint is applied
 rb                                     each time the RAD flow enters the
 go                                     named application, either when it runs
 c (continue)                           for the first time or when the flow
 s (step)                               returns to it from a subroutine.

This PDF was generated on May 23, 2026    ba menu.manager

                                        Sets a breakpoint on a specific type of
                                        RAD panel. When the RAD flow
                                        encounters a RAD command panel with
                                        this name, the application stops
                                        running and returns you to the RAD
                                        Debugger. Enter the command
                                        combined with the name of a RAD
                                        panel to set the breakpoint. Re-enter
                                        the same command combination to
                                        turn off the breakpoint.

                                          bt rinit

                                        Set a breakpoint when a variable
                                        changes.

                                        Removes all breakpoints of any type.

                                        Resume execution after a breakpoint.

                                        Resumes the execution of the RAD flow
                                        after a breakpoint occurs.

                                        Steps through the RAD flow one panel
                                        at a time.

                                                                                                                          Page 49 of 207
 Command                                                                                        Service Manager 9.81
 gl (globals)
 v (variables)                          Description
 l (locals)                             Displays all the global variables: those
 sta (stack)                            beginning with $G. , $lo. , $CHART. ,
 re (relations)                         $SYSPUB. , $MARQUEE .
 m (memory)                             Displays all the thread variables: those
                                        not beginning with a special code.
 x                                      Displays all the local RAD variables:
 display                                those beginning with $L .
 h (help)                               Displays the current RAD stack.
 debugadhocsql                          Displays only the variables which are
                                        table relations (file handles initialized
This PDF was generated on May 23, 2026  by the rinit command panel).
                                        Displays all the variables in memory.
                                        This is equivalent to issuing the globals
                                        (g), variables (v), and locals (l)
                                        commands.
                                        Execute a statement.
                                        Display name - view a variable.
                                        Displays a brief summary of the RAD
                                        Debugger commands.
                                        Switch debug adhocsql
                                        Switch on :

                                          debugadhocsql 1

                                        Switch off :

                                          debugadhocsql 0

                                                                                                                          Page 50 of 207
Command                                                                                         Service Manager 9.81
sqldebug
rtm                                     Description
                                        Set sqldebug level [0-3]
                                        Set response time monitor value [0-5]
````
