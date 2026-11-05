---
source: Document/pdf/v981/Release_notes.pdf
version: 9.81
sections: 1 .. 1.3
printed_pages: 1-36
---

# 1 Release notes

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1. Release notes

This release of Service Manager introduces new features and enhancements, in
addition to fixing approximately 300 issues.

            Important

           Starting from Service Manager 9.70, the Service Manager Server for both
           Windows and Linux platforms is upgraded to the 64-bit version. To
           migrate to the 64-bit platform, be sure to follow the instructions below:

                The embedded JavaScript engine was upgraded to a higher version
                in the 9.70 server. To avoid any potential problems, you need to
                check your existing scripts and pay attention when you add new
                scripts. See JavaScript tailoring guideline.
                During your deployment, refer to Sizing for detailed sizing practices.

            Note

           Microsoft has announced the deprecation of Basic authentication in
           Exchange Online. Based on this fact, we recommend customers who are
           connecting to the Exchange Online mail server for Smart Email select the
           Microsoft Graph or EWS with OAuth2 authentication as the mail protocol.

What's new in Service Manager 9.81

Service Manager introduces the following new features.

Integrations

Atlassian Jira integration

In addition to Jira Cloud, now Jira Data Center is also supported when you set up the
integration between Service Manager and Jira.

For more information, see Configure the settings in Jira and Configure the settings in
Service Manager.

RESTful commands

The Rest API Framework newly supports the PATCH HTTP commands.
For more information, see RESTful commands.

Security improvements


OAuth 2.0 Code Authentication Support

The OAuth 2.0 Code Authentication Support Solution is now implemented across the
whole SM components and different vendors, including:

     Teams
     Smart Email
     Email Out
     Gmail

For more information, see Set up inbound email, Set up the integration for war room
experience, and Configure Emailout parameters in SMIS.

Feature prerequisites

To work with these new features, you may need to upgrade the server, client, or
applications to version 9.81. See the following table for details.

The Service Manager client/server version must be no earlier than the applications
version. See Support matrix for more information about client/server compatibility and
platform/application compatibility.

Features                                Prerequisites
Integration
                                        Atlassian Jira integration

                                        To work with this feature, you need to
                                        use Service Manager 9.81 applications
                                        and Service Manager 9.81 binaries.

                                        RESTful commands

                                        To work with this feature, you need to
                                        use Service Manager 9.81 applications
                                        and Service Manager 9.81 binaries.

Security improvements                   OAuth 2.0 Code Authentication
                                        Support

                                        To work with this feature, you need to
                                        use Service Manager 9.81 applications
                                        and Service Manager 9.81 binaries.


Added support

Service Manager adds support for the following operating systems and technologies.

Operating systems

     Windows Server 2025
     Red Hat Enterprise Linux 9.4 and 9.5
     Oracle Enterprise Linux 9.4
     Rocky Linux 9.4
     Novell SUSE Linux Enterprise Server 15 SP6

Databases

     PostgreSQL 17

Web application servers

     Apache Tomcat 10
     IBM WebSphere Application Server Liberty 24.0.0.12
     JBoss Web Server (JWS) 6.x

Web server

     IIS bundled with Windows Server 2025

Mobility client

     iOS 18.x
     Android 15.x

Screen reader support

     JAWS Screen Reader software version 2025

For more information, see the Support Matrix.

Discontinued support

For more information, see Deprecation and obsolescence.

New parameters, commands, and files

The following parameters, commands, and files were introduced in this release.

Name                                    Type                                       Service Manager 9.81

See,                                    Servlet parameter  Description

emailoutConfigFromSmis                                     Set
                                                           the emailoutConfigFrom
Only                                                       SmisOnly:1 server
                                                           parameter to use SMIS to
                                                           configure emailout
                                                           settings. After this
                                                           parameter is
                                                           enabled, the parameters
                                                           defined in the emailout
                                                           process through sm.cfg
                                                           and sm.ini won't work.
                                                           Instead, those parameter
                                                           values such as smtphost
                                                           will only be get from
                                                           SMIS configuration.


1.1. Enhancements

Category                                Enhancement ID  Description

Applications                            Idea            If the Use
                                                        locking checkbox is
Web client                                              selected and the Lock on
                                                        display value is true or
