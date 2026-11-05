function getSetting( position, settings, newSetting )
{
	var setting = new SCFile( "settingsConfig" )
	
	if ( newSetting == false )
	{
	
	}
	
	return setting;
	
}

function createForm( setting )
{
	var form = new XML("form");
	var fileName = system.functions.filename( setting );
	var orderBySeq = [SCFILE_ASC,SCFILE_ASC];
	var fields = ['type','label'];
    var refSecArea = null;

	if( setting.name === "Collaboration")
	{
	  orderBySeq = [SCFILE_ASC,SCFILE_ASC, SCFILE_ASC];
	  fields = ['type','readonly', 'label'];
	}
 	
	var config = new SCFile("settingsConfig");
	config.setOrderBy(fields, orderBySeq)
	var sql = "false";
	var optionIndex = 4000;

	if ( fileName == "settings" )
	{
		sql = "setting=\"" + setting.name + "\" and settingType=NULL";
	}
	else if ( fileName == "secArea" )
	{
		sql = "setting=\"" + setting.name + "\" and settingType=\"area\"";
	}
	else if (fileName == "secRights" )
	{
		sql = "setting=\"" + setting.area + "\" and settingType=\"area\"";
        refSecArea = new SCFile("secArea", SCFILE_READONLY);
        refSecArea.doSelect('name="' + setting.area + '"');
	}
	
	if ( config.doSelect( sql ) == RC_SUCCESS )
	{
		do
		{
			var visible_condition = config.visible_condition;
			if (visible_condition !== null && visible_condition !== "") {
				try {
					if (system.functions.parse_evaluate(visible_condition, 4) === false) {
						continue;
					}
				} catch (e) {
					print("Failed to parse the visible condition: " + visible_condition);
				}
			}
			
			var type = "text";
			var option;
			var suffix = ":";
			var isRecord = false;
			switch( config.type )
			{
				case "list":
				{
					type="select";
					break;
				}
				case "globallist":
				{
					type="select";
					break;
				}
				case "boolean":
				{
					suffix=""
					type = "checkbox"
					break;
				}
				case "record":
				{
					isRecord = true;
					break;
				}
			}

			var node = form.addElement( type );
			node.setAttributeValue( "id", config.id );
			var msg = "";
			
			if (lib.ServiceDeskSwitch.getSDSwitch() && config.id=="allow.escalate" && fileName=="settings")
			{
				msg = system.functions.scmsg(  config.setting+";"+config.id+".pink", "local:settingsConfig" ) + suffix;
			}
			else
			{
				msg = system.functions.scmsg(  config.setting+";"+config.id, "local:settingsConfig" ) + suffix;
			}
			
			if ( system.functions.index("Could not be found:", msg ) > 0 )
			{
				msg = config.label;
			}
			node.setAttributeValue( "label", msg );
			if (isRecord)
			{
				++optionIndex;
				node.setAttributeValue( "button", optionIndex );
			}
			var index = system.functions.index( config.id, setting.settingId );
			
			if ( index > 0 )
			{
				var value = setting.settingValue[ index - 1 ];
                if ((value == null||value=="") && refSecArea!=null) {
                    index = system.functions.index(config.id, refSecArea.settingId);
                    if (index > 0) {
                        value = refSecArea.settingValue[index - 1];
                    }
                }
                if (value != null) {
                    node.setValue(value);
				}
			}
			
			///////////////////// for implemetation of QCRQ1E99859 //////////////
			if(setting.name == "Service Desk" && config.id == "sd.switch" && (value==null || value=="false")){
				node.setAttributeValue( "readonly", "true");
			}
			///////////////////// modification end ///////////////////////////////////////////////////////
			
			if (fileName === "settings" && config.readonly === true) node.setAttributeValue( "readonly", "true");
			
			if ( type == "select" )
			{
				if ( value == null )
				{
					node.setValue( config.valueList[0] );
				}
				
				var style = "combo";
				var defaultValue;
				if ( config.displayType == "radio" )
				{
					style = "radio";
				}
				node.setAttributeValue( "style", style );
				
				if (config.type == "globallist" )
				{
					//var displayList = new Datum();
					//displayList.setType(8);
					//var valueList = new Datum();
					//valueList.setType(8);
					
					var gl = new SCFile( "globallists" );
					var sql = "name=\""+config.addlTypeInfo+"\"";
					if ( gl.doSelect( sql ) == RC_SUCCESS )
					{
						config.displayList = system.functions.val( gl.display_list , 8 );
						config.valueList = system.functions.val(gl.value_list, 8 );

						var listVar = system.functions.parse( gl.list_variable, 2 );
						var localList =  system.functions.parse( gl.display_variable, 2 );
						if(localList!=null)
						{
						 config.displayList = vars[localList];
						}
						if(listVar !=null)
						{
						 config.valueList = vars[listVar];
						}
						// QCCR1E91591 Submitted: "None is not available in default category select list." 
						// if the globallist it not mandatory, add none in the top
						if(config.mandatory!=true){
							 config.displayList = system.functions.insert( config.displayList, 1, 1, "-None-");
							 config.valueList = system.functions.insert( config.valueList, 1, 1, "null");
						 }
					}
				}
				
				if(config.displayList !=null && config.valueList!=null)
				{
				for (var i = 0; i < config.valueList.length(); i++ )
				{
					option = node.addElement("option")
					if ( config.displayList[i] != null  && config.displayList[i] != "" )
					{
						if ( config.type == "list" )
						{
							var lmsg = system.functions.scmsg(  system.functions.str(config.valueList[i]), "sCfg."+config.setting+"_" + config.id );
							if ( system.functions.index("Could not be found:", lmsg ) == 0 )
							{
								option.setAttributeValue("label", lmsg );
							}
							else
							{
								option.setAttributeValue("label", config.displayList[i] );
							}
						}
						else
						{
							option.setAttributeValue("label", config.displayList[i] );
						}
					}
					else
					{
						option.setAttributeValue("label", config.valueList[i] );
					}
					option.setValue(config.valueList[i]);

					
				}
				}
				else
				{
				 if(config.displayList==null)
				  print("The value of Display Variable in Global List:\""+config.addlTypeInfo+"\" is null");
				 if(config.valueList==null) 
				  print("The value of List Variable in Global List:\""+config.addlTypeInfo+"\" is null");
				}		
				
				
			}

			
			//form = lib.xmlHelpers.addChildElement( form, node );
			
		}
		while ( config.getNext() == RC_SUCCESS );
	
	}
	
	
	
	return form.toXMLString();
}

