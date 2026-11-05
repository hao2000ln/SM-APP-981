/**
 * This script is meant to initiate the OOB data of SRC-Tailoring. Especially for upgrade from previous version.
 */



/**
 * Entry method to initiate all checkout.
 */
function initSrcTailoringConfiguration() {
	var oob_panel_files = _init_oob_panel_files();

	var company = new SCFile("company");
	var rc = company.doSelect("company~=\"DEFAULT\"");
	while (rc == RC_SUCCESS) {
		var companyId = company['company'];
		_init_checkout_for_company(companyId, oob_panel_files);
		rc = company.getNext();
	}
}

/**
 * Initiate checkout panel for a company based on OOB.
 */
function _init_checkout_for_company(companyId, oob_panel_files) {
	var config = new SCFile("svcSrcConfig");
	var rc = config.doSelect("company=\""+companyId+"\"");
	var panels = [];
	while (rc == RC_SUCCESS) {
		var screenType = config['screen.type'];
		var panel = new SCFile("svcSrcConfig");
		system.functions.fduplicate(panel, config);
		panels[screenType] = panel;
		rc = config.getNext();
	}
	
	for (var screen in oob_panel_files) {
		if (oob_panel_files.hasOwnProperty(screen)) {
			var panelFile = panels[screen]
			if (panelFile) {
				panelFile = _mergePanel(panelFile, oob_panel_files[screen]);
				print("Merging checkout panel configuration, name:" + panelFile['name'] + ", company:" + panelFile['company']);
			} else { //QCCR1E98138: do not create new panel.
			}
			if (panelFile) {
				panels[screen] = panelFile;
			}
		}
	}
	
	for (var panel in panels) {
		if (panels.hasOwnProperty(panel)) {
			panels[panel].doSave();
		}
	}
}

/**
 * Create a new checkout panel according to OOB.
 */
function _newPanel(companyId, screen, oob_panel_files) {
	var svcSrcConfig = new SCFile("svcSrcConfig");
	svcSrcConfig['name'] = oob_panel_files[screen]['name']+"_"+companyId;
	svcSrcConfig['company'] = companyId;
	svcSrcConfig['screen.type'] = screen;
	svcSrcConfig['options'] = oob_panel_files[screen]['options'];
	svcSrcConfig['enable.upload'] = oob_panel_files[screen]['enable.upload'];
	svcSrcConfig['fields'] = oob_panel_files[screen]['fields'];
	return svcSrcConfig;
}

/**
 * Merge the existed panel (tailored in previous release) with SM 932 OOB release.
 */
function _mergePanel(target_panel_file, source_panel_file) {
	var orig_options = target_panel_file['options'];
	var screenType = target_panel_file['screen.type'];
	var oob_options = source_panel_file['options'];
	var oobFields = _getFieldList(source_panel_file);
	
	var targetXml = new XML();
	targetXml.setContent("<sections/>");
	
	var mergedSectionNodes = [];
	var fields = [];

	_mergeSection(mergedSectionNodes, fields, targetXml, oob_options);
	_mergeSection(mergedSectionNodes, fields, targetXml, orig_options, oobFields);
	
	for (var section in mergedSectionNodes) {
		if (mergedSectionNodes.hasOwnProperty(section)) {
			var sectionNode = mergedSectionNodes[section];
			if (sectionNode.getFirstChildElement()) {
				targetXml.appendNode(sectionNode);
			}
		}
	}
	
	target_panel_file['fields'] = fields;
	target_panel_file['options'] = targetXml.toXMLString();
	
	// The field 'enable.upload' is new field since SM 9.32, for previous version the value should be null
	// but after tailoring (SM 9.32) the value should be either true or false.
	// so the upgrading process treat a record with its 'enable.upload' equals to null value hasn't been upgraded
	// and by default set it to true, otherwise keep the original value.
	if (target_panel_file['enable.upload'] == null) {  
		target_panel_file['enable.upload'] = true;
	}
	
	return target_panel_file;
}

