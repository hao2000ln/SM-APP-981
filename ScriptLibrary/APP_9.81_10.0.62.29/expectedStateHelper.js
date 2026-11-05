/***************************
@author:Anne Pietruschinski
2010
Description:

Helper functons for expected State wizard

****************************/


function getFilterCriteriaDataType(filename, fieldname, fieldvalue) //$L.use.filename,$this.name,$this.value
{
    vars.$isLinkDisplayField=lib.ddmEventHelper.isDisplayField(filename, fieldname);
    
    //Initialize dbdict variable
    var dbdict=new SCFile("dbdict");
    //Initialize variable containing filename where field was found
    var fieldfile;
    //Initialize variable containing field type
    var rettype;
    //initialize boolean variables to false
    vars["$multiple"]=false;
    vars["$append"]=false;
    vars["$mandatory"]=false;
    vars["$this.setnull"]=false;
    // FS no affected CI's means called from create baseline wizard - set flag for special treatment
    vars["$ExpectedStateWizard"]=(vars["$change.cis"]==null ? false : true);
    
    if (fieldname==null) //field name not set yet, so no data type
    {
        vars["$this.actvalues"]={};
        //FS for baseline wizard part - no actual values
        if (vars["$ExpectedStateWizard"])
        {
            vars["$this.actvalues"]=funcs.insert(vars["$this.actvalues"],0,vars["$change.cis"].length(),"");
        }
        return null;        
    }
    else //fieldname set
    {
        if (filename=="device")//not a joinfile or multiple CI Types
        {
            
            var rc=dbdict.doSelect("name=\"device\""); //select device dbdict
            fieldfile="device"; 
        }
        else
        {
            
            //init joindefs variable and select joindefs-record
            var join=new SCFile("joindefs");
            var rc=join.doSelect("join.name=\""+filename+"\"");
            if (rc==RC_SUCCESS)//joindefs record found
            {
                
                var found=false;
                var count=0;
                while (count<join["join.tables"].length() && found==false) //loop through all tables defined in joindef while field has not been found
                {
                    
                    var rc2=dbdict.doSelect("name=\""+join["join.tables"][count][0]+"\""); //select according dbdict
                    
                    
                    if (getFieldIndexInDbdict(fieldname,join["join.tables"][count][0])>0) //field is in this dbdict
                    {
                        
                        found=true;
                        fieldfile=join["join.tables"][count][0];
                    }
                    else //field is not in this dbdict
                    {
                        
                        count++;
                    }
                    
                }
            }
            else //joindefs record not found
            {
                print("Joinfile "+vars["$L.use.filename"]+" has not been found.");
            }
        }
        
        if (dbdict==null)
        {
            print("Dbdict has not been found.");
        }
        else
        {
            //select datadict
            
            var sql="name=\""+funcs.nullsub(fieldfile, "device")+"\"";
            var datadict=new SCFile("datadict");
            var rcdata=datadict.doSelect(sql);
            
            if (rcdata!=RC_SUCCESS) //datadict not found
            {
                print("Datadict has not been found.");
            }
            else //datadict found
            {
                var fieldidx=funcs.index(fieldname,datadict["fields"]); //get line number in datadict
                var fieldtype=lib.tableFunctions.getFieldType(fieldname,dbdict["name"]); //get field type of field
                var global;
                if (fieldidx>0)
                {
                    
                    global=datadict["globallist"][fieldidx-1];
                    
                    //set mandatory-condition for field, if set in datadict
                    vars["$mandatory"]=datadict["mandatory"][fieldidx-1];
                    
                    
                    //set mandatory-condition for field, if part of unique key or not nulls key
                    for (var dbdictidx=0;dbdictidx<dbdict["key"].length();dbdictidx++) //loop through all keys in dbdict
                    {
                        if (dbdict["key"][dbdictidx]["flags"]==12 || dbdict["key"][dbdictidx]["flags"]==4) //look, if key is to be unique(12) or no nulls(4)
                        {
                            
                            if (funcs.index(fieldname,dbdict["key"][dbdictidx]["name"])>0)//look, if field name is within key
                            {
                                //if yes, set mandatory to true
                                //if no, go to next line
                                vars["$mandatory"]=true;
                            }
                        }
                    }
                    
                }
                global=funcs.nullsub(global,null);
                if (global!=null) //Global List
                {
                    rettype="gl";
                    var glsql="name=\""+datadict["globallist"][fieldidx-1]+"\""
                    var globallist=new SCFile("globallists");
                    var rcgl=globallist.doSelect(glsql);//select globallist record
                    if (rcgl==RC_SUCCESS)
                    {
                        vars["$L.list.values"]=vars[globallist["list.variable"]]; //select list values
                        vars["$L.display.values"]=vars[globallist["display.variable"]]; //select display values
                        vars["$L.list.values"]=funcs.nullsub(vars["$L.list.values"], vars["$L.display.values"])
                    }
                    else //globallist has not been found
                    {
                        rettype="string";
                    }
                }
                else //not a global list
                {
                    
                    if (fieldtype==1) //number
                    {
                        rettype="num";
                    }
                    else if (fieldtype==4) //boolean
                    {
                        rettype="logical";
                    }
                    else if (fieldtype==3) //date
                    {
                        rettype="date";
                    }
                    else //string, array, struct
                    {
                        rettype="string";
                    }
                    
                    if (rettype=="num" || rettype=="string") //check if link defined
                    {
                        var link=new SCFile("link");
                        var newlink=new SCFile("link");
                        var rclink=newlink.doSelect(sql);
                        if (rclink==RC_SUCCESS) //Link initialization
                        {
                            //???Hier wird nur die erste passende Linkzeile zu Rate gezogen... 
                            var linkidx=funcs.index(fieldname,newlink["source.fields"]);
                            
                            if (linkidx>0 && funcs.index("fill.skip=true",funcs.nullsub(newlink["link.expressions"][linkidx-1].toString(),""))==0)
                            {
                                rettype="link";
                                link["name"]=newlink["name"];
                                link["source.fields"][0]="$this.value";
                                link["target.files"][0]=newlink["target.files"][linkidx-1];
                                link["target.formats"][0]=newlink["target.formats"][linkidx-1];
                                link["target.fields"][0]=newlink["target.fields"][linkidx-1];
                                link["project.target.fields"][0][0]="$this.value";
                                link["project.source.fields"][0][0]=newlink["project.source.fields"][linkidx-1][0];
                                
                                if(vars.$isLinkDisplayField) {
                                    vars['$L.file']["affected.item"] = fieldvalue;
                                    link["source.fields"][0]="affected.item";
                                    link["project.target.fields"][0][0]="affected.item";
                                    link["javascript.post"][0]="vars.$this_value=vars.$File.affected_item;";
                                }
                                
                                vars["$L.link"]=link;
                            }
                            
                            
                        }
                        //link
                
                        
                        /*
                        if ($L.return.type="link" and $L.field.type=1) then ($L.return.type="numlink")
            
                        $L.ret.type=jscall("tableFunctions.getFieldType", $L.field.name, name in $L.dbdict, true)
                        if ($L.ret.type=8) then ($L.array.flag=true) else ($L.array.flag=false)
                        */
                    }
                }
                                    
                vars["$multiple"]=isMultiple(fieldname,dbdict["name"]); //find out, if multi-line field
                
                //for all CIs that will be affected by this attribute change, get current value of attribute chosen 
                //used for display on format Filter.edit.addFilter.join
                //FS do not call if called by Basleline wizard
                if (vars["$ExpectedStateWizard"])
                {
                    getCurrentValues(filename,fieldname);
                }
                //Value initialization
                if (vars["$multiple"]==true) //array or struct
                {
                    //set append, if this was set before
                    if (funcs.index(fieldname,vars["$append.fields"])>0)
                    {                
                        vars["$append"]=true;
                    }
                    
                    
                    
                    vars["$this.array.value"]=funcs.val(funcs.nullsub(vars["$this.value"],"{}"),8);
                    
                    // workaround fix for QCCR1E90283 start
                    var subtype = lib.tableFunctions.getFieldType(fieldname,filename);
                    
                    for(var i=0 ; i < funcs.lng(vars["$this.array.value"]);i++){
                       if(vars["$this.array.value"][i] ==null){
                               vars["$this.array.value"][i] = funcs.val(vars["$this.array.value"][i],subtype)
                       }
                        
                    }
                    //workaround fix for QCCR1E90283 end
                    
                    if (rettype=="link")
                    {
                        vars["$L.link"]["source.fields"][0]="$this.array.value";
                        vars["$L.link"]["project.target.fields"][0][0]="$this.array.value";
                        
                        if(vars.$isLinkDisplayField) {
                            vars['$L.file']["assets"] = vars["$this.array.value"];
                            vars['$L.file']["affected.item"] = '';
                            vars["$L.link"]["source.fields"][0]="assets";
                            vars["$L.link"]["project.target.fields"][0][0]="assets";
                            vars["$L.link"]["javascript.post"][0]="vars.$this_array_value=vars.$File.assets;";
                        }
                    }
                }
                else //simple data type
                {
                    
                    if (rettype=="num") //number
                    {
                        vars["$this.value"]=funcs.val(vars["$this.value"],1);
                    }
                    else if (rettype=="logical") //boolean
                    {
                        vars["$this.value"]=funcs.val(vars["$this.value"],4);
                    }
                    else if (rettype=="date") //date
                    {
                        vars["$this.value"]=funcs.val(vars["$this.value"],3);
                    }
                    else //string
                    {
                        vars["$this.value"]=funcs.val(vars["$this.value"],2);
                    }
                }
                
                
            }
        }
    }
    
    
    
    
    return rettype;
                        
}

