---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.3.2 .. 1.6.3.2.3
printed_pages: 1166-1195
---

# 1.6.3.2 Integration setup

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.3.2. Integration setup

Before implementing the integration in your production environment, you can set up the
integration in a test environment using the out-of-the-box integration configurations. This
section describes the basic integration setup tasks without any tailoring or multi-tenancy
configurations.
Integration requirements
Integration setup overview
Service Manager setup
How to create an integration user account
How to add UCMDB connection information
Universal CMDB setup
How to create an integration point in UCMDB
How to update the time zone and date format for the integration adapter
Populating UCMDB with Service Manager CI data
How to define population jobs in UCMDB
View Service Manager CI data in UCMDB
How to schedule CI population jobs
Pushing UCMDB CI data to Service Manager
How to define data push jobs in UCMDB
How to schedule data push jobs
How to view UCMDB CI data in Service Manager
How to view the Change History of the primary CI of a Problem record
Federating SM ticket data to UCMDB
Federation queries
Examples of using federation


Tip

Before you proceed to implementing the integration in your production
environment, you can refer to the following sections for further information:

     Multi-tenancy (Multi-company) setup, which describes how you set up the
     integration in multi-tenancy mode.
     Standards and best practices, which describes best practices for
     implementing the integration and also provides Frequently-Asked-Questions
     information.
     Tailoring the integration, which describes how you can tailor the integration to
     better suit your business needs.
     Troubleshoot UCMDB integration, which provides information on
     troubleshooting data push and population issues.


1.6.3.2.1. Integration requirements

This section describes the integration requirements when using the
ServiceManagerAdapter9.41 adapter.

Supported product versions

The supported product versions for using this adapter are listed in the following table.

            Important

           If using UCMDB 11.0, CP 26 is required to integrate UCMDB with Service Manager
           or other applications.

Product                                 Versions
Service Manager                         9.41 or later

UCMDB                                   10.20 or later
UCMDB UI                                Compatible versions for UCMDB

To support the embedding of UCMDB UI's CI Visualization and Impact Visualization widgets in
Service Manager, the following product versions are required:

     Service Manager 9.50 or later
     UCMDB UI 4.10 or later

Setting up required components

You must set up the following required components to establish an integration between
UCMDB and Service Manager.

     Universal CMDB installation

     Add a UCMDB Probe for the population feature if you don't already have one.

     Service Manager installation

     Add the UCMDB URL in SMIS configuration. See How to add UCMDB connection
     information.
     Network connection between the Universal CMDB and Service Manager systems.

Deploying an appropriate adapter


To use the ServiceManagerAdapter9.41 adapter, all of your Service Manager server, clients,
and applications must be version 9.41 (or later). You need to verify your Service Manager
applications version and then find the correct adapter.

To do this, follow these steps:

   1. Sign in to Service Manager as a system administrator.
   2. Enter db in the command line, and press Enter.
   3. Enter scversion in the Table field, and then click Search.
   4. Click Search again.
   5. Check the Application Version value that's displayed.
   6. If your applications version is earlier than 9.41, use the ServiceManagerAdapter9.41

     adapter.
   7. If you are running Service Manager applications 9.41 or later, use the

     ServiceManagerEnhancedAdapter9.41 adapter.

Configure one UCMDB as the global ID generator

            Tip

                If UCMDB acts as the global ID generator, the newly-created CI on this
                UCMDB will generate a valid global_id attribute.
                If UCMDB doesn’t act as the global ID generator, make sure that the CI to be
                pushed has a valid global_id attribute. Otherwise, the push to the remote
                Service Manger may fail.
                For the UCMDB cluster, it is required that only one of the UCMDBs acts as the
                global ID generator, and the rest UCMDBs will synchronize the global ID
                within this cluster. If there are two or more UCMDBs act as the global ID
                generators, potential duplicated global IDs may cause identification problems
                and synchronization failure.

