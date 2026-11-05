var log = new lib.GatewayAPI_Logger.log( 'GatewayAPI_dynamicFormValidation' );
var parseDateRangeValidation = lib.GatewayAPI_DVD_Utility.parseDateRangeValidation;

/** This function adds or updates a validation node based on the passed in ID.
*	The function relys on several RAD variables being set.
*
*	@param {xmlString} 	-	the xml String containing the validation information
*	@param {string} id    - the xml field name to be added/updated
*	@return The new xml String
*   @type xmlString
*/
function addValidation( xmlString, id )
{
	var xml = new XML();
	
	if ( xmlString == null || xmlString == "" )
		xmlString="<validations></validations>";
	if ( xml.setContent(xmlString) ) 
	{
		var type = vars.$field_type;
		if ( type == null )
			type = "string";
		var node = new XML( type );

		if ( id != null )
			node.setAttributeValue("id", id);
			
		if ( vars.$mandatory !="" && vars.$mandatory != null && vars.$mandatory != "false")
			node.setAttributeValue("mandatory",vars.$mandatory);
			
		if ( vars.$match_type != null )
		{
			if ( vars.$match_type == "table" )
			{	
				if ( vars.$match_field != null && vars.$match_field != "" )
				{
					node.setAttributeValue( "matchField", vars.$match_field );
					node.setAttributeValue( "matchTable", vars.$match_table );
				}
			}
			if ( vars.$match_group != null && vars.$match_group != "" && system.functions.type( vars.$match_group) == 8 )
				{
			
					var lng = system.functions.lng(vars.$match_group);
					var groupNode = new XML( "matchGroup" );
					for (var i = 0; i < lng; i++ )
					{
						vars.$match_group.setType(8);
						var childNode = new XML( "groupField" );
						if ( vars.$match_group[i] != null && vars.$match_group[i] != "null" )
						{
							childNode.setValue( vars.$match_group[i] );
							groupNode = lib.xmlHelpers.addChildElement( groupNode, childNode );
						}
					}
					node = lib.xmlHelpers.addChildElement( node, groupNode );
				}
			if ( vars.$match_type == "list" )
			{
				var lng = vars.$match_values.length();
				for (var i = 0; i < lng; i++ )
				{
					if ( vars.$match_values[i] != null && vars.$match_values[i] != "" )
					{
						var item = node.addElement( "value" );
						item.setValue( vars.$match_values[i] );
					}
				}
			}
		}
		if ( vars.$field_type == "number" )
		{
			if ( vars.$gt != null )
				node.setAttributeValue( vars.$gte, vars.$gt );
			if ( vars.$lt != null )
				node.setAttributeValue( vars.$lte, vars.$lt );
		}
		
		if ( vars.$field_type == "date" )
		{
			
			if ( vars.$gt != null )
			{
				var date = new Datum();
				date = lib.tzFunctions.convertDatetoString(system.functions.val( vars.$gt, 3 ),6);
				node.setAttributeValue( vars.$gte, date );	
			}
			if ( vars.$lt != null )
			{
				var date = new Datum();
				date = lib.tzFunctions.convertDatetoString(system.functions.val( vars.$lt, 3 ),6);
				node.setAttributeValue( vars.$lte, date );
			}
		}
		
		xml = lib.xmlHelpers.addReplaceChild( xml, node, "id" );
		
		return xml.toXMLString();
	}
	
	return xmlString;
}

