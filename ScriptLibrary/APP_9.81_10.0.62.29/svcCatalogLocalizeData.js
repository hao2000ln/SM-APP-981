/**  This function is called to check the current language.
*
*	@return The current language for the logged in user.
*	@type String
*/
function getCurrentLanguage()
{
	return vars.$G_my_language;	
}

/**  This function is called to get the codes for all the languages in the system.
*
*	@return An array of language codes
*	@type Array
*/
function getLanguageCodes()
{
	var codes = new SCDatum();
	var langs = new SCFile("language", SCFILE_READONLY);
	langs.setFields(["unique.id"]);
	var rc = langs.doSelect(true);
	
	while (rc == RC_SUCCESS)
	{
		codes.push(langs.unique_id);
		rc = langs.getNext();
	}
	return codes;
}

/**  This function is called to get the display names for all the languages in the system.
*
*	@return An array of language names.
*	@type Array
*/
function getLanguageDisplay()
{
	var names = new SCDatum();
	var langs = new SCFile("language", SCFILE_READONLY);
	langs.setFields(["language"]);
	var rc = langs.doSelect(true);
	
	while (rc == RC_SUCCESS)
	{
		names.push(langs.language);
		rc = langs.getNext();
	}
	return names;
}

/** This function returns the human readable language name for a syslanguage code
* 
*	@param {String} strCode 	- 	The language code
*	@return The language name.
* 	@type String
*/
function getLanguageDisplayByCode( strCode )
{
	var langs = new SCFile("language", SCFILE_READONLY);
	langs.setFields(["language"]);
	var rc = langs.doSelect("unique.id=\"" + strCode + "\"");
	
	if (rc == RC_SUCCESS)
	{
		return langs.language;
	}
	return "";
}

/**  This function is called to initialize the localization wizard.
*
*	@param {SCFile} fFile	-  The svcCatalog item that is to be localized.
*/
function loadData( fFile )
{
	var fromLanguage = fFile.syslanguage;
	var toLanguage = vars.$loc_syslanguage;
	
 	var fDisplay = new SCFile("svcDisplay", SCFILE_READONLY);
 	var locExisted = true;
 	
 	var rc = fDisplay.doSelect("name=\"" + fFile.name + "\" and syslanguage=\"" + toLanguage + "\"");
 	
	if (rc != RC_SUCCESS)
	{
		fDisplay.doSelect("name=\"" + fFile.name + "\" and syslanguage=\""+ fromLanguage +"\"");
		locExisted = false;	
	}
  	vars.$loc_displayName=fDisplay.displayName;
	vars.$loc_description=fDisplay.description;
	vars.$loc_option_instructions=fDisplay.option_instructions;
	vars.$loc_detailedDescription=fDisplay.detailedDescription;
	
	if(toLanguage == fromLanguage || !locExisted ) {
 		vars.$loc_options=fDisplay.options;
	}else {	
		var oldOptions = fDisplay.options;	
		rc = fDisplay.doSelect("name=\"" + fFile.name + "\" and syslanguage=\"" + fromLanguage + "\"");
		var newOptions = fDisplay.options;		
		
		if (oldOptions == null) {
			oldOptions = "<form/>";
		}
		if (newOptions == null) {
			newOptions = "<form/>";
		}
		
		var newXmlObject = new XML();
	 	newXmlObject.setContent(newOptions);
	  	var parent = newXmlObject.getParentNode();
	  	var form = parent.getFirstChildElement();
	  	var node = form.getFirstChildElement();
		
		var oldXmlObject = new XML();
	 	oldXmlObject.setContent(oldOptions);
	  	var oldparent = oldXmlObject.getParentNode();
	  	var oldform = oldparent.getFirstChildElement();		
		var oldnode = oldform.getFirstChildElement();
		
		var addedUserOption = [];	 
		while ( node != null )	{ 
	  		id =node.getAttributeValue("id");  
	  		
			if(lib.xmlHelpers.getElement( oldform, id ,"id") == null){
				addedUserOption.push(node);				
			}	  		
	   		node = node.getNextSiblingElement();  		
	   	}   
	   	
		var length = addedUserOption.length;
 		for (i=0; i<length; i++ ) {	
 			lib.xmlHelpers.addChildElement( oldform, addedUserOption[i]);
		}
		
		var deletedUserOption = [];
		while ( oldnode != null )	{ 
	  		id =oldnode.getAttributeValue("id");  
	  		
			if(lib.xmlHelpers.getElement( form, id ,"id") == null){
				deletedUserOption.push(oldnode);				
			}	  		
	   		oldnode = oldnode.getNextSiblingElement();  		
	   	}   
 		length = deletedUserOption.length;
 		for (i=0; i<length; i++ ) {	
 			id = deletedUserOption[i].getAttributeValue("id");
 			oldform = lib.xmlHelpers.removeChild( oldform, id, "id");
		}
		
 		vars.$loc_options=oldform.toXMLString();  
	} 
}


