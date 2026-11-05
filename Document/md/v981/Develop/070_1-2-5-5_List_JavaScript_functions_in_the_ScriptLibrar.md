---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.5.5 .. 1.2.5.5
printed_pages: 1864-1893
---

# 1.2.5.5 List: JavaScript functions in the ScriptLibrary

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.5.5. List: JavaScript functions in the
ScriptLibrary

The following table lists some of the JavaScript functions available in the ScriptLibrary of Service Manager.
These functions are part of system JavaScript files and should not be directly modified.

JavaScript functions in the ScriptLibrary  Description
addToGroup
                                           Adds one or more configuration items (CIs) to a
checkAllowedOption                         Configuration Management list group and updates
                                           the list group record if successful.
checkVersionString
                                           Returns the next valid version number of a
isfileexist                                Configuration Management baseline group if there
isInGroup                                  is only one valid version number available.
removeFromGroup
returnGroupMembers                         Validates a version string to ensure it adheres to
returnMyGroups                             Configuration Management baseline group
skipApproval                               version number requirements.

                                           Determines whether a file exists or not.

                                           Searches for one configuration item (CI) in a
                                           Configuration Management list or query group.

                                           Removes one or more configuration items (CI)
                                           from a Configuration Management list group.

                                           Returns an array containing the group members of
                                           a Configuration Management group.

                                           Returns an array containing all the groups to
                                           which a configuration item (CI) belongs.

                                           Prevents an item's approval status from being
                                           reset to "pending."


1.2.5.5.1. JavaScript function: addToGroup

This function adds one or more configuration items (CIs) to a Configuration Management list group and
updates the list group record if successful. It is part of a system JavaScript and should not be directly
modified.

Syntax

lib.ciGrouping.addToGroup( ci, groupName );

Arguments
The following arguments are valid for this function:

Name       Data type                                  Required  Description
ci         Datum object or string                     Yes
                                                                This argument contains
groupName  String                                     Yes       the CI records you
                                                                want to add. To add an
                                                                array of CIs, the ci
                                                                argument must be an
                                                                SCFile or SCDatum
                                                                object. To add a single
                                                                CI, you can specify it
                                                                as a string.

                                                                This argument contains
                                                                the name of the
                                                                configuration group to
                                                                which you want to add
                                                                CIs.

Return values

A numerical value: 0 or 1 .

The function returns 0 if it is unable to add CIs to the list group or if the groupName argument specifies a
query group. The function returns 1 if the function successfully adds the CIs to the list group.

Example

This example attempts to add CIs to a list group from the following sources:

     The logical.name value from a hard-coded string
     The logical.name value from a configuration group record
     The logical.name values from an array of CI records
     The logical.name values from a record list of one or more CIs

This example requires the following sample data:

     Create a list group containing a single configuration item (for example, a list group called "test01"
     containing the configuration item "DEFAULT Phone 0001")


Create a list group containing one or more configuration items (for example, a list group called
"test02" containing the configuration item "DEFAULT Phone 0003")
Create a list group containing one or more configuration items (for example, a list group called
"test03" containing the configuration items "HH-000001" and "HH-000002")