/**
 * Merge a section in checkout panel.
 */
function _mergeSection(mergedSectionNodes, fields, targetXml, to_be_merged_options, excludeFields) {
	if (to_be_merged_options==null || to_be_merged_options=="") {
		return;
	}
	var to_be_merged_XML = new XML();
	to_be_merged_XML.setContent(to_be_merged_options);

	if (to_be_merged_XML) {
		var section = to_be_merged_XML.getFirstChildElement();
		while (section) {
			var field = section.getFirstChildElement();
			var fieldNodes = [];
			var sectionNode;
			
			var sectionId = section.getAttributeValue("labelId");
			if (mergedSectionNodes[sectionId]) {
				sectionNode = mergedSectionNodes[sectionId];
			} else {
				sectionNode = targetXml.createNode(1, "section");
				sectionNode.setAttributeValue("labelId", sectionId);
			}
			
			while (field) {
				var fieldName = field.getAttributeValue("field");
				if (!(excludeFields && excludeFields[fieldName])) {
					fields.push(fieldName);
					var fieldNode = sectionNode.createNode(1, field.getNodeName());
					var fieldAttribute = field.getFirstAttribute();
					while (fieldAttribute) {
						fieldNode.setAttributeValue(fieldAttribute.getNodeName(), fieldAttribute.getNodeValue());
						fieldAttribute = field.getNextAttribute();
					}
					fieldNodes.push(fieldNode);
					sectionNode.appendNode(fieldNode);
				}
				field = field.getNextSiblingElement();
			}
			mergedSectionNodes[sectionId] = sectionNode;
			section = section.getNextSiblingElement();
		}
	}
}

/**
 * Get fields in a checkout panel.
 */
function _getFieldList(panelFile) {
	var fieldList = [];
	if (panelFile) {
		var fields = panelFile['fields'];
		var options = panelFile['options'];
		if (fields && fields.length>0) {
			for (var i in fields) {
				if (fields.hasOwnProperty(i)) {
					fieldList[fields[i]] = fields[i];
				}
			}
		} else if (options) {
			var xml = new XML();
			xml.setContent(options);
			if (xml) {
				var section = xml.getFirstChildElement();
				while (section) {
					var field = section.getFirstChildElement();
					while (field) {
						fieldList[field.getAttributeValue("field")]=field;
						field = field.getNextSiblingElement();
					}
					section = section.getNextSiblingElement();
				}
			}
		}
	}
	return fieldList;
}

/**
 * If the OOB checkout panel was not loaded into SM database.
 * Use the option template to populate.
 */
