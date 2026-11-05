---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.6.3 .. 1.6.3
printed_pages: 2017-2054
---

# 1.6.3 Form tailoring

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.3. Form tailoring

You will typically use one or more of the following tools and features to tailor forms to meet your business
needs.

     Forms Designer controls
           Combo Box
           Comfill
           Radio Button
           Checkbox
           Subform
           Group
           Frame
           Text
           Text Area
           HTML Editor

     Dynamic View Dependencies (DVD)
     Link Records
     Global Lists

The following sections describe some of the use cases where you can get the most performance and
benefit from these controls and tools.

Related topics

Form tailoring use cases
Mapping rights


1.6.3.1. What's a form?

A form is a graphical input used to access, add, change, and view records in a Service Manager table.
Forms serve as the interface between the user and the underlying table. A form can be associated with
only one Service Manager table; however, a table may have many associated forms. If you need a form to
access data from multiple tables, you can create one or more subordinate forms and link to them using the
Subform control. Service Manager stores form records in the format table.

You can create and modify forms with the Forms Designer (FD) utility. You can add or edit rules for
processing form data with the Format Control (FC) utility.

Related topics

Form tailoring use cases


1.6.3.2. Form tailoring use cases

The following use cases will help you decide the best form control to use given a particular situation.

     You want users to select values from a control with a list of values. See Selecting values from options
     in a control.
     You want users to select values from a list of values on the form. See Selecting values from options on
     a form.
     You want a user's prior selection to decide what other values are available. See Changing the options
     available based on prior user input.
     You want to display values from another table or record. See Displaying related data.
     You want to group logically associated items together. See Grouping related controls.
     You want users to type text into a field. See Typing text into a control.
     You want to adopt the activities feature improvement. See Adopt activities feature improvement.

The following use cases will help you improve your system performance and maintainability.

     You want to reduce the amount of system resources required during user sign in. See Managing
     global lists.
     You want to reduce the effort required to upgrade your tailored system. See Reducing upgrade
     conflicts.

Related topics

     Selecting values from options in a control
     Selecting values from options on a form
     Changing the options available based on prior user input
     Displaying related data
     Typing text into a control
     Managing global lists
     Reducing upgrade conflicts


1.6.3.3. Selecting values from options in a control

Forms Designer offers two controls that allow users to select a value from a list of values.

     Combo Box
     Comfill

You can determine which of these two controls to use by the number of options there are to choose from.
If there are a small number of options to choose from (for example, 32 or less options), then a Combo Box
control is typically the most efficient control to use. See Combo Box.
If there are large number of options to choose from (for example, 100 or more options), then a Comfill
control is typically the most efficient control to use. See Comfill.

Related topics

Form tailoring use cases
Combo Box
Comfill


1.6.3.3.1. Combo Box

The Combo Box control lists a set of values for a user to choose from in a drop down box. You determine
the list of possible values by either manually entering the values for the control or providing a global list
variable for the Value List attribute.
Example Combo Box control

The benefits of a Combo Box control are listed below.

     The user sees a complete list of values to choose from on the same form as the control.
     You can control both the labels users see for each option (the Display List attribute) and the actual
     value each option has when stored in the database (the Value List attribute).

The costs of a Combo Box control are listed below.

     The more options there are to display, the more system resources are required to display them.
     If the list of values comes from a global list, then the server must send the entire list to the client each
     time the form is displayed. The more list items there are, the more network bandwidth it takes to
     transmit the list to the client. Furthermore, the more users there are who can access the global list, the
     more often the server has to transmit the list to clients.
     If the list of values comes from a global list, then the server must periodically rebuild the list of values.
     The more items there are in the list, the more system resources it takes to rebuild the list.
     If the list of values comes from a hard-coded list, then each list item increases the size of the form.
     The larger a form is, the longer it takes for the client to initially display it.

The more options there are to display, the more costly a Combo Box is to your system's performance.
There is no set number of values that determines when a Combo Box is less efficient than a Comfill, but in
general a Combo Box is best used in the following circumstances.

     There are few enough options to display that the control can display them all without the user needing
     to scroll down to see more options.
     The list of options either doesn't change at all or changes infrequently.

If you have a lot of options to display, consider using a Comfill control instead where you can control how
many options are displayed per page. Also, if you expect to frequently add or change the options available
to the control, you may want to use a Comfill control linked to the data of another field. Using a linked
Comfill control allows you to add or update the options as records and guarantees your users always see
the most current list of options.

