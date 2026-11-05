---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.8 .. 1.8.11
printed_pages: 2446-2471
---

# 1.8 System Security

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.8. System Security

Service Manager includes a number of security options you can configure after installation. The following table lists the
security options you can enable or configure from a new development environment installation.

            Tip

           For overall instructions on how to implement your Service Manager environment in a secure manner, see the
           Service Manager Security Guide.


Feature                                 Description                              Default state in new installations
Encryption of configuration file
settings                                A security option that protects values Enabled
Encryption of operator passwords        listed in the configuration file
Inactivity timer
                                        A security option that protects the      Enabled
Lockout feature
                                        passwords listed in operator records
Mandanten file security
                                        A security option that automatically     Enabled
Multicompany mode                       closes user sessions that have been
                                        idle for a specified period of time
Requirements for required SSL           (except for those operators who are
encryption                              on the exception list)
Requirements for required SSL
encryption and client authentication    A security option that automatically     Enabled
                                        disables a user account if the user
Requirements for required SSL           fails to provide the correct password
encryption and trusted clients          after a specified number of attempts

Script utilities                        A security option that filters the data  Disabled
                                        that operators can see when they
Secure Sockets Layer (SSL)              query specific files
encryption
Trusted sign-on                         A security option that filters the       Disabled
                                        company information that service
                                        desk technicians see when creating
                                        service desk interactions and opening
                                        incidents

                                        An implementation option that            Disabled
                                        requires SSL encryptions for all
                                        connections

                                        An implementation option that            Disabled
                                        requires SSL encryptions for all
                                        connections and validates the client's
                                        certificates

                                        An implementation option that            Disabled
                                        requires SSL encryptions for all
                                        connections and restricts connections
                                        to a list of trusted clients

                                        A security option that enables           Disabled
                                        checksum calculation for Service
                                        Manager binaries and data security
                                        deletion.

                                        An implementation option to encrypt      Disabled
                                        communications between your
                                        Service Manager server and clients

                                        An implementation option that enables    Disabled
                                        Service Manager clients to
                                        automatically sign in using the same
                                        authentication information as users
                                        entered when they signed in to their
                                        client workstation's operating system.


Feature                                 Description                            Default state in new installations

Common Access Card (CAC) sign-on        An implementation option that enables  Disabled
                                        Service Manager clients to
                                        automatically sign in using
                                        authentication information from the
                                        user's personal certificate stored in
                                        the user's CAC card.

SAML Single Sign-On                     An implementation option that enables  Disabled
                                        Service Manager clients to sign in to
                                        multiple web applications through
                                        single sign-on based on Security
                                        Assertion Markup Language (SAML)
                                        authentication.

FIPS mode                               A security option that requires data be Disabled
                                        encrypted using the FIPS-compliant
                                        AES encryption algorithm.

Tokenization                            A security option that enables         Enabled
                                        tokenization in the web client to
                                        safeguard sensitive data.

Enhanced query hash algorithm           A security option that enables the     Disabled
                                        enhanced query hash algorithm.

Related topics

Security tables
Generating Web tier URL queries
Upgrade Service Manager


1.8.1. Encryption of configuration file settings

You can encrypt values within the Service Manager configuration file (sm.ini) to protect passwords and authentication
information. The encryption scheme is ideal for connection parameters such as RDBMS or LDAP user names and passwords.
Using a command line utility you can convert any value to an AES256-256-CBC encrypted value. You can then copy the
encrypted value into the configuration file and add an asterisk to the beginning of the parameter name. The asterisk is a
required element that indicates to the server that the parameter value is encrypted.
For example, the unencrypted value:

  sqllogin:rdbmsuser/mypassword

Becomes the following value when encrypted:

  *sqllogin:D51CB23B379C873CBA055FB9A3798375AC93D48BB8AE2CC773D7317E4715EAE7

After you have encrypted a configuration file value there is no way to convert it back to clear text. The Service Manager
server decrypts the value for administrative purposes, but it doesn't save or store the decrypted value.

            Note

           Only use the encryption scheme to encrypt server parameters in the Service Manager configuration file (sm.ini).
           Do not encrypt other values in other files as this may damage your system or cause data loss.

In addition, the values of the following security parameters in the sm.ini file are encrypted automatically during the server
startup. You don't need to encrypt them manually.

     changeencrkey
     upgradeencralg
     encryptionkey
     sqllogin
     ldapbindpass
     smtppassword
     keystorePass
     truststorePass
     ssl_trustedClientsPwd
     idmsigningkey

Encrypt values in the Service Manager configuration file

