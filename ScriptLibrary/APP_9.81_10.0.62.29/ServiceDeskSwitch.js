function getSDSwitch()
{
	if (vars.$G_sd_switch != null ) return vars.$G_sd_switch; 
	var envvalue= lib.settings.getSettingValue("Service Desk", "sd.switch");
	if(envvalue == null){
		vars.$G_sd_switch = false;//default as false,QCCR1E118040
	}else if(system.functions.val(envvalue,4)){
  		vars.$G_sd_switch = false;
	}else {
 		vars.$G_sd_switch = true;  
 	} 
	return vars.$G_sd_switch;

}


function TurnOnCategory(invokemethod)
{
	TurnOn(invokemethod);
}


function UpdateCategory( filename, category , actionJS)
{
	var file = new SCFile(filename +"Category");
	var sql = "name=\""+category+"\"";
	
	if(file.doSelect(sql) === RC_SUCCESS){
		do{
		
			print("Category : " + file.name +" is updated");
			eval(actionJS);
			file.doSave();
			
		}while(file.getNext() === RC_SUCCESS);
	}
	
	var file = new SCFile(filename + "Subcategory");
	var sql = "category=\""+category+"\"";
	
	if(file.doSelect(sql) === RC_SUCCESS){
		do{
			print("Sub Category : " + file.subcategory_name +" is updated");
			eval(actionJS);
			file.doSave();			
			
		}while(file.getNext() === RC_SUCCESS);
	}
	
	var file = new SCFile(filename + "Area");
	var sql = "category=\""+category+"\"";
	
	if(file.doSelect(sql) === RC_SUCCESS){
		do{
			print("Area : " + file.area_name +" is updated");
			eval(actionJS);
			file.doSave();			
			
		}while(file.getNext() === RC_SUCCESS);
	}		

}

function setSDEnv()
{
	var env = new SCFile("environment");
	
	var sql="name=\"service desk\"";
	if(env.doSelect(sql) == RC_SUCCESS){
        if (env["block.closures"] == "independent" || env["block.closures"] == "problem") {
        env["block.closures"] = "full";
		env.doSave();
	}
    }
}

function setSettingValue( settingName, settingConfigID, settingConfigValue)
{
	var DENULL = system.functions.denull;
	var LNG = system.functions.lng;
	
	var setting = new SCFile("settings");
	var sql="name=\""+settingName+"\"";
	
	if(setting.doSelect(sql)===RC_SUCCESS){		
		var ret = new SCDatum();
		ret.setType(8);		
		
		for(var i=0; i<LNG(DENULL(setting.settingId)); i++){
			var temp = setting.settingId[i];
			
			if(temp === settingConfigID){
				ret.push(settingConfigValue);
			}else{
				ret.push(setting.settingValue[i]);
			}
		}
		
		setting.settingValue=ret;
		setting.doSave();
	}
}

function checkAndUpdateSwitch()
{
	var envvalue= lib.settings.getSettingValue("Service Desk", "sd.switch");
	
	if(envvalue != null){
		if(system.functions.val(envvalue,4)){
  			vars.$G_sd_switch = false;
  		}
	}
}

function TurnOn(invokemethod)
{
	if(system.functions.lioption("Request Management")){
		UpdateCategory("sd","service request", "file.active=true;");
		
		UpdateCategory("sd","request for administration", "file.active=false;");
		UpdateCategory("sd","request for information", "file.active=false;");
	
		UpdateCategory("im","request for administration", "file.active=false;");
		UpdateCategory("im","request for information", "file.active=false;");		
	}
	
	UpdateCategory("sd","complaint", "file.active=true;file.sharedflag=0;file.escalate=false;");
	
	UpdateCategory("im","complaint", "file.active=false;");
	
	UpdateCategory("pbm","problem", "file.sharedflag=5;");
	
	setSDEnv();
	
	if(invokemethod == undefined ){
		setSettingValue("Service Desk", "sd.switch", "false");
	}
}