Windows client                                          the condition evaluates
                                                        to true, a locking dialog
                                                        box pops up when you
                                                        access a record. Now
                                                        the locking dialog box
                                                        allows you to choose
                                                        whether to open the
                                                        record in read-only
                                                        mode or not. If you
                                                        select No, then the
                                                        record won't be opened.
                                                        Note that when you
                                                        access a record by
                                                        clicking Next/Previous in
                                                        a list page from POWER
                                                        mode, this enhancement
                                                        won't be applied and the
                                                        record will always be
                                                        opened in read-only
                                                        mode.

Integrations                            Idea            The Rest API Framework
                                                        newly supports
                                                        the PATCH HTTP comma
                                                        nds.
                                                        For more information,
                                                        see RESTful commands.

Related topics

Learn about enhancements and submit more ideas on the SMA Idea Exchange.


1.2. Fixed issues

Category                                Issue ID                                  Service Manager 9.81
Web Client                              OCTCR19XW2322092
                                                          Description
Web Client                              OCTCR19XW2352851
Smart Analytics                         OCTCR19XW2366247  When user updates the
Smart Analytics                         OCTCR19XW2367324  service catalog request
                                                          using web client, the
Applications                            OCTCR19XW2376538  visibility conditions for
Applications                            OCTCR19XW2376794  user selections do not
                                                          work as expected.

                                                          Comfill widget is missing
                                                          for the selected
                                                          service(affected.item) in
                                                          the advance filter form
                                                          of cm3r table.

                                                          Email adapter is not
                                                          working as expected if
                                                          the consumed email
                                                          contains formfeed.

                                                          Smart analytics in
                                                          service manager,
                                                          decreases document
                                                          count to 0 for all the
                                                          libararies when expiry
                                                          day is set to 0 after a
                                                          uncertain time.

                                                          Float licenses of request
                                                          management are
                                                          incorrectly counted in
                                                          Service Manager.

                                                          Defective catalogue item
                                                          found in Out of the Box
                                                          (OTTB) examples.

Category                                Issue ID                                  Service Manager 9.81
Web Client                              OCTCR19XW2379656
Applications                            OCTCR19XW2379976  Description
Applications                            OCTCR19XW2380190
Localization                            OCTCR19XW2380220  ServiceManagerAdapter
                                                          9-41 adapter (SOAP)
Server                                  OCTCR19XW2380513  does not push DATETIME
                                                          field from UCMDB to
                                                          service manager.

                                                          When using the clear
                                                          field action with ComFill
                                                          object, there is an issue
                                                          in populating inputs for
                                                          the related fields.

                                                          Validation error message
                                                          for a datetime field does
                                                          not contain label and
                                                          suggestions for
                                                          improvement.

                                                          System displays
                                                          inappropriate German
                                                          message as "Ungültiger
                                                          Anmeldename oder
                                                          ungültiges Kennwort.
                                                          Versuchen Sie es erneut
                                                          versuchen."

                                                          Service Manager log
                                                          files displays extra blank
                                                          line after every log line
                                                          when there is log
                                                          rotation and file
                                                          extention changed to
                                                          .log.Xnumber.

Category                                Issue ID                                  Service Manager 9.81
Applications                            OCTCR19XW2380908
                                                          Description
Applications                            OCTCR19XW2380963
Applications                            OCTCR19XW2381014  The "validate date" rule
Applications                            OCTCR19XW2381821  to validate whether the
                                                          value of a date field is
Applications                            OCTCR19XW2381840  between the relative date
                                                          values of any other two
                                                          date fields is not working
                                                          as expected.

                                                          The retired categories
                                                          are displayed in pull-
                                                          down lists of “Ordering
                                                          from Catalog” and “Non-
                                                          cart Catalog Requests”.

                                                          Description in SMAX
                                                          case exchange can only
                                                          transfer a limited number
                                                          of characters to service
                                                          manager.

                                                          The name field in
                                                          the"Category" related
                                                          forms can contain less
                                                          characters than what is
                                                          allowed in the Database
                                                          dictionary (Dbdict) SQL
                                                          Type.

                                                          Configuration
                                                          Management System
                                                          (CMS) UI requires to
                                                          enter user and password
                                                          to login when using
                                                          service manager
                                                          integrated with UCMDB.

Category                                Issue ID                                  Service Manager 9.81
Server                                  OCTCR19XW2381903
                                                          Description