/** This function returns the validation text for a specified dynamic field node.
*
*	@param {string} name    - the xml field name to be checked for validation
*	@param {xmlString} 	-	the xml String containing the validation information
*	@return The String containing the validation rules for the field
*   @type String
*/
function setValidationText( name, xmlString )
{
	var xml = new XML();
	var valString = "";
	if ( xmlString == null || xmlString == "" )
		xmlString = "<validations></validations>";
	if ( xml.setContent( xmlString ) )
	{
		var node = lib.xmlHelpers.getElement( xml, name, "id" );
		if ( node != null )
		{
			
			if ( node.getAttributeValue("mandatory") != null && node.getAttributeValue("mandatory") != "" && node.getAttributeValue("mandatory") != "false")
					valString = "Mandatory.  ";
		
			if ( node.getAttributeValue("matchField") != null && node.getAttributeValue("matchTable") != null && 
			     node.getAttributeValue("matchField") != "" && node.getAttributeValue("matchTable") != "" )		
				valString += "Must match the " + node.getAttributeValue("matchField") 
				  + " field in the " + node.getAttributeValue("matchTable") + " table.  ";
				  
			if ( node["value"] != null )
				valString += system.functions.scmsg(13, "dfwxml")+"  ";
			
			if ( node.getAttributeValue("gt") != null && node.getAttributeValue("gt") != "" )
				valString += system.functions.scmsg(14, "dfwxml") +" "+ node.getAttributeValue("gt") + ".  ";
				
			if ( node.getAttributeValue("gte") != null && node.getAttributeValue("gte") != "" )
				valString += system.functions.scmsg(15, "dfwxml") +" " + node.getAttributeValue("gte") + ".  ";
			
			if ( node.getAttributeValue("lt") != null && node.getAttributeValue("lt") != "" )
				valString += system.functions.scmsg(16, "dfwxml") +" " + node.getAttributeValue("lt") + ".  ";
				
			if ( node.getAttributeValue("lte") != null && node.getAttributeValue("lte") != "" )
				valString += system.functions.scmsg(17, "dfwxml") +" " + node.getAttributeValue("lte") + ".  ";
		}

		
		return valString;
	}
}

/** This function determines if the requested.for is valid.  If null, it also prints a message.
*
*	@param {String} strRequestedFor		- the string for $requested.for field
*	@return True if the field is valid, false if not
*   @type Boolean
*/
function requestedForIsValid( strRequestedFor )
{
  if (strRequestedFor == null || strRequestedFor == "" )
  {
    print( system.functions.scmsg( 1203, "fc" ) );
    return false;
  }
  else
    return true;
}

/** This function determines if the dynamic form is valid or not.  If not it also prints a message that states what is not valid.
*
*	@param {XML String} form	    	- the dynamic form to be checked for validation
*	@param {XML String} validations 	- The XML String containing the validation rules.
*	@return True if the field is valid, false if not
*   @type Boolean
*/
function formIsValid( formObj, validations, isInCatalogManagement, requestedFor, requestedForType, requestedForDept, delivery, serviceSLA, quantity)
{
	var form=formObj;//add 4 rows from first line.
    if (typeof formObj != "string") //cart Item
    {
        form = formObj.options;
        if (!formObj.bundle) {
          requestedFor =  formObj['requested.for']
          requestedForType =  formObj['requested.for.type']
          requestedForDept =  formObj['requested.for.dept']
        }
    }
	
	var xml = new XML();
	validations = parseDateRangeValidation(validations);
	
	var msg;
	if ( xml.setContent( form ) )
	{
		xml.setAttributeValue("ignoreDvd", true);//add this line
		var node = xml.getFirstChildElement();
		while ( node != null && msg == null )
		{
			var visible = true; // for backwards compliant: no "visible" attribute before 9.32, by defualt take it true;
			var visibleAttribute = node.getAttributeNode("visible");

			if (visibleAttribute) {
				var visibleValue = node.getAttributeValue("visible");
				if (!isInCatalogManagement && visibleValue) {
					var visibleConverted = replaceHardcodedVariable(node.getAttributeValue("visible"), requestedFor, requestedForType, requestedForDept, delivery, serviceSLA, quantity);
					visibleConverted = lib.GatewayAPI_xmlFill.replaceElementValue(form, validations, visibleConverted);
					visible = system.functions.parse_evaluate( visibleConverted, 4);
				}			
			}
			// node.setAttributeValue("visible", visible);
			node.setAttributeValue("visibleResult", visible); //set "visibleResult" based on whether it’s visible for submitter.
			if (visible) {
				msg = elementIsValid( node, validations, form, isInCatalogManagement, requestedFor, requestedForType, requestedForDept, delivery, serviceSLA, quantity );
			} else {
				// lib.dynamicFormGenerator.setValue(node,""); //clear the value if it is invisible.
			}
			node = node.getNextSiblingElement();
		}
		//after the while loop, set the options back with the xml object’s content.
		if (typeof formObj != "string") {
			formObj.options = xml.toXMLString();
		} else {
			formObj = xml.toXMLString();
		}
	}
	return msg;
}



