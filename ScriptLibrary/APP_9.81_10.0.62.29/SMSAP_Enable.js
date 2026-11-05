var generalUpdate = lib.SMSAP_General_Update;

/**
 * incidentCategory should keep consistent with SMSSMEX ovictex.properties
 * ovhd.incident.default.category = incident
 * ovictex.properties could be find from %SMSSMEX_HOME%/config
 **/
var incidentCategory = "incident";
 
var isCustomizateSMFormat = false;
var isGenerateIntegrationDemoData = false;
var isGenerateIntegrationDemoUser = false;

/**
 *
 * call enable function
 *
 **/
enableSMSAPIntegration();

function enableSMSAPIntegration() {

	/**
	 * the following function is to update key configuraton for SAP integration
	 * please don't comment it.
	 * will update
	 * 1, add field on table: info, probsummary,
	 * 		info -- add SMSAP field to SMIS structure
	 * 		probsummary -- add sap system fields and custom fields
	 * 2, add jointable joinsapinstance
	 * 3, add erddef for table device and SAPInstance
	 * 4, update IncidentManagement extaccess, expose need field
	 * 5, update process for sap separator
	 * 6, update probsummary link for SAP
	 * 7, update probsummary formatctrl
	 *
	 **/
	print("enable SM SAP integration ..........")
	print("update framework ..........")
	generalUpdate.updateFrameWork(incidentCategory);
	print("update framework done")

	/**
	 *
	 * add SAP sub format to probsummary's format
	 *
	 */	
	if (isCustomizateSMFormat){
		print("update SM Demo fromat  ..........")
		generalUpdate.prepareDemoFormat(incidentCategory);
		print("update SM Demo fromat done!!")
	}	

	/**
	 *
	 * add SAP data
	 * one devtype, named SAPInstance
	 * two device, type is SAPInstance, logical.name are SAPInstance200 and SAPInstance300
	 * two cirelationship, MyDevices -->SAPInstance200,    MyDevices-->SAPInstance300
	 *
	 */
	
	if (isGenerateIntegrationDemoData){
		print("creating demo data  ..........")
		generalUpdate.prepareDemoData();
		print("creating demo data done")		
	}
	
	if (isGenerateIntegrationDemoUser){
		print("Clone SM Demo user  ..........")
		generalUpdate.cloneUser();
		print("Clone SM Demo user done!!")
	}
	
	print("enable SM SAP integration done!")

}
