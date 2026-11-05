---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.6.3.7 .. 1.6.3.8
printed_pages: 1587-1613
---

# 1.6.3.7 Add or edit a module status

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.3.7. Add or edit a module status

Applies to User roles: System Administrator
Records in the ModuleStatus table determine the values that appear in the Status
drop-down list of records. You can use the ModuleStatus table to:

     Add new statuses
     Edit existing statuses
     Alter the position in which statuses appear in the drop-down list
     Prevent statuses from being displayed in the drop-down list
     Attach additional conditions to statuses

            Note

           To ensure that module statuses work as expected, you must also
           correctly configure the rule set that determines which statuses to use in a
           workflow.
           For example, the Incident workflow is configured with an out-of-box
           "im.status.list" rule set that uses the statuses assigned to the Incident
           module.

Add a module status

To add a module status, follow these steps:

   1. Click Tailoring > Database Manager.

                   Note

                Alternatively, you can open Database Manager from the command
                line, by typing db, and then pressing Enter or clicking the Execute
                icon.

   2. Type ModuleStatus in the Table field, and then click the Search icon.
   3. Select a module from the Module drop-down list, and then type a name for the

     status in the Status field.


                   Note

                Optionally, you can also enter a value for the sort order of the status,
                assign the status to specific phases of a workflow, and mark the
                status as a background status.

   4. In the menu, click Add to create the status.

                   Note

                Once the status is created, you can click Edit to set a condition for
                the status.

Edit a module status

To edit a module status, follow these steps:

   1. Click Tailoring > Database Manager.

                   Note

                Alternatively, you can open Database Manager from the command
                line, by typing db, and then pressing Enter or clicking the Execute
                icon.

   2. Type ModuleStatus in the Table field, and then click the Search icon.
   3. Enter search criteria for the module status that you want to edit, and then click

     Search. For example, select the Incident module from the drop-down list, and
     then click Search to display all available statuses for the Incident module.
   4. Edit the status as required:

           Use the Module drop-down list to change the module to which the status
           applies.
           Use the Status field to edit the display name of the status.
           Use the Sort Order field to set where in the status drop-down list this
           status is displayed.
           Use the Workflow drop-down list to set the workflow to which this status
           applies.
           Use the Workflow Phase drop-down list to set the workflow to which this
           status applies.


           Select the Is Background Status option to prevent the status from being
           displayed in the drop-down list.
           Click Edit to open the Condition Editor and set any additional conditions for
           the status.
   5. Click Save to save your changes.

Contents

     1 Add a module status
     2 Edit a module status


1.6.3.8. Process Designer security model

The Process Designer security model provides a consistent method of assigning
permissions to users across all facets of Service Manager data and accounts for out-
of-box rights that can be configured for a specified role within an area. It also
provides standardized methods to manage user rights.

            Note

           The Process Designer security model is implemented for Knowledge
           Management, Change Management, Service Desk, Incident Management,
           Problem Management, Request Fulfillment, and Service Level
           Management modules. For all other areas and modules, the traditional
           security features for Service Manager still apply.

The Process Designer security model includes the following components:

     Area: An area defines a specific functional area or module within Service
     Manager, such as Knowledge Management or Knowledge Management
     administration. Each area definition includes default rights that are copied to the
     role whenever a new role is created. In addition to the out-of-box areas, system
     administrators are able to define additional areas.

     In an out-of-box system, the following three security areas are shared by several
     modules: Tailoring, Common Configuration, and Security. These areas contain
     the default security rights and settings that apply to the Change Management,
     Service Desk, Incident Management and Problem Management modules:

           The Tailoring area is used to set the permissions that control operator
           access to Workflows.
           The Common Configuration area is used to set the permissions that control
           access to common configurations, including Alert Definitions, Approval
           Definitions, Assignment Groups, Service Desk/Problem Solution Matching,
           and Environment.
           The Security area is used to set the permissions that control operator
           access to Security configurations.

                   Note

                The rights to access Settings are controlled by the separate
                Configuration area in each module.


Rights: The system includes a set of rights such as view, new, update, and
delete that control an operator's data access. When an administrator creates a
role, the default rights from each area are used to set the rights for that role.
Rights can be modified for a specific area and role by an administrator that has
update rights for the area and role. Each combination of role and area creates a
collection of rights.

