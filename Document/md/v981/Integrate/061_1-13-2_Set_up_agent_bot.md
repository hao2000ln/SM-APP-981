---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.13.2 .. 1.13.4
printed_pages: 1678-1700
---

# 1.13.2 Set up agent bot

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.13.2. Set up agent bot

By embedding agent bot to Microsoft Teams, Service Manager IT agents can create Incidents
and Interactions, update, resolve, or close Incidents - all through a conversation in Microsoft
Teams without signing in to Service Manager. After an IT agent starts a Teams conversation
with the bot and sends a command, the bot calls RESTful API to query or update the record on
the Service Manager server. After that, the Service Manager server returns the query or update
result to the bot and hence the bot exposes this result to the IT agent in the Teams
conversation.
See the following illustration for the bot conversation creation workflow:

The following content describes how to set up the bot. The following diagram highlights the
steps.

Note: Skip the steps with asterisks (*) if you have set up the integration between Service
Manager and Microsoft Teams for war room experience.

Prepare the bot locally

User role: IT Administrator


The Service Manager 9.80 release Teams integration package
(sm9.80.xxxx_TeamsIntegration.zip) includes an out-of-the-box agent bot that is developed
based on Microsoft Bot Framework Composer. Extract the package to get the AgentBot folder
and then open this folder with Bot Framework Composer. You can test the bot functions first,
and then either make customization to this bot or create a new bot based on the default one.

            Note

           Don't rename the AgentBot folder. Otherwise, the bot will not work.

Download and install the required software

As a prerequisite, you need to download and install Bot Framework Composer and the related
software for the testing, customization, or creation of your bot.

(Optional) Customize and localize the bot

Localize the bot

The out-of-the-box bot talks to users in different languages that Service Manager supports.
However, if you need the bot to respond to a language that is unofficially supported by Service
Manager, follow these steps:

   1. Open the out-of-the-box bot with Bot Framework Composer.
   2. Update language settings and add the target language to the bot. See Multilingual support

     for detailed instructions.
   3. Localize the response strings of the bot to the target language. Open the Common file

     under Bot Responses, and then localize all response strings in #allsmmessages .

Customize the bot

You may hope to make customizations to the out-of-the-box bot by adding more actions,
updating the dialogs, and so on. For detailed instructions, see the Bot Framework Composer
documentation.

Before customizing the out-of-the-box bot, we commend backing up all response strings to
maintain consistency of the bot's behavior among the localized languages. Here are some
guidelines for your reference:

   1. Open the out-of-the-box bot with Bot Framework Composer.
   2. Open the Common file under Bot Responses, and then back up all response strings in

      #allsmmessages . You need to switch between languages to backed up the responses
     for each language.
   3. Remove all languages except for English.
   4. Make customizations to the English version of the bot by adding more actions, updating
     the dialogs, and so on.
   5. Add the supported languages back. By doing so, Composer creates a copy of your bot's
     content with the name of each additional language. Hence, your customizations maintain


     consistency among the languages.
   6. Switch between languages, open the Common file, and then copy the backups of the

     response strings to #allsmmessages respectively.

Create an integration operator in Service Manager

User role: Service Manager System Administrator
This integration requires a user account for the bot to connect to Service Manager. You need to
create a dedicated integration user account with the following settings in Service Manager.

     Security Roles:
     Service Desk: view, new
     Incident: view, new, update, close
     Execute Capabilities:
     Need RESTful API.

You can use this integration operator for both agent bot and virtual agent.

Prepare the bot on Azure

User role: Azure Administrator

Publish the bot to Azure

For detailed instructions about how to publish the bot to Azure and then test the published bot,
see Publish a bot to Azure.
After publishing the bot to Azure, sign in to the Azure portal and follow these steps to update
settings for the integration user and the Service Manager server Web Service URL.

   1. Select the App Service of the bot.
   2. Click Settings > Configuration, and then click Application settings.
   3. Click New application setting and then add SM_USERNAME, SM_PASSWORD, and

     SM_ENDPOINT, respectively.


Name                                    Value
SM_USERNAME
SM_PASSWORD                             The user name of the SM integration
SM_ENDPOINT                             operator.

                                        The SM login password of the SM
                                        integration operator.

                                        The actual Service Manager server Web
                                        Service URL in your production
                                        environment. This URL MUST be a public
                                        IP address so that the bot can access the
                                        Service Manager server. For
                                        example, http://<servername>:
                                        <port>/SM/9/rest/ .

     For detailed instructions about how to configure common settings for web apps, see
     Configure app settings.

