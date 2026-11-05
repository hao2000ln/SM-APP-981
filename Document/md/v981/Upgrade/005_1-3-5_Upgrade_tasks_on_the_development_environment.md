---
source: Document/pdf/v981/Upgrade.pdf
version: 9.81
sections: 1.3.5 .. 1.3.5.5
printed_pages: 89-108
---

# 1.3.5 Upgrade tasks on the development environment

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.5. Upgrade tasks on the development
environment

Topics in this section include:
Step 1: Duplicate the production environment
Step 2: Upgrade server and client
Step 3: Perform preparatory tasks
Step 4: Load the applications upgrade files
Step 5: Run the Upgrade Utility
Step 6: View the upgrade results
Step 7: Manage the upgrade result data
Step 8: Resolve exceptions
Step 9: Resolve conflicts
Step 10: Perform additional manual tasks
Step 11: Migrate Process Designer data
Step 12: Return the system to normal operation
Step 13: Test the development environment
Step 14: Back up the system
Step 15: Build a custom upgrade


1.3.5.1. Step 1: Duplicate the production
environment

To achieve the best results, develop and test the custom upgrade on a system that
resembles your production environment as closely as possible.

To duplicate the production environment, follow these steps:

   1. Identify a server to use for the development and test environments.

           Linux: You can copy the files to a new location on your production
           machine.
           Windows: You must create the development system on a different machine
           from your production system.
   2. Ensure that adequate memory and disk space is available and accessible.
     Frequent backups are necessary.

   3. Ensure that your development and test systems meet all upgrade requirements.
     For more information, see Planning an upgrade.

           Upgrade your RDBMS to a version compatible with Service Manager 9.80.
           See Support matrix.
           Convert your RDBMS code page to Unicode. See your RDBMS vendor
           documentation.
   4. Set up the environment of your development and test machines to resemble
     your production server as closely as possible. The operating system version and
     service pack level should match.

   5. Copy your existing production system data onto your development system.

     We recommend you use the native RDBMS backup utilities to back up your data.
     Refer to your RDBMS documentation for backup instructions.

   6. Install a Service Manager 9.80 run time environment on the duplicated system.
     Do not load the Service Manager 9.80 demonstration data files.

   7. Install a Service Manager 9.80 client on the duplicated system.


Note

After you duplicate the production environment, you must either disable
the integration servers and the KM servers, or change the URL to connect
to the integration servers and the KM servers that are in the test
environment.


1.3.5.2. Step 2: Upgrade server and client

Make sure that you have upgraded your server and the client to the latest version
before running an applications upgrade. This allows the upgrade utility to call the new
functions in the latest server and client and to take full advantage of all applications
features following an upgrade.

            Note

           You must upgrade the IDOL server if you are working with IDOL. For
           details, see Upgrade Smart Analytics.

To upgrade your applications by using this Upgrade Utility, you must first perform a
server and client upgrade to the 9.80 platform (server and client).

     Obtain the latest client from the installation package, and then follow the
     instructions in Upgrade the Windows client.
     Obtain the latest server from the installation package, and then follow the
     instructions in Upgrade the Service Manager server.


1.3.5.3. Step 3: Perform preparatory tasks

You must prepare your system before upgrade. To do this, perform the following
tasks:

  1. Check the locale information and make sure it is English, especially when the SM
     Server is running on the Linux platform. You need to run the locale command on
     the Linux platform to get the locale information, and then set it to en_US.UTF-8
     as necessary.

  2. (Optional) You can read and use the sysctl.conf file to control the value of the
     shared_memory parameter. To set proper OS parameters, copy the <Service
     Manager server installation path>/RUN/97-sm-sysctl.conf file into /etc/sysctl.d
     directory.

  3. Use the Windows client to disable the Client side load/unload option. To do this,
     click Window > Preferences, and then click to clear the option.

                  Caution

                Failure to disable this option will cause the upgrade process to fail.

