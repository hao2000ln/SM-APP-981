---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.8 .. 1.1.8.1
printed_pages: 479-487
---

# 1.1.8 Case Exchange framework

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.8. Case Exchange framework

Service Manager Case Exchange is a solution to exchange data between two Service Manager
systems or between Service Manager and Service Management Automation X (SMAX). The
Case Exchange framework mainly facilitates the following operations:

     Sending and receiving data
     Viewing and processing the exchanged data in the native environment

To leverage Case Exchange capabilities, the systems to be connected must support REST-
based Web Services in JSON format. SOAP-based Web Services aren't supported. The
following chapters describe the functionalities of Case Exchange and their expected behaviors.

It is highly recommended that the personnel who implement Case Exchange with another
system have the experience in the following Service Manager technologies:

     REST-based Web Services
     DBDICT
     Process Designer framework
     JavaScript
     JSON
     Service Manager Integration Suite (SMIS)

During the implementation, you can refer to the following documentation:

     Web Services
     Programming
     Integration Manager and SMIS
     Process Designer Framework

            Note

           The scope of support is limited to the behavior of APIs and product features
           documented. OpenText is responsible for the correct operation of those features
           and APIs. OpenText is not responsible for debugging scripts or code created to
           utilize these features to implement a solution. In order to receive the best possible
           support, OpenText asks customers to provide a reproducible unit test scenario that
           demonstrates the error or unexpected behavior of the API or documented feature.


Tip

Consider the following tips when you troubleshoot the Case Exchange integration:

     Incorrect configuration of the Base URL, User Name, and Password fields in
     the General tab usually causes authentication failure. In this scenario, 401
     errors are recorded in the log file.
     You can enable the error-handling feature when you configure the integration
     instance. SMIS can automatically create a new Incident record if a Case
     Exchange task fails. The Description field of this Incident record contains the
     details of the failed task record. For more information about the error-handling
     feature, see Error handling.
     Due to a known limitation, the error message in the SMIS task log may be
     insufficient to identify the root cause of a failed task. For more information
     about this known limitation and the workaround, see Insufficient message for
     a failed Case Exchange task.


1.1.8.1. Case Exchange framework features

This section introduces the Case Exchange features.

Connector

Case Exchange is enabled by connectors, which can open, update, and close records in the
system of another provider. Connectors can also perform the following tasks:

     Listen for events or updates related to record exchange.
     Take care of the physical communication to the system via REST-based web services in
     JSON format.
     Manage appropriate authentication and identity credentials required by the connected
     system.

Field mapping and value mapping

Field mapping and value mapping determine how the record data is transformed into the
internal or external normalized case format.

Field mapping ensures that the data from one system is send to the correct field on the second
system. To avoid interface failures the field names and the field name description should not
contain any special characters.

Value mapping ensures the data is correctly transformed according to the rules required in
each system. The value mapping supports expressions and calculations to ensure the data is
correctly manipulated prior to sending or updating records in the local database.

For more information about field mapping and value mapping, see topics under the Integration
Instance Mapping section.

Outbound trigger rules

One of the core functions of Case Exchange is automated data exchange between Service
Manager and integrated systems. For example, Case Exchange can automate the following
activities:

     Opening records
     Exchanging record updates between Service Manager and integrated systems
     Tracking the status of related records in Service Manager and in integrated systems

Service Manager has a dedicated rule type in Rule Sets that can trigger Case Exchange
between Service Manager and integrated systems. Use one of the following methods to invoke
a Rule Set:

     If Process Designer is implemented in Service Manager, invoke the Rule Set from
     workflows.


     If Process Designer is not implemented in Service Manager, you must create a trigger and
     add the following API in the trigger's script:

      lib.CaseExchange_RuleExecute.executeSingleRuleSet(record,oldrecord,RuleSetID)

For more information about how to invoke a Rule Set, see the Invoke Case Exchange Rule Sets
section.

Attachment handling

You can configure Case Exchange to transfer attachments in exchanging records from one
system to the other system. When the attachment handling functionality is enabled, Case
Exchange handles attachments differently in different integration mechanisms.

Service Manager and Service Management Automation X (SMAX)
integration

When a Service Manager (SM) system is integrated with SMAX, the Pull mechanism is used. If
the attachment handling functionality is enabled in the SM system, Case Exchange handles the
attachments as follows:

     Attachments added in SM are transferred to the corresponding records in SMAX.
     SM retrieves attachments from SMAX when it handles the next Case Exchange task that's
     initialized by SMAX.

For more information about the Pull mechanism for SM/SMAX integration, see The Pull
mechanism.

Service Manager and Service Manager integration

When an SM system is integrated with another SM system, either the Pull mechanism or the
Push mechanism is used.

