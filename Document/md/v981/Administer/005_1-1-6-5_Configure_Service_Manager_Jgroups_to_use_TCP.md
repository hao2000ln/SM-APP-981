---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.1.6.5 .. 1.1.7
printed_pages: 105-128
---

# 1.1.6.5 Configure Service Manager Jgroups to use TCP instead of UDP

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.6.5. Configure Service Manager
Jgroups to use TCP instead of UDP

UDP and TCP

Service Manager JGroups can be configured to use either User Datagram Protocol
(UDP) or Transmission Control Protocol (TCP). By default, Service manager uses UDP.

However, UDP has some limitations. First, it doesn't ensure that communications have
reached the receiver, as the protocol doesn't incorporate the concepts of
acknowledgment, time out, and retransmission. More importantly, UDP uses IP
multicasting to send messages to entire clusters. Cloud service providers usually
don't allow the configuration of IP multicasting, and therefore JGroups on UDP can't
be run in a cloud environment.

TCP is designed to address these limitations. TCP is more reliable because it manages
message acknowledgment and retransmissions in the event of lost parts. Instead of
using IP multicasting, TCP sends multiple unicast messages to cluster members, so
that JGroups on TCP can be run in environments that don't support IP multicasting.

            Note

           The Service Manager startup process and the sm -reportlbstatus report
           generation process are slower when you run Jgroups on TCP. This occurs
           because a new cluster member registers itself to the GossipRouter and
           queries the GossipRouter for initial cluster membership information when
           is starts up. Additionally, the new cluster node needs to establish TCP
           connections with existing members.

Configuring Service Manager Jgroups to use TCP

When you configure JGroups to use TCP, each message to all cluster members is
sent as multiple unicast messages (one message to each member). Because IP
multicasting can't be used to discover the initial members, this process requires a
GossipRouter. Existing cluster members register by using their cluster name, and new
members query the GossipRouter for initial cluster membership information.

Service Manager nodes register themselves to the GossipRouter(s) and query the
GossipRouter(s) for initial cluster membership information when they start. This
process may slow down the speed of the Service Manager startup process.
Therefore, although using multiple GossipRouters is supported, we recommend that


you use only one GossipRouter. The advantage of using multiple GossipRouters is that
new members will always be able to retrieve initial membership, even if some of the
GossipRouters don't work (as long as one is still running). To start multiple
GossipRouters, you can add multiple commands to one sm.cfg file, or you can add
one command to the sm.cfg file on multiple Service Manager hosts.

            Note

           For more information about how to start one or more GossipRouter
           processes to support the use of TCP, see Configure Jgroups to use TCP
           in a horizontally-scaled environment and Configure Jgroups to use TCP in
           a vertically-scaled environment.

Related topics

Configure Jgroups to use TCP in a horizontally-scaled environment
Configure Jgroups to use TCP in a vertically-scaled environment

Parameter: jgroupstcp
Parameter: GossipRouterhosts
Parameter: asyncrefreshlbinterval
Parameter: grouptcpjointimeout
Parameter: grouptcpbindport


1.1.6.5.1. Configure Jgroups to use TCP in
a horizontally-scaled environment

This section explains how to switch an existing horizontally-scaled environment from
UDP to TCP, and how to configure a new horizontally-scaled environment to use TCP.

How to switch an existing horizontally-scaled
environment from UDP to TCP

   1. Add the following command to the beginning of the sm.cfg file on the Primary
     Host:
      sm -GossipRouter -Gossiprouterport:<value>

                   Note

                Make sure that you select an unused port as the value of the
                Gossiprouterport parameter. Additionally, you must add this
                command to the beginning of the sm.cfg file so that the
                GossipRouter starts before any other Service Manager processes.

   2. Remove the following initialization parameters from the sm.ini file for each host:
            groupmcastaddress:<value>
            groupport:<value>

   3. Add the following initialization parameters to the sm.ini file for each host:
            jgroupstcp:<value>
            GossipRouterhosts:<value>

   4. (Optional) Add the following initialization parameters to the sm.ini file for each
     host:
            grouptcpbindport:<value>


                         Note

                      The number of available ports within the specified range (50 by
                      default) starting from the configured TCP bind port (7800 by
                      default) must be greater than or equal to the number of servlets
                      (including those running Service Manager background
                      process). Otherwise, the horizontally-scaled Service Manager
                      cluster can't work normally.

            asyncrefreshlbinterval:<value>
            grouptcpjointimeout:<value>

