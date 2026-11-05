---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.8.18 .. 1.8.20
printed_pages: 2565-2592
---

# 1.8.18 SAML-based Single Sign-On

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.8.18. SAML-based Single Sign-On

Security Assertion Markup Language (SAML) is an XML-based, open-standard data format for exchanging authentication and
authorization data between parties. In particular, between an Identity Provider (IdP) and a Service Provider (SP). The single
most important requirement that SAML addresses is web browser single sign-on (SSO). SAML 2.0 is the industry standard for
federated identity management based on Single Sign-On (SSO).

            Tip

           SSO is a session or user authentication process that permits a user to enter the same name and password to
           access multiple web applications.

The SAML 2.0 specification defines an exhaustive list of profiles. By leveraging Identity Manager (IdM), Service Manager
support two essential profiles: Web Browser SSO Profile, and Single Logout Profile. The SAML SSO solution uses IdM as a
Service Provider and a third-party Identity Provider.

Benefits of using SAML SSO

By default, SAML SSO is disabled in Service Manager. When SAML SSO is enabled, if Service Manager shares the same IdP
and LDAP Server with other applications (whether the other applications leverage IdM or not), the user needs to enter a user
name and password only once to log in to all of these web applications. Additionally, this solution supports single logout for
multiple web applications that leverage IdM.

            Note

           Service Manager web tier, mobility client, and Collaboration support SAML SSO.

Using this solution has the following benefits:

     Provides tighter security controls through consistent enforcement of security policies across all applications
     Reduces turnaround time for provisioning and deprovisioning of user accounts in applications
     Fosters identity data collection, access reviews, and security analytics
     Provides single sign-on experience for end users
     Enables new users to gain faster access to the resources needed to perform their jobs
     Eliminates or reduces duplicate user IDs

Note that enabling SAML SSO may slow down user logins. According to laboratory tests by the company, user logins may
take approximately 15% more time.

Supported Identity Providers (IdPs)

Service Manager leverages the IdM service to support SAML-based SSO. The IdM service supports the following SAML 2.0-
compliant IdPs:

     Microsoft Active Directory Federation Services (ADFS) 3.0 or higher

This section uses Microsoft ADFS as an example for the IdP.

Prerequisites

     You must have a working ADFS and have synchronized the system clock with a reliable time source.
     You must have a working IdM service and have already integrated Service Manager with the IdM service. Refer to Install
     the IdM service and Configure IdM authentication in Service Manager for detailed instructions.

            Note

           Configurations in this section are for the classic mode. If you are working with the mixed mode (SMA-SM), refer
          to the Set up SAML authentication topic in the SMA-SM Help Center for detailed instructions.

Related topics


Overview of Service Manager SAML SSO
Create a trusted relying party in ADFS
Configure SAML authentication in IdM
Use a custom certificate for SAML authentication
Renew the IdM SAML SSO Certificate
Renew ADFS certificates


1.8.18.1. Overview of Service Manager SAML SSO

This section provides an overview of how the SAML SSO solution works for Service Manager (SM).

SP-initiated web browser SSO

The following diagram illustrates the web browser SSO process of Service Manager. In this process, the IdM service acts as
an SP to the IdP.

            Caution

           Use the standalone version of the IdM service released with Service Manager if you are not using SMA Service
           Portal. Otherwise, use the built-in IdM service in& SMA Service Portal.

The SM client (Web Tier or Mobility Client) uses a built-in IdM client as a filter to obtain an "IdM access token" from the IdM
service and then passes the token to the SM Server. The SM Server then validates the IdM access token.

            Note

           LDAP authentication is replaced by IdM; however, the LDAP data mapping is retained in the SM Server.

The following table further explains each step in this process.  Page 152 of 251

This PDF was generated on May 23, 2026

Step                                    Description

1                                       When the user launches the SM client (Web Tier or Mobility

                                        Client) web URL in the browser, the IdM Client embedded

                                        in the SM client sends a request to the IdM service for a

                                        request token.

2                                       The IdM service returns a response along with a request

                                        token to the built-in IdM client of the SM client (SM Web

                                        Tier or Mobility Client).

