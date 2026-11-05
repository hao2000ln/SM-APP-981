---
source: Document/pdf/v981/Release_notes.pdf
version: 9.81
sections: 1.5 .. 1.5
printed_pages: 49-130
---

# 1.5 Release log

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.5. Release log

The Service Manager release log is a cumulative list of features introduced in each
release. When you perform a one-step upgrade from a much older release, you skip
various intermediate versions. This log helps you with a quick review of all the new
features that were added for each release version.

9.80

User experience

Activities feature improvement

Service Manager 9.80 enhances the Activities feature by embedding the Journal
Updates Viewer and Activities Viewer widgets in the Activities tab.

    On the Journal Updates tab, the New Updates field is now an HTML Editor control
    that enables you to enter notes with standard HTML formatting. The Journal
    Updates section is now a Journal Updates Viewer widget that displays all notes
    with IT agents' names, portraits, and timestamps in chronological order, improving
    the readability significantly.
    On the Activity logs tab, the Activities Viewer widget replaces the original table
    control and displays all activities for the current record with standard HTML
    formatting. On the right side of each activity record, there is a notable tag with
    different background colors that specifies the update types. To shorten the list,
    you can filter the activities by activity type and user.

For more information, see Forms Designer controls and tools.

Note: If you're working with customized forms and upgrading to version 9.80, you
may need to do some tailoring to adopt the latest changes for the activities feature.
For more information, see HTML formatting for Activities feature.

Auto Complete mode for drop-down fields

In addition to the default startsWith mode, you can now switch the Auto Complete
mode to the contains mode for drop-down fields. For more information, see
combo.autoCompleteMode.

Task attachments of parent records

Now when you open a Problem/Request/Incident/Change task record, you can view
the attachments of its related parent record on the Attachments tab.

Integrations


ALM integration without ALM Synchronizer

In earlier Service Manager versions, when setting up defects and requirements
exchange between Application Lifecycle Management (ALM) and Service Manager
(SM), you need to install the middleware of ALM Synchronizer with its add-in.
However, the committed support for ALM Synchronizer has come to an end on May
31, 2023. As a replacement, the SM-ALM integration is achievable through Integration
Manager (SMIS) alone in Service Manager 9.80. This improvement to the SM-ALM
integration brings the following key benefits:

    Eliminates installation and the dependency on the ALM Synchronizer and its add-
    ins
    Avoids the compatibility and upgrade issues between the various software
    versions of SM, ALM, and the middleware
    Aligns with other SM integrations and simplifies the configuration process by
    using SMIS

For more information, see ALM.

Atlassian Jira integration

The SM-Jira integration seamlessly incorporates Service Manager Incident/Change
Management into Atlassian Jira Software's Bug/New Feature issue types and
improves the efficiency of agile teams. Out of the box, this integration supports the
following scenarios.

    Synchronizing Service Manager Incident with Jira bug (SM Incident -> Jira Bug)
    Synchronizing Service Manager Change with Jira new feature (SM Change -> Jira
    New Feature)

For more information, see Atlassian Jira.

Java 17 support

To align with Oracle Java SE Support Roadmap, Service Manager 9.80 drops support
of Java 11 and now operates on Java 17.

Rebranding

OpenText rebranding

This release implemented product rebranding to align with OpenText styles. You'll
see a revamped login screen for the Service Manager software interface. However, if
you had previously customized the logos, please note that they may not appear as
appealing as before. For more information, see Branding the web client.


Web client branding enhancement

Now you can change the background color and the primary color of the main page.
For more information, see Branding the web client.

Security improvements

TLS 1.3 support

Service Manager supports TLS 1.3 in this release. To enforce the TLS 1.3 protocol, see
TLS 1.3 support and configuration.

OpenSSL upgrade

OpenSSL is now upgraded to version 3.0, which is the latest Long-Term Support (LTS)
release of the OpenSSL library.

Consistency of encryption key

The system checks if the encryptionkey value is consistent on each host when you
start the Service Manager server.

Miscellaneous improvements

Installation

Service Manager 9.80 consolidates the language packs into one installer in the
Language Pack installation package for Windows installation. You can run the installer
(setup.exe) to start the installation on Windows, and then select one or more language
packs you want to install. For more information, see Install the Service Manager 9.80
language packs.

Notifications

    Now you can use the Save the email attachments to records option to store the
    attachments of a smart email to an interaction, an incident, or a change record
    where the smart email resides. For more information, see Configure Smart Email
    settings.
    When sending an email, you can configure the Cc and Bcc recipients in either the
    Send HTML Email rule or the Notification table. For more information, see Add a
    Send HTML Email rule and Add a notification definition record.
    Note: The Cc and Bcc functions don't work if a Smart Email consists of tokens.

License report

The ESS license information is now available when you generate a license report by
using commands or when you view/export the license information from Scorecard.


Remove contents from adaptive learning

You can now remove unwanted content from adaptive learning. For example, you may
remove the email address or phone number contents so the system won't index these
words and phrases for search. For more information, see Configure data cleansing.

Case sensitivity

You can set case sensitivity at Oracle database user session level, which requires
less database privileges. This is helpful especially in cloud environments. For more
information, see Set case-sensitivity at Oracle database session-level.

Supportability

Background process troubleshooting
In addition to debugging with the rtm:3 parameter, now you can use the
ScheduleInfo JavaScript to print background process information to log when the
scheduler processing a schedule record. For more information, see Print background
process information to log.

Login audit
The authentication mode information is also included in the syslog file.

The sqltimeoutlimit parameter for long queries
The sqltimeoutlimit parameter is introduced to stop long queries on expert search and
advanced filter. When the query execution time is longer than the time set in the
sqltimeoutlimit parameter, the query will be terminated in Oracle server.

Added support

Service Manager adds support for the following operating systems and technologies.

    Novell SUSE Linux Enterprise Server 15 SP5
    Rocky Linux 9.3
    SQL Server 2022
    PostgreSQL 15, 16
    Oracle Identity and Access Management 12 or higher
    IBM WebSphere Application Server Liberty 23.0.0.12
    JBoss Web Server (JWS) 5.7
    Azure AD as the LDAP server
    Microsoft Hyper-V 2022
    JAWS Screen Reader software version 2024

New parameters, commands, and files

The following parameters, commands, and files were introduced in this release.


    sqltimeoutlimit
    jsaccesscheckforadmin
    mbeanclientlogin
    tooltipAutoHide
    combo.autoCompleteMode

Parameter changes

The following table lists the parameter changes in this release.

    Smart Search Settings >Page size for drop-down list of library field filters
    sslEnabledProtocols
    pgsslEnableProtocols
    ciphers
    pgsslEnableCiphers

9.72

Drop Internet Explorer 11 support

To align with Microsoft's announcement, Service Manager 9.72 discontinues the
support of Internet Explorer 11. The system displays a warning page if customers try
to access the web client with Internet Explorer. Instead, we recommend using one of
these certified browsers: Microsoft Edge, Mozilla Firefox, or Google Chrome. Note
that the Internet Explorer mode in Microsoft Edge isn't supported as well.

By following the overall approach, we strongly recommend the customers who need
the Applet-sensitive features (including telephony (CTI), workflows, and CI
visualization) in Service Manager adopt the following alternative solutions:

    Customers who are working with the legacy method in Service Manager web
    client inbound CTI implementation can adopt the new method. The new method
    uses native HTML and JavaScript instead of the CTI applet, and therefore
    eliminates the dependency on your browser's ability to support Java applet
    technology.

    Customers who are using Java Applet to view workflows can upgrade the Classic
    Service Manager to the Codeless mode, and then view the diagrams in Process
    Designer workflows.

    Customers who are using Java Applet for CI visualization can use one of the
    following solutions.

         Use the default diagram viewer that has been refined to view the native
         graphs


         Integrate with UCMDB server and CMS gateway, and then use the new CMS
         Topology control to view the CI Topology graph and CI Impact Service graph

         Integrate with UCMDB server and UCMDB UI, and then use UCMDB UI
         widgets to view the CI Topology graph and CI Impact Service graph

   For more information about the CMS Gateway, see the CMS Gateway overview
    topic in the Universal Discovery and CMDB Help Center. For more information
    about the CMS Gateway settings, see How to add UCMDB connection information.

Security improvements

Two-Factor Authentication (2FA) support

Service Manager now supports Two-Factor Authentication (2FA) to verify the identity
of end users. For more information, see Two-Factor Authentication.

Key management for smmasterkey

You can now rotate and change the storage location of smmasterkey . For more
information, see Key management for smmasterkey.

HTTP/HTTPS basic authentication

Based on the RFC 2617 authentication scheme, the colon (":") character is not allowed
to be used in usernames. For more information, see Solution.

This update includes changes in Service Manager server. To work with this update,
you need to use Service Manager 9.72 server.

Integration

Microsoft Teams integration

    When an IT agent updates a record or requires further communication, Service
    Manager automatically routes a new notification to Microsoft Teams as a timely
    reminder. For example, when the status of an Incident becomes Resolved, the
    contact of this Incident will receive a message from the integration operator on
    Teams that claims Incident IM##### has been resolved. The specific settings for
    sending messages are defined either on the Notification Definition form or in
    Service Manager Rule Sets.

    For more information, see Set up Teams notification.

    The new release supports localization for the Microsoft Teams virtual agent.
    Languages including Arabic, French, German, Italian, Japanese, Simplified
    Chinese, Spanish, Brazilian Portuguese, and Korean are supported. The virtual


    agent may display unduplicated language selections based on the operator's and
    system language settings in Service Manager, and Microsoft Teams environment
    language.

    For more information, see Set up virtual agent.

ALM Octane integration

In the integration between Service Manager (SM) and ALM Octane in your release
lifecycle, Service Manager acts as the service provider and tightly couples
features/defects management in ALM Octane with the Change Management
capability in SM. During SM Change implementation, the integration between Service
Manager and ALM Octane synchronizes SM Changes to ALM Octane defects/features
so that they can be managed, tracked, and resolved more efficiently and more user-
friendly through Octane's full lifecycle management of defects/features.

For more information, see ALM Octane.

Integrate with Confluence Knowledge Management

With the Confluence connector, Service Manager Smart Analytics now extracts both
Cloud and on-premises Confluence pages and then executes natural language
processing for Knowledge Management.

Service Manager 9.72 doesn't include new Smart Analytics packages. The latest
Smart Analytics packages are shipped with the Service Manager 9.71 Patch 1 release.
See Overview of Service Manager 9.7x Releases for Smart Analytics download, and
see Smart Analytics installation for detailed installation instructions.

SM-SMAX Case Exchange

Service Manager now utilizes an updated API to make the SM-SMAX Case Exchange
integration work. For more information about the API update in SMAX, see
Authentication endpoint service.

SM-UCMDB integration

UCMDB 2022.11 introduces a new version of the ServiceManagerEnhancedAdapter9-
41 adapter that is included in the release. The SM-UCMDB integration functions are
unaffected by this update.

Accessibility

Service Manager Collaboration CVAA improvement

The Twenty-First Century Communications and Video Accessibility Act (CVAA) is an
accessibility law that seeks to level the field for people with disabilities. As an instant


messaging solution combining IT Collaboration and End User Chat, Service Manager
Collaboration now has the following accessibility improvements to make the chat
function more accessible to an end user.

Conversation in Accessible view

    When an IT agent moves the focus to the Chat Request button, Service Manager
    displays a meaningful label that includes the number of incoming chat requests.
    The chat request panel now provides a More link to each chat request. An IT
    agent can move the focus to the More link and then press Enter to view the detail
    of a chat request.
    In a conversation window, an IT agent can move the focus to the More button to
    view the detail of a chat request. In addition, when the focus is on the ... button, a
    screen reader (JAWS) can recognize this button and indicate that there is a pop-
    up menu.
    When adding participants to a conversation, a screen reader (JAWS) can now
    recognize the participants panel as a tree. An IT agent can use the corresponding
    keystroke to operate quickly.
    When an IT agent presses Alt+Ctrl+V to check the coming chat request
    notification, a screen reader (JAWS) now provides hints so that this IT agent can
    press Enter to start a conversation.

Conversation in Self-Service Accessible view

    An end user can press Alt+Ctrl+C to open the chat window and start a
    conversation.
    A screen reader (JAWS) can recognize and read out the live messages.

User experience

Service Manager Survey

Service Manager Survey templates now support images. You can add images to the
answers to surveys so that the questionnaires in both the SMA Service Portal and the
Employee Self-Service (ESS) Portal display the survey answers with vivid icons.
Meanwhile, you can also adjust the layout of the answers.

For more information, see Create a survey template.

Service Catalog

    The Dynamic Field Validations of a user option now include a new Read-Only
    Condition. When a customer orders a Service Catalog item, Service Manager
    displays a user option as read-only or editable. This display depends on the


    condition validation. For more information, see Add user selections in a Service
    Catalog item.
    Now you can configure the default values for a user selection in a Service Catalog
    item.​ For more information, see Add user selections in a Service Catalog item.
    Now when you are editing the detailed description of Service Catalog items in the
    HTML editor, you can work with the Insert an image, Insert a link toward an
    attached file, and Insert a link toward another record features.

Miscellaneous improvements

Documentation

We have added IdM to the Cloud deployment documentation as an optional
component. IdM is required if you want to configure the SAML-based single sign-on
or OIDC-based single sign-on with an external identity provider.

For more information, see Install Identity Manager (IdM) on AWS and Install Identity
Manager (IdM) on Azure.

Added support

Service Manager adds support for the following operating systems and technologies:

    Red Hat Enterprise Linux 8.4, 8.6, 9.0
    Oracle Enterprise Linux 8.6, 9.0
    Novell SUSE Linux Enterprise Server 15sp4
    Windows Server 2022
    Windows 11 Pro
    PostgreSQL 14
    IIS (bundled with Windows Server 2022)
    iOS 16.x
    Android 13.x
    Microsoft Hyper-V 2022

For more information, see the Support Matrix.

New parameters, commands, and files

The following parameters, commands, and files were introduced in this release.

cms.truststore
cms.truststore.password
sm -keyrotate:n
sm -keyexport
sm -keyimport


9.71

Platform

Java 11 support

To align with Oracle Java SE Support Roadmap, Service Manager 9.71 drops support
of Java 8 and now operates on Java 11.

Microsoft Teams integration

Microsoft Teams is a chat-based workspace in Microsoft 365 that provides built-in
access to team-specific resources. The integration between Service Manager and
Microsoft Teams is a simplified collaboration model that enables people to exchange
information rapidly and provides automated procedures to create and manage tickets.

Compared to traditional collaboration ways, the Teams integration provides the
following highlights:

    Ensure speedy resolution of critical issues by allowing IT agents to open Teams
    conversations directly from a major Incident.
    Reduce manual work, improve productivity and efficiency by automating the
    creation and management of Service Manager tickets directly in Microsoft Teams
    through an agent bot.
    Reduce IT support costs by providing knowledge article links and automating the
    creation of Service Desk tickets through a virtual agent.

For more information, see Microsoft Teams.

Scorecard

