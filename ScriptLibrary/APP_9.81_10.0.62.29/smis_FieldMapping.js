/******************************************************
* Module Name: SMIS Field mapping
* Function: Field mapping class
* Author: Dianel Woo
* Version: 1.00
* Creation Date: spr, 2009
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var FieldMappingClass = Class.create({
	mappingFile: null,
	intId:null,
	fieldMapping:[],
	valueMapping:[],
	groupMap: {},
	
	initialize: function(scfile) {
	
	    // mapping file reference to avoid gc
	    this.mappingFile = scfile;
	
    	this.intId = scfile.intId;
    	this.preScript = scfile.preScript;
    	this.mappingScript = scfile.mappingScript;
    	
    	this.fieldMapping = scfile.fieldMapping;
    	this.valueMapping = scfile.valueMapping;
		
		this.groupMap = {};
		var i;
    	for (i in this.valueMapping) {

			var group = this.valueMapping[i].valueMappingGroupID;
    		var smValue = this.valueMapping[i].SMValue;
    		var epValue = this.valueMapping[i].EPValue;
			var condition = this.valueMapping[i].condition;
			
			if (this.groupMap[group] === void 0) {
				this.groupMap[group] = [];
			}
			this.groupMap[group].push({"smValue": smValue, "epValue": epValue, "condition": condition});
    	}
  	},
  	
  	getValueMapingTable: function(group) {
  		return this.groupMap[group];
  	}
});


function getClass() {return FieldMappingClass;}