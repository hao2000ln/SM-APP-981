/** @fileoverview Template
*   @author Pete Budic
*/

/**
*   @class Template
*   @constructor
*/

var table = new SCFile( "dbdict" );
var datadict = new SCFile( "datadict" );
var joinfile = new SCFile( "joindefs" );
var object = new SCFile( "Object" );
var template;

/** This function gets all allowed fields for a Template.
*
*	@param {record} 	template    - The current template
*	@param {record{		old			- The old copy of the template
*	@param {boolean} 	reset   	- whether this is an add (true) or an update (false)
*   
*/

function getTemplateFields(newTemplate, old, add, isCheckSys) 
{
	template = newTemplate;
	
	//Added by Sal for MassUpdate...if the tablename is one of the joinfiles associated with ICM
	//then use the device datadict.
	// Do not need this for devices...
 	//if (system.functions.index(template.tablename,vars.$G_joinfiles)>0) 
 		
	var sql = "name=\"" + template.tablename + "\"";
	var joinsql = "join.name=\"" + template.tablename + "\"";
	var hasDatadict = datadict.doSelect( sql );
	var isJoin = joinfile.doSelect( joinsql );
	
	if ( isJoin == RC_SUCCESS )
	{
		var num = joinfile.join_tables.length();

		for (var i = 0; i < num; i++)
		{
			if ( i == 0 ) {
				sql = "name=\"" + joinfile.join_tables[i].table_name + "\"";
			}
			else {
				sql = sql + " or name=\"" + joinfile.join_tables[i].table_name + "\"";
		    }
		}
	}
	
	if ( table.doSelect( sql ) == RC_SUCCESS )
	{
		var pos = 0;
		do
		{
			var max = table.field.length();
			var singleSql = "name=\"" + table.name + "\"";
			var level = 1;
			var last = null;
			var current = null;
			
			if ( datadict.doSelect(singleSql) == RC_SUCCESS )
			{
				hasCaption = true;
			}
		
			for (var i = 0; i < max; i++)
			{
				current = "pos:" + table.field[i].level + ":" + table.field[i].index;
				if ( current != last )
				{
					if ( table.field[i].type != 9 )
					{
						if ( table.field[i].level <= level)
						{
							if ( table.field[i].type != 8 )
							{
								if ( getDatadictInfo(table.field[i].name, pos, isCheckSys) )
								{
									template.templateInfo[pos].field = table.field[i].name;
									template.templateInfo[pos].type  = ""+table.field[i].type;
									pos++;
								}
							}
							else
							{
								level = table.field[i].level;
								i++;
								if ( table.field[i].type != 9 )
								{
									if ( getDatadictInfo(table.field[i].name, pos, isCheckSys) )
									{
										template.templateInfo[pos].field = table.field[i].name;
										template.templateInfo[pos].type  = "8." + (table.field[i].type);
										pos++;
									}
								}
								else if(isCheckSys)
								{
									template.templateInfo[pos].field = table.field[i].name;
									template.templateInfo[pos].caption = table.field[i].name;
									template.templateInfo[pos].type  = "8." + (table.field[i].type);
									pos++;
								}
							}
						}
					}
					else
					{
						level = table.field[i].level + 1;
					}
				}
				last = current;
			}
		}
		while ( table.getNext() == RC_SUCCESS );
	}
		
	sql = "file.name=\"" + template.tablename + "\"";
	var hasObject = false;

	if ( object.doSelect( sql ) == RC_SUCCESS )
	{
		hasObject = true;
		for (var i = 0, iLoopTimes = object.watch_variables.length(); i < iLoopTimes; i++)
		{
			template.templateInfo[pos].field = object.watch_variables[i];
			template.templateInfo[pos].type  = object.watch_variable_type[i];
			var caption = funcs.scmsg(object.watch_variable_name[i], "sccaption");
			if (!caption) {
			    continue;
			}
			 
			if (caption.indexOf("Could not be found") >= 0) {
			    template.templateInfo[pos].caption = object.watch_variable_name[i];
			}
			else {
			    template.templateInfo[pos].caption = caption;
			}
			template.templateInfo[pos].globallist = object.watch_variable_global_list[i];
			
			if ( object.watch_variable_type[i] == "D" )
			{
				template.templateInfo[pos].type = "8.2";
				template.templateInfo[pos].fieldUsage = "description";
			}
			
			pos++;
		}
	}
	
	if ( add == false && old != null)
	{
		resetOldFields( template, old);
	}
	
	return true;
}

