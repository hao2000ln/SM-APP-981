/** 
 * Introduction: validation Javascript function for request management setting item - modelGroup
 * Date:20131226
 * Author:wangxun 
 * Requirement No. in QC:QCRQ1E91610
*/

var scmsgfunc = system.functions.scmsg;
var indexfunc = system.functions.index

function validationOfModelGroup(ParaValue)
{
	var ParaResult=0;
	var ParaMessage=" ";
	var lng=0;
	
	var settinglabel=scmsgfunc("Request;modelGroup","local:settingsConfig");
	
	if(ParaValue==null || ParaValue=="")
	{	
		return {"result": ParaResult, "message": ParaMessage};
	}
	
	
	var fields = new Array();
	fields = ParaValue.split(",");
	lng = fields.length;
	
	if ( lng > 4 )
	{
		ParaResult=1;
		ParaMessage=scmsgfunc( 1, "requestModel", [ fields[i] ] );
	}
	else 
	{
		var table = new SCFile( "datadict" , SCFILE_READONLY );
		var sql = "name=\"requestModel\"";
		
		var queryFieldList=["fields"];
		table.setFields(queryFieldList);
		
		if ( table.doSelect( sql ) == RC_SUCCESS )
		{
			for ( var i =0 ; i < lng; i++ )
			{
				var strTemp="";
				
				strTemp=fields[i].replace(/^\s*/, '');
				strTemp=strTemp.replace(/\s*$/, '');
				
				var index = indexfunc( strTemp, table.fields );
				
				if ( index == 0 )
				{
					ParaResult=1;
					ParaMessage=scmsgfunc( 2, "requestModel", [ fields[i] ] ) ;
					break;
				}
			}
		}
		else
		{
			ParaResult=1;
			ParaMessage=scmsgfunc( 3, "requestModel" ,[settinglabel]);
		}
	}
		
	return {"result": ParaResult, "message": ParaMessage};
}

var SYSFUNC=system.functions;

function getNumberForRequest()
{
	var newid = new Datum();
	var rcode = new Datum();
	rcode = system.functions.rtecall("getnumber", rcode, newid, "request management");
	var uniquenum = newid.getText();
	
	var envvalue=lib.settings.getSettingValue("RequestEnv", "year.month");
	var spestr=lib.settings.getSettingValue("RequestEnv", "separator");
	
	if(spestr == null) {
		spestr="";
	}
	var tod=SYSFUNC.tod();
	var strYear=SYSFUNC.val(SYSFUNC.year(tod),2);
	var strMonth=SYSFUNC.val(SYSFUNC.month(tod),2);
	var strDayofyear=SYSFUNC.val(SYSFUNC.dayofyear(tod),2);
	
	
	strYear=strYear.substr(2);
	if(system.functions.val(strMonth)<10){
		strMonth="0"+strMonth;
	}
	
	var ret="";
	
	if(envvalue==="YrUnique"){
		ret=strYear + spestr + uniquenum;
	}else if(envvalue==="YrMoUnique"){
		ret=strYear + strMonth + spestr + uniquenum;	
	}else if(envvalue==="JulianUnique"){
		ret=strYear + strDayofyear + spestr + uniquenum;
	}else {
		ret=uniquenum;
	}
	return ret;
}

function getNumberForRequestTask(parentRequestNum)
{
	var newid = new Datum();
	var rcode = new Datum();
	rcode = system.functions.rtecall("getnumber", rcode, newid, "request management task");
	var uniquenum = newid.getText();
	
	var envvalue=lib.settings.getSettingValue("RequestEnv", "year.month.task");
	var spestr=lib.settings.getSettingValue("RequestEnv", "separator");
	var ulen=lib.settings.getSettingValue("RequestEnv", "prefix.or.suffix");		
	
	if(spestr == null) {
		spestr="";
	}
	if(ulen == null || ulen == ""){
		ulen="0";
	}
	
	var tod=SYSFUNC.tod();
	var strYear=SYSFUNC.val(SYSFUNC.year(tod),2);
	var strMonth=SYSFUNC.val(SYSFUNC.month(tod),2);
	var strDayofyear=SYSFUNC.val(SYSFUNC.dayofyear(tod),2);
	
	strYear=strYear.substr(2);
	if(system.functions.val(strMonth)<10){
		strMonth="0"+strMonth;
	}
	
	var ret="";
	
	if(envvalue==="YrUnique"){
		ret=strYear + spestr + uniquenum;
	}else if(envvalue==="YrMoUnique"){
		ret=strYear + strMonth + spestr + uniquenum;	
	}else if(envvalue==="JulianUnique"){
		ret=strYear + strDayofyear + spestr + uniquenum;
	}else if(envvalue==="ParentUnique"){
		var t=getParentRequstTaskNum(parentRequestNum) + 1;
		var c=SYSFUNC.val(ulen) - (t+"").length;
		for(var i=0; i<c; i++){ 
			t="0"+t;
		}
		ret = parentRequestNum + spestr + t
	}else{
		ret=uniquenum;
	}
	return ret;
}

function getParentRequstTaskNum(parentRequestNum)
{
	var rmt=new SCRecordList('requestTask', new QueryCond('parentTicket','EQ',parentRequestNum));
	return rmt.getCount();
}

function validateSeperator(ParaValue)
{
	var ParaResult=0;
	var ParaMessage=" ";
	
	if(ParaValue==null || ParaValue=="")
	{	
		return {"result": ParaResult, "message": ParaMessage};
	}
	
	if(ParaValue.length>10)
	{
		ParaResult=1;
		ParaMessage=system.functions.scmsg (1, "requestSetting");
	}
	
	if(!lib.c.$.isValidQueryString(ParaValue)) {
	    ParaResult = 1; 
	    ParaMessage=system.functions.scmsg (101, "im", [lib.c.$.NOT_SUPPORTED_QUERY_CHARATERS]);
	}
	

		
	return {"result": ParaResult, "message": ParaMessage};
}

