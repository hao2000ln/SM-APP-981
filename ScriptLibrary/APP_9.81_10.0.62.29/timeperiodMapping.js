/**
* @fileoverview  Handles functionality associated with calendar mappings.
* @author Jan Steube
* @date January 2013
*/


var log = getLog("timeperiodMapping");

/**
*  This function get the Calendar Settings available objects for the calendar mapping.
*  It returns the dbdict names from the setting file

*  	History:
*	2013-01-29, Jan Steube - function created
*	
*  @param 	{string} 	setting ID 					- the setting id of the required property in the settings file
*  @returns {array, array} 	dbdicts, dbdictNames	- the identified dbdicts and dbdictNames
*/

function getCalendarMappingObjects() 
{
	var dbdicts 	= [];
	var dbdictNames	= [];
	
	// timeperiods are alaways available in the calendar mapping
	var fieldString = "timeperiodDefinition" + ",";
	try {
		//get the objects and their friendly name
		fieldString += lib.settings.getSettingValue( "Calendar", "availableObjects" );
		dbdicts = fieldString.split(",");
		dbdicts = lib.ArrayUtil.removeDuplicateEmptyElement(dbdicts);
		dbdicts	= dbdicts.sort();
        
		var i;	
		for ( i = 0; i < dbdicts.length; i++ ) {	
    		dbdicts[i] = dbdicts[i].replace(/^\s*/, '').replace(/\s*$/, ''); 
    		dbdictNames.push(funcs.scmsg(dbdicts[i], "tablename"));
		}
		
		return [dbdicts, dbdictNames];
	}
    catch( ex ) {
        log.error( "exception: " + ex );
    }
	
	return ["",""];
	
}

/**
*  This function gets the field names from the dbdicts available in the calendar mapping.
*  It returns the dbdict names from the setting file

*  	History:
*	2013-01-29, Jan Steube - function created
*	
*  @param 	{string} 	- the table name
*  @returns {array} 	- the field names
*/

function getFieldData(tableName)
{
    return lib.GetFieldNames.getFieldData(tableName);
}

function getDateTimeFieldData(tableName)
{
    var datafields = lib.ArrayUtil.toJsArray(getFieldData(tableName));
    var list = new SCDatum();
    list.setType(8);
    var dbdict = new SCFile("dbdict");
    var query = "name=\""+ tableName +"\"";
    var ret = dbdict.doSelect(query);
    if (ret == RC_SUCCESS)
    {
        var j;
        var length = dbdict.field.length();
        for(j = 0; j < length; j++)
        {
            if (dbdict.field[j].type==3 && lib.ArrayUtil.contains(datafields, dbdict.field[j].name)) {
                list.push(dbdict.field[j].name);
            }
        }
    }
	return list;
}

/**
*  This function gets the caption names from the dbdicts available in the calendar mapping.
*  It returns the dbdict names from the setting file

*  	History:
*	2013-01-29, Jan Steube - function created
*	
*  @param 	{array of string} 	- the field names
*  @param 	{string} 			- the table name
*  @returns {array} 			- the caption names
*/
function getFieldCaptions(fields, tableName)
{
	  return lib.convertToCaptions.getFieldCaptions(fields, tableName);
}


/**
*  This function generates the HTML code for the color picker

*  	History:
*	2013-01-29, Jan Steube - function created
*	
*  @returns {string} 	- the HTML code
*/

function colorPicker() {
	return lib.colorPicker.colorPicker();
}

/**
*  This function displayes the selected color

*  	History:
*	2013-01-29, Jan Steube - function created
*	
*  @param 	{string} 	- the HTML color
*  @returns {string} 	- the HTML code
*/

function currentColor(color) {
	return lib.colorPicker.currentColor(color);
}



function populateColors(record, color, conditionXML, colorDesc, position)
{
	var i = position -1;
	//if ( i==0 ) record.colors = [];
	var values = lib.conditionXmlParser.getRadQueryFromCondtionXml(conditionXML);
	var condition = values[0];
	var conditionDesc = values[1];
	
	if (condition==null || condition=="" || condition==true || condition=="true" || condition=="(true)") {
		record.colors[i].condition = "true";
	}
	else if (condition == false || condition == "false" || condition == "(false)") {
		record.colors[i].condition = "false";
	}
	else {
		record.colors[i].condition = funcs.val(condition, 10 );
	}

	record.colors[i].color		 	= color;
	record.colors[i].conditionXML 	= conditionXML;
	record.colors[i].conditionDesc 	= conditionDesc;
	record.colors[i].colorDesc 		= colorDesc;	
}

function removeColors(record, position)
{
	record.colors=funcs._delete(record.colors,position,1);
}


function colorcode_validate(colorcode)
{
     return lib.colorPicker.validateColor(colorcode);
}