/** This function determines if a element of the dynamic form is valid or not.  If not it also prints a message that states what is not valid.
*
*	@param {element} element	    	- the xml element from the dynamic form to be checked for validation
*	@param {XML String} validations 	- The XML String containing the validation rules.
*	@return True if the field is valid, false if not
*   @type Boolean
*/
function elementIsValid( element, validations, form, isInCatalogManagement, requestedFor, requestedForType, requestedForDept, delivery, serviceSLA, quantity )
{
	var xml = new XML();
	if ( element != null )
	{
		var name = element.getAttributeValue("id");
		var label = element.getAttributeValue("label");
		var value = element.getValue();
		
		if ( validations != null )
		{
			if ( xml.setContent( validations ) )
			{
				rules = lib.xmlHelpers.getElement( xml, name, "id" );
				if ( rules != null )
				{
					var type = rules.getName();

					if ( value == null || value =="" )
					{
						if ( !isInCatalogManagement )
						{
							if (rules.getAttributeValue("mandatory") != null && rules.getAttributeValue("mandatory") != "" && rules.getAttributeValue("mandatory") != "false") {
								if  (isMandatory( name, label, value, rules, form, validations, requestedFor, requestedForType, requestedForDept, delivery, serviceSLA, quantity)){
									var msg = system.functions.scmsg(117, "ScriptLibrary", [label]);
									return msg;
								}								
							}				
						}
					}
					
					if ( type == "string" )
						return isValidString( name, label, value, rules, form, validations, requestedFor, requestedForType, requestedForDept, delivery, serviceSLA, quantity);
						
					if ( type == "number" )
						return isValidNumber( name, label, value, rules );
						
					if ( type == "date" )
						return isValidDate( name, label, value, rules );
					
				}	
			}		
		}
	}
	return null;
}

/** This function determines if a mandatory condition field is valid or not.  
*
*	@param {String} name	    	- the name of the field to be checked.
*	@param {String} label	    	- the name of the field to be checked.
*	@param {String} value	    	- the name of the field to be checked.
*	@param {XML} 	rules	    	- xml of options
*	@param {XML} 	validations	    - xml of option.validation
*	@return True if the field is valid, false if not
*   @type Boolean
*/
function isMandatory( name, label, value, rules, form, validations, requestedFor, requestedForType, requestedForDept, delivery, serviceSLA, quantity )
{
	var condition = rules.getAttributeValue("mandatory");
	
	if ( condition!=null && condition !="" && condition != "false")
	{
	 	var conditionConverted = replaceHardcodedVariable(condition, requestedFor, requestedForType, requestedForDept, delivery, serviceSLA, quantity);
		conditionConverted = lib.GatewayAPI_xmlFill.replaceElementValue(form, validations, conditionConverted);
		 
		var conditionEva = system.functions.parse_evaluate( conditionConverted, 4);
	 
		return conditionEva;
		
	} 
}

