---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.8.12 .. 1.8.13
printed_pages: 2471-2508
---

# 1.8.12 Secure Sockets Layer (SSL) encryption

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.8.12. Secure Sockets Layer (SSL) encryption

Service Manager supports Secure Hypertext Transfer Protocol (HTTPS), which encrypts and decrypts message requests and
responses. Service Manager uses Secure Sockets Layer (SSL) for encryption only and relies on the server to authenticate
each operator's user name and password. Service Manager supports SSL for the following connections:

     SSL on the Service Manager server to encrypt all communications between clients and the server.
     SSL on Service Manager clients to verify the client's identity and limit server connections to these identified clients

Enabling SSL on the Service Manager server

The primary reason to enable SSL on the Service Manager server is to protect operator user names and passwords that
Service Manager clients send with each request as part of an HTTP Basic Authorization header. You can enable SSL on the
Service Manager server but not require each client to present an individual client certificate. When you enable SSL on the
server only, clients connect to the server using anonymous SSL. This is referred to as one-way SSL later.

Enabling SSL on Service Manager clients

The primary reason to enable SSL on Service Manager clients is to restrict access to the server to only those clients known
and identified by the server. Enabling client-side SSL requires creating or purchasing signed certificates for each Service
Manager client. This is referred to as two-way SSL later. The Service Manager Web Tier can share a single signed certificate
for all Web Client connections.

Client/server SSL handshake process

During the client/server handshake process, the client looks at the server certificate, determines which certificate authority
signed the certificate, and compares the certificate signature to a list of trusted certificate authorities identified in the
truststore.

The client also compares the IP address or host name of the server to the address encrypted in the server certificate. If they
don't match, the handshake fails.

What is a keystore file?

A keystore, as the name implies, provides storage and container for keys. It stores private key entries, certificates with public
keys, or just secret keys that you may use for various cryptographic purposes. It stores each by an alias for ease of lookup.

In Service Manager, the supported keystore format is PKCS12 in non-FIPS mode, and BCFKS in FIPS mode.

What's a cacerts file?

The cacerts file is a collection of trusted certificate authority (CA) certificates. Oracle includes a cacerts file with its SSL
support in the Java™ Secure Socket Extension (JSSE) tool kit and JDK. It contains certificate references for well-known
Certificate authorities, such as VeriSign™. Its format is the "keystore" format defined by Oracle. An administrator can edit the
cacerts file with a command line tool (also provided by Oracle) called keytool. For more information about keytool, see the
Oracle website.

            Note

           The default password for the cacerts file supplied by Oracle is changeit . You must use this password to view the
           contents or to import a new certificate. For security reasons, change the default password.

The essential requirement is that the certificate authority that signed the Service Manager server's certificate must be in the
list of certificate authorities named in this file. To use a self-issued server certificate created with OpenSSL or a tool such as
Microsoft Certificate Server™, you must import the certificate for this private certificate authority into the cacerts file that the
client uses for SSL. If you don't import the certificate, SSL connections fail because the Java SSL implementation doesn't
recognize the certificate authority.

Secure Sockets Layer (SSL) configuration options

Service Manager supports several different Secure Sockets Layer (SSL) configurations that you can use to protect
communications between the server and clients. The following is a list of the most common SSL configurations in order of
increasing security and setup required:


Configuration    SSL encryption? Server                Client          Client can    Additional
Type                                   credentials     credentials     bypass login  certificates
                                       authenticated?  authenticated?  screen?       required
Required SSL
encryption       Required               Yes            No              No                 Certificate
(One-way SSL)                                                                             authority
                 Set from server                                                          certificate
                                                                                          Server
                                                                                          certificate

Required SSL     Required               Yes            Yes             No            Certificate
                                                                                     authority
encryption and Set from server                                                       certificate
                                                                                     Server
client                                                                               certificate
                                                                                     Web tier
authentication                                                                       certificate
                                                                                     Windows
(Two-way SSL)                                                                        client
                                                                                     certificates
                                                                                     Mobility
                                                                                     certificate
                                                                                     Chat
                                                                                     certificates

Required SSL     Required               Yes            Yes             Yes           Certificate
                                                                                     authority
encryption and Set from server                                                       certificate
                                                                                     Server
trusted clients                                                                      certificate
                                                                                     Web tier
(Two-way SSL)                                                                        certificate
                                                                                     Windows
                                                                                     client
                                                                                     certificates
                                                                                     Mobility
                                                                                     certificate
                                                                                     Chat
                                                                                     certificates

Use SSL connections to connect to a Web Service

     Enable SSL encryption for published Web Services
     If you want external Web Services clients to use an SSL connection with the Service Manager server, you must provide
     them with the CA certificate for the Service Manager server. If you purchased a server certificate, copy the CA
     certificate from the CA certificate keystore provided with your purchased certificate. If you generated your own server
     certificate by using a self-signed private CA certificate, copy the CA certificate from your private CA certificate keystore
     instead.
     Enable SSL encryption for external Web Services
     When using SSL connections to an external Web service, the Service Manager server acts like a client and must be set
     up accordingly. The Web service provider must send the root certificate or the certificate authority's (CA) certificate to
     the Service Manager administrator.

See Use SSL connections to connect to a Web Service for details.


Related topics

Trusted sign-on
Common Access Card (CAC) sign-on


1.8.12.1. Work with the certificate generation toolkit

As a courtesy, we provide a certificate generation toolkit along with KM000018408 to help you generate certificates for a
Service Manager deployment in an automated way. Since the scripts in this package are based on the keytool utility available
in a standard Java Development Kit to create various certificates, you need to install OpenJDK 17+ or Oracle JDK 17+ first,
and then set the JAVA_HOME environment variable properly.

To use these scripts on a headless Linux server, you need to install rng-tools first. For example, run the sudo yum install rng-
tools command on Cent OS, or run the sudo apt install rng-tools5 command on Ubuntu. The rng-tools are a set of utilities
that helps to increase the quantity of entropy in the kernel to make the /dev/random file operate faster. Usually, the
/dev/random file operates slowly because by default this file only collects entropy from device drivers and other sources that
may respond slowly as well. Hence, the scripts may stop responding when generating certificates in the FIPS mode if you
don't install rng-tools.

Configure toolkit settings

Configure global parameters

Before working with the toolkit, you must define the global parameters in the set-params.bat or set-params.sh file. You need
to change the default passwords before generating the certificates.

Parameter      Default Value            Override          Service Manager 9.81
FIPS_MODE      false                    No
                                                  Description
CA_KEY_OPTS    -keyalg RSA -keysize 2048 No
                                                  Define whether to generate
CERT_KEY_OPTS  -keyalg EC -groupname    No        certificates for the FIPS
                                                  mode or not.
               secp256r1                          Note: When the value for
                                                  this parameter is false , the
DEFAULT_CA_CERT_VALIDI 3650             Yes       keystore type is pkcs12
                                                  (*.p12). When the value is
TY                                                true , the keystore type is
                                                  bcfks (*.bcfks).
DEFAULT_CERT_VALIDITY 1095              Yes
                                                  The key algorithm for the
CACERT_PASSWD  changeit                 No        private root CA.
                                                  Note: RSA is more
CAROOT_PASSWD  caroot                   No        efficient when verifying the
                                                  digital signatures.
SERVER_KEYSTORE_PASS serverkeystore     Yes
                                                  The key algorithm for
WD                                                server or client certificates.
                                                  Note: EC is more efficient
CLIENT_KEYSTORE_PASSW clientkeystore    Yes       when performing SSL
                                                  handshakes.
D
                                                  The validity (days) of the
TRUSTEDCLIENTS_KEYST trustedclients     No        root CA certificate.

ORE_PASSWD                                        The validity (days) of server
                                                  or client certificates.
This PDF was generated on May 23, 2026
                                                  The password of the
                                                  cacerts truststore from
                                                  the JRE.
                                                  Note: Change this
                                                  password only if you have
                                                  changed the default
                                                  password of the cacerts
                                                  truststore of the JRE.

                                                  The password of the
                                                  private root CA keystore or
                                                  truststore.

                                                  The password of server
                                                  certificate keystores.

                                                  The password of client
                                                  certiticate keystores.

                                                  The password of the
                                                  trusted clients truststore.

                                                                               Page 60 of 251