function getDatadictInfo( name, position, isCheckSys)
{
	var x = funcs.index( name, datadict.fields ) - 1;
	
	if ( x !=-1 && x != null )
	{
		if ( (datadict.sysFieldType[x] == 1 || datadict.sysFieldType[x] == 4) && !isCheckSys )
		{
			return false;
		}
		if ( datadict.system_fields[x] != true )
		{
			var captionStr = funcs.scmsg(datadict.captions[x],"sccaption");
			if (captionStr.indexOf("Could not be found") >= 0) {
			    template.templateInfo[position].caption = datadict.captions[x];
			}
			else {
			    template.templateInfo[position].caption = captionStr;
			}
			
			template.templateInfo[position].globallist = datadict.globallist[x];
			template.templateInfo[position].fieldUsage = isCheckSys ? ""+datadict.sysFieldType[x]:datadict.fieldUsage[x];
		}
		
		else
		{
			return false;
		}
	}
	else
	{
		template.templateInfo[position].caption = template.templateInfo[position].field;
	}
	return true;
}

function resetOldFields( file, old )
{
	if ( old != null && old.templateInfo.length() > 0 )
	{
		for (var i = 0, iLoopTimes = old.templateInfo.length(); i < iLoopTimes; i++)
		{
			if ( old.templateInfo[i].value != null )
			{
				for (var j = 0, jLoopTimes = file.templateInfo.length(); j < jLoopTimes; j++)
				{
					if (old.templateInfo[i].field == file.templateInfo[j].field )
					{
						file.templateInfo[j].value = ""+old.templateInfo[i].value;
					}
				}
			}
		}
	}
}

// This function fixes DE1577. The input is $L.file.
function printActivityUpdateReqdMsg(record)
{
	// Read the Object record for this record and if activity.mandatory is true,
	//  then display a message that says "The Activity Update field is required."

	var filename=funcs.filename(record);
	var objFile = new SCFile("Object", SCFILE_READONLY);
	var rc = objFile.doSelect( "file.name = \"" + filename + "\"" ); 
	if ( rc == RC_SUCCESS )
	{
		if (objFile.activity_mandatory) {
			print(funcs.scmsg(2213, "us"));
		}
	}
}

function makeTemplateInfoValueFromArray( aValueArray, iType )
{
	var strReturn="";
	var length=aValueArray.length();
	
	if (length == 1 && String(aValueArray[0]).indexOf("!|") != -1)
	{	
		return aValueArray[0];
	}
	else if (length > 0)
	{
		strReturn=String(iType) + "!|";
	}
	
	strReturn += aValueArray.join("\n");
	
	return strReturn;
}

function makeDisplayString( value )
{
	if (value === "" || value === null)
	{
		return;
	}
	
	var strValueString = String(value);
	
	if (strValueString.indexOf("!|") != -1)
	{
		strValueString = strValueString.slice(strValueString.lastIndexOf("!|") + 2);
	}
	
	strValueString= strValueString.replace(/\n/g," ");
	
	return strValueString.replace(/\t/g," ");
}