/**  This function is called to get the display name.
*
*	 
*/
function getDisplayName( itemName )
{
	var fDisplay = new SCFile("svcDisplay", SCFILE_READONLY);
	fDisplay.setFields(["displayName"]);
	var rc = fDisplay.doSelect("name=\"" + itemName + "\" and syslanguage=\"" + vars.$loc_syslanguage + "\"");
	
	if (rc != RC_SUCCESS)
	{
		fDisplay.doSelect("name=\"" + itemName + "\" and syslanguage=\"en\"");	
	}
	
	return fDisplay.displayName;
}


/**  This function is called save the data from the localization wizard.
*
*	@param {SCFile} name	-	The svcCatalog item that is to be localized.
*/
function saveData( fFile )
{
	var xmlString;
  	var xmlObject = new XML();
	var fDisplay = new SCFile("svcDisplay");
	var rc = fDisplay.doSelect("name=\"" + fFile.name + "\" and syslanguage=\"" + vars.$loc_syslanguage + "\"");
	
	fDisplay.displayName=vars.$loc_displayName;
	fDisplay.description=vars.$loc_description;
	fDisplay.option_instructions=vars.$loc_option_instructions;
	fDisplay.detailedDescription=vars.$loc_detailedDescription;
	fDisplay.options=vars.$loc_options;
	
	// Setup the names and labels for localized user selections
	if ( fDisplay.options != null && fFile.type == "item" )
	{
		var names = [];
  		var labels = [];
		
		xmlString = fDisplay.options;
		
		xmlObject = xmlObject.setContent( xmlString );
		
		if (xmlObject == null)
		{
			return false;
		}
		
	  	var parent = xmlObject.getParentNode();
  		var form = parent.getFirstChildElement();
  		var node = form.getFirstChildElement();
  		var i = 0;
  		while ( node != null )
  		{
  			names[i] = node.getAttributeValue("id");
  		
  			labels[i]= node.getAttributeValue("label");
  		
			i++;
  		
  			node = node.getNextSiblingElement();
  		}
        
  		fDisplay.option_names = funcs.denull(names);
  		fDisplay.option_desc = funcs.denull(labels);	
  	}
	
	if (rc == RC_SUCCESS)
	{
		if (fDisplay.doUpdate() != RC_SUCCESS)
		{
			return false;
		}
	}
	else
	{
		fDisplay.name=fFile.name;
		fDisplay.syslanguage=vars.$loc_syslanguage;
		if (fDisplay.doInsert() != RC_SUCCESS)
		{
			return false;
		}
	}
	
	return true;
}

/**  This function is called to do the initial move from svcCatalog to svcDisplay.
*
*	@param {String} strBaseLang		- The language that the svcCatalog is in.
*/
function transferData( strBaseLang )
{
	var fCatalog=new SCFile("svcCatalog");
	var rc = fCatalog.doSelect(true);
	
	var langArray = getActiveLanguages();
	
	while (rc == RC_SUCCESS)
	{
		propertiesCopy(fCatalog, langArray);				
		rc = fCatalog.getNext();
	}	
}