Applies to User roles: System Administrator
You can use the sm -encrypt command to encrypt parameter values in the sm.ini file. You must have administrative access to
the server operating system to use this procedure.

            Note

           The values of some security parameters are encrypted automatically during the server startup, including the
           sqllogin parameter that's used as the example in the following task.

To encrypt values in the Service Manager configuration file, follow these steps:

   1. Open the Service Manager configuration file (sm.ini).
   2. Copy the parameter name and parameter value you want to encrypt.

     For example, copy sqllogin:RDBMS user/my password .
   3. Open the operating system's command prompt.

     For example, on Windows click Start > Programs > Accessories > Command Prompt.


   4. Change directories to the RUN folder of your Service Manager installation.
     For example:

          cd C:\Program Files\OpenText\Service Manager\Server\RUN

   5. Type the following command:

          sm -encrypt:<parameter name>:<parameter value>

     If the string containing the <parameter name>:<parameter value> includes spaces, you must enclose the entire
     parameter name and value in quotation marks. For example:

          sm -encrypt:"sqllogin:RDBMS user/my password"

                   Tip

                The sqllogin credentials are automatically encrypted and added to the sm.ini file if you configure the
                credentials by running the Server Configuration Utility instead of running this command.

   6. Press Enter.
     Service Manager displays the new encrypted value.
     For example:

          sqllogin:"RDBMS user/my password" is encrypted:
          99E6136711576164187C6619C6DBA9DFFC89F7EDF186BC5827E3615BE8419CD4

   7. Copy the new encrypted value.
   8. Return to the Service Manager configuration file and add an asterisk to the beginning of the parameter name.

     For example:

          *sqllogin:

   9. Replace the clear-text value with the encrypted value.
     For example:

          *sqllogin:99E6136711576164187C6619C6DBA9DFFC89F7EDF186BC5827E3615BE8419CD4

 10. Save the configuration file.

Related topics

System Security


1.8.2. Encryption of operator passwords

The Service Manager server encrypts all operator passwords stored on the database using a SHA512 one-way encryption
process that can't be decrypted. The server automatically encrypts existing passwords on your system the first time they are
accessed. You can also do a mass update of the operator table to convert all passwords at once.

You need to update the SQL mapping for the password field to accept a larger character limit. The data policy settings are as
follows.

Database object                         Requirement
Table                                   operator
Field                                   password
Data type                               VARCHAR
Size                                    136 characters

Automatic operator password encryption replaces the legacy data policy encryption option that was controlled by the
encryptionkey parameter. To convert to the automatic operator password encryption scheme in legacy systems, you must
first turn off the existing data policy encryption. The server updates the password encryption the next time it reads the
operator record.

Service Manager clients use a two-way encryption process (PBE with MD5, DES in non-FIPS mode, and AES in FIPS mode) to
secure operator passwords when communicating with the server. The server decrypts the password sent from the client and
then one-way encrypts it to compare the results to the encrypted value stored in the database. The server never stores the
operator password in an unencrypted form.

If your Service Manager implementation uses LDAP authentication, the server must still send an unencrypted operator
password to the directory service because LDAP servers are unaware of Service Manager's encryption scheme. If you
require encryption between Service Manager and the LDAP server, you can configure OpenSSL or another standard
encryption scheme between the two servers.

Related topics

Lightweight Directory Access Protocol (LDAP)
System Security


1.8.3. Encryption of client keystore passwords

Service Manager supports encryption of keystore passwords in the Windows and web clients.

Windows client

The Windows client keystore password that you enter in Window > Preferences > Service Manager > Security is
automatically encrypted and stored in the following file:
<Your user workspace
dir>\ServiceManager\workspace\.metadata\.plugins\org.eclipse.core.runtime\.settings\com.hp.ov.sm.client.eclipse.base.prefs

Web client

You must enter your web client keystore password in <Webtier>/WEB-INF/webtier.properties file. If you have specified the
customize-folder parameter in the web.xml file, enter your web client keystore password in <Customize-
Folder>/config/webtier.properties (where <Customize-Folder> is the folder specified in the customize-folder parameter).
When the web application server is started, Service Manager changes this value to an encrypted string. The following steps
describe how you set a new or update an existing web client keystore password.
To set a web client keystore password using the <Customize-Folder>, follow these steps:

   1. Make sure the customize-folder parameter is configured in the web tier configuration file (web.xml).
   2. Create a webtier.properties file in the <Customize-Folder>/config directory.

                   Note

                Make sure the web application server has read/write access to this directory.

   3. Open the file in a text editor, and add the following line to the file:
      keystorePassword= < your keystore password in clear text format>

   4. Save and close the file.
   5. Restart the web application server.

Related topics

Encryption of configuration file settings
Encryption of operator passwords


