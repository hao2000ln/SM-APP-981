---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.8 .. 1.1.8.2
printed_pages: 813-848
---

# 1.1.8 Windows client

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.8. Windows client

Service Manager includes both Windows and Web clients. The Windows client is
intended for administrators and implementers, while the Web client is suitable for
most end users. The Windows client enables you to design forms and work with the
dbdict; capabilities that aren't available to the Web client user.

The Windows client includes the following features:

Interface

     A dynamic user interface that you can customize with preferences to change the
     way you interact with perspectives and views
     Windows client update capability

Client/server connection

     A Connection dialog that enables you to define multiple connections to different
     servers and saves them from one session to another
     Automatic connection for connection profiles with the automatic logon option
     enabled

System Navigator

     Favorites folder to save shortcuts to frequently used applications, forms, and
     queries
     Simplified access to forms, files, and records through the System Navigator

Applications

     Application-specific user interface elements
     A graphical workflow used by the Request and Change Management
     applications
     Charts and dashboards to show data graphically

Help

     Field help
     Help for end users and administrators

Other features

     UTF-8 (Unicode) support to display data in any language
     SOAP-based client/server communication


     Automatic reconnection of client/server sessions after brief network connection
     disruptions

Related topics

Clients
Web client
Differences between the Windows and web clients
Accessing Service Manager
Sign in to the Windows client


1.1.8.1. Administration perspective

The Service Manager Administration perspective contains several Service Manager
administrative views. It is easy to show or hide administrative views by selecting or
closing a single perspective instead of each individual view. You can use the
Administration perspective to troubleshoot the user interface or monitor client/server
traffic.

Within the Administration perspective, there are eight available views arranged in tab
format. Each view displays different information.

     Messages
     Console
     Detail Data
     Detail Form
     List Data
     List Form
     Last Request
     Last Response

            Note

           Views and perspectives are available in the Windows client only.

Console view

Note: Views are available in the Windows client only.

The console view displays the information sent to the system log, depending on the
logging level. If you enable SOAP tracing from the Connection Dialog, SOAP
messages also appear. If an error occurs, you may also see error messages or a stack
trace from the Java Runtime Environment (JRE). If you are an administrator, you might
want to monitor the console during normal activities instead of locating the sm.log file
and opening it with a text editor. Ensure that you do the following:

     Specify the sm.log file in the Window > Preferences > Service Manager > Logs
     preferences.
     Ensure that the log file is accessible from your client.

Stopwatches view


The Stopwatches view is an administrative tool that lists information about the number
of milliseconds required for some Service Manager client operations. This view shows
the number of individual service desk interactions, the shortest time (Min), the longest
(Max) time, the average, and the total time. It is helpful for troubleshooting.

The number of displayed operations varies. They are neither configurable or
predictable because they depend on your Service Manager installation and current
actions. The following table lists some operations that might appear in this view.

Operation                               Purpose
Form.generate
Generator.generate                      The elapsed time to render the form
Navigator.getChildren                   using information sent by the server.
SOAP.transact
                                        The elapsed time required to retrieve a
XSL.transform.jdom                      System Navigator branch from the
                                        server.

                                        When you click a closed node in the
                                        System Navigator, the elapsed time
                                        required to expand that node and
                                        render content.

                                        the elapsed time to exchange one
                                        message between the client and
                                        server. The stopwatch starts when the
                                        client sends the message and stops
                                        when it receives the server response.
                                        This time doesn't include message
                                        processing.

                                        The elapsed time for XSL
                                        transformation of forms and menus.

Click the appropriate icon to modify the Stopwatches view.


Icon                                    Function

                                        Refresh all stopwatches.
                                        Reset all stopwatches.

                                        Save current stopwatches state in the
                                        log file.

XML views

The Administrator perspective contains these views that display data exchanged
between the client and server.


View name    What’s in this             Use this view to   Related capabilit
Detail Data  view?                                         y word
                                                           Requires the
