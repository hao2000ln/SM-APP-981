/************************************************
	@fileoverview GetFieldnames
	@author: 	Joe Holloway
		
	This script creates functions to select fields   
	in a table and creates an array of field names, 
	field captions and field types.	

	@Date: 		2/1/07
	
*************************************************/

/**
 * This function creates an array list for giving sm file name. 
 * 
 * 1. Construct an "Attribute" object for every field which stored in "datadict"
 * 2. Mark this "Attribute" is available or not according to "avail" field value
 *    which stored in "datadict".
 * 3. Mark "Attribute" is an alias or not (If a field has the same index and 
 *    level as the field prior to it. If so, it is an alias field.)
 * 4. Mark "Attribute" is an array or not (Which data type is 8)
 * 
 * P.S.
 * Here we assume that the fields stored in "dbdict" and "datadict" are in the 
 * same order. 
 * Because some fields may have the same name in "datadict", and we don't known 
 * which is the correct "dbdict" record described the "datadict". Just assume 
 * the record first appears in "datadict" should first appears in "dbdict".
 * 
 * @param {String} datadictname - name of datadict to
 * @param {Boolean} excludeArrays - optional
 * @param {Boolean} return fields type - optional
 * @return {Array} - used to return the field names
 */
var $=lib.c.$;
function getFieldData(datadictname, excludeArrays, returnTypeArrays) {
    // this parameter is optional, if not provided, assign it false
    if (!excludeArrays) {
        excludeArrays = false;
    }
    if (!returnTypeArrays) {
        returnTypeArrays = false;
    }    
    
    function Attribute() {
        // The value of these two fields are come from "datadict"
        this.name;
        this.avail;
        this.invisible;
        this.type;
        
        // The value of these two fields are calculated from "dbdict"
        this.isArray;
        this.isAlias;
        
        // This is a work around for datadict which have the same field;
        // And there is no other information can provide to distinguish them
        // Put these fields in a chain, but the order of fields may change,
        // so add a "index" to indicate the fields order, do a sort at the end
        this.index;
        this.next = null;
        this.isConsumed = false;
    }

    function findFileName(datadictname) {
        var name = datadictname;
        if (system.functions.index(datadictname, vars.$G_joinfiles) > 0) {
            var fJoinDefs = new SCFile("joindefs");
            var rc = fJoinDefs.doSelect("join.name=\"" + datadictname + "\"");
            if (rc != RC_SUCCESS)
                throw ("The record \"joindefs(join.name=" + datadictname +")\" could not be found.");
            var tables = fJoinDefs.join_tables;
            name = tables[1][0];
        } 
        return name;
    }

    /**
     * Build field attributes, do not make any desicion, just provide information.
     */
    function FieldAttributeBuilder(filename) {

        /**
         * Store field attribute information
         * map "field.name" -> "field"
         */
        var _attributes = {};

        /**
         * Read "datadict" to constuct the "Attribute"s.
         */
        function constructAttributes() {
            var datadict = new SCFile("datadict");
            var rc = datadict.doSelect("name=\"" + filename + "\"");
            if (rc != RC_SUCCESS)
                throw ("The record \"datadict(name=" + filename +")\" could not be found.");

            // "fields" and "avails" should have the same length
            var fields = datadict.fields;
            var avails = datadict.avail;
            var invisibles = datadict.invisible;
            var types    = datadict.types;
            var i;
            var attribute;
            for (i = 0, iLoopTimes = fields.length(); i < iLoopTimes; i++) {
                attribute = new Attribute();
                attribute.name = fields[i];
                attribute.avail = system.functions.evaluate(avails[i]);
                attribute.invisible = invisibles[i];
                attribute.type = types[i];
                attribute.index = i;
                
                // When fields[i] == "eval", processing _attributes[fields[i]] will always be true
                // Because "eval" is a buildin function in assocate array
                // It means {}["eval"] will return a function body.
                // use "hasOwnProperty" instead
                if (_attributes.hasOwnProperty(fields[i])) {
                    _attributes[attribute.name].next = attribute;
                } else {
                    _attributes[attribute.name] = attribute;
                }
            }
        }

        /**
         * Map dbdict field to datadict field base on its field name.
         */
        function findDatadictAttribute(fieldname) {
            var attribute = _attributes[fieldname];
            while (attribute != null && attribute.isConsumed == true) {
                attribute = attribute.next;
            }
            return attribute;
        }

        /**
         * Read "dbdict" to udpate the "Attribute"s.
         */
        function updateAttributes() {
            var dbdict = new SCFile("dbdict");
            var rc = dbdict.doSelect("name=\"" + filename + "\"");
            if (rc != RC_SUCCESS)
                throw ("The record \"dbdict(name=" + filename +")\" could not be found.");
            
            var fields = dbdict.field;
            var previous = null;
            var displayFieldAndAlias = lib.DisplayName.getDisplayNameFieldAndAlias(filename);
            var i;
            var current;
            var attribute;
            for (i = 0, iLoopTimes = fields.length(); i < iLoopTimes; i++) {
                current = fields[i];
                attribute = findDatadictAttribute(current.name);

                if (attribute) {
                    attribute.isConsumed = true;
                    
                    // This for loop iterates through the dbdict field structure,
                    // and checks to see if a field has the same index and level as
                    // the field prior to it. If so, it is an alias field.
                    if (previous != null && 
                        current.level == previous.level && 
                        current.index == previous.index) {
                        attribute.isAlias = true;
                    }

                    // When the type of a field is array (data type = 8)
                    // Then the field name will repeat twice, one for array
                    // itself, another is for the field which array contains
                    // 
                    // e.g
                    // Create an array "test.field", and choose the data type as
                    // "Character". 
                    // In "dbdict" definition there will have two record, like
                    // 
                    // Name           Type        level
                    // test.field     array         1
                    //   test.field   character     2
                    // 
                    // And there is only one "test.field" record in "datadict".
                    // That is to say, when "dbdict" record encounter an "array", 
                    // it shouldn't consume the "datadict" record, just let it go, 
                    // make its member to consume this "Attribute"
                    if (current.type == 8) {
                        attribute.isArray = true;
                        attribute.isConsumed = false;
                    }
                    if( displayFieldAndAlias!= null ){
                		if(attribute.name == displayFieldAndAlias[0]) attribute.invisible=true;
	                	if(attribute.name == displayFieldAndAlias[1]) attribute.isAlias=false;
                	}
                }
                previous = current;
            }
        }
        
        this.build = function() {
            constructAttributes();
            updateAttributes();
            return _attributes;
        };
    }

    /**
     * Make decision which field should return to the caller.
     */
    function isVisible(attribute) {
        if (!attribute.avail) return false;
        if (attribute.invisible) return false;
        if (attribute.isAlias) return false;
        if (excludeArrays && attribute.isArray) return false;
        return true;
    }
    
    var attributes = {};
    try {
        var filename = findFileName(datadictname);
        var builder = new FieldAttributeBuilder(filename);
        attributes = builder.build();
    } catch (err) {
        print(err);
    }
    
    // Remove the unwanted field names.
    // Because when iterate assocate array, the field appear order have been 
    // changed, use "attribute.index" to do a radix sort.
    var fields = [];
    var fieldTypes = [];
    var name;
    var attribute;
    for (name in attributes) {
        attribute = attributes[name];
        while (attribute != null) {
            if (isVisible(attribute) && (datadictname != "ScriptLibrary" || attribute.name != "script")) {
                fields[attribute.index] = attribute.name;
                fieldTypes[attribute.index] = attribute.type;
            }    
            attribute = attribute.next;
        }
    }

    // Remove the empty attributes.
    var listFields = new Datum();
    listFields.setType(8); 
    var listTypes = new Datum();
    listTypes.setType(8); 
       
    var i;
    for (i = 0; i < fields.length; i++) {
        if (fields[i]) {
            listFields.push(fields[i]);
            listTypes.push(fieldTypes[i]);
        }
    }
    
    if (returnTypeArrays) return [listFields, listTypes];

    return listFields;
}


