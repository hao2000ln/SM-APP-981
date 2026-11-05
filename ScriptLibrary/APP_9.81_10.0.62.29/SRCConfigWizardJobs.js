var extend = lib.Ext.extend;
var XmlParser = lib.SrcConfigXML.XmlParser;

function Situation() {
}
Situation.prototype = {
	getXmlString: function () {
		//print('getXmlString: ' + vars.$options);
		return vars.$options;
	},
	
	setXmlString: function (xmlString) {
		vars.$options = xmlString;
		//print('setXmlString: ' + vars.$options);
	},
	
	getCurrentSection: function () {
		return new lib.SrcConfigXML.XmlParser().
					parseXmlString(this.getXmlString()).
					getSections().getAt(this.getSectionIndex());
	},
	
	getCurrentField: function () {
		return new lib.SrcConfigXML.XmlParser().
					parseXmlString(this.getXmlString()).
					getSections().getAt(this.getSectionIndex()).
					getFields().getAt(this.getFieldIndex());
	},
	
	getSectionIndex: function () {
		return vars['$section.index'];
	},
	
	setSectionIndex: function (index) {
		vars['$section.index'] = index;
	},
	
	getFieldIndex: function () {
		return vars['$field.index'];
	},
	
	setFieldIndex: function (index) {
		vars['$field.index'] = index;
	},
	
	getMoveDirection: function () {
		return vars['$move.direction'];
	}
};

function AbstractJob() {
}
AbstractJob.prototype = {
	setArtifact: function (artifact) {
		this.artifact = artifact;
	},
	
	getArtifact: function () {
		return this.artifact;
	},
	
	getSituation: function () {
		if (!this.situation)
			this.situation = new Situation;
		return this.situation;
	},
	
	getXmlParser: function () {
		if (!this.xmlParser)
			this.xmlParser = new XmlParser;
		return this.xmlParser;
	},
	
	run: function () {
		throw 'calling abstract method';
	}
};

function SectionJob() {
}
extend(SectionJob, AbstractJob, {
	run: function () {
		var sections = this.getXmlParser().parseXmlString(this.getSituation().getXmlString());
		this.dealWith(sections.getSections());
		this.getSituation().setXmlString(this.getXmlParser().parseArtifact(sections).toXMLString());
	},
	
	dealWith: function (sectionList) {
		throw 'calling abstract method';
	}
});

function AddSectionJob() {
}
extend(AddSectionJob, SectionJob, {
	dealWith: function (sectionList) {
		sectionList.add(this.getArtifact());
		this.getSituation().setSectionIndex(sectionList.size() - 1);
	}
});

function UpdateSectionJob() {
}
extend(UpdateSectionJob, SectionJob, {
	dealWith: function (sectionList) {
		sectionList.replaceAt(
				this.getArtifact(), this.getSituation().getSectionIndex());
	}
});

function RemoveSectionJob() {
}
extend(RemoveSectionJob, SectionJob, {
	dealWith: function (sectionList) {
		sectionList.removeAt(
				this.getSituation().getSectionIndex());
	}
});

function MoveSectionJob() {
}
extend(MoveSectionJob, SectionJob, {
	dealWith: function (sectionList) {
		var index = this.getSituation().getSectionIndex();
		var direction = this.getMoveDirection();
		var targetIndex = index + direction;
		if (targetIndex < 0 || targetIndex >= sectionList.size())
			return;
			
		var temp = sectionList.getAt(targetIndex);
		sectionList.replaceAt(sectionList.getAt(index), targetIndex);
		sectionList.replaceAt(temp, index);
	},
	
	setMoveDirection: function (direction) {
		this.direction = direction;
	},
	
	getMoveDirection: function() {
		return this.direction
	}
});

function FieldJob() {
}
extend(FieldJob, AbstractJob, {
	run: function () {
		var sections = this.getXmlParser().parseXmlString(this.getSituation().getXmlString());
		var section = sections.getSections().getAt(this.getSituation().getSectionIndex());
		this.dealWith(section.getFields());
		this.getSituation().setXmlString(this.getXmlParser().parseArtifact(sections).toXMLString());		
	},
	
	dealWith: function (fieldList) {
		throw 'calling abstract method';
	}
});

function AddFieldJob() {
}
extend(AddFieldJob, FieldJob, {
	dealWith: function (fieldList) {
		fieldList.add(this.getArtifact());
		this.getSituation().setFieldIndex(fieldList.size() - 1);
	}
});

function UpdateFieldJob() {
}
extend(UpdateFieldJob, FieldJob, {
	dealWith: function (fieldList) {
		fieldList.replaceAt(this.getArtifact(), this.getSituation().getFieldIndex());
	}
});

function RemoveFieldJob() {
}
extend(RemoveFieldJob, FieldJob, {
	dealWith: function (fieldList) {
		fieldList.removeAt(this.getSituation().getFieldIndex());
	}
});

function MoveFieldJob() {
}
extend(MoveFieldJob, FieldJob, {
	dealWith: function (fieldList) {
		var index = this.getSituation().getFieldIndex();
		var direction = this.getMoveDirection();
		var targetIndex = index + direction;
		if (targetIndex < 0 || targetIndex >= fieldList.size())
			return;
			
		var temp = fieldList.getAt(targetIndex);
		fieldList.replaceAt(fieldList.getAt(index), targetIndex);
		fieldList.replaceAt(temp, index);
	},
	
	setMoveDirection: function (direction) {
		this.direction = direction;
	},
	
	getMoveDirection: function() {
		return this.direction
	}
});