---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.11.14.1.1 .. 1.11.14.1.1
printed_pages: 2955-3000
---

# 1.11.14.1.1 Set up inbound email

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.11.14.1.1. Set up inbound email

Applies to User roles: System Administrator

To set up inbound email for Smart Email, you must add and enable an instance of the
Smart Email integration in Integration Manager.

To add and enable a Smart Email integration instance, follow these steps:

   1. Sign in to Service Manager as a system administrator.
   2. Click Tailoring > Integration Manager. Integration Instance Manager is

     displayed.
   3. Click Add. The Integration Template Selection wizard opens.

   4. Select SmartEmail from the Integration Template list, and then select the Import
     Mapping checkbox.

   5. Click Next. The Integration Instance Information page is displayed.

   6. Complete the following settings in the Integration Instance Information page as
     necessary.


Setting                                 Value                     Description
Name (required)
Version (required)                      User-defined. Default: Name of the integration
Interval Time (s)
(required)                              SmartEmail .              instance.
Max Retry Times
(required)                              1.0                       Version number of the

SM Server                                                         integration.

Endpoint Server                         User-defined. Default:    Polling interval (in
                                        300 .                     seconds) for
Log Level                                                         synchronization.

                                        User-defined. Default:    Maximum allowed
                                        5.                        number of retries if the
                                                                  background scheduler
                                                                  fails to run.

                                        Enter a name that         Display name for your
                                        identifies your Service   Service Manager
                                        Manager server host.      server host.
                                        For example,
                                        sm_host1 .

                                        Enter a name that         Display name for your
                                        identifies your mail      mail server host.
                                        server host. For
                                        example,
                                        mail_server1 .

                                        Select a level from the   Level of diagnostic
                                        drop-down list. Default:  information that the
                                        INFO .                    Service Manager
                                                                  server logs to the log
                                                                  file directory. The
                                                                  possible log levels are:
                                                                  DEBUG, INFO (default),
                                                                  WARNING, ERROR, and
                                                                  OFF.


Setting                                 Value                     Description
Log File Directory
                                        Specify a directory. For  This is a directory that
                                        example:                  exists on the Service
                                        c:\smartemail_logs .      Manager server host
                                                                  where log files of the
                                                                  Service Manager and
                                                                  mail server integration
                                                                  are stored. The log
                                                                  includes information
                                                                  for receiving and
                                                                  processing emails.

                                                                  If this field is empty,
                                                                  the system uses the
                                                                  Service Manager sever
                                                                  log (sm.log) for Smart
                                                                  Email.

                                                                  If you set the log
                                                                  parameter for the
                                                                  Smart Email processor
                                                                  separately, the log file
                                                                  specified here only
                                                                  contains the logs for
                                                                  receiving emails while
                                                                  the log file set for the
                                                                  processor contains the
                                                                  logs for processing
                                                                  emails.

Run at system startup True or false.                              Automatically enable or
                                                                  disable the integration
Description                             User-defined.             instance when the
                                                                  Service Manager
                                                                  server is started.

                                                                  Description of the
                                                                  integration instance.


7. Click Next. The Integration Instance Parameters page is displayed.
8. Complete the following settings in the Connectivity tab as necessary.

Setting                                       Basic Configuration                      Service Manager 9.81

                                        Value                      Description


Setting                                 Value                   Description
Mail Protocol
                                        Select a protocol from  The mail protocol for
                                        the drop-down list.     receiving emails. The
                                                                supported protocols
                                                                are IMAP, POP3, EWS,
                                                                and Microsoft Graph.
                                                                To use a secure
                                                                protocol, select IMAPS
                                                                or POP3S, or use
                                                                HTTPS for EWS.

Setting                                 Value                      Service Manager 9.81

This PDF was generated on May 23, 2026         Description

                                                           Note

                                                               If you
                                                               use a
                                                               secur
                                                               e
                                                               proto
                                                               col,
                                                               Servic
                                                               e
                                                               Mana
                                                               ger
                                                               only
                                                               conne
                                                               cts to
                                                               the
                                                               applic
                                                               ation
                                                               or site
                                                               that
                                                               Servic
                                                               e
                                                               Mana
                                                               ger
                                                               trusts.
                                                               That
                                                               is,
                                                               you
                                                               must
                                                               have
                                                               a CA-
                                                               signe
                                                               d
                                                               certifi
                                                               cate
                                                               within
                                                               the
                                                               Java
                                                               keyst
                                                               ore
                                                               that
                                                               Servic

                                                                                      Page 295 of 384