Follow these steps:

   1. Launch the Web browser and enter the following address:

     http://<RTSM server>:21212/jmx-console

     Use the user name sysadmin and the password you set for the administrator during the
     installation.

   2. Click UCMDB:service=Multiple CMDB Instances Services to open the JMX MBEAN View
     page.

   3. Click one of the following methods and enter values as required:


Method                                  Description
setAsGlobalIdGenerator
                                        Specifies that the CMDB will act as the
setAsGlobalIdGeneratorForScopes         global ID generator for all locally existing
setAsNonGlobalIdGenerator               scopes

                                        Specifies the scopes for which global IDs
                                        will be generated

                                        Stops the CMDB from acting as the
                                        global ID generator for all scopes

4. Click Invoke.

Note

If you want to check which scopes are currently set or which UCMDB/RTSM
instance is acting as the CMS, use the getGlobalIdGeneratorScopes method.


1.6.3.2.2. Integration setup overview

The integration requires setup on both the UCMDB and Service Manager systems.
This task includes the following steps:

   1. Set up the Service Manager system.
     See Service Manager setup.

   2. Set up the UCMDB system.
     See Universal CMDB setup.

   3. Run the UCMDB population jobs to synchronize CIs to UCMDB.
     See Populating UCMDB with Service Manager CI data.

   4. Run the UCMDB data push jobs to transfer CIs to Service Manager.
     See Populating UCMDB with Service Manager CI data.


1.6.3.2.3. Service Manager setup

You must complete the following tasks from your Service Manager system to support the
integration.

   1. Create a dedicated integration user account in Service Manager.
     See How to create an integration user account.

   2. Add the UCMDB connection information to the system information record.
     See How to add UCMDB connection information.


1.6.3.2.3.1. How to create an integration user
account

This integration requires an administrator user account for UCMDB to connect to Service
Manager. This user account must already exist in both UCMDB and Service Manager.

To create a dedicated integration user account in Service Manager:

   1. Sign in to Service Manager as a system administrator.

   2. Type contacts in the Service Manager command line, and press ENTER.

   3. Create a new contact record for the integration user account.

        1. In the Full Name field, type a full name. For example, UCMDBIntUser .
        2. In the Contact Name field, type a name. For example, UCMDBIntUser .
        3. Click Add, and then OK.

   4. Type operator in the Service Manager command line, and press ENTER.

   5. In the Login Name field, type the username of an existing system administrator account,
     and click Search.

     Service Manager displays the system administrator account.

   6. Create a new user account based on the existing one.

        1. Change the Login Name to the integration account name you want (for example,
           ucmdb).

        2. Type a Full Name. For example, UCMDB.
        3. In the Contact ID field, click the Fill button and select the contact record you have

           just created.
        4. Click Add.
        5. Select the Security tab, and change the password.
        6. Click OK.

Service Manager creates the integration user account. Later you will need to add this user
account in UCMDB, and then specify this user account in the Credentials ID field when creating
an integration point in UCMDB. See How to create an integration point in UCMDB.


1.6.3.2.3.2. How to add UCMDB connection
information

UCMDB-SM integration requires the UCMDB connection information to obtain CI attribute
information from the UCMDB system, and display it in the Actual State section in the Service
Manager configuration item form; it also requires UCMDB Browser or UCMDB Gateway
connection information to retrieve data from UCMDB Browser or UCMDB Gateway and display
the data to Service Manager users.

            Caution

           If you don't specify the correct connection information, an error, instead of correct
           CI related data, is displayed to Service Manager users.

This task includes the following steps:

   1. Sign in to Service Manager as a system administrator.
   2. Click Tailoring > Integration Manager.
   3. Click Add.
   4. In the Integration Template field, select SMtoUCMDB.

     Some fields in the form are automatically populated with a value. The empty fields can be
     ignored.
   5. (Optional) Update the Name, Log Level, and Description fields as needed.
   6. On the UCMDB Server Configuration tab, provide a value for each field in the following
     table.

                   Important

                When specifying UCMDB URLs, use the fully qualified domain name (FQDN)
                rather than the IP address of the server.

