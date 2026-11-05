---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.7.5 .. 1.7.5.6
printed_pages: 2161-2174
---

# 1.7.5 Best practices for tailoring Service Manager Codeless module

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.5. Best practices for tailoring Service
Manager Codeless module

This chapter describes the best practices and recommendations for creating Service
Manager Codeless module from scratch or for tailoring an out-of-box Service
Manager Codeless module.


1.7.5.1. Create a Security Module

Note: If you are going to use an existing Service Manager module rather than adding
a new module, ignore this section.
Service Manager doesn't include a menu entry for the Security module. To access the
Security module, run the db command in Service Manager, and then select the
secModule table to access the Security module.

If you want to add a new module to Service Manager, you must first add a new
Security module. Usually, each Service Manager module maps to a Security module.
For example, if you want to add a new Service Manager Release Management
module, you must also add a Release Management security module.



1.7.5.2. Configure Security Areas for the
module

A security area defines a specific functional area within Service Manager, such as
Incident, Incident Task, or Incident Management Configuration. Each security area
definition includes default rights that are copied to the role whenever a new role is
created.

Usually, you must create the following Security Areas for Service Manager Codeless
module:

     A Security Area that contains the default security rights and settings for tickets
     A Security Area that contains the default security rights and settings for the
     module’s Management configuration. For example, the security rights for
     maintaining the Categories, Approval Definitions, and so on
     A Security Area that contains the default security rights and settings for request
     tasks (only if your Service Manager Codeless module includes tasks)

The default rights and settings in the Security Area are copied to new roles that are
created for this area. However, the values of specific settings are inherited only if no
value is specified for those settings in the role.

For example, an out-of-box Request module contains the following Security Areas:

     Request
     Request Management Configuration
     Request Tasks

Configure the Security Area settings

If you need to configure additional security rights in addition to the default rights
(such as View, New, Update, Delete/Close, and Modify Template) to control a Security
Area, you can modify the Security Area settings.

For example, out-of-box Request modules include a security control that determines
whether users have the right to edit the task planner for a record. You can add
settings such as this to the Request Area.


Contents

     1 Configure the Security Area settings


1.7.5.3. Configure the Security Roles

Security Roles are groups of rights in Security Areas.

            Note

           Security Roles replace the profiles in Service Manager Classic modules.

Out-of-box Request modules include the following Security Roles:
     Request Analyst
     Request Approver
     Request Coordinator
     Request Manager
     Request Process Owner
     Requestor


1.7.5.4. Assign Security Roles to an
operator

To grant an operator the rights associated with a specific role, you must assign the
Security Role to the operator.
The following screenshot demonstrates the Request module Security Roles that are
assigned to Request Analysts in an out-of-box Request module.


1.7.5.5. Configure the dbdict and the data
policy

Process designer framework requires the following fields in dbdict and datadict.

Name                                    Type                               Service Manager 9.81
category                                character
                                                   Comments
current.phase                           character
                                                   If your workflow is based
                                                   on a category, this field
                                                   stores the category of
                                                   the record. Ignore this
                                                   field if your workflow is
                                                   based on an object.

                                                   This field is automatically
                                                   filled by the Process
                                                   Designer framework in
                                                   the following situations:

                                                        A record is created
                                                        by the
                                                         document.new
                                                        RAD script.
                                                        A record's category
                                                        is changed by the
                                                         document.chgCat
                                                        RAD script.

                                                   This field indicates the
                                                   current workflow phase
                                                   of the record.

                                                   This field is automatically
                                                   filled by the Process
                                                   Designer framework
                                                   when the workflow
                                                   phase changes.

Name                                    Type                           Service Manager 9.81

record.active                           logic  Comments

                                               This field indicates
                                               whether this record is
                                               active or not. Usually, a
                                               record is set to inactive
                                               after it is closed,
                                               canceled, or withdrawn.

                                               This field is automatically
                                               filled by the Process
                                               Designer framework
                                               based on the value of
                                               the "Records in this
                                               phase are active" phase
                                               property on the target
                                               phase when the
                                               workflow phase
                                               changes.

                                               For more information
                                               about the "Records in
                                               this phase are active"
                                               workflow phase
                                               property, see the TODO,
                                               …” section.

            Note

           If you are already using other field names in your dbdict to achieve the
           same purposes, add alias fields to them with the above field names.

In the data policy, you must set the Area for the current file. This enables you to use
the following variables to check whether a user can access a record. The variables
are calculated based on the new, view, update, and delete folder settings from this
Area, according to the Security Roles assigned to the current user:

     $L.tableAccess.new
     $L.tableAccess.view
     $L.tableAccess.update


     $L.tableAccess.delete
     $L.tableAccess.expert
     $L.tableAccess.admin

For example, out-of-box Request modules include the following mapping between
files and Security Areas:

     Request (the Request record table) maps to the "Request" Security Area

As soon as the area is set, every access against this object is controlled by the
security settings of that Security Area.


1.7.5.6. Configure a Process Designer
object

To enable Document Engine objects to use Process Designer, you must configure the
following fields:

     Profile application
     Set this field to secRoleBasedAccess to replace the profile-based security
     application with the new role-based security application.

     Profile variable
     Set this field to $L.env.
     Category table name
     Specify the category table name if your module uses this concept.
     Phase table name
     If you store additional phase information (other than the Workflow Phase) in a
     table, specify the table name. Otherwise, leave this field empty.

     Primary format control
     Leave this field empty if you don't use primary format control anymore.

                   Note

                Although format control is still supported with the Process Designer
                framework, we recommend that you convert all business logic into
                rule sets instead of format control.

     Workflow Location
     An object in Service Manager Codeless module is always associated with a
     workflow or workflows. Select one of the following options to configure the
     workflow location:

           By Object (if the object has only one workflow)
           By Category (if the object has several workflows, and each category is
           associated with a workflow)

                   Note

                If you use categories, your category table must contain a field called
                "workflow" in the dbdict. If the workflow is stored in another field in
                this category table, the workflow will not work.


Object-based rule sets and actions

Object-based rules and actions help to reduce duplicated definitions. Instead of
defining them for each workflow, you can define them at the object level, and they will
apply to all workflows that are available for an object.

For more information, see Configure rule sets and actions.
````
