---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.13 .. 1.13.1
printed_pages: 1649-1678
---

# 1.13 Microsoft Teams

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.13. Microsoft Teams

Microsoft Teams is a chat-based workspace in Microsoft 365 that provides built-in access to
team-specific resources. The integration between Service Manager and Microsoft Teams is a
simplified collaboration model that not only enables people to exchange information in a
rapid way but also provides automated procedures to create and manage tickets.

Compared to traditional collaboration ways, the Teams integration provides the following
highlights:

     Ensure speedy resolution of critical issues by allowing IT agents to open Teams
     conversations directly from a major Incident.
     Reduce manual work, improve productivity and efficiency by automating the creation and
     management of Service Manager tickets directly in Microsoft Teams through an agent
     bot.
     Reduce IT support costs by providing knowledge article links and automating the creation
     of Service Desk tickets through a virtual agent.

Sample use cases

The following typical use cases shed some light on how you can use this integration in your
organization. Note that this isn't an exhaustive list, and the integration supports many more use
cases.

Major Incident

This use case allows the agents to collaborate on Teams with war room experience when
handling a major Incident and ensures speedy resolution of critical issues.

This integration enables an IT agent to initiate a Teams conversation from a major Incident
record and helps this agent directly contact the right people. By viewing the Incident details
(such as Incident ID, Incident Title, and Description), stakeholders including the Incident
Coordinator and Incident Manager and other IT agents can collaborate on its resolution in real-
time in the Teams channel. In the meantime, the system synchronizes all discussions to the
Incident record, which allows other Incident analysts to reuse the solutions later.

Sample screenshot:


For a complete use case, see Collaborate on Teams with war room experience.

Agent bot

This use case improves productivity by allowing Incident stakeholders to ask an embedded
agent bot in Microsoft Teams to open Service Manager tickets.

This integration enables an IT agent to initiate a Teams conversation with the agent bot. After
sending a command to the bot, this agent can directly open an Incident record from Teams. By
following the Incident workflows, the IT agent can update, resolve, and close this Incident - all
through a conversation with the bot in Microsoft Teams without logging on to Service
Manager. In the meantime, the system tracks all operations on the Activity tab for later
reference.

Sample screenshot:

For a complete use case, see Interact with Service Manager by using agent bot.

Virtual agent

This use case reduces IT support costs by allowing a Service Manager employee self-service
(ESS) user to view knowledge articles and then open a Service Desk ticket through an
embedded virtual agent in Microsoft Teams.

This integration enables an ESS user to initiate a Teams conversation with the virtual agent.
After describing an issue, the virtual agent responds with several knowledge articles after
performing a Smart Search in Service Manager. The ESS user can browse these knowledge
articles so as to find a solution. In case none of these articles serve as the best solution, this


user can ask the virtual agent to create a Service Desk ticket. Later, this user can check
the Service Desk ticket's status through the virtual agent as well.
Sample screenshot:

For a complete use case, see Interact with Service Manager by using virtual agent.

Teams notification

This use case allows Service Manager to automatically route a new notification to Microsoft
Teams as a timely reminder when an IT agent updates a record or requires further
communication. For example, when the status of an Incident becomes Resolved, the contact of
this Incident will receive a message on Teams that claims Incident IM##### has been
resolved .
Sample screenshot:

            Note

           Descriptions in this section are mainly based on Microsoft Teams version 1.5.00 at
           the time of this writing. As Teams evolves, we may not provide immediate support
           to the latest Teams features and certain functions of this integration that are related
           to these new features may be affected. We will provide continuous improvement to
           this integration to keep pace with the Teams evolvements.

Related topics


Microsoft Teams Integration
Troubleshoot Teams integration


1.13.1. Set up the integration for war room
experience

By setting up the integration for war room experience, IT agents can collaborate in real-time (or
anytime) in Teams channels when handling a major Incident, an Interaction, a Problem, a
Change, or a Request.
We use Microsoft Graph which exposes REST APIs and client libraries to access data on
Microsoft Teams. After an IT agent creates a conversation in a supported Service Manager
record, the system calls Microsoft Graph API through your registered Azure application to
create a message and then returns the message's web URL to the Service Manager server.
After that, the Service Manager server opens the message's web URL in Microsoft Teams and
exposes the conversation to the IT agent.
See the following illustration for Teams chat creation workflow:

The following content describes how to set up the integration between Service Manager and
Microsoft Teams. The following diagram highlights the steps.


Configure the settings on Azure

User role: Azure Administrator

See the following for prerequisites that you may need to follow when setting up the integration
between Service Manager and Microsoft Teams. Ensure that you have working knowledge
about the Microsoft 365 Developer Program and Azure Entra admin center before you proceed.

Detailed instructions about Microsoft Azure cloud services are outside the scope of the
OpenText product suite and are hence not covered. For more information, see Azure
documentation.

Register an application

Register a new Entra ID Application. Here are some guidelines for your reference when
registering an Application on Azure:

   1. Sign in to the Azure Entra admin center with an Azure account that has the Global
     administrator role.

   2. Enter a name for your Teams integration. Under Supported Account Types, select
     Accounts in this organizational directory only.

   3. Under Advanced settings, set Allow public client flows to No.
   4. Copy and save the values of the Application (client) ID and Directory (tenant) ID for later

     use.

  5. Click App Registrations > <Name of your application> > Certificates & secrets to add a
     new client secret.

     Copy and save the values of the client secret for later use.

   6. If you decide to use Authorization Code as Authorization Grant Type, you need to click
     App Registrations > <Name of your application> > Manage > Authentication and then
     add https://<SM Webtier Host>/<Context Path>/oauth/callback as the Web Redirect
     URIs. Where <SM Webtier Host>/<Context Path> should match the Web Server URL
     defined in System Information Record. For
     example: https://myserver.mydomain.com:myport/webtier/oauth/callback

  7. Click App Registrations > <Name of your application> > API permissions and then add
     the following permissions.


                   Note

                      You must grant admin consent to the ChannelMessage.Read.All
                      permission, which synchronizes the conversation messages between
                      Teams and Service Manager. If you don’t need to synchronize
                      messages, you can skip this permission. For more information about the
                     message synchronization options in Service Manager, see Add an
                     integration instance.
                      You must grant admin consent to the ChannelMember.Read.All
                      permission, which determines the owner of the private channels. If you
                      don’t have any private channels, you can skip this permission.

Create an integration user

The Teams integration uses Authorization Code or Resource Owner Password Credentials
(ROPC) to call Graph API background, where Authorization Code allows an application to sign
in the user by token, while ROPC allows an application to sign in the user by directly handling
their password. Here are some guidelines for your reference when creating users on Azure:

   1. Sign in to the Azure Entra admin center with the Azure account you use when registering
     an application.

   2. Click Users to create a standalone Azure Entra ID user with the type of Member. This
     user is the integration user to invoke Microsoft Graph API. Alternatively, you can use the
     Azure account user directly.

   3. Add Microsoft Teams license to this user. This user isn't able to sign in to Teams without
     this license.

            Note

           If you select Resource Owner Password Credentials as Authorization Grant Type,
           you must disable security defaults on Azure and disable multifactor authentication
           (MFA) for the integration user.

           Otherwise, you need to select Authorization Code as Authorization Grant Type.

           For detailed instructions, see Security defaults in Microsoft Entra ID.


Create teams and channels in Teams

User role: Teams Integration User

This is a prerequisite for this configuration. The integration user must be the default owner of
the teams and channels that you want to use for the communication with Service Manager.

   1. For the General channel, click Manage channel. On the Channel settings tab, select Only
     owners can post messages.

   2. For the other public channels, click Manage channel. On the Channel settings tab, set
     Channel moderation to On. When you turn on moderation for a channel, only the team
     owner (the Teams integration user) can start new posts in that channel and regular users
     in the channel can only reply to existing posts and can't create new posts.

For detailed instructions, see Microsoft Teams documentation.

Configure the settings in Service Manager

User role: Service Manager System Administrator

Functionalize the Show in SM button

When a conversation starts, the system displays a Show in SM button in the default channel
messages of a record. The conversation participants can click this button and then sign in to
the Service Manager web tier to access the record on a new browser tab. See the following
screenshot as an example:

As a prerequisite, you need to enable query hash and then add web server URL to make the
Show in SM button work.

Enable query hash

Enable query hash by adding the querysecurity and queryhashcode parameters to the sm.ini
file. For example:

  querysecurity:1
  queryhashcode:<hostname.com>:13080


Note that you need to provide the same hostname and communication port as above for the
queryhashcode parameter in web.xml. For example:

  <param-name>serverHost</param-name>
  <param-value>hostname.com</param-value>

  <param-name>serverPort</param-name>
  <param-value>13080</param-value>

For more information, see Parameter: querysecurity and Parameter: queryhashcode.

Add the web server URL

Follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous > System
     Information Record.

   2. Click the Active Integrations tab, and then type the web server URL in the Web Server
     URL field. For example, https://<hostname.com>:<port>/webtier/index.do
     Note that you must use the server’s Fully Qualified Domain Name (FQDN) instead of the IP
     address in the web server URL.

   3. Click Save and OK.
   4. Restart the Service Manager server.

Add an integration instance

To set up Teams integration, you must add and enable an instance of the Teams integration in
Integration Manager.
To add and enable a Teams integration instance, follow these steps:

   1. Click Tailoring > Integration Manager to open Integration Instance Manager.
   2. Click Add. The Integration Template Selection wizard opens.
   3. Select MicrosoftTeams from the Integration Template list.
   4. Click Next. The Integration Instance Information page opens.
   5. Complete the following settings in the Integration Instance Information page as

     necessary.

Setting                                 Value                              Service Manager 9.81
Name (required)                         User-defined.
                                                       Description
Version (required)                      1.0
                                        User-defined.  Name of the integration
Interval Time (s)                                      instance.
(required)
                                                       Default: MicrosoftTeams.
This PDF was generated on May 23, 2026
                                                       Version number of the
                                                       integration.

                                                       The interval time that the
                                                       integration background
                                                       schedule runs. For
                                                       example, if you set the
                                                       value to 300, the
                                                       background process tries
                                                       to execute the SMIS
                                                       integration task every 5
                                                       minutes.

                                                       In Teams integration, the
                                                       synchronized task
                                                       consists of several types,
                                                       including message,
                                                       attachment, and image. If
                                                       a user posts a reply with
                                                       an attachment, the
                                                       background process can’t
                                                       synchronize both the
                                                       reply and attachment in
                                                       one SMIS task. The
                                                       background process
                                                       synchronizes the reply
                                                       (raw text) first and then
                                                       detects the embedded
                                                       attachment information.
                                                       Hence, it creates another
                                                       SMIS task to synchronize
                                                       the attachment in the next
                                                       round.

                                                       Default: 300.

                                                                                           Page 1658 of 1727
Setting                                 Value                                        Service Manager 9.81
Max Retry Times                         User-defined.
(required)                                                       Description
                                        Select a level from the
Log Level                               drop-down list.          Maximum allowed number
                                                                 of retries if the
Log File Directory                      Specify a directory.     background scheduler
                                                                 fails to run.

                                                                 Default: 5.

                                                                 Level of diagnostic
                                                                 information that the
                                                                 Service Manager server
                                                                 logs to the log file
                                                                 directory. The possible log
                                                                 levels are DEBUG, INFO
                                                                 (default), WARNING,
                                                                 ERROR, and OFF.

                                                                 Default: INFO.

                                                                 This is a directory that
                                                                 exists on the Service
                                                                 Manager server host
                                                                 where log files are stored.
                                                                 The log includes
                                                                 information for receiving
                                                                 and processing
                                                                 messages.

                                                                 For example:
                                                                 c:\teams_logs.

                                                                 If this field is empty, the
                                                                 system uses the Service
                                                                 Manager sever log
                                                                 (sm.log) for Teams
                                                                 integration.


