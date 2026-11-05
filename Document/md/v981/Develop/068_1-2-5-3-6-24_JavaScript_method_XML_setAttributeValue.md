---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.5.3.6.24 .. 1.2.5.3.6.30
printed_pages: 1816-1838
---

# 1.2.5.3.6.24 JavaScript method: XML.setAttributeValue()

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.5.3.6.24. JavaScript method:
XML.setAttributeValue()

This method adds or updates the attribute value of the target attribute. You must use the
other XML get methods to navigate through an XML document.

Syntax

XML.setAttributeValue( AttributeName, AttributeValue );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
AttributeName                           String
                                                    This argument specifies
AttributeValue                          String      the XML attribute whose
                                                    value you want the script
                                                    to add or update.

                                                    This argument specifies
                                                    the text string you want
                                                    the script to use as the
                                                    XML attribute value. This
                                                    argument must contain
                                                    characters valid for an
                                                    XML element (for
                                                    example, the string can't
                                                    include the characters <
                                                    or >).

Return values
This method doesn't return any values.
Example
This example adds or updates the attribute value of any given element in an XML
document.
This example requires the following sample data:


A local XML file (for example, C:\test.xml which contains <document><parent1>
<child1 attribute1="a" /><child2 /></parent1><parent2><child3 /><child4 />
</parent2></document> )


/* Create variables to store XML objects and strings.
* Use XMLFile to store a valid XML file.
* The script assigns values to the empty variables later on */
var XMLFile = new XML();
XMLFile = XMLFile.setContent( "C:\\test.xml", true );
var XMLSource;
var TargetNode;
var TargetAttribute;
var TargetValue;
var searchResults;
/* Create a function that searches an XML object (node) for a
particular
* element (targetElem) and returns an XML object containing the
element.
* This function assumes that there is only one instance of the
target
* element in the source data. If it finds more than one element in
the
* data it only returns the first instance of the element. */
function findTargetElement( node, targetElem )
{
var topNodeName = node.getNodeName();
while (node != null && node.getNodeName() != targetElem )
{
var childNode = node.getFirstChildElement();
if (childNode == null)
{
childNode = node.getNextSiblingElement();
while (childNode == null)
{
node = node.getParentNode();
if ( node == null || topNodeName == node.getNodeName() )
{
return null;
}
childNode = node.getNextSiblingElement();
}
node = childNode;
}
else
{
node = childNode;


}
}
return node;
}
/* Create a function to print the target element and search results
*/
function printFindResults( target, searchResult, attributeName,
attributeValue )
{
print( "The target element we are looking for is: " + target );
if ( searchResult != null )
{
var elementName = searchResult.getNodeName();
print( "Found element " + elementName + " in: \n" + searchResult +
"\n" );
var attributeSet = setAttributeValue( searchResult, attributeName,
attributeValue );
print( "The XML object is " + searchResult );
return attributeSet
}
else
{
print( "Cannot find " + target );
return null
}
}
/* Create a function to set the attribute value of the target
attribute */
function setAttributeValue( sourceObject, attributeName,
attributeValue )
{
print( "Setting attribute value of " + attributeName );
var setAttributeValue = sourceObject.setAttributeValue(
attributeName, attributeValue );
var newAttributeValue = sourceObject.getAttributeValue(
attributeName );
print( "The value of " + attributeName + " is now " +
newAttributeValue );
return newAttributeValue
}
/* Set variable values for XMLFile and TargetNode. Run functions */
print( "Processing XML from XMLFile... \n" );


TargetNode = "child1";
XMLSource = XMLFile;
TargetAttribute = "attribute1";
TargetValue = "z";
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( TargetNode, searchResults, TargetAttribute,
TargetValue );
print( "Processing XML from XMLFile... \n" );
TargetNode = "child2";
XMLSource = XMLFile;
TargetAttribute = "attribute1";
TargetValue = "z";
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( TargetNode, searchResults, TargetAttribute,
TargetValue );


1.2.5.3.6.25. JavaScript method:
XML.setContent()

This method creates an XML object from a string or the contents of an external file. It
always creates a valid XML document with a document element. The method removes any
values outside the document element.

            Note

           This method returns null if applied to an existing XML object because the
           header information ([C++ object XML] @nnnnnnnnnn - ) is invalid.

Syntax

  XML.setContent( String ); setContent( "FilePath", IsFile );

Arguments
The following arguments are valid for this method:


Argument                                Data type  Description
String                                  String
FilePath                                String     This argument specifies
                                                   the text string you want
