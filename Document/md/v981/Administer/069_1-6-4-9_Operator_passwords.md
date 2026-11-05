---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.6.4.9 .. 1.6.4.9
printed_pages: 1696-1716
---

# 1.6.4.9 Operator passwords

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.4.9. Operator passwords

Passwords play a major part in controlling system security within Service Manager. To
protect your system from unauthorized access, you can require passwords for every
operator.

A System Administrator can change any operator password. Users can also change
their own passwords, unless the System Administrator denies operators password
modification privileges through extra tailoring.

A System Administrator can set password format restrictions and time limits from the
System Information Record. The System Administrator can set the following password
options:

     Format requirements
     Maximum and minimum lifetimes
     The default password for reset passwords
     Enable the forgot password function and configure the related settings

A System Administrator can also configure a series of security questions on the
System Security Question page after the forgot password function is enabled.

Related topics

Adding users
Checklist: Adding a new user
Controlling user access and security
Creating operator records
Defining named users
Operator records
Operator templates
Change a user's password
Disable the password reset option
Enable password history
Enable the password reset option
Enable the forgot password option
Reset an operator's password
Set password format restrictions
Set password maximum lifetimes
Set password minimum lifetimes


1.6.4.9.1. Change a user's password

Applies to User roles: System Administrator

            Note

           A System Administrator can both change and reset a user password.
           Changing an operator password permanently changes the password.
           Resetting an operator password temporarily changes the password until
           the operator next logs in at which time Service Manager prompts the
           operator to change the password.

To change a user password, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select the operator with password to be changed.
   5. Click the Security tab.
   6. In the Password field, type the new password for the operator.
   7. Click Save.

Related topics

Application Setup
Checklist: Adding a new user
Controlling user access and security
Creating operator records
Operator passwords
Operator records
Operator templates
Disable the password reset option
Enable the password reset option
Enable password history
Reset an operator's password
Set password format restrictions
Set password minimum lifetimes
Set password minimum lifetimes


1.6.4.9.2. Disable the password reset
option

Applies to User roles: System Administrator

To disable the password reset option, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Passwords tab.
   3. Select the Prevent Pwd Resets option.
   4. Click Save.

Related topics

Application Setup
Checklist: Adding a new user
Controlling user access and security
Creating operator records
Operator passwords
Operator records
Operator templates
Change a user's password
Enable the password reset option
Enable password history
Reset an operator's password
Set password format restrictions
Set password minimum lifetimes
Set password minimum lifetimes


1.6.4.9.3. Enable password history

Applies to User roles: System Administrator

To enable password history, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Password Standards tab.
   3. Select the Keep Password History option.
   4. Click Save.

Related topics

Application Setup
Checklist: Adding a new user
Controlling user access and security
Creating operator records
Operator passwords
Operator records
Operator templates
Change a user's password
Disable the password reset option
Enable the password reset option
Reset an operator's password
Set password format restrictions
Set password minimum lifetimes
Set password minimum lifetimes


1.6.4.9.4. Enable the password reset
option

Applies to User roles: System Administrator
The Reset Operators Password option provides temporary passwords. However,
when you reset an operator password, Service Manager doesn't verify that the new
password conforms to any of the password standards that you can define in the
company record.
To enable the password reset option, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Password Standards tab.
   3. Select one of the following options.

       Password reset option                                                              Service Manager 9.81
       Prevent Pwd Resets
                                        Description
       Reset to User Name               Select this option to remove Reset
                                        Operators Password from the More
       Prompt for Value                 Actions menu. You can still manually
                                        change operator passwords from
       Reset to Value                   the operator record.
                                        Select this option to reset the
   4. Click Save.                       operator password to the log-in
                                        name whenever an administrator
Related topics                          chooses Reset Operators
                                        Password from the More Actions
Application Setup                       menu.
Checklist: Adding a new user            Select this option to display a dialog
Controlling user access and security    box where an administrator can
Creating operator records               enter a new password whenever the
Operator passwords                      administrator chooses Reset
Operator records                        Operators Password from the More
Operator templates                      Actions menu.
More Actions menu                       Select this option to reset an
                                        operator password to the value you
This PDF was generated on May 23, 2026  type in the text field whenever the
                                        administrator chooses Reset
                                        Operators Password from the More
                                        Actions menu.

                                                                                                                 Page 160 of 188

Change a user's password
Disable the password reset option
Enable password history
Reset an operator's password
Set password format restrictions
Set password minimum lifetimes
Set password minimum lifetimes


1.6.4.9.5. Reset an operator's password

Applies to User roles: System Administrator

To reset an operator password, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Use search or advanced search to find one or more records.
   3. Select the operator record from the record list.
   4. Click More or the More Actions icon, and then select Reset Operators

     Password.
   5. Click Yes to confirm the operation.