Parameter         Default Value         Override  Description
CA_ALIAS          smrootca              Yes
                                                  The alias of the private root
SIGN_BY_OPENSSL   false                 No        CA certificate

                                                  Certificate signing tool
                                                  setting.

                                                  false - use the keytool
                                                  command to sign certificate
                                                  signing requests.

                                                  true - use the openssl
                                                  command to sign certificate
                                                  signing requests.

Notes:

     The Override column indicates whether the parameter can be overridden by the certificate definition attribute or by the
     command line option.
     If you want to use the EC algorithm for the private root CA for development or test purpose and have signed a server
     certificate using the keytool for the external server (such as Apache HTTP server) that's visible to the end users,
     Chrome may report the ERR_CERT_INVALID error for the server certificate and can't establish the https connection. To
     avoid this issue, you can either create a self-signed certificate for the external server or use OpenSSL to sign the server
     certificate.

Define certificates

You can define certificates you want to generate in the certs.conf file.

Organization

Define your organization information in the [organization] section by specifying the following attributes. The [organization]
section must be the first in the certs.conf file and you must define at least one of these attributes.

Attribute Name                          Description
organizationUnit                        Your organization unit (for example, department or
                                        section).
organizationName                        Your organization name (for example, company).
localityName                            Your locality name (for example, city).
stateName                               Your state or province.
country                                 Your country code in two letters (for example, GB).

Private root CA

Define Service Manager private root CA in the [root_ca] section by specifying the following attributes. The [root_ca]
section must be the second in the certs.conf file.


Attribute Name                          Mandatory  Description
alias                                   No
                                                   The alias of the private root CA.
                                                   If you don't specify this attribute, the
                                                   system uses the value of the
                                                   CA_ALIAS global parameter instead.

commonName                              Yes        The common name of the private root
                                                   CA subject.
validity                                No
                                                   The validity of the private root CA in
                                                   days.

                                                   If you don't specify this attribute, the
                                                   system uses the value of the
                                                   DEFAULT_CA_CERT_VALIDITY global
                                                   parameter instead.

Server or client certificates

Define the server or client certificates in the [server_cert] or [client_cert] section by specifying the following attributes.

Attribute Name  Apply To                Mandatory          Service Manager 9.81
alias                                   Yes
                [server_cert]                      Description
                [client_cert]
                                                   The alias of the certificate.
commonName      [server_cert]           Yes
                                                   The alias must be unique
                [client_cert]                      among all certificates, and
                                                   can't contain spaces or
subjectAltName  [server_cert]           No         other chars that are illegal
                                                   in file names.
                [client_cert]
                                                   The common name of the
validity        [server_cert]           No         certificate subject.

                [client_cert]                      You can use a descriptive
                                                   name as the common
                                                   name, or use the FQDN as
                                                   the common name if you
                                                   don't want to add the FQDN
                                                   to the subjectAltName
                                                   attribute.

                                                   The subject alternative
                                                   name extension of the
                                                   certificate.

                                                   You can specify the value
                                                   as
                                                   type:value(,type:value)* ,
                                                   where the type can be DNS
                                                   or IP. For example,
                                                   DNS:server1.yourdomain.n
                                                   et,DNS:server2.yourdomain
                                                   .net .

                                                   The validity of the
                                                   certificate in days.

                                                   If you don't specify this
                                                   attribute, the toolkit uses
                                                   the value of the
                                                   DEFAULT_CERT_VALIDITY
                                                   global parameter instead.

Attribute Name  Apply To                Mandatory          Service Manager 9.81
storepass                               No
                [server_cert]                      Description
                [client_cert]
                                                   The password for the
exportKey       [server_cert]           No         keystore that will be
selfsign                                           created to store the
                [client_cert]                      certificate.

                [server_cert]           No         If you don't specify this
                                                   attribute, the toolkit uses
clientAuth      [server_cert]           No         the value of the
                                                   SERVER_KEYSTORE_PASS
                                                   WD global parameter for
                                                   the server certificate, and
                                                   uses the value of the
                                                   CLIENT_KEYSTORE_PASS
                                                   WD global parameter for
                                                   the client certificate.

                                                   Whether to export the
                                                   private key to a PEM-
                                                   encoded file

                                                   Define whether to create a
                                                   self-signed server
                                                   certificate.

                                                   The possible values are
                                                   yes and no , and the
                                                   default value is no .

                                                   Define whether to add
                                                   clientAuth to the extended
                                                   key usage.

                                                   The possible values are
                                                   yes and no , and the
                                                   default value is no .

                                                   The extended key usage of
                                                   the server certificate is
                                                   serverAuth by default.
                                                   Adding clientAuth to the
                                                   extended key usage
                                                   indicates that server
                                                   certificate can also be used
                                                   as a client certificate


Attribute Name  Apply To                Mandatory  Description
serverAuth      [client_cert]           No
                                                   Define whether to add
                                                   serverAuth to the
                                                   extended key usage.

                                                   The possible values are
                                                   yes and no , and the
                                                   default value is no .

                                                   The extended key usage of
                                                   the client certificate is
                                                   clientAuth by default.
                                                   Adding serverAuth to the
                                                   extended key usage
                                                   indicates that the client
                                                   certificate can also be used
                                                   as a server certificate.

overwrite       [server_cert]           No         Define whether to overwrite
                                                   the existing certificate. The
                [client_cert]                      possible values are yes
                                                   and no .

                                                   This attribute takes
                                                   precedence over the --
                                                   overwrite command line
                                                   option in the gen-all-
                                                   certs.bat or the gen-all-
                                                   certs.sh file.

Generate certificates

Follow these steps to generate a series of certificates by using the certificate generation toolkit:

   1. Modify global parameters in the set-params.bat or set-params.sh file. Set the FIPS_MODE parameter as necessary,
     and then update the password parameters.

   2. Define certificates in the certs.conf file according to your actual deployment.
   3. Run gen-all-certs.bat on Windows or run the ./gen-all-certs.sh command on Linux to generate certificates.
   4. Copy related truststore and keystore to target locations, and then update the settings. For more information, see

     Configure two-way SSL.

Scripts in the toolkit

The certificate generation toolkit consists of the following scripts.

gen-all-certs.bat / gen-all-certs.sh


Usage: gen-all-certs.bat [options]
Generates all certificates defined in the certs.conf file.
Example: gen-all-certs.bat --overwrite no

Options:                                whether to overwrite existing certificates. The overwrite
     --overwrite {yes|no}               attribute defined in the certs.conf will override this option
                                        for individual certificate. If it's not present neither in
     --clean                            the certificate definition, nor in the commandline options,
     --printcert                        you will be asked for a choice for the existing certificate.
     --help                             The private root CA certificate ignores this option, if you
                                        want to regenerate it either, add the --clean option.
                                        clean all certificates before generates new ones
                                        print detailed info of the server or client certificates
                                        print this help message

Example 1: Generate all certificates for the first time
     Windows

  gen-all-certs.bat

Linux

          ./gen-all-certs.sh

Example 2: Generate new certificates and ignore the existing ones
     Windows

  gen-all-certs.bat --overwrite no

Linux

          ./gen-all-certs.sh --overwrite no

Example 3: Generate new certificates and overwrite the existing ones
     Windows

  gen-all-certs.bat --overwrite yes

Linux

          ./gen-all-certs.sh --overwrite yes

Example 4: Re-generate the smwebtier certificate
First, add the overwrite attribute to the web tier certificate definition in the certs.conf file.

# Client certificate for the webtier.
[client_cert]
alias = smwebtier
commonName = Service Manager Webtier
subjectAltName = DNS:smwebtier.yourdomain.net
overwrite = yes


Next, run gen-all-certs.bat(sh) with the --overwrite no command line option to re-generate the smwebtier certificate only.
     Windows

  gen-all-certs.bat --overwrite no

Linux

          ./gen-all-certs.sh --overwrite no

gen-root-ca.bat / gen-root-ca.sh

Use these two scripts to generate a self-signed private CA root. You need to run these scripts before generating a server or
client certificate.