Field                                                                                      Service Manager 9.81
UCMDB webservice URL
                                        Description
User Id
Password                                Enter the URL to the Universal CMDB
                                        web service API. The URL has the
                                        following format:

                                        https://<UCMDB server name>:
                                        <port>/axis2/services/ucmdbSMService

                                        Replace <UCMDB server name> with the
                                        fully-qualified domain name (FQDN) of
                                        your UCMDB server, and replace <port>
                                        with the communications port your
                                        UCMDB server uses.

                                                    Note

                                                   If you are setting up an
                                                   HTTPS connection, make
                                                   sure to add the UCMDB root
                                                   CA certificate to the SM
                                                  truststore. See the Add the
                                                  UCMDB root CA certificate to
                                                  the SM truststore section
                                                   below.

                                        Enter the user name required to manage
                                        CIs on the UCMDB system. For example,
                                        enter admin, which is the out-of-the-box
                                        administrator user name.

                                        Enter the password required to manage
                                        CIs on the UCMDB system. For example,
                                        enter admin, which is an out-of-the-box
                                        password for the admin user account.

Field                                                                                      Service Manager 9.81
Multi-tenant UCMDB webservice URL
                                        Description

                                        This is the URL that Service Manager
                                        uses to synchronize company records
                                        with UCMDB when running in multi-
                                        company mode. This URL should use the
                                        following format:

                                        https://<UCMDB server name>:
                                        <port>/axis2/services/UcmdbManageme
                                        ntService

                                        Replace <UCMDB server name> with the
                                        fully-qualified domain name (FQDN) of
                                        your UCMDB server, and replace <port>
                                        with the communications port your
                                        UCMDB server uses.

                                                    Note

                                                   If you are setting up an
                                                   HTTPS connection, make
                                                   sure to add the UCMDB root
                                                   CA certificate to the SM
                                                  truststore. See the Add the
                                                  UCMDB root CA certificate to
                                                  the SM truststore section
                                                   below.

UserId                                  This is UCMDB account (user
Password                                name/password) that has the privilege to
                                        add/delete company records.

7. Click Verify Connection to verify that your UCMDB Server configuration is correct.

8. On the UCMDB Browser Configuration tab, configure each field or option as described in
  the following table.

Field / Option                          Default value                      Service Manager 9.81
UCMDB Browser URL
                                                       Description

                                                       Enter your UCMDB
                                                       Browser URL in the
                                                       following format:

                                                       https://<UCMDB Browser
                                                       server name>:
                                                       <port>/ucmdb-browser

                                                       Replace <UCMDB
                                                       Browser server name>
                                                       and <port> with the fully-
                                                       qualified domain name
                                                       (FQDN) and
                                                       communications port of
                                                       UCMDB Browser server
                                                       host, respectively.

                                                                   Important

                                                                  When
                                                                  specifying
                                                                  UCMDB
                                                                  Browser URL,
                                                                  use the FQDN
                                                                  rather than the
                                                                  IP address of
                                                                  the server
                                                                  host.

Field / Option                          Default value                         Service Manager 9.81
                                        false (disabled)
Show UCMDB Browser                                        Description
Impact widget
                                                          (Optional) Select this
Show UCMDB Browser CI false (disabled)                    option if you want to
Visualization widget                                      embed UCMDB Browser
                                                          Impact widget in Service
                                                          Manager.

                                                                      Tip

                                                                     This option
                                                                     shows or
                                                                     hides the
                                                                     Impact
                                                                     Widget tab on
                                                                     this page.

                                                          (Optional) Select this
                                                          option if you want to
                                                          embed the UCMDB
                                                          Browser CI Visualization
                                                          widget in Service
                                                          Manager.

                                                                      Tip

                                                                     This option
                                                                     shows or
                                                                     hides the CI
                                                                     Visualization
                                                                     Widget tab on
                                                                     this page.