The landing page of the scorcard is newly introduced to provide a quick overview of
servlet, license, and user information.
From the scorecard interface, the User Information module is now available for
administrators to view the following information:

    Client type: The number of users that currently logged in to the system based on
    each client type
    History of online users: The total number of users logged in at particular point of
    time
    User login history: When any user logs in, the information will be recorded in the
    login history for tracking purposes
    You can filter the user login history by selecting:

         Host name
         Process ID


         License type
         Client type
         Username

The Settings icon is newly added for administrators to configure the Scorecard
settings.

For more information, see Scorecard.

High availability support

Background process high availability support

Service Manager background processes support high availability and a Service
Manager production system can process the tasks in the scheduled queue more
efficiently. In the event of server restart or server failure, the other servers continue to
work on the same class of tasks. For more information, see Set up background
processes with high availability.

High availability PostgreSQL with Patroni

You can now create a PostgreSQL High Availability cluster with Patroni, Etcd, and
HAProxy/F5 on RHEL8 environments. For more information, see High availability
PostgreSQL with Patroni.

High availability setup documentation

The Set up high availability environment topic is now available and provides
consolidated information about how to set up high availability across Service Manager
components.

Security improvements

OAuth 2.0 authentication support

You can now configure the OAuth authentication in IdM to verify the identity of end
users. For more information, see OIDC-based Single Sign-On.

Smart Email

    Smart Email now supports TLS1.2 when connecting to an email server by using
    either the IMAPS or POP3S protocol.
    Service Manager now supports OAuth 2.0 authentication with delegated
    permissions when using EWS to connect to a mailbox for Smart Email. For more
    information, see Set up inbound email.

Service Manager Security Guide


The Service Manager Security Guide is updated for Service Manager 9.6x and 9.7x
systems. This guide is intended for Service Manager implementers and system
administrators who need to implement their Service Manager environment in a secure
manner.

Miscellaneous improvements

Service Catalog

A Service Manager Service Catalog administrator can now define JavaScript to get
external data and populate one or more related fields for a user selection in a Catalog
item. After the Service Catalog administrator defines the JavaScript for a user
selection in Service Manager, the system will populate one or more related fields with
the value returned by this JavaScript. An end user can fill these fields as required
when ordering this Catalog item from the ESS portal or SMA Service Portal. For
details, see Add user selections in a Service Catalog item or bundle.

Note: To use this feature, the Display Type of a user option must be Text and the
Type of this user option must be String.

Feature Tracker

    The Related Objects section now has pagination.
    The Search Feature Tracker Records page now has more filter criteria. By using
    the Open and Closed checkboxes, you can search for the feature or release
    records by the records' current phase. By using the Owned by me checkbox, you
    can search for the feature or release records that you own.

Smart Search

This release supports global search with keywords in Teams conversation by using
the Index Chat History option. For more information, see Manage Smart Search
Knowledgebases.

Enhanced search configuration in Request Fulfillment

When you click Search Requests in System Navigator, the search form now has the
Service and Affected CI fields that enable you to search for a Request record by the
affected CI or affected Service.

Support IDM authentication token in Collaboration

Service Manager Collaboration now supports Identity Manager (IdM) authentication
on the chat server and chat service. For detailed instructions, see Configure IdM
authentication in Collaboration.


Email processing from the eventout

The evprocessed field is newly added to the eventout table to identify whether the
email eventout records are processed ( evproccesed=true ) or not
( evproccesed=false ).
Email processing from the eventout is now dependent on this evprocessed field
instead of the the checkpoint number in the scmail.chk file.
When scemail starts, it reads the evprocessed value and sends emails for the
eventout records with evprocessed set as false , and then update evproccesed to
true when completed (unless the events are deleted by Event Services after
processed).

If you want to re-send emails for some processed records, you can change the value
of the evproccesed field from true to false by using Mass Update.

Added support

Service Manager adds support for the following operating systems and technologies:

    Red Hat Enterprise Linux 8.3, 8.4
    Oracle Enterprise Linux 8.3, 8.4
    Novell SUSE Linux Enterprise Server 15sp2, 15sp3
    iOS 15.x
    Android 11.x
    Red Hat Enterprise Linux 8.5 (Supported as of Service Manager 9.71 patch 1)
    Oracle Enterprise Linux 8.5 (Supported as of Service Manager 9.71 patch 1)

For more information, see the Support Matrix.

New parameters, commands, and files

The following parameters, commands, and files were introduced in this release.

expandSmartSearch
idm.authGroupName
idm.cookieName
ntlogin
idmsyncuser
idmendpoint
idmhttpuser
idmhttppassword
idmssltrustall
idmtruststore
idmtruststorepassword


idmtruststoretype
idmkeystore
idmkeystorepassword
idmkeystoretype
checkAttachmentLegal

9.70

Platform

Service Manager Server 64-bit version

Service Manager Server 64-bit version for both Windows and Linux platform is
available in this release, providing improved performance, stability, usability and
security:

    The 4GB memory limitation for 32-bit applications no longer exists for 64-bit
    applications.
    The cluster deployment is now simplified and can be performed with less effort
    than before.

         The default number of concurrent user sessions for each process is
         increased from 50 to 250;
         The certified range of concurrent user sessions for each process is
         increased from 50-100 to 150-450.
    This version contains a variety updates of 3rd party libraries for stability and
    performance improvement purposes.
    The embedded Mozilla SpiderMonkey JS engine is upgraded to a higher version,
    which introduces the following new enhancements compared with the previous JS
    engine :
         The upgraded JS engine supports 100% JavaScript 5 standard and 75%
         JavaScript 6 standard, while the previous JS engine only supports
         JavaScript 3 standard.
         The IonMonkey JIT JS compiler can directly compile the JS code into the
         native binary code of X86/X64 CPU, so the execution speed is much faster
         than the previous version.
         The upgraded JS engine is written in 64-bit highly efficient C++ 11 code,
         while the previous JS engine is written in 32-bit pure c code.

You can choose one of the following scenarios that best fits your situation to migrate
to the 64-bit platform:

    Perform a new installation of Service Manager 9.70 for both server and
    applications.


    Install the 64-bit server only, while keep your applications in version 9.5x or 9.6x.
    In this case, you need to apply the 64bitCompatible_SM970_SM950.unl unload
    file.
    Install the 64-bit server, and then upgrade your applications from version
    9.3x/9.4x/9.5x/9.6x to 9.70 using the Service Manager 9.70 Upgrade Utility.

For instructions on how to install and configure the Service Manager Server, see
Install the Service Manager Server.

Upgrade JGroups to 4.2.2

This release brings an upgrade of your JGroups (in the RUN/lib directory) to version
4.2.2 to increase performance and stability.

    Upgrade the JGroups .jar file to version 4.2.2. For more information, see Service
    Manager third-party components.
    Upgrade the server configuration files: udp.xml, udpcluster.xml, tcpcluster.xml.
    For more information, see Configuration files.

FIPS

The JCE provider of RSA BSAFE® Crypto-J has reached the end of support. Based on
this fact, this release replaces RSA BSAFE® Crypto-J with Bouncy Castle and
provides the FIPS mode jar. If you are an existing customer, you need to either convert
your existing certificates to BCFKS format or regenerate new BCFKS certificates. For
more information, see Configuring FIPS mode in Service Manager.

As a courtesy, the company provides a new version of the certificate generation
toolkit to help you generate or convert certificates for a Service Manager deployment
in an automated way. For details, see Work with the certificate generation toolkit.

IR stop words

You can now configure the stoplist in the newly introduced IR Stop List Management
tool to define the stop words for IR search in the out-of-box system.

This feature is for Oracle and MS SQL Server databases only. For PostgresSQL
databases, you can still use the existing ir_stoplist parameter to specify your stoplist.

Note:
For Oracle database, IR no longer requires the following additional privileges for
$SM_DB_USER:


  GRANT SELECT ON DBA_LIBRARIES TO $SM_DB_USER;

  GRANT SELECT ON DBA_DIRECTORIES TO $SM_DB_USER;

  GRANT CREATE ANY DIRECTORY TO $SM_DB_USER;

If you have granted these privileges before, you can now revoke some or all of these
privileges as required.

Database reports

Service Manager database report works with third-party reporting tools to provide
visualized reports generated from your queried database view for the purposes of
analysis, data discovery, and so on. You can either review the sample report
configuration in Service Manager to determine which tables, fields, and filters are
used for the development of the report or create your own management reports using
these details. After your customization, you can create the corresponding report
views in the database. To generate visualized reports from your queried database,
you need to use a third-party reporting tool (such as Microsoft Power BI) to access
the Service Manager database and then generate the reports as required.

For more information, see Database Reports.

User experience

SLM visualization

Both the Incident and Interaction queues now provide the Next SLA Target Time and
Next OLA Target Time columns that display the operation status of the Service Level
Targets (SLTs). The progress bars visualize the natural time and the color indicators
show the status of the remaining time for the latest expiring SLTs of a record.

In addition, this release also adds the SLT View tab to the out-of-the-box Incident and
Interaction forms. This tab displays the operation status for all SLA, OLA, UC, and the
related SLTs of a record. The progress bars consist of various color indicators and
visualize the actual working time of the process targets. You can view the definition of
all indicators and duration of a color indicator by tooltips.

For more information, see Visualize Service Level Management.

Scorecard

With Scorecard, the system administrator can get an overview of the in-time and
visualized SM Server health information:


    You can have an overview of system scaling structure and the health information
    for each host in the Servlet Status tab.
    You can have an overview of applied license information under the License Status
    tab.
    You can export or print the servlet or license information as a formatted report.

For more information, see Scorecard.

Forgot password

Service Manager now provides the forgot password function. When you forget the
login password, you can reset the password through the Service Manager web client
login page on your own. For more information, see Passwords.

As a prerequisite, a Service Manager system administrator must enable the forgot
password function, configure the system security questions, and then configure the
related settings. For more information, see Enable the forgot password function and
Configure system security questions.

Note: The forgot password function is only available for either of the following
scenarios:

    The Service Manager server uses database authentication and the users'
    passwords exist in the database. In this scenario, the web client login page
    provides a default Forgot Password link after you enable the forgot password
    function. Users can click this link to go to an internal password reset page.
    The Service Manager server uses another authentication that has the forgot
    password function. In this scenario, the web client login page doesn't provide a
    default Forgot Password link and you must configure Web parameter:
    externalForgotPasswordUrl. After you enable the forgot password function, users
    can click the Forgot Password link to go to an external password reset URL as you
   specified in the externalForgotPasswordUrl parameter.

We recommend you to enable SSL before enabling the forgot password function.

System Navigator search

The Service Manager Windows client and web client Power User view now provide a
search line embedded in the System Navigator. When the toggle button beside the

search line is Include Favorites and Dashboards , you can search in both the
system menus and the entries in Favorites and Dashboards. Click this button to switch

to Exclude Favorites and Dashboards , you can search in system menus only. By
default, the search string must consist of at least two characters. To define the


minimum length of your search string when performing System Navigator searches,
see Web parameter: searchMinChars.

The search behaviors differentiate slightly between the Windows client and the web
client. For more information, see Windows client.

Note:

    Your search string is case-insensitive. In addition, you can't search for records in
    the System Navigator.
    The toggle button only has the Include Favorites and Dashboards status when
    you are managing the favorites.

Smart Email

    Microsoft announces the plan to stop supporting and fully decommission the
    Basic Authentication for Exchange Web Service (EWS) to access Exchange
    Online. Based on this fact, the system now supports OAuth 2.0 authentication
    when using EWS to connect to a mailbox for Smart Email. For more information,
    see Set up inbound email.
    The system can create a Change record upon the receipt of a new email message.
    Meanwhile, the system can update an Incident, an Interaction, or a Change record
    when receiving a new email message of a particular format. For more information,
    see Automatic record fields update and Set up inbound email.
    When Service Manager fails to process an inbound email, the system
    automatically sends an outbound email with detailed information about the
    originating email. This information may include the subject of the unprocessed
    email, the requester's mail address, and so on.

Smart Analytics

    This release introduces a new version of Smart Analytics based on IDOL 12.3.
    Now Image (Proxy) Server is replaced by Media (Proxy) Server and HTTP
    Connector is replaced by Web Connector. For more information, see Install and
    configure Smart Analytics.
    You can now decide if Smart Search will automatically detect the language to use
    in search terms by customizing configurations on the Smart Search Settings
    page. See Customize Smart Search settings for more information.
    You can now define filter fields in Smart Search Configuration to narrow the
    search results.

DevOps

Feature tracker


Feature Tracker, which is previously shipped as a content pack, is now available in
Service Manager out-of-the-box. This solution enables you to manage and maintain
objects changed for tailoring purposes inside Service Manager upon integration with
a Git code repository. It offers capabilities to commit all code changes, but also
deploy all code changes into different environments from within Service Manager
application itself. For more information, see GIT version control process.

Accessibility

    Service Manager web client accessible view (accessible.do and
    accessible_ess.do) now supports JAWS 2020 and Chromium-based Edge.
    The browser title now displays the Main Region Title.
    The focus now displays an ellipsis tip for truncated texts.
    The system now highlights the first menu item after opening the More menu.

Miscellaneous improvements

Tags

This release provides the Tag Based on Assignment Groups option that enables tag
assignment group support. When you are typing tags, the auto-suggestion list
displays the most commonly used tags in your assignment groups on top of others.

For more information, see Working with tags.

Service Manager Server Configuration utility

When you run the configuration utility for the Service Manager Server, a new
configuration is introduced to set your deployment environment:

    Demo: Load demo data and set all demo users' password as expired.
    Production: Load configuration data; Purge all demo data except for the falcon
    account. Set falcon account's password as expired.

For more information, see Run the Service Manager Server configuration utility.

Service Catalog

This release enhances the HTML Editor control and supports hyperlinks in the
standard toolbar. When you are adding user selections to a Service Catalog item or
bundle, the Name, Label, and the Help Description fields now support the HTML
Editor control renderings and you can add font style (bold, italic, color, and
underscore) and hyperlinks to these text fields. The text with the renderings will be
displayed on the user selection subform being created.

Note:


    From the usability and accessibility point of view, we recommend you not to add
    the hyperlinks to the text labels directly. Instead, you can add some additional
    texts next to the text labels, and then add the hyperlinks to these additional texts.
    On the Windows client, you can't apply the HTML Editor control renderings to the
    display type of Checkbox and Pick List with display choice of Radio Buttons.

Javascript editor

The Javascript editor in Service Manager web client now has line numbers, displays
monotype font, and provides syntax highlighting. For more accessibility information,
see Keyboard shortcuts for Javascript editor.

Added support

Service Manager adds support for the following operating systems and technologies:

    Red Hat Enterprise Linux 8.2
    Oracle Enterprise Linux 8.2
    SQL Server 2019
    PostgreSQL 12
    Chromium-based Edge (the latest version)
    iOS 14.x
    VMWare vSphere 7.x
    JAWS Screen Reader software version 2020

For more information, see the Support Matrix.

New parameters, commands, and files

The following parameters, commands, and files were introduced in this release.

groupudpjointimeout
externalForgotPasswordUrl
searchMinChars
mergeRoles

9.64

Tags

In addition to Knowledge Management, the system now provides out-of-the-box tag
fields to Interaction and Incident forms and enables you to add one or more keywords
or terms to a record. These tags are searchable and you can use these tags to
highlight important information. For more information, see Tag control, Working with


tags, and the Keyboard shortcuts for tag control section in Web client keyboard
interactions and shortcuts.

