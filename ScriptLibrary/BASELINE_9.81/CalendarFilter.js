/**
* @fileoverview  Handles functions for the calendar filtering.
* @author Jan Steube
* @date March 2013
*/

/**
*  This functions returns the fields for the filter
*
*  	History:
*	2013-03-24, Jan Steube - function created
*	
*  @returns {string/array} 	aFilterFields - the fields for the filter form
*/

function getFilterFields() {

var fFilterFields 	= new SCFile("calendarFilterEditForm", SCFILE_READONLY);
fFilterFields.setFields(['fieldId']);
var rc 				= fFilterFields.doSelect("true");

var aFilterFields = new Array();

if (rc==RC_SUCCESS) {
	
	do {
	
		aFilterFields.push(fFilterFields.fieldId);
		var rcNext = fFilterFields.getNext();
	
	} while (rcNext==RC_SUCCESS)
	
}

return aFilterFields;

}

/**
*  This functions checks if the fieldId is used in a filter mapping
*
*  	History:
*	2013-03-24, Jan Steube - function created
*	
*   @param {string} 	sFieldId - the fieldId  
*   @returns {boolean} 	true / false
*/

function getFilterFieldUsage(sFieldId)
{
  var fMapping = new SCFile("calendarFilterFieldMapping", SCFILE_READONLY);
  fMapping.setFields(['id']);
  var sQuery = "fieldId=\""+ sFieldId +"\"";
  var ret = fMapping.doSelect(sQuery);
  if (ret == RC_SUCCESS)
  {
    return true;
  }
  
  return false;
}