Security Rights also include the following configurations:

     Allowed Statuses: This field displays the list of statuses that are available
     to operator when they access records. A System Administrator specifies
     the allowed statuses for a role within an area. When this list is populated,
     the role may only update the records that are in one of the listed statuses.
     If a record has a status that's not in the list, the role will not be able to
     modify it. However, when the role updates records, the statuses that are
     available for selection aren't limited to the list. If no statuses are listed, the
     role may modify records in any status.

     Allowed Categories: This field displays the list of categories that are
     available to the operator when they access category data. A System
     Administrator specifies the allowed categories for a role within an area.
     When this list is populated, only the listed categories are available for
     selection when the role creates a new record or updates a record in the
     Category field. If no categories are listed, all categories are available for
     the role within the area.

     Admin: This option indicates if the current Role has Admin rights for the
     current Area.
     Expert: This option indicates if the current Role has Expert rights for the
     current Area.
     Modify Template: This option indicates if the current Role is able to modify
     Template records for the current Area.
     ESS Only: If this option is selected, the current Role has the specified rights
     for the current Area only when logged in to the ESS web client (ess.do).
     When this option is not selected, the specified rights take effect for both
     the standard and ESS web clients (index.do and ess.do).

Settings: Settings are configurable security extensions such as an initial view, a
format to display a list, or an approval checkbox. Settings are added for an area.
The types of settings include number, string, Boolean, date/time, global list,
manual list, record, and condition.


     Security Folders: If Folder Entitlement is enabled in the system, a System
     Administrator must select the security folders that each security role can
     access. If a role is not granted rights to a specific folder, operators associated
     with that role will not be able to access records in that folder.

     Roles: A role has a set of rights and settings assigned to it. Each operator is
     assigned a role or roles which, along with area, determine the access rights for
     the operator. Whenever the roles on an operator record are updated, the
     operator must log out and then log in for the changes to take effect.

                   Note

                The out-of-box system includes a default role for the Security area
                that can't be deleted.

     Data Policy records: The data policy records include an Area field used to
     specify the area associated with the table. An area needs to be associated with
     a Data Policy record in order to access the information from the table.

Related topics

Multiple security roles
Add a security role
Add an area


1.6.3.8.1. Out-of-box role rights in the
Common Configuration area

The Common Configuration area is used to set the permissions that control access to
common configurations, including Alert Definitions, Approval Definitions, Assignment
Groups, Service Desk/Problem Solution Matching, and Environment.

Based on the mapping rules, the rights and settings in previous security profiles are
mapped to the rights and settings in the Common Configuration area specified in the
corresponding security roles. See the table below for the out-of-box security rights in
the Common Configuration area. This table only lists the new security roles that have
different settings with the default rights.


Area Role View New Updat Delet Modif Exper Admi

                                        e  e/Clo y   t  n

                                           se  Temp

                                               late

Com chang True True Alway Alway False False False

mon e                                   s  s

Confi analy

gurati st

on chang

e

chang True True Alway Alway False False False

e                                       s  s

analy

st

tasks

chang True True Alway Alway False False False

e                                       s  s

appro

ver

chang True True Alway Alway False False False

e                                       s  s

coord

inator

chang

e

chang True True Alway Alway False False False

e                                       s  s

coord

inator

tasks

chang True True Alway Alway False False False

e                                       s  s

mana

ger


Area Role View New Updat Delet Modif Exper Admi

                                        e  e/Clo y   t  n

                                           se  Temp

                                               late

confi True True Alway Alway False False False

gurati                                  s  s

on

audito

r

emer True True Alway Alway False False False

gency                                   s  s

group

incide True True Alway Alway False False False

nt                                      s  s

analy

st

incide True True Alway Alway False False False

nt                                      s  s

coord

inator

incide True True Alway Alway False False False

nt                                      s  s

mana

ger

initiat True True Alway Alway False False False

or                                      s  s


Area Role View New Updat Delet Modif Exper Admi

                                        e  e/Clo y   t  n

                                           se  Temp

                                               late

opera True True Alway Alway False False False

tor                                     s  s

probl True True Alway Alway False False False

em                                      s  s

analy

st

probl True True Alway Alway False False False

em                                      s  s

coord

inator

probl True True Alway Alway False False False

em                                      s  s

mana

ger

revie True True Alway Alway False False False

wer                                     s  s

SD True True Alway Alway False False False

agent                                   s  s

/mana

ger

servic True True Alway Alway False False False

e                                       s  s

desk

agent


Area Role View New Updat Delet Modif Exper Admi

                                        e  e/Clo y   t  n

                                           se  Temp

                                               late

servic True True Alway Alway False False False

e                                       s  s

desk

mana

ger

syste True True Alway Alway True True True

m                                       s  s

admin

istrato

r

Requ True False Never Never False False False
estor

Requ False False Never Never False False False
est
Appro
ver

Requ True                               False Never Never False False False
est
Coord
inator

Requ False False Never Never False False False
est
Analy
st

