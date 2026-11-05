function getTZforCompany()
// Get the time zone from the company record
// Query the info table using type="company" and return
// the value for time.zone. If there is no company record
// or time.zone is null, then "-1" is returned.
{
  var f = new SCFile("info", SCFILE_READONLY);
  f.setFields(["time.zone"]);
  var q = new QueryCond("type", EQ, "company").and(new QueryCond("format", EQ, "info.company"));
  
  if (f.doSelect(q) == RC_SUCCESS )
  {
    if (f.time_zone)
    {
      return f.time_zone;
    }
  }
  
	//print( funcs.scmsg( 143, "ScriptLibrary" ) );
  
  return "-1";
}

 
function getTZforOperator(operatorName)
// Get the time zone of the operator
// Query the operator table using name=operatorName and return
// the value for time.zone. If time.zone is null, then lookup
// the value from the company record. If there is no operator record
// found then "-1" is returned.
{
  var f = new SCFile("operator", SCFILE_READONLY);
  f.setFields(["time.zone"]);
  var q = new QueryCond("name", EQ, operatorName);
  
  if (f.doSelect(q) == RC_SUCCESS)
  {
    if (f.time_zone)
    {
      return f.time_zone;
    }
    else
    {
      return getTZforCompany();
    }
  }
        
  //print( funcs.scmsg( 144, "ScriptLibrary", [operatorName] ) );
  
  return "-1";
}

function getTZforContact(contactName)
// Get the time zone of the contact.
// Query the contacts table using name=contactName and return
// the value for time.zone. If time.zone is null, then lookup
// the value from the company record. If there is no contacts record
// found then "-1" is returned.
{
  var f = new SCFile("contacts", SCFILE_READONLY);
  f.setFields(["time.zone"]);
  var q = new QueryCond("contact_name", EQ, contactName);
  
  if (f.doSelect(q) == RC_SUCCESS)
  {
    if (f.time_zone)
    {
      return f.time_zone;
    }
    else
    {
      return getTZforCompany();
    }
  }
        
  //print( funcs.scmsg( 145, "ScriptLibrary", [contactName] ) );
  
  return "-1";
}

function getTZforLocation(locationName)
// Get the time zone of the location.
// Query the location table using location=locationName and return
// the value for time.zone. If time.zone is null, then lookup
// the value from the company record. If there is no location record
// found then "-1" is returned.
{
  var f = new SCFile("location", SCFILE_READONLY);
  f.setFields(["time.zone"]);
  var q = new QueryCond("location", EQ, locationName);

  if (f.doSelect(q) == RC_SUCCESS )
  {
    if (f.time_zone)
    {
      return f.time_zone;
    }
    else
    {
      return getTZforCompany();
    }
  }
        
  //print( funcs.scmsg( 146, "ScriptLibrary", [locationName] ) );
  
  return "-1";
}


function getTZforDevice(deviceName)
// Get the time zone of the device.
// Query the device table using logical.name=deviceName and return
// the value for time.zone. If time.zone is null, then lookup
// the value from the company record. If there is no device record
// found then "-1" is returned.
{
  var f = new SCFile("device", SCFILE_READONLY);
  f.setFields(["time.zone"]);
  var q = new QueryCond("logical_name", EQ, deviceName);

  if (f.doSelect(q) == RC_SUCCESS )
  {
    if (f.time_zone)
    {
      return f.time_zone;
    }
    else
    {
      return getTZforCompany();
    }    
  }
  //print( funcs.scmsg( 147, "ScriptLibrary", [deviceName] ) );
  
  return -1;
}


/**
*QCCR1E59316
*@Description: get time zone offset of current operate system, because all date variable in javascript base on  time zone of OS. 
*@Author: added by yuli 
*@Date: since 9/25/10 
**/
function getOSOffset()
{
    var date = new Date();
    return date.getTimezoneOffset();
}

/**
*QCCR1E59316
*@Description: convert date from string to datetime . 
*@Author: added by yuli 
*@Date: since 9/25/10 
**/
function convertStringtoDate(strdate)
{
  var dtdate=new Date(strdate);
  
  return dtdate;
}

/**
 * QCCR1E59316
 * @Description: convert date from datetime to string according to the dateorder. 
 * @Author: added by yuli 
 * @Date: since 10/28/10 
 *
 * @param {Date} date
 * @param {Number} dateOrder
 * @param {Boolean} ignoreTime
 * @returns {String}
 **/