///////////////////// for implemetation of QCRQ1E99859 //////////////
function getSettingValueFromXML( formXML, wantid )
{
	var result = null;

	var form = new XML();
		if ( formXML != null && formXML != "" )
		{
			if ( form.setContent( formXML ) )
			{
				var parent = form.getDocumentElement();
				var node = parent.getFirstChildElement();
				var value;
				
				while ( node != null )
				{
					var index;
					var id = node.getAttributeValue("id");
					
					if(wantid === id){
						return node.getValue();
					}

					node = node.getNextSiblingElement();
				}
			}

	}
	
	return result;

}
///////////////////// modification end ///////////////////////////////////////////////////////


function parseForm( formXML, settings )
{
	var result = initResult();

	var form = new XML();
		if ( formXML != null && formXML != "" )
		{
			if ( form.setContent( formXML ) )
			{
				var parent = form.getDocumentElement();
				var node = parent.getFirstChildElement();
				var value;
				
				while ( node != null )
				{
					var index;
					var id = node.getAttributeValue("id");
		
					index = system.functions.index( id, settings.settingId );
					if ( index > 0 )
					{
						var temp = lib.xmlHelpers.removeChild( node, "option", null );
						value = node.getValue();
					}
					else
					{
						settings.settingId = system.functions.insert( settings.settingId, 0, 1, id );
						index = system.functions.index( id, settings.settingId );
						value = node.getValue();
						
					}
					
					var settingsName = null;
					var fileName = system.functions.filename(settings);
					if ("secRights" == fileName) {
						settingsName = settings.area;
					} else {
						settingsName = settings.name;
					}
					result = validateSetting( id, value, settingsName );
					
					if ( result.getValue() != 0 )
					{
						return result;
					}
					
					settings.settingValue[ index - 1] = value;
					
					node = node.getNextSiblingElement();
				}
			}
		for ( var i = 0; i < settings.settingValue.length; i++ )
		{
			if ( settings.settingValue[i] == "null" )
			{
				settings.settingValue[i] = "";
			}
		}
	}
	
	return result;

}

