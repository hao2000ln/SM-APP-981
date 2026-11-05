---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.5.3.6.8 .. 1.2.5.3.6.15
printed_pages: 1758-1787
---

# 1.2.5.3.6.8 JavaScript method: XML.getFirstAttribute()

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.5.3.6.8. JavaScript method:
XML.getFirstAttribute()

This method returns an XML object representing the first attribute of the current node.
Syntax

XML.getFirstAttribute();
getFirstAttribute(Element)

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
Element                                 String
                                                    This argument contains
                                                    the name of the element
                                                    you want the method to
                                                    use as the starting
                                                    position when searching
                                                    for the first attribute.

Return values

An XML object or null .

The method returns an object representing the first attribute of the current node or
returns null if the XML object has no attributes.

Example

This example displays the first attribute of any element you select. The example allows
you to select an element from two different input sources.

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
/* Create a function to find the first attribute of the target
element */
function findFirstAttribute( sourceObject, targetNode )
{
var startingNode = findTargetElement( sourceObject, targetNode )
var attribute = startingNode.getFirstAttribute();
if ( attribute != null )
{
return attribute
}
else
{
return null
}
}
/* Create a function to print the first attribute of the target


element */
function printAttributeResults( target, searchResult )
{
if ( searchResult != null )
{
var attributeName = searchResult.getNodeName();
print( "The first attribute of " + target + " is: " + attributeName
);
}
else
{
print( "There are no attributes of " + target );
}
}
/* Set variable values for XMLFile and TargetNode. Run functions */
print( "Processing XML from XMLFile... \n" );
TargetNode = "child1"
XMLSource = XMLFile
print( "The target element we are looking for is: " + TargetNode );
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( TargetNode, searchResults );
attributeResults = findFirstAttribute( XMLSource, TargetNode );
printAttributeResults( TargetNode, attributeResults );
/* Set variable values for XMLFile and TargetNode. Run functions */
print( "Processing XML from XMLString... \n" );
TargetNode = "child2"
XMLSource = XMLString
print( "The target element we are looking for is: " + TargetNode );
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( TargetNode, searchResults );
attributeResults = findFirstAttribute( XMLSource, TargetNode );
printAttributeResults( TargetNode, attributeResults );


1.2.5.3.6.9. JavaScript method:
XML.getFirstChildElement()

This method returns an XML object representing the first child node of the current node.
Syntax

XML.getFirstChildElement();
getFirstChildElement(Element)

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
Element                                 String
                                                    This argument contains
                                                    the name of the element
                                                    you want the method to
                                                    use as the starting
                                                    position when searching
                                                    for the first child element.

Return values

An XML object or null .

The method returns an object representing the first child node of the current node or
returns null if the XML object has no child node.

Example

This example displays the first child element of any element you select. The example
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
var childResults;
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
/* Create a function to find the first child element of the target
element */
function findFirstChild( sourceObject, targetNode )
{
var startingNode = findTargetElement( sourceObject, targetNode )
var firstChild = startingNode.getFirstChildElement();
if ( firstChild != null )
{
return firstChild
}
else
{
return null
}
}
/* Create a function to print the first child element of the target


element */
function printChildResults( target, searchResult )
{
if ( searchResult != null )
{
var childName = searchResult.getNodeName();
print( "The first child element of " + target + " is: " + childName
);
}
else
{
print( "There are no child elements of " + target );
}
}
/* Set variable values for XMLFile and TargetNode. Run functions */
print( "Processing XML from XMLFile... \n" );
TargetNode = "parent1"
XMLSource = XMLFile
print( "The target element we are looking for is: " + TargetNode );
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( TargetNode, searchResults );
childResults = findFirstChild( XMLSource, TargetNode );
printChildResults( TargetNode, childResults );
/* Set variable values for XMLFile and TargetNode. Run functions */
print( "Processing XML from XMLString... \n" );
TargetNode = "parent2"
XMLSource = XMLString
print( "The target element we are looking for is: " + TargetNode );
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( TargetNode, searchResults );
childResults = findFirstChild( XMLSource, TargetNode );
printChildResults( TargetNode, childResults );


1.2.5.3.6.10. JavaScript method:
XML.getName()

This method returns a string representing the name of the current element or attribute.
You must use the other XML get methods to navigate through an XML document. This
method is a synonym for getNodeName();.
Syntax

  XML.getName();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a string representing the name of the current element or attribute. It
returns null if the current node has no name.
Example
This example displays the names of the elements and attributes in an XML document.
This example requires the following sample data:

     A local XML file (for example, C:\test.xml which contains <document><parent1>
     <child1 attribute1="a" /><child2 /></parent1><parent2><child3 /><child4 />
     </parent2></document> )
     A valid XML string (for example, <document><parent1><child1>0123</child1>
     </parent1></document> )


