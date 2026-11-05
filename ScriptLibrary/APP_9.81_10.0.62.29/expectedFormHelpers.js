/***************************
@author:Frank Sauer
2010
Description:

Helper functons for form based attribute changes in Expected State Wizard

****************************/


function manipulateForm(myform,toReadOnly, FormPrefix, IncludeSubs)
{
	FormPrefix=system.functions.nullsub(FormPrefix,"TMP.")
	var SubToClone=new Array();
	
	for (idx in system.functions.denull(myform["field"]))
	{
		// if subs to be manipulated remember for recurse call
		if (myform["field"][idx]!=null)
		{
			if (IncludeSubs==true && system.functions.nullsub(myform["field"][idx]["format"],"")!="" && system.functions.nullsub(myform["field"][idx]["input"],"")=="")
			{
				SubToClone.push(myform["field"][idx]["format"]);
				var newform=FormPrefix+myform["field"][idx]["format"];
				myform["field"][idx]["format"]=newform
				myform["field"][idx]["property"]=myform["field"][idx]["property"].replace(/Format=.*?\t/,"Format="+newform+"\t");
			}
			
			// iterate all fields - not for Readonly fields
			if (system.functions.index(myform["field"][idx]["input"],toReadOnly)<=0)
			
			{
				var OldProps=myform["field"][idx]["property"];
				myform["field"][idx]["property"]=OldProps.replace(/ReadOnly=1/,"ReadOnly=0");
							
				// substitute 4 from ctrl property - readonly indicator
				if (OldProps!=myform["field"][idx]["property"])
				{
					myform["field"][idx]["flags"]=myform["field"][idx]["flags"]-4;
				}
				//remove readonly condition
				myform["field"][idx]["property"]=myform["field"][idx]["property"].replace(/\?ReadOnly=.*?\t/,"?ReadOnly=\t");
				
			}
			// Set individual fields to readonly
			else
			{
				
				var OldProps=myform["field"][idx]["property"];
				// do not set if already
				if (system.functions.index("ReadOnly=1",OldProps)<=0)
				{
					// has reaonly false set replace it with true
					if (system.functions.index("\tReadOnly=",OldProps)>0 || system.functions.index("\tReadOnly=0",OldProps)>0)
					{
						myform["field"][idx]["property"]=OldProps.replace(/\tReadOnly=.*?\t/,"\tReadOnly=1\t");
					}
					// not set yet - set it
					else
					{
						var regex = new RegExp("(Width=.*?\t)");
						var to="ReadOnly=1\t"+"$1";
						myform["field"][idx]["property"]=OldProps.replace(regex,to);
					}
					//remove readonly condition
					myform["field"][idx]["property"]=myform["field"][idx]["property"].replace(/\?ReadOnly=.*?\t/,"?ReadOnly=\t");	
					
					// add 4 to ctrl property - readonly indicator
					if (OldProps!=myform["field"][idx]["property"])
					{
						myform["field"][idx]["flags"]=myform["field"][idx]["flags"]+4;
					}
				}
			}
		}
	}
	myform["name"]=FormPrefix+myform["name"];
	myform.doSave();
	
	// recursive call for all subs
	if (IncludeSubs==true && SubToClone.length>0)
	{
		for (var SubIdx in SubToClone)
		{
			var Sub=new SCFile("format");
			var query="name=\""+SubToClone[SubIdx]+"\""
			var rc=Sub.doSelect(query);
			if (rc==RC_SUCCESS)
			{
				manipulateForm(Sub,toReadOnly, FormPrefix, false);
			}
			SubToClone[SubIdx]=FormPrefix+SubToClone[SubIdx]
			if (SubIdx>30)
			{
				print("to much recursion...ätsch");
				return SubToClone;
			}
		}
		return SubToClone;
	}
}


/***************************
Copy Form and Subforms remove readonly flags
for individual fields set readonly
****************************/
function initializedExpectedForm(){

	var myform=new SCFile("format");
	vars["$ciOrgForm"]=vars["$ciForm"];
	var query="name=\""+vars["$ciForm"]+"\"";
	var rc=myform.doSelect(query);
	
	if (rc==RC_SUCCESS)
	{
		// Modify form - remove readonly properties except individual fields
		var ReadOnlyFields=new Array("type","logical.name","id");
		// remove readonly also from writable subforms
		var IncludingSubs=true;
		
		vars["$FormtoDel"]=manipulateForm(myform,ReadOnlyFields,"TMP.",IncludingSubs);
		
		
		// copy form link so that link in the new temp form can work 
		var mylink=new SCFile("link");
		var query="name=\""+vars["$ciForm"]+"\"";
		var rc=mylink.doSelect(query);
		if (rc==RC_SUCCESS)
		{
			mylink["name"]="TMP."+mylink["name"];
			mylink.doSave();
		}
		vars["$ciForm"]=myform["name"];
	}

    //Note!!! if called from edit state values will be read by individual Master FC of Object Expected Sate

}

