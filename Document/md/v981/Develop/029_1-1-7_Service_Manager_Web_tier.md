---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.7 .. 1.1.7
printed_pages: 775-813
---

# 1.1.7 Service Manager Web tier

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.7. Service Manager Web tier

The Service Manager Web tier is an optional component that allows users to connect
to the Service Manager server through a Web browser. The Web tier requires a Web
application server and a free communications port to install. For more installation
information, see Install the Service Manager Web Tier.

When users connect to the Web tier they see the Web client, which offers several
different interface views:


Web client view                         Description                 URL to Web client view
Power user view
                                        This Web client view        http://server_name:port_
Accessible view                         most closely matches        number/app_name/index
                                        the Windows client and      .do
                                        is intended for Service
                                        Desk technicians,
                                        managers, and
                                        administrators. This view
                                        can provide access to all
                                        licensed modules, such
                                        as Service Desk, Incident
                                        Management, Problem
                                        Management,
                                        Configuration
                                        Management, Change
                                        Management, Request
                                        Management, etc.

                                        This Web client view is a   http://server_name:port_
                                        modified version of the     number/app_name/acce
                                        power user view with        ssible.do
                                        record list mode turned
                                        off, high contrast colors,
                                        and larger fonts. This
                                        view is intended for
                                        Service Desk
                                        technicians, managers,
                                        and administrators who
                                        need accessibility
                                        features.


Web client view                         Description                 URL to Web client view
Self-Service view
                                        This Web client view        http://server_name:port_
Accessible self-service                 provides a simplified       number/app_name/ess.d
view                                    Service Desk interface      o
                                        for users to create, view,
                                        and update service
                                        requests. This view is
                                        intended for end-users
                                        as an entry point to
                                        Service Desk.

                                        This Web client view is a   http://server_name:port_
                                        modified version of the     number/app_name/acce
                                        self-service user view      ssible_ess.do
                                        with high contrast colors
                                        and larger fonts. This
                                        view is intended for end-
                                        users who need
                                        accessibility features.

Administrators can configure the behavior of the Web tier and set Web client
preferences from the web.xml file. In addition, administrators may customize the Web
client interface by creating custom style sheets and images.

Note: Do not use the buttons (such as Refresh, Back, and Forward) on your browser
toolbar or their keyboard shortcuts (such as Ctrl+R, Ctrl+Left, and Ctrl+Right) to
perform Service Manager actions. Instead, use the buttons on the Service Manager
interface, as described in List and detail toolbars.


1.1.7.1. Editing Web client Key bindings

Key bindings for common operations for the Service Manager web client are
determined by standard decimal ASCII character codes. ASCII character codes are
commonly available on the World Wide Web. You can change the default settings for
the bindings by editing the key_val parameter in the shortcut.xml file on the Service
Manager Web tier server.

            Note

           Certain third-party browser toolbars trap ALT+<key> for their own use. Be
           sure to select keys that will not conflict with those toolbar key mappings.

Example:
To change the messages key from Alt+g to Alt+x, open shortcut.xml and make the
following change.
Old

  <shortcut ctrl="false" alt="true" key_val="71"
  key_ref="keyMessages" desc_ref="Misc.ToggleMsg"/>

New

  <shortcut ctrl="false" alt="true" key_val="88"
  key_ref="keyMessages" desc_ref="Misc.ToggleMsg"/>

            Caution

           It's not recommended to modify key_ref and desc_ref in <shortcut
           ctrl="false" alt="true" key_val="82" key_ref="keyRefresh"
           desc_ref="Misc.Refresh"/> in shortcut.xml.


Note

The keyboard shortcut for the Fill function is F9 on the Eclipse client,
whereas the keyboard shortcut for Fill is ALT+F9 on the web client. The
ALT key is compulsory in the ALT+F9 shortcut on the web client to avoid
conflicts with other browser shortcut keys in some cases. In addition, you
can't configure the shortcuts for the functions that are designed in the
Form Designer in shortcuts.xml, including Fill, Find and so on.


1.1.7.2. Using the compact layout

The sizes of some user interface (UI) elements in Service Manager 9.61 are bigger
than those of version 9.33 or earlier. There is a possibility that the new size may
cause certain display issues in your tailored forms. In this situation, you can use the
compact layout of the web client. For more information, see Web parameter:
compactLayout.

Related topics

