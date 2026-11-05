var _scmsg = funcs.scmsg;
var NONE_LOCAL = _scmsg("kwd:NONE", "local:imMatchQuery", ["", ""]);
var AND_LOCAL = _scmsg("kwd:and", "local:imMatchQuery", ["", ""]);

/**
 * This function is called to get a list of related fields and Title field with which incident matching could be done
 */
function getMatchFieldValsDisps(tableName)
{
	var datadict = new SCFile("datadict");
	var IRKeys=lib.dbdictHelper.getIRKey(tableName);
    datadict.doSelect("name=\""+tableName+"\"");
	var arrFields = [];
	var arrCaption = [];
	
	var i, iLoopTimes = lib.ArrayUtil.length(funcs.denull(datadict.fields));
	for(i = 0;i < iLoopTimes;++i)
	{
	    if("1"!=datadict.sysFieldType[i] && !lib.ArrayUtil.contains(IRKeys,datadict.fields[i]))
	    {
 			arrFields.push(datadict.fields[i]);
 			var captionStr=funcs.scmsg(datadict.captions[i], "sccaption" );
 			if(captionStr && captionStr.indexOf("Could not be found")>=0){
 				captionStr = datadict.captions[i];
 			}
			arrCaption.push(captionStr);
		}
	}

	return [arrFields,arrCaption];
}

/**
* This function is called to get a list of incident related fields and Title/Description fields with which incident matching will be done
*/
function getMatchWithValsDisps(matchField,tableName,tableToMatch)
{
	var fDbdict,fDbdictToMatch,fieldType,matchFieldType;
	var IRKeys=lib.dbdictHelper.getIRKey(tableName);
	if(matchField!="" && matchField!=null)
	{
		fDbdict=lib.dbdictHelper.initDbdictFile(tableName);
		fDbdictToMatch=lib.dbdictHelper.initDbdictFile(tableToMatch);
		if (fDbdict!=null)
		{
			fieldType= lib.dbdictHelper.getFieldType(fDbdict,matchField);
		}
	}	
	var datadict = new SCFile("datadict");
	datadict.doSelect("name=\""+tableToMatch+"\"");
	var arrFields = [];
	var arrCaption = [];
	
	var i, iLoopTimes = lib.ArrayUtil.length(funcs.denull(datadict.fields));
	for(i = 0;i < iLoopTimes;++i)
	{
		var captionStr;
		
		if (matchField==null || matchField==""){
			if("1"!=datadict.sysFieldType[i]&& !lib.ArrayUtil.contains(IRKeys,datadict.fields[i]))
			{
				arrFields.push(datadict.fields[i]);
				captionStr=funcs.scmsg(datadict.captions[i], "sccaption" );
 				if(captionStr.indexOf("Could not be found")>=0){
 					captionStr = datadict.captions[i];
 				}
				arrCaption.push(captionStr);
			}
		} else
		{   
		    if (fDbdictToMatch!=null)
		    {
		    	matchFieldType=lib.dbdictHelper.getFieldType(fDbdictToMatch,datadict.fields[i]);
				if("1"!=datadict.sysFieldType[i] && matchFieldType==fieldType&& !lib.ArrayUtil.contains(IRKeys,datadict.fields[i]))
				{
					arrFields.push(datadict.fields[i]);
					captionStr=funcs.scmsg(datadict.captions[i], "sccaption" );
 					if(captionStr.indexOf("Could not be found")>=0){
 						captionStr = datadict.captions[i];
 					}
					arrCaption.push(captionStr);
				}
			}
		
		}
	}

	return [arrFields,arrCaption];
}