//It's called by the expected.state.form.default format control
function populateExpectedForm(){

  vars["$StructName"]=null;
  for (var idx in vars["$field.value"])
	{
		var FieldType=lib.tableFunctions.getFieldType(vars["$field.name"][idx], vars["$this.filename"], true);
		
		// is complex datatype
		if (FieldType!=8)
		{
			// try if this is a structure
			var StrucName=lib.expectedStateHelper.getStructName(vars["$this.filename"],vars["$field.name"][idx]);
		}
		else
		{
			var StrucName=null
		}
		// read prmitive values and simple arrays
		if (StrucName==null)
		{
			
			vars["$file"][vars["$field.name"][idx]]=system.functions.val(vars["$field.value"][idx],FieldType);
			
		}
		else // get structure values
		{
			var TmpArr=system.functions.val(vars["$field.value"][idx],8)
			var Innertype=lib.tableFunctions.getFieldType(vars["$field.name"][idx] ,vars["$this.filename"]);
			for (var StrucIdx in TmpArr)
			{
				//the boolean is a bit tricky here that it will cause problem if we use parse_evaluate to assign the value. 
				if(Innertype ==4 ){
				
				   vars["$file"][StrucName][StrucIdx][vars["$field.name"][idx]]=system.functions.val(TmpArr[StrucIdx],Innertype);
				
				}else {
					var subIndex = lib.tableFunctions.getFieldIndex(vars["$field.name"][idx],system.functions.filename(vars.$file));
			        var arrayIndex = system.functions.val(StrucIdx,1) + 1;
					vars.$L_tmpValue = TmpArr[StrucIdx];
				    var statement = subIndex + " in " + arrayIndex + " in " + StrucName +" in $file"+"=" + "val($L.tmpValue"+ "," + Innertype + ")";
			        system.functions.parse_evaluate( statement, 11 );
			    
                }
			    			    
			}
			// set focus to selected field
			if (idx==(vars["$selection"] - 1))
			{
				// store Scructname if there is one for focus on display
				vars["$StructName"]=StrucName;
			}
		}
	}



}


