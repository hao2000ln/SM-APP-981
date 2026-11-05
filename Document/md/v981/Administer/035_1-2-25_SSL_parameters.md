---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.25 .. 1.2.25
printed_pages: 795-824
---

# 1.2.25 SSL parameters

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.25. SSL parameters

The following table lists the startup parameters you can set from the Service Manager
server's operating system command prompt or from the Service Manager initialization
file (sm.ini).
These parameters determine how the Service Manager server manages SSL
connections.

SSL Parameter                                                                                   Service Manager 9.81
Parameter: acceptsharedcert
Web parameter: cacerts                  Brief description
Parameter: cacsignon
Parameter: ciphers                      Defines how the Service Manager
Parameter: keystoreFile                 server handles signed SSL certificates
Parameter: keystorePass                 from incoming client requests in a
Parameter: onewayssl4ws                 Trusted Sign-On configuration

Parameter: pgsslEnableCiphers           Defines the path to the cacerts file
Parameter: pgsslEnableProtocols         required for web clients to make SSL
                                        connections to the web tier

                                        Defines whether trusted clients can log
                                        on to the Service Manager server with
                                        a Common Access Card (CAC), without
                                        entering log-on information

                                        Defines an array of cipher suites used
                                        for SSL connections for the embedded
                                        Tomcat of the Service Manager Server.

                                        Defines the path and file name to the
                                        Java keystore that contains the
                                        certificate of the Service Manager
                                        server

                                        Defines the password to the Java
                                        keystore that contains the certificate of
                                        the Service Manager server

                                        Disables or enables one-
                                        way/anonymous SSL for web services
                                        clients in a Trusted Sign-On (TSO) or
                                        Common Access Card (CAC)
                                        configuration

                                        Defines an array of cipher suites used
                                        for PostgreSQL SSL connections.

                                        Defines the supported SSL protocols
                                        for PostgreSQL SSL connections.

SSL Parameter                                                                                   Service Manager 9.81
Web parameter: secureLogin
Web parameter: ssl                      Brief description
Parameter: ssl
                                        Controls the encryption of network
Parameter: sslConnector                 communication between the web
Web parameter: sslPort                  application server and the web
Parameter: sslEnabledProtocols          browser.
Parameter: ssl_reqClientAuth
Parameter: ssl_trustedClientsJKS        Causes all web clients to use SSL
                                        connections to the web tier

                                        Defines whether the Service Manager
                                        server requires SSL connections from
                                        all incoming client requests that are
                                        sent from Service Manager's Windows
                                        client or web client.

                                        Defines whether servlet container
                                        processes have an HTTPS (SSL-
                                        encrypted HTTP) communications port
                                        available.

                                        Defines the SSL port of the web
                                        application server (this is required only
                                        when the secureLogin parameter is set
                                        to true)

                                        Defines the supported SSL protocols
                                        for HTTPS connections to the Service
                                        Manager Server.

                                        Defines whether the Service Manager
                                        server requires signed certificates from
                                        all incoming client requests

                                        Defines the path and file name to the
                                        Java keystore that contains the list of
                                        trusted client certificates from which
                                        the Service Manager server allows
                                        connection requests

 SSL Parameter                                                                                  Service Manager 9.81
 Parameter: ssl_trustedClientsPwd
                                        Brief description
 Parameter: trustedsignon
                                        Defines the password to the Java
Related topics                          keystore that contains the list of trusted
                                        client certificates from which the
System parameters                       Service Manager server allows
Enter a parameter in the sm.ini file    connection requests

                                        Defines whether trusted clients can log
                                        in to the Service Manager server
                                        without having to provide login
                                        information


1.2.25.1. Parameter: acceptsharedcert

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

acceptsharedcert

Description

This parameter defines how the Service Manager server handles signed SSL
certificates from incoming client requests in a Trusted Sign-On configuration.

            Caution

           This functionality works only for the Service Manager Windows and web
           clients; it doesn't work for web service client connections, such as
           Mobility, and other third-party web service integrations.