/* Create variables to store CI group names, strings, and datum objects.
* Use targetCIGroup to store the name of CI group you want to add records to.
* Use sourceCIGroup to store the name of CI group you want to create an array
from.
* Use oneLogicalName to store a string containing a logical.name you want to
add.
* Use deviceType to store a device type you want to query for.
* Use startsWith to store a alphabetical value you want to query for.
* The variable recordTest stores the output of the findCIGroup function.
* The variable arrayTest stores the output of the createArray function.
* The variable recordListTest stores the output of the findRecordList function.
*/
var targetCIGroup;
var sourceCIGroup;
var oneLogicalName;
var deviceType;
var startsWith;
var recordTest;
var arrayTest;
var recordListTest;
/* Create a function to store a particular CI group in memory. */
function findCIGroup( ciGroup )
{
print( "Looking for CI Group " + ciGroup + "..." );
var members = lib.ciGrouping.returnGroupMembers( ciGroup )
var ciGroupRecord = new SCFile( "cigroup" );
var queryTest = ciGroupRecord.doSelect( "logical.name=\"" + ciGroup + "\"" )
if ( queryTest == RC_SUCCESS )
{
system.vars.$L_file = ciGroupRecord
print( "Found CI group record for " + ciGroup + "\nThe record is:\n" +
ciGroupRecord );
print( "The current members of " + ciGroup + " are:\n" + members );
return ciGroupRecord
}
else
{
print( "Cannot find record for " + ciGroup + ". " + RCtoString( queryTest ) +
"." );
return null;
}
}
/* Create function to find a record list based on a device type and starting
query */
function findRecordList( deviceType, query )
{
var ciRecordList = new SCFile( "device" );
if ( query != null )
{
print( "Looking for CIs matching type=\"" + deviceType + "\"\&" +


"logical.name#\"" + query + "\"" );
var queryTest = ciRecordList.doSelect( "type=\"" + deviceType + "\"\&" +
"logical.name#\"" + query + "\"" )
}
else
{
print( "Looking for CIs matching type=\"" + deviceType + "\"" );
var queryTest = ciRecordList.doSelect( "type=\"" + deviceType + "\"" )
}
if ( queryTest == RC_SUCCESS )
{
print( "Found the following CIs:\n" + ciRecordList );
system.vars.$L_file = ciRecordList
return ciRecordList;
}
else
{
if ( query != null )
{
print( "Cannot find records matching query: device=\""+ deviceType +
"\"&logical.name#\"" + query + "\""
+ RCtoString( queryTest ) + "." );
return null;
}
else
{
print( "Cannot find records matching query: device=\""+ deviceType + "\"" +
RCtoString( queryTest ) + "." );
return null;
}
}
}
/* Create a function to store the logical.names of the record. */
function createArray( record )
{
var arrayOfLogicalNames = record.group_members;
if (arrayOfLogicalNames == null )
{
print( "Cannot create array from " + record + ". Group not in the cigroup table."
);
return null
}
else
{
print( "Created array from " + record + ".\nThe array is:\n" +
arrayOfLogicalNames );
return arrayOfLogicalNames
}
}
/* Create a function to call the addToGroup function and print results. */
function testAdd( ci, group )


{
var groupMembers = lib.ciGrouping.returnGroupMembers( group )
var AddCI = lib.ciGrouping.addToGroup( ci, group );
var afterAdd = lib.ciGrouping.returnGroupMembers( group );
print( "Now trying to add configuration item(s) to " + group + "..." );
print( "The current members of " + group + " are:\n" + groupMembers );
if ( AddCI == 1 )
{
print( "Successfully added configuration item(s) to " + group );
print( "The members of " + group + " are now: \n" + afterAdd );
}
else
{
print( "Could not add configuration item(s) to " + group );
print( "The members of " + group + "are : \n" + groupMembers );
}
}
/* Test adding a CI to a group from a string */
print( "Now testing adding a single CI from a string...\n" );
targetCIGroup = "test01";
oneLogicalName = "DEFAULT Phone 0002";
members = lib.ciGrouping.returnGroupMembers( targetCIGroup )
testAdd( oneLogicalName, targetCIGroup );
/* Test adding a CI to a group from an existing CI record */
print( "Now testing adding a CI member from a CI group record...\n" );
targetCIGroup = "test01";
sourceCIGroup = "test02";
recordTest = findCIGroup( sourceCIGroup );
if ( recordTest != null )
{
testAdd( system.vars.$L_file, targetCIGroup );
}
/* Test adding one or more CIs from an array of logical,names */
print( "Now testing adding one or more CIs from an array of logical names...\n"
);
targetCIGroup = "test01";
sourceCIGroup = "test03";
recordTest = findCIGroup( sourceCIGroup );
if ( recordTest != null )
{
arrayTest = createArray( recordTest );
testAdd( arrayTest, targetCIGroup );
}
/* Test adding one or more CIs to a group from a CI record list */
print( "Now testing adding one or more CIs from a CI record list...\n" );
targetCIGroup = "test01";
deviceType = "furnishings"
startsWith = null;
recordListTest = findRecordList( deviceType, startsWith );
if ( recordListTest != null )
{


testAdd( system.vars.$L_file, targetCIGroup );
}


1.2.5.5.2. JavaScript function: checkAllowedOption

Returns the next valid version number of a Configuration Management baseline group if there is only one
valid version number available.

Syntax

lib.versionControl.checkAllowedOption( oldVersion, maxIncrement );

Arguments
The following arguments are valid for this function:

Name          Data type                               Required  Description
oldVersion    String                                  Yes
                                                                This argument contains
maxIncrement  Array                                   Yes       the previous version
                                                                number.

                                                                This argument contains
                                                                an array of numbers
                                                                representing the
                                                                decimal value of the
                                                                maximum number
                                                                increments possible.
                                                                For example, if
                                                                maxIncrement equals
                                                                [0,1,0] then there are
                                                                ten possible
                                                                increments permissible
                                                                from versions 0.0.1 to
                                                                0.1.0.

Return values

A valid version number or the string more .

The function returns a valid version number if there is one and only one valid next version number. The
function returns the string more if there is more than one valid next version number.

Description

This function is part of a system JavaScript and should not be directly modified.
This function returns the next valid version number of a Configuration Management baseline group if there
is one and only one valid version number available. If there is more than one valid next version number then
the function returns the string more .

Example

This example attempts to create the next valid version from two variables.

This example requires the following sample data:


A variable storing the old version number
A variable storing the maximum number of increments allowed

/* Use oldVersion to store the old version number as a string.
* Use maxIncrement to store the maximum number of increments as an array. */
var oldVersion;
var maxIncrement = new Array();
/* Create a function to test the checkAllowedOption function */
function nextVersionTest( versionOld, increment )
{
var nextVersion = lib.versionControl.checkAllowedOption( versionOld, increment );
if ( nextVersion == "more" )
{
print( "Error. There is more than one valid next version number for " +
versionOld

                             + ".\n");
return versionOld
}
else
{
print( "Success. The next valid version number is " + nextVersion + ".\n" );
return nextVersion
}
}
/* Test a valid version number update */
print( "Testing checkAllowedOption...\n" );
oldVersion = "1.0";
maxIncrement = [0,1];
print( "The current version number is " + oldVersion + "." );
print( "The maximum allowed increment is " + maxIncrement + ".");
nextVersionTest( oldVersion, maxIncrement );
/* Test a valid version number update */
print( "Testing checkAllowedOption...\n" );
oldVersion = "0.9.9";
maxIncrement = [0,0,1];
print( "The current version number is " + oldVersion + "." );
print( "The maximum allowed increment is " + maxIncrement + ".");
nextVersionTest( oldVersion, maxIncrement );
/* Test an invalid version number update */
print( "Testing error condition...\n" );
oldVersion = "1.0";
maxIncrement = [0,2];
print( "The current version number is " + oldVersion + "." );
print( "The maximum allowed increment is " + maxIncrement + ".");
nextVersionTest( oldVersion, maxIncrement );


1.2.5.5.3. JavaScript function: checkVersionString

Validates a version string to ensure it adheres to Configuration Management baseline group version number
requirements.

Syntax

lib.versionControl.checkVersionString( oldVersion, newVersion, maxIncrement );

Arguments
The following arguments are valid for this function:

Name          Data type                               Required  Description
oldVersion    String                                  Yes
                                                                This argument contains
newVersion    String                                  Yes       the previous version
                                                                number.
maxIncrement  Array                                   Yes
                                                                This argument contains
                                                                the new version
                                                                number.

                                                                This argument contains
                                                                an array of numbers
                                                                representing the
                                                                decimal value of the
                                                                maximum number
                                                                increments possible.
                                                                For example, if
                                                                maxIncrement equals
                                                                [0,1,0] then there are
                                                                ten possible
                                                                increments permissible
                                                                from versions 0.0.1 to
                                                                0.1.0.

Return values
An integer value: 0 , 1 , -1 , -2 , -3 , or -4 .


Return value                            Condition
0
                                        The function returns 0 if any version level value
1                                       in the newVersion argument exceeds the value
-1                                      in the maxIncrement argument. For example, if
-2                                      oldVersion equals "1.0". and maxIncrement
-3                                      equals "2", then the function returns a value of 0
                                        if newVersion equals "1.3" since going from a
