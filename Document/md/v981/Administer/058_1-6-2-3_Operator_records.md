---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.6.2.3 .. 1.6.2.3
printed_pages: 1406-1445
---

# 1.6.2.3 Operator records

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.2.3. Operator records

Each Service Manager user must have an operator record to log on and use Service
Manager applications. The operator record defines the access rights and security
settings that a user has. The following fields are required for an operator record:

     Login Name
     Resource Type
You can also define the following optional information in an operator record:


Operator tab                            Fields and sections   Purpose
General
                                        Login Name —          Use this tab to add
Security                                Required field Full   identifying information
                                        Name                  and application profiles
                                        Default Company       to an operator record.
                                        Contact ID            These application
                                        Application Profile   profiles determine which
                                        User Role             features and views the
                                        Application profiles  operator can access in
                                        Security Roles        Service Manager
                                                              applications.

                                        Password              Use this tab to manage
                                        Information           how an operator
                                        User Session          accesses Service
                                        Information           Manager. These settings
                                        Login Information     determine whether an
                                        User Lockout          operator can log on to
                                        Information           Service Manager.
                                        LDAP Information
                                        Template
                                        Information
                                        Password History


Operator tab                            Fields and sections       Purpose
Login Profiles
                                        Login Profile — This      The login profile
                                        section contains:         includes:

                                             The operators login       Language:
                                             profile                   Specifies the login
                                             Licensing                 language for the
                                             Information               operator.
                                                                       Time Zone:
                                                                       Specifies the time
                                                                       zone for the
                                                                       operator.
                                                                       Date Format:
                                                                       Specifies the
                                                                       preferred format for
                                                                       the date, such as
                                                                       mm/dd/yy or
                                                                       dd/mm/yy.
                                                                       First Day of Week:
                                                                       Specifies the first
                                                                       day of the week in
                                                                       the calendar and
                                                                       date picker for the
                                                                       operator.
                                                                       Display Currency:
                                                                       Specifies what
                                                                       currency displays
                                                                       for catalog items
                                                                       when the operator
                                                                       orders from the
                                                                       Service Catalog or
                                                                       approves catalog
                                                                       requests. Defaults
                                                                       to the basis
                                                                       currency in the
                                                                       System Information
                                                                       Definition record for
                                                                       the company when
                                                                       left blank.


Operator tab                            Fields and sections  Purpose
Groups
                                                                  Message Level:
                                                                  Specifies the level
                                                                  of messages to
                                                                  store in the
                                                                  message queue for
                                                                  this operator.
                                                                  Max Attachment
                                                                  Size: Specifies the
                                                                  maximum size of a
                                                                  file that the
                                                                  operator can insert
                                                                  into an attachment
                                                                  object.
                                                                  Total Attachment
                                                                  Size: Specifies the
                                                                  maximum size of all
                                                                  the attachment files
                                                                  that the operator
                                                                  can insert into an
                                                                  attachment object.

                                        Knowledge Groups     Use this tab to determine
                                        to which the         which groups to which
                                        operator belongs     the operator belong.
                                        Assignment Groups    Assignment groups are
                                        to which the         used for both work
                                        operator belongs     assignment and
                                                             approval.


Operator tab                            Fields and sections       Purpose
Startup
                                             Initial Application  Use this tab to determine
                                             Home Page            which forms the operator
                                             Queue                sees at startup and also
                                             Dashboard            to customize the
                                             Execute              capability words the
                                             Capabilities         operator has in addition
                                             Query Groups         to those granted by a
                                             Months               user role.

Notification                            Standard                  Use this tab to record
                                        Notifications             contact information
                                        Client Printing           about the operator.

Rate                                    Hourly Rate               Use this tab to determine
Self Service                            Rate Currency             the operator's labor cost
                                                                  rate.

                                        Self Service Access       Use this tab to authorize
                                        Only                      self service access to an
                                        Self Service Menu         operator. This gives the
                                        Self Service              user access to the self
                                        Starting Page             service Web client.

