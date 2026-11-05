---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.2.3.4 .. 1.6.2.3.4
printed_pages: 1013-1035
---

# 1.6.2.3.4 Setting up the multi-tenancy integration in Service Manager

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.2.3.4. Setting up the multi-tenancy
integration in Service Manager

You need to perform the following tasks in Service Manager to set up the multi-tenancy
integration.
Multi-tenancy support is an optional feature of the integration intended for Managed Service
Providers (MSPs) who want to offer Configuration Management as a service to their tenants. In
a multi-tenancy configuration, each CI and CIR record has a corresponding company ID. Out-
of-the-box, Service Manager allows all operators to view CI data regardless of the company ID.
If you wish to restrict access to CI data by company ID, you must enable Mandanten and use
the company ID field as a restricting query. See the Service Manager help for more information
about multi-company mode and Mandanten.
You must complete the following tasks from your Service Manager system to enable multi-
tenancy support for the integration.

   1. Start the process schedule.
     See How to start the schedule process .

   2. Configure the Service Manager System Information Record and Integration Manager.
     See How to configure the Service Manager System Information Record and Integration
     Manager.

   3. Add tenant-specific UCMDB ID and password values to company records (optional).
     See How to add tenant-specific UCMDB user ID and password values.

   4. Add UCMDB Customer ID values to existing company records.
     See How to add UCMDB customer ID values to existing companies.

   5. Synchronize existing company records with UCMDB.
     See How to synchronize existing companies from Service Manager to UCMDB.

   6. Verify that Service Manager synchronized company records with UCMDB (optional).
     See How to view whether company information is in UCMDB.

   7. Resynchronize existing company records with UCMDB (as needed).
     See How to resynchronize an existing company with UCMDB.

   8. Inactivate company records you don't want to be part of the integration (as needed).
     See How to inactivate a synchronized company.

   9. Reactivate inactive company records you want to be part of the integration (as needed).


    See How to reactivate an inactive company
10. Add tenant-specific DEM rules.

    See How to add tenant-specific DEM rules.


1.6.2.3.4.1. How to start the schedule process

This integration needs the problem schedule process to synchronize company records from
Service Manager to UCMDB. Make sure that the process gets started before you synchronize
company records.
To start the problem schedule process:

   1. Sign in to Service Manager as a system administrator.
   2. From the System Navigator, click System Status.

     Service Manager displays a list of the currently started schedules.
   3. Click the Refresh Display button to refresh the list.
   4. If the problem schedule process isn't in the list, perform the following steps:

        1. Click the Start Scheduler button.
        2. Double-click the problem schedule process.
     Service Manager displays a message, indicating that the problem schedule process gets
     started.


1.6.2.3.4.2. How to configure the Service
Manager System Information Record and
Integration Manager

To enable the integration to support multi-tenancy, you must enter additional information in the
Service Manager System Information Record.
To enter additional information in the Service Manager System Information Record, follow
these steps:

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to System Administration > Base System Configuration > Miscellaneous >

     System Information Record.
   3. Click the General tab.
   4. Enable the Run in Multi-Company Mode option and then click Save.

     Service Manager displays the message: Information record updated.
   5. Click Tailoring > Integration Manager.
   6. Click Add.
   7. In the Integration Template field, select SMtoUCMDB.

     Some fields in the form are automatically populated with a value. You can ignore the
     empty fields.
   8. (Optional) Update the Name, Log Level, and Description fields as needed.
   9. Configure the following fields on the UCMDB Server Configuration tab.

        1. In the UCMDB web service URL field, type the URL to the synchronize CIs web
           service API. The URL has the following format:
            http://<UCMDB server name>:<port>/axis2/services/ucmdbSMService
           Replace <UCMDB server name> with the host name of your UCMDB server, and
           replace <port> with the communications port your UCMDB server uses.

        2. In the User Id and Password fields, type the user credentials required to manage CIs
           on the UCMDB system. For example, the out-of-the-box administrator credentials
           are admin/admin.

        3. In the Multi-tenant web service URL field, type the URL to the synchronize
           company IDs web service API. The URL has the following format:
            http://<UCMDB server name>:<port>/axis2/services/UcmdbManagementService


          Replace <UCMDB server name> with the hostname of your UCMDB server, and
          replace <port> with the communications port your UCMDB server uses.
       4. Type the user name and password required to synchronize company IDs on the
          UCMDB system. For example, the out-of-the-box system administrator credentials
          for UCMDB 9.x are sysadmin/sysadmin.