Connect the bot to Teams

Add the bot to Microsoft Teams as one of the apps. For detailed instructions, see Connect a
bot to Microsoft Teams.

Register an application

Skip this step if you have set up the integration between Service Manager and Microsoft
Teams for war room experience. Also, skip this step if you have registered an application when
setting up the virtual agent.

If you haven't done so, register a new Entra ID Application for the bot. See Register an
application for more information.

Add the following API permissions since the bot needs to query the user's information.

Create an integration user on Azure

Skip this step if you have set up the integration between Service Manager and Microsoft
Teams for war room experience. Also, skip this step if you have created an integration user on
Azure when setting up the virtual agent.


If you haven't done so, see Create an integration user for more information. Note that this user
doesn't require a Teams license.

(Optional) Distribute the bot

User role: Teams Administrator

            Note

           To interact with the agent bot, you can skip this step and use the bot embed
           code instead. Copy the HTTPS part of the code that is shown in the Get bot embed
           code dialog and then paste this address in the browser. After you open this URL in
           Microsoft Teams, you should be able to see the bot listed as a contact. For detailed
           instructions, see Connect a bot to Microsoft Teams.

Now you can distribute your bot to the IT operators or anyone who requires to use it by
uploading the bot in Teams, publish the bot to your org, or publishing the bot to the Teams
store. Hence, you can send messages to the bot in Microsoft Teams and then receive the bot's
responses in Teams conversation. For detailed instructions, see Distribute your Microsoft
Teams app.

            Important

           In this release, use the bot in one-on-one conversations only. When publishing the
           bot, open the manifest.json file of the bot and then set the scopes to scopes":
           ["personal"] . For more information about bots' schema, see Reference: Manifest
           schema for Microsoft Teams.

           Don't add the bot to a team or a channel because it may bring chaos.

Configure the settings in Service Manager

User role: Service Manager System Administrator

To make the bot work with Service Manager Incident and Interaction records, you need to
configure the following settings in Service Manager.

   1. Customize Web Service.

     Click Tailoring > Web Services > Web Service Configuration to open the External
     Access Definition page.

     To the default primary affected service and the default category when adding an Incident,
     search for the MSTeamsIncident object, click the Expressions tab, and then add
     expressions as required. For example:


          // set default primary affected service to "Applications" when add
          if ($L.mode="add" and null(affected.item in $L.file)) then
          (affected.item in $L.file="CI1001030")

          // set default category when add
          if ($L.mode="add" and null(category in $L.file)) then (category in
          $L.file=nullsub(jscall("settings.getSettingValue", "Incident",
          "default.category"), "incident"))

     To set the default category when adding an Interaction, search for the
     MSTeamsInteraction object, click the Expressions tab, and then add expressions as
     required. For example:

          // set default category when add
          if ($L.mode="add" and null(category in $L.file)) then (category in
          $L.file=nullsub(jscall("settings.getSettingValue", "Service Desk",
          "default.category"), "incident"))

   2. Add an integration instance.
     Skip this step if you have set up the integration between Service Manager and Microsoft
     Teams for war room experience. Also, skip this step if you have added an integration
     instance when setting up the virtual agent.
     If you haven't done so, see Add an integration instance for detailed instructions. For the
     settings in the Basic Configuration section on the Connectivity tab, consult the Azure
     administrator for the bot integration user information, the bot Application (Client) ID,
     Directory (Tenant) ID, and the Client Secret.

   3. Validate operator accounts with Teams login IDs.
     Usually, an IT agent signs in Teams with an email address. To validate that an IT agent is
     an authorized operator in Service Manager, either the operator's login name or email must
     be the same as the IT agent's Teams login ID.

Verify the integration

User role: Service Manager System Administrator
   1. Sign in to Teams and then start a conversation with the bot.
   2. Send the following commands to the bot one by one.


Note

These commands use regular expressions to parse the parameters entered
by the user. For special requirements, you can modify the corresponding
triggers of these commands in Bot Framework Composer.

Command                                                                                    Service Manager 9.81
help
help interaction                        Description
help incident
get incident <ID> [field]               List all available commands.

create incident description             List detailed information for Interaction
                                        commands.