For detailed instructions about how to support tags in more Service Manager
modules, see Supporting tags in Service Manager.

Mobility client

You can now access the Request module from the Service Manager Mobility client.
See Manage requests for more information.

Service Manager Reports

    You can now either add reports to the top of the dashboard or append more
    reports to the existing ones in the Dashboard view.
    You can now add up to four reports to each row in the Dashboard view.
    By default, you can add up to sixteen reports to a dashboard. If your applications
    version is earlier than 9.64, you need to access Reporting > Administration >
    Report Settings and then manually change the default value of Max reports per
    dashboard to 16.

For more information, see My dashboards.

Approval

When you are handling multiple approvals by using the all must approve - immediate
denial option, the first denial updates the status of the current approval request to
Deny. Meanwhile, the first denial also updates the status of other pending approval
requests to Denied By System and sets the value in the Approved by field to System.

Notification

    When you use the Notify option in a record to manually send mail or email
    notifications, the mail or email content is now recorded as part of the history in the
    Activities tab. This enhancement enables you to have a complete view of the
    communication for a record.
    Now you can add images to the message body in an HTML notification template.
   See the Images section in Customizing HTML email notifications for more
    information.

Integration

    Now REST API is used when you integrate Service Manager with Operations
    Orchestration (OO). Note that the OO version must be 10.8 or later.


    You can now work with Web Service when your server can't access Internet. To
    enable this feature, you need to Add the internalURI parameter.

Support multiple LDAP servers

You can now use LDAP Proxy to integrate multiple LDAP servers. See Use LDAP Proxy
to integrate multiple LDAP servers for more information.

Usability

    Now you can click the column header to sort a subform that has virtual join. See
   Table in the detail form in Web client keyboard interactions and shortcuts for
    detailed accessibility information.

    When working with the Service Manager web client, you can now use the built-in
    spell checker of a web browser to resolve spelling errors in editable fields on a
    page.

    Now when you click the Fill button on a form, both the size of the window opened
    and the font size in the window are increased.
    Now you can click the Show Private Favorites Only button in the Service
    Manager web client interface to display the private favorites only. In addition, you
    can configure the Web parameter: sortNavFavorites to display all favorites in
    ascending alphabetical order.

    You can now display the decimal control as either spinner buttons or a slider. For
   more information, see Decimal control and the Keyboard shortcuts for decimal
   control section in Web client keyboard interactions and shortcuts.

    This release provides a default company logo that appears on the horizontal
    masthead at the top left corner of the web client screen. You may replace this
    default icon with your own organization's logo. In addition, the About information
    window has a new appearance in Service Manager web client and you can also
    customize the image in this window. For more information, see Branding the web
    client.
    Now when you open a problem record, a request record, or an incident record,
    you can view the attachments of its related tasks in the Problem Task
    Attachments, Request Task Attachments, or Incident Task Attachments tabs,
    respectively.

Performance

    Previously, Service Manager may get performance degradation when you update
    the CIs that have complex structures. Now when you add, update, or delete CI


    relationships, the configuration background process asynchronizes your changes
    to the database and improves the system performance.
    This release provides the SCFile.doSelectEx() JavaScript method to improve the
   system performance. You can restrict the data retrieval by specifying the start and
   count parameters.

Miscellaneous improvements

When an operator locks an object, the system now displays both the operator's full
name and login name in RAD lock.denied.msg. You can configure the paramerters to
be displayed in the operatorUtil JavaScript.

9.63

AWS and Azure support

Now you can deploy Service Manager on AWS or Azure.

Service Manager Reports

    You can now specify up to ten standard reports in Group By Field for the
    Calculation type of reports.
    You can now specify the minimum and the maximum values on the value axis in
    Axis Bounds (Minimum/Maximum) for the Chart type of reports. This field is only
    available for some types of Chart, including horizontal bar, vertical bar, stacked
    horizontal bar, stacked vertical bar, line, and area.
    You can now display the count labels for data items in Show Data Labels for the
    Chart type of reports. When you export this report, the count labels are exported
    as well. This checkbox is only available for some types of Chart, including
    horizontal bar, vertical bar, stacked horizontal bar, and stacked vertical bar.
    The drop-down list for dashboard selection in the Dashboard view is now
    resizable and you can drag it to an appropriate width to display the long
    dashboard names. The maximum width is 600px. To restore the drop-down list to
    its default width, clear the browser cookies.
    You can create a Service Manager report to display the ticket aging information
    for incidents. See Create a ticket aging report for detailed instructions.
    Now the drill-down functionality in a vertical bar report works correctly. When you
    click one of the bars, the system returns only the list of records of the column that
    you are clicking.

Smart Email


    If a change or a request is pending approval, Service Manager automatically
    sends out an email that contains the Approve and Deny buttons to the approver.
    The approver can click the Approve button to approve the change or the request,
    or click Deny to deny the change or the request.

    Now you can click the Close button in a Smart Email to close a change task.

Notification

    The Assignment groups definition consists of both the Member Group Email field
    and the Approver Group Email field and you can type a valid group email address.
    When sending notifications, the system sends emails to this group email address
    only. Otherwise, if these fields are empty, the system separately sends the emails
    to each member in the assignment group.

    Now you can define conditions and query filters for email attachments in a
    notification definition record. The system automatically adds attachments based
    on your definitions when generating an email notification for a record.

Service Catalog

A Service Manager Service Catalog administrator can now define help description for
all types of user options. In addition, a Service Manager Service Catalog administrator
can now define a regular expression together with the related error message for a
user option in a Catalog item. An end user can fill the regular expression field as
required when ordering this Catalog item from the ESS portal or SMA-SM Service
Portal. If the user input fails the validation, the system displays the error message as
defined in Service Manager.

Service Manager survey

    Previously, the system automatically appends the Do you want to register an
    interaction? question to a Customer Satisfaction Survey. Now the system
    provides Do you want to register an interaction? as an optional question by
    default and you can link this question to your survey template if appropriate.
    Now you can add some introductory texts to a survey in the Service Manager
    survey template. These texts will be displayed on top of the questions list when
    you access the survey.

Risk assessment and calculation

    Now you can click Preview to get a preview of the questionnaire from a risk
    group.


    When the risk calculation completes and there is a collision, the system sets a flag
    for the collision in the Service Manager Calendar of a Change record. If you have
    configured the Detailed Table and Detailed Query settings for a risk factor, you
    can now hover the mouse over the Risk or Collision column for the Change record,
    and then click the View Risk Result link to access the Risk Result Report.
    Now the Risk Result Report has a Created By field that indicates the creator of the
    report.

PostgreSQL SSL support

Now you can configure SSL connections between the Service Manager server and
the PostgreSQL server if your PostgreSQL database requires SSL. You can also
configure SSL connections between the Chat server and the PostgreSQL server.

Accessibility

    A screen reader now recognizes the decimal control as a spinner box. In the Form
    Designer, you can also optionally set the maximum or minimum value in the
    properties of the decimal control.

    Now the image of the Manage Favorite button changes accordingly when you
    switch between the Navigation Menu and the Manage Favorite Menu.

Integration

The performance of the Service Manager adapter is now improved to provide real-
time synchronization between Service Manager change/problem and ALM
defect/requirement. Please contact your representatives of our company for the
availability of this adapter.

Knowledge document access behavior change

In this release, the knowledge document access behavior in the ESS client and in SRC
has changed.

    In the ESS client, SRC, and SMA Service Portal, users with the SysAdmin or
    SQLAdmin capability word can't always access a KM doc by performing a search.
    Whether a user can access a KM doc only depends on the user's access rights
    defined in the Knowledge Management module. If the user has no permission, the
    KM doc will not appear in search results.
    In the ESS client and SMA Service Portal, users with the SysAdmin or SQLAdmin
    capability word can't always access a KM doc by clicking a link embedded in
    another KM doc. Whether a user can open a KM doc link only depends on the


    user's access rights defined in the Knowledge Management module. If the user
    has no permission, a permission error is displayed.

Miscellaneous changes

    Now you can click Attachments tab > Change Task Attachments tab in a change
    record to view the attachments of its related change tasks.
    (Windows only) Now you can create a remote desktop connection from a Service
    Manager CI with the CI Type of Computer.
    Suppose a KM document contains HTML tags for layout, such as color, and font.
    When you export this KM document to a CSV file, you can now use the new RAD
    output.strip.htmltags in Forms Designer to remove the HTML tags.

9.62

Native Release Control

    In this release, Service Manager provides the out-of-box (OOB) risk analysis
    function. After you enable the Enable Risk Assessment function, click the
    Calculate Risk button or click More > Calculate Risk to calculate the risk involved
    in the implementation of each Change based on the risk factors that you defined
    in Service Manager. After the calculation completes, the system opens the Risk
    Result Report and displays the latest version of the risk result by default.

    For more information about risk calculation, see Calculate risks. For more
    information about the Native Release Control solution, see Native Release Control.

    This release provides an enhanced Release Management workflow to align with
    other Codeless workflows in the Change module.

         Add Plan and Design Authorization, Build and Test Authorization,
         Distribution Authorization, and Abandoned phases.
         Move the Approval Definitions from the previous phases to the authorization
         phases.
         Remove the Approval Definition from the Release Verification phase.
         Add rule sets for mandantory fields, field validation, and notification.

New IR search

The new IR Expert solution leverages the native Full-Text Searching feature in DBMS,
which enables rapid searching based on preprocesssed documents in DBMS. The
new solution dramatically enhances search performance and reduces configuration
effort by Service Manager administrators. The new IR Expert supports the Microsoft
SQL Server, Oracle, and PostgreSQL databases. For more information, see IR Expert.


OpenJDK 8

In 2018 Oracle announced changes to the Oracle Java lifecycle and roadmap detailed
here. To accommodate the needs of all our customers, the company is moving
towards providing all products in a form compatible with an Open JDK environment
(where Java is used). The plan is to adopt the following overall approach for both
point product and suites that rely on Java:

    Stop redistributing Oracle JRE/JDK and generally adopt an Open JDK distribution
    policy
    Continue to support customer-supplied Oracle JDK

By following the overall approach, in addition the Windows Server and Windows
Client installation packages, a 32-bit OpenJDK JRE is also bundled with the Service
Manager Linux Server package in the Service Manager 9.62 release.

Smart Search

    Smart Search can be used without a Smart Analytics license. Because of this
    change, you can also set up End User Chat virtual agent without a Smart Analytics
    license. Note that Smart Ticket and Hot Topic Analytics still require Smart
    Analytics license.

    Now the Button widget and the Link Label widget in Forms Designer provides the
    Open Smart Search Widget button action, which enables you to add Smart
    Search buttons and link labels to the Service Manager forms as required. In the
    Service Manager web client, when a user clicks these buttons and link labels that
    associate with the Open Smart Search Widget button action, the system opens a
    Smart Search window.

Installation and upgrade

    This release combines Upgrade Utility with Application Patch Manager. Now you
    can use Upgrade Utility to the upgrade your Service Manager applications from
    version 9.3x/9.4x/9.5x/9.6x to version 9.62.
    Now you can migrate the database from Oracle to PostgreSQL. For detailed
    instructions, see https://softwaresupport.softwaregrp.com/doc/KM03319848.
    Now you can deploy the Service Manager Collaboration chat server and chat
    service on a Linux system.
    The LyncAgent, previously known as an inseparable module in the chat server,
    now can be deployed standalone.


Localization

To localize Service Manager into an unofficially supported language, the company's
partners are now able to export translatable content from Service Manager, translate
these content, and then import the localized content back to Service Manager. For
detailed instructions, see Localize Service Manager into unsupported languages.

Accessibility

    Now a screen reader can recognize the toolbars and then read the toolbar size
    and the position of each button inside. You can use a series of keyboard shortcuts
    to navigate through the buttons in the toolbar.
    In this release, the page numbers in the record list paging toolbar are recognized
    as buttons instead of links. Meanwhile, the focus has a series of behavior
    updates.

Performance

Service Manager now supports 1,500 concurrent users when you use the PostgreSQL
database.

Documentation

The Service Manager Help Center now combines the Codeless help center and
Hybrid help center to a single help center, and is delivered on ITOM Practitioner Portal
in a look-and-feel consistent with the help center for other ITOM products. For topics
only applicable to Hybrid or Codeless, you can find the indicators in the topic title
from the navigator and at the beginning of a topic.

9.61

Hot Topic Analytics

This release introduces the following Hot Topic Analytics (HTA) enhancements.

    Analyze bigger data volume Previously, HTA can index three million records only.
    This release removes this limitation and HTA can analyze indexed data for Smart
    Search now.
    Provide more meaningful topics This release enhances the backend algorithm for
    Hot Topic Analytics so that the topics are more meaningful.
    Consolidate indexes for HTA and Smart Search This release reduces the overall
    data volume.
    Add more filters to control HTA behavior This release adds the following two filters
    to Advanced Filter so that HTA can generate a better Hot Topic Analytics map.


         Min doc of topic: Controls the minimum number of records in each topic.
         Topic number: Controls the number of topic blocks in the current Hot Topic
         Analytics map.
         Note: This feature is also introduced in version 9.52 p3.

Disaster recovery

The disaster recovery feature enables you to quickly recover your Smart Analytics
data when Smart Analytics crashed. The data that can be recovered includes Hot
Topic Analysis data, Smart Tickets data, and Smart Search data. You can recover data
from the latest backup, and then perform a delta index to reindex the new data that is
created after the backup.

Mandanten support in Smart Ticket

In previous releases, Smart Ticket supports the multi-company mode only. Now this
feature extends the multiple-tenancy function to support Service Manager Mandanten
in Smart Ticket. You can enable Smart Ticket for different groups of data separated by
Mandanten.

Copy and paste images in HTML Editor

Previously, you can only copy and paste images in HTML Editor when you use
Chrome or Firefox. Now this feature is also supported when you use Edge or IE.

Paste screenshots in a record

From a record detail form in the web client, you can press CTRL+V to attach the
screenshot saved in your clipboard to the record. If the cursor is placed in an editable
field or text area of the record, the text "<Screenshot name>.png" is automatically
added right behind the cursor.

Enable toolbar buttons on ESS pages

By default, the action buttons on ESS pages are displayed at the bottom of the pages.
You can use the esstoolbarbutton parameter to enable toolbar buttons on ESS pages.
After you enable this parameter, the action buttons are displayed on the toolbar at the
top of ESS pages instead of at the bottom.

Copy Request and Change models with Task Planner

Now you can copy Change/Request models with task plans now. For more
information, see Configuring change models and Clone a request model.

Automatically change tab size


When you opening many tabs in the web client, the system automatically decreases
the tab size so that you can see more tabs in a screen and quickly go to different tabs.

Set the initial state of the command field

By default, the initial state of the command field is collapsed. You can use the Web
parameter: expandCommandLine parameter to set the initial state so that the
command field is expanded by default.

Configure virtual group size for inbox views

You can configure the number of records that are displayed as one virtual group in
inbox views for both the web client and the Windows client.

Configurable min-width

In the web client accessible view, you can use the detailViewMinWidth parameter to
increase the min-width value of a web page if the system displays some texts
incompletely after you enlarge the browser text size or font size.

Option menu removed

Option menu is removed from the accessible mode to leave more space to the record
list.