Web tier parameters
Web parameter: compactLayout


1.1.7.3. Setting web client preferences

You can define global web client preferences from the web configuration file
(web.xml). You can find the web.xml file in the sm/WEB-INF folder of your application
server installation. This file contains global preferences that you can change by
editing the file with any text or XML editor. Any changes that you make to this file
must conform to XML syntax requirements. You must have administrative access to
the server operating system in order to set global web client preferences.

The settings that you define in the web.xml file determine the default client
preferences for all web clients. However, users can override some of these
preferences directly from the URL. For more information about which preferences
users can set from the URL, see the comments in the web configuration file.

Set Web client preferences from the server

You can define global Web client preferences from the Web configuration file
(web.xml). This file contains global preferences that you can change by editing the
file with any text or XML editor. Any changes you make to this file must conform to
XML syntax requirements.

The settings you define in the web.xml file determine the default client preferences
for all Web clients. Users can override some preferences however, directly from the
URL. See the comments in the web configuration file for information about which
preferences users can set from the URL.

You must have administrative access to the server operating system to use this
procedure.

   1. Open the web.xml file in a text editor.
     This file is located in the sm/WEB-INF folder of your application server
     installation.

   2. Add or edit the preferences in the file.
   3. Save the file and restart the Web application server.

     All Web clients that log in to the Service Manager server use the new client
     preferences you defined.

Optimize web client cache control

Applies to User Roles: System Administrator

You can define the web client cache control from the following control file on the Web
tier server: <webtier>/WEB-INF/classes/application-context.xml. The web tier uses


the incoming request URL to determine whether to apply one of the following cache
filtering rules:

     cacheFilter
     neverCacheFilter

When the neverCacheFilter rule applies, the response page or resource will never be
cached in the user's browser. When the cacheFilter rule applies, the user's browser
caches the response page or resource for a period of time specified in the max-age
value (in seconds).

The cacheControlProxy bean defines which web resources the cacheFilter and
neverCacheFilter rules apply to. For example, the Web tier uses the cacheFilter rule
for any web resources whose path matches /images/**, and sets the Expires' or
'Cache-Control' HTTP header in the response. The Web tier uses the
neverCacheFilter rule on any web resources whose path matches /**/*.jsp, and sets
the corresponding HTTP header in the response to disable browser caching for the
matched resources.

            Note

           We recommend that you don't change the default settings in the
           cacheControlProxy bean.

As of version 9.32, the directory structure of the Web tier has been modified to reflect
the current build number of the Web tier. These changes were implemented because
the SM Web tier is typically updated every few months. When these updates occur, it
is sometimes necessary for users to clear their browser cache. For enterprise clients
that have tens of thousands of users, getting all of those users to do this requirement
is onerous. With this revised implementation, users will no longer need to clear their
browser cache.

To change the max-age value:

            Caution

           The default max-age value is 1555200 seconds (6 months). To better
           utilize browser cache, you are recommended to set the max-age property
           to a value no less than 1555200.

   1. Open the file <webtier>/WEB-INF/classes/application-context.xml in a text
     editor.


   2. In the cacheFilter bean section, set the max-age property to an appropriate
     value:

          <bean id="cacheFilter"
          class="com.hp.ov.cwc.web.CacheControlFilter">
          <property name="headers">
          <map>
          <entry key="Expires"><value>Sat, 6 May 2017 12:00:00
          GMT</value></entry>
          <entry key="Cache-Control"><value>public, max-
          age=15552000</value></entry>
          </map>
          </property>
          </bean>

     The cacheFilter bean defines when the cached web resources will expire (based
     on the Expires key) or how long the user's browser will cache web resources
     (based on the max-age value, if any). The max-age value supersedes the
     Expires value. For example, if you set the max-age to 1555200 seconds
     (default), the user’s browser caches web resources for up to 180 days.
   3. Restart the web application server for your change to take effect.

Contents

     1 Set Web client preferences from the server
     2 Optimize web client cache control


1.1.7.4. Branding the web client