Related topics

Application Setup
Checklist: Adding a new user
Controlling user access and security
Creating operator records
Defining named users
Operator templates
Adding users
Add an operator record
Add an operator record with the User Quick Add utility


Add an operator to a security group
Create a system default operator record
Define a startup menu for an operator
Define the distinguished name an operator uses to log in to an LDAP directory service
Delete an operator record
Enable an operator to see the command line
Set the maximum file attachment size for an operator
Set the time zone for an individual operator
Update an operator record
View an existing operator record
Use Mass Update with operator records


1.6.2.3.1. Add an operator record

Applies to User roles: System Administrator

Note: To create an operator, you need to first create a contact record to match the
operator record.

To add a contact record:

   1. Click System Administration > Base System Configuration > Contacts.
   2. Specify the Contact Name.
   3. Specify the Full Name.
   4. Add any other necessary information.
   5. Click Add, and then click OK.

You are now ready to create an operator record.

To add an operator record:

   1. Click System Administration > Ongoing Maintenance > Operators.

   2. Specify a Login Name.

     Note: We recommend that you only use ASCII characters in Login Name. In
     Service Manager Web Service integrations, non-ASCII operator login names
     aren't supported.

   3. Specify a Contact ID, or select the contact name that you just created.
   4. Click Add.

   5. On the Security tab, type the name of the Template from which you want to
     create the new operator record.

     The information from the template will be populated in the new operator record.

   6. Add any other necessary information for this new operator record.
   7. Click Save.

Related topics

Application Setup
Operator passwords
Operator records
Operator templates
Add an operator record with the User Quick Add utility


Add an operator to a security group
Create a system default operator record
Define a startup menu for an operator
Define the distinguished name an operator uses to log in to an LDAP directory service
Delete an operator record
Enable an operator to see the command line
Set the maximum file attachment size for an operator
Set the time zone for an individual operator
Update an operator record


1.6.2.3.2. Add an operator record with the
User Quick Add Utility

Applies to User roles: System Administrator

To add an operator record with the User Quick Add utility:

   1. Click System Administration > Ongoing Maintenance > User Quick Add Utility.
   2. Fill in the required fields.
   3. Click Next.
   4. Type the name of a user to clone or use the Fill icon to find a user to clone.
   5. Click Finish.
   6. Update the new Operator record as required.

Related topics

Application Setup
Operator passwords
Operator records
Operator templates
Add an operator record
Add an operator to a security group
Create a system default operator record
Define a startup menu for an operator
Define the distinguished name an operator uses to log in to an LDAP directory service
Delete an operator record
Enable an operator to see the command line
Set the maximum file attachment size for an operator
Set the time zone for an individual operator
Update an operator record
View an existing operator record


1.6.2.3.3. Add an operator to a security
group

Applies to User roles: System Administrator

To add an operator to a security group:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Fill in optional search criteria, and then click Search.
   3. Select the operator record to be changed.
   4. Click the Groups tab.
   5. In the groups array, type the names of the security groups for the new operator

     on separate lines.
   6. Click Save.

Related topics

Application Setup
Operator passwords
Operator records
Operator templates
Add an operator record
Add an operator record with the User Quick Add utility
Create a system default operator record
Define a startup menu for an operator
Define the distinguished name an operator uses to log in to an LDAP directory service
Delete an operator record
Enable an operator to see the command line
Set the maximum file attachment size for an operator
Set the time zone for an individual operator
Update an operator record
View an existing operator record


1.6.2.3.4. Create a system default
operator record

Applies to User roles: System Administrator

Information in the system default operator record becomes part of all operator
records at the time you create the operator record and whenever you query the
operator table. The operator table displays the field values in the system default
record unless there is another entry that overrides it. For example, if the system
default record defines the Default Company field with the value DEFAULT, then all
operator records without a defined value for this field display the value DEFAULT.

