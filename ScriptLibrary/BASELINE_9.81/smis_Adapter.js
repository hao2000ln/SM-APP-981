/******************************************************
* Module Name: SMIS Adapter
* Function: Adapter Interface
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: spr, 2009
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var AdapterClass = Class.create({
  initialize: function(configItem) {
    this.configItem = configItem;
  },
  
  getRecords: function() {
  	var records = [];
  	return records;
  },
  
  sendRecord: function(record, action) {
  },
  
  getFields: function() {
  }
  
});

function getClass() {return AdapterClass;}