function getJoinData( joinName, excludeArrays )
{
	var sql = "join.name=\""+joinName+"\"";
	var join = new SCFile( "joindefs" );
	var fieldlist = new Datum();
	fieldlist.setType(8);
	var captionlist = new Datum();
	captionlist.setType(8);
	
	
	if ( join.doSelect( sql ) == RC_SUCCESS )
	{
		for ( var i = 0, iLoopTimes = join.join_tables.length(); i < iLoopTimes; i++ )
		{
			var temp;
			var caption;
			if ( join.join_tables[i].table_name != null )
			{
				temp = getFieldData( join.join_tables[i].table_name, false);
				
				
				for ( var j = 0, jLoopTimes = temp.length(); j < jLoopTimes; j++ )
				{
					if ( system.functions.index( temp[j], fieldlist ) == 0 )
					{
						fieldlist = system.functions.insert(fieldlist, 0, 1, temp[j] );
						caption = system.functions.get_field_caption( temp[j], join.join_tables[i].table_name );
						
						captionlist = system.functions.insert(captionlist, 0, 1, caption );
					}
				}
			}
		}
	} 
	
	else
	{
		fieldlist =  lib.GetFieldNames.getFieldData( joinName, false );
		captionlist = lib.convertToCaptions.getFieldCaptions( fieldlist, joinName);	
	}
	
	var returnlist = new Datum();
	returnlist.setType(8);
	
	returnlist = system.functions.insert( returnlist, 0, 1, fieldlist );
	returnlist = system.functions.insert( returnlist, 0, 1, captionlist );
	
	return returnlist;
}


