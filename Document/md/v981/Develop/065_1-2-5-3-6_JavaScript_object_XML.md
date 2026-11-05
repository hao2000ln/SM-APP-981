---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.5.3.6 .. 1.2.5.3.6.7
printed_pages: 1730-1758
---

# 1.2.5.3.6 JavaScript object: XML

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.5.3.6. JavaScript object: XML

The following JavaScript object is unique to Service Manager.
The XML() constructor creates an empty XML object where you can store and manipulate
XML documents.
This object's methods don't use the Service Manager-defined global return codes.
Constructor

  new XML();

Arguments
None
Properties
None
Methods
The following methods are valid for this object:

 Defined method                                                                                  Service Manager 9.81
 setContent
 getParentNode                          Description
 getFirstChildElement
 getNextSiblingElement                  Creates an XML document from a string
                                        or file.
 getFirstAttribute
 getNextAttribute                       Returns an XML object representing the
 getNodeName                            parent node of the current node.
 getName
 getQualifiedName                       Returns an XML object representing the
 getPrefix                              first child node of the current node.
 getNodeValue
 getValue                               Returns an XML object representing the
                                        next node at the same level in the
This PDF was generated on May 23, 2026  Document Object Model (DOM) tree as
                                        the current node.

                                        Returns an XML object representing the
                                        first attribute of the current node.

                                        Returns an XML object representing the
                                        next attribute of the current node.

                                        Returns a string representing the name of
                                        the current element or attribute.

                                        Returns a string representing the name of
                                        the current element or attribute.

                                        Returns a string representing the name of
                                        the current element or attribute including
                                        any namespace value.

                                        Returns a string representing the
                                        namespace value of the current element
                                        or attribute.

                                        Returns a string representing the value of
                                        the current element.

                                        Returns a string representing the value of
                                        the current element.

                                                                                                                        Page 127 of 250
 Defined method                                                                                  Service Manager 9.81
 setNodeValue
 setValue                               Description
 getNodeType
                                        Adds or updates the value of the current
 isDocumentElement                      element.
 getDocumentElement
                                        Adds or updates the value of the current
 createNode                             element.
 appendNode
 importNode                             Evaluates an XML object and returns an
 addAttribute                           integer representing the XML DOM type
 getAttributeNode                       of the current element or attribute.
 getAttributeValue
 setAttributeValue                      Returns true if the current element is the
 addElement                             DOM document element.
 setText
                                        Creates an XML object containing the
This PDF was generated on May 23, 2026  document element and all child elements
                                        from an XML object or XML string.

                                        Creates an XML node from an XML
                                        object.

                                        Inserts an XML node into an XML object.

                                        Copies an XML node from one XML
                                        document to another.

                                        Inserts an XML attribute and attribute
                                        value into the current element.

                                        Returns an XML object containing an
                                        attribute node.

                                        Returns the value of the target attribute.

                                        Adds or updates an attribute value.

                                        Inserts an XML element as a child of the
                                        current element.

                                        Adds or updates the value of the current
                                        element.

                                                                                                                        Page 128 of 250

Defined method                          Description
getText
toXMLString                             Returns a string representing the value of
removeAttribute                         the current element.

                                        Converts an XML object into a valid XML
                                        string.

                                        emoves an XML attribute from the
                                        current element.

Example

This example does the following:

     Creates an XML object
     Sets the content of the XML object to a local XML file

This example requires the following sample data:

     A local XML file (for example, C:\test.xml which contains <document><parent1>
     <child1 attribute1="a" /><child2 /></parent1><parent2><child3 /><child4 />
     </parent2></document> )

/* Instantiate an empty XML object */
var xmlObj = new XML();
/* Instantiate a variable containing the path to an XML file */
var xmlFile = "C:\\myxmldoc.xml";
/* Use setContent to make the XML object read and parse the XML file
* If the setContent method fails, print an error message */
if ( ! xmlObj.setContent( xmlFile, true ) )
{

   print( "setContent failed. Unable to parse xml: " + xmlFile );
}


1.2.5.3.6.1. JavaScript method:
XML.addAttribute()

This method inserts an XML attribute and attribute value into the current element. It
requires you use the other XML get methods to navigate through an XML document.

Syntax

XML.addAttribute( AttributeName, AttributeValue );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
AttributeName                           String
                                                    This argument specifies
AttributeValue                          String      the text string you want
                                                    the script to use as the
                                                    XML attribute name. The
                                                    string argument must
                                                    contain characters valid
                                                    for an XML element (for
                                                    example, the string can't
                                                    include the characters <
                                                    or >).

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
An XML object or null .