3                                       The IdM client redirects the request to the IdM service

                                        along with that token, and the IdM service then redirects it

                                        to the IdP login page with a SAML request.

4                                       The user enters a user name and password to log in to SM

                                        from the IdP login page.

                                                  Note

                                                  Users log in to Service Manager through the
                                                  IdP page, and their IdP login name is
                                                  determined by the IdP. That is, users need to
                                                  enter their login name using the format
                                                  required by the IdP. For example, when ADFS is
                                                  used as the IdP, the login name must be either
                                                  "userPrincipalName" (xxx@xxx.com) or
                                                  "domain\samAccountName".

5                                       The IdP redirects the request to the IdM service with a

                                        SAML response, and then the IdM service redirects the

                                        request to the SM client (Web Tier or Mobility Client) along

                                        with an "Access Token". Additionally, the IdM service

                                        writes a cookie named LWSSO_COOKIE_KEY to the

                                        browser.

6                                       The SM client (Web Tier or Mobility Client) logs in to the

                                        SM Server with that "Access Token".

7                                       The user is logged in to SM.

Web browser single logout

The SAML SSO solution supports single logout for legacy HPE web applications that leverage Identity Manager (IdM). Once
logged out of one application, the user is automatically logged out of the rest of the applications. This single logout behavior
applies to the SM Web Tier and Mobility Client.

Non-browser login

The SM Windows client and web service clients aren't browser-based applications. Login to SM from these clients is referred
to as "non-browser login", which doesn't support SAML. These clients log in to the SM Server through either a password or a
token. The token is an LW-SSO token when using the legacy LW-SSO solution or an IdM token when using the IdM solution.

     For password login, the login logic is the same as before. That is, the login process doesn't involve IdM.
     For LW-SSO token login, the SM Server provides a new interface for third- party applications to log in to SM using an
     IdM access token. The SM Server adds a new http header named “X-Idm-Token”, which contains the string value of the
     IdM access token.

Users must enter their login name that's determined by the LDAP field mapping on the SM side. For example, if the name field
in the SM operator table is mapped to the samAccountName field in ADFS, users must enter their samAccountName value


as the login name.


1.8.18.2. Create a trusted relying party in ADFS

ADFS helps you use single sign-on (SSO) to authenticate users to multiple, related web applications over the life of a single
online session. Once ADFS is installed and configured to authenticate users from an LDAP directory, you are ready to add the
IdM metadata to ADFS to add the IdM service as a trusted relying party.

            Note

           The IdM service will automatically generate a self-signed certificate with one-year validity at the first startup for
           encrypting the SAML token. If you want to use a custom certificate for SAML authentication, you can configure
           the custom certificate before downloading the IdM SAML metadata. See Use a custom certificate for SAML
           authentication for detailed instructions.

