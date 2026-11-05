---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.10 .. 1.2
printed_pages: 918-941
---

# 1.1.10 Localization

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.10. Localization

Service Manager provides official localization support for a number of languages. To
view a list of the supported languages for the current release, see Support matrix.
Here are some typical Service Manager localization user scenarios for your reference:


User scenarios                          You need to localize the  Procedures
1                                       content developed by
                                        yourself.                 See Localize
2                                                                 untranslated text strings
                                        You have introduced a     in Service Manager
                                        new language that's not   resource files for
                                        officially supported in   detailed instructions.
                                        the out-of-the-box SM
                                        system.                      1. Localize the
                                                                       content in the SM
                                                                       database. See
                                                                       Localize Service
                                                                       Manager into
                                                                       unsupported
                                                                       languages for
                                                                       detailed
                                                                       instructions.

                                                                     2. Localize the
                                                                       content in SM UI.
                                                                       See Localize
                                                                       untranslated text
                                                                       strings in Service
                                                                       Manager resource
                                                                       files for detailed
                                                                       instructions.


User scenarios                          You have introduced a    Procedures
3                                       new language that's not
                                        officially supported in     1. Localize the
                                        the out-of-the-box SM         content in the SM
                                        system. You have              database. See
                                        worked with this system       Localize Service
                                        for a while and now you       Manager into
                                        have upgraded SM to a         unsupported
                                        higher version.               languages for
                                                                      detailed
                                                                      instructions.

                                                                    2. Localize the
                                                                      content in SM UI.
                                                                      See Localize
                                                                      untranslated text
                                                                      strings in Service
                                                                      Manager resource
                                                                      files for detailed
                                                                      instructions.


User scenarios                                                   Procedures
4
                                        You haven't introduced   The Service Manager
                                        any new language to SM.  Applications Upgrade
                                        Now you have upgraded    Utility upgrades the
                                        SM to a higher version.  existing language packs
                                                                 during the upgrade
                                                                 process. The content in
                                                                 the SM database gets
                                                                 localized automatically.

                                                                 Note that a new version
                                                                 of SM may introduce
                                                                 new strings in the UI.
                                                                 You need to manually
                                                                 localize these new
                                                                 strings. See Localize
                                                                 untranslated text strings
                                                                 in Service Manager
                                                                 resource files for
                                                                 detailed instructions.


1.1.10.1. Localize untranslated text strings
in Service Manager resource files

If you want to localize untranslated text strings in Service Manager, follow the
instructions in this section.

            Note

           For the Windows Client, it is hard to distribute text translations by
           customers; additionally, since the company has been focusing on defect
           fixings instead of new feature development since Windows Client 9.3x, a
           very limited number of new text strings have been introduced. For these
           reasons, the Windows Client doesn't really needs self localization and is
           hence not discussed in this section.

Applications

The localization of the applications may include the following types of records:
Format, Message, Help, HTML Template, and Unit of Measure.

Format

To localize a Format record into a target language (for example, Korean), follow these
steps:

   1. Sign in to the Service Manager Windows client as a system administrator with
     the target language.

   2. From the System Navigator, click Tailoring > Forms Designer.
   3. In the Form field, enter the name of the format.
   4. Click Search to display the record.
   5. Click Design.
   6. Localize the format record to the target language.
   7. Click OK.
   8. Click OK.

For more information, see Forms Designer.

Message

To localize a Message record into a target language, follow these steps:

   1. Sign in to Service Manager as a system administrator.


   2. From the System Navigator, click Tailoring > Notifications > Messages.
   3. Enter other information as appropriate, and then click Search to display the

     record.
   4. Update the Text field to a localized version for the target language.
   5. Click Save.

For more information, see Add a message record.

Help

To localize a Help record into a target language, follow these steps:

   1. Sign in to the Service Manager Windows client as a system administrator with
     the target language.

   2. From the System Navigator, click Tailoring > Database Manager.
   3. Type help in the Form field, and then click Search.
   4. Double-click the help (help.g) form.
   5. Click Search to display the record.
   6. Update the help record.
   7. Click Save.
   8. Click Accept.

For more information, see Field help editor.

HTML Template

To localize an HTML template into a target language, follow these steps:

   1. Sign in to the Service Manager Windows client as a system administrator with
     the target language.

   2. From the System Navigator, click Tailoring > Notifications > HTML Templates.
   3. Enter information as appropriate, and then click Search to display the record.
   4. Update the template record to a localized version for the target language.
   5. Click Save.