Setting                                 Value  Description

                                                            e
                                                            Mana
                                                            ger

                                                            uses.
                                                            If you
                                                            use a

                                                            self-
                                                            signe

                                                            d
                                                            certifi
                                                            cate,

                                                            you
                                                            need

                                                            to
                                                            impor
                                                            t the

                                                            certifi
                                                            cate

                                                            into
                                                            the
                                                            Java

                                                            keyst
                                                            ore
                                                            (<SM

                                                            install
                                                            ation>

                                                            \Serv
                                                            er\RU
                                                            N\jre\l

                                                            ib\sec
                                                            urity\

                                                            cacert
                                                            s).
                                                            Other

                                                            wise,
                                                            Servic

                                                            e
                                                            Mana
                                                            ger

                                                            fails
                                                            to


Setting                                 Value  Description

                                                            conne
                                                            ct to
                                                            the

                                                            mail
                                                            server
                                                            .

                                                            Using
                                                            IMAP

                                                            or
                                                            POP3
                                                            togeth

                                                            er
                                                            with

                                                            STAR
                                                            TTLS
                                                            is

                                                            unsup
                                                            porte

                                                            d.
                                                            After
                                                            you

                                                            enabl
                                                            e the
                                                            FIPS

                                                            mode,
                                                            you

                                                            can
                                                            use
                                                            the

                                                            POP3
                                                            proto

                                                            col
                                                            only.

Setting                                 Value                      Service Manager 9.81

                                               Description

                                                           Note

                                                          Microsoft
                                                          has
                                                          announced
                                                          the
                                                          deprecatio
                                                          n of Basic
                                                          authenticati
                                                          on in
                                                          Exchange
                                                          Online.
                                                          Based on
                                                          this fact,
                                                          we
                                                          recommen
                                                          d
                                                          customers
                                                          who are
                                                          connecting
                                                          to Exchang
                                                          e Online
                                                          mail server
                                                          for Smart
                                                          Email
                                                          select the
                                                          Microsoft
                                                          Graph or
                                                          EWS with
                                                          OAuth2
                                                          authenticati
                                                          on as the
                                                          mail
                                                          protocol.

Setting                                 Value                               Service Manager 9.81
Shared Inbox
                                        True or false.  Description
                                        Default: false
                                                        This option is only
OAuth Authentication                    True or false.  available when you
                                        Default: false  select the EWS or
                                                        IMAPS mail protocol. If
                                                        you enable this option,
                                                        you can configure a
                                                        shared mailbox in the
                                                        Shared Mailbox field
                                                        as the mailbox for
                                                        inbound emails.

                                                        This option enables
                                                        OAuth2 authentication.
                                                        It is only available
                                                        when you select the
                                                        EWS or IMAPS mail
                                                        protocol. If you enable
                                                        this option, the system
                                                        displays the OAuth
                                                        Authentication tab and
                                                        you can configure the
                                                        related settings.

                                                                    Note

                                                                   The system
                                                                   displays
                                                                   the OAuth
                                                                   Authentica
                                                                   tion tab as
                                                                   well if you
                                                                   select the
                                                                   Microsoft
                                                                   Graph mail
                                                                   protocol.


Setting                                 Value                  Description

IMAP/POP3 Mail                          Specify an IP address  The IP address or the
Server                                  or domian name.        fully qualified domain
                                                               name (FQDN) of the
                                        For example:           IMAP or POP3 server.
                                        mail.example.com .

Setting                                 Value                      Service Manager 9.81

This PDF was generated on May 23, 2026         Description

                                                           Note

                                                               If you
                                                               select
                                                               the
                                                               EWS
                                                               mail
                                                               proto
                                                               col,
                                                               this
                                                               field
                                                               will be
                                                               EWS
                                                               URL.
                                                               Enter
                                                               the
                                                               Excha
                                                               nge
                                                               Web
                                                               Servic
                                                               e
                                                               URL.
                                                               For
                                                               exam
                                                               ple,
                                                               https:/
                                                               /outlo
                                                               ok.offi
                                                               ce365
                                                               .com/
                                                               EWS/
                                                               Excha
                                                               nge.a
                                                               smx
                                                               If you
                                                               select
                                                               the
                                                               Micro
                                                               soft
                                                               Graph
                                                               mail
                                                               proto

                                                                                      Page 301 of 384