Usage: gen-root-ca.bat [options]
Generates a self-signed private root CA certificate. This private root CA certificate will be
used
to sign certificates generated for the server or client applications.
Example: gen-root-ca.bat --dname "CN=Service Manager Private Root CA, OU=ITOM, O=OpenText,
C=CA"

Options:                                the alias of the private root CA certificate
     --alias {alias}                    (defaults to smrootca, see set-params.bat)
     --dname {dname}                    X.500 Distinguished Names to specify the subject and issuer
                                        of the certificate. Following subparts are supported:
     --validity {days}
     --clean                               CN=commonName
     --help                                OU=organizationUnit
                                           O=organizationName
                                           L=localityName
                                           S=stateName
                                           C=country
                                        you must specify them in the order above. However, you can
                                        use a subset, for example:
                                           CN=Service Manager Private Root CA, OU=ITOM, O=OpenText, C=CA
                                        if omitted, you will be prompted for subparts.
                                        the validity in days of the private root CA certificate
                                        (defaults to 3650, see set-params.bat)
                                        clean all certificates before generates new ones
                                        print this help message

Example: Generate a private CA certificate
     Windows

  gen-root-ca.bat --alias smrootca --dname "CN=Service Manager Private Root CA, OU=ITOM,
  O=OpenText, C=CA"

Linux

          ./gen-root-ca.sh --alias smrootca --dname "CN=Service Manager Private Root CA, OU=ITOM,
          O=OpenText, C=CA"

gen-server-cert.bat / gen-server-cert.sh


Usage: gen-server-cert.bat [options]
Generates a certificate for the server application and sign it with the private root CA
certificate.
Example: gen-server-cert.bat --alias smserver --dname "CN=Service Manager Server, OU=ITOM,
O=OpenText, C=CA"

Options:                                the alias of the server certificate (required)
     --alias {alias}                    X.500 Distinguished Names to specify the subject of the
     --dname {dname}                    certificate. Following subparts are supported:

     --san {san}                           CN=commonName
                                           OU=organizationUnit
     --storepass {password}                O=organizationName
     --caalias {alias}                     L=localityName
     --validity {days}                     S=stateName
     --clientauth                          C=country
                                        you must specify them in the order above. However, you can
     --selfsign                         use a subset, for example:
     --exportkey                           CN=Service Manager Server, OU=ITOM, O=OpenText, C=CA
     --overwrite {yes|no}               if omitted, you will be prompted for subparts.
     --help                             the Subject Alternative Name extension of the certificate.
                                        the value should be specified as type:value(,type:value)*,
                                        where the type can be DNS or IP. For example:
                                           DNS:server1.yourdomain.net,DNS:server2.yourdomain.net
                                        if omitted, you will be prompted for one.
                                        the password used to protect the server keystore
                                        (defaults to serverkeystore, see set-params.bat)
                                        the alias of the private root CA certificate
                                        (defaults to smrootca, see set-params.bat)
                                        the validity in days of the private root CA certificate
                                        (defaults to 1095, see set-params.bat)
                                        add clientAuth to the extended key usage as well
                                        the extended key usage is serverAuth by default, adding
                                        clientAuth to it means the certificate can also be used
                                        as a client certificate
                                        generates a self-signed certificate only
                                        export the private key to a PEM-encoded file
                                        overwrite the existing certificate
                                        if omitted, you will be asked for existing certificate
                                        print this help message

Example 1: Generate a server CA certificate that's used by two server nodes
     Windows

  gen-server-cert.bat --alias smserver --dname "CN=Service Manager Server, OU=ITOM,
  O=OpenText, C=CA" --san "DNS:smserver1.yourdomain.net,DNS:smserver2.yourdomain.net"

Linux

          ./gen-server-cert.sh --alias smserver --dname "CN=Service Manager Server, OU=ITOM,
          O=OpenText, C=CA" --san "DNS:smserver1.yourdomain.net,DNS:smserver2.yourdomain.net"

Example 2: Generate a server CA certificate that's signed by a specific CA
     Windows


          gen-server-cert.bat --alias smserver --dname "CN=Service Manager Server, OU=ITOM,
          O=OpenText, C=CA" --san "DNS:smserver.yourdomain.net" --caalias myrootca

     Linux

          ./gen-server-cert.sh --alias smserver --dname "CN=Service Manager Server, OU=ITOM,
          O=OpenText, C=CA" --san "DNS:smserver.yourdomain.net" --caalias myrootca

Example 3: Generate a self-signed server CA certificate for the Apache HTTP Server and export the private key
     Windows

          gen-server-cert.bat --alias apache --dname "CN=Service Manager HTTP Server, OU=ITOM,
          O=OpenText, C=CA" --san "DNS:apache.yourdomain.net" --selfsign --exportkey

     Linux

          ./gen-server-cert.sh --alias apache --dname "CN=Service Manager HTTP Server, OU=ITOM,
          O=OpenText, C=CA" --san "DNS:apache.yourdomain.net" --selfsign --exportkey

gen-client-cert.bat / gen-client-cert.sh


Usage: gen-client-cert.bat [options]
Generates a certificate for the client application and sign it with the private root CA
certificate.
The client certificate will also be imported into the trustedclients.keystore.
Example: gen-client-cert.bat --alias smwebtier --dname "CN=Service Manager Webtier, OU=ITOM,
O=OpenText, C=CA"

Options:                                the alias of the client certificate (required)
     --alias {alias}                    X.500 Distinguished Names to specify the subject of the
     --dname {dname}                    certificate. Following subparts are supported:

     --san {san}                           CN=commonName
                                           OU=organizationUnit
     --storepass {password}                O=organizationName
     --caalias {alias}                     L=localityName
     --validity {days}                     S=stateName
     --serverauth                          C=country
                                        you must specify them in the order above. However, you can
     --exportkey                        use a subset, for example:
     --overwrite {yes|no}                  CN=Service Manager Webtier, OU=ITOM, O=OpenText, C=CA
     --help                             if omitted, you will be prompted for subparts
                                        the Subject Alternative Name extension of the certificate.
                                        the value should be specified as type:value(,type:value)*,
                                        where the type can be DNS or IP. For example:
                                           DNS:smwebtier.yourdomain.net
                                        the password used to protect the client keystore
                                        (defaults to clientkeystore, see set-params.bat)
                                        the alias of the private root CA certificate
                                        (defaults to smrootca, see set-params.bat)
                                        the validity in days of the private root CA certificate
                                        (defaults to 1095, see set-params.bat)
                                        add serverAuth to the extended key usage as well
                                        the extended key usage is clientAuth by default, adding
                                        serverAuth to it means the certificate can also be used
                                        as a server certificate
                                        export the private key to a PEM-encoded file
                                        overwrite the existing certificate
                                        if omitted, you will be asked for existing certificate
                                        print this help message

Example 1: Generate a client certificate for the web tier that's deployed on two worker nodes
     Windows

  gen-client-cert.bat --alias smwebtier --dname "CN=Service Manager Webtier, OU=ITOM,
  O=OpenText, C=CA" --san "DNS:smwebtier1.yourdomain.net,DNS:smserver2.yourdomain.net"

Linux

          ./gen-client-cert.sh --alias smwebtier --dname "CN=Service Manager Webtier, OU=ITOM,
          O=OpenText, C=CA" --san "DNS:smwebter1.yourdomain.net,DNS:smserver2.yourdomain.net"

import-cert.bat / import-cert.sh


Usage: import-cert.bat [options]
Import a CA certificate to a truststore. This script is a simple wrapper around the keytool -
importcert command.
Example: import-cert.bat --alias corprootca --file certs/corprootca.pem --keystore
certs/corprootca.p12 --storepass caroot

Options:                                the alias of the CA certificate (required)
     --alias {alias}                    the PEM-encoded X.509 certificate file (required)
     --file {file}                      the keystore (required)
     --keystore {keystore}              the password used to protect the keystore (required)
     --storepass {password}             the type of the keystore
     --storetype {storetype}            (jks, pkcs12 or bcfks, defaults to pkcs12)
                                        print this help message
     --help

Example: Import the corporate root CA certificate to a BCFKS truststore
     Windows

  import-cert.bat --alias corprootca --file certs/corprootca.pem --keystore
  certs/corprootca.bcfks --storetype bcfks --storepass caroot