Applies to User roles: System Administrator
The out-of-box Service Manager web client includes a preset OpenText theme,
which can be modified to express your organization's own branding.
You can change your Service Manager logo icons, colors, and font style from the
integrated user interface. You can also perform additional branding implementation
options to change the splash screen, or to replace the images, including all the icons.
The following steps show how to implement web client branding changes.

            Note

           To perform branding operations, the operator should have the SysAdmin
          capability. To enable the branding rights for an operator, see Update the
          operator records to enable the branding rights below.

   1. Specify the location for the branding files
   2. Branding implementation options
   3. Additional branding implementation options

            Note

           Currently, the branding feature doesn't support JAWS or color settings for
           the accessible.do web client.

Update the operator records to enable the branding
rights

In order to prevent unintended changes or problems in the web client interface, it is
recommended that the web client branding be performed by an administrator.
To enable the branding rights for an operator, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select the operator that you want to update from the record list.


   5. Add the SysAdmin capability word to the Execute Capabilities table on the
     Startup tab.

   6. Click Save.
   7. Click OK.

This particular operator now has the right to do the branding operations.

Specify the location for the branding files

The branding feature is enabled only when you specify a location to store your
branding files. If you don't do so, when you click Tailoring > Branding, an error
message is displayed, which indicates that the branding feature is disabled.
To specify the location for the branding files, follow these steps:

   1. Stop the web application server.
   2. Specify the folder location in Web parameter: customize-folder.

     For example:

          <context-param>
                          <param-name>customize-folder</param-name>
                          <param-value>C:/customize</param-value>

          </context-param>

  3. On the web tier host, create the <customize-folder> folder (for example,
     C:\customize). This folder is the root folder to store your branding image files,
     including your custom image files to replace the original ones and your branding
     settings in the branding menu. In this folder, Service Manager saves your color
     and font settings in a branding.xml file and custom images in a subfolder named
     branding-images.

                   Note

                You must have write access to this folder.

   4. Restart the web application server.

Branding implementation options

The branding menu provides the following implementation options.


            Note

           The new settings are applied when you next sign in to Service Manager or
           when the system restarts.

            Tip

           If you want to restore the default settings, click Restore Defaults, and
           then click Save.

Change the logo icons

The following table describes the format requirements for the logo files.


Logo name                               Description                 Format
Favorites Icon
                                        This icon appears in the    .svg, .ico, .png, .jpg,
                                        browser's address bar,      .jpeg, .gif
                                        the browser tab title, and
                                        the web client URL
                                        bookmark link.

Header Company Logo                     This icon appears on the    .svg, .ico, .png, .jpg,
                                        horizontal masthead at      .jpeg, .gif
                                        the top left corner of the
                                        web client screen. You
                                        may replace the default
                                        OpenText logo with
                                        your own organization's
                                        logo.

Login Company Logo                      This icon appears on the    .svg, .ico, .png, .jpg,
About Company Logo                      Service Manager login       .jpeg, .gif
                                        page. You may replace
                                        the default OpenText
                                        logo with your own
                                        organization's logo.

                                        This image appears on       .svg, .ico, .png, .jpg,
                                        the top left corner of the  .jpeg, .gif
                                        About information
                                        window.

To change the logo icons of the web tier, follow these steps:

   1. Sign in to the web client.
   2. Click Tailoring > Branding.
   3. Click Browse to find the logo file and select it.

   4. Click Save.

     Service Manager saves your images in the <customize-folder>\branding-images
     subfolder.


Change the colors

Service Manager saves your changes in the <customize-folder>\branding.xml file.

You can change the following colors.

                                        Login Page

Title                                   Description

Body Background/Foreground              The background/foreground color of
                                        the login page

Button Background/Foreground            The background/foreground color of
                                        the login button on the login page

Button Disabled                         The color of the login button when it's
                                        disabled on the login page

Button Hover Background/Foreground      The background/foreground color of
                                        the login button on the login page when
                                        you hover your mouse over the button

Title                                                                                                         Service Manager 9.81
Header Background/Foreground
                                        Main Page
Header Command
Background/Foreground                         Description

Header Inactive Switch Button                 The background/foreground color of
                                              the header on the main page
Header Split Line Color
                                              The background/foreground color of
Body Background                               the command line box on the header of
Primary Color                                 the main page

                                              The color of the inactive switch button
                                              on the header of the main page

                                              The color of the split line between the
                                              header logo and the product logo

                                              The background color of the main page

                                              The primary color of the main page.
                                              The primary color applies to the
                                              background of the button, the
                                              background of the highlighted menu
                                              item, the background of the highlighted
                                              combo option, the focus border, and
                                              the dialog title.