create interaction description
                                        List detailed information for Incident
                                        commands.

                                        Get the details of an Incident. <ID> is the
                                        record ID with an Incident's prefix, and
                                        [field] is the caption of a field defined in
                                        Web Services.
                                        Example commands:
                                        get incident IM10265
                                        get incident IM10265 Impact

                                        Create an Incident.
                                        Example command:
                                        create incident Outlook keeps asking for
                                        credentials

                                        Create an Interaction.
                                        Example command:
                                        create interaction Cannot add
                                        attachment to OneNote Shared directory

Command                                                                                    Service Manager 9.81
update incident <ID> field1:"value1"
[,field2:"value2",...]                  Description

resolve incident <ID>                   Update one or more field values of an
                                        Incident.

                                        For each field, use the field caption
                                        defined in the Incident web service
                                        definition or the field name in the
                                        probsummary dbdict record, and
                                        enclose the field value in double
                                        quotation marks. If you want to update
                                        multiple fields, separate them with a
                                        comma.

                                        If the field caption or the field name
                                        consists of special characters (for
                                        example, a dot), enclose the field caption
                                        in double quotation marks as well.

                                        Note: Use ISO standard format for the
                                        Datetime field.

                                        Example command:

                                        update incident IM10265 Status:"Work In
                                        Progress",Assignee:"Incident.Coordinator
                                        "

                                        update incident IM10265
                                        ClosedTime:"2021-09-
                                        14T02:39:52+00:00"

                                        update incident IM10265
                                        "brief.description":"New Title"

                                        Resolve an Incident with a solution.

                                        Example command:

                                        resolve incident IM10265

                                        The bot will prompt you to enter a
                                        solution for this Incident.


Command                                 Description
close incident <ID>
                                        Close the incident specified by <ID>.
                                        Example command:
                                        close incident IM10265
                                        The bot will prompt you to select a
                                        closure code for this Incident.

cancel                                  Cancel your operation.
version                                 Display version information of the bot.

     After sending each command that relates to Incident and Interaction records, sign in to
     Service Manager to verify the result. The system tracks all operations on the Activity tab.

For a complete use case, see Interact with Service Manager by using agent bot.

Important

The Service Manager employee self-service (ESS) users are not authorized to
interact with Service Manager by using agent bot.


1.13.3. Set up virtual agent

Being embedded in Microsoft Teams, the virtual agent is a bot that is contextually aware of a
user's questions and gives relevant answers to a conversation in a natural, human-like manner.
When a Service Manager employee self-service (ESS) user starts a conversation in Teams and
describes an issue, the virtual agent leverages Smart Search and then retrieves solutions from
a variety of resources, including Service Manager Service Catalog items and Knowledge
Management (KM) documents. The ESS user can also create Interactions and check
Interactions' status by using the options provided by the virtual agent - all through a
conversation in Microsoft Teams without signing in to Service Manager.
After an ESS user starts a Teams conversation with the virtual agent, the virtual agent calls
RESTful API to send the content of the conversation to the Service Manager server. As a result,
the Service Manager server returns a valid response or knowledge search results to the virtual
agent and hence the virtual agent exposes this response or results to the ESS user in the
Teams conversation.
See the following illustration for the virtual agent conversation creation workflow:

The following content describes how to set up the virtual agent. The following diagram
highlights the steps.


Note: Skip the steps with asterisks (*) if you have set up the integration between Service
Manager and Microsoft Teams for war room experience.

Prepare the virtual agent locally

User role: IT Administrator

The Service Manager 9.80 release Teams integration package
(sm9.80.xxxx_TeamsIntegration.zip) includes an out-of-the-box virtual agent that is developed
based on Microsoft Bot Framework Composer. Extract the package to get the VirtualAgent
folder and then open this folder with Bot Framework Composer. You can test the functions first,
and then either make customization to this virtual agent or create a new virtual agent based on
the default one.

            Note

           Don't rename the VirtualAgent folder. Otherwise, the virtual agent will not work.

Download and install the required software

As a prerequisite, you need to download and install Bot Framework Composer and the related
software for the testing, customization, or creation of your virtual agent.

(Optional) Customize the virtual agent

You may hope to make customizations to the out-of-the-box virtual agent by adding more
actions, updating the dialogs, and so on. For detailed instructions, see the Bot Framework
Composer documentation.

Create an integration operator in Service Manager

User role: Service Manager System Administrator

This integration requires a user account for the virtual agent to connect to Service Manager.
You need to create a dedicated integration user account with the following settings in Service
Manager.

     Security Roles:
     Service Desk: view, new

     Execute Capabilities:

     Need RESTful API.