function getAllFields( joinName )
{
	var returnlist = new Datum();
	returnlist.setType(8);
	
	returnList = getJoinData( joinName, false );
	
	var sql = "join.name=\""+joinName+"\"";
	var join = new SCFile( "joindefs" );
	var fieldlist = new Datum();
	fieldlist.setType(8);
	var captionlist = new Datum();
	captionlist.setType(8);
	var structures = new Datum();
	structures.setType(8);
	
	
	if ( join.doSelect( sql ) == RC_SUCCESS )
	{
		for ( var i = 0, iLoopTimes = join.join_tables.length(); i < iLoopTimes; i++ )
		{
			var caption;
			if ( join.join_tables[i].table_name != null )
			{
				var file = new SCFile( "dbdict" );
				var sql = "name=\"" + join.join_tables[i].table_name  +"\"";

				if ( file.doSelect( sql ) == RC_SUCCESS )
				{

					for ( var j = 0, jLoopTimes = file.field.length() - 1; j < jLoopTimes; j++ )
					{
					 	
						if ( file.field[j].type == 8 && file.field[j + 1 ].type == 9 )
						{
							var struct = file.field[j + 1].level;
							structures = system.functions.insert( structures, 0, 1, file.field[j + 1].name );
							j = j + 2;
							do
							{
								if ( file.field[j].type != 8 && file.field[j].type !=9 )
								{
									fieldlist = system.functions.insert( fieldlist, 0, 1, file.field[j].name);
								}
								j++;
																	
							}
							while ( file.field[j].level > struct &&  j < file.field.length() + 1 && struct != null );
							j--;
						}
					}
				}
			}
			
		}
	}
	
	if ( fieldlist != null )
	{
		for ( var i = 0, iLoopTimes = fieldlist.length(); i < iLoopTimes; i++ )
		{
			returnList[0] = system.functions.insert( returnList[0], 0, 1, fieldlist[i]);
			returnList[1] = system.functions.insert( returnList[1], 0, 1, fieldlist[i]);
		}
	} 
	returnList =  system.functions.insert( returnList, 0, 1, structures );
	
	return returnList;
}

//Currently only Set Expected State can support array of strucutre field , create a special method to get all the fields inlcuding sub fields in array of structure field
function getAllFieldsForExpState( joinName )
{
	var returnlist = new Datum();
	returnlist.setType(8);
	
	returnList = getJoinData( joinName, false );
	
	
	var sql = "join.name=\""+joinName+"\"";
	var join = new SCFile( "joindefs" );
	var fieldlist = new Datum();
	fieldlist.setType(8);
	var captionlist = new Datum();
	captionlist.setType(8);
	var structures = new Array();

	
	
	if ( join.doSelect( sql ) == RC_SUCCESS )
	{
		for ( var i = 0, iLoopTimes = join.join_tables.length(); i < iLoopTimes; i++ )
		{
			var caption;
			if ( join.join_tables[i].table_name != null )
			{
				fieldlist = getStructuredFields(join.join_tables[i].table_name,fieldlist,structures);
			}
			
		}
	}else if(joinName =="device"){
	
		fieldlist = getStructuredFields(joinName,fieldlist,structures);
	
	}
	
	//remove the structure field itself
	var tmpFieldDatum = new Datum();
	tmpFieldDatum.setType(8);
	var tmpCaptionDatum = new Datum();
	tmpCaptionDatum.setType(8);
	var fieldNameList = returnList[0].toArray();
	var captionList = returnList[1].toArray();
	for ( var i =0; i < system.functions.lng(fieldNameList); i++ ){
		if(!lib.ArrayUtil.contains(structures,fieldNameList[i])){
			tmpFieldDatum.push(fieldNameList[i]);
			tmpCaptionDatum.push(captionList[i])
		}	
	}
	returnList[0]=tmpFieldDatum;
	returnList[1]=tmpCaptionDatum;
	
	
	
	if ( fieldlist != null )
	{
		for ( var i = 0, iLoopTimes = fieldlist.length(); i < iLoopTimes; i++ )
		{
			returnList[0] = system.functions.insert( returnList[0], 0, 1, fieldlist[i]);
			returnList[1] = system.functions.insert( returnList[1], 0, 1, fieldlist[i]);
		}
	} 
    
	returnList =  system.functions.insert( returnList, 0, 1, structures );
	return returnList;
}


