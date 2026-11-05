---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.7 .. 1.7.3
printed_pages: 1413-1448
---

# 1.7 Operations Orchestration (OO)

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7. Operations Orchestration (OO)

Operations Orchestration (OO) software automates simple tasks, such as auto archiving, and
complex tasks, such as disaster recovery planning. It provides the means to automate
processes that include managing and provisioning a virtual infrastructure. The OO flows
communicate and document procedures, decreasing dependencies on individuals or groups.
Refer to the Operations Orchestration (OO) documentation for more information.

When integrated with Service Manager, OO shares information between monitoring and
automation systems and the help desk.

     Web client users have access to OO flows from Knowledge Management, where they can
     view, add, update, or delete OO flows.
     Incident Management processes are enhanced by linking Knowledge documents with OO
     flows
     Implement automated deployment of changes by linking OO flows to change records.
     Perform automated implementation of change tasks by linking OO flows to change task
     records.
     Implement automated fulfillment of request tasks by linking OO flows to request task
     records.

Prerequisites:

     System Administrators must add, configure, and enable an instance of this integration in
     Integration Manager (SMIS).
     Secure Sockets Layer (SSL) is advisable for communication between the servers.
     Optionally, you can use Lightweight Single Sign-On (LW-SSO) to bypass the sign in
     prompts.

Related topics

     Integration Manager
     Operations Orchestration integration setup
     Automated resolution of incidents
     Automated deployment of changes
     Add an Operations Orchestration integration
     Enable LW-SSO for the Operations Orchestration integration
     Enable SSL connection from Service Manager to Operations Orchestration
     Manage OO flows from Knowledge Management
     Add OO flow links to a knowledge document
     Remove OO flow links from a knowledge document
     Launch OO flows from an incident
     View OO flow execution results from an incident
     Add OO flow links to a new change record
     Add OO flow links to an existing change record
     Remove OO flow links from a change record


Update OO flow links in a change record
Manually launch change flows
Automatically launch change flows upon approval
Automatically launch change flows on a schedule (for an existing change)
Automatically launch change flows on a schedule (for an existing change)
View execution results of change flows


1.7.1. Operations Orchestration integration
setup

To set up the OO integration in your environment, you need to complete the following tasks:

     Add an Operations Orchestration integration

     This task adds and enables an OO integration in the Integration Manager (SMIS). It
     specifies all parameter values required to set up the integration.

     Enable SSL connection from Service Manager to Operations Orchestration

     This task enables SSL connection between the Service Manager and OO servers. The
     Service Manager server acts as a trusted client connecting to the OO server. This task
     creates a root CA and self-signed certificate in the OO server and then imports them into
     Service Manager.

     Enable LW-SSO for the Operations Orchestration integration

     This task is optional but strongly recommended. Enabling LW-SSO for the integration
     allows Service Manager users to bypass the sign in prompts when viewing OO flow
     execution results from within Service Manager.

Note that configuring Service Manager web service integrations in a network environment
using a firewall or proxy server requires additional configuration. For details, see Web Services
with a proxy server.

Related topics

     Integration Manager
     Operations Orchestration (OO)
     Add an Operations Orchestration integration
     Manage OO flows from Knowledge Management
     Add OO flow links to a knowledge document
     Remove OO flow links from a knowledge document
     Launch OO flows from an incident
     View OO flow execution results from an incident
     Add OO flow links to a new change record
     Add OO flow links to an existing change record
     Remove OO flow links from a change record
     Update OO flow links in a change record
     Manually launch change flows
     Automatically launch change flows upon approval
     Automatically launch change flows on a schedule (for an existing change)
     Automatically launch change flows on a schedule (for an existing change)
     View execution results of change flows


1.7.1.1. Add an Operations Orchestration
integration

Applies to User roles: System Administrator
To use the Service Manager to OO integration, you must add and enable an instance of this
integration in Integration Manager. Optionally, you can enable Lightweight Single Sign-On (LW-
SSO) in OO and in Service Manager to bypass the log-in prompts.
To add and enable a Service Manager to OO integration instance:

   1. Sign in to the Service Manager Windows or Web client.
   2. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   3. Click Add. The Integration Template Selection wizard opens.
   4. Select SMOO from the Integration Template list. Ignore the Import Mapping checkbox,

     which has no effect on this integration.
   5. Click Next. The Integration Instance Information page opens.
   6. Complete the following fields as necessary.


Field                                   Value                       Description
Name (required)
Version (required)                      User-defined.               Name of the integration
Interval Time (s)                       Default: SMOO .             instance.
(required)
                                        1.1                         Version number of the
Max Retry Times
(required)                                                          integration.

SM Server                               User-defined. For           Polling interval (in
                                        example: 600 .              seconds) for Operations
Endpoint Server                                                     Orchestration flow
                                                                    synchronization.