Requ True True Alway Alway False False False

est                                     s  s

Mana

ger


Area Role View New Updat Delet Modif Exper Admi

                                        e  e/Clo y   t  n

                                           se  Temp

                                               late

Requ True True Alway Alway False False False

est                                     s  s

Proce

ss

Owne

r

Stock False False Never Never False False False
Mana
ger


1.6.3.8.2. Multiple security roles

When an operator has multiple security roles, the operator's data access rights are
combined to give the operator the greatest data access.

When the rights don't include specific allowed statuses and allowed categories, all
statuses and categories are available for the role within the area. Refer to the
following examples:

     If an operator has view rights for one role in an area and update rights for
     another role in that area, then the operator has view and update rights for the
     area.
     If an operator has allowed statuses and allowed categories specified in one role
     and not in another role, then the operator is able to access all categories and
     statuses for the area.
     If an operator has multiple roles that include different allowed statuses and
     allowed categories, the allowed statuses and allowed categories are merged so
     that the operator has all allowed categories and allowed statuses. No allowed
     statuses and allowed categories are duplicated.
     If an operator has multiple settings because the operator has been assigned
     multiple roles, the operator only has the actual settings for the first settings in
     the operator record .

Related topics

Add a security role
Add an area


1.6.3.8.2.1. Add a security role

Applies to User roles: System Administrator

When you create a security role, the rights from each area defined in the system are
used to set the rights for that role record.

To add a role record, follow these steps:

   1. Click System Administration > Security > Roles.
   2. Click New.
   3. Type the name of the role.
   4. Type a description for the role.
   5. Click Save & Exit.

Related topics

Process Designer security model
Roles in the operator record
Assign a role or roles to an operator


1.6.3.8.2.2. Add security roles and
settings

Applies to User roles: System Administrator

To create a security role and assign rights and settings, follow these steps:

   1. Click System Administration > Security > Roles.
   2. Click New. The Security Role form opens.
   3. Type the security role name in the Name field.
   4. Type the security role description in the Description field.
   5. Click Save.

   6. Select the security area.

     The Security Rights and Settings form opens.

   7. Under Rights, select the rights to be assigned to the security role. For example,
     set Expert rights for the security role. The Expert security right enables the
     operator to view alert log, opened tasks, affected services, and clocks of
     change request. It also enables you to set reminders, send notifications, create
     hot news, and associate change request to changes, incidents, interactions,
     requests, and know errors.

   8. Under Settings, add required settings.
   9. Under Folders, add folder permissions to the security role.

The out-of-box security folders available in Service Manager are DEFAULT and
advantage. You can also create security folders to meet your business needs. By
default, all security folders are assigned to a new security role created. Once a role is
created and rights are configured, you can modify the security rights for a role within
an area.

Related topics

User roles


1.6.3.8.3. Roles in the operator record

System Administrators assign roles to an operator in the Security Roles field of the
operator record. When a System Administrator creates an operator record, the system
assigns the default role to the operator if the System Administrator doesn't add a role
for the operator. The System Administrator can update the operator record to change
a role or add additional roles.

When an operator has multiple roles, the operator has the rights that provide the
greatest data access. However, if each role has additional settings, the rights from the
first role listed in the Security Rights field is used to determine an operator's access
rights.

Related topics

Process Designer security model
Assign a role or roles to an operator


1.6.3.8.3.1. Assign a role or roles to an
operator

Applies to User roles: System Administrator

You assign a role or multiple roles to an operator to provide the operator access to
Service Manager data. You can also update the operator's role in the operator record.

To assign a role or roles to an operator record, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Enter the applicable search criteria to find an operator record and then click

     Search.
   3. In Security Roles, select the role or roles you want to assign to the operator.
   4. Click Save.

Related topics

Process Designer security model
Multiple security roles
Add a security role


1.6.3.8.3.2. Add an area

Applies to User roles: System Administrator

When you create an area and define the rights and settings for the area, all roles will
inherit the rights and settings for the area.

To add an area, follow these steps:

   1. Click System Administration > Security > Areas.
   2. Type the name for the role.
   3. Click New.
   4. Select the module for the area.
   5. Type a description for the area.
   6. Define the rights for the area.
   7. Define the settings for the area.
   8. Click Save to add the record.

Add a setting within an area

Applies to User roles: System Administrator

You can add a new setting, such as record or format, in the area. A role inherits the
new setting from the area when the new setting for the area is not already defined in
the role. For example, this is useful when you want to have role within an area to have
additional access to system data or another form.

When you add a new setting, it is only inherited when you add a new role.