When this parameter is set to 0 (default), the Service Manager server validates the
signed SSL client certificates by using standard best practices. The validation
procedure is described in Secure Sockets Layer (SSL) encryption.


            Note

           We recommend that you run the Service Manager server with the default
          value set for this parameter (acceptsharedcert:0), as it is the most secure
           mode of operation. Before you modify the default behavior, consider the
           following alternative workarounds:

                Do not use the Service Manager Windows client. Instead, use only
                the Service Manager web tier, as it doesn't incur the additional
                maintenance overhead or complexity that's associated with
                managing numerous signed client SSL certificates.
                If you must use the Service Manager Windows client in your
                environment, consider limiting the distribution of this client to a small
                number of users. This minimizes the additional overhead costs
                associated with managing numerous Service Manager Windows
                clients and their unique signed client SSL certificates.
                Use as many Service Manager Windows clients as are needed, but
                disable Trusted Sign-On functionality for these users. This eliminates
                the requirement to generate unique signed client SSL certificates.

When the parameter is enabled (acceptsharedcert:1), the Service Manager server
allows Trusted Sign-On connections by using a so-called "shared certificate."
TheService Manager server validates the shared certificate using only the following
checks:

     Whether the certificate is issued by a trusted certificate authority
     Whether the Common Name attribute of the certificate is in the Service Manager
     Server's trusted clients keystore

This parameter is provided primarily for use in customer environments where the
following conditions are true:

     There is a requirement to allow access to Service Manager through Trusted
     Sign-On for a large number of Service Manager Windows clients.
     Creating and maintaining the required signed SSL client certificates adds too
     much maintenance overhead and complexity to IT operations.

By using acceptsharedcert:1, only one client SSL certificate (the "shared certificate")
needs to be created and maintained. This significantly minimizes the maintenance
overhead costs and complexity that are associated with managing signed SSL client
certificates. However, bear in mind the following considerations:


     You must still copy and distribute the shared certificate to individual Service
     Manager Windows clients before you can successfully use Trusted Sign-On
     access.
     By using acceptsharedcert:1 you will have minimized your maintenance
     overhead and complexity of your IT operations at the cost of reduced security in
     Service Manager. This is due to the two simple "shared certificate" validation
     checks that the Service Manager server performs when it runs with
     acceptsharedcert:1. Running the Service Manager server with the recommended
     default value for the acceptsharedcert parameter provides the most secure
     method for enabling Trusted Sign-On features because the Service Manager
     server performs additional validation checks against the client SSL certificate. It
     is also possible, though unlikely, that if a malicious user obtains the "shared
     certificate" that user may be able to gain unauthorized access to Service
     Manager if they can then also defeat the NTLM-based implementation of
     Trusted Sign-On on the Service Manager Windows client.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0

Possible values

0 (Disabled)

1 (Enabled)

Example usage

Command line: sm -httpPort:13080 -acceptsharedcert:1

Initialization file: acceptsharedcert:1

Related topics

Trusted sign-on
Enter a parameter in the sm.ini file
SSL parameters


Requirements for trusted sign-on
Parameter: ssl_reqClientAuth


1.2.25.2. Parameter: cacsignon

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

cacsignon

Description

This parameter defines whether trusted clients can sign in to the Service Manager
server by using a Common Access Card (CAC) and without entering sign-in
information. Enable this parameter to allow trusted clients to bypass the Service
Manager sign-in screen and directly sign in with a valid certificate stored in a CAC.

Once you have enabled cacsignon, the following parameters are automatically (and
implicitly) set to 1:

Parameter                               Value  Notes
ssl                                     1
                                               Any other value explicitly
sslConnector                            1      specified in sm.ini are
                                               ignored.
ssl_reqClientAuth                       1
                                               Any other value explicitly
                                               specified in sm.ini are
                                               ignored.

                                               Any other value explicitly
                                               specified in sm.ini are
                                               ignored except
                                               ssl_reqClientAuth:2.

Valid if set from

Server's operating system command prompt
Initialization file ( sm.ini )

Requires restart of the Service Manager server?

Yes


Default value

0

Possible values

0 (Disable CAC sign-on)

1 (Enable CAC sign-on)

Example usage

Command line: sm -httpPort:13080 -cacsignon:1

Initialization file: cacsignon:1

Related topics

Common Access Card (CAC) sign-on
Example: enabling CAC sign-on
Requirements for CAC sign-on


1.2.25.3. Parameter: ciphers

Parameter

ciphers

Description