10. Click Finish.
11. Sign out of the Service Manager system, and sign in again with an administrator account.

12. Click System Status > Display Options > All Tasks.

13. Type k in the Command field next to the problem schedule process and click Execute
    Commands. Wait a few minutes for the problem schedule process to close.

14. Click Start Scheduler.

15. Double-click the problem schedule process. The system now supports multi-tenancy for
    UCMDB.


1.6.2.3.4.3. How to start the process schedule

This integration needs the process schedule to synchronize company records from Service
Manager to UCMDB. Make sure to start the process before you synchronize company records.
To start the process schedule:

   1. Sign in to Service Manager as a system administrator.
   2. From the System Navigator, click System Status.

     Service Manager displays a list of the currently started schedules.
   3. Click the Refresh Display button to refresh the list.
   4. If the problem schedule isn't in the list, do the following:

        1. Click the Start Scheduler button.
        2. Double-click the process schedule.
     A message displays that indicates the process schedule has started.


1.6.2.3.4.4. How to add tenant-specific
UCMDB user ID and password values

You can enter a tenant-specific UCMDB user name and password for Service Manager to use
when requesting information for the Actual State section. If you enter no credentials, Service
Manager uses the credentials in the System Information Record for all tenants.

            Note

           Any credentials you entered in the company record take precedence over
           credentials you entered in the System Information Record. The UCMDB UserId and
           UCMDB Password fields are available only when you have enabled the multi-
           tenancy integration.

To add tenant-specific UCMDB user name and password:

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to System Administration > Base System Configuration > Companies.
   3. Type the search criteria you want to use to find company records. For example, leave the

     search form blank to search all company records.
   4. Click Search.
   5. Type the user name you want this company to use to connect to UCMDB in the UCMDB

     UserId field.
   6. Type the password for the UCMDB user name in the UCMDB Password field.
   7. Click Save.
  8. Repeat step 3 through step 7 for each company you want to enter credentials for.


1.6.2.3.4.5. How to add UCMDB customer ID
values to existing companies

You can use the following steps to add a UCMDB Customer ID value to your existing Service
Manager company records.

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to System Administration > Base System Configuration > Companies.
   3. Type the search criteria you want to use to find company records. For example, leave the

     search form blank to search all company records.
   4. Click Search.
   5. Type a numeric value in the UCMDB Customer ID field for this company.
   6. Click Save.
   7. Service Manager prompts to confirm that you want to synchronize the record with

     UCMDB. Click Yes if you want to synchronize the company now, or click No if you want
     synchronize the company later.
   8. Click Next to go to the next company in the record list.
  9. Repeat step 5 through step 8 for each company in the record list.


1.6.2.3.4.6. How to synchronize existing
companies from Service Manager to UCMDB

Your Service Manager system may already contain company records that you want to use with
the multi-tenancy integration.

If you update any field in a company record that has not yet been synchronized to UCMDB,
Service Manager prompts whether you want to synchronize the company to UCMDB.

            Note

           Service Manager will not prompt you to synchronize the company record if you
           have disabled the option to show the company in multi-company lists, or if there is
           a pending schedule record associated with the company. See How to inactivate a
           synchronized company for more information.