Applications                            OCTCR19XW2381913
Server                                  OCTCR19XW2381918  When you access a
Server                                  OCTCR19XW2381920  custom MULTI record
Windows Client                          OCTCR19XW2381934  wizard for selecting
                                                          multiple records from a
                                                          list, sometimes the first
                                                          record is automatically
                                                          selected.

                                                          Service manager
                                                          upgrade is slow and in
                                                          the logs displays an error
                                                          message as "sqllimit
                                                          exceeded".

                                                          The popup subform
                                                          shows “No record found”
                                                          after you autocomplete
                                                          on an array field with
                                                          logical name solution.

                                                          The “Apps Version”
                                                          combo box in the hotfix
                                                          forms does not contain
                                                          the value SM9.80.

                                                          System displays full
                                                          name of the operator in
                                                          the journal updates and
                                                          activity logs, even if
                                                          environment settings is
                                                          set to false on "Use Full
                                                          Name".

Category                                Issue ID                                  Service Manager 9.81
Applications                            OCTCR19XW2381955
                                                          Description
Applications                            OCTCR19XW2381966
                                                          In relationship graph of
Windows Client                          OCTCR19XW2381976  Configuration
Server                                  OCTCR19XW2381993  Management System
                                                          (CMS), if two hosts are
                                                          associated with each
                                                          other, no other
                                                          associated hosts are
                                                          displayed.

                                                          New cutomers are able
                                                          to view details of all
                                                          other existing customers
                                                          when selecting "View
                                                          Company Tickets" using
                                                          "All open interactions"
                                                          view.

                                                          The activity logs view
                                                          shows “No data found”
                                                          for an unsuspended
                                                          incident.

                                                          When upgraded service
                                                          manager from version
                                                          9.61 to 9.80, in the task
                                                          editor when the
                                                          dropdown list of task
                                                          category combo box has
                                                          multiple pages,
                                                          sometimes all properties
                                                          are blank.

Category                                Issue ID                                  Service Manager 9.81
Server                                  OCTCR19XW2381994
                                                          Description
Applications                            OCTCR19XW2382018
                                                          When upgraded service
Server                                  OCTCR19XW2382054  manager from version
                                                          9.61 to 9.80, in the task
Applications                            OCTCR19XW2382104  editor when the
                                                          dropdown list of task
                                                          category combo box has
                                                          multiple pages, only
                                                          items in the first page
                                                          can be filtered.

                                                          When upgraded service
                                                          manager from version
                                                          9.64 to 9.72, the
                                                          calender mapping for
                                                          time period uses query
                                                          restrictions with id field,
                                                          the time period records
                                                          are not displayed in the
                                                          calendar for changes.

                                                          The delayed shutdown
                                                          functionality is not
                                                          working as expected.
                                                          The broadcast message
                                                          is displayed, but the
                                                          shutdown doesn't
                                                          actually occur as there is
                                                          no message in the
                                                          sm.log.

                                                          System displays an error
                                                          when using the
                                                          JavaScript global
                                                          method "Quit".

Category                                Issue ID                                  Service Manager 9.81
Localization                            OCTCR19XW2382169
Applications                            OCTCR19XW2382171  Description
Applications                            OCTCR19XW2382179
Applications                            OCTCR19XW2382188  The approval information
                                                          of request raised in
Applications                            OCTCR19XW2382193  German format is
                                                          dispalyed in English.
Applications                            OCTCR19XW2382247
                                                          "Fill Selected" and "Fill
                                                          All" options are not
                                                          displayed in interaction
                                                          ticket.

                                                          Customized SL display
                                                          name causing an error.

                                                          When adding or editing a
                                                          rule of the type “Send
                                                          HTML Email”, the height
                                                          of Script control to get
                                                          recipients is very small.

                                                          The "List All" action for
                                                          the reports not working
                                                          as expected for
                                                          operators that are
                                                          system administrator but
                                                          are not the audience of
                                                          the list type report.

                                                          Additional braces "{" and
                                                          "}" causing an error in
                                                          the
                                                          XML_JSON.xml2json()
                                                          script library.

Category                                Issue ID                                  Service Manager 9.81
Web Client                              OCTCR19XW2382258
                                                          Description
Applications                            OCTCR19XW2382262
Menu Manager                            OCTCR19XW2383013  The time stamp and the
                                                          historic message