Title                                   Navigation
Background/Foreground
                                              Description

                                        The background/foreground color of
                                        the navigation accordion on the left
                                        side of the applications menu (only
                                        applies to the expanded mode)

Menu Item Hover                         The background/foreground color of
Background/Foreground                   the navigation menu items

Menu Group Background/Foreground        The background/foreground color of
                                        the navigation menu groups

Menu Group Icon                         The color of the menu group icon

Title                                   Tab
Active Tab Background/Foreground
                                           Description

                                           The background/foreground color of
                                           the active tab

To change a color in the web tier, follow these steps:

   1. Sign in to the web client.
   2. Click Tailoring > Branding.
   3. Type a desired hex color code in the color value field. A sample color, which

     automatically changes according to the hex color code you type, is displayed
     after the value field.
   4. Click Save.

Change the font

By default, the web client uses Metric font in Latin and German versions of Service
Manager, and Arial font in other languages. In the case of Asian language versions
that don't support these two fonts, the operating system's default font is used
instead.


To change the font of the web client, follow these steps:

            Note

                The new font takes effect only for users whose browser has the font
                installed. For users who don't have the font installed, the default font
                of the user's browser is used instead.
                In the login form container, the new font only takes effect on the
                login button.
                Your customized font doesn't apply to printed pages.

   1. Sign in to the web client.
   2. Click Tailoring > Branding.
   3. Type the desired font name in the Font Family field.
   4. Click Save to save the changes in the <customize-folder>\branding.xml file

Change the font size

To change the font size of the web client, follow these steps:

            Note

           If you have upgraded from an earlier version of Service Manager in which
           you performed branding, the default font size is 12px. Otherwise, the
           default font size is 14px.

   1. Sign in to the web client.
   2. Click Tailoring > Branding.
   3. Select the desired font size from the Font Size drop-down menu.
   4. Click Save to save the changes in the <customize-folder>\branding.xml file.

Additional branding implementation options

Service Manager provides additional branding implementation options to change the
name on the splash screen to reflect your organization's name, and to replace the
images, including all the icons.

Change the applications name

To change the splash screen, follow these steps:

Your organization's name is now displayed on the login page and in the browser tab
title.


   1. Stop your web application server.

   2. Navigate to the following directory:

     <SM web tier.war file>\WEB-INF\classes\com\hp\ov\cwc\web

  3. Open the app_labels_<language version>.properties file in a text editor, for
     example, open the app_labels_en.properties file.

   4. Modify the App.Name and App.Title field values according to your
     organization's needs. The default value of these two fields is Service Manager.

   5. Save the properties file.

   6. Restart your web application server.

   7. Launch the web client in your browser.

Tailor the web client images

You can change the appearance of images in the web client by placing a new image
of the same name in the<customize-folder>/images folder. Any images you place
here override the existing out-of-box images. Using this images folder enables you to
preserve the existing company-provided images, and ensures that any future upgrade
process doesn't overwrite your tailoring changes. You can delete your specified
images folder at any time to restore the original images of the company.

Each of your custom images must be in the .png, .gif, or .jpg format, and have the
same name (but not necessarily the same format) as the out-of-box one. Service
Manager looks for a custom image by name and then by format in the following order:
.png, .gif, and then .jpg. For example, if the out-of-box image is back.gif, and your
customization images folder contains back.png and back.gif, Service Manager uses
back.png.

To change the images, follow these steps:

Now you can sign in to the web client to verify the new images.

   1. Stop your web application server.

   2. Create an images subfolder in the customize-folder you specified. For example,
     C:/customize/images.

   3. Browse to the images folder of your web tier to find the context path of the
     image you want to replace. For example, if you want to replace the refresh icon
        on the toolbar, the path of this icon is <SM web tier.war
     file>\images\toolbar\trefresh.png.


   4. Add the new image under the same web tier context path in your images folder.
     For example, you add a new image as <customize-
     folder>\images\toolbar\trefresh.png to replace the icon image mentioned in
     the previous step.

   5. Restart your web application server.

   6. Clear your browser's cache.

Branding synchronization

When you upgrade the web tier, you need to copy the <customize-folder> folder from
the old web tier to the new web tier.

In addition, if you have multiple web tier instances load-balanced, your branding
changes are saved to the <customize-folder> in one instance only when you perform
branding implementation. In this case, you need to find out the web tier instance that
has the latest branding changes and copy the changed files in the <customize-
folder> folder to all other instances and restart the web application server.