Log Level (required)
                                        Enter 0 (zero) for this     Maximum allowed number
                                        field.                      of retries if the
                                                                    background scheduler
                                                                    fails to run. SMOO doesn't
                                                                    use this value.

                                        Enter a name that           Display name for your
                                        identifies your Service     Service Manager server
                                        Manager server host. For    host.
                                        example, sm_host1 .

                                        Enter a name that           Display name for your
                                        identifies your Operations  Operations Orchestration
                                        Orchestration server host.  server host.
                                        For example, oo_host1 .

                                        Select a level from the     Level of diagnostic
                                        drop-down list.             information that the
                                        Default: INFO .             Service Manager server
                                                                    logs to the log file
                                                                    directory. The possible log
                                                                    levels are: DEBUG, INFO
                                                                    (default), WARNING,
                                                                    ERROR, and OFF.


Field                                   Value                     Description

Log File Directory                      Specify a directory. For  This is a directory that
(required)                              example: c: \smoologs .   exists on the Service
                                                                  Manager server host
                                                                  where log files of the
                                                                  Service Manager to OO
                                                                  integration are stored. The
                                                                  log files are generated in
                                                                  the following
                                                                  format: SMOO-<yyyy>
                                                                  <mm><dd>.log (for
                                                                  example, SMOO-
                                                                  20100328.log )

                                                                              Note

                                                                             Note: If you
                                                                             specify a
                                                                             directory that
                                                                             doesn't exist,
                                                                             the log files
                                                                             will get lost; if
                                                                             you don't
                                                                             specify a
                                                                             directory, the
                                                                             Service
                                                                             Manager to
                                                                             OO integration
                                                                             will not work.

Run at system startup                   Selected/not selected     Automatically
Description                                                       enable/disable the
                                        Operations Orchestration  integration instance when
                                        flows linked to Service   the Service Manager
                                        Manager.                  server is started.

                                                                  Description of the
                                                                  integration instance.

7. Click Next. The Integration Instance Parameters page opens.


8. Click the General Parameters and Secure Parameters tabs, and modify the parameter
  values as shown in the table below:


Parameter                               Value                       Example
oo.server.url
                                        Server address of           https://oo.microfocus.co
                                        Operations Orchestration    m:8443
                                        Central: https://[serverna
                                        me]:[port] . Note that                  Note
                                        [servername] should be
                                        the fully qualified domain             If you are
                                        name (FQDN) of the                     using OO 10.x,
                                        Operations Orchestration               mark the
                                        server host.                           Enable
                                                                               Authenticatio
                                                    Note                       n checkbox to
                                                                               ensure the
                                                   SSL is                      integration API
                                                   recommended                 can pass the
                                                   for                         authentication
                                                   communicatio                .
                                                   n between the
                                                   servers.


Parameter                               Value                      Example
oo.user.name
                                        User name of the           admin
                                        Operations Orchestration   or
                                        user account that the      Internal\admin
                                        Service Manager server
                                        uses to access Operations
                                        Orchestration Central to
                                        synchronize and launch
                                        OO flows.

                                               Note

                                               If you use
                                               domain user
                                               accounts to
                                               sign in to OO,
                                               you need to
                                               specify a
                                               domain user
                                               account by
                                               using the
                                               DOMAIN\user
                                               name format
                                               (for example,
                                               Internal\admin
                                               ).
                                               Otherwise, Se
                                               rvice Manager
                                               will fail to
                                               connect to the
                                               OO server.


Parameter                               Value                       Example

oo.password                                         Note
basepath.delimiter
basepath                                           For security
                                                   reason, we
Accept-Language                                    recommend
http.conn.timeout                                  that you only
http.rec.timeout                                   grant the
                                                   necessary
                                                   rights to the
                                                   user account
                                                   that's used in
                                                   the
                                                   integration.

                                        Password of                   admin
                                        oo.user.name.

                                        Delimiter between multiple ;
                                        basepaths. The default
                                        delimiter is a semicolon
                                        (;).

                                        basepath1;bathpath2;...     /Library/ITIL/Change
                                                                    Management;/Library/
                                        The paths are separated     ITIL/Incident Management
                                        by the basepath delimiter.
                                        Only the OO flows under
                                        the basepath and its sub-
                                        folders will be
                                        synchronized from OO.

                                        REST Request Language en
                                        Setting

                                        Http Connection Timeout 30
                                        setting (seconds)

                                        Http Receive Timeout        30

                                        setting (seconds)


Parameter                               Value                           Example
OOKM
                                        Set to true/false to            true or false
OOCM                                    enable/disable the
                                        visibility of this integration
                                        instance in Knowledge
                                        Management (default:
                                        true).

                                        Set to true/false to            true or false
                                        enable/disable the
                                        visibility of the OO
                                        integration instance in
                                        Change Management
                                        (default: true).

   9. Click Next twice and then click Finish. Leave the Integration Instance Mapping and
     Integration Instance Fields settings blank. This integration doesn't use these settings.

     Service Manager creates the instance. You can edit, enable, disable, or delete it in
     Integration Manager.

 10. Enable the integration instance.

 11. (Optional) Configure LW-SSO in Operations Orchestration and configure LW-SSO in
     Service Manager.