Enhanced system navigator

The system navigator is enhanced as follows:

    Re-implement the focusable elements and the tab sequence for better
    accessibility.
    Enhance the shortcuts for navigation. See the shortcuts for "Navigation Menu" in
    Web client.

Enhanced notebook control

The notebook control is enhanced as follows:

    Re-implement the focusable elements and the tab sequence for better
    accessibility.
    Enhance the shortcuts for navigation. See the "Keyboard shortcuts for notebook
    tab headers" section in Web client.
    Enable the screen reader to report the position of the focused tab header.

User Basic Information Card updated

The User Basic Information Card is updated as follows:


    Add a Cancel button.
    Set the initial focus to the photo.

Image buttons

The accessibility mode uses image buttons instead of text buttons to avoid button
overlapping on UI.

Message history implemented as a list

In the message history dialog, each message item is not focusable now and the
document body receives the initial focus. You can use Up/Down arrow or Page
Up/Page Down key to view the messages. When JAWS is running, you can use the
JAWS command to navigate through each message item.

Shortcut list implemented as a list

In the shortcut list dialog, each shortcut item is not focusable now and the document
body receives the initial focus. You can use Up/Down arrow or Page Up/Page Down
key to view the shortcuts. When JAWS is running, you can use the JAWS command to
navigate through each shortcut item.

Privacy settings

You can configure the privacy settings and information for administration and users
who are using the Service Manager system. See the Privacy Settings Guide for
Administrators and End Users for detailed instructions and the sample unload file.

Delta Migration Tool improvement

This release improves the stability of the Delta Migration Tool. In addition, the Delta
Migration Tool now provides more user-friendly wizard pages for import and export.

Upgrade improvement

    Application Patch Manager aggregates the language upgrade packages. Now you
    can upgrade multiple languages at the same time. Meanwhile, the UI becomes
    more friendly by displaying detailed information during the upgrade process.
    This release combines Upgrade Utility with the lightweight upgrade utility
    (available in Service Manager 9.60). When upgrading from SM 9.3x, 9.4x, and
    9.5x, Upgrade Utility automatically selects the upgrade package as appropriate.

SM-ALM adapter 1.04

SM-ALM Adapter 1.0.4 is required when integrating ALM with SM RTE 9.61. ALM
Synchronizer can connect to Service Manager by using HTTPS URL through SM-ALM


adapter. The new adapter is released on OpenText Marketplace .

Support localization for inbox

Service Manager upgrade attempts to enable localization for the customized inbox
names. If you have customized inbox names, you can search the scmessage record
for active languages other than English and then translate the content of Text for the
language.

9.60

Smart Ticket tuning toolkit

This release provides a Smart Ticket tuning toolkit to assist in tuning your Smart
Ticket configuration and improving the Smart Ticket classification accuracy. This
toolkit includes a data distribution analysis tool that can provide reports on your data
distribution, and a visualization tool that can generate a confusion matrix based on a
set of sample test data. Additionally, this toolkit can help you achieve better results by
modifying certain IDOL configuration parameters from the Smart Ticket configuration
UI.

Oracle Connector

This release provides an Oracle Connector to automatically aggregate Knowledge
Management documents from an Oracle database server. The files are then sent to
Connector Framework Server (CFS), which processes the information and indexes it
into an IDOL Server. IT agents can search against these files through Smart Search.

Enable phrase queries

If you select this checkbox, Smart Search automatically adds quotations to the search
criteria.

Ignore certain special characters