Setting                                 Value                   Description
IMAP/POP3 Port
                                                                             col,
                                                                             Servic
                                                                             e

                                                                             Mana
                                                                             ger
                                                                             hides

                                                                             this
                                                                             field

                                                                             since
                                                                             it
                                                                             requir

                                                                             es no
                                                                             input.

                                        Specify a port number.  The port number of the
                                        For example: 143        email server. The
                                                                defaults are:

                                                                     IMAP (non-
                                                                     secured): 143
                                                                     IMAP (secured):
                                                                     993
                                                                     POP3 (non-
                                                                     secured): 110
                                                                     POP3 (secured):
                                                                     995
                                                                     EWS: port not
                                                                     required


Setting                                 Value                   Description
User Name
                                        Type an email account.  The email account
                                                                that's used to connect
                                        For example:            to the mail server.
                                        abc@exmaple.com         When a Service
                                                                Manager user sends an
                                                                email to this email
                                                                account, the system
                                                                processes the email
                                                                based on the settings
                                                                in the Smart Email
                                                                integration instance.

                                                                When you are
                                                                configuring multiple
                                                                Smart Email integration
                                                                instances on one
                                                                Service Manager
                                                                server, we recommend
                                                                using a unique mailbox
                                                                for each instance.

Setting                                 Value                      Service Manager 9.81

                                               Description

                                                           Tip

                                                          If you
                                                          select EWS
                                                          in the Mail
                                                          Protocol
                                                          drop-down
                                                          list, you
                                                          can also
                                                          type a
                                                          domain
                                                          account as
                                                          the user
                                                          name. For
                                                          example,
                                                          example.c
                                                          om\abc .

Setting                                 Value                                 Service Manager 9.81
Password                                Type a password.
                                                          Description

                                                          The password of the
                                                          email account that's
                                                          used to connect to the
                                                          mail server.
                                                          This field is unavailable
                                                          when you check
                                                          OAUTH
                                                          Authentication.

Setting                                 Value                      Service Manager 9.81

                                               Description

                                                           Note

                                                          According
                                                          to Google's
                                                          announce
                                                          ment, as of
                                                          end of
                                                          September
                                                          2024, user
                                                          can no
                                                          longer use
                                                          a password
                                                          for access
                                                          gmail. For
                                                          customers
                                                          who are
                                                          using Gmail
                                                          as mailbox,
                                                          currently
                                                          the
                                                          workaroun
                                                          d is to use
                                                          "app
                                                          password"
                                                          instead of
                                                          user
                                                          password
                                                          for this
                                                          field.


Setting                                 Value                   Description
Shared Mailbox
                                        Type an email address.  This field is only
                                                                available when you
                                                                select the Shared
                                                                Inbox checkbox for the
                                                                "EWS" or "IMAPS" mail
                                                                protocol.

                                                                Configure your shared
                                                                mailbox in this field as
                                                                the mailbox for
                                                                receiving inbound
                                                                emails. The email
                                                                account in User Name
                                                                must be an authorized
                                                                user to access this
                                                                shared mailbox.

Setting                                    Advanced Configuration                      Service Manager 9.81
Proxy Host
                                        Value                      Description
Proxy Port
Proxy Username                          Specify an IP address      If you need to use a
Proxy Password                          or domain name.            proxy server to
                                                                   connect to the mail
                                                                   server from Service
                                                                   Manager server, type
                                                                   the FQDN or IP address
                                                                   of the proxy server in
                                                                   this field.

                                                                   Only the SOCKS proxy
                                                                   (Socket 4 and Socket
                                                                   5)is supported. The
                                                                   HTTP proxy is
                                                                   unsupported because
                                                                   JavaMail doesn't
                                                                   support direct access
                                                                   through an HTTP proxy
                                                                   web server. The
                                                                   SOCKS proxy
                                                                   configured in SMIS
                                                                   takes effect on the
                                                                   inbound email only
                                                                   without any impact on
                                                                   the outbound email.

                                        Specify a port number. The port number of the
                                                                     proxy server.

                                        Type an account name. The user name that's
                                                                     used to connect to the
                                                                     proxy server.

                                        Type a password.           The password that's
                                                                   used to connect to the
                                                                   proxy server