function convertDatetoString(date, dateOrder, ignoreTime)
{
	if ( date == null )
	{
		return null;
	}
	
	if (!dateOrder)
	{
	   dateOrder = lib.DateOrderConstant.mmddyy();
	}
	
	var strMonth = funcs.str( funcs.month(date) );
	var strDay   = funcs.str( funcs.day(date) );
	var strYear  = funcs.str( funcs.year( date) );
	var strTime  = funcs.str( funcs.time( date ) );
    var strDate;

	if (funcs.lng(strMonth) == 1)
	{
        strMonth = "0" + strMonth;
	}
	if (funcs.lng(strDay) == 1)
	{
        strDay = "0" + strDay;
	}
	
	if (dateOrder == lib.DateOrderConstant.mmddyy() )
	{
		strDate = strMonth + "/" + strDay + "/" + strYear.substr(2);
	}
	else if (dateOrder == lib.DateOrderConstant.ddmmyy() )
	{
		strDate = strDay + "/" + strMonth + "/" + strYear.substr(2);	
	}
	else if (dateOrder == lib.DateOrderConstant.yymmdd() )
	{
		strDate = strYear.substr(2) + "/" + strMonth + "/" + strDay;
	}
	else if (dateOrder == lib.DateOrderConstant.mmddyyyy() )
	{
		strDate = strMonth + "/" + strDay + "/" + strYear;
	}
	else if (dateOrder == lib.DateOrderConstant.ddmmyyyy() )
	{
		strDate = strDay + "/" + strMonth + "/" + strYear;
	}
	else if (dateOrder == lib.DateOrderConstant.yyyymmdd() )
	{
		strDate = strYear + "/" + strMonth + "/" + strDay;	
	}
	
	if (!ignoreTime) {
	   strDate += " " + strTime;
	}
	
	return strDate;
}

/**
*
*@Description: Get timezone file by time zone name. 
*@Author: added by Kenny 
*@Date: since 11/10/10 
**/
function getTZFileByTZName(tzName)
{
  var f = new SCFile();
  var q = new QueryCond("name", EQ, tzName);

  if (f.doSelect("tzfile",q) == RC_SUCCESS ){  
        return f;
  }else{        
        return "-1";
  }  
}

/**
* QCCR1E57676-Have the time references in mail notifications be sent with receiver's TimeZone adjustment
*
* Get the time zone of the notifyName.
* 1.Query the operator table using name=notifyName and return the value for time.zone. 
* 2.If time.zone is null, then lookup the value from the contacts record. 
* 3.If time.zone is null, then lookup the value from the company record. 
* 4.If 3 tables can't found then "-1" is returned, no need print message.
* 
*@Description: Get timezone file by notify Name. 
*@Author: added by Kenny 
*@Date: since 2011/03/10 
**/
function getTZforNotify(notifyName)
{
	var operatorFile = new SCFile("operator", SCFILE_READONLY);
	operatorFile.setFields(["time.zone"]);
  	var operatorQ = new QueryCond("name", EQ, notifyName);
  	if (operatorFile.doSelect(operatorQ) == RC_SUCCESS)
  	{
	  	if (operatorFile.time_zone)
	    {
	    	return operatorFile.time_zone;
	    }	         
  	}  	
  	
  	var contactsFile = new SCFile("contacts", SCFILE_READONLY);
  	contactsFile.setFields(["time.zone"]);
	var contactsQ = new QueryCond("contact_name", EQ, notifyName);
	if (contactsFile.doSelect(contactsQ) == RC_SUCCESS)
	{
		if (contactsFile.time_zone)
		{
	  		return contactsFile.time_zone;
		}
	}
	
	var companyFile = new SCFile("info", SCFILE_READONLY);
	companyFile.setFields(["time.zone"]);
	var companyQ = new QueryCond("type", EQ, "company").and(new QueryCond("format", EQ, "info.company"));
	if (companyFile.doSelect(companyQ) == RC_SUCCESS )
	{		
		if (companyFile.time_zone)
		{
			return companyFile.time_zone;
		}
	}
  	return "-1";
}

/**
 * Retrieve value of time zone and date order supposing the operator login (not the current login operator).
 * The priority of time zone is: time.zone in the current operator, time.zone in info company, Greenwich/Universal
 * The priority of date order is: date.order in the current operator, date.order in info.company, the default date.order in the time zone of $lo.time.zone, 1
 * Return the array [timezone, dateorder]
 **/
function retrieveOperatorTimeZone(opname) {
    if (opname == null) {
        opname = funcs.operator();
    }
    
    var operator=lib.operatorUtil.getOperatorByName(opname);
    var company=lib.operatorUtil.getCompany();
    
    var lo_time_zone;
    if (operator!=null) {
        lo_time_zone=funcs.nullsub(funcs.nullsub(operator.time_zone, company.time_zone), "Greenwich/Universal");
    } else {
        lo_time_zone=funcs.nullsub(company.time_zone, "Greenwich/Universal");
    }
    
    var tzfile=getTZFileByTZName(lo_time_zone);
    
    var lo_date_order;
    if (operator!=null) {
        lo_date_order=funcs.nullsub(funcs.nullsub(funcs.nullsub(operator.date_order, company.date_order), tzfile.date_order), 1);
    } else {
        lo_date_order=funcs.nullsub(funcs.nullsub(company.date_order, tzfile.date_order), 1);
    }
    
    return [lo_time_zone, lo_date_order];
}