//function returns true, if the field is an array or an array of structures
function isMultiple(fieldname, dbdictname)
{
    
    var fieldtype=lib.tableFunctions.getFieldType(fieldname,dbdictname,true);
    if (fieldtype==8)
    {
        return true;
    }
    else
    {
        var dbdict=new SCFile("dbdict");
        var rc=dbdict.doSelect("name=\""+dbdictname+"\"");
        if (rc==RC_SUCCESS)
        {
            var idx=getFieldIndexInDbdict(fieldname,dbdictname)-1;
            var level=dbdict["field"][idx][1];
            
            if (level==1 || level==2)
            {
                return false;
            }
            else
            {
                idx--;
                while (idx>0)
                {
                    if (dbdict["field"][idx][1]==level)
                    {
                        idx--;
                    }
                    else
                    {
                        if (dbdict["field"][idx][3]==9 && dbdict["field"][idx-1][3]==8)
                        {
                            return true;
                        }
                        return false;
                    }
                }
            }
        }
    }
    return false;
}

//function returns index of field name in dbdict in field-array (starting at 1)
function getFieldIndexInDbdict(fieldname,dbdictname)
{
    var dbdict= new SCFile("dbdict");
    var rc=dbdict.doSelect("name=\""+dbdictname+"\"");
    if (rc==RC_SUCCESS)
    {
        count=0;
        while (count<dbdict["field"].length())
        {
            if (dbdict["field"][count][0]==fieldname)
            {
                return count+1;
            }
            else
            {
                count++;
            }
        }
        return 0;
    }
    else
    {
        return 0;
    }
    
    
}