If successful, the method returns the updated XML element. Otherwise, it returns null .
Example
This example adds a new attribute and attribute value to any element you select from an
XML document.
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
var searchResults;
var printResults;
var AttributeName;
var AttributeValue;
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
function createNewAttribute( searchResult, targetNode, attrName,
attrValue )
{
print( "The target element we are looking for is: " + targetNode );
if ( searchResult != null )
{
var elementName = searchResult.getNodeName();
print( "Found element " + elementName + " in: \n" + searchResult +
"\n" );
print( "Adding new attribute " + attrName + " to element " +
elementName );
searchResult.addAttribute( attrName, attrValue );
print( "The new object is:\n" + searchResult );
return searchResult
}
else
{
print( "Cannot find " + target );
return null
}
}
/* Set variable values for XMLFile and TargetNode. Run functions.
*/
print( "Processing XML from XMLFile... \n" );
TargetNode = "parent1"
XMLSource = XMLFile
searchResults = findTargetElement( XMLSource, TargetNode );
AttributeName = "id";
AttributeValue = "test";
createNewAttribute( searchResults, TargetNode, AttributeName,
AttributeValue );


1.2.5.3.6.2. JavaScript method:
XML.addElement()

This method inserts an XML element as a child of the current element. You must use the
other XML get methods to navigate through an XML document.

Syntax

XML.addElement( String );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
String                                  String
                                                    This argument specifies
                                                    the text string you want
                                                    the script to use as the
                                                    XML element name. The
                                                    string argument must
                                                    contain characters valid
                                                    for an XML element (for
                                                    example, the string can't
                                                    include the characters <
                                                    or >).

Return values
An XML object or null .
The method returns an XML object containing the new element or returns null if the
method can't add the element.

Example

This example adds a child element to any element you select in an XML document.

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
var searchResults;
var printResults;
var NewNodeName;
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
function createNewNode( searchResult, targetNode, nodeName )
{
print( "The target element we are looking for is: " + targetNode );
if ( searchResult != null )
{
var elementName = searchResult.getNodeName();
print( "Found element " + elementName + " in: \n" + searchResult +
"\n" );
print( "Adding new node " + nodeName + " to element " + elementName
);
var newNode = searchResult.addElement( nodeName );
print( "The new object is:\n" + searchResult );
return searchResult
}
else
{
print( "Cannot find " + target );
return null
}
}
/* Set variable values for XMLFile and TargetNode. Run functions.
*/
print( "Processing XML from XMLFile... \n" );
TargetNode = "parent1"
XMLSource = XMLFile
searchResults = findTargetElement( XMLSource, TargetNode );
NewNodeName = "child8";
createNewNode( searchResults, TargetNode, NewNodeName );


1.2.5.3.6.3. JavaScript method:
XML.appendNode()

This method inserts an XML node into an XML object. There must be an existing XML
object with a document element. This method doesn't update the existing XML object.

Syntax

XML.appendNode( name );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
name                                    String
                                                    This argument specifies
                                                    the XML node name you
                                                    want to append to the
                                                    target XML object. The
                                                    string argument must
                                                    contain characters valid
                                                    for XML (for example, the
                                                    string can't include the
                                                    characters < or > except
                                                    as XML entities such as
                                                    &lt; and &gt;).

Return values
An XML object or null .
The method returns an XML object containing the new node or returns null if the method
can't append the node to the current target node.
Example
This example appends an XML node to an XML source object.
This example requires the following sample data:

     An XML object (for example, an object containing "<document> </document>")