Setting                                 Value           Description
Shared Scheduler                        User-defined.
                                                        The scheduler that the
                                                        integration instance uses
                                                        to schedule background
                                                        processes. Multiple
                                                        integration instances can
                                                        use a shared scheduler.

                                                        When you create an
                                                        integration template, you
                                                        can define a default
                                                        shared scheduler for the
                                                        instances that are based
                                                        on the template. All
                                                        instances that are based
                                                        on this template can use
                                                        the same shared
                                                        scheduler. However, if you
                                                        create an instance that
                                                        uses a different scheduler,
                                                        SMIS creates a new
                                                        scheduler accordingly.

                                                        If this field is empty, the
                                                        system uses <Teams
                                                        integration name +
                                                        instance ID> for Teams
                                                        integration.

Run at system startup                   True or false.  Automatically enable or
                                                        disable the integration
Description                             User-defined.   instance when the Service
                                                        Manager server starts.

                                                        Description of the
                                                        integration instance.

6. Click Next. The Integration Instance Parameters page opens.
7. Complete the following settings on the Connectivity tab as necessary.

Setting                                         Basic Configuration                      Service Manager 9.81
Authorization Grant Type
                                        Value                        Description

                                        Authorization Code           Authorization Code is the
                                        (default value)              most common grant type,
                                                                     where the authorization
                                        Resource Owner               server returns a single-
                                        Password Credentials         use authorization code to
                                                                     the client. The client then
User Name                               User-defined.                exchanges the code for an
                                                                     access token. If you
                                                                     select Authorization Code
                                                                     as Authorization Grant
                                                                     Type, you may click Get
                                                                     Access Token to generate
                                                                     the authorization token.

                                                                     Resource Owner
                                                                     Password Credentials
                                                                     is an grant type where the
                                                                     application exchanges the
                                                                     user's username and
                                                                     password for an access
                                                                     token. This grant type
                                                                     suits clients highly trusted
                                                                     by the user, such as their
                                                                     computer operating
                                                                     system or a highly
                                                                     privileged application.

                                                                     Name of the integration
                                                                     user you have registered
                                                                     to invoke Microsoft Graph
                                                                     API.

                                                                     For example:
                                                                     xxx@xxx.onmicrosoft.com


Setting                                 Value                        Description
Password                                User-defined.
                                                                     Password of the
Application (Client) ID                 Paste the Application        integration user. This field
Directory (Tenant) ID                   (Client) ID.                 is only required when you
Client Secret                                                        select Resource Owner
                                        Paste the Directory          Password Credentials as
                                        (Tenant) ID.                 Authorization Grant Type.

                                        Paste a client secret        The Application (Client) ID
                                        string.                      you received when
                                                                     registering the application.

                                                                     The Directory (Tenant) ID
                                                                     you received when
                                                                     registering the application.

                                                                     A secret string that the
                                                                     application uses to
                                                                     provides its identity when
                                                                     requesting a token.

Setting                                         Proxy Configuration  Description
Proxy Host
                                        Value                        If you need to use a proxy
Proxy Port                              Specify an IP address or     server to connect to the
Proxy Username                          domain name.                 Microsoft Graph API from
Proxy Password                                                       Service Manager server,
                                        Specify a port number.       type the FQDN or IP
                                        Type an account name.        address of the proxy
                                        Type a password.             server in this field.

                                                                     The port number of the
                                                                     proxy server.

                                                                     The user name to connect
                                                                     to the proxy server.

                                                                     The password to connect
                                                                     to the proxy server.

Click Get Access Token to generate the authorization token if you selected Authorization
Code as Authorization Grant Type. Once you click Get Access Token, a new browser tab
is open to access MS Azure portal. After you select your account and click Accept, the


  "Successfully obtained the access token" message is displayed which indicates that the
  token is successfully obtained.
  Click Verify Connection to verify the connection settings.
8. Complete the following settings on the Options tab as necessary.

Setting                                            Basic Options                      Service Manager 9.81
Message Post Template
                                        Value                     Description

                                        User-defined.             Function name of the
                                                                  JavaScript that Service
                                                                  Manager uses to post
                                                                  messages to Teams.

                                                                  Default:
                                                                  MicrosoftTeamsTemplate.
                                                                  generateMessage.

                                                                              Tip

                                                                             You can
                                                                             search for the
                                                                             MicrosoftTea
                                                                             msTemplate
                                                                             JavaScript in
                                                                             Service
                                                                             Manager and
                                                                             then create
                                                                             customized
                                                                             templates. For
                                                                             more
                                                                             information,
                                                                             see Adaptive
                                                                             Cards.