/***************************
This function is used to retrive changed field in form and prepare fields that need to be appended
It's called by call.expectedForm.edit process 
****************************/
function retriveChangeStateinForm(){
	// FS REMOVE TEMP COPY OF CI FORM AND LINK
	
	var myform=new SCFile("format");
	var query="name=\""+vars["$ciForm"]+"\"";
	var rc=myform.doSelect(query);
	
	
	if (rc==RC_SUCCESS)
	{
		myform.doDelete()
	}
	//  and all subs
	
	if (vars["$FormtoDel"].length()>0)
	{
		for (var delidx=0;delidx<vars["$FormtoDel"].length();delidx++)
		{
			var query="name=\""+vars["$FormtoDel"][delidx]+"\"";
			var rc=myform.doSelect(query);
			if (rc==RC_SUCCESS)
			{
				myform.doDelete();
			}
		}
	}
	
	
	
	// and link
	var mylink=new SCFile("link");
	var query="name=\""+vars["$ciForm"]+"\"";
	var rc=mylink.doSelect(query);
	if (rc==RC_SUCCESS)
	{
		mylink.doDelete()
	}
	
	vars["$ciForm"]=vars["$ciOrgForm"];
	// cleanups append tmp vars
	vars["$decideConcat"]=null;
	vars["$TMPappend.fields"]=new Array();
	vars["$TMPappend.concat"]=new Array();
	vars["$TMPappend.value"]=new Array();
	vars["$TMPappend.value.display"]=new Array();
	vars["$TMPappend.caption.name"]=new Array();
	
	
	if (vars["$formFileRet"]!=null)
	{
		// get Attribute changes
		var RecXml=vars["$formFileRet"].getXML();
		var root=RecXml.getDocumentElement()
		// new hashtable
		var JSRec=new Array();
		if(root!=null)
		{
			for(var child = root.getFirstChildElement(); child!=null; child = child.getNextSiblingElement())
			{
				
				if (child.getName()=="instance")
				{
					var instance=child.getFirstChildElement();
					// check to see if join file - one level deeper
					if (instance.getFirstChildElement()!=null) //is joinfile
					{
						//device
						JSRec=process_XMLinstance(instance,vars["$formFileRet"],JSRec);
						//get attribute file
						instance=instance.getNextSiblingElement();
						
						while(instance != null){
						
							JSRec=process_XMLinstance(instance,vars["$formFileRet"],JSRec);
							instance=instance.getNextSiblingElement();
						}
										
					}
					else //is device
					{
						JSRec=process_XMLinstance(child,vars["$formFileRet"],JSRec);
						
					}
				}	
			}
	}
	
		//parse file to get valid entries to be changed (filter alias etc)
		for (var idx in JSRec)	{
			var ValueIdx=system.functions.index(idx,vars["$bl.field.names"]);
			if (ValueIdx>0 && idx!="type")
			{
				var SMtype=system.functions.type(JSRec[idx]);
				
				// Edit State
				if (vars["$action"]=="edit")
				{
					var OrgIdx=system.functions.index(idx,vars["$field.name"])
					
					if (SMtype==8)//if the field type is aray
					{
						vars["$decideConcat"]=true;
						vars["$TMPappend.fields"].push(idx);
						var value = system.functions.str(system.functions.denull(JSRec[idx]));
						vars["$TMPappend.value"].push(value);
						
						var displayValue = value;
						if( lib.ddmEventHelper.isDisplayField(vars['$this.filename'], idx)){
							displayValue = ''+lib.ddmEventHelper.getDisplayValue(funcs.str(value));
						}
						vars["$TMPappend.value.display"].push(displayValue);
						
						vars["$TMPappend.caption.name"].push(vars["$bl.field.captions"][ValueIdx - 1]);
						
						// was set to append
						var appendidx=system.functions.index(idx,vars["$append.fields"])
						if (appendidx>0)
						{
							vars["$TMPappend.concat"].push(true);
						}
						else
						{
							vars["$TMPappend.concat"].push(false);
						}
						
					} else {
					
						if (OrgIdx>0)
						{
					 	
						   vars["$field.value"][OrgIdx - 1]=system.functions.str(system.functions.denull(system.functions.val(JSRec[idx],SMtype)));
						   vars["$field.value.display"][OrgIdx - 1]=''+lib.ddmEventHelper.formatValue(vars['$this.filename'], idx, vars["$field.value"][OrgIdx - 1]);						
						} else {
						
						   insertFieldValues(idx, JSRec[idx],SMtype);
						   vars["$field.name"].push(idx);
						   vars["$caption.name"].push(vars["$bl.field.captions"][ValueIdx - 1]);
							
						}
					
					
					}
				}
				else // add mode
				{
					
					if (SMtype==8)
					{
						var arrval=system.functions.str(system.functions.denull(JSRec[idx]));
						vars["$TMPappend.value"].push(arrval);
						vars["$decideConcat"]=true;
						vars["$TMPappend.fields"].push(idx);
						vars["$TMPappend.concat"].push(false);
						vars["$TMPappend.caption.name"].push(vars["$bl.field.captions"][ValueIdx - 1]);
						
						var displayValue = arrval;
						if( lib.ddmEventHelper.isDisplayField(vars['$this.filename'], idx)){
							displayValue = ''+lib.ddmEventHelper.getDisplayValue(funcs.str(arrval));
						}
						vars["$TMPappend.value.display"].push(displayValue);
							
					}
					else
					{

						insertFieldValues(idx, JSRec[idx],SMtype);
						vars["$field.name"].push(idx);
						vars["$caption.name"].push(vars["$bl.field.captions"][ValueIdx - 1]);
						
						
					}
					
					
				}
				
			}
		}
	}
	
}