Teams Message Template

To localize a Teams message template into a target language, follow these steps:

   1. Sign in to the Service Manager Windows client as a system administrator with
     the target language.

   2. From the System Navigator, click Tailoring > Notifications > Teams Message
     Templates.

   3. Enter information as appropriate, and then click Search to display the record.


   4. Update the template record to a localized version for the target language.
   5. Click Save.

Unit of Measure

To localize a unit of measure into a target language, follow these steps:

   1. Sign in to the Service Manager Windows client as a system administrator with
     the target language.

   2. From the System Navigator, click Tailoring > Database Manager.
   3. Type unitofmeasure in the Table field, and then click Search.
   4. Enter information as appropriate, and then click Search to display the record.
   5. Update the Unit of Measure record to a localized version for the target language.
   6. Click Save.

Web Tier

The Service Manager Web Tier is a standard web application developed with Java,
which uses the standard internalization technique introduced in Java Standard
Edition.

The text strings that need to be localized are located in the following files:


  <webtier-9.xx.war>/WEB-INF/classes/alert_en.properties
  <webtier-9.xx.war>/WEB-INF/classes/calendarBundle_en.properties
  <webtier-9.xx.war>/WEB-INF/classes/chMBundle_en.properties
  <webtier-9.xx.war>/WEB-
  INF/classes/com/hp/ov/cwc/web/app_labels_en.properties
  <webtier-9.xx.war>/WEB-
  INF/classes/com/hp/ov/sm/client/webtier/branding/brandingBundle_
  en.properties
  <webtier-9.xx.war>/WEB-
  INF/classes/com/hp/ov/sm/client/webtier/cac/cac_logon_en.propert
  ies
  <webtier-9.xx.war>/WEB-
  INF/classes/com/hp/ov/sm/client/webtier/cpe_web_en.properties
  <webtier-9.xx.war>/WEB-
  INF/classes/com/hp/ov/sm/client/webtier/diagram/diagram_en.prope
  rties
  <webtier-9.xx.war>/WEB-
  INF/classes/com/hp/ov/sm/client/webtier/L10N/recordList/recordLi
  st_en.properties
  <webtier-9.xx.war>/WEB-
  INF/classes/com/hp/ov/sm/client/webtier/report/pivot/pivot_en.pr
  operties
  <webtier-9.xx.war>/WEB-
  INF/classes/com/hp/ov/sm/client/webtier/smc/smc_en.properties
  <webtier-9.xx.war>/WEB-
  INF/classes/com/hp/ov/sm/client/webtier/view/cpew_view_en.proper
  ties
  <webtier-9.xx.war>/WEB-
  INF/classes/com/hp/ov/sm/client/webtier/xslstrings_en.properties
  <webtier-9.xx.war>/WEB-
  INF/classes/conditionEditorBundle_en.properties
  <webtier-9.xx.war>/WEB-INF/classes/dashboardBundle_en.properties
  <webtier-9.xx.war>/WEB-
  INF/classes/globalSearchBundle_en.properties
  <webtier-9.xx.war>/WEB-INF/classes/workflowBundle_en.properties

The originally localized cwc_labels file in languages other than English are as follows:


<webtier-9.xx.war>/WEB-INF/classes/alert_xx.properties
<webtier-9.xx.war>/WEB-INF/classes/calendarBundle_xx.properties
<webtier-9.xx.war>/WEB-INF/classes/chMBundle_xx.properties
<webtier-9.xx.war>/WEB-
INF/classes/com/hp/ov/cwc/web/app_labels_xx.properties
<webtier-9.xx.war>/WEB-
INF/classes/com/hp/ov/sm/client/webtier/branding/brandingBundle_
xx.properties
<webtier-9.xx.war>/WEB-
INF/classes/com/hp/ov/sm/client/webtier/cac/cac_logon_xx.propert
ies
<webtier-9.xx.war>/WEB-
INF/classes/com/hp/ov/sm/client/webtier/cpe_web_xx.properties
<webtier-9.xx.war>/WEB-
INF/classes/com/hp/ov/sm/client/webtier/diagram/diagram_xx.prope
rties
<webtier-9.xx.war>/WEB-
INF/classes/com/hp/ov/sm/client/webtier/L10N/recordList/recordLi
st_xx.properties
<webtier-9.xx.war>/WEB-
INF/classes/com/hp/ov/sm/client/webtier/report/pivot/pivot_xx.pr
operties
<webtier-9.xx.war>/WEB-
INF/classes/com/hp/ov/sm/client/webtier/smc/smc_xx.properties
<webtier-9.xx.war>/WEB-
INF/classes/com/hp/ov/sm/client/webtier/telephony/telephonyBundl
e_xx.properties
<webtier-9.xx.war>/WEB-
INF/classes/com/hp/ov/sm/client/webtier/view/cpew_view_xx.proper
ties
<webtier-9.xx.war>/WEB-
INF/classes/com/hp/ov/sm/client/webtier/xslstrings_xx.properties
<webtier-9.xx.war>/WEB-
INF/classes/conditionEditorBundle_xx.properties
<webtier-9.xx.war>/WEB-INF/classes/dashboardBundle_xx.properties
<webtier-9.xx.war>/WEB-
INF/classes/globalSearchBundle_xx.properties
<webtier-9.xx.war>/WEB-INF/classes/workflowBundle_xx.properties


