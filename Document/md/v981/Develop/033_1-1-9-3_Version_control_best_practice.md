---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.9.3 .. 1.1.9.5
printed_pages: 896-918
---

# 1.1.9.3 Version control best practice

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.9.3. Version control best practice

Create an operator record for each developer

Each developer should have their own operator record to log in to Service Manager
rather than using the default System Administrator operator record. This helps to
track code changes, because the value of the sysmoduser field of the applicatios
object is set as the currently logged-in user.

Streamline the code repository versions

Prior to any development, export the Service Manager OOB database as the initial
repository for future comparison and analysis. Then, export your organization’s
current, customized database as the second-version repository.

            Note

           When you upgrade Service Manager to a later version and resolve all
           conflicts, you must export the complete upgraded database again as the
           new code repository.

Turn off this function when it's not needed

The source version control function decreases system performance. Therefore, you
should comment out the source version control configuration lines in the sm.ini file
when it's not needed.

Synchronize number/counters records after
merging updated code to another environment

When you merge updated code to another environment, sometimes the maximum ID
number in number/counters records may not synchronize with the related records.
Run the following script to synchronize data:

  run ScriptLibrary
  lib.BaseUtil.function synchronizeCountersAndNumbers()

Related topics

Implementing version control for your tailoring
SVN version control process


Applications data file represented in XML


1.1.9.4. Applications data file represented
in XML

Exporting applications from Service Manager converts the applications records to
data files represented in XML, with the applications object name in the <recordset
table> element and the unique id in the <record id> element. The following code is
an example of the Process record:


<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<recordset table="Process">
<record id="process=&quot;cc.first.log&quot;"
recordid="cc.first.log">
<process type="string">cc.first.log</process>
<pre.expressions sctype="array">
<pre.expressions
sctype="operator">$L.oldinc=$L.lastinc</pre.expressions>
<pre.expressions sctype="operator">if ($L.action="lastincident")
then ($L.golast="true";$L.action="log") else ($L.golast="false")
</pre.expressions>
<pre.expressions
sctype="operator">$L.continue=true</pre.expressions>
<pre.expressions sctype="operator">if ($L.action="logcatalog"
and null(title in $L.file)) then (title in $L.file=1 in
description in $L.file)</pre.expressions>
</pre.expressions>
<post.expressions sctype="array">
<post.expressions sctype="operator">if ($G.ess and $L.continue)
then ($L.exit.when.done=true)</post.expressions>
</post.expressions>
<rad sctype="array">
<rad sctype="structure">
<application type="string">sc.get.sla</application>
<names sctype="array">
<names sctype="string">file</names>
<names sctype="string">number1</names>
<names sctype="string">numbers</names>
</names>
<values sctype="array">
<values sctype="string">$L.file</values>
<values sctype="string">contract.id in $L.file</values>
<values sctype="string">agreement.ids in $L.file</values>
</values>
<rad.condition type="operator">enable in $G.sla.environment and
($L.action="complete" or $L.action="log" or
$L.action="logcatalog") and $L.mode="add"</rad.condition>
<pre.rad.expressions sctype="array">
<pre.rad.expressions sctype="operator">if ($affected.ci~="Other
– See Description") then (affected.item in


$L.file=nullsub(affected.item in $L.file, $affected.ci))
</pre.rad.expressions>
</pre.rad.expressions>
<post.rad.expressions sctype="string"/>
</rad>
<rad sctype="structure">
<application type="string">sla.check.sh.wrapper</application>
<names sctype="array">
<names sctype="string">number1</names>
<names sctype="string">text</names>
</names>
<values sctype="array">
<values sctype="string">1 in agreement.ids in $L.file</values>
<values sctype="string">$L.exit</values>
</values>
<rad.condition type="operator">not (null(callback.contact in
$L.file)) and not (null(agreement.ids in $L.file)) and check.sh
in $G.sla.environment and (nullsub($L.overridden, false)=false
or not (same($L.or.id, 1 in agreement.ids in $L.file)))
</rad.condition>
<pre.rad.expressions sctype="array">
<pre.rad.expressions sctype="operator">if (null(agreement.ids in
$L.file) and not (null(agreement.id in $L.file))) then (1 in
agreement.ids in $L.file=agreement.id in $L.file)
</pre.rad.expressions>
</pre.rad.expressions>
<post.rad.expressions sctype="array">
<post.rad.expressions sctype="operator">if ($L.exit="normal")
then ($L.overridden=true;$L.or.id=1 in agreement.ids in $L.file)
</post.rad.expressions>
<post.rad.expressions sctype="operator">if ($L.exit="blocked")
then ($L.string=scmsg(292, "pm", {nullsub(callback.contact in
$L.file, "NULL"), nullsub(1 in agreement.ids in $L.file,
"NULL")});$L.overridden=false;$L.or.id=NULL;$L.action="complete"
;resolution in $L.file=resolution in $L.file+
{$L.string};resolution.code in $L.file="Out of Scope")
</post.rad.expressions>
</post.rad.expressions>
</rad>
<rad sctype="structure">


<application type="string">getnumb</application>
<names sctype="array">
<names sctype="string">name</names>
<names sctype="string">index</names>
<names sctype="string">text</names>
</names>
<values sctype="array">
<values sctype="string">number.record in $L.object</values>
<values sctype="string">incident.id in $L.file</values>
<values sctype="string">"string"</values>
</values>
<rad.condition type="operator">null(incident.id in $L.file)
</rad.condition>
<pre.rad.expressions sctype="array">
<pre.rad.expressions sctype="operator">if ($L.action={"log",
"logexit"} and open in $L.file~="Closed") then (first.call in
$L.file=false)</pre.rad.expressions>
<pre.rad.expressions sctype="operator">if ($L.action=
{"associate", "incident.change", "incident.request",
"createchange", "createrequest", "create"}) then (first.call in
$L.file=false;$L.notify.name="SM Add")</pre.rad.expressions>
<pre.rad.expressions sctype="operator">if ($L.action="complete")
then ($L.oldstatus=open in $L.file;open in
$L.file="Closed";$L.notify.name="SM Close")
</pre.rad.expressions>
<pre.rad.expressions sctype="operator">if ($L.action={"log",
"logexit", "save", "newcall"}) then (open in
$L.file=nullsub(open in $L.file, "Open - Callback");if
($L.bg=false) then ($L.notify.name="SM Add"))
</pre.rad.expressions>
</pre.rad.expressions>
<post.rad.expressions sctype="string"/>
</rad>
<rad sctype="structure">
<application type="string">us.consume.wrapper</application>
<names sctype="array">
<names sctype="string">index</names>
<names sctype="string">name</names>
<names sctype="string">boolean1</names>
<names sctype="string">text</names>


</names>
<values sctype="array">
<values sctype="string">contract.id in $L.file</values>
<values sctype="string">"i"</values>
<values sctype="string">$L.bg</values>
<values sctype="string">$L.exit</values>
</values>
<rad.condition type="operator">enable in $G.cm.control and not
(nullsub(contract.consumed in $L.file, false)) and not
(null(contract.id in $L.file))</rad.condition>
<pre.rad.expressions sctype="array">
<pre.rad.expressions sctype="operator">if (null($G.src) or
$G.src=false) then ($L.exit="normal")</pre.rad.expressions>
</pre.rad.expressions>
<post.rad.expressions sctype="array">
<post.rad.expressions sctype="operator">if ($L.exit="badval")
then if ($L.action="complete") then (open in
$L.file=$L.oldstatus)</post.rad.expressions>
<post.rad.expressions sctype="operator">if ($L.exit="normal")
then (contract.consumed in $L.file=true)</post.rad.expressions>
</post.rad.expressions>
</rad>
<rad sctype="structure">
<application type="string">cc.save</application>
<names sctype="array">
<names sctype="string">file</names>
<names sctype="string">name</names>
<names sctype="string">record</names>
<names sctype="string">boolean1</names>
<names sctype="string">text</names>
</names>
<values sctype="array">
<values sctype="string">$L.file</values>
<values sctype="string">$L.init.action</values>
<values sctype="string">$L.fc</values>
<values sctype="string">$L.bg</values>
<values sctype="string">$L.exit</values>
</values>
<rad.condition type="operator">$L.exit="normal"</rad.condition>
<pre.rad.expressions sctype="array">


