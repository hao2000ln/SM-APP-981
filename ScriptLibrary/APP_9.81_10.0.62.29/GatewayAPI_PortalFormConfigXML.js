var extend = system.library.Ext.extend;

function OrderedList() {
	this.list = [];
}
OrderedList.prototype = {
	getAt: function(index) {
		return this.list[index];
	},

	add: function(o) {
		this.list.push(o);
	},
	
	addAt: function(o, index) {
		if (index > this.list.length)
			index = this.list.length;
		this.list.splice(index, 0, o);
	},
	replaceAt: function(o, index) {
		if (index > this.list.length)
			index = this.list.length;
		this.list.splice(index, 1, o);
	},
	remove: function(o) {
		var index = this.indexOf(o);
		if (index != -1) {
			this.removeAt(index);
			return true;
		} else {
			return false;
		}
	},
	
	removeAt: function(index) {
		if (index > this.list.length)
			return null;
		return this.list.splice(index, 1);
	},
	
	indexOf: function(o) {
		for (var i = 0; i < this.list.length; ++i)
			if (this.list[i] == o)
				return i;
		return -1;
	},
	
	size: function() {
		return this.list.length;
	}
};

function Artifact() {
}
Artifact.prototype = {
};

function XmlParser() {
	
}
XmlParser.prototype = {
	getXmlDocument: function() {
		if (!this.xmlDocument)
			this.xmlDocument = new XML('document');
		return this.xmlDocument;
	}, 

	parseArtifact: function (artifact) {
		var doc = this.getXmlDocument();
		var element = doc.createNode(1, artifact.__getXmlNodeName());
		
		var properties = this.__getPropertyNames(artifact);
		for (var i=0; i<properties.length; ++i) {
			var name = properties[i];
			var value = this.__getPropertyValue(artifact, name);
			if (!this.__isEmpty(value))
				element.setAttributeValue(
						name, value);
		}
		
		if (
				typeof artifact.nodeValueGet == 'function' && 
				!this.__isEmpty(artifact.nodeValueGet())
			) {
			element.setNodeValue(artifact.nodeValueGet());
		}
		
		var childList;
		if (childList = this.__getChildren(artifact)) {
			for (var i=0; i<childList.size(); ++i) {
				element.appendNode(this.parseArtifact(childList.getAt(i)));
			}
		}
		
		return element;
	},
	
	parseXmlNode: function (xmlNode) {
		var clazz = XmlParser.getClass(xmlNode.getName());
		var artifact = new clazz();
		
		var properties = this.__getPropertyNames(artifact);
		for (var i=0; i<properties.length; ++i) {
			var name = properties[i];
			var value = xmlNode.getAttributeValue(name);
			if (!this.__isEmpty(value))
				this.__setPropertyValue(
						artifact, name, value);
		}
		
		if (
				typeof artifact.nodeValueSet == 'function' && 
				!this.__isEmpty(xmlNode.getNodeValue())
			) {
			artifact.nodeValueSet(xmlNode.getNodeValue());
		}
		
		var childList;
		if (childList = this.__getChildren(artifact)) {
			for (
					var childElement = xmlNode.getFirstChildElement(); 
					childElement; 
					childElement = childElement.getNextSiblingElement()
				) {
				var child = this.parseXmlNode(childElement);
				childList.add(child);
			}
		}
		
		return artifact;
	},
	
	parseXmlString: function (xmlString) {
		var doc = this.getXmlDocument();
		if (!doc.setContent(xmlString))
			throw 'illegal xml string, ' + xmlString;
		return this.parseXmlNode(doc);
	},
	
	__getPropertyNames: function (artifact) {
		var setter = /^set([A-Z]\w+)$/;
		var properties = [], result;
		for (var key in artifact) {
			if (typeof artifact[key] != 'function')
				continue;
			
			result = setter.exec(key);
			if (null == result)
				continue;
				
			properties.push(result[1].lcFirst());
		}
		return properties;
	},
	
	__getPropertyValue: function(artifact, name) {
		if (typeof artifact['get' + name.ucFirst()] == 'function')
			return artifact['get' + name.ucFirst()]();
		else if (typeof artifact['is' + name.ucFirst()] == 'function')
			return artifact['is' + name.ucFirst()]();
		else
			throw 'invalid property name "' + name + '"';
	},
	
	__setPropertyValue: function(artifact, name, value) {
		if (typeof artifact['set' + name.ucFirst()] == 'function')
			return artifact['set' + name.ucFirst()](value);
		else
			throw 'invalid property name "' + name + '"';
	},
	
	__getChildren: function(artifact) {
		for (var key in artifact)
			if (artifact[key] instanceof OrderedList)
				return artifact[key];
		return null;
	},
	
	__isEmpty: function(value) {
		return typeof value == 'undefined' || null == value || '' == value;
	}
}
XmlParser.classes = [];
XmlParser.register = function (clazz) {
	XmlParser.classes[clazz.prototype.__getXmlNodeName()] = clazz;
}
XmlParser.getClass = function (nodeName) {
	return XmlParser.classes[nodeName];
}