Skip this step if you have created an integration operator when setting up the agent bot.

Prepare the virtual agent on Azure

User role: Azure Administrator


Publish the virtual agent to Azure

For detailed instructions about how to publish the virtual agent to Azure and then test the
published bot, see Publish a bot to Azure.

After publishing the virtual agent to Azure, sign in to the Azure portal and follow these steps to
update settings for the integration user and the Service Manager server Web Service URL.

   1. Select the App Service of the virtual agent.

   2. Click Settings > Configuration, and then click Application settings.

   3. Click New application setting and then add SM_USERNAME, SM_PASSWORD, and
     SM_ENDPOINT, respectively.

Name                                    Value
SM_USERNAME
SM_PASSWORD                             The user name of the SM integration
SM_ENDPOINT                             operator.

                                        The SM login password of the SM
                                        integration operator.

                                        The actual Service Manager server Web
                                        Service URL in your production
                                        environment. This URL MUST be a public
                                        IP address so that the bot can access the
                                        Service Manager server. For
                                        example, http://<servername>:
                                        <port>/SM/9/rest/base/virtualAgent .

     For detailed instructions about how to configure common settings for web apps, see
     Configure app settings.

Connect the virtual agent to Teams

Add the virtual agent to Microsoft Teams as one of the apps. For detailed instructions, see
Connect a bot to Microsoft Teams.

Register an application

Skip this step if you have set up the integration between Service Manager and Microsoft
Teams for war room experience. Also, skip this step if you have registered an application when
setting up the agent bot.

If you haven't done so, register a new Entra ID Application for the virtual agent. See Register an
application for more information.


Add the following API permissions since the virtual agent needs to query the user's
information.

Create an integration user on Azure

Skip this step if you have set up the integration between Service Manager and Microsoft
Teams for war room experience. Also, skip this step if you have created an integration user on
Azure when setting up the agent bot.

If you haven't done so, see Create an integration user for more information. Note that this user
doesn't require a Teams license.

(Optional) Distribute the virtual agent

User role: Teams Administrator

            Note

           To interact with the virtual agent, you can skip this step and use the bot embed
           code instead. Copy the HTTPS part of the code that is shown in the Get bot embed
           code dialog and then paste this address in the browser. After you open this URL in
           Microsoft Teams, you should be able to see the virtual agent listed as a contact.
           For detailed instructions, see Connect a bot to Microsoft Teams.

Now you can distribute your virtual agent to the IT operators or anyone who requires to use it
by uploading the bot in Teams, publish the bot to your org, or publishing the bot to the Teams
store. Hence, you can send messages to the bot in Microsoft Teams and then receive the bot's
responses in Teams conversation. For detailed instructions, see Distribute your Microsoft
Teams app.

            Important

           In this release, use the virtual agent in one-on-one conversations only. When
           publishing the bot, open the manifest.json file of the bot and then set the scopes
           to scopes":["personal"] . For more information about virtual agents' schema, see
           Reference: Manifest schema for Microsoft Teams.

           Don't add the virtual agent to a team or a channel because it may bring chaos.

Configure the settings in Service Manager


User role: Service Manager System Administrator

To make the virtual agent work with Service Manager Incident and Interaction records, you
need to configure the following settings in Service Manager.

   1. Add an integration instance.

     Skip this step if you have set up the integration between Service Manager and Microsoft
     Teams for war room experience. Also, skip this step if you have added an integration
     instance when setting up the agent bot.

     If you haven't done so, see Add an integration instance for detailed instructions. For the
     settings in the Basic Configuration section on the Connectivity tab, consult the Azure
     administrator for the virtual agent integration user information, the virtual agent
     Application (Client) ID, Directory (Tenant) ID, and the Client Secret.

   2. Validate operator accounts with Teams login IDs.

     Usually, an ESS user signs in Teams with an email address. To validate that an ESS user is
     an authorized operator in Service Manager, either the operator's login name or email must
     be the same as the ESS user's Teams login ID.

   3. Configure service portal information.

     When an ESS user enters a keyword and searches for knowledge articles, the Smart
     Search results returned by the virtual agent may include links to Catalog Items that are
     related to the keyword. An ESS user can click this kind of link to access the
     corresponding Catalog Items in the service portal and then place an order. As a
     prerequisite, you need to select the right portal depending on which portal is being used
     for ESS users in your organization. To do this, follow these steps:

        1. Go to System Administration > Base System Configuration > Miscellaneous >
           System Information Record.

        2. Select the Active Integrations tab.
        3. In the SM Portal field, select the right portal from the drop-down list. In the Service

           Portal URL field, specify the portal URL for your portal.
        4. Click Save and OK.
        5. Restart the Service Manager server.