function _init_oob_panel_files() {
	var panels = _get_oob_panel_options_by_query_DEFAULT_company();
	var options_general = "<sections><section labelId=\"23\"><text field=\"title\" fieldType=\"character\" labelId=\"5\" mandatory=\"true\" modifiability=\"create\"/><text field=\"description\" fieldType=\"character\" labelId=\"7\" mandatory=\"false\" modifiability=\"update\" multiline=\"true\"/></section><section labelId=\"8\"><text field=\"contact.name\" fieldType=\"character\" labelId=\"19\" lookUpField=\"contact.name\" lookUpTable=\"contacts\" mandatory=\"true\" modifiability=\"update\"/><text field=\"callback.contact\" fieldType=\"character\" labelId=\"18\" lookUpField=\"contact.name\" lookUpTable=\"contacts\" mandatory=\"true\" modifiability=\"update\"/><select defaultValue=\"E-mail\" field=\"callback.type\" fieldType=\"character\" globalList=\"Callback Type\" labelId=\"12\" mandatory=\"true\" modifiability=\"update\" style=\"combo\"/></section><section labelId=\"20\"><select field=\"affected.item\" fieldType=\"character\" labelId=\"22\" mandatory=\"false\" modifiability=\"update\" style=\"combo\"/><select field=\"severity\" fieldType=\"character\" globalList=\"Urgency\" labelId=\"21\" mandatory=\"true\" modifiability=\"update\" style=\"combo\"/></section></sections>";
	var options_service = "<sections><section labelId=\"3\"><text field=\"title\" fieldType=\"character\" labelId=\"5\" mandatory=\"true\" modifiability=\"create\"/><text field=\"description\" fieldType=\"character\" labelId=\"7\" mandatory=\"false\" modifiability=\"update\" multiline=\"true\"/></section><section labelId=\"8\"><text field=\"callback.contact\" fieldType=\"character\" labelId=\"9\" lookUpField=\"contact.name\" lookUpTable=\"contacts\" mandatory=\"true\" modifiability=\"update\"/><select defaultValue=\"E-mail\" field=\"callback.type\" fieldType=\"character\" globalList=\"Callback Type\" labelId=\"12\" mandatory=\"true\" modifiability=\"update\" style=\"combo\"/></section><section labelId=\"20\"><select field=\"severity\" fieldType=\"character\" globalList=\"Urgency\" labelId=\"21\" mandatory=\"true\" modifiability=\"update\" style=\"combo\"/></section></sections>";
	var options_support = "<sections><section labelId=\"23\"><text field=\"title\" fieldType=\"character\" labelId=\"5\" mandatory=\"true\" modifiability=\"create\"/><text field=\"description\" fieldType=\"character\" labelId=\"7\" mandatory=\"false\" modifiability=\"update\" multiline=\"true\"/></section><section labelId=\"8\"><text field=\"callback.contact\" fieldType=\"character\" labelId=\"18\" lookUpField=\"contact.name\" lookUpTable=\"contacts\" mandatory=\"true\" modifiability=\"update\"/><select defaultValue=\"E-mail\" field=\"callback.type\" fieldType=\"character\" globalList=\"Callback Type\" labelId=\"12\" mandatory=\"true\" modifiability=\"update\" style=\"combo\"/></section><section labelId=\"20\"><select field=\"severity\" fieldType=\"character\" globalList=\"Urgency\" labelId=\"21\" mandatory=\"true\" modifiability=\"update\" style=\"combo\"/></section></sections>";
	var panel_names = ["General Checkout", "Service Checkout", "Support Checkout"];
	var panel_types = ['self-service', 'service catalog', 'support catalog'];
	var panel_options = [options_general, options_service, options_support];

	for (var i = 0; i < panel_types.length; i++) {
		var config = panels[panel_types[i]];
		
		var oobConfig = new SCFile("svcSrcConfig");
		oobConfig['name'] = panel_names[i];
		oobConfig['screen.type'] = panel_types[i];
		oobConfig['options'] = panel_options[i];
		oobConfig['enable.upload'] = true;
		oobConfig['company'] = "DEFAULT";
		var fields = [];
		var oobFields = _getFieldList(oobConfig);
		for (var field in oobFields) {
			if (oobFields.hasOwnProperty(field)) {
				fields.push(field);
			}
		}
		oobConfig['fields'] = fields;
		if (!config) {
			oobConfig.doSave();
			print("Creating check panel configuration, name:"+ oobConfig['name'] + ", company:" + oobConfig['company']);
			panels[panel_types[i]] = oobConfig;
		} else {
			config = _mergePanel(config, oobConfig);
			config['fields'] = fields;
			config.doSave();
			print("Updating check panel configuration, name:"+ config['name'] + ", company:" + config['company']);
			panels[panel_types[i]] = config;
		}
	}
	return panels;
}

/**
 * Assuming the OOB checkout panel was loaded into SM database.
 */
function _get_oob_panel_options_by_query_DEFAULT_company() {
	var config = new SCFile("svcSrcConfig");
	var rc = config.doSelect("company=\"DEFAULT\"");
	var panels = [];
	while (rc == RC_SUCCESS) {
		var panel = new SCFile("svcSrcConfig");
		system.functions.fduplicate(panel,config);
		var screenType = panel['screen.type'];
		panels[screenType] = panel;
		rc = config.getNext();
	}
	return panels;
}