To add a setting within an area, follow these steps:

   1. Click System Administration > Security > Areas.
   2. Add optional search criteria and then click Search.
   3. Click the area to update.
   4. Click More or the More Actions icon and then select Administration > Add New

     Setting.
   5. In the New Setting Info wizard, provide the following:

           Id: Uniquely identifies the setting so that it can be referenced
           programmatically.
           Display Label: Defines display label for the setting.
           Description: Describes the setting.
           Type: Select the type of data used by the setting to match the type of
           setting you are creating. For the type selections, the format of the field on


           the form depends on the type you select. For example, if you choose
           boolean, then the setting displays a checkbox and if you select record, the
           setting displays as a text field. When you select some of the types, the
           system prompts you for additional information. For example:

                 If you select Record, you are also prompted to specify the table and
                 field name for the record.
                 If you select Manual List, you are prompted to provide a display type
                 and a name - value pair to display in the list. The Value is the field
                 name in the table and Display Value provides the list of items in the
                 drop-down list for the field.
                 If you select Global List, you are prompted to provide a Global List
                 and Display Type for the Global List.
   6. Specify whether or not the setting is mandatory. When checked, a value is
     required for the setting you are adding.
   7. Click Next.
   8. In Adding Settings Validation, add an optional validation script.
   9. Click Finish.

Validation script for a new setting

When you add an additional setting you have the ability to create simple or complex
validations for the setting using JavaScript. The JavaScript automatically sets up an
XML variable named result , which has a child node named message . If the value of
the result node is 0 (zero), the validation has succeeded. Any non-zero result is
interpreted as a failure. When a validation fails, the contents of the message node
display. The value of the setting being validated is set to a variable named value .

Example:

This example validates that the setting is a number between 1 and 10.

  if ( value < 1 || value > 10 )

  {

  result.setValue( -1 );

  message.setValue(“The value must be between 1 and 10.”);

  }

Update a setting within an area

Applies to User Roles: System Administrator


Once you create a setting for an area, you can update the definition of the setting or
delete it. You can also edit any labels that have been localized.

When you add a new setting to an area, it is only inherited when you add a new role.

To edit a setting within an area, follow these steps:

   1. Click System Administration > Security > Areas.
   2. Add optional search criteria and then click Search.
   3. Click the area to update.
   4. Click Moreor the More Actions icon and then select Administration >

     Edit/Delete Setting.
   5. Select the setting to edit or delete.
   6. On the Edit Setting Info wizard, update the following:

           Id: Uniquely identifies the setting so that it can be referenced
           programmatically.
           Display Label: Defines a display label for the setting.
           Description: Describes the setting.
           Type: Select the type of data used by the setting to match the type of
           setting you are creating. For the type selections, the format of the field on
           the form depends on the type you select. For example, if you choose
           boolean, then the setting displays a checkbox and if you select record, the
           setting displays as a text field. When you select some of the types, the
           system prompts you for additional information. For example:

                 If you select Record, you are also prompted to specify the table and
                 field name for the record.
                 If you select Manual List, you are prompted to provide a name-value
                 pair to display in the list. You must also enter Display Type (Radio
                 Button or Drop Down List).
                 If you select Global List, you are prompted to provide a Global List
                 and Display Type for the Global List.
   7. Specify whether or not the setting is mandatory.
   8. Click Edit localized labels to update localized labels.
   9. For each language available, you can localize the label text. After you localize
     the text, click Save and then OK to return to the wizard.
 10. Click Next.
 11. As an option, you can add or edit a validation script for the setting in Adding
     Settings Validation.
 12. Click Finish.

Localize an additional setting


Applies to User Roles: System Administrator

Once you add a new setting, such as record or format, you can localize the setting for
all of the languages that are active in the system.

To add a setting within an area, follow these steps:

   1. Click System Administration > Security > Areas.
   2. Add optional search criteria and then click Search.
   3. Click the area to update.
   4. Click More or the More Actions icon and then select Administration >

     Edit/Delete Setting.
   5. In the Edit Setting Info wizard, click Edit localized label. A list of the messages

     displays for the user's current language.
   6. Click the item you want to localize and then type the applicable text to localize

     the label you created for the setting.
   7. Click Save.
   8. Continue selecting items until you have localized all the labels for the languages

     active in the system.
   9. To localize the data in the settings for global lists or manual lists, use the record

     tag localization utility.

Modify the rights for a role within an area

Applies to User roles: System Administrator

Once a role is created and rights are configured, an administrator updates the rights
for a role within an area.