function getStructuredFields(filename, fieldlist, structures){

	var file = new SCFile( "dbdict" );
	
	var sql = "name=\"" + filename  +"\"";
	
	if ( file.doSelect( sql ) == RC_SUCCESS )
	{

		for ( var j = 0, jLoopTimes = file.field.length() - 1; j < jLoopTimes; j++ )
		{
		 	
			if ( file.field[j].type == 8 && file.field[j + 1 ].type == 9 )
			{
				var struct = file.field[j + 1].level;
				structures.push(file.field[j + 1].name);
				j = j + 2;
				do
				{
					if ( file.field[j].type != 8 && file.field[j].type !=9 )
					{
						fieldlist = system.functions.insert( fieldlist, 0, 1, file.field[j].name);
					}
					j++;
														
				}
				while ( file.field[j].level > struct &&  j < file.field.length() + 1 && struct != null );
				j--;
			}
		}
	}

	return fieldlist;
}



// This function returns the sysFieldType of a given fieldName
// Input: Field Name, dbdict resultset 

function getSysFieldType (fieldName,fDatadict)

{
   
  var max = fDatadict.fields.length();
  		for (var x=0; x < max; x++ )
  		{
  			
  			if ( fDatadict.fields[x] == fieldName)
  			{
  				return fDatadict.sysFieldType[x];
  			}
  		}
  
    return -1;
}

// This function returns the availability of a given fieldName.
// Input: Field Name, dbdict resultset 

function getSysFieldAvail (fieldName,fDatadict)

{
   
  var max = fDatadict.fields.length();
  		for (var x=0; x < max; x++ )
  		{
  			
  			if ( fDatadict.fields[x] == fieldName)
  			{
  			    
  			    if (fDatadict.avail[x])    
  			     	 return true;
  			    else 
  			         return false;
  			}
  		}
  
    return false;
}

function getJoinFileFromDeviceType(typeName) {

	var deviceType = $("devtype", SCFILE_READONLY).select("device.type=\"" + typeName + "\"").uniqueResult();
	if (deviceType != null) {
		return deviceType["joindef"];
	}
	return null;
}

function getJoinFileData(joinName) {
	var sql = "join.name=\"" + joinName + "\"";
	var join = new SCFile("joindefs");
	var fieldlist = [];
	var captionlist = [];
	if (join.doSelect(sql) == RC_SUCCESS) {
		for (var i = 0, iLoopTimes = join["field.names"].length(); i < iLoopTimes; i++) {
			fieldlist.push(join["field.names"][i]);
			captionlist.push(join["field.captions"][i]);
		}
	} else {
		fieldlist = lib.GetFieldNames.getFieldData(joinName, false);
		captionlist = lib.convertToCaptions.getFieldCaptions(fieldlist, joinName);
	}
	var returnlist = new Datum();
	returnlist.setType(8);
	returnlist = system.functions.insert(returnlist, 0, 1, fieldlist);
	returnlist = system.functions.insert(returnlist, 0, 1, captionlist);
	return returnlist;
}

function getBelongToFile(fieldName, fileName) {
	return getJoinFieldData(fieldName, fileName)[0];
}



function getFileDescritor(fileName, scdFileName) {


	var sql = "join.name=\"" + fileName + "\"";
	var join = new SCFile("joindefs");
	var joinStr = ""
	if (join.doSelect(sql) == RC_SUCCESS) {
		joinStr = join["join.tables"][0].table_name + ";logical.name;"+scdFileName+";logical.name;";
	} else {
		joinStr = fileName + ";";
	}
	return joinStr;

	
}