How to configure a new horizontally-scaled
environment to use TCP

   1. Add the following commands to the sm.cfg file on the Primary Host:

            sm -GossipRouter -Gossiprouterport:<value>

                         Note

                      Make sure that you select an unused port as the value of the
                     Gossiprouterport parameter. Additionally, you must add this
                      command to the beginning of the sm.cfg file so that the
                      GossipRouter starts before any other Service Manager
                      processes.

            sm -loadBalancer -httpPort:<value>
            sm -httpPort:<value> -httpsPort:<value>
            sm system.start

   2. Add the following commands to the sm.cfg file on the Secondary Host:

            sm -httpPort:<value> -httpsPort:<value>
            sm -sync

   3. Add the following initialization parameters to the sm.ini file for each host:

            system:<value>
            grouplicenseip:<value>
            groupname:<value>
            jgroupstcp:<value>


            GossipRouterhosts:<value>
   4. (Optional) Add the following initialization parameters to the sm.ini file for each

     host:
            groupbindaddress:<value>
            grouptcpbindport:<value>

                         Note

                      The number of available ports within the specified range (50 by
                      default) starting from the configured TCP bind port (7800 by
                      default) must be greater than or equal to the number of servlets
                      (including those running Service Manager background
                      process). Otherwise, the horizontally-scaled Service Manager
                      cluster can't work normally.

            asyncrefreshlbinterval:<value>
            grouptcpjointimeout:<value>

Example of a horizontally-scaled TCP
implementation


Machine                                 sm.cfg (excerpt)         sm.ini (excerpt)
myserver1                                                        system:13080
10.0.0.135                              sm -GossipRouter -       grouplicenseip:10.0.0.135
(Primary Host)                          Gossiprouterport:12001   groupname:mygroup1
                                                                 jgroupstcp:1
myserver2                                              sm -      GossipRouterhosts:
10.0.0.136                              loadbalancer -           myserver1[12001]
(Secondary Host)                        httpPort:13080           system:13080
                                                                 grouplicenseip:10.0.0.135
                                                       sm -      groupname:mygroup1
                                        httpPort:13081 -         jgroupstcp:1
                                        httpsPort:13082

                                                       sm
                                        system.start

                                        sm -httpPort:13081 -
                                        httpsPort:13082

                                                       sm -
                                        httpPort:13083 -
                                        httpsPort:13084

                                                       sm -sync

                                                                 GossipRouterhosts:
                                                                 myserver1[12001]


Machine                                 sm.cfg (excerpt)         sm.ini (excerpt)
                                                                 system:13080
myserver3                               sm -httpPort:13081 -     grouplicenseip:10.0.0.135
10.0.0.137                              httpsPort:13082          groupname:mygroup1
(Secondary Host)                                                 jgroupstcp:1
                                                       sm -
                                        httpPort:13083 -
                                        httpsPort:13084

                                                       sm -sync

                                                                GossipRouterhosts:
                                                                myserver1[12001]

Related topics

Configure Service Manager Jgroups to use TCP instead of UDP
Configure Jgroups to use TCP in a vertically-scaled environment
Parameter: jgroupstcp
Parameter: GossipRouterhosts
Parameter: asyncrefreshlbinterval
Parameter: grouptcpjointimeout
Parameter: grouptcpbindport


1.1.6.5.2. Configure Jgroups to use TCP in
a vertically-scaled environment

This section explains how to switch an existing vertically-scaled environment from
UDP to TCP, and how to configure a new horizontally-scaled environment to use TCP.