If you select this checkbox, Smart Search interprets special elements as normal
characters instead of a query syntax. These elements include asterisks (*), question
mark (?), colon (:), double quotation marks ("), brackets, boolean, and proximity
operators such as AND, NOT, OR, EOR, XOR, NEAR, DNEAR, WNEAR, BEFORE, and
AFTER. Select this checkbox to disable wildcards, phrase queries, field restrictions
and boolean operations.

DevOps support

Supports DevOps for applications tailoring, which is based on native Git integration.
This feature enables you to modify, commit, and deploy code changes inside Service


Manager. The commit and deploy function inside Service Manager guarantees a
"Review Based Development" that only allows users with special permissions to
check in and deploy codes.

            Note

           This feature is available on OpenText Marketplace as a content pack.

Shared Inbox

You can configure a shared mailbox for the "EWS" or "IMAPS" mail protocol as the
mailbox for receiving inbound email.

Service Management Automation Service Portal support

The company has chosen Service Management Automation (SMA) Service Portal as
the strategic focus for further Service Portal development, and Service Manager
Service Portal (SMSP) will no longer evolve functionally. Customers are encouraged
to adopt SMA Service Portal as a replacement for SMSP. SMSP is delivered in this
release only for the existing SMSP install base.

Upgrade utility

Provides an additional lightweight upgrade utility for upgrading from SM 9.5x. By
using this lightweight upgrade utility to upgrade Service Manager from 9.5x to 9.60,
the upgrade time is similar to a minor-minor upgrade with Application Patch Manager
(APM).

Federation of change tasks

The SM-UCMDB integration now supports federating Change Task records from
Service Manager to UCMDB.

            Note

           This feature is available only when ServiceManagerEnhancedAdapter9.41
           is used for the integration.

Consolidation of Service Manager adapters

All Service Manager adapters for the SM-UCMDB integration are now consolidated
into three:

    ServiceManagerEnhancedAdapter9.41(based on the generic framework)


    ServiceManagerAdapter9.41 (based on XSLT)
    ServiceManagerAdapter9.x (based on XSLT)

Rebranding

Both the Service Manager product interface and product documentation now use
Micro Focus branding.

Language packs

The following three languages that were not supported after Service Manager 9.51 are
now added back to Service Manager language packs: Brazilian Portuguese, Korean,
and Turkish.

9.52

Minimum search results relevance threshold

Service Manager Service Portal 9.52 allows you to specify the minimum percentage
of the relevance that the search results must have to the query.

Change approval

Service Manager Service Portal 9.52 incorporates the Change approval functionality
that was previously available through content packs together with further
enhancements. If you are designated as an approver of Change requests, you can
approve all categories of Changes.

For more information about how to enable Change approval, see Enable Change
approval.

            Note

           If you are working with Service Manager 9.41 (Codeless only), 9.50, or
           9.51, you can still enable Service Manager Service Portal Change approval
           by browsing to the [%SX_HOME%]/contentStorage/sm-external-
           approval/sm directory, and then importing the SXExternalApproval.unl
           unload file to Service Manager.

Accept/Reject actions on Service Requests

In Service Manager Service Portal 9.52, you can accept or reject a Service Manager
Service Portal request while the request is in the Resolved status. This functionality
was previously available through content packs.


For more information, see Service Manager Service Portal Consumer Help.

Support of SAML Single Sign-On

Service Manager Service Portal supports SAML2.0 based single sign-on using
Microsoft ADFS as the Identity Provider (IdP).

Search enhancement

The type ahead feature of the Search Service Manager Service Portal text box in
Service Manager Service Portal 9.52 supports multiple words and sentences. When
you type a few characters in the text box, the system automatically displays the
Suggested search list and the Suggested result list. The Suggested search list lists
the recommended search terms and highlights your search term. You can select a
term in this list to open a search result page. The Suggested result list lists a series of
suggested search results and highlights your search term in the titles and
descriptions. You can select a result in this list to open the target ticket.

Service Manager Service Portal also provides correction when the system can't find
any matches for your search terms. For example, if you type iphoen in the Search
Service Manager Service Portal text box and then system can't find a match in the
search results, the system automatically suggests iphone.

For more information about Service Manager Service Portal search configuration, see
Configure SMSP search.

Installation simplification

    The installer script capability is extended to enable Chat, Survey, and LW-SSO at
    the same time, all in one step.
    Support for remote installation is added so that you can install Service Portal on
    multiple nodes by running the installer on the load balancer node only.

Ability to change initial passwords

To improve security, you can change the initial passwords used in both a single
instance deployment and a clustered deployment of Service Portal.

Service Portal Swedish language support

Service Portal now supports Swedish.

Migration from Propel to Service Portal

You can find instructions for migrating from Propel to Service Portal in the help center
(Administer > Service Portal Administration Guide > Migrating Propel to Service


Portal).

Process Designer Codeless Configuration Management

The Configuration Management module is reimplemented on Process Designer
technology. The module now uses a default Configuration Item workflow. When you
upgrade to Service Manager 9.52, a migration tool will convert all Classic
Configuration Items to Codeless Configuration Items.

            Note

           Currently, the Configuration Management module continues to use the
           master Format Control record and State settings in the device Object
           instead of RuleSets. Additionally, Contract Management still runs in
           Classic mode.

For more information, see the Configuration Management section in the Service
Manager Help Center.

Colored thresholds and ranges in Service Manager reports

You can configure reports on the dashboard to use colors to highlight defined
thresholds and ranges of values. When you define a colored range for a report, the
section of the relevant axis falling within that range is displayed in a defined color, and
threshold markers are displayed on the report to mark the limits of the range.

For more information, see Add colored ranges to a report.

Paste images to the HTML Editor

You can now paste images to the HTML Editor as attachments.


            Note

           Out-of-box, the copy and paste function is only available in Knowledge
           Management. To enable this functionality for other modules, you must
           meet following prerequisites:

               You are running the Service Manager 9.52 (or later) web client and
               server.
               The web client is open in the Mozilla Firefox or Google Chrome
               browser.
               The form contains an Attachment Container control.
               The Insert Image Option property is defined for the HTML Editor
               control on the form.

           Currently, this functionality is unsupported in HTML email.

Smart Analytics New license files

The existing Smart Analytics license files are no longer valid on April 30, 2017.

New license files are included in Smart Analytics 9.52. If you upgrade to Service
Manager 9.52 or perform a first-time installation of Service Manager 9.52 before April
30, you need take no further action.

However, if you will not upgrade to or install Service Manager 9.52 before April 30,
you must update the license files. To help you do this, a Smart Analytics License Tool
is included in the Service Manager 9.52 release package. Simply follow the steps in
the tool to renew the license files. Additionally, the tool is available to download from
the following Software Support website:
https://marketplace.microfocus.com/itom/content/idol-license-file-update-for-sma-
propel-smsp

Set Smart Analytics stop phrase from Service Manager UI

Previously, you could only add stop phrases by updating the qssp.db file for Hot Topic
Analytics. After this configuration, you had to restart a series of Smart Analytics
services. As of Service Manager 9.52, you can configure stop phrases on the
Configure IDOL Stop Phrase page in the Service Manager UI without restarting the
Smart Analytics services.

For more information, see Set stop phrases for Hot Topic Analytics.

Configure the maximum number of Hot Topic Analytics
blocks


By default, the Hot Topic Analytics topic map displays up to 10 blocks. Service
Manager 9.52 enables you to configure the maximum number of blocks in a Hot Topic
Analytics topic map.

SAML SSO based on Service Manager Service Portal's built-
in IdM

In addition to the standalone Identity Manager (IdM) service, Service Manager now
supports SAML Single Sign-On using the IdM service that is built in to Service
Manager Service Portal.

9.51

Order numbers and request numbers are searchable from
Service Manager Interactions

Order numbers and request numbers generated on the Service Portal side are now
automatically synchronized to the Portal Order ID and Portal Request ID fields on the
Service Manager Interaction detail form and search form.

Bi-directional attachments to Service Manager service and
support requests

To enhance communication between portal users and service desk personnel,
attachments added in Service Manager Service Portal are visible in Service Manager
and attachments added in Service Manager are visible in Service Manager Service
Portal.

Service Portal installation mechanism enhancements

The Service Portal installation mechanism is enhanced in the following ways:

    Service Portal now can be installed on a Red Hat Linux system that has no Internet
    access.

    The installer is redesigned to use a single shell script that automates the
    installation process.

                 Note

               You still need to run additional scripts (such as enableSurvey and
               enableChat) to perform some post-installation tasks.

Support of Close action for service requests in Service Portal


If fulfillment has not started for a service request (in pending approval or denied
state), the request can be closed.

Simplified access control configuration for multiple groups in
Service Portal

For catalogs and catalog items, bulk actions make it possible to grant access to
multiple groups with one operation.

New Calculated Representation group type in Service Portal

In addition to LDAP and database representation groups, it is now possible to create a
new calculated group by specifying criteria in the Identity application. For example,
create a calculated group to restrict access to users that are in a specific
geographical location.

Reverse proxy support in Service Portal

New Ansible automation to help with configuration of Nginx reverse proxy for Service
Portal.

Two-way SSL support in Service Portal

Service Portal supports client authentication via certificate with Service Manager.

Propose knowledge documents from external libraries in
Smart Email

Previously in an outbound email, the knowledge documents proposed by the virtual
agent Sage only included KM articles from the SM knowledge library. Now, if the
corresponding connectors (the SharePoint connector, file system connector, or HTTP
connector) are set up in Smart Analytics, the proposed knowledge documents also
includes SharePoint pages, documents on a file system, or web pages from external
libraries.

Propose knowledge documents from external libraries in
Service Manager Collaboration

Previously in a chat, when you type your questions or issues, the virtual agent
performs Smart Search with your access rights and provides you several links that are
relevant to your question. The links only include Knowledge Management document
links and Service Catalog item links. Now, if the corresponding connectors (the
SharePoint connector, file system connector, or HTTP connector) are set up in Smart
Analytics, the proposed knowledge documents also include SharePoint pages,
documents on a file system, or web pages from external libraries.


Display Service Portal ticket ID in Service Manager
Collaboration

When you open an End User Chat window in Service Portal, you can specify the
Service Portal ticket number from the Previous Support Ticket ID drop-down list if
you have submitted a support ticket before the chat.

Configurable child task behavior in Process Designer

By default, when a parent task is not created, the child task is created and moved to
the "Active" state. You can now configure the child task to stay in the "Waiting" state
in this situation.

For more information about how to do this, see Configure child task behavior when
the parent task is not created.

Language selection in Service Request Catalog

You can now configure Service Request Catalog to display a language selection box
on the login page.

For information about how to enable this feature, see Enable language selection on
the Service Request Catalog login page.

Smart Search indexing

Smart Search indexing for "sclib" type knowledgebase libraries is enhanced in the
following ways:

    The back-end indexing mechanism is refactored to improve performance.
    You can schedule indexing based on a time period record.
    You can view the detailed status of indexing jobs.

Smart Search box

If you have Smart Analytics installed, a Smart Search icon is added to the top-right of
the UI. Clicking the icon displays a search box that performs a Smart Search. This
enables you to use the Smart Search feature of Smart Analytics to search for content
wherever you are in the Service Manager UI, without having to navigate through
menus.

New server patch installation tool

Service Manager 9.51 includes a new server patch installation tool (PatchSetup.bat or
PatchSetup.sh) and a new server patch uninstallation tool (PatchUninstall.bat or
PatchUninstall.sh). The installation tool is located in the patch directory after you


unzip the patch, and the uninstallation tool is created in the <SM
Installation>\_uninstall directory after you run the installation tool.

            Note

           Running these tools will overwrite the configuration files (such as the
           LWSSO configuration file and XML files for Jgroups) in the RUN directory
           in the Service Manager server installation directory. Remember to reapply
           any changes that you have made to these files after you run the patch
           installation or uninstallation tool.

For detailed information about how to use the new tools, refer to the Upgrade the
Service Manager Server and Backup and backout instructions topics.

Demo data unload file

Service Manager 9.51 provides a demo data unload file (demodata.unl) for testing and
demonstrating the new 9.51 features after you have upgraded to the 9.51 applications
in a fresh installation environment. This demo data package is for Service Manager
9.51 Codeless only. To import the data package, you must use the Apply Demo Data
wizard provided by Service Manager 9.51.

For more information about how to do this, see the "Service Manager 9.51 Demo
Data" topic in the Service Manager Help Center.

Service Catalog search returns both cart items and non-cart
items

By default, you can submit a Service Catalog request from Service Catalog > Order
from Catalog, and then search for the desired cart items, or you can submit a Support
Catalog request from Service Catalog > Non-cart Catalog Requests, and then
search for non-cart services. In an out-of-box Service Manager system, these two
search results use different formats and can't be merged. However, you can now
customize the Service Catalog search result to include both cart items and non-cart
items for a better user experience.

For more information, see Customizing Service Catalog search result.

Command/Search box replaced with icon

The Command/Search box at the top of the UI is replaced with a command icon. Click
the icon to display the Command/Search box.


This UI enhancement helps simplify the tool bar, provides a unified and consistent
user experience across the company's software, and eliminates potential confusion
between the Command/Search icon and the Smart Search icon.

Improved experience for RTL language displays

If you select a right-to-left (RTL) language (for example, Arabic) when you log in to
Service Manager 9.51, the navigator panel is displayed on the right side of the UI to
better align with the direction of the text. Additionally, the following changes improve
the user experience when Service Manager is displayed in an RTL language:

    The text of accordion items and tree items in the navigator pane is aligned to the
    right
    The navigator toolbar is aligned to the right
    The right and left arrow keys collapse and expand the tree, respectively (in LTR
    language versions, the key mapping is reversed)

9.50

Smart Email

Smart Email is a new feature that enables users to interact with Service Manager
through email messages. The supported features are as follows:

    Automatic record creation based on an inbound email
    Automatic replies (outbound email) with links to suggested solutions, including KM
    articles and service catalog offerings, that are based on the inbound email.
    Email-based approval for service catalog items
    Email-based commenting
    Integrating with Smart Ticket
    Supporting Hot Topic Analytics for interactions or incidents created from email

For more information, see Smart Email Overview

Service Manager Chat

Service Manager 9.50 Collaboration has a more extensive concept, which combines
IT Collaboration (previously knows as SMC) and End User Chat. IT Collaboration
enables Service Manager IT operators to collaborate in real-time (or anytime) when
handling an Interaction, Incident, Incident Task, Request, Request Task, Problem,
Problem Task, Change, or Change Task. End User Chat builds a communication
channel between Service Manager Service Desk agents and Service Manager Service
Portal users or the Employee Self-Service (ESS) portal users so as to increase IT
efficiency, improve customer satisfaction and reduce IT support costs. Additionally,


the virtual agent accelerates solution delivery without human intervention. Powered
by Smart Analytics, it provides 24x7 support and automatically proposes KM articles
and Catalog offerings as solutions. The virtual agent can be customized to propose
other solutions as required.

            Note

           In this release, Service Manager Collaboration supports English, German,
           French, Spanish, Italian, and Dutch. It doesn't support JAWS.

For more information, see IT Collaboration and End User Chat.

            Note

           Service Manager Collaboration doesn't support right-to-left text alignment
           in this release.

Hybrid mode enhancement

In Service Manager 9.50, the Applications Upgrade Utility is enhanced to
automatically migrate the Classic Change module to Process Designer. This makes
Hybrid mode available to all customers who are upgrading from a Service Manager
9.3x system that has legacy technology applied or from a Service Manager 9.4x
Hybrid system.

For more information about the different modes of Service Manager and for a
summary of changes that are applied when you migrate to Hybrid mode, see Service
Manager modes: Classic, Codeless, and Hybrid.

Classic mode dropped

Service Manager 9.50 is unavailable in Classic mode. If you are upgrading from a
Classic mode version of Service Manager, you must upgrade to either of the Process
Designer-based modes of Service Manager: Codeless and Hybrid. Migration
functionality is built into the Applications Upgrade Utility to help you do this.

For more information about the different modes of Service Manager and for a
summary of changes that are applied when you migrate to Hybrid mode, see Service
Manager modes: Classic, Codeless, and Hybrid.

Service Manager Survey framework enhancement


The Service Manager Survey functionality is extended to support Service Portal as
the survey portal and support the use of multiple survey templates for ESS, SRC, and
Service Manager Service Portal surveys.

The SM Survey tailoring mechanism is also significantly simplified. Users can easily
create custom questionnaires without the need to tailor any forms. Each questionnaire
can be used for all SM surveys (ESS, SRC, and Service Manager Service Portal).

            Note

           This enhancement doesn't affect Survey Integration. Surveys that are
           based on an external connector work the same way as before.

For more information, see Service Manager Survey.

Use notification when sending emails for the exported
Service Manager reports

When exporting reports as email attachments, you can select the Use Notification
checkbox and then select a notification definition to send emails by following the
notification rules. Additionally, you can add customized notification definition records.

For details, see Create a report schedule.

Hot Topic Map is now available in both Service Manager
report and dashboard

After you enable Smart Analytics in your Service Manager system, you can create Hot
Topic Map reports for Service Manager survey, the Service Desk module, Incident
Management module, and Problem Management module. Additionally, you can add
Hot Topic Maps to the report dashboards for these modules.

For more information, see Hot Topic Map.

New Drill Down Process option in Service Manager report

The behavior of dashboards with a category of ToDo can be configured to the same
of the To Do Queue now. This release adds a new option Drill Down Process to the
New Report Wizard. You can use this new option to specify whether clicking a record
in the report will drill down to the record stored in the ToDo table or to the record
details page.

Automatic refresh for a dashboard in Service Manager report


This release adds a new checkbox Support Auto Refresh to each dashboard to
enable automatic refresh for a specific dashboard. With this option, both the
dashboard owner and audience can view up-to-date data in the dashboard.

For more information, see Enable automatic refresh for a dashboard.

            Note

           This checkbox is hidden if your report administrator has disabled the Auto
           Refresh functionality for dashboards. For more information, see Configure
           report settings.

Run calculation report and duration report in frontend

This release adds a new checkbox Run in Frontend to each calculation report and
duration report. You can select this checkbox to run the current calculation or
duration report immediately. When clicking the Refresh button on the Preview tab of a
saved report, the system generates a preview of the current report at once.

For more information, see Report calculation chart properties and Report duration
chart properties.

Service Manager ChatOps

Service Manager ChatOps is a simplified collaboration model that enables people,
processes, tools and bots (chat robots) to exchange information, trigger activities and
automate manual tasks in a simpler, and more cost-efficient and rapid way.

Compared to traditional collaboration tools, Service Manager ChatOps provides two
unique differentiators:

    A war room, that is, a central place for a specific topic or task, where both people
    and chat bots gather to raise questions, respond to inquiries, track progress,
    monitor status, and make decisions.
    Systems of engagement, which centralizes various tools in war rooms, and
    enables people to quickly get needed information and easily what's going on, and
    chat bots are able to automate most of ops-related tasks.

For more information, see Service Portal ChatOps on the OpenText Marketplace .

Server embedded JRE upgrade

The embedded JRE in the Service Manager server for Windows is now OpenJDK 8.


For Linux, the Service Manager server has no jre embedded. You need to manually
install an OpenJDK JRE or create a symbolic link to an Oracle JRE.

Dynamic debugging using JavaScript

Now you can send the dynamic debugging messages using Service Manager
JavaScript. In addition, you can also customize the output directory and the log file
name for the debugging messages.

For more information, see Dynamic debugging of user sessions or schedulers.

Support of SQL Server AlwaysOn

The Service Manager Server now supports a cluster of SQL Server instances with the
SQL Server AlwaysOn functionality enabled.

For more information, see Support of SQL Server AlwaysOn.

Configuration of web parameters

As of version 9.50, you can set most context parameters of the Web application and
all initialization parameters of Servlets from both the web.xml file and the
webtier.properties files. The parameters configured in these files take precedence in
the following order:

   Custom webtier.properties located in the <customize-folder>/config folder
   Default webtier.properties located in the <webtier>/WEB-INF folder
   Default web.xml located in the <webtier>/WEB-INF folder

For more information, see Web tier parameters.

JavaScript editor

The JavaScript editor on Service Manager Windows client has the following
enhancements:

    Content assist
    Syntax highlighting
    Quick outline
    Hyperlink
    Keyboard shortcuts

Set variables as the default values for custom fields in
Service Request Catalog


When you enter a variable or an expression as the default value and select the Is
Expression checkbox at the same time, the tailoring values for custom fields are
automatically filled in the user interface. This also applies to CI information retrieval
and fulfillment. If you use variables as the default value for the item title and
description fields, the title of the items are automatically filled when you submit these
items in your cart.

This enhancement supports the following content:

    Traditional expressions in Service Manager applications, such as name in
    $lo.operator

    Jscall syntax to return advanced query results, such as the location of a logged in
    user (As long as a predefined JavaScript expression can return a query result, it
    can be set as a default value in custom fields)

                 Note

               To use jscall, make sure you define the Javascript function in the
               Script library first.

    Any RAD expressions

    Text, Multiple Text, Checkbox, and Pick List default value types

    Pre-defined variables in Service Manager

Smart Analytics enhancements

Smart Analytics are enhanced in this release:

    The installer is optimized for installation and upgrade.
    Hot topic analytics is available for surveys, and as a report in the Dashboard.
    The image-to-text feature is improved for better Optical Character Recognition
    (OCR) quality.
    Smart Search is supported in self-service user view (ess.do).
    Context-aware search is supported for the Title field when you create a
    knowledge document.

Support of SAML Single Sign-On (SSO)

The SAML SSO solution leverages Identity Manager (IdM) as the service provider (SP)
and requires the use of Microsoft Active Directory Services (ADFS) as the identity
provider (IdP).


Based on SAML 2.0, this solution supports the Service Manager web tier, SRC, and
Mobility Client, and is compatible with both the legacy LW-SSO solution and FIPS
mode.

            Note

           Currently, SAML SSO is unsupported by Service Portal. If you are already
           using or planning to use Service Portal as an end user portal, we don't
           recommend you to enable SAML SSO.

For more information, see SAML Single Sign-On.

Enhanced FIPS 140-2 compliance

The FIPS compliance of Service Manager is significantly enhanced to support the
following:

    FIPS validated TLS connections
    FIPS validated LW-SSO
    FIPS compliant random number generation algorithms

            Note

           This enhancement is ported from Service Manager 9.41p3.

For more information, see FIPS mode.

Service Manager Upgrade Utility enhancements

Service Manager Upgrade Utility in this version includes the following enhancements:

    Automatically purge the existing upgrade files before loading the pre-upg.bin file.
    Automatically load the Upgrade Utility file transfer.bin.
    Automatically detect the out-of-box upgrade and custom upgrade.
    The smupgrade command is now obsolete. Instead, you can access the following
    options in System Administration > Ongoing Maintenance > Upgrade Utility.

         SQL Compare Utility
         View/Merge Results
         Apply Upgrade
         Create Custom Upgrade
    Provides field merge UI when solving conflicts of renamed upgrade result for
    simple objects.


Location of client unload files changed

Previously, all platform unloads were included in the server package only, including
those that are required for Windows client and web client fixes.

In Service Manager 9.61, unloads are now split between the following packages:

    Unloads related to the server, or to the server and the client: in the Server installer
    (<Server installation path>\platform_unloads)
    Unloads related to the web client: webtier-9.50.zip\unloads
    Unloads related to the Windows client: windows-client-9.50.zip\unloads

SM-UCMDB integration

The following enhancements are introduced for this integration:

    The SM side integration setup is moved from the System Information Record to
    Integration Manager (SMIS), which is a central place for integration configuration.

    For more information, see How to Add UCMDB and UCMDB UI Connection
    Information.

    The Get Related and Impact Simulation widgets of the UCMDB UI are embedded in
    Service Manager. Users can access them in the context of an affected service or
    CI in the Configuration, Change, Incident, Problem, and Interaction modules.

                 Note

               By default, the two UCMDB UI widgets are disabled in Service
               Manager. To use them, you need to enable them individually.

    For more information, see Centralized CI Visualization and Impact Analysis.

Computer Telephony Integration

This integration is enhanced to support an additional method, which uses native
HTML and JavaScript instead of the CTI applet. This method is supported only for
Service Manager 9.50 or later, and doesn't require the installation of any CTI support
code the first time you connect using the telephony URL.

For more information, see Computer Telephony Integration (CTI) with the Web client.

Change Task Automation


Service Manager 9.61 allows you to link change tasks to Operations Orchestration OO
flows. This enables you to automate implementation of change tasks by manually or
automatically launching OO flows.

For more information, see Automated implementation of change tasks.

AutoPass licensing enhancement

The AutoPass licensing mechanism is enhanced with the following new capabilities:

    Support of integration with Usage Hub for centralized license monitoring
    New server command that enables automated license update

For more information, see AutoPass licensing.

Service Manager rebranding

Service Manager and the Service Manager Help Center both now use Micro Focus
branding.

HTML5 desktop notifications

As of version 9.50, the Service Manager web client also supports HTML5 desktop
notifications for incoming Service Manager Collaboration conversation messages and
new conversation invitations in the following scenarios:

    When the browser is open and the Service Manager web client is not the currently
    active webpage, the notification appears on the lower-right corner. Click this
    notification to return to the Service Manager web client webpage.
    When the browser is minimized, the browser window icon flashes in the taskbar.
    Click the browser window icon to return to the Service Manager web client
    webpage.

            Note

           Before using the HTML5 desktop notification feature on Google Chrome
           and Mozilla Firefox, you must configure the browser settings and allow
           the Service Manager web client URL to show notifications.

Drag and drop attachments

You can now drag and drop supported files from your local drive directly to the
"Attachments" section of records.

Contextual menu


A Service manager contextual "More" menu is displayed instead of the browser menu
when you right-click lists on the details pane of a record in the web client.

For more information, see Configure the behavior when you right-click in the web
client.

ITIL alignment: Configuration Management

    In addition to recording activity updates, the Configuration Management module
    also provides field-level audit history for updates to a configuration item (CI).

    For more information, see View the audit history of a configuration item.

    When an outage occurs and the associated CI has an SLT, the outage costs to the
    business are calculated and stored in the outagedetail records. The default
    Outage Cost per Hour is only applied if you don't specify Outage Cost per Hour in
    the CI form. You can configure the default Outage Cost per Hour in the
    Configuration Management Environment record.

    For more information, see Configuration Management environment record

    In a CI record, you can view related records of more types. For example, you can
    view documents related to a CI through the newly added Related Documents tab.
    You can also check the counts of each related record type.

    For more information, see View related records for a CI record.

ITIL alignment: Availability Management

    The availability requirements for any service are documented in the Service Level
    Agreement and agreed by the IT Service provider and the customer. An
    Availability Plan is a document which outlines the calculated forecast needs for a
    service to be able to meet those needs for the next business year. Its primary
    purpose is to define and document a plan to fulfill the forecasted requirements.

    For more information, see View the availability plan of a business service.

    Reliability is a measure of how long a service or component can perform its
    function without interruption. The Component Reliability functionality in the
    Configuration Management module automatically calculates the reliability of a
    service or component, and presents the information in a monthly report.

    For more information, see View component reliability.

    The Configuration Management module allows you to view outage information of
    a business or component, as well as the records affected by each outage.


    For more information, see View component availability.

ITIL alignment: Knowledge Management

    The Knowledge Management module provides an option Notify Service
    Subscribers on Publish that enables the system to immediately notify users upon
    the publication of a document that is important to them. Each knowledge
    document can be associated to a service so that the system can immediately
    notify users who have subscribed to the associated service upon the publication
    of the document.

    For more information, see Notify service subscribers of the publication of a
    document.

    New fields and tabs are added in the definition form of knowledge document.
    When creating or editing a knowledge document, you can add tags and specify
    associated business services which can be used as search keywords and
    displayed to end users. You can also link one document to another through the
    Related Records tab. In addition, you can trigger context-aware search to search
    for similar knowledge documents if you use Smart Analytics 9.50 as the search
    engine.

    For more information, see Create a knowledge document.

    When you search knowledgebases using Solr, more advanced search filters are
    available so that you can perform a more accurate search. For example, you can
    search by affected services. You can also define different search criteria for each
    of the specified knowledgebase to narrow down your search results.

    For more information, see Use advanced search.

ITIL alignment: Service Catalog

    Service Manager 9.50 provides an out-of-box Service Catalog workflow which
    conforms to the principles of ITIL 2011 Edition. You can adapt this default
    workflow to meet your specific process and business needs.

    For more information, see Service Catalog Management process.

    Several new tabs and fields are added in the Service Catalog item and bundle
    detail forms so that you can provide more information about the service item or
    bundle. You can log fulfillment summary and value proposition for a service item,
    update activities regarding it or associate a service item with existing or new
    change records and knowledge documents.


    For more information, see Edit a bundle or item.

Centralized help center

Service Manager product manuals and online help are now centralized in a single help
center. The restructured help center now contains the following information nodes:

    Release notes
    Get started
    Install
    Upgrade
    Integrate
    Administer
    Use
    Troubleshoot
    Develop

The help center is released as a .zip file on Software Support Online website and
also published on the OpenText Software Documentation Portal .

Service Manager Service Portal Shop application

The Shop application enables the Service Portal consumer to shop for catalog items,
place orders, and monitor and manage details related to these orders.

Request Support in Service Manager Service Portal

By using the Request Support application, end users can get support assistance from
IT in a simple, easy, and interactive way.

If Smart Analytics is enabled in Service Manager, users can use the Smart Ticket
feature to submit requests in Service Manager Service Portal.

Service Manager Service Portal Knowledge application

The Knowledge application enables end users to browse knowledge and support
articles. End users can scroll up and down a list of articles to browse, search by
keyword, and sort or set filters to customize the display.

Service Manager Service Portal Survey

Users can receive survey links through email and then open the links to respond to
the surveys directly from the Service Portal user interface. In addition, users can also
click the Surveys tile on the launch pad to respond to their open surveys, as well as
view their closed surveys. For more information, see the Service Portal online help.


Service Manager Service Portal Chat

End users can click the chat button in the Service Manager Service Portal to
communicate with either a virtual agent (Sage) or a Service Desk IT agent in real-time
to quickly address the service requests and support requests as they arise. Service
Manager Process Designer Assignment rule settings streamlines the End User Chat
process and automatically routes the chat requests to the correct Service Desk
assignment group. Sage simulates the way a human being responds to a question and
helps to reduce IT support costs by suggesting Knowledge Management document
links and Service Catalog item links or automating common cases. Therefore, end
users can receive prompt, concise answers when they need them the most.

            Note

           To use the virtual client, your enterprise must own a Smart Analytics
           license and set up Smart Analytics.

For more information, see End User Chat.

Service Manager Service Portal Hot News

The Hot News application enables end users to view RSS feeds in Service Portal.

Service Manager Service Portal My Workstream

Service Portal workstream contains a series of feeds on your activities, and allows
your administrator to share announcements.

9.41

Smart Search

Smart Search is a brand new search experience that enables you to search across
Service Manager modules and into a variety of content such as SharePoint sites
(including SharePoint documents with entitlement), static webpages, and shared
folders. Smart Search provides a greater search capability than SOLR, and supports
various operators such as AND, OR, NEAR, NOT, BEFORE, and AFTER. You can
integrate multiple knowledge libraries by configuring different search connectors, so
that all change analysts, incident analysts, request analysts, service desk analysts,
problem analysts, change managers, incident managers, request managers, service
desk managers, problem managers, and SRC users can search all the information that
they can access.


By configuring Smart Search preconditions and actions, IT users can search for
content from different libraries easily and quickly. Users can also process a record
with the context aware search, which automatically searches and displays records or
articles related to the current record. From the search result, users can perform
actions such as copying solutions or finding similar records, so as to improve the
resolution rate and reduce resolution time.

Hot Topic Analytics enhancements

Hot Topic Analytics in the new version of Smart Analytics for Service Manager
includes the following enhancements:

    Hot Topic Analytics is now available in three modules

    After you enable Smart Analytics in an out-of-box system, you can use Hot Topic
    Analytics for the Service Desk, Incident Management, and Problem Management
    modules. Additionally, you can access Hot Topic Analytics from the report
    dashboards for these modules.

    Creating knowledge articles

    Now you can easily create knowledge articles based on the analysis performed by
    Hot Topic Analytics.

    Setting parent/child relationship among incidents

    When you review the hot topics suggested by Hot Topic Analytics in Incident
    Management, you can use the Set Parent action to open a wizard, and then select
    the parent and child incident. The system will suggest a list of parent incidents,
    ordered by their relevance to the selected child incidents, and then you can select
    the parent for the child incidents. You can also create a new parent incident from
    the same wizard.

    New RESTful APIs

    New RESTful APIs are provided for Hot Topic Analytics, as well as Smart Ticket
    and Smart Search.

Logical Name solution

In previous versions of Service Manager, the device table used the logical.name field
(labeled CI Identifier) as both a unique key field and a CI display name field, and used
the id field (labeled CI Name) to display CI identification numbers. As a result,
duplicate CI names were not allowed, while some external systems that integrate with
Service Manager, such as Universal CMDB (UCMDB), allow duplicate CI names, which


caused so-called "duplicate logical names issue." Moreover, other modules that
consume CI data, such as the Incident and Change modules, can't have their CI data
automatically synchronized when CIs are renamed or removed, which leads to data
integrity loss.

The following features of the logical name solution in Service Manager 9.41 resolve
these problems:

    Updated Configuration Item dbdict and form
    Allowing user-specified CI Identifiers for new CIs
    Ensuring cross-module CI data integrity through the Reference Field mechanism
    Skipping Query Rewriting in link line records
    Auto Complete in the web client
    Behavior changes of the Fill and Find functions
    Updated DEM Reconciliation Rules functionality
    New or updated RAD and JavaScript functions
    Support for CI reports

            Tip

               For more detailed information about this solution and the post-
               upgrade manual tasks required to adopt it in a production
               environment, see the Service Manager Logical Name Solution white
               paper.
               To enable the logical name solution, you must upgrade the Service
               Manager applications, server, and clients to version 9.41. If you are
               still running an earlier version of the applications, the solution is
               disabled and your integrations aren't impacted.

Integrating Service Manager 9.41 with other products

Service Manager 9.41 has implemented code changes to resolve the impact of the
logical name solution on integrations. A few integrations also require code changes on
the other endpoint product side, which are available only after the Service Manager
9.41 release and hence require manual changes by the customer at the time of the
Service Manager 9.41 release.

            Note

           For more detailed information, see the Service Manager Logical Name
           Solution white paper.


Global ID solution

Service Manager 9.41 supports the company's Global ID solution for product
integrations such as Service Asset Configuration Management (SACM).

Previously, the identification of CIs from the UCMDB and UD solutions was difficult,
and potentially resulted in the duplication of CIs in products such as Service Manager,
Asset Manager, and Run-time Service Model. The Global ID solution uses the UCMDB
global ID as a reconciliation key in the data push framework, thus facilitating the
reconciliation of CIs across Service Manager and other products.

For more information, refer to Software Recommendations for Global ID Best Practices
in CMS.

Support of Automated Service Modeling (ASM)

As version of 9.41, Service Manager supports the ASM functionality in the UCMDB UI.
Service CIs and consumer-provider relationships that are discovered by ASM can be
pushed to Service Manager; additionally, you can tailor Service Manager such that
Service Manager users can access ASM in the context of a business service, and
access Impact Simulation in the context of an affected CI.

Support of ASM enables Service Manager users to view the accurate service trees
that are discovered by ASM and facilitates service modeling in Service Manager.

            Note

           Automated Service Modeling requires the UCMDB ASM Enhanced
           package to be deployed in UCMDB.

For more information, refer to UCMDB UI.

Hybrid mode

In Hybrid mode, Process Designer technology can be fully functional, but the mode
also supports legacy technology such as Format Control. Service Manager 9.41
Hybrid is designed explicitly to ease the transition between Service Manager Classic
and Service Manager Codeless by enabling you to continue to take advantage of your
previous investments in legacy tailoring. This mode is available only to customers who
are upgrading from a Service Manager 9.3x system that has Process Designer
Content Pack 9.30.2 (PDCP3) applied.


            Note

          If you are upgrading a Service Manager 9.3x system that has Process
           Designer Content Pack 9.30.1 (PDCP2) applied, you can upgrade to
           Hybrid mode by first applying PDCP3.

When you upgrade to Service Manager 9.41 Hybrid, a migration tool that is embedded
into the Applications Upgrade Utility automatically migrates some legacy technology
to Process Designer (for example, the tool automatically generates Process Designer
workflows that continue to use legacy states, format control, and process). The extra
steps in the Applications Upgrade Utility that comprise the migration tool are
displayed automatically when you upgrade from an applicable system.

Additionally, further manual tailoring enables you to continue using even more legacy
features (for example, you can run the legacy Request Management module and the
Process Designer-based Request Fulfillment module in parallel).

Service Manager Collaboration

As of version 9.41, Service Manager Collaboration supersedes the previous Enterprise
Collaboration (EC) based instant messaging solution. As an instant messaging tool
embedded in Service Manager, Service Manager Collaboration enables Service
Manager IT operators to collaborate in real time (or anytime) when handling an
Interaction, Incident, Incident Task, Request, Request Task, Problem, Problem Task,
Change, or Change Task. Service Manager users who don't log on to Service
Manager but are available on Microsoft Office Lync can also be invited to a
Collaboration conversation.

            Note

           The chat server can be deployed on the Windows system only, but it
           works well with the Service Manager servers on all the platforms such as
           Linux.

For more information, refer to Service Manager Collaboration.

Service Manager Reports enhancements

In Service Manager 9.41, Service Manager Reports can display in the same report
both the raw data from the system and the new data calculated from the raw data.
Particularly, you can generate a duration report that displays Service Level


Management information against status, phase, and assignment group changes, such
as the duration of record handling.

The following is a summary of the implementation.

    Calculation Report and duration Report

    Calculation Reports can reorganize the standard report data to show an
    overlapping report, which can display both the raw standard report and the
    calculated report. Duration Reports can count and display the time duration
    reports against status, phase and assignment group changes depending on the
    system data provided by the SLM module license and configuration.

    Data preparation framework for duration reports

Service Level Management enhancements

Service Level Management is enhanced in this version to support calculating the
Process Target expiration based on assignment groups, so that you can monitor the
performance of internal/external teams as per the agreed Operational Level
Agreements or Underpinning Contracts. In addition, we offer a new calculation type to
calculate the Process Target expiration time based on your work schedule.

For more information about these features, refer to Calculation of Process Target
metrics.

Streamlined interaction

            Note

           The streamlined interaction solution is disabled by default. This enables
           you to continue to use your existing interaction workflows without any
           issues or additional configuration after you upgrade to Service Manager
           9.41. To use the new streamlined interaction solution, simply manually
           enable it after you upgrade to Service Manager 9.41 Codeless or Service
           Manager 9.41 Hybrid.

           For information about how to enable the streamlined interaction solution,
           see the Service Manager 9.41 Help Center (Codeless version).

To increase IT agents' efficiency and to enhance user experience, Service Manager
9.41 introduces a new, streamlined interaction solution. This streamlined interaction
solution provides the following features and benefits:


    A simplified, intuitive form for interaction logging that requires fewer fields to fill
    and fewer clicks
    A streamlined workflow that requires fewer steps in interaction handling
    Status synchronization between interaction and fulfillment records:

         End users have full visibility of fulfillment status
         IT agents can focus on fulfillment records
    Visibility on the attachment of interaction in the fulfillment record
    Consolidated menu entry for interaction creation, which is based on whether
    Smart Analytics and the streamlined interaction solution are enabled or not

For more information on the streamlined interaction solution, see the Service Desk
section in Service Manager 9.41 Help Center (Codeless version) and the Service
Manager 9.41 Processes and Best Practices Guide (Codeless version).

Service Request Catalog enhancements

Service Request Catalog 9.61 introduces the following new enhancements:

    SRC Survey

    SRC Survey is based on the Service Manager HTML Email solution (JavaMail) and
    applies the out-of box internal Survey connector. By sending surveys from the
    records, you can collect user satisfaction by ratings or open comments. The
    system automatically generates an interaction record of a Complaint or
    Compliment category if the user registers an interaction. The administrators can
    add new questions to surveys and customize the answer types in the survey.

    Show related records

    The request details page lists all related records in the Fulfillment Summary
    section. The information includes the ID, the title, and the status of the related
    record.

Service Manager Mobility enhancements

Service Manager Mobility in this version includes the following enhancements:

    A Related Records tab is added to the Detail view of a record in the power user
    view in Service Manager 9.41 Codeless.
    A list of related records is added to the open tickets and the closed tickets in the
    self-service user view.
    The display name of a CI can be displayed in comfill for mobility. Now you can fill
    a CI by its display name.


    You can now search from SharePoint and Wiki pages (such as HTTP library) in
    addition to the knowledge base library in self-service user view, based on the
    prerequisites that you have purchased a Smart Analytics module license, enabled
    Smart Analytics, and configured the connectors to the SharePoint and HTTP
    libraries correctly.
    When Smart Analytics is enabled, the attachments in the knowledge base library
    can be searched directly.
    When Smart Analytics is enabled, the search will perform a spell check to return
    meaningful results. For example, if you search for "offica," the search result will
    return records that include the term "office" if there is no exact result for "offica."
    The Open Ticket button is renamed to Submit a Request in the self-service user
    view.

Service Manager Upgrade Utility enhancements

Service Manager Upgrade Utility in this version includes the following enhancements:

    Provides a simplified UI wizard by grouping the upgrade process to various
    phases with sequential step numbers.
    Provides two extra wizard screens for the customers who are upgrading from
   Service Manager 9.3x with Process Designer Content Pack 9.30.2 (PDCP3)
    applied to Service Manager 9.41 Hybrid.
    Removes the data scan option.

HTML Editor allowlist

The HTML Editor enables you to visually add and edit rich text content formatted with
HTML tags. Though the HTML Editor is powerful, web sites may be abused without a
proper security control. Therefore, as of Service Manager 9.41, you can use the HTML
Editor allowlist to define a list of allowed HTML elements.

For more information about the HTML Editor allowlist, see Enable HTML Editor
allowlist.

Enhanced query hash algorithm

Service Manager 9.41 provides an enhanced query hash algorithm, which ensures a
higher level of system security when the Service Manager web client or Service
Request Catalog (SRC) is handling URLs. By default, this functionality is disabled for
backward compatibility.

Prerequisites

To use this functionality, your system must have the following configurations:


Service Manager server, web client, and SRC version 9.41 or later
Service Manager 9.41 or later applications, or
(For SRC) Service Manager 9.4x (earlier than 9.41) applications with
QCCR1E120868_SRC940p3_SM940.unl applied. This unload file is available from
the SRC 9.41 package.

            Note

           SRC 9.41 works with Service Manager 9.4x applications only.
           Therefore, there is no SRC unload for Service Manager 9.3x
           applications.

Caution

After upgrading to applications 9.41 (by running the upgrade utility or
the applications patch manager) or after applying the unload for this
functionality, restart your Service Manager server. Additionally, after
applying the unload, you need to tailor the System Information Record
form (info.company.g).

Tailoring the System Information Record form

To enable this functionality in a Service Manager system running the 9.3x or 9.40
applications, after applying the unload for your applications version, you still need to
tailor the System Information Record form. To do so, follow these steps:

  1. Log in to the Service Manager Windows client as a system administrator.
  2. Open the info.company.g format in Forms Designer in Design mode.

  3. In the General tab, add a checkbox with the following settings in the Properties
     pane.

Property                                Setting
Caption                                 Enable Enhanced Query Hash
input                                   strong.queryhash.flag

4. In the General tab, add another checkbox with the following settings in the
  Properties pane.


Visible Condition                       [strong.queryhash.flag]
Caption                                 Allow Legacy Query Hash
input                                   keep.old.queryhash.flag

  5. Click OK twice to save this format.
  6. Restart the Service Manager server.

  7. Go to System Administration > Base System Configuration > Miscellaneous >
     System Information Record, and then click the General tab to verify the two
     checkboxes are successfully added.

Demo data unload file

Service Manager 9.41 provides a demo data unload file (demodata.unl) for testing and
demonstrating the 9.61 new features after you have upgraded to the 9.41 applications
on a fresh installation environment. This demo data package is for Service
Manager9.61 Codeless only. To import the data package, you must use the new Apply
Demo Data wizard provided by Service Manager 9.41. For detailed instructions about
how to access the Apply Demo Data wizard and load the demo data package, see
Service Manager Installation and Upgrade Documentation Center.

To-Do alerts

To-Do alerts are operator-specific notifications that appear in a floating window at the
top of the screen immediately after an operator logs in to the system. The window
appears only when there are pending alerts. The operator can view and acknowledge
the To-Do alerts, and check the details of the records listed. The To-Do alerts feature
must be enabled for individual operators by an administrator.

User experience improvements in Service Manager web
client

Service Manager 9.41 includes a number of user experience improvements to the web
client. For more information, refer to the Service Manager 9.41 Release Notes.

Inactivity timer default behavior change

The inactivity timer is a feature that administrators can configure to close user
sessions that have been idle for a specified period of time. In Service Manager9.61,
this feature is enabled by default, and the time-out value is set to 30 minutes.


For more information about the inactivity timer and how to configure it, see Inactivity
timer.

9.40

Smart Analytics

Built on Service Manager 9.40 and using an OEM-licensed version of IDOL, SM Smart
Analytics heralds the debut of the "Big Data" edition of Service Manager.

Smart Analytics enables your Service Manager to become a more intelligent and
efficient system by extracting and understanding your content. Smart Analytics
includes the following features in this release:

Smart Ticket

With Smart Ticket, you can quickly submit a Service Desk record by just entering a
description or attaching a picture. SM Smart Analytics will intelligently populate other
fields such as category or affected services by extracting and analyzing the content
that you entered in the record.

Hot Topic Analytics

Hot Topic Analytics intelligently displays an interactive diagram indicating the hot
topics among recent incidents so that you can easily discover incident trends and
identify problem candidates.

            Note

           In this release, Hot Topic Analytics doesn't support accessibility features.

For more information, see Smart Analytics overview.

Service Manager Reports

The Service Manager Reports feature provides reports and dashboards to enable
faster analysis and improved time to resolution. Service Manager reports organize
data into various chart formats, and dashboards display one or more reports. In this
way, Service Manager Reports can provide global information about critical activities
or metrics.

The Service Manager The Service Manager Reports feature provides light-weight
reporting for active operational data. As such, the reports are designed to retrieve,
represent, and visualize at most 100,000 active records out of millions. To define


analytic reports against the entire dataset, we recommend that you use third party
business intelligence tools.

Important: Please note that this initial release of Service Manager Reports has
minimal calculation capabilities. As such, we recommend that you continue to use
Crystal Reports or other third party tools for calculation-intensive reporting.

Service Manager Reports schedules assist report managers or administrators to send
reports or dashboard information to the relevant users or user groups at scheduled
intervals. The report schedule specifies who is to be notified, when they're notified,
and the notification method.

Service Manager monitors the performance impact of reports and dashboards. If the
time spent on generating a report exceeds the time threshold that the administrator
sets, the report performance log collects the information and displays it on Report
Running Status dashboard. Report Administrators can take the following measures to
eliminate the impact of the slow reports:

    Enable the cache
    Enable database replication
    Enable indexing for the table query
    Disable the report

After you upgrade to Service Manager 9.40, MySM is disabled.

    MySM is unsupported on Service Manager 9.40 applications +Service Manager
    9.40 binaries. Customers can leverage the new Service Manager Reports feature
    to meet their requirements. Service Manager Reports can incorporate the charts
    and pages created in MySM by using the provided migration script.
    MySM is supported on Service Manager 9.3x applications + Service Manager
    9.40 binaries. Existing customers can continue to use MySM after upgrading to
    Service Manager 9.40 binaries only.

New System Navigator

Service Manager 9.40 provides a new System Navigator, which has the following
enhancements:

    You can easily switch the System Navigator between the following two modes:

         Sidebar mode. In the sidebar mode, the System Navigator only displays the
         icons of the top-level menu items. When the mouse hovers over an icon, a
         pop-up menu immediately appears on the right side of this icon and displays
         the submenu.


                       Note

                    The sidebar mode only works in Power User view (index.do) and
                    Enterprise Self-Service view (ess.do), but doesn't work in
                    Accessible view (accessible.do) and Self-Service Accessible
                    view (accessible_ess.do).

         Accordion mode. The accordion mode looks and works similar as the
         traditional System Navigator.

    For more information about the two modes, see Switching the System Navigator.

                 Note

               When you deploy the web client of Service Manager 9.40 together
               with an earlier version of Service Manager application, you need to
               perform the following actions:

                    You must install the QCCR1E114612_SM940_SM930.unl unload
                    file. Otherwise, the System Navigator doesn't work. For more
                    information about how to install an unload file, refer to the
                    following section in the Service Manager 9.40 Release Notes:

                    Installation notes > Application Unload installation

                    We recommend that you set the Enablesidebarmenu parameter
                    to FALSE to disable the icons and the sidebar mode of the
                    System Navigator. Otherwise, the Service Manager web client
                    uses the default icon for all menu items.

    You can customize the icons of the first-level menu items. Service Manager
    provides the out-of-box icons so that you can easily specify them in the menu
    record.

    For more information about how to customize the menu icons, see Customize
    System Navigator menu icons.

    Service Manager 9.40 enhances the branding capability for the new System
    Navigator. For more information, see "Additional branding implementation options"
    in Branding the web client

Vertical layout


Service Manager 9.40 provides a new vertical layout for the list pane and the detail
pane. You can easily toggle between the horizontal and vertical layouts by using the

      switch. The vertical layout has the following advantages:

    The vertical layout can present more information in the detail pane and list more
    records in the list pane.
    When you move the mouse over a record ID in the record list, a hover window can
    display the values of all the fields that are configured as record list columns.

By default, the vertical layout displays the first four columns in the list pane. You can
easily show or hide columns. To do this, follow the instructions in the Show or hide
columns section in Working with record lists.

Color indicator

The color indicator can apply a color mark-up on a field if the value of the field
matches the pre-defined color indicator setting. The color indicator settings apply to
record list, detail form, and reporting.

            Note

               In detail form, the color indicator setting only applies to the Combo
               and Comfill widgets.
               Color indicator doesn't support Accessible view (accessible.do) and
               Self-Service Accessible view (accessible_ess.do).

Service Manager 9.40 already provides out-of-box color indicator settings on several
fields. For example, the Severity, Priority, and Impact fields in several tables. You
can customize the out-of-box settings on these fields or create new color indicator
settings for other fields. For more information about how to create or edit the color
indicator setting, see Configuring color indicator.

In the record list, you can quickly switch on or off the color indicator of a column. To
do this, use the Color Indicate option in the drop-down menu of that column.

            Note

           Color indicator requires the 9.40 version of Service Manager application.

Enhanced Quick Jump


The following new capabilities are available in the Quick Jump component so that
users can move even faster among sections in record details:

    Expand All: Expand all first-level sections in record details.
    Collapse All: Collapse all first-level sections in record details.
    Back To Top: Go back to the top of record details.

For more information, see Using Quick Jump in record detail.

Quick help

Service Manager 9.40 provides a quick help that lists all the web client keyboard
shortcuts. You can open this quick help by using one of the following methods:

    Click the Help button
         If the web client doesn't have online help, the shortcut list directly opens.
         If the web client has online help, a drop-down menu appears. Click Shortcut
         List from the drop-down menu.

    Use the keyboard shortcut: Alt+Ctrl+/

            Note

           Service Manager 9.40 moves the keyboard shortcut configurations from
           the web.xml file to the shortcut.xml file. The shortcut.xml file is also in the
           WEB-INF folder.

           If you have customized keyboard shortcuts in a previous version of
           Service Manager and you upgrade to Service Manager 9.40, you must
           move the keyboard shortcut configurations from your old web.xml file into
           the shortcut.xml file. Otherwise, your customized keyboard shortcuts
           don't work. For more information about how to configure the shortcut.xml
           file, see Editing Web client keyboard shortcuts.

           If the configuration of the shortcut.xml file is incorrect, the shortcut list
           displays an error message.

Functionality merged from Process Designer Content Pack
9.30.3

Process Designer Content Pack 9.30.3 introduced the following new features that are
now merged into Service Manager Codeless:

    Implementation of the Process Designer framework and workflows for the Help
    Desk modules (Service Desk, Incident Management, and Problem Management)


    Support for interaction between Process Designer-based Help Desk modules and
    other modules
    Support for phase-based Response SLOs (referred to as Service Level Targets
    (SLTs) in Service Manager 9.40) for Service Desk and for Incident Management
    Introduction of Incident tasks to Help Desk and support for Service Level
    Agreements (SLAs) for Incident tasks
    A Process Designer security mechanism for Help Desk modules, including:

         New Process Designer security areas for Help Desk modules
         New Process Designer security roles for Help Desk modules
         Help Desk security profiles are migrated to security roles and rights
         Access rights for the navigation menu and for the Inbox are replaced by
         Process Designer security roles and rights
    The following usability improvements:
         Simplification of related records in Help Desk modules
         The ability to switch between the Group style and the Tab style for a
         Notebook control in the web client
         The addition of record numbers to record titles, including Interactions,
         Incidents, Incident tasks, Problems, and Problem tasks
         A real-time counter in the Attachments and Related Records sections
         Enhancements to the ability to trace phase transition in the workflow figure
    The following Process Designer framework enhancements:
         Workflow-based rule sets to replace file level format control
         Workflow-based actions can be re-used across phases
         Workflow backend transitions enable cross-module interaction
         A new tool that exports workflows into an unload file, so that you can copy
         workflows from one Process Designer-based system to another Process
         Designer-based system
         Phase orders to specify the sequences for Process target calculation

Process Designer-based modules

The following modules are fully reimplemented on Process Designer workflows.

Request Fulfillment

The Request Fulfillment application in Service Manager Codeless enables business
staff to improve their productivity and the quality of business services and products. It
can also help to reduce the cost of providing services and the effort involved in
requesting and receiving access to services. Moreover, the use of the Request
Fulfillment application can increase the control level of an organization's services and
the number of fulfilled requests.


Request Fulfillment includes the following key features:

    The Request model, which defines the prerequisites, required authorizations, and
    sequenced or parallel standard tasks that are used to fulfill the service request
    A detailed and customizable product catalog
    Scheduling of service requests and tasks
    Automated request fulfillment
    Order and stock management
    Interaction with other Service Manager applications, such as Service Catalog,
    Configuration Management, Service Desk, Incident Management, Change
    Management, and Service Level Management
    Integration with other products:

         Providing a common web service interface so that other products are able to
         access service requests and tasks
         Integration with Asset Manager for request fulfillment billing

For the Request Fulfillment processes and best practices, see the corresponding
sections in Processes and Best Practices Guide for Service Manager Codeless.

Service Desk

The Service Desk application includes the following key features.

    Automatic updates of records

    Service Manager Codeless enhances the Service Desk by providing an auto-
    update feature between an interaction and a related incident, problem, change, or
    request. After the initial escalation of an interaction (where the status of the
    interaction updates the related link), the auto-update feature will update an
    interaction when certain status changes occur in the related record.

    In addition, when customer-visible activities in related records occur, these
    activities may also be reflected in the interaction record.

    New Categories

    You can now escalate from an interaction directly to a problem.

    A new "Compliment" type has been added, which follows the same workflow as
    complaints.

    Behavior change

    In this version of Service Manager, you may escalate an interaction only one time.
    Previous versions of Service Manager allowed you to escalate an interaction


    multiple times.

Problem Management

Problem Management includes the following enhancements.

    Problems that are designated as "Major Problems" now make the review phase at
    the end of the workflow mandatory.
    Problems now have a "Source"field, which allows you to specify the origin of the
    incident as an end user, event, an internal source, or elsewhere.
    Known Errors are separated out from Problems and given their own identifier. For
    details, see Open a known error.
    A new Cost tab was added.
    You can modify the categorization of the problem while using the closure wizard.
    You can send a survey directly from the problem to a designated recipient. For
    more information, see Service Manager Survey.

Incident Management

Incident Management has a number of small enhancements:

    Incidents can now be designated as parent or child of another incident, and
    includes supporting fields such as "Parent" to designate whether an incident is
    parent, and "Parent Link" to designate a child and to create the actual link to the
    parent incident.
    Incidents now have a Source field, which allows you to specify the origin of the
    incident as an end user, event, an internal source, or elsewhere.
    Incidents can now link directly to known errors.
    You can send a survey directly from the incident to a designated recipient. For
    more information, see Service Manager Survey.
    A new Cost tab is added.
    You can modify the categorization of the incident while using the closure wizard.
    You can mark an incident as major incident. After you do this, Service Manager
    notifies the specified Incident Manager, and the Review Details field in the Major
    Incident Reviewsection is mandatory in the Review phase.

Change Management

The Change Management application in Service Manager 9.61 Codeless is
reimplemented on Process Designer. The Process Designer based Change
Management workflows (including Change and Change Tasks workflows) are easier
to maintain than the legacy ones.

ITIL aligned Change workflows


The new Change Management workflows (Change Proposal, Normal Change,
Standard Change, and Emergency Change) in the out-of-box system are aligned with
the latest version of ITIL:

    Change Proposal: The Change Proposal process allows users to analyze,
    evaluate, and develop a business case for a change. A Change Proposal is used to
    describe and document a large, proposed change, usually when the proposed
    change has significant impact on the organization's IT infrastructure (for example,
    such as when an organization wants to move all their existing servers to a Linux-
    based environment). Such changes usually involve planning and evaluation,
    feasibility studies and the like.

                 Note

               To support change proposals, Knowledge Management has added
               two new document subtypes: Business Case and Project Information.

    Normal Change: The Normal Change process defines the steps necessary to
    process changes that are categorized, prioritized, planned and follow all
    approvals before deployment. Normal Changes can be further categorized as
    Major, Significant, and Minor.
    Standard Change: The Standard Change process defines the steps necessary to
    process a pre-authorized change that follows a standard procedure. For example,
    a password reset or the provision of standard equipment to a new employee.
    Emergency Change: The Emergency Change process defines the steps necessary
    to process changes that are intended only to repair an IT service error that is
    negatively impacting the business at a high level of severity.

