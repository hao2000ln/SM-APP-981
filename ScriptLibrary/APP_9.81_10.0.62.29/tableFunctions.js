/** @fileoverview tableFunctions - contains functions relating to table definitions
*   @author Pete Budic
*/

/**  This function is called to find the type of a field.  It returns a number that is
*	the ServiceCenter type of the field, the same as using the type() function.  This
*	function is meant to be used when you do not have a populated file variable and 
*	therefore the type() function is unavailable.
*
*	@param {String} tableName	-  The name of table this field is in
*	@param {String}	fieldName	-	The name of the field
*	@param {Logical}	arrayFlag	-	If 'true' then the script returns type 8 if the field is an array
*										If 'false' then the script returns the actual field type of the array
*	@return The numerical type of the field
*	@type Integer
*/
function getFieldType(fieldName, tableName, arrayFlag)
{
  	if (fieldName==null || ( tableName==null && fieldName.indexOf(";") == -1 )) {
  		return -1;
  	}
  	
  	var roField;
  	var roTable;
  	
  	arrayFlag = funcs.nullsub(arrayFlag, false);
  	
  	if (fieldName.indexOf(";") != -1)
  	{
  		roField = lib.relatedObjectFunctions.getLastROFieldName(fieldName) ;
  		roTable  = lib.relatedObjectFunctions.getLastROTableName(fieldName); 
  		
  		fieldName = roField;
  		tableName = roTable;
  	}		
  
  	var table = new SCFile("dbdict");
  	var sql = "name=\"" + tableName + "\"";
 
	if ( table.doSelect( sql ) == RC_SUCCESS )
  	{ 
  		var x;
  		var max = table.field.length();
  		for (x=0; x < max; x++ )
  		{
  			if ( table.field[x].name == fieldName)
  			{
  				if ( table.field[x].type == 8 && arrayFlag == false) {
  					return table.field[x+1].type;
  				}
  				else {
 	 				return table.field[x].type;
 	 			}
  			}
  		}
  	}
  	else
  	{
  		var join = new SCFile("joindefs");
  		sql = "join.name=\"" + tableName + "\"";
  		var jType = -1;
  		if ( join.doSelect( sql ) == RC_SUCCESS )
  		{
  			var i;
  			var iLoopTimes = join.join_tables.length();
  			for ( i = 0; i < iLoopTimes; i++ )
  			{
  				jType = getFieldType( fieldName, join.join_tables[i].table_name, arrayFlag );
  				if ( jType > 0 )
  				{
  					return jType;
  				}
  			}
  		}
  	}
  	
  	return -1;
}




/**  This function is called to find the index of a field .  It returns a number that is
*	the ServiceCenter type of the field, the same as using the type() function.  This
*	function is meant to be used when you do not have a populated file variable and 
*	therefore the type() function is unavailable.
*
*	@param {String} tableName	-  The name of table this field is in
*	@param {String}	fieldName	-	The name of the field
*	@param {Logical}	arrayFlag	-	If 'true' then the script returns type 8 if the field is an array
*										If 'false' then the script returns the actual field type of the array
*	@return The numerical type of the field
*	@type Integer
*/
function getFieldIndex(fieldName, tableName, arrayFlag)
{
  	if (fieldName==null || ( tableName==null && fieldName.indexOf(";") == -1 )) {
  		return -1;
  	}
  	
  	var roField;
  	var roTable;
  	
  	arrayFlag = funcs.nullsub(arrayFlag, false);
  	
  	if (fieldName.indexOf(";") != -1)
  	{
  		roField = lib.relatedObjectFunctions.getLastROFieldName(fieldName) ;
  		roTable  = lib.relatedObjectFunctions.getLastROTableName(fieldName); 
  		
  		fieldName = roField;
  		tableName = roTable;
  	}		
  
  	var table = new SCFile("dbdict");
  	var sql = "name=\"" + tableName + "\"";
 
	if ( table.doSelect( sql ) == RC_SUCCESS )
  	{
  		var x; 
  		var max = table.field.length();
  		for (x=0; x < max; x++ )
  		{
  			if ( table.field[x].name == fieldName)
  			{
  				if ( table.field[x].type == 8 && arrayFlag == false) {
  					return table.field[x+1].index;
  				}
  				else {
 	 				return table.field[x].index;
 	 			}
  			}
  		}
  	}
  	else
  	{
  		var join = new SCFile("joindefs");
  		sql = "join.name=\"" + tableName + "\"";
  		var jType = -1;
  		if ( join.doSelect( sql ) == RC_SUCCESS )
  		{
  			var i;
  			var iLoopTimes = join.join_tables.length();
  			for ( i = 0; i < iLoopTimes; i++ )
  			{
  				var jIndex = getFieldIndex( fieldName, join.join_tables[i].table_name, arrayFlag );
  				if ( jIndex > 0 )
  				{
  					return jIndex;
  				}
  			}
  		}
  	}
  	
  	return -1;
}


