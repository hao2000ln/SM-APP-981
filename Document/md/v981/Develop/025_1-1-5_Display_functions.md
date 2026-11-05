---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.5 .. 1.1.5.1
printed_pages: 657-681
---

# 1.1.5 Display functions

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.5. Display functions

The system permits control of user interaction with the following utilities:

     Menus — enable you to control the functionality of the options that appear on
     the system navigator as well as the buttons that appear on the user’s menu form.
     Different users access different menu forms based on different roles.
     Display application — enables you to control the functionality of buttons in the
     editor toolbar, on forms, and on items in the pull-down options menu.

Related topics

Tailoring
Menus
Display application
Displayoptions
Selecting display options


1.1.5.1. Menus

The menu of utilities and applications available to an individual user are based on the
user’s role in the organization.

You can create and customize menus to restrict user access.

A menu form:

     Opens when you log on to the system
     Controls the user’s access to different areas of the system
     Is associated with a corresponding menu record
     Opens based on the user’s role in an organization

Related topics

Button properties
Menu record
Example: Adding a URL link to a menu
Access menu records
Add or change the image icon for options menu and toolbar items


1.1.5.1.1. Menu record

Each option line in the menu record contains values that control the functionality of
each link on the menu form. Based on the conditions specified, the menu record can
call a RAD application to retrieve other menus, call stored queries, and launch external
applications. The association between the form and the menu record is set up by
entering the form name in the Format field of the menu record.

The numbers in the Option column correspond to the option on the referenced format.
In general, there is a one-to-one relationship between menu and form. Each option
calls a RAD application. Some RAD applications require parameters to be passed into
the function while others don't.

The Command column permits you to call a menu option directly from the command
line. For example, type db in the command line to go directly to the Database
Manager.

The Condition column on the menu record controls the availability of the option. If the
condition evaluates to false, the option displayed on the user’s menu is unavailable.

Related topics

Menus
Button properties
Example: Adding a URL link to a menu
Access menu records
Add or change the image icon for options menu and toolbar items


1.1.5.1.2. Button properties

You can create menu buttons using the Button control in Forms Designer. When
adding a button in Forms Designer, the following properties are important:

     ButtonID – A numeric value that matches an option number in the related menu
     record. (Required)
     Images – An image that represents the button’s function. (Optional)
     Balloon help – A text string that appears when the cursor is held over the button
     to offer more information about the button’s function. (Optional)

Related topics

Menus
Menu record
Example: Adding a URL link to a menu
Access menu records
Adding and changing the image icon for menu and toolbar items


1.1.5.1.3. Access menu records

Applies to User Roles: System Administrator

After you create a form, you must add a related menu record to specify the
functionality of the buttons. Menu records are saved in the menu file. You can access
menu records in the following ways:

     Click Tailoring > Tailoring Tools > Menus.
     In the Service Manager command line, type menu .

Related topics

Menus
Button properties
Menu record
Example: Adding a URL link to a menu


1.1.5.1.4. Example: Adding a URL link to a
menu

Applies to User roles: System Administrator

Objective: Provide an example of how to add a link that navigates to a URL from the
System Navigator tree or from a Service Manager menu form.

In this example, you need to find the menu file, modify the HOME menu record, and
use Forms Designer to modify the menu.gui.home form.

To add a link that navigates to a URL from the System Navigator tree or from a menu
form:

   1. Click Tailoring > Web Services > Database Manager.
     The Database Manager search window (format.prompt.db.g) opens .

   2. Type menu in the File text box and click Search.
     A record list of the files opens (format.qbe.g).

   3. From the record list of menu files, double-click menu in the File Name column.
     The Menu form opens (menu.g).

   4. Type HOME in the Menu Name field and click Search from the More Actions
     menu.
     The Menu form re-displays with a list of menu records for the HOME menu.

   5. In the table, add a new menu entry with the following information:
           Option #: 48
           Description: <Sample description> (The label to give the URL link.)
           Application: us.launch.external
           Parameter: name
           Parameter value: <Sample URL>
           Thread: true
           Condition: true

   6. From the More Actions menu, click Save.
     Next you will use Forms Designer to add the menu item as a button on the form:f
     menu.gui.home.

   7. Click Tailoring > Tailoring Tools > Forms Designer. Type fd in the Service
     Manager command line.
     The Forms Designer search form opens.

   8. Type menu.gui.home in the Form text box and click Search.
     The menu.gui.home form opens in Forms Designer.

   9. Click Design. The form opens in the edit window with the Design Tools and
     Properties panes open.


 10. Drag-and-drop a button control from the Design Tools pane to the form.
 11. Position the button control on the form. In this example, move the Exit Service

     Manager button, Service Manager Internal Mail button, and System Status
     button left to make room for the button you are adding.
 12. Click the new button to display the sizing nodes on the button and then resize
     the button to match the other buttons.
 13. In the Properties pane, update the following parameters:

           Image File: Hewlett-Packard Enterprise
           Button ID: Type the Option # (48) you entered for this record in the HOME
           file.
           Caption: <Sample caption>
           Name: <Sample name>
 14. Click OK.
 15. To verify the change, logout and then login and view the form you modified.

