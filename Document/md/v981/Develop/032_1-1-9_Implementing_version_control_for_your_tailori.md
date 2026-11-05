---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.9 .. 1.1.9.2
printed_pages: 859-896
---

# 1.1.9 Implementing version control for your tailoring

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.9. Implementing version control for
your tailoring

Service Manager provides comprehensive and fully-integrated IT service
management through variously customized applications. Although Service Manager
already provides an in-tool revision control based on the individual record, it has
always been a challenge to implement version control for customization stacks.
Service Manager can integrate with Apache Subversion (SVN) or Git to provide a
version control solution for your customized applications.

            Note

           This topic doesn't cover the basic concept of version control and the
           usage of Apache Subversion or Git.

In short, it takes three steps to build up your version control process by using SVN or
Git:

   1. A system administrator exports all the applications records from Service
     Manager and check in the exported files to an SVN or Git server to create a
     baseline repository.

   2. Developers check out the latest version of the applications records and import
     them into a local Service Manager development environment.

   3. Developers customize the applications according to site-specific requirements,
     and check in the changes to the SVN or Git server.

     The following flow chart illustrates your version control process:


Related topics

SVN version control process
Version control best practice
Applications data file represented in XML


1.1.9.1. SVN version control process

The process in this section is provided as an example assuming that you integrate
your Service Manager with SVN for tailoring version control.

The SVN version control process includes the following:

Code repository preparation by a system
administrator

The first step of your version control process is that a system administrator creates a
code repository on an SVN server. This enables you to use the repository to track all
changes made to applications objects as you create, develop, or extend the Service
Manager applications.

To leverage the SVN version control system, follow these steps:

   1. Set up the SVN server and create the repository folder for the Service Manager
     applications data.

   2. Set up the SVN client. To do this, follow these steps:

        1. Create a folder in your local drive to check the SVN code repository in and
           out. For example, you create " c:\svn\data ."

        2. Check out the empty repository to your local folder.


3. Configure Service Manager to use the repository. To do this, add the following
  two new lines to the sm.ini file in the <Server Dir>/RUN/ directory:

   svc_rootdir: <Your check-out Service Manager applications path, in this
  example, C:\svn\data >

   svc_mode:2

  Make sure that your Service Manager server is installed on the computer that
  has the SVN client installed.

4. Run the sm -svc_export command to export the Service Manager applications
  data as XML files to the svc_rootdir folder.

  For information about more parameters to export the applications data, see
  Parameters to import and export files.

  Your output folder should resemble the following:

The XML files are exported to subfolders that are alphabetically-ordered by the
unique key names of the applications, as shown in the following example for the
ScriptLibrary folder:


5. Commit all the files to the SVN repository.

Note

You should exclude any business-related records when you commit
the files, as these types of records require a great deal of capacity
and decrease efficiency. These types of records include the
following, but your organization's records may differ:

Object                                          Table
Interaction                                     incidents
Incident                                        probsummary
Problem                                         rootcause
Problem Task                                    rootcausetask
Known Error                                     knownerror
Known Error Task                                knownerrortask
Change                                          cm3r
Change Task                                     cm3t


Development environment preparation by
developers

            Note

           Environment preparation is only required when a developer starts
           applications development for the first time or starts to use a new
           computer.

   1. Set up your SVN client. To do this, choose the command line client tools in SVN.
     The following example displays the command line client tools feature in
     TortoiseSVN:

2. Create a folder in your local drive to check the SVN code repository in and out.
  For example, you create " c:\svn\data ."

3. Set up Service Manager by adding the following two new lines to the sm.ini file
  in the <Server Dir>/RUN/ directory:

   svc_rootdir: <Your check-out Service Manager applications path, in this
  example, C:\svn\data >

   svc_mode:2


     Make sure that the Service Manager server is already installed on the same
     computer, and then restart the server to enable the added svc command.
   4. Check out the applications data files from the SVN repository to your local
     folder.
   5. Import the applications data in the XML files by copying the production Service
     Manager database to the development system or by running the following
     command to a clean empty development database:
      sm -svc_import -svc_cleanbuild:1

                   Note

                For information about more parameters to import the XML files, see
                Parameters to import and export files.