IsFile                                  Boolean    the script to parse as on
                                                   XML object. The string
                                                   argument must contain a
                                                   valid XML document with
                                                   a document element.

                                                   This argument specifies
                                                   the path to the XML
                                                   document you want the
                                                   script to parse an XML
                                                   object. You must enclose
                                                   the FilePath argument in
                                                   quotation marks and use
                                                   the true argument to
                                                   indicate that the first
                                                   argument is a file path and
                                                   not a string value.

                                                   This argument specifies
                                                   whether the first argument
                                                   is a string or a file path. A
                                                   true value indicates the
                                                   first argument is a file
                                                   path. Any other value,
                                                   including omitting the
                                                   second argument,
                                                   indicates that the first
                                                   argument is a string.

Return values
An XML object or null .
The method returns an XML object if it parses the XML input and returns null if it can't
parse the input.
Arguments
Use the toXMLString method to convert an XML object to an XML string.


Example

This example attempts to create an XML object from five different sources.

This example requires the following sample data:

     A valid XML string (for example, <document><parent1><child1 attribute1=\"1\" />
     </parent1><parent2 /></document> )
     An XML string with more than one document element (for example, <document1>
     <parent1 /></document1><document2><parent2 /></document2> )
     A local XML file (for example, C:\test.xml which contains <document><parent1>
     <child1 attribute1="a" /><child2 /></parent1><parent2><child3 /><child4 />
     </parent2></document> )
     An existing XML object (for example, the list of currently logged on users stored in
     system.users)
     An XML object converted to a string (for example, the list of currently logged on
     users stored in system.users)