Related topics

Integration Manager
Integration Instance Information fields
Enable SSL connection from Service Manager to Operations Orchestration
Operations Orchestration (OO)
Operations Orchestration flow synchronization rules
Enable LW-SSO for the Operations Orchestration integration
Configure LW-SSO in the Service Manager Web tier
Enable or disable an integration instance
Monitor integration instance status


1.7.1.2. Enable SSL connection from Service
Manager to Operations Orchestration

Applies to User roles: System Administrator

The Service Manager to OO integration requires that Secure Sockets Layer (SSL) be enabled in
the Operations Orchestration and Service Manager servers to ensure data security. Before
using this integration, you must complete the following procedures:

   1. Configure SSL in Operations Orchestration.
   2. Configure SSL in Service Manager.

            Note

                The following procedures are provided as examples, assuming that you have
                not changed the security configurations of Operations Orchestration and
                Service Manager since they were installed. You may need to adjust the
                procedures depending on your specific security configurations in Operations
                Orchestration and Service Manager.
                To perform the following procedures, you must have OpenSSL installed on
                your Operations Orchestration Central host. In addition, you must have a Java
                platform installed on the Operations Orchestration and Service Manager
                hosts.
                In the following procedures, <OO_HOME> represents the Operations
                Orchestration home directory, and <SM_HOME> represents the Service
                Manager home directory.

Configure SSL in Operations Orchestration

Configure SSL in Operations Orchestration 9.x

To configure SSL in Operations Orchestration 9.x, perform the following tasks.

Task 1: Back up keystores in Operations Orchestration

Before you start configuring SSL in Operations Orchestration, make a backup copy of existing
keystores (if any) in the following directories:

     <OO_HOME>\Central\conf
     <OO_HOME>\RAS\Java\Default\webapp\conf
     <OO_HOME>\Scheduler\conf
     <OO_HOME>\Studio\conf


            Note

           If your Operations Orchestration system doesn't contain any keystores in these
           folders, skip this task.

Task 2: Configure SSL in Operations Orchestration Central
You can use any pair of public/private certificates based on your specific certificate
requirements, security policies, and so on. This section provides an example of using OpenSSL
and the standard Java keytool to generate a self-signed certificate.
To configure SSL in Operations Orchestration Central:

   1. Stop the RSCentral, RSScheduler and RSJRAS services.
   2. Generate a private/public key pair for Root Certificate Authority.

        1. Change to the following directory: <OO_HOME>\Central\conf .
        2. Run the following command to create the private key:

            openssl genrsa -aes256 -out <RSA_private_key_file> 2048
           For example: openssl genrsa -aes256 -out cakey.pem 2048
        3. When prompted, enter a password phrase you want to use to protect your
           authority's private key file ( cakey.pem ). For example, CAKeyPassword .

                         Note

                      Remember this password phrase. You will be asked to enter it again later
                      when you use the Java keytool to generate a request (see step 3).

        4. Run the following command to create the public key:
            openssl req -new -key <RSA_private_key_file> -x509 -days 1095 -out
           mycacert.pem
           For example, openssl req -new -key cakey.pem -x509 -days 1095 -out
           mycacert.pem .

        5. Enter other required information that will be incorporated into your certificate
           request.

                         Note

                      To create a unique .pem file, provide a unique Organization Name (for
                      example, org1 ). When asked for a Common Name, enter the fully
                      qualified domain name (FQDN) of the Operations Orchestration host.


3. Use the Java keytool to generate a request.

     1. Run the following command:
         keytool -genkey -keyalg RSA -alias sm -keystore rc_keystore -storepass <store
        password for rc_keystore> -keypass <key password for rc_keystore> -dname "CN=
        <OO_server_FQDN>, OU=<Organization Unit>, O=<Organization>, L=<Location>,
        ST=<State or Province>,C=<Country>"
        For example: keytool -genkey -keyalg RSA -alias sm -keystore rc_keystore -
        storepass bran507025 -keypass bran507025 -dname "CN=
        <hostname.domainname>, OU=MyOrganizationUnit, O=MyCompany, L=MyCity,
        ST=MyState,C=MyCountry"

                      Note

                   The default value for both <store password for rc_keystore> and <key
                   password for rc_keystore> is: bran507025.

                      Note

                   We recommend that the keyalg parameter uses a value of RSA rather
                   than the default of DSA . Doing so allows your TLS communications to
                   use the stronger ECDHE cipher suites which aren't vulnerable to Logjam
                   attacks (CVE-2015-4000).

     2. Run the following command:

         keytool -certreq -keystore rc_keystore -alias sm -storepass <store password for
        rc_keystore> -file <CRS file>
        For example: keytool -certreq -keystore rc_keystore -alias sm -storepass
        bran507025 -file req.crs
     3. Run the following command:
         openssl x509 -req -days 1095 -in <CRS file> -CA mycacert.pem -CAkey
        <RSA_private_key_file> -CAcreateserial -out smcert.pem
        For example, openssl x509 -req -days 1095 -in req.crs -CA mycacert.pem -CAkey
        cakey.pem -CAcreateserial -out smcert.pem
     4. When prompted, type the password phrase you entered in step 2 to protect your
        authority's private key file ( cakey.pem ). For example, CAKeyPassword .