/** This function determines if a string field is valid or not.  If not it also prints a message that states what is not valid.
*
*	@param {String} name	    	- the name of the field to be checked.
*	@param {String} label	    	- the name of the field to be checked.
*	@param {String} value	    	- the name of the field to be checked.
*	@param {XML} 	rules	    	- the name of the field to be checked.
*	@return True if the field is valid, false if not
*   @type Boolean
*/
function isValidString( name, label, value, rules, form, validations, requestedFor, requestedForType, requestedForDept, delivery, serviceSLA, quantity)
{
	var field = rules.getAttributeValue("matchField");
	var table = rules.getAttributeValue("matchTable");
	var query = rules.getAttributeValue("query");	
	var multiSelections = parseInt(rules.getAttributeValue("multiSelections"));
	query = replaceHardcodedVariable(query, requestedFor, requestedForType, requestedForDept, delivery, serviceSLA, quantity);
	if ( field != null && table != null && 
			     field != "" && table != "" && value != null && value !="" && multiSelections != null)
	{
		value=lib.StringUtil.escapeAllStr(value);
		var fieldValues = value.split("\n");

		var file = new SCFile( table );
		for (var i = 0; i < fieldValues.length; i++)
		 {
		 var fieldValue = fieldValues[i];
		 var sql = field + " = \"" + fieldValue + "\"";
		 if( multiSelections > 1 && (fieldValue == null || fieldValue == ""))
		    continue;
		
		if (query != null && query != ''){
			var query = lib.GatewayAPI_xmlFill.replaceElementValue(form, validations, query);
			sql = sql + " and " + query;
		}
		//start for logical name
		var fields = new Array();
		fields.push("*");
		sql=system.functions.generate_sql_query(fields, sql, table, false);
		//end for logical name
		
		if ( file.doSelect( sql ) == RC_SUCCESS )
			continue;
		else
		{
			var fDbdict=lib.dbdictHelper.initDbdictFile(table);
			var fieldType= lib.dbdictHelper.getFieldType(fDbdict,field);
			if(fieldType==8)
			{
				continue; 
			}
			var msg = system.functions.scmsg(118, "ScriptLibrary", [fieldValue, table])
			return msg;
		}
		
		}
		return null;
	}
	var matchScript = rules.getAttributeValue("matchScript");
    if (matchScript != null && matchScript != "") {
       return null;
    }
	
	var list = rules.getFirstChildElement();
	
	if ( list != null )
	{
		while ( list != null )
		{
			if ( list.getValue() == value )
				return null;
			
			list = list.getNextSiblingElement();
		}
		
		var msg = system.functions.scmsg(119, "ScriptLibrary", [value])
		return msg;
		
	}
	return null;
}

function replaceHardcodedVariable(query, requestedFor, requestedForType, requestedForDept, delivery, serviceSLA, quantity) {
	query = query.replace(/\$requested.for.dept/g, "\""+requestedForDept+"\"");
	query = query.replace(/\$requested.for.type/g, "\""+requestedForType+"\"");
	query = query.replace(/\$requested.for/g, "\""+requestedFor+"\"");
	query = query.replace(/\$delivery/g, "\""+delivery+"\"");
	query = query.replace(/\$service.sla/g, "\""+serviceSLA+"\"");
	query = query.replace(/\$quantity/g, quantity);
	return query;
}

/** This function determines if a number field is valid or not.  If not it also prints a message that states what is not valid.
*
*	@param {String} name	    	- the name of the field to be checked.
*	@param {String} label	    	- the name of the field to be checked.
*	@param {String} value	    	- the name of the field to be checked.
*	@param {XML} 	rules	    	- the name of the field to be checked.
*	@return True if the field is valid, false if not
*   @type Boolean
*/
function isValidNumber( name, label, value, rules )
{
	if ( value != null && value != "")
	{
		value = system.functions.val( value );
		if ( value == null )
		{
			var msg = system.functions.scmsg(120, "ScriptLibrary", [label])
			return msg;
		}
	
		var gt = rules.getAttributeValue("gt");
		var gte = rules.getAttributeValue("gte");
		var lt = rules.getAttributeValue("lt");
		var lte = rules.getAttributeValue("lte");
	
		if ( gt != null && gt != "" )
		{
			if ( value <= gt )
				{
					var msg = system.functions.scmsg(121, "ScriptLibrary", [label, gt])
					return msg;
				}
		}
		
		if ( gte != null && gte != "" )
		{
			if ( value < gte )
				{
					var msg = system.functions.scmsg(122, "ScriptLibrary", [label, gte])
					return msg;
				}
		}
		
		if ( lt != null && lt != "" )
		{
			if ( value >= lt )
				{
					var msg = system.functions.scmsg(123, "ScriptLibrary", [label, lt])
					return msg;
				}
		}
		if ( lte != null && lte != "" )
		{
			if ( value > lte )
				{
					var msg = system.functions.scmsg(124, "ScriptLibrary", [label, lte])
					return msg;
				}
		}
	}
	return null;
}