//function to extract one column of an array of structures from a record

function extractStructColumn(fieldname, structname, record)
{
    var resultArr=new Array();
    var lng=record[structname].length();
    for (var count=0;count<lng;count++)
    {
        resultArr.push(record[structname][count][fieldname]);
    }
    return resultArr;
}


//for all CIs that will be affected by this attribute change, 
//the current value of the attribute chosen is put in array $this.actvalues
//used for display on format Filter.edit.addFilter.join

function getCurrentValues(filename,fieldname)
{
    vars["$this.actvalues"]={};
    for (var ctr=0;ctr<vars["$change.cis"].length();ctr++)
    {
        
        var ci=new SCFile(filename);
        var rc=ci.doSelect("logical.name=\""+vars["$change.cis"][ctr]+"\"");
        
        var structname=getStructName(filename,fieldname);
        if (structname==null)//array or simple type
        {
            var fieldValue = ci[fieldname];
            
            if(lib.ddmEventHelper.isDisplayField(filename, fieldname)){
                fieldValue = ''+lib.ddmEventHelper.getDisplayValue(funcs.str(fieldValue));
            } else {
                fieldValue = lib.ddmEventHelper.formatArray(fieldValue);
            }
        
            vars["$this.actvalues"]=funcs.insert(vars["$this.actvalues"],ctr+1,1,funcs.str(fieldValue));
        }
        else//array of structures
        {
            var result=extractStructColumn(fieldname, structname, ci);
            result = lib.ddmEventHelper.formatArray(result);
            vars["$this.actvalues"]=funcs.insert(vars["$this.actvalues"],ctr+1,1,funcs.str(result));
            
        }
    }
}
//retrieve structure name for a field in a file
function getStructName(filename,fieldname)
{
    if (fieldname==null || filename==null)
      return null;
      
      var dbdict = new SCFile("dbdict");
      var sql = "name=\"" + filename + "\"";
 
    if ( dbdict.doSelect( sql ) == RC_SUCCESS )//table with that name found
      { 
          var idx=getFieldIndexInDbdict(fieldname,filename)-1;
          if (idx>-1) //field found
          {
            var level=dbdict["field"][idx][1];
            if (level==1 || level==2)
            {
                return null;
            }
            else
            {
                idx--;
                while (idx>0)
                {
                    if (dbdict["field"][idx][1]==level)
                    {
                        idx--;
                    }
                    else
                    {
                        if (dbdict["field"][idx][3]==9 && dbdict["field"][idx-1][3]==8)
                        {
                            return dbdict["field"][idx][0];
                        }
                        idx--;
                    }
                }
            }
          }
          else //field not found
          {
              return null;
          }
      }
      else //join
      {
          var join = new SCFile("joindefs");
          sql = "join.name=\"" + filename + "\"";
          if ( join.doSelect( sql ) == RC_SUCCESS )
          {
              for ( var i = 0; i < join.join_tables.length()  ; i++ )
              {
                  var structname = getStructName(join.join_tables[i].table_name,fieldname);
                  if (structname!=null)
                  {
                      return structname;
                  }
              }
          }
      }
      
      return null;
}