Related topics

Selecting values from options in a control
Comfill



1.6.3.3.2. Comfill

The Comfill control lists a set of related records for a user to choose a value from. You determine the list of
possible values by creating a link record entry for the Comfill control's Input field and specifying the related
database field whose values you want to list in a link record line entry. You can also use the link record to
associate a Comfill control with a particular search form if you want to allow users to search for related
records.
Example Comfill controls

Example Comfill control associated with a search form

Example partial query in a Comfill control
Example query results from a partial query in a Comfill control


The benefits of a Comfill control are listed below.

     The system only has to display one page's worth of options at a time. It takes less system resources
     to display a partial list than the full list of options. The longer the list of options is, the more efficient it
     is to display the list in pages.
     Users can type in partial option values to search for options that match the partial value. For example,
     typing an "S" in the Contact field and clicking the Fill button shows a list of contacts that begin with
     the letter S.
     You manage the list of possible values by updating the related records linked to by the fill. For
     example, as you add, update, or remove contact records any fill linking to contact records will
     automatically pick up these changes.

The costs of a Comfill control are listed below.

     You must create a link line entry and a query for each Comfill control.
     You must create a search form if you want the fill functionality to use it.

Since Comfills depend upon link queries, any inefficiencies in the underlying query will negatively affect
your system performance. Following the best practices in How do I write a good query? will reduce this
performance impact. In addition, keep in mind that it takes more effort to design and maintain a search form
for each fill. You may want to limit search forms to circumstances where you want to provide users with
more than one way to search for related records. If one field is sufficient to find the related records, you
don't need to add a search form to the Comfill control.

In general, a Comfill is best used in the following circumstances.

     There are enough options to display that the control can display them on multiple pages.


     The list of options changes frequently and you want the control to always have access to the most
     recent changes.

If you have a limited number of options to display, consider using a Combo Box control instead where you
can display all the options at once in a drop-down box. Also, if you don't expect the data to ever change or
to change infrequently, consider using a global list to make the data available to any application that needs
it.

Related topics

Selecting values from options in a control
Combo Box
Web parameter: comfillAutoComplete


1.6.3.3.3. Auto complete for Comfill fields

Out-of-box, the auto complete feature is available for many Comfill fields in Service Manager. This feature
has similar functionality as the Fill option, which locates information from a link file. For details about how
the Fill option works, see Fill functionality.
When the auto complete feature is enabled for a Comfill widget, you can type just a few characters in this
Comfill widget and select a matching result from the auto complete list.

            Note

                Auto Complete is always enabled for a field that has a referenced table defined,
                regardless of the value of the comfillAutoComplete parameter and the Auto Complete
                property setting defined in Forms Designer for that field. For more information, see
                Specify a referenced table for a field.
                The auto complete feature supports only "start with" link queries, which return a list of
                records that start with the user input. It doesn't support other kinds of link queries, such
                as "end with" or "not start with".
                If a Comfill widget has a defined Data Change Event, and the link for this field has defined
                Post Expression/Post JavaScript, we recommend that you don't enable auto complete for
                this Comfill widget. Otherwise, the Data Change Event may not work.
                If the input for a Comfill widget is a numeric value, auto complete is unsupported.
                If the auto complete results aren't returned in five seconds, the system displays a
                message, which directs you to the Fill option, or you can open the Fill option directly.

Out-of-box Comfill fields with auto complete enabled

The following table lists the Comfill fields with auto complete enabled in the out-of-box data of Service
Manager.


Module  Tables                          Forms                   Fields
IM      probsummary
                                        advFind.incident.searc  assignee.name
SD      incidents                       h                       assignment
                                                                category
                                        IM.open.incident        vendor
                                                                contact.name
                                        IM.update.incident      subcategory
                                                                product.type
                                                                affected.item
                                                                logical.name
                                                                location.full.name

                                        advFind.SD.search       category
                                        SD.open.interaction     subcategory
                                        SD.update.interaction   product.type
                                                                callback.contact
                                                                contact.name
                                                                affected.item
                                                                logical.name
                                                                kpf.id


