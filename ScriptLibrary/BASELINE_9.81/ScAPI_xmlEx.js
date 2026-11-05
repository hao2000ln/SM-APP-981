/************************************************************
 *  xmlEx class source code                                 *
 *  Author: Beddy                                           *
 *  Date: 2010/12/10                                        *
 *                                                          *
 *  This class is used for support common XML operation.    *
 *                                                          *
 *	@param XML object or String                             *
 ************************************************************/
 
function xmlEx(arg)
{
// private:
    var buf = null;
    var xml = null;
    
// private:
    var _init_default = function()
    {
        xml = new XML();
        buf = new Object();
        
        // xml private data
        buf.nodeName    = null;
        buf.nodePrefix  = null;
        buf.nodeValue   = null;
        buf.attrNames   = new Array();
        buf.attrPrefixs = new Array();
        buf.attrValues  = new Array();
        buf.children    = new Array();
    }
    var _init_string = function(str)
    {
        _init_default();
        
        if (xml.setContent(str, false) != null) _parseXML();
    }
    var _init_xml = function(_xml)
    {
        _init_string(_xml.toXMLString());
    }
    var _parseXML = function()
    {
        if (!xml.isDocumentElement()) return; // check whether the xml is valid
        
        buf.nodeName    = xml.getNodeName();
        buf.nodePrefix  = xml.getPrefix();
        buf.nodeValue   = xml.getText();
        
        // parse attribute
        var attr = xml.getFirstAttribute();
		while (attr != null)
	    {
	        buf.attrNames.push(attr.getName());
	        buf.attrPrefixs.push(attr.getPrefix());
	        buf.attrValues.push(attr.getText());
	        
	        attr = xml.getNextAttribute();
	    }
	    
	    // parse children
		var child = xml.getFirstChildElement();
		while (child != null)
	    {
	        buf.children.push(new xmlEx(child));
	        
	        child = child.getNextSiblingElement();
	    }
    }
    var _makeQName = function(prefix, name)
    {
        if (prefix != null && prefix != "") return prefix + ":" + name;
        else return name;
    }
    var _splitQName = function(qName)
    {
        var sqObj = new Object();
        var str = String(qName);
        var idx = str.indexOf(":");
        if (idx > -1)
        {
            sqObj.prefix = str.substr(0, idx);
            sqObj.name   = str.substr(idx + 1);
        }
        else
        {
            sqObj.prefix = null;
            sqObj.name   = str;
        }
        
        return sqObj;
    }
    var _nullsub = function(v, nv) { return (v == null || v == undefined) ? nv : v; }
     
// constructor:
    if (arguments.length == 0 || arg == null)
    {
        _init_default();
    } 
    else
    {
	    if (arg.constructor == String) _init_string(arg);
	    else if (typeof(arg.isDocumentElement) == "function") _init_xml(arg);
	    else _init_default();
	}
	
// public:
    this.isDocumentElement = function() { return xml.isDocumentElement(); }
    // getters
    this.getName = function() { return buf.nodeName; }
    this.getQName = function(){ return _makeQName(buf.nodePrefix, buf.nodeName); }
    this.getValue = function() { return buf.nodeValue; }
    this.getAttribute = function(name)
    {
        for (var i in buf.attrNames)
        {
            if (buf.attrNames[i] == name) return buf.attrValues[i];
        }
    }
    this.getAttributeQ = function(qName)
    {
        for (var i in buf.attrNames)
        {
            var tmpAttrQName = _makeQName(buf.attrPrefixs[i], buf.attrNames[i]);
            if (tmpAttrQName == qName) return buf.attrValues[i];
        }
    }
    this.getChildI = function(index)
    {
        var idx = parseInt(index);
        if (idx >= 0 && idx < buf.children.length)
        {
            return buf.children[idx];
        }
    }
    this.getChildrenCount = function() { return buf.children.length; }
    this.getAllChildren = function() { return buf.children; }
    this.getChildren = function(name)
    {
        var children = new Array();
        for (var i in buf.children)
        {
            if (buf.children[i].getName() == name) children.push(buf.children[i]);
        }
        
        return children;
    }
    this.getChildrenQ = function(qName)
    {
        var children = new Array();
        for (var i in buf.children)
        {
            if (buf.children[i].getQName() == qName) children.push(buf.children[i]);
        }
        
        return children;
    }
        
    // setters
    this.setContent = function(arg)
    {
        if (arguments.length >= 1)
        {
            if (arg.constructor == String) _init_string(arg);
            else if (typeof(arg.isDocumentElement) == "function") _init_xml(arg);
            
            if (xml.isDocumentElement()) return true;
        }
        return false;
    }
    this.setName = function(name)
    {
        buf.nodeName = name;
        return true;
    }
    this.setPrefix = function(prefix)
    {
        var str = String(prefix);
        if (str.indexOf(":") == -1)
        {
            buf.nodePrefix = str;
            return true;
        }
        
        return false;
    }
    this.setQName = function(qName)
    {
        var qnObj = _splitQName(qName);
        buf.nodePrefix  = qnObj.prefix;
        buf.nodeName    = qnObj.name;

        return true;
    }
    this.setValue = function(val)
    {
        buf.nodeValue = val;
        return true;
    }
    this.setAttribute = function(name, val)
    {
        for (var i in buf.attrNames)
        {
            if (buf.attrNames[i] == name)
            {
                buf.attrValues[i] = val;
                return true;
            }
        }
        
        return false;
    }
    this.setAttributeQ = function(qName, val)
    {
        for (var i in buf.attrNames)
        {
            var tmpAttrQName = _makeQName(buf.attrPrefixs[i], buf.attrNames[i]);
            if (tmpAttrQName == qName)
            {
                buf.attrValues[i] = val;
                return true;
            }
        }
        
        return false;
    }
    
    // others
    this.removeAttribute = function(name)
    {
        for (var i = 0; i < buf.attrNames.length; i++)
        {
            if (buf.attrNames[i] == name)
            {
                buf.attrNames.splice(i, 1);
                buf.attrPrefixs.splice(i, 1);
                buf.attrValues.splice(i, 1);
                i--; // After remove, the attribute related array's length will reduce 1
            }
        }
        
        return true;
    }
    this.removeAttributeQ = function(qName)
    {
        for (var i = 0; i < buf.attrNames.length; i++)
        {
            var tmpAttrQName = _makeQName(buf.attrPrefixs[i], buf.attrNames[i]);
            if (tmpAttrQName == qName)
            {
                buf.attrNames.splice(i, 1);
                buf.attrPrefixs.splice(i, 1);
                buf.attrValues.splice(i, 1);
                i--; // After remove, the attribute related array's length will reduce 1
            }
        }
        
        return true;
    }
    this.addAttribute = function(name, val)
    {
        if (String(name).indexOf(":") != -1) return this.addAttributeQ(name, val);
        
        buf.attrNames.push("");
        buf.attrPrefixs.push(name);
        buf.attrValues.push(val);
        
        return true;
    }
    this.addAttributeQ = function(qName, val)
    {
        var qnObj = _splitQName(qName);
        buf.attrNames.push(qnObj.name);
        buf.attrPrefixs.push(qnObj.prefix);
        buf.attrValues.push(val);
        
        return true;
    }
    this.removeChildI = function(index)
    {
        var idx = parseInt(index);
        if (idx >= 0 && idx < buf.children.length)
        {
            buf.children.splice(idx, 1);
        }
        
        return true;
    }
    this.removeChildren = function(name)
    {
        for (var i = 0; i < buf.children.length; i++)
        {
            if (buf.children[i].getName() == name)
            {
                buf.children.splice(i, 1);
                i--;
            }
        }
        
        return true;
    }
    this.removeChildrenQ = function(qName)
    {
        for (var i = 0; i < buf.children.length; i++)
        {
            if (buf.children[i].getQName() == qName)
            {
                buf.children.splice(i, 1);
                i--;
            }
        }
        
        return true;
    }
    this.addChild = function(child)
    {
        try
        {
	        if (child.constructor == this.constructor) buf.children.push(child);
	        else buf.children.push(new xmlEx(child));

	        return true;
        }
        catch (e)
        {
            // no  codes needed here
        }
        
        return false;
    }
    this.toString = function()
    {
        var qName = _makeQName(buf.nodePrefix, buf.nodeName);
        if (qName == null || qName == '') return ''; // qname can't be null
        
        // add header
        var xmlString = '<' + qName;
        // add attribute
        for (var i in buf.attrNames)
        {
            xmlString += ' ' + _makeQName(buf.attrPrefixs[i], buf.attrNames[i]) + '='
            xmlString += '"' + xmlstring(buf.attrValues[i]) + '"';
        }
        // add value
        xmlString += '>' + xmlstring(_nullsub(buf.nodeValue, ''));
        // add children
        for (var i in buf.children)
        {
            xmlString += buf.children[i];
        }
        // ends
        xmlString += '</' + qName + '>';
        
        return xmlString;
    }
}