4. Import the root CA and self-signed certificate to rc_keystore .
     1. Run the following command:


            keytool -import -v -alias rootca -keystore rc_keystore -storepass <store password
           for rc_keystore> -file mycacert.pem

           For example: keytool -import -v -alias rootca -keystore rc_keystore -storepass
           bran507025 -file mycacert.pem

           The command window prompts the certificate information, such as Owner, Issuer,
           Serial number, Valid period, Certificate fingerprints, and Extensions.

        2. When you are prompted to confirm that this certificate should be trusted, type: y .

           The command window prompts: "Certificate was added to keystore".

        3. Run the following command:

            keytool -import -v -alias sm -keystore rc_keystore -storepass <store password for
           rc_keystore> -file smcert.pem

           For example: keytool -import -v -alias sm -keystore rc_keystore -storepass
           bran507025 -file smcert.pem

           The command window prompts: "Certificate reply was installed in keystore".

Task 3: Configure SSL in Operations Orchestration RAS

   1. Change to the following directory: <OO_HOME>\RAS\Java\Default\webapp\conf\ .
   2. Copy the generated root CA mycacert.pem and self-signed certificate smcert.pem

     from <OO_HOME>\Central\conf to the current directory.
   3. Import the root CA mycacert.pem and self-signed certificate smcert.pem to

      ras_keystore.jks . See step 4 in Configure SSL in Operations Orchestration Central.

Task 4: Configure SSL in Operations Orchestration Scheduler

   1. Change to the following directory: <OO_HOME>\Scheduler\conf\ .
   2. Copy the generated root CA mycacert.pem and self-signed certificate smcert.pem

     from <OO_HOME>\Central\conf to the current directory.
   3. Import the root CA mycacert.pem and self-signed certificate smcert.pem to

      rc_keystore . See step 4 in Configure SSL in Operations Orchestration Central.

Task 5: Start the Operations Orchestration services

Start the RSCentral, RSScheduler and RSJRAS services.

Task 6: Configure SSL in Operations Orchestration Studio

   1. Change to the following directory: <OO_HOME>\Studio\conf\.
   2. Copy the generated root CA mycacert.pem and self-signed certificate smcert.pem from

     <OO_HOME>\Central\conf to the current directory.
   3. Import the root CA mycacert.pem and self-signed certificate smcert.pem to rc_keystore.

     See step 4 in Configure SSL in Operations Orchestration Central.


Configure SSL in Operations Orchestration 10.x

To configure SSL in Operations Orchestration 10.x, perform the following tasks.

Task 1: Configure Central SSL Server Certificate with FQDN

You can generate a self-signed certificate using the Keytool utility.

  1. Stop Central and back up the original key.store file, located in <installation
     dir>/central/var/security/key.store.

  2. Open a command line in <installation dir>/central/var/security.

   3. Delete the existing server certificate from the Central key.store file, using the following
     command:

      keytool -delete -alias tomcat -keystore key.store -storepass changeit

   4. Generate a self-signed certificate, using the following command:

      keytool -genkey -alias tomcat -keyalg RSA -keypass changeit -keystore
     <path/for/new/Keystore> -storepass changeit -storetype pkcs12 -dname "CN=
     <CENTRAL_FQDN>, OU=<ORGANIZATION_UNIT>, O=<ORGANIZATION>, L=
     <LOCALITY>, C=<COUNTRY>"

                   Note

                If you don't enter a path for generating the new keystore, it is created in the
                folder where you entered the command, for example <installation
                dir>/central/var/security.

   5. Import the self-signed certificate to the Central key.store file, using the following
     command:

      keytool -v -importkeystore -srckeystore new/path/created/Keystore -srcstoretype
     PKCS12 -srcstorepass changeit -destkeystore .key.store -deststoretype JKS -
     deststorepass changeit

   6. Start Central.

Task 2: Configure SSL on OO Central

   1. Stop the Operations Orchestration Central service.
   2. Search for the keytool.exe file installed on your machine and append its location to the

     Path variable in your system environment.
  3. Open a command line in <installation dir>/central/var/security.

   4. Run the following command:

      keytool.exe -export -alias tomcat -file "xxx\oo10-certificate.cer" -keystore
     "%OO_Home%\central\var\security\key.store" -storepass changeit


                   Note

                Later, when configuring SSL in Service Manager, you will import oo10-
                certificate.cer into the Service Manager trust store file.

   5. Start the Operations Orchestration Central service.

Configure SSL in Service Manager

Once you have successfully configured SSL in Operations Orchestration, you are ready to
configure SSL in Service Manager.

