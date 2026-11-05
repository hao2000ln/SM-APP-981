/******************************************************
* Module Name: SMOO
* Function: Automation Alert calc time
* Author: Yang, Wen-Ying
* Version: 1.00
* Creation Date: Apr, 2010
*******************************************************/
function getCalcFieldValue(){
	var mode = vars.$L_file.execute_mode;
	if( mode == "byfield" ){
		var field = vars.$L_file.calc_field;
		if(field!=null&&field!=""){
			var fieldValue = vars["$L.file"][field];
		}
		//print(fieldValue);
		return fieldValue;
	}
}

/**
function scToJSName(strFieldName)
{
  	var reg = /(\.|\s)/g;

  	if ( system.functions._null(strFieldName) )
  		strFieldName = " ";
  	return strFieldName.replace(reg, "_");
}
*/

//1:earlier than planned start
//2:later than planned end
//3:later than now
//-1: is null
//0: ok
//obsoleted
function checkStart(file){
	var execute_mode = file.execute_mode;
	var code = -1;
	var plannedstart = file.planned_start;
	var psdat = new SCDatum(plannedstart);
	var psj = psdat.JSDate().getTime();
	var plannedend = file.planned_end;
	var pedat = new SCDatum(plannedend);
	var pej = pedat.JSDate().getTime();
	if( execute_mode == "byfield" ){
		var calc_time = file.calc_time;
		if(calc_time == null){
			return code;
		}
		var dat = new SCDatum(calc_time);
		var j = dat.JSDate();
		var now = new Date();
		if(j.getTime() - now.getTime()>0){
			code = 0;
		}else{
			code = 3;
			return code;
		}
		if(j.getTime() - psj >= 0){
			code = 0;
		} else{
			code = 1;
			return code; 
		}
		
		if(j.getTime() - pej <= 0){
			code = 0;
		} else{
			code = 2;
			return code; 
		}
		
		return 	code;
	
	} else if (execute_mode == "byfixedtime"){
		var scheduled_time = file.scheduled_time;
		if(scheduled_time == null){
			return code;
		}
		var dat = new SCDatum(scheduled_time);
		print(dat);
		var j = dat.JSDate();
		var now = new Date();
		print(j.getTime() - now.getTime());
		if(j.getTime() - now.getTime()>0){
			code = 0;
		}else{
			code = 3;
			return code;
		}
		if(j.getTime() - psj >= 0){
			code = 0;
		} else{
			code = 1;
			return code; 
		}
		
		if(j.getTime() - pej <= 0){
			code = 0;
		} else{
			code = 2;
			return code; 
		}
		
		return 	code;
	}
}