To create a system default operator record, follow these steps:

   1. Create a contact record for the system default operator record.
        1. Type contacts in the command line, and press Enter.
        2. In the Contact Name and Full Name fields, enter *SYSDEFAULTS.
        3. Click Add.

   2. Click System Administration > Ongoing Maintenance > Operators.
   3. In the Login Name and Full Name fields, type *SYSDEFAULTS.
   4. In the Contact ID field, enter *SYSDEFAULTS and click Fill.
   5. Click Add.
   6. Provide additional information that you want to use as default values for creating

     new operator records. For example, Time Zone, Language, Default Company,
     and Security Roles.
   7. Click Save.

Related topics

Application Setup
Operator passwords
Operator records
Operator templates
Add an operator record
Add an operator record with the User Quick Add utility
Add an operator to a security group
Define a startup menu for an operator
Define the distinguished name an operator uses to log in to an LDAP directory service
Delete an operator record
Enable an operator to see the command line
Set the maximum file attachment size for an operator


Set the time zone for an individual operator
Update an operator record
View an existing operator record


1.6.2.3.5. Define a startup menu for an
operator

Applies to User roles: System Administrator

The default home page for a Service Manager user is the Dashboard home page or To
Do list specified for the operator or user role. You can define an old style startup
menu or any other RAD application so that it is the initial application that Service
Manager displays when an operator logs in. You define an initial application in the
user's operator record.

            Note

           Specifying a Dashboard home page in a user's operator record overrides
           the To Do list and menus for that operator when they log in using the web
           client, even if the flag for menus has been set.

To define a startup menu for an operator, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select the operator record to change.
   5. Click the Startup tab.
   6. In the RAD Name field, type the name of the startup menu or initial application to

     run when the operator logs on.
   7. Type any parameter names and parameter values required by your startup form.

     For example, specify the following values for old style menus.
           Parameter Names: boolean1
           Parameter Values: true

   8. Click Save.

Related topics

Application Setup
Operator passwords
Operator records
Operator templates
Menus
To Do list


Add an operator record
Add an operator record with the User Quick Add utility
Add an operator to a security group
Create a system default operator record
Define the distinguished name an operator uses to log in to an LDAP directory service
Delete an operator record
Enable an operator to see the command line
Set the maximum file attachment size for an operator
Set the time zone for an individual operator
Update an operator record
View an existing operator record


1.6.2.3.6. Define the distinguished name
an operator uses to log into an LDAP
directory service

Applies to User roles: System Administrator

To define the distinguished name an operator uses to log in to an LDAP directory
service, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Click Search to view a list of operators.
   3. Select the operator to update.
   4. Click the Security tab.
   5. In the LDAP User DN field, type the distinguished name you want the operator to

     use to bind to the LDAP directory service.
   6. Click Save.
   7. Click OK.

Related topics

Application Setup
Operator passwords
Operator records
Operator templates
Add an operator record
Add an operator record with the User Quick Add utility
Add an operator to a security group
Create a system default operator record
Define a startup menu for an operator
Delete an operator record
Enable an operator to see the command line
Set the maximum file attachment size for an operator
Set the time zone for an individual operator
Update an operator record
View an existing operator record


1.6.2.3.7. Delete an operator record

Applies to User roles: System Administrator

To delete an operator record, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Use search or advanced search to find one or more records.
   3. Select the operator record that you want to delete.
   4. Click Delete.
   5. Click Yes to confirm the deletion.
   6. When you are prompted whether to remove a certain associated record, for

     example, an associated contact record, click Yes to delete the associated record
     or click No to keep the record.

Related topics

