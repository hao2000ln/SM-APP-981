---
source: Document/pdf/v981/Upgrade.pdf
version: 9.81
sections: 1 .. 1.1
printed_pages: 1-8
---

# 1 Upgrade

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1. Upgrade

This section provides instructions on how to upgrade from an existing implementation
of Service Manager to the latest version. These instructions cover both platform
components (such as the Service Manager server, Windows client, web tier, and
Smart Analytics) and the Service Manager applications.

For instructions on performing a new installation of Service Manager, see Install.

Suggested upgrade order

For existing implementations, follow the upgrade order below:

   1. Upgrade your RDBMS if needed.
   2. If you are on a version earlier than 9.7x, install the Service Manager 9.80 server

     without loading the applications and demonstration data, and restore your old
     server configurations. Then, upgrade Service Manager 9.80 Server to 9.81. For
     details, see Upgrade the Service Manager server.
   3. Install the Service Manager 9.81 Windows client and restore your old
     configurations. For details, see Upgrade the Windows client.
   4. Install the Service Manager 9.81 web tier and restore your old configurations. For
     details, see Upgrade the web tier.
   5. Upgrade other components (such as Mobility, Smart Analytics, and Service
     Manager Collaboration) as needed, and restore their old configurations if any.
   6. (Recommended) Upgrade your applications to version 9.81. While it is possible
     to upgrade certain core platform components (Server, Windows Client, and Web
     Tier) and run an earlier version of the applications, many of the new features are
     not supported by the earlier applications. To get the benefit of all the new
     features, you must upgrade to the latest Service Manager applications as well.
     For more information, see Upgrade the applications.

     For information about the compatibility between the Service Manager platform
     components and applications, refer to the Service Manager support matrix.

            Note

           The Upgrade Utility upgrades not only your applications but also your
           language packs to version 9.80.

Upgrade matrix


Follow the upgrade matrix to determine which versions of Service Manager can be
upgraded to version 9.81.

Server

Base version                            Supported upgrade path Rollback
9.64 to 9.72
                                        Install the Service      Supported
                                        Manager 9.80 server,
                                        and then apply the
                                        Service Manager
                                        9.81 server patch.

Windows client

 Base version                           Supported upgrade path Rollback
 9.6x to 9.80
                                        Install the Service      Supported
Web tier                                Manager 9.81 Windows
                                        client and restore your
                                        old configurations.

 Base version                           Supported upgrade path Rollback
 9.6x to 9.80
                                        Install the Service      Supported
Mobility client                         Manager 9.81 web tier
                                        and restore your old
                                        configurations.

Base version                            Supported upgrade path Rollback
9.6x to 9.80
                                        Install the Service      Supported
                                        Manager 9.81 Mobility
                                        client and restore your
                                        old configurations.


Smart Analytics                         Supported upgrade path Rollback

 Base version                           Upgrade to Service         Supported
 9.40 and later                         Manager 9.81 Smart
                                        Analytics.
Collaboration
                                        Supported upgrade path Rollback
 Base version
 9.6x to 9.80                           Install the Service        Supported
                                        Manager 9.81 chat
Applications                            server, chat service, and
                                        chat UI. Next, restore
                                        your old configurations.


Base version                            Supported upgrade path Rollback

9.3x (No PDCP installed)                Upgrade to Service      Supported
9.31 or later (PDCP3                    Manager 9.81 Hybrid.
installed)
9.4x (Classic)
9.41 (Hybrid)
9.5x (Hybrid)
9.6x (Hybrid)
9.7x (Hybrid)

9.8x (Hybrid)

9.31 or later (PDCP4                    Upgrade to Service      Supported
installed)
9.4x (Codeless)                         Manager 9.81 Codeless.
9.5x (Codeless)
9.6x (Codeless)
9.7x (Codeless)
9.8x (Codeless)


1.1. Backup and backout instructions

In case you need to restore your Service Manager system to its original state after
installing the component patches in this release, make necessary backups before
each patch installation. If you need a rollback, follow the restore instructions.

Server

Follow these steps to back out the server upgrade:

   1. Stop the Service Manager server.
   2. Execute the PatchUninstall.bat on Windows or PatchUninstall.sh on Linux (the

     file is located in the <SM Installation>\_uninstall directory).

                   Note

                You can only use the server patch uninstallation tool if you have
                applied the current patch by using the server patch installation tool.
                Furthermore, you can only use the tool to restore a version that was
                backed up by the server patch installation tool.

   3. When prompted, enter the full path of the Service Manager server backup
     directory. A list of the available backups is displayed.

   4. Select the desired backup version and confirm your selection.

                   Note

                If you have a horizontally-scaled system, make sure that every
                server instance is replaced with its backup.

   5. If you have also loaded platform unload files required for your server changes,
     you must also roll back the application changes made by the unload files. See
     Applications.

   6. Restart the Service Manager server.

If the tool fails to back out the server patch, the details are recorded in the
PatchUninstall.log file.

Applications


            Tip

           You can use Unload Manager (recommended) or Database Manager (if
           Unload Manager is not available in your application version) to roll back to
           your old data, as described in the following instructions.

To roll back to your old data using Unload Manager, follow these steps:

   1. Go to System Administration > Ongoing Maintenance > Unload Manager.
   2. Double-click Apply Unload to open the wizard.
   3. Select the unload file generated in the backup process, specify a backup file,

     and then click Next. Details of the unload file are displayed.
   4. Double-click a conflicting object in the table to open the merge tool:

        1. Merge the object, and then select the Reconciled check box.
        2. Click Save to return to the wizard.
   5. Click Next after all the conflicting objects are reconciled.
   6. Click Yes on the confirmation window to apply the backup unload.
   7. Click Finish.

To roll back to your old data using Database Manager, follow these steps:

   1. Go to Database Manager, click More > Import/Load.
   2. Browse to the backup unload file you created.
   3. Click Load FG.

Web tier

To back out the web tier upgrade, follow these steps:

   1. Delete or uninstall the existing web tier.
   2. Clear the cache of your web application server (for example, Tomcat).
   3. Redeploy the old web tier.
   4. Restore your old customizations.

Windows client

To back out the Windows client upgrade, follow these steps:

   1. Uninstall the new Windows client.
   2. Reinstall the previous Windows client.
   3. Restore your old Windows connections and configurations.

SM Collaboration


To back out the SM Collaboration upgrade, follow these steps:

   1. Remove the new Openfire installation folder.
   2. Restore the renamed Openfire folder.

   1. Stop the Service Manager server.
   2. Run PatchUninstall.bat on Windows or PatchUninstall.sh on Linux (the file

     locates in the <SM Installation>\_uninstall directory).

                   Note

                You can only use the server patch uninstallation tool if you have
                applied the current patch by using the server patch installation tool.
                Furthermore, you can only use the tool to restore a version backed
                up by the server patch installation tool.

   3. When prompted, enter the full path of the Service Manager server backup
     directory. The system displays a list of the available backups.

   4. Select the desired backup version and confirm your selection.

                   Note

                If you have a horizontally scaled system, make sure you have
                replaced every server instance with its backup.

   5. If you have also loaded platform unload files required for your server changes,
     you must also roll back the application changes made by the unload files. See
     the Applications section below.

   6. Restart the Service Manager server.

If the tool fails to restore from the server patch, the system records the details in the
PatchUninstall.log file.
````