4. Disable Development Audit. To do this, navigate to Tailoring > Audit in the
  System Navigator, and then click Turn Auditing On/Off. Clear the Do you want to
  audit development changes? option if it is selected, and then save the change.

5. Clean up any records in the following log files:

        Msglog

        Syslog
        Errorlog

               Note

             Back up the table data if you need it later. If the tables contain too
             many records, the upgrade process will be slow.

6. Clean up the following messaging files:
        Eventin records
        Eventout records


               Note

             Back up the table data if you need it later. If the tables contain too
             many records, the upgrade process will be slow.

7. Clean up any files in the systemperform table.

               Note

             Back up the table data if you need it later. The systemperform dbdict
             will be converted from lob columns to real database columns.
             Therefore, if there are too many records in the systemperform table,
             transfer.bin will load very slowly.

8. Update the Service Manager configuration files.
  The following tables list the changes that you need to make to the Service
  Manager configuration files before running the Upgrade Utility. Record all
  changes that you have made so that you can revert them to the original status
  after the upgrade.
  Stop the Service Manager server, apply the required changes to the
  configuration files, and then restart the Service Manager server.


Parameter                                            sm.cfg        Description
wildcardcharacters
sm system.start                         Changes
sm -sync
                                        If this parameter exists,  Failure to disable this
sm -httpPort                            comment it out by          option will cause the
                                        changing it to:            upgrade process to fail.

                                        #wildcardcharaters

                                        If this parameter exists,  Commenting this
                                        comment it out by          parameter out disables
                                        changing it to:            the background
                                                                   processes.
                                        #sm system.start

                                        Add this parameter to      This parameter starts
                                        the end of the file if it  the sync process,
                                        doesn't exist yet.         which identifies and
                                                                   releases locks owned
                                                                   by inactive processes
                                                                   and shared memory
                                                                   that's not in use.

                                        If there is more than      Each sm -httpPort
                                        one instance of the sm     parameter starts a
                                        -httpPort parameter,       Service Manager
                                        keep only one instance.    server process that can
                                                                   handle a certain
                                                                   number of client
                                                                   sessions (see the
                                                                   Service Manager Help
                                                                   Center documentation
                                                                   for more information).

                                                                   Keeping one process
                                                                   alive will be enough for
                                                                   the upgrade process.


Parameter                               Changes                 Description
Other parameters
                                        Comment out all other   Commenting out those
                                        parameters except the   parameters disables all
                                        ones mentioned in this  the other Service
                                        table.                  Manager processes
                                                                that aren't required
                                                                during an upgrade.

Parameter                                             sm.ini                           Service Manager 9.81
ir_disable:1
                                        Changes                    Description
sessiontimeout:1200
                                        Add this parameter to      This parameter
                                        the end of the file if it  disables all IR keys on
                                        doesn't exist.             your existing Service
                                                                   Manager system. This
                                        Add this parameter to      will make the upgrade
                                        the end of the file if it  process run faster.
                                        doesn't exist. If this
                                        parameter already          This parameter defines
                                        exists, update it to an    the number of minutes
                                        appropriate value.         that the server waits for
                                                                   a client heartbeat
                                                                   signal before the server
                                                                   assumes that the client
                                                                   session has timed out
                                                                   and closes the
                                                                   connection. A value of
                                                                   1200 sets the timeout
                                                                   to 20 hours (1200
                                                                   minutes), a period that
                                                                   should be enough for
                                                                   an upgrade phase to
                                                                   complete in a typical
                                                                   scenario.


Parameter                               Changes                    Description
heartbeatinterval:120
                                        Add this parameter to      This parameter
                                        the end of the file if it  controls the client
                                        doesn't exist.             heartbeat frequency. If
                                                                   the server doesn't
                                                                   receive a heartbeat
                                                                   from the client within
                                                                   the time-out limit as
                                                                   defined by the
                                                                   sessiontimeout
                                                                   parameter, the server
                                                                   terminates the client.
                                                                   All unsaved data is lost
                                                                   and the client must
                                                                   establish a new
                                                                   connection.