Change Models and Change Categories

Change Management can be configured such that new change records are created
from either a Change Model or a Change Category.

    A Change Model allows you to define a set of change settings, such as Category,
    Subcategory, Change Template, Service, Company, Department, Allowed Roles
    (security roles), and Tasks. When a change is created based on this change
    model, the change record is automatically populated with the predefined values in
    the change model.
    A Change Category has a workflow associated with it and one or more
    subcategories defined for it. When a change is created based on this change
    category, the change record is automatically populated with the predefined values
    in the change category. The out-of-box system provides the following change


    categories: Change Proposal, Standard Change, Normal Change, and Emergency
    Change.

Task Workflows and Task Categories

To work with the new change workflows, a number of Change Task categories are
provided. Each of the task categories has a Process Designer based task workflow
associated with it. Additionally, change tasks can be planned within change records
by using Task Planner, or planned within change models.

Other enhancements

    A Cost tab is added to Change records to improve impact analysis and evaluation
    of business cost of downtime.
    Remediation planning is expanded for failed changes to allow other options than
    "back out".
    Change categorization is enhanced:

         Sub-category "Significant" is added for Normal changes. Significant
         changes are more larger in scope than minor changes but don't require the
         enhanced planning and review of a major change.
         You can modify the categorization of the change while using the closure
         wizard.
    A Review Required option is provided for Standard, Normal, and Emergency
    changes, which is used to disallow changes to bypass the Post Implementation
    Review phase. Once you turn on this flag, the change record can't bypass the
    Post Implementation Review phase, and the system automatically sends a
    notification to the Change Coordinator and Change Manager once the change
    record enters the Post Implementation Review phase.
    The previous "Backout" phase is renamed to the more general "Remediation"
    phase to more aptly reflect the different mitigation scenarios that may occur as a
    result of a unsuccessful change. This makes it more clear that some remediation
    plans may be to take an action other than backing out the change, such as taking
    no action, trying to implement the change again, raise a problem, etc..
    You can send a survey directly from the change to a designated recipient. For
    more information, see Service Manager Survey.

