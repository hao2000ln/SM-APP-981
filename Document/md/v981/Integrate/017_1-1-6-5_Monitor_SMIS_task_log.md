---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.6.5 .. 1.1.7
printed_pages: 442-479
---

# 1.1.6.5 Monitor SMIS task log

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.6.5. Monitor SMIS task log

When an integration instance is active, Service Manager logs all system messages of the
integration in the Service Manager Integration Suite (SMIS) task log. A log entry in the SMIS
task log always links to a task in the SMIS task queue. The SMIS task log allows an
administrator to view the task history of an integration instance, and restart unsuccessful tasks
when needed. For more information about how to enable an integration instance, see Enable or
disable an integration instance.

To monitor the SMIS task log, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Select an integration instance.
   3. Click Log. The Task Log page opens.
   4. To filter log entries by time range, select a date range in the From and To fields, and click

     Filter.
   5. Double-click a record in the log list. The Task Log Detail page opens.

If the task is unsuccessful, you can continue the following steps to restart the task:

   1. click the View button on the Task Log Detail page. The Task Detail page opens.
   2. Click Run Now.

Purge the SMIS task log records

By default, the Service Manager Integration Suite (SMIS) task log keeps all task records even if
these tasks are successfully processed and removed. Service Manager provides an out-of-box
scheduler record to purge the SMIS task log. To use this scheduler record, follow these steps:

   1. Click Tailoring > Database Manager.
   2. Type schedule in the Form field and then click Search.
   3. Open schedule from the record list. A blank Schedule File record is displayed.
   4. Type background purge/archive SMISTaskLog in the Name field and then click Search.
   5. Specify the Expiration field to define the start time of the purge task.
   6. Click Save.

Related topics

Integration Manager
Service Manager Integration Suite (SMIS)
Integration Instance Mapping
Integration Instance Information fields
Add or delete an integration instance
Edit an integration instance
Add or delete field mappings
Edit field mappings
Configure value mappings


Enable or disable an integration instance
Monitor integration instance status
Configure a callback
Monitor failover tasks


1.1.6.6. Using LW-SSO with integrations

Lightweight Single Sign-On (LW-SSO) is optional but highly recommended for some
integrations. Enabling LW-SSO for integrations will bypass the login prompts when connecting
two OpenText products.

Incoming UI LW-SSO

If LW-SSO is enabled in both the Service Manager Web tier and another OpenText product,
users who have logged on to Service Manager are allowed to sign on to the other OpenText
product through the web tier without a login prompt; however, you must enable LW-SSO in the
Service Manager server additionally if you want users who have logged on to another product
to directly sign on to Service Manager through LW-SSO. This is because the Service Manager
server needs to trust the Web tier.

Incoming Web Services LW-SSO

If LW-SSO is enabled in the Service Manager server, other OpenText products can use a
dedicated user account to access Service Manager Web Services without re-authentication.

Integration user accounts

For each integration, there might be two types of integration user accounts:

     Dedicated user account: a dedicated user account that one product uses to call Web
     Services of the end-point product through LW-SSO.
     End-user account: a user account that an end-user uses to log in to one product and then
     sign on to another product through LW-SSO.

These two types of integration user accounts must be created on both product sides. In
addition, an integration user account must have the same user name (but can have different
passwords) on the two sides.

You can use LW-SSO with the following integrations:

     Operations Orchestration (OO)
     Application Performance Management (APM) Operations Manager i
     Application Performance Management (APM) Business Impact Report

For details, see the specific information about how to configure LW-SSO in each of these
products.

Related topics

Integration Manager
Operations Orchestration (OO)
Application Performance Management (APM)
Incident Exchange (OMi - SM) integration


APM Business Impact Report (BIR)
Configure LW-SSO in the Service Manager server
Configure LW-SSO in the Service Manager Web tier
Enable LW-SSO for the Operations Orchestration integration
Enable LW-SSO for the Incident Exchange (OMi - SM) integration


1.1.6.6.1. Configure LW-SSO on the Service
Manager server

Applies to User roles: System Administrator

Service Manager servers support Lightweight Single Sign-On (LW-SSO). A Service Manager
integration can pass an authentication token to Service Manager and doesn't require re-
authentication. This simplifies the configuration of Single Sign-On for OpenText solutions by
removing the need to use Symphony Adapter (which proxies LW-SSO-based authentication
with the Service Manager Trusted Sign-On solution).

Enabling LW-SSO in the Service Manager server enables web service integrations from other
OpenText products to bypass Service Manager authentication if the product user is already
authenticated and a proper token is used; enabling LW-SSO in both the Service Manager
server and web tier enables users to bypass the login prompts when launching the Service
Manager web client from other OpenText applications.

            Note

                LW-SSO version 2.5 is supported.
                If Service Manager is running in FIPS mode, ignore the steps described here
                and follow the instructions in Configure LW-SSO in the Server for FIPS mode
                instead.