1.1.7.5. Web client forms

The Service Manager Web tier offers automatic support for existing applications and
their forms. The Web tier generates dynamic HTML that approximates the exact
layout of forms as you define them with Forms Designer. The default application
forms are portable from the Windows client to the Web client with no required
modification.

If you upgrade an existing system, you will find that Service Manager clients
automatically support and display your customized forms. However, there may be
cases when further form modification is necessary to correct cosmetic issues that
appear when you view the form with the Web client. The following table describes
common form revisions that might be required.

Area                                                                                            Service Manager 9.81
Overlapped objects
Dynamic resizing                        Correction

Graphics and images                     Ensure that form objects don't overlap
                                        each other. The Windows client makes
Dynamic View Dependency (DVD)           slight adjustments to correct for
conditions                              overlapped objects, but these design
                                        issues are exposed on a web browser.

                                        The Windows client dynamically
                                        resizes objects such as text areas and
                                        notebooks when you resize the
                                        window. The Web client doesn't resize
                                        most objects and doesn't support
                                        elastic properties as you resize the
                                        browser window. Therefore, ensure
                                        that you assign a default initial size.

                                        Size any graphics and images to fit
                                        conservatively in the form. The
                                        Windows client supports scaled images
                                        used as buttons. However, the Web
                                        client displays these images in their
                                        native size. The button grows to
                                        accommodate the size of the image.

                                        Hidden data with DVD conditions may
                                        be exposed if the form permits the user
                                        to make changes.


1.1.7.6. Configuring color indicator

To add color indicator settings, follow these steps:

            Note

           The color indicator doesn't support the Accessible view (accessible.do)
           and the Self-Service Accessible view (accessible_ess.do). It only assists
           users who have normal vision. Therefore, the content in color indicator
           settings doesn't support JAWS.

   1. Go to Tailoring > Color Indicator Setting.
   2. Specify the following fields and then click Add.

     File: Select the table that contains the field on which you want to apply the color
     indicator.
     Field Caption: Select the field on which you want to apply the color indicator.
     This field is optional at this step; you can specify this field later.
   3. Set the following fields and options:

Field name                                                                                Service Manager 9.81
File
                                        Description
Field Caption
Apply to list                           Select the table that contains the
                                        field on which you want to apply the
Apply to Combo & Comfill                color indicator.

                                        Select the field on which you want to
                                        apply the color indicator.

                                        Select this option if you want to
                                        apply the color indicator setting on
                                        this field in the record list.

                                        Select this option if you want to
                                        apply the color indicator setting on
                                        this field in the record detail.

                                                    Note

                                                   In the detail form, the
                                                   color indicator only
                                                   applies the background
                                                   color setting to the
                                                   Combo and Comfill
                                                   widgets.

Field name                                                                                Service Manager 9.81
Apply to chart
                                        Description

                                        Select this option if you want to
                                        apply the color indicator settings on
                                        this field in charts of the Reporting
                                        module.

                                                    Note

                                                   • The color indicator
                                                   only applies the
                                                   background color
                                                   settings to charts in the
                                                   Reporting module.

                                                   • The color indicator
                                                   settings are only applied
                                                   to the charts in the
                                                   Reporting module. For
                                                   example, color indicator
                                                   settings don't affect the
                                                   chart that you create by
                                                   using More > Chart by
                                                   field count.

4. Click the Add button in the form. The Color Indicator Setting Wizard opens.
5. Set the following fields and then click OK.


Field name                              Description
Value
                                        Specify a possible value of the field.
Foreground Color                        The following color settings apply
                                        when the field contains the specified
Background Color                        value.

                                        Specify the foreground color.
                                        You can directly type in the hex
                                        code of the color, or you can first
                                        click in the text field and then select
                                        a color from the color palette.

                                        Specify the background color.
                                        You can directly type in the hex
                                        code of the color, or you can first
                                        click in the text field and then select
                                        a color from the color palette.

   6. Review the Preview column for the color indicator setting of each value. Click
     Edit to edit the color indicator setting for the value. Click Delete to delete the
     color indicator setting for the value.

   7. Repeat Step 4 to Step 6 if you need to add color indicator settings for more
     values.

   8. Click OK.

The new setting takes effect in the next login.


