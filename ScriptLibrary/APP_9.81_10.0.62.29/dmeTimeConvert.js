/**
This function is used to convert ISO date to the rte date format which with defined timezone and dateformat
xmlDate format: 2012-01-06T08:20:37+00:00
**/
function formatFromISODate(xmlDate)
{
      var lng = system.functions.lng(system.functions.val(xmlDate,8));
      if(lng>=1){
		var dateArray = system.functions.val(xmlDate,8);
		for (var count=0;count<system.functions.lng(dateArray);count++)
		{   
		       dateArray[count] = lib.dmeTimeConvert._formatFromISODate(dateArray[count]);
		}
	   return dateArray;
	  } 
	  
	 return lib.dmeTimeConvert._formatFromISODate(xmlDate);
}


function _formatFromISODate(xmlDate)
{
      if (!/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\+00:00$/.test(xmlDate)) {
         //  throw new RangeError("xmlDate must be in ISO-8601 format XMLDate: 2012-01-06T08:20:37+00:00.");
         return xmlDate;
      }

      var date= new Date(Date.UTC(xmlDate.substring(0,4), 
       xmlDate.substring(5,7)-1,
       xmlDate.substring(8,10),
       xmlDate.substring(11,13),
       xmlDate.substring(14,16),
       xmlDate.substring(17,19)));
    return date;
}


/**
This function is used to convert ISO date to the rte date format which with defined timezone and dateformat
xmlDate format: 2012-01-06T08:20:37+00:00. This method works for a single date time and date time array
**/

function formatFromISODateArray(xmlDate)
{
   var lng = system.functions.lng(system.functions.val(xmlDate,8));
   if(lng>=1){
		var dateArray = system.functions.val(xmlDate,8);
		for (var count=0;count<system.functions.lng(dateArray);count++)
		{   
		       dateArray[count] = lib.dmeTimeConvert.formatFromISODate(dateArray[count]);
		}
		
	   return dateArray;
	}
	 return lib.dmeTimeConvert.formatFromISODate(xmlDate);

}
/**
This fuction is format rte date to ISO Date
**/
function _formatToISODate(dateValue){
	var sysDate=system.functions.val(dateValue,3);
	if(sysDate!=null && typeof(dateValue)!="number"){//num is special here that it will return value if we use val(val,3) and actually it should return value directly
	dateValue = new XMLDate(sysDate).getISODateTimeString();
	}
	return  dateValue;
}

/**
This fuction is format rte date to ISO Date
**/
function formatToISODate(value){
	var lng = system.functions.lng(system.functions.val(value,8));
	if(lng>=1){
		var dateArray = system.functions.val(value,8);
		for (var count=0;count<system.functions.lng(dateArray);count++)
		{   
		       dateArray[count] = lib.dmeTimeConvert._formatToISODate(dateArray[count]);
		}
		
	   return dateArray;
	}
	return lib.dmeTimeConvert._formatToISODate(value);
}


/**
format the dme value
**/
function getDMEList(changeNumber){
	var newListValue = [];
    var newListDisplay = [];
    var oldListValue = [];
    var oldListDisplay = [];
    var newListActiveValue = [];
    var newListInactiveValue = [];
    var oldListActiveValue = [];
    var oldListInactiveValue = [];
	
	
	
	if(changeNumber!=null && changeNumber!=""){
		var sc=new SCFile("dataModEvent", SCFILE_READONLY);
		var rc=sc.doSelect("linkedTableName=\"cm3r\" and linkedRecordId=\""+changeNumber+"\"");
		while(rc==RC_SUCCESS){
			if (sc["is.password"]) {
                oldListDisplay.push("********");
                oldListValue.push("********");
                newListDisplay.push("********");
                newListValue.push("********");
            } else {
			    let oldValueDisplay=system.functions.str(lib.dmeTimeConvert.formatFromISODate(sc.oldValue));
			    let isDisplayField = lib.ddmEventHelper.isDisplayField(sc.tableName, sc.fieldName);
			    if(isDisplayField){
				    oldValueDisplay = ''+lib.ddmEventHelper.getDisplayValue(sc.oldValue);
			    } else {
				    oldValueDisplay = lib.ddmEventHelper.formatArray(oldValueDisplay);
			    }
			    oldListDisplay.push(oldValueDisplay);
			    oldListValue.push(sc.oldValue);
			
			    let newValueDisplay=system.functions.str(lib.dmeTimeConvert.formatFromISODate(sc.newValue));
			    if(isDisplayField){
				    newValueDisplay = ''+lib.ddmEventHelper.getDisplayValue(sc.newValue);
			    } else {
				    newValueDisplay = lib.ddmEventHelper.formatArray(newValueDisplay);
			    }
			    newListDisplay.push(''+newValueDisplay);
			    newListValue.push(sc.newValue);
			}
			
			if (sc["active"]) {
                if (sc["is.password"]) {
                    oldListActiveValue.push("********");
                    newListActiveValue.push("********");
                } else {
                    oldListActiveValue.push(sc.oldValue);
                    newListActiveValue.push(sc.newValue);
                }
            } else {
                if (sc["is.password"]) {
                    oldListInactiveValue.push("********");
                    newListInactiveValue.push("********");
                } else {
                    oldListInactiveValue.push(sc.oldValue);
                    newListInactiveValue.push(sc.newValue);
                }
            }
			
			rc=sc.getNext();
		}
	}
	return [oldListValue, oldListDisplay, newListValue, newListDisplay, oldListActiveValue, newListActiveValue, oldListInactiveValue, newListInactiveValue];
}


//this function is used to convert the date values to ISO date format
function getISODateArray(value){
	var lng = system.functions.lng(system.functions.val(value,8));
	if(lng>=1){
		var dateArray = system.functions.val(value,8);
		for (var count=0;count<system.functions.lng(dateArray);count++)
		{   
		       dateArray[count] = lib.dmeTimeConvert.formatToISODate(dateArray[count]);
		}
		
	   return system.functions.str(dateArray);
	}
	return lib.dmeTimeConvert.formatToISODate(value);
}