Detail Form  Displays all data          Trace or debug     Debug capability
List Data    in the records (in         Service Manager    word.
List Form    XML format) that           transactions.
             populate the                                  Requires the
             current form. For                             Debug capability
             example, this                                 word.
             view shows
             related query                                 Requires the
             information, as                               Debug capability
             well as RAD-                                  word.
             defined variable
             values,                                       Requires the
             associated                                    Debug capability
             displayoptions,                               word.
             and messages.

             Displays the form          Trace or debug
             fields (in XML             Service Manager
             format) in the             transactions,
             current form.              Dynamic View
                                        Dependencies
                                        (DVD), or display
                                        applications.

             Displays all               Trace or debug
             records (in XML            Service Manager
             format) that               queries.
             appear in the
             current record
             list.

             Displays the form          Trace or debug
             fields (in XML             Service Manager
             format) for the            queries.
             current record list
             form.


View name      What’s in this           Use this view to Related capabilit
               view?                                           y word

Last Request   Displays the             Trace or debug  Requires the
               XML-formatted            client/server   Debug capability
               action, modified         communication.  word.
               data, and cursor
               position of the
               last request sent
               from the client to
               the server.

Last Response  Displays the             Trace or debug  Requires the
               XML-formatted            client/server   Debug capability
               data of the last         communication.  word.
               response sent
               from the server to
               the client.

Administrative views

You can select Service Manager views individually to create a customized workbench
or saved perspective.

Administrative and RAD Debugger views appear only if you have the Admin plug-in
installed. Each view displays different information.


View name     Included in               What’s in this      Use this view to
Console       this perspective          view?
Detail Data
              Service                   Displays log        Review log
Detail Form   Manager Administ          messages for the    messages.
Last Request  rator                     client, depending
                                        on your log
                                        preferences.

              Service                   Displays all data   Trace or debug
              Manager Administ          in the records (in  Service Manager
              rator                     XML format) that    transactions.
                                        populate the
                                        current form. This
                                        view shows
                                        related query and
                                        SLA information,
                                        as well as RAD-
                                        defined variable
                                        values,
                                        associated
                                        display options,
                                        and messages.

              Service                   Displays the form   Trace or debug
              Manager Administ          fields (in XML      Service Manager
              rator                     format) that        transactions,
                                        appear in the       Dynamic View
                                        current form.       Dependencies
                                                            (DVD), or display
                                                            applications.

              Service                   Displays the        Trace or debug
              Manager Administ          XML-formatted       client/server
              rator                     action sent from    communication.
                                        the client to the
                                        server.


View name      Included in              What’s in this       Use this view to
Last Response  this perspective         view?
List Data
               Service                  Displays the         Trace or debug
List Form      Manager Administ         XML-formatted        client/server
Properties     rator                    response sent        communication.
RAD Debugger                            from the server to
Stopwatches                             the client.

               Service                  Displays all         Trace or debug
               Manager Administ         records (in XML      Service Manager
               rator                    format) that         queries.
                                        appear in the
                                        current record
                                        list.

               Service                  Displays the form    Trace or debug
               Manager Administ         fields (in XML       Service Manager
               rator                    format) for the      queries.
                                        current record list
                                        form.

               Service                  Displays the         Troubleshoot
                                                             form problems.
               Manager Administ properties of the

               rator                    current form.

               Service                  Isolated RAD         Troubleshoot RAD
                                                             processes.
               Manager Administ processes.

               rator

               Service                  Displays timing      Identify slow
               Manager Administ         information about    processes or
               rator                    Service Manager      opportunities for
                                        processes.           system tuning.


View name       Included in              What’s in this        Use this view to
                this perspective         view?

Script Library  Service Manager          Displays a tree       Access Script
Explorer        Administrator            view of Service       Library.
                                         Manager Script
                                         Library records.

Dashboard       Service                  Displays one or       Compare data
                Manager Interfac         more charts.          visually.
                e

Messages        Service                  Displays client       Review log
                Manager Interfac         messages,             messages.
                e                        depending on
                                         your log
                                         preferences.

Secondary       Service                  Displays another      Add another
                                         view of the           navigation view to