function getFieldDescriptor(fieldName, fileName) {
    var fileHeader=getBelongToFile(fieldName, fileName)
	if ( fileHeader=== "device") return "device" + ";" + getJoinFieldData(fieldName, fileName)[1];
	var str = getFileDescritor(fileName,fileHeader);
	var fieldData = getJoinFieldData(fieldName, fileName);
	if (fileName === fieldData[0]) {
		str += fieldData[1];
	} else {
		str += fieldData[0] + ";" + fieldData[1];
	}
	return str;
}
function getAllFieldsDescriptor(fileName)
{

   var fieldList=[];
   var sql = "join.name=\"" + fileName + "\"";
    var join = new SCFile("joindefs");
	var joinStr = ""
	if (join.doSelect(sql) == RC_SUCCESS) {
	    joinStr=join["join.tables"][0].table_name + ";logical.name;";
		for (var i = 1, iLoopTimes = join["join.tables"].length(); i < iLoopTimes; i++) {
			//joinStr += join["join.tables"][i].table_name + ";logical.name;";
			fieldList.push(joinStr+join["join.tables"][i].table_name + ";logical.name;"+join["join.tables"][i].table_name+";*")
		}
		//joinStr+=join["join.tables"][i-1].table_name+";*"
	} 
	return fieldList;

}

function constractFieldDescriptor(fieldDescStr) {


    if (fieldDescStr != null) {
    
        
        var fieldDescArr = fieldDescStr.split(";");
        if (fieldDescArr.length >= 6 && fieldDescArr[0] == "device") {
            var sql = "file1=\"" + fieldDescArr[0] + "\" and file2=\"" + fieldDescArr[2] + "\"";
            var erddef = $("erddef", SCFILE_READONLY).select(sql).uniqueResult();
            if (erddef != null) {
                var newFieldDescStr = getJoinDef(fieldDescArr[0], fieldDescArr[2]) + ";" + getJoinField(fieldDescArr[4], fieldDescArr[5])
                for (var i = 6; i < fieldDescArr.length; i++) {
                    newFieldDescStr += ";" + fieldDescArr[i]
                }
                return newFieldDescStr;
            }
        }
    }
    return fieldDescStr;

}
function constractSingleFieldDescriptor(fieldDescStr) {

    if (fieldDescStr != null) {
        if (vars["$ci.type"]!=null){
            var hasJoinFile=false;
            var joinFileName=getJoinFileFromDeviceType(vars["$ci.type"])
            if (joinFileName !=null)
            {
                  hasJoinFile=true;
            }
        }

        fieldDescArr = fieldDescStr.split(",");
        var index = fieldDescStr.indexOf(";");
       
        if (index === -1 && fieldDescArr.length === 2 && fieldDescArr[0] != "device") {

            return "device;logical.name;" + fieldDescArr[0] + ";logical.name;" + fieldDescArr[0] + ";" + fieldDescArr[1];
        } else if ((index === -1 && fieldDescArr.length === 2 && fieldDescArr[0] === "device" && !hasJoinFile)) {
            return fieldDescArr[1];
        } else {
            return fieldDescStr;
        }
    }
    return fieldDescStr;
}

function getJoinDef(fileName1, fileName2) {
	var sql = "join.tables,table.name =\"" + fileName1 + "\" and join.tables,table.name =\"" + fileName2 + "\"";
	var deviceType = $("joindefs", SCFILE_READONLY).select(sql).uniqueResult();
	if (deviceType != null) return deviceType["join.name"];
	return null;
}

function getJoinField(fileName, fieldName) {
	return fileName + "," + fieldName;
}

function getJoinFieldData(fieldName, fileName) {
	var fieldData = [];
	if (fieldName!=null){
	var index = fieldName.indexOf(",");
	if (index > 0) {
		fieldData.push(fieldName.slice(0, index));
		fieldData.push(fieldName.slice(index + 1))
	} else {
		fieldData.push(fileName);
		fieldData.push(fieldName)
	}}
	return fieldData;
}
function removeFileHeader(query)
{

return query.replace(/(device,)/g,"");

}

function makeGroupFields(fileName){
    var list = getFieldData(fileName).toArray();
    var _ = lib.Underscore.require();
    var list2 =  _.filter(list, item=> item!='next.sla.target.time' && item!='next.ola.target.time');
    return list2;
}	
		





