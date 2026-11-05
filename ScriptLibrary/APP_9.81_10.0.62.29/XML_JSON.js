// Although we are using Goessner's json2xml (slightly modified to conform to BadgerFish),
// for xml2json we implemented our own code to traverse the XML doc and construct the JS object hierarchy
// because our XML api is significantly different than the browser XML DOM api.

function xml2json(doc) {
    var obj = {};

    // process the current element
    var xmlNode = doc.getDocumentElement();

    obj = processElement(xmlNode, obj);

    var jsonString = toJson(obj, xmlNode.getQualifiedName(), '\t');

    return jsonString;
}

function toJson(o, name, ind) {
    return JSON.stringify(o);
}

function processElement(xmlNode, parentObj) {
    var elemName = xmlNode.getQualifiedName();

    var elemObj;

    // Before we create the new object within the parent object,
    // check to see if one with the same name already exists.
    // i.e. is this a second or subsequent occurrence of a repeating element?

    // If so, we have to make it an array, because JS associative arrays cannot have duplicate entries

    if (parentObj[elemName] == undefined) {
        elemObj = parentObj[elemName] = {};
    } else // already exists
    {
        // convert the existing value to an Array
        // unless it is an array already

        var objArray;

        if (parentObj[elemName].constructor != Array) {
            objArray = new Array(parentObj[elemName]);

            parentObj[elemName] = objArray;
        } else {
            objArray = parentObj[elemName];
        }


        // Now push an empty object onto the Array
        // We will populate elemObj below

        objArray.push({});

        // The new empty object is at the end of the Array

        elemObj = objArray[objArray.length - 1];
    }

    // See if this element has any child elements
    // If no, we capture the element text value
    // If yes, we ignore any node value, since we don't care about or support whitespace / mixed content / CDATA

    if (xmlNode.getFirstChildElement() == null) {
        elemObj["$"] = xmlNode.getNodeValue();
    }

    // process attributes
    var attr = xmlNode.getFirstAttribute();

    while (attr != null) {
        elemObj = processAttribute(attr, elemObj);

        attr = xmlNode.getNextAttribute();
    }

    // process children

    var child = xmlNode.getFirstChildElement();

    while (child != null) {
        processElement(child, elemObj);

        child = child.getNextSiblingElement();
    }

    return elemObj;
}

function processAttribute(attrNode, elemObj) {
    // get the namespace prefix for the attribute name,
    // so that we can recognize xml namespace decls

    var attrPrefix = attrNode.getPrefix();
    var attrName = attrNode.getNodeName();
    var attrQualifiedName = attrNode.getQualifiedName();
    var attrValue = attrNode.getNodeValue();

    // is this a namespace declaration?

    if (attrName == "xmlns") {
        if (elemObj["@xmlns"] == null) {
            elemObj["@xmlns"] = {};
        }
        elemObj["@xmlns"]["$"] = attrValue;
    } else
    if (attrPrefix == "xmlns") {
        if (elemObj["@xmlns"] == null) {
            elemObj["@xmlns"] = {};
        }
        elemObj["@xmlns"][attrName] = attrValue;
    } else {
        elemObj["@" + attrQualifiedName] = attrValue.replace(/"/g, "\\\""); // escape all double quote characters in the attribute value
    }
    return elemObj;
}

// This function is used when generating XML in json2xml
// to escape things like double quotes, reserved XML chars, etc.

function textValue(value) {
    if (value) {
        value = value.replace(/&/g, "&amp;"); // escape all & characters

        value = value.replace(/>/g, "&gt;"); // escape all > characters

        value = value.replace(/</g, "&lt;"); // escape all < characters

        value = value.replace(/"/g, "&quot;"); // escape all " characters to &quot;
    }
    return value;
}

function textValue2(v) {
    return textValue(v ? '' + v : '');
}

/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
    Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/

	Modified 3/27/09 by N. Merritt to make it compatible with Badgerfish format ($ instead of text, attribute collections, etc)
	Modified 4/15/09 by N. Merritt to fix bugs with failure to escape double quote and XML reserved characters like &, <, <, etc.
*/

function json2xml(o, tab) {
    var toXml = function(v, name, ind) {
        var xml = "";
        if (v instanceof Array) {
            var i;
            for (i = 0; i < v.length; i++) {
                xml += ind + toXml(v[i], name, ind + "\t") + "\n";
            }
        } else if (typeof(v) == "object") {
            var hasChild = false;
            xml += ind + "<" + name;
            var m;
            for (m in v) {
                if (m.charAt(0) == "@") {
                    if (typeof(v[m]) == "object") {
                        // complex attribute, i.e. "@xmlns":{"bdm":"http:\/\/www.hp.com\/2009\/software\/data-model","$":"http:\/\/www.hp.com\/2009\/software\/data-model"}},

                        var ao;
                        for (ao in v[m]) {
                            if (ao == "$") {
                                xml += " " + m.substr(1) + "=\"" + textValue2(v[m][ao]) + "\"";
                            } else {
                                xml += " " + m.substr(1) + ":" + ao + "=\"" + textValue2(v[m][ao]) + "\"";
                            }
                        }
                    } else // simple attribute, i.e. "@label":"enterprise"
                    {
                        xml += " " + m.substr(1) + "=\"" + textValue2(v[m]) + "\"";
                    }
                } else {
                    hasChild = true;
                }
            }
            xml += hasChild ? ">" : "/>";
            if (hasChild) {
                var m;
                for (m in v) {
                    if (m == "$") {
                        xml += textValue2(v[m]);
                    } else if (m == "#cdata") {
                        xml += "<![CDATA[" + v[m] + "]]>";
                    } else if (m.charAt(0) != "@") {
                        xml += toXml(v[m], m, ind + "\t");
                    }
                }
                xml += (xml.charAt(xml.length - 1) == "\n" ? ind : "") + "</" + name + ">";
            }
        } else {
            xml += ind + "<" + name + ">" + textValue2(v) + "</" + name + ">";
        }
        return xml;
    };

    var xml = "";

    var m;
    for (m in o) {
        xml += toXml(o[m], m, "");
    }

    return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}


function dumpObject(obj) {
    var prop;
    for (prop in obj) {
        if (typeof obj[prop] == "object") {
            if (obj[prop].constructor == Array) {
                print("Dumping array");
            } else {
                print("Dumping object");
            }

            dumpObject(obj[prop]);
        } else {
            print("Dumping value");

            print(obj[prop]);
        }
    }

}

var undefined; // leave this unset so we can compare to undefined


// Add a "before" method to Javascript string object

String.prototype.before = function(str) {
    var strIntern = this.valueOf();

    var strLen = str.length;

    var i = strIntern.indexOf(str);

    if (i >= 0) {
        return strIntern.substring(0, i);
    }
    return "";
};

// Add an "after" method to Javascript string object

String.prototype.after = function(str) {
    var strIntern = this.valueOf();

    var strLen = str.length;

    var i = strIntern.indexOf(str);

    if (i >= 0) {
        return strIntern.substr(i + strLen);
    }
    return "";
};