This parameter defines an array of cipher suites used for SSL connections for the
embedded Tomcat of the Service Manager Server.

     If you specify this parameter, Service Manager only enables the listed ciphers
     If you don't specify this parameter, Service Manager uses a default list of
     ciphers (including TLSv1.2 and TLSv1.3).

Valid if set from

Server's operating system command prompt

Initialization file ( sm.ini )

Requires restart of the Service Manager server?

Yes

Default value

TLS_AES_256_GCM_SHA384
TLS_AES_128_GCM_SHA256
TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256

Possible values

An array of cipher suites listed below:

TLSv1.3 ciphers:

TLS_AES_256_GCM_SHA384
TLS_AES_128_GCM_SHA256
TLS_AES_128_CCM_8_SHA256
TLS_AES_128_CCM_SHA256
TLS_CHACHA20_POLY1305_SHA256

TLSv1.2 ciphers:


TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
TLS_DHE_RSA_WITH_AES_128_GCM_SHA256
TLS_DHE_RSA_WITH_AES_256_GCM_SHA384
TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256
TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256

Example usage

Command line:

  sm -httpport:13080 -
  ciphers:TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256,TLS_DHE_RS
  A_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
  TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_2
  56_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256

Initialization file:

  ciphers:TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256,TLS_DHE_RS
  A_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
  TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_2
  56_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256

Related topics

FIPS mode
Startup parameter: encryptionkey
Startup parameter: changeencrkey


1.2.25.4. Parameter: fipsmode

Parameter

fipsmode

Description

This parameter determines whether the Service Manager Server runs in FIPS 140-2
compliant mode ("FIPS mode"). This parameter can have one of the following values:

            Caution

           In a horizontal scaling environment, you must set this parameter to the
           same value in all server nodes.

     0 (default): FIPS mode is disabled. Service Manager uses the 64-bit DES
     encryption algorithm, and SSL connections to the Service Manager server don't
     use TLS protocols that are implemented by using a FIPS validated provider. By
     default, FIPS mode is disabled in Service Manager.
     2: FIPS mode is enabled. Service Manager uses the 256-bit AES data encryption
     algorithm, and SSL connections to the Service Manager Server use TLS
     protocols that are implemented by using a FIPS validated provider. Additionally,
     Service Manager must use FIPS compliant Lightweight Single Sign-On (LW-SSO)
     and random number generation algorithms.

            Note

           For backward compatibility, if you used "fipsmode:1" to enable FIPS
           compliant AES-256 data encryption only, you can continue to use this
           configuration without any problems.

When FIPS mode is enabled on the Service Manager Server side, all clients (Windows
Client, Web Tier Client, Mobility Client, and Web Service integrations) and LDAP
Server can communicate with the Service Manager Server through only TLS (either
FIPS validated TLS or normal TLS); however, the recommended best security practice
is to run all of them in FIPS mode as well.

For more information, see FIPS mode.

Valid if set from


Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0

Possible values

0, 2

Example usage

Command line: sm -httpport:13080 -fipsmode:2
Initialization file: fipsmode:2

Related topics

FIPS mode
Configuring FIPS mode in Service Manager


1.2.25.5. Parameter: keystoreType

Parameter

keystoreType

Description

This parameter defines the keystore type for the server keystore and trusted clients
kyestore of the Service Manager Server. This parameter must be set to one of the
following values:

     JKS: when Service Manager is running in non-FIPS mode (fipsmode:0)
     BCFKS: when Service Manager is running in FIPS mode (fipsmode:2)

If not specified, the default value is "JKS"; however, when "fipsmode:2" is specified in
the Server configuration file (sm.ini), "BCFKS" is used by default.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

JKS

Possible values

JKS, or BCFKS

Example usage

Command line: sm -httpport:13080 -keystoreType:BCFKS
Initialization file: keystoreType:BCFKS

Related topics

FIPS mode
Configuring FIPS mode in Service Manager


1.2.25.6. Parameter: onewayssl4ws

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's OS command prompt.

Parameter

onewayssl4ws

Description

This parameter provides the option to use one-way/anonymous SSL for web services
clients in a Trusted Sign-On (TSO) or Common Access Card (CAC) configuration.
When enabled, this parameter allows web services clients to access SM RTE
interfaces without a certificate.