Module  Tables                          Forms                   Fields
CM      cm3r
                                        advFind.search.change   assign.dept
                                        CM.change.approval      coordinator
                                        CM.change.approvalpr    requested.by
                                        ep                      category
                                        CM.change.implement     affected.item
                                        ation                   subcategory
                                        CM.change.logging       assets
                                        CM.change.planning      location.full.name
                                        CM.change.review        logical.name
                                        cm3r.cigroup.g          corp.structure
                                        cm3r.discover           location
                                        cm3r.release            assigned.to
                                        cm3r.subscription

PM      rootcause                       advFind.search.proble assignment

                                        m                       assignee.name

                                        PM.problem.closure      subcategory

                                        PM.problem.investigati  affected.item
                                        on

                                        PM.problem.logging      product.type

                                        PM.problem.planning logical.name

                                        PM.problem.resolution closure.code

Service Manager provides the following parameters that control this feature. Their default values are
intended to provide optimized user experience; however you may need to optimize these parameters
according to your system performance.

     Web parameter: autoCompleteListSize

     Web parameter: autoCompleteDelayTime

     Web parameter: autoCompleteMinChars

     Web parameter: autoCompleteSkipCachingChar

Enabling auto complete for a new Comfill widget

When creating or tailoring a form, if you add a new Comfill widget and want to enable auto complete for the
widget, perform the following steps.


         Note

        Make sure this Comfill widget has a link definition before you enable the auto complete feature
        for it. Also, be aware that the auto complete feature doesn't work in the following situations:

             In Comfill fields that have a value list or display list defined
             If the Combo Button Visible option is selected

1. Make sure auto complete is enabled globally, that is, the comfillAutoComplete parameter is set to true.
2. Update the form to enable auto compete for the Comfill widget.

       a. In the Windows client, go to Tailoring > Forms Designer, and open the form in Design mode.
       b. Select the Comfill widget, and enable the Auto Complete property.
       c. Click OK.
       d. Click Save.
3. The auto complete feature will consume additional system resources (memory and CPU). After you
  enable auto complete for the Comfill widget, you need to validate the form performance. To do so,
  perform the following steps.
       a. Open the form in Forms Designer, and click Validate Format from More or the More Actions
       menu.
       b. Click Continue.
       c. Specify the file name and click OK.

                     Note

                  Service Manager skips this step if a file is already specified for your form. To see if
                  your form has a file specified, click More on the form and select Format Detail.

       A message displays if the system finds any performance issues. You can check the message for
       details.


1.6.3.4. Selecting values from options on a form

Forms Designer offers two controls that allow users to select a value from a list of options on the form.

     Radio Button
     Checkbox

You can determine which of these two controls to use by determining if the options on the form are
mutually exclusive.
If you want users to select one value from a list of mutually exclusive values, then list each option as a
Radio Button control.
If you want users to select a true or false value for one particular option, then use a Checkbox control for
the option.

Radio Button

The Radio Button control lists one possible value for a set of mutually exclusive values that a user can
choose from. You determine the list of possible values by creating multiple Radio button controls and giving
them all the same Input attribute.
Example Radio Button control

The benefits of a Radio Button control are listed below.

     The user sees a complete list of values to choose from on the same form as the control.
     The user has a visual indicator for the currently selected value.
     You can control both the label users see for the option (the Caption attribute) and the actual value the
     option has when stored in the database (the Value attribute).

The costs of a Radio Button control are listed below.

     The more options there are to display, the more of the form's screen space is required to display
     them.
     You have to use a Frame or Group control to indicate that a list of Radio Button options are related.
     The list of values is only stored on the form and not in a global list or related record. This means you
     have to keep track of which forms use a particular list if you want to re-use the list in another form.
     The only way to change the list of values is to change the value of each individual Radio Button
     control.
     Each Radio Button option increases the size of the form. The larger a form is, the longer it takes for
     the client to initially display it.

A list of Radio Button options is very easy for your system to display since there are no link queries run or
global lists to update at start-up. However, a list of Radio Button options requires more form space than
using a single Combo box or Comfill control.
In general, a Radio Button control is best used in the following circumstances.


     There are few enough options to display that the user can see them all without needing to scroll to see
     more options.
     The list of options either doesn't change at all or changes infrequently.
     You want a visual indicator to highlight the currently selected value.
     You can't select more than one value at a time with this control.