You should see the button you added on the menu.gui.home form. There should also
be a new entry in the Menu navigator folder in the System Navigator.

Related topics

Forms Designer
Menus
Button properties
Menu record
More Actions menu
Access menu records


1.1.5.1.5. Customize System Navigator
menu icons

Applies to User roles: System Administrator

Service Manager provides out-of-box icons that you can use to customize the icons
in the System Navigator. To do this, you only need to specify the name of the icon in
the Icon field of the corresponding menu record. You can perform this task from
either the web client or the windows client. The customized icons apply to both the
accordion mode and the sidebar mode of the System Navigator.

            Note

                You can only specify an icon for a first-level menu item (menu
                group).
                The System Navigator menu icons are available only when the
                enableSidebarMenu parameter in the web.xml file is configured as
                TRUE. For more information about the enableSidebarMenu
                parameter, see Web parameter: enableSidebarMenu.

For more information about how to access the menu record, see Access menu
records.

Related topics

Menus
Access menu records
Button properties
Menu record
Example: Adding a URL link to a menu


1.1.5.1.6. Adding and changing the image
icon for menu and toolbar items

You can edit or replace the out-of-box icon for existing menu items and add icons for
new menu and toolbar items that you create. The More Actions menu and toolbar
icons are 16x16 .gif files. You can use any graphics design tool to edit out-of-box
icons or create new icons of the correct size.
When you create a menu or toolbar item, Service Manager generates an icon name
for it based on the Default Label you give the menu or toolbar item in the Display
Application Option Definition form.
Service Manager displays the image with that name if it is located in the Service
Manager Client images directory. If there is no image with that name, the form
displays the default icon. The default icon is blank (no icon defined) in the out-of-box
system.
In a typical installation the icons are located in the following locations.

     Windows client:

          ...\plugins\com.hp.ov.sm.client.common_x.xx\src\resources\ic
          ons\obj16

     Web client on Tomcat (for example):

          ...\<Tomcat>\webapps\webtier-x.xx\images\obj16

Related topics

Menus
Menu record
Example: Adding a URL link to a menu
More Actions menu
Add or change the image icon for options menu and toolbar items
Common option icon names


1.1.5.1.6.1. Add or change the image icon
for menu and tool bar items

Applies to User roles: System Administrator

You can edit or replace the out-of-box icon for existing menu items and add icons for
the new menu and toolbar items that you create. The More Actions menu and toolbar
icons are 16x16 .gif files. You can use any graphics design tool to edit out-of-box
icons or create new icons of the correct size. These images are found in many forms.

To add or change the image icon for the options menu and toolbar items:

Important: If you change an image, Service Manager will replace the original image
with the new image on all forms. If you don't want to change the image on all forms,
you must change the Default Label in the Display Application Option Definition for the
form you want to change, and create a new image.

   1. Open the Display Application Option Definition for the More Actions menu or
     toolbar item.

   2. Add the item, if necessary.
   3. Make a note of text in the Default Label. Using Database Manager, open a form

     that the option is displayed on.
   4. Open the Administrator view and go to the Detail Data tab for a single record

     form or the List Data tab for a record list. The list of icons in the toolbar and
     options menu is at the bottom of the form. The img="<bmpname>" tag gives
     you the name of the image.
   5. Make a note of the icon image name.
   6. Using your standard operating system search functionality, search your Service
     Manager directory for a .gif file with that name. If the item with that name exists
     in the Service Manager images directory, the form will display it.

            <installation
           location>\plugins\com.hp.ov.sm.client.eclipse.web_x.xx\webtier\images
            <installation
           location>\plugins\com.hp.ov.sm.client.common_x.xx\src\resources\icons
            <installation
           location>\plugins\com.hp.ov.sm.client.eclipse.admin_x.xx\src\resources\ico
           ns
            <installation
           location>\plugins\com.hp.ov.sm.client.eclipse.user_x.xx\src\resources\icon
           s


7. Create a new image if none exists, or replace this existing image with the one
  you prefer to use.


1.1.5.1.6.2. Common option icon names

When looking for the image to display, Service Manager replaces spaces in the image
tag with _ in the filename.


Detail/List    Windows Client                      Web Client
Data entry                                         Default Icon
               Default                  File name                File Name
<option        Icon
value="1"
img="tadd">                             tadd.gif                 tadd.png

<caption>Ad
d</caption>

<description
>Add</descri
ption>
 </option>

<option                                 tprev.gif                tprev.png
value="11"
img="tprev"
>

<caption>Pre
vious</captio
n>

<description
>Previous</d
escription>

  </option>


Detail/List   Windows Client                       Web Client
Data entry                                         Default Icon
              Default                   File name                File Name
<option       Icon
value="11"
img="tnext"                             tnext.gif                tnext.png
>

<caption>Ne
xt</caption>

<description
>Next</descr
iption>

  </option>

<option                                 tok.gif                  tok.png
value="2"
img="tok">

<caption>OK
</caption>

<description
>OK</descri
ption>

  </option>


