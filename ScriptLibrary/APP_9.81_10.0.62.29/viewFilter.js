/**  @fileoverview viewFilter - A collection of functions that are used to set the filter information
*   	for views.
*	@author	Pete Budic
*/

/**  This function is used create the dynamic form that contain choice information.
*
*	@param {Record}	config	- the ViewFilter record containing the available choices
*   @param {Record} view	- the current view/inbox record
*	@return	the dynamic form containing the choices.
*	@type	XMLString
*/
function getChoiceForm( config, view )
{
	var form="<form>";
	var label = "";
	var msgId = "";
	for (var i = 0, iLoopTimes = config.choices.length(); i < iLoopTimes; i++ )
	{
		var set = false;
		for (var j = 0, jLoopTimes = view.choices.length(); j < jLoopTimes; j++ )
		{
			if ( view.choices[j] == config.choices[i].id )
			{
				set = true;
				break;
			}
		}
		
		msgId = config.tablename + ":" + config.choices[i].id;
		label = system.functions.scmsg( msgId, "SearchConfig" );
		
		if ( label == null )
		{
			label = config.choices[i].description;
		}
		if ( set == true )
		{
			form+="<checkbox id=\""+ config.choices[i].id + "\" label=\"" + label
			      + "\">true</checkbox>";
		}
		else
		{
			form+="<checkbox id=\""+ config.choices[i].id + "\" label=\"" + label
			      + "\"/>";
		}
	}
	
	form+="</form>";
	
	return form;
}

/**  This function is used save the choice information
*
*	@param {Record}	config	- the ViewFilter record containing the available choices
*   @param {Record} view	- the current view/inbox record
*	@return	success flag
*	@type	Boolean
*/
function setChoiceForm( form, config, view )
{
	var xml = new XML();
	var element;
	var pos = 0;
	if ( form != null )
	{
		if ( xml.setContent( form ) )
		{
			
			element = xml.getFirstChildElement();
			
			while ( element != null)
			{
				if ( element.getValue() == "true" )
				{
					view.choices[pos] = element.getAttributeValue("id");
					pos+=1;
				}
				element = element.getNextSiblingElement();
				
			}
		}
	}
	
	return true;
}



/**  This function is used to pull in the standard search information into the view filter
*		edit routine.
*
*   @param {Record} view	- the current view/inbox record
*	@param {Record} table	- the table that is being filtered
*	@param {String} tablename - the name of the table that is being filtered
*/
function setSearchFields( view, table, tablename)
{
	var datadict = new SCFile("datadict");
	var sql = "name=\"" + tablename + "\"";
	var pos =  system.functions.lng(view.search_fields);
	if ( datadict.doSelect( sql ) == RC_SUCCESS )
	{
		for ( i = 0, iLoopTimes = datadict.fields.length(); i < iLoopTimes; i++ )
		{
			if(datadict.fields[i] == null)
				continue;
			var temp = null;
			var field = datadict.fields[i];
			var comma = 0;
			
			comma = field.lastIndexOf(',');
			if ( comma > 0 )
			{
				field = field.substring(comma+1);
			}
			temp = table[field]; // the same behavior if we add "." or "_" before the field name
			
			var temp = system.functions.str( system.functions.denull( temp ) );
			if ( temp != null && temp != "{}" )
			{
				view.search_fields[pos] = datadict.fields[i];
				view.search_values[pos] = temp;
				pos++;
			}
		}
	}
	return true;
}

/**  This function is used save the choice information
*
*	@param {Record}	config	- the ViewFilter record containing the available choices
*   @param {Record} view	- the current view/inbox record
*	@return	Query for choices
*	@type	String
*/
function setChoiceQuery( config, view )
{
	var sql = "";
	for ( var i = 0, iLoopTimes = view.choices.length(); i < iLoopTimes; i++ )
	{
		for ( var x = 0, xLoopTimes = config.choices.length(); x < xLoopTimes; x++ )
		{
			if ( config.choices[x].id == view.choices[i] )
			{
				if ( sql == null || sql=="" )
				{
					sql = "("+config.choices[x].query+")";
				}
				else
				{
					sql += " and ("+config.choices[x].query+")";
				}
			}
		}
	}
	return sql;
}