function initResult()
{
	const RESULTXML = "<result></result>"
	var result = new XML();
	result.setContent( RESULTXML );
	result.setValue(0);
	
	return result;
}


function validateSetting( id, value, settingName )
{
	var result = initResult();
	var message = result.addElement( "message" );
	var config = new SCFile("settingsConfig");
	var sql = "setting=\""+ settingName +"\" and id=\"" + id + "\"";
	if ( config.doSelect( sql ) == RC_SUCCESS )
	{
		if ( config.type == "number" && value != null && value != "" )
		{
			var test = new SCDatum();
			test.setType(1);
			test = system.functions.val( value, 1 );
		    if ( test === null || test === "" )
			{
				result.setValue(1);
				var msg = system.functions.scmsg(config.setting+";"+config.id, "local:settingsConfig");
				if (msg == null) {
					msg = config.label;
				}
				message.setValue( system.functions.scmsg( 1, "settings", [ msg, value ] ));
				return result;
			}
		}
		
		if ( config.type == "datetime" && value != null && value != "" )
		{
			var test = new SCDatum();
			test.setType(3);
			test = system.functions.val( value, 3 );
			if ( test == null || test == "" )
			{
				result.setValue(1);
				var msg = system.functions.scmsg(config.setting+";"+config.id, "local:settingsConfig");
				if (msg == null) {
					msg = config.label;
				}
				message.setValue( system.functions.scmsg( 2, "settings", [ msg, value ] ));
				return result;
			}
		}
		
		if ( config.type == "condition" && value != null && value != "" )
		{
			var test = new SCDatum();
			test.setType(10);
			test = system.functions.evaluate( system.functions.parse( value, 4 ) );
			
			if ( test == null  )
			{
				result.setValue(1);
				var msg = system.functions.scmsg(config.setting+";"+config.id, "local:settingsConfig");
				if (msg == null) {
					msg = config.label;
				}
				message.setValue( system.functions.scmsg( 3, "settings", [ msg, value ] ));
				return result;
			}
		}
		
		if ( config.mandatory == true )
		{
			if ( value == null || value == "" )
			{
				result.setValue(1);
				var msg = system.functions.scmsg(config.setting+";"+config.id, "local:settingsConfig");
				if (msg == null) {
					msg = config.label;
				}
				message.setValue( system.functions.scmsg( 4, "settings", [ msg ] ) );
				return result;
			}
		}
		
		if ( config.validationScript != null )
		{
			var js = config.validationScript;
			try {
				eval( js );
				}
			catch ( e )
			{
				var msg = system.functions.scmsg(config.setting+";"+config.id, "local:settingsConfig");
				if (msg == null) {
					msg = config.label;
				}
				print(system.functions.scmsg( 5, "settings", [ msg ] ));
				print(e.toString());
			}
		}
		
	}

	return result;
}

function getSettingValue( name, settingName )
{
	var setting = new SCFile( "settings" );
	var sql = "name=\"" + name + "\"";

	if ( setting.doSelect( sql ) == RC_SUCCESS )
	{
		return getValue( name, settingName, setting );
	}
	return null;
}

function getAreaValue( name, settingName )
{
	var setting = new SCFile( "secArea" );
	var sql = "name=\"" + name + "\"";

	if ( setting.doSelect( sql ) == RC_SUCCESS )
	{
		return getValue( name, settingName, setting );
	}
	return null;
}