Development process by developers

   1. Update all the source code to the latest version from the code repository.
   2. Modify the records by the Service Manager client and then save the changes to

     automatically synchronize the XML files in the svc_rootdir directory, as shown
     in the following example for the process record:

3. Check the modified code into the code repository. The commit window displays
  all the changed files.


                   Note

                The commit window may not show all the changed files in the SM-
                APPS change list, and this problem occurs when the tables you have
                modified aren't present in the svc_include.props property file in
                your <Server Dir>/RUN directory. To solve the problem, manually
                add the names of the tables to this file.

In this way, SVN retains a clear history of any changes made to a specific application.

Related topics

Implementing version control for your tailoring
Version control best practice
Parameters to import and export files Applications data file represented in XML


1.1.9.2. Git version control process

We provide the information contained in this section regarding Git configurations to
our customers and partners as a courtesy. This section doesn't replace a Git
reference, and you may need to conduct additional research regarding Git technology
by consulting with sources outside of this section. Our company hereby disclaims all
liability associated with the use and accuracy of this information. As Git technology
evolves, we may or may not update this reference.

Prior to proceeding with the Git configuration tasks, make sure you have prepared the
following resources:

     Possess the basic Git knowledge and hands-on skills to install Git Bash, set up
     the Git server, create a repository, folk/clone the repository to a local drive,
     pull/commit/push code changes, and so on.

     For more instructions, see https://help.Github.com/en.

     Install Git Bash and the version must be 2.10.x or above.

                   Note

                During the Git Bash setup process, make sure to select the Use Git
                and optional Unix tools from the Windows Command Prompt
                option on the Adjusting your PATH environment screen.

Related topics

Prepare Git
Prepare to use Feature Tracker
Using Feature Tracker
Feature Tracker use case


1.1.9.2.1. Prepare Git

After you perform a system upgrade, you need to follow the instructions in this topic
and prepare Git again. Due to the data table structure changes in the upgrade
process, the original feature records and Watchdog records become invalid. These
records are for reference only and you can no longer use these records to commit
and deploy codes. Visit the Git server if you need to view the original submission
history.

For more information about the feature record, the release record, and Watchdog, see
the Using Feature Tracker topic.

Prepare a code repository

User role: System administrator

The first step of your version control process is that a system administrator creates a
code repository on a Git server. This enables you to use the repository to track all
changes made to applications objects as you create, develop, or extend the Service
Manager applications.

            Note

           Make sure that your Service Manager server is installed on the computer
           that has the Git client installed.

To leverage Git version control, follow these steps:

   1. Set up the Git server and create the repository folder for the Service Manager
     applications data.

   2. Set up the Git client.

   3. Create a folder in your local drive to check the Git code repository in and out.
     For example, c:\Git\data.

   4. Use the SSH URL or the HTTPS protocol to clone the empty repository to your
     local folder. See the following command as an example:

     Git clone Git@<Github.com>:<organization>/<repo>.Git


               Note

             You need to configure Credential Storage for Git when using the
             HTTPS protocol. As a result, you don't need to repeatedly provide
             your username and password for every Git operation such as pull or
             push. For more instructions about Credential Storage, see
             https://Git-scm.com/book/en/v2/Git-Tools-Credential-Storage.

5. Configure to use the repository. To do this, add the following two new lines to
  the sm.ini file in the <Server Dir>/RUN/ directory:
   svc_rootdir: <Your check-out Service Manager applications path, in this
  example, C:\Git\data>
   svc_mode:99
  Restart the Service Manager server to enable the added svc commands.

6. In the <Server Dir>/RUN/ directory, run the sm -svc_export command to export
  all Service Manager applications data as XML files to the svc_rootdir folder. You
  may also refer to Parameters to import and export files for more parameters to
  export some of the applications data.

               Note

             Before you export the applications data records, be sure to stop the
             Service Manager server.

  Your output folder should resemble the following:


The XML files are exported to subfolders that are alphabetically-ordered by the
unique key names of the applications, as shown in the following example for the
ScriptLibrary\a folder:


7. Commit and push all the files to the Git repository.


Note

You should exclude any business-related records when you commit
the files, as these types of records require a great deal of capacity
and decrease efficiency. These types of records include the
following, but your organization's records may differ:

Object                                  Table
Interaction                             incidents
Incident                                probsummary
Problem                                 rootcause
Problem Task                            rootcausetask
Known Error                             knownerror
Known Error Task                        knownerrortask
Change                                  cm3r
Change Task                             cm3t

Prepare a development environment

User role: Developer

            Note

           Environment preparation is only required when a developer starts
           applications development for the first time or starts to use a new
           computer.

1. Set up your Git client.

2. Create a folder in your local drive to check the Git code repository in and out.
  For example, you create c:\Git\data .

3. Set up Service Manager by adding the following two new lines to the sm.ini file
  in the <Server Dir>/RUN/ directory:


   svc_rootdir: <Your check-out Service Manager applications path, in this
  example, C:\Git\data>
   svc_mode:99

  Restart the Service Manager server to enable the added svc commands.
4. Use the SSH URL or the HTTPS protocol to clone the applications data files from

  the Git repository to your local folder. See the following command as an
  example:
  Git clone Git@<Github.com>:<organization>/<repo>.Git

               Note

             You need to configure Credential Storage for Git when using the
             HTTPS protocol. As a result, you don't need to repeatedly provide
             your username and password for every Git operation such as pull or
             push. For more instructions about Credential Storage, see
             https://Git-scm.com/book/en/v2/Git-Tools-Credential-Storage.

5. Import the applications data in the XML files by copying the production Service
  Manager database to the development system.


1.1.9.2.2. Prepare Service Manager

In Windows, you can either start Service Manager from the command line or from
Windows Services.

     Command line (Recommended)

     We recommend to start Service Manager from the command line. In this way,
     Service Manager uses the GIT configurations the current login user set up for
     GIT servers. You don't need perform further GIT configurations.

     Windows Services

     When you start Service Manager from Windows Services, Service Manager
     searches for GIT configurations for the background service user, generally the
     Local System account. You need to configure the GIT environment for the
     background service user so that you can commit changes using Feature Tracker.

To configure the GIT environment for the background service user, follow these steps:

   1. Create a home folder. For example, C:\Home.
   2. Add a Windows System Environment HOME , with the value set as the full path

     of the HOME folder. See the following screenshot as an example:


3. RUN the git config command again to set up GIT configurations such as
  "user.email" and "user.name" in the HOME folder.

               Note

             These two variables are required by GIT to do commit operations.

4. Copy the .ssh folder to the HOME folder in both the development and
  deployment environments.

               Tip

             The .ssh folder contains the id_rsa, id_rsa_pub, and known hosts
             files. The known hosts file is generated once you connect the
             remote GIT repository successfully.

  For more information, see Connecting to GitHub with SSH.


1.1.9.2.3. Using Feature Tracker

Important: To perform configurations and use Feature Tracker, an operator must have
the following capability words in the user profile record:

     FeatureTrackerCommit
     FeatureTrackerReleaseManager

Configure settings to track features

To configure global settings for Feature Tracker, follow these steps:
   1. Go to the System Navigator and then click Tailoring > Feature Tracker > Global
     Settings.
   2. Modify the settings as described in the table below:

Field                                                                                     Service Manager 9.81
Release Repository URL
Temp Folder                             Description
Remote SM End Point
                                        Specify the URL of the remote
