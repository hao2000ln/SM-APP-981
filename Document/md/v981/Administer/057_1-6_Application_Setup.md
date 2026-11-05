---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.6 .. 1.6.2.2
printed_pages: 1394-1406
---

# 1.6 Application Setup

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6. Application Setup

Administrators enable users to access applications by creating security rights,
security area, security role, role, and operator records. Administrators control the
following application tables and related administrative tasks:

     Security rights
     Security roles
     User roles
     Capability words
     Adding users
     Purging and archiving records
     Lockouts
     Login restrictions

Related topics

Application profiles
Environment record
User roles
Capability word model
Adding users
Checklist: Adding a new user
Controlling user access and security
Creating operator records
Defining named users
Operator passwords
Operator records
Operator templates
Lockout feature
System quiesce: Login restrictions


1.6.1. Processes and Best Practices

In order for you to make optimal use of the functionality of Service Manager, we have
created Service Manager Processes and Best Practices based on practical
experience with service management implementations with many customers of
various sizes.

The Service Manager Processes and Best Practices provides best practices,
management overviews, process flows, and workflow diagrams for different Service
Manager modules.

The Service Manager Processes and Best Practices documents the practice
workflows that are standard with out-of-box Service Manager applications. It includes
high-level process workflow diagrams, and step-by-step procedural guidelines.

Related topics

Processes


1.6.1.1. Processes

The Service Manager processes are based on ITIL theory and are referenced in the
ITIL core.

The Service Manager best practices cover the following processes in the ITIL Service
Transition and Service Operation documents. For information on these processes, see
the Service Manager Processes and Best Practices linked in the related topics.

ITIL core volume process number         process           process
                                        reference         reference
Service     0                                             SO0
                                        User Interaction
Operations                              Management        SO2
                                        overview
Service     2                                             SO3
                                        Incident
Operations                              Management        SO4
                                        overview
Service     3                                             ST2
                                        Request
Operations                              Fulfillment       ST3
                                        overview
Service     4
                                        Problem
Operations                              Management
                                        overview
Service Transition 2
                                        Change
Service Transition 3                    Management
                                        overview

                                        Configuration
                                        Management
                                        overview

Related topics

Processes and Best Practices


1.6.1.2. User Interaction Management
overview

The Service Manager User Interaction Management process helps you handle User
Interactions either reported by using Self-Service web pages or directly to your
Service Desk. Though not an ITIL process, this process enables the separation
between information requests and service requests. The result is that multiple user
interactions may all be linked to one incident record in the tool. This process will
streamline the Service Desk activities and thereby decrease the workload for second
line support teams.

The Service Manager Service Desk application supports the service desk function of
the Information Technology Infrastructure Library (ITIL) with its User Interaction
Management processes for the IT service and the customer base. It provides a single
point of entry to the other Service Manager applications and enables you to document
and track all calls received by your service desk. It incorporates the essential
concepts of ITIL to ensure that the best practices of IT service management in place.
The Service Desk application helps you to aid end customers, ensure data integrity,
and streamline communication channels in the organization.

For complete information on the User Interaction Management (Service Desk)
process overview and workflows, see Service Manager Processes and Best Practices
in the related topics.

Related topics

Processes and Best Practices


1.6.1.3. Incident Management overview

The Service Manager Incident Management process enables you to categorize and
track various types of incidents (such as service unavailability or performance issues
and hardware or software failures). It helps you to ensure that incidents are resolved
within agreed on service level targets.

The Service Manager Incident Management application supports the Incident
Management process. It incorporates the essential concepts of Information
Technology Infrastructure Library (ITIL) to ensure that the best practices of IT service
management in place. The Incident Management application helps you to restore
normal service operation as quickly as possible and minimize the adverse impact on
business operations.

For complete information on the Incident Management process overview and
workflows, see Service Manager Processes and Best Practices in the related topics.

Related topics

Processes and Best Practices


1.6.1.4. Request Fulfillment overview

The Service Manager Request Fulfillment process enables you to effectively manage
all user requests for products and services. It provides your users a mechanism to
request and receive standard services based on a pre-defined approval and
qualification process. The Service Manager Request Fulfillment application supports
the Request Fulfillment process. It incorporates the essential concepts of Information
Technology Infrastructure Library (ITIL) to ensure that the best practices of IT service
management in place. The Request Fulfillment application gives you an increased
level of control for your organization’s services and helps you source and deliver the
necessary components for requested standard services. For complete information on
the Request Fulfillment process overview and workflows, see the Service Manager
Processes and Best Practices.