function getIMQueries(record,tableName)
{
	var imQry = new SCFile("imMatchQuery", SCFILE_READONLY);
	var qryArr = [];
	var qryDescArr = [];
	var qryRecName = [];
	var qryRecValue = [];
	var tmpArr= [];
	var tableToMatch= [];
	
	if(imQry.doSelect("tableName=\""+tableName+"\"")==RC_SUCCESS)
	{
		do
		{
			qryRecName.push(funcs.scmsg(imQry.id,"local:imMatchQuery"));
			qryRecValue.push(imQry.id);
			tableToMatch.push(imQry.tableToMatch);

            if (imQry.useJS == true && imQry.advQuery && imQry.advQuery != "") {
                var matchQueryCfg = imQry;
                var statements = "rteQuery=(" + imQry.advQuery + ")";
                eval(statements);
                var query = "("+rteQuery[0]+")";
                var queryDesc = rteQuery[1];

                if (imQry.tableToMatch == tableName) {

                    var keyvalues = new SCDatum();
                    vars.$L_rc = funcs.rtecall("getunique", vars.$L_errcode, keyvalues, record);
                    var recordid = keyvalues[0];
                    var fDatadict = lib.dbdictHelper.initDatadictFile(imQry.tableToMatch);
                    query += " and " + fDatadict["unique.key"][0] + "~=\"" + recordid + "\"";
                }

                if (imQry.query != null && imQry.query != "") {
                    qryArr.push("("+query + ") and (" + imQry.query + ")");
                    qryDescArr.push(queryDesc );
                } else {
                    qryArr.push(query);
                    qryDescArr.push(queryDesc);
                }
            } else {
                tmpArr = getQueryDesc(record, imQry.fieldToMatch, imQry.fieldToMatchAgainst, tableName, imQry.tableToMatch);

                if (imQry.query != null && imQry.query != "" && tmpArr[0] != "false") {
                    qryArr.push(tmpArr[0] + " and (" + imQry.query + ")");
                    qryDescArr.push(tmpArr[1] + AND_LOCAL + _scmsg("fixed:" + imQry.queryDesc, "local:imMatchQuery"));
                } else {
                    qryArr.push(tmpArr[0]);
                    qryDescArr.push(tmpArr[1]);
                }
                
            }
		}while(imQry.getNext()==RC_SUCCESS);
	}
	
	return [qryRecValue,qryRecName,qryArr,qryDescArr,tableToMatch];
}


function getQueryDesc(record,fldMatch,matchWith,tableName,tableToMatch)
{
	var value=record[fldMatch];
	var query="false";
    var queryDesc = NONE_LOCAL;
	var keyvalues=new SCDatum();
	vars.$L_rc=funcs.rtecall("getunique", vars.$L_errcode, keyvalues, record);
    var recordid=keyvalues[0];
    var fDatadict=lib.dbdictHelper.initDatadictFile(tableToMatch);
    var disp=value;
	if(value!=null)
	{			
	    var refTable=lib.DisplayName.getRefTable(fldMatch, funcs.filename(record));
	    if(refTable!==null){
	    	disp=lib.DisplayName.getDisplayNameById(refTable,value);
	    }
		var getDescArr = function (fldMatch, tableName) 
	 	{	 			
		 	var fldMatchCap = fldMatch;
		 	var tableNameCap = funcs.scmsg(tableName, "tablename");
		 	var datadict = new SCFile("datadict");
			if(RC_SUCCESS==datadict.doSelect("name=\""+tableName+"\""))
			{				
				var arrFields = [];
				var arrCaption = [];
				var i, iLoopTimes = lib.ArrayUtil.length(funcs.denull(datadict.fields));
				for(i = 0;i < iLoopTimes;++i)
				{
					if(datadict.fields[i]==fldMatch)
					{
                        fldMatchCap = _scmsg(datadict.captions[i], "sccaption");
						break;
					}
				}
			}
			return [fldMatchCap,tableNameCap];
		};
		
		var fDbdict=lib.dbdictHelper.initDbdictFile(tableName);
		var fieldType=8;
		if (fDbdict!=null)
		{
			fieldType= lib.dbdictHelper.getFieldType(fDbdict,fldMatch);
		}
		
		if (value.replace == undefined){
			query = matchWith+"=\""+value+"\"";
		}
		else{
			query = matchWith+"=\""+value.replace(/"/g, "\\\"")+"\"";
		}
		var desc2 = getDescArr(matchWith,tableToMatch);
        queryDesc = _scmsg("kwd:matches", "local:imMatchQuery", [desc2[0], disp]);
		if (fieldType==2)
		{
			// use '=' if have referenced table like "device"
		    query = matchWith + (refTable != null ? "=":"#") + "\"" + value.replace(/"/g, "\\\"") + "\"";
            queryDesc = _scmsg("kwd:matches", "local:imMatchQuery", [desc2[0], disp]);
		}
		if (fieldType==8)
		{
 		    query = matchWith+"="+funcs.str(record[fldMatch]);
 		    
 		    if (!funcs._null(record[fldMatch]))
 		    {
                queryDesc = _scmsg("kwd:matches", "local:imMatchQuery", [desc2[0], funcs.str(disp)]);
 		    } else
 		    {
                queryDesc = NONE_LOCAL;
 		    }
		}
		
		query+=" and "+fDatadict["unique.key"][0]+"~=\""+recordid+"\"";
	}

	return [query,queryDesc];	
}