How to switch an existing vertically-scaled
environment from UDP to TCP

   1. Add the following command to the beginning of the sm.cfg file:
      sm -GossipRouter -Gossiprouterport:<value>

                   Note

                Make sure that you select an unused port as the value of the
                Gossiprouterport parameter. Additionally, you must add this
                command to the beginning of the sm.cfg file so that the
                GossipRouter starts before any other Service Manager processes.

   2. Add the following initialization parameters to the sm.ini file:
            jgroupstcp:<value>
            GossipRouterhosts:<value>

   3. Optional: Add the following initialization parameters to the sm.ini file:
            grouptcpbindport:<value>
            asyncrefreshlbinterval:<value>
            grouptcpjointimeout:<value>

How to configure a new vertically-scaled
environment to use TCP

   1. Add the following commands to the sm.cfg file:
            sm -GossipRouter -Gossiprouterport:<value>


                Note

                Make sure that you select an unused port as the value of the
                Gossiprouterport parameter. Additionally, you must add this
                command to the beginning of the sm.cfg file so that the
                GossipRouter starts before any other Service Manager
                processes.

            sm -loadBalancer -httpPort:<value>
            sm -httpPort:<value> -httpsPort:<value>
            sm system.start

   2. Add the following initialization parameters to the sm.ini file:

            jgroupstcp:<value>
            GossipRouterhosts:<value>

   3. Optional: Add the following initialization parameters to the sm.ini file:

            groupbindaddress:<value>
            grouptcpbindport:<value>
            asyncrefreshlbinterval:<value>
            grouptcpjointimeout:<value>

Example of a vertically-scaled TCP implementation

Machine                                 sm.cfg (excerpt)        sm.ini (excerpt)

myserver1                               sm -GossipRouter -      jgroupstcp:1
10.0.0.135                              Gossiprouterport:12001  GossipRouterhosts:
(Primary Host)                          sm -loadbalancer -      myserver1[12001]
                                        httpPort:13080 sm -
                                        httpPort:13081 -
                                        httpsPort:13082 sm -
                                        httpPort:13083 -
                                        httpsPort:13084 sm
                                        system.start

Related topics

Configure Service Manager Jgroups to use TCP instead of UDP
Configure Jgroups to use TCP in a horizontally-scaled environment


Parameter: jgroupstcp
Parameter: GossipRouterhosts
Parameter: asyncrefreshlbinterval
Parameter: grouptcpjointimeout
Parameter: grouptcpbindport


1.1.7. Lightweight Directory Access
Protocol (LDAP)

You can integrate Service Manager to an LDAP directory service to share contact
information across your network. Once you have enabled an LDAP integration to
Service Manager, you can then configure Service Manager to automatically create
operator records for LDAP users by either of the following methods:

     Defining a user template for LDAP logins. For details, see Create an operator
     template.
     Defining a system default record for all logins. For details, see Create a system
     default operator record.

Using either method, you can map fields in the operator record to contact information
in the LDAP directory service. This mapping allows Service Manager to create an
operator record with all the available contact details defined in the LDAP directory
service. If you create an LDAP user template, you can make changes to all users built
from this template by editing the template operator record. If you create a system
default record, then you must manually make changes to each individual operator
record that Service Manager creates. If you create both an operator template and a
system default operator record, Service Manager uses the operator template to
create new operator records.

            Note

                Service Manager denies access to LDAP users unless the system
                administrator defines either an operator template or a system default
                operator record.
                The ESS access can only be picked up from the *SYSDEFAULTS
                template, not the template operator specified in the system
                information record.

The Service Manager server uses the LDAP Bind DN user that's defined in the
“ldapbinddn” parameter to access LDAP. The privileges of this LDAP user determine
whether the Service Manager server can add or update LDAP accounts. When a
system administrator adds or updates operators in Service Manager, whether the
operator changes in Service Manager can be synchronized to LDAP or not is
determined by the privileges of the LDAP Bind DN user.


            Note

           Deleting an operator record doesn't cause Service Manager to delete
           LDAP users. Only an LDAP administrator can delete LDAP entries.

Typically, Service Manager system administrators will want to map only the operators
file to an LDAP directory, however they can also map any other system table, for
example, the contacts or device table, to an LDAP directory. You can map a Service
Manager table to only one LDAP server at a time, although you may specify a different
LDAP server for each table.

When mapping between Service Manager and LDAP directories, you can decide
which data source you want to be primary. In cases where there are duplicate entries
between data sources, Service Manager displays only the data listed in the primary
data source.