Setting                                 Value                               Service Manager 9.81
Synchronize Message                     True or false.
                                                        Description

                                                        Select whether to
                                                        synchronize the Teams
                                                        conversation messages,
                                                        stickers, and user-pasted
                                                        images to Service
                                                        Manager or not.

                                                                    Note

                                                                   Service
                                                                   Manager
                                                                   doesn't
                                                                   synchronize
                                                                   the sticker or
                                                                   the user-
                                                                   posted image
                                                                   whose size
                                                                   exceeds the
                                                                   limitation
                                                                   defined in
                                                                   Service
                                                                   Manager.
                                                                   Moreover,
                                                                   Service
                                                                   Manager
                                                                   stops
                                                                   synchronizing
                                                                   the
                                                                   attachments if
                                                                   the total
                                                                   attachment
                                                                   size exceeds
                                                                   the limitation.

Setting                                 Value                               Service Manager 9.81
Synchronize Attachment                  True or false.
                                                        Description

                                                        Select whether to
                                                        synchronize the
                                                        attachments in Teams
                                                        conversations to Service
                                                        Manager or not. This
                                                        option is available only
                                                        after you select
                                                        Synchronize Message.

                                                                    Note

                                                                   Service
                                                                   Manager
                                                                   doesn't
                                                                   synchronize
                                                                   the
                                                                   attachment
                                                                   which size
                                                                   exceeds the
                                                                   limitation
                                                                   defined in
                                                                   Service
                                                                   Manager.
                                                                   Moreover,
                                                                   Service
                                                                   Manager
                                                                   stops
                                                                   synchronizing
                                                                   the
                                                                   attachments if
                                                                   the total
                                                                   attachment
                                                                   size exceeds
                                                                   the limitation.

Setting                                 Value                               Service Manager 9.81

Synchronize Interval Time User-defined.                 Description
(min)
                                                        Interval (in minutes) for
Hide Participant Name                   True or false.  Teams conversation
                                                        synchronization.
This PDF was generated on May 23, 2026
                                                        This option works in
                                                        conjunction with Interval
                                                        Time. For example, if you
                                                        set the value of Interval
                                                        Time to 300, you need to
                                                        wait 5 minutes for
                                                        attachment and image
                                                        synchronization after a
                                                        reply is synchronized. The
                                                        system performs a check
                                                        every 5 minutes till the
                                                        accumulated time reaches
                                                        60 minutes. Then, a new
                                                        round of message
                                                        synchronization starts.

                                                        Default: 60. In the
                                                        customer’s environment,
                                                        we suggest setting this
                                                        value to 60 or larger.

                                                        Select whether to hide the
                                                        participants' names in the
                                                        conversation history to
                                                        protect their personal
                                                        identification information
                                                        (PII) or not. In Teams, all
                                                        conversation participants
                                                        have their distinctive
                                                        names. However, if you
                                                        select this checkbox, the
                                                        Conversation tab in
                                                        Service Manager displays
                                                        the value you specified in
                                                        General Display Name
                                                        instead of all participants’
                                                        names.

                                                                                            Page 1667 of 1727

Setting                                 Value          Description
General Display Name                    User-defined.
                                                       Enter a general name for
                                                       all participants. This
                                                       option is available only
                                                       after you select Hide
                                                       Participant Name.

                                                       Default: Microsoft Teams.

   9. Click Finish. Service Manager creates the instance.
 10. Enable the integration instance. A processor for the Teams integration instance now runs

     in the background.

Synchronize the teams and channels

To synchronize the existing teams and channels to Service Manager, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Collaboration > Teams Settings
     to open the Teams synchronization wizard.

   2. Select the team to synchronize, and then click OK. The Teams Team Information page
     opens.

     The system populates the Display Name, Team ID, and Description fields automatically. A
     team is active by default. If you clear the Active checkbox, all channels under the current
     team become inactive and you cannot configure the channel mappings for this team.

     In the Channels list, you can find the existing channels in the Team. Click a channel to
     open the Channel Information page on which you can view the channel information.

     If you need to synchronize another Team, click New on the Teams Team Information
     page.

            Tip

           After you add, update, or remove the teams or channels in Teams, make sure to
           wait a few minutes and then click the Synchronize button to synchronize the latest
           teams and channels information to Service Manager. If you run into an error, wait a
           few minutes as well. This is a limitation of Microsoft Graph API.