If you have more than a few options to display, consider using a Combo Box control instead to reduce the
amount of screen space required to display the options. Also, if you expect to re-use the list of options in
another form or in other circumstances, consider creating a global list so the options will be available for
multiple forms. If you want users to be able to select more than one value from a list of values, consider
creating a list of checkboxes.

Check Box

The Check Box control lists a true or false value for a single option. The list of possible values is always
true or false for a Check Box control.
Example Check Box control

The benefits of a Check Box control are listed below.

     The value of each Check Box control is independent of other Check Box controls.
     The user has a visual indicator for the currently selected value.
     The actual value of the control is always either true or false.
     You can control the label users see for the control (the Caption attribute)

The costs of a Check Box control are listed below.

     You can't use this control to provide a list of mutually exclusive options.
     You may have to use a Frame or Group control to indicate that a list of Check Box options are related.

A Check Box control is very easy for your system to display since there are no link queries run or global
lists to update at start-up. The longer the Check Box label is the more form space the control requires.
In general, a Check Box control is best used in the following circumstances.

     The only options the user needs to choose between are true and false values.
     The values of one control are independent of the values in other controls.
     You want a visual indicator to highlight the currently selected value.

If you want users to select one value from a list of mutually exclusive values, use a set of Radio Button
controls instead to ensure that only one value can be selected at a time.

Contents

     1 Radio Button
     2 Check Box


1.6.3.5. Changing the options available based on
prior user input

Forms Designer offers two methods for you to change what options are available based on prior user input.

     Use DVD select statements to change what options appear on a form
     Use recursive fills to change what records the user can select as options

You can determine which of these two methods to use by how you want to change the list of available
options.
If you want to change what options are visible on form, then use one or more DVD select statements.
If you want to change the list of records that a user can choose from, then use one or more recursive fills.

DVD select statements

A DVD select statement changes what controls or values appear on a form based a triggering condition.
You determine what controls or values the DVD select statement displays by assigning a condition to each
control or value. When the condition is true, the system displays the controls and values. When the
condition is false, the system hides the controls and values.
Example DVD select statement where the display condition is false

Example DVD select statement where the display condition is true

The key benefits of a DVD select statement are listed below.

     The user only sees the controls and values when the appropriate condition applies.
     The user has a visual indicator that new options or controls are available.


The costs of a DVD select statement are listed below.

     The more conditions there are to evaluate, the more system resources if takes to display the form.
     You have to reserve part of the form's screen space to display hidden items.
     You must create a query for the DVD select statement condition.
     The only way to change the list of values is to change the value of each individual control of the
     DVD select statement.

Since DVD select statements depend upon queries for the condition, any inefficiencies in the underlying
query will negatively affect your system performance. Following the best practices in How do I write a good
query? will reduce this performance impact. In addition, the more conditions you have, the more of the
form's screen space you will have to reserve for the controls hidden by the DVD statement.
In general, a DVD select statement is best used in the following circumstances.

     There are only a few conditions that change the options available on the form.
     The list of options either doesn't change at all or changes infrequently.

If you have a lot of conditional data to manage, consider using multiple Comfill controls with recursive fills
instead. This allows you to restrict the options displayed in one Comfill control based on the selections in a
previous Comfill control. Also, if you expect to frequently add or change the options available to the DVD
select statement, you may want to use a Comfill control so that you can add or update the options as
records.

            Note

           The system may have performance issue that leads to significant increase of form loading time
           if there are too many DVD select statements added to a form.

Recursive fills

A recursive fill uses the value of one Comfill control to determine the available values of another Comfill
control. You determine what values the recursive fills display by adding a link record line entry for each
Comfill control on the form. When a link record includes the expression $fill.recurse=true , then the system
evaluates each line of associated link record. You may also want to associate a search form or QBE format
for each Comfill control in the recursive fill to make easier for users to select multiple values.
Example Comfill controls linked by recursive fills

Example QBE formats allowing users to select a Category, Area, and Sub Area.


Example completed recursive fill

The benefits of recursive fills are listed below.

     You can use a query to ensure that users only select valid combinations of values.
     Users can select values for related data in one process.
     The system only has to display one page's worth of options at a time. It takes less system resources
     to display a partial list than the full list of options. The longer the list of options is, the more efficient it
     is to display the list in pages.
     You manage the list of possible values by updating the related records linked to by the fill. For
     example, as you add, update, or remove contact records any fill linking to contact records will
     automatically pick up these changes.