Related topics

Enable an integration to LDAP


1.1.7.1. Enable an integration to LDAP

Applies to User roles: System Administrator

You must have the SysAdmin capability word to use this procedure.

To enable integration to LDAP:

   1. Do one of the following to enable Service Manager to create operator records
     dynamically when LDAP users sign in.
           Define the System Information Record operator template for LDAP users.
           Define a system default record for the operator file. For details, see Create
           a system default operator record.
     These settings allow LDAP users to sign in to Service Manager without having
     existing operator records.

   2. Define the default LDAP server and authentication base directory to which you
     want Service Manager to connect.

   3. Define the file and field mappings you want for the LDAP directory service.
   4. Set LDAP query parameters in the Service Manager initialization file.

Define the default LDAP server

You must have the SysAdmin capability word to use this procedure.

You must define a default LDAP server to integrate Service Manager files to an LDAP
directory service.

To define the default LDAP server:

   1. Click System Administration > Ongoing Maintenance > System > LDAP
     Mapping. The Service Manager LDAP Mapping - System Level Specification
     form opens.

   2. Type or select the LDAP mapping information.
   3. Click Save. Service Manager displays the message:

     Record updated in the scldapconfig file.

Define file and field-level mappings to an LDAP
server

You must have the SysAdmin capability word to use this procedure. You must define
a default LDAP server to integrate Service Manager files to an LDAP directory service.

To define file and field-level mappings to an LDAP server:


   1. Click System Administration > Ongoing Maintenance > System > LDAP
     Mapping. The Service Manager LDAP Mapping - System Level Specification
     form opens.

   2. Click Set File/Field-level Mappings. The Service Manager LDAP Mapping -
     File/Field Specification page opens.

   3. In the Name field, type the name of the Service Manager file for which you want
     to create LDAP mappings.

   4. Click Search. Service Manager displays a list of fields for the file.
   5. Type or select the LDAP mapping settings. If necessary, press Ctrl+H to view

     help for each field.
   6. Click Save. Service Manager displays the message:

     Data Policy record updated.

Set the LDAP authentication base name

You can define an operator to use a different LDAP base name than the operator
name. By default, Service Manager uses the operator name to bind to the LDAP. You
can define a different LDAP base name to allow users to connect to Service Manager
with one name and to LDAP with a different name.

To set the LDAP authentication base name:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Click Search.
   3. Select the operator whose LDAP base name you want to set from the record list.
   4. Click the Security tab.
   5. In the LDAP Base Name field, type the name you want to use to authenticate the

     LDAP connection.
   6. Click Save. Service Manager displays the message:

     Operator record updated.

Enable LDAP over SSL

You must have the SysAdmin capability word to use the procedures below.

By default, when you enable LDAP over SSL, you need to set the root certificate of the
CA that issued the LDAP server's certificate on the Service Manager server, and then
specify the location of the certificate file in the LDAP SSL DB Path field.

If you don't want to set the CA's root certificate on the Service Manager server, follow
these steps:

   1. Set the ldapsslallownocert parameter to 1 .


   2. Sign in to Service Manager, and then click System Administration > Ongoing
     Maintenance > System > LDAP Mapping.

   3. Set the LDAP Server and LDAP Base Directory fields, select the LDAP SSL
     checkbox. Leave the LDAP SSL DB Path field blank.

   4. Click Set File/Field level mapping, enter operator in the Name field, and then
     map the name field of operator to sAMAccountName (for Active Directory
     server).

   5. Restart the Service Manager server.

If you wish to authenticate Service Manager users that belong to different domains or
subdomains, you can deploy multiple LDAP servers that belong to the corresponding
domains, and then set up a horizontal scaled (HS) cluster. By the following
configuration, users belong to different domains can share the same database while
at the same time be authenticated by different domain's LDAP server over SSL.

   1. Set the ldapsslallownocert parameter to 1 .
   2. Sign in to Service Manager, and then click System Administration > Ongoing

     Maintenance > System > LDAP Mapping. Leave everything on this page empty.
   3. Click Set File/Field Level Mapping, enter operator in the Name field, and then

     map the name field of operator to sAMAccountName .
   4. Add the ldapserver parameter in the sm.ini file as the following example:

      ldapserver1:16.183.93.217%636%cn=users,dc=swsm,dc=ind,dc=lab
   5. You can add the ldapserver parameter multiple times if you have more than

     one LDAP server.
   6. Restart the Service Manager server.

            Note

           In both cases above, you still need to set the ldapbinddn and
           ldapbindpass parameters in sm.ini .