//retrieve sub-field names for structure in a file
function getStructFieldNames(filename,structName)
{
	if (structName==null || filename==null)
  	return null;
  	
  	var dbdict = new SCFile("dbdict");
  	var sql = "name=\"" + filename + "\"";
 
	if ( dbdict.doSelect( sql ) == RC_SUCCESS )//table with that name found
  	{ 
  		var length = lib.ArrayUtil.length(dbdict["field"]);
  		
  		var idx=getFieldIndexInDbdict(structName,filename)-1;
  		if (idx>-1) //field found
  		{
			if (dbdict["field"][idx][3] != 8) {
			    return null;
			}
			
			var level=dbdict["field"][idx][1];

			idx++;
			if (idx >= length || dbdict["field"][idx][1] != level + 1 || dbdict["field"][idx][3] != 9) {
			    return null;
			}

			var fieldnames = [];
			idx++;
			while (idx < length) {
			    if (dbdict["field"][idx][1] == level + 2) {
			        fieldnames.push(dbdict["field"][idx][0]);
			    } else {
			        break;
			    }
			    idx++;
			}
			
			return fieldnames;
  		}
  		else //field not found
  		{
  			return null;
  		}
  	}
  	else //join
  	{
  		var join = new SCFile("joindefs");
  		sql = "join.name=\"" + filename + "\"";
  		if ( join.doSelect( sql ) == RC_SUCCESS )
  		{
  			for ( var i = 0; i < join.join_tables.length()  ; i++ )
  			{
  				var fieldnames = getStructFieldNames(join.join_tables[i].table_name,structName);
  				if (fieldnames!=null)
  				{
  					return fieldnames;
  				}
  			}
  		}
  	}
  	
  	return null;
}

