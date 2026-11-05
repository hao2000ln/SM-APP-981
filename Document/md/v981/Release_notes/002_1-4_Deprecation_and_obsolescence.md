---
source: Document/pdf/v981/Release_notes.pdf
version: 9.81
sections: 1.4 .. 1.4
printed_pages: 36-49
---

# 1.4 Deprecation and obsolescence

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.4. Deprecation and obsolescence

Deprecated items

A deprecated item is categorized as a component/feature/parameter for which there
will be no further enhancement. It will continue to be supported till a notice of
obsolescence is published. In addition, bug fixes and support cases will be handled
till such time that the deprecated item becomes obsolete.
The following items are now deprecated.


Deprecated item                         Description                  Deprecated since
                                                                     version

system_createupperinde                                               9.72

x

sqlupper                                                             9.72

sqldisconnect                                                        9.71

Usage Hub                                                            9.70

The Spell Check button                  Now you can use the          9.64
in the embedded rich-
text editor in the                      built-in spell checker of a
Contribute New
Knowledge function                      web browser.

The Spell Check button                  Now you can use the          9.64
in the Detail List toolbar
in the web client UI                    built-in spell checker of a

                                        web browser.

Executive Scorecard                                                  9.63

CI visualization using                  We strongly recommend 9.62
Java Applet                             the customers who are
                                        using Java Applet for CI
                                        visualization to upgrade
                                        the Service Manager
                                        applications to version
                                        9.50 or above, and then
                                        set up SM-UCMDB
                                        integration to visualize
                                        the CI relationships.

                                        For more information,
                                        see Centralized CI
                                        visualization and impact
                                        analysis.

Deprecated item                         Description                          Service Manager 9.81

ir_trace                                             Deprecated since
ir_autostop                                          version
ir_boost_same_sequence                               9.62
ir_cluster_closeness                                 9.62
ir_cluster_symbol                                    9.62
ir_languagefiles_path                                9.62
ir_max_clusters                                      9.62
ir_max_relevant_answers                              9.62
ir_max_shared                                        9.62
ir_min_cluster_members                               9.62
ir_minidf                                            9.62
ir_opt_path                                          9.62
ir_prefix                                            9.62
ir_query_drop_off                                    9.62
ir_term_drop_off                                     9.62
ir_timelimit                                         9.62
ir_asynchronous                                      9.62
alertirqueuelimit                                    9.62
sleep                                                9.62
                                                     9.62
This PDF was generated on May 23, 2026               9.62

                                                                                                   Page 38 of 129

Deprecated item                         Description                Deprecated since
sslProtocols                                                       version

Help center installation                You can use the            9.61
package
                                        sslEnabledProtocols

                                        parameter instead.

                                        The Service Manager        9.60

                                        help centers (Codeless

                                        and Hybrid) are

                                        published on our

                                        information portal.

                                        There are no installation
                                        packages available for
                                        customers to deploy the
                                        help centers on their
                                        own web server or local
                                        host. Customers can
                                        configure the web tier or
                                        Windows client to point
                                        to the public Codeless or
                                        Hybrid help center for
                                        this release:

                                        Web tier parameters:
                                        showHelp,
                                        helpServerHost,
                                        helpServerPort,
                                        helpServerContext
                                        Windows client:
                                        Window >
                                        Preferences > Help
                                        Server

SM Doctor                                                          9.60

acceptfastinfoset                                                  9.50

maxGroupSize                                                       9.50


Deprecated item                         Description  Deprecated since
                                                     version

ir_max_deep_distance                                 9.50

ir_max_shallow_distance                              9.50

allowed                                 This parameter is only 9.50
                                        deprecated if your
                                        Service Manager
                                        applications are
                                        upgraded to version 9.50
                                        or later.

Forbidden Attachment                    This parameter is only 9.50
File Extensions                         deprecated if your
                                        Service Manager
                                        applications are
                                        upgraded to version 9.50
                                        or later.

Obsoleted items

An obsoleted item is categorized as a component/feature/parameter that's no longer
supported.

The following items are no longer supported.


Obsoleted item                          Description            Obsoleted since version

Lync Agent                              To align with Microsoft's 9.80
                                        announcement, Service
                                        Manager 9.80
                                        discontinues the support
                                        of Lync Agent.

ir_sql_limit                                                   9.80

Usage Hub                                                      9.80

usagehubaddress                                                9.80

Internet Explorer (IE) 11                                      9.72

usemembar                               Startup parameter      9.71

WebSphere Application                                          9.71

Server (WAS) 9

Create an anubis agent                  This is the old method to 9.71
record                                  restart stopped
Create an anubis                        background processes
schedule record                         automatically. For better
                                        system performance, we
                                        recommend using the
                                        enableAnubisMonitor
                                        and anubisPollInterval
                                        parameters instead.

Regen All IR Keys option You can run the sm -                  9.71

in Database Dictionary upgradeir command to

                                        regenerate IR indexes

                                        instead.

Windows Server 2016,                                           9.70

2012R2, 2012

Red Hat Enterprise Linux                                       9.70

8, 7.7, 7.6, 7.5, 7.4, 7.3

Obsoleted item                          Description                          Service Manager 9.81

Oracle Enterprise Linux                              Obsoleted since version
8, 7.7, 7.6, 7.5, 7.4, 7.3                           9.70
                                                     9.70
Novell SUSE Linux
Enterprise Server 12                                 9.70
SP4, 12SP3                                           9.70
                                                     9.70