Related topics

Lightweight Directory Access Protocol (LDAP)
Create a system default operator record
Define the operator template applied to LDAP users


1.1.7.2. Use LDAP Proxy to integrate
multiple LDAP servers

Customers usually use LDAP servers to manage users and their authentication. Some
customers are using more than one LDAP server for various reasons. To allow all the
users in the LDAP servers to access and use Service Manager (SM), you need to
integrate all of the LDAP servers with SM. However, SM supports only one LDAP
integration.

An LDAP Proxy allows an LDAP client to connect to multiple LDAP servers without the
need to know their details. It combines information from multiple LDAP servers, so it
can be viewed as one LDAP Server.

As an example, this document describes how to set up an LDAP Proxy with
OpenLDAP Server.

Multi-LDAP support architecture

The following diagram illustrates SM’s multi-LDAP support architecture.


Prerequisites

Before you proceed, you need the following:

     A Linux server with OS version: Redhat Linux Enterprise 7.2 and above
     OpenLDAP Version: 2.4

Set up OpenLDAP as a proxy

To set up OpenLDAP as a proxy, you need to prepare a Linux server and install
OpenLDAP on it. You can also install OpenLDAP on an existing Redhat Linux server.

   1. On Redhat Linux, install OpenLDAP.
     To set up an OpenLDAP proxy, we need the back_meta module, which is
     available since OpenLDAP 2.4. So always install the latest version of OpenLDAP.
     Use the following command to install OpenLDAP and related components:
      yum install openldap openldap-clients openldap-servers

   2. Once the installation is successfully completed, check that the back_meta
     module is installed successfully. Its default installation folder is under
      /usr/lib64/openldap .

3. Configure the slapd.conf file to add information of the LDAP servers, so that the
  LDAP proxy server knows which LDAP servers to redirect.
  The following diagram shows a high-level architecture of the meta backend:


The following is an example of the slapd.conf file:


#
# See slapd.conf(5) for details on configuration options.
# This file should NOT be world readable.
#
Include /etc/openldap/schema/core.schema
Include /etc/openldap/schema/corba.schema
include /etc/openldap/schema/cosine.schema
include /etc/openldap/schema/duaconf.schema
include /etc/openldap/schema/dyngroup.schema
include /etc/openldap/schema/inetorgperson.schema
include /etc/openldap/schema/java.schema
include /etc/openldap/schema/misc.schema
include /etc/openldap/schema/nis.schema
include /etc/openldap/schema/openldap.schema
include /etc/openldap/schema/collective.schema
include /etc/openldap/schema/pmi.schema
include /etc/openldap/schema/ppolicy.schema

allow bind_v2

# Define global ACLs to disable default read access.

# Do not enable referrals until AFTER you have a working
directory
# service AND an understanding of referrals.
#referral ldap://root.openldap.org

pidfile                                 /var/run/openldap/slapd.pid
argsfile                                /var/run/openldap/slapd.args

# Load dynamic backend modules:

modulepath                              /usr/lib64/openldap

moduleload                              rwm.la

moduleload                              back_meta.la

moduleload                              back_ldap.la

loglevel 4095

############################################################
###########


# MDB database definitions
############################################################
###########

database meta
suffix "dc=itsma,dc=com"
rootdn "cn=admin,dc=itsma,dc=com"
rootpw secret

uri       "ldap://x.x.x.x/ou=Company1,dc=itsma,dc=com"

readonly no
lastmod off

suffixmassage "ou=Company1,dc=itsma,dc=com"
"cn=Users,dc=smadfs,dc=net"
map attribute uid sAMAccountName
idassert-bind bindmethod=simple

         binddn="cn=administrator,cn=Users,dc=smadfs,dc=net"
       credentials="xxxxxx"