Web Client                              OCTCR19XW2383025  displayed in web client is
Server                                  OCTCR19XW2383057  not as per the standard
                                                          format followed
                                                          throughout Service
                                                          Manager.

                                                          Outage of Service
                                                          Manager caused by a
                                                          blocked transaction in
                                                          the database.

                                                          In Service Manager 9.80
                                                          when importing a ".txt"
                                                          file, the system displays
                                                          error as "Error occurred
                                                          while loading external
                                                          file".

                                                          The mouse movement is
                                                          not working to copy the
                                                          content of the journey
                                                          updates field in web
                                                          client.

                                                          The web page scrolls up
                                                          to the first row of the
                                                          form, when the user
                                                          closes the pop-up
                                                          subform that displays
                                                          related CI type/subtype
                                                          information.

Category                                Issue ID                                  Service Manager 9.81
Windows Client                          OCTCR19XW2383066
                                                          Description
Mobility                                OCTCR19XW2383074
Server                                  OCTCR19XW2383083  When customer perform
Web Client                              OCTCR19XW2383094  a search using
Applications                            OCTCR19XW2383102  "Computer" as the CI
                                                          type on the Search CIs
Web Client                              OCTCR19XW2383105  page, the error message
                                                          is displayed as
                                                          "Unrecoverable error
                                                          refreshing screen. See
                                                          log for more detail."

                                                          When the “Select Only”
                                                          property is enabled for a
                                                          Comfill, the option is
                                                          displayed as a combo
                                                          box.

                                                          Unable to attach the
                                                          copied image from an
                                                          email.

                                                          Unable to clear filters
                                                          from activity logs view.

                                                          When mass update
                                                          functionality is used, the
                                                          records are not updated
                                                          to another assignement
                                                          group if the user has no
                                                          right on the target group.

                                                          When an operator is
                                                          added as a member of
                                                          the Help Desk group, the
                                                          chat request option
                                                          remains invisible even if
                                                          the operator signs out
                                                          immediately and sign in
                                                          again.

Category                                Issue ID                                  Service Manager 9.81
Applications                            OCTCR19XW2383110
Applications                            OCTCR19XW2383118  Description
Server                                  OCTCR19XW2383126
Applications                            OCTCR19XW2383224  The suspended records
Applications                            OCTCR19XW2384001  such as incident or
                                                          request records are not
Applications                            OCTCR19XW2384006  successfully deleted
                                                          from the scheduled
                                                          record table.

                                                          Activities added to
                                                          interaction records in
                                                          html format are not
                                                          correctly sent to related
                                                          IM records through
                                                          interoperability.

                                                          sysExec related logs
                                                          appears in sm logs when
                                                          the debugjavascript is
                                                          enabled.

                                                          When connecting to web
                                                          client, the error message
                                                          is misleading if the
                                                          Certificate Authority (CA)
                                                          certificates password is
                                                          incorrect.

                                                          In Service Manager 9.80,
                                                          there is an information
                                                          message displayed in
                                                          emailout.log after every
                                                          10 secs resulting in log
                                                          full of unuseful
                                                          information.

                                                          The usage of the RuleSet
                                                          Type Run Action on an
                                                          “other record” leads to a
                                                          non debuggable error.


Category                                Issue ID          Description
Applications                            OCTCR19XW2384014
Server                                  OCTCR19XW2387265  The email received time
                                                          is earlier than the last
Applications                            OCTCR19XW2387403  email received time in
Applications                            OCTCR19XW2388485  the Smartemail log,
                                                          hence unable to process
Applications                            OCTCR19XW2400488  the mails.

                                                          Unable to enter data and
                                                          data is cleared for in fill
                                                          related device when
                                                          using comfill option in
                                                          device referenced table
                                                          to create an interaction
                                                          for affected.item.

                                                          A notebook tab which
                                                          contains an empty
                                                          editable table is
                                                          displayed in the print
                                                          view.

                                                          Service Catalog user
                                                          selection of type
                                                          "Date/Time" are
                                                          displayed in the related
                                                          "Request Task" as per
                                                          the GMT time zone and
                                                          not as per the user time
                                                          zone.

                                                          In the detail view of the
                                                          report card, the
                                                          Export/Unload option is
                                                          missing from the More
                                                          menu.

Category                                Issue ID                                  Service Manager 9.81
Applications                            OCTCR19XW2405918
                                                          Description
Server                                  OCTCR19XW2409809
Server                                  OCTCR19XW2414005  Links in KM document
Smart Analytics                         OCTCR19XW2416214  are not working when
Server                                  OCTCR19XW2441468  republishing the
                                                          document even if the
