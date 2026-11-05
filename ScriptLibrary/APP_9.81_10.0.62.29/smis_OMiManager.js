/******************************************************
* Module Name: Dummy Manager
* Function: Manager interface
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: Feb, 2010
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var OMiManagerClass = Class.create(lib.smis_Manager.getClass(), {

  initParams: function() {
  this.configItem.setConfigParameterValue("sm.mgr.id",lib.UUID.generateUUID());
 },
  isScheduleBased: function() {
  	return true;
  },
    
  getAction: function() {
  	return "update";
  },
  
  preProcess: function(task) {
  	var srcRecord = task.inRecord;
  	this.obj = { id:srcRecord.id };
  	return true;
  },
  
  getDestObj: function() {
  	
  	return this.obj;
  },
  
  process: function( task ) {
  	return this.EPAdapter.sendRecord( task.destObject, this.getAction() );
  }
  
});


function getClass() {return OMiManagerClass;}