Configure Teams channel mapping

Channel mapping is an important step for connecting the conversations over the records with
the channels in Teams. To direct conversations to an appropriate Teams channel, you must
configure a series of channel mapping between Service Manager and Teams.


To configure Teams channel mapping, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Collaboration > Teams Settings
     to open the Teams synchronization wizard.

   2. Click Channel Mapping. Select a business module from the Module drop-down list, and
     then click Add. The Channel Mapping page opens.

                   Note

                Out-of-the-box, the Module drop-down list consists of Incident, Interaction,
                Problem, Change, and Request. To add channel mappings to another record
                type (such as Change Task), you need to manually add this module and its
                related scmessage to the Microsoft Teams Modules global list.

   3. Click Edit to build a condition or set of conditions, and then select a channel from the
     Channel list.
     See the following screenshot as an example:

  In this example, the system directs conversations over the major Incidents with the
  assignment group of E-mail / Webmail (North America) to the General channel under the
  War Room team for the MicrosoftTeams integration instance.

  Add more conditions as necessary and make sure that the conditions are reasonable. If a
  record meets multiple conditions, the system directs conversations according to the
  sequence of the mappings.

4. You can click Move Up (or press Alt+F8) or Move Down (or press Alt+F9) to arrange the
  mappings. To remove a mapping, select this mapping and then click Remove (or press
  Alt+F7).

5. Click Save and OK.


            Note

                After you add, update, or remove the channels in Teams, make sure to
                validate the channel mappings in Service Manager.

                Make sure that the IT agents have access to the corresponding Teams
                channels especially when you update a record that affect channel mappings.
                Otherwise, the IT agents may fail to start a conversation when clicking the
                Discuss on Teams button. The error message may resemble the following:

                 We can't find that channel due to connectivity issues. Please try again later.

                If you clear the Active checkbox of a channel that already has a channel
                mapping, the corresponding channel mapping entry displays this channel as
                (Empty).

(Optional) Index conversation history

If you are working with Smart Analytics, you can index the Teams conversation history in the
knowledgebases of the corresponding business modules and then search for the keywords in
the conversation history by using Smart Search.

To allow the system to index the Teams conversation history, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Smart Analytics > Smart
     Search to open the Smart Search Configuration page.

   2. Click to open the library of a business module in the Knowledgebase list. For example,
     Incident Library.

   3. On the Knowledgebase Maintenance page, select the Index Chat History checkbox.
   4. Click Save and OK.
   5. Sign out and then sign in to Service Manager again.

Display the Discuss on Teams button

To start a Teams conversation, you can click the Discuss on Teams button in a record. See the
following screenshot as an example:

This button is available for out-of-the-box Incident workflows. However, if you work with
customized Incident workflows, you need to add a new ruleset to display this button.

To display the Discuss on Teams button in a major Incident, follow these steps:

   1. Click Incident Management > Configuration > Workflows to display a list of workflows.
   2. Open your Incident workflow, and then click Edit Workflow Properties.


3. Click the Workflow Based Actions tab, and then add the msteams.chat ruleset as follows:

ID                                      Action  Location  Action Condition
                                                Tray