To configure LW-SSO in the Service Manager server:

   1. Go to the <Service Manager server installation path>/RUN folder, and open
      lwssofmconf.xml in a text editor.

   2. Make sure that the enableLWSSOFramework attribute is set to true (default).

   3. Change the domain value yourdomain.net to the domain name of your Service Manager
     server host.

                   Note

                To use LW-SSO, your Service Manager web tier and server must be deployed
                in the same domain; therefore you should use the same domain name for the
                web tier and server. If you fail to do so, users who log in from another
                application to the web tier can log in but may be forcibly logged out after a
                while.

   4. Set the initString value. This value MUST be the same with the LW-SSO setting of the
     other OpenText product you want to integrate with Service Manager.


   5. Optionally, you can change attributes paddingModeName , keySize , encodingMode ,
      engineName , and cipherType . However, you must make sure that they are the same
     with the LW-SSO setting of the other OpenText product that you want to integrate with
     Service Manager.

                   Caution

                Do not change the other configurations, such as the content in tag
                 <restURLs> , and the attribute of tag <service> .

Example

  <?xml version="1.0" encoding="UTF-8"?>
  <lwsso-config
  xmlns="http://www.hp.com/astsecurity/idmenablmentfw/lwsso/2.0">
  <enableLWSSO enableLWSSOFramework="true"
  enableCookieCreation="true" cookieCreationType="LWSSO" />
  <web-service>

                 <inbound>
                    <restURLs>
                               <url>.*7/ws.*</url>
                               <url>.*sc62server/ws.*</url>
                               <url>.*/ui.*</url>
                               <url>.*SM/9/rest.*</url>
                    </restURLs>
                    <service service-type="rest" >
                        <in-lwsso>
                               <lwssoValidation>
                                   <domain>yourdomain.net</domain>
                                 <crypto cipherType="symmetricBlockCipher"

  engineName="AES"
                                   paddingModeName="CBC" keySize="256"

  encodingMode="Base64Url"
                                   initString="This is a shared secret passphrase"

  </crypto>
                               </lwssoValidation>

                        </in-lwsso>
                    </service>
                   </inbound>
                   <outbound/>
  </web-service>
  </lwsso-config>


Related topics

Using LW-SSO with integrations
Configure LW-SSO in the Service Manager Web tier
Configure LW-SSO in Application Performance Management (APM)
Configure LW-SSO in Operations Orchestration (OO)


1.1.6.6.2. Configure LW-SSO on the Service
Manager Web tier

Applies to User Roles: System Administrator
If Lightweight Single Sign-On (LW-SSO) is enabled on the Service Manager Web tier,
integrations from other OpenText products will bypass Service Manager authentication when
launching the Service Manager Web client, provided that the OpenText product user is already
authenticated and a proper token is used.

            Note

                All products involved in LW-SSO must use the same user account.
                To enable users to launch the Web client from another OpenText product
                using LW-SSO, you must also enable LW-SSO in the Service Manager server.
                Once you have enabled LW-SSO in the web tier, web client users should use
                the web tier server's fully-qualified domain name (FQDN) in the login URL:
                 http://<myWebtierHostName>.<myDomain>:<port>/webtier-x.xx/index.do
                This section describes the steps for non-FIPS mode. When the Service
                Manager Server is running in FIPS mode, the steps are slightly different. See
                Configure LW-SSO on the Web tier for FIPS mode.

The following procedure is provided as an example, assuming that the Service Manager Web
tier is deployed on Tomcat.