/*
*@QCNo:QCCR1E56799
*@Description:Blank array fields are set to {"2!| "} when applying a Default Template
*@Author:Modified by yuli
*@Date:since 2010/9/1
*/
function makeTemplateInfoArray( value,templateInfo,bMassUpdate)
{
        if (value == "" || value == null)
        {
                return [];
        }

        var strValueString = String(value);
        //For fixing QCCR1E84548
        if (strValueString == '{}')
        {
        		return [];
        }
        
        var iType;
        
        if (strValueString.indexOf("{\"") == 0)
        {
                strValueString = strValueString.slice(2);
        }
                                
        if (strValueString.indexOf("\"}") == strValueString.length - 2)
        {
                strValueString = strValueString.slice(0, strValueString.length - 2);
        }
        
        //For fixing QCCR31545
        //@author wzeng@hp.com
        //@date 2011-1-5
        strValueString = dereplaceStr( strValueString );
        
        if (strValueString.indexOf("!|") != -1)
        {
                iType = Number(strValueString.slice(0,strValueString.indexOf("!|")));
                strValueString = strValueString.slice(strValueString.lastIndexOf("!|") + 2); 
        } 
        
        if (templateInfo!=null) {
	        var type =templateInfo[1]; 
	        if (type!=null) {
		        var typeString = String(type);
		        if( typeString.indexOf(".")!=-1){
		        	iType = Number(typeString.substring(typeString.indexOf(".")+1,typeString.length));
		        }
	        }
        }
                
        var aReturn = new SCDatum();
        aReturn.setType(8);//change for fixing QCCR1E49784
        
        if (strValueString==null || strValueString.length==0){
        	return aReturn;
        }  
        
        var strValue;
        strValueString = strValueString.replace(/\r\n/g, '\n');
        strValueString = strValueString.replace(/\n$/g, '');
        var arrayValues = strValueString.split("\n");
        var leng = arrayValues.length;       
        
        for (var i=0;i<leng;i++){ 
        
                strValue = arrayValues[i];
                
                switch(iType)
                {
                        case 1: 
                                aReturn.push(Number(strValue));
                                break;
                        case 3: 
                                var dt = parseDateTime(templateInfo, strValue, bMassUpdate);                               
                                aReturn.push(dt);
                                break;                          
                        case 4:
                                strValue.toLowerCase();
                                if (strValue == "true")
                                {
                                        aReturn.push(true);
                                }
                                else
                                {
                                        aReturn.push(false);
                                }
                                break;  
                        default:
                                aReturn.push(strValue);
                }
                
        }
       
        return aReturn;
}


/**
 * Transform the expressions of panel 'apply.template' of RAD 'Template.apply' into javascript,
 * the original RAD expressions are as below:

  for $L.i = 1 to lng(denull(templateInfo in $L.temp)) do (if (1 in $L.i in templateInfo in $L.temp)~#"$" then ($L.type=val(2 in $L.i in templateInfo in $L.temp);$L.field=1 in $L.i in templateInfo in $L.temp;$L.value=3 in $L.i in templateInfo in $L.temp;if (not null($L.value) and not same($L.value, "") and not same($L.value, NULL)) then if ($L.type<8) then if ($L.type=3) then ($L.neg=false;if (index("-", $L.value)=1) then ($L.neg=true;$L.void=strclpl($L.value, 1));if (nullsub(7 in $L.i in templateInfo in $L.temp, "x")="duration") then ($L.field in $L.file=val($L.value, 3);if $L.neg then ($L.field in $L.file=$L.field in $L.file*-1)) else if (not $L.neg) then if $L.mass.update then ($L.field in $L.file=val($L.value, 3)) else ($L.field in $L.file=tod()+val($L.value, 3)) else if $L.mass.update then ($L.field in $L.file=val($L.value, 3)) else ($L.field in $L.file=tod() - val($L.value, 3))) else ($L.field in $L.file=val(strrep(strrep(str($L.value), "\\", "\\\\"), "\"", "\\\""), val($L.type))) else (if (7 in $L.i in templateInfo in $L.temp="description") then ($L.value="{\""+strrep(strrep($L.value, "\\", "\\\\"), "\"", "\\\"")+"\"}");$L.field in $L.file=jscall("Template.makeTemplateInfoArray", $L.value));if (same($L.field in $L.file, "") or same($L.field in $L.file, NULL) or lng($L.field in $L.file)=0) then ($L.field in $L.file=NULL)))

  for $L.i = 1 to lng(denull(templateInfo in $L.temp)) do (if (1 in $L.i in templateInfo in $L.temp)#"$" then ($L.field=NULL;$L.type=val(2 in $L.i in templateInfo in $L.temp);$L.field.name=1 in $L.i in templateInfo in $L.temp;$L.value=3 in $L.i in templateInfo in $L.temp;if (not null($L.value) and not same($L.value, "") and not same($L.value, NULL)) then if ($L.type<8) then if ($L.type=3) then ($L.neg=false;if (index("-", $L.value)=1) then ($L.neg=true;$L.void=strclpl($L.value, 1));if (nullsub(7 in $L.i in templateInfo in $L.temp, "x")="duration") then ($L.field=val($L.value, 3);if $L.neg then ($L.field=$L.field*-1)) else if (not $L.neg) then if $L.mass.update then ($L.field in $L.file=val($L.value, 3)) else ($L.field=tod()+val($L.value, 3)) else if $L.mass.update then ($L.field in $L.file=val($L.value, 3)) else ($L.field=tod() - val($L.value, 3))) else ($L.field=val(strrep(strrep(str($L.value), "\\", "\\\\"), "\"", "\\\""), val($L.type))) else (if (7 in $L.i in templateInfo in $L.temp="description") then ($L.value="{\""+strrep(strrep($L.value, "\\", "\\\\"), "\"", "\\\"")+"\"}");$L.field=evaluate(parse($L.value, 8)));if (same($L.field, "") or same($L.field, NULL) or lng($L.field)=0) then ($L.field=NULL));$L.void=evaluate(parse(str($L.field.name)+"=$L.field", 11)))

 */