1.8.4. Randomly generated master keys

Service Manager (SM) uses randomly generated master keys to protect local sensitive data (for example, keystore
passwords) of the SM Server, web tier, Windows Client, and Mobility Client.

Service Manager automatically generates a master key at the first startup of each of the following components and writes it
to their corresponding configuration file.

The master keys serve as KEK (Key Encryption Key), which are used to encrypt all the security parameters.

            Important

           The data contained in these files should be considered sensitive. Be sure to take appropriate measures to protect
           these files by ensuring only those users with appropriate access privileges are allowed to access and view the
           contents of these files.

Server                                  Master key parameter  Configuration file
                                        smmasterkey
                                                              For server upgraded from previous
                                                              version: Server\RUN\sm.ini

                                                              To intall, rotate, migrate, or change
                                                              the storage location of
                                                              smmasterkey , see Key management
                                                              for smmasterkey.

Web tier                                masterKey             <customize-
                                                              folder>\config\webtier.properties or
Windows Client                          masterKey             <web tier>\WEB-
Mobility Client                         randomRawKey          INF\webtier.properties

                                                              Where: <customize-folder>
                                                              represents the directory defined in the
                                                              customize-folder parameter.

                                                              %USERPROFILE%\ServiceManager\w
                                                              orkspace\.metadata\.plugins\org.eclip
                                                              se.core.runtime\.settings\com.hp.ov.s
                                                              m.client.eclipse.base.prefs

                                                              <webapp>\WEB-INF\web.properties

        Caution

        Once a master key is generated, don't remove it or change its value, otherwise the Service Manager Server or
        other SM components (for example, the web tier) will not work.

You don't need to change the system-generated master keys; however, if you want the system to generate a new master key
for Web tier, Windows Client, or Mobility Client, perform the following steps:
Note: For Service Manager Server, see Key management for smmasterkey.

   1. Remove the master key parameter from the corresponding configuration file of the SM component.
   2. Reset all encrypted parameter values in the configuration file to clear text.

   3. Restart the Service Manager web application server, Windows Client, or Mobility application server.

     A new master key is automatically generated; the parameter values are encrypted again.


Related topics

Encryption of configuration file settings
Encryption of client keystore passwords


1.8.4.1. Key management for smmasterkey

The master key named smmasterkey serves as a KEK (Key Encryption Key), which is used to encrypt all the security
parameters from the sm.ini file.

The smmasterkey key parameter is generated and stored in a secure position for new installations.

If you need to rotate, migrate, or change the storage location of smmasterkey , follow the instructions below.

Permission control

For security concerns, you may apply the permission control, thus only limited users can manage smmasterkey .

In Linux system, the permission control is automatically configured for smmasterkey .

In Windows system, you need to manually define and grant permission to a group:

   1. Go to Computer Management > Local Users and Groups, create a user group for permission control.
   2. Add users into this group. Make sure that the user who start the Service Manager server must be included in this group.
   3. Go to the %programdata%\OpenText folder, right-click the Service Manager folder, then select Properties.
   4. In the Service Manager Properties window, go to the Security tab, then click Advanced.
   5. In the Advanced Security Settigs for Service Manager window, click Disable inheritance, then select Convert

     inherited permissions into explicit permissions on this objection.
   6. Remove all the existing permission entries in the Permissions tab, then add the group created in step 1.
   7. Sign in to the system as the user of the group with associated permission.

Change the storage location

The smmasterkey key parameter is generated and stored in Server\RUN\sm.ini when you upgrade Service Manager from
previous versions.
The sm -keyrotate:1 command can protect the cryptographic master key (KEK) in a way that is resistant to some of the most
common remote file exfiltration attacks. You may use the sm -keyrotate:1 command to store the master key in a secure
position:

   1. Stop the Service Manager server.
   2. Run the sm -keyrotate:1 command.

     Note that The sm -keyrotate:1 command will also change the value of smmasterkey .
   3. To ensure that the change has take effect, you can check the sm.ini file and verify that the keystorage:1 parameter is

     included.
   4. Start the Service Manager server.
   5. Make sure the Service Manager server is started successfully.

Revert the location change

            Important

           Caution: It is not recommended that you move the smmasterkey back to the the sm.ini file.

If you want to revert this location change, follow these steps:

   1. Stop the Service Manager server.
   2. Run the sm -keyrotate:0 command.

     Note that this command will also change the value of smmasterkey .
   3. To ensure that the change has take effect, you can check the sm.ini file and verify that the smmasterkey parameters

     are included.
   4. Start the Service Manager server.
   5. Make sure the Service Manager server is started successfully.

Rotate the master key