This task includes the following steps:

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to System Administration > Base System Configuration > Companies.
   3. Type the search criteria you want to use to find company records. For example, leave the

     search form blank to search all company records.
   4. Click Search.
   5. Select a company record to update.
   6. Update the company record.
   7. Click Save. Service Manager prompts to confirm that you want to synchronize the record

     with UCMDB.

                   Note

                Service Manager saves the company record regardless of your
                synchronization choice.


1.6.2.3.4.7. How to view whether company
information is in UCMDB

When you enable the multi-tenancy integration, Service Manager displays a read-only field in
each company record that lists whether SM has synchronized the UCMDB Customer ID with
your UCMDB system.

            Note

           The UCMDB Customer ID field is visible only when you enable the multi-tenant
           UCMDB integration.

To view whether company information is in UCMDB:
   1. Sign in to Service Manager as a system administrator.
   2. Navigate to System Administration > Base System Configuration > Companies.
   3. Type the search criteria you want to use to find company records. For example, leave the
     search form blank to search all company records.
   4. Click Search.
   5. Review the status of the Synched with UCMDB field.
     If the checkbox has a check mark, Service Manager has already synchronized the
     company ID with your UCMDB system. If the checkbox is clear, Service Manager has yet
     to add this company to your UCMDB system.

                   Note

                For more information about synchronization failures, see Schedule records.


1.6.2.3.4.8. How to resynchronize an existing
company with UCMDB

Service Manager provides you a means to resynchronize company records with your UCMDB
system in case you lose UCMDB data for some reason. For example, you might intentionally
remove UCMDB data during integration testing, or you might need to recover data after a
disaster. You can force Service Manager to synchronize companies with your UCMDB system
with the Re-synch with UCMDB option.

To resynchronize an existing company with UCMDB:

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to System Administration > Base System Configuration > Companies.
   3. Type the search criteria you want to use to find company records. For example, leave the

     search form blank to search all company records.
   4. Click Search.
   5. Select a company record to synchronize.
   6. Click the Re-synch button next to the Synched with UCMDB? checkbox.

            Note

           The Re-synch button is available only from company records that have already
           been synchronized with UCMDB and have the Synched with UCMDB checkbox
           checked.

           If your UCMDB system already has a company with this ID value, it will ignore the
           resynchronization request. Service Manager will also ignore a resynchronization
           request if there is an existing schedule record to resynchronize the company with
           UCMDB. In this case, it displays the message A schedule record has already been
           added to re-synch this company with UCMDB .


1.6.2.3.4.9. How to inactivate a synchronized
company

After you have synchronized a company record with UCMDB you can no longer delete the
record. Instead, you can inactivate a company record, which causes the UCMDB system to
cease all further CI updates for the company. Any existing CI data for the company remains in
the UCMDB system associated with the inactive UCMDB Customer ID, but both the company
and any associated CIs will no longer be visible from the UCMDB system.

To inactivate a synchronized company:

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to System Administration > Base System Configuration > Companies.
   3. Type the search criteria you want to use to find company records. For example, leave the

     search form blank to search all company records.
   4. Click Search.
   5. Select a company record to inactivate.
   6. Select No from Show Company in Multi-Company Lists.
   7. Click Save.
   8. If this company was previously synchronized with UCMDB, Service Manager prompts you

     to confirm the inactivation.
   9. Click Yes to confirm the inactivation or No to cancel your changes.


1.6.2.3.4.10. How to reactivate an inactive
company

You can reactivate any inactive companies on your Service Manager system to include them in
the multi-tenancy integration. You must also synchronize the company with UCMDB for
UCMDB to process any CI updates for this company.

To reactivate an inactive company:

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to System Administration > Base System Configuration > Companies.
   3. Type the search criteria you want to use to find company records. For example, leave the

     search form blank to search all company records.
   4. Click Search.
   5. Select a company record to reactivate.
   6. Select Yes from Show Company in Multi-Company Lists.
   7. Click Save. Service Manager prompts you to reactivate the company with UCMDB.
   8. Click Yes. Service Manager creates a schedule record to reactivate the company.