/**  This function is used to create/edit/delete the scmessage records associated with
*	the query choices in the ViewFilter record.
*
*	@param {Record}	config	- the ViewFilter record containing the available choices
*   @param {Record} oldConfig - the saved copy of the ViewFilter record
*	@return	whether or not the function was successful
*	@type	Boolean
*/
function createChoiceMessages( config, oldConfig )
{

	var lng = system.functions.denull(config.choices).length();
	var table = config.tablename;
	if ( oldConfig == null )
	{

		return true;
	}
	var oldlng = system.functions.denull(oldConfig.choices).length();

	var success = true;
	
	for (var i=0; i < lng; i++)
	{
		var one = config.choices[i].id;
		var two = config.choices[i].description;
		
		addUpdateChoice( table, one, two )
		
	}
	
	for (var i=0; i < oldlng; i++)
	{
		var remove = true;
		for (var j=0; j < lng; j++ )
		{
			
			if ( config.choices[j].id == oldConfig.choices[i].id )
			{
				remove=false;
			}
		}
		if ( remove )
		{
			success = removeChoice( table, oldConfig.choices[i].id );
		}
	}
	
	return true;
}

/**  This function is used to create/edit the scmessage records associated with
*	the query choices in the ViewFilter record.
*
*	@param {String}	tablename - the name of the associated table
*	@param {String} id 			- the id of the choice
*	@param {String} desc			- the message in the current language.
*	@return	whether or not the function was successful
*	@type	Boolean
*/
function addUpdateChoice( tablename, id, desc )
{
	if ( id == null)
	{
		return;
	}
	var msg = new SCFile("scmessage");
	var msgId = tablename + ":" + id;
	var msgClass = "SearchConfig";
	var sql = "class=\"" + msgClass + "\" and message.id=\"" + msgId + "\"";
	
	if ( msg.doSelect( sql ) == RC_SUCCESS )
	{
		if ( msg.message != desc )
		{
			msg.message = desc;
			msg.doAction("save");
		}
	}
	else
	{
		msg.message = desc;
		msg.message_id = msgId;
		msg.severity = 1;
		msg._class = msgClass;
		msg.doAction("add");
	}
	return;
}

/**  This function is used to delete the scmessage records associated with
*	the query choices in the ViewFilter record.
*
*	@param {String}	tablename - the name of the associated table
*	@param {String} id 			- the id of the choice
*	@return	whether or not the function was successful
*	@type	Boolean
*/
function removeChoice( tablename, id )
{
	var msg = new SCFile("scmessage");
	var msgId = tablename + ":" + id;
	var msgClass = "SearchConfig";
	var sql = "class=\"" + msgClass + "\" and message.id=\"" + msgId + "\"";
	
	if ( msg.doSelect( sql ) == RC_SUCCESS )
	{
		msg.doAction("delete");
	}	
	
	return true;
}

/**  This function is used to delete all of the scmessage records associated with
*	the query choices in the ViewFilter record.
*
*	@param {Record}	config - the ViewFilter record containing the available choices
*	@return	whether or not the function was successful
*	@type	Boolean
*/
function removeAllChoices( config )
{
	for (var i = 0, iLoopTimes = config.choices.length(); i < iLoopTimes; i++)
	{
		var success = removeChoice( config.tablename, config.choices[i].id );
	}
}

/**
 * QCCR62947
 * Because the type of field 'search.values' in db 'inbox' is Character, so tansform the values of search.values to string for saving correctly.
 * 
 */
function revaluateSearchValues( inbox ) {
	var searchValues = inbox.search_values;
	if( searchValues != null ) {
		var values = [];
		var _str = system.functions.str;
		var n = searchValues.length();
		while( n-- ) {
			values[n] = _str( searchValues[n] );
		}
		inbox.search_values = values;
	}
}


function findCompoundEnd(filter, begin) {
	var count = 1;
	begin = begin-1;
	for(var k=begin+1;k<filter.filterList.length();k++) {
		if(filter.filterList[k].type=='compound') {
			count++;
		} else if (filter.filterList[k].type=='compoundend') {
			count--;			
		}
		
		if(count==0) {
			return k-begin+1;
		}
	}
	
	return 1;
}
/*Translate logical symbol to local language*/
function translateLogicalValue(logicalValue){
  var cord = logicalValue;
    if(logicalValue=="and"){
       cord = funcs.scmsg( 30, "view" );
    }else if(logicalValue=="or"){
       cord = funcs.scmsg( 31, "view" );
    }
    return cord;
}