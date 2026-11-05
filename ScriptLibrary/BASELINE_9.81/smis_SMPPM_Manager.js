/*
 * Version: 1.01
 * Date:    2010.06
 */
 

var Class = lib.smis_Prototype.getClass();

var ManagerClass = Class.create(lib.smis_Manager.getClass(), {
  //append records to tasklist
  appendTasks: function() {
  	//print("SMPPMManager: appendRecords");
  	var records = this.SMAdapter.getRecords();  	
  	for (var start = 0; start < records.length; start++) {
  		var task = new (lib.smis_Task.getClass())(this.intId);
  		task.inRecord = records[start];
  		task.id = "SMPPM-"+task.inRecord["CallID"];
  		task.direction = lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT();
  		lib.smis_TaskManager.pushTask(task);
  	}
  	
  },
  
  preProcess: function(task) {
  	var srcRecord = task.inRecord;
  	this.obj = new Object();
  	//this.obj.id = srcRecord.id;
  	return true;
  },
  
  getDestObj: function() {
  	
  	return this.obj;
  },
  
  getAction: function() {
  	return "create";
  },
  
  process: function(task) {
  	//print("TestController: process");  	
  	return this.EPAdapter.sendRecord(task.destObject, this.getAction());
  },
  
  postProcess: function(task) { }

});


function getClass() {return ManagerClass;}