1.6.2.3.4.11. How to add tenant-specific DEM
rules

You can use the condition field to create DEM rules that are specific to a particular tenant in a
multi-tenancy UCMDB-SM integration. For example, one tenant may want to add CIs directly to
Service Manager while another tenant may want to open changes for each CI. The following
sample DEM rules illustrate how to accomplish this.

DEM rule Id                                   Tenant-specific DEM rules  Condition

                                        Action on new CI

ucmdbNode_advantage                     Add CI

                                                                         company in
                                                                         $L.file=”advantage”

ucmdbNode_hp                            Create change

                                                                         company in
                                                                         $L.file=”HP”

Tip

It is a best practice to create a separate DEM rule for each tenant.


1.6.2.3.4.12. How to add tenant-specific
UCMDB user ID and password values

You can provide a tenant-specific UCMDB username and password for Service Manager to use
when requesting information for the Actual State section. If you provide no credentials, Service
Manager uses the credentials in the System Information Record for all tenants.

            Note

           Any credentials you provide in the company record take precedence over
           credentials you provide in the System Information Record. The UCMDB UserId and
           UCMDB Password fields are available only when you have enabled the multi-
           tenancy integration.

To add tenant-specific UCMDB user name and password:

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to System Administration > Base System Configuration > Companies.
   3. Type the search criteria you want to use to find company records. For example, leave the

     search form blank to search all company records.
   4. Click Search.
   5. Type the user name you want this company to use to connect to UCMDB in the UCMDB

     UserId field.
   6. Type the password for the UCMDB user name in the UCMDB Password field.
   7. Click Save.
  8. Continue to follow step 3 through step 7 for each company for which you want to provide

     credentials.


1.6.2.3.4.13. How to add UCMDB customer ID
values to existing companies

You can use the following steps to add a UCMDB Customer ID value to your existing Service
Manager company records.

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to System Administration > Base System Configuration > Companies.
   3. Type the search criteria you want to use to find company records. For example, leave the

     search form blank to search all company records.
   4. Click Search.
   5. Type a numeric value in the UCMDB Customer ID field for this company.
   6. Click Save.
   7. Service Manager prompts to confirm that you want to synchronize the record with

     UCMDB. Click Yes if you want to synchronize the company now, or click No if you want
     synchronize the company later.
   8. Click Next to go to the next company in the record list.
  9. Continue to follow step 5 through step 8 for each company in the record list.


1.6.2.3.4.14. How to Synchronize existing
companies from Service Manager to UCMDBs

Your Service Manager system may already contain company records that you want to use with
the multi-tenancy integration.

If you update any field in a company record and Service Manager hasn't yet synchronized it to
UCMDB, the system prompts whether you want to synchronize the company to UCMDB.

            Note

           Service Manager will not prompt you to synchronize the company record if you
           have disabled the option to show the company in multi-company lists, or if there is
           a pending schedule record associated with the company. See How to inactivate a
           synchronized company for more information.

This task includes the following steps:

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to System Administration > Base System Configuration > Companies.
   3. Type the search criteria you want to use to find company records. For example, leave the

     search form blank to search all company records.
   4. Click Search.
   5. Select a company record to update.
   6. Update the company record.
   7. Click Save. Service Manager prompts you to confirm that you want to synchronize the

     record with UCMDB.

                   Note

                Service Manager saves the company record regardless of your
                synchronization choice.


1.6.2.3.4.15. How to view whether company
information is in UCMDB

Suppose you have enabled the multi-tenancy integration. Service Manager displays a read-
only field in each company record that indicates whether the system has synchronized the
UCMDB Customer ID with your UCMDB system.

            Note

           The UCMDB Customer ID field is visible only when you enable the multi-tenant
           UCMDB integration.