This parameter is used only for web service integrations, and therefore doesn't affect
the TSO behavior of the Service Manager Windows and web clients. If you can
vouchsafe your internal security policies that govern your Web Services clients that
are integrated with the Service Manager server, this parameter enables you to deploy
SSO/TSO without the need to specify the stringent ssl_reqClientAuth:2. You can start
specific servlets by using the onewayssl4ws, ssl_reqClientAuth:0, and debugnode
parameters for a web services integration.

By default, this parameter is disabled.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of Service Manager server?

Yes

Default value

0

Possible values

0: Disable one-way/anonymous SSL for web services clients

1: Enable one-way/anonymous SSL for web services clients

Related topics


System parameters
Enter a parameter in the sm.ini file
SSL parameters
Connection parameters
Servlet parameters


1.2.25.7. Parameter: pgsslEnableProtocols

Parameter

pgsslEnableProtocols

Description

This parameter defines a comma separated list of SSL protocols to support SSL
connections for the PostgreSQL database. For security considerations, it is advisable
that you use TLSv1.2 or TLSv1.3.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

TLSv1.3,TLSv1.2

Possible values

Supported combinations of the following values (comma-separated): TLSv1.2,
TLSv1.3

Example usage

Command line:

  sm -pgsslEnableProtocols:TLSv1.2,TLSv1.3

Initialization file:

  pgsslEnableProtocols:TLSv1.2,TLSv1.3


1.2.25.8. Parameter: pgsslEnableCiphers

Parameter

pgsslEnableCiphers

Description

This parameter defines an array of cipher suites used for PostgreSQL SSL
connections.

     If you specify this parameter, Service Manager only enables the protocols listed
     and supported by the SSL implementation.
     If you don't specify this parameter, Service Manager uses a default list of
     ciphers (including TLSv1.2 and TLSv1.3).

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

  TLS_AES_128_GCM_SHA256,TLS_AES_256_GCM_SHA384,TLS_AES_128_CCM_SH
  A256,TLS_AES_128_CCM_8_SHA256,DHE-RSA-AES256-GCM-SHA384,ECDHE-
  RSA-AES256-GCM-SHA384,ECDHE-RSA-AES128-GCM-SHA256,DHE-RSA-
  AES256-SHA256,DHE-RSA-AES128-SHA256,ECDHE-RSA-AES256-
  SHA384,ECDHE-RSA-AES128-SHA256

Possible values

Any combination of the following cipher suites (separated by commas):


  TLS_AES_128_GCM_SHA256,TLS_AES_256_GCM_SHA384,TLS_AES_128_CCM_SH
  A256,TLS_AES_128_CCM_8_SHA256,DHE-RSA-AES256-GCM-SHA384,ECDHE-
  RSA-AES256-GCM-SHA384,ECDHE-RSA-AES128-GCM-SHA256,DHE-RSA-
  AES256-SHA256,DHE-RSA-AES128-SHA256,ECDHE-RSA-AES256-
  SHA384,ECDHE-RSA-AES128-SHA256,ECDHE-ECDSA-AES128-SHA256,ECDHE-
  ECDSA-AES128-GCM-SHA256,ECDHE-ECDSA-AES256-SHA384,ECDHE-ECDSA-
  AES256-GCM-SHA384,AES256-GCM-SHA384,AES256-SHA256,AES128-SHA256

Example usage

Command line:

  sm -pgsslEnableCiphers:ECDHE-RSA-AES128-GCM-SHA256,ECDHE-RSA-
  AES256-GCM-SHA384

Initialization file:

  pgsslEnableCiphers:ECDHE-RSA-AES128-GCM-SHA256,ECDHE-RSA-AES256-
  GCM-SHA384


1.2.25.9. Parameter: ssl

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

ssl

Description

This parameter defines whether the Service Manager server requires SSL
connections from all incoming client requests that are sent from Service Manager's
Windows client or Web client.

            Note

           This SSL connection enforcement also applies to Web Services clients.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0

Possible values

0 (Disable)
1 (Enable)

Example usage

Command line: sm -httpPort:13080 -ssl:1
Initialization file: ssl:1

Related topics


System parameters
Enter a parameter in the sm.ini file
SSL parameters
Connection parameters
Servlet parameters


1.2.25.10. Parameter: sslEnabledProtocols

Parameter

sslEnabledProtocols

Description