Setting                                 Value                    Description
Authorized Domains
                                        Specify one or multiple  The domains that are
                                        domain names             authorized to send
                                        (separated by            emails to the email
                                        semicolons).             account specified for
                                                                 the integration. The
                                        For example:             Smart Email processor
                                        example.com .            rejects the emails from
                                                                 unauthorized domains
                                                                 and triggers the
                                                                 corresponding Smart
                                                                 Email error handling
                                                                 case.

                                                                 You must specify at
                                                                 least one authorized
                                                                 domain. Otherwise, no
                                                                 incoming email can be
                                                                 successfully
                                                                 processed by the
                                                                 Smart Email processor.

Setting                                 Value                                  Service Manager 9.81
Inbox Folder
                                        Specify the inbox  Description
                                        folder.
                                        Default: INBOX     The folder where e-
                                                           mail messages are
                                                           received in the e-mail
                                                           account.

                                                                       Note

                                                                      Only the
                                                                      root folder
                                                                      in the
                                                                      mailbox is
                                                                      supported.
                                                                      Using a
                                                                      subfolder is
                                                                      unsupporte
                                                                      d.

                                                                       Note

                                                                      If you leave
                                                                      it empty,
                                                                      Smart
                                                                      Email use
                                                                      INBOX as
                                                                      the default
                                                                      inbox
                                                                      folder.


Setting                                 Value                   Description
Error Email Folder
                                        Specify a folder name.  The folder in the email
                                        For example: Error .    account to which the
                                                                messages with errors
                                                                are moved.

                                                                Note

                                                                Only the
                                                                root folder
                                                                is
                                                                supported.
                                                                Using a
                                                                subfolder is
                                                                unsupporte
                                                                d.

                                                                Note

                                                                If you use
                                                                the POP3
                                                                or POP3S
                                                                protocol,
                                                                this option
                                                                doesn't
                                                                take effect
                                                                due to
                                                                protocol
                                                                limitations
                                                                and the
                                                                system
                                                                doesn't
                                                                display this
                                                                option.

Setting                                 Value                               Service Manager 9.81

Delete Email when                       True or false.  Description
successfully                            Default: true
processed                                               Whether or not to
                                                        delete the emails from
                                                        the mail server once
                                                        they are successfully
                                                        processed.


Setting                                 Value  Description

Processed Email Folder Specify a folder name.  The folder in the email
                             For example:      account to which the
                              Processed .      successfully
                                               processed emails are
                                               moved.

                                               If you select Delete
                                               Email when
                                               successfully
                                               processed, this option
                                               doesn't take effect and
                                               the system doesn't
                                               display this option.

                                               Note

                                               Only the
                                               root folder
                                               in the
                                               mailbox is
                                               supported.
                                               That is, a
                                               sibling
                                               folder to
                                               the Inbox
                                               folder.
                                               Using a
                                               subfolder is
                                               unsupporte
                                               d.

Setting                                 Value                      Service Manager 9.81

                                               Description

                                                           Note

                                                          If you use
                                                          the POP3
                                                          or POP3S
                                                          protocol,
                                                          this option
                                                          doesn't
                                                          take effect
                                                          due to
                                                          protocol
                                                          limitation
                                                          and the
                                                          system
                                                          doesn't
                                                          display this
                                                          option.

               Tip

             To verify the connection, after you set up the email integration, send
             an email to the configured mailbox. If the connection fails, as
             configured in Smart Email error handling, the administrator will
             receive a "Failed to connect to the mail server" email notification and
             the system will create an incident.

               Note

             You can also configure the smartemailTimeout parameter in sm.ini
             to define the timeout value that the Smart Email process waits for a
             connection to the mail server to be established. The default value is
             45 seconds. See Parameter: smartemailTimeout.

9. Click the OAuth Authentication tab, and then configure the following settings as
  necessary.


For IMAPS mail protocol, you may access Gmail via OAUTH protocol. To enable
gmail and get Client ID/Client Secret from google cloud console,
see https://console.cloud.google.com/welcome.

Setting                                 Value               Description

Authorization Grant                     Authorization Code  The OAUTH
Type                                                        Authenticate grant type

Client ID                               The Client ID       The Client ID you
                                                            received from google
                                                            cloud console

Client Secret                           The Client Secret string The Client Secret you
                                                                     received from google
                                                                     cloud console