-4                                      value of zero to three exceeds the maxIncrement
                                        value of 2.

                                        The function returns 1 if it successfully validates
                                        the proposed change from the oldVersion to the
                                        newVersion .

                                        The function returns -1 if the newVersion
                                        argument contains greater than five version
                                        levels. For example, the function returns -1 if the
                                        newVersion argument equals "1.0.0.0.0.0" as this
                                        is a version with six version levels.

                                        The function returns -2 if a version level value in
                                        the newVersion argument contains anything
                                        other than the digits 0 to 9. For example the
                                        function returns -2 if the newVersion argument
                                        equals "gold" or "1.0a" because the version
                                        number contains alphabetical characters.

                                        The function returns -3 if the number of version
                                        levels in the oldVersion argument don't match
                                        the number of version levels in the newVersion
                                        argument. For example, the function returns -3 if
                                        oldVersion equals "1.1" and newVersion equals
                                        "1.1.1" since the oldVersion has two version levels
                                        and the newVersion has three.

                                        The function returns -4 if the value of the
                                        newVersion argument is less than the value of
                                        the oldVersion argument. For example, the
                                        function returns -4 if oldVersion equals "1.1"
                                        and newVersion equals "1.0" because the
                                        newVersion value is prior to the oldVersion
                                        value.

Description

This function is part of a system JavaScript and should not be directly modified.

This function validates a new Configuration Management baseline group version string against an old
version string to ensure it adheres to version number requirements.
Example


This example attempts to validate any given version number update from three variables.
This example requires the following sample data:

     A variable storing the old version number
     A variable storing the desired new version number
     A variable storing the maximum number of increments allowed