1.1.7.7. Configure the behavior when you
right-click in the web client

By default, when you right-click lists in the details pane of a record in the Service
Manager web client, the browser's contextual menu is displayed.
However, you can use the enableMoreContextMenu parameter to enable a Service
Manager contextual "More" menu. When this parameter is enabled, the contextual
"More" menu is displayed instead of the browser menu when you right-click lists on
the details pane of a record in the web client.

            Note

          When the enableMoreContextMenu parameter is enabled, the browser
           menu is still displayed if you right-click in an area outside of a list, such as
           a text entry field. This enables you to use the copy and paste functionality
           that's included in the browser's menu.

Related topics

Service Manager Web tier
Web parameter: enableMoreContextMenu


1.1.7.8. Example: Running custom
JavaScript from the web client

This example runs a JavaScript during loading the web client.

     The script opens an alert window before loading the Web client
     The script returns to the web client when the user clicks OK.

Follow these steps:

   1. Sign in to the web tier.
   2. Stop the web application server.
   3. Browse to the ext folder of your Service Manager web tier's context root. For

     example, sc/ext .
   4. Open the Java Server Pages (JSP) file named appheader.jsp in a text editor.
   5. Search for the following text:

      <script type="text/javascript">
   6. Add the following entries to the appheader.jsp file just after the script element:

          document.onload = init();
          function init()
          {
          alert("Testing document.onload from appheader extension./n
          Press Ok to continue with navmenu application.");
          }

   7. Save the appheader.jsp file.
   8. Clear your web application server's cache.
   9. Restart your web application server.

     The web client now runs your custom JavaScript when the web client starts.

Related topics

Branding the web client


1.1.7.9. Example: Sending Web tier URLs
through e-mail notifications

The following example creates a notification record with the following properties.

     Creates an e-mail message whenever someone updates a Service Desk
     interaction record.
     The e-mail message contains a direct URL to the updated interaction record.
     The e-mail message contains a URL to the self-service interface if the record
     was opened from self-service or a URL to the Web client interface if it was
     opened from any other interface.

Note: This example assumes you have installed the Service Manager Web tier and e-
mail service.

Update the Web configuration file

   1. Sign in to the Service Manager web tier.
   2. Stop the Web tier Web application server.
   3. Open the Service Manager Web tier's Web configuration file (web.xml) in a text

     editor.

                   Note

                The web.xml file is WEB-INF folder of your Web tier's context root.

   4. Search for the following entry:

          <init-param>
             <param-name>serverHost</param-name>
             <param-value>localhost</param-value>

          </init-param>

   5. Change the localhost param-value to the fully-qualified domain name of your
     Service Manager server, for example, myserver.mydomain.com.
     Replace the values myserver and mydomain.com with the server host name and
     domain name of the Service Manager server.


                   Important

                You must specify a fully qualified domain name for the serverHost
                parameter or the server will generate invalid URLs.

   6. Save the Web configuration file.

Update the system information record:

   1. Restart your Web application server.
   2. Sign in to the Service Manager server as a system administrator.
   3. Click System Administration > Base System Configuration > Miscellaneous >

     System Information Record.
   4. Click the Active Integrations tab.
   5. In the WebServer URL field, type the fully qualified URL to your Web tier. For

     example:

          http://myserver.mydomain.com:myport/SM/index.do

     Replace the values myserver and mydomain.com with the server host name and
     domain name of the server running the Service Manager Web tier. Replace
     myport with the communications port your Service Manager Web tier Web
     server listens for HTTP requests.
     The server stores the value of this field in the $L.web.url global variable.
   6. In the ESS URL field, type the fully qualified URL to your Web tier. For example:

          http://myserver.mydomain.com:myport/SM/ess.do

     Replace the values myserver and mydomain.com with the server host name and
     domain name of the server running the Service Manager Web tier. Replace
     myport with the communications port your Service Manager Web tier Web
     server listens for HTTP requests.
     The server stores the value of this field in the $L.ess.url global variable.
   7. Save the system information record.

Update the SD.incident.mail form:

   1. Sign out and restart the Service Manager server.


2. Sign in to Service Manager again as a system administrator.
3. Click Tailoring > Forms Designer.
4. Search for the form SD.incident.mail.
5. Click Design.

6. Add a new text area field with the following properties.

Property                                Value
Input                                   $L.web.url
Width                                   400

    This form will display the URL to the Web client interface.

 7. Make any other changes to the form.
    You will use this form as the template for your e-mail messages.

 8. Click OK twice to exit Forms Designer and save the form.
 9. Search for and select the SD.incident.mail form .
10. Click More or the More Actions icon, and then click Copy/Rename.
11. In the New Name field, type SD.incident.mail.ess .
12. Select the Copy option.
13. Click OK.
14. Click Design.

15. Select the text area field you created to display the Web tier URL and update it to
    have the following properties.

Property                                Value
Input                                   $L.ess.url
Width                                   400

     This form will display the URL to the self-service interface.

 16. Click OK twice to exit Forms Designer and save the form.

Update the SM Update notification record:

   1. Click Tailoring > Notifications > Notifications.
   2. Search for the SM Update notification record.


3. Add the following new rows to the notification record.

URL Msg Msg                                 Argu   Condi  Forma Notify Recipi
sent class No.                              ments  tion
                                                          t  Metho ent(s)

                                                             d

Self- sm                                10  incide ess.en SD.inc email  conta
                                            nt.id in try in ident.      ct.na
servic                                      $L.file $L.file mail.e      me in
                                                                        $L.file
e                                                      =true ss

Web sm                                  10  incide nullsu SD.inc email  conta
                                            nt.id in b(ess. ident.      ct.na
client                                      $L.file entry mail          me in
                                                                        $L.file
                                                       in
                                                       $L.file
                                                       ,false)
                                                       =false

   4. Click OK to save the notification record.

Create and update a self-service interaction record:

   1. Open a web browser and sign in to the self-service interface.
   2. Create a new self-service interaction record and note the interaction record ID.
   3. From a Windows client, click Service Desk > Search Interaction Records.
   4. Use the interaction record ID of the self-service interaction record to retrieve the

     interaction record details.
   5. Add a category, sub category, and update to the self-service interaction record.
   6. Exit out of the self-service interaction record and return to the Service Desk

     search form.
   7. Search for SD1001.
   8. Open the Activities section.
   9. In the Update field, type an update.
 10. Click Save.

Review the output event

   1. Click Tailoring > Event Services > Output Events.
   2. Click Search.


   3. Look for an output event with an Event Code of email and the ID number of the
     self-service interaction record that you created in the External Information
     String field.

   4. If you are working in a Windows client, right-click in the External Information
     String field and click Magnify to display the field text in a new window.

   5. Search the form for a URL.
     The URL should contain the path to your self-service interface, for example:

          http://myserver.mydomain.com:myport/SM/ess.do?
          ctx=docEngine&file=incidents&query=incident.id=%22SD10005%22
          &queryHash=eb12d3d8&action=&title=Interaction%20;SD10005

   6. Look for an output event with an Event Code of email and SD1001 in the External
     Information String field.

   7. If you are working in a Windows client, right-click in the External Information
     String field and click Magnify to display the field text in a new window..

   8. Search the form for a URL.
     The URL should contain the path to your Web client interface, for example:

          http://myserver.mydomain.com:myport/SM/index.do?
          ctx=docEngine&file=incidents&query=incident.id=%22SD1001%22
          &queryHash=89472347&action=&title=Interaction%20;SD1001

Related topics

Example: Running custom JavaScript from the Web client
Generating Web tier URL queries
Add URLs for Service Manager clients


1.1.7.10. Example: Notifying specified
operators upon an incident update

This example specifies a group of operators that will receive a notification when an
incident is updated.

            Note

           The notification will not be sent to a specified operator if the incident is
           created or updated when the operator is offline.

Add a Script Library record

   1. Execute the sl command in the command line.
   2. In the Name field, enter IncidentMsg1.
   3. Select a package in the Package field.
   4. Enter the following script in the text box below:

          system.functions.msg("Incident "+vars.$file.number+" updated
          successfully by: "+vars.$lo_operator.name , 1,
          ["falcon","Incident.Manager"], "popup", 1);

     You need to specify each of the operators in the script. The example script
     above specifies that falcon and Incident Manager will receive the notification of
     an incident update.

                   Note

                The script above is an example for Service Manager 9.32. If you use
                a previous version of Service Manager, change vars.$file.number
                to vars.$L_file.number .

   5. Click Add.
   6. Click Compile.


Update the im.save process

   1. Click Tailoring > Document Engine > Processes
   2. Search the im.save process.
   3. Select the RAD tab of the im.save process.
   4. Scroll down until you find the first empty RAD Application.
   5. Add the following script in the Post RAD Expression field of the empty RAD

     Application:

          if $L.continue then ($L.void=jscall("IncidentMsg1"))

   6. Click Save.

Contents

     1 Add a Script Library record
     2 Update the im.save process


1.1.7.11. Generating Web tier URL queries

If you have installed a Web tier, you can have Service Manager server generate URL
queries to your Web tier that display specific records in your applications. You can
use these generated URL queries to programmatically send links to your users when
records are opened, updated, or closed. Service Manager offers the following out-of-
box methods for generating valid Web tier URL queries.

     Create custom JavaScript that uses the makeSCWebURL method. You can
     invoke your custom JavaScript from a macro or RAD expression.
     Create custom notification records that use the Web tier URLs defined in the
     system information record.

When a user clicks on a generated URL query (link), Service Manager requires the
user to log in before displaying the requested data, although the user can bypass the
login screen if you have enable trusted sign-on on the Web tier.

By default, the Service Manager server secures Web tier URL queries by including a
unique hash key in the URL. This unique key prevents people from modifying the URL
and attempting to access restricted parts of your system. If the URL query doesn't
match the unique hash key, Service Manager displays a warning message in the log
file.

If you want to generate URL queries outside of Service Manager you can disable the
unique hash key using the querysecurity parameter. Disabling this parameter in the
Service Manager initialization file allows the server to accept URL queries without a
unique hash key. If you disable the security hash, access to tables is controlled by the
Document Engine. To restrict access to tables through the Document Engine, you
must enable security features such as format control or application profiles that
restrict access at the operator level.

Web tier URL format

Service Manager requires generated web tier URLs to use the following format.

  http://myserver.mydomain.com:myport/SM/index.do?ctx=docEngine

  &file=incidents&query=incident.id=%22SD1001%22

  &queryHash=89472347&action=&title=Interaction%20;SD1001

URL portion                             Required?                          Service Manager 9.81
                                        Yes
http://myserver.mydom                              Description
ain.com:myport/SM/ind
ex.do                                              This portion of the URL
                                                   specifies the web tier
ctx=docEngine                           Yes        host name, port, and
                                                   web client connection to
&file=incidents                         Yes        use. Use index.do to
                                                   have users connect to
&query=incident.id=%22 Yes                         the standard web client.
SD1001%22                                          Use ess.do to have users
                                                   connect to the self-
This PDF was generated on May 23, 2026             service web client.

                                                   This portion of the URL
                                                   specifies that Service
                                                   Manager use the
                                                   Document Engine to
                                                   fulfill the query.

                                                   This portion of the URL
                                                   specifies the table you
                                                   want to query for
                                                   records. You must use
                                                   the file name for the
                                                   table as specified in the
                                                   database dictionary.

                                                   This portion of the URL
                                                   specifies the Service
                                                   Manager query you want
                                                   to use to search for
                                                   records. You must URI
                                                   encode the query string
                                                   to prevent special
                                                   characters from
                                                   invalidating the URL. For
                                                   example, use %22
                                                   instead of quotation
                                                   marks.

                                                                                                 Page 89 of 254
URL portion          Required?                                  Service Manager 9.81
&queryHash=89472347  No
                                        Description
&action=             No
                                        This portion of the URL
&title=Interaction%20;S No              specifies the optional
D1001                                   hash key used to encode
                                        the URL query. The hash
Related topics                          key prevents users from
                                        modifying the URL query
Service Manager macros                  to view other portions of
Notifications                           Service Manager. You
Add URLs for Service Manager clients    can only include a hash
                                        key if you generate the
This PDF was generated on May 23, 2026  URL from the
                                        makeSCWebURL
                                        method.

                                        This portion of the URL
                                        specifies the Document
                                        Engine action you want
                                        the URL query to
                                        perform. By default, the
                                        URL query performs a
                                        search operation.

                                        This portion of the URL
                                        specifies the optional
                                        title of the query. You
                                        must URI encode the
                                        query string to prevent
                                        special characters from
                                        invalidating the URL. For
                                        example, use %20;
                                        instead of a space.

                                                                                      Page 90 of 254

Service Manager Programming
Parameter: querysecurity
````