Application Setup
Operator passwords
Operator records
Operator templates
Add an operator record
Add an operator record with the User Quick Add utility
Add an operator to a security group
Create a system default operator record
Define a startup menu for an operator
Set the dashboard home page for a user role
Define the distinguished name an operator uses to log in to an LDAP directory service
Enable an operator to see the command line
Set the maximum file attachment size for an operator
Set the time zone for an individual operator
Update an operator record
View an existing operator record


1.6.2.3.8. Enable an operator to see the
command line

Applies to User roles: System Administrator

To enable an operator to see the command line, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select an operator record from the record list.
   5. Click the Startup tab.
   6. Select Activate Command Line on Startup.
   7. Click Save.

Related topics

Application Setup
Operator passwords
Operator records
Operator templates
Add an operator record
Add an operator record with the User Quick Add utility
Add an operator to a security group
Set the dashboard home page for a user role
Create a system default operator record
Define a startup menu for an operator
Define the distinguished name an operator uses to log in to an LDAP directory service
Delete an operator record
Set the maximum file attachment size for an operator
Set the time zone for an individual operator
Update an operator record
View an existing operator record


1.6.2.3.9. Set database access for an
operator

Applies to User roles: System Administrator

Database access is a feature that gives you the ability to limit or grant access to
database records, such as contacts, company, and regions. You can add or modify
the existing out-of-box database access settings per user role or operator.

To set database access for an operator, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria, and then click Search.
   3. Select an operator record from the record list.
   4. Select the Data Access tab in the General tab.

   5. To add a new Data Access record, follow these steps:

        1. Click Add new Data Access Record.

           The Database Manager Data Access form opens.

        2. Click Fill in the Database Table Name field to select a table.
        3. The operator name you initially selected is in the Operator Name field. If

           you want to add access to a different operator name than the one you
           selected, clear the field and click Fill to a select a different operator name.

        4. To set the database access, select one of the following:

                 Allow DB access: The operator specified is granted access to the
                 table specified.
                 Prohibit DB access: The operator specified is denied access to the
                 table specified.
        5. When access has been granted to a table, click Fill in the View Format field
           to select the table view.

        6. Click Add.

           The new database access record is added.

   6. To modify an existing database access record, follow these steps:

        1. Select the Data Access tab in the General tab.


        2. Double-click the Table Name of the existing database access record you
           want to modify.

           The Database Manager Data Access form opens.

        3. Make the necessary edits.

        4. Click Save.

           Your changes are saved.

   7. Click OK.

Related topics

Operator passwords
Operator records
Operator templates
Add an operator record
Add an operator record with the User Quick Add utility
Add an operator to a security group
Create a system default operator record
Define a startup menu for an operator
Define the distinguished name an operator uses to log in to an LDAP directory service
Delete an operator record
Set the maximum file attachment size for an operator
Set the time zone for an individual operator
Update an operator record
View an existing operator record


1.6.2.3.10. Set the first day of week for an
operator

Applies to User roles: System Administrator

To set the first day of week for an operator, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select the operator record that you want to change.
   5. Click the Login Profiles tab.
   6. In the First Day of Week field, select a day from the drop-down list.
   7. Click Save.

This setting applies to the calendar and the date picker.

If you don't configure this field, the first day of the week for the operator is as follows:

     In the date picker, the first day of the week is the day that's configured by the
     startDayOfWeek parameter. For more information about the startDayOfWeek
     parameter, see Web parameter: startDayOfWeek.
     In the calendar, the first day of the week is the day that's configured in calendar
     settings. For more information about the calendar settings, see Configure
     calendar settings

If you configure this field, the first day of the week in the date picker and the calendar
for the operator will be the day that's specified in this field.

Related topics

Setting file attachment limits
Operator passwords
Operator records
Operator templates
Set the maximum file attachment size for the entire company
Set the total file attachment size for the entire company
Set the total file attachment size for an operator
Add an operator record
Add an operator record with the User Quick Add utility
Add an operator to a security group
Create a system default operator record


