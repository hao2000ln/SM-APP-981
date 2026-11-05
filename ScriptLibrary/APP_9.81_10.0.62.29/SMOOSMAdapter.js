/******************************************************
* Module Name: SMIS Adapter
* Function: Adapter Interface
* Author: Yang, Wen-Ying
* Version: 1.00
* Creation Date: Nov, 2009
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var SMOOSMAdapterClass = Class.create({
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

function getClass() {return SMOOSMAdapterClass;}