Linux

          ./import-cert.sh --alias corprootca --file certs/corprootca.pem --keystore
          certs/corprootca.bcfks --storetype bcfks --storepass caroot

convert-keystore.bat / convert-keystore.sh

Usage: convert-keystore.bat [options]
Converts keystore type. Supported store types are jks, pkcs12 and bcfks. This script is a
simple wrapper around the keytool -importkeystore command.
Example: convert-keystore.bat --srckeystore certs/smwebtier.p12 --srcstorepass clientkeystore -
-destkeystore certs/smwebtier.bcfks --deststoretype bcfks

Options:                                the source keystore (required)
     --srckeystore {keystore}           the password used to protect the source keystore (required)
     --srcstorepass {password}          the type of the source keystore (defaults to pkcs12)
     --srcstoretype {storetype}         the destination keystore (required)
     --destkeystore {keystore}          the password used to protect the source keystore
     --deststorepass {password}         if not specified, the srcstorepass is used
                                        the type of the source keystore (defaults to pkcs12)
     --deststoretype {storetype}        whether the srckeystore contains trusted certificates
     --trusted                          print this help message
     --help

Example 1: Convert the smwebtier keystore from JKS to PKCS12
     Windows

  convert-keystore.bat --srckeystore certs/smwebtier.keystore --srcstoretype jks --
  srcstorepass clientkeystore --destkeystore certs/smwebtier.p12

Linux


          ./convert-keystore.sh --srckeystore certs/smwebtier.keystore --srcstoretype jks --
          srcstorepass clientkeystore --destkeystore certs/smwebtier.p12

Example 2: Convert the smwebtier keystore from PKCS12 to BCFKS
     Windows

          convert-keystore.bat --srckeystore certs/smwebtier.p12 --srcstorepass clientkeystore --
          destkeystore certs/smwebtier.bcfks --deststoretype bcfks

     Linux

          ./convert-keystore.sh --srckeystore certs/smwebtier.p12 --srcstorepass clientkeystore --
          destkeystore certs/smwebtier.bcfks --deststoretype bcfks

Example 3: Convert the smwebtier keystore from BCFKS to PKCS12
     Windows

          convert-keystore.bat --srckeystore certs/smwebtier.bcfks --srcstorepass clientkeystore --
          srcstoretype bcfks --destkeystore certs/smwebtier.p12

     Linux

          ./convert-keystore.sh --srckeystore certs/smwebtier.bcfks --srcstorepass clientkeystore --
          srcstoretype bcfks --destkeystore certs/smwebtier.p12

Example 4: Merge the truststore corprootca.bcfks to the truststore smrootca.bcfks
     Windows

          convert-keystore.bat --trusted --srckeystore certs/corprootca.bcfks --srcstorepass caroot -
          -srcstoretype bcfks --destkeystore certs/smrootca.bcfks --deststoretype bcfks --
          deststorepass caroot

     Linux

          ./convert-keystore.sh --trusted --srckeystore certs/corprootca.bcfks --srcstorepass caroot
          --srcstoretype bcfks --destkeystore certs/smrootca.bcfks --deststoretype bcfks --
          deststorepass caroot

Export the certificate and the private key from a keystore

You can use the openssl utility to export the certificate and the private key from a keystore. For example:
     Windows

          openssl\openssl.exe pkcs12 -in certs\myserver.p12 -passin pass:serverkeystore -nocerts -
          nodes -out certs\myserver.key
          openssl\openssl.exe pkcs12 -in certs\myserver.p12 -passin pass:serverkeystore -nokeys -out
          certs\myserver.crt

     Linux


openssl pkcs12 -in certs/myserver.p12 -passin pass:serverkeystore -nocerts -nodes -out
certs/myserver.key
openssl pkcs12 -in certs/myserver.p12 -passin pass:serverkeystore -nokeys -out
certs/myserver.crt


1.8.12.2. Configure two-way SSL

Two-way SSL is the prerequisite of Trusted sign-on (TSO) and Common Access Card (CAC) sign-on. The scope of two-way
SSL is limited to the communication between the Service Manager server and the Service Manager clients (for example, web
tier, mobility, Windows client, and chat service). Other communications are one-way SSL because the client certificate
authentication is unnecessary.

Typical Service Manager deployment with SSL

The diagram below illustrates a typical SM deployment that uses the Apache HTTP Server as the reverse proxy and Tomcat
as the web container. Certificates needed in the SSL configuration are illustrated in the diagram as well.

In this diagram:

     The Apache HTTP Server is visible to end users, and you must use a server certificate issued by the certificate authority
     of your company in the production environment. In the development and test environment, you can use a server
     certificate signed by the Service Manager private CA.
     Though the AJP protocol is more efficient than the HTTPS protocol in the integration between the Apache HTTP Server
     and Tomcat, the transferred data is not encrypted. You can use the AJP protocol only if the Apache HTTP Server and
     Tomcat are deployed in a trusted and secured environment. When using the AJP protocol, Tomcat doesn't need the
     server certificate.
     If you use the IBM HTTP Server (IHS) and the WebSphere Application Server (WAS) combination, the certificate
     generation toolkit can't generate server certificates used by IHS and WAS. Refer to the IBM documentation on how to
     configure SSL in IHS and WAS.
     If you use a hardware load balancer as the reverse proxy, you should refer to the manufacturer's documentation on how
     to configure SSL in the hardware load balancer.


See the following table for a complete list of certificates. You may not deploy all Service Manager components in your
environment, and you can create certificates that are necessary for your deployment only.

Alias                Common Name               Certificate type  Note
smserver             Service Manager Server    server            The extended key usage
                                                                 contains clientAuth as
smartanalytics       Service Manager Smart     server            well as serverAuth .
                     Analytics                                   The extended key usage
                                                                 contains clientAuth as
smchatserver         Service Manager Chat      server            well as serverAuth .
smchatservice        Server                    server            The certificate and the
smchatserviceclient                            client            private key will be exported
idmservice           Service Manager Chat      server            to PEM-encoded files.
tomcat               Service                   server
smwebtier                                      client            Use this certificate in the
mobilitytomcat       Service Manager Chat      server            development and test
smmobility           Service Client            client            environment only.
apache                                         server            The certificate and the
                     Service Manager IdM                         private key will be exported
                     Service                                     to PEM-encoded files.

                     Service Manager Webtier
                     Tomcat

                     Service Manager Webtier

                     Service Manager Mobility
                     Tomcat

                     Service Manager Mobility

                     Service Manager HTTP
                     Server

<domain user name>   <Full Name>               client            Certificate per user for the
                                                                 Windows client in TSO
                                                                 mode.

In this table:

     You can change the alias and the common name, and then use a related keystore when configuring SSL later.
     You must change the DNS name of each certificate according to your deployment.
     You can remove certificate definitions of components that you don't want to install.

In addition to the certificates listed above, the toolkit copies or generates the following truststore files in the certs folder.


Truststore                              Comments

cacerts                                 The truststore copied from JRE, with the private CA
                                        certificate added.

smrootca.p12                            The truststore contains the private CA certificate only.

smrootca_key.p12                        The keystore contains the private key of the private CA.

smrootca.crt                            The PEM-encoded private CA certificate. It can be
                                        imported to the system certificate store or the browser's
                                        certificate store.

smrootca.key                            The PEM-encoded private key of the private CA.

Requirements for required SSL encryption and client authentication

This configuration is intended for customers who:

     Want to require SSL encryption for all connections
     Want to protect against complex SSL-related attacks
     Want to authenticate that the Service Manager server is a valid host
     Want to authenticate that the Service Manager clients are valid hosts

Certificates required

You must create or obtain the following certificates for SSL encryption.

     Certificate authority certificate *
     Keystore containing the certificate authority certificate *
     Service Manager server certificate
     Web tier certificate
     Windows client certificates

* A typical SSL configuration uses a single certificate authority to issue certificates for all authenticated components. If,
however, you use multiple certificate authorities to sign your certificates, then you need to obtain a certificate for each
certificate authority.

Private keys required

You must create or obtain the following private keys for SSL encryption.

     Certificate authority's private key *
     Service Manager server's private key

* This key is only necessary if you are managing your own private certificate authority.