function modifyQbeFormat(qbeForm,multiSelect)
{
	var qForm = new SCFile("format");
	if(qForm.doSelect("name=\""+qbeForm+"\"")==RC_SUCCESS)
	{
		var i, iLoopTimes = qForm.field.length();
		for(i = 0;i < iLoopTimes;i++)
		{
			if(qForm.field[i].property.indexOf("Table")==0)
			{
				if(multiSelect==true)
				{
					var msStr = "	MultipleSelection=1";
					if(qForm.field[i].property.indexOf("MultipleSelection")!=-1)
					{
						qForm.field[i].property=qForm.field[i].property.replace("MultipleSelection=0","MultipleSelection=1");
					}
					else
					{							
						var idx1= qForm.field[i].property.indexOf("	");							
						qForm.field[i].property=qForm.field[i].property.substring(0,idx1)+msStr+qForm.field[i].property.substring(idx1);	
					}
				}
				else
				{
					var msStr = "	MultipleSelection=0";
					if(qForm.field[i].property.indexOf("MultipleSelection")!=-1)
					{
						qForm.field[i].property=qForm.field[i].property.replace("MultipleSelection=1","MultipleSelection=0");
					}
					else
					{							
						var idx1= qForm.field[i].property.indexOf("	");							
						qForm.field[i].property=qForm.field[i].property.substring(0,idx1)+msStr+qForm.field[i].property.substring(idx1);	
					}
				}
				
				var nfCond = "	?Visible=[$showQbe]=true";
				if(qForm.field[i].property.indexOf("?Visible=")!=-1)
				{
					var jdx= qForm.field[i].property.indexOf("	?Visible=");														
					var vCond = qForm.field[i].property.substr(jdx+1,qForm.field[i].property.indexOf("	Height=",jdx+1)-jdx-1);
					qForm.field[i].property=qForm.field[i].property.replace(vCond,nfCond);
				}
				else
				{							
					var jdx= qForm.field[i].property.indexOf("	X=");							
					qForm.field[i].property=qForm.field[i].property.substring(0,jdx)+nfCond+qForm.field[i].property.substring(jdx);	
				}					
				
				var idx2= qForm.field[i].property.indexOf("	X=");														
				var xCord = qForm.field[i].property.substr(idx2+1,qForm.field[i].property.indexOf("	",idx2+1)-idx2-1);
				qForm.field[i].property=qForm.field[i].property.replace(xCord,"X=2");
				
				if (multiSelect==true || qForm.file_name=="rootcause")
				{
					var idx3= qForm.field[i].property.indexOf("	Y=");							
					var yCord = qForm.field[i].property.substr(idx3+1,qForm.field[i].property.indexOf("	",idx3+1)-idx3-1);
					qForm.field[i].property=qForm.field[i].property.replace(yCord,"Y=24");		
				}
				else
				{
					var idx3= qForm.field[i].property.indexOf("	Y=");							
					var yCord = qForm.field[i].property.substr(idx3+1,qForm.field[i].property.indexOf("	",idx3+1)-idx3-1);
					qForm.field[i].property=qForm.field[i].property.replace(yCord,"Y=24");
				}
				
				return qForm;
			}
		}
	}
		
}


function getFormatRecord(form)
{
	var formatRec = new SCFile("format");
	if(formatRec.doSelect("name=\""+form+"\"")==RC_SUCCESS)
	{
		return formatRec;
	}
}

/**This function returns the query used by incident matching for CI. This allows users to easiliy tailor the query.
*/

function getMatchingQueryForCI(affectedItem,logicalName,fileName)
{
	//this is the query used to be
	
	var sql="false";
	
	if (logicalName !== null && affectedItem !== null)
	{ 
		sql = "affected.item=\""+affectedItem+"\" or logical.name=\""+logicalName+"\"";
	}
	else
	{
		if (logicalName !== null)
		{
			sql = "logical.name=\""+logicalName+"\"";
		}
		else
		{
			if (affectedItem !== null)
			{
				sql = "affected.item=\""+affectedItem+"\"";
			}
		}
	}
	return sql;
}


/**This function sets the $L.service and $L.logical.name values.  This allows users to tailor the way these variables are set.
*/

function setServiceAndLogicalName(record, fileName)
{
	vars.$L_service=record.affected_item;
	vars.$L_logical_name=record.logical_name;
}


/**This function checks to see if a interaction has any related incidents
*/
function hasRelatedIncident(interactionId)
{
	var scRelation = new SCFile("screlation", SCFILE_READONLY);
	scRelation.setFields(["source"]);
	var query="source=\""+interactionId+"\"";
	var rc  = scRelation.doSelect(query);
	if ( rc == RC_SUCCESS ){
    	return true;
    }
    else {
    	return false;
    }	
}