The costs of recursive fills are listed below.


     You must create a link record entry and a query for each Comfill control.
     You must create a search form if you want the fill functionality to use it.
     Users can only select values that match the query for each Comfill control

Since recursive fills depend upon link queries, any inefficiencies in the underlying query will negatively
affect your system performance. Following the best practices in How do I write a good query? will reduce
this performance impact. In addition, you must be very familiar with the Service Manager data model to
create the necessary queries.

In general, a recursive fill is best used in the following circumstances.

     The value of one field determines the value another field can have. Typically, all of the fields come
     from a set of related records.
     The list of options changes frequently, and you want your Comfill controls to always have access to
     the most recent changes.

If you want to hide or display data on a form, use Combo Box controls and DVD select statements instead.


1.6.3.6. Displaying related data

Forms Designer offers two controls that allow users to display data from related tables and records.
     Combo Box
     Subform

You can determine which of these two controls to use by how you want users to interact with the related
data.
If you want to use a control that allows users to select and interact with related data, then use a Combo Box
control. See Combo Box.
If you want use a control that protects any virtual-joined data by making it read-only, then use a Subform
control. See Subform below.

Subform

The Subform control displays a separate form containing data from a different table than the table
associated with the main form. A Subform control allows any controls on the subordinate form to use the
link record data to perform a virtual join. For example, a text control or table control on the subordinate form
can display related data from another table. You determine what related data to display by creating a link
record entry for the Subform control's Input field and specifying the related database field whose values
you want to display in link record line entry.
Example Subform control on the open interaction form

Example Subform control Input value

Example link record line entry for the callback.contact field  Page 182 of 200

This PDF was generated on May 23, 2026

The benefits of a Subform control are listed below.

     You can display related record data from any other source in the system.
     You can display related records that have one to many relationships. For example, from one input, the
     contact name, you can use a Subform control to display many related fields such as the contact's
     location, address, or telephone number.
     You can provide link record data to controls that don't normally have link records such as Text or
     Table controls.
     Any information on a Subform control is automatically read-only when it is part of a virtual join.

The costs of a Subform control are listed below.

     You must create a separate link line entry and a query for each Subform control.
     You must create and maintain a subordinate form for the linked controls.
     You can't use the virtual join option if you want users to interact with the controls on the subordinate
     form. This typically requires using either global lists or hard-coded values for any Combo Box controls
     on the subordinate form.

Since Subform controls depend upon link queries, any inefficiencies in the underlying query will negatively
affect your system performance. Following the best practices in How do I write a good query? will reduce
this performance impact. In addition, you must be very familiar with the Service Manager data model to
create the necessary queries.

In general, a Subform control is best used in the following circumstances.

     You need to display data from a different table than the one associated with the main form
     You want the related information to be displayed in read only controls

If you want users to be able to select or interact with the related data, either use a Comfill control or don't
enable the Virtual Join option for the Subform control. See the Comfill section inSelecting values from
options on a form for a description of Comfill costs and benefits.


1.6.3.7. Grouping related controls

Forms Designer offers two controls that allow users to group related sets of controls in a container.
     Group
     Frame

You can determine which of these two controls to use by which client you want the container to appear in.
If you want Web client users to be able to collapse and expand the container, then use a Group control. See
Group below.
If you only want Windows client users to see a container with line borders, then use a Frame control. See
Frame below.

Group

The Group control provides a container with a text label to logically group items and controls. Any control
you place within a Group control inherits the visibility condition of the Group.
Example Group control

Example Visible Condition for a Group control


The benefits of a Group control are listed below.

     You can make the container a section that collapses and expands in the Web client.
     The container has a text label to clearly identify the purpose of the controls within the container.
     The controls within the container inherit the Visible Condition property of the Group. The controls
     within the group are only visible when the group itself is visible.
     If you move or delete a Group control, all the controls within the container are also moved or deleted.

The costs of a Group control are listed below.

     You have to update the text label should you ever change the controls within the container.
     You have to localize the label if you want to make the form available in other languages.

In general, a Group control is best used in the following circumstances.

     You want a visual indicator to highlight that a group of controls are related.
     You want to allow users to efficiently manage the available form space in the Web client.
     You want to manage the visibility settings of a group of controls from one place.

If you want to change the appearance of the line around the container, then use a Frame control instead.
However a Frame control doesn't allow users to collapse and expand the section in the Web client.