var TYPE_Array = 8;
var TYPE_Number = 1;
var TYPE_DateTime = 3;
var TYPE_Expression = 11;

/**
 * This function will be called in panel 'apply.template' of RAD 'Template.apply' as:
 *  $L.void=jscall("Template.applyTemplate", $L.file, $L.temp, $L.mass.update)
 *  
 * @author wzeng@hp.com
 * @date 2011-01-05
 */
function applyTemplate( $L_file, $L_temp, bMassUpdate ) {

    /**
     * templateInfo:
     *      caption : 4
     *      display : 6
     *      field : 1
     *      fieldUsage : 7
     *      globallist : 5
     *      type : 2
     *      value : 3
     *
     */

	var hasDataDict = false;
	if ( datadict.doSelect("name=\"" + $L_temp.tablename + "\"") == RC_SUCCESS ) {
		hasDataDict = true;
	}

    var templateInfo = $L_temp.templateInfo;
    var n = ( templateInfo != null ? templateInfo.length() : 0 );
    for( var i = 0; i < n; i++ ) {
        var field = templateInfo[i].field; // 1
        var bField = false;
        if( field != null && field != "" ) {
            bField = ! ( /^\$.*/.test( field ) ); // check is a field or not
            var type = _val( templateInfo[i].type ); // 2
            var value = templateInfo[i].value; // 3
            
            if( value != null && value != "" ) {
            	// skip the system field
        		if ( hasDataDict ) {
        			var	x = funcs.index( field, datadict.fields ) - 1;
        			if ( x !=-1 && x != null ) {
        				if ( datadict.sysFieldType[x] == 1 || datadict.sysFieldType[x] == 4 ) {
							continue;
						}
        			}
		        }
            
                if( type < TYPE_Array ) {
                    if ( bField ) {
                        if( type == TYPE_DateTime ) {
                        	parseDateTimeType( $L_file, templateInfo[i], field, value, bMassUpdate );
                        }else {
                            $L_file[ field ] = _val( _str( value ), type );
                        }
                    }
                }else {
                    if( "description" == templateInfo[i].fieldUsage ) { // 7
                        value = "{\"" + replaceStr( _str( value ) ) + "\"}";
                    }
                    
                    if( bField ) {
                        $L_file[ field ] = makeTemplateInfoArray( value,templateInfo[i],bMassUpdate);
                    }else {
                        value = _parse( value, TYPE_Array );
                    }
                }
            }
        }else {
            value = null;
        }
        
        if( ! bField && (field != null && field != "" )) {
            _evaluate( _parse( "$L.t.e.m.p=NULL", TYPE_Expression ) );
            vars.$L_t_e_m_p = value;
            _evaluate( _parse( _str( field ) + "=$L.t.e.m.p", TYPE_Expression ) );
            _cleanup( "$L.t.e.m.p" );
        }
    }

}