idassert-authzFrom "*"

uri       "ldap://y.y.y.y/ou=Company2,dc=itsma,dc=com"

readonly                                no

lastmod off

suffixmassage "ou=Company2,dc=itsma,dc=com"

"cn=Users,dc=smqatest,dc=net"

map attribute uid sAMAccountName

idassert-bind bindmethod=simple

     binddn="CN=Administrator,CN=Users,DC=smqatest,DC=net"

     credentials="yyyyyyy"

idassert-authzFrom "*"

uri "ldap://z.z.z.z/ou=Company4,dc=itsma,dc=com"
readonly no
lastmod off
suffixmassage "ou=Company4,dc=itsma,dc=com"
"dc=itsma,dc=com"
idassert-bind bindmethod=simple

          binddn="cn=admin,dc=itsma,dc=com"


                 credentials="zzzzzzzz"
      idassert-authzFrom "*"

4. Add additional attributes in the schema and ldif files.
  You can add additional attributes to the inetorgperson.schema and
  inetorgperson.ldif files so that the attributes can be recognized by the
  OpenLDAP Proxy, especially when the LDAP Server type is not OpenLDAP. For
  example, when you use ActiveDirectory (AD) as the LDAP Server and OpenLDAP
  as the proxy, you must add AD attribute sAMAccountName to
  inetorgperson.schema and inetorgperson.ldif.
  Append the following lines in the inetorgperson.schema file:

      ################
      #AD schema
      ################
      attributetype ( 1.2.840.113556.1.4.221

                 NAME 'sAMAccountName'
                 SYNTAX '1.3.6.1.4.1.1466.115.121.1.15' SINGLE-VALUE )
      ################

  Insert the following line before the olcObjectClasses section in the
  inetorgperson.ldif file :

      olcAttributeTypes: ( 1.2.840.113556.1.4.221 NAME
      'sAMAccountName' SYNTAX 1.3.6.1.4.1.1466.115.121.1.15
      SINGLE-VALUE )

  Add attribute sAMAccountName to olcObjectClasses as shown below:


      olcObjectClasses: ( 2.16.840.1.113730.3.2.2 NAME
      'inetOrgPerson' DESC 'RFC2
      798: Internet Organizational Person' SUP
      organizationalPerson STRUCTURAL MAY
      ( audio $ businessCategory $ carLicense $ departmentNumber $
      displayName $ em
      ployeeNumber $ employeeType $ givenName $ homePhone $
      homePostalAddress $ ini
      tials $ jpegPhoto $ labeledURI $ mail $ manager $ mobile $ o
      $ pager $ photo
      $ roomNumber $ secretary $ uid $ userCertificate $
      x500uniqueIdentifier $ pre
      ferredLanguage $ userSMIMECertificate $ sAMAccountName $
      userPKCS12i ) )

  If you want to add other attributes in inetorgperson.schema and
  inetorgperson.ldif such as Phone Number, User Avatar, follow the same steps.
  Additionally, add attribute mapping such as "map attribute TelephoneNumber
  mobile" in the slapd.conf file (the MDB database definitions uri section):

      uri "ldap://x.x.x.x/ou=Company1,dc=itsma,dc=com"
      readonly no
      lastmod off
      suffixmassage "ou=Company1,dc=itsma,dc=com"
      "cn=Users,dc=smadfs,dc=net"
      map attribute uid sAMAccountName
      map attribute TelephoneNumber mobile
      idassert-bind bindmethod=simple

      binddn="cn=administrator,cn=Users,dc=smadfs,dc=net"
                        credentials="xxxxxx"

      idassert-authzFrom "*"

5. Make slapd effective:
     1. Remove the content in slapd.d.
     2. Run the following command:
         slaptest -f /etc/openldap/slapd.conf -F /etc/openldap/slapd.d

6. Start OpenLDAP:
   slapd -d 1


7. Use an LDAP browser or another LDAP tool to check the setup:

Now, you can follow the steps in Enable an integration to LDAP document to configure
the LDAP Proxy in SM. Please note that the LDAP configuration should use OpenLDAP
attributes as you are using OpenLDAP as the Proxy.
````