Follow these steps to add the IdM service as a trusted relying party to ADFS:

   1. (Optional) Configure the SAML entity base URL.
     Skip this step if there is no reverse proxy or load balancer on top of the IdM service.
        1. Sign in to the IdM admin console (https://apache.yourdomain.net/idm-admin) as a system administrator.
        2. Click GLOBAL SETTINGS, then click the SAML > Entity Base URL property, and then set the value to
           https://apache.yourdomain.net/idm-service.

   2. Download the IdM SAML metadata.
     Download the metadata from https://apache.yourdomain.net/idm-service/saml/metadata. Save this file as
      idm_saml_metadata.xml , and then copy this file to the ADFS server.

   3. In the ADFS Management Console, click Add Relying Party Trust.

   4. Click Start.                      Page 155 of 251

This PDF was generated on May 23, 2026

5. Select Import data about the relying party from a file, and then select the IdM metadata file ( idm_saml_metadata.xml )
  that you created previously. Click Next.

6. Specify a display name for the IdM service, and then add optional notes. Click Next.


7. Click Next.

8. You are now in the Ready to Add Trust step. Check that the Endpoints tab contains multiple endpoint values. If not,
  verify that your metadata was generated with https protocol URLs.


9. Leave the Open the Edit Claim Rules dialog checkbox selected, and click Close to close the wizard.

10. The Add Transform Claim Rule wizard opens. Perform the steps below to configure the NameID element as part of the
    Subject in the SAML Response message.

       1. Select Add Rule, and then select Send LDAP Attributes as Claims. Click Next.


2. Specify the following fields to configure the claim rule:
        Claim rule name: enter NameID
        Attribute store: select Active Directory
        LDAP Attribute: select SAM-Account-Name
        Outgoing claim type: select Name ID
        Token-Groups - Unqualified Names: select Group Name


Important

The outgoing claim of Name ID is finally used as the username in the IdM access token. If IdM also
integrates Service Manager Collaboration in your environment, it's mandatory that the login name of
the authenticated operator is the same as the username in the IdM access token. Otherwise, Service
Manager Collaboration will not work. In this case, if you choose to synchronize users from LDAP, you
need to make sure that the LDAP attribute mapped to Name ID here is also mapped to the name field of
the operator when you configure LDAP field mapping in Service Manager.

If you want the Service Manager server to synchronize user information from the IdM service instead of the LDAP,
you should map additional LDAP attributes to the outgoing claim types as follows.

Outgoing Claim Type                                        IdM User Attribute Name
username                                                   Username
firstName                                                  First Name
familyName                                                 Family Name

middleName                                                 Middle Name

officePhoneNumber                                          Office Phone Number
homePhoneNumber                                            Home Phone Number
mobilePhoneNumber                                          Mobile Phone Number
zipCode                                                    Zip Code
language                                                   Language
location                                                   Location
email                                                      User Email

For example, you may need to add additional mappings as follows.

LDAP Attribute                                             Outgoing Claim Type
Given-Name                                                 firstName
Surname                                                    familyName
Telephone-Number                                           officePhoneNumber
User-Principal-Name                                        email

3. Close the wizard and the Apply the claim rules window.


1.8.18.3. Configure SAML authentication in IdM

To configure SAML authentication in IdM, follow these steps:
   1. Download the SAML metadata from the ADFS server (for example,
     https://adfs.yourdomain.net/FederationMetadata/2007-06/FederationMetadata.xml) and then save this file as
      FederationMetadata.xml .
   2. Sign in to the IdM admin console (https://apache.yourdomain.net/idm-admin) as a system administrator.
   3. Click the SM organization. Click Authentication > CONFIGURATIONS > Add (+), and then select the SAML
     authentication type to create an SAML authentication configuration. For example:
           Display Name: samlAuthConfig
           IDP Metadata: upload the FederationMetadata.xml file or copy its content to the text area on the right.

4. After you create the SAML authentication configuration, click Authentication > CONFIGURATION GROUPS > Add (+) to
  create a configuration group. For example:

        Name: saml
        Display Name: SAML Auth Group
        Configurations: samlAuthconfig


Verify the SAML SSO setup for Service Manager

Once you have completed all configurations required for SAML SSO, you are ready to verify if the setup is successful.
To verify the setup, follow these steps:

   1. Make sure all components are started, including the SM Server, client (web tier or Mobility Client), the standalone IdM
     service, and the identity provider (IdP, that is, ADFS).

   2. Launch the Service Manager web application URLs from a supported web browser (see the Service Manager Support
     Matrix).
           SM web tier URL: http://<web tier host>:<port>/<web tier name>/index.do
           Mobility Client URL: http://<Mobility Client host>:<port>/<Mobility application name>

   3. Verify that the browser redirects you to the IdP login page.
   4. Enter your username and password to sign in to one of the web applications.
   5. Verify that you are automatically signed in to the rest of the web applications without the need to enter your credentials.

                   Note

                ADFS doesn't allow you to select a login language. You are signed in to Service Manager with a language
                depending on which client you are using:

                      Web tier client: your browser language if the acceptBrowserLang parameter is set to true (default), or
                      your operator's language if this parameter is set to false
                      Mobility Client: your browser language
   6. Sign out of one of the Service Manager web applications.
   7. Verify that you are automatically signed out of the rest of the web applications.

            Tip

           If any of the verification steps fails, see Troubleshoot security.


1.8.18.4. Use a custom certificate for SAML authentication

Follow these steps to configure a custom certificate for SAML authentication.
   1. Create a self-signed certificate by using OpenSSL. For example, run the following command to create a self-signed
     certificate with 3 years validity.

          openssl req -x509 -newkey rsa:2048 -nodes -days 1095 -subj "/CN=IdM SAML Encryption" -
          keyout idmsaml.key -out idmsaml.crt

   2. Sign in to the IdM admin console ( https://apache.yourdomain.net/idm-admin ) as a system administrator.
   3. Click GLOBAL SETTINGS, and then click the SAML / RENEW CERTIFICATE button. Drag or click to upload the

      idmsaml.crt or idmsaml.key file, and then click the UPLOAD button, or you can copy its content to the text area on the
     right.
     For example:

   4. Click SAVE.                       Page 163 of 251
   5. Restart Tomcat.

This PDF was generated on May 23, 2026

1.8.18.5. Renew the IdM SAML SSO Certificate

You need to renew the IdM SAML SSO certificate before it expires. Depending on the certificate type that the IdM service
uses, you can renew the certificate in different ways.

Generate self-signed certificate automatically

Follow these steps:

   1. Sign in to the IdM admin console ( https://apache.yourdomain.net/idm-admin ) as a system administrator.
   2. Go to GLOBAL SETTINGS, clear the value for the SAML / SSO Certificate and SSO PrivateKey parameters.
   3. Select the Generate checkbox and click the GENERATE button to generate a self-signed certificate, then click SAVE. For

     example:

   4. Restart Tomcat. The IdM service will automatically generate a self-signed certificate again.
   5. Download new metadata from the IdM service, remove the old relying party trust in ADFS, and then create a new relying

     party trust. For detailed instructions, see Create a trusted relying party in ADFS.

Custom certificate

Follow these steps:

   1. Create a new self-signed certificate and upload it to the IdM service. For detailed instructions, see Use a custom
     certificate for SAML authentication.

   2. Copy the idmsaml.crt to the ADFS server, then rename this file to idmsaml.cer .

   3. Open the ADFS management console. Double-click the SM-IDM relaying party trust, and then switch to
     the Encryption tab page. Click the Remove button to remove the existing certificate, then click the Browse button to
     add the idmsaml.cer .


4. Switch to the Signature tab. Select the existing certificate, and then click the Remove button. Click the Add button to
  add the idmsaml.cer .

   5. Click OK.                         Page 165 of 251

This PDF was generated on May 23, 2026

1.8.18.6. Renew ADFS certificates

The ADFS may automatically roll over its certificates, or you may manually renew certificates for the ADFS.
After you renew the certificates, you need to update the ADFS metadata for the SAML authentication by following steps
below:

   1. Download the SAML metadata from the ADFS server (for example,
      https://adfs.yourdomain.net/FederationMetadata/2007-06/FederationMetadata.xml ). Save this file as
      FederationMetadata.xml .

   2. Sign in to the IdM admin console ( https://apache.yourdomain.net/idm-admin ) as a system administrator.
   3. Click the SM organization. Click Authentication > CONFIGURATIONS > samlAuthConfig, and then click the Edit button.

     Select the IDP Metadata radio button, upload the FederationMetadata.xml file or copy its content to the text area on
     the right. For example:

   4. Click SAVE.                       Page 166 of 251

This PDF was generated on May 23, 2026

1.8.19. OIDC-based Single Sign-On

OpenID Connect (OIDC) is a simple identity layer on top of the OAuth protocol. It allows clients to verify the identity of the
end-user based on the authentication performed by an authorization server, as well as to obtain basic profile information
about the end-user in an interoperable and REST-like manner.
Users can access Service Manager after the OIDC configurations are completed. The user profile is synced to Service
Manager after the user signs in for the first time. If the user profile is updated in the identity provider, the updated information
will also be synced to Service Manager when the user signs in.

Step 1: Install Idm service and the IdM admin console

See Install Identity Manager (IdM) for detailed instructions.

Step 2: Install and configure IdP service

You can configure Service Manager to allow the users to sign in using Identity Provider (IdP) credentials.
In the following settings, Keycloak performs as the IdP for user authentication as an example.
You may refer to the Keycloak documentation (https://www.keycloak.org/getting-started/getting-started-zip) for detailed
information on Keycloak installation and setup.

Create Client in IdP

   1. Open Keycloak admin console (http://<hostserver>:<port>) and sign in as admin .
   2. Click the Create realm button to create a realm.

     For example:

   3. Select the realm in step 2, and then click the Clients > Create client button to create a client.
     For example:



Note that if you have upgraded Service Manager to 9.80 p1 or above, which implements idm 24.2.1 and updated
keycloak to 24.x version, then the URL configurations of above image need to be set as below:

   4. After creation, edit the settings of the client sm as below:  Page 169 of 251
           Consent Required: ON
           Login Theme: keycloak
           Note:

This PDF was generated on May 23, 2026

        - If your Keycloak version is 18 or above and you haven't applied the 9.80 p1 or later patch, you need to configure
        the following parameter in the keycloak.conf file, which is under the <keycloak installation>/conf path.
         spi-login-protocol-openid-connect-legacy-logout-redirect-uri=true
        Then, restart Keycloak for the changes to take effect.
        - It is assumed that you deployed the IdM service behind the Apache HTTP server. If there is no reverse proxy or
        load balancer exists in front of the IdM service, the URL exposed by the Tomcat should be used. For
        example: https://idmservice.yourdomain.net:8443/idm-service/idm/v0/oauth2.
5. Add mappers for custom user attributes if necessary.
6. Mark down the following settings which are required when you configure OAuth in the IdM:
        The secret of the client sm . You can copy it from the Credentials tab.

        The endpoints of the realm itom . You can view endpoints by clicking the OpenID Endpoint Configuration link.

Step 3: Create an OAuth configuration in IdM

   1. Sign in to the IdM admin console (https://apache.yourdomain.net/idm-admin) as a system administrator.

   2. Click the Organization tab, and then click the organization you created for OAuth configuration.
   3. Click Authentication > CONFIGURATIONS > Add (+) , and select the authentication type as OAUTH to create an

     OAuth authentication confguration.

Field                                                  OAuth configuration                        Service Manager 9.81
Display Name
Shared in same family                   Required                            Description
Client ID                               Yes
Client Sercet                           No                                  The display name of this
HTTP Method                             Yes                                 configuration.
                                        Yes
IDP URL                                 Yes                                 Share the authentication settings
Redirect URL                                                                within the same family. The
Scope                                   Yes                                 supported values are "false" and
                                        Yes                                 "true''.
State Supported                         Yes
Username Attribute                                                          The value of Client ID that you get
User Info Endpoint                      No                                  from the OpenID identity provider.
                                        Yes
                                        Yes                                 The value of Client Secret that you
                                                                            get from the OpenID identity
                                                                            provider.

                                                                            The HTTP method of getting a
                                                                            user's information from the
                                                                            endpoint. The supported values are
                                                                            "GET" and "POST".

                                                                            Caution: By selecting The GET
                                                                            option, you are disabling or
                                                                            bypassing security features, thereby
                                                                            exposing the system to increased
                                                                            security risks. By using this option,
                                                                            you understand and agree to
                                                                            assume all associated risks and hold
                                                                            the company harmless for the same.

                                                                            The endpoint or URL path provided
                                                                            by the OpenID Identity Provider. The
                                                                            URL set for "Redirect URL" will be
                                                                            directed to the IDP URL.

                                                                            The value of redirect URL of the IDP
                                                                            URL for sign in.

                                                                            The value of scope. For example,
                                                                            "profile openid phone".

                                                                            Note: Be sure to add the client
                                                                            scope phone if you want Keycloak
                                                                            to add phone number in the claim.

                                                                            Whether support the State
                                                                            Supported feature. The supported
                                                                            values are "false" and "true''.

                                                                            The attribute to define a username.
                                                                            For example, "preferred_username".

                                                                            An OAuth 2.0 Protected Resource
                                                                            that returns Claims about the
                                                                            authenticated end user. For
                                                                            example, /userinfo.

Field                                   Required                        Service Manager 9.81
Token Endpoint                          Yes
                                                  Description
Authentication Endpoint                 Yes
                                                  The token endpoint of the OpenID
Logout Endpoint                         No        identity provider. The Token
                                                  Endpoint is used to obtain a Token
Additional Parameter                    No        Response. For example, /token.

                                                  The Authorization Endpoint
                                                  performs authentication of an end
                                                  user. This is done by sending the
                                                  user agent to the authorization
                                                  server's endpoint for authentication
                                                  and authorization, using request
                                                  parameters defined by OAuth 2.0
                                                  and additional parameters and
                                                  parameter values defined by OpenID
                                                  Connect. For example, /auth.

                                                  The token endpoint where you can
                                                  end a session.

                                                  For example:

                                                  /logout?
                                                  redirect_uri=https://apache.yourdom
                                                  ain.net/webtier/goodbye.jsp

                                                  The additional parameter for
                                                  authentication.

Here is an example:


Note that if you have upgraded Service Manager to 9.80 p1 or above, which implements idm 24.2.1 and updated


keycloak to 24.x version, then you don't need to add the "redirect_uri" parameter for Logout Endpoint:

Create a configuration group for OAuth

To create a configuration group for OAuth, follow these steps:

   1. After you create an OAuth configuration, from the CONFIGURATION GROUPS section, click to add an authentication
     group.

   2. In the Name field, enter oauth.
   3. In the Display Name field, enter a display name for the authentication group.
   4. In the Configurations field, select the OAuth authentication configuration that you just created.

                   Note

                You can add only one OAuth authentication configuration to the OAuth configuration group.

   5. Click SAVE.

Step 4: Configure IdM authentication in Service Manger

See Configure IdM authentication in Service Manager for detailed instructions.

Step 5: Test your OAuth configuration

   1. Access https://apache.yourdomain.net/webtier from your browser, and then you will be redirected to the IdP sign-in
     page.

   2. After you successfully sign in using your IdP credentials, the web tier main page is displayed.


1.8.20. Two-Factor Authentication

Two-Factor Authentication (2FA) is an extra layer of protection that you can use to ensure the security of Service Manager
accounts beyond just a username and password. It allows the Service Manager to verify the identity of the end-user based
on the authentication performed by an authorization server.
Service Manager leverages IdM authentication, and IdM authentication in turn leverages a third-party identity provider to
support 2FA authentication. The following diagram illustrates a simplified process of 2FA authentication.

The following diagram explicitly illustrates the 2FA authentication process of Service Manager with Azure AD as a sample IdP.
In this example, all components are deployed on the Cloud.

The following table further explains each step in this process.  Page 175 of 251

This PDF was generated on May 23, 2026

Step                                    Description

1                                       A user requests access to an SM client (web tier or Mobility

                                        client).

2                                       The SM client sends a request to the IdM service for a

                                        request token.

3                                       The IdM service returns a response along with a request

                                        token to the SM client.

4                                       The IdM client redirects the request to the IdM service

                                        along with that token, and then the IdM service redirects it

                                        to the Azure AD (IdP) login page with a SAML request.

5                                       The user enters a username and password to log in to SM

                                        from the Azure AD (IdP) login page. 1

6                                       Azure MFA service sends a notification to the user's

                                        registered device (for example, a mobile phone).

7                                       The user approves the sign-in request (for example, the

                                        user enters the received verification code on the Azure

                                        login page).

8                                       The Azure AD (IdP) redirects the request to the IdM service

                                        with a SAML response, and then the IdM service redirects

                                        the request to the SM client along with an Access Token.

9                                       The SM client logs in to the SM Server with that Access

                                        Token.

10                                      The user logs on to SM.

1 A user logs on to Service Manager through the Azure AD (IdP) login page, and the Azure AD (IdP) login name is determined
by the Azure AD (IdP). That is, a user needs to enter the login name using the format required by the Azure AD (IdP).

Prerequisites

     Install SM server, SM client (web tier or Mobility client), and IdM server on Azure
     Refer to Install on Azure for detailed instructions.
     Configure Azure MFA
     Refer to the Azure documentation Enable Azure AD Multi-Factor Authentication for detailed instructions.
     Configure Azure as SAML IDP Server
     Refer to the IdM documentation Configure Azure as SAML IDP Server for detailed instructions.

Related topics

Install Service Manager server
Install Identity Manager (IdM)
````
