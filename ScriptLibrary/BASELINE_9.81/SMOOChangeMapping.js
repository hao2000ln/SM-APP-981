/******************************************************
* Module Name: SMOO
* Function: CM3R context
* Author: Yang, Wen-Ying
* Version: 1.00
* Creation Date: Mar, 2010
*******************************************************/
/** This function gets and returns all captions for a table.
*
*	@param {table} 		table	    - a table name
*/
function queryDataDict(tablename){
	var table = new SCFile( "dbdict" );
	var datadict = new SCFile( "datadict" );
	var joinfile = new SCFile( "joindefs" );
	var object = new SCFile( "Object" );
	var fieldList = new Array();
			
	var sql = "name=\"" + tablename + "\"";
	var joinsql = "join.name=\"" + tablename + "\"";
	var hasDatadict = datadict.doSelect( sql );
	var isJoin = joinfile.doSelect( joinsql );
	
	if ( isJoin == RC_SUCCESS )
	{   
		var num = joinfile.join_tables.length();
		for (var i = 0; i < num; i++)
		{
			if ( i == 0 )
				sql = "name=\"" + joinfile.join_tables[i].table_name + "\"";
			else
				sql = sql + " or name=\"" + joinfile.join_tables[i].table_name + "\"";
		}		
	}
	
	if ( datadict.doSelect( sql ) == RC_SUCCESS ){
		return datadict;
	}
}

function getRecordCaptions(datadict, isCaptions)
{
    if(isCaptions){
		return  datadict.captions;
	}else{
		return datadict.fields;
	}
}

/**
	This function is based on template.getDatadictInfo and validates a field
	is in use.
**/

function getDatadictInfo( name, position, datadict)
{
	var x;
	x = system.functions.index( name, datadict.fields ) - 1;
	
	if ( x !=-1 && x != null )
	{
		if ( datadict.sysFieldType[x] == 1 || datadict.sysFieldType[x] == 4  || datadict.avail[x] == false)
		{
			return false;
		}
	}
	return true;
}


/** This function retruns the js name of field name
*
*	@param strFieldName: field name of a table

function scToJSName(strFieldName)
{
  	var reg = /(\.|\s)/g;

  	if ( system.functions._null(strFieldName) )
  		strFieldName = " ";
  	return strFieldName.replace(reg, "_");
}
**/

function updateGlobalList(){
	var fieldList = new Datum();
	var types = getDevtypeFiles();
	var stringType = "name = \"device\" ";
	for(var i = 0; i < types.length; i++){	
		stringType = stringType + "or name = \"" + types[i] + "\" ";
	}
	var captionList = vars.$G_oo_caption_list;
	for(var i = 0; i < captionList.length(); i++){	
		var caption = new Array();
		caption.push(captionList[i]);
		var datadict = new SCFile( "datadict" );
		var sql = "captions = \""+caption+"\" and ("+ stringType + ")";
		var findField = datadict.doSelect( sql );
		if(findField==RC_SUCCESS ){
			for( var j = 0; j< datadict.fields.length(); j++){
				if(datadict.captions[j] == captionList[i]){
					fieldList.push(datadict.fields[j]);
					break;
				}
			}
		}else{
			fieldList.push("");
		}
	}
	return fieldList;
}

/** This function retruns value of Change field 
*
*	@param deviceRC: record of change
*	@param field_name: field name of device
**/
function getChangeFieldValue(changeRC, field_name){
	var strFiled =  field_name;
	var value = changeRC[strFiled];
	var type = typeof value;
	if ( value== null){
		return;
	}
	if ( type == 'object' && value.pop){
		var arrayToString;
		for(var i = 0; i < value.length() ; i++){
			if(value[i]!=null){
				if(arrayToString!=null){
					arrayToString = arrayToString + "," + value[i];
				}else {
					arrayToString = value[i];
				}
			}
		}
		if(arrayToString != null){
			return arrayToString;
		}
	} else {
		return value;
	}
}