For security concerns, you can rotate the master key on a regular basis:

   1. Stop the Service Manager server.
     Note: In a horizontal scalability (HS) environment, there is no need to stop all nodes on each machine simultaneously.


     You can apply the key rotation on each SM node one by one.
   2. Run the following command to update the value of smmasterkey :

      sm -keyrotate:1
     Note: After the key rotation, it is recommended that you use the sm -keyexport command to export smmasterkey and
     store the key in a secure location.
   3. Start the Service Manager server.
   4. Make sure the Service Manager server is started successfully.

Export the master key

You can use the sm -keyexport command to export the master key. For example, you may use this command to backup your
smmasterkey .

It is recommended that you store the exported key in a secure location.

   1. Run the following command to export the master key:
      sm -keyexport
     The key will be exported to the <RTE installation folder>\RUN directory and will be named as smmasterkey.key .
           If you want to export the key as a specified file, you can run the following command:
            sm -keyexport:"<export directory>\<file name>"
           For example:
            sm -keyexport:"CustomPath\mykey.key"
           Make sure you have read-write permissions to the folder.

Import the master key

When you need to migrate the Service Manager system from one machine to another machine, you can first use the sm -
keyexport command to export the master key, then use the sm -keyimport command to migrate the key to the target
system.

   1. Copy the sm.ini file and then paste the file to the target system.
   2. Copy and paste the exported smmasterkey to the <RTE installation folder>\RUN directory or to a specified location.
   3. Run the following command:

      sm -keyimport
     The key named smmasterkey.key will be imported from the <RTE installation folder>\RUN directory.

           If you want to import a specified key file, you can run the following command:
            sm -keyimport:"<import directory>\<file name>"
           For example:
            sm -keyimport:"CustomPath\mykey.key"
           Make sure you have read-write permissions to the folder.


1.8.5. Inactivity timer

The inactivity timer functionality closes user sessions that have been idle for a specified period of time. This feature is
enabled by default and the time-out value is 30 minutes. System administrators can configure required settings and start or
stop the inactivity timer.

            Note

           You need the SysAdmin capability word to configure and start/stop the inactivity timer.

Configure inactivity timer settings

Administrators can configure required settings at a system level and if needed, also an operator level, as described in the
following table.

            Note

           In a horizontal/vertical scaling environment, you need to configure the inactivity timer settings only once (that is,
           only on any one of your server nodes).

Configuration Level                     Settings                         Notes
Operator Level
                                        Warning Time                     To configure the settings, click
System Level                            Allowed Inactive Time            the Security tab in an operator
                                                                         record.
                                                                         Operator level settings take
                                                                         precedence over system level
                                                                         settings; if an operator record
                                                                         has empty inactivity timer
                                                                         settings, the system level
                                                                         settings are used for the
                                                                         operator.
                                                                         An allowed inactive time of zero
                                                                         (0) means inactivity session
                                                                         timeout will never happen to the
                                                                         operator.
                                                                         A zero or empty warning time
                                                                         means no warning message will
                                                                         display to the operator.

                                        Number of minutes to allow idle  Click System Administration >
                                        user ("allowed inactive time" )  Ongoing Maintenance > System >
                                                                         Start Inactive Timer > Start Inact.
                                        Warn user within <x> minutes of
                                        termination ("warning time" )

                                        DO NOT terminate these users
                                        ("exception list")

The following table is an explanation of the settings described above.

Setting                                                                                           Service Manager 9.81
Allowed inactive time
                                        Description
Warning time                            This is a time limit that users can remain inactive until the
                                        inactivity timer closes their user session.

                                        This is an amount of time between the appearance of a
                                        warning message and the termination of the session.

                                                    Caution

                                                   The warning time should be no greater than the
                                                   allowed inactive time.

Exception list                          This is a list of operators that the inactivity timer ignores.
                                        This list should include all operators that should not be
                                        logged out regardless of the type of license (Named or
                                        Floating license).

When the inactivity timer settings take effect

Operator level settings and system level settings take effect the next time the user logs in.

Start the inactivity timer

Note

Starting with SM9.32, the inactive.startup background process has been deprecated. You no longer need to start
this process in order for the inactivity timer functionality to work.

To enable the inactivity timer functionality for users, start the inactivity timer as follows:

   1. Click System Administration > Ongoing Maintenance > System > Start Inactivity Timer.
     The inactive.setup.g form opens.

  2. Type or select the inactivity timer record information. See Configure inactivity timer settings.
   3. Click Start Inact.

If you want to disable the inactivity timer functionality for all users, you can stop it as follows.

   1. Click System Administration > Ongoing Maintenance > System > Start Inactivity Timer.
     The inactive.setup.g form opens.

   2. Click Stop Inact.
     The Start Inact button is displayed.

