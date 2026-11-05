/*
 * Version: 1.01
 * Date:    2010.06
 */

var Class = lib.smis_Prototype.getClass();

var PPMProposalAdapterClass = Class.create({
  records : null,  	

  initialize: function(configItem) {
    this.configItem = configItem;
    //for(var x in configItem) {
    //	print("configItem[" + x + "]= " + configItem[x]);
    //}
  },
  
  getRecords: function() {	
	return this.records;
  },
  
  sendRecord: function(record, action) {
  	var logger = this.configItem.getLogger();
    for(var x in record) {
    	logger.debug( "smis_SMPPM_PPMProposalAdapter", "PPMRecord[" + x + "] = " + record[x] );
    }
    return CreateDemandRequest(record, this.configItem);
  },
  
  getFields: function() {
  	return [
  		{name: "REQ.P.KNTA_PLAN_START_DATE", type: "string", desc: ""},
  		{name: "REQ.P.KNTA_PLAN_FINISH_DATE", type: "string", desc: ""},
  		{name: "REQ.P.KNTA_PROJECT_NAME", type: "string", desc: ""},
  		{name: "REQ.P.KNTA_PROJECT_MANAGER", type: "string", desc: ""},
  		{name: "REQ.P.KNTA_REGION", type: "string", desc: ""},
  		{name: "REQ.P.KNTA_PROJECT_TYPE", type: "string", desc: ""},
  		{name: "REQ.DESCRIPTION", type: "string", desc: ""},
  		{name: "REQ.P.KNTA_BUSINESS_UNIT", type: "string", desc: ""},
  		{name: "REQD.P.CALLID", type: "string", desc: ""}
  	];
  }
  
});


function getClass() {return PPMProposalAdapterClass;}


///////////////////////////////////////////////////////////////////
// Invoke PPM Web Service Interface DemandService stub functions
///////////////////////////////////////////////////////////////////

function getDemandService() {

	var DemandService=new system.library.DemandService.DemandService();
	
	DemandService.user = lib.SMPPMConfiguration.getUsername();
	DemandService.password = lib.SMPPMConfiguration.getPassword();
	DemandService.location = lib.SMPPMConfiguration.getPPMURL() + lib.SMPPMConfiguration.getPPMDemandServiceURI();
	DemandService.connectTimeOut = lib.SMPPMConfiguration.getConnTimeOut();
	DemandService.sendTimeOut = lib.SMPPMConfiguration.getSendTimeOut();
	DemandService.recvTimeOut = lib.SMPPMConfiguration.getRecTimeOut();
	
	return DemandService;
}

function CreateDemandRequest(record, configItem) {

	var logger = configItem.getLogger();

	try {
		//print("Entering CreateDemandRequest");
		
		var DemandService = getDemandService();


		var RequestDemRequest = new system.library.DemandService.createRequest();

 		RequestDemRequest.requestObj.requestType.setValue( 
 			lib.SMPPMConfiguration.getPPMRequestType() );
		
 		var ii = 0;
 		for(var x in record) {
 			RequestDemRequest.requestObj.simpleFields_newInstance();
 			RequestDemRequest.requestObj.simpleFields[ii].token.setValue(x);
 			var str=RequestDemRequest.requestObj.simpleFields[ii].stringValue_newInstance();
 			str.setValue(record[x]); 			
 			ii++;
 		}


		var fileName = "incidents";
		var title = "";
		var query = "incident.id=\"" + record["REQD.P.CALLID"] + "\"";
		var rec_url = system.library.urlCreator.getURLFromQuery(fileName, query, title);
		RequestDemRequest.requestObj.URLReferences_newInstance();
		RequestDemRequest.requestObj.URLReferences[0].refURL.setValue(rec_url);
		RequestDemRequest.requestObj.URLReferences[0].name.setValue( record["REQD.P.CALLID"] );
		RequestDemRequest.requestObj.URLReferences[0].description.setValue("Click to access the detail information in SM");


		logger.debug( "smis_SMPPM_PPMProposalAdapter", "Sending request [" + record["REQD.P.CALLID"] + "] to PPM ..." );
		var DemandResponse = DemandService.invoke( RequestDemRequest );
	
		if ( DemandResponse.isFault() ) {
			logger.info( "smis_SMPPM_PPMProposalAdapter", "Failed to create request in PPM: " + record["REQD.P.CALLID"] );
            logger.info( "smis_SMPPM_PPMProposalAdapter", "Fault code: " + DemandResponse.faultcode.getValue() );
            logger.info( "smis_SMPPM_PPMProposalAdapter", "Fault string: " + DemandResponse.faultstring.getValue() );
            logger.info( "smis_SMPPM_PPMProposalAdapter", "Fault detail: " + DemandResponse.detail.getValue() );              
            return false;
		}else {  
			logger.info(  "smis_SMPPM_PPMProposalAdapter", "Request created successfully in PPM: "
				+ "Response id=" + DemandResponse.getContent().identifier.id.getValue()
			);
   			return true;
		}
		
	}catch( e ) {
		logger.error( "smis_SMPPM_PPMProposalAdapter", "exception: " + e );
	}
	
	return false;
	
}

function retrieveProposalStatus(proposalId, configItem) {
	
	var getRequests = new system.library.DemandService.getRequests();
	getRequests.requestIds_newInstance();
	getRequests.requestIds[0].id.setValue(proposalId);
	
	try {
		var demandService = getDemandService();
		var getRequestsResponse = demandService.invoke(getRequests);
		var returns = getRequestsResponse.getContent();
		print("returns: " + returns.length);
/*		
		for(var i=0; i<returns.length; i++) {
			for(var j=0; j<returns[i].simpleFields.length; j++) {
				print("simpleField: " + returns[i].simpleFields[j].token.getValue() 
					+ " = " + returns[i].simpleFields[j].stringValue[0].getValue());
			}
		}
//*/
		
	}catch(ex) {
		print("exception: " + ex);
	}
	
}