/**  This function is called to find the absolute type of a field.  It returns a number that is
*	the ServiceCenter type of the field, the same as using the type() function.  This
*	function is meant to be used when you do not have a populated file variable and 
*	therefore the type() function is unavailable.
*
*	@param {String} tableName	-  The name of table this field is in
*	@param {String}	fieldName	-	The name of the field
*	@return The numerical type of the field
*	@type Integer
*/
function getAbsFieldType(fieldName, tableName)
{
  	if (fieldName==null || tableName==null) {
  		return -1;
  	}
  
  	var table = new SCFile("dbdict");
  	var sql = "name=\"" + tableName + "\"";
 
	if ( table.doSelect( sql ) == RC_SUCCESS )
  	{ 
  		var x;
  		var max = table.field.length();
  		for (x=0; x < max; x++ )
  		{
  			if ( table.field[x].name == fieldName )
  			{
  				return table.field[x].type;
  			}
  		}
  	}
  	else
  	{
  		var join = new SCFile("joindefs");
  		sql = "join.name=\"" + tableName + "\"";
  		var jType = -1;
  		if ( join.doSelect( sql ) == RC_SUCCESS )
  		{
  			var i;
  			var iLoopTimes = join.join_tables.length();
  			for ( i = 0; i < iLoopTimes; i++ )
  			{
  				jType = getAbsFieldType( fieldName, join.join_tables[i].table_name );
  				if ( jType > 0 )
  				{
  					return jType;
  				}
  			}
  		}
  	}
  	
  	return -1;
}


/**  This function is called to find the caption for a field.  It returns the caption
*	 defined in the data policy record for any given field
*
*	@param {String} tableName	-  The name of table this field is in
*	@param {String}	fieldName	-	The name of the field
*	@return The caption related to the field
*	@type String
*/
var table = new SCFile("datadict");
var joindefs = new SCFile("joindefs");
function getFieldCaption( fieldName, tableName )
{
	var sql = "name=\"" + tableName + "\"";
	var index;
	var caption;
    
	if ( table.name != null && table.name == tableName)
	{
		index = funcs.index(fieldName, table.fields);
		if ( index > 0 ) 
		{
			caption = funcs.get_field_caption(fieldName, tableName);
			return caption != null ? caption : table.captions[index-1];
		}
	}
	else if ( table.doSelect( sql ) == RC_SUCCESS )
	{
		index = funcs.index(fieldName, table.fields);
		if ( index > 0 ) 
		{
			caption = funcs.get_field_caption(fieldName, tableName);
			return caption != null ? caption : table.captions[index-1];
		}
	}
	
	var i;
	var iLoopTimes;

	var joinsql = "join.name=\""+tableName+"\"";
	if ( joindefs.join_name !=null && joindefs.join_name == tableName )
	{
		iLoopTimes = joindefs.join_tables.length();
		for (i = 0; i < iLoopTimes; i++ )
		{
			caption = funcs.get_field_caption( fieldName, joindefs.join_tables[i].table_name );
			if ( caption != null && caption != fieldName ) {
				return caption;
			}
		}
	}
	else if ( joindefs.doSelect(joinsql) == RC_SUCCESS )
	{
		iLoopTimes = joindefs.join_tables.length();
		for (i = 0; i < iLoopTimes; i++ )
		{
			caption = funcs.get_field_caption( fieldName, joindefs.join_tables[i].table_name );
			if ( caption != null && caption != fieldName ) {
				return caption;
			}
		}
	}
	
	return fieldName;
}