After modifying your system level inactivity timer settings, you need to restart the inactivity timer as follows.

   1. Click System Administration > Ongoing Maintenance > System > Start Inactivity Timer.
     The inactive.setup.g form opens.

   2. Modify the settings as needed.
   3. Click Save. Service Manager displays the message: The inactive process has been set up to look for users idle after

     <n> minutes.

Respond to the inactivity warning message

Applies to User Roles: All users
You may receive an inactivity warning message depending on the inactivity timer settings your administrator has configured.
When this happens, you can respond as needed to either time out or extend your session.


The following table describes your actions in the Windows/web client and the corresponding inactivity timer behavior.

Client                                  Warning Message                       Action
Web
                                        A warning message displays in a pop-  Click OK: Your session extends and
                                        up window.                            the inactivity timer restarts counting.
                                                                              Click Cancel, press ESC, or make no
                                                                              response: The inactivity timer
                                                                              continues the counting and terminates
                                                                              your session in the end.

Windows                                 A warning message displays in the     Perform any operation: Your session
                                        toolbar.                              extends and the inactivity timer
                                                                              restarts counting.

                                                                              Make no response: The inactivity
                                                                              timer continues the counting and
                                                                              terminates your session in the end.

Related topics

System Security


1.8.6. Lockout feature

The lockout feature automatically disables a user account if the user fails to provide the correct password after a specified
number of attempts. Your user profile must include the system administration capability word to use this feature.

Enable the user lockout feature

Applies to User roles: System Administrator

The user lockout feature automatically disables a user account if the user fails to provide the correct password after a
specified number of attempts.

            Note

           Enabling the user lockout feature is the only way to restrict access from the Windows client. The Attempts Per
           Login Session settings doesn't affect Windows clients because the Windows client creates a new session for
           each login attempt.

To enable the user lockout feature:

   1. Click System Administration > Base System Configuration > Miscellaneous > System Information Record.
   2. Click the Logon Info tab.
   3. In the Use User Lockout section, select Use User Lockout.
   4. In the Attempts Until Lockout field, type the number of login attempts the user has until Service Manager locks out the

     account.
   5. Select one of the following options:

           Complete Lockout — select this option to deny the user access to Service Manager until a system administrator
           resets the lockout.
           Lock Out Time Period — select this option to deny the user access to Service Manager for a specified period of
           time.
  6. Type the time period in the following format: Dayshours:minutes:seconds. For example, 4 03:02:01 locks out the user for
     4 days, 3 hours, 2 minutes, and 1 second.
   7. Click Save.

Lock out a user

Applies to User Roles: System Administrator

To lock out a user:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select the operator to lock out.
   5. Click the Security tab.
   6. Select the Administrative Lockout option
   7. Click Save.

Reset a locked out user

Applies to User Roles: System Administrator

To reset a locked out user:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select the operator record.
   5. Click the Security tab.
   6. Click More or the More Actions icon, and then select User Lockout Reset.
   7. Click Save.


Service Manager unlocks the user’s operator record and clears the Failed Login Count, Locked Until, and User has been
Locked? fields.

View a user’s lockout history

Applies to User Roles: System Administrator

To view a user's lockout history

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Click Search.
   3. Select the operator record to view.
   4. Click the Security tab.

View system level user lockout history

If a system administrator has enabled the Use User Lockout feature in the System Information Record, a user may be locked
out for several reasons. For example, the user has attempted to log in with an invalid password more than the number of
times defined by the system administrator or the user is locked out by the system administrator.

A specific user's lockout status in displayed in the Security tab of the user's operator record. When a user is locked out, the
User has been locked out option is selected and the Lockout Reason field displays the reason (for example, Max Failed
Logins).

At the system level, the lockout history of all users is stored in the operatorlockhistory table in the database. To view system
level user lockout history, use either of the following ways:

     Open Database Manager, enter operatorlockhistory in the Table field and then click the Search button.
     Navigate to Miscellaneous > Dashboard and then open the License Overview dashboard. If the "Operator Lockout
     History within 7 days" report is not displayed on the dashboard, click Add Content and then click License to add this
     report to the dashboard. This report uses the operatorlockhistory table as the data source.

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
System quiesce: Login restrictions


1.8.7. System quiesce: Login restrictions

Quiesce mode sets login restrictions to prevent users from logging on to Service Manager processes. This gives System
Administrators a way to stop users from logging on to Service Manager processes, and wait for existing users to gracefully
log off before starting system maintenance or testing tailoring activities.