/* Create variables to store XML objects and strings.
* Use XMLObject to store a valid XML object such as an XML file.
* Use sourceXMLString to store a valid XML string.
* The script sets the content of XMLString to sourceXMLString.
* The script assigns values to the empty variables later on */
var XMLFile = new XML();
XMLFile = XMLFile.setContent( "C:\\test.xml", true );
var sourceXMLString = "<document><parent1><child1>0123</child1>
</parent1></document>";
var XMLString = new XML();
XMLString = XMLString.setContent( sourceXMLString );
var XMLSource;
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
print( "Now printing the structure of an XML file...\n" );
XMLSource = XMLFile
walkXML( XMLSource );
print( "Now printing the structure of an XML string...\n" );


XMLSource = XMLString
walkXML( XMLSource );


1.2.5.3.6.11. JavaScript method:
XML.getNextAttribute()

This method returns an XML object representing the next attribute of the current node.
Syntax

XML.getNextAttribute();
getNextAttribute(Element)

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
Element                                 String
                                                    This argument contains
                                                    the name of the element
                                                    you want the method to
                                                    use as the starting
                                                    position when searching
                                                    for the first attribute.

Return values

An XML object or null .

The method returns an object representing the first attribute of the current node or
returns null if the XML object has no attributes.

Example

This example displays the first attribute of any element you select. The example allows
you to select an element from two different input sources.

