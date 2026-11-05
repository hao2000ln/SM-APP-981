/******************************************************
* Module Name: SMIS Dummy Adapter
* Function: Adapter Interface
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: Jan, 2010
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var smis_DummyAdapterClass = Class.create({
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

function getClass() {return smis_DummyAdapterClass;}