/**  This function is used to return the display value of a corresponding list
*	 value in a globallist
*
*	@param {String} globalList	-  The name of the globallist to reference
*	@param {String}	listValue	-	The list value to use
*	@return the display value related to the list value
*	@type String
*/
function getGlDisplayValue( globalList, listValue )
{
	var glRecord = new SCFile("globallists", SCFILE_READONLY);
	glRecord.setFields(["list.variable","display.variable"]);
	var sql = "name=\"" + globalList + "\"";

	if ( glRecord.doSelect( sql ) == RC_SUCCESS )
	{
		var listArray = vars[glRecord.list_variable];
		var displayArray = null;
		if (glRecord.display_variable != null)
		{
			displayArray = vars[glRecord.display_variable];
		}else{
			return listValue;
		}	

		var index = funcs.index(listValue, listArray);
		
		if (index > 0 && displayArray)
		{
			return displayArray[index-1];
		}	
		else
		{
			return listValue;
		}
	}
	return listValue;
}

/**  This function is used to take any field captions that are simply the field name and
*	add a small level of formatting.
*
*	@param {File} datadict	-  The name of the globallist to reference
*	@return success or failure (boolean)
*/
function setDefaultCaptions( datadict )
{
	  	var max = datadict.fields.length();
	  	var temp;
	  	var i;
  		for (i=0; i < max; i++ )
  		{
  			if ( datadict.fields[i] == datadict.captions[i] )
  			{
  				temp = datadict.fields[i].replace(/[\(\)\.\_\s,]/g, " ");
  				temp = cnvrtCamelCase( temp );
       			temp = cnvrt2title( temp );
       			datadict.captions[i] = temp;
  			}
  		}
}

// Return the default caption value from field name
function getDefaultCaption(field) {
    if (field == null) {
        return "";
    }
    var caption = field.replace(/[\(\)\.\_\s,]/g, " ");
  	caption = cnvrtCamelCase( caption );
    caption = cnvrt2title( caption );
    return caption;
}

//
/**  This function converts a string to title case (i.e. the first letter of each word is capitalized 
*    except if the word is an articles or prepositions unless it is the first word, which is always capitalized). 
*
*	@param {String} str -  The string to be converted
*	@return The new string
*/
// the previous version will cause sig11 issue
function cnvrt2title(str) 
{
    var temp = [];
    temp = str.split(' ');
     
    //for ( var i in temp )
    var i;
    for ( i=0; i<temp.length; i++ )
    {
       if (/^(a|about|after|an|and|at|by|for|from|in|into|nor|of|on|onto|over|the|to|up|with|within)$/.test(temp[i]) )
       {
          continue;
       }

       temp[i] = temp[i].toUpperCase().substring(0,1) + temp[i].substring(1,temp[i].length);
    }
    
    return temp.join(' ');
}


function cnvrtCamelCase(input) {
	var token = input.split(/(?=[A-Z])/) ;
	var output = "";
	var i;
	for (i=0; i < token.length; i++)
	{
		if ( i == 0 )
		{
			output = token[i];	
		}
		else
		{
			output = output + " " + token[i];
		}
	}
	return output;
}

/**
 * get table unique key
 *
 * @param {String} tableName
 * @returns {Array}
 */
function getUniqueKey(tableName) {
	var object = new SCFile("datadict");
	var sql = "name=\"" + tableName + "\"";
	
	if ( object.doSelect( sql ) == RC_SUCCESS )
	{
		if ( object.unique_key != null ) {
			return object.unique_key.toArray();
		}
	}  
	else
	{
		var join = new SCFile("joindefs");
		sql = "join.name=\"" + tableName + "\"";
		
		if ( join.doSelect( sql ) == RC_SUCCESS )
		{
			return getUniqueKey( join.join_tables[0].table_name );
		}
	}

	return null;
}	