function propertiesCopy(fCatalog, langArray) 
{
	var fDisplay=new SCFile("svcDisplay");
	fDisplay.name=fCatalog.name;
	fDisplay.displayName=fCatalog.name;
	fDisplay.description=fCatalog.description;
	fDisplay.detailedDescription=fCatalog.detailedDescription;
	fDisplay.option_instructions=fCatalog.option_instructions;
	fDisplay.options=fCatalog.options;
	fDisplay.option_desc=fCatalog.option_desc;
	fDisplay.option_names=fCatalog.option_names;
	var i;
	for (i=0; i<langArray.length; i++) 
	{
		fDisplay.syslanguage=langArray[i];
		fDisplay.doSave();
	}
}
	

function getActiveLanguages() 
{
	var lang = new SCFile("language", SCFILE_READONLY);
	lang.setFields(["unique.id"]);
	var rc = lang.doSelect("active=true");
	
	var langArray = [];
	while (rc == RC_SUCCESS) 
	{	
		langArray.push(lang.unique_id);
		rc = lang.getNext();
	}
	return langArray;
}


/**  This function is called to delete the obsolete data in svcCatalog.
*/
function nullObsoleteData()
{
	var fCatalog=new SCFile("svcCatalog");
	
	var rc = fCatalog.doSelect(true);
	
	while (rc == RC_SUCCESS)
	{
		fCatalog.description=null;
		fCatalog.detailedDescription=null;
		fCatalog.option_instructions=null;
		fCatalog.options=null;
		fCatalog.option_desc=null;
		fCatalog.option_names=null;
				
		fCatalog.doUpdate();
		rc = fCatalog.getNext();
	}	
}

/**  This function is called to create test data in the svcDisplay file.
*	 DO NOT CALL. THIS FUNCTION WILL DELTE ALL FRENCH DATA,
*/
function makeTestData()
{
	var fDisplay=new SCFile("svcDisplay", SCFILE_READONLY);
	var fFRDisplay;
	
	var rc = fDisplay.doSelect(true);
	
	while (rc == RC_SUCCESS)
	{
		fFRDisplay=new SCFile("svcDisplay");
		
		fFRDisplay.name=fDisplay.name;
		fFRDisplay.displayName="FR" + fDisplay.name;
		fFRDisplay.description="FR" + fDisplay.description;
		fFRDisplay.detailedDescription="FR" + fDisplay.detailedDescription;
		fFRDisplay.option_instructions=fDisplay.option_instructions;
		fFRDisplay.options=fDisplay.options;
		fFRDisplay.option_desc=fDisplay.option_desc;
		fFRDisplay.option_names=fDisplay.option_names;
		fFRDisplay.syslanguage="fr";
		fFRDisplay.doInsert();
		rc = fDisplay.getNext();
	}	
}

/**  This function is called to delete the obsolete triggers against the svcCatalog table.
*    Delete old triggers in Pre SM710 
**/
var OLD_TRIGGERS = ["svcCatalog.delete", "svcCatalog.set.options.add", "svcCatalog.set.options.update", 
					"svcCatalog.set.sort.add", "svcCatalog.set.sort.update", "svcCatalog.update"];
function deleteCatalogTriggers()
{
	var fTriggers = new SCFile("triggers");
	var i;
	for (i=0; i<OLD_TRIGGERS.length; i++) 
	{
		var rc = fTriggers.doSelect("trigger.name=\""+ OLD_TRIGGERS[i] +"\"");
		if (rc == RC_SUCCESS)
		{
			fTriggers.doDelete();
			// Log: Delete old trigger "%S" in "svcCatalog" table
			lib.upgradeLog.scDetail(1156, [OLD_TRIGGERS[i]]);
		}
	}
}

/**  
*	 This function is called to move data from svcCatalog to svcDisplay, delete the obsolete
*    data svcCatalog file and deletes the triggers that are against the svcCatalog table.
*    All active languages duplicate the English language to svcDisplay.
*/
function upgradeCatalogData()
{
	transferData();
	deleteCatalogTriggers();
}
