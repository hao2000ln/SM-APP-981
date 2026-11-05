---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.5.3.6.16 .. 1.2.5.3.6.23
printed_pages: 1787-1816
---

# 1.2.5.3.6.16 JavaScript method: XML.getParentNode()

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.5.3.6.16. JavaScript method:
XML.getParentNode()

This method returns an XML object representing the parent node of the current node.
Syntax

XML.getParentNode();
getParentNode(Element)

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
Node                                    String
                                                    This argument contains
                                                    the name of the element
                                                    you want the method to
                                                    use as the starting
                                                    position when searching
                                                    for the parent node
                                                    element.

Return values

An XML object or null .

The method returns an object representing the parent node of the current node or returns
null if the XML object has no parent node.

Example

This example displays the parent node element of any element you select. The example
allows you to select an element from two different input sources.

This example requires the following sample data:

     A local XML file (for example, C:\test.xml which contains <document><parent1>
     <child1 attribute1="a" /><child2 /></parent1><parent2><child3 /><child4 />
     </parent2></document> )
     A valid XML string (for example, <document><parent1><child1 /><child2
     attribute2=\"b\" /></parent1><parent2 /></document> )


/* Create variables to store XML objects and strings.
* Use XMLObject to store a valid XML object such as an XML file.
* Use sourceXMLString to store a valid XML string.
* The script sets the content of XMLString to sourceXMLString.
* The script assigns values to the empty variables later on */
var XMLFile = new XML();
XMLFile = XMLFile.setContent( "C:\\test.xml", true );
var sourceXMLString = "<document><parent1><child1 /><child2
attribute2=\"b\" /></parent1><parent2 /></document>";
var XMLString = new XML();
XMLString = XMLString.setContent( sourceXMLString );
var XMLSource;
var TargetNode;
var searchResults;
var parentResults;
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
function printFindResults( target, searchResult )
{
if ( searchResult != null )
{
var elementName = searchResult.getNodeName();
print( "Found element " + elementName + " in: \n" + searchResult +
"\n" );
return searchResult
}
else
{
print( "Cannot find " + target );
return null
}
}
/* Create a function to find the parent node of the target element
*/
function findParent( sourceObject, targetNode )
{
var startingNode = findTargetElement( sourceObject, targetNode )
var parentNode = startingNode.getParentNode();
if ( parentNode != null )
{
return parentNode
}
else
{
return null
}
}
/* Create a function to print the first attribute of the target


element */
function printParentResults( target, searchResult )
{
if ( searchResult != null )
{
var parentName = searchResult.getNodeName();
print( "The parent node element of " + target + " is: " + parentName
);
}
else
{
print( "There is no parent node elements of " + target );
}
}
/* Set variables to search the XMLFile for the TargetNode.
* Run functions findTargetElement, printFindResults, findAttribute,
and
* printAttributeResults on the XMLFile and TargetNode */
print( "Processing XML from XMLFile... \n" );
TargetNode = "child3"
XMLSource = XMLFile
print( "The target element we are looking for is: " + TargetNode );
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( TargetNode, searchResults );
parentResults = findParent( XMLSource, TargetNode );
printParentResults( TargetNode, parentResults );
/* Set variables to search the XMLString for the TargetNode.
* Run functions findTargetElement, printFindResults, findAttribute,
and
* printAttributeResults on the XMLString and TargetNode */
print( "Processing XML from XMLString... \n" );
TargetNode = "child1"
XMLSource = XMLString
print( "The target element we are looking for is: " + TargetNode );
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( TargetNode, searchResults );
parentResults = findParent( XMLSource, TargetNode );
printParentResults( TargetNode, parentResults );


1.2.5.3.6.17. JavaScript method:
XML.getPrefix()

This method returns a string representing the namespace value of the current element or
attribute. It requires you use the other XML get methods to navigate through an XML
document.
Syntax

  XML.getPrefix();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a string representing the namespace value for the current node
(element or attribute) or returns null if the current node has no namespace value.
Example
This example displays the namespace value of the elements and attributes in an XML
document.
This example requires the following sample data:

     A local XML file (for example, a file called "C:\namespace.xml" containing <?xml
     version="1.0" encoding="UTF-8" standalone="yes" ?><document
     xmlns:http="http://schemas.xmlsoap.org/wsdl/http/%22
     xmlns:ns="http://servicemanager.hp.com/PWS%22><http:element1 /><ns:element2
     /></document>


/* Create variables to store XML objects and strings.
* Use XMLObject to store a valid XML object such as an XML file.
* Use sourceXMLString to store a valid XML string.
* The script sets the content of XMLString to sourceXMLString.
* The script assigns values to the empty variables later on */
var XMLFile = new XML();
XMLFile = XMLFile.setContent( "C:\\namespace.xml", true );
var XMLSource;
var TargetNode;
var searchResults;
var prefixResults;
var firstAttribute;
var attributeResults;
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
function printFindResults( searchResult, targetNode )
{
print( "The target element we are looking for is: " + targetNode );
if ( searchResult != null )
{
var elementName = searchResult.getNodeName();
print( "Found element " + elementName + " in: \n" + searchResult +
"\n" );
findPrefix( searchResult, targetNode );
return searchResult
}
else
{
print( "Cannot find " + target );
return null
}
}
/* Create a function to find the parent node element of the target
element */
function findPrefix( sourceObject, targetNode )
{
var prefixFound = sourceObject.getPrefix();
if ( prefixFound.length >= 1 )
{
print( "The namespace prefix of " + targetNode + " is: " +
prefixFound );
return prefixFound
}
else
{
print( "There is no namespace prefix of " + targetNode );
prefixFound = null
return prefixFound


}
}
/* Create a function to find the first attribute of the target
element */
function findFirstAttribute( sourceObject, targetNode )
{
var startingNode = findTargetElement( sourceObject, targetNode )
var firstAttribute = startingNode.getFirstAttribute();
if ( firstAttribute != null )
{
var attributeName = firstAttribute.getNodeName();
print( "The first attribute of " + targetNode + " is: " +
attributeName );
findPrefix( firstAttribute, targetNode );
return firstAttribute
}
else
{
print( "There are no attributes of " + targetNode );
return null
}
}
/* Create a function to find the next attribute of the target
element */
function findNextAttribute( sourceObject, targetNode )
{
var startingNode = findTargetElement( sourceObject, targetNode )
var firstAttribute = startingNode.getFirstAttribute();
if ( firstAttribute != null )
{
var nextAttribute = startingNode.getNextAttribute();
while ( nextAttribute != null )
{
var attributeName = nextAttribute.getNodeName();
print( "The next attribute of " + targetNode + " is: " +
attributeName );
findPrefix( nextAttribute, targetNode );
nextAttribute = nextAttribute.getNextAttribute();
}
print( "There are no more attributes of " + targetNode );
return targetNode
}


else
{
return null
}
}
/* Set variable values for XMLFile and TargetNode. Run functions.
*/
print( "Processing XML from XMLFile... \n" );
TargetNode = "element1"
XMLSource = XMLFile
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( searchResults, TargetNode );
/* Set variable values for XMLFile and TargetNode. Run functions.
*/
print( "Processing XML from XMLFile... \n" );
TargetNode = "document"
XMLSource = XMLFile
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( searchResults, TargetNode );
findFirstAttribute( XMLSource, TargetNode );
findNextAttribute( XMLSource, TargetNode );


1.2.5.3.6.18. JavaScript method:
XML.getQualifiedName()

This method returns a string representing the name of the current element or attribute,
including any namespace value. You must use the other XML get methods to navigate
through an XML document.
Syntax

  XML.getQualifiedName();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a string representing the name of the current element or attribute. It
returns null if the current node has no name.
Example
This example displays the qualified names of the elements and attributes in an XML
document.
This example requires the following sample data:

     A local XML file (for example, C:\namespace.xml which contains <?xml
     version="1.0" encoding="UTF-8" standalone="yes" ?><document
     xmlns:http="http://schemas.xmlsoap.org/wsdl/http/%22
     xmlns:ns="http://servicemanager.hp.com/PWS%22><http:element1 /><ns:element2
     /></document> )


/* Create variables to store XML objects and strings.
* Use XMLObject to store a valid XML object such as an XML file.
* The script assigns values to the empty variables later on */
var XMLFile = new XML();
XMLFile = XMLFile.setContent( "C:\\namespace.xml", true );
var XMLSource;
function nsXMLWalk( elem )
{
print( "Element " + elem.getQualifiedName() );
var node = elem.getFirstAttribute();
while( node != null )
{
var attrName = node.getQualifiedName();
var attrValue = node.getNodeValue();
print( "Attribute " + attrName + " = " + attrValue );
node = elem.getNextAttribute();
}
var nodeValue = elem.getNodeValue();
if ( typeof nodeValue == "string" && nodeValue.length > 0 )
{
print( "Element value of " + elem.getQualifiedName() + " is: " +
nodeValue );
}
var child = elem.getFirstChildElement();
while( child != null )
{
var nodeName = child.getQualifiedName();
var nodeValue = child.getNodeValue();
nsXMLWalk( child );
child = child.getNextSiblingElement();
}
}
function walkXML( elem )
{
print( "Element " + elem.getName() );
var node = elem.getFirstAttribute();
while( node != null )
{
var attrName = node.getName();
var attrValue = node.getNodeValue();
print( "Attribute " + attrName + " = " + attrValue );
node = elem.getNextAttribute();


}
var nodeValue = elem.getNodeValue();
if ( typeof nodeValue == "string" && nodeValue.length > 0 )
{
print( "Element value of " + elem.getName() + " is: " + nodeValue );
}
var child = elem.getFirstChildElement();
while( child != null )
{
var nodeName = child.getName();
var nodeValue = child.getNodeValue();
walkXML( child );
child = child.getNextSiblingElement();
}
}
print( "Now printing the structure of an XML file with qualified
names...\n" );
XMLSource = XMLFile
nsXMLWalk( XMLSource );
print( "Now printing the structure of an XML file without qualified
names...\n" );
XMLSource = XMLFile
walkXML( XMLSource );


1.2.5.3.6.19. JavaScript method:
XML.getText()

This method returns a string representing the value of the current element. You must use
the other XML get methods to navigate through an XML document. This method is a
synonym for getNodeValue();.
Syntax

  XML.getText();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a string representing the value of the current XML element or returns
null if the current node has no value.
Example
This example displays the value of the elements in an XML document.
This example requires the following sample data:

     A local XML file (for example, C:\test02.xml which contains <document>
     <parent1>value1</parent1><parent2></parent2></document> )


/* Create variables to store XML objects and strings.
* Use XMLObject to store a valid XML object such as an XML file.
* Use sourceXMLString to store a valid XML string.
* The script sets the content of XMLString to sourceXMLString.
* The script assigns values to the empty variables later on */
var XMLFile = new XML();
XMLFile = XMLFile.setContent( "C:\\test02.xml", true );
var XMLSource;
var TargetNode;
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
function printFindResults( searchResult, targetNode )
{
print( "The target element we are looking for is: " + targetNode );
if ( searchResult != null )
{
var elementName = searchResult.getNodeName();
print( "Found element " + elementName + " in: \n" + searchResult +
"\n" );
findValue( searchResult, targetNode );
return searchResult
}
else
{
print( "Cannot find " + target );
return null
}
}
/* Create a function to find the parent node element of the target
element */
function findValue( sourceObject, targetNode )
{
var valueFound = sourceObject.getText();
if ( valueFound.length >= 1 )
{
print( "The value of " + targetNode + " is: " + valueFound );
return valueFound
}
else
{
print( "There is no value for " + targetNode );
valueFound = null
return valueFound
}
}
/* Set variable values for XMLFile and TargetNode. Run functions.
*/
print( "Processing XML from XMLFile... \n" );


TargetNode = "parent1"
XMLSource = XMLFile
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( searchResults, TargetNode );
/* Set variable values for XMLFile and TargetNode. Run functions.
*/
print( "Processing XML from XMLFile... \n" );
TargetNode = "parent2"
XMLSource = XMLFile
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( searchResults, TargetNode );


1.2.5.3.6.20. JavaScript method:
XML.getValue()

This method returns a string representing the value of the current element. You must use
the other XML get methods to navigate through an XML document. This method is a
synonym for getNodeValue();.
Syntax

  XML.getValue();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a string representing the value of the current XML element or returns
null if the current node has no value.
Example
This example displays the value of the elements in an XML document.
This example requires the following sample data:

     A local XML file (for example, C:\test02.xml which contains <document>
     <parent1>value1</parent1><parent2></parent2></document> )


/* Create variables to store XML objects and strings.
* Use XMLObject to store a valid XML object such as an XML file.
* Use sourceXMLString to store a valid XML string.
* The script sets the content of XMLString to sourceXMLString.
* The script assigns values to the empty variables later on */
var XMLFile = new XML();
XMLFile = XMLFile.setContent( "C:\\test02.xml", true );
var XMLSource;
var TargetNode;
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
function printFindResults( searchResult, targetNode )
{
print( "The target element we are looking for is: " + targetNode );
if ( searchResult != null )
{
var elementName = searchResult.getNodeName();
print( "Found element " + elementName + " in: \n" + searchResult +
"\n" );
findValue( searchResult, targetNode );
return searchResult
}
else
{
print( "Cannot find " + target );
return null
}
}
/* Create a function to find the parent node element of the target
element */
function findValue( sourceObject, targetNode )
{
var valueFound = sourceObject.getValue();
if ( valueFound.length >= 1 )
{
print( "The value of " + targetNode + " is: " + valueFound );
return valueFound
}
else
{
print( "There is no value for " + targetNode );
valueFound = null
return valueFound
}
}
/* Set variable values for XMLFile and TargetNode. Run functions.
*/
print( "Processing XML from XMLFile... \n" );


TargetNode = "parent1"
XMLSource = XMLFile
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( searchResults, TargetNode );
/* Set variable values for XMLFile and TargetNode. Run functions.
*/
print( "Processing XML from XMLFile... \n" );
TargetNode = "parent2"
XMLSource = XMLFile
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( searchResults, TargetNode );


1.2.5.3.6.21. JavaScript method:
XML.importNode()

This method copies an XML node from one XML document to another. It requires two
existing XML objects with document elements: one is the source XML object and the other
is the target XML document. This method doesn't update either the source or the target
XML object. Instead, you must use the appendNode method to add the imported node into
the target XML document.

Syntax

XML.importNode( name );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
name                                    String
                                                    This argument specifies
                                                    the XML node name you
                                                    want to copy from the
                                                    source XML object. The
                                                    string argument must
                                                    contain characters valid
                                                    for XML (for example, the
                                                    string can't include the
                                                    characters < or > except
                                                    as XML entities such as
                                                    &lt; and &gt;).

Return values
An XML object or null .
The method returns an XML object containing the copied node or returns null if the
method can't import a copy of the node.
Example
This example imports an XML node from one XML object to another.
This example requires the following sample data:


A local XML file (for example, C:\test.xml which contains <document><parent1>
<child1 attribute1="a" /><child2 /></parent1><parent2><child3 /><child4 />
</parent2></document> )
An XML object (for example, an object containing <document> </document> )


var XMLFile = new XML();
var XMLObject = new XML();
var TargetNode;
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
function printFindResults( target, searchResult )
{
if ( searchResult != null )
{
var elementName = searchResult.getNodeName();
print( "Found element " + elementName + " in: \n" + searchResult +
"\n" );
return searchResult
}
else


{
print( "Cannot find " + target );
return null
}
}
function importNewNode( xmlSource, xmlTarget, node )
{
print( "The XML source object is:\n" + xmlSource );
print( "The target element we are looking for is: " + node );
var FoundNode = findTargetElement( xmlSource, node );
printFindResults( node, FoundNode );
print( "The XML target object is:\n" + xmlTarget );
print( "Importing " + FoundNode + " into XML target object..." );
var NewNode = xmlTarget.importNode( FoundNode );
print( "The XML target object remains unchanged: " + xmlTarget );
print( "Appending " + FoundNode + " into XML target object...");
var appendedNode = xmlTarget.appendNode( NewNode );
print( "The new XML target object is: " + xmlTarget );
}
XMLFile = XMLFile.setContent( "C:\\test.xml", true );
XMLObject = XMLObject.setContent( "<document> </document>" );
TargetNode = "parent1";
importNewNode( XMLFile, XMLObject, TargetNode );


1.2.5.3.6.22. JavaScript method:
XML.isDocumentElement()

This method returns true if the current element is the Document Object Model (DOM)
document element (the "root" node of the XML document). You must use the other XML
get methods to navigate through an XML document.
Syntax

  XML.isDocumentElement();

Arguments
There are no arguments for this method.
Return values
A Boolean value: true or false .
The method returns true if the current XML element is the DOM document element or
false if the current XML element is not the DOM document.
Example
This example checks to see if the selected element is the DOM document element.
This example requires the following sample data:

     A local XML file (for example, C:\test02.xml which contains <document>
     <parent1>value1</parent1><parent2></parent2></document> )


/* Create variables to store XML objects and strings.
* Use XMLObject to store a valid XML object such as an XML file.
* Use sourceXMLString to store a valid XML string.
* The script sets the content of XMLString to sourceXMLString.
* The script assigns values to the empty variables later on */
var XMLFile = new XML();
XMLFile = XMLFile.setContent( "C:\\test02.xml", true );
var XMLSource;
var TargetNode;
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
function printFindResults( searchResult, targetNode )
{
print( "The target element we are looking for is: " + targetNode );
if ( searchResult != null )
{
var elementName = searchResult.getNodeName();
print( "Found element " + elementName + " in: \n" + searchResult +
"\n" );
testDocElem( searchResult);
return searchResult
}
else
{
print( "Cannot find " + target );
return null
}
}
/* Create a function to find the parent node element of the target
element */
function testDocElem( sourceObject )
{
var docElement = sourceObject.isDocumentElement();
if ( docElement == true )
{
var nodeName = sourceObject.getName();
print( "Success. The element " + nodeName + " is the DOM document
element." );
return valueFound
}
else
{
var nodeName = sourceObject.getName();
print( "Fail. The element " + nodeName + " is not the DOM document
element." );
valueFound = null
return valueFound
}


}
/* Set variable values for XMLFile and TargetNode. Run functions.
*/
print( "Processing XML from XMLFile... \n" );
TargetNode = "parent1"
XMLSource = XMLFile
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( searchResults, TargetNode );
/* Set variable values for XMLFile and TargetNode. Run functions.
*/
print( "Processing XML from XMLFile... \n" );
TargetNode = "document"
XMLSource = XMLFile
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( searchResults, TargetNode );


1.2.5.3.6.23. JavaScript method:
XML.removeAttribute()

This method removes an XML attribute from the current element. It requires that you use
other XML get methods to navigate through an XML document.

Syntax

XML.removeAttribute( AttributeName );

Arguments
The following argument is valid for this method.

Argument                                Data type  Description
AttributeName                           String
                                                   This argument specifies
                                                   the text string you want
                                                   the script to use as the
                                                   XML attribute name. The
                                                   string argument must
                                                   contain characters valid
                                                   for an XML element( for
                                                   example, the string can't
                                                   include the characters< or
                                                   >).

Return values
An XML object or null.
If successful, the method returns the updated XML element. Otherwise, it returns null.
````