System Navigator Manager Interfac        System Navigator      access all Service
                                         at the bottom of      Manager
                e                        the workbench.        components.
                                         You can move
                                         this second view
                                         to another
                                         location.

System Navigator Service                 Displays a tree       Access all
                       Manager Interfac  view of Service       Service Manager
                       e                 Manager               components.
                                         applications,
                                         utilities, and data.

Access an administrative view

Applies to User roles: Administrator


The administrative view provides additional panes to display different types of
information that may be useful in a debug or problem solving situation for an
administrator. In the out-of-box system, the messages and system navigator panes
are standard views.

To access an administrative view:

   1. Click Window > Show View > Other.

   2. Expand the Service Manager Administrator folder. Choose one of these views:

     • Console
     • Detail Data
     • Detail Form
     • Last Request
     • Last Response
     • List Data
     • List Form
     • Properties
     • RAD Debugger
     • Stopwatches
     • Web Preview


1.1.8.2. Preferences

You can customize the way you view the Windows client by changing settings in
Preferences dialog.

If you are an administrator, you can configure a common set of Windows client
preferences. For example, you can ensure all users have the same log file, security,
and help server settings.

Administrators also have the option to set Windows client preferences in the sm.ini
file. These preferences override any conflicting settings that appear in the Windows
client Preferences dialog.

Administrators can configure a common set of Web client preferences in the ../WEB-
INF/web.xml file. Thereafter, these preference settings apply to all Web client
sessions.

If you are an end user, you can change default settings to customize your Windows
client environment. For example, you can change some appearance, chart, and spell
checking properties.

There is a Preferences filter available that enables you to filter preferences so that
only a few preferences are displayed or a specific preference set (for example
Appearance) is displayed. By typing the beginning letters or complete name of the
preference setting in the Preferences filter text box, you can filter the list so only
those preferences that match what you type appear in the list.

Related topics

Appearance preferences
Log preferences
Security preferences
Spell Checker preferences
Client parameters for web clients
Set Windows client preferences


1.1.8.2.1. Set Windows client preferences

Applies to User roles: All roles

To set Windows client preferences:

   1. From the Service Manager menu bar, click Window > Preferences.
   2. Expand the Service Manager Preferences filter:
   3. Highlight the following filter settings to update your preferences:

           Service Manager
           Appearance
           Charts
           Logs
           Security
           Spell Checker
   4. Expand the Help Preferences filter.
   5. Highlight the following filter settings to update your Help preferences:
           Help
           Help Server
   6. Restart the client for these preferences to take effect.

Related topics

Preferences
Appearance preferences
Log preferences
Security preferences
Spell Checker preferences
Client parameters for web clients


1.1.8.2.1.1. Appearance preferences

This Preferences dialog enables you to customize the Windows client.
To access appearance preferences, from the Service Manager menu bar click
Window > Preferences > Service Manager > Appearance.


Preference                              Description             Default setting
Use server provided tab
order                                   The default Windows tab False
                                        order is from left to right,
Show Messages View                      and top to bottom. When
when new messages                       you specify a custom tab
occur                                   order with Forms
Skip readonly controls                  Designer, the server
when tabbing                            follows this order.

Prompt for save                         Enable a view to display False
                                        messages.
Show detail pane with
record list                             Enable so that read-only False
Sort menu items                         fields will be skipped
alphabetically in the                   when tabbing through a
System Navigator                        form.
Show context-
sensitive help debug                    Prompt to save          True
information
                                        information before you

                                        leave a form.

                                        Display the record list at True
                                        the top of a form.

                                        Display System          True

                                        Navigator menu items

                                        alphabetically.

                                        Display context-sensitive True
                                        help test information.


Preference                              Description                  Default setting
Font
                                        Specifies the primary        Varies depending on the
                                        font used by Service         language pack
                                        Manager.                     installation

                                        Hewlett-Packard delivers
                                        Service Manager with a
                                        default font for each
                                        language. For example,
                                        in English, Tahoma
                                        Regular is the default
                                        font. In Japanese, MS UI
                                        Gothic is the default font.
                                        Although you can
                                        change the font face and
                                        size, we recommend the
                                        default font for the best
                                        results. Font sizes larger
                                        than 8 points may
                                        produce unpredictable
                                        results.