Restart the Service Manager server before you perform the upgrade in order for these
tasks to take effect.


1.3.5.4. Step 4: Load the applications
upgrade files

You must load the preupg.bin file into Service Manager before you can use the
Upgrade Utility.
If you are upgrading from version 9.30 or 9.31, you need to import the fileload.unl
file that's already in the Upgrade Utility package before loading pregupg.bin . If you
are performing a custom upgrade, import the fileload.unl file from Upgrade Utility
package as well.

            Note

           If you are performing a custom upgrade on a test or production system,
           use the preupg.bin file included in your custom upgrade instead.

To load the applications upgrade file, follow these steps:

   1. On the Service Manager server, create a folder (referred to as the Upgrade
     folder later in this document).

                   Note

                Make sure that the Service Manager server process ( sm ) has write
                and execute privileges for this folder.
                Suppose you are connecting to the Service Manager server from a
                client that's installed on a remote client computer. In this case, make
                sure to create the folder on the Service Manager server instead of
                the client computer.

   2. Extract the Service Manager applications Upgrade Utility files to the Upgrade
     folder. Make sure the extraction doesn't miss any Upgrade Utility files.
     Otherwise, the upgrade process will fail.

   3. Sign in to the Service Manager Windows client as a system administrator.


               Note

             Select English as the language when signing into the system for an
             upgrade.

4. Back up the SYSTEM ADMINISTRATION menu record.
5. Load the preupg.bin file using Service Manager Database Manager.
6. Sign out of Service Manager and then sign in again.


1.3.5.5. Step 5: Run the Upgrade Utility

Now that you have a functional environment, you are ready to run the Upgrade Utility.
Follow the steps in this step to run the out-of-box upgrade against the data in your
development environment and to run your custom upgrade against your test and
production environments. You must perform these steps in a Service Manager
Windows client, instead of a web client.

            Caution

           If the upgrade fails while the Upgrade Utility is running, fix possible issues
           and rerun the Upgrade Utility, and you should be able to resume the
           upgrade from the failure point; if the upgrade process can't be resumed,
           you must restore the database to the last backup point and fix possible
           issues before you can rerun the Upgrade Utility.

The running of the Upgrade Utility involves the following three primary phases:

   1. In the first phase, the Upgrade Utility guides you through several questions and
     collects information needed for the upgrade.

   2. The second phase is the dbdict update phase, where the utility updates dbdicts.
   3. The third phase is the data update phase, where the utility updates applications

     data.

To run the Service Manager Upgrade Utility, follow these steps:

   1. From the System Navigator, click System Administration > Ongoing
     Maintenance > Upgrade Utility > Apply Upgrade to launch the Upgrade Utility.

   2. In the text box, type the fully qualified path to the Upgrade Utility folder, and
     then click Next.

     Example:

     Windows: c:\temp\upgrade\
     Linux: ~/upgrade/

                   Note

                You must have read, write, and execute permission to the folder.


3. The system displays a series of information for your verification, including
  Applications version upgrading from, Applications version upgrading to,
  Applications base version, Full path to the Upgrade Utility files and Language(s)
  to be upgraded. Verify this information and then click Next to continue.

               Note

                   If this screen doesn't display the correct information, don't
                   continue with the upgrade. Instead, contact Software Customer
                   Support.
                   If you are upgrading from SM9.6x, the system displays the
                   parameter settings before this step. Review the settings and
                   then click Next to continue.

4. (Optional) The system prompts you to migrate legacy categories to the
  corresponding Process Designer-based modules. To move your selection
  between the legacy categories lists and the Process Designer-based modules
  lists, select a category and click the arrow button. Click Next.

               Note

             This screen appears only when you are upgrading from the following
             versions:

                   Service Manager 9.3x without Process Designer Content Pack
                   installed
                   Service Manager 9.3x with Process Designer Content Pack
                   9.30.2 (PDCP3) installed
                   Service Manager 9.4x Classic

             Based on your business requirements, you may select all categories
             you are using to migrate.

             Before you proceed, refer to Appendix A: Additional manual
             migration tasks on Service Manager Hybrid for more information.

