/******************************************************
* Module Name: SMIS Bootstrap
* Function: bootstrap point
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: spr, 2009
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var BootstrapClass = Class.create({
  initialize: function(config) {
    //get configure item
  	this.configItem = config;
  	
  	  	//run default integration manager
  	var ctrlName = this.configItem.ctrlName;
  	if (ctrlName == null) {
  		ctrlName = "smis_DefaultController";
  	}
	
  	this.controller = new (lib[ctrlName].getClass())(this.configItem);
  	
  },
  
  runnow: function(taskId) {
  	return this.controller.runnow(taskId);
  },
	
  /* for real-time mode, return the result */
  runrealtime: function(bid) {
  	return this.controller.runrealtime(bid);
  	
  },
  
  run: function() {
  	this.controller.startup();
  	
  }
});

function getClass() {return BootstrapClass;}