Percentage to increase                  Specify a percentage to 0
form width                              increase the width of the
                                        forms. Useful to display
                                        localized forms that may
                                        require more space to
                                        display translated text.

Related topics

Preferences
Service Manager preferences
Log preferences
Security preferences
Spell Checker preferences
Client parameters for Windows clients
Set Windows client preferences


1.1.8.2.1.2. Service Manager preferences

This Preferences dialog enables you to customize the Windows client.
To access Service Manager preferences, click Window > Preferences > Service
Manager.


Preference                              Description                 Default setting
Client printing
                                        This preference allows True
Client side load/unload                 users to access the
                                        client-side printing
Use form caching                        feature by using the Print
                                        icon in the Windows
                                        client. Web and Windows
                                        clients can also use the
                                        Print commands
                                        supplied by the web
                                        browser or Windows
                                        operating system.

                                        This preference             True

                                        determines the

                                        destination of unload

                                        files. When enabled,

                                        Service Manager saves

                                        unload files on the client

                                        system. When disabled,

                                        Service Manager saves

                                        unload files on the

                                        server. Requires a client

                                        restart to take effect.

                                        Form caching improves True
                                        server responsiveness
                                        by reducing the need to
                                        load forms.


Preference                              Description                Default setting

Record list request count This preference                          32

                                        specifies the number of

                                        records the client

                                        requests from the server

                                        when displaying a record

                                        list. The user can view

                                        additional records in the

                                        record list by advancing

                                        to the next page of

                                        records or by using the

                                        go to page option. The

                                        default value is set to

                                        maximize the server’s

                                        response time to client

                                        record requests. The

                                        fewer records the client

                                        requests of the server

                                        the faster the server can

                                        answer the query.

Image path                              This preference            None

                                        specifies the path to any

                                        custom images you want

                                        the Windows client to

                                        use. System

                                        administrators may use

                                        this preference to

                                        customize the Windows

                                        client to use custom

                                        branded images.


Preference                              Description                Default setting

Display names of                        This preference            False
missing images
                                        determines if the

                                        Windows client displays

                                        the name and of any

                                        missing images. This

                                        preference is intended to

                                        make customizing the

                                        Windows client easier.

DDE server name                         This preference            HP_Service_Manager
                                        determines the name the
                                        Windows client uses
                                        when acting as a DDE
                                        server for integrations
                                        with DDE applications
                                        such as computer
                                        telephony integration
                                        (CTI).

Show line number                        This preference displays True
                                        line numbers in the
                                        comparison window
                                        when you perform
                                        application upgrades or
                                        apply application
                                        patches.

Related topics

Preferences
Appearance preferences
Log preferences
Security preferences
Spell Checker preferences
Client parameters for Windows clients
Set Windows client preferences


1.1.8.2.1.3. Log preferences

You can set log preferences to control how Service Manager logs and displays
messages.
To access log preferences in the Windows client, click Window > Preferences >
Service Manager > Logs.


Preference                              Description                  Default setting
Use a specific file
                                        If you want to use a         The default log file is
Message level for                       specific log file, type the  C:\Users\
console view                            path and name of the file    <username>\ServiceMan
                                        or browse to its location.   ager\workspace\.metada
                                                                     ta\.log.

                                        Choose the severity of None
                                        messages that appear in
                                        the Console view. Select
                                        these logging options:

                                        None
                                        Debug, Info, Warning, an
                                        d Error messages
                                        Info, Warning, and Error
                                        messages
                                        Warning and Error
                                        messages
                                        Error only messages

Message level for log file              Choose the severity of       Error only
                                        messages that appear in
                                        the log file.

                                        Error only
                                        Debug, Info, Warning,
                                        and Error messages
                                        Info, Warning, and Error
                                        messages
                                        Warning and Error
                                        messages
                                        None