There are three levels of login restrictions. Quiesce level 1 restricts all users, except System Administrators, from logging on
to Service Manager processes. Quiesce level 2 restricts all users from logging on to Service Manager processes. Quiesce
level 0 (zero) sets Service Manager processes to allow user logins. In the vertical scaled or horizontal scaled environment,
Service Manager load balancer doesn't forward any client connection requests to Service Manager processes that are in
quiesce level 1 or 2. If System Administrators want to connect to a Service Manager process in quiesce level 1, they must
connect directly to the Service Manager process without connecting through Service Manager load balancer.

Quiesce mode information is stored in the shared memory. When a Service Manager process sets a quiesce level in the
shared memory, all other Service Manager processes that read from the same shared memory have the same quiesce level.
So if one Service Manager process sets a quiesce level on a host, all Service Manager processes have the same level of
quiesce on that host. In a horizontal scaled environment, the "-host:<host name or IP>" or "-group" option can be used with
the "sm -quiesce:<quiesce level>" command. The "sm -quiesce:<1 or 2 or 0> -group" command sets the quiesce level to all
Service Manager processes on all hosts within the horizontal scaled group.

In a vertical scaled environment when Service Manager processes are running and you issue the "sm -quiesce:1" or "sm -
quiesce:2" command, all Service Manager processes on the local host are set to quiesce level 1 or quiesce level 2,
respectively. The Service Manager load balancer stops forwarding any new client connection requests to the Service
Manager processes, since they are quiesced. If any user tries to connect to Service Manager load balancer at this point, the
user receives a message that states "max session exceed" from the load balancer, as there are no available Service Manager
processes. Existing users on the system aren't affected. However, once existing users log off, they can't log back on until
after the System Administrator changes the quiesce level back to 0 (zero). Once all users have logged off the system, the
System Administrator can perform system maintenance. When system maintenance is complete, the System Administrator
can issue the "sm -quiesce:0" command to set the quiesce level back to 0, so there are no login restrictions to all Service
Manager processes. All Service Manager processes now accept user logins and Service Manager load balancer forwards
client connection requests to these Service Manager processes.

In a horizontal scaled environment, assume there are two hosts in the horizontal scaled group, Host A and Host B. While the
system is running, System Administrators can quiesce Host A for maintenance and keep Host B running by issuing the
command "sm -quiesce:<1 or 2> -host:<Host A name or IP address>" on either Host A or Host B. Service Manager load
balancer then forwards all client requests to Host B, as all Service Manager processes on Host A are quiesced. Existing users
on Host A aren't affected until they log off. If users try to log back on, Service Manager load balancer redirects their
connection requests to Host B. After maintenance is complete on Host A, the System Administrator issues the command "sm
-quiesce:0 -host:<Host A name or IP address>" to bring Host A back to service. This way the System Administrator can
maintain one of the hosts in a horizontal scaled group and avoid down time. The System Administrator can also quiesce all
Service Manager processes in the group by issuing the "sm -quiesce:<1 or 2> -group" command. When the maintenance is
complete, the System Administrator can then set all Service Manager processes in the group back to non-quiesce mode by
issuing the "sm -quiesce:0 -group" command.

A System Administrator can restrict logins to Service Manager using the system.quiesce application. System maintenance
tasks include the following:

     Upgrading from one version of Service Manager to another
     Tailoring forms, tables, or format controls

The system.quiesce application provides three levels of login restrictions:


Restriction level                       Description
Level 0
Level 1                                 Service Manager has no login restrictions and accepts all
                                        logins normally.
Level 2
                                        Service Manager restricts login to operators who have the
                                        SysAdmin capability word. Service Manager denies login to
                                        all other operators and displays the message:

                                        System quiesced, you can't login at this time.

                                        When you issue sm -quiesce:1 -group on a primary or
                                        secondary host, all Service Manager processes (except
                                        Service Manager load balancer) are set to quiesce mode 1.
                                        Service Manager load balancer updates its available node
                                        list to 0. If users try to connect to Service Manager load
                                        balancer at this time, they receive the following message,
                                        since there are no available Service Manager processes.

                                        Max session exceeded.

                                        Service Manager denies login to all operators and displays
                                        the message:

                                        System quiesced, login restricted at this time.

Note: A quiesced system restricts new login attempts only. Currently logged on users can continue working until they log off.

Enable logging of user access

Applies to User Roles: System Administrator

If you enable system logging of user access, Service Manager records the time and user ID each time an operator logs on or
logs off.

To enable logging of user access:

   1. Click System Administration > Base System Configuration > Miscellaneous > System Information Record.
   2. On the General tab, select the Syslog Audit option.
   3. Click Save.

Enable login restrictions