Configure SSL for Service Manager to connect to OO 9.x

To configure SSL for Service Manager to connect to OO 9.x, perform the following steps.

   1. Create a trust store for Service Manager.
        1. Change to the following directory: <SM_HOME>/Server/RUN .
        2. Copy the generated mycacert.pem and smcert.pem from
            <OO_HOME>\Central\conf to <SM_HOME>/Server/RUN .
        3. Run the following command:
            keytool -import -v -alias rootca -keystore <keystore_file> -storepass <store
           password for keystore_file> -file mycacert.pem
           For example: keytool -import -v -alias rootca -keystore smtrust -storepass
           smoointabc123 -file mycacert.pem
           The command window displays the certificate information.
        4. When the command window prompts: "Trust this certificate?", type y .
           The command window prompts: "Certificate was added to keystore".
        5. Run the following command:
            keytool -import -v -alias sm -keystore <keystore_file> -storepass <store password
           for keystore_file> -file smcert.pem
           For example: keytool -import -v -alias sm -keystore smtrust -storepass
           smoointabc123 -file smcert.pem

                         Note

                      In this example, the trust store file name is smtrust , and its store
                      password is smoointabc123 . You will add this information to sm.ini in
                      the next step.


2. Add the following lines to sm.ini :

      #
      # Certificates
      #
      truststoreFile:<keystore_file>
      truststorePass:<store password for keystore_file>

     For example:

          #
          # Certificates
          #
          truststoreFile:smtrust
          truststorePass:smoointabc123

   3. Restart the Service Manager server so that your configuration takes effect.

Configure SSL for Service Manager to connect to OO 10.x

To configure SSL for Service Manager to connect to OO 10.x, perform the following steps.
   1. Stop the Service Manager Server service.
   2. Copy oo10-certificate.cer into a directory on the Service Manager server host.

                   Note

                This is the certificate you created when configuring SSL in OO.

  3. Search for the keytool.exe file and append its location to the Path variable in the system
     environment.

   4. Open a CMD window under %SM_home%\Server\RUN.
   5. Import the OO certificate into the Service Manager trust store file, using the following

     command:

          keytool.exe -import -alias xxx -file "xxx\oo10-certificate.cer" -
          keystore smtrust -storepass smoointabc123

   6. Answer Y when prompted. The confirmation message Certificate was added to keystore
     appears.

  7. Verify smtrust was created under <SM_home>\Server\RUN.
   8. Append the following lines to the sm.ini file under the above location:


          # Certificates

          truststoreFile:smtrust

          truststorePass:smoointabc123

   9. Start the Service Manager Server service.

Related topics

Integrations
Integration Manager
Integration Instance Information fields
Operations Orchestration (OO)
Add an Operations Orchestration integration
Enable or disable an integration instance
Enable LW-SSO for the Operations Orchestration integration
Configure LW-SSO in the Service Manager Web tier


1.7.1.3. Enable LW-SSO for the Operations
Orchestration integration

Applies to User Roles: System Administrator

If you have enabled Lightweight Single Sign-On (LW-SSO) in both Service Manager and
Operations Orchestration (OO), users who have logged on to Service Manager are allowed to
sign on to Operations Orchestration through the web tier without providing a username and
password.

To enable LW-SSO for the OO integration, complete the following tasks:

     Configure LW-SSO in the Service Manager Web tier
     Configure LW-SSO in Operations Orchestration (OO)

Related topics

Using LW-SSO with integrations
Operations Orchestration (OO)
Operations Orchestration integration setup
Add an Operations Orchestration integration
Enable SSL connection from Service Manager to Operations Orchestration


1.7.2. Manage OO flows from Knowledge
Management

User roles: Users with the SysAdmin or programmer capability word
You can view, create, update, and delete Operations Orchestration (OO) flows from the
Operations Orchestration Flows menu in Knowledge Management.

            Note

           To manage OO flows, you must first set up and enable an OO integration instance
           in Integration Manager (SMIS).

To manage Operations Orchestration flow records in Service Manager:

   1. Sign in to the Service Manager web client.
   2. Click Knowledge Management > Configuration > Operations Orchestration Flows.

     The Operations Orchestration Flow window opens.
   3. Click Search.

     If a Service Manager to OO integration instance is correctly configured and enabled in
     Integration Manager (SMIS), Service Manager displays a list of OO flow records.

                   Note

                Service Manager populates the list of OO flow records from the OOFlow
                table under System Definition. These OO flow records come from the
                following sources.

                      Automatically synchronized from OO (according to the base path
                      specified in the SM - OO integration instance)
                      Manually added in SM (for example, an individual OO flow that's not
                      under the base path or its subfolders)

     You can also type a full or partial display name in the Display Name field, and click
     Search to view one or more specific OO flow records.
   4. Select a record from the list to view its details.
     The details of the selected OO flow are displayed. For the description of each field on the
     OO flow detail form, see Operations Orchestration flow detail form fields.
   5. To add a new OO flow:

        1. Click New.
        2. Complete the fields of the OO flow record.


                         Note

                      You can only add an OO flow that has a unique UUID.

        3. Click OK.
   6. To update an existing OO flow:

        1. Select the OO flow.
        2. Update the details.
        3. Click Save & Exit.

                         Note

                      If the OO flow gets updated in Operations Orchestration after you update
                      it in Service Manager, the integration will discard your updates at the
                      next synchronization.

   7. To delete an OO flow:
        1. Select the OO flow.
        2. Click Delete.
        3. Click Yes to confirm the deletion.