Remote SM User Name                     repository for release.
Remote SM Password
                                        Specify the folder to store temporary
                                        files.

                                        Specify the URL of the Service
                                        Manager server with HTTP protocol
                                        and port number. For example,
                                        http://<IP address>:13080 . Using
                                        the endpoint set here, Feature
                                        Tracker communicates with the
                                        target Service Manager server on
                                        which the release is to be deployed.

                                        Specify a user name of the target
                                        Service Manager on which the
                                        release is to be deployed.

                                        Specify the login password of the
                                        user that's set in Remote SM User
                                        Name.

       Field                                                                              Service Manager 9.81
       Watched Tables
                                        Description
   3. Click Save.
                                        Display the table names for which
This PDF was generated on May 23, 2026  the system identifies changed
                                        objects. You can define the tables in
                                        either of the following methods:

                                             Access <Service Manager
                                             installation
                                             directory>\Server\RUN\sm.ini,
                                             add the svc_files parameter,
                                             and then add a list of tables.
                                             Access <Service Manager
                                             installation
                                             directory>\Server\RUN\svc_inc
                                             lude.props, and then add a list
                                             of tables.

                                        Note: The tables defined in the
                                        svc_files parameter take precedence
                                        over those defined in
                                        svc_include.props. If you defined
                                        tables in both places, the Watched
                                        Tables field lists those defined in
                                        svc_files only.

                                        Note: Feature Tracker can't track the
                                        tables without the sysmodtime,
                                        sysmoduser, and sysmodcount
                                        fields. For example, the codes table
                                        doesn't have these three fields by
                                        default and Feature Tracker can't
                                        track this table. To track the codes
                                        table, you can access Database
                                        Manager and manually add the
                                        sysmodtime, sysmoduser, and
                                        sysmodcount fields.

                                                                                                                 Page 157 of 254

Create a feature or release record

To create a feature or release record, follow these steps:
   1. From the System Navigator, click Tailoring > Feature Tracker > Search Feature
     Tracker. The Search Feature Tracker Records page opens.
   2. Click New on the toolbar.
   3. In the Type drop-down list, select Feature or Release as needed. If you select
     Release, fill a release number in the Release Number field.

                   Note

                If you are working with Feature Tracker for the first time, you must
                create a release first.

   4. Type a title in the Title field, and then click Save.
   5. Fill in the fields as shown below:

       Field                                                                              Service Manager 9.81
       Internal ID
       External ID                      Description
       Type
       Area                             The unique ID of the feature or
       Development Owner                release. The system populates this
       Development Team                 field automatically when creating a
       Status                           new feature or release.

       Release                          Specify the external ID for this
                                        feature in third-party integration. For
This PDF was generated on May 23, 2026  example, ALM or Octane.

                                        The type of this Feature Tracker
                                        record.

                                        Specify the module that the feature
                                        or release relates to. For example,
                                        Incident Management.

                                        Specify the development owner of
                                        the feature or release.

                                        Specify the development team
                                        responsible for the feature or
                                        release.

                                        Specify one of the following statuses
                                        the feature or release is in:

                                             New
                                             Work in progress
                                             Testing
                                             Done
                                             Cancelled
                                             Ready to release

                                        This field relates to the feature type
                                        of a record. Specify which release
                                        the feature belongs to.

                                                                                                                 Page 159 of 254

Field                                   Description
Release Date
Release Manager                         Specify the date of the release.

Test Owner                              Specify the release manager that's
                                        responsible for the release.
Test Team
                                        Specify the test owner of the feature
                                        or release.

                                        Specify the test team responsible for
                                        the feature or release.

   6. Click Save.

View detailed information of a feature record

To view detailed information of a feature record, follow these steps:

   1. From the System Navigator, click Tailoring > Feature Tracker > Search Feature
     Tracker. The Search Feature Tracker Records page opens.

   2. Search for the desired feature record.

   3. Open the feature record by clicking the ID.

   4. You will find detailed information about the feature regarding internal/external ID,
     type, area, current phase, status, and related release.

     You can also click different tabs on the record page to see more detailed
     information as shown below:

Tab                                                                                       Service Manager 9.81
General
                                        Description

                                        This section contains the following
                                        two subsections:

                                             Details

                                             In this subsection, you can
                                             view the information about the
                                             feature title, development
                                             owner, development team, test
                                             owner, and test team.

                                             Comments and Instructions

                                             This subsection includes
                                             comments and instructions
                                             relate to the feature. For
                                             example, manual steps before
                                             or after feature deployment.

       Tab                                                                                Service Manager 9.81
       Objects
                                        Description
This PDF was generated on May 23, 2026
                                        This section contains the following
                                        two subsections that show different
                                        information about changed objects.

                                             All modified objects

                                             This subsection displays a list
                                             of all modified objects with
                                             information about the ID, date,
                                             flag, table, user, tag, feature,
                                             and release. You can filter out
                                             objects in the list by selecting
                                             criteria from the drop-down
                                             boxes of Date > =, Date < =,
                                             Table, User, Feature, and
                                             Release. Click the Filter
                                             Objects icon to apply the filter
                                             criteria, or the Clear Filter
                                             Criteria icon to clear.

                                             To update the list, click Refresh
                                             Objects. To have Feature
                                             Tracker update the list
                                             automatically, see Update the
                                             changed object list
                                             automatically.

                                             To link objects with the feature,
                                             select the objects of your
                                             interest from the list and then
                                             click Link selected objects with
                                             the feature.

                                             Related objects

                                             This subsection displays a list
                                             of modified objects which are
                                             related to the feature, with
                                             information about the ID, Date,
                                             Flag, Table, User, Tag, Feature,

                                                                                                                 Page 162 of 254

Tab                                     Description

                                        Release, and Status. Click
                                        Unlink selected objects from
                                        the feature to remove the
                                        relationship between a
                                        modified object and the
                                        feature. To commit the related
                                        objects, click Commit All
                                        Related Objects.

       Tab                                                                                Service Manager 9.81
       Activities
                                        Description
       Workflow
                                        On this tab, you can enter new
This PDF was generated on May 23, 2026  activity updates, view Journal
                                        Updates, and view history activities
                                        for the record.

                                        Journal Updates tab

                                             New Update Type: Specify or
                                             categorize the activity update.
                                             If you leave this field blank, the
                                             system sets this value to
                                             Developer update by default.

                                             New Update: Enter notes to
                                             explain and describe updates
                                             made for the record.

                                             Journal Updates: View text
                                             entered in the New Update field
                                             along with the operator name
                                             and a timestamp for the
                                             update. This field displays
                                             information when Journaling is
                                             enabled.

                                        Activity Logs tab

                                        View the record's history activities,
                                        including information about
                                        date/time, type, operator, and
                                        description. You can use the Activity
                                        Type and User filters to sort the
                                        history activities.

                                        This section displays a figure of
                                        feature workflow. It also indicates
                                        the current phase that the feature is
                                        in, and traces the phase transition
                                        history.

                                                                                                                 Page 164 of 254

View detailed information of a release record

To view detailed information of a release record, follow these steps:

   1. From the System Navigator, click Tailoring > Feature Tracker > Search Feature
     Tracker. The Search Feature Tracker Records page opens.

   2. Search for the desired release record.
   3. Open the release record by clicking the ID.
   4. You will find detailed information about the release regarding internal/external

     ID, type, current phase/status, release manager, and release date.
     You can also click different tabs on the record page to see more detailed
     information as shown below:

Section                                                                                   Service Manager 9.81
General
                                        Description
Related Features
                                        This tab displays the release title
                                        and description.

                                        This tab displays a list of features
                                        related to the release, with brief
                                        information about ID, external ID,
                                        owner, current phase, status, and
                                        title. To unlink a feature from the
                                        release, open the feature record and
                                        then unlink it by selecting another
                                        release or Unknown from the
                                        Related Release drop-down box.

                                        In addition, you can build a release
                                        or schedule a release by using the
                                        Build Release and Schedule Release
                                        buttons in this section.

       Section                                                                            Service Manager 9.81
       Activities
                                        Description
       Workflow
                                        On this tab, you can enter new