Parameters required in the server configuration file (sm.ini)

     keystoreFile - identify the keystore file containing the Service Manager server's certificate and private key
     keystorePass - identify the password to the keystore file containing the Service Manager server's certificate and private
     key
     ssl:1
     ssl_reqClientAuth:1
     sslConnector:1
     truststoreFile - identify the keystore file containing the certificate authority's certificate
     truststorePass - identify the password to the keystore file containing the certificate authority's certificate

Parameters required in the web tier configuration file (web.xml)

You can optionally set the customize-folder parameter in web.xml so that the <Customize-Folder>/config/webtier.properties
file can be shared by multiple web tier instances on the same host.

     customize-folder - specify the absolute path to a folder on the web tier host in which the webtier.properties file is
     located


Parameter required in the <Customize-Folder>/config/webtier.properties or <WEBTIER>/WEB-INF/webtier.properties file

You must set the following web parameter:

     ssl:true
     cacerts - identify the truststore file containing the certificate authority that signed the server's certificate
     cacertsPassword - identify the password for the truststore
     keystore - identify the keystore containing the web tier's client certificate
     keystorePassword - identify the password for the web tier's keystore

For more information, see Encryption of client keystore passwords.

Windows client preferences required

You must set the following preferences from the Window > Preferences > Service Manager > Security menu.

     CA certificates file - identify the truststore file containing the certificate authority that signed the server's certificate
     CA certificates password - identify the password for the truststore
     Keystore file - identify the keystore containing the Windows client's certificate
     Keystore password - identify the password for the Windows client's keystore

Other requirements

You must do the following additional steps to ensure that Service Manager can use your private certificates.

     Add your private certificate authority's certificate to a keystore that your Web and Windows clients can access
     Ensure that the Service Manager client's host name matches the common name (CN) listed in the client's signed
     certificate
     Ensure that the Service Manager server's host name matches the common name (CN) listed in the server's signed
     certificate

Requirements for required SSL encryption and trusted clients

This configuration is intended for customers who:

     Want to require SSL encryption for all connections
     Want to protect against complex SSL-related attacks
     Want to authenticate that the Service Manager server is a valid host
     Want to authenticate that the Service Manager clients are valid hosts
     Want to restrict access to the server to only those clients whose certificates are in a list of trusted clients

Certificates required

You must create or obtain the following certificates for SSL encryption.

     Certificate authority certificate *
     Certificate list containing the certificates of web and Windows clients that are allowed to connect to the server
     Keystore containing the certificate authority certificate *
     Service Manager server certificate
     Web tier certificate
     Windows client certificates

* A typical SSL configuration uses a single certificate authority to issue certificates for all authenticated components. If,
however, you use multiple certificate authorities to sign your certificates, then you need to obtain a certificate for each
certificate authority.

Private keys required

You must create or obtain the following private keys for SSL encryption.

     Certificate authority's private key *
     Service Manager server's private key

* This key is only necessary if you are managing your own private certificate authority.

Parameters required in the server configuration file (sm.ini)


     keystoreFile - identify the keystore file containing the Service Manager server's certificate and private key
     keystorePass - identify the password to the keystore file containing the Service Manager server's certificate and private
     key
     ssl:1
     ssl_reqClientAuth:2
     ssl_trustedClientsJKS - identify the keystore file containing the list of trusted client certificates allowed to connect to the
     server
     ssl_trustedClientsPwd - identify the password to the keystore file containing the list of trusted client certificates
     sslConnector:1
     truststoreFile - identify the keystore file containing the certificate authority's certificate
     truststorePass - identify the password to the keystore file containing the certificate authority's certificate

Parameters required in the web tier configuration file (web.xml)

Same as the corresponding section above.

Parameter required in the <Customize-Folder>/config/webtier.properties or <WEBTIER>/WEB-INF/webtier.properties file
Same as the corresponding section above.

Windows client preferences required

Same as the corresponding section above.

Other requirements

Same as the corresponding section above.

Configure two-way SSL

To configure two-way SSL, you need to generate the certificates first. Next, copy related truststore and keystore to target
locations as described below, and then update the settings.
Notes:

     In the FIPS mode, change the keystore type to BCFKS and then change the file extension to .bcfks in the following
     sample settings.
     The following examples use default passwords for demo purposes. You must update these passwords to your own
     ones. Similarly, the FQDNs in the following examples are for demo purposes as well. You must update these FQDNs
     based on the actual deployment.
     Restart the related services after you update the settings.

Service Manager server

Copy the cacerts, smserver.p12, and trustedclients.p12 files to the <SM_SERVER_HOME>/RUN folder, and then edit
<SM_SERVER_HOME>/RUN/sm.ini as follows.

  sslConnector:1
  ssl:1
  ssl_reqClientAuth:2
  sslEnabledProtocols:TLSv1.2,TLSv1.3
  ciphers:TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256,TLS_DHE_RSA_WITH_AES_256_GCM_SHA384,TLS_E
  CDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES
  _256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256

  keystoreFile:smserver.p12
  keystorePass:serverkeystore
  truststoreFile:cacerts
  truststorePass:changeit
  ssl_trustedClientsJKS:trustedclients.p12
  ssl_trustedClientsPwd:trustedclients

Note: If you don't want to restrict access to the server to only those clients whose certificates are in a list of trusted clients,
set the ssl_reqClientAuth parameter to 1, and you don't need to configure the ssl_trustedClientsJKS and


ssl_trustedClientsPwd parameters.

Chat server

Copy the smrootca.p12 and smchatserver.p12 files to the <CHAT_SERVER_HOME>/resources/security folder, and then edit
<CHAT_SERVER_HOME>/conf/openfire.xml as follows.

  <securityConfig>
      <ssl>
           <keyStoreType>PKCS12</keyStoreType>
           <keyStorePath>resources/security/smchatserver.p12</keyStorePath>
           <keyStorePassword>serverkeystore</keyStorePassword>
           <trustStorePath>resources/security/smrootca.p12</trustStorePath>
           <trustStorePassword>caroot</trustStorePassword>
           <clientTrustStorePath>resources/security/smrootca.p12</clientTrustStorePath>
           <clientTrustStorePassword>caroot</clientTrustStorePassword>
      </ssl>
      ...

  </securityConfig>

Sign in to the Openfire Administration Console. Click Server > Server Settings > Client Connections. In the Plain-text (with
STARTTLS) connections section, activate the Advanced Configuration... link. Set STARTTLS policy to Required, and then
set Mutual Authentication to Needed.

Chat service

Copy the smrootca.p12, smchatservice.p12, and smchatsericeclient.p12 files to the <CHAT_SERVICE_HOME>/conf folder, and
then copy the app.properties and config.yml files from the <CHAT_SERVICE_HOME>/conf/samples/https folder to the
<CHAT_SERVICE_HOME>/conf folder. Edit the app.properties file as follows.

  app.clientKeyStoreType=PKCS12
  app.clientKeyStorePath=../conf/smchatserviceclient.p12
  app.clientKeyStorePassword=clientkeystore

  app.keyStoreType=PKCS12
  app.keyStorePath=../conf/smchatservice.p12
  app.keyStorePassword=serverkeystore

  app.trustStoreType=PKCS12
  app.trustStorePath=../conf/smrootca.p12
  app.trustStorePassword=caroot

IdM admin

Copy the IdM client truststore to the WEB-INF\classes\conf folder. Edit the WEB-INF\classes\conf\IdmConfig.xml file, set
the trustAll attribute to false , and then configure the client truststore. For example:

  <client trustAll="false" ...>
      ...
      <trustStoreFile>WEB-INF/classes/conf/smrootca.p12</trustStoreFile>
      <trustStoreType>PKCS12</trustStoreType>
      <trustStorePass>your encrypted password for the client truststore</trustStorePass>
      ...

  </client>

IdM service

Copy the idmservice.p12 file to the <TOMCAT_HOME>/conf folder, and then edit the <TOMCAT_HOME>/conf/server.xml file
as follows.


  ...
  <Connector port="8443" protocol="org.apache.coyote.http11.Http11NioProtocol"

                      maxThreads="150" SSLEnabled="true"
                      proxyName="apache.yourdomain.net" proxyPort="443">
         <SSLHostConfig>
                 <Certificate certificateKeystoreFile="conf/idmservice.p12"

                                        certificateKeystorePassword="serverkeystore"
                                        certificateKeystoreType="PKCS12" />
         </SSLHostConfig>
  </Connector>
  ...