/* Use oldVersion to store the old version number as a string.
* Use newVersion to store the new version number as a string.
* Use maxIncrement to store the maximum number of increments as an array. */
var oldVersion;
var newVersion;
var maxIncrement = new Array();
/* Create a function to test the checkVersionString function */
function versionTest( versionOld, versionNew, increment )
{
var validate = lib.versionControl.checkVersionString( versionOld, versionNew,
increment );
print( "The checkVersionString return value is " + validate );
if ( validate == 1 )
{
print( "Success. Updating " + versionOld + " to " + versionNew + " is a valid
change.\n");
return versionNew
}
if ( validate == 0 )
{
print( "Error. Could not update " + versionOld + " to " + versionNew + "." );
print( "The new version " + versionNew + " exceeds the maximum version increment
value of "

                             + increment + "." );
return versionOld
}
if ( validate == "-1" )
{
print( "Error. Could not update " + versionOld + " to " + versionNew + ".");
print( "The new version " + versionNew + " contains more than five version
levels." );
return versionOld
}
if ( validate == "-2" )
{
print( "Error. Could not update " + versionOld + " to " + versionNew + ".");
print( "The new version " + versionNew + " contains characters other than 0 to
9." );
return versionOld
}
if ( validate == "-3" )
{
print( "Error. Could not update " + versionOld + " to " + versionNew + ".");
print( "The new version " + versionNew

                             + " contains a different number of version levels than the old
version " + versionOld );
return versionOld
}
if ( validate == "-4" )
{


print( "Error. Could not update " + versionOld + " to " + versionNew + ".");
print( "The new version " + versionNew + " is an earlier version than the old
version "

                             + versionOld );
return versionOld
}
else
{
return versionOld
}
}
/* Test a valid version number update */
print( "Testing checkVersionString...\n" );
oldVersion = "1.0";
newVersion = "1.1";
maxIncrement = [0,2];
versionTest( oldVersion, newVersion, maxIncrement );
/* Test an invalid version number update */
print( "Testing error condition 0...\n" );
oldVersion = "1.0";
newVersion = "1.9";
maxIncrement = [0,2];
versionTest( oldVersion, newVersion, maxIncrement );
/* Test an invalid version number update */
print( "Testing error condition -1...\n" );
oldVersion = "1.0.0.0.0.0";
newVersion = "1.0.0.0.0.1";
maxIncrement = [0,0,1,1,2];
versionTest( oldVersion, newVersion, maxIncrement );
/* Test an invalid version number update */
print( "Testing error condition -2...\n" );
oldVersion = "1.0.0.0.0";
newVersion = "1.a.0.0.0";
maxIncrement = [0,0,1,1,2];
versionTest( oldVersion, newVersion, maxIncrement );
/* Test an invalid version number update */
print( "Testing error condition -3...\n" );
oldVersion = "1.0.0";
newVersion = "1.1";
maxIncrement = [0,2,2];
versionTest( oldVersion, newVersion, maxIncrement );
/* Test an invalid version number update */
print( "Testing error condition -4...\n" );
oldVersion = "1.2";
newVersion = "1.1";
maxIncrement = [0,2];
versionTest( oldVersion, newVersion, maxIncrement );


1.2.5.5.4. JavaScript function: isfileexist

Determines whether a file or a folder exists or not.
Syntax

isfileexist(“path”,type)

Arguments
The following argument is valid for this function.

Name  Data type                                     Required  Description
path  String                                        Yes
                                                              This argument is the
type  Boolean                                       Optional  full file path.

                                                              If this argument is
                                                              omitted, the value is
                                                              set to 0 by default.

                                                                   0: determines
                                                                   whether a file or a
                                                                   folder exists
                                                                   1: determines
                                                                   whether a file
                                                                   exists
                                                                   2: determines
                                                                   whether a folder
                                                                   exists

Return values
A Boolean value: true or false .
The function returns true if a file or a folder exists. Otherwise, this function returns false .
Description
This function determines whether a file or a folder exists or not and returns a Boolean value of true if the
file exists.
Example
This example attempts to determine whether the note.txt file exists or not in c:\\.

if ( system.functions.isfileexist(“c:\\note.txt”))
print ("file exist")
else
print ("file doesn't exist");


1.2.5.5.5. JavaScript function: isInGroup

Searches for one configuration item (CI) in a Configuration Management list or query group.
Syntax

lib.ciGrouping.isInGroup( ci, groupName );

Arguments
The following arguments are valid for this function:

Name       Data type                                  Required  Description
ci         String                                     Yes
                                                                This argument contains
groupName  String                                     Yes       the CI record you want
                                                                to search for in the
                                                                group.

                                                                This argument contains
                                                                the name of the
                                                                configuration group
                                                                where you want to
                                                                search for the CI.

Return values

A Boolean value: true or false .

The function returns true if the function successfully finds the CI in the list or query group. The function
returns false if it is unable to find the CI in the list or query group.

Description

This function is part of a system JavaScript and should not be directly modified.
This function searches for a CI in list or query groups and returns a Boolean value of true if successful.

Example

This example attempts to search for a CI in the following groups:

     A list group
     A query group

This example requires the following sample data:

     Create a list group containing one or more configuration items (for example, a list group called
     "test01" containing the configuration item "DEFAULT Phone 0001")
     Create a query group containing one or more configuration items (for example, a query group called
     "test04" containing the configuration items where type equals "telecom")


/* Create variables to store CI group name and the results of returnGroupMembers
*/
var targetCIGroup;
var targetCI;
var members;
function findInGroup( ci, group )
{
inGroupTest = lib.ciGrouping.isInGroup( ci, group );
if ( inGroupTest == true )
{
print( "Success. Found " + ci + " in " + group );
}
else
{
print( "Error. Could not find " + ci + " in " + group );
}
}
/* Test returnGroupMembers on a list group. */
print( "Now testing isInGroup on list group...\n" );
targetCIGroup = "test01";
targetCI = "DEFAULT Phone 0001";
members = lib.ciGrouping.returnGroupMembers( targetCIGroup )
print( "Looking for " + targetCI + " in " + targetCIGroup + "..." );
findInGroup( targetCI, targetCIGroup );
print( "The current members of " + targetCIGroup + " are:\n" + members );
/* Test returnGroupMembers on a query group. */
print( "Now testing isInGroup on query group...\n" );
targetCIGroup = "test04";
targetCI = "DEFAULT Phone 0006";
members = lib.ciGrouping.returnGroupMembers( targetCIGroup )
print( "Looking for " + targetCI + " in " + targetCIGroup + "..." );
findInGroup( targetCI, targetCIGroup );
print( "The current members of " + targetCIGroup + " are:\n" + members );


1.2.5.5.6. JavaScript function: removeFromGroup

Removes one or more configuration items (CI) from a Configuration Management list group.
Syntax

lib.ciGrouping.removeFromGroup( ci, groupName );

Arguments
The following arguments are valid for this function:

Name       Data type                                  Required  Description
ci         Datum object or string                     Yes
                                                                This argument contains
groupName  String                                     Yes       the CI records you
                                                                want to remove. To
                                                                remove an array of CIs,
                                                                the ci argument must
                                                                be an SCFile or
                                                                SCDatum object. To
                                                                remove a single CI, you
                                                                can specify it as a
                                                                string.

                                                                This argument contains
                                                                the name of the
                                                                configuration group
                                                                from which you want to
                                                                remove CIs.

Return values

A numerical value: 0 , 1 , or -1 .

The function returns 0 if it is unable to remove CIs from the list group or if the groupName argument
specifies a query group. The function returns 1 if the function successfully removes CIs from the list
group. The function returns -1 if it can't remove CIs from the list group because the action would result in
an empty configuration list group.

Description

This function is part of a system JavaScript and should not be directly modified.

This function removes one or more CIs from a configuration list group and updates the list group record if
successful.

Example

This example attempts to remove the following CIs from a list group:

     A string containing a single CI record
     A configuration group record containing one or more CIs
     A Datum object containing an array of CI records


This example requires the following sample data:

     Create a list group containing a single configuration item (for example, a list group called "test01"
     containing the configuration item "DEFAULT Phone 0001")
     Create a list group containing one or more configuration items (for example, a list group called
     "test02" containing the configuration item "DEFAULT Phone 0003")
     Create a list group containing one or more configuration items (for example, a list group called
     "test03" containing the configuration items "HH-000001" and "HH-000002")


/* Create variables to store CI group names, strings, and datum objects.
* Use targetCIGroup to store the name of CI group you want to remove records
from.
* Use sourceCIGroup to store the name of CI group you want to create an array
from.
* Use oneLogicalName to store a string containing a logical.name you want to
remove.
* Use deviceType to store a device type you want to query for.
* Use startsWith to store a alphabetical value you want to query for.
* The variable recordTest stores the output of the findCIGroup function.
* The variable arrayTest stores the output of the createArray function.
* The variable recordListTest stores the output of the findRecordList function.
*/
var targetCIGroup;
var sourceCIGroup;
var oneLogicalName;
var deviceType;
var startsWith;
var recordTest;
var arrayTest;
var recordListTest;
/* Create a function to store a particular CI group in memory. */
function findCIGroup( ciGroup )
{
print( "Looking for CI Group " + ciGroup + "..." );
var members = lib.ciGrouping.returnGroupMembers( ciGroup )
var ciGroupRecord = new SCFile( "cigroup" );
var queryTest = ciGroupRecord.doSelect( "logical.name=\"" + ciGroup + "\"" )
if ( queryTest == RC_SUCCESS )
{
system.vars.$L_file = ciGroupRecord
print( "Found CI group record for " + ciGroup + "\nThe record is:\n" +
ciGroupRecord );
print( "The current members of " + ciGroup + " are:\n" + members );
return ciGroupRecord
}
else
{
print( "Cannot find record for " + ciGroup + ". " + RCtoString( queryTest ) +
"." );
return null;
}
}
/* Create function to find a record list based on a device type and starting
query */
function findRecordList( deviceType, query )
{
var ciRecordList = new SCFile( "device" );
if ( query != null )
{


print( "Looking for CIs matching type=\"" + deviceType + "\"\&" +
"logical.name#\"" + query + "\"" );
var queryTest = ciRecordList.doSelect( "type=\"" + deviceType + "\"\&" +
"logical.name#\"" + query + "\"" )
}
else
{
print( "Looking for CIs matching type=\"" + deviceType + "\"" );
var queryTest = ciRecordList.doSelect( "type=\"" + deviceType + "\"" )
}
if ( queryTest == RC_SUCCESS )
{
print( "Found the following CIs:\n" + ciRecordList );
system.vars.$L_file = ciRecordList
return ciRecordList;
}
else
{
if ( query != null )
{
print( "Cannot find records matching query: device=\""+ deviceType +
"\"&logical.name#\"" + query + "\""
+ RCtoString( queryTest ) + "." );
return null;
}
else
{
print( "Cannot find records matching query: device=\""+ deviceType + "\"" +
RCtoString( queryTest ) + "." );
return null;
}
}
}
/* Create a function to store the logical.names of the record. */
function createArray( record )
{
var arrayOfLogicalNames = record.group_members;
if (arrayOfLogicalNames == null )
{
print( "Cannot create array from " + record + ". Group not in the cigroup table."
);
return null
}
else
{
print( "Created array from " + record + ".\nThe array is:\n" +
arrayOfLogicalNames );
return arrayOfLogicalNames
}
}
/* Create a function to call the addToGroup function and print results. */


function testRemove( ci, group )
{
var groupMembers = lib.ciGrouping.returnGroupMembers( group )
var removeCI = lib.ciGrouping.removeFromGroup( ci, group );
var afterRemove = lib.ciGrouping.returnGroupMembers( group );
print( "Now trying to remove configuration item(s) from " + group + "..." );
print( "The current members of " + group + " are:\n" + groupMembers );
if ( removeCI == 1 )
{
print( "Successfully removed configuration item(s) to " + group );
print( "The members of " + group + " are now: \n" + afterRemove );
}
else
{
if ( removeCI == "-1" )
{
print( "Could not remove configuration item from " + group + " as "
+ ci + " is the last member of the group." );
print( "The members of " + group + "are : \n" + groupMembers );
}
else
{
print( "Could not remove configuration item from " + group + ".\n"
+ ci + " or " + group + " doesn't exist.");
}
}
}
/* Test removing a CI to a group from a string */
print( "Now testing removing a single CI from a string...\n" );
targetCIGroup = "test01";
oneLogicalName = "DEFAULT Phone 0002";
members = lib.ciGrouping.returnGroupMembers( targetCIGroup )
testRemove( oneLogicalName, targetCIGroup );
/* Test removing a CI to a group from an existing CI record */
print( "Now testing removing a CI member from a CI group record...\n" );
targetCIGroup = "test01";
sourceCIGroup = "test02";
recordTest = findCIGroup( sourceCIGroup );
if ( recordTest != null )
{
testRemove( system.vars.$L_file, targetCIGroup );
}
/* Test removing one or more CIs from an array of logical,names */
print( "Now testing removing one or more CIs from an array of logical names...\n"
);
targetCIGroup = "test01";
sourceCIGroup = "test03";
recordTest = findCIGroup( sourceCIGroup );
if ( recordTest != null )
{
arrayTest = createArray( recordTest );


testRemove( arrayTest, targetCIGroup );
}
/* Test removing one or more CIs to a group from a CI record list */
print( "Now testing removing one or more CIs from a CI record list...\n" );
targetCIGroup = "test01";
deviceType = "furnishings"
startsWith = null;
recordListTest = findRecordList( deviceType, startsWith );
if ( recordListTest != null )
{
testRemove( system.vars.$L_file, targetCIGroup );
}


1.2.5.5.7. JavaScript function: returnGroupMembers

Returns an array containing the group members of a Configuration Management group.
Syntax

lib.ciGrouping.returnGroupMembers( groupName );

Arguments
The following arguments are valid for this function:

Name       Data type                                  Required  Description
groupName  String                                     Yes
                                                                This argument contains
                                                                the name of the
                                                                configuration group
                                                                whose members you
                                                                want to return as an
                                                                array.

Return values

An array or null.

The function returns an array containing the logical.name values of the group members if there are group
members. The function returns null if it can't find a matching group name or if the group doesn't have any
members.

Description

This function is part of a system JavaScript and should not be directly modified.

This function returns the logical.name values of the members of a Configuration Management group.

     If the group is a list type, the function returns the array from the group configuration item record.
     If the group is a query type, the function returns an array of all the CIs it finds.

Example

This example returns the members of the group listed in the variable.

This example requires the following sample data:

     Create a list group containing one or more configuration items (for example, a list group called
     "test01" containing the configuration item "DEFAULT Phone 0001")
     Create a query group containing one or more configuration items (for example, a list group called
     "test04" containing the configuration items where type equals "telecom")


/* Create variables to store CI group name and the results of returnGroupMembers
*/
var targetCIGroup;
var members;
/* Test returnGroupMembers on a list group */
print( "Now testing returnGroupMembers on a list group...\n" );
targetCIGroup = "test01";
members = lib.ciGrouping.returnGroupMembers( targetCIGroup );
print( "The current members of " + targetCIGroup + " are:\n" + members );
/* Test returnGroupMembers on a query group */
print( "Now testing returnGroupMembers on a query group...\n" );
targetCIGroup = "test04";
members = lib.ciGrouping.returnGroupMembers( targetCIGroup );
print( "The current members of " + targetCIGroup + " are:\n" + members );


1.2.5.5.8. JavaScript function: returnMyGroups

Returns an array containing all the groups to which a configuration item (CI) belongs.
Syntax

lib.ciGrouping.returnMyGroups( ci, listType );

Arguments
The following arguments are valid for this function:

Name           Data type                              Required  Description
ci             String                                 Yes
                                                                This argument contains
listType       String                                 No        the CI record you want
                                                                to search for in your list
                                                                and query groups.

                                                                This argument contains
                                                                a string describing
                                                                which types of
                                                                configuration groups
                                                                you want the function
                                                                to query. The string
                                                                can have one of four
                                                                values:

                                                                     list: Add this
                                                                     argument to only
                                                                     search list
                                                                     groups.
                                                                     query: Add this
                                                                     argument to only
                                                                     search query
                                                                     groups.
                                                                     both: Add this
                                                                     argument to
                                                                     search both list
                                                                     and query
                                                                     groups.
                                                                     null: If there is a
                                                                     null entry for this
                                                                     argument, the
                                                                     function searches
                                                                     both list and
                                                                     query groups.

Return values


An array of group names.

The function returns an array containing the logical.name values of the list and query groups in which the
CI is a member. The function returns an empty array if it can't find the CI in any list or query group.

Description

This function is part of a system JavaScript and should not be directly modified.

This function returns an array containing the logical.name values of the groups in which the CI is a member.
The function queries all group records and does the following:

     If the group is a list type, the function indexes the group.members and if the CI exists in the list group,
     adds it to the groupArray.
     If the group is a query type, the function uses the RTE function to determine whether the values in the
     CI record satisfy the search criteria defined by the query.

Example

This example returns the groups containing the CI listed in a variable.

This example requires the following sample data:

     Create a list group containing a single configuration item (for example, a list group called "test01"
     containing the configuration item "DEFAULT Phone 0001")
     Create a list group containing one or more configuration items (for example, a list group called
     "test02" containing the configuration item "DEFAULT Phone 0003")
     Create a list group containing one or more configuration items (for example, a list group called
     "test03" containing the configuration items "HH-000001" and "HH-000002")
     Create a query group containing one or more configuration items (for example, a query group called
     "test04" containing the configuration items where type equals "telecom")


/* Create variables to store CI group name and the results of returnMyGroups */
var targetCIGroup;
var listTypes;
var groups;
/* Search for a CI in a list group only */
print( "Now testing search for configuration items in list groups only...\n" );
targetCI = "DEFAULT Phone 0001";
listTypes = "list";
groups = lib.ciGrouping.returnMyGroups( targetCI, listTypes );
if ( groups.length >= 1 )
{
print( "The list groups containing " + targetCI + " are:\n" + groups );
}
else
{
print( "There are no list groups containing " + targetCI );
}
/* Search for a CI in a query group only */
print( "Now testing search for configuration items in query groups only...\n" );
targetCI = "DEFAULT Phone 0001";
listTypes = "query";
groups = lib.ciGrouping.returnMyGroups( targetCI, listTypes );
if ( groups.length >= 1 )
{
print( "The query groups containing " + targetCI + " are:\n" + groups );
}
else
{
print( "There are no query groups containing " + targetCI );
}
/* Search for a CI in both list and query groups */
print( "Now testing search for configuration items in both list and query
groups...\n" );
targetCI = "DEFAULT Phone 0001";
listTypes = "both";
groups = lib.ciGrouping.returnMyGroups( targetCI, listTypes );
if ( groups.length >= 1 )
{
print( "The groups containing " + targetCI + " are:\n" + groups );
}
else
{
print( "There are no groups containing " + targetCI );
}


1.2.5.5.9. JavaScript function: skipApproval

Prevents an item's approval status from being reset to "pending."
Syntax

ApprovalItem.skipApproval (isChanged, finalstatus, lCartItemFile);

Arguments
The following arguments are valid for this function:

Name           Data type                              Required  Description
isChanged      Boolean                                Yes
                                                                This argument
finalstatus    String                                 Yes       indicates whether the
                                                                cart Item gets
lCartItemFile  Datum object                           No        changed.

                                                                This argument contains
                                                                the latest cart item's
                                                                approval status

                                                                This argument is the
                                                                cart Item object.

Return values
A Boolean value: true or false
If the function returns true, the item approval status isn't reset to "pending."
Description
You can modify the implementation of this function base on your organization's own business logic.
Example
Out-of-the-box, if the item isn't changed, and the approval status isn't denied, you can skip resetting the
approval status to pending.

function skipApproval(isChanged, finalstatus, lCartItemFile){
if (isChanged !=null && finalstatus!= null && isChanged==false &&
finalstatus !="denied") {
return true;
}else {
return false;
}
}
````