Verify the integration

User role: Service Manager System Administrator

   1. Sign in to Teams and then start a conversation with the virtual agent.

   2. The virtual agent can respond to the following commands in this release.


Command                                 Description
help                                    List all available commands.
cancel                                  Cancel your operation.
version                                 Display version information of the virtual
                                        agent.
setlanguage                             Prompt the user to select a language.

3. Send a message to the virtual agent in Teams. The virtual agent may display up to three
  language selections and prompt you to select a language.

  The language selections are based on the following language settings:

        The Service Manager operator's language setting in Contact Information and in
        Operator Record (The language setting in Contact Information has higher priority)
        The Service Manager system language setting in System Information Definition
        Teams environment language

  When the languages from the above sources are different, the user needs to select a
  language as prompted. Otherwise, When the languages from the above sources are the
  same, the virtual agent uses this language by default without prompting for a language
  selection.

Note

If any language from the above sources is unofficially supported by the out-
of-the-box Service Manager system, the virtual agent still lists this language
as a user selection. However, when a user selects this language but the
system administrator hasn’t localized Service Manager into this language yet,
the virtual agent continues displaying English in the conversation.

4. After you confirm the language selection, the virtual agent responds with these services:
  Create Support Ticket, Check Ticket Status, and Search Knowledge.


Service                                 Description
Create Support Ticket
                                        Click this option and then describe your
Check Ticket Status                     issue to create a Service Desk
                                        Interaction.

                                        Click this option to check the status of
                                        the Service Desk tickets that relate to
                                        you. The virtual agent lists the unclosed
                                        tickets submitted in the last 30 days, and
                                        you can also check other tickets related
                                        to you. You must be Service Recipient,
                                        Alternate Contact, or Primary Contact of
                                        these tickets.

                                        The number of Service Desk tickets that
                                        can be displayed by the virtual agent is
                                        up to 50.

Search Knowledge                        Click this option and then enter keywords
                                        to start Smart Search.

For a complete use case, see Interact with Service Manager by using virtual agent.

Note

If you ignore the Yes and No options and click an option again after
functioning, the name of this option displays in the conversation. For example,
the virtual agent returns Smart Search results after you click Search
Knowledge. At this time, if you ignore the Yes and No options and click
Search Knowledge again, the text Search Knowledge appears in the
conversation.


1.13.4. Set up Teams notification

By setting up Teams notification, when an IT agent updates a record or requires further
communication, Service Manager automatically routes a new notification to Microsoft Teams
as a timely reminder. For example, when the status of an Incident becomes Resolved, the
contact of this Incident will receive a message from the integration user on Teams that claims
Incident IM##### has been resolved.

The following content describes how to set up Teams notification. The diagram below
highlights the steps.

Note: Skip the steps with asterisks (*) if you have set up the integration between Service
Manager and Microsoft Teams for war room experience.

Register an application on Azure

User role: Azure Administrator

Skip this step if you have set up the integration between Service Manager and Microsoft
Teams for war room experience. Also, skip this step if you have registered an application when
setting up the agent bot or virtual agent.

If you haven't done so, register a new Entra ID Application for the Teams notification function.
See Register an application for more information.

Add the following four delegated permissions since Microsoft Teams needs to create a chat
and then send messages.


Create an integration user on Azure

User role: Azure Administrator

Skip this step if you have set up the integration between Service Manager and Microsoft
Teams for war room experience. Also, skip this step if you have created an integration user on
Azure when setting up the agent bot or virtual agent.

If you haven't done so, see Create an integration user for more information. Note that this user
requires a Teams license.

            Note

           If you use the account of an actual user in your organization as the Azure
           integration user account instead of creating a new one, this actual user account
           can't send a Teams message to itself.

Configure the settings in Service Manager

User role: Service Manager System Administrator

You can send notifications through Teams messages by using either Service Manager rule sets
or notification definitions.

Functionalize the Show in SM button

Skip this step if you have set up the integration between Service Manager and Microsoft
Teams for war room experience. If you haven't done so, see Functionalize the Show in SM
button for more information about this setting.