Define a startup menu for an operator
Define the distinguished name an operator uses to log in to an LDAP directory service
Delete an operator record
Enable an operator to see the command line
Set the time zone for an individual operator
Update an operator record
View an existing operator record


1.6.2.3.11. Set the maximum file
attachment size for an operator

Applies to User roles: System Administrator

To set the maximum file size of a single attachment for an operator, follow these
steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select the operator record that you want to change.
   5. Click the Login Profiles tab.
   6. In the Max Attachment Size field, type the number of bytes for the maximum file

     attachment size.
   7. Click Save.

You can define a file attachment maximum size limit for a particular operator from the
operator record. The operator file attachment size limit supersedes the maximum file
size set in the system wide company record but is itself subordinate to size limits
defined for an attachment container in the Form Designer.

Related topics

Setting file attachment limits
Operator passwords
Operator records
Operator templates
Set the maximum file attachment size for the entire company
Set the total file attachment size for the entire company
Set the total file attachment size for an operator
Add an operator record
Add an operator record with the User Quick Add utility
Add an operator to a security group
Create a system default operator record
Define a startup menu for an operator
Define the distinguished name an operator uses to log in to an LDAP directory service
Delete an operator record
Enable an operator to see the command line
Set the time zone for an individual operator


Update an operator record
View an existing operator record


1.6.2.3.12. Set the total file attachment
size for an operator

Applies to User roles: System Administrator

To set the total attachment size in any attachment container for an operator, follow
these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select the operator record that you want to change.
   5. Click the Login Profiles tab.
   6. In the Total Attachment Size field, type the number of bytes for the total file

     attachment size.
   7. Click Save.

You can define a total attachment size limit for a particular operator from the operator
record. The total attachment size defined in the operator record supersedes the total
attachment size set in the system wide company record but is itself subordinate to
size limits defined for a specific attachment container in the Form Designer.

Related topics

Setting file attachment limits
Operator passwords
Operator records
Operator templates
Set the total file attachment size for the entire company
Set the maximum file attachment size for the entire company
Set the maximum file attachment size for an operator
Add an operator record
Add an operator record with the User Quick Add utility
Add an operator to a security group
Create a system default operator record
Define a startup menu for an operator
Define the distinguished name an operator uses to log in to an LDAP directory service
Delete an operator record
Enable an operator to see the command line
Set the time zone for an individual operator


Update an operator record
View an existing operator record


1.6.2.3.13. Set the time zone for an
individual operator

Applies to User roles: System Administrator

To set the time zone for an individual operator, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select the operator record to change from the record list.
   5. In the Time Zone field, select the new time zone for the operator.
   6. Click Save.

Related topics

Operator passwords
Operator records
Operator templates
Add an operator record
Add an operator record with the User Quick Add utility
Add an operator to a security group
Create a system default operator record
Define a startup menu for an operator
Define the distinguished name an operator uses to log in to an LDAP directory service
Delete an operator record
Enable an operator to see the command line
Set the maximum file attachment size for an operator
Update an operator record
View an existing operator record


1.6.2.3.14. Update an operator record

Applies to User roles: System Administrator

To update an operator record, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select the operator that you want to update from the record list.
   5. Type or select the new operator details. For example, change the Application

     Profile on the General tab, or add new capability words to the Execute
     Capabilities table on the Startup tab.
   6. Click Save.
   7. Click OK.

Related topics

Operator passwords
Operator records
Operator templates
Add an operator record
Add an operator record with the User Quick Add utility
Add an operator to a security group
Create a system default operator record
Define a startup menu for an operator
Define the distinguished name an operator uses to log in to an LDAP directory service
Delete an operator record
Enable an operator to see the command line
Set the maximum file attachment size for an operator
Set the time zone for an individual operator
View an existing operator record


1.6.2.3.15. View an existing operator
record

Applies to User roles: System Administrator

To view an existing operator record, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select an operator from the record list to view the operator record.

Related topics

