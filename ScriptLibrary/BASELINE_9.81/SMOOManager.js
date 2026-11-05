/******************************************************
* Module Name: SMIS Manager
* Function: Manager interface
* Author: Yang, Wen-Ying
* Version: 1.00
* Creation Date: Nov, 2009
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var SMOOManagerClass = Class.create({
  initialize: function(configItem) {
  	this.configItem = configItem;
    this.intId = this.configItem.intId;
    var adapter1Name = this.configItem.SMAdapter;
    eval("this.SMAdapter = new (lib." + adapter1Name + ".getClass())(this.configItem);");
    var adapter2Name = this.configItem.EPAdapter;
    eval("this.EPAdapter = new (lib." + adapter2Name + ".getClass())(this.configItem);");
  },
  
  //append records to tasklist
  appendTasks: function() {
  },
  
  preProcess: function(task) {
  	return true;
  },
  
  getDestObj: function() {
  	
  	return null;
  },
  
  getAction: function() {
  },
  
  process: function(task) {
  	print("Controller: process");
  	return true;
  },
  
  postProcess: function(task) {
  	print("Controller: postProcess");
  },
  
  getRealTimeTask: function(bid) {
  	var task = null;
  	return task;
  },
  
  isScheduleBased: function() {
  	return true;
  },
  
  initParams: function() {
  	//call this.configItem.setConfigParameterValue to set param's value
  },
  
  finalize: function() {
  }
});


function getClass() {return SMOOManagerClass;}