When the Pull mechanism is used, Case Exchange works in the same way as SM/SMAX
integration. That is, the SM system that has the attachment handling functionality enabled
transfers attachments to the other SM system and retrieves attachments from that system
when it handles the next Case Exchange task.

However, when the Push mechanism is used, the system that has the attachment handling
functionality enabled only transfers attachments to the other system. It doesn't retrieve
attachments from that system. When the functionality is enabled in both systems, attachments
are transferred in both directions.

For more information about the Pull mechanism for SM/SM integration, see The Pull
mechanism. For more information about the Push mechanism in this case, see The Push
mechanism.

Additional considerations for attachment handling


In addition to the attachment handling functionality described for different SM/SMAX or SM/SM
integration scenarios, you also need to note the following when you use the functionality:

     No attachments are transferred if the attachment handling functionality is disabled in both
     systems.
     Even if the attachment handling functionality is enabled, Case Exchange doesn't remove
     attachments from one system when you remove corresponding attachments from the
     other system.
     A system administrator can specify the type and maximum size of the attachment files
     that Case Exchange can transfer. In case the file type of an attachment doesn't match the
     listed file types or in case the file size of attachment exceeds the configured limit, Service
     Manager doesn't transfer the attachment.

For more information about how to configure the attachment handling feature, see Integration
Instance Parameters - Attachment Handling.

Audit and logging

The Case Exchange framework provides different portals for administrators and users to view
the Case Exchange activity log.

The Case Exchange framework tracks and records all transactions of exchanged request in the
Service Manager Integration Suite (SMIS) task log. Administrators can access this log from
SMIS. For more information, see Monitor SMIS task log.

When a Case Exchange integration instance is active and a Case Exchange task has occurred
to an Incident record, users can view the Case Exchange section in the Incident record for the
details of the Case Exchange information. The Case Exchange section contains the following
information:

 Field name                                                                                               Service Manager 9.81
 External Id
 External Status                        Details
 Creation Time
 Active                                     Description

 Originator System                          The ID of the related record in the
 Integration Name                           integrated system.

 Field name                                 The status of the related record in the
 Date                                       integrated system.

 Status                                     The time when the Incident record is
 Message                                    created.
 Integration Name
                                            This field indicates if Case Exchange is
This PDF was generated on May 23, 2026      active for this record. Possible values of this
                                            field are true and false :
                                             true : The update in one of the systems
                                            can be exchanged to the other system.
                                             false : The update in one of the systems
                                            can't be exchanged to the other system.

                                            The name of the integrated system where
                                            the record come from.

                                            The name of the integration instance that
                                            transfers the record from the integrated
                                            system.

                                         Log

                                            Description

                                            The date and time when the task occurs.
                                            The link on the date and time can direct you
                                            to the Task Log Details page, which
                                            displays the detailed information of that
                                            Case Exchange task.

                                            The status of the task.

                                            A short description of the task.

                                            The name of the integration instance that
                                            carries out the task.

                                                                                                                                Page 484 of 1727

The task log gives a first indication about potential issues of an error but doesn't contain
detailed error messages, you can find the detailed information in the standard Service Manager
log file (sm.log).

Error handling

Service Manager Integration Suite (SMIS) can automatically create a new Incident record for
the error if all of the following conditions are met:

     The error handling feature is active in a Case Exchange integration instance.
     A Case Exchange task of this integration encounters an error.
     SMIS has performed the number of retries that's pre-defined, but still encounters error.

SMIS automatically sets the following fields in the record according to the configuration in the
integration instance:

     Title
     Assignment Group
     Impact
     Urgency
     Category
     Area
     Subarea
     Affected Service

The error-handling feature works in the following manner:

     Case Exchange only creates one Incident record for each integration instance that has
     failed tasks.
     When the task fails for the first time, SMIS creates a new Incident record.
     When the task that has failed fails again, SMIS works in the following manner:
     • If the record for the previous failure is closed, SMIS creates a new Incident record.
     • If the record for the previous failure is not closed, SMIS doesn't create a new Incident
     record.

Ownership

At any time throughout the life cycle of a record in Case Exchange, only one system owns the
record. The owner of the record has the responsibility to resolve the record or transfer the
record to another organization if necessary.

The ownership of records in Case Exchange relies on process definition rather than tooling. It
is highly recommended to define clear rules of ownership for each step in a case exchange
environment prior to taking an interface live. These rules of ownership are required to avoid
any potential data loss in case both parties update a record at the same time. OpenText is not
responsible for issues during the case exchange in a situation where both parties are able to
update a record at the same time.


See Recommendations for other suggestions for implementing Case Exchange.
````