This PDF was generated on May 23, 2026  activity updates, view Journal
                                        Updates, and view history activities
                                        for the record.

                                        Journal Updates tab

                                             New Update Type: Specify or
                                             categorize the activity update.
                                             If you leave this field blank, the
                                             system sets this value to
                                             Developer update by default.

                                             New Update: Enter notes to
                                             explain and describe updates
                                             made for the record.

                                             Journal Updates: View text
                                             entered in the New Update field
                                             along with the operator name
                                             and a timestamp for the
                                             update. This field displays
                                             information when Journaling is
                                             enabled.

                                        Activity Logs tab

                                        View the record's history activities,
                                        including information about
                                        date/time, type, operator, and
                                        description. You can use the Activity
                                        Type and User filters to sort the
                                        history activities.

                                        This tab displays a figure for the
                                        release workflow. It also indicates
                                        the current phase that the release is
                                        in and traces the phase transition
                                        history.

                                                                                                                 Page 167 of 254

Section                                 Description

Documentation                           This tab allows you to create a
                                        document that lists the features and
                                        the modified objects for the release.
                                        Click Create Documentation and
                                        then add some descriptions in the
                                        Documentation column for the
                                        related features. After you build a
                                        release, this documentation is saved
                                        as an HTML file in the specific
                                        release folder. For example, if your
                                        temporary files are saved in C:\
                                        <temp folder>, you can find the C:\
                                        <temp folder>\<release name>\
                                        <release name>.html document after
                                        you build a release.

Update the changed object list automatically

To ensure all modified objects are properly listed and automatically updated in
Feature Tracker, follow these steps.

   1. Make sure you have started the problem processor in the background
     scheduler.

   2. From the System Navigator, click Tailoring > Feature Tracker > Search Feature
     Tracker. The Search Feature Tracker Records page opens.

   3. Search for any feature record and then open it.

   4. From the record details toolbar, click More Actions > Watchdog Schedule. The
     system opens the Watchdog Schedule page.

   5. Click Start Schedule to start the schedule. The system updates the changed
     object list related to this feature automatically in an interval of 60 minutes.

     To stop the schedule, click Stop Schedule.

Commit changes using Feature Tracker

To commit changes using Feature Tracker, follow these steps:

   1. Open the feature record of your interest.


   2. Go to the Related Objects tab.
   3. (Optional) From the All modified objects section, select changed objects as

     needed and then click Link selected objects with the feature.
   4. From the Related objects section, click Commit all related objects.

     After this process completes successfully, the system displays a message that
     may resemble the following:
      Commit <number> item(s) ...

            Note

           Feature Tracker dose doesn't provide any revert code functions. To revert
           code changes, you must manually modify the code back as required and
           then commit the object to the source control repository.

Build releases using Feature Tracker

Feature Tracker allows you to build releases in real-time or a scheduled time.
To build a release using Feature Tracker, follow these steps:

   1. Open the related feature record, and then update the status to Ready to release
     or Done.

   2. Open the release record of your interest, and then update the status to Ready to
     release or Done.

   3. Click the Related Features tab.
   4. Click Build Release to generate a release immediately or Schedule Release to

     generate a release on a scheduled time.
     Build Release
     If you click Build Release, the system displays the following messages:
      prepare release files...
      generate documentation...
      Tag "R<Release Number>_<Timestamp>"created on git@<github.com>:
     <orgnization>/<repo>.git


The last message indicates that a new release is generated with the tag on your
remote GIT repository. You can check the release build by browsing to the Tag
section of the remote repository that's defined for Release Repository URL on
the Globe Settings page. See the following screenshot as an example:

     Schedule Release

     When you click Schedule Release, the Schedule Release Build wizard opens.
     Follow the instructions on the screen to finish the schedule settings including
     start time, end time, and repeat interval.

                   Tip

                Make sure you have started the problem processor in the
                background scheduler.

Deploy releases using Feature Tracker