function getFieldList( tableName )
{
	if ( tableName == null || tableName == "" )
	{
		return null;
	}
	var lists = new SCDatum();
	var captions = new SCDatum();
	var fields = new SCDatum();
	
	lists.setType(8);
	captions.setType(8);
	fields.setType(8);
	
	var datadict = new SCFile("datadict");
	var sql = "name=\"" + tableName + "\"";
	
	if ( datadict.doSelect( sql ) == RC_SUCCESS )
	{
		captions = datadict.captions;
		fields = datadict.fields;
	}
	else
	{
		var join = new SCFile("joindefs");
		sql = "join.name=\"" + tableName + "\"";
		var i = 0;
		if ( join.doSelect( sql ) == RC_SUCCESS )
		{	
			for ( i in join.join_tables )
			{
				var dsql = "name=\"" + join.join_tables[i].table_name + "\"";
				if ( datadict.doSelect( dsql ) == RC_SUCCESS )
				{
					var j;
					for ( j in datadict.fields )
					{
						if ( funcs.index( datadict.fields[j], fields ) == 0 )
						{
							if(datadict.avail[j]==true){  
								fields = funcs.insert( fields, 0, 1, "file." + join.join_tables[i].table_name +"," + datadict.fields[j] );
								captions = funcs.insert( captions, 0, 1, datadict.captions[j] );
							}
						}
					}
				}
			}
		}
	}
	
	lists = funcs.insert( lists, 0, 1, fields );
	lists = funcs.insert( lists, 0, 1, captions );

	return lists;
}

/**	This function is used to return the list of IR fields for a given table
*
*	@param {String} tableName - the name of the table
*	@return {Array} results - the list of IR fields for the table
*/
function getIRFields( tableName )
{	
	var results = new Datum();
	results.setType(8);
	var table = new SCFile("dbdict");
	var sql = "name=\"" + tableName + "\"";
	
	if ( table.doSelect( sql ) == RC_SUCCESS )
	{
		var keyArray = table.key;
		var i;
		var j;
		for ( i in keyArray )
		{
			var key = keyArray[i];
			if ( key[0] == 64 )
			{
				for ( j in key[1] ) {
					results.push( removeStructName( key[1][j] ));
				}
			}
		}
	}
	return results;
}

/**	This function is used to remove the structure name from a given field
*
*	@param {String} field - the field name
*	@return {String} field - the field name with its structure name (which precedes a comma) removed
*/
function removeStructName( field )
{
	var index = field.indexOf(",");
	if ( index > -1 ) {
		return field.substr( index + 1 );
	}
	else {
	   return field;
	}
}

/**	This function is used to determine whether a given field is an alias field
*
*	@param {String} field - the field name
*	@param {String} tableName - the name of the table
*	@return {Boolean} - 'true' if the field is an alias; 'false' otherwise
*/
function checkAlias( field, tableName )
{
	var table = new SCFile("dbdict");
	var sql = "name=\"" + tableName + "\"";
	
	if ( table.doSelect( sql ) == RC_SUCCESS )
	{
		var fieldArray = table.field;
		if ( fieldArray[1][0] == field ) {
			return false;
		}
		else
		{
			var max = fieldArray.length();
			var i;
			for ( i=2; i < max; i++ )
			{
				var j = i - 1;
				if ( fieldArray[i][0] == field )
				{
					if ( fieldArray[i][1] == fieldArray[j][1] && fieldArray[i][2] == fieldArray[j][2] ) {
						return true;
					}
					else {
					   return false;
					}
				}
			}
			return false;				
		}		
	}
}


function getCommonFieldsfromTables()
{
   var tablename = vars.$L_file.tablename;
   var tables = tablename.toArray();
   var datadict = new SCFile("datadict");
   var i = 1;
   var final_Array = new SCDatum();
   var result = [];	
   final_Array.setType(8);

   var sql = "name=\""+tables[0]+"\"";
   
  //If the first table in the tablelist is Blank 
   if (tables[0] == null || tables[0] =="")
   { print( funcs.scmsg( 170, "ScriptLibrary" ) );
      
      return result;
   }
      
   var fields = [];
  if ( datadict.doSelect( sql ) == RC_SUCCESS )
   {
	fields = datadict.fields;
   }
   
   if (tables.length == 1)
   {
   //I am just one table so no need to go into intersect
   }
   else
   {
    //Multiple table - intersect required
    do 
    {
     sql = "name=\""+tables[i]+"\"";
	 datadict = new SCFile("datadict");
	 i++;
	 if ( datadict.doSelect( sql ) == RC_SUCCESS )
	  {
		var err;
		var rc=funcs.rtecall("intersect", err, final_Array, fields, datadict.fields );	
	  }
	
	 fields = final_Array;

     } while ( i < tables.length );
    }
    
    result = fields;
      
    if (lib.ArrayUtil.length(result) == 0) {
        print( funcs.scmsg( 171, "ScriptLibrary" ) );
    } 
      
    return result;
}