Clicking Get Access Token will jump to google console to get the access token.

For EWS mail protocol and Microsoft Graph, fill in the OAuth Authentication
settings as below:


Setting                                 Value                     Description
Authorization Grant
Type                                    Client credentials        The OAUTH
                                        if you select the         Authenticate grant type
Application (Client) ID                 EWS mail protocol
Directory (Tenant) ID                   together with
Client Secret                           OAuth
                                        Authentication
                                        Authorization
                                        Code or Resource
                                        Owner Password
                                        Credentials if you
                                        select the
                                        Microsoft Graph
                                        mail protocol

                                        The Application (Client)  The Application (Client)
                                        ID                        ID you received when
                                                                  registering the
                                                                  application

                                        The Directory (Tenant)    The Directory (Tenant)
                                        ID                        ID you received when
                                                                  registering the
                                                                  application

                                        The Client Secret string  A secret string that the
                                                                  application uses to
                                                                  provides its identity
                                                                  when requesting a
                                                                  token.


Setting                                 Value              Description
Permission Type
                                        Application        The permission type of
                                        Permissions if     authentication.
                                        you select the
                                        EWS mail protocol
                                        together with
                                        OAuth
                                        Authentication
                                        Delegated
                                        Permissions if
                                        you select the
                                        Microsoft Graph
                                        mail protocol

For Microsoft Graph with Authorization Grant Type as Authorization code, the
Get Access Token option is available. Clicking Get Access Token will jump to
Azure portal to get the access token.

For more information for EWS protocol and Microsoft Graph, see the Register
your application section on the Authenticate an EWS application by using OAuth
page.

To use Delegated Permissions for Smart Email, you need to perform these
additional steps in the Azure Active Directory admin center and Azure portal.

In the Azure Active Directory admin center:

  1. Click App Registrations > <Name of your application> > API permissions
     and then click Add a permission.

   2. Click Microsoft Graph and then click Delegated permissions.
   3. Expand Mail and select Mail.ReadWrite. If you are using a Shared Inbox,

     select Mail.ReadWrite.Shared as well.
   4. Grant admin consent to the delegated permissions as described in the

     previous step.
  5. Add https://<SM Webtier Host>/<Context Path>/oauth/callback as

     the Web Redirect URIs. Where <SM Webtier Host>/<Context
     Path> should match the Web Server URL defined in System Information
     Record. For
     example: https://myserver.mydomain.com:myport/webtier/oauth/callback


          Make sure that you have added Web Server URL for Service Manager
          clients. See Configure the Service Manager Web tier server URL.

    In Azure portal, disable security defaults on Azure and disable multifactor
    authentication (MFA). For detailed instructions, see Security defaults in Azure
    AD.

10. Click the Options tab, and then configure the following Smart Email options as
    necessary.

Setting                                          Basic Options                      Service Manager 9.81

                                        Value                   Description


Setting                                 Value                  Description
New Email Action
                                        Select an action from  The action of Smart
                                        the drop-down list.    Email upon the receipt
                                                               of a new email
                                                               message:

                                                                    Create
                                                                    Interaction: Each
                                                                    initial message
                                                                    automatically
                                                                    results in the
                                                                    creation of a new
                                                                    Interaction.
                                                                    Create Incident:
                                                                    Each initial
                                                                    message
                                                                    automatically
                                                                    results in the
                                                                    creation of a new
                                                                    Incident.
                                                                    Create Change:
                                                                    Each initial
                                                                    message
                                                                    automatically
                                                                    results in the
                                                                    creation of a new
                                                                    Change.

Setting                                 Value                      Service Manager 9.81

This PDF was generated on May 23, 2026         Description

                                                           Note

                                                          This setting
                                                          takes
                                                          effect in
                                                          the current
                                                          Smart
                                                          Email
                                                          instance
                                                          only. When
                                                          you are
                                                          configuring
                                                          multiple
                                                          Smart
                                                          Email
                                                          integration
                                                          instances
                                                          on one
                                                          Service
                                                          Manager
                                                          server, we
                                                          recommen
                                                          d using a
                                                          unique
                                                          mailbox for
                                                          each
                                                          instance.
                                                          Hence,
                                                          when an
                                                          email is
                                                          sent to the
                                                          mailbox,
                                                          the system
                                                          can create
                                                          an
                                                          interaction,
                                                          an incident,
                                                          or a
                                                          change as

                                                                                      Page 321 of 384