CentOS 8, 7.7, 7.6, 7.5                              9.70
                                                     9.70
PostgreSQL 10, 9.6                                   9.70
                                                     9.70
Oracle 18c, 12c, 12.1, 12.2                          9.70

SQL Server 2017, 2016                                9.70
                                                     9.70
Microsoft Hyper-V 2016,
2012R2, 2012                                         9.70
                                                     9.70
KVM                                                  9.70
                                                     9.70
WebSphere Application
Server (WAS) 8.5                                                                                   Page 42 of 129

JBoss Enterprise Web
Server (JWS) 3.1

IBM HTTP Server 8.5

Apache Tomcat 8.x, 7.x

iOS 12.x, 11.x
Android 9.x, 8.x
Windows 8.1
VMWare vSphere 6.x

This PDF was generated on May 23, 2026

Obsoleted item                          Description  Obsoleted since version

Crystal Report                                       9.70

Solr Search Engine                                   9.70

Service Manager Service                              9.70

Portal

Release Control                                      9.70

Service Request Catalog                              9.70

SC Legacy Listener                                   9.70

SCAuto for NNM (7x) 3.1                 All SCAuto products are 9.70
SCAuto for OMW1.5.0                     obsoleted except for the
SCAuto for OMU1.5.0                     ServiceCenter Automate
SCAuto                                  (SCAuto) Software
Applications (including                 Development Kit (SDK).
SCMAPI)
                                        For SCMapi, you can use
                                        Smart Email - Automatic
                                        record fields update as
                                        an alternative solution.

Red Hat Enterprise Linux                             9.70

6.x

Oracle Enterprise Linux                              9.70

6.x

usedmemcompmode                                      9.70

gcthreshold:n                                        9.70

jssignalexceptions:0                                 9.70

memoryquotapersession                                9.70

:n

Obsoleted item                          Description                          Service Manager 9.81

maxmemoryperthread:0                                 Obsoleted since version
                                                     9.70
printexceptionstackfrequ                             9.70
ency:3
                                                     9.70
memusagereportgranula
rity:n                                               9.70
                                                     9.70
msg_buffer_size:8192                                 9.70
                                                     9.70
logperthread:n                                       9.70
                                                     9.70
memdebug:n                                           9.70
                                                     9.70
utallocmode:n                                        9.70
                                                     9.63
serverjvm:1                                          9.63

que:

restart

restartRandMax

restartGraceInterval

VMWare vSphere 5.x

SQL Server 2014 SP2


Obsoleted item                          Description  Obsoleted since version
Legacy CTI method
                                        Oracle has announced 9.62
                                        that the existing Applet
                                        support in Java SE 8 will
                                        continue through March
                                        2019, after which it may
                                        be removed at any time.
                                        For more information,
                                        see the Java Client
                                        Roadmap Update white
                                        paper.

                                        By following the overall
                                        approach, we strongly
                                        recommend the
                                        customers who are
                                        working with the legacy
                                        method in Service
                                        Manager web client
                                        inbound CTI
                                        implementation to adopt
                                        the new method. You
                                        must upgrade both the
                                        Service Manager
                                        platform and the
                                        applications to version
                                        9.50 or later.

Workflow diagram view                   We strongly recommend 9.62
using Java Applet                       the customers who are
                                        using Java Applet for
                                        diagram view to upgrade
                                        your Classic Service
                                        Manager to the Hybrid or
                                        Codeless mode, and
                                        then view the diagrams
                                        in Process Designer
                                        workflows.

Obsoleted item                          Description                          Service Manager 9.81

Android 7.x                                          Obsoleted since version
                                                     9.62
iOS 10.x                                             9.62
                                                     9.62
Novell SUSE Linux
Enterprise Server 11 SP4                             9.61
                                                     9.61
Apache HTTP Server 2.2                               9.61

Tomcat 8.0.x                                         9.60
                                                     9.60
Novell SUSE Linux                                    9.60
Enterprise Server 12 SP2                             9.60

Tomcat 7.x                                           9.60
                                                     9.51
Android 6.x, 5.x, 4.x                                9.50
                                                     9.50
iOS 9.x, 8.x
                                                     9.50
Microsoft SQL Server                                 9.50
2012                                                 9.50
                                                     9.50
Windows 7
                                                                                                   Page 46 of 129
SRC tablet app

Internet Explorer 10

Novell SUSE Linux
Enterprise 10 SP1

HP-UX (all versions)

Solaris (all versions)

AIX (all versions)

IIS 7.5

This PDF was generated on May 23, 2026

Obsoleted item                          Description        Obsoleted since version

Windows 8                                                  9.50

Windows Server 2008                                        9.50

R2, 2008

Oracle 11g                                                 9.50

DB 2 (all versions)                                        9.50

Microsoft SQL Server                                       9.50

2008 R2, 2008

IBM WebSphere                                              9.50

Application Server (WAS)

7

iOS 7.x                                                    9.50

BlackBerry (all versions)                                  9.50

Client Automation                                          9.50

integration (all versions)

Discovery and                           Replaced by UCMDB  9.50

Dependency Mapping

Inventory integration (all

versions)

Enterprise Collaboration Replaced by SMC                   9.50

integration (all versions)

Microsoft System Center SCCM 2003 and 2007 9.50
Configuration Manager are EOL. This integration
integration (all versions) is replaced by UCMDB

Service Health Analyzer                                    9.50

integration (all versions)

Related topics


Enhancements
Fixed issues
Known issues
````