Operator passwords
Operator records
Operator templates
Add an operator record
Add an operator record with the User Quick Add utility
Add an operator to a security group
Create a system default operator record
Define a startup menu for an operator
Define the distinguished name an operator uses to log in to an LDAP directory service
Delete an operator record
Enable an operator to see the command line
Set the maximum file attachment size for an operator
Set the time zone for an individual operator
Update an operator record


1.6.2.3.16. Use Mass Update with operator
records

Applies to User roles: System Administrator

            Note

           Note: If you exit the Mass Update template form or Complex Update form
           without clicking Execute, all of your changes are cleared on the
           respective form.

To update several records at the same time, use one of the following methods.

Mass Update template

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria, and then click Search.
   3. Select the records in the record list that you want to update.
   4. Click Mass Update.

   5. Type the value for the field in the text box or use the Find feature to display a list
     of potential values for the field.

                   Note

                The value(s) you enter in the form are propagated to all of the
                records you selected.

   6. Click Next.
   7. Continue updating fields and click Execute when you complete your updates.

Simple Update

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria, and then click Search.
   3. Select the records in the list that you want to update.
   4. Click Mass Update.
   5. Click Simple Update.
   6. Type new values into the applicable fields on the form.
   7. Click Execute.


Complex Update

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria, and then click Search.
   3. Select the records in the list that you want to update.
   4. Click Mass Update.
   5. Click Complex Update.
   6. Type the RAD code in the Complex Update form.
   7. Click Execute.

Related topics

Operator records
Update multiple records with Mass Update


1.6.2.3.17. Synchronization between
contact and operator records

The contact and operator records are synchronized so that if you change the Service
Manager ID field in the contacts record, it triggers the same change in the Contact ID
field in the operator record. The reverse is also true. In order to make the
synchronization possible, every user in the system must have both a contact record
and an operator record.

Several redundant fields in the operator table were removed in order to leverage
existing fields in the contacts table. See the Service Manager Upgrade section for a
list of the fields removed from the operator table.

Related topics

Operator records
Create an operator record from a contact record
Create an operator record from an operator template
Mass create contact records from operator records
Mass create operator records from contact records


1.6.2.3.17.1. Mass create contact records
from operator records

Applies to User roles: System Administrator

To mass create contact records from operator records, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria.
   3. Click Search.
   4. In the record list, open the More Actions menu.
   5. Click Mass Create Contact.
   6. Follow the prompts to create the contacts.

            Note

           You can run the mass create function to create contact records only once.
           If you run the function again, it stops when it encounters the first operator
           record for which a contact already exists.

Related topics

Synchronization between contact and operator records
More Actions menu
Mass create operator records from contact records
Create an operator record from a contact record
Create a contact record from an operator record


1.6.2.3.17.2. Mass create operator records
from contact records

Applies to User roles: System Administrator

To mass create operator records from contact records, follow these steps:

   1. Click Support > Contacts.
   2. Type or select optional search criteria to find the contacts for which you want to

     create operator records.
   3. Click Search.
   4. In the record list, open the More Actions menu.
   5. Click Mass Create Operators.
   6. Follow the prompts to create the operators.

            Note

           You can run the mass create function to create operator records only
           once. If you run the function again, it stops when it encounters the first
           contact record for which an operator record already exists.

Related topics

Synchronization between contact and operator records
More Actions menu
Mass create contact records from operator records
Create an operator record from a contact record
Create a contact record from an operator record


1.6.2.3.17.3. Create an operator record
from a contact record

Applies to User Roles: System Administrator

The contact and operator records are synchronized so that if you change the Service
Manager ID field in the contacts record, it triggers the same change in the Contact ID
field in the operator record. The reverse is also true. In order to make the
synchronization possible, every user in the system must have both a contact record
and an operator record.