var XMLObject = new XML;
var NewNodeName;
var NewNodeValue;
var NewNodeType;
var TargetNode;
XMLObject = XMLObject.setContent( "<document> </document>" );
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
function appendNewNode( type, name, value, xmlSource, target )
{
print( "The XML source object is: " + xmlSource);
print( "Creating node of type: " + type + " named: " + name + " with
value: " + value );
var NewNode = xmlSource.createNode( type, name, value );
print( "Appending " + NewNode.toXMLString() + " to: " + target );
var FoundNode = findTargetElement( xmlSource, target );
var appendedNode = FoundNode.appendNode( NewNode );


print( "The new XML object is: " + xmlSource );
}
NewNodeType = 1;
NewNodeName = "node";
NewNodeValue = "test";
TargetNode = "document";
appendNewNode( NewNodeType, NewNodeName, NewNodeValue, XMLObject,
TargetNode );


1.2.5.3.6.4. JavaScript method:
XML.createNode()

This method creates an XML node from an XML object. It requires an existing XML object
with a document element, but it doesn't update the existing XML object. The new method
requires a rootname.
Syntax

  XML.createNode( type, name, value );

Arguments
The following arguments are valid for this method:


Argument                                Data type  Description
type                                    Integer
                                                   This argument specifies
name                                    String     the XML DOM node type
                                                   for the node you want the
value                                   String     script to create. This
                                                   method only accepts XML
                                                   DOM types 1, 2, and 3.
                                                   See the W3C Web site for
                                                   a complete listing of XML
                                                   DOM node-types by
                                                   integer.

                                                   This argument specifies
                                                   the text string you want
                                                   the script to add as the
                                                   XML node name. The
                                                   string argument must
                                                   contain characters valid
                                                   for XML (for example, the
                                                   string can't include the
                                                   characters < or > except
                                                   as XML entities such as
                                                   &lt; and &gt;).

                                                   This argument specifies
                                                   the text string you want
                                                   the script to add as the
                                                   XML node value. The
                                                   string argument must
                                                   contain characters valid
                                                   for XML (for example, the
                                                   string can't include the
                                                   characters < or > except
                                                   as XML entities such as
                                                   &lt; and &gt;).

Return values

An XML object or null .

The method returns an XML object containing the new node or returns null if the method
can't create the node.


Example
This example creates an XML node from an XML source object.
This example requires the following sample data:

     An XML object (for example, an object containing "<document> </document>")

  var XMLObject = new XML("document");
  var NewNodeName;
  var NewNodeValue;
  var NewNodeType;
  XMLObject = XMLObject.setContent( "<document> </document>" );
  function createNewNode( type, name, value, xmlSource )
  {
  print( "The XML source object is: " + xmlSource);
  print( "Creating node of type: " + type + " named: " + name + " with
  value: " + value );
  var NewNode = xmlSource.createNode( type, name, value );
  print( "The XML source object remains unchanged: " + XMLObject );
  print( "The new node converted to an XML string is: " +
  NewNode.toXMLString() );
  print( "Applying the getName method to the new node produces: " +
  NewNode.getName() );
  print( "Applying the getValue method on the new node produces: " +
  NewNode.getValue() );
  }
  NewNodeType = 1;
  NewNodeName = "node";
  NewNodeValue = "test";
  createNewNode( NewNodeType, NewNodeName, NewNodeValue, XMLObject );
  NewNodeType = 2;
  NewNodeName = "id";
  NewNodeValue = "test";
  createNewNode( NewNodeType, NewNodeName, NewNodeValue, XMLObject );
  NewNodeType = 3;
  NewNodeName = null;
  NewNodeValue = "Text node";
  createNewNode( NewNodeType, NewNodeName, NewNodeValue, XMLObject );


1.2.5.3.6.5. JavaScript method:
XML.getAttributeNode()

This method returns an XML object containing the target attribute, or returns null if the
method can't find the target attribute in the current element. You must use the other XML
get methods to navigate through an XML document.

Syntax

XML.getAttributeNode( Attribute );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
Attribute                               String
                                                    This argument specifies
                                                    the XML attribute you
                                                    want the script to return.

Return values

An XML object or null .

The method returns an XML object containing the target attribute, or returns null if the
method can't find the target attribute in the current element.

Example

This example searches for a particular attribute of any given element in an XML
document.

This example requires the following sample data:

     A local XML file (for example, C:\test.xml which containings <document><parent1>
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
function printFindResults( target, searchResult, attribute )
{
print( "The target element we are looking for is: " + target );
if ( searchResult != null )
{
var elementName = searchResult.getNodeName();
print( "Found element " + elementName + " in: \n" + searchResult +
"\n" );
var attributeFound = findAttributeNode( searchResult, attribute );
return attributeFound
}
else
{
print( "Cannot find " + target );
return null
}
}
/* Create a function to find the attribute node of the target
element */
function findAttributeNode( sourceObject, attribute )
{
print( "Looking for attribute node " + attribute );
var attributeNode = sourceObject.getAttributeNode( attribute );
if ( attributeNode != null )
{
print( "Success. Found attribute " + attributeNode );
return attributeNode
}
else
{
print( "Fail. Did not find attribute " + attribute );
return null
}
}
/* Set variable values for XMLFile and TargetNode. Run functions */
print( "Processing XML from XMLFile... \n" );
TargetNode = "child1";


XMLSource = XMLFile;
TargetAttribute = "attribute1";
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( TargetNode, searchResults, TargetAttribute );


1.2.5.3.6.6. JavaScript method:
XML.getAttributeValue()

This method returns the value of the target attribute. You must use the other XML get
methods to navigate through an XML document.

Syntax

XML.getAttributeValue( Attribute );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
Attribute                               String
                                                    This argument specifies
                                                    the XML attribute whose
                                                    value you want the script
                                                    to return.

Return values

A string or null .

The method returns the string value of the target attribute or returns null if the method
can't find an attribute value.

Example

This example searches for the attribute value of any given element in an XML document.

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
function printFindResults( target, searchResult, attribute )
{
print( "The target element we are looking for is: " + target );
if ( searchResult != null )
{
var elementName = searchResult.getNodeName();
print( "Found element " + elementName + " in: \n" + searchResult +
"\n" );
var attributeFound = findAttributeValue( searchResult, attribute );
return attributeFound
}
else
{
print( "Cannot find " + target );
return null
}
}
/* Create a function to find the attribute node of the target
element */
function findAttributeValue( sourceObject, attribute )
{
print( "Looking for attribute value of " + attribute );
var attributeValue = sourceObject.getAttributeValue( attribute );
if ( attributeValue != null )
{
print( "Success. The value of " + attribute + " is " +
attributeValue );
return attributeValue
}
else
{
print( "Fail. Did not find attribute " + attribute );
return null
}
}
/* Set variable values for XMLFile and TargetNode. Run functions */
print( "Processing XML from XMLFile... \n" );


TargetNode = "child1";
XMLSource = XMLFile;
TargetAttribute = "attribute1";
searchResults = findTargetElement( XMLSource, TargetNode );
printFindResults( TargetNode, searchResults, TargetAttribute );


1.2.5.3.6.7. JavaScript method:
XML.getDocumentElement()

This method searches an XML object for the DOM document element (or "root" node). It
creates an XML object containing the document element and all child elements from an
XML object or XML string.

            Note

           You can't use this method on objects that you have converted using the
           toXMLString method.

Syntax

  XML.getDocumentElement();

Arguments
There are no arguments for this method.
Return values
An XML object or null.
If successful, this method returns an XML object containing the document element and all
of its child elements. This method returns null if applied to an empty or invalid XML object.
Example
This example displays the XML document element from four different input sources.
This example requires the following sample data:

     A valid XML object (for example, the list of currently logged on users stored in
     system.users)
     A valid XML string (for example, <document><parent1><child1 attribute1=\"1\" />
     </parent1><parent2 /></document> )
     A noncompliant XML string (for example, <document1><parent1 /></document1>
     <document2><parent2 /></document2> )
     An empty XML object


/* Create variables to store XML objects and strings.
* Use goodXML to store a valid XML string.
* Use badXML to store any erroneous XML string, in this case a
second document element.
* Use xmlObject to store a valid XML object such as the
system.users list
* The script sets the content of xmlString to goodXML.
* The script sets the content of xmlBad to badXML.
* The script sets the content of xmlEmpty to an XML object. */
var goodXML = "<document><parent1><child1 attribute1=\"1\" />
</parent1><parent2 /></document>"
var badXML = "<document1><parent1 /></document1><document2><parent2
/></document2>"
var xmlObject = system.users
var xmlString = new XML();
xmlString = xmlString.setContent( goodXML );
var xmlBad = new XML();
xmlBad = xmlBad.setContent( badXML );
print( "The value of xmlBad is:\n" + xmlBad );
var xmlEmpty = new XML();
/* Create a function to execute the getDocumentElement method on the
document argument. */
function getDocElem( document )
{
var DocElem = document.getDocumentElement();
if ( DocElem != null )
{
var DocElemName = DocElem.getNodeName();
print( "Success. Found the document element " + DocElemName + " in
the following object: \n" + document );
return DocElem
}
else
{
print( "Error. Did not find document element in the following
object: \n" + document );
return null
}
}
/* Run the getDocElem and getDocElemName functions on four input
sources.
* Print the objects returned by each function. */


print( "Now searching for a document element in a valid XML
object...\n" );
getDocElem( xmlObject );
print( "Now searching for a document element in a valid XML
string...\n" );
getDocElem( xmlString );
print( "Now searching for a document element in a non-compliant XML
string...\n" );
getDocElem( xmlBad );
print( "Now searching for a document element in an empty XML
object...\n" );
getDocElem( xmlEmpty );
````