The Frame control provides a container with a beveled line surrounding the items and controls in the
container. Any control you place within a Frame control inherits the visibility condition of the Group. Since
the Web client doesn't display the line surrounding the Frame control, it almost always better to use a
Group control rather than a Frame control.

Example Frame control in Windows client


Example Frame control in Web client

The benefits of a Frame control are listed below.

     The container has a border to indicate that the controls are within a container.
     The controls within the container inherit the Visible Condition property of the frame. The controls
     within the frame are only visible when the frame itself is visible.

The costs of a Frame control are listed below.

     The line surrounding the Frame control is not visible in the Web client
     Users can't collapse and expand the container in the Web client

The Frame control has less functionality than the Group control. In most cases, you should use a Group
control rather than a Frame control.

Related topics

Form tailoring use cases


1.6.3.9. Managing global lists

Global lists provide an efficient way to display frequently-used list values by storing the list in system
memory as a global variable. All applications can access the global list variable as needed without needing
to query the database each time a control needs to display the list. However, the more items there are in a
global list, the more costly the list is to system performance.

A global list has the following performance benefits.

     Since a global list is stored in system memory, there is no need to query the back-end database for a
     list of values. Using a global list therefore reduces the amount of input and output traffic to the
     RDBMS.
     Since a global list is available to all users logged into the system, there is no need to create conditional
     queries to grant access to the information. Using a global list therefore potentially reduces the number
     of queries needed to access a particular set of information.

When managing global list, keep in mind the following performance costs.

     The server must send the entire list to the client each time the form is displayed. The more list items
     there are, the more network bandwidth it takes to transmit the list to the client.
     The more users there are who can access the global list, the more often the server has to transmit the
     list to clients.
     The server must periodically rebuild the list of values. The more items there are in the list, the more
     system resources it takes to rebuild the list

If you want to maximize your system performance, use the following guidelines to determine when to use
global lists.

If there are a small number of options to choose from (for example, 32 or less options), then displaying a
global list in a Combo Box control is typically the most efficient strategy. Since the list of options is small,
you gain a performance improvement by skipping a query to the back-end database that a Comfill control
would require. See Combo Box.

If there are large number of options to choose from (for example, 100 or more options), then displaying a
list of values from a Comfill control linked to other records in the database is typically more efficient than a
global list. Since a global list must always send the entire list of options to the client, the Comfill control has
better performance because it can send one page worth of options to the client at a time. In addition, it is
more efficient to add, update, or remove the related records a Comfill displays than it is to rebuild an entire
global list each time you want to modify the list of values. See Comfill.

Removing unused global lists

You should periodically review your global lists to determine if any of them are unused and can be deleted.
Since the server periodically rebuilds each global list, you will see a performance improvement if you
remove any unused global lists from your system. Removing unused lists frees up system resources and
memory that your system can use for other purposes.

            Tip

           You can archive and purge any unused global lists for later use. Should you find you require the
           global list you can simply import the global list back into the system from the archive unload.


1.6.3.10. Reducing upgrade conflicts

The Service Manager application upgrade process allows you to add new features and functions to your
existing system. An upgrade conflict occurs when the upgrade utility determines there are multiple versions
of the same out-of-box component. For every conflict the upgrade utility identifies, you must manually
reconcile between the out-of-box component version and the customer-modified version of the same
component. This reconciliation process is time-consuming and often delays the adoption of new features
and functions because you can't use the new features and functions until after you have reconciled the
conflicts.

You can use the following guidelines to reduce the number of conflicts you have to resolve during an
application upgrade.

     Do not directly modify the out-of-box forms. Instead, create your own copies of the forms, give them
     unique names (such as adding a company abbreviation to the front of each form name), and make any
     modifications to the copied forms.
     Do not directly modify the out-of-box scripts in the script library. Instead, create your own script
     library with copies of any out-of-box functions, give them unique names (such as adding a company
     abbreviation to the front of each script name), and make any modifications to the copied scripts.
     Keep an audit log of any changes you make to the out-of-box Document Engine components such as
     processes, states, and objects. You can then use your audit log to determine how to merge any
     changes to Document Engine components.