Append exception trace                  Add the stack trace of False
to log option                           the associated exception
                                        to the log.


Related topics

Preferences
Appearance preferences
Security preferences
Spell Checker preferences
Client parameters for web clients
Set Windows client preferences


1.1.8.2.1.4. Security preferences

Security preferences point to the location of the CA certificate keystore, client
certificates, and private keys.
To access Security preferences in the Windows client, click Window > Preferences >
Service Manager > Security.


Preference                              Description                 Default value
FIPS Mode
                                        Enables FIPS mode in        Disabled
                                        the Windows Client.

                                        When FIPS mode is
                                        enabled on the server
                                        side (that is, fipsmode:2
                                        is specified in the
                                        server's sm.ini file), you
                                        have the option to enable
                                        FIPS mode in the
                                        Windows Client. For
                                        more information, see
                                        Configuring FIPS mode
                                        in Service Manager.

                                        Caution

                                        Do not
                                        enable this
                                        option when
                                        the Service
                                        Manager
                                        Server is
                                        using the
                                        fipsmode:1
                                        legacy
                                        configuration
                                        in the
                                        server's
                                        sm.ini file.


Preference                              Description                 Default value
JCE provider name                                                   JsafeJCE
                                                    Note

                                                   This option is
                                                   provided
                                                   only for
                                                   backward
                                                   compatibility.
                                                   Use it only
                                                   when the
                                                   Service
                                                   Manager
                                                   Server is
                                                   using the
                                                   fipsmode:1
                                                   legacy
                                                   configuration
                                                   in the
                                                   server's
                                                   sm.ini file.

                                        Specify the name of a
                                        FIPS-certified third-party
                                        JCE provider you use for
                                        the Windows client.

                                                    Note

                                                   This option
                                                   becomes
                                                   read-only
                                                   when the
                                                   FIPS Mode
                                                   checkbox is
                                                   selected.


Preference                              Description                 Default value

JCE provider class name                                             com.rsa.jsafe.Provider.Js
                                                                    afeJCE
                                                    Note
                                                                                Note
                                                   This option is
                                                   provided                    This option is
                                                   only for                    provided
                                                   backward                    only for
                                                   compatibility.              backward
                                                   Use it only                 compatibility.
                                                   when the                    Use it only
                                                   Service                     when the
                                                   Manager                     Service
                                                   Server is                   Manager
                                                   using the                   Server is
                                                   fipsmode:1                  using the
                                                   legacy                      fipsmode:1
                                                   configuration               legacy
                                                   in the                      configuration
                                                   server's                    in the
                                                   sm.ini file.                server's
                                                                               sm.ini file.
                                        Specify the class name
                                        of a FIPS-certified third-
                                        party JCE provider you
                                        use for the Windows
                                        client.

                                        Note

                                        This option
                                        becomes
                                        read-only
                                        when the
                                        FIPS Mode
                                        checkbox is
                                        selected.


Preference                              Description                Default value

CA certificates file                    Specify the path to a      Service Manager has an
                                        keystore of Certification  out–of–box example of
                                        Authorities (CA) used to   this file in \
                                        certify the client and     <Web Tier>\WEB-
                                        server certificates.       INF\cacerts.

CA certificates password Specify the password to                   None.
                               access the CA
                               certificates file.

Client keystore file                    Specify the path to the    None. You must create
                                        keystore containing the    this file.
                                        client certificate and
                                        associated private keys.

Client keystore password Specify the password to                   None.
                               access the client
                               keystore.

Related topics

Preferences
Appearance preferences
Log preferences
Spell Checker preferences
Client parameters for web clients
Configuring FIPS mode in Service Manager
Set Windows client preferences


1.1.8.2.1.5. Spell Checker preferences

These preferences specify how to customize the spell checker. To access Spell
Checker preferences in the Windows client, click Window > Preferences > Service
Manager > Spell Checker.

You can select or clear General Options, customize the dictionary, and choose one of
these language dictionaries:

     American English
     British English
     French
     German
     Italian
     Spanish

Note: You must select a custom dictionary if you want to add new terms.

Spell checker custom dictionaries

You can configure the Service Manager Windows client to use a custom dictionary
when running the spell checking utility. You can save a custom dictionary file on a
network share and then use the Client Packaging Utility to direct the Windows clients
to the network path.

Change the spell checker dictionary

Applies to User roles: Administrator

You must have administrative access to the server operating system to use this
procedure.

To change the spell checker dictionary:

   1. Sign in to the Windows Client.
   2. Click Windows > Preferences.

     The Preferences window opens.
   3. Click Spell Checker Options.

     The Spelling Preferences window opens.
   4. From the Language box, select the language dictionary you want to use.
   5. To define a custom dictionary, click Browse.

           Type or browse to the path of your custom dictionary.
           You can either create your own file or use the default custom dictionary file


         customdict.tlx provided in the
         plugins\com.hp.ov.sm.client.eclipse.user_version_number\spellchecker
        folder.
        Click OK.
6. To add correction entries to the custom dictionary, click Edit.
  The Edit user dictionary window opens.
        To add a new correction entry to the dictionary, type the misspelled word in
        the Words field.
        Type the correction in the Other word field.
        Select an Action from the available list.
        Click Add word.
        Repeat these steps for each custom correction entry you want to add.
7. Select any other spelling preferences you want to use.
8. Click OK.


1.1.8.2.1.6. Help preferences

This Preferences dialog enables you to customize the way Service Manager help
information is displayed.
To access Help preferences, click Window > Preferences > Help.


Preference                              Description               Default setting

Use external browser                    Opens the Service         False

                                        Manager help in your

                                        default web browser. By

                                        default, Service Manager

                                        opens the help in a Help

                                        View window.

Open window context                     Opens window context True
help in a dynamic help                  help information in a
view                                    dynamic help view.

Open window context                     Opens window context False
help in an infopop                      help information in a
                                        pop-up information
                                        window.

Open dialog context help Opens dialog context                     True

in dialog tray                          help information in the

                                        dialog tray.

Open dialog context help Opens dialog context                     False

in an infopop                           help information in a

                                        pop-up information

                                        window.

Show all potential hits                 Shows all records that True
(faster)                                fully or partially match
                                        your search criteria.

Show only actual hits                   Shows only records that False
                                        fully match your search
                                        criteria.

Related topics

Preferences
Appearance preferences
Log preferences
Security preferences


Spell Checker preferences
Help Server preferences
Client parameters for Windows clients
Set Windows client preferences


1.1.8.2.1.7. Help Server preferences

This Preferences dialog enables you to specify your Help Server settings so that you
can access the online help documentation by clicking Help > Help Contents from the
Windows client. Service Manager launches the help contents from the URL as you
specified in the Help Server URL field.

To access Help Server preferences, click Window > Preferences > Help> Help
Server.

Preference                              Description  Default setting
Use a Help Server to
access documentation                    Enables you to access False
                                        the online help from
Help Server URL                         Service Manager.

                                        Specifies the URL of the None
                                        help server. For example,
                                        /doc/Service_Manager/
                                        9.xx/Home .

Related concepts

Preferences
Appearance preferences
Log preferences
Security preferences
Spell Checker preferences
Help preferences
Client parameters for Windows clients
Set Windows client preferences


1.1.8.2.2. Setting Windows client
preferences from the server

You can define global Windows client preferences from the sm.ini file available in the
RUN folder of your Service Manager server installation. The client parameters you
define in this file override any individual client preferences. You must have
administrative access to the server operating system to set Windows client
preferences using client parameters.

Set Windows client preferences from the server

You must have administrative access to the server operating system to use this
procedure.

To set Windows client preferences from the server:

   1. Review the list of client parameters for Windows clients and determine which
     parameters you want to define from the server.

  2. Open the sm.ini file in a text editor.
     This file is located in the RUN folder of your Service Manager server installation.

   3. Add or edit the client parameters for Windows clients.
   4. Save the file.

All Windows clients that log in to the Service Manager server use the new client
parameters you defined.

Related topics

Client parameters for Windows clients
````