function parseDateTime( templateInfo, value, bMassUpdate ) {
    var neg = false;
    var result;
    
    var isDuration = isDurationDate(value);
    
    if( value.indexOf( '-' ) == 0 ) {
        neg = true;
        value = value.substring( 1 );
    }
    if( "duration" == templateInfo.fieldUsage ) {
        if( neg ) {
           _evaluate( _parse( "$L.tempDateTime=val(\"" + value + "\"," + TYPE_DateTime + ")*-1", TYPE_Expression ) );
           result = vars.$L_tempDateTime;
        }else {
           result = _val( value, TYPE_DateTime );
        }
    }else if( ! neg ) {
        if( (bMassUpdate && bMassUpdate !="false") || !isDuration) {
            result = _val( value, TYPE_DateTime );
        }else {
            _evaluate( _parse( "$L.tempDateTime=tod()+val(\"" + value + "\"," + TYPE_DateTime + ")", TYPE_Expression ) );
            result = vars.$L_tempDateTime;
        }
    }else if( (bMassUpdate && bMassUpdate !="false") || !isDuration) {
        result = _val( value, TYPE_DateTime );
    }else {
            _evaluate( _parse( "$L.tempDateTime=tod()-val(\"" + value + "\"," + TYPE_DateTime + ")", TYPE_Expression ) );
            result = vars.$L_tempDateTime;
    }
    
    return result;
}

function parseDateTimeType( $L_file, templateInfo, field, value, bMassUpdate ) {
	 $L_file[ field ]  = parseDateTime(templateInfo , value, bMassUpdate);    
}

// replace '\' with '\\' and '"' with '\"' in string
function replaceStr( str ) {
    return str ? str.replace( /(\\|")/g, "\\$1" ) : str;
}

// replace '\\' with '\' and '\"' with '"' in string
function dereplaceStr( str ) {
    return str ? str.replace( /\\(\\|")/g, "$1" ) : str;
}

// str
function _str( strArr ) {
    return funcs.str( strArr );
}

function _val( value, type ) {
    return funcs.val( value, ( type == null ) ? TYPE_Number : type );
}

function _evaluate( expr ) {
    return funcs.evaluate( expr );
}

function _parse( value, type ) {
    return funcs.parse( value, type );
}

function _tod() {
    return funcs.tod();
}

function _cleanup( vname ) {
	if( vname ) {
		_evaluate( _parse("cleanup(" + vname + ")", TYPE_Expression ) );
	}
}


function getLinkFormat(fieldName, formType) {
	// var formName = 'template.editValue_link_array_1';
	
	var formName = 'wizard-template.editValue_link_array_1';
	
	if (formType=='link') {
		formName = 'wizard-template.editValue_link_1';
	}
	
	var format = lib.c.$('format').select('name="'+formName+'"').scfile;
	
	var lng = format.field.length();
	// print(lng);
	for( var k=0;k<lng;k++){
		var input = format.field[k]['input'];
		
		if(input=='$field.value'){
			format.field[k]['input'] = fieldName;
		}		
	}
	
	return format;
}

/**
 * return true if a datetime string is duration type, else false
 */
function isDurationDate(str) {
    if (!str) return false;

    var index = str.indexOf(' ');
    if (index < 0) {
        if (/^\d\d\:\d\d$/.test(str)) { // match hh:mm
            return true;
        }

        if (/^\d\d\:\d\d\:\d\d$/.test(str)) {   // // match hh:mm:ss
            return true;
        }

        return false;
    }

    var left = str.substring(0, index);
    if (/^[-0-9]+$/.test(left)) {   // match ddd hh:mm or ddd hh:mm:ss
        return true;
    }

    return false;
}