Making your own copies of forms and scripts prevents you from having any conflicts on these items and
allows you to review any new functionality the upgrade adds without changing your existing system. For
example, if you create a copy of the out-of-box form SD.open.interaction called
OpenText.SD.open.interaction , then any upgrade to the out-of-box form doesn't create a conflict with
your custom form. Likewise, you can compare the functionality of the new out-of-box form to your custom
form and determine if it has any features or functions you want to include in your custom form.

While keeping an audit log will not prevent upgrade conflicts, it will reduce their impact if you can quickly
determine what functionality your changes support and whether the company-version of the Document
Engine components also support this functionality. At a minimum, your audit log should list what Document
Engine components you changed and what the out-of-box state was. You may also want to list why you
changed the component or what applications, forms, workflow your change supports.

Related topics

Form tailoring use cases


1.6.3.11. HTML formatting for Activities feature

As an improvement to the activities feature in previous releases, Service Manager embeds the Journal
Updates Viewer and Activities Viewer widgets to the Activities tab. The Journal Updates section is now
a Journal Updates Viewer and the Activities Viewer widget replaces the original table control in Activity
logs. Hence, the notes and logs on the Activities tab now have HTML formatting with significantly improved
readability.

The activities feature is available after you Upgrade the applications.

     When you perform the Resolve conflicts step during the applications upgrade, if you skip the conflicts
     for the activity-related format records, and you decide to work with the activities feature after
     upgrade, you need to follow the instructions in Use the new Activities feature.
     If you still hope to use your previous customized forms with the legacy activities feature after the
     applications upgrade, you may follow the instructions in Use the legacy Activities feature.

Use the new Activities feature

For those customized forms with the activities feature, the New Update and Journal Updates fields still
remain with Text Area controls, and the activity logs section remains with Table control. Hence, to use the
new Activities feature after the applications upgrade, you need to do some tailoring to adopt the latest
changes for the activities feature.

The tailoring process covers the following tasks:

   1. Redesign the corresponding forms.
   2. Perform a series of verifications or updates to make sure that the corresponding logical files, fields,

     keys, rulesets, and variables exist for the latest activities feature.

The following tailoring tasks are examples based on the activity feature on the Categorized phase form in
the Service Desk module. If there are more forms for other phases that use the activities feature, you need
to perform similar configurations to these forms as well.

Redesign the corresponding forms

Refer to the following steps for some guidelines. Here we take the interaction form as an example.

   1. Sign in to the Windows client as a system administrator.

   2. Open Forms Designer. Search for the sd.interaction.subform.activities form that is embedded in the
     sd.interaction.categorization form.

   3. Back up the sd.interaction.subform.activities form:
     Select More > Copy/Rename, and then back up it as sd.interaction.subform.activities.bak with Copy
     Format.

   4. Remove all controls from the sd.interaction.subform.activities form.

   5. Add a notebook with two notebook tabs: Journal Updates and Activity Logs. Set the Heading Level
     property of the notebook to 3.


6. Copy the original updates-related fields such as New Update Type and Visible to Customer from the
  sd.interaction.subform.activities.bak form to the Journal Updates notebook tab.

7. The original control of the New Updates field is a Text Area. Replace this control with HTML Editor,
  and then set the value of the Toolbar Configuration property to Standard. Keep the value for Input
  and Visible Condition properties the same as the original design.

  Note: It's not advisable to set the Toolbar Configuration property to other values than Standard.
  Otherwise, issues may occur.

8. The original control of the Journal Updates field is a Text Area. Replace this control with Journal
  Updates Viewer. Keep the Input and Visible Condition properties the same as the original design.


9. The original control of activity logs is an activity table, and the activity table is in a subform with virtual
  join input. Add Activity Viewer to the Activity Logs notebook tab, and then set the value of the
  Visible Condition property to the same as that in the backup (for example, [$L.use.activity]=true).
  Set the value of the Input property to the same as that in the virtual join field of the activity table in the
  backup (for example, vj.incident.id.7). Set the value of the Update Type Value List property to the
  same as Value List for Update Types (for example, $G.sd.activity.type).
  Note: For some other modules which don't have Update Types, you may skip setting the value of the
  Update Type Value List property .


10. Design the activity logs detail page. Open the activityservicemgt form and replace the Text Area
    control with HTML Viewer. Keep the value for the Input property the same as the original design.
    To locate the table name of the activity logs detail page, you may search for the object name(for
    example, search for incidents), and then go to the Activities tab. The activity log table name is
    displayed in the Activity log table field.