Field / Option                          Default value                         Service Manager 9.81
                                        false (disabled)
Show UCMDB Browser in                                     Description
a New Browser Page
                                                          Select this option if you
                                                          want to display the
                                                          UCMDB Browser CI
                                                          Visualization widget on a
                                                          new browser page.

                                                          This option works only
                                                          after you select either
                                                          Show UCMDB Browser
                                                          Impact widget or Show
                                                          UCMDB Browser CI
                                                          Visualization widget.

                                                                      Caution

                                                                     If the number
                                                                     of CIs
                                                                     exceeds the
                                                                     value as
                                                                     specified in
                                                                     Maximum
                                                                     Trigger CIs
                                                                     per Impact
                                                                     Graph, the CIs
                                                                     graph displays
                                                                     the first page
                                                                     only.

Field / Option                          Default value                         Service Manager 9.81
                                        false (disabled)
Use a dedicated user                                      Description
account
                                                          (Optional) Select this
                                                          option if LW-SSO is
                                                          disabled for the
                                                          integration and you want
                                                          to configure a dedicated
                                                          UCMDB Browser user
                                                          account for users to view
                                                          UCMDB Browser data
                                                          from Service Manager.

                                                          This option enables users
                                                          to access UCMDB
                                                          Browser data directly from
                                                          the Service Manager user
                                                          interface without the need
                                                          to enter a user name and
                                                          password, and is
                                                          therefore useful when
                                                          LW-SSO is disabled for
                                                          the integration.

                                                          For example, this
                                                          dedicated user account is
                                                          used when users view an
                                                          embedded UCMDB
                                                          Browser widget (such as
                                                          CI Visualization and
                                                          Impact Simulation) from a
                                                          Service Manager record
                                                          or when users click the
                                                          View in UCMDB Browser
                                                          button from a CI record in
                                                          Service Manager.

Field / Option                          Default value                      Service Manager 9.81

                                                       Description

                                                                   Note

                                                                  This option
                                                                  takes effect
                                                                  only when
                                                                  LW-SSO is
                                                                  disabled for
                                                                  the
                                                                  integration. If
                                                                  you have
                                                                  enabled both
                                                                  LW-SSO and
                                                                  this option for
                                                                  the
                                                                  integration,
                                                                  LW-SSO is
                                                                  used.

                                                                   Tip

                                                                  This option
                                                                  shows or
                                                                  hides the
                                                                  Dedicated
                                                                  User tab on
                                                                  this page.

Field / Option                          Default value                      Service Manager 9.81

Impact Widget tab >                     100            Description

Maximum Trigger CIs per                                This is the maximum
                                                       number of CIs that
Impact Graph                                           Service Manager is
                                                       allowed to send to
                                                       UCMDB Browser as
                                                       trigger CIs when running
                                                       impact simulation. For
                                                       example, if the number of
                                                       affected service and CIs
                                                       of a Change record
                                                       exceeds this value, when
                                                       users click Run Impact
                                                       Analysis for the Change
                                                       record, the impact
                                                       analysis result is
                                                       displayed on multiple
                                                       pages, each of which
                                                       except the last one
                                                       contains a Next button on
                                                       the top. Users can click
                                                       Next to view the next
                                                       impact simulation graph.

                                                                   Caution

                                                                  The value of
                                                                  this field must
                                                                  not be greater
                                                                  than 100.

Field / Option                          Default value                      Service Manager 9.81

Impact Widget tab >                                    Description
Impact Bundle
                                                       This is a rule bundle that's