/* Create a function to execute the setContent method.
* The function creates a new XML object xmlObj.
* It sets the content of the XML object to the source argument.
* The isFile argument determines if the source is an XML string or
file path.
* If setContent returns true, it prints an XML string and returns
the XML object.
* If setContent returns false, it prints the source and returns
null. */
function setXML( source, isFile )
{
var xmlObj = new XML();
if ( xmlObj.setContent( source, isFile ) )
{
var xmlDoc = xmlObj.toXMLString();
print( "setContent succeeded! \n The XML document is: \n" + xmlDoc
);
return xmlObj
}
else
{
print( "setContent failed. \n Could not parse the following input as
XML: \n" + source );
return null
}
}
/* Create variables to store your XML source objects.
* Use xmlObject to test setting content to an XML object.
* xmlObjectConverted converts xmlObject to an XML string.
* Note: The toXMLstring method removes the object header
information.
* Use xmlString to test setting content to an XML string.
* Note: You must use the backslash character to escape out
quotation marks in your XML string.
* Use xmlFile to test setting content to an XML file. */
var xmlString = "<document><parent1><child1 attribute1=\"1\" />
</parent1><parent2 /></document>";
var xmlBad = "<document1><parent1 /></document1><document2><parent2
/></document2>"
var xmlFile = "C:\\test.xml";
var xmlObject = system.users
var xmlObjectConverted = xmlObject.toXMLString();


/* Note: You can omit the isFile argument when the content source is
an XML string.
* See the xmlString example below. */
print( "Testing setting content to a valid XML string...\n" );
setXML( xmlString );
print( "Testing setting content to an XML string with more than one
document element...\n" );
print( "The non-compliant XML string before conversion is: \n" +
xmlBad );
setXML( xmlBad );
print( "Testing setting content to an XML file...\n" );
setXML( xmlFile, true );
print( "Testing setting content to an existing XML object...\n" );
setXML( xmlObject, false );
print( "Testing setting content to an existing XML object converted
to an XML string...\n" );
setXML( xmlObjectConverted, false );


1.2.5.3.6.26. JavaScript method:
XML.setNodeValue()

This method adds or updates the value of the current element. It requires you use the
other XML get methods to navigate through an XML document.

Syntax

XML.setNodeValue( String );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
String                                  String
                                                    This argument specifies
                                                    the text string you want
                                                    the script to add as the
                                                    XML element value. The
                                                    string argument must
                                                    contain characters valid
                                                    for XML (for example, the
                                                    string can't include the
                                                    characters < or > except
                                                    as XML entities such as
                                                    &lt; and &gt;).

Return values
An XML object or null .
The method returns an XML object containing the new value of the current XML element
or returns null if the method can't set a value for the element.
Example

This example sets the value of the elements in an XML document.

This example requires the following sample data:

     A local XML file (for example, C:\test03.xml which contains <document><parent1>
     </parent1><parent2></parent2></document> )


/* Create variables to store XML objects and strings.
* Use XMLObject to store a valid XML object such as an XML file.
* Use sourceXMLString to store a valid XML string.
* The script sets the content of XMLString to sourceXMLString.
* The script assigns values to the empty variables later on */
var XMLFile = new XML();
XMLFile = XMLFile.setContent( "C:\\test03.xml", true );
var TargetNode;
var TargetValue;
var findElement;
/* Create a function that searches an XML object (node) for a
particular
* element (targetElem) and returns an XML object containing the
element.
* This function assumes that there is only one instance of the
target
* element in the source data. If it finds more than one element in
the
* data it only returns the first instance of the element. */
function findTargetElement( node, targetElem )
{
var topNodeName = node.getNodeName();
while (node != null && node.getNodeName() != targetElem )
{
var childNode = node.getFirstChildElement();
if (childNode == null)
{
childNode = node.getNextSiblingElement();
while (childNode == null)
{
node = node.getParentNode();
if ( node == null || topNodeName == node.getNodeName() )
{
return null;
}
childNode = node.getNextSiblingElement();
}
node = childNode;
}
else
{
node = childNode;


}
}
return node;
}
/* Create a function to print the target element and search results
*/
function setElementValue( searchResult, targetNode, newValue )
{
print( "The target element we are looking for is: " + targetNode );
if ( searchResult != null )
{
var elementName = searchResult.getNodeName();
print( "Found element " + elementName + " in: \n" + searchResult +
"\n" );
searchResult.setNodeValue( newValue );
print( "The new value of " + targetNode + " is: " + searchResult );
return searchResult
}
else
{
print( "Cannot find " + targetNode );
return null
}
}
TargetNode = "parent1";
TargetValue = "1234";
findElement = findTargetElement( XMLFile, TargetNode );
setElementValue( findElement, TargetNode, TargetValue );


1.2.5.3.6.27. JavaScript method:
XML.setText()

This method adds or updates the value of the current element. You must use the other
XML get methods to navigate through an XML document. This method is a synonym for
setNodeValue();.

Syntax

XML.setText( String );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
String                                  String
                                                    This argument specifies
                                                    the text string you want
                                                    the script to add as the
                                                    XML element value. This
                                                    argument must contain
                                                    characters valid for XML
                                                    (for example, the string
                                                    can't include the
                                                    characters < or > except
                                                    as XML entities such as
                                                    &lt; and &gt;).

Return values
An XML object or null .
The method returns an XML object containing the new value of the current XML element
or returns null if the method can't set a value for the element.
Example

This example sets the value of the elements in an XML document.

This example requires the following sample data:

     A local XML file (for example, C:\test03.xml which contains <document><parent1>
     </parent1><parent2></parent2></document> )


/* Create variables to store XML objects and strings.
* Use XMLObject to store a valid XML object such as an XML file.
* Use sourceXMLString to store a valid XML string.
* The script sets the content of XMLString to sourceXMLString.
* The script assigns values to the empty variables later on */
var XMLFile = new XML();
XMLFile = XMLFile.setContent( "C:\\test03.xml", true );
var TargetNode;
var TargetValue;
var findElement;
/* Create a function that searches an XML object (node) for a
particular
* element (targetElem) and returns an XML object containing the
element.
* This function assumes that there is only one instance of the
target
* element in the source data. If it finds more than one element in
the
* data it only returns the first instance of the element. */
function findTargetElement( node, targetElem )
{
var topNodeName = node.getNodeName();
while (node != null && node.getNodeName() != targetElem )
{
var childNode = node.getFirstChildElement();
if (childNode == null)
{
childNode = node.getNextSiblingElement();
while (childNode == null)
{
node = node.getParentNode();
if ( node == null || topNodeName == node.getNodeName() )
{
return null;
}
childNode = node.getNextSiblingElement();
}
node = childNode;
}
else
{
node = childNode;


}
}
return node;
}
/* Create a function to print the target element and search results
*/
function setElementValue( searchResult, targetNode, newValue )
{
print( "The target element we are looking for is: " + targetNode );
if ( searchResult != null )
{
var elementName = searchResult.getNodeName();
print( "Found element " + elementName + " in: \n" + searchResult +
"\n" );
searchResult.setText( newValue );
print( "The new value of " + targetNode + " is: " + searchResult );
return searchResult
}
else
{
print( "Cannot find " + targetNode );
return null
}
}
TargetNode = "parent1";
TargetValue = "1234";
findElement = findTargetElement( XMLFile, TargetNode );
setElementValue( findElement, TargetNode, TargetValue );


1.2.5.3.6.28. JavaScript method:
XML.setValue()

This method adds or updates the value of the current element. You must use the other
XML get methods to navigate through an XML document. This method is a synonym for
setNodeValue();.

Syntax

XML.setValue( String );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
String                                  String
                                                    This argument specifies
                                                    the text string you want
                                                    the script to add as the
                                                    XML element value. The
                                                    string argument must
                                                    contain characters valid
                                                    for XML (for example, the
                                                    string can't include the
                                                    characters < or > except
                                                    as XML entities such as
                                                    &lt; and &gt;).

Return values
An XML object or null .
The method returns an XML object containing the new value of the current XML element
or returns null if the method can't set a value for the element.
Example

This example sets the value of the elements in an XML document.

This example requires the following sample data:

     A local XML file (for example, C:\test03.xml which contains <document><parent1>
     </parent1><parent2></parent2></document> )


/* Create variables to store XML objects and strings.
* Use XMLObject to store a valid XML object such as an XML file.
* Use sourceXMLString to store a valid XML string.
* The script sets the content of XMLString to sourceXMLString.
* The script assigns values to the empty variables later on */
var XMLFile = new XML();
XMLFile = XMLFile.setContent( "C:\\test03.xml", true );
var TargetNode;
var TargetValue;
var findElement;
/* Create a function that searches an XML object (node) for a
particular
* element (targetElem) and returns an XML object containing the
element.
* This function assumes that there is only one instance of the
target
* element in the source data. If it finds more than one element in
the
* data it only returns the first instance of the element. */
function findTargetElement( node, targetElem )
{
var topNodeName = node.getNodeName();
while (node != null && node.getNodeName() != targetElem )
{
var childNode = node.getFirstChildElement();
if (childNode == null)
{
childNode = node.getNextSiblingElement();
while (childNode == null)
{
node = node.getParentNode();
if ( node == null || topNodeName == node.getNodeName() )
{
return null;
}
childNode = node.getNextSiblingElement();
}
node = childNode;
}
else
{
node = childNode;


}
}
return node;
}
/* Create a function to print the target element and search results
*/
function setElementValue( searchResult, targetNode, newValue )
{
print( "The target element we are looking for is: " + targetNode );
if ( searchResult != null )
{
var elementName = searchResult.getNodeName();
print( "Found element " + elementName + " in: \n" + searchResult +
"\n" );
searchResult.setValue( newValue );
print( "The new value of " + targetNode + " is: " + searchResult );
return searchResult
}
else
{
print( "Cannot find " + targetNode );
return null
}
}
TargetNode = "parent1";
TargetValue = "1234";
findElement = findTargetElement( XMLFile, TargetNode );
setElementValue( findElement, TargetNode, TargetValue );


1.2.5.3.6.29. JavaScript method:
XML.toXMLString()

This method converts an XML object into a valid XML string. You must use the other XML
get methods to navigate through an XML document.
Syntax

  XML.toXMLString();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a string containing valid XML or returns null if the current node is
not an XML object.
Example
This example converts an XML object into a valid XML document.
This example requires the following sample data:

     An existing XML object (for example, the list of currently logged on users stored in
     system.users)

  var xmlObject = system.users
  print( "This is the original XML object:\n" + xmlObject );
  var xmlString = xmlObject.toXMLString();
  print( "This is the XML object after conversion to a string:\n" +
  xmlString );


1.2.5.3.6.30. JavaScript method:
XMLDoc.insertBefore()

Inserts the specified node before a reference element as a child of the current node.
Syntax

var insertedElement = parentElement.insertBefore(newElement,
referenceElement)

Arguments
The following arguments are valid for this function:

Name             Data type              Required      Description
insertedElement  XML                    Yes
                                                      The node being
parentElement    XML                    Yes           inserted, that's
                                                      newElement .
newElement       XML                    Yes
                                        Yes           The parent of the
referenceElement XML                                  newly inserted
                                                      node.

                                                      The node to insert.

                                                      The parent of the
                                                      newly inserted
                                                      node.

Usage Notes

   1. The referenceElement may NOT be null. If referenceElement is null, newElement
     the function will fail.

   2. The newElement must be a newly created element within the same document
     (created using importNode or createNode) which has not yet been attached to the
     tree, such as a newly created element for which appendNode has not been called.
     The result of invoking insertBefore using references to nodes already in the same
     DOM tree as newElement is undefined.

Example


var xmlDoc = new XML();
var someXML = "<doc> \
<one/> \
<two/> \
</doc>";
// Create an XML document from the literal XML string
// we pass "false" as the second argument to setContent() to
indicate
// that the supplied string does NOT represent a path to an XML file
xmlDoc.setContent( someXML, false );
// Now add create and add new element <four> in one step.
// It will be added at the end, i.e. after <two>
var nodeFour = xmlDoc.addElement( "four" );
// Now insert a new element <three> in front of <four>
// We do this in two steps:
// a) create a new element node called <three>
// b) insert the new element node before the <four> element
// Note: Passing "1" as the first argument to createNode means
create an element
var nodeThree = xmlDoc.createNode( 1, "three" );
// The newly created node has not yet been given a position in the
tree.
// Just as in the case of a node created with "importNode", we must
// attach the new node somewhere. We can do that with appendNode or
insertBefore
// To get the new node in between two sibling nodes (as in this
example)
// we must use insertBefore. appendChild can only be used on a
parent node,
// and if we were to append to the parent element <doc>, it would
end up following <four>
xmlDoc.insertBefore( nodeThree, nodeFour );
print( xmlDoc );
````