Smart Analytics                         OCTCR19XW2442447  document type is not out
                                                          of the box (OOB).

                                                          Fails to open the service
                                                          manager parameters file
                                                          "sm.ini" errno=24.

                                                          In case exchange the
                                                          attachment is not sent to
                                                          service management and
                                                          token expires in 60
                                                          minutes.

                                                          Smart email functionality
                                                          is not working as
                                                          expected for some of the
                                                          emails.

                                                          When creating a new
                                                          Javascript in the
                                                          ScriptLibrary, service
                                                          manager 9.80 fails to
                                                          calculate the length of
                                                          binary data.

                                                          Smart search to filter
                                                          data by last modified
                                                          dates is not working as
                                                          expected.


Category                                Issue ID          Description
Server                                  OCTCR19XW2442448
                                                          In Service Manger when
Smart Analytics                         OCTCR19XW2442741  locking a record for
Smart Analytics                         OCTCR19XW2443653  editing sometimes lead
                                                          to missing latter part of
Smart Analytics                         OCTCR19XW2443654  characters as soon you
Windows Client                          OCTCR19XW2445265  type.
Web Client                              OCTCR19XW2452075
                                                          The SmartEmail reject
                                                          solution of end user
                                                          interaction is not working
                                                          as expected.

                                                          In some special
                                                          conditions, the inbound
                                                          emails are not
                                                          proccessed and displays
                                                          the error message as
                                                          "Ignored an unsupported
                                                          email because it is an
                                                          Unknown MIME Type".

                                                          In some special
                                                          conditions, the inbound
                                                          emails are not
                                                          proccessed and failing to
                                                          strip HTML tags.

                                                          Web preview in the form
                                                          designer is not working
                                                          as expected.

                                                          System generates
                                                          strange characters when
                                                          the knowledge group
                                                          name contains greater
                                                          than symbol in the web
                                                          client.


Category                                Issue ID          Description
Server                                  OCTCR19XW2454340
                                                          When the parameter
Server                                  OCTCR19XW2454531  viewrecordlist is disabled
Applications                            OCTCR19XW2458036  on the client side,
                                                          options such as "Mass
Applications                            OCTCR19XW2462381  Unload" and "Mass
Server                                  OCTCR19XW2464406  Update" are missing
                                                          from the Request Models
                                                          record list.

                                                          The querry "select *
                                                          from cm3rm1" in the SQL
                                                          oquerry tool fails with an
                                                          error even when working
                                                          as expected in the SQL
                                                          server.

                                                          The autocomplete
                                                          feature of the comfill
                                                          widget is not working as
                                                          expected when there is
                                                          an extra post-code
                                                          inside the corresponding
                                                          link.

                                                          The JS E RuleEngine is
                                                          not able to process
                                                          script.

                                                          Business.area field is
                                                          defined in OOB of
                                                          external access record
                                                          of the
                                                          RequestManagement,
                                                          but the field no longer
                                                          exist in Database
                                                          dictionary (Dbdict).

Category                                Issue ID                                  Service Manager 9.81
Server                                  OCTCR19XW2469151
Server                                  OCTCR19XW2470124  Description

Server                                  OCTCR19XW2470219  A blank page is
Web Client                              OCTCR19XW2470574  displayed for the activity
Server                                  OCTCR19XW2482262  logs after an incident is
                                                          unsuspended.
Applications                            OCTCR19XW2491193
                                                          The web page is not
                                                          responding as expected
                                                          when a record has a zip
                                                          attachment uploaded
                                                          through REST API with
                                                          media type
                                                          “multipart/mixed”.

                                                          The querry results of the
                                                          querry tools does not
                                                          match with the database.

                                                          The read-only condition
                                                          of a dynamic form is set
                                                          to true, still the read-only
                                                          checkboxes are editable.

                                                          In the service portal,
                                                          when a comment is
                                                          added for a service
                                                          request, the comment is
                                                          reflected as HTML tags
                                                          in the activity log of the
                                                          related record.

                                                          When creating a change
                                                          ticket for product
                                                          improvement, the system
                                                          displays an error as
                                                          "Invalid index: It is too
                                                          large (35)".

Category                                Issue ID                                  Service Manager 9.81
Server                                  OCTCR19XW2501243
Server                                  OCTCR19XW2369007  Description
Server                                  OCTCR19XW2379502
                                                          The device table of the