function getFieldListfromSingleFile( tableName )
{
	if ( tableName == null || tableName == "" )
	{
		return null;
	}
	var lists = new SCDatum();
	var captions = new SCDatum();
	var fields = new SCDatum();
	
	lists.setType(8);
	captions.setType(8);
	fields.setType(8);
	
	var datadict = new SCFile("datadict");
	var sql = "name=\"" + tableName + "\"";
	
	if ( datadict.doSelect( sql ) == RC_SUCCESS )
	{
		captions = datadict.captions;
		fields = datadict.fields;
	}
	else
	{
		var join = new SCFile("joindefs");
		sql = "join.name=\"" + tableName + "\"";
		var i = 0;
		if ( join.doSelect( sql ) == RC_SUCCESS )
		{	
			for ( i in join.join_tables )
			{
				var dsql = "name=\"" + join.join_tables[i].table_name + "\"";
				if ( datadict.doSelect( dsql ) == RC_SUCCESS )
				{
					var j;
					for ( j in datadict.fields )
					{
						if ( funcs.index( datadict.fields[j], fields ) == 0 )
						{
							fields = funcs.insert( fields, 0, 1, datadict.fields[j] );
							captions = funcs.insert( captions, 0, 1, getLocalizedCaption( datadict.captions[j] ) );
						}
					}
				}
			}
		}
	}

	lists = funcs.insert( lists, 0, 1, fields );
	lists = funcs.insert( lists, 0, 1, captions );

	return lists;
}

function getLocalizedCaption( pCaption )
{
  var msg = new SCFile( "scmessage", SCFILE_READONLY );
  var sql = "syslanguage=\""+vars.$G_my_language+"\" and class=\"sccaption\" and message.id#\""+pCaption+"_\"";

  if ( msg.doSelect( sql ) == RC_SUCCESS )
  {
    return msg.message==null?pCaption:msg.message;
  }

  return pCaption;
}

function isValidForm(formName)
{
	var format = new SCFile("format", SCFILE_READONLY);
	format.setFields(["name"]);
	var sql = "name=\"" + formName + "\"";
	if ( format.doSelect( sql ) == RC_SUCCESS )
	{
	    return true;
	}
	return false;
}


/**  This function is called to find the localized caption for a field.  It returns the localized caption
*	 defined in the data policy record for any given field
*
*	@param {String} tableName	-  The name of table this field is in
*	@param {String}	fieldName	-	The name of the field
*	@return The localized caption related to the field
*	@type String
*/
function getLocalizedFieldCaption( fieldName, tableName )
{
	var caption = funcs.get_field_caption(fieldName,tableName);
	if ( caption != null && caption != fieldName ) {
            return caption;
	}
}

//Get all fields list and localized caption list
function getAllFieldCaptionFromJoinTables(tableN)
{
    var returnList=[];
    var fieldList=[];
    var displayList=[];
    var tblen=tableN.length;
    var p;
    for(p=0;p<tblen;p++)
    {
        if ( tableN[p] == null || tableN[p] == "" )
        {
            continue;
        }
        var joinsql= "join.name=\"" + tableN[p] + "\"";
        if (joindefs.doSelect(joinsql) == RC_SUCCESS)
        {
            var tsttableLen=joindefs.join_tables.length();
            var q;
            for(q=0;q<tsttableLen;q++)
            {
                var tbName=joindefs.join_tables[q].table_name;
                var dsql= "name=\"" + tbName + "\"";
                lib.c.$("datadict", SCFILE_READONLY).select(dsql).iterate(function(record){
                   var ll=record.fields.length();
                   var i;
                   for(i=0;i<ll;i++)
                   { 
                      fieldList.push(record.fields[i]);
                      var fieldCapt=getFieldCaption(record.fields[i],tableN[p]);
                      displayList.push(fieldCapt);
                   }   
                });     
            }
        }
        else
        {
           var sql= "name=\"" + tableN[p] + "\"";
           if (table.doSelect(sql) == RC_SUCCESS)
           {
              var tmp_fields=table.fields;
              var len= tmp_fields.length();
              var k;
              for(k=0;k<len;k++)
              { 
                  fieldList.push(tmp_fields[k]);
                  var tmp=getFieldCaption(tmp_fields[k],tableN[p]);
                  displayList.push(tmp);
              }
            }
        } 
    }
    returnList[0]=fieldList;
    returnList[1]=displayList;
    return returnList;
}