Related topics

Processes and Best Practices


1.6.1.5. Problem Management overview

The Service Manager Problem Management process allows you to find, fix, and
prevent problems in the IT infrastructure, processes, and services. It helps you to
prevent problems and their resulting incidents, eliminate recurring incidents, and
minimize the impact of incidents that can't be prevented.

The Service Manager Problem Management application supports the entire Problem
Management process. It incorporates the essential concepts of Information
Technology Infrastructure Library (ITIL) to ensure that the best practices of IT service
management in place. The Problem Management application helps you to maximize
system availability, improve service levels, reduce costs, and improve customer
convenience and satisfaction.

            Note

           ITIL defines a Problem as the unknown cause of one or more Incidents.

For complete information on the Problem Management process overview and
workflows, see Service Manager Processes and Best Practices in the related topics.

Related topics

Processes and Best Practices


1.6.1.6. Change Management overview

The Service Manager Change Management process enables you to control changes
to baseline service assets and configuration items across the entire service life cycle.
It helps you to control the process to request, manage, approve, and control changes
that modify your organizational infrastructure. This includes assets, such as network
environments, facilities, telephony, and resources.

The Service Manager Change Management application supports the Change
Management process. It incorporates the essential concepts of Information
Technology Infrastructure Library (ITIL) to ensure that the best practices of IT service
management in place. The Change Management application help you to ensure that
changes are requested, evaluated, and implemented according to your business
processes and needs.

            Note

           To control changes, we recommend that you handle all standard changes
           (that is, changes of predefined types) by using the Service Catalog
           request fulfillment process.

For complete information on the Change Management process overview and
workflows, see Service Manager Processes and Best Practices in the related topics.

Related topics

Processes and Best Practices


1.6.1.7. Configuration Management
overview

The Service Manager Configuration Management process ensures that selected
components of a complete IT service, system, or product (the Configuration Item) are
identified, baselined, and maintained and that changes to them are controlled. It
enables you define and control the components of services and infrastructure, and to
maintain accurate configuration information about the historical, planned, and current
state of services and infrastructure.

The Service Manager Configuration Management application supports the
Configuration Management process. It incorporates the essential concepts of
Information Technology Infrastructure Library (ITIL) to ensure that the best practices
of IT service management in place. The Configuration Management application
supports your business and control objectives, and helps you to track your
configuration items through their lifecycle.

For complete information on the Configuration Management process overview and
workflows, see Service Manager Processes and Best Practices in the related topics.

Related topics

Processes and Best Practices


1.6.2. Adding users

Each person (user) who logs onto Service Manager must have a personal information
record stored in the operator table. Information associated with a user includes
personal data, such as name, address, phone numbers, login name, and password for
Service Manager. Operator records also store capability words for a given user.
Without an operator record, a user can't log onto Service Manager. A user can belong
to a group with a single profile or have a unique profile.

            Note

           Based on the RFC 2617 authentication scheme, the colon (":") character is
           not allowed to be used in usernames.

Related topics

Checklist: Adding a new user
Controlling user access and security
Creating operator records
Defining named users
Operator passwords
Operator records
Operator templates


1.6.2.1. Checklist: Adding a new user

To add a user, follow these steps:

   1. Create a contact record for the user.

                   Caution

                You can't create an operator without a contact Id.

   2. Create an operator record for the user.
   3. Select security settings for the user. Do one of the following:

          • Select a user role, which includes predefined security roles, application
          profiles (for Knowledge Management and Configuration Management
          modules), and capability words.
          • Select security roles, application profiles and capability words.
   4. Create a startup menu for the user.
   5. Create a menu record for the user.

Related topics

Adding users
Controlling user access and security
Creating operator records
Defining named users
Operator passwords
Operator records
Operator templates


1.6.2.2. Creating operator records

Service Manager provides the following methods for creating an operator record:

     Create the operator record from the operator.g form, which enables you to:
           Create an operator record starting from a blank operator record
           Create an operator by copying properties from an existing operator

     Create the operator record from Ongoing maintenance (CAU) User Quick Add
     Utility, which enables you to:

           Create an operator record starting from a blank operator record
           Create an operator by copying properties from an existing operator
           Create a contact record starting from a blank contact form
           Create a contact by copying properties from an existing contact

Service Manager includes several predefined operator records that you can use as
templates to create your own users. Search your operator records to see a complete
list of sample operators.

Related topics

Application Setup
Adding users
Checklist: Adding a new user
Controlling user access and security
Defining named users
Operator passwords
Operator records
Operator templates
````