Impact Widget tab >                     critical       defined in UCMDB Server
Default Impact Severity                                and will be used for
                                                       impact analysis.

                                                       If you leave this field
                                                       blank, the List of impact
                                                       rule bundles setting in
                                                       UCMDB will be used. To
                                                       access this setting in
                                                       UCMDB, go to
                                                       Administration >
                                                       Infrastructure Settings
                                                       Manager, and choose
                                                       UCMDB Browser Settings.
                                                       An empty value of this
                                                       setting means all rule
                                                       bundles will be used.

                                                       This is the default impact
                                                       severity for impact
                                                       analysis. You can set it to
                                                       critical, high, medium,
                                                       low, or none.

                                                                   Note

                                                                  A severity of
                                                                  "none" will be
                                                                  used when
                                                                  this field is left
                                                                  blank.

Field / Option                          Default value                      Service Manager 9.81

CI Visualization Widget                                Description
tab > Filter TQL for CI
Visualization                                          This is a filter TQL query
                                                       that's used to retrieve CI
                                                       relationship graphs from
                                                       UCMDB Browser. A filter
                                                       TQL query is used to
                                                       restrict the CI types and
                                                       relationship types that you
                                                       want to display on each
                                                       relationship graph.

Field / Option                          Default value                      Service Manager 9.81

Dedicated User tab >                                   Description
User Id
                                                       Create a dedicated user
                                                       account in UCMDB
                                                       Browser and grant
                                                       appropriate permissions
                                                       to this account. Enter the
                                                       username in this field.

                                                       Caution: This user
                                                       account must be granted
                                                       only limited permissions
                                                       that are just enough to
                                                       view the Impact
                                                       Simulation, Get Related,
                                                       and History widgets and
                                                       to access CIs. For
                                                       information about how to
                                                       specify which widgets are
                                                       displayed to a user and
                                                       how to authorize CI
                                                       access for a user, refer to
                                                       the UCMDB Browser
                                                       Installation and
                                                       Configuration Guide.

                                                       Caution: To protect your
                                                       privacy, we recommend
                                                       enabling LW-SSO
                                                       configuration instead of
                                                       using the user id and
                                                       password. See How to
                                                       enable Lightweight Single
                                                       Sign-On (LW-SSO)
                                                       configuration for more
                                                       information.

Field / Option                          Default value                      Service Manager 9.81

Dedicated User tab >                                   Description
Encrypted Password
                                                       Obtain an encrypted value
This PDF was generated on May 23, 2026                 of the password of the
                                                       dedicated user account,
                                                       and enter the value in this
                                                       field.

                                                       To obtain an encrypted
                                                       value for the password of
                                                       a UCMDB Browser user
                                                       account, follow these
                                                       steps:

                                                       1. Open UCMDB URL in
                                                       your browser.
                                                       2. Click JMX Console
                                                       from the login page.
                                                       3. Sign in to the JMX
                                                       Console as an
                                                       administrator.
                                                       4. Search for
                                                       getencryptedPasswordFo
                                                       rURL and then open this
                                                       section.
                                                       5. In the User Name and
                                                       Password fields, enter the
                                                       user name and password
                                                       of the user account that
                                                       you want to use.
                                                       6. Click Invoke. An
                                                       encrypted value of the
                                                       password is returned.

                                                       Caution: To protect your
                                                       privacy, we recommend
                                                       enabling LW-SSO
                                                       configuration instead of
                                                       using the user id and
                                                       password. See How to
                                                       enable Lightweight Single
                                                       Sign-On (LW-SSO)
                                                       configuration for more
                                                       information.

                                                                                           Page 1186 of 1727

9. On the UCMDB Gateway Configuration tab, configure each field or option as described
  in the following table.

               Important

             The UCMDB Gateway configuration invalidates the UCMDB Browser
             configuration. After configuring the UCMDB Gateway setting, the CI
             visualization graph and the Impact visualization graph that are previously
             displayed by the UCMDB Browser are still available in Service Manager.
             However, you still need to perform UCMDB Browser configuration if you need
             to view CI history.