In this example, proxyName is the FQDN of the Apache HTTP Server, and proxyPort is the SSL port of the Apache HTTP
Server.
If you want to use the AJP protocol between the Apache HTTP Server and Tomcat, enable the AJP connector in the
<TOMCAT_HOME>/conf/server.xml file as follows.

  ...
  <Connector protocol="AJP/1.3"

                      secret="MyT0mcAt"
                      tomcatAuthentication="false"
                      address="0.0.0.0"
                      port="8009"
                      redirectPort="8443" />
  ...

You must change secret to your own secret.

Web tier

Copy the smrootca.p12 and smwebtier.p12 files to <Customize-Folder>/config folder if the customize-folder parameter is
set in the web.xml, and then append the following scripts to the <Customize-Folder>/config /webtier.properties file.

  ssl=true
  keystore=<Customize-Folder>/config/smwebtier.p12
  keystorePassword=clientkeystore
  cacerts=<Customize-Folder>/config/smrootca.p12
  cacertsPassword=caroot
  cookie.secure=true

Copy the smrootca.p12 and smwebtier.p12 files to <WEBTIER>/WEB-INF folder if the customize-folder parameter is not set
in the web.xml, and then append the following scripts to the <WEBTIER>/WEB-INF/webtier.properties file.

  ssl=true
  keystore=/WEB-INF/smwebtier.p12
  keystorePassword=clientkeystore
  cacerts=/WEB-INF/smrootca.p12
  cacertsPassword=caroot
  cookie.secure=true

Mobility

Copy the smrootca.p12 and smmobility.p12 files to the <MOBILITY>/WEB-INF folder, and then edit the <MOBILITY>/WEB-
INF/web.properties file as follows.


  endpoint=https://smserver.yourdomain.net:13443/SM/ui
  cacerts=/WEB-INF/smrootca.p12
  cacertsPassword=caroot
  keystore=/WEB-INF/smmobility.p12
  keystorePassword=clientkeystore

Apache HTTP Server

The apache SSL config file differs depending on different platforms:
     Windows
     The apache SSL config file is <APACHE24_HOME>/conf/extra/httpd-ssl.conf , the <APACHE24_HOME> refers to the
     install directory of the Apache HTTP Server.
     You need to load necessary modules and include the httpd-ssl.conf file in
     the <APACHE24_HOME>\conf\httpd.conf file first, for example:

          ...
          LoadModule socache_shmcb_module modules/mod_socache_shmcb.so
          ...
          LoadModule ssl_module modules/mod_ssl.so
          ...
          # Secure (SSL/TLS) connections
          Include conf/extra/httpd-ssl.conf
          ...

     Linux
     The apache SSL config file is <APACHE24_HOME>/conf.d/ssl.conf , the <APACHE24_HOME> refers to
     the /etc/httpd directory.
Copy the smrootca.crt, apache.crt, and apache.key files to the <APACHE24_HOME>/conf/ folder, and then edit the apache
SSL config file as follows.

  <VirtualHost _default_:443>
      SSLEngine on
      ServerName apache.yourdomain.net:443
      SSLCertificateFile "${ServerRoot}/conf/ssl/apache.crt"
      SSLCertificateKeyFile "${ServerRoot}/conf/ssl/apache.key"
      SSLCACertificateFile "${ServerRoot}/conf/ssl/smrootca.crt"
      SSLProxyEngine on
      SSLProxyCACertificateFile "${ServerRoot}/conf/ssl/smrootca.crt"
      ...

  </virtualhost>

Note: The SSLCACertificateFile directive is only needed if you set up the Common Access Card (CAC) sign-on in the web
tier. It needs to be the root CA certificate of your organization in the production environment. In the test and development
environment, you need to use smrootca.crt if the end-users' certificate is issued by the Service Manager private CA.
It's strongly recommended that you set secure TLS protocols and cipher suites in the apache SSL config file. For example:

  SSLProtocol all -TLSv1.1 -TLSv1 -SSLv3
  SSLProxyProtocol all -TLSv1.1 -TLSv1 -SSLv3
  SSLCipherSuite ECDHE:!SHA1
  SSLProxyCipherSuite ECDHE:!SHA1

Note:
     You can use the openssl ciphers -v command to view effective cipher suites of the given cipher-spec string.
     For example:
      Windows:


        <APACHE24_HOME>\bin\openssl ciphers -v "ECDHE:!SHA1"

     Linux:

        openssl ciphers -v 'ECDHE:!SHA1'

     You can also set explicit cipher suites instead of aliases.
     For example:

          SSLCipherSuite TLS_AES_256_GCM_SHA384:TLS_AES_128_GCM_SHA256:ECDHE-ECDSA-AES256-GCM-
          SHA384:ECDHE-RSA-AES256-GCM-SHA384

Depending on the protocol you want to use between the Apache HTTP Server and Tomcat, you need to add some additional
settings to the apache SSL config file.

     AJP
     Use the ajp:// prefix when defining the URL of the ProxyPass or BalancerMember directive. For example:

          # If the backend is a tomcat cluster
          <Proxy "balancer://webtierCluster">

             BalancerMember "ajp://smwebtier.yourdomain.net:8009" secret=MyT0mcAt route=1.1
          timeout=300

             BalancerMember "ajp://smwebtier.yourdomain.net:8019" secret=MyT0mcAt route=1.2
          timeout=300

             ProxySet lbmethod=bybusyness stickysession=JSESSIONID nofailover=On
          </Proxy>
          ProxyPass /webtier balancer://webtierCluster/webtier

          # If the backend is a single tomcat instance
          ProxyPass /mobility ajp://smmobility.yourdomain.net:8009/mobility secret=MyT0mcAt retry=0

     HTTPS
     Use the https:// prefix when defining the URL of the ProxyPass or BalancerMember directive. For example:

          # If the backend is a tomcat cluster
          <Proxy "balancer://webtierCluster>

             BalancerMember "https://smwebtier.yourdomain.net:8443" route=1.1 timeout=300
             BalancerMember "https://smwebtier.yourdomain.net:8453" route=1.2 timeout=300
             ProxySet lbmethod=bybusyness stickysession=JSESSIONID nofailover=On
          </Proxy>
          ProxyPass /webtier balancer://webtierCluster/webtier
          <Location "/webtier">
             RequestHeader set X-Forwarded-Host expr=%{HTTP_HOST}
             RequestHeader set X-Forwarded-Proto expr=%{REQUEST_SCHEME}
          </Location>

          # If the backend is a single tomcat instance
          ProxyPass /mobility https://smmobility.yourdomain.net:8443/mobility retry=0

     Note: For the webtier, you need either set the X-Forwarded-* HTTP request headers as above, or set
     the webtierFullUrl parameter in the webtier.properties file. The webtierFullUrl parameter takes precedence over the X-
     Forwarded-* headers.
Note:
o The secret value must be the same as what defined for the AJP connector in the Tomcat configuration.


o If the backend is a single tomcat instance, use the simple ProxyPass directive.
o If the backend is a tomcat cluster, use the loading balancer configuration. Note that the route value must be the same as
the jvmRoute attribute defined in the Tomcat configuration.

Tomcat

If you want to launch multiple Tomcat instances to form a cluster, you need to set the jvmRoute attribute in the <Engine>
element in the <TOMCAT_HOME>/conf/server.xml file. The value must be unique among all Tomcat instances. For example:

  <Engine name="Catalina" defaultHost="localhost" jvmRoute="1.1">
      ...

  </Engine>

Depending on the protocol you want to use between the Apache HTTP Server and Tomcat, you can use either of the
following settings.

     AJP
     Edit the <TOMCAT_HOME>/conf/server.xml file as follows.

          ...
          <Connector protocol="AJP/1.3"

                              secret="MyT0mcAt"
                              tomcatAuthentication="false"
                              address="0.0.0.0"
                              port="8009"
                              redirectPort="8443" />
          ...

     You must update the value of secret to your actual secret value.
     HTTPS
     Copy the Tomcat certificate keystore file for the SM components (such as mobilitytomcat.p12 or tomcat.p12) to the
     <TOMCAT_HOME>/conf folder, and then edit the <TOMCAT_HOME>/conf/server.xml file as follows.

          ...
          <Connector port="8443" protocol="org.apache.coyote.http11.Http11NioProtocol"

                              maxThreads="150" SSLEnabled="true">
                 <SSLHostConfig>

                        <Certificate certificateKeystoreFile="conf/tomcat.p12"
                                                certificateKeystorePassword="serverkeystore"
                                                certificateKeystoreType="PKCS12" />

                 </SSLHostConfig>
          </Connector>
          ...