/***************************
This function is used to handle the array or array of strucutre field that need append or not
****************************/
function handleConcatFields(){
	if (vars["$append.fields"]==null)
	{
		vars["$append.fields"]=new Array();
	}
	
	// add path - push arrays to changelist with append
	if (vars["$action"]!="edit")
	{
		
		for (var idx=0;idx<vars["$TMPappend.fields"].length();idx++)
		{
			// independent whether concat or not
			insertFieldValues(vars["$TMPappend.fields"][idx], vars["$TMPappend.value"][idx],2);
			vars["$field.name"].push(vars["$TMPappend.fields"][idx]);
			vars["$caption.name"].push(vars["$TMPappend.caption.name"][idx]);
			
			if (system.functions.val(vars["$TMPappend.concat"][idx],4)==true)
			{
				vars["$append.fields"].push(vars["$TMPappend.fields"][idx]);
			}
			// check if prevoius concat for same field then remove if not set this time
			else
			{
				var delidx=system.functions.index(vars["$TMPappend.fields"][idx],vars["$append.fields"])
				if (delidx>0)
				{
					vars["$append.fields"]=system.functions._delete(vars["$append.fields"],delidx);
				}
			}
		}
	}
	else //edit path - redecide append
	{
		for (var idx=0;idx<vars["$TMPappend.fields"].length();idx++)
		{
			
			var OrgIdx=system.functions.index(vars["$TMPappend.fields"][idx],vars["$field.name"]);
			
			if (OrgIdx >0){
				vars["$field.value"][OrgIdx - 1] = system.functions.str(vars["$TMPappend.value"][idx]);
				vars.$L_tmpValueDisplay = lib.ddmEventHelper.formatValue(vars['$this.filename'], vars["$TMPappend.fields"][idx], vars["$field.value"][OrgIdx - 1]);
				vars["$field.value.display"][OrgIdx - 1] = vars.$L_tmpValueDisplay; 
			}else {
			    insertFieldValues(vars["$TMPappend.fields"][idx], vars["$TMPappend.value"][idx],2);
			    vars["$field.name"].push(vars["$TMPappend.fields"][idx]);
			    vars["$caption.name"].push(vars["$TMPappend.caption.name"][idx]);		
			}
			
			//populte the $append.fields for edit
			if (system.functions.val(vars["$TMPappend.concat"][idx],4)==true)
			{
				if (system.functions.index(vars["$TMPappend.fields"][idx],vars["$append.fields"])==0){
					vars["$append.fields"].push(vars["$TMPappend.fields"][idx]);
				}
			}
			// check if prevoius concat for same field then remove if not set this time
			else
			{
				var delidx=system.functions.index(vars["$TMPappend.fields"][idx],vars["$append.fields"])
				if (delidx>0)
				{
					vars["$append.fields"]=system.functions._delete(vars["$append.fields"],delidx);
				}
			}
			
			
		}
	}
	
	//cleanups
	vars["$decideConcat"]=null;
	vars["$TMPappend.fields"]=null;
	vars["$TMPappend.concat"]=null;
	vars["$TMPappend.value"]=null;
	vars["$TMPappend.caption.name"]=null;

}

/***************************
Retrive the change field values from the xml file 
****************************/

function process_XMLinstance(instance,record,JSRec)
{

	
	for(var fields = instance.getFirstChildElement(); fields!=null; fields = fields.getNextSiblingElement())
	{
		// is array of structures
		if (fields.getAttributeValue("sctype")=="array" && fields.getFirstChildElement().getAttributeValue("sctype")=="structure")
		{
				// get arrayName
				var arrayName=fields.getFirstChildElement().getName();
				var colnames=new Array();
				for (var Lstructline=fields.getFirstChildElement(); Lstructline!=null; Lstructline=Lstructline.getNextSiblingElement())
				{
					// for each field within array of struct
					for (var LStructfield=Lstructline.getFirstChildElement(); LStructfield!=null; LStructfield=LStructfield.getNextSiblingElement())
					{
						if (JSRec[LStructfield.getName()]==null)
						{
							
							colnames.push(LStructfield.getName());
							// init native destination arrays
							JSRec[LStructfield.getName()]=new SCDatum();
							JSRec[LStructfield.getName()].setType(8);
						}
						
					}
				}
								// fill values
				for (var colidx in colnames)
				{
					for (var idx=0;idx<record[arrayName].length();idx++) 	
					{	
						// push "column" of current line into destination array cause record[columnname] does not work in JS
						if(JSRec[colnames[colidx]] != null ){							
							JSRec[colnames[colidx]].push(record[arrayName][idx][colnames[colidx]]);
						}
					}
				}
						
		}
		else //primitive field 
		{
			if (typeof(record[fields.getName()]) == 'function')              
                JSRec[fields.getName()]=record["_"+fields.getName()];                                              
            else
               JSRec[fields.getName()]=record[fields.getName()];
		}
	}

return JSRec;
}

/***************************
This function one workaround method that can insert NULL values as well as other values into the $field.value array . If we use push directly, NULL value can not be inserted.
****************************/
function  insertFieldValues(field, value , type){

    var lng = system.functions.lng(vars["$field.name"]) + 1;
    
    vars.$L_tmpValue = value;
    vars.$L_tmpValueDisplay = lib.ddmEventHelper.formatValue(vars['$this.filename'], field, funcs.val(value, type));
	
    var statement = lng + " in $field.value = str(" + "val($L.tmpValue"+ "," + type + "))";
    var displayStatement = lng + " in $field.value.display = $L.tmpValueDisplay"; 
	
    system.functions.parse_evaluate( statement, 11 );
    system.functions.parse_evaluate( displayStatement, 11 );
 	
}