Feature Tracker allows you to deploy a release on a remote Service Manager.
However, in case you have complex database dictionary records updates, we
recommend you manually perform these updates on the remote Service Manager
instead of using Feature Tracker.


            Caution

           You may need to deploy complex database dictionary records updates
           during a maintenance window as users may get affected and need a
           restart.

To deploy a release using Feature Tracker, follow these steps:

   1. Sign in to your development or staging environment of Service Manager where
     the final release locates. Then, open the respective release record.

   2. Go to the Related Features tab.
   3. Click Deploy Release to deploy the release.

   4. (Optional) In the remote Service Manager system, manually delete the files that
     are deleted from the development Service Manager system using the source
     control code repository. The deletion of files from a source control repository
     isn't applicable to Service Manager.

You can also deploy your releases with external tools, outside of Service Manager. To
do this, follow these steps:

            Caution

           The following procedure overwrites the source codes on the target
           Service Manager server. Before proceeding, you must make sure that the
           target Service Manager server has the same code as the development
           environment.

   1. Clone changed files from the source control repository to the Service Manager
     server where you want to deploy the release, using the command shown below:

     git clone --depth 1 -b <tag> <repo> <temp-folder>

   2. Go to the <Server Dir>/RUN/ directory and then run the following command to
     import the changed files to the remote Service Manager:

     sm -svc_import -svc_rootdir:<directory path> -svc_mode:99 -
     svc_cleanbuild:1
     In case you have database dictionary records updates, run the following
     command to import the changed files to the remote Service Manager:


sm -svc_import -svc_rootdir:<directory path> -svc_mode:99 -
svc_cleanbuild:1 -svc_updatedbdict
In this command, <directory path> refers to the path of the directory where
you clone the changed files in step 1.

      Note

     If the content you deploy contains either the displayoption or
     displayscreen records, you need to manually run the
      us.compile.screens RAD function to refresh the displaycache records.


1.1.9.2.4. Feature Tracker use case

This topic describes a typical use case to leverage Feature Tracker for version control
of Service Manager customization:

   1. Prepare Git.

        1. The system administrator exports all the applications records from Service
           Manager and check in the exported files to a Git server to create a baseline
           repository. For details, see the Prepare a code repository section in the
           Prepare Git topic.

        2. Developers check out the latest version of the applications records and
           import them into a local Service Manager development environment. For
           details, see the Prepare a development environment section in the Prepare
           Git topic.

   2. Prepare Service Manager.

   3. Before performing configurations and using Feature Tracker, make sure an
     operator have the FeatureTrackerCommit and FeatureTrackerReleaseManager
     capability words in the user profile record.

  4. Configure Feature Tracker settings. See the Configure settings to track features
     section in the Using Feature Tracker topic.

   5. Create a release, and then create a feature by using Feature Tracker. For details,
     see the Create a feature or release record section in the Using Feature Tracker
     topic.

   6. Open the feature record, and then relate the feature to a release by selecting the
     release in the Related Release drop-down list.

   7. Developers customize application data records of Service Manager.

   8. Open the feature record and then click the Objects tab to view the modified
     objects. Click the Refresh Objects button to refresh the object list. Select the
     objects of your interest from the list and then click Link selected objects with
     the feature. For details, see the View detailed information of a feature record
     section in the Using Feature Tracker topic.

   9. Committing customization changes to your source control repositories by using
     Feature Tracker. For details, see the Commit changes using Feature Tracker
     section in the Using Feature Tracker topic.

     Operators with commit right to Feature Tracker can check in or discard the
     changes.


10. Developers check the commit in the Git repository and then merge it to the main
    repository.

11. When the feature is ready to release, the release manager can go to the related
    Release record and then build a release by using Feature Tracker. For details,
    see the Build releases using Feature Tracker section in the Using Feature
    Tracker topic.

12. The release manager deploys the desired release on the test Service Manager
    system by using Feature Tracker. For details, see the Deploy releases using
    Feature Tracker section in the Using Feature Tracker topic.

13. The release manager deploys the desired release on the production Service
    Manager system by using Feature Tracker.
````