When you reset an operator password, Service Manager doesn't verify that the new
password conforms to the password standards that you defined in the company
record. Therefore, use the Reset Operators Password option to provide only
temporary passwords.

Related topics

Checklist: Adding a new user
Controlling user access and security
Creating operator records
Operator passwords
Operator records
Operator templates
Change a user's password
Disable the password reset option
Enable the password reset option
Enable password history
Set password format restrictions
Set password minimum lifetimes
Set password maximum lifetimes


1.6.4.9.6. Set password format
restrictions

Applies to User roles: System Administrator

To set password format restrictions, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Password Composition tab.

   3. Type or select the following options:

           Min Password Length: type the minimum number of characters a
           password can contain.
           Max Password Length: type the maximum number of characters a
           password can contain.
           Allow Alpha Characters: select this option to allow users to create
           passwords with alphabetical characters.
           Allow Numeric Characters: select this option to allow users to create
           passwords with numeric characters.

           Allow Symbolic Characters: select this option to allow users to create
           passwords with symbolic characters.

                         Note

                      Service Manager prevents users from creating passwords that
                      start with the following symbolic characters: pound (#), equal
                      sign (=), tilde (~), greater than (>), and less than (<).

           Always Require a Password: select this option to require all users to have a
           password defined in their operator record. This option is the only way to
           prevent users from having blank passwords.

                         Caution

                      Users who currently have blank passwords defined in their
                      operator record can still log in until they are required to change
                      their passwords.


           Require Alpha Chars: select this option to require users to create
           passwords that contain at least one alphabetical character.

                 Min Required: type the minimum number of alphabetical characters a
                 password must contain. This value must be a positive integer if you
                 select the Require Alpha Chars option.
           Require Mixed Case: select this option to require users to create
           passwords that contain both upper case and lower case alphabetical
           characters.

           Require Non-Alpha Chars: select this option to require users to create
           passwords that contain at least one numerical or symbolic character.

                 Min Required: type the minimum number of numerical characters a
                 password must contain. This value must be a positive integer if you
                 select the Require Non-Alpha Chars option.
           Prohibit Space Character: select this option to prohibit users from creating
           passwords that contain the space character.
   4. Click Save.

            Caution

           The only way to prevent users from defining blank passwords is to select
           the Always Require a Password option.

Related topics

Checklist: Adding a new user
Controlling user access and security
Creating operator records
Operator passwords
Operator records
Operator templates
Change a user's password
Disable the password reset option
Enable the password reset option
Enable password history
Reset an operator's password
Set password maximum lifetimes
Set password minimum lifetimes


1.6.4.9.7. Set password maximum
lifetimes

Applies to User roles: System Administrator

To set password maximum lifetimes, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Password Lifetime tab.
   3. Type or select the following options:

           No Max Lifetime: select this option to disable password expiration.
           Use Time Period: select this option to have passwords expire after a set
           time period.

                 Max Pwd Lifetime: type the number of days, hours, minutes, and
                 seconds before user passwords expire.

Type the time period in the following format: Dayshours: minutes: seconds. For
example, 4 03: 02: 01 expires user passwords after 4 days, 3 hours, 2 minutes, and 1
second.

   1. Use Number of Logins: select this option to have passwords expire after a
           set number of user logins.
                 Max before change: type the number of logins before user
                 passwords expire.
           Notify by Email on Password Change: select this option to notify users by
           email whenever another user, such as a System Administrator, changes
           their password.

   2. Click Save.

Related topics

Checklist: Adding a new user
Controlling user access and security
Creating operator records
Operator passwords
Operator records
Operator templates
Change a user's password
Disable the password reset option
Enable the password reset option


Enable password history
Reset an operator's password
Set password format restrictions
Set password minimum lifetimes


1.6.4.9.8. Set password minimum lifetimes

Applies to User roles: System Administrator

To set password minimum lifetimes, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Password Lifetime tab.

   3. Type or select the following options:

           No Min Lifetime: select this option to disable password expiration.

           Use Time Period: select this option to have passwords expire after a set
           time period.

                 Min Pwd Lifetime: type the number of days, hours, minutes, and
                 seconds before user passwords expire.

                Type the time period in the following format: Dayshours: minutes:
                seconds. For example, 4 03: 02: 01 expires user passwords after 4
                 days, 3 hours, 2 minutes, and 1 second.

           Use Number of Logins: select this option to have passwords expire after a
           set number of user logins.

                 Min before change: type the number of logins before user passwords
                 expire.
           Notify by Email on Password Change: select this option to notify users by
           email whenever another user, such as a System Administrator, changes
           their password.
   4. Click Save.

Related topics

Checklist: Adding a new user
Controlling user access and security
Creating operator records
Operator passwords
Operator records
Operator templates
Change a user's password
Disable the password reset option


Enable the password reset option
Enable password history
Reset an operator's password
Set password format restrictions


1.6.4.9.9. Configure system security
questions

Applies to User roles: System Administrator

Security questions assist to verify a user's identity. After you enable the forgot
password function, the system prompts to select and answer the security questions
when a user is resetting the login password from the web client. A user must select
the security questions and enter the answers before proceeding to create a new
password. As a system administrator, you can refer to the following instructions to
configure system security questions for users to select and answer when they set up
their security questions.

From the System Navigator, click System Administration > Base System
Configuration > Miscellaneous > System Security Question. You can review the
out-of-the-box system security questions, add new questions, localize the questions,
and delete any unused questions on this form.

Add a security question

To add a new security question, perform either of the following:

     Click New. Type a question in the Title field, and then click Add and OK. The
     system automatically populates the ID for this question.
     Click Search to display a list of existing security questions, and then click Add.
     Type a question in the Title field, and then click Save and OK.

Update a security question

To update a security question, click Search to display a list of existing security
questions. Select a question, update the Title field as required. Click Save and OK to
save your updates.

Localize a security question

To localize a security question, select a question as required and then click Localize.
For each language that's active in your Service Manager system, you can localize the
Title field in the corresponding text field. After you localize the question, click Save to
return to the question list.

Deactivate a security question


To deactivate a security question, select a question as required and then select the
Inactive checkbox. The subsequent users can no longer see this deactivated
question when they set up the security questions, whereas the users who are
previously using this deactivated question aren't affected.

Delete a security question

To delete a security question, select a question as required and then click Delete.
Note that you can't delete any security questions that are in use.


1.6.4.9.10. Enable the forgot password
function

Applies to User roles: System Administrator

The forgot password function enables a user to reset the password through the
Service Manager web client on one's own. A system administrator must firstly enable
the forgot password function, and then configure the related settings.

The forgot password function is only available for either of the following scenarios:

     The Service Manager server uses database authentication and the users'
     passwords exist in the database. In this scenario, the web client login page
     provides a default Forgot Password link after you enable the forgot password
     function. Users can click this link to go to an internal password reset page.
     The Service Manager server uses LDAP authentication. In this scenario, the web
     client login page doesn't provide a default Forgot Password link and you must
     configure Web parameter: externalForgotPasswordUrl. After you enable the
     forgot password function, users can click the Forgot Password link to go to an
     external password reset URL as you specified in the externalForgotPasswordUrl
     parameter.

Tip: We recommend you to enable SSL before enabling the forgot password function.

To enable the forgot password function, follow these steps:

   1. Sign in to Service Manager as a system administrator by using either the
     Windows client or the web client.

   2. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   3. Click Passwords tab > Forgot Password tab.
   4. Select the Enable Forgot Password checkbox to enable the forgot password

     function.

   5. Configure the following settings.

Forgot password option                                                                    Service Manager 9.81
Token Expiration Time (mins)
                                        Description
Reset Password Lock Duration
(hours)                                 Set the number of minutes that the
                                        password token will be valid.
Number of Security Questions
                                        The default maximum value is 60
                                        minutes.

                                        Set the number of hours that the
                                        reset password function remains
                                        locked before automatically
                                        becoming unlocked.

                                        The default minimum value is 1 hour.

                                        Set the number of security questions
                                        that the users need to answer when
                                        they forget passwords.
                                        By default, the minimum value is 3
                                        and the maximum value is 6. If you
                                        update this value, a user can still
                                        reset the password based on
                                        the security questions settings
                                        before. The system informs and
                                        prompts a user to update the
                                        security questions accordingly when
                                        this user logs on to the Service
                                        Manager web client.


Forgot password option                  Description
Minimum Character of a Valid
Answer                                  Set the minimum number of
                                        characters that an answer will be
Maximum Answer Retry Times              valid. If an answer consists of fewer
                                        characters, this answer is invalid to
                                        the security questions.

                                        The default minimum value is 3 and
                                        you can set the maximum value
                                        according to the database type for
                                        Answer: VARCHAR(1000).

                                        Set the maximum number of retry
                                        attempts when a user’s answer is
                                        incorrect. If the number of a user’s
                                        retry attempts exceeds this value,
                                        the reset password function is
                                        temporarily locked.

                                        By default, the minimum value is 1
                                        and the maximum value is 10.

   6. Click Save and OK.

Next, you may need to review the out-of-the-box security questions, and then add,
update, or localize these security questions as required. Security questions assist to
verify a user's identity. The system will prompt for the security questions when a user
is resetting the login password from the web client. For more information,
see Configure system security questions.

Related topics

Application Setup
Checklist: Adding a new user
Controlling user access and security
Creating operator records
Operator passwords
Operator records
Operator templates


More Actions menu
Change a user's password
Disable the password reset option
Enable password history
Reset an operator's password
Set password format restrictions
Set password maximum lifetimes
Set password minimum lifetimes
````