Setting                                 Value                      Service Manager 9.81

                                               Description

                                                          defined in
                                                          the New
                                                          Email
                                                          Action in
                                                          the current
                                                          Smart
                                                          Email
                                                          instance.

Setting                                 Value                               Service Manager 9.81

Allow to update                         True or false.  Description
records by incoming                     Default: false
emails                                                  Once enabled, the
                                                        system automatically
                                                        updates a record upon
                                                        the receipt of a new
                                                        email message of a
                                                        particular format.
                                                        Depending on your
                                                        selection in the New
                                                        Email Action field, the
                                                        types of records that
                                                        can be updated are
                                                        Incident, Interaction,
                                                        and Change. Suppose
                                                        you have selected
                                                        Create Interaction in
                                                        the New Email Action
                                                        field, the system
                                                        automatically updates
                                                        an Interaction record
                                                        upon the receipt of a
                                                        new email message.

Setting                                 Value                      Service Manager 9.81

                                               Description

                                                           Note

                                                          This setting
                                                          takes
                                                          effect in
                                                          the current
                                                          Smart
                                                          Email
                                                          instance
                                                          only. Only
                                                          the fields
                                                          that are
                                                          configured
                                                         in step 13
                                                          can be
                                                          updated by
                                                          incoming
                                                          emails.

Setting                                 Value                               Service Manager 9.81

Enable email size                       True or false.  Description
restrictions                            Default: false
                                                        Once enabled, you can
                                                        define the email size
                                                        (in KB) so that only the
                                                        emails under the
                                                        specified size are
                                                        processed. If the
                                                        user's email is larger
                                                        than this value, the
                                                        system triggers the
                                                        corresponding Smart
                                                        Email error case and
                                                        notifies the sender with
                                                        an email. For more
                                                        information, see Smart
                                                        Email error handling.

                                                                    Note

                                                                   If the size
                                                                   specified in
                                                                   this field is
                                                                   bigger than
                                                                   any other
                                                                   attachment
                                                                   size
                                                                   configured
                                                                   in Service
                                                                   Manager,
                                                                   the system
                                                                   ignores the
                                                                   value
                                                                   specified in
                                                                   this field.

Setting                                 Value                               Service Manager 9.81
Enable email archiving
                                        True or false.  Description
                                        Default: true
                                                        Once enabled, the
                                                        system stores the
                                                        inbound emails in a
                                                        database table
                                                        (emailarchivingstore).

Setting                                 Value                               Service Manager 9.81

Use default operator to                 True or false.  Description
create or update
                                                        If an end user (contact)
records                                 Default: false  is not associated with
                                                        an operator, the system
                                                        uses the default
                                                        operator specified here
                                                        to create or update
                                                        records.

                                                                    Note

                                                                   If you
                                                                   enable this
                                                                   option,
                                                                   when
                                                                   Smart
                                                                   Analytics is
                                                                   used for
                                                                   smart
                                                                   email,
                                                                   similar
                                                                   recommen
                                                                   dation or
                                                                   classificati
                                                                   on might
                                                                   be
                                                                   generated
                                                                   for
                                                                   different
                                                                   end users
                                                                   because
                                                                   the same
                                                                   default
                                                                   operator is
                                                                   used.

Setting                                    Smart Analytics Options                      Service Manager 9.81

                                        Value                       Description

Enable Smart Ticketing True or false.                               Once enabled, the
                             Default: false                         system automatically
                                                                    classifies the record
                                                                    created from an email
                                                                    by using Smart
                                                                    Analytics. The OCR
                                                                    (image to text) feature
                                                                    of Smart Analytics is
                                                                    also enabled.

                                                                                Note

                                                                               This option
                                                                               is only
                                                                               visible if
                                                                               Smart
                                                                               Analytics is
                                                                               enabled.

11. Click the Error Handling tab, and then configure the error handling settings in
    each sub-tab as necessary.

       1. On the Configuration sub-tab, specify the configurations for each error
          case.

Setting                                 Value                              Service Manager 9.81
Create Incident                         Select Yes or No.
                                                           Description