/**
 *  Return the time zone supposing the operator login
 **/
function getOperatorTimeZone(opname) {
    var tz = retrieveOperatorTimeZone(opname);
    return tz[0];
}

/**
 *  Return the date order supposing the operator login
 **/
function getOperatorDateOrder(opname) {
    var tz = retrieveOperatorTimeZone(opname);
    return tz[1];
}

/**
* Retrieve value to $lo.time.zone and $lo.date.order.
**/
function retrieveLocalTimeZone() {
    var tz = retrieveOperatorTimeZone(funcs.operator());
    
    vars.$lo_time_zone = tz[0];
    vars.$lo_date_order = tz[1];
}

/**
* If $lo.time.zone is not null, return it directly
* Otherwise, invoke retrieveLocalTimeZone to assign value to $lo.time.zone and return it.
**/
function getLocalTimeZone() {
    if (funcs._null(vars.$lo_time_zone)) {
        retrieveLocalTimeZone();
    }
        
    return vars.$lo_time_zone;
}

/**
* If $lo.date.order is not null, return it directly
* Otherwise, invoke retrieveLocalTimeZone to assign value to $lo.date.order and return it.
**/
function getLocalDateOrder() {
    if (funcs._null(vars.$lo_date_order)) {
        retrieveLocalTimeZone();
    }
    
    return vars.$lo_date_order;
}


/**
*QCCR1E84115
*@Description: convert date from datetime to string against dateorder and time zone. 
*@Author: added by yuli 
*@Date: since 10/09/12 
**/
function convertDatetoStringonTZ(date,dateorder,timezone)
{
	var strDate =convertDatetoString(date,dateorder);
	var tzSFile = new SCFile("tzfile", SCFILE_READONLY);
	var tzSFind = tzSFile.doSelect("name = \""+vars.$lo_time_zone+"\"");
	var tzDFile = new SCFile("tzfile", SCFILE_READONLY);
	var tzDFind = tzDFile.doSelect("name = \""+timezone+"\"");

	if (tzDFind == RC_SUCCESS && tzSFind == RC_SUCCESS){
	    tzDFile.date_order=dateorder;
        funcs.set_timezone(tzDFile);
        strDate=funcs.str(date); 
        tzSFile.date_order = vars.$lo_date_order;
        funcs.set_timezone(tzSFile);
    }
     
    return strDate;
}


/**
* QCCR1E87767
* This function converts date string based on time zone and date order
* @param {string} strDate - The date string input to convert
* @param {string} tzname1 - The time zone name for the input date string
* @param {number} dateorder1 - The date order for the input date string
* @param {string} tzname2 - The time zone name to convert
* @param {number} dateorder2 - The date order to convert
* @return the converted date string and when the input date string cannot be recoginzed, just return the input one
*/
function convertDateStringOnTZ(strDate, tzname1, dateorder1, tzname2, dateorder2)
{
    if (strDate == null || strDate == "")
   	{
        return strDate;
    }
    
    if (dateorder1 == null || dateorder1 == "" || tzname1 == null || tzname1 == "")
    {
        return strDate;
    }
    
    if (dateorder2 == null || dateorder2 == "" || tzname2 == null || tzname2 == "")
    {
        return strDate;
    }
        
    var tzfile1 = getTZFileByTZName(tzname1);
    tzfile1.date_order = dateorder1;
    funcs.set_timezone(tzfile1);
    var date = funcs.val(strDate, 3);
    
    if (date != null)
    {
        var tzfile2 = getTZFileByTZName(tzname2);
        tzfile2.date_order = dateorder2;
        funcs.set_timezone(tzfile2);
        strDate = funcs.str(date);
    }
    
    var localtz = getTZFileByTZName(getLocalTimeZone());
    localtz.date_order = getLocalDateOrder();
    funcs.set_timezone(localtz);
    
    return strDate;
}

/**
* Convert date string based on local time zone and date order to GMT
* @param {string} strDate - The date string input to convert
* @param {number} gmt_dateorder - The date order to convert. If it is not set, it will be set to 1
* @return the converted date string
*
**/
function convertDateStringToGMT(strDate, gmt_dateorder)
{
    if (gmt_dateorder == null || gmt_dateorder == "")
    {
        gmt_dateorder = 1;
    }
        
    return convertDateStringOnTZ(strDate, getLocalTimeZone(), getLocalDateOrder(), "Greenwich/Universal", gmt_dateorder);
}