Applies to User Roles: System Administrator

To enable login restrictions:

   1. Click System Administration > Ongoing Maintenance > System > Connection Restrictions.
   2. Click one of the following options:

           Set Level 0 — No login restrictions
           Set Level 1 — Only system administrators can log in
           Set Level 2 — No operators can login
     Service Manager displays the current access level.

Disable login restrictions

Applies to User Roles: System Administrator

To disable login restrictions:

   1. Click System Administration > Ongoing Maintenance > System > Connection Restrictions.
   2. Click Set Level 0.


Enable tracking of operator times

Applies to User roles: System Administrator

You can track how long each operator edits an Incident record by enabling a tracking option in the Incident Management
environment.

To enable tracking of operator times:

   1. Click System Administration > Ongoing Maintenance > Environment Records > Incident Management Environment.
   2. Select the Track Operator Times? checkbox.
   3. Click Save.

Enable tracking of operator times

Applies to User roles: System Administrator

You can track how long each operator edits an Incident record by enabling a tracking option in the Incident Management
environment.

To enable tracking of operator times:

   1. Click System Administration > Ongoing Maintenance > Environment Records > Incident Management Environment.
   2. Select the Track Operator Times? checkbox.
   3. Click Save.

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


1.8.8. Mandanten file security

Mandanten is an optional file security feature that filters the data that operators can see when they query specific files.
Rather than having access to all the records in a file, operators who are members of a security group see only the records
that meet the specific filtering criteria of their group. The system administrator defines the filtering conditions when creating
a security group. The system administrator decides which operators belong to particular security groups and can assign
operators to any number of security groups. Operators who are members of multiple security groups see only the records
that match all their separate filtering conditions.

At login, Service Manager reads the operator record to determine the security groups of which the operator is a member and
uses this information to determine the files to which the operator has limited access. When an operator queries a restricted
file, Service Manager reads the security group records to determine the filtering conditions to apply to the query. Service
Manager then returns only those records that match the filtering conditions in the security group records.

Unlike Format Control, which provides security at the application layer, Mandanten secures files at the database layer. Any file
that a system administrator restricts from an operator with Mandanten always uses the filtering conditions regardless of the
operator’s user role and application profile. Only operators who aren't members of any security group can have unrestricted
access to files protected by Mandanten.

Typically, a system administrator enables Mandanten file security in a multi-company environment where each company
wants to ensure that only their users see the data relevant to their business. However, system administrators can also use
Mandanten to conceal department records selectively within an organization. For example, a system administrator could
create two filtering conditions for an operations and finance department that allow the operations personnel to see their own
Incident records and devices but not those belonging to the finance department.

            Note

           The users created in Service Manager by default don't belong to any security group and by default have access
           to all records of users from other groups. Hence, you shouldn't use users of this type. By selecting or creating
           users of this type, you are disabling or bypassing Mandanten security features, thereby exposing the system to
           increased security risks. By using this option, you understand and agree to assume all associated risks and hold
           the company harmless for the same.

Setting filtering conditions

To enable Mandanten file security, a system administrator must create records in two files:

     scsecuritygroup — The system administrator uses this file to define the security group name and the field values to be
     used as the filtering condition.
     scmandant — The system administrator uses this file to define the Service Manager file to be protected and the field to
     be read for the filtering condition. The field defined in this file is referred to as the Mandant field. You can only define
     one Mandant field for each file you want to protect, although the Mandant field can contain an array of values. The
     Mandant field you chose must be defined either in the file you want to protect or by a virtual join in another file.

System administrators can define additional filtering conditions on fields other than the Mandant field. These additional
filtering conditions are referred to as restricting queries because they further restrict the data that an operator can access. To
define a restricting query, a system administrator must create a record in the scaccess file.

Restrictions

     When you execute triggers, Mandanten security will be disabled.
     You can't enable Mandanten file protection on the following shared system files:

           code
           datadict
           dbdict
           environment
           format
           formatctrl
           link
           menu
           operator


           tzfile

Add a restricting query to a security group

Applies to User roles: System Administrator

Note: You must have the SysAdmin capability word to use this procedure.

You can add a restricting query to a security group to further limit the data that operators can see when they query a
Mandanten protected file. To add a restricting query to a security group:

   1. Click Tailoring > Database Manager.
     The Database Manager form (format.prompt.db.g) opens.

   2. In the Form field, type scaccess.
   3. Click Search.

     The Mandanten Restricting Query form (scaccess.g) opens.
   4. In the File Name field, type or select the name of the Mandanten protected file you want to further restrict.
   5. In the Security Group ID field, type the name of the security group that you want to further restrict.

   6. In the Restricting Query field, type the SQL query you want to use to further restrict the data operators can access

     Note: Typically, this query is of the format field="value".

   7. Click Add. Service Manager displays the message: scaccess record added .