This example requires the following sample data:

     A local XML file (for example, C:\test.xml which contains <document><parent1>
     <child1 attribute1="a" /><child2 /></parent1><parent2><child3 /><child4 />
     </parent2></document> )
     A valid XML string (for example, <document><parent1><child1 /><child2
     attribute2=\"b\" attribute3=\"c\" /></parent1><parent2 /></document> )


/* Create variables to store XML objects and strings.
* Use XMLObject to store a valid XML object such as an XML file.
* Use sourceXMLString to store a valid XML string.
* The script sets the content of XMLString to sourceXMLString.
* The script assigns values to the empty variables later on */
var XMLFile = new XML();
XMLFile = XMLFile.setContent( "C:\\test.xml", true );
var sourceXMLString = "<document><parent1><child1 /><child2
attribute2=\"b\" attribute3=\"c\" /></parent1><parent2 />
</document>";
var XMLString = new XML();
XMLString = XMLString.setContent( sourceXMLString );
var XMLSource;
var TargetNode;
var searchResults;
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
/* Create a function to find the first attribute of the target
element */
function findFirstAttribute( sourceObject, targetNode )
{
var startingNode = findTargetElement( sourceObject, targetNode )
var firstAttribute = startingNode.getFirstAttribute();
if ( firstAttribute != null )
{
return firstAttribute
}
else
{
return null
}
}


/* Create a function to print the first attribute of the target
element */
function printAttributeResults( target, searchResult )
{
if ( searchResult != null )
{
var attributeName = searchResult.getNodeName();
print( "The first attribute of " + target + " is: " + attributeName
);
return searchResult
}
else
{
print( "There are no attributes of " + target );
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
/* Set variable values for XMLFile and TargetNode. Run functions */


print( "Processing XML from XMLFile... \n" );
TargetNode = "child1"
XMLSource = XMLFile
print( "The target element we are looking for is: " + TargetNode );
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( TargetNode, searchResults );
attributeResults = findFirstAttribute( XMLSource, TargetNode );
printAttributeResults( TargetNode, attributeResults );
findNextAttribute( XMLSource, TargetNode );
/* Set variable values for XMLFile and TargetNode. Run functions */
print( "Processing XML from XMLString... \n" );
TargetNode = "child2"
XMLSource = XMLString
print( "The target element we are looking for is: " + TargetNode );
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( TargetNode, searchResults );
attributeResults = findFirstAttribute( XMLSource, TargetNode );
printAttributeResults( TargetNode, attributeResults );
findNextAttribute( XMLSource, TargetNode );


1.2.5.3.6.12. JavaScript method:
XML.getNextSiblingElement()

This method returns an XML object representing the next node at the same level in the
Document Object Model (DOM) tree as the current node.

Syntax

XML.getNextSiblingElement();
getNextSiblingElement(Element)

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
Element                                 String
                                                    This argument contains
                                                    the name of the element
                                                    you want the method to
                                                    use as the starting
                                                    position when searching
                                                    for the next sibling
                                                    element.

Return values

An XML object or null .

The method returns an object representing the next node at the same level in the DOM
tree as the current node or returns null if the XML object has no sibling node.

Example

This example displays the next sibling element of any element you select. The example
allows you to select an element from two different input sources.

This example requires the following sample data:

     A local XML file (for example, C:\test.xml contains <document><parent1><child1
     attribute1="a" /><child2 /></parent1><parent2><child3 /><child4 /></parent2>
     </document> )
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
var siblingResults;
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
/* Create a function to find the next sibling element of the target
element */
function findNextSibling( sourceObject, targetNode )
{
var startingNode = findTargetElement( sourceObject, targetNode )
var nextSibling = startingNode.getNextSiblingElement();
if ( nextSibling != null )
{
return nextSibling
}
else
{
return null
}
}
/* Create a function to print the first attribute of the target


element */
function printSiblingResults( target, searchResult )
{
if ( searchResult != null )
{
var childName = searchResult.getNodeName();
print( "The next sibling element of " + target + " is: " + childName
);
}
else
{
print( "There are no sibling elements of " + target );
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
siblingResults = findNextSibling( XMLSource, TargetNode );
printSiblingResults( TargetNode, siblingResults );
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
siblingResults = findNextSibling( XMLSource, TargetNode );
printSiblingResults( TargetNode, siblingResults );


1.2.5.3.6.13. JavaScript method:
XML.getNodeName()

This method returns a string representing the name of the current element or attribute.
You must use the other XML get methods to navigate through an XML document.
Syntax

  XML.getNodeName();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns a string representing the name of the current element or attribute or
returns null if the current node has no name.
Example
This example displays the names of the elements and attributes in an XML document.
This example requires the following sample data:

     A local XML file (for example, C:\test.xml which contains <document><parent1>
     <child1 attribute1="a" /><child2 /></parent1><parent2><child3 /><child4 />
     </parent2></document> )
     A valid XML string (for example, <document><parent1><child1>0123</child1>
     </parent1></document> )


/* Create variables to store XML objects and strings.
* Use XMLObject to store a valid XML object such as an XML file.
* Use sourceXMLString to store a valid XML string.
* The script sets the content of XMLString to sourceXMLString.
* The script assigns values to the empty variables later on */
var XMLFile = new XML();
XMLFile = XMLFile.setContent( "C:\\test.xml", true );
var sourceXMLString = "<document><parent1><child1>0123</child1>
</parent1></document>";
var XMLString = new XML();
XMLString = XMLString.setContent( sourceXMLString );
var XMLSource;
function walkXML( elem )
{
print( "Element " + elem.getNodeName() );
var node = elem.getFirstAttribute();
while( node != null )
{
var attrName = node.getNodeName();
var attrValue = node.getNodeValue();
print( "Attribute " + attrName + " = " + attrValue );
node = elem.getNextAttribute();
}
var nodeValue = elem.getNodeValue();
if ( typeof nodeValue == "string" && nodeValue.length > 0 )
{
print( "Element value of " + elem.getNodeName() + " is: " +
nodeValue );
}
var child = elem.getFirstChildElement();
while( child != null )
{
var nodeName = child.getNodeName();
var nodeValue = child.getNodeValue();
walkXML( child );
child = child.getNextSiblingElement();
}
}
print( "Now printing the structure of an XML file...\n" );
XMLSource = XMLFile
walkXML( XMLSource );
print( "Now printing the structure of an XML string...\n" );


XMLSource = XMLString
walkXML( XMLSource );


1.2.5.3.6.14. JavaScript method:
XML.getNodeType()

This method evaluates an XML object and returns an integer representing the XML DOM
type of the current element or attribute. You must use the other XML get methods to
navigate through an XML document.
Syntax

  XML.getNodeType();

Arguments
There are no arguments for this method.
Return values
A string or null .
The method returns an integer representing the XML DOM type of the current element or
attribute or returns null if the method can't determine the XML DOM type. See the W3C
Web site for a complete listing of XML DOM node types by integer. It returns a TypeError if
applied to anything other than an XML object. This limits this method to elements and
attributes since the Service Manager XML object can't represent element values as an
XML object.
Example
This example displays the XML DOM types of the elements and attributes in an XML
document.
This example requires the following sample data:

     A local XML file (for example, C:\test.xml which contains <document>
     <parent1>value1<child1 attribute1="a" /><child2 /></parent1><parent2><child3 />
     <child4 /></parent2></document> )


function visitElement( elem )
{
print( "Element " + elem.getQualifiedName() + " is of type " +
elem.getNodeType() );
/* Print attributes for this element */
var node = elem.getFirstAttribute();
while( node != null )
{
var attrName = node.getQualifiedName();
var attrValue = node.getNodeValue();
print( "Attribute " + attrName + "=" + attrValue + " and is of type
" + node.getNodeType() );
node = elem.getNextAttribute();
}
/* Print possible element value */
var nodeValue = elem.getNodeValue();
if ( typeof nodeValue == "string" && nodeValue.length > 0 )
{
print( "Element value is " + nodeValue + " and is of type " +
elem.getNodeType() );
}
/* Now print child elements */
var child = elem.getFirstChildElement();
while( child != null )
{
var nodeName = child.getNodeName();
var nodeValue = child.getNodeValue();
visitElement( child );
child = child.getNextSiblingElement();
}
}
var xmlObj = new XML();
xmlObj.setContent( "c:\\test.xml", true );
visitElement( xmlObj.getDocumentElement() );


1.2.5.3.6.15. JavaScript method:
XML.getNodeValue()

This method returns a string representing the value of the current element. It requires you
use the other XML get methods to navigate through an XML document.
Syntax

  XML.getNodeValue();

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
var valueFound = sourceObject.getNodeValue();
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
````