Each resource file follows a naming rule, which is
<basename>_<language>.properties or
<basename>_<language>_<country>.properties. Take the cpe_web_en.properties file
for example, cpe_web is the basename, and en is the language code. For
cpe_web_zh_CN.properties, CN is the country code. The file names are case-
sensitive.

The following table lists the language codes of the supported languages in Service
Manager. This table uses cpe_web as an example resource file base name (other
resource files follow the same rule).

Resource base  Language Code Country Code          Service Manager 9.81
name
cpe_web        en                           Description
cpe_web        ar
cpe_web        cs                           Default
cpe_web        de                           English
cpe_web                                     Arabic
                                            Czech
cpe_web        es                           German
                                            (Standard)
cpe_web        fr                           Spanish(Spain)
                                            French(Standard)
cpe_web        hu                           Hungarian
                                            Italian (Standard)
cpe_web        it                           Japanese
                                            Korean
cpe_web        ja                           Chinese (PRC)
                                            Dutch (Standard)
cpe_web        ko                           Portuguese
                                            (Brazil)
cpe_web        zh                       CN  Russia
                                            Hebrew
cpe_web        nl                           Polish
                                            Turkish
cpe_web        pt_BR

cpe_web        ru

cpe_web        iw

cpe_web        pl

cpe_web        tr


As of Java 9, UTF-8 is the default encoding specifically for property resource
bundles. So, you can directly add your newly introduced string in native language to
the target .properties file.
For example, you can add the below string in Turkish to the cpe_web_tr.properties
file.

  WebController.Main_Menu_1=Ana Menü

Mobility Client

Text strings in Mobility Client that should be localized are located in the following
folder: <webapp-9.xx.xxxx.war>\WEB-INF\classes. There are three base names:
appLoginBundle, appMainBundle, and getIT.
The steps are similar to those for the web tier. For details, see the Web Tier section
above.

Chat

To localize the Chat UI into a target language, follow these steps:

   1. Go to the <chat-ui-xxxx.war>\assets\locales folder.
   2. Open the folder for the target language. For example, open the tr folder for

     Turkish.
   3. Open the i18n.json file in a text editor.
   4. Update the untranslated text strings in this file to the target language.
   5. Save the file with the UTF-8 encoding.

                   Caution

                Do not save it with the ANSI encoding.


1.1.10.2. Localize Service Manager into
unsupported languages

This section aids the company's partners to localize Service Manager into an
unofficially supported language. The partners can export translatable content from
Service Manager, translate these content, and then import the localized content back
to Service Manager.

Export the content for translation

This section describes how to extract the content to be translated. Later, you can
import the translated content back to Service Manager.

Navigate to the <RTE installation folder>/RUN directory and then run the following
command:

sm -bg -str_export:all

The system generates the following files and folder in the RUN directory:

     htmltemplates (folder)
     format.str
     help.str
     htmltemplates.str
     msMessageTemplate.str
     message.str
     unitofmeasure.st

The htmltemplates folder contains html files.

Translate the exported content

You can translate the exported content to the target language(s). This section
provides instructions about how to manage the content for translation.

            Note

           This section is for software localization professionals only. We assume
           that you have a profound understanding of software product localization,
           knowledge of which items require translation, and knowledge of the
           relevant translation tools.


Service Manager doesn't provide any translation or translation memory features. We
recommend you either use a translation tool (such as Passolo or Trados) or use the
services of professionals that use such kinds of tools.

Follow these steps to access, configure, and translate the exported content:

   1. Ensure that you have read the Service Manager Localization Rules. Make sure
     that your translations meet the guidelines and requirements described in this
     section.

  2. Create a folder named<new_lang> according to the target language, and then
     copy all the export content to this folder.

  3. Translate each file in the <new_lang> folder.

Refer to the following example for the Vietnamese language:

   1. From the System Navigator, click Tailoring > Database Manager.
   2. Type language in the Table field, type language in the Form field, and then

     click Search.
   3. Double-click the language format to open the Language Identification page.
   4. Type Vietnamese in the language field, and then click Search.

     The identifier for the Vietnamese language record is vi .
   5. Create a folder named vi and copy all the export content to this folder.
   6. Translate each file in the vi folder.

            Note

           You need to add the target language to the language table in the Service
           Manager environment if it doesn't already exist.

Import the localized content and active the
language

This section describes how to import the translated content back to Service Manager.

Copy the <new_lang> folder to the <RTE installation folder>/RUN directory, and then
run the following command in the RUN directory:

sm -bg -str_import:all -str_language:<language name>

            Note

           The system will first remove all files for this language.


            Note

           You must enclose the language name in double quotation marks if the
           language name contains a space. For example, sm -bg -str_import:all -
           str_language:"Chinese Simplified".

Refer to the following example for the Vietnamese language:

Copy the vi folder to the RUN directory, and then run the following command in the
RUN directory:

sm -bg -str_import:all -str_language:Vietnamese

Follow these steps to active the Vietnamese language record after import:

   1. From the System Navigator, click Tailoring > Database Manager.
   2. Type language in the Table field, type language in the Form field, and then click

     Search.
   3. Double-click the language format to open the Language Identification page.
   4. Type Vietnamese in the language field, and then click Search.
   5. Select the Active for logins checkbox.
   6. Click Save.


1.1.10.3. Service Manager localization
rules

Preface

This section describes the localization rules for Service Manager. Be sure to adhere to
these rules and localize language and words only when allowed.

The product name Service Manager should always be in English in all cases. Module
names such as Incident Management, and Problem Management should be localized
according to ITIL standards or left in English, depending on market requirements.

Localization rules for software

Properties files for format, message and help on field

The strings extracted from format, message and help on field are placed in the
format.properties, message.properties, and help.properties files, respectively. When
you translate strings from format, message, and help on field, you must follow these
rules:

     Files that return from translation and need to be imported must be encoded in
     ANSI (not Unicode).

     For example, the English string "Properties" should appear as:
     "Propri\u00e9t\u00e9s" (which is encoded in ANSI) rather than the native string
     in French: "Propriétés" (which is encoded in Unicode).

                   Note

                To convert a file with native strings to ASCII encoding (in the /u####
                representation) and vice versa, you can use the “native2ascii” tool
                provided in the Java JDK. More information on this tool is available
                at
                https://docs.oracle.com/javase/8/docs/technotes/tools/windows/nat
                ive2ascii.html.

     Use hyphens instead of n-dashes.

     Use hyphens instead of n-dashes when localizing strings such as:
      FORMAT.STR/AlertDef.g\13\0\0\0\Caption=$L.slo.expiration - SLO expiration
     date/time .


If you use an n-dash (for example, $L.slo.expiration - SLO expiration
date/time ), this character will display as a symbol (something like a vertical
rectangle).
Use a backslash before double quotes.
If you need to insert double quotes within a string to identify GUI terms, use an
escaping backslash before the double quotes.

            Caution

           If we don't have backslashes preceding the double quotes, the
           string will be truncated, giving us error while re-importing the files
           into Translation Editor.

The following is an example:
When you write:

  <span class=FormTitle>Recherche $$(_DocumentLabel)</span>
  <br> Entrez
  autant de valeurs que vous le souhaitez pour affiner la
  recherche, puis
  appuyez sur le bouton "Rechercher".

The string will be truncated and will display as:

  <span class=FormTitle>Recherche $$(_DocumentLabel)</span>
  <br> Entrez
  autant de valeurs que vous le souhaitez pour affiner la
  recherche, puis
  appuyez sur le bouton

In order to avoid this, you need to write the string like this:

  <span class=FormTitle>Recherche $$(_DocumentLabel)</span>
  <br> Entrez
  autant de valeurs que vous le souhaitez pour affiner la
  recherche, puis
  appuyez sur le bouton \"Rechercher\".


            Note

           If double quotes are already included in the strings, don't delete
           them.