To configure LW-SSO in the Service Manager Web tier:

   1. Open the <Tomcat>\webapps\<Service Manager Web tier>\WEB-INF\web.xml file in a
     text editor.

   2. Modify the web.xml file as follows:
        1. Set the <serverHost> parameter to the fully-qualified domain name of the Service
           Manager server.

                         Note

                      This is required to enable LW-SSO from the web tier to the server.

        2. Set the <serverPort> parameter to the communications port of the Service
           Manager server.

        3. Change the value of context parameter isCustomAuthenticationUsed to false.


             <context-param>
             <param-name>isCustomAuthenticationUsed</param-name>
             <param-value>false</param-value>
             </context-param>

     4. Remove the comment tags (<!-- and -->) enclosing the following elements to enable
        LW-SSO authentication.

             <!--
             <filter>
             <filter-name>LWSSO</filter-name>
             <filter-
             class>com.hp.sw.bto.ast.security.lwsso.LWSSOFilter</filter-
             class>
             </filter>
             -->
             ......
             <!--
             <filter-mapping>
             <filter-name>LWSSO</filter-name>
             <url-pattern>/*</url-pattern>
             </filter-mapping>
             -->

     5. Save the web.xml file.
3. Open the <Tomcat>\webapps\<Service Manager Web tier>\WEB-

  INF\classes\lwssofmconf.xml file in a text editor, and then update this file as follows:
     1. Set the value of enableLWSSOFramework to true (default is false).

             <enableLWSSO
             enableLWSSOFramework="true"
             enableCookieCreation="true"
             cookieCreationType="LWSSO"/>

     2. Set the <domain> parameter to the domain name of the server where you deploy
        your Service Manager Web tier. For example, if your Web tier's fully qualified domain
        name is mywebtier.domain.hp.com , then the domain portion is domain.hp.com .


                      Note

                   To use LW-SSO, your Service Manager web tier and server must be
                   deployed in the same domain; therefore you should use the same
                   domain name for the web tier and server. If you fail to do so, users who
                   log in from another application (for example, Enterprise Collaboration) to
                   the web tier can log in but may be forcibly logged out after a while.

     3. Set the initString value. This value MUST be the same with the LW-SSO setting of
        the other OpenText product you want to integrate with Service Manager.

     4. Check the secureHTTPCookie value (default: true).

                      Note

                         If you set secureHTTPCookie to true (default), you must also set
                          secureLogin in the web tier configuration file ( web.xml ) to true
                         (default); if you set secureHTTPCookie to false , you can set
                          secureLogin to either true or false . In a production
                         environment, you are recommended to set both parameters to
                          true .
                         If you don't want to use SSL, set both secureHTTPCookie and
                          secureLogin to false .

     5. Save the lwssofmconf.xml file.
4. Open the <Tomcat>\webapps\<Service Manager Web tier>\WEB-

  INF\classes\application-context.xml in a text editor.

5. Modify the application-context.xml file as follows:

     1. Add lwSsoFilter to the filterChainProxy bean:

         <sec:filter-
        chain pattern="/**" filters="securityContextPersistenceFilter,resourceFilter,lwSsoFilt
        er,anonymousAuthFilter"/>

        If you need to enable web tier LW-SSO for integrations and also enable trusted sign-
        on for your web client users, add lwSsoFilter followed by preAuthenticationFilter,
        as shown in the following:

         <sec:filter-
        chain pattern="/**" filters="securityContextPersistenceFilter,resourceFilter,lwSsoFilt
        er,preAuthenticationFilter,anonymousAuthFilter"/>

        For information about how to enable trusted sign-on in Service Manager, see
        Example: Enabling trusted sign-on.

     2. Uncomment the lwSsoFilter bean by removing the comment tags:


                     <bean id="lwSsoFilter"
                 class="com.hp.ov.sm.client.webtier.lwsso.LwSsoPreAuthentication
                 Filter">
                 <property name="authenticationManager">
                 <ref bean="authenticationManager"/>
                 </property>
                 <property name="defaultRole">
                 <value>ROLE_PRE</value>
                 </property>
                 </bean>

        3. Save the application-context.xml file.
   6. Restart Tomcat so that the configuration takes effect.

Related topics

Using LW-SSO with integrations
Configure LW-SSO on the Service Manager server


1.1.6.6.3. Configure LW-SSO in Application
Performance Management (APM)

If LW-SSO is enabled in both Service Manager and Application Performance Management
(APM), users who have signed in to Service Manager are allowed to sign on to APM through
the web tier without providing a user name and password.

To configure LW-SSO in APM:

   1. Sign in to APM as a system administrator.
   2. Click Admin > Platform > Users and Permissions > Authentication Management.

   3. Check to see if the following two fields are correctly configured:

           Token Creation Key (initString): Must be the same as the initString value specified in
           the Service Manager LW-SSO configuration (minimum length: 12 characters). For
           example, smintegrationlwsso.
           Trusted Hosts/Domains: Must contain the domain name of the Service Manager Web
           tier server. For example, if your Service Manager Web tier's fully qualified domain
           name is mywebtier.domain.microfocus.com, then the domain name is
           domain.microfocus.com.

     If these two fields are correctly configured, LW-SSO is already enabled in your
     APM environment, and you can ignore the steps below. If not, proceed to the steps below.

   4. Click Configure. The Authentication Management Wizard opens.
   5. Click Next. The Single Sign-On Configuration page opens.

   6. Do the following:

           In the Token Creation Key (initString) field, enter a string of characters. For
           example, smintegrationlwsso.

                         Note

                      This value must be the same as the initString value in your Service
                      Manager LW-SSO configuration.

           In the Trusted Hosts/Domains column, add the domain name of the Service
           Manager Web tier server.
           In the Type column, select DNS for the Service Manager Web tier server.

   7. Click Next twice, and then click Finish.

     LW-SSO is now enabled in your APM environment.


                   Note

                Note: For other settings not described above, keep the defaults. If you want
                to change these settings, click Help on the Single Sign-On Configuration
                wizard pages.

Related topics

Application Performance Management (APM)
APM Business Impact Report (BIR)
Incident Exchange (OMi - SM) integration
Using LW-SSO with integrations
APM Business Impact Report integration setup
Incident Exchange (OMi - SM) integration setup
Enable LW-SSO for the Business Impact Report (BIR) integration
Enable LW-SSO for the Incident Exchange (OMi - SM) integration


1.1.6.6.4. Configure LW-SSO in Operations
Orchestration (OO)

Applies to User roles: System Administrator
If you have enabled Lightweight Single Sign-On (LW-SSO) in both Service Manager and
Operations Orchestration, users who have logged on to Service Manager are allowed to sign
on to Operations Orchestration through the web tier without providing a username and
password.

            Note

           LW-SSO requires that the accounts used to log on to Operations Orchestration and
           Service Manager have the same account name (but can have different passwords).

To configure LW-SSO in Operations Orchestration, refer to Set up security using LW-SSO.

Related topics

     Integration Manager
     Operations Orchestration (OO)
     Using LW-SSO with integrations
     Operations Orchestration integration setup
     Add an Operations Orchestration integration
     Enable SSL connection from Service Manager to Operations Orchestration
     Enable LW-SSO for the Operations Orchestration integration


1.1.7. BDM Mapping Management

Applies to User Roles: System Administrator

The BTO Data Model (BDM) is intended to be used as a standard data model for integrations
between Service Manager and Application Performance Management (APM). In Service
Manager, a BDM mapping is a mapping between a Service Manager object (associated with a
file in Service Manager) and a BDM object (predefined in BDM). A BDM mapping consists of
the following parts: field mapping, value mapping, atom mapping, and configuration.

            Note

           Service Manager supports data mappings of the incident entity, which are
           compliant with three versions of BDM: 1.0, 1.1, and 1.2, respectively.

System administrators can create new BDM mapping configurations or customize existing BDM
mapping configurations in Service Manager.

To configure a BDM mapping in Service Manager:

   1. Go to System Administration > Ongoing Maintenance > BDM Mapping Management.
     The BDM mapping configuration search page opens.

   2. Search for an existing BDM mapping configuration. For example, enter incident in the
     BDM Name field, select 1.2 in the Version field, and then click Search. The mapping
     configuration of BDM object incident is displayed.

     Or
     Add a new BDM mapping configuration. Follow these steps:

          a. In the BDM Name field, enter the name of a BDM object.

          b. In the Version field, select a version of BDM from the list.

          c. In the File field, click the Fill icon and then select the name of a file from the
          resulting list. This is the Service Manager file that you want to map to BDM.

          d. Click Add. The new BDM mapping record is added.
   3. Configure the mapping information on the Field Mapping, Value Mapping, Atom

     Mapping, and Configuration tabs. For a detailed description of the information on each
     tab, see the related topics.


                   Note

                 On the Field Mapping tab, if you add a new field to the file associated with
                the Service Manager object, you must click the Fill icon for the File field to
                refresh the field list in the SM Object Field column.

   4. (Optional) Click Publish to publish the BDM mapping. Once published, a BDM mapping
     record becomes read-only.

Related topics

Field Mapping
Value Mapping
Atom Mapping
Customizing BDM mapping configuration


1.1.7.1. Field Mapping

The Field Mapping tab of a BDM mapping defines the field mappings between a Service
Manager object and a BDM object. This section describes how to configure the columns on
this tab, and provides detailed information about the inner objects, functions, and variables that
can be used to configure callbacks in the SM Callback and BDM Callback columns.

Field Mapping columns

The following table describes the columns on the Field Mapping tab.

Column Name                                                                                      Service Manager 9.81
SM Object Field
                                        Description
Direction
                                        The name of a field in the Service Manager
                                        file, and can be selected from the list.

                                                    Note

                                                   Do not select the first item such
                                                   as [probsummary] in the list,
                                                   which references the name of
                                                   the file that you want to map to
                                                   BDM. The BDM mapping utility
                                                   doesn't support complex
                                                   structures at this time (for
                                                   example, an array of arrays or
                                                   an array within an array of
                                                   structures).

                                        Indicates the mapping direction of a field
                                        mapping, and has only three values to
                                        select from.

                                             ->: from SM Object Field to BDM
                                             Object Field/Attribute.
                                             <-: from BDM Object Field/Attribute to
                                             SM Object Field.
                                             <->: in both directions.

Column Name                                                                                      Service Manager 9.81
BDM Object Field/Attribute
                                        Description

                                        The name of a field in the BDM object, and
                                        should be in a format like XPath of XML.
                                        For example, the following XML segment:

                                          <is_registered_for
                                          target_role='xxx'>
                                          <target_global_id>xxx</target_g
                                          lobal_id>
                                          <target_type>xxx</target_type>
                                          <configuration_item>
                                          <id>xxx</id>
                                          <type>xxx</type>
                                          <description>xxx</description>
                                          </configuration_item>
                                          </is_registered_for>

                                        should be formatted as:

                                          is_registered_for/@target_role
                                          (@ means it is an attribute)
                                          is_registered_for/
                                          target_global_id
                                          is_registered_for/ target_type
                                          is_registered_for/
                                          configuration_item/ id
                                          is_registered_for/
                                          configuration_item/ type
                                          is_registered_for/
                                          configuration_item/ description

                                             You can use an array to represent
                                             repetitive elements. For example:

 Column Name                                                                                     Service Manager 9.81

This PDF was generated on May 23, 2026  Description

                                                  <users>
                                                  <user>
                                                  <name>xxx</name>
                                                  <email>xxx</email>
                                                  </user>
                                                  <user>
                                                  <name>xxx</name>
                                                  <email>xxx</email>
                                                  </user>
                                                  ...
                                                  </users>

                                             Can be described as:

                                                  users/user[0]/name
                                                  users/user[0]/email
                                                  users/user[1]/name
                                                  users/user[1]/email

                                             The namespace of a BDM field should
                                             be formatted as:

                                                  ns:property1/ns:subproperty
                                                  2

                                             ns is the alias of a namespace, and
                                             should be included in the BDM
                                             Callback of the @xmlns mapping
                                             entry:

                                                  $xmlns({...,
                                                  "ns":"http://www.xxx.com/xx
                                                  x/xxx", ...})

                                             If the alias is omitted, then a default
                                             namespace configured in @xmlns will
                                             be used:

                                                  '\$':"http://www.xxx.com/xx
                                                  x/xxx"

                                                                                                                      Page 461 of 1727
 Column Name                                                                                     Service Manager 9.81
 SM Default Value
 SM Callback                            Description

 BDM Default Value                      Defines the default value of the SM Object
 BDM Callback                           Field if there is no value in the
 BDM Type                               corresponding BDM Object Field/Attribute
                                        when mapping the BDM object to the
This PDF was generated on May 23, 2026  Service Manager object.

                                        Enter custom JavaScript code, which will be
                                        invoked when mapping BDM Object
                                        Field/Attribute to SM Object Field. For
                                        information about how to configure
                                        callbacks, see the Callbacks section below.

                                                    Note

                                                   If no callback is configured, the
                                                   BDM Object Field/Attribute will
                                                   be directly mapped to the SM
                                                   Object Field.

                                        Defines the default value of the BDM Object
                                        Field/Attribute if there is no value in the
                                        corresponding SM Object Field when
                                        mapping the Service Manager object to the
                                        BDM object.

                                        Enter custom JavaScript code for mapping
                                        between the BDM Object Field/Attribute and
                                        the SM Object Field. When mapping the
                                        Service Manager object to the BDM object,
                                        the custom JavaScript code will be invoked.
                                        For more information about how to
                                        configure callbacks, see the Callbacks
                                        section below.

                                        Select one from the list: String (default),
                                        Number, and DateTime. If no BDM Type is
                                        selected, the default type (String) will be
                                        used.

                                                                                                                      Page 462 of 1727

Column Name                             Description

Value Mapping Group                     The name of a value mapping group to
                                        which the BDM Object Field/Attribute and
                                        SM Object Field belong. A value mapping
                                        group contains a collection of enumerated
                                        BDM/SM value pairs. The Service Manager
                                        value and BDM value will be mapped
                                        according to the configuration on the Value
                                        Mapping tab.

Description                             Enter a text description for this BDM
                                        mapping.

Callbacks

In the SM Callback and BDM Callback columns, you can enter custom JavaScript code for
mapping between the Service Manager object and BDM object. Some inner objects, variables,
and functions can be used in the custom JavaScript code. The key word $ is reserved to
identify these inner objects, variables, and functions.

Reserved key word ($)

The following rules apply when you use the reserved key word: $.

     If you want to use your own variable prefixed with '$', you must escape it with the
     character '\'. For example:

  var \$test = 'abc';

You can also use inner variables and objects in a string. For example:

  var strTemp = "Incident Number: $sm.number";

If you want to use a '$' in a string, you must escape it. For example:

  cost: 100 \$ ...

In a regular expression, you don't need to escape '$' with '\':

  var regExpr = /^[Jj]ava[Ss]cript$/

However, if you define with the RegExp object, you must escape '$', because '$' is in a
string:


          var regExpr = new RegExp( "^[Jj]ava[Ss]cript\$" );

Inner objects, functions, and variables

The following tables list the inner objects, functions, and variables.

Inner Objects

Object Name                                                                                      Service Manager 9.81
$sm
The current Service Manager object.     Member Method Signature / Method
                                        Description
$sm
The current Service Manager object.     value(field)
                                        field: The name of a field of the Service
                                        Manager object. If you don't include the
                                        <field> parameter, the currently configured
                                        field is used. Subfields should be separated
                                        with a forward slash ('/').
                                        This function is used to extract the value of
                                        a field of the Service Manager object. If you
                                        don't include the <field> parameter, it will
                                        return the current field value. For example:

                                          $sm.value( "id" )

                                          $sm.value( "resolution[0]" )

                                          $sm.value()

                                        setValue(value, field)
                                        value: The value of the <field> to be set.
                                        field: The name of a field of the Service
                                        Manager object. If you don't include the
                                        <field> parameter, the currently configured
                                        field will be used.
                                        This function is used to set the value of a
                                        field of the Service Manager object. If you
                                        don't include the <field> parameter, it will
                                        return the current field value.

Object Name                                                                                      Service Manager 9.81
$bdm
The current BDM object.                 Member Method Signature / Method
                                        Description
$bdm
The current BDM object.                 value(field)
                                        field: The name of a field of the BDM
                                        object. If you don't include the <field>
                                        parameter, the currently configured field
                                        will be used. Subfields should be separated
                                        with a forward slash ("/").
                                        This function is used to extract the value of
                                        a field of the BDM object. If you don't
                                        include the <field> parameter, it will return
                                        the current field value. For example:

                                          $bdm.value(
                                          "is_registered_for/configuratio
                                          n_item" )

                                          $bdm.value(
                                          "ns:users/ns:user[0]/name" )

                                          $bdm.value()

                                        setValue(value, field)
                                        value: The value to be set for the <field>.
                                        field: The name of a field of the BDM
                                        object. If you don't include the <field>
                                        parameter, the currently configured field
                                        will be used.
                                        Note: The field value must be the value in
                                        the BDM Object Field/Attribute column. This
                                        function is used to set the value of a field of
                                        the BDM object.


Object Name                                 Member Method Signature / Method
                                            Description
$ctx
The current mapping context object that is  set(key, value)
used to hold some variables to be used in
the whole mapping process.                  key: The key to be set for the <value>.

                                            value: The value to be kept in the mapping
                                            context object for the key.

                                            This function is used to set a key-value pair
                                            in a mapping context object. For example:

                                            $ctx.set("affected_ci",
                                            affected_ci)

$ctx                                        get(key)

The current mapping context object that is  key: The key in a key-value pair.
used to hold some variables to be used in
the whole mapping process.                  This function is used to get the value of a
                                            key in a mapping context object. For
                                            example:

                                            var affected_ci =
                                            $ctx.get("affected_ci")

Inner functions

Function Signature                                                                                    Service Manager 9.81
$xmlns()
                                             Description

                                             Used to define an xml namespace.
                                             Example:

                                               $xmlns({"\$":"http://www.hp.com
                                               /2009/software/data_model",

                                               "bdm":"
                                               http://www.hp.com/2009/software
                                               /data_model"}).

                                             In this example,
                                             "\$":"http://www.hp.com/2009/software/
                                             data_model" is a default namespace, where
                                             reserved key word $ is escaped with a
                                             backslash ("\"); "bdm":"
                                             http://www.hp.com/2009/software/data_
                                             model" is another namespace, where bdm
                                             is the alias of the namespace. You can add
                                             more namespaces, but there is only one
                                             default namespace.

$afterString(str)                            Used to return the portion of the current
                                             mapping field value that's after the string
str: A portion of the current mapping field  specified by the <str> parameter.
value.
                                             Example:

                                               $afterString("urn:x-

                                               hp:software:servicemanager:inci

                                               dent:id:")

                                             If the current mapping field is 'global_id' of
                                             the BDM object, and its value is urn:x-
                                             hp:software:servicemanager:incident:id:7
                                             B21A623-158B-45D4-9C7C-
                                             3D2821096A44, the $afterString will return:
                                             7B21A623-158B-45D4-9C7C-
                                             3D2821096A44.


Function Signature                           Description

$prefix(str)                                 Used to prefix a string before the current
                                             mapping field value.
str: The string value to be prefixed before
the current mapping field value.             Example:

                                             If the current mapping field is 'id' of the
                                             Service Manager object and its value is
                                             "5A8EABC6-CA1B-499B-A230-
                                             4D6DE07487D8",

                                               $prefix("urn:x-
                                               hp:software:servicemanager:inci
                                               dent:id:")

                                             will return urn:x-
                                             hp:software:servicemanager:incident:id:
                                             5A8EABC6-CA1B-499B-A230-
                                             4D6DE07487D8.

$select(fileName, query)                     Used to do select the SM object from the
                                             SM DB.
     filename: The name of a valid Service   Example:
     Manager file.
     query: The Service Manager query          var requestedBy =
     language.                                 $select("contacts",'operator.id
                                               ="falcon"');

$combine(delimiter)                          Used to combine the current field values of
                                             the Service Manager/BDM object into one
delimiter: A symbol or character used to     string.
separate the combined values.

combine(arr, delimiter)                      Used to combine the specified array of
                                             values into one string.
     arr: An array of values to be           Example:
     combined.
     delimiter: A symbol or character used     combine( ['a','b','c'], ',')
     to separate the combined values.

 Function Signature                                                                              Service Manager 9.81
 $isCreate()
 $isUpdate()                            Description

Inner variables                         Used to verify if the current operation has
                                        created an SM object in Service Manager
 Variable Name                          (true) or not (false).
 $result
                                        Used to verify if the current operation has
Related topics                          updated an SM object in Service Manager
                                        (true) or not (false).
BDM Mapping Management
Value Mapping                           Description
Atom Mapping
Customizing BDM mapping configuration   This variable is used to hold the returned
                                        result that will be assigned to the current
                                        target field of the Service Manager/BDM
                                        object if the custom JavaScript code can't
                                        generate a value (for example, the 'if'
                                        statement can't generate a value, and thus
                                        needs to use the $result variable to hold the
                                        result):

                                          var affected_ci =
                                          $ctx.get("affected_ci");
                                          if( affected_ci ) {

                                                         $result =
                                          affected_ci['type'];
                                          }


1.1.7.2. Value Mapping

The Value Mapping tab of a BDM mapping defines the value mappings between a Service
Manager object and a BDM object.

The following describes the columns on this tab.

Column Name                                             Description
Value Mapping Group
                                                        The name of a value mapping group. A
BDM Values                                              value mapping group contains a collection
SM Values                                               of enumerated BDM/SM value pairs.
Description
                                                        The values of the BDM fields.

                                                        The values of the Service Manager fields.

                                                        Description of the value mapping.

For example, below is a value mapping named impact, and there are four mapping entries for
this value mapping group:

Value Mapping Group                     BDM Values      SM Values
impact                                  enterprise      1
impact                                  site-dept       2
impact                                  multiple-users  3
impact                                  users           4

The name impact can be filled in the Value Mapping Group column on the Field Mapping tab:

SM     Directi BDM SM                   SM              BDM BDM BDM  Value
                                                                     Mappi
Object on      Object Defaul Callba Defaul Callba Type               ng
                                                                     Group
Field          Field/ t Value ck                        t Value ck
                                                                     impact
               Attribu

               te

initial.i <->  impact
mpact          _scope

This means when mapping the Service Manager object to the BDM object, if the value of field
initial.impact of the Service Manager object is 2, the value 2 will be mapped to site-dept


for the field impact_scope of the BDM object, and vice versa.

Related topics

BDM Mapping Management
Field Mapping
Atom Mapping
Customizing BDM mapping configuration


1.1.7.3. Atom Mapping

The Atom Mapping tab of a BDM mapping defines the required mappings between certain
fields in a BDM object and Atom (an XML-based document format for web feeds). The Service
Manager RESTful web service supports the standard Atom representation, which conforms to
the Atom Publishing Protocol. According to the Atom Publishing Protocol, the following
elements are required in an Atom 1.0 feed: title, id, and updated.

The following table describes the columns on the Atom Mapping tab.

Column Name                              Description
BDM Object Field                         The name of a valid field in the BDM object
Atom Object Field                        The name of a valid Atom field.
Atom Object Field Type                   The type of a valid Atom field.

Below is an example of an Atom mapping:

BDM Object Field                        Atom Object Field  Atom Object Field Type
reference_number                        title              String
last_modified_time                      updated            DateTime
description                             summary            String
global_id                               id                 String

In the resulting Atom xml representation below, the id, updated, title and summary elements
will take the values of the BDM object fields global_id, last_modified_time, reference_number
and description, respectively.

<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<entry xmlns="http://www.w3.org/2005/Atom"
xmlns:ns2="http://a9.com/-/spec/opensearch/1.1/"
xmlns:ns3="http://www.w3.org/1999/l">
<id>urn:x-hp:software:servicemanager:incident:id:7B21A623-158B-45D4-
9C7C-3D2821096A44</id>
<updated>2022-01-27T11:41:25.000+08:00</updated>
<title type="text">IM10008</title>
<summary type="text">Desktop DVD-drive makes strange noices</summary>


Related topics

BDM Mapping Management
Field Mapping
Value Mapping


1.1.7.4. Customizing BDM mapping
configuration

System Administrators can define key-value pairs that can be shared by SM callbacks and
BDM callbacks in BDM mapping records. With this functionality, administrators only need to
update these key values in one place instead of in individual callbacks.
To customize BDM mapping configuration:

   1. Sign in to the Windows client as a System Administrator.
   2. Click System Administration > Ongoing Maintenance > BDM Mapping Management.
   3. In the Version field, select a value. For example, 1.2.
   4. Click Search. The mapping record incident is displayed.
   5. Select the Configuration tab. A two-column table is displayed. This table defines key-

     value pairs that can be used in BDM mapping callbacks.
           Name: Defines the name of a key to be used in callbacks.
           Value: Defines the value of the key.

     Out-of-box, there are three keys: Host, Port, and AppName.
   6. Type key-value pairs in the table. For example, you can type values for the following out-

     of-box keys:
           Host: abc.domain.com
           Port: 8080
           AppName: webtier-9.30

   7. To view an out-of-box example of using these keys:
        1. Select the Field Mapping tab, and locate the SM Object Field named affected.item.
        2. In this field section, locate the row in which the BDM Object Field/Attribute value is:
           affects/configuration_item/smns:drilldown_url
        3. Click the BDM Callback in the same row, right-click it and then select Magnify.
           The callback code displays in a pop-up text window.
        4. Find the following strings, which contain the three out-of-box key names.

                 - $ctx.getMappingConfiguration()['Host']
                 - $ctx.getMappingConfiguration()['Port']
                 - $ctx.getMappingConfiguration()['AppName'])

   8. To use a defined key in a callback:
        1. Select the Field Mapping tab, click a callback in the SM Callback or BDM Callback
           column. Right-click the callback and select Magnify.


           The callback code displays in a pop-up text window.

        2. Edit the callback code using the following syntax:

            $ctx.getMappingConfiguration()['Host'] , where Host should be replaced with your
           key name.

        3. Click Save and Close.

   9. To test the values you have defined for the out-of-box keys:

        1. Send a REST request by launching this URL in a web browser:
            http://<SM_serverHost>:
           <Port>/SM/7/rest/1.2/incident_list/reference_number/IM10002 .

           A login window is displayed.

        2. Type a valid Service Manager username/password (for example,
           System.Admin/blank password), and click OK.

           The REST request response is displayed.

        3. Locate this string: <smns:drilldown_url>http://<hostname>:
           <port>/<AppName>/index.do , where <hostname> , <port> , and <AppName>
           should be replaced with the values of Host, Port, and AppName, respectively.

Related topics

BDM Mapping Management
Field Mapping
Value Mapping
Atom Mapping
BDM RESTful API


1.1.7.5. BDM RESTful API

If you confiure the BDM Mapping, you can use below URL to view the BMD RESTful requests,
URL examples like below:

Service Manager Incident (BDM 1.0)

Service Manager Incident Attachment List  http://<server>:
(BDM 1.0):                                <port>/SM/7/rest/1.0/incident-
                                          list/reference-
Service Manager Incident Attachment List  number/{incidentKey}/attachment-list
(BDM 1.0):
                                          http://<server>:
Service Manager Incident List (BDM 1.0):  <port>/SM/7/rest/1.0/incident-
                                          list/{incidentKey}/attachment-list
Service Manager Incident List (BDM 1.0):
                                          http://<server>:
                                          <port>/SM/7/rest/1.0/incident-list

                                          http://<server>:
                                          <port>/SM/7/rest/1.0/incident-
                                          list/reference-number

Service Manager Incident (BDM 1.1)

Service Manager Incident Attachment List  http://<server>:
(BDM 1.1):                                <port>/SM/7/rest/1.1/incident-list/reference-
                                          number/{incidentKey}/attachment-list
Service Manager Incident Attachment List
(BDM 1.1):                                http://<server>:
                                          <port>/SM/7/rest/1.1/incident-
Service Manager Incident List (BDM 1.1):  list/{incidentKey}/attachment-list

Service Manager Incident List (BDM 1.1):  http://<server>:
                                          <port>/SM/7/rest/1.1/incident-list

                                          http://<server>:
                                          <port>/SM/7/rest/1.1/incident-list/reference-
                                          number

Service Manager Incident (BDM 1.2)


Service Manager Incident Attachment List  http://<server>:
(BDM 1.2):                                <port>/SM/7/rest/1.2/incident-
                                          list/reference-
Service Manager Incident Attachment List  number/{incidentKey}/attachment-list
(BDM 1.2):
                                          http://<server>:
Service Manager Incident List (BDM 1.2):  <port>/SM/7/rest/1.2/incident-
                                          list/{incidentKey}/attachment-list
Service Manager Incident List (BDM 1.2):
                                          http://<server>:
                                          <port>/SM/7/rest/1.2/incident-list

                                          http://<server>:
                                          <port>/SM/7/rest/1.2/incident-
                                          list/reference-number
````