//this function is used to populate field name , caption and value information when user edit or add a expected state for a field.
//It's called in javascript section of Filter.edit.addFilter.join and cigroup.edit.query.addFilter.device
function populateEditFieldsData(){

   vars.$field_name =funcs.denull(vars.$field_name); 

   var length = funcs.lng(vars.$field_name) + 1;

   if (vars.$action=="edit" && vars.$selection>0) {

      length = vars.$selection ;

   }

   var returnType =lib.tableFunctions.getFieldType(vars.$this_name,vars.$this_filename);
      
   //populte the Field Value

    if (vars.$this_setnull!=true){
        if (vars.$multiple == true){
           if(vars.$isLinkDisplayField){
               vars.$this_array_value =  vars.$file.assets;		
           }
           vars.$this_array_value =  funcs.denull(vars.$this_array_value);
           
           if (returnType != 2){
              
             for (var i=0; i<funcs.lng(vars.$this_array_value); i++){
             
                vars.$this_array_value[i] = funcs.val(vars.$this_array_value[i],returnType);
              
             }
             
             if(funcs.str(vars.$this_array_value)==="{}") return;  //Empty array value will be discarded from the planned field list
             
             
            
           }
           
           var multipleStatement = length + " in " + "$field.value" + "=" + "str($this.array.value)";
           funcs.parse_evaluate( multipleStatement, 11 );
           
           vars.$L_tempDisplay =  ''+lib.ddmEventHelper.formatValue(vars['$this.filename'], vars['$this.name'], vars['$this.array.value'], true);
           // vars['$field.value.display'].push(''+display)
           
           var multipleStatement = length + " in " + "$field.value.display" + "=" + "$L.tempDisplay";
           funcs.parse_evaluate( multipleStatement, 11 );           
    
        } else {//not multiple 
              
              // special handling for checkbox boolean value from webtier , it may return string "0" or "1"
             if(returnType===4 && vars.$this_value !="true" && vars.$this_value !="false"){
                 vars.$this_value = funcs.val(funcs.val(vars.$this_value),returnType); 
             }
              
             if(vars.$isLinkDisplayField){
                 vars.$this_value =  vars.$file.affected_item;		
             }
              
             var singleStatement=""; 
             
             if(returnType===3){
                   vars.$this_value = funcs.val(vars.$this_value, 3);
                      if(vars.$this_value==null) return;//Ensure the value inputed is a valid date ,otherwise , this plan will be discarded
                      
                     vars.$this_value =  funcs.str(vars.$this_value);
                     singleStatement = length + " in " + "$field.value" + "=\"" + vars.$this_value + "\"";
                     
             } else {    
                   singleStatement = length + " in " + "$field.value" + "=" + "val(\"" + vars.$this_value + "\"," + returnType + ")";
             }
             
             
              funcs.parse_evaluate( singleStatement, 11 );
              
              vars.$L_tempDisplay =  lib.ddmEventHelper.formatValue(vars['$this.filename'], vars['$this.name'], vars['$this.value'], false);
              var multipleStatement = length + " in " + "$field.value.display" + "=" + "$L.tempDisplay";
              funcs.parse_evaluate( multipleStatement, 11 );    
        }

     }else{
     
         if(vars.$multiple == true){
            var nullStatement = length + " in " + "$field.value" + "=\"{}\"";
            funcs.parse_evaluate( nullStatement, 11 );
         }
     }
     
     if (vars.$this_ispassword == null) {
         vars.$this_ispassword = false;
     }
     
     funcs.parse_evaluate(length + " in $field.ispassword = $this.ispassword", 11);
     
     // populte the Field name and Field Caption
     vars.$L_caption=lib.tableFunctions.getFieldCaption(vars.$this_name,vars.$this_filename);
     
     var statement = length + " in " + "$caption.name" + "=" + "$L.caption";           
     funcs.parse_evaluate( statement, 11 );
     
     statement = length + " in " + "$field.name" + "=" + "$this.name";
     funcs.parse_evaluate( statement, 11 );
     
     statement = length + " in " + "$dme.mode" + "=" + "$this.dme.mode";
	 funcs.parse_evaluate( statement, 11 );
	 
	 var structName = getStructName(vars.$this_filename,vars.$this_name);
	 if (structName != null) {
	     var structFieldNames = getStructFieldNames(vars.$this_filename, structName);
	     var lng = funcs.lng(vars.$field_name);
	     for (var i=0; i<lng; i++) {
	         if (lib.ArrayUtil.contains(structFieldNames, vars.$field_name[i])) {
	             var pos = i + 1;
	             statement = pos + " in " + "$dme.mode" + "=" + "$this.dme.mode";
	             funcs.parse_evaluate( statement, 11 );
	         }
	     }
	 }
}