If the strings contain logic or variables, the logic should not be broken and the
variables should not be translated.
See the following examples:

      <word>;<word>:\:\<word> should be translated as <trans>;<trans>:\:\
     <trans> .
      &<char> or $<word> should remain untranslated.
     Strings that contain parameters like {0} can be translated, but the variable
     representation must remain unchanged - {0}.
     For example: {0} files were found in folder {1} will be translated to
     Chinese as {1} 件夹中发现了{0} 个 件 .
Do NOT add special characters unless they appear in the English strings.

Translate the output and caption strings for each label exactly the same way.

For each label in a form, there are two strings: output and caption. The two
strings must be translated exactly the same way. The following screenshots
illustrate an example string ID: Alert.detail.g\3. The first part of the string
corresponds to the actual form, the numbers correspond to the position within
the form (x and y coordinates).



Properties files for the clients

Do not remove \n where in use, otherwise the string will be truncated because
sentences don't wrap automatically with the Eclipse client.

JS and HTML files

Follow the standard rules in the localization industry.

How to find strings in the application

The string ID consists of the format name and a numbering scheme for the position
within the format. The format name can be entered in Service Manager Forms
Designer. Follow these steps to find strings:

   1. Start the Service Manager server.


   2. Start the Service Manager client (don't close the Command Prompt window).
   3. Select your login language.
   4. Sign in to Service Manager as a system administrator.
   5. Type fd in the Service Manager command line field, and then press Enter. The

     Forms Designer window opens.
   6. Type the full format name and click OK to search for a specific format.
   7. Type *.g to search for all formats with the ending .g or type any letter to

     search for all formats starting with that letter.

How to find Help on Field messages in the
application

Field Help enables the user to learn more about an individual field in a form and the
value to specify in the field.

Follow these steps to view Field Help:

   1. Navigate to any Service Manager form.
   2. Insert the cursor in any field or table cell.

   3. Do one of the following:

           Press CTRL+H.
           Click Help > Help on Field.
           Click Help on the toolbar.

Strings that must remain in English

See the following table for strings that must remain in English.

 Type                                                                                           Service Manager 9.81
 Event names
 Predefined system events               Examples
 boolean expressions
 parameter names                        rmqin
 RAD debugger commands                  rmlin
                                        rmoin
 Display list variables
                                        alerts recalc
This PDF was generated on May 23, 2026  alerts reset
                                        approval
                                        approval reeval

                                        UNKNOWN
                                        TRUE
                                        FALSE

                                        analyzelog
                                        lockanalysis
                                        lockslog

                                        d (display)
                                        t (trace)
                                        ta
                                        tar
                                        tt
                                        b (breakpoint)
                                        ba (ba menu.manager)
                                        bt (bt rinit)
                                        c (continue)
                                        s (step)
                                        gl (globals)
                                        v (variables)
                                        l (locals)
                                        sta (stack)
                                        re (relations)
                                        m (memory)
                                        h (help)

                                        $G.init.impact.disp
                                        $G.urgency.disp

                                                                                                                        Page 218 of 254

1.2. Introduction

This document is intended for Service Manager system administrators and
implementers. It assumes that the reader is familiar with object-oriented
programming, the Service Manager System language (RAD), and JavaScript. It
provides a brief introduction to RAD, and it provides an overview of JavaScript
functionality in Service Manager, using both examples and descriptions of
JavaScript's objects, properties, methods, and functions.

System administrators and implementers can use the standard JavaScript scripting
language and RAD to customize their Service Manager applications. RAD is the
Service Manager system language that enables administrators and implementers to
manipulate Service Manager processes and workflows. JavaScript is a widely
supported, industry-standard programming language that eliminates the need for a
separate programming skill set, and reduces user reliance on proprietary tools.
JavaScript in Service Manager doesn't invalidate the current Service Manager RAD
tool set; instead, the JavaScript interface is an alternative to the RAD language for
tailoring.The main components of this document are:

     System language (RAD)
     JavaScript and Service Manager
     Where to use JavaScript in Service Manager
     System language reference that describes the RAD functions, rtecalls, and RAD
     routines
     JavaScript and Service Manager reference that describes the JavaScript global
     system objects, JavaScript global methods, Service Manager defined JavaScript
     objects, JavaScript functions, JavaScript functions in the ScriptLibrary, and
     JavaScript examples
````
