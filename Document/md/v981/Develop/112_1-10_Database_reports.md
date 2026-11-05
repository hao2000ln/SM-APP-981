---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.10 .. 1.11
printed_pages: 3012-3041
---

# 1.10 Database reports

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.10. Database reports

Service Manager database report works with third-party reporting tools (such as
Microsoft Power BI) to provide visualized reports generated from your queried
database view for the purposes of analysis, data discovery, and so on. To create
reports from the database view, you need a working knowledge of your DBMS or
RDBMS, the third-party reporting tools, and a general understanding of Service
Manager applications and utilities.

For additional information about any of these concepts, see the following:

     For information about a particular third-party reporting tool, refer to the vendor
     documentation for your reporting tool.
     For information about a particular RDBMS, refer to the vendor documentation for
     your database type.
     For database configuration, see Prepare your RDBMS.
     For information about Service Manager administration and configuration, and
     customizing the Service Manager product, see this help center.

            Note

                Database report is accessible to the users with the SysAdmin
                capability word.
                Database report works with Service Manager applications version
                9.7x. However, if you perform a fresh installation of version 9.7x
                binaries and keep using an earlier applications version but still hope
                to use Crystal Report to generate operational reports, you need to
                keep the old binaries and then connect to the legacy integration of
                the earlier version. Refer to the Service Manager Help Center for
                detailed instructions.


            Caution

           Running complex SQL statements as typical for the reporting purpose
           against the Service Manager production database may result in serious
           performance issues like table locks and deadlocks. Therefore we strongly
           recommend setting up a replica of the Service Manager production
           database synchronized by the RDBMS mechanism and connecting the
           reporting application to this replica database. In this configuration,
           reporting SQL statements no longer cause locks that will block Service
           Manager production.

Add a new database report

To add a new database report, follow these steps:

   1. From the System Navigator, click Tailoring > Database Report.
   2. Type a unique name for the new report in the Report Name field.

   3. Type a unique name for the new report database view in the Database View
     Name field. Only English characters, numbers, and underscores are supported.

     If you leave the Database View Name field empty, the system automatically
     generates a name by adding the V_ prefix to the report name. Moreover, if you
     include other characters in the report name, the system replaces these
     characters with underscores.

   4. Specify one or more files on the File Names tab.

     To add a file to the report, either type the file name directly or select a file from
     the drop-down list.

     To remove a file from the report, either click the file name and then press
     Backspace or Delete.

   5. Click Add to add this new report.

   6. Configure the required information for the report.

Field/Tab                                                                                 Service Manager 9.81
Field Names
                                        Description
Relations
                                        Displays only the fields that have
                                        column names in the files. If there
                                        are duplicated field column names in
                                        different files, the alternate column
                                        name automatically combines the
                                        file name and the column name.

                                        To include a field in the database
                                        view, select Yes in the Field
                                        Selected drop-down list of this field.

                                        Defines the relations between
                                        different source and target files and
                                        fields. You can combine the data
                                        from multiple files and fields into a
                                        single report.

                                        Note: If you have selected multiple
                                        files on the File Names tab, you
                                        must define the corresponding
                                        relations for each selected file on
                                        the Relations tab.

                                        Note: You can't use the fields in the
                                        alias table to define the relations.


Field/Tab                               Description
Filters
                                        Add one or more conditions to filter
                                        the data in the database view.

                                        Click Add New Filter Criteria.
                                        Populate all the fields as required,
                                        and then click Finish to add the
                                        criterion to the Conditions list.

                                        Click Add New Compound to add a
                                        compound rule to a filter that has
                                        more than one criterion.

                                        Note: You can't use the fields in the
                                        alias table to define the filter criteria.

SQL                                     Displays the SQL scripts to create a
Select All Fields                       database view. When you add or
Use Alias Fields                        update a report, the system
                                        generates the SQL scripts
                                        automatically.

                                        Select this checkbox to include all
                                        fields in the database view. After you
                                        select this checkbox, your setting in
                                        the Field Selected drop-down list of
                                        a field on the Field Names tab will be
                                        overridden.

                                        After you select Yes in the Field
                                        Selected drop-down list of a field,
                                        select this checkbox to include its
                                        related alias fields in the database
                                        view.

7. (Optional) Click Refresh from DBDICT to fetch the latest data update from the
  database dictionary to the current report.