function getValue(  name, settingName, setting )
{
	var index = system.functions.index( settingName, setting.settingId );
	
	if ( index > 0 )
	{
		if(setting.settingValue[index - 1]=="null")
			 setting.settingValue[index - 1]=null;
		return setting.settingValue[index - 1];
	}
	return null;
}


function setValue(  name, settingName, setting, newValue )
{
	var index = system.functions.index( settingName, setting.settingId );
	
	if ( index > 0 )
	{
		if(setting.settingValue[index - 1]=="null"){
			 setting.settingValue[index - 1]=null;
		}
		
		setting.settingValue[index - 1] = newValue;
		return setting.settingValue[index - 1];
	}
	return null;

}

function generateValidations(buttonId,name, xmlString)
{
	//look for ID from button id
	var token="button=\""+buttonId;
	var index = xmlString.indexOf(token);
	var section = xmlString.substring(index);
	var token2="id=\"";
	var token3 = "\"";
	var index2 = section.indexOf(token2);
	var section2=section.substring(index2+4);
	var index3 = section2.indexOf(token3);
	var nodeId = section2.substring(0,index3);
	//print("nodeId is "+nodeId);
	
	var settingsConfig = new SCFile("settingsConfig");
	var sql = "setting=\""+name+"\" and id=\""+nodeId+"\"";
	if ( settingsConfig.doSelect( sql ) == RC_SUCCESS )
	{
		var validation = "<validations><string button=\""+buttonId+"\" id=\""+nodeId+"\" matchField=\""+settingsConfig.tableFieldName+"\" matchTable=\""+settingsConfig.addlTypeInfo+"\"></validations>";		
		//print("return from function "+validation);
		return validation;
	}
	
	else return "";	
}



/**
* when datadict field sec.area changed, remove allowed status and
* allowed categoies that no longer applies
*/
function syncStatusAndCategory(area)
{
	//get new allowed category for area
	var categoryList = lib.security.getAllowedCategoryForArea(area);
	//get new allowed status for area
	var statusList =  lib.security.getAllowedStatusForArea(area);
	//get secRights record with area=area
	var secRights = new SCFile("secRights");
	var sql = "area=\""+area+"\"";
	if ( secRights.doSelect(sql) == RC_SUCCESS)
	{
		do 
		{
			if (secRights.allowedCategory!=null || secRights.allowedStatus!= null)
				refreshSecRights(secRights,statusList,categoryList);
		}	
		while ( secRights.getNext() == RC_SUCCESS );	
	} 
}

/**
* check secRights record fields allowedStatus and allowedCategory to make sure
* it is current.
*/
function refreshSecRights(secRights,statusList,categoryList)
{
	//build an array with all allowedCategory that are still valid
	var newCategories = new Array();
	if (secRights.allowedCategory != null && system.functions.lng(secRights.allowedCategory)>0)
	{		
		var index = 0;
		for (var i=0;i<system.functions.lng(secRights.allowedCategory);++i)
		{
			if (indexOf(categoryList,secRights.allowedCategory[i])>=0)
			{
				newCategories[index]=secRights.allowedCategory[i];
				++index;
			}
		}
	}
	
	//build an array with all allowedStatus that are still valid
	var newStatus = new Array();
	if (secRights.allowedStatus != null && system.functions.lng(secRights.allowedStatus)>0)
	{	
		var index = 0;
		for (var i=0;i<system.functions.lng(secRights.allowedStatus);++i)
		{
			if (indexOf(statusList,secRights.allowedStatus[i])>=0)
			{
				newStatus[index]=secRights.allowedStatus[i];
				++index;
			}
		}
	}
	
	var updateRecord = false;
	if (newCategories.length != system.functions.lng(secRights.allowedCategory))
	{
		secRights.allowedCategory = newCategories;
		updateRecord = true;
	}
	if (newStatus.length != system.functions.lng(secRights.allowedStatus))
	{
		secRights.allowedStatus = newStatus;
		updateRecord = true;
	}
	if (updateRecord)
		secRights.doUpdate();	
}