This parameter defines a comma separated list of SSL protocols to support for HTTPS
connections of the Service Manager Server.

     If you specify this parameter, Service Manager only enables the protocols listed
     and supported by the SSL implementation.
     If you don't specify this parameter, Service Manager uses a default list of
     ciphers (including TLSv1.2 and TLSv1.3).

            Note

           You are recommended to use the default value, which is
           TLSv1.2,TLSv1.3 . If you want to use another value, keep in mind that
           TLSv1.2 and TLSv1.3 is always mandatory.

            Important

           By selecting to change the allowed SSL protocols, you are disabling or
           bypassing security features, thereby exposing the system to increased
           security risks. By using this option, you understand and agree to assume
           all associated risks and hold the company harmless for the same.


            Important

           In case SSL protocols are changed from their default configuration (which
           is TLSv1.2,TLSv1.3 ), you may need to add relevant protection measures
           to protect against risks associated with the SSL protocols which were
           added, which is not provided by the company. By not implementing
           relevant protection measures you may be exposing the system to
           increased security risks. You understand and agree to assume all
           associated risks and hold the company harmless for the same. It remains
           at all times the Customer’s sole responsibility to assess its own regulatory
           and business requirements. The company doesn't represent or warrant
           that its products comply with any specific legal or regulatory standards
           applicable to Customers in conducting Customer's business.

Valid if set from

Server's operating system command prompt

Initialization (sm.ini) file

Requires restart of the Service Manager server?

Yes

Default value

TLSv1.2,TLSv1.3

Possible values

Supported combinations of the following values (comma-
separated): TLSv1.2,TLSv1.3 (see the note in the description)

Example usage

  sslEnabledProtocols:TLSv1.2,TLSv1.3


1.2.25.11. Parameter: ssl_reqClientAuth

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

ssl_reqClientAuth

Description

This parameter defines whether the Service Manager server requires signed
certificates from all incoming client requests. Enable this parameter to limit access to
the Service Manager server to only those clients that present signed certificates.

When enabled, clients can no longer connect to the Service Manager server using the
server's certificate for anonymous SSL. Each client must have its own signed
certificate. If you enable this parameter with the value ssl_reqClientAuth:2, in addition
to presenting client certificates, the server validates each client certificate against a
list of trusted clients as defined by the ssl_trustedClientsJKS parameter. Using
ssl_trustedClientsJKS with the value ssl_reqClientAuth:2 is required when using the
Trusted Sign-On features of Service Manager (trustedsignon:1). The server only
allows connections from clients with certificates in the trusted clients list.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

0

Possible values

0 (Disable)

1 (Enable - require client certificates)

2 (Enable - require client certificates and require clients to be on the list of trusted
clients)


Example usage

Command line: sm -httpPort:13080 -ssl_reqClientAuth:1

Initialization file: ssl_reqClientAuth:1

Related topics

System parameters
Enter a parameter in the sm.ini file
SSL parameters
Servlet parameters


1.2.25.12. Parameter: trustedsignon

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

trustedsignon

Description

This parameter defines whether trusted clients can sign in to the Service Manager
server without having to provide sign-in information. Enable this parameter to allow
trusted clients to bypass the Service Manager sign-in screen. Users must already
have signed in to a trusted authentication source for trustedsignon to succeed.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

0

Possible values

0 (Disable)
1 (Enable)

Example usage

Command line: sm -httpPort:13080 -trustedsignon:1
Initialization file: trustedsignon:1

Related topics

Trusted sign-on
System parameters
Enter a parameter in the sm.ini file


SSL parameters
Servlet parameters


1.2.25.13. Parameter: truststoreType

Parameter

truststoreType

Description

This parameter defines the keystore type for the Service Manager Server's truststore.
This parameter must be set to one of the following values:

     JKS: when Service Manager is running in non-FIPS mode (fipsmode:0)
     BCFKS: when Service Manager is running in FIPS mode (fipsmode:2)

If not specified, the default value is "JKS"; however, when "fipsmode:2" is specified in
the Server configuration file (sm.ini), "BCFKS" is used by default.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

JKS

Possible values

JKS, or BCFKS

Example usage

Command line: sm -httpport:13080 -truststoreType:BCFKS
Initialization file: truststoreType:BCFKS

Related topics

FIPS mode
Configuring FIPS mode in Service Manager
````