Smart Analytics                         OCTCR19XW2381781  service manager 9.80
Applications                            OCTCR19XW2405162  fails to add a new device
Smart Analytics                         OCTCR19XW2418556  in CIs due to buffer size
                                                          limitations.

                                                          Smart Ticket training
                                                          returns 0% accuracy and
                                                          intermittently crashes
                                                          the IDOL service when
                                                          large datasets are used.

                                                          Full reindex of
                                                          Interaction/SD libraries
                                                          does not start and
                                                          remains stuck at “Not
                                                          Started” when the
                                                          dataset contains a large
                                                          number of records.

                                                          Email notifications failing
                                                          for users with multiple
                                                          email addresses.

                                                          Custom upgrade fails
                                                          due to duplicate
                                                          signature entries causing
                                                          ORA‑00001 constraint
                                                          violations.

                                                          Operator login fails with
                                                          “session timeout” when
                                                          a prompt value is set for
                                                          menu.manager.

Category                                Issue ID                                  Service Manager 9.81
Web Client                              OCTCR19XW2440553
                                                          Description
Windows Client                          OCTCR19XW2500159
                                                          When sending an email
Server                                  OCTCR19XW2722378  notification, the email
                                                          subject is duplicated as
Knowledge Management OCTCR19XW2427424                     the first line of the email
                                                          body.
Applications                            OCTCR19XW2377329
                                                          Comments added in the
                                                          service portal appear as
                                                          raw HTML tags in the
                                                          activity log of the related
                                                          request record instead of
                                                          rendering in HTML
                                                          format.

                                                          Rad debugger ‘global’
                                                          and ‘local’ commands
                                                          show incorrect output.

                                                          The system does not
                                                          preserve images in
                                                          custom KM fields when a
                                                          document is republished
                                                          from a working copy.
                                                          For fixes available in
                                                          SM 9.81 applications, if
                                                          you add a new document
                                                          type, you must update
                                                          the KMCustom
                                                          ScriptLibrary. For more
                                                          information, see
                                                          Document type
                                                          management.

                                                          The system incorrectly
                                                          reassigns outage events
                                                          to a single outage record
                                                          after an older‑dated
                                                          incident is added.

Category                                Issue ID                                  Service Manager 9.81
Applications                            OCTCR19XW2380775
Applications                            OCTCR19XW2380913  Description

Server                                  OCTCR19XW2380939  Ancestor source panel
                                                          fails to appear in 3‑way
Smart Analytics                         OCTCR19XW2381728  upgrade merge view.

Smart Analytics                         OCTCR19XW2381780  The “Validate Date”
Applications                            OCTCR19XW2381854  wizard displays the
                                                          “RuleSet.validateDate”
                                                          form incorrectly at zoom
                                                          levels of 125% or higher.

                                                          Windows systems
                                                          generate a
                                                          java.lang.NullPointerExce
                                                          ption when executing
                                                          .\\sm -shutdown.

                                                          Smart email fails to
                                                          support on‑premise EWS
                                                          when using
                                                          impersonation
                                                          authentication.

                                                          Smart email fails to
                                                          create tickets using field
                                                          values specified in the
                                                          email body.

                                                          The license report shows
                                                          incorrect consumption
                                                          when the folder
                                                          entitlement setting is
                                                          enabled.

Category                                Issue ID                                  Service Manager 9.81
Applications                            OCTCR19XW2381869
                                                          Description
Applications                            OCTCR19XW2381906
Applications                            OCTCR19XW2381989  The system ignores the
Applications                            OCTCR19XW2382136  customer ID in
Applications                            OCTCR19XW2382215  SM‑UCMDB SMIS and
                                                          connects to the default
Applications                            OCTCR19XW2383027  customer in a
                                                          multi‑customer SaaS
                                                          setup.

                                                          The system displays an
                                                          incorrect operator name
                                                          in Activity Viewer when
                                                          several operators use
                                                          the same contact.

                                                          The system shows JS
                                                          errors and an incorrect
                                                          CI list when it expands a
                                                          node group in the
                                                          relationship graph.

                                                          System provides no
                                                          index on foreign.key in
                                                          any timeDuration table.

                                                          The SMJiraManager
                                                          function
                                                          getJiraFieldNameById
                                                          does not resolve field
                                                          names for on‑premise
                                                          Jira (Data Center)
                                                          installations.

                                                          Teams integration does
                                                          not check the operator
                                                          principal name when
                                                          synchronizing users.

Category                                Issue ID                                  Service Manager 9.81
Web Client                              OCTCR19XW2399940
                                                          Description
Web Client                              OCTCR19XW2453177
                                                          The prompt icon appears
Smart Analytics                         OCTCR19XW2454619  incorrectly in comfill
                                                          controls when the