To view whether company information is in UCMDB:
   1. Sign in to Service Manager as a system administrator.
   2. Navigate to System Administration > Base System Configuration > Companies.
   3. Type the search criteria you want to use to find company records. For example, leave the
     search form blank to search all company records.
   4. Click Search.
   5. Review the status of the Synched with UCMDB field.
     If you select this checkbox, Service Manager has already synchronized the company ID
     with your UCMDB system. If you don't select the checkbox, Service Manager has yet to
     add this company to your UCMDB system.

                   Note

                For more information about synchronization failures, see Schedule records.


1.6.2.3.4.16. How to resynchronize an existing
company with UCMDB

Service Manager provides you a means to resynchronize company records with your UCMDB
system in case you lose UCMDB data for some reason. For example, you might intentionally
remove UCMDB data during integration testing, or you might need to recover data after a
disaster. You can force Service Manager to synchronize companies with your UCMDB system
with the Re-synch with UCMDB option.

To resynchronize an existing company with UCMDB:

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to System Administration > Base System Configuration > Companies.
   3. Type the search criteria you want to use to find company records. For example, leave the

     search form blank to search all company records.
   4. Click Search.
   5. Select a company record to synchronize.
   6. Click the Re-synch button next to the Synched with UCMDB checkbox.

            Note

           The Re-synch button is available only from company records that have already
           been synchronized with UCMDB and have the Synched with UCMDB checkbox
           checked. If your UCMDB system already has a company with this ID value, it will
           ignore the resynchronization request. Service Manager will also ignore a
           resynchronization request if there is an existing schedule record to resynchronize
           the company with UCMDB. In this case, it displays the message A schedule record
           has already been added to re-synch this company with UCMDB.


1.6.2.3.4.17. How to inactivate a synchronized
company

After you have synchronized a company record with UCMDB you can no longer delete the
record. Instead, you can inactivate a company record, which causes the UCMDB system to
stop all further CI updates for the company. Any existing CI data for the company still remains
in the UCMDB system associated with the inactive UCMDB Customer ID. However, both the
company and any associated CIs will no longer be visible from the UCMDB system.
To inactivate a synchronized company:

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to System Administration > Base System Configuration > Companies.
   3. Type the search criteria you want to use to find company records. For example, leave the

     search form blank to search all company records.
   4. Click Search.
   5. Select a company record to inactivate.
   6. Select No from Show Company in Multi-Company Lists.
   7. Click Save.
   8. If Service Manager has synchronized this company with UCMDB, the system prompts you

     to confirm the inactivation.
   9. Click Yes to confirm the inactivation or No to cancel your changes.


1.6.2.3.4.18. How to reactivate an inactive
company

You can reactivate any inactive companies on your Service Manager system to include them in
the multi-tenancy integration. You must also synchronize the company with UCMDB for
UCMDB to process any CI updates for this company.

To reactivate an inactive company:

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to System Administration > Base System Configuration > Companies.
   3. Type the search criteria you want to use to find company records. For example, leave the

     search form blank to search all company records.
   4. Click Search.
   5. Select a company record to reactivate.
   6. Select Yes from Show Company in Multi-Company Lists.
   7. Click Save. Service Manager prompts you to reactivate the company with UCMDB.
   8. Click Yes. Service Manager creates a schedule record to reactivate the company.


1.6.2.3.4.19. How to add tenant-specific DEM
rules

You can use the condition field to create DEM rules that are specific to a particular tenant in a
multi-tenancy UCMDB-SM integration. For example, one tenant may want to add CIs directly to
Service Manager while another tenant may want to open changes for each CI. The following
sample DEM rules illustrate how to accomplish this.

DEM rule Id                                   Tenant-specific DEM rules  Condition

                                        Action on new CI

ucmdbNode_advantage                     Add CI

                                                                         company in
                                                                         $L.file="advantage"

ucmdbNode_hp                            Create change

                                                                         company in
                                                                         $L.file="HP"

Tip

It is a best practice to create a separate DEM rule for each tenant.
````