11. Search for the activityservicedesk.list format of the activity table. Ensure that the Output Conversion
    property of the Description table column is set to output.strip.htmltags.


After completing the above tailoring procedures, access an Interaction whose phase is Categorized. The
Activities tab is the same as designed just now. Enter some input in the New Updates field, which is now an
HTML editor control and you can set the format for your input. After saving the changes, the Journal
Updates and Activity Logs tabs display the updates in HTML format.

If you are working with the Mobility client, we also suggest updating the forms for the Mobility
client. Perform the steps on all Mobility Interaction forms.

   1. Open Forms Designer. Search for the sd.interaction.categorization.mobile form. Ensure that the
     value of the Format property on the Activities notebook tab is set to


sd.interaction.subform.activities.mobile.

2. Open Forms Designer. Search for the sd.interaction.subform.activities.mobile form. Check the
  Journal Updates field. If it's a Text Area, replace the Text Area control with HTML Viewer.

After completing the above tailoring procedures, you can view journal updates in HTML format on the
Activity tab in the Mobility client. Note that by design, the activity logs section still displays plain text
without HTML format.


Perform a series of verifications

Perform the following verifications or updates to make sure that the corresponding logical files, fields, keys,
rulesets, and variables exist for the latest activities feature.

   1. Open Database Dictionary and then search for the incidents file. Make sure that the update.action
     field already exists.

     If an old form doesn't display journal updates, to adopt the latest activities feature, you need to
     manually add the update.action field.
   2. Make sure the htmlEditor.checkxxs rule set exists. Ensure that the related table name incidents is in
     the Table name list.

3. Make sure that the scripts below are in the rule.

4. Open the workflows for incidents. Click Edit Object Properties, and then click the Object Base Rule
  Sets tab. Make sure that the htmlEditor.checkxxs rule is added to On add and On update rule sets.
  Note that for the Knowleget Management module, you also need to make sure that the
  htmlEditor.checkxxs rule is added in the following rule sets:


    kmdocument_republishExternal
    kmdocument_republishInternal
    kmdocument_retire
    kmdocument_submit
    kmdocument_publish

5. Click Tailoring > Document Engine > Objects, and then search for the incidents file. Click the
  Locking tab, and then make sure the value for New Update HTML editor's Input property (for
  example, $update.action) exists in Watch Variables.
  If those modules which don't display journal updates before upgrade, to adopt the latest activities
  feature, you need to manually add this variable.

6. If an module doesn't display journal updates before upgrade, to adopt the latest activities feature, you
  need to manually add rule sets. For example, add the chm.task.journal.update rule set to Change
  tasks. You may search for the *.journal.update rule set to check the full list and then add the rule sets


as required.

In the screenshots above, $cmt.update is the value for the New Update HTML editor's Input property.

Next, add the rule set to the corresponding workflow or the corresponding phase of a workflow. Refer
to the following screenshot as an example. Open the Generic Task workflow,
add chm.task.journal.update to both the Active phase and the On update action under the Review
phase. Note that you need to add this rule set to the bottom of the rule set list.


If the xxx.mandatory and xxx.validation rule sets are on a workflow instead of individual phases, you
can click Edit workflow Properties to add the xxx.journal.update rule set. See the following
screenshot as an example of the Service Catalog Item workflow. Note that you need to add this rule
set to the bottom of the rule set list.

Use the legacy Activities feature       Page 198 of 200

This PDF was generated on May 23, 2026

After the applications upgrade, if you still hope to use your previous customized forms with the legacy
activities feature, you need to remove some rule sets or scripts as introduced by the applications upgrade.
The new activities feature uses these rule sets or scripts to check the HTML Editor Allowlist. Since the New
Update and Journal Updates fields still remain with Text Area controls, and the activity logs section
remains with Table control, these rule sets or scripts are unnecessary.
Refer to the following steps for some guidelines.

   1. Create a backup of the htmlEditor.checkxxs rule set. For example, backup
     to htmlEditor.checkxxs.bak.

   2. Revert the scripts to the version before upgrade.

   3. Update the related workflows to use htmlEditor.checkxxs.bak rule set.
   4. For the Knowleget Management module, remove the htmlEditor.checkxxs rule from the following rule

     sets:
         kmdocument_republishExternal
         kmdocument_republishInternal
         kmdocument_retire
         kmdocument_submit
         kmdocument_publish
````