8. Click Save and OK.


   9. Click Create Database View to execute the SQL scripts and create a database
     view.

                   Note

                A database view will not be created automatically after you add or
                update a database report. You must click Create Database View to
                create a database view.

Modify an existing database report

To modify an existing database report, follow these steps:

   1. From the System Navigator, click Tailoring > Database Report. Click Search to
     display the current report list.

   2. Click a report to display the detailed configuration.
   3. Configure the required report view information.
   4. Click Save to save your modifications, and then click Create Database

     View. The existing database view with the same name will be overwritten.

            Note

           Removing a report will not remove its relevant database view.

Example: Generating an Incident by CI Types report
with Microsoft Power BI

This section provides an example tutorial for creating reports using Microsoft Power
BI. You will need a Power BI license or a trial version to apply the steps in this section.
This type of report can also be created using other BI tools, which may also suit your
business needs.

Suppose you might want to create a report that displays the details of all incident
records by CI types. Follow these steps to create a report with data extracted from the
probsummary table and the device table:

   1. Download and install Power BI Desktop from Microsoft website.

   2. Sign in to Service Manager as a system administrator.
   3. From the System Navigator, click Tailoring > Database Report. Click Search to

     display the current report list.
   4. Type Incident CI Used in the Report Name field, type probsummary and device

     in the File Names fields respectively, and then click Add.


5. Click the Field Names tab, and then review the fields to be used to generate the
  database report view. If a field is unnecessary, select No in the Field Selected
  drop-down list of this field.

6. Click the Relations tab, and then specify the values as follows:

Source File                             Source Field  Target File  Target Field
Name                                    Name          Name         Name

probsummary                             logical.name  device       logical.name

7. Click the Filters tab, and then click Add New Filter Criteria. Specify the values
  as follows:

File Name                               Field Name    Comparison   Value
device                                  istatus       Equals       In Use

 8. Click Finish and Save.

 9. Click Create Database View. The system opens a dialog that may resemble the
    following:

    The database view V_INCIDENT_CI_USED will be replaced if it exists. Do you
    want to process?

    Click Yes.

    Note: The SQL scripts in the demo data is generated based on the SQL server. If
    you are working with the Oracle or PostgreSQL database, you can click Create
    database view directly and the system will automatically convert the SQL scripts
    to the SQL execution of the corresponding database.

10. Launch Power BI, and then connect to the Service Manager database.
11. Select the V_INCIDENT_CI_USED view, and then click Load.

12. Click Pie chart, set the value for the Legend section to DEVICE_TYPE, and then
    set the value for the Values section to Count of DEVICE_TYPE. See the following
    screenshot as an example:


13. The report will be generated. See the following screenshot as an example:


1.11. Service Manager third-party
components

This topic lists the third-party components in Service Manager and their versions.

Server


Module                                  Name                   Version
Server
Server                                  asm-3.2.jar            3.2
Server
Server                                  bcmail-fips-1.0.4.jar  1.0.4
Server
Server                                  bcpkix-fips-1.0.6.jar  1.0.6
Server
                                        bc-fips-1.0.2.4.jar    1.0.2.4
Server
Server                                  boost                  1.80

Server                                  cglib-2.2.jar          2.2

Server                                  commons-beanutils-     1.9.4
Server
Server                                  1.9.4.jar
Server
Server                                  commons-codec-1.15.jar 1.15
Server
Server                                  commons-collections- 3.2.2
Server                                  3.2.2.jar
Server
                                        commons-collections4- 4.1
                                        4.1.jar

                                        commons-email-1.5.jar 1.5

                                        commons-email-1.3.jar 1.3

                                        commons-io-2.11.0.jar 2.11.0

                                        commons-lang-2.6.jar 2.6

                                        commons-lang3-3.4.jar 3.4

                                        commons-logging-1.2.jar 1.2

                                        coreutils              5.3.0

                                        diffutils              2.8.7-1

                                        ecj-4.4.jar            4.4


Module                                  Name                      Version
Server                                  ews-java-api-2.0.jar      2.0
Server                                  ezmorph-1.0.6.jar         1.0.6
Server                                  FastInfoset-1.1.1.jar     1.1.1
Server                                  google-collections-       1.0
                                        1.0.jar