To modify the rights for a role within an area, follow these steps:

   1. Click System Administration > Security > Roles.
   2. Add optional search criteria and then click Search to find the role you want to

     modify.
   3. Select the role, and then select the area that you want to modify.

   4. Make the changes you want for default rights, folders, and settings.


                   Note

                The values for the "update" and "delete/close" rights of security
                areas are given the following priorities (from highest to lowest):

                      Always
                      When assigned to workgroup
                      When assigned
                      Never

                Higher values include the permissions of lower values. For example,
                if you select "When assigned to workgroup," the role will also have
                the permissions associated with "When assigned."

                If you are assigned two security roles, and if these two roles have
                different values for the same right in the same area, the higher value
                will override the lower one. For example, if one role has a right set to
                "When assigned to workgroup" and another role has the same right
                set to "When assigned," then you have the "When assigned to
                workgroup" permissions for this right.

   5. Click Save & Exit.
   6. For any other area, repeat steps 3 through 5 to update the rights for the selected

     role.

Update rights to display allowed categories and
allowed statuses

Applies to User roles: System Administrator

A System Administrator can add additional rights to a role within an area by adding
the Allowed Categories and Allowed Statuses fields for an area. Once these fields
are available, an administrator can then specify the particular categories and statuses
for which the role has rights. If an area has multiple tables that support category and
status, the drop-down list in Allowed Categories and Allowed Statuses will have a
combination of all categories and statuses from all tables.

The example below uses the data policy record for the cm3r table for Change
Management to demonstrate how to display the Allowed Categories and Allowed
Statuses fields.


            Note

           When you add a new setting, it is only inherited when you add a new role.

To add a setting within an area, follow these steps:

   1. Click Tailoring > Data Policy.
   2. Use search to find the data policy record for the cm3r table.
   3. Select an area from the drop-down list in the Area field. This list displays all the

     areas available for the selected data policy record.
   4. Click Save. The Allowed Categories and Allowed Statuses fields now appear in

     the Default Rights section for the roles within the area you specified in step 3.

Modify allowed categories and allowed statuses

Applies to User Roles: System Administrator

For both roles and areas, an administrator can specify in the Allowed Categories and
Allowed Statuses fields the categories and statuses for which a role has rights within
an area. Before you can do this, you must first update the applicable data policy
record. These rights give a role in combination with the other rights access to the
specific categories and statuses selected. When no selections are made for Allowed
Categories or Allowed Statuses, the role has access to all categories or statuses
within the area.

You must first ensure that the data policy record for the role within an area has been
updated to include the Allowed Categories and Allowed Statuses fields.

            Note

           When you add a new setting, it is only inherited when you add a new role.

To modify Allowed Categories and Allowed Statuses, follow these steps:

   1. Click System Administration > Security > Roles.
   2. Use search to display a list of roles.
   3. Select the role to update.
   4. Select the area you want to update.
   5. Select the allowed categories and the allowed Statuses from the drop-down

     lists.
   6. Click Save.


Related topics

Process Designer security model
Roles in the operator record
Add a security role
Assign a role or roles to an operator


1.6.3.8.3.3. Check security rights by using
Java Script or variables

Applies to User roles: System Administrator

In the Process Designer security framework, you can use Java Script functions or use
variables to check the security rights of an operator.

Check security rights using Java Script

In the Process Designer security framework, you can use the “security.getRights”
Java Script function to check security rights for an operator. For how to use this
function, see the following description and examples.

security.getRights(<area>, <right>)

This function checks and returns the specific right (or setting) of the current role in a
given Area. The return value is a string.

<area> - The Security Area that's to be checked, such as Incident or Change.

<right> - The right to check, such as new or update.

Example 1

var temp = lib.security.getRights("Change", "update")

Depending on the specific right that the current user has, the function may return one
of the following values: "always", "never", "assigned" or "workgroup".

If the current user has no update right for the Change module, the return value is
"false".

Example 2

var temp = lib.security.getRights("Change", "allowCategory")

The return value is a group of specific categories. For example: {"Emergency
Change", "CI Group"}

Example 3

var temp = lib.security.getRights("Change", "view")

It returns "true" if the current user has the view right for the Change module.
Otherwise, it returns "false" if the current user doesn't have the view right for the
Change module.


            Note

           You can also use the “security.getToken(<area>, <right>)” function to
           check rights (or settings).
           The security.getToken function is an alias of security.getRights.

Check record right with variables

You can use the following variables to check whether a user can access a record. The
variables are calculated based on new, view, update, delete, allowed status, and
folder setting from secRights with each record.

     $L.tableAccess.new
     $L.tableAccess.view
     $L.tableAccess.update
     $L.tableAccess.delete
     $L.tableAccess.expert
     $L.tableAccess.admin

Contents

     1 Check security rights using Java Script
     2 Check record right with variables
````