Discuss on Teams Discuss on                               Expression:
                        Microsoft Teams                   jscall("MicrosoftTe
                                                          amsConversation.i
                                                          sShowConversatio
                                                          nAction",$L.file)
                                                          and
                                                          nullsub(major.incid
                                                          ent in $L.file,
                                                          false)=true and
                                                          $L.mode~="add"

   4. Save your changes.

To display the Discuss on Teams button in a Change record, follow these steps:

   1. Click Incident Management > Configuration > Workflows to display a list of workflows.
   2. Open your Change workflow, and then click Edit Workflow Properties.
   3. Click the Workflow Based Actions tab, and then add the msteams.chat ruleset as follows:

ID                                      Action  Location  Action Condition
                                                Tray
Discuss on Teams Discuss on                               <Define your
                        Microsoft Teams                   expression>

   4. Save your changes.

To display the Discuss on Teams button in other record types, follow similar steps as
described above.

Display the conversation history

To display the conversation history in a record, follow these steps to update the related
workflows.

   1. Click Tailoring > Process Designer > Workflows to display a list of workflows.
   2. Open your Incident, Interaction, Problem, Change, or Request workflow, and then click

     Edit Workflow Properties.
   3. Click the Workflow Based Rule Sets tab > Initialization tab > Add, and then add the

     msteams.init.vars ruleset.

   4. Click the Workflow Based Actions tab, and then add the msteams.refresh.conversation
     ruleset as follows:


ID                                      Action         Location  Action Condition
                                                       Button
Refresh Teams                           Refresh Teams            3039
Conversation                            Conversation             This value may
                                                                 vary depending on
                                                                 your workflow.

   5. Save your changes.

Add the Conversation tab

The system uses the Conversation tab to display conversation history. See the following
screenshot as an example:

Follow these steps to add the Conversation tab to a major Incident:

   1. Click Tailoring > Forms Designer.
   2. Search for the im.incident.subform.msteamsconversation subform, and then set the

     Button ID property of the Go button to the same value as the option ID of the
     msteams.refresh.conversation ruleset.
   3. Search for your Incident format. If you are working with the out-of-the-box Incident
     formats, search for the following formats:

           im.incident.categorization
           im.incident.investigation
           im.incident.review
           im.incident.recovery
           im.incident.closure

   4. Add a Notebook Tab widget to your Incident format, and then set the following properties:

Property                                               Value
Caption                                                Conversation
Visible                                                Yes
Visible Condition                                      [$msteams.conversation.show]=true

   5. Add the im.incident.subform.msteamsconversation subform to the Notebook Tab
     widget.

   6. Save your changes.

Follow these steps to add the Conversation tab to other record types:


1. Click Tailoring > Forms Designer.

2. Search for the corresponding subform as described below, and then set the Button ID
  property of the Go button to the same value as the option ID of the
  msteams.refresh.conversation ruleset.

Module                                  Subform
Change
Interaction                             chm.subform.msteamsconversation

Problem                                 sd.interaction.subform.msteamsconversa
                                        tion
Request
                                        pbm.problem.subform.msteamsconversa
                                        tion

                                        rm.request.subform.msteamsconversatio
                                        n

Note

Out-of-the-box, the system provides Teams conversation subforms to
Incident, Interaction, Problem, Change, and Request. To add the Conversation
tab to another record type (such as Change Task), you need to manually
create a subform similar to the out-of-the-box ones and then define the
HTML-Generating Script and Input properties in the HTML Viewer control on
the subform.

3. Search for the format of the record type. Add a Notebook Tab widget to the format of the
  record type, and then set the following properties.

Property                                Value
Caption                                 Conversation
Visible                                 Yes
Visible Condition                       [$msteams.conversation.show]=true

  4. Add the subform you have updated in step 2 to the Notebook Tab widget.
   5. Save your changes.
  6. Continue to follow step 3 to step 5 with other formats of the record type.

Inactivate the messages to a closed record


After you close a record, you can still post messages in the Teams channel. If you hope to stop
synchronizing messages to the closed record, follow these steps to inactivate the messages:

   1. Click Tailoring > Process Designer > Workflows to display a list of workflows.
   2. Open your Incident, Interaction, Problem, Change, or Request workflow, and then click

     the Closure phase.
   3. Click the Rule Sets tab > On enter tab > Add, and then add the msteams.message.close

     ruleset.
   4. Save your changes.

Customize the message post template

After you click the Discuss on Teams button from an Incident, an Interaction, a Problem, a
Change, or a Request record in Service Manager, the system uses a default message post
template to send a channel message to Teams. This channel message displays the Show in SM
button together with the description, priority, status, and other related information of this
record. See the following screenshot as an example:

                                                          >

However, if you start a conversation from another record type (such as Change Task), the
default channel message may display the Show in SM button only. In this case, you need to
access the Service Manager Script Library and then create a customized message post
template based on the MicrosoftTeamsTemplate JavaScript to include other information for
this record type.

(Optional) Configure Teams integration for multiple SMIS instances

If your Service Manager system operates with folder entitlement or Mandanten file security,
you can also configure the Teams integration to support these security features by setting up
more than one SM-Teams integration instance. As a result, IT agents can start Teams
conversations from the records they are currently associating.

Follow these steps to configure Teams integration to support multiple SMIS instances:

   1. From Database Manager, open the SMISRegistry table.
   2. Click Search and then select the MicrosoftTeams SMIS registry.
   3. On the General tab, set the value for the Instance Count field to a number greater than 1.


   4. Click Save and OK.
   5. Sign out and then sign on to Service Manager again.

After you configure Teams integration and set up several SMIS integration instances, you need
to synchronize the Teams and channels for each SMIS integration instance. The
synchronization wizard now additionally displays the Instance field and enables you to select
the integration instance. See the following screenshot as an example:

Next, configure channel mapping accordingly and associate the records with the
corresponding Teams channels under different SMIS instances. See the following screenshot
as an example:

This example assumes that the system administrator has enabled folder entitlement. The
system directs conversations over major Incidents in the advantage folder to the General
channel under the Incident Handling team for the MicrosoftTeams_OrgB integration instance,
whereas the conversations over major Incidents in the DEFAULT folder go to the General
channel under the major Incident team for the MicrosoftTeams_OrgA integration instance.


Verify the integration

User role: Service Manager System Administrator

This example uses a major Incident record to verify the integration.

   1. Navigate to Incident Management, and then open an existing major Incident record.

   2. Click the Discuss on Teams button, and then check that a default channel message about
     this Incident record arrives at the Teams channel.

     Note: If you update the Incident's priority, status, or phase information after the default
     channel message appears in the Teams channel, this information on the default channel
     message won't be updated.

   3. Send a reply to this message in Teams.
   4. Click the Show in SM button in the default channel messages, and then sign in to the

     Service Manager web tier to access the record on a new browser tab.

   5. Check that your reply appears on the Conversation tab of the Incident record, and the
     reply submitter is your MS Teams user name. If you have selected Hide Participant Name
     in SMIS, the system displays the value you specified in General Display Name instead of
     your actual MS Teams user name.

     If a conversation consists of the following items, the system automatically synchronizes
     these items to Service Manager as well:

           Table, text formats, emojis, and giphys provided by Teams

           These items are available on the Conversation tab

           URLs

           This item is available on the Conversation tab

           Images posted by users and stickers provided by Teams

           Service Manager displays images and stickers on the Conversation tab and saves
           them to the Attachments tab with the Teams_ prefix in file names. For example,
            Teams_xxxx.png .

           User attachments that follow the type and size policy of Service Manager

           Service Manager displays the names of these attachments on the Conversation tab
           and saves these attachments to the Attachments tab.


                   Important

                The system doesn't synchronize the following items from a Teams
                conversation to Service Manager.

                      Reactions in a conversation message
                      Meetings (provided by the Teams Schedule a meeting app)
                      Cards including but not limited to praise badges and approvals (provided
                      by the Teams Praise app and Approvals app, respectively). In this case,
                      Service Manager displays blank messages on the Conversation tab
                      after synchronization.
                      Replies sent by the bot

                   Note

                      If an IT agent deletes a message from Teams, the corresponding
                      message is deleted from Service Manager as well after synchronization.
                      However, if a message with an attachment, an image, or a sticker is
                      removed from Teams, the attachment in the removed message is not
                      affected. The attachment, image, or sticker is still available on the
                      Attachments tab of the Incident.
                      If an attachment with the same name (for example, abc.txt ) appears
                      more than once in the replies to the same record in Teams, Service
                      Manager synchronizes this file to the Attachment tab with an
                      accumulating number in the file name. For example, abc (1).txt , abc
                      (2).txt , and so on.

For a complete use case, see Collaborate on Teams with war room experience.
````
