---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.11.14.2 .. 1.11.14.2
printed_pages: 3049-3064
---

# 1.11.14.2 Outbound Email

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.11.14.2. Outbound Email

Applies to User roles: System Administrator
The outbound email (also known as JavaMail) for the Smart Email solution provides a
monitor to handle Service Manager e-mail events. This monitor connects Service
Manager into standard e-mail facilities and allows Service Manager operators and
applications to send HTML emails. Any mail system that supports Simple Mail
Transfer Protocol (SMTP) or has an SMTP gateway or bridge can receive e-mail from
Service Manager if the outbound email is enabled.

            Note

           If you have already implemented a different outbound email solution such
           as SCAuto Mail or Connect-IT, you can also continue to use it as the
           outbound email solution for Smart Email.

To set up outbound email for the Smart Email solution, you need to configure the
emailout parameter in the sm.ini file or SMIS integration. For detailed information on
configuring the emailout parameter, see Startup parameter: emailout or Configure
Emailout parameters in SMIS.

            Note

           Only messages enclosed within HTML tags can be sent out as HTML
           emails, otherwise messages are sent as plain text.

Related topics

Event Services


1.11.14.2.1. Event Services and Service
Manager e-mail

The Service Manager Mail Utility checks the operator file for valid operator names
before allowing mail to be sent. The Event Services version of this application
expands the checking for valid users to those defined in the Service Manager
contacts file.

The purpose of checking is to obtain the e-mail address from the e-mail field for the
operator or contacts file. If the name for the addressee doesn't select a record from
either file, Service Manager assumes that there is no such addressee and doesn't
send mail. You can override this default by creating a login.event Format Control
record and, in the Calculations section, setting the add condition to true and the
calculation expression to the following: $email.noaddr.ok=true .

This causes Service Manager to assume that whatever name is passed to the e-mail
event as the addressee is the complete e-mail address and attempts to send mail
using that address.

Related topics

Event Services


1.11.14.2.2. Support of cc and bcc fields
for outbound emails

The Service Manager Server now supports the use of the cc, bcc, and reply.to fields
when sending email out through the eventout queue.
In email eventout, the evsysopt field is used to determine whether you want to use
these fields:

     If this field is set to 0 or empty, the format for the evfields field is
     user.to^user.from^user.array^subject^text.
     If this field is set to 1, the format for the evfields field is
     user.to^user.from^user.cc^user.bcc^reply.to^subjext^text.

Sample scripts

The following are two sample scripts for your reference.
Sample 1

  var eventout = new SCFile("eventout");
  eventout.evtype = "email";
  eventout.evtime = system.functions.tod();
  eventout.evexpire = system.functions.tod();
  eventout.evsysseq = String(Number(new Date()));
  eventout.evsepchar = "^";
  eventout.evfields =
  "tim@microfocus.com^smith@microfocus.com^John@microfocus.com^mar
  ry@microfocus.com^smith@microfocus.com ;John@microfocus.com
  ^hello^hello all"; eventout.evsysopt = "1"; eventout.doSave();

Sample 2


var GroupTypes = ['assignment', 'cm3groups', 'ocmgroups',

'oncall'];

var GroupInformations = {

'assignment': {'file': 'assignment', 'nameField': 'name',

'memberField': 'operators'},

'cm3groups': {'file': 'cm3groups', 'nameField': 'name',

'memberField': 'members'},

'ocmgroups': {'file': 'ocmgroups', 'nameField': 'name',

'memberField': 'members'},

'oncall':   {'file': 'oncall',          'nameField': 'name',

'memberField': 'schedule', 'subMemberField': 'contact'}

};

function testSendEmail()