To create an operator record from a contact record, follow these steps:

   1. Click System Administration > Base System Configuration > Contacts.
   2. Type or select optional search criteria to find the contact for which you want to

     create an operator record.
   3. Click Search.
   4. If the search returned a list of records, select the contact from the list.
   5. In the contact record, click More or the More Actions icon.
   6. Click Create Operator.
   7. Follow the prompts to create the operator record.

Related topics

Synchronization between contact and operator records
More Actions menu
Mass create contact records from operator records
Mass create operator records from contact records
Create a contact record from an operator record


1.6.2.3.17.4. Create an operator record
from a operator template

Applies to User roles: System Administrator

            Caution

           Any changes that you make to an operator template automatically
           propagate to operator records based on that template. These automatic
           updates can consume substantial system resources.

To create an operator record from an operator template, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. In the Login Name field, type the new operator name.

                   Note

                      Operator record login names are case-sensitive.
                      We don't recommend including any colons (:) in the login name.

   3. Click the Security tab.
   4. In the Template field, type the login name of the operator record to be used as

     an operator template.
   5. Click Add.

            Note

           If an operator record has group1 in its security groups array when its
           template is NULL and group1 is in the security groups array of template_1
           but not in that of template_2, when you assign template_1 to the operator
           record, the operator record has group1 in its security groups array;
           however, if you switch its template to template_2, group1 is lost in its
           security group array. To work around this issue, clear the template field,
           remove template_1L, save it, change the template to template_2, and then
           save.

Related topics

Application Setup
Adding users


Checklist: Adding a new user
Controlling user access and security
Creating operator records
Defining named users
Operator passwords
Operator records
Operator templates
Create an operator template
Define the operator template applied to LDAP users


1.6.2.3.17.5. Create an operator template

Applies to User roles: System Administrator

System Administrators can design operator templates for creating operator records
for users that share common information and settings. For example, you can design
one operator template for managers and another template for first-level Service Desk
Agents. An operator template is an operator record containing all the common
information that applies to operator records created from the template.

To create an operator template, follow these steps:

            Note

           You can specify as many details in the new operator record template, as
           necessary.

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Enter the search criteria to find the operator record for which you want to create

     an operator template.
   3. Fill in the necessary information, including application profiles, and proper

     permissions and settings.
   4. In the Security tab, select the option Template Operator.
   5. Click Add.

Related topics

Application Setup
Adding users
Checklist: Adding a new user
Controlling user access and security
Creating operator records
Defining named users
Operator passwords
Operator records
Operator templates
Create an operator record from an operator template
Define the operator template applied to LDAP users


1.6.2.3.17.6. Define the operator template
applied to LDAP users

Applies to User roles: System Administrator

To define the operator template applied to LDAP users, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. In the Operator Template field, specify the operator record that you want to use
     as the company default for LDAP users.

   3. Click Save.

Related topics

Application Setup
Adding users
Checklist: Adding a new user
Controlling user access and security
Creating operator records
Defining named users
Operator passwords
Operator records
Operator templates
Create an operator record from an operator template
Create an operator template


1.6.2.3.17.7. Create a contact record from
an operator record

Applies to User roles: System Administrator

The contact and operator records are synchronized so that if you change the Service
Manager ID field in the contacts record, it triggers the same change in the Contact ID
field in the operator record. The reverse is also true. In order to make the
synchronization possible, every user in the system must have both a contact record
and an operator record.

To create a contact record from an operator record, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Enter and select the search criteria to find the operator for which you want to

     create a contact record.

   3. Click Search.

     A list of operator records is opened.

   4. Select an operator from the list.
   5. In the selected operator record, replace the Contact ID with the new contact ID.
   6. Click More or the More Actions icon, and then Create Contact option.
   7. Click Create Contact.
   8. Follow the prompts to finish creating the contact.
   9. Click Save.

Related topics

Synchronization between contact and operator records
More Actions menu
Mass create contact records from operator records
Mass create operator records from contact records
Create an operator record from a contact record
````