Applications                            OCTCR19XW2469439  logical‑name field is
                                                          empty.
Applications                            OCTCR19XW2470716
                                                          The system uses
Knowledge Management OCTCR19XW2476152                     different username
                                                          formats for mobility and
                                                          webtier even when both
                                                          use same TSO
                                                          configuration on linux.

                                                          The scheduler for an
                                                          email‑out SMIS instance
                                                          remains active even after
                                                          the instance is deleted.

                                                          Category descriptions
                                                          fail to appear beneath
                                                          category titles in the
                                                          SMA‑SM Service Portal.

                                                          Problem module list
                                                          views display
                                                          mismatched record
                                                          counts.

                                                          The client hangs and
                                                          times out when users
                                                          preview a knowledge
                                                          document in the HTML
                                                          editor.

Category                                Issue ID                                  Service Manager 9.81
Applications                            OCTCR19XW2508688
Applications                            OCTCR19XW2512199  Description
Applications                            OCTCR19XW2513572
Applications                            OCTCR19XW2519989  The system alters date
                                                          values in report queries
Applications                            OCTCR19XW2520299  on each save due to
Smart Analytics                         OCTCR19XW2520755  repeated timezone
                                                          adjustments.

                                                          Dragging a control to a
                                                          new location in Forms
                                                          Designer causes the
                                                          control to disappear until
                                                          the format is saved.

                                                          The web client leaves
                                                          dropdown menus open
                                                          when users navigate
                                                          fields rapidly.

                                                          The system does not
                                                          create activity‑log or
                                                          journal‑update entries for
                                                          incidents when a request
                                                          is accepted or rejected
                                                          from the SMA portal.

                                                          Exporting a negative
                                                          cost value to Excel adds
                                                          an unintended leading
                                                          quote (').

                                                          Knowledge management
                                                          reindex fails with a “Data
                                                          Truncated in POST” error
                                                          when records contain
                                                          garbled characters.

Category                                Issue ID                                  Service Manager 9.81
Applications                            OCTCR19XW2522305
                                                          Description
Applications                            OCTCR19XW2523187
Web Client                              OCTCR19XW2523240  Activity viewer displays
                                                          notify actions in the
Applications                            OCTCR19XW2525090  wrong order because the
Server                                  OCTCR19XW2525272  system does not
                                                          populate the
                                                          negdatestamp field for
                                                          notify activity records.

                                                          The attachments tab
                                                          ignores read‑only
                                                          conditions with a global
                                                          variable.

                                                          The font style and size
                                                          shown in the knowledge
                                                          management editor do
                                                          not match the font
                                                          rendered in the
                                                          published knowledge
                                                          management document
                                                          in the web client.

                                                          The system raises a
                                                          “doCount() is not
                                                          supported for aggregate
                                                          queries” error when the
                                                          affected CI field triggers
                                                          a suggestion query.

                                                          Upgrading to SM 9.72 p2
                                                          reintroduces the sysExec
                                                          issue due to a missing
                                                          fix.

Category                                Issue ID                                  Service Manager 9.81
Applications                            OCTCR19XW2525420
                                                          Description
Applications                            OCTCR19XW2526008
Applications                            OCTCR19XW2529135  The system fails to
Smart Analytics                         OCTCR19XW2530263  return the
Web Client                              OCTCR19XW2570107  content‑disposition
                                                          header when
                                                          downloading
                                                          attachments with Cyrillic
                                                          filenames through REST.

                                                          Problem‑task updates
                                                          are stored in an incorrect
                                                          format, causing activity
                                                          text to display vertically
                                                          instead of as a single
                                                          string.

                                                          Catalog user options that
                                                          contain a <br> line break
                                                          in the Label field fail to
                                                          display in the SMA‑SM
                                                          preview and service
                                                          portal.

                                                          Email out logs display a
                                                          false warning indicating
                                                          an invalid recipient
                                                          format ([]) even when
                                                          the email is sent
                                                          successfully.

                                                          The system displays raw
                                                          HTML tags in catalog
                                                          user‑selection labels
                                                          instead of rendering the
                                                          formatted text.

Category                                Issue ID                                  Service Manager 9.81
Applications                            OCTCR19XW2712850
                                                          Description
Applications                            OCTCR19XW2713497
Applications                            OCTCR19XW2721386  The system triggers an
                                                          error in
Application                             OCTCR19XW2724361  db.mass.functions
Applications                            OCTCR19XW2728108  during mass update
                                                          because a required
                                                          captionString value is
                                                          missing.

                                                          Journal updates viewer
                                                          does not display new
                                                          journal entries when the
                                                          configured date format is
                                                          set to a period (“.”).

                                                          Activities viewer uses a
                                                          ‘starts with’ operator
                                                          instead of an exact
                                                          match when querying
                                                          activity records, causing
                                                          incorrect and excessive
                                                          result retrieval.

                                                          The web client ignores
                                                          mouse selection in
                                                          autocomplete fields and
                                                          always applies the first
                                                          suggested value.

                                                          The ‘Modify Columns’
                                                          display option does not
                                                          appear initially in inbox
                                                          search results when
                                                          viewrecordlist is set to
                                                          false.

Category                                Issue ID                                  Service Manager 9.81
Applications                            OCTCR19XW2728787
Applications                            OCTCR19XW2729273  Description
Applications                            OCTCR19XW2732360
                                                          The combo box fails to
Applications                            OCTCR19XW2734687  retain the chosen value
Applications                            OCTCR19XW2739037  and defaults to the first
                                                          entry.
Applications                            OCTCR19XW2740038
Web Client                              OCTCR19XW2741115  The web client fails to
                                                          apply custom branding
                                                          logos to the main header
                                                          in Web Tier 9.81.0017.

                                                          The web client encodes
                                                          Nordic characters (æøå)
                                                          as HTML entities in the
                                                          activity.list format after
                                                          upgrade to SM 9.81.

                                                          Add favorite button in
                                                          web client fails when
                                                          searches include the %
                                                          wildcard character.

                                                          Automatic session
                                                          timeout removes the
                                                          "telephonyuser=1 URL"
                                                          parameter in the SM 9.81
                                                          web client.

                                                          Mass updates of CI
                                                          relationships save
                                                          incomplete results after
                                                          upgrade to SM 9.80.

                                                          Collapsing the navigation
                                                          bar for the first time
                                                          causes the web client
                                                          page to load indefinitely
                                                          until the user refreshes
                                                          the browser.

Category                                Issue ID                                  Service Manager 9.81
Applications                            OCTCR19XW2746726
Applications                            OCTCR19XW2752414  Description

Applications                            OCTCR19XW2758322  The Script Library
Applications                            OCTCR19XW2761283  magnify function opens
                                                          an empty window,
Applications                            OCTCR19XW2761388  preventing full‑content
                                                          search in the web client.

                                                          Service Manager
                                                          displays incorrect date
                                                          and time values after
                                                          migrating to PostgreSQL
                                                          due to timezone handling
                                                          differences.

                                                          Required actions buttons
                                                          fail to open in the web
                                                          client when an SD record
                                                          is in callback status.

                                                          The SM 9.81 web client
                                                          incorrectly converts
                                                          special characters (such
                                                          as é, à, >, and quotes)
                                                          into HTML‑encoded
                                                          values, causing
                                                          functional errors and
                                                          display issues.

                                                          The change task editor
                                                          limits the task template
                                                          selection list to 1,000
                                                          records, preventing
                                                          access to additional
                                                          templates.


1.3. Known issues

Service Manager in this release has the following known issues and limitations. This is
a cumulative list of known issues and limitations in Service Manager, including those
that are already documented in previous release notes.


Category      Issue ID                  Description        Found in version
Integration
              OCTCR19X141783            Agent bot works    9.71
Applications  6                         incorrectly if a

                                        Teams user logs

                                        in with the

                                        Turkish language.

                                        This is a known
                                        issue of the
                                        Microsoft Teams
                                        Bot Framework.
                                        There is no
                                        workaround for
                                        this issue.

              OCTCR19X156817            You can still      9.70
              6                         visualize CIs or

                                        impacts even if

                                        the CI is not

                                        synchronized

                                        from UCMDB.

                                        There is no
                                        workaround for
                                        this issue.


Category    Issue ID                    Description          Found in version
Server
            OCTCR19X114620              When you             9.70
Web client  1                           perform Text

                                        Search for a field

                                        configured as IR

                                        key, your search

                                        returns no result

                                        unless the IR key

                                        field is configured

                                        as comments.

                                        There is no
                                        workaround for
                                        this issue.

            OCTCR19X15400               Cannot move the      9.61
            60                          focus to the

                                        questions and

                                        answers in a

                                        closed survey.

                                        There is no
                                        workaround for
                                        this issue.
````