Detail/List    Windows Client                        Web Client
Data entry                                           Default Icon
               Default                  File name                  File Name
<option        Icon
value="205"
img="tprint"                            tprint.gif                 tprint.png
>

<caption>Pri
nt</caption>

<description
>Print</descr
iption>

  </option>

<option                                 texport.gif                texport.png
value="211"
img="texport
/">

<caption>Ex
port/Unload<
/caption>

<description
>Export/Unlo
ad</descripti
on>

  </option>


Detail/List    Windows Client                         Web Client
Data entry                                            Default Icon
               Default                  File name                   File Name
<option        Icon
value="212"
img="tir                                tir_quer.gif                tir_quer.png
quer">

<caption>IR
Query</capti
on>

<description
>IR
Query</descr
iption>

  </option>

<option                                 tcancel.gif                 tcancel.png
value="3"
img="tcancel
">

<caption>Ca
ncel</caption
>

<description
>Done
Searching</d
escription>

  </option>


Detail/List   Windows Client                         Web Client
Data entry                                           Default Icon
              Default                   File name                  File Name
              Icon

<option                                 tcreate.gif                tcreate.png
value="300"
img="tcreate
">

<caption>Cre
ate
Operator</ca
ption>

<description
>Create
Operator</de
scription>

  </option>

<option                                 tsave.gif                  tsave.png
value="4"
img="tsave"
>

<caption>Sa
ve</caption
>

<description
>Save</desc
ription>

  </option>


Detail/List    Windows Client                         Web Client
Data entry                                            Default Icon
               Default                  File name                   File Name
               Icon

<option                                 tdelete.gif                 tdelete.png
value="5"
img="tdelete"
>

<caption>Del
ete</caption
>

<description
>Delete</des
cription>

  </option>

<option                                 tmass_ad.gif                tmass_ad.png
value="5000
" img="tmass
ad">

<caption>Ma
ss
Add</caption
>

<description
>Mass
Add</descrip
tion>

  </option>


Detail/List    Windows Client                         Web Client
Data entry                                            Default Icon

               Default                  File name                   File Name
               Icon
                                                                    tmass_up.pn
<option                                 tmass_up.gif                g
value="5001"
img="tmass
up">

<caption>Ma
ss
Update</capt
ion>

<description
>Mass
Update</des
cription>

  </option>

<option                                 tmass_de.gif                tmass_de.pn
value="5002                                                         g
" img="tmass
de">

<caption>Ma
ss
Delete</capti
on>

<description
>Mass
Delete</desc
ription>

  </option>


Detail/List   Windows Client                          Web Client
Data entry                                            Default Icon
              Default                   File name                   File Name
              Icon                                                  tmass_un.png

<option                                 tmass_un.gif
value="5003
" img="tmass
un">

<caption>Ma
ss
Unload</capt
ion>

<description
>Mass
Unload</des
cription>

  </option>

<option                                 tmass_cr.gif                tmass_cr.png
value="5005
" img="tmass
cr">

<caption>Ma
ss Create
Operators</c
aption>

<description
>Mass
Create
Operators</d
escription>

  </option>


Detail/List     Windows Client                        Web Client
Data entry                                            Default Icon
                Default                 File name                   File Name
                Icon

<option                                 tcount.gif                  tcount.png
value="5100"
img="tcount"
>

<caption>Co
unt</caption
>

<description
>Count
Records in
the
List</descript
ion>

  </option>

<option                                 tprint_l.gif                tprint_l.png
value="5110"
img="tprint
l">

<caption>Pri
nt
List</caption
>

<description
>Print
List</descript
ion>

  </option>


Detail/List    Windows Client                         Web Client
Data entry                                            Default Icon

               Default                  File name                   File Name
               Icon

<option                                 trefresh.gif                trefresh.png
value="5120"
img="trefresh
">

<caption>Ref
resh</captio
n>

<description
>Refresh</de
scription>

  </option>

<option                                 tmodify.gif                 tmodify.png
value="5130"
img="tmodify
">

<caption>Mo
dify
Columns</ca
ption>

<description
>Modify
Columns</de
scription>

  </option>


Detail/List    Windows Client                         Web Client
Data entry                                            Default Icon

               Default                  File name                   File Name
               Icon

<option                                 texport.gif                 texport.png
value="5140"
img="texport
">

<caption>Ex
port to
Excel</captio
n>

<description
>Export to
Excel</descri
ption>

  </option>

<option                                 tsave_as.gif                tsave_as.png
value="5160"
img="tsave
as">

<caption>Sa
ve As
View</captio
n>

<description
>Save As
View</descri
ption>

  </option>


Detail/List     Windows Client                     Web Client
Data entry                                         Default Icon
                Default                 File name                File Name
<option         Icon
value="8"
img="tfind">                            tfind.gif                tfind.png

<caption>Fin
d</caption>

<description
>Find</descr
iption>

  </option>

<option                                 tfill.gif                tfill.png
value="9"
img="tfill">

<caption>Fill
</caption>

<description
>Fill</descrip
tion>

  </option>
````