//this function is used to save the expected state into dataModEvent table
//It's called in file Selection section of Set Change State - Save State wizard
function  saveExpectedState(){

    var ci = vars.$L_cis;
    
    if(vars.$field_value != null ){
    
        var i;
        var counter;
        for (i=0;i<vars.$field_value.length();i++)
        {
            
            for (counter=0; counter<vars.$L_cis.length(); counter++ )
            {
                let device = new SCFile(vars.$this_filename);
                let deviceSql = "logical.name=\""+ci[counter]+"\"";
                let rc = device.doSelect(deviceSql);
                
                if (rc != RC_SUCCESS) {
                    continue;
                }
                
                let ddmEvent = new SCFile("dataModEvent");
                let deviceType = lib.BaselineHelper.getTableNameViaType(device.type);
                ddmEvent.active=true;
                ddmEvent.tableName=deviceType
                ddmEvent.recordId = ci[counter];
                
                let fieldName = vars.$field_name[i];
                fieldName=fieldName.substring(fieldName.indexOf(",")+1);
                
                ddmEvent.fieldName =  fieldName;
                
                //get old value
                let structname=lib.expectedStateHelper.getStructName(vars.$this_filename,fieldName);
                
                let fieldtype=lib.tableFunctions.getFieldType(fieldName,vars.$this_filename); //get field type of field
                
                
                let oldValue;
                if (structname==null)
                {
                    oldValue = device[fieldName];
                }
                else
                {
                    oldValue=lib.expectedStateHelper.extractStructColumn(fieldName, structname, device);
                    
                }
                                        
                
                ddmEvent.oldValue = funcs.str(oldValue);
                
                //get new value
                let indexApp=funcs.index(ddmEvent.fieldName,vars["$append.fields"])
                if (indexApp>0) //new array values have to be appended
                {
                    
                    //convert old and new value to js-array and concatenate them
                    if (oldValue !=null )
                    {
                        oldValue=lib.ArrayUtil.toJsArray(oldValue);
                    }
                    
                    let newval = null;    
                    if(vars.$field_value[i] != null){
                        newval = lib.ArrayUtil.toJsArray(funcs.val(vars.$field_value[i],8));
                    }
                    
                    
                    if (fieldtype != 8)//test
                    {
                        for (var count=0;count<newval.length;count++)
                        {   
                               newval[count]=funcs.val(newval[count],fieldtype);
                        }
                    }
                    
                    if (oldValue != null && oldValue != "" && oldValue.toString() !="{}"){
                    
                      newval=oldValue.concat(newval);
                      
                    }

                    //write concatenated value in newValue field
                    ddmEvent.newValue=funcs.str(newval);
                }
                else //overwrite values
                {
                    
                    
                    ddmEvent.newValue = vars.$field_value[i] == null ? null : funcs.str(vars.$field_value[i]);
                    

                } 
                                        
                
                if (i < funcs.lng(vars["$dme.mode"])) {
				    ddmEvent.mode = +(vars["$dme.mode"][i] == null ? lib.ddmEventUtil.getDmeModeReplace() : vars["$dme.mode"][i]);
				}
                
                ddmEvent.is_password = vars.$field_ispassword[i];
                
                ddmEvent.status = "proposed";
                ddmEvent.createdDate = funcs.tod();
                ddmEvent.linkedTableName = "cm3r";
                ddmEvent.linkedRecordId = vars.$L_file.number;
                
                let oldDataMod=new SCFile("dataModEvent");
                let oldDataModSql="tableName=\""+deviceType+"\" and recordId=\""+ci[counter]+"\" and fieldName=\""+fieldName+"\" and status=\"proposed\" and linkedTableName=\"cm3r\" and linkedRecordId=\""+vars.$L_file.number+"\"";
                let rcOld=oldDataMod.doSelect(oldDataModSql);
                
                let dmeOldValue = fieldtype==3 ?funcs.str(lib.dmeTimeConvert.formatToISODate(ddmEvent.oldValue)):ddmEvent.oldValue
                let dmeNewValue = fieldtype==3 ?funcs.str(lib.dmeTimeConvert.formatToISODate(ddmEvent.newValue)):ddmEvent.newValue
                
                        
                if (funcs.nullsub(oldDataMod.oldValue,"")!=funcs.nullsub(dmeOldValue,"") 
                    || funcs.nullsub(oldDataMod.newValue,"")!=funcs.nullsub(dmeNewValue,"")
                    || funcs.nullsub(oldDataMod.mode,"")!=funcs.nullsub(ddmEvent.mode,"")
                    || funcs.nullsub(oldDataMod.is_password, false)!=funcs.nullsub(ddmEvent.is_password, false))
                {
                    if(!(ddmEvent.oldValue=="{}" && ddmEvent.newValue=="{}")){//if the original array is empty ,we will not plan for it . 
                        if (rcOld==RC_SUCCESS)
                        {
                            if (funcs.nullsub(oldDataMod.oldValue,"")!=funcs.nullsub(dmeOldValue,"")
                                || funcs.nullsub(oldDataMod.newValue,"")!=funcs.nullsub(dmeNewValue,"")
                                || funcs.nullsub(oldDataMod.mode,"")!=funcs.nullsub(ddmEvent.mode,"")) {
                                oldDataMod.status="cancelled";
                                oldDataMod.active=false;
                            }
                            if (funcs.nullsub(oldDataMod.is_password, false)!=funcs.nullsub(ddmEvent.is_password, false)) {
                                oldDataMod.is_password = ddmEvent.is_password;
                            }
                            let rcUp=oldDataMod.doUpdate();
                        }
                    
                    
                        if (funcs.nullsub(oldDataMod.oldValue,"")!=funcs.nullsub(dmeOldValue,"")
                            || funcs.nullsub(oldDataMod.newValue,"")!=funcs.nullsub(dmeNewValue,"")
                            || funcs.nullsub(oldDataMod.mode,"")!=funcs.nullsub(ddmEvent.mode,"")) {
                            let rc = ddmEvent.doInsert();
                        }
                    }
                }
            }
        
        }
    }

}

function setIsNullVariable(){

    vars["$isSetNullVisible"] = false;
    
    if (funcs.nullsub(vars["$this.name"],"") !="" && vars["$mandatory"]==false){
        vars["$isSetNullVisible"] = true ;
    }

}