/**
* when settingsConfig is deleted, make sure to remove name/value pair from secArea
* then we also need to remove name/value pair from secRights table associated with
* that area
*
*/
function onDeleteTrigger(record)
{
 	//search and find area associated with that setting
 	var secArea = new SCFile("secArea");
 	var sql = "name=\""+record.setting+"\"";
 	if (secArea.doSelect(sql) == RC_SUCCESS)
 	{
 		//check for name value pair
 		if (secArea.settingId != null && secArea.settingId.length() != 0)
 		{
 			var index = -1
 			for (var i=0;i<secArea.settingId.length();++i)
 			{
 				if(secArea.settingId[i] == record.id) 
 				{
 					index = i+1;
 					break;
 				}	
 			}
 			if (index>0) 
 			{
 				var waitMsg = system.functions.scmsg(6,"settings");
 				print(waitMsg);
 				
 				//remove name from name value pair
 				secArea.settingId = system.functions._delete(secArea.settingId,index);
 				
 				//remove value from name value pair
 				secArea.settingValue = system.functions._delete(secArea.settingValue,index);
 				secArea.doUpdate();
 				
 				//after update area, we also need to update secRights associated with that area
 				var secRights = new SCFile("secRights");
 				var sqlRights = "area=\""+secArea.name+"\"";
 				if (secRights.doSelect(sqlRights) == RC_SUCCESS)
 				{
 					do 
 					{
 						if (secRights.settingId != null && secRights.settingId.length() != 0)
 						{
 							var index2 = -1
 							for (var i=0;i<secRights.settingId.length();++i)
 							{
 								if(secRights.settingId[i] == record.id) 
 								{
 									index2 = i+1;
 									break;
 								}	
 							}
 							if (index2>0)
 							{								
 								secRights.settingId = system.functions._delete(secRights.settingId,index2);
 								secRights.settingValue = system.functions._delete(secRights.settingValue,index2);
 								secRights.doUpdate();
 							}
 						}		
 					}	
 					while ( secRights.getNext() == RC_SUCCESS );	
 				}
 			}	
 		}			
 	} 
}

function indexOf(array,element)
{
	if (array == null || array.length == 0)
		return -1;
	for (i=0; i<array.length;++i)
	{
		if (array[i] == element)
			return i;
	}
	return -1;
}

function localizeManualList( record, oldrecord )
{
	if ( record.type == "list" || oldrecord.type == "list" )
	{
		if (  oldrecord.valueList != record.valueList )
		{
			var msgclass = "sCfg."+record.setting+"_"+record.id;
			var actionType = "add";
			var ids = new Array();
			var labels = new Array();
			for ( var i in record.valueList )
			{
				ids.push( record.valueList[i] );
				labels.push( record.displayList[i] );
			}
			
			var language;
			language = "en";
			if ( vars.$G_my_language != null )
			{
				language = vars.$G_my_language;
			}
			
			lib.localizeTable.localizeList( ids, labels, language, msgclass, actionType )
			
			var deleteFields = new Array();
			
			for ( var j in oldrecord.valueList )
			{
				var match = false;
				for ( var i in record.valueList )
				{
					if ( record.valueList[i] == oldrecord.valueList[j] )
					{
						match = true;
					}
				}
				
				if ( match == false )
				{
					deleteFields.push( oldrecord.valueList[j] );
				}
			}
		
			if ( deleteFields != null )
			{
				var deleteAction = "delete";
				lib.localizeTable.localizeList( deleteFields, null, language, msgclass, deleteAction )
			}
		}
	}
}


function validateNonNegtive(value, result, setting, id, message)
{
	if(value!=null && value!="" && value<0) {
  		result.setValue(1);
 	    var msg = system.functions.scmsg(setting+";"+ id, "local:settingsConfig");
 	    message.setValue( system.functions.scmsg( 1, "settings", [ msg, value ] ));
	}
}
