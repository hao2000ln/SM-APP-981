function run(){
    log("Rename Asset Center to Asset Manager started");
	// Trigger off
	system.functions.rtecall("trigger", 0, 0);	
	updateCatalogs();
	updateOrders();
	// Trigger on
	system.functions.rtecall("trigger", 0, 1);
    log("Rename Asset Center to Asset Manager stopped");
}

function log(msg){
    system.functions.rtecall("log", 1, msg);
}

function updateCatalogs(){
    var nameNew = "Open a Standard Request in Asset Manager";
    var nameOld = "Open a Standard Request in AssetCenter";
    
    var fileInterface = new SCFile("svcCatInterface");
    var sql = "interface.name=\""+nameOld+"\"";
    if (fileInterface.doSelect(sql)==RC_SUCCESS){
        fileInterface.interface_name=nameNew;
        fileInterface.process_description ="Create a record in Asset Manager using web service";
        fileInterface.doUpdate();
        log("svcCatInterface <"+nameOld+"> is updated.");
    } else {
        log("svcCatInterface <"+nameOld+"> is not updated.");
        return ;
    }
    
	var file = new SCFile("joinsvcDisplay");
	var ret = file.doSelect("interface.type=\""+nameOld+"\"");
	
	while(ret==RC_SUCCESS){	
		file.interface_type=nameNew;
		file.doUpdate();
		log("joinsvcDisplay <"+file.name+"> is updated.");
		
	    ret = file.getNext();
	}
	
}

function updateOrders(){
    var nameNew = "AssetManager";
    var nameOld = "AssetCenter";
    
    var file_ocmbackend = new SCFile("ocmbackend");
    if(RC_SUCCESS == file_ocmbackend.doSelect("name=\""+nameOld+"\"")){
        file_ocmbackend.name=nameNew;
        file_ocmbackend.description="AssetManager procurement via Archway";
        file_ocmbackend.doUpdate();
        log("ocmbackend <"+nameOld+"> is updated.");
    } else {
        log("ocmbackend <"+nameOld+"> is not found.");
        return;
    }
    
	
	var sql = "backend=\""+nameOld+"\"";
	var file = new SCFile("modelvendor");
	
	var ret = file.doSelect(sql);
	while(ret==RC_SUCCESS){	
		file.backend=nameNew;
		file.doUpdate();
		log("modelvendor <"+file.modelv_no+"> is updated.");
	    ret = file.getNext();
	}
	
	
	var file = new SCFile("ocmo");
	ret = file.doSelect(sql);
	while(ret==RC_SUCCESS){	
		file.backend=nameNew;
		file.doUpdate();
		log("ocmo <"+file.number+"> is updated.");
	    ret = file.getNext();
	}
	
	
	var file = new SCFile("ocml");
	ret = file.doSelect(sql);
	while(ret==RC_SUCCESS){	
		file.backend=nameNew;
		file.doUpdate();
		log("ocml <"+file.phase_num+"> is updated.");
	    ret = file.getNext();
	}
	
}

