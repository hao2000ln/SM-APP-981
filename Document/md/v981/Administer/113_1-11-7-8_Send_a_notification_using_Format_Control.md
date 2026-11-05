---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.11.7.8 .. 1.11.7.8
printed_pages: 2830-2835
---

# 1.11.7.8 Send a notification using Format Control

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.11.7.8. Send a notification using Format
Control

Applies to User Roles: System Administrator

To send a notification using Format Control, follow these steps:

   1. Click Tailoring > Format Control.
   2. Search for and open the format control record for which you want to enable

     notification.
   3. Select an existing notification definition record or create a custom notification

     and note the name of the record. This notification is the target of the Format
     Control call.
   4. Click the Subroutines tab, or click Subroutines from More or the More Actions
     menu to create a Format Control subroutine with the following properties:

Name                                                                                      Service Manager 9.81
Add
                                        Value
Upd
                                        The expression that's evaluated to
Del                                     determine whether to execute the
                                        specified RAD application every time
                                        that the corresponding format is
                                        used to add a record.
                                        Example: true
                                        (if you want a notification to be sent
                                        on any Add operation)

                                        The expression that's evaluated to
                                        determine whether to execute the
                                        specified RAD application every time
                                        that the corresponding format is
                                        used to update a record.
                                        Example: true
                                        (if you want a notification to be sent
                                        on any Update operation)

                                        The expression that's evaluated to
                                        determine whether to execute the
                                        specified RAD application every time
                                        that the corresponding format is
                                        used to update a record.
                                        Example: true
                                        (if you want a notification to be sent
                                        on any Delete operation)

Name                                                                                      Service Manager 9.81
Dis
                                        Value
Initial
                                        The expression that's evaluated to
                                        determine whether to execute the
                                        specified RAD application every time
                                        that the corresponding format is
                                        displayed.
                                        Example: true
                                        (if you want a notification to be sent
                                        every time the form is displayed)

                                                    Note

                                                   Note: This option is not
                                                   typically used to create a
                                                   notification.

                                        The expression that's evaluated to
                                        determine whether to execute the
                                        specified RAD application every time
                                        that the corresponding format
                                        initially opens.
                                        Example: true
                                        (if you want a notification to be sent
                                        the first time the form displays)

                                                    Note

                                                   This option is not
                                                   typically used to create a
                                                   notification.

Name                                                                                      Service Manager 9.81
Before
Application                             Value
Msg ID
                                        Type false
Error Message                           (to send a notification after an
                                        operation is made)

                                        Type us.notify

                                        The message you want to display if
                                        the system can't run the application
                                        or one of the Name/Value inputs is
                                        incorrect.

                                                    Note

                                                   This option is not
                                                   typically used to create a
                                                   notification.

                                        The error message you want to
                                        display if the system can't run the
                                        application or one of the
                                        Name/Value inputs is incorrect.

                                                    Note

                                                   This option is not
                                                   typically used to create a
                                                   notification.

       Name                                                                                Service Manager 9.81
       Names and Values
                                         Value
   5. To save your changes, click Save.
   6. Click OK.                          The names and values of the
                                         parameters to be passed into the
Related topics                           RAD application.For the us.notify
                                         application, we can add the
Notifications                            following parameters:
Add a message record
Add a notification delivery method       name: The name of the notification
Create a custom notification             definition record to be the target of
Create a distribution group              the Format Control call. For example:
Create an on-call schedule               CM Deny
Default message classes
Default notifications                    record: The record variable the
                                         notification should use. For example:
                                         $file

                                         names (optional): The array of
                                         values to display in the notification.
````