5. The upgrade is now ready to start. Click Next to start the upgrade.
6. When you are asked whether you want to proceed, click Yes.
7. The Upgrade Utility displays the status when the upgrade is being processed.

  The loading process may take a long time.

8. When you receive an UPGRADE IS COMPLETE message, the Upgrade Utility
  has finished the data processing and you can follow the instructions in the


     message to complete the next steps. After you click Finish, you are
     automatically logged out.

   9. Restart the server and log back into the client.
 10. Open the scversion table in the Database Manager, and verify that the

     Applications Version field is 9.80.00xx. If this field displays a value other than
     9.80.00xx, check the log files to identify the issue that occurred.

Upgrade Utility logs and error messages

The Upgrade Utility creates a set of log files during the upgrade process. These files
reside in the log directory.


Log file                                List of upgrade log files
detail.log
                                                   Contents

                                        This file contains specific information
                                        about the upgrade, including the
                                        following:

                                             Almost all information in
                                             upgrade.log.
                                             Name of the file being purged. For
                                             example, “dbdict: upgradestatus
                                             is purged.”
                                             Progress of a file loading. For
                                             example, “Adding record # 100
                                             from table upgradeobjects”.
                                             Changes made to fields during file
                                             processing. For example,
                                             “Increasing field length for
                                             incidentlib.company in kmquery
                                             dbdict from VARCHAR(40) to
                                             VARCHAR(70)”
                                             Signature of a file and the action
                                             on it. For example, “Processing
                                             Format Record : cc.get.dependen,
                                             signature=(current=3843738292,
                                             oob=NONE,
                                             upgrade=3843738292),
                                             upgraderesult=current”

Log file                                                                                        Service Manager 9.81
except.log
                                        Contents

                                        This file contains information about any
                                        exceptions reported by the upgrade,
                                        including the following:

                                             Messages about data type
                                             mismatches that failed to be
                                             resolved, or database dictionaries
                                             failed to be upgraded. For
                                             example, "dbdict:FolderRights,
                                             field:delete, field type is logical --
                                             expected to be:character"

                                             See Data type mismatches.

                                             Messages about the unique key
                                             changes that failed to be
                                             resolved. For example,
                                             "dbdict:Todo, Unique Key is
                                             {"record.id", "itemType"} --
                                             expected to be:{"record.id"}"

                                        If there are exceptions logged in this
                                        file, we recommend you to resolve
                                        them in the "Resolving exceptions and
                                        conflicts" phase.

Log file                                                                                        Service Manager 9.81
upgrade.log
                                        Contents

                                        This file contains information about
                                        where the upgrade is at any point. This
                                        file contains only the main steps of the
                                        upgrade, including the following:

                                             Starting and ending of each sub-
                                             phase. For example, “**** Start
                                             Phase [Pre Upgrade Action
                                             Update] ****”

                                             Main activities during each sub
                                             phase. For example, “Purging
                                             upgrade files...”
                                             Number of files to be processed.
                                             For example, “There are 608
                                             dbdicts to be processed.”
                                             Names of the files being
                                             processed. For example,
                                             "Processing dbdict, AdvFilter”

Log file                                                                                        Service Manager 9.81
pdmigration.log
                                        Contents

                                        The log file, which is stored in the
                                        Service Manager log directory,
                                        includes the following information:

                                             A list of Alert definition records
                                             that are created based on settings
                                             in your Classic categories
                                             A list of category, subcategory,
                                             and producttype records that are
                                             migrated to Process Designer-
                                             based tables
                                             A list of format level link records
                                             that are updated to disable the
                                             category, subcategory, and
                                             product.type link lines
                                             A list of the Classic probsummary
                                             and incident objects that are
                                             migrated to Process Designer-
                                             based objects
                                             A list of updated process records
````
