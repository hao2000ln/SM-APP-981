/**  @fileoverview viewFunctions - A collection of functions that are used when dealing with views.
*	@author	Pete Budic
*/

/**  This function is used to determine if a personal view has a corresponding system view.
*
*   @param {Record} view	- the current view/inbox record
*	@return	true if there is a system view, false if not.
*	@type	Boolean
*/
function hasSystemView(  view )
{
	var temp = new SCFile("inbox", SCFILE_READONLY);
	temp.setFields(["inbox.id"]);
	var sql = "inbox.name=\"" + lib.StringUtil.escapeAllStr(view.inbox_name) + "\" and inbox.type=\"" + view.inbox_type 
			   + "\" and operator.name=\"%NONE%\"";
   
	if ( temp.doSelect( sql ) == RC_SUCCESS ) {
		return true;
	}
	else {
		return false;
	}
}

/**  This function is used to setup variables used when displaying a view
*
*   @param {Record} view	- the current view/inbox record
*	@return	true if there is a system view, false if not.
*	@type	Boolean
*/
function initVars(  view )
{
	var list = lib.convertToCaptions.getFieldCaptions( view.fieldlist, view.inbox_type);
	var listText;

	if ( list.length() > 0 )
	{
		listText = list[0];
		var i;
		var iLoopTimes = list.length();
		for (i = 1; i < iLoopTimes; i++ )
		{
			listText+= "; "+list[i];
		}
	}
	vars.$L_field_list = listText;
	
	return true;
}

function parseQueryString(query)
{
	var semicolon = query.indexOf(";");
    if ( semicolon < 0 ) {
	  return query;
	}
	
	var index=query.indexOf("\"");
	var subQuery=query.substring(1,index);
	
	var afterQuery=query.substring(index);
	var aList=subQuery.split(" ");
	
	var parsedQuery="";
	var i;
	for(i=0;i<aList.length;++i)
	{
		parsedQuery+=aList[i];
	}
	parsedQuery=parsedQuery+afterQuery;
	return parsedQuery;
}


/**
 * check whether the query is related object query
 *
 * @param   {String}    query
 * @returns {String}    "true" or "false"
 */
function isRelatedObjectQuery(query) {
    /*
     * a relate object query has semicolon in the field name like below:
     * probsummary;assignment;assignment;name;assignment;coordinator.incident="Incident.Coordinator"
     */

    // use lastIndexOf() because related query usually in the last part
    var semicolon = query.lastIndexOf(";");

    while (semicolon >= 0) {
        // check quote after semicolon 
        var quote = query.indexOf('"', semicolon + 1);

        // quote not exists
        if (quote == -1) {
            return "true";
        }

        var quoteCount = 0;

        while (quote > 0) {

            // ignore '\"'
            var i;
            var slashCount = 0;
            for (i = quote - 1; i > 0; i--) {
                if (query.charAt(i) != '\\') {
                    break;
                }
                slashCount++;
            }
            if (slashCount % 2 == 0) {
                quoteCount++;
            }

            quote = query.indexOf('"', quote + 1);
        }

        // quote is even number
        if (quoteCount % 2 == 0) {
            return "true";
        }

        // quote is odd number which means semicolon is in quote ";"
        // it is not symble, check next
        semicolon = query.lastIndexOf(";", semicolon - 1);
    }

    return "false";
}


/**
 * Introduction: create views to show tickets with "Update from Customer" activity type
 * Date:20140625
 * Author: Ricky Huang
 * @param activityTable:  the activity table of module
 * @returns nothing
*/ 
function ActivityCustomerUpdated(activityTable)
{
      var activitySet= new SCFile(activityTable, SCFILE_READONLY);
      
      var  	sql= 'select number, count(number) from '+ 
      		activityTable  +
      		' where type="Update from customer" group by number';
      		
      var ret = new SCDatum();
      ret.setType(8);
            
     if (activitySet.doSelect(sql)===RC_SUCCESS)
    {
            
      do {
        	ret.push(activitySet.number);
      	  }while (activitySet.getNext()===RC_SUCCESS);
   	}

	return ret;
} 


/**
 * Check valid virtual group size value
 * Valid value: empty, 0 or a value between 25 and the sqlfetchs param (default 500)
 *
 * @param	{String}	value
 * @returns {Boolean} 
 */ 
function checkVirtualGroupSize(value) {
	
	// allow empty value
	if (value == null || value == "") {
		return true;
	}
	
	if (isNaN(value)) {
		return false;
	}
	
	value = parseInt(value, 10);
	if (value == 0) {
		return true;
	}
	
	var min = 25;
	var max = 500;
	
	var defaultValue = getRTEParm('sqlfetchs');
	if (!isNaN(defaultValue)) {
		max = Math.min(max, parseInt(defaultValue, 10));
	}
	
	return value >= min && value <= max; 
}

/**
 * From the sql, fetch all ids into one array
 * Then use the array to construct the query for inbox "Update from customer - *".
 */
function JoinQuery(filename, id_field, sql) {
    var ret = [];
    var file = new SCFile(filename, SCFILE_READONLY);
    file.setFields([id_field]);
    var rc = file.doSelect(sql);
    while (rc == RC_SUCCESS) {
        ret.push(file[id_field]);
        rc = file.getNext();
    }
    
    return ret;
}