Create a security group

Applies to User roles: System Administrator

Note: You must have the SysAdmin capability word to use this procedure.

You must create a security group to enable the Mandanten file security feature. To create a security group:

   1. Click Tailoring > Database Manager. The Database Manager form (format.prompt.db.g) opens.

   1. In the Form field, type scsecurity.
   2. Click Search. The Mandanten Security Groups form (scsecuritygroup.g) opens.
   3. In the Security ID field, type the name of your new security group.
   4. In the Include Value List array, type the Mandanten field values that you want to use to grant access to the security

     group.
   5. In the Exclude Value List array, type the Mandanten field values that you want to use to deny access to the security

     group.
   6. Click Add.

     Service Manager displays the message:
      scsecuritygroup record added.

Define the Mandant field for a security group

Applies to User roles: System Administrator

Note: You must have the SysAdmin capability word to use this procedure.

You must define the Mandant field to enable the Mandanten file security feature.

To define the Mandant field for a security group:

   1. Click Tailoring > Database Manager.
     The Database Manager form (format.prompt.db.g) opens.

   2. In the Form field, type scmandant.g.
   3. Click Search.

     The Mandanten Field Restriction form (scmandant.g) opens.
   4. In the File Name field, type or select the name of the file you want to protect.

   5. In the Mandant Field Name field, type the name of the field you want Service Manager to read when it checks whether
     an operator meets the filtering conditions.

     Note: This field must either be defined in the file you select or be defined in another file as a virtual join.


   6. If the Mandant field is a virtual join field, type the following additional information:
           In the Linkage Field Name field, type the name of the field that stores the virtual join reference.
           In the Source File Name field, type the name of the external file that contains the Mandant field.

           In the Source Field Name field, type the name of the external field that stores the Mandant field values you want
           Service Manager to read when it checks whether an operator meets the filtering conditions.

           Note: If the source field contains an array of values, then Service Manager will search the array for valid filtering
           conditions. If any one of the filtering conditions is met, then the operator will have access to the file.

           In the Exclude Field field, type any values that you want Service Manager to exclude from queries against the
           Mandant field.
   7. Click Add. Service Manager displays the message: scmandant record added.

Enable Mandanten security on a file

Applies to User roles: System Administrator

Note: You must have the SysAdmin capability word to use this procedure.

To enable Mandanten security on a file:

   1. Create a security group to define the filtering conditions you want to use on the protected file.
   2. Define the Mandant field that you want Service Manager to read when it checks whether an operator meets the filtering

     conditions.
   3. Add any restricting queries you want to add to the security group.

     Restricting queries further restricts the data that operators in the security group can access.

   4. Assign operators to security groups that match the data you want them to access.

     Note: If the system administrator doesn't assign an operator to a security group, then that operator can see an
     unfiltered view of all the files to which the operator's user role and application profile permit access.

Related topics

System Security


1.8.9. Multicompany mode

You can run Service Manager in multicompany mode to filter the company information that service desk technicians see
when creating service desk interactions and opening incidents. Normally, support desk technicians can see information about
all the companies that the service desk supports. However, when a system administrator enables multi-company mode,
service desk technicians only see information relevant to the company they are currently supporting.
For additional data security, you can enable the Mandanten feature.

Enable multicompany mode

Applies to User Roles: System Administrator
You must have the SysAdmin capability word to use this procedure.
To enable multicompany mode:

   1. Click System Administration > Base System Configuration > Miscellaneous > System Information Record.
   2. On the General tab, select the Run in Multi-Company Mode option.
   3. Click Save.

     Service Manager displays the message:
      Information record updated.

Related topics

Mandanten file security


1.8.10. Script utilities

Service Manager includes two new scripts:
     smfsdel.bat
     Provides a mechanism to securely delete files from the file system on which you have installed Service Manager.
     smfchecksum.bat
     Provides a mechanism to verify the Service Manager binaries.

These scripts were created to meet the Federal Service for Technical and Export Control (FSTEC) certification as per the
government regulations of Russia. These two scripts are packaged together with Service Manager. Most customers will have
no reason to run these scripts but you can run them freely as you like.
For more information about these two scripts and how to use them, see Scripts for FSTEC Certification on Service Manager.

Related topics

System Security


1.8.11. Security tables

Service Manager applications contain built-in security that enables an administrator to define the rights for individual users
(operators). For example, some users may have the right to open a call report or incident, but not to close a call report or
incident.

Related topics

Application profiles
Capability word model
License tracking
User roles
````
