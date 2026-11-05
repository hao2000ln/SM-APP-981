/******************************************************
* Module Name: SMOO
* Function: CI context
* Author: Yang, Wen-Ying
* Version: 1.00
* Creation Date: Nov, 2009
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

/** This function retruns record of a CI
*
*	@param logical_name: logical name of CI
**/
function getCI(logical_name){
	var device = new SCFile( "device" );
	var sql = "logical.name = \""+logical_name +"\"";
	if(device.doSelect( sql ) == RC_SUCCESS ){
		return device;
	}
}

/** This function retruns value of CI field 
*
*	@param deviceRC: record of device
*	@param field_name: field name of device
**/
function getCIFieldValue(deviceRC, field_name){
	var strFiled =  field_name;
	var value = deviceRC[strFiled];
	if ( value == null ){
		var type = deviceRC.type;
		var logicalName = deviceRC.logical_name;
		value = getJoinRC(type,logicalName,strFiled);	
		if(value == null){
			return;
		}	
	} 
	var type = typeof value;
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

/** This function gets and returns the device type.
**/
function getDevtypeFiles(){
	var devtype = new SCFile( "devtype" );
	var sql = "attr.file <> \"NULL\"";
	var rc = devtype.doSelect( sql ) ;
	var type = new Array();
	while ( rc == RC_SUCCESS ){
		type.push(devtype.attr_file);
		rc = devtype.getNext();
	}
	return type;
}

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

function getJoinRC(type,logicalName,strFiled){
	var devtype = new SCFile("devtype");
	var RC = devtype.doSelect("device.type = \""+type+"\"");
	if(devtype.joindef!=null){
		var joinFile = new SCFile(devtype.joindef);
		var RC1 = joinFile.doSelect("logical.name = \""+logicalName+"\"");
		return joinFile[strFiled];
	}else{
		return;
	}
}