Email to Admin                          Select Yes or No.
Email to Sender                         Select Yes or No.  Select Yes to create
Email to Others                         Select Yes or No.  an incident record for
                                                           this error case. You
                                                           can configure the
                                                           field values of the
                                                           incident in Incident
                                                           Options.

                                                           Select Yes to send an
                                                           email to the Admin
                                                           Email specified in
                                                           Email Options.

                                                           Select Yes to send an
                                                           email to the sender of
                                                           the initial email.

                                                           Select Yes to send an
                                                           email to the
                                                           operators or email
                                                           addresses specified
                                                           in Email Options.

Setting                                 Value                             Service Manager 9.81
Error Message
                                        SC message ID or  Description
                                        plain text.
                                                          The error message in
                                                          the mail. You can
                                                          specify an SC
                                                          message or type
                                                          plain text.

                                                                      Note

                                                                     If you
                                                                     want to
                                                                     use the
                                                                     SC
                                                                     message,
                                                                     define it
                                                                     as
                                                                     scmsg:
                                                                    <scmess
                                                                    age_id>.
                                                                     The
                                                                     scmsg
                                                                     class
                                                                     should be
                                                                     SmartEm
                                                                     ail.

2. On the Incident Options sub-tab, define the default field values in the
  incident record that the system creates when an error occurs during email
  processing.

3. On the Email Options sub-tab, specify the admin email address and other
  email addresses or operators to receive email notifications configured on
  the Configuration sub-tab.


Setting                                 Value             Description
Admin Email                             Email address or
                                        operator name     Specify an email
Other Emails                                              address or operator
                                        Email address or  name for the
                                        operator name     administrator. When
                                                          the Email to Admin
                                                          option is set Yes, the
                                                          system sends out an
                                                          email to the email
                                                          address specified
                                                          here.

                                                          Specify one or
                                                          multiple email
                                                          addresses or
                                                          operator names.
                                                          When the Email to
                                                          Others option is set
                                                          to Yes, the system
                                                          sends out an email to
                                                          the email addresses
                                                          specified here.

12. Click Next. The Integration Instance Fields page is displayed.

13. Configure the SM fields and the endpoint fields as necessary, and then click
    Next. The Integration Instance Mapping page is displayed.

14. Configure the field mapping between the message from the mail server and the
    SM record (interaction or incident) to be created based on the inbound email.


                 Note

               The out-of-box field mapping in the SMIS template is based on
               interaction fields. You can use this mapping when you choose to
               create a new interaction for an inbound email. However, if you
               selected Create Incident in the New Email Action option, you need
               to manually re-configure the field mapping for incident fields.

                 Note

               If format control "login.DEFAULT" is not executed properly in your
               environment, some variables can't be initialized. You need to
               reinitialize these variables in SMIS ("Post Script" in field mapping
               area) based on the current operator.

15. Click Finish. Service Manager creates the instance.
16. Enable the integration instance. A processor for the integration instance (<Smart

    Email SMIS instance name +instance ID>) that receives inbound emails now runs
    in the background.

                 Tip

               When the status of the SMIS instance for inbound email goes to
               "Error", the system administrator needs to navigate to
               Miscellaneous > System Status, locate the "<Smart Email SMIS
               instance name +instance ID>" process and kill it. After that, go back
               to Integration Manager and edit the Smart Email SMIS instance as
               necessary.

17. Start the Smart Email processor that processes the received emails:

                 Note

               You can configure the number of SmartEmail processors in Smart
               Email settings. If the configured number is more than one, you can
               start different debug nodes to run different processors.


                   Note

                If the server running the debug node has multiple IP addresses,
                make sure that you set a public IP address for the groupbindaddress
                parameter in sm.ini. Otherwise, the Smart Email solution can't
                provide solutions in the emails because the server can't connect to
                the Smart Analytics Web Service API.

        1. Add a debug node in sm.cfg. For example:

                 sm -httpPort:13081 -httpsPort:13082 -
                 log:../logs/sm.13081.log -debugnode

        2. Restart Service Manager and log on to Service Manager with the debug
           node:
           Window Client: In the Server port number field, enter the debug node port
           (for example, 13081).
           Web Tier client: Append serverPort=<debug node port> to the web tier
           URL. For example: http://myhost:8080/webtier-9.70/index.do?
           serverPort=13081

        3. Navigate to Miscellaneous > System Status, click Start Schedulers, and
           then start SmartEmail_Processor<X>.

Related topics

Integration Manager
Integration Instance Information fields
Enable or disable an integration instance
Monitor integration instance status
````