Field / Option                          Default value           Description
UCMDB Gateway URL
                                        https://<server         Enter your UCMDB
                                        host:port>/cms-gateway  Gateway URL. Replace
                                                                <server host> and <port>
                                                                with the fully-qualified
                                                                domain name (FQDN) and
                                                                communications port of
                                                                UCMDB Gateway server
                                                                host, respectively.

Field / Option                          Default value                      Service Manager 9.81

                                                       Description

                                                                   Note

                                                                  If you are
                                                                  setting up an
                                                                  HTTPS
                                                                  connection,
                                                                  make sure to
                                                                  add the
                                                                  UCMDB
                                                                  Gateway root
                                                                  CA certificate
                                                                  to the SM
                                                                  truststore. See
                                                                 the Add the
                                                                 UCMDB
                                                                 Gateway root
                                                                 CA certificate
                                                                 to the SM
                                                                 truststore
                                                                  section below.

                                                                  Meanwhile, If
                                                                  you are
                                                                  connecting to
                                                                  the UCMDB
                                                                  Gateway with
                                                                  SSL, you also
                                                                  need to
                                                                  configure the
                                                                  UCMDB
                                                                  Gateway
                                                                  truststore for
                                                                  the web tier.
                                                                  See the
                                                                 Configure the
                                                                 UCMDB
                                                                 Gateway
                                                                 truststore for
                                                                 the web tier
                                                                  section below.


Field / Option                          Default value  Description
User Id
                                                       Enter the name of the
Password                                               UCMDB Gateway
                                                       integration user. This user
                                                       must have access to the
                                                       data on all tenants.

                                                       Enter the password of the
                                                       UCMDB Gateway
                                                       integration user.

10. Click Verify Connection to verify that your UCMDB Gateway configuration is correct.
11. Click Finish.

    Service Manager creates an SMtoUCMDB integration instance.
12. Go to Integration Manager, and then click the SMtoUCMDB integration instance.
13. Click Next until the Initialize link becomes active, and then click the link.

Note

This step creates records in the cirelationship1to1 table so that CI
relationships can be properly populated to UCMDB.

14. Click Finish to go back to Integration Manager, select the SMtoUCMDB integration
    instance, and then click Enable to enable the integration instance.


Important

When using the embedded UCMDB Browser, for the Impact Simulation Widget and
Get Related Widget to work, perform the following steps:

   1. Go to JMX console > UCMDB:service=Settings Services >
     setGlobalSettingValue.

   2. In the name field, enter ui.framing.host.
   3. In the value field, enter the desired Service Manager web tier host address.

     For example, frame-ancestors https://<IP>:<port> or frame-ancestors
     https://<web tier FQDN>:<port> .
   4. Click Invoke.
   5. Restart the UCMDB server.