WebSphere Application Server Liberty

Check whether the ${wlp.user.dir}/servers/serverName/resources/security folder exists or not. If not, create this folder and
then copy the WebSphere Application Server Liberty certificate keystore file for the SM components (such
as mobilitywasliberty.p12 or wasliberty.p12) to it. Next, refer to the following example to update the
${wlp.user.dir}/servers/serverName/server.xml file.


  <!-- Enable features -->
         <featureManager>
                            <feature>servlet-6.0</feature>
                            <feature>ssl-1.0</feature>
                            <feature>pages-3.1</feature>
         </featureManager>

  <httpSession idLength="128" useContextRootAsCookiePath="true"/>

  <!-- To access this server from a remote client add a host attribute to the following element,
  e.g. host="*" -->
  <httpEndpoint id="defaultHttpEndpoint"

                                     enabled="true"
                                     host="*"
                                     httpPort="9080"
                                     httpsPort="9443" />

  <!-- default SSL configuration is defaultSSLSettings -->
         <sslDefault sslRef="defaultSSLSettings"/>
         <ssl id="defaultSSLSettings"
                   keyStoreRef="defaultKeyStore"/>
         <keyStore id="defaultKeyStore"
                            location="wasliberty.p12"
                            password="serverkeystore"
                                        type=" PKCS12"/>

The example above only specifies the default SSL certificate, keystore, and configuration in Liberty. For more detailed
instructions about how to enable SSL communication in Liberty, see Enabling SSL communication in Liberty.

JBoss Web Server

Refer to all configurations as described in the Tomcat section on this page.

Smart Analytics

Refer to Configure TSL/SSL for two-way authentication in the Smart Analytics administrator tasks documentation to set up a
TLS/SSL connection between Service Manager and the Smart Analytics main server, the Connector Framework Server
(CFS)/connectors, or the Media Server.

Windows Client

Copy the smrootca.p12 and <username>.p12 files to the <WINDOWS_CLIENT_HOME>\configuration folder, and then launch
the Windows client. Click Window > Preferences > Service Manager > Security, and then edit the settings as follows.

     CA certificates file: <WINDOWS_CLIENT_HOME>\configuration\smrootca.p12
     CA certificates password: caroot
     Client keystore file: <WINDOWS_CLIENT_HOME>\configuration\<username>.p12
     Client keystore password: clientkeystore


1.8.12.3. Configure one-way SSL

If you don't set up Trusted sign-on (TSO) or Common Access Card (CAC) sign-on, the two-way SSL is not mandatory. You
can use one-way SSL to simplify the configuration.

Requirements for required SSL encryption

This configuration is intended for customers who:

     Want to require SSL encryption for all connections
     Want to protect against complex SSL-related attacks
     Want to authenticate that the Service Manager server is a valid host

Certificates required

You must create or obtain the following certificates for SSL encryption.

     Certificate authority certificate
     Keystore containing the certificate authority's certificate
     Service Manager server certificate

Private keys required

You must create or obtain the following private keys for SSL encryption.

     Certificate authority's private key (This key is only necessary if you are managing your own private certificate authority)
     Service Manager server private key

Parameters required in the server configuration file (sm.ini)

     keystoreFile – identify the keystore file containing the Service Manager server's certificate and private key
     keystorePass – identify the password to the keystore file containing the Service Manager server's certificate and private
     key
     ssl:1
     sslConnector:1
     truststoreFile – identify the keystore file containing the certificate authority's certificate
     truststorePass – identify the password to the keystore file containing the certificate authority's certificate

Parameters required in the web tier configuration file (web.xml)

You can optionally set the customize-folder parameter in web.xml so that the <Customize-Folder>/config/webtier.properties
file can be shared by multiple web tier instances on the same host.

     customize-folder – specify the absolute path to a folder on the web tier host in which the webtier.properties file is
     located

Parameter required in the <Customize-Folder>/config/webtier.properties or <WEBTIER>/WEB-INF/webtier.properties file
You must set the following web parameter:

     ssl:true
     cacerts – identify the truststore file containing the certificate authority that signed the server's certificate
     cacertsPassword – identify the password for the truststore

Windows client preferences required

You must set the following preference from the Window > Preferences > Service Manager > Security menu.

     CA certificates file – identify the truststore file containing the certificate authority that signed the server's certificate
     CA certificates password – identify the password for the truststore

Other requirements

You must do the following additional steps to ensure that Service Manager can use your private certificates.

     Add your private certificate authority's certificate to a keystore that your web and Windows clients can access


     Ensure that the Service Manager server's host name matches the common name (CN) listed in the server's signed
     certificate

Configure one-way SSL

The overall one-way SSL configuration is similar to two-way SSL configuration. Refer to Configure two-way SSL but skip the
following tasks:

     Generate client certificates.
     Configure the keystore related parameters in various client configuration files.

           <SM_SERVER_HOME>/RUN/sm.ini
                 ssl_trustedClientsJKS
                 ssl_trustedClientsPwd

           <CHAT_SERVICE_HOME>/conf/app.properties
                 app.clientKeyStoreType
                 app.clientKeyStorePath
                 app.clientKeyStorePassword

           <WEBTIER>/WEB-INF/webtier.properties
                 keystore
                 keystorePassword

           <MOBILITY>/WEB-INF/web.properties
                 keystore
                 keystorePassword

           Windows Client security settings
                 Client keystore file
                 Client keystore password

Meanwhile, disable the client certificate authentication in the Service Manager server and the chat server.

     SM server

     Edit the <SM_SERVER_HOME>/RUN/sm.ini file as below.

          ssl_reqClientAuth:0

     Chat Server

     Sign in to the Openfire Administration Console. Click Server > Server Settings > Client Connections. In the Plain-text
     (with STARTTLS) connections section, activate the Advanced Configuration... link. Set STARTTLS policy to Required,
     and then set Mutual Authentication to Disabled


1.8.12.4. TLS 1.2 support and configuration

When the Service Manager web tier and the Mobility client act as TLS/SSL servers, they use the Oracle or IBM Java virtual
machine (JVM) that's required by your third-party web applications server to securely manage and connect incoming client
requests that use TLS or SSL protocols. Examples of client requests include requests that originate from web browsers that
are running on end-user's workstations. Depending on the third-party web application server, these connections default to
the highest supported version of the TLS/SSL protocol. We don't provide the software that hosts the Service Manager web
tier or Mobility client products; and it is this software that controls the specific TLS/SSL protocols that are used. As such, we
recommend that you consult the vendor of your browser and third-party web application server (such as IBM Websphere and
Apache Tomcat) for information about how to configure TLS 1.2.

As of Service Manager 9.41, the web tier, Mobility client and Windows client use TLS 1.2 by default.

The Service Manager server uses Java to securely manage and connect incoming client requests that use TLS and SSL
protocols. In this scenario, the Service Manager server is acting as a TLS/SSL server. As of Service Manager 9.41, the Service
Manager server uses TLS 1.2 by default. To enforce the TLS 1.2 protocol, configure the following parameter in the sm.ini file:

sslEnabledProtocols:TLSv1.2

            Note

           TLS 1.0 and 1.1 are versions of the TLS protocol that are no longer considered secure and have been disabled by
           default. If you encounter issues, you can, at your own risk, re-enable the versions. See Re-enable the acceptance
           of a Java certificate algorithm for more information.

When the Service Manager server acts as a TLS/SSL client, it uses OpenSSL to connect to the Directory Services server via
the secure LDAP protocol. Secure LDAP is also known as LDAP over SSL (LDAPS). Depending on the Directory Service
server, these connections will default to the highest supported version of the TLS/SSL protocol. To force the Service Manager
server to establish only TLS 1.2 connections with the LDAP server, set the following environment variable in the operating
system:

LDAPTLS_PROTOCOL_MIN=3.3

            Note

           For information about how to set an environment variable, refer to your operating system's documentation or to
           your server administrator.

The Service Manager server may act as a TLS/SSL client to securely connect to SMTP servers or to consume third-party
external Web Services over HTTPS, depending on the SMTP Server or the Web Services server. These connections will
default to TLS 1.2. To enforce the TLS 1.2 protocol for these scenarios, configure the following parameter in the sm.ini file:

sslEnabledProtocols:TLSv1.2


1.8.12.5. TLS 1.3 support and configuration

The TLS/SSL protocol secures the connection between two communication endpoints, typically the client and the server.
OpenText recommends using TLS 1.3 in Service Manager. For web clients, URLs that require a secure connection start with
HTTPS instead of HTTP. You can enable TLS/SSL communications between:

     The browsers and the Service Manager web tier
     The browsers and the Service Manager Mobility client
     The Service Manager web tier and Service Manager server
     The Service Manager Mobility client and Service Manager server
     Service Manager server and optional Directory Services Server (LDAP server)
     Service Manager server and optional Smart Analytics Server (IDOL)
     Service Manager server and third-party Web Services integrations
     Service Manager Smart Email solution and a third-party email server

As of Service Manager 9.80, the Service Manager supports TLS 1.3. To enforce the TLS 1.3 protocol, follow these steps.

Upgrade binaries to Service Manager 9.80

Follow the documents on upgrading the Service Manager binaries:

     Upgrade the Service Manager server

     Upgrade the web tier

     Upgrade the Windows client

     Upgrade the Mobility client

     Upgrade Service Manager Collaboration

     Upgrade Smart Analytics

Prepare certifications

Make sure you have prepared the required certificates for your Service Manager deployment. See Work with the certificate
generation toolkit for detailed information.

Set Service Manager server parameters

Make sure that the following parameters are configured with TLS 1.3 in the sm.ini file:

     sslEnabledProtocols
     ciphers
     pgsslEnableProtocols
     pgsslEnableCiphers

When the Service Manager server acts as a TLS/SSL client, it uses OpenSSL to connect to the Directory Services server via
the secure LDAP protocol. Secure LDAP is also known as LDAP over SSL (LDAPS). Depending on the Directory Service
server, these connections will default to the highest supported version of the TLS/SSL protocol. To force the Service
Manager server to establish only TLS 1.3 connections with the LDAP server, set the following environment variable in the
operating system:

LDAPTLS_PROTOCOL_MIN=3.4

Web application server requirements

You must have a supported web application server to deploy web tier. To enforce the TLS 1.3 protocol, the following
configurations are required:


Application server                                        Apache Tomcat 9.0.13 or above
                                                          IBM WebSphere Application Server Liberty
                                                          JBoss Web Server (JWS) 5.7

Web server                                                Apache HTTP Server 2.4.43 or above is required in order
                                                          to operate a TLS 1.3 web server with OpenSSL 1.1.1
                                                          IIS (bundled with Windows Server 2022)

Meet web browser requirements

Make sure that you are using the latest version of the supported browsers:

     Edge
     Chrome
     Firefox

Integrations

Here is the compatibility matrix between TLS 1.3 and the integrated products.

Integrated Product                      Support TLSv1.3?                       Product Version
APM                                     Yes                                    APM 9.60
SAP                                     No                                     SAP 7.1
Teams                                   No                                     N/A
ALM                                     Yes                                    ALM17
OO                                      Yes                                    OO 2023.05
Octane                                  Yes                                    Octane 16.0.400
PPM                                     No                                     N/A
UCMDB Gateway                           Yes                                    2023.05
Jira                                    Yes                                    2023
                                        Yes                                    2023.05
UCMDB

OBM                                     Yes                                    2023.05


1.8.12.6. Re-enable the acceptance of a Java certificate
algorithm

The Service Manager server no longer accepts Java certificates that are generated by using certain "weak" algorithms. If you
used these algorithms to generate your Java certificates, you must now regenerate them by using a more complex algorithm,
such as RSA.

We strongly recommend that you regenerate the Java certificates by using a more complex algorithm. If it's not practical to
do so, you can disable this enhancement. However, disabling this enhancement lowers the security profile of Service
Manager and you're not adhering to the known security best practices.

Follow these steps to disable this enhancement:

   1. Open the extra.java.security file that's located in the RUN folder.
   2. Comment out or delete the contents of the file.
   3. Restart the Service Manager server.

Alternatively, you can re-enable the acceptance of specific algorithms. For more information about the security best
practices for enabling the secure algorithms, refer to https://wiki.mozilla.org/Security/Server_Side_TLS. Note that disabling
certain algorithms may cause connectivity issues between Service Manager and third-party web service clients. You may
need to perform thorough connectivity testing after you update this file.

The following algorithms are no longer accepted:

     MD5
     DSA
     3DES_EDE
     DES_CBC
     DHE, RC4
     SSLv3
     TLSv1
     ECDH_anon
     DH_anon
     NULL
     DH keySize < 768
     RSA keySize < 2048


1.8.13. Support of the HTTP Strict Transport Security protocol

HTTP Strict Transport Security (HSTS) is a web security policy mechanism, which helps protect web application users from
some passive (eavesdropping) and active network attacks. As of Service Manager 9.72, the HSTS response header is
automatically added on the web tier side when the web parameter cookie.secure is set to true . To enable HSTS for Service
Manager Mobility Client, you only need to enable HSTS in the web server or the web application server. Hence, HSTS adds
an HTTP header named Strict-Transport-Security when establishing an HTTPS session.

            Important

                If you are using a web server (Apache or IIS) in front of your web application server (Tomcat), you only need
                to enable HSTS in the web server; otherwise, you need to enable HSTS in the web application server.
                HSTS works only for ports 80 and 443. Make sure you have configured the web server or web application
                server to use port 80 for HTTP and port 443 for HTTPS.
                To use HSTS, be sure to enable the secureLogin parameter in the Service Manager Mobility Client and
                configure SSL between the web application server and browser.

The following are instructions on how to enable HSTS in the supported web servers and web application servers.

How to enable HSTS in Tomcat

To enable HSTS in Tomcat, follow these steps:

   1. Open the <Tomcat>/conf/web.xml file in a text editor.
   2. Uncomment the httpHeaderSecurity filter definition and the <filter-mapping> section.
   3. Add the hstsMaxAgeSeconds parameter and the antiClickJackingOption parameter as shown below.

          <filter>
                 <filter-name>httpHeaderSecurity</filter-name>
                 <filter-class>org.apache.catalina.filters.HttpHeaderSecurityFilter</filter-class>
                 <init-param>
                     <param-name>hstsMaxAgeSeconds</param-name>
                     <param-value>31536000</param-value>
                 </init-param>
                 <init-param>
                     <param-name>antiClickJackingOption</param-name>
                     <param-value>SAMEORIGIN</param-value>
                 </init-param>
                 <async-supported>true</async-supported>

          </filter>
          ...
          <filter-mapping>

                 <filter-name>httpHeaderSecurity</filter-name>
                 <url-pattern>/*</url-pattern>
                 <dispatcher>REQUEST</dispatcher>
          </filter-mapping>

   4. Save the file.
   5. Restart Tomcat.

How to enable HSTS in Apache

To enable HSTS in an Apache server, follow these steps:

   1. Open the <Apache>/conf/httpd.conf file in a text editor.
   2. Uncomment the header module:


          LoadModule headers_module modules/mod_headers.so

   3. Add a header setting in the VirtualHost section:

          <VirtualHost _default_:80>
          ServerName apache.yourdomain.net:80
          Header always set Strict-Transport-Security "max-age=63072000; includeSubdomains; preload"
          </VirtualHost>

   4. Restart Apache.

How to enable HSTS in IIS

To enable HSTS in IIS, do the following:
   1. Add a Strict-Transport-Security header to the web.config file under the IIS installation root directory:

          <system.webServer>
          <httpProtocol>
          <customHeaders>
          <add name="Strict-Transport-Security" value="max-age=31536000"/>
          </customHeaders>
          </httpProtocol>
          </system.webServer>

   2. Restart IIS.
````
