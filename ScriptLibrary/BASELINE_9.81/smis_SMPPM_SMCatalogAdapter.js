/*
 * Version: 1.01
 * Date:    2010.06
 */

var Class = lib.smis_Prototype.getClass();

var SMCatalogAdapterClass = Class.create({

  records : null,  	

  initialize: function(configItem) {
    this.configItem = configItem;
    this.records = new Array();
  },
  
  getRecords: function() {	
  	var logger = this.configItem.getLogger();
  	var smppmtasks = system.library.smis_SMPPM_util.getRecordsFromFile( "smppmtasks", 'status="New"' );
  	if(smppmtasks != null) {
  		var r = smppmtasks.getFirst();
  		while(r != RC_NO_MORE) {
	  		var svcCartItem = system.library.smis_SMPPM_util.getRecordsFromFile( "svcCartItem", "cartItemId=" + smppmtasks.id );
	  		if(svcCartItem != null) {
	  			var xml = new XML();
	  			if( xml.setContent( svcCartItem.options ) );
	  			{
	  				var valueObj = new Object();
	  				valueObj["CallID"] = svcCartItem.sdID;
	  				var node = xml.getFirstChildElement();
	  				while(node != null) {
	  					valueObj[node.getAttributeValue("id")] = node.getValue();
	  					node = node.getNextSiblingElement();
	  				}
	  				
	  				for(var x in valueObj) {
	  					logger.debug("smis_SMPPM_SMCatalogAdapter", "valueObj[" + x + "]= " + valueObj[x]);
	  				}
	  				this.records.push(valueObj);
	  			}
	  		}
	  		
	  		// delete the current task
	  		logger.debug( "smis_SMPPM_SMCatalogAdapter", "Delete task from smppmtasks: id=" + smppmtasks.id );
	  		if( smppmtasks.doDelete() != RC_SUCCESS ) {
	  			logger.error( RCtoString( rc ) );
	  		}
	  		
	  		r = smppmtasks.getNext();
  		}
  		
  		
  	}
	return this.records;
  },
  
  sendRecord: function(record, action) {
	//no need to implement this function
  },
  
  getFields: function() {
  	return [
  		{name: "CallID", type: "string", desc: ""},
  		{name: "PlannedStartMonth", type: "string", desc: ""},
  		{name: "PlannedStartYear", type: "string", desc: ""},
  		{name: "PlannedEndMonth", type: "string", desc: ""},
  		{name: "PlannedEndYear", type: "string", desc: ""},
  		{name: "ProjectName", type: "string", desc: ""},
  		{name: "ProjectManager", type: "string", desc: ""},
  		{name: "Region", type: "string", desc: ""},
  		{name: "ProjectType", type: "string", desc: ""},
  		{name: "ProjectDescription", type: "string", desc: ""},
  		{name: "BusinessUnit", type: "string", desc: ""}
  	];
  }

});


function getClass() {return SMCatalogAdapterClass;}