{

var from = 'falcon';

var toUsers = ['falcon'];

var toGroups = {'assignment': ['Application', 'ASSET

MANAGEMENT'], 'cm3groups': 'Application'}; //2 group types

var ccUsers = ['Adam.Cailat','Admin.General']; //2 operators

var ccGroups = {'ocmgroups': ['ASSET MANAGEMENT'], 'oncall': 'HP

Admin'}; //2 group types. 1 group for each type

var bccUsers = ['Adrian.Baxt'];

var bccGroups = {'assignment': ['Application', 'ASSET

MANAGEMENT']}; //2 assignment groups

var replyTo = 'falcon';

var title = 'this is a test email';

var content = 'this is the email content';

sendEmail(from, toUsers, toGroups, ccUsers, ccGroups, bccUsers,

bccGroups, replyTo, title, content);

}

testSendEmail();

/**

* Send email by creating a record in the eventout file

*

* toUsers, ccUsers, bccUsers, replyTo can be an JS array of

operator/contact/email names or one operator/contact/email name.

* toGroups, ccGroups, bccGroups should be an JS object. The key

of the object is the group type ('assignment' or 'cm3groups' or

'ocmgroups' or 'oncall').

* The value is an array of groups or one group of that group


type.
*/
function sendEmail(from, toUsers, toGroups, ccUsers, ccGroups,
bccUsers, bccGroups, replyTo, title, content)
{
if(from == null)
{
from = "";
}
if( title == null)
{
title = "";
}
if(content == null)
{
content = "";
}
var to = generateEmailAdress(toUsers, toGroups);
var cc = generateEmailAdress(ccUsers, ccGroups);
var bcc = generateEmailAdress(bccUsers, bccGroups);
replyTo = generateEmailAdress(replyTo);
var sep = '^';
var eventout = new SCFile("eventout");
eventout.evtype = "email";
eventout.evtime = system.functions.tod();
eventout.evexpire = system.functions.tod();
eventout.evsysseq = String(Number(new Date()));
eventout.evsepchar = sep;
eventout.evfields = to + sep + from + sep + cc + sep + bcc + sep
+ replyTo + sep + title + sep + content;
eventout.evsysopt = "1";
eventout.doSave();
}
function generateEmailAdress(users, groups)
{
if(groups == null)
{
groups = {};
}
var emails = {};


var members = {};
checkUsers(emails, members, users);
var length = GroupTypes.length;
for(var i = 0; i < length; i++)
{
var groupType = GroupTypes[i];
var groupNames = groups[groupType];
if(groupNames != null)
{
getGroupMembers(members, groupNames, groupType);
}
}
queryUserEmail(emails, members);
var res = "";
for( var email in emails )
{
if(emails[email] === true)
{
res = res + email + ';';
}
}
return res;
}
function queryUserEmail(emails, usersObj)
{
var users = objToArray(usersObj);
var length = users.length;
if(length === 0)
{
return;
}
var query;
if( length === 1 )
{
query = 'name="' + users[0] + '"';
}
else
{
query = 'name isin ' + system.functions.str(users);
}


var operator = new SCFile('operator', SCFILE_READONLY);
operator.setFields(['name','email']);
res = operator.doSelect(query);
for(; res === RC_SUCCESS; res = operator.getNext())
{
var email = operator.email;
if(email != null)
{
emails[email] = true;
delete usersObj[operator.name];
}
}
users = objToArray(usersObj);
length = users.length;
if( length === 1 )
{
query = 'contact.name="' + users[0] + '"';
}
else
{
query = 'contact.name isin ' + system.functions.str(users);
}
var contacts = new SCFile('contacts', SCFILE_READONLY);
contacts.setFields(['email']);
var res = contacts.doSelect(query);
for(; res === RC_SUCCESS; res = contacts.getNext())
{
var email = contacts.email;
if(email != null)
{
emails[email] = true;
}
}
}
function getGroupMembers(members, groupNames, groupType)
{
if(groupNames == null)
return members;
var groupInfo = GroupInformations[groupType];
if(groupInfo == null)


return members;
return _getGroupMembers(members, groupNames, groupInfo.file,
groupInfo.nameField, groupInfo.memberField,
groupInfo.subMemberField);
}
function _getGroupMembers(members, groupNames, fileName,
nameField, memberField, subMemberField)
{
var query;
if (system.functions.type(groupNames) == 8)
{
query = nameField + ' isin ' + system.functions.str(groupNames);
}
else
{
query = nameField + ' = "' + groupNames + '"';
}
var file = new SCFile(fileName, SCFILE_READONLY);
file.setFields([memberField]);
var res = file.doSelect(query);
for(; res === RC_SUCCESS; res = file.getNext())
{
var temp = file[memberField];
if(temp == null)
{
continue;
}
if(subMemberField != null)
{
var length = temp.length();
for(var i = 0; i < length; i++ )
{
var userName = temp[i][subMemberField];
if(userName != null && userName != '')
{
members[userName] = true;
}
}
continue;
}

  temp = temp.toArray();                            Service Manager 9.81
  var length = temp.length;                                              Page 7 of 220
  for(var i = 0; i < length; i++ )
  {
  var userName = temp[i];
  if(userName != null && userName != '')
  {
  members[userName] = true;
  }
  }
  }
  return members;
  }
  function isEmailAdress(name)
  {
  return name.indexOf('@') != -1;
  }
  function checkUsers(emails, members, users)
  {
  if(users == null)
  return;
  if(users instanceof Array)
  {
  var length = users.length;
  for( var i = 0; i < length; i++ )
  {
  var value = users[i];
  if(value != null)
  {
  if(isEmailAdress(value))

                        {
                            emails[value] = true;

                        }
                        else
                        {

                            members[value] = true;
                        }
  }
  }
  }

This PDF was generated on May 23, 2026

  else
  {
  if(isEmailAdress(users))
  {
  emails[users] = true;
  }
  else
  {
  members[users] = true;
  }
  }
  }
  function objToArray(obj)
  {
  var res = [];
  for( var name in obj)
  {
  if(obj[name] === true)
  {
  res.push(name);
  }
  }
  return res;
  }

Support of the CC and BCC fields in HTML Email
notifications

Out-of-box, the CC and BCC fields are available when sending an HTML Email
notification from a record. For details, see Sending HTML email messages manually.


1.11.14.2.3. Append an S/MIME digital
signature to outbound emails

Secure/Multipurpose Internet Mail Extensions (S/MIME) is a method of exchanging
emails securely. With the S/MIME technology, a digital signature can be appended to
email messages to ensure non-repudiation and data integrity.

Starting with SM 9.33, you can enable a mechanism in Service Manager to allow for
the signing of outbound email messages using the S/MIME technology. Once you
enable this feature, the recipients can verify the signature on their mail system (for
example, Microsoft Outlook), to make sure that the email messages are truly
originated from Service Manager without being intercepted in transit.

Enable S/MIME signatures for non-FIPS
environment

To enable an S/MIME digital signature for outbound emails for a non-FIPS
environment, you need to obtain or generate a PKCS12 certificate and then specify
three server parameters in the sm.ini file or the emailout parameter:
SMIMEKeystore , SMIMEKeystorePass , and SMIMEKeyAlias .

The following is an example of enabling S/MIME digital signatures for outbound
emails:

   1. Generate the keystore in PKCS12 format. For example, with the OpenSSL toolkit,
     you can use the following openssl command:

      keytool -genkey -keystore smemailkey.p12 -storepass smemailkeystorepass -
     alias smemailkeyalias -storetype pkcs12 -keyalg rsa

   2. Place the generated keystore file (smemailkey.p12) in the <SM Server>/RUN
     directory.

   3. Configure these parameters in sm.ini:

      SMIMEKeystore:smemailkey.p12

      SMIMEKeystorePass:smemailkeystorepass

      SMIMEKeyAlias:smemailkeyalias


                   Tip

                An alternative way to set these parameters is to add the parameters
                to the emailout process in sm.cfg , as shown in the following
                example:

                 sm -emailout -mailFrom:xx -smtphost:xx -smtpport:xx -
                SMIMEKeystore:smemailkey.p12 -
                SMIMEKeystorePass:smemailkeystorepass -
                SMIMEKeyAlias:smemailkeyalias

   4. Restart the Service Manager server.

Enable S/MIME signatures for FIPS environment

To enable an S/MIME digital signature for outbound emails for a FIPS environment,
you need to obtain or generate a BCFKS certificate and then specify three server
parameters in the sm.ini file or the emailout parameter: SMIMEKeystore ,
SMIMEKeystorePass , and SMIMEKeyAlias .

            Note

           If you have generated the keystore in PKCS12 format before, you can run
           the following command to covert the keystore to BCFKS format:

           jre/bin/keytool -importkeystore -srckeystore smemailkey.p12 -
           destkeystore smemailkey.smemailkey.BCFKS -srcstoretype PKCS12 -
           deststoretype BCFKS -deststorepass smemailkeystorepass -srcstorepass
           smemailkeystorepass -providerclass
           org.bouncycastle.jcajce.provider.BouncyCastleFipsProvider -providerpath
           lib/bc-fips-1.0.2.4.jar

The following is an example of enabling S/MIME digital signatures for outbound
emails:

   1. Generate the keystore in BCFKS format. For example, you can use the following
     keytool command:

      keytool -genkey -keystore smemailkey.BCFKS -storepass smemailkeystorepass
     -alias smemailkeyalias -storetype BCFKS -providerclass
     org.bouncycastle.jcajce.provider.BouncyCastleFipsProvider -providerpath bc-
     fips-1.0.2.4.jar -keyalg rsa


     Note: The bc-fips-1.0.2.4.jar file can be located in the RUN/lib folder.
   2. Place the generated keystore file (smemailkey.BCFKS) in the <SM Server>/RUN

     directory.
   3. Configure these parameters in sm.ini:

      SMIMEKeystore: smemailkey.BCFKS
      SMIMEKeystorePass:smemailkeystorepass
      SMIMEKeyAlias:smemailkeyalias

                   Tip

                An alternative way to set these parameters is to add the parameters
                to the emailout process in sm.cfg , as shown in the following
                example:
                 sm -emailout -mailFrom:xx -smtphost:xx -smtpport:xx -
                SMIMEKeystore:smemailkey.BCFKS -
                SMIMEKeystorePass:smemailkeystorepass -
                SMIMEKeyAlias:smemailkeyalias

   4. Restart the Service Manager server.

Related topics

Startup parameter: emailout


1.11.14.2.4. Configure Emailout parameters
in SMIS

The Emailout instance is available in SMIS integration from Service Manager 9.81.

The existing email out settings in sm.ini configured through Startup parameter: emailout are

still available.

If you choose to use SMIS to configure emailout settings, you need set

the emailoutConfigFromSmisOnly:1 server parameter. After this parameter is
enabled, the parameters defined in the emailout process through sm.cfg and sm.ini won't

work. Instead, those parameter values such as smtphost will only be get from SMIS
configuration.

Currently the SMTP OAUTH2 authentication only applies to Gmail.

If you are using Gmail and would like to apply OAUTH authentication for SMTP protocol, then

you need to move the emailout settings to SMIS instance. Make sure you have Web Server
URL in System Information Record. See Configure the Service Manager Web tier
server URL.

   1. Sign in to Service Manager with a System Administrator account.
   2. Select Tailoring > Integration Manager. Integration Manager opens.
   3. Click Add to open the wizard.
   4. Select EmailOut, click Next.
   5. Fill in the information and click Next.
   6. Configure the emailout parameters as required. See Startup parameter: emailout.
   7. If you need to configure the related settings for OAuth2 authentication,

     check OAuth authentication.
        1. You need to set redirect URI in Google cloud console: https://<SM Webtier
           Host>/<Context Path>/oauth/callback . Where <SM Webtier
           Host>/<Context Path> should match the Web Server URL defined in
           System Information Record. For
           example: https://myserver.mydomain.com:myport/webtier/oauth/callback
        2. You may get Client ID and Client Secret from Google cloud console.
        3. Clicking on Get Access Token will jump to google authentication page to
           get the access token.
        4. Once you successfully get the access token, the “Token Available”
           message is displayed.

   8. Click Finish to save the configurations.


Once SMIS configurations are changed, you need to restart the whole SM Server
Cluster to apply the updates. Restarting SMIS instance only won't take effect.
Restarting one host will apply the new changes on this host only, while other hosts
won't get the updated values.
````