<pre.rad.expressions
sctype="operator">$L.handle.save=$L.handle.start</pre.rad.expres
sions>
<pre.rad.expressions sctype="operator">if ($L.handle.start~=0)
then (handle.time in $L.file=nullsub(handle.time in $L.file,
'00:00:00');handle.time in $L.file=(handle.time in
$L.file+tod()) - $L.handle.start;$L.handle.start=0)
</pre.rad.expressions>
<pre.rad.expressions
sctype="operator">$L.init.action=nullsub($L.init.action, "add")
</pre.rad.expressions>
<pre.rad.expressions
sctype="operator">$L.pri.calc=jscall("PriorityCalc.getPriorityCa
lc")</pre.rad.expressions>
</pre.rad.expressions>
<post.rad.expressions sctype="array">
<post.rad.expressions sctype="operator">if ($L.exit="normal")
then if ($L.golast="false") then ($L.lastinc=incident.id in
$L.file)</post.rad.expressions>
<post.rad.expressions sctype="operator">if ($L.exit="badval")
then ($L.handle.start=$L.handle.save;$L.continue=false;if
($L.action="complete") then (open in $L.file=$L.oldstatus))
</post.rad.expressions>
<post.rad.expressions sctype="operator">if ($L.exit="normal" and
$G.ess) then ($L.file.save=$L.file)</post.rad.expressions>
<post.rad.expressions sctype="operator">if ($L.exit="normal" and
not ($G.ess) and blank.call in $G.sm.global.environment) then
($L.format=nullsub(edit.format in $G.sm.environment,
"SD.update.interaction"))</post.rad.expressions>
</post.rad.expressions>
</rad>
<rad sctype="structure">
<application type="string">us.save.relation</application>
<names sctype="array">
<names sctype="string">name</names>
<names sctype="string">prompt</names>
<names sctype="string">query</names>
<names sctype="string">string1</names>
</names>
<values sctype="array">


<values sctype="string">$L.related.id</values>
<values sctype="string">$L.related.filename</values>
<values sctype="string">$L.depend.id</values>
<values sctype="string">$L.depend.filename</values>
</values>
<rad.condition type="operator">not (null($L.related.id)) and
not (null($L.related.filename)) and $L.continue</rad.condition>
<pre.rad.expressions sctype="array">
<pre.rad.expressions
sctype="operator">$L.depend.filename="incidents"
</pre.rad.expressions>
<pre.rad.expressions
sctype="operator">$L.depend.id=str(incident.id in $L.file)
</pre.rad.expressions>
</pre.rad.expressions>
<post.rad.expressions sctype="array">
<post.rad.expressions sctype="operator">if $L.continue then if
(not (null($L.related.id)) and not
(null($L.related.filename))) then
($L.exit="normal";$L.exit.when.done=true)</post.rad.expressions>
<post.rad.expressions sctype="operator">if $L.continue then
($L.related.id=NULL;$L.related.filename=NULL)
</post.rad.expressions>
</post.rad.expressions>
</rad>
<rad sctype="structure">
<application type="string">us.notify</application>
<names sctype="array">
<names sctype="string">name</names>
<names sctype="string">record</names>
<names sctype="string">second.file</names>
</names>
<values sctype="array">
<values sctype="string">$L.notify.name</values>
<values sctype="string">$L.file</values>
<values sctype="string">$L.file.save</values>
</values>
<rad.condition type="operator">$L.exit="normal"</rad.condition>
<pre.rad.expressions sctype="string"/>
<post.rad.expressions sctype="array">


<post.rad.expressions sctype="operator">if ($L.exit="normal" and
not ($L.exit.when.done)) then if blank.call in
$G.sm.global.environment then
($L.exit="restart";$L.void=rtecall("resetnotebook", $L.rc)) else
($L.exit.when.done=true)</post.rad.expressions>
<post.rad.expressions sctype="operator">if ($L.continue and
$L.action="save" and not ($L.exit.when.done)) then
($L.exit="";$L.mode="browse")</post.rad.expressions>
<post.rad.expressions sctype="operator">if
($L.action="addcloseme") then ($L.exit="";$L.mode="browse")
</post.rad.expressions>
<post.rad.expressions sctype="operator">if ($L.continue and
$L.pmtapi=true) then ($L.exit="exit")</post.rad.expressions>
</post.rad.expressions>
</rad>
<rad sctype="structure">
<application type="string">cc.set.approval</application>
<names sctype="array">
<names sctype="string">file</names>
<names sctype="string">record</names>
</names>
<values sctype="array">
<values sctype="string">$L.file</values>
<values sctype="string">$L.object</values>
</values>
<rad.condition type="boolean">false</rad.condition>
<pre.rad.expressions sctype="string"/>
<post.rad.expressions sctype="string"/>
</rad>
</rad>
<next.process sctype="array">
<next.process sctype="string">sm.close</next.process>
<next.process sctype="string">cc.clone.relation</next.process>
<next.process sctype="string">cc.screlate</next.process>
<next.process sctype="string">sm.save</next.process>
</next.process>
<process.condition sctype="array">
<process.condition sctype="operator">$L.continue and
$L.action="addcloseme"</process.condition>
<process.condition sctype="operator">$L.continue and


  ($L.action="save" or $L.mode="addclone") and not ($G.ess)
  </process.condition>
  <process.condition sctype="operator">$L.continue and
  $L.action="complete"</process.condition>
  <process.condition sctype="operator">$G.ess and
  $L.mode="addclone"</process.condition>
  </process.condition>
  <run.standard NullValue="1" type="boolean"/>
  <sysmodcount type="decimal">9</sysmodcount>
  <sysmoduser type="string">zhangqi</sysmoduser>
  <sysmodtime type="dateTime">11/22/13 00:48:44</sysmodtime>
  <save.cursor.position NullValue="1" type="boolean"/>
  <run.in.window NullValue="1" type="boolean"/>
  <window.name NullValue="1" type="string"/>
  <javascript.pre NullValue="1" type="string"/>
  <javascript.post type="string">if (vars.$G_src &amp;&amp;
  vars.$L_exit=="blocked")
  {
  system.functions.msg(vars.$L_string, 3);
  }</javascript.post>
  <baseMethod NullValue="1" type="string"/>
  </record>
  </recordset>

Related topics

Implementing version control for your tailoring
Version control best practice
SVN version control process


1.1.9.5. Parameters to import and export
files

The version control command line tool provides you the following parameters to
import and export specific files. In Service Manager, a file is equivalent to a Relational
Database Management System (RDBMS) table. For more information, see File.

Parameters to export files

To export Service Manager files, you can run the sm -svc_export command with the
following parameters, or add the following parameters in the sm.ini file.

Parameter                                                                                       Service Manager 9.81
svc_rootdir
                                        Description
svc_files
svc_excludefiles                        Specifies the folder to which you
svc_unicode                             export the Service Manager
                                        applications data as XML files. To run
                                        the svc_export command, you must
                                        specify a valid directory with the
                                        read/write permission.

                                        Specifies a list of files to export. Use
                                        commas to separate multiple files (no
                                        space before or after a comma).
                                        Service Manager exports all files in the
                                        system if the parameter is not set.

                                        Specifies a list of files that you want to
                                        exclude from the export operation. Use
                                        commas to separate multiple files (no
                                        space before or after a comma).

                                        Determines whether the exported XML
                                        file names support UTF-8 symbols or
                                        not. The default value is 0. If this
                                        parameter is set to 1, exported XML file
                                        names can contain UTF-8 symbols in
                                        Windows.


Parameter                               Description
svc_language
                                        Specifies the language of the files that
                                        you want to export.

                                             To export files for a specific
                                             language, use svc_language:
                                             <language code> (for exmaple,
                                              svc_language:de ).
                                             To export files for all languages,
                                             use svc_language:all .
                                             If you don't specify the
                                             svc_language parameter, the
                                             system only exports files in
                                             English.

                                        The parameter only works for the files
                                        with the SYSLANGUAGE field, and the
                                        language is the value of
                                        SYSLANGUAGE.

For example, if you want to export ScriptLibrary and formatctrl data only , add the
following line in sm.ini:

  svc_files:ScriptLibrary,formatctrl

Parameters to import files

To import Service Manager files, you can run the sm -svc_import command with the
following parameters, or add the following parameters in the sm.ini file.

 Parameter                                                                                      Service Manager 9.81
 svc_rootdir
                                        Description
 svc_cleanbuild
 svc_files                              Specifies the folder from which you
                                        import the Service Manager
 svc_excludefiles                       applications data. To run the
                                        svc_import command, you must
This PDF was generated on May 23, 2026  specify a valid directory with the
                                        read/write permission.

                                        For example, the ScriptLibrary--g8.xml
                                        file locates in the C:\src\data\dbdict\s
                                        directory. When importing this file, you
                                        need to set the value of
                                        the svc_rootdir parameter to
                                        C:\src\data.

                                        If the value of this parameter is set to 1,
                                        all the files in the svc_rootdir directory
                                        are imported; if the value of this
                                        parameter is set to 0 or not set, the list
                                        of files to import is determined by the
                                        svc_files parameter.

                                        Specifies a list of files to import. Use
                                        commas to separate multiple files (no
                                        space before or after a comma).

                                                    Note

                                                   This parameter works only
                                                   if the svc_cleanbuild
                                                   parameter is set to 0 or not
                                                   set.

                                        Specifies the list of files that's
                                        excluded in the importing operation.
                                        Use commas to separate multiple files
                                        (no space before or after a comma).

                                                                                                                        Page 189 of 254
Parameter                                                                                       Service Manager 9.81
svc_updatedbdict
                                        Description

                                        Imports dbdict changes. Run the
                                        following command to import the
                                        updated dbdict xml files (such as
                                        probsummary.xml) to database:

                                        sm -svc_import -svc_updatedbdict

                                                    Note

                                                   If there are dbdict changes
                                                   without this parameter, the
                                                   system displays some log
                                                   information in the sm.log
                                                   file according to different
                                                   dbdict file names. For
                                                   example:

                                                   dbdict 'probsummary'
                                                   already exists, ignore
                                                   loading! To update the
                                                   dbdict, please add option
                                                   'svc_updatedbdict'

Parameter                                                                                       Service Manager 9.81
svc_postimport
                                        Description

                                        Specifies a list of JavaScript interfaces
                                        to be invoked after the import
                                        operation. Follow these rules when
                                        using this parameter:

                                             Use semicolons to separate
                                             multiple JavaScript interfaces (no
                                             space before or after a
                                             semicolon).
                                             Use parentheses to include
                                             parameters of a JavaScript
                                             interface (no space before or
                                             after parentheses).
                                             Use commas to separate multiple
                                             parameters of a JavaScript
                                             interface (no space before or
                                             after a comma).

 Parameter                                                                                      Service Manager 9.81

This PDF was generated on May 23, 2026  Description

                                                    Note

                                                        Omit the void
                                                        parameter of
                                                        JavaScript. Do not
                                                        omit the parentheses
                                                        even if the JavaScript
                                                        has no parameters.
                                                        Do not include
                                                        parentheses,
                                                        semicolon, and
                                                        commas in the string
                                                        parameter of
                                                        JavaScript.
                                                        The system will not
                                                        exclude the double
                                                        quotation marks or
                                                        the single quotation
                                                        marks of the string
                                                        parameter. For
                                                        example, if you want
                                                        to print Hello world ,
                                                        the system will print it
                                                        with double quotation
                                                        marks. The principle
                                                        is verbatim.

                                        For example:

                                           1. When running the svc_import
                                             command between different
                                             environments, sometimes the
                                             data in the number table and the
                                             counter table may not be
                                             synchronized. You can add
                                             svc_postimport:BaseUtil.synchro
                                             nizeCountersAndNumbers() to
                                             the svc_import command.

                                                                                                                        Page 192 of 254
Parameter                                                                                       Service Manager 9.81

                                        Description
                                           2. To implement multiple JavaScript
                                             interfaces:
                                              svc_postimport:BaseUtil.synchro
                                             nizeCountersAndNumbers();Cust
                                             omerLib.customerFunction(Hello
                                             world, 1234)

For example, if you want to import only records in the ScriptLibrary and formatctrl
folders under the svc_root directory, add the following lines in sm.ini:

  svc_cleanbuild:0
  svc_files:ScriptLibrary,formatctrl

Other parameters

Parameter                                                                                       Service Manager 9.81
svc_mode
                                        Description

                                        Specifies the type of Source Code
                                        Management (SCM) tool.
                                        Possible values:

                                             1: Perforce
                                             2 : Subversion
                                             3 : Git
                                             99 : Null (default)

 Parameter                                                                                      Service Manager 9.81
 svc_dateformat
                                        Description
This PDF was generated on May 23, 2026
                                        Determines the date format of the xml
                                        files that are generated when you run
                                        the svc_export or svc_import
                                        command together with the
                                        svc_mode:2 parameter.
                                        Valid if set from

                                             Server's operating system
                                             command prompt
                                             Initialization file (sm.ini)
                                        Requires restart of the Service
                                        Manager server?
                                        Yes
                                        Default value
                                        MM/DD/YY
                                        Possible values
                                        YYYY/MM/DD
                                        YY/MM/DD
                                        MM/DD/YYYY
                                        MM/DD/YY
                                        DD/MM/YYYY
                                        DD/MM/YY
                                        Example usage
                                        Command line: sm -httpPort:13080 -
                                        sqldb:dbserver -
                                        svc_dateformat:MM/DD/YYYY
                                        Initialization file:
                                        svc_dateformat:MM/DD/YYYY

                                                                                                                        Page 195 of 254

Related topics

Implementing version control for your tailoring
SVN version control process
````