function HasLabel () {
	HasLabel.superclass.constructor.apply(this, arguments);
}
extend(HasLabel, Artifact, {
	getLabel: function () {
		return this.label;
	},
	
	setLabel: function (label) {
		this.label = label;
	},
	
	getLabelId: function () {
		return this.labelId;
	},
	
	setLabelId: function (labelId) {
		this.labelId = labelId;
	}
});

function Sections() {
	Section.superclass.constructor.apply(this, arguments);
	
	this.sections = new OrderedList;
}
extend(Sections, Artifact, {
	getSections: function () {
		return this.sections;
	},

	__getXmlNodeName: function() {
		return 'sections';
	}
});
XmlParser.register(Sections);

function Section () {
	Section.superclass.constructor.apply(this, arguments);
	
	this.fields = new OrderedList();
}
extend(Section, HasLabel, {
	getFields: function() {
		return this.fields;
	},
	
	__getXmlNodeName: function() {
		return 'section';
	}
});
XmlParser.register(Section);

function Field() {
	Field.superclass.constructor.apply(this, arguments);
}
extend(Field, HasLabel, {
	getField: function() {
		return this.field
	},
	
	setField: function(field) {
		this.field = field;
	},
	
	isMandatory: function() {
		return this.mandatory;
	},
	
	setMandatory: function(mandatory) {
		if (mandatory !=null && mandatory != "" && typeof(mandatory) != undefined)
			this.mandatory = mandatory;
		else
			this.mandatory = 'false';
	},
	
	getModifiability: function() {
		return this.modifiability;
	},
	
	setModifiability: function(modifiability) {
		this.modifiability = modifiability;
	},
	
	getDefaultValue: function() {
		return this.defaultValue;
	},
	
	setDefaultValue: function(defaultValue) {
		this.defaultValue = defaultValue;
	},
	isUseExpression: function() {
		return this.useExpression;
	},
	setUseExpression:function(useExpression) {
		this.useExpression = useExpression;
	},
	isVisible: function() {
		return this.visible;
	},
	
	setVisible: function(visible) {
		if (visible != null  && visible != "" && typeof(visible) != undefined)
			this.visible = visible;
		else
			this.visible = 'false';
	}
});
Field.MODIFY_CREATE = 'create';
Field.MODIFY_UPDATE = 'update';
Field.MODIFY_VIEW   = 'view';

function TypedField() {
}
extend(TypedField, Field, {
	getFieldType: function() {
		return this.fieldType;
	},
	
	setFieldType: function(fieldType) {
		this.fieldType = fieldType;
	}

});
TypedField.CHARACTER = 'character';
TypedField.DATETIME  = 'datetime';
TypedField.LOGICAL   = 'logical';
TypedField.NUMBER    = 'number';
TypedField.ARRAY    = 'array';
function Select() {
	Select.superclass.constructor.apply(this, arguments);
	
	this.options = new OrderedList;
}
extend(Select, TypedField, {
	getOptions: function() {
		return this.options;
	},
	
	getStyle: function() {
		return this.style;
	},
	
	setStyle: function(style) {
		this.style = style;
	},
	
	getGlobalList: function() {
		return this.globalList;
	},
	
	setGlobalList: function(globalList) {
		this.globalList = globalList;
	},
	
	__getXmlNodeName: function() {
		return 'select';
	}
});
Select.STYLE_COMBO = 'combo';
Select.STYLE_RADIO = 'radio';
XmlParser.register(Select);

function Option() {
	Option.superclass.constructor.apply(this, arguments);
}
extend(Option, HasLabel, {
	__getXmlNodeName: function() {
		return 'option';
	},
	
	nodeValueGet: function () {
		return this.value;
	},
	
	nodeValueSet: function (value) {
		this.value = value;
	}
});
XmlParser.register(Option);

function Checkbox() {
	Checkbox.superclass.constructor.apply(this, arguments);
}
extend(Checkbox, Field, {
	__getXmlNodeName: function() {
		return 'checkbox';
	}
});
XmlParser.register(Checkbox);


function TextField() {
	TextField.superclass.constructor.apply(this, arguments);
}
extend(TextField, TypedField, {
	isMultiline: function() {
		return this.multiline;
	},
	
	setMultiline: function(multiline) {
		this.multiline = multiline;
	},
	
	getLookUpField: function() {
		return this.lookUpField;
	},
	
	setLookUpField: function(lookUpField) {
		this.lookUpField = lookUpField;
	},
	
	getLookUpTable: function() {
		return this.lookUpTable;
	},
	
	setLookUpTable: function(lookUpTable) {
		this.lookUpTable = lookUpTable;
	},
	getGlobalList: function() {
		return this.globalList;
	},
	
	setGlobalList: function(globalList) {
		this.globalList = globalList;
	},
	__getXmlNodeName: function() {
		return 'text';
	}
});
XmlParser.register(TextField);