Related topics

     Operations Orchestration (OO)
     Operations Orchestration flow detail form fields
     Remove OO flow links from a knowledge document
     Launch OO flows from an incident
     View OO flow execution results from an incident


1.7.2.1. Operations Orchestration flow
synchronization rules

The SM to OO integration synchronizes flows from Operations Orchestration (OO) to Service
Manager according to the basepaths that are configured in Integration Manager ( Service
Manager Integration Suite). The following describes the synchronization rules, using an
example basepath value: /Library/ITIL/Change Management; /Library/How Do I flows.

Rule 1: Only the Operations Orchestration flows under the basepath or its sub-folders are
synchronized.

Operations Orchestration Flow Path         Synchronize?
                                           Yes
/Library/ITIL/Change
Management/Network/Compare Device          Yes
ACLs                                       Yes
                                           No
/Library/ITIL/Change
Management/Servers/Block NAS Task

/Library/How Do I flows/How do I: Iterate
through a list

/Library/ITIL/Incident
Management/Servers/Server Health Check

Rule 2: If an Operations Orchestration flow is removed in Operations Orchestration, it will also
be removed in Service Manager when it is under the basepath or its sub-folders.

Operations Orchestration Flow Path         Remove in Service Manager?
Deleted in Operations Orchestration        Yes

/Library/ITIL/Change                       Yes
Management/Network/Compare Device          Yes
ACLs                                       No

/Library/ITIL/Change
Management/Servers/Block NAS Task

/Library/How Do I flows/How do I: Iterate
through a list

/Library/ITIL/Incident
Management/Servers/Server Health Check


Rule 3: If an Operations Orchestration flow is updated in Operations Orchestration, it will also
be updated in Service Manager when it is under the basepath or its sub-folders.

Operations Orchestration Flow Path         Update in Service Manager?
Updated in Operations Orchestration        Yes

/Library/ITIL/Change                       Yes
Management/Network/Compare Device          Yes
ACLs                                       No

/Library/ITIL/Change
Management/Servers/Block NAS Task

/Library/How Do I flows/How do I: Iterate
through a list

/Library/ITIL/Incident
Management/Servers/Server Health Check

Note

If an Operations Orchestration flow (under the basepath or its sub-folders) is
updated in Service Manager, the updates will not be discarded until the Operations
Orchestration flow is updated in Operations Orchestration.

Related topics

Integration Manager
Integration Instance Information fields
Enable SSL connection from Service Manager to Operations Orchestration
Operations Orchestration (OO)
Operations Orchestration flow detail form fields
Add an Operations Orchestration integration
Enable LW-SSO for the Operations Orchestration integration
Configure LW-SSO in the Service Manager Web tier
Enable or disable an integration instance
Monitor integration instance status


1.7.2.2. Operations Orchestration flow detail
form fields

You can view the details of an Operations Orchestration (OO) flow from Knowledge
Management > Configuration > Operations Orchestration Flows. The following table lists the
fields contained in the OO flow detail form.

            Note

           In the table below, an OO field refers to a field from Operations Orchestration, and
           the integration instance synchronizes its value from Operations Orchestration. A
           custom field is only for Service Manager (has no corresponding field in Operations
           Orchestration), and the integration uses this field when launching the OO flow.


Field                                   Value                          Comments
UUID
Path                                    A universally unique           An OO field.
                                        identifier automatically
Display Name                            assigned to the OO flow
                                        when it gets created in OO.
Parameter Name
                                        Full path of the OO flow.      An OO field.
Required?                               Consists of the path and
Secure?                                 name of the OO flow. For
                                        example:
                                        /Library/ITIL/Change
                                        Management/Network/Com
                                        pare Device ACLs .

                                        Name of the OO flow            A custom field. When the
                                        (defined by the user) in       integration synchronizes an
                                        Service Manager.               OO flow from OO, this field
                                                                       displays the name of the OO
                                                                       flow. However, you can
                                                                       change the name as you
                                                                       like.

                                        Name of an input for the       An OO field.
                                        operation(s) of the OO flow.
                                        The person running the flow
                                        can enter this name or set it
                                        to a specific value. The
                                        system can also obtain this
                                        name from information
                                        gathered by another step of
                                        the OO flow.

                                        true or false                  An OO field. Indicates
                                                                       whether the parameter is
                                                                       obligatory or not.

                                        true or false                  Indicates whether the field
                                                                       is a security field or not.
                                                                       The value of a security field
                                                                       will display as a string of
                                                                       asterisks.


Field                                   Value                       Comments
                                                                    An OO field.
Description                             Full description of the OO
                                        flow, including the
                                        steps/operations, inputs,
                                        responses, and returns of
                                        the OO flow.

Related topics

     Operations Orchestration (OO)
     Operations Orchestration flow synchronization rules
     Manage OO flows from Knowledge Management
     Remove OO flow links from a knowledge document
     Launch OO flows from an incident
     View OO flow execution results from an incident


1.7.2.3. Add OO flow links to a knowledge
document

User roles: Only users that have the permissions to update a knowledge document can add
Operations Orchestration (OO) flow links to it.

            Note

           Before you perform the following steps, make sure that a Service Manager to OO
           integration (SMOO) instance is enabled in Integration Manager (SMIS).

To add OO flow links to a new knowledge document:
   1. Sign in to the Service Manager web client.
   2. Click Knowledge Management > Contribute Knowledge.
   3. Select a document type. The Contribute Knowledge window opens.
   4. Select the OO Flow Links tab.
   5. In the Select Path field, select a path, and click Add Link.
     The OO Flow Link Detail form is displayed.
   6. In the Parameters section, complete the fields in the following table as necessary.
     In the table below, an OO field refers to a field from Operations Orchestration, and the
     integration instance synchronizes its value from Operations Orchestration; a custom field
     is only for Service Manager (has no corresponding field in Operations Orchestration), and
     will be used when launching the OO flow.

                   Note

                In some cases, you may need to add additional parameter names and values
                that are required to launch the OO flow.


Field                                   Value                       Description
Parameter Name
                                        Name of an input for the    An OO field.
Required?                               operation(s) of the OO
Mapped CI Field                         flow. Can be entered by
                                        the person running the
Default Value                           flow; or set to a specific
                                        value; or obtained from
                                        information gathered by
                                        another step of the OO
                                        flow.

                                        true or false               An OO field. Indicates
                                                                    whether the parameter is
                                                                    required or not.

                                        Select one from the drop-   A custom field. Useful CI
                                        down list.                  fields to launch the OO
                                                                    flow. The CI field value will
                                                                    be populated when
                                                                    launching the OO flow.
                                                                    The CI fields listed are
                                                                    defined in global list "OO
                                                                    Fields".

                                        Default value of the        A custom field. If there is
                                        parameter.                  no Mapped CI Field
                                                                    configured for the
                                                                    parameter, or no value in
                                                                    the Mapped CI Field, the
                                                                    default value will be
                                                                    populated when launching
                                                                    the OO flow. Note: This
                                                                    field is not the same field
                                                                    in OO.

7. Click Add. A message displays, stating the OO flow link is added.

8. Click OK. The OO flow appears in the Links table, and the OO Flow UUID displays as a
  link.

9. (Optional) If you want to update the OO flow, click the UUID link. Update the parameters
  and then click OK.

  Note: If you don't click OK to save and exit, your updates to the Mapped CI Field and
  Default Value fields might be lost.


 10. Repeat the steps above to add more OO flow links to the knowledge document.

To add OO flow links to an existing knowledge document:

            Note

           You can only add OO flow links to published documents and draft documents (not
           to retired documents).

   1. Sign in to the Service Manager web client.
   2. Click Knowledge Management > Published Documents or Draft Documents.
   3. Search for and open a published document, or directly select a draft document from the

     list.
   4. Click Edit. The Contribute Knowledge window opens.
   5. Select the OO Flow Links tab.
   6. Add OO flow links to the knowledge document, by following steps 3 to 9 described above

     for a new knowledge document.

Related topics

Integration Manager
Operations Orchestration (OO)
Automated resolution of incidents
Add an Operations Orchestration integration
Enable or disable an integration instance
Remove OO flow links from a knowledge document
Launch OO flows from an incident


1.7.2.4. Remove OO flow links from a
knowledge document

User roles: Only users that have the permissions to update a knowledge document can remove
Operations Orchestration (OO) flow links from the knowledge document.

            Note

           Before you perform the following steps, make sure to enable a Service Manager to
           OO integration instance in Integration Manager (SMIS).

To remove OO flow links from a knowledge document:

   1. Sign in to the Service Manager Web client.
   2. Click Knowledge Management > Published Documents or Draft Documents.
   3. Search for and open a published document, or directly select a draft document from a list

     of draft documents.
   4. Click Edit. The Contribute Knowledge window opens.
   5. Select the OO Flow Links tab.
   6. Select an OO flow link from the OO Flow Path table, and click Remove Link.

     Service Manager removes the OO flow link from the OO Flow Path table. At the same
     time, a message displays, stating that the OO flow is no longer linked to the knowledge
     document.
   7. Repeat step 5 to remove more OO flow links from the knowledge document.

Related topics

     Operations Orchestration (OO)
     Operations Orchestration flow synchronization rules
     Operations Orchestration flow detail form fields
     Manage OO flows from Knowledge Management
     Add OO flow links to a knowledge document
     Launch OO flows from an incident
     View OO flow execution results from an incident


1.7.3. Automated resolution of incidents

When integrated with Service Manager, OO shares information between monitoring and
automation systems and the help desk. Incident Management processes are enhanced by
linking Knowledge documents with OO flows, allowing technicians to triage, diagnose, and
resolve incidents more quickly and efficiently.

Web client users can add or remove OO flows links for a knowledge document, execute flows
from related knowledge documents for an incident; and view OO flow execution results
attached to an incident as historic activities.

Related topics

Integration Manager
Automated deployment of changes
Add an Operations Orchestration integration
Manage OO flows from Knowledge Management
Add OO flow links to a knowledge document
Remove OO flow links from a knowledge document
Launch OO flows from an incident
View OO flow execution results from an incident


1.7.3.1. Launch OO flows from an incident

When searching knowledge from an incident, you can launch Operations Orchestration (OO)
flows linked to a knowledge document. Only users who have the permissions to edit a
knowledge document can launch the OO flows linked to it.

            Note

           This feature is available only when a Service Manager to OO integration instance is
           enabled in Integration Manager (SMIS) and the Search Engine is installed. To work
           with this feature, you must enable IDOL first.

To launch OO flows from an incident:

   1. Sign in to the Service Manager Web client.
   2. From Incident Management, search for an incident record and open the record.
   3. Search for knowledge documents by using Smart Search.
   4. Select the knowledge document from which you want to launch one or more associated

     OO flows. The knowledge document opens.

   5. Click Execute OO Flow.

           If there is no OO flow linked to the document, an error message is displayed: "No
           related OO flows found."

           You can select to click Edit to add OO flow links to the document, and then click
           Execute OO Flow again. You can also select to close the document window to exit.

           If there is only one OO flow linked to the document, the Set Parameters page opens.
           If there are multiple OO flows linked to the document, the Select an OO Flow page
           opens. Select an OO flow from the list. The Set Parameters page opens.

                   Note

                      If the selected OO flow has a parameter with a Mapped CI Field (for
                      example, Ip Address) and the Affected CI of the incident has a
                      corresponding value (for example, an IP address) for this Mapped CI
                      Field, this affected CI field value from the incident will be automatically
                      populated as the value of this OO flow parameter. If the mapped CI field
                      is an array type field, the first value of the array will be populated.
                      If the selected OO flow has a parameter without a Mapped CI Field, the
                      value specified in the Default Value field of this parameter will be
                      populated.

   6. Provide all the required parameter values for the selected OO flow.


                   Note

                You may need to add additional parameter names and provide their values in
                some cases.

   7. (Optional) If you want the OO flow to be executed asynchronously, select Asynchronous.
   8. Click Next. The selected OO flow is launched, and you are returned to the Select an OO

     Flow page.

                   Note

                If you don't want to launch more OO flows, click Finish instead of Next to
                launch the selected OO flow and to return to the knowledge document detail
                page.

   9. Continue to launch more OO flows from the list on the Select an OO Flow page.
 10. Click Finish.

     Once an OO flow execution is complete, a dialog box opens, stating that the execution is
     done and asking if you want to view the execution result.

           Click Yes to view the execution result in Operations Orchestration.
           If LW-SSO is configured in both the Service Manager web client and Operations
           Orchestration, you are directed to the execution result in Operations Orchestration. If
           LW-SSO is not configured, an Operations Orchestration login page opens; after you
           sign in to Operations Orchestration, the execution result is displayed.
           Click No to exit the dialog box.

Related topics

Operations Orchestration (OO)
Automated resolution of incidents
Manage OO flows from Knowledge Management
Add OO flow links to a knowledge document
Remove OO flow links from a knowledge document
View OO flow execution results from an incident


1.7.3.2. View OO flow execution results from
an incident

Suppose you have searched for a knowledge document from an incident. After launching an
Operations Orchestration (OO) flow from this knowledge document, you can view the OO flow
execution result from the list of Historic Activities of the incident.

To view an OO flow execution result from an incident:

   1. Sign in to the Service Manager Web client.

   2. From Incident Management, search for an incident record and open it.

   3. In the Activities section, select an activity of the OO Response type from the activities
     list.

     The Activity Log - Incident Management page opens, displaying the execution details of
     an OO flow launched from this incident.

   4. Click Open Report.

     If you have configured Lightweight Single Sign-On (LW-SSO) in both the Service Manager
     web client and Operations Orchestration, the system directs you to the execution result in
     Operations Orchestration. If you haven't configured LW-SSO, an Operations Orchestration
     login page opens, and the execution result displays after you log in.

Related topics

     Operations Orchestration (OO)
     Operations Orchestration flow synchronization rules
     Operations Orchestration flow detail form fields
     Manage OO flows from Knowledge Management
     Add OO flow links to a knowledge document
     Remove OO flow links from a knowledge document
     Launch OO flows from an incident
````