/**
* Convert date string based on GMT time zone and date order to local time zone and date order
* @param {string} strDate - The date string input to convert
* @param {number} gmt_dateorder - The date order to convert. If it is not set, it will be set to 1
* @return the converted date string
*
**/
function convertDateStringToLocal(strDate, gmt_dateorder)
{
    if (gmt_dateorder == null || gmt_dateorder == "")
    {
        gmt_dateorder = 1;
    }
    
    return convertDateStringOnTZ(strDate, "Greenwich/Universal", gmt_dateorder, getLocalTimeZone(), getLocalDateOrder());
}


/**
* Search all date type part of string and convert to the correct time zone and data order
* @param {string} string - The input string
* @param {boolean} reverse - true to convert local to GMT, false to convert GMT to local. Default is false.
* @param {boolean} hasQuotation - true to has single quotation for date part and false not. Default is true.
* @return the converted string
**/
function convertDateInString(string, reverse, hasQuotation)
{
    if (string == null)
    {
        return string;
    }
    
    if (reverse == null)
    {
        reverse = false;
    }
    
    if (hasQuotation == null)
    {
        hasQuotation = true;
    }
        
    var newstr = "";
    
    var index = [];
    var lastindex = [];
    lastindex.push(0);
    var orig = [];
    var dest = [];
        
    var pattern;
    var offset=0;
    var dateseparator="\/";
    if (reverse) 
    {
        var localtz=lib.tzFunctions.getTZFileByTZName(getLocalTimeZone());
        dateseparator=funcs.nullsub(localtz.date_separator, "\/");
    }
    if (hasQuotation)
    {
        pattern=new RegExp("\'([0-9]+"+dateseparator+"[0-9]+"+dateseparator+"[0-9]+\s*( [0-9]+:[0-9]+(:[0-9]+)?)?)\'", "g");
        offset=1;
    }
    else 
    {
        pattern=new RegExp("([0-9]+"+dateseparator+"[0-9]+"+dateseparator+"[0-9]+\s*( [0-9]+:[0-9]+(:[0-9]+)?)?)", "g");
    }
    var matches = pattern.exec(string);
    while (matches != null)
    {
        index.push(matches.index+offset);
        lastindex.push(matches.index+matches[0].length-offset);
        var origstr=matches[0].substr(offset, matches[0].length - 2*offset);
        orig.push(origstr);
        if (reverse) 
        {
            dest.push(lib.tzFunctions.convertDateStringToGMT(origstr));
        }
        else
        {
            dest.push(lib.tzFunctions.convertDateStringToLocal(origstr));
        }
        matches=pattern.exec(string);
    }

    var i;
    for (i=0; i<index.length; i++)
    {
        newstr+=string.substring(lastindex[i], index[i]);
        var str=dest[i];
        if (hasQuotation)
        {
        	var ch;
            if (index[i]>1)
            {
                ch=string.charAt(index[i]-offset-1);
                if (ch == "'")
                {
                    str=orig[i];
                }
            }
            if (lastindex[i+1]<string.length - 1)
            {
                ch=string.charAt(lastindex[i+1]+1);
                if (ch == "'")
                {
                    str=orig[i];
                }
            }
        }
        newstr=newstr+str;
    }

    newstr+=string.substring(lastindex[index.length]);
    
    return newstr;
}

/**
* Search all date type part of string and convert to the correct time zone and data order
* @param {string} string - The input string
* @param {boolean} hasQuotation - true to has single quotation for date part and false not. Default is true.
* @return the converted string
**/
function convertDateInStringToGMT(string, hasQuotation) {
    return convertDateInString(string, true, hasQuotation);
}


/**
* Search all date type part of string and convert to the correct time zone and data order
* @param {string} string - The input string
* @param {boolean} hasQuotation - true to has single quotation for date part and false not. Default is true.
* @return the converted string
**/
function convertDateInStringToLocal(string, hasQuotation) {
    return convertDateInString(string, false, hasQuotation);
}

/**
* The standard ISO8601 datetime is yyyy-mm-ddThh:mm:ddZ
* When the month or day is not 2 digits happened in KM, it is not recognized.
* So here check the digit for month or day and fill 0 to 2 digits.
* Return the string of local datetime for the current operator
**/
function convertISO8601DateToLocal(dateString) {
    var localString = dateString.replace(/(\d{4}-)(\d{1,2})-(\d{1,2})(T\d{2}:\d{2}:\d{2}Z)/, function(s, $1, $2, $3, $4) {
        if ($2.length == 1) {
            $2 = "0" + $2;
        }
        if ($3.length == 1) {
            $3 = "0" + $3;
        }
        var d = new XMLDate($1 + "" + $2 + "-" + $3 + "" +$4);
    
        return d.getSCDateTimeString();
    });
    
    return localString;
}