Server                                  gson-2.9.0.jar            2.9.0
Server                                  htmlparser-1.6.jar        1.6
Server                                  httpclient-4.5.13.jar     4.5.13
Server                                  httpcore-4.4.4.jar        4.4.4
Server                                  idm-client-core-1.10.37-  1.10.37-4
                                        4.jar
Server                                  icu4c                     70.1
Server                                  itext-2.1.7.js2.jar       2.1.7.js2
Server                                  jackson-annotations-      2.15.0
                                        2.15.0.jar
Server                                  jackson-core-2.15.0.jar   2.15.0
Server                                  jackson-databind-         2.15.0
                                        2.15.0.jar
Server                                  jackson-module-jaxb-      2.15.0
                                        annotations-2.15.0.jar
Server                                  jasperreports-6.13.0.jar  6.13.0
Server                                  javax.mail-1.6.2.jar      1.6.2
Server                                  jaxb-api-2.3.1.jar        2.3.1


Module                                  Name                   Version
Server
Server                                  jaxb-impl-2.3.3.jar    2.3.3
Server
Server                                  jcommon-1.0.21.jar     1.0.21
Server
                                        jfreechart-1.0.17.jar  1.0.17
Server
Server                                  jgroups-5.2.2.jar      5.2.2
Server
Server                                  JRE                    Zulu11.54+25-CA
Server
Server                                                         (Win/Linux)
Server
Server                                  joda-time-2.8.jar      2.8

Server                                  json-20231013.jar      20231013
Server
Server                                  json-lib-2.4.jar       2.4

Server                                  jsonic-1.3.0.jar       1.3.0
Server
Server                                  jsoup-1.15.4.jar       1.15.4

                                        jsr311-api-1.0.jar     1.0

                                        kuromoji-ipadic-0.9.0.jar 0.9.0

                                        langdetect-1.1-        1.1-20120112
                                        20120112.jar

                                        log4j-api-2.20.0.jar   2.20.0

                                        log4j-core-2.20.0.jar  2.20.0

                                        log4j-slf4j-impl-      2.20.0
                                        2.20.0.jar

                                        log4j-jcl-2.20.0.jar   2.20.0

                                        libjpeg                9d

                                        libpng                 1.6.37


Module                                  Name                     Version
Server                                  libtiff                  4.1.0
Server                                  libZip                   1.9.2
Server                                  log4j-2.17.1.jar         2.17.1
Server                                  lucene-analyzers-        7.3.0
                                        common-7.3.0.jar
Server                                  lucene-analyzers-        7.3.0
                                        kuromoji-7.3.0.jar
Server                                  lucene-core-7.3.0.jar    7.3.0
Server                                  lucene-demo-7.3.0.jar    7.3.0
Server                                  mimepull-1.9.3.jar       1.9.3
Server                                  mmseg4j-core-1.10.0.jar  1.10.0
Server                                  Mozilla Nspr             Mozjs-50.0.2
Server                                  openldap                 2.4.59
Server                                  opennlp-tools-1.8.4.jar  1.8.4
Server                                  opennlp-uima-1.8.4.jar   1.8.4
Server                                  opencv                   3.4.3
Server                                  openssl                  1.0.2zf
Server                                  openldap                 2.4.42
Server                                  oro-2.0.8.jar            2.0.8
Server                                  pcre2                    10.40
Server                                  PostgreSQL               14.5


Module                                  Name                   Version
Server
Server                                  saaj-api-1.3.5.jar     1.3.5
Server
                                        saaj-impl-1.5.0.jar    1.5.0
Server
Server                                  securityContext-       05.00.001
Server                                  05.00.001.jar
Server
Server                                  slf4j-api-2.0.7.jar    2.0.7
Server
Server                                  SpiderMonkey           50.0.2
Server
                                        spring-2.5.jar         2.5
Server
Server                                  spring-aop-5.2.22.jar  5.2.22
Server
Server                                  spring-beans-5.2.22.jar 5.2.22
Server
                                        spring-context-5.2.22.jar 5.2.22
Server
Server                                  spring-core-5.2.22.jar 5.2.22

                                        spring-expression-     5.2.22
                                        5.2.22.jar

                                        spring-web-5.2.22.jar 5.2.22

                                        tika-core-2.7.0.jar    2.7.0

                                        Tomcat                 9.0.63

                                        wink-common-1.4.jar    1.4

                                        wink-json-provider-    1.4

                                        1.4.jar

                                        wink-server-1.4.jar    1.4

                                        wink-spring-support-   1.4

                                        1.4.jar

 Module                                 Name                             Service Manager 9.81
 Server                                 XercesC
 Server                                 Zlib     Version
                                                 3.2.3
Web tier                                         1.2.12


Module                                  Name                   Version
Web tier
Web tier                                bc-fips-1.0.2.4.jar    1.0.2.4
Web tier
Web tier                                btf-1.3.jar            1.3
Web tier
                                        castor-core-1.4.1.jar  1.4.1
Web tier
Web tier                                castor-xml-1.4.1.jar   1.4.1

Web tier                                commons-beanutils-     1.9.4

Web tier                                1.9.4.jar

Web tier                                commons-codec-1.4.jar 1.4

Web tier                                commons-collections- 3.2.2
                                        3.2.2.jar
Web tier
                                        commons-collections4- 4.2
Web tier                                4.2.jar
Web tier
Web tier                                commons-compress- 1.21
Web tier                                1.21.jar

                                        commons-configuration- 1.10
                                        1.10.jar

                                        commons-digester-      2.1

                                        2.1.jar

                                        commons-fileupload- 1.3.3
                                        1.3.3.jar

                                        commons-io-2.7.jar     2.7

                                        commons-lang-2.6.jar 2.6

                                        commons-lang3-3.4.jar 3.4

                                        commons-logging-1.1.jar 1.1


Module                                  Name                    Version
Web tier
                                        commons-math3-          3.6.1
Web tier
Web tier                                3.6.1.jar
Web tier
Web tier                                concurrent-1.3.4.jar    1.3.4
Web tier
                                        curvesapi-1.06.jar      1.06
Web tier
Web tier                                FastInfoset-1.2.15.jar  1.2.15
Web tier
                                        ecj-4.4.jar             4.4
Web tier
                                        genericHandlersFramew 2
Web tier                                ork-2.0.jar
Web tier
                                        httpclient-4.5.13.jar   4.5.13
Web tier
Web tier                                httpcore-4.4.3.jar      4.4.3
Web tier
                                        istack-commons-         3.0.7
Web tier
                                        runtime-3.0.7.jar

                                        idm-client-core-1.10.37- 1.10.37-4
                                        4.jar

                                        itext-2.1.7.js7.jar     2.1.7

                                        jackson-annotations-    2.15.0
                                        2.15.0.jar

                                        jackson-core-2.15.0.jar 2.15.0

                                        jackson-coreutils-2.0.jar 2.0

                                        jackson-databind-       2.15.0
                                        2.15.0.jar

                                        jackson-jaxrs-base-     2.12.7
                                        2.12.7.jar


Module                                  Name                      Version
Web tier                                                          2.12.7
                                        jackson-jaxrs-json-
Web tier                                provider-2.12.7.jar       2.15.0

Web tier                                jackson-module-jaxb-      1.1.2
Web tier                                annotations-2.15.0.jar    1.1.2
Web tier                                                          1
Web tier                                jai_codec-1.1.2.jar       1.4.2

Web tier                                jai_core-1.1.2.jar        1.2.2

Web tier                                jai_imageio-1.0.jar       1.2.1

Web tier                                jakarta.xml.soap-api-     1.3.5
                                        1.4.2.jar
Web tier                                                          2.3.5
                                        jakarta.activation-
Web tier                                1.2.2.jar                 6.13.0
Web tier                                                          2.0.02
Web tier                                jakarta.activation-api-   1.2.0
                                        1.2.1.jar
Web tier                                                          1
Web tier                                jakarta.annotation-api-   2.3.1
Web tier                                1.3.5.jar                 2.3.1

                                        jakarta.xml.bind-api-
                                        2.3.5.jar

                                        jasperreports-6.13.0.jar

                                        javahelp-2.0.02.jar

                                        javax.activation-api-
                                        1.2.0.jar

                                        javax.inject-1.jar

                                        jaxb-api-2.3.1.jar

                                        jaxb-runtime-2.3.1.jar


Module                                  Name                   Version
Web tier
Web tier                                jaxen-1.1.3.jar        1.1.3

Web tier                                jboss-jaxrs-           2.0.2.Final
                                        api_2.1_spec-
Web tier                                2.0.2.Final.jar
Web tier
Web tier                                jboss-logging-         3.4.3.Final
Web tier                                3.4.3.Final.jar
Web tier
Web tier                                jcl-over-slf4j-1.7.30.jar 1.7.30
Web tier
Web tier                                jcommon-1.0.21.jar     1.0.21
Web tier
Web tier                                jcs-1.3.jar            1.3
Web tier
Web tier                                jdom2-2.0.6.jar        2.0.6
Web tier
Web tier                                jettison-1.5.3.jar     1.5.3
Web tier
Web tier                                jfreechart-1.0.17.jar  1.0.17

                                        js-1.7R4.jar           1.7

                                        json-patch-1.13.jar    1.13

                                        jsoup-1.15.4.jar       1.15.4

                                        jstl-api-1.2.1.jar     1.2.1

                                        jstl-impl-1.2.4.jar    1.2.4

                                        less-compile-1.2.jar   1.2

                                        log4j-api-2.17.1.jar   2.17.1

                                        log4j-core-2.17.1.jar  2.17.1

                                        log4j-slf4j2-impl-2.17.1.jar 2.17.1

                                        log4j-web-2.17.1.jar   2.17.1


Module                                  Name                         Version
Web tier                                                             1.9.3
Web tier                                mimepull-1.9.3.jar           1.1.2
Web tier                                                             1.2
Web tier                                mlibwrapper_ jai-1.1.2.jar   4.2.0
Web tier                                                             unknown
Web tier                                msg-simple-1.2.jar           1.5
Web tier                                                             4.1.2
Web tier                                mxgraph-core.jar             4.1.2
Web tier                                                             4.1.2
                                        neva-unknown.jar
Web tier                                                             1.0.4
                                        opencsv-1.5.jar
Web tier                                                             5.0.7.Final
                                        poi-4.1.2.jar
Web tier                                                             5.0.7.Final
                                        poi-ooxml-4.1.2.jar
Web tier                                                             5.0.7.Final
                                        poi-ooxml-schemas-
Web tier                                4.1.2.jar                    5.0.7.Final

Web tier                                reactive-streams-            5.0.7.Final
                                        1.0.4.jar
Web tier                                                             1.3.5
Web tier                                resteasy-core-spi-           1.5.2
                                        5.0.7.Final.jar

                                        resteasy-core-
                                        5.0.7.Final.jar

                                        resteasy-jackson2-
                                        provider-5.0.7.Final.jar

                                        resteasy-jaxb-provider-
                                        5.0.7.Final.jar

                                        resteasy-servlet-
                                        initializer-5.0.7.Final.jar

                                        saaj-api-1.3.5.jar

                                        saaj-impl-1.5.2.jar


Module                                  Name                   Version
Web tier
                                        securityContext-       05.00.001
Web tier                                05.00.001.jar
Web tier
Web tier                                sitemesh-2.3.jar       2.3
Web tier
Web tier                                slf4j-api-1.7.30.jar   1.7.30
Web tier
Web tier                                SparseBitSet-1.2.jar   1.2
Web tier
                                        spring-aop-5.3.27.jar  5.3.27
Web tier
Web tier                                spring-beans-5.3.27.jar 5.3.27

Web tier                                spring-context-5.3.27.jar 5.3.27

Web tier                                spring-core-5.3.21.jar 5.3.21

Web tier                                spring-expression-     5.3.27
                                        5.3.27.jar
Web tier
Web tier                                spring-jcl-5.3.27.jar  5.3.27
Web tier
                                        spring-security-config- 5.8.3
                                        5.8.3.jar

                                        spring-security-core- 5.8.3
                                        5.8.3.jar

                                        spring-security-crypto- 5.8.3
                                        5.8.3.jar

                                        spring-security-web-   5.8.3

                                        5.8.3.jar

                                        spring-web-5.3.27.jar  5.3.27

                                        ssce-5.10.jar          5.10

                                        stax-ex-1.8.jar        1.8


 Module                                 Name                 Version
 Web tier
 Web tier                               thumbnailator-0.4.8.jar 0.4.8
 Web tier
 Web tier                               tika-core-2.7.0.jar  2.7.0
 Web tier
 Web tier                               txw2-2.3.1.jar       2.3.1
 Web tier
 Web tier                               EXT JS               4.1
 Web tier
 Web tier                               EXT JS               3.4

 Web tier                               amplifyjs            1.1.0

 Web tier                               jquery.selectBoxIt   v3.8.1
 Web tier
 Web tier                               jquery               v3.6.3
 Web tier
                                        jqueryui             v1.13.2
Windows client
                                        com.github.taylorhakes:p 8.1.0
                                        romise-polyfill

                                        com.github.indutny:ellipti 6.4.1
                                        c

                                        mxgraph              4.2.0

                                        CKEditor             4.21.0

                                        codemirror           5.56.0M1

                                        react                17.0.2


Module                                  Name                    Version
Windows client
Windows client                          Eclipse RCP             4.24-202206070700
Windows client
Windows client                          bc-fips-1.0.2.4.jar     1.0.2.4
Windows client
Windows client                          CKEditor                4.21.0
Windows client
Windows client                          commons-lang-2.2.jar 2.2

Windows client                          commons-logging-1.1.jar 1.1
Windows client
                                        concurrent-1.3.4.jar    1.3.4
Windows client
                                        FastInfoset-1.2.15.jar  1.2.15
Windows client
Windows client                          jackson-annotations-    2.15.0
Windows client                          2.15.0.jar
Windows client
                                        jackson-core-2.15.0.jar 2.15.0
Windows client
Windows client                          jackson-databind-       2.15.0
Windows client                          2.15.0.jar

                                        jackson-module-jaxb-    2.15.0
                                        annotations-2.15.0.jar

                                        jai_codec-1.1.2.jar     1.1.2

                                        jai_core-1.1.2.jar      1.1.2

                                        jai_imageio-1.0.jar     1

                                        jakarta.activation-     1.2.2

                                        1.2.2.jar

                                        jcommon-1.0.21.jar      1.0.21

                                        jcs-1.3.jar             1.3

                                        jdom2-2.0.6.jar         2.0.6


 Module                                 Name                        Version
 Windows client                         jettison-1.5.3.jar          1.5.3
 Windows client                         jfreechart-1.0.17.jar       1.0.17
 Windows client                         js-1.6R4.jar                1.6R4
 Windows client                         jsoup-1.15.4.jar            1.15.4
 Windows client                         ktable.jar                  unknown
 Windows client                         log4j-api                   2.17.1
 Windows client                         log4j-core                  2.17.1
 Windows client                         mimepull-1.9.3.jar          1.9.3
 Windows client                         mlibwrapper_ jai-1.1.2.jar  1.1.2
 Windows client                         saaj-api-1.3.5.jar          1.3.5
 Windows client                         saaj-impl-1.5.2.jar         1.5.2
 Windows client                         stax-ex-1.8.jar             1.8
 Windows client                         serializer-2.7.2.jar        2.7.2
 Windows client                         servlet-4.0.6.jar           4.0.6
 Windows client                         wintertreesc-5.10.jar       5.1
 Windows client                         xalan-2.7.2.jar             2.7.2
 Windows client                         jre                         zulu17.42.19-17.0.7-
                                                                    win_x64
Chat server

 Module                                 Name                              Service Manager 9.81
 Chat server                            Openfire
                                                  Version
Mobility                                          4.7.5


Module                                  Name                     Version
Mobility
Mobility                                activation-1.1.1.jar     1.1.1
Mobility
                                        bc-fips-1.0.2.4.jar      1.0.2.4
Mobility
Mobility                                bsf-springsecurity204- 05.10.310
Mobility                                authn-05.10.310.jar

Mobility                                checker-qual-3.12.0.jar 3.12.0

Mobility                                commons-codec-1.13.jar 1.13

Mobility                                commons-collections4- 4.4
Mobility                                4.4.jar
Mobility
Mobility                                commons-configuration- 1.8
                                        1.8.jar
Mobility
                                        commons-fileupload- 1.3.3
Mobility                                1.3.3.jar

Mobility                                commons-io-2.11.0.jar 2.11.0
Mobility
                                        commons-lang-2.6.jar 2.6

                                        commons-lang3-3.1.jar 3.1

                                        commons-logging-api- 1.0.4
                                        1.0.4.jar

                                        commons-math3-           3.6.1

                                        3.6.1.jar

                                        error_prone_annotations 2.11.0
                                        -2.11.0.jar

                                        failureaccess-1.0.1.jar  1.0.1

                                        FastInfoset-1.2.18.jar   1.2.18


Module                                  Name                    Version
Mobility
Mobility                                genericHandlersFramew 2.0.1
Mobility                                ork-2.0.1.jar
Mobility
Mobility                                guava-31.1-jre.jar      31.1
Mobility
Mobility                                idm-client-core-1.10.37- 1.10.37-4
Mobility                                4.jar
Mobility
Mobility                                istack-commons-         3.0.11
Mobility
Mobility                                runtime-3.0.11.jar
Mobility
Mobility                                j2objc-annotations-     1.3

                                        1.3.jar

                                        jackson-annotations-    2.15.0
                                        2.15.0.jar

                                        jackson-core-2.15.0.jar 2.15.0

                                        jackson-databind-       2.15.0
                                        2.15.0.jar

                                        jackson-module-jaxb-    2.15.0
                                        annotations-2.15.0.jar

                                        jakarta.activation-     1.2.2

                                        1.2.2.jar

                                        jakarta.xml.bind-api-   2.3.3

                                        2.3.3.jar

                                        jakarta.xml.soap-api-   1.4.2

                                        1.4.2.jar

                                        javax.activation-api-   1.2.0

                                        1.2.0.jar

                                        jaxb-api-2.3.1.jar      2.3.1


Module                                  Name                   Version
Mobility
Mobility                                jaxb-runtime-2.3.3.jar 2.3.3
Mobility
Mobility                                jcl-over-slf4j-1.7.30.jar 1.7.30
Mobility
Mobility                                jempbox-1.8.16.jar     1.8.16
Mobility
Mobility                                jsoup                  1.16.1

Mobility                                jsr305-3.0.2.jar       3.0.2
Mobility
Mobility                                jstl-api-1.2.1.jar     1.2.1
Mobility
Mobility                                jstl-impl-1.2.4.jar    1.2.4

Mobility                                listenablefuture-9999.0- 9999.0
Mobility                                empty-to-avoid-conflict-
Mobility                                with-guava.jar
Mobility
                                        log4j-api-2.17.1.jar   2.17.1
Mobility
                                        log4j-core-2.17.1.jar  2.17.1

                                        log4j-slf4j-impl-2.17.1.jar 2.17.1

                                        log4j-web-2.17.1.jar   2.17.1

                                        metadata-extractor-    2.18.0
                                        2.18.0.jar

                                        poi-4.1.2.jar          4.1.2

                                        saaj-api-1.3.5.jar     1.3.5

                                        saaj-impl-1.5.2.jar    1.5.2

                                        securityContext-       05.00.001
                                        05.00.001.jar

                                        slf4j-api-1.7.30.jar   1.7.30


Module                                  Name                   Version
Mobility
Mobility                                SparseBitSet-1.2.jar   1.2
Mobility
Mobility                                spring-aop-5.3.27.jar  5.3.27
Mobility
                                        spring-beans-5.3.27.jar 5.3.27
Mobility
Mobility                                spring-context-5.3.27.jar 5.3.27

Mobility                                spring-context-support- 5.3.27
Mobility                                5.3.27.jar

Mobility                                spring-core-5.3.27.jar 5.3.27
Mobility
                                        spring-expression-     5.3.27
Mobility                                5.3.27.jar

Mobility                                spring-jcl-5.3.27.jar  5.3.27

Mobility                                spring-mobile-device- 1.1.2
                                        1.1.2.RELEASE.jar
Mobility
Mobility                                spring-oxm-5.3.27.jar  5.3.27

                                        spring-security-config- 5.8.3
                                        5.8.3.jar

                                        spring-security-core- 5.8.3
                                        5.8.3.jar

                                        spring-security-crypto- 5.8.3
                                        5.8.3.jar

                                        spring-security-web-   5.8.3

                                        5.8.3.jar

                                        spring-web-5.3.27.jar  5.3.27

                                        spring-webmvc-         5.3.27
                                        5.3.27.jar

Module                                  Name                                             Service Manager 9.81
Mobility                                stax-ex-1.8.3.jar
Mobility                                txw2-2.3.3.jar           Version
Mobility                                tika-core-1.28.5.jar     1.8.3
Mobility                                tika-parsers-1.28.5.jar  2.3.3
Mobility                                xmpcore-6.1.11.jar       1.28.5
Mobility                                Sencha Touch             1.28.5
                                                                 6.1.11
                                                                 2.4.2

            © Copyright 2026 Open Text
For more info, visit https://docs.microfocus.com
````