When using UCMDB Browser standalone, for the Impact Simulation Widget and Get
Related Widget to work, perform the following steps:
   1. Open the %WEB_SERVER_HOME%\webapps\ucmdb-browser\WEB-
     INF\web.xml file.
   2. Locate the following lines:

          <filter>
                 <filter-name>ClickjackingFilterSameOrigin</filter-

          name>
                 <filter-

          class>com.hp.ucmdb_browser.server.web.ClickjackingFilter</
          filter-class>

                 <init-param>
                        <param-name>mode</param-name>
                        <param-value>SAMEORIGIN</param-value>

                 </init-param>
          </filter>
          <filter-mapping>

                        <filter-name>ClickjackingFilterSameOrigin</filter-
          name>

                        <url-pattern>/*</url-pattern>
          </filter-mapping>

   3. In the section above, replace the following line:

          <param-value>SAMEORIGIN</param-value>

     with


                        <param-value>ALLOW_FROM <Service Manager URL></param-
                        value>

                For example,

                        <param-value>ALLOW_FROM
                        https://SMservername.domain.com</param-value>

              4. Restart the UCMDB Browser.

Add the UCMDB root CA certificate to the SM truststore

Follow these steps to add the UCMDB root CA to the SM server by using the certificate
generation toolkit.

   1. Copy the UCMDB server root certification file cmsroot.crt from the UCMDB server
     installation directory (for example, C:\UCMDB\UCMDBServer\conf\security\ ) to the
      cert-utils/certs folder.

   2. Import cmsroot.crt to the SM truststore. See the following sample commands.
     Non-FIPS mode:

          import-cert.bat --alias cmsroot --file certs/cmsroot.crt --keystore
          certs/cacerts --storepass changeit

     FIPS mode:

          import-cert.bat --alias cmsroot --file certs/cmsroot.crt --keystore
          certs/cacerts --storetype bcfks --storepass changeit

   3. Copy cacerts to the <SM_SERVER_HOME>/RUN folder.
   4. Update sm.ini by adding the following lines:

          truststoreFile:cacerts
          truststorePass:changeit

   5. Restart the SM server.

Add the UCMDB Gateway root CA certificate to the SM
truststore


Follow these steps to add the UCMDB Gateway root CA to the SM server by using the
certificate generation toolkit.

   1. Copy the UCMDB Gateway root CA certification file cmsrootca.crt from the UCMDB
     Gateway installation directory (for example, C:\cms-gateway-11.6.9.59-windows\cms-
     gateway-installer\ssl ) to the cert-utils/certs folder.

   2. Import cmsrootca.crt to the SM truststore. See the following sample commands.
     Non-FIPS mode:

          import-cert.bat --alias cmsrootca --file certs/cmsrootca.crt --
          keystore certs/cacerts --storepass changeit

     FIPS mode:

          import-cert.bat --alias cmsrootca --file certs/cmsrootca.crt --
          keystore certs/cacerts --storetype bcfks --storepass changeit

   3. Copy cacerts to the <SM_SERVER_HOME>/RUN folder.
   4. Update sm.ini by adding the following lines:

          truststoreFile:cacerts
          truststorePass:changeit

   5. Restart the SM server.

Configure the UCMDB Gateway truststore for the web tier

Follow these steps to configure the UCMDB Gateway truststore for the web tier by using the
certificate generation toolkit.

   1. Copy the UCMDB Gateway root CA certification file cmsrootca.crt from the UCMDB
     Gateway installation directory (for example, C:\cms-gateway-11.6.9.59-windows\cms-
     gateway-installer\ssl ) to the cert-utils/certs folder.

   2. Import cmsrootca.crt to the UCMDB Gateway truststore. See the following sample
     commands.
     Non-FIPS mode:

          import-cert.bat --alias cmsrootca --file certs/cmsrootca.crt --
          keystore certs/cmsrootca.p12 --storepass <your password for the CMS
          truststore>


FIPS mode:

      import-cert.bat --alias cmsrootca --file certs/cmsrootca.crt --

      keystore certs/cmsrootca.bcfks --storetype bcfks --storepass <your

      password for the CMS

      truststore>

3. Copy cmsrootca.p12 (or cmsrootca.bcfks) to the <customize-folder>/config folder if you
  have configured the customize-folder parameter, or to the <WEBTIER>\WEB-INF folder
  if you haven't configured the customize-folder parameter.

4. Edit the <customize-folder>/config/webtier.properties file if you have configured the
   customize-folder parameter, or edit the <WEBTIER>/WEB-INF/webtier.properties file if
  you haven't configured the customize-folder parameter. For example:

  cms.truststore=<customize-folder>/config/cmsrootca.p12
  cms.truststore.password=changeit

Or:

      cms.truststore=/WEB-INF/cmsrootca.p12
      cms.truststore.password=changeit

  For more information about cms.truststore and cms.truststore.password , see Web
  parameter:cms.truststore and Web parameter:cms.truststore.password, respectively.
5. Restart the web application server.
````