/** This function determines if a date field is valid or not.  If not it also prints a message that states what is not valid.
*
*	@param {String} name	    	- the name of the field to be checked.
*	@param {String} label	    	- the name of the field to be checked.
*	@param {String} value	    	- the name of the field to be checked.
*	@param {XML} 	rules	    	- the name of the field to be checked.
*	@return True if the field is valid, false if not
*   @type Boolean
*/
function isValidDate( name, label, value, rules, msg )
{
	if ( value != null && value != "")
	{
		var svalue = covertGMTDateStringToDate(value);
		if(vars['$G.src']!=true)
		{
			svalue = system.functions.val(value,3);
		}
		if (!svalue)
		{
			var msg = system.functions.scmsg(125, "ScriptLibrary", [label])
			return msg;	
		}
		
		var inbound_sgt = rules.getAttributeValue("gt");
		var inbound_sgte = rules.getAttributeValue("gte");
		var inbound_slt =rules.getAttributeValue("lt");
		var inbound_slte =rules.getAttributeValue("lte");
   
	    var gt = covertGMTDateStringToDate(inbound_sgt);
	    var gte = covertGMTDateStringToDate(inbound_sgte);
	    var lt = covertGMTDateStringToDate(inbound_slt);
	    var lte = covertGMTDateStringToDate(inbound_slte);
	    
		if ( gt != null && gt != "" )
		{
			if ( svalue <= gt )
				{
					var msg = system.functions.scmsg(121, "ScriptLibrary", [label, gt])
					return msg;		
				}
		}
		
		if ( gte != null && gte != "" )
		{
			if ( svalue < gte )
				{
					msg = system.functions.scmsg(122, "ScriptLibrary", [label, gte])
					return msg;
				}
		}
		
		if ( lt != null && lt != "" )
		{
			if ( svalue >= lt )
				{
					var msg = system.functions.scmsg(123, "ScriptLibrary", [label, lt])
					return msg;
				}
		}
		if ( lte != null && lte != "" )
		{
			if ( svalue > lte )
				{
					var msg = system.functions.scmsg(124, "ScriptLibrary", [label, lte])
					return msg;
				}
		}
	}
	return null;
}

function covertGMTDateStringToDate(dateStr) {
	if (dateStr && dateStr != "") {
		var value_local = lib.tzFunctions.convertDateStringToLocal(dateStr, 6);
		var date = system.functions.val( value_local , 3);
		return date;
	}
	return null;	
}

/** This function adds/modifies button ids for text elements that have match tables and fields.
*
*	@param {xmlString} 	-	the xml String containing the validation information
*	@return The new xml String
*   @type xmlString
*/
function addButtonIds( xmlString )
{
	var xml = new XML();
	if ( xmlString == null || xmlString == "" )
		xmlString="<validations></validations>"
	if ( xml.setContent( xmlString ) )
	{
		var node = xml.getFirstChildElement();
		var i = 4001;
		while ( node != null)
		{
			if ( node.getAttributeValue("matchField") != null && node.getAttributeValue("matchTable") != null && 
			     node.getAttributeValue("matchField") != "" && node.getAttributeValue("matchTable") != "" )
			{
				node.setAttributeValue( "button", i );
				i++;	
				
			}
			else
				node.setAttributeValue( "button", 0);
			node = node.getNextSiblingElement();
		}
		
		return xml.toXMLString();
	}
	
	return xmlString;
}