Service Level Management

Service Level Management in Service Manager9.61 implements Process Designer for
management of Service Level Agreements (SLAs), Underpinning Contracts (UCs) and
Operational Level Agreements (OLAs). In addition, the following terminology changes
are implemented: service level objectives are renamed to service level targets (in
forms and display values only; the underlying table columns and code have not


changed due to compatibility considerations), response targets are now process
targets, and availability targets are now service targets.

In addition, all three types of service agreements are now treated as equal, and the
relationships between them clarified to show OLAs and UCs as supporting
(underpinning) agreements to an SLA. Support for regular service reviews has been
added through the addition of service review fields, and the addition of new
Knowledge document subtypes for Service quality plans, and service improvement
plans.

            Note

           Other aspects of Service Level Management, such as the management
           and behavior of Service Level Targets (SLTs), Service Contracts, Outage
           handling, and Service Level Management data have not been modified.

For more information on the new Service Level Management, see the entire Service
Level Management documentation set in the Help Center.

Knowledge Management

Knowledge Management has a number of small enhancements in the release.
Reference documents now have a new "Subtype" field to support a wider variety of
documentation types. These types are described as follows:

    Service Design Package (a document that provides the initial outline of a service
    agreement and denotes what agreements will be required, who the signatories
    shall be, and other process oriented details).
    Service Quality Plan (SQP, a long term quality improvement plan for a service
    agreement)
    Service Improvement Plan (SIP, a limited short term improvement plan for a
    service agreement)
    Business case (provides a business justification for a change proposed by a
    formal Change Proposal)
    Project Information (provides information about the project proposed by a formal
    Change Proposal)
    Availability Plan

Enhanced PD framework

This release includes the following enhancements to the Process Designer
framework.


Workflow viewer and workflow editor enhancements

The user experience of viewing, creating, and editing Process Designer workflows is
enhanced with the following new features:

    You can now copy and paste phases within a workflow.
    You can now add descriptions to transitions between phases, as well as to phases
    and workflows.
    The description field for transitions, phases, and workflows now supports
    formatting (such as italics and bold text) and hyperlinks.
    You can now view a phase's description by hovering the mouse over the phase in
    the workflow viewer.
    An icon is now displayed in phases in the workflow viewer and workflow editor if
    the phase has approvals.

            Note

           In Service Manager Classic, Knowledge Management and Survey
           Integration workflows are Process Designer-based.

Condition Editor enhancements

The Condition Editor widget is completely redesigned with an easy-to-use graphical
interface that includes the following new features:

    You can now build conditions by using meaningful operators instead of
    characters. For example, the enhanced Condition Editor uses "Greater than"
    instead of ">" and "Not equals" instead of "!=."
    You can drag and drop individual expressions within conditions. This makes it very
    easy to modify complex conditions that have many nested expressions.
    You can now copy and paste conditions between condition editors. For example, if
    you want to apply the same complex condition to an automatic transition in two
    different workflows, you can create the condition by using Condition Editor in one
    workflow, copy it, open Condition Editor in the second workflow, and then paste
    the condition.
    Condition validation is now built into Condition Editor. You can't save an invalid
    condition, and the specific elements in the condition that fail validation are
    highlighted in the graphical interface.

Task Planner enhancements

Task Planner is now available for Request Fulfillment as well as for Change
Management, and can be used at both the record and model level. The Task


Information section in change models, changes, request models, and requests now
contains a graphic display of the tasks that are planned for that record. You can open
Task Planner directly from this section by clicking Edit.

You can now use Task Planner to configure input and output fields in tasks and to set
the recommended maximum number of concurrent tasks.

Task Planner is now itself customizable. You can add fields to Task Planner and
configure the mapping between the statuses of tasks and the statuses that are
displayed by Task Planner.

New and enhanced rule types

New rules

    Popup Message Box rule: This rule enables you to create and configure popup
    message boxes that appear to end users.
    Assignment rule: This rule enables you to automatically distribute records (such
    as tasks or records) to the groups and assignees who are most able to process
    them.
    Run Action rule: This rule automatically runs actions (defined by rule sets and/or
    backend transitions) on records that have a specified relationship to the record
    that triggers the rule. For example, you can use this rule to change the workflow
    phase of related records under specific conditions.
    Run Scheduled Action rule: This rule automatically runs an action (defined by rule
    sets and/or backend transitions) on records after a specified length of time has
    passed. For example, you can use this rule to automatically close incident records
    that have been in a Resolved state for a certain number of days.

Enhanced rule

Start or Stop Clock rule: This rule enables you to start or stop an Service Manager
clock to measure elapsed time. In this release, the rule is enhanced to enable you to
set the timezone of the clock, schedule the clock, and include fields in the clock name
when you set the clock name by using a JavaScript.

            Note

           Additionally, the execution order of rule sets and format control is updated
           so that rule sets are always executed before format control. Additionally,
           when a workflow transition occurs, the "update" format control is run
           instead of the "add" format control. These changes prevent an issue in
           which rule sets may run twice.


Improved development auditing

Changes to Process Designer elements, such as workflows, phases, or rules, are now
logged in the devaudit table. This allows you to track the customizations that you
make by using Process Designer, and to unload them from your development
environment.

Case Exchange

The out-of-box Service Manager 9.40 includes all the functionalities of the Case
Exchange Content Pack for Service Manager 9.34. These functionalities enable the
setup of the following Case Exchange integrations.

            Note

           These integrations are limited to the Incident Management module
           between the integrated systems.

    The integration between two Service Manager systems

                 Note

               The other Service Manager system must be 9.40 or 9.34 with Case
               Exchange Content Pack applied.

    The integration between Service Manager and Service Anywhere

For more information about how to create a Case Exchange integration, see Case
Exchange framework.

Entity relationship management tools

Three entity relationship management tools were introduced.

    Relationship Manager: a tool that can automatically discover logical entity
    relationships between tables and fields in your Service Manager system by
    querying the erddef, link, and relatedObjectMap tables and then save the results
    in the relation table. For more information, see Relationship Manager.
    Entity Relationship Diagram utility: a utility that presents entity relationships for
    selected files and fields in your database in dynamic diagrams (called Entity
    Relationship Diagrams or ERDs). For more information, see Entity Relationship
    Diagram utility.


                 Note

               This utility is intended to replace the legacy Entity Relationship
               Diagram (ERD) creation utility. The legacy ERD creation utility and its
               documentation are still accessible from the product user interface
               (Tailoring > Tailoring Tools > ERD Create Records) and the online
               help, and might be removed in a future release.

    Missing Reference Report utility: a utility that can generate a report for selected
    files to help you find out and solve potential data integrity problems (missing
    references). For more information, see Missing Reference Report utility.

Mobile Applications enhancements

Service Manager 9.40 Mobile Applications introduces the following enhancements.

    Self-service user interface

    The employee self-service (ESS) functionality that was previously available
    through content packs is now incorporated directly into Service Manager. The
    Service Manager Mobile Applications self-service user view is intended for end-
    users as an entry point to Service Desk and provides a simplified Service Desk
    interface for users to perform the following tasks:

         Search the knowledge base
         Submit a self-service request
         Submit a smart request
         View opened and closed tickets
         View, approve, or deny pending approval requests

    For more information on installing and using Service Manager Mobile Applications,
   see the Service Manager Mobile Applications User Guide.

    New mobile operating system support

    Service Manager 9.40 Mobile Applications supports iOS 8.

Service Manager Survey

In this release, Service Manager additionally provides the Service Manager Survey
tool, which enables you to implement email surveys in Service Manager
independently without integration with a third party survey tool.


The Service Manager Survey feature is based on the HTML Email solution (JavaMail),
and enables users to manually send individual surveys directly from a record to
selected users. Additionally, it enables the system to automatically send scheduled
surveys to specified users through an out-of-box internal survey connector based on
the survey integration framework.

When users receive a survey link, they can directly click the link or open the link in a
web browser, and then log in to Service Manager to complete the survey. They can
also view open surveys that they have been invited to join and closed survey that they
have completed in the Service Manager portal. In the out-of-box system, Service
Manager surveys are designed to achieve the following goals:

    Collect user satisfaction ratings for the following areas: the level of service
    provided, the speed of response that the user received, and the level of
    communication regarding the service.
    Collect additional comments from the user (if any)
    Allow the user to select if a complaint or compliment needs to be registered. If the
    user selects to do so, the system automatically generates an interaction record
    (Complaint or Compliment category) with the information that the user provided,
    and sends an email to the user with information about the interaction record. The
    user can click the record link to view the record details and status.

For more information, see Service Manager Survey.

Service Request Catalog enhancements

    Notification of updates for your requests

    To improve the overall communication between IT and end users, a new flag is
    added to the Your Requests list to inform the requesters about updates that are
    made to their requests by IT operators.

    Once a "Visible to Customer" update is added to a request, a flag that contains the
    following message is displayed to the requester:

    This record has new updates.

    Copy read-only fields

    You can now copy read-only fields in SRC pages such as Catalog Item Details,
    Request Details, Approval Details, and Subscription Details.

    For example, you can copy the request ID of an item on the Your Request Details
    View page.


    SRC user interface improvement

    The SRC user interface is updated.

    Approve requests and view request details

    Users can now approve or deny request fulfillment records on the Your Approvals
    Request page, and view their current approvals on the Request Approval Details
    page.

Enhanced integration with UCMDB UI

In this release, the UCMDB integration has been enhanced. Once you have enabled
an integration to UCMDB and UCMDB UI, a Primary CI History in UCMDB tab is added
for each problem record whose Primary CI is synchronized from UCMDB. You can
view the CI changes on that primary CI for root cause investigation.

Support of Unicode data type for Microsoft SQL Server

Prior to version 9.40, Service Manager used the VARCHAR, CHAR, and TEXT data
types to store text strings in a Microsoft SQL Server database. Microsoft SQL Server
relies on database collation to support a specific language. Although some languages
share the same collation, most languages don't. As a result, Service Manager did not
support multiple languages when running on a SQL Server database. Service
Manager 9.40 is enhanced to support the Unicode data type on SQL Server. During a
new installation of the Service Manager 9.40 server, when you run the server
configuration utility, if you select the Use Unicode Data Type checkbox for SQL
Server (see the following figure), Service Manager creates data with the Unicode data
type when it loads the applications and demo data, except for the following system
tables: dbdict, licenseinfo, lock, and lockshared.

            Note

           This feature is available for new customers only. Existing customers that
           have upgraded to version 9.40 can't use this feature.

For more information, see Microsoft SQL Server database Unicode support.

Encryption of client keystore passwords

Service Manager supports encryption of keystore passwords in the Windows and
web clients. For more information, see Encryption of client keystore passwords.


Allowing only attachments with certain file extensions from
the web client

To prevent potentially dangerous attachment files from being submitted to Service
Manager, the Service Manager Server provides support for blocking certain types of
attachments submitted through the Windows and web clients, as well as through web
services, based on a pre-defined list of forbidden file extensions (a so-called
"blacklist"). Only attachments whose file types are in this blacklist are blocked.

Beginning with this release, the web client provides additional protection using a so-
called "allowlist" to control what types of attachments are allowed to be submitted to
Service Manager. From the web client, you can submit only attachments whose file
types are in this allowlist. In the out-of-box system, this allowlist includes the
following file types, which are considered safe: bmp, jpg, jpeg, png, gif, txt, log, unl,
and csv. This allowlist is defined in the web tier configuration file (web.xml). You can
adjust the list at your own risk.

            Note

           As of Service Manager 9.50, a new allowlist feature is introduced.
           Therefore, defining lists of file forbidden file extensions is no longer
           supported, and the allowlist of file extensions configured in the web tier
           configuration file (web.xml) is no longer triggered.

Accessibility improvements

In addition to the default accessibility functions of the web client, this release also
includes accessibility support for the following components:

    Embedded Service Manager Calendar
    Service Manager Reports
    Process Designer Request fulfillment

            © Copyright 2026 Open Text
For more info, visit https://docs.microfocus.com
````