Send Teams messages using Service Manager Rule Sets

Follow these tasks to send Teams messages using Service Manager rule sets.

Task 1: Create Teams Message templates

Service Manager provides an out-of-the-box Teams message template Incident Resolved and
the system uses this template when sending a notification through a Teams message if an
Incident's status becomes Resolved. To send Teams messages from more Service Manager
modules, you can use this template as a basis and create your own ones.


To create a custom Teams message template, follow these steps:

   1. Click Tailoring > Notifications > Teams Message Templates.

   2. Search for and select the out-of-the-box Incident Resolved template as the base of the
     new template.

   3. On the General tab, specify a name for the new template in the Name field.

   4. Select a module from the Module drop-down list.

   5. Update the Title field if necessary.

   6. In the Content text box, design the message body of your Teams message. To reference
     a variable or expression in the message, enclose your variable or expression in braces,
     such as {$RECORD.action} .

   7. In the Subtitle text box, design the subtitle of your Teams message. To reference a
     variable or expression in the message, enclose your variable or expression in braces,
     such as {$RECORD.brief_description} .

   8. Click Add to create the new template.

A template is active by default. If you clear the Active checkbox, this Teams message template
becomes inactive and is unavailable when configuring a send Teams messages rule in Task 3.

(Optional) Task 2: Localize a template

To create a language version of a Teams message template, follow these steps:

   1. Click Tailoring > Notifications > Teams Message Templates.
   2. Use the search or advanced search to find the template that you want to localize.
   3. On the General tab, select a language in the Language field for the localized template.
   4. Keep the name in the Name field as is, because Teams message template records with

     the same name are considered language versions of one template.
   5. In the Title field, Subtitle field, and Content text box, replace the original text with the

     appropriate translation and make sure all the variables are in the correct positions.
   6. Click Add to create the localized template.

Task 3: Add a Send Teams Message rule

Service Manager provides an out-of-the-box rule set im.notification.resolved for the system
to send a Teams message to the contact of an Incident on Teams when this Incident's status
becomes Resolved. To send notifications from more Service Manager modules and from a
variety of records status, you can use the im.notification.resolved rule set as a basis and
create your own rule set.

For detailed instructions about how to add a rule for sending Teams messages, see Add a Send
Teams Message rule.

Task 4: Map your rule to a workflow


The out-of-the-box rule set im.notification.resolved is mapped to Transition: Recovery -
Review in the out-of-the-box Incident workflow. After creating your rule for sending Teams
messages, use the default Incident workflow as a reference to map your rule set to the
corresponding workflows as required.

Send Teams messages using notification definitions

Follow these steps to send Teams messages using Service Manager notification definitions.

   1. Click Tailoring > Notifications > Notifications. The Notification Definition form opens.

   2. Search for and select an existing notification definition as required.

   3. On the Message tab, add the following configuration.

Msg Msg Argu Cond Form Notif Reci Grou Grou Subg

Clas No. ment ition at y                    pient p File p  roup

s  s                                    Meth (s)    Area

                                        od

mste mess jscall true                   team oper
ams age (
                                        s   ator()
                   "Micr
                   osoft
                   Team
                   sTem
                   plate.
                   gene
                   rate
                   Mess
                   ageF
                   romT
                   empl
                   ate",
                   "mes
                   sage
                   templ
                   ate
                   name
                   ",
                   $L.fil
                   e)

In this example:

     Arguments: You need to replace the second argument of the jscall function with the
     name of the template that you want to use for this notification. For example,jscall(


"MicrosoftTeamsTemplate.generateMessageFromTemplate", "Incident Resolved",
$L.file).
Condition: You may need to update this column with other valid expressions.
Recipient(s): You may need to update this column with other valid values. This
column supports operator groups as well. For example:

Recipient(s)                            Group File
assignment in $L.file                   assignment

   4. Click Save and OK.

Verify the integration

User role: Service Manager System Administrator
This example uses the out-of-the-box Teams messages template, rule set, and an Incident
record to verify the integration.

   1. Navigate to Incident Management, and then open an existing Incident record that is not in
     the Closure phase.

   2. Record the email address of the Contact Person in the Incident record.
   3. Sign in to Teams by using the Contact Person's email address.
   4. In Service Manager, update the Incident's Status to Resolved.
  5. The integration user sends a Teams message and claims Incident xxx has been resolved.
````
