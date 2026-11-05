/**  @View OMi Event Detail - A collection of functions that are used to launch to OMi event detail page.
*	@author	Liu Fei
*/


/**  This function is used to get event id and event url to launch to event detail page.
*/
function launch(){
    var OMiExternal = system.vars.$L_file.external_process_reference;
    
    var OMiEventIdIndex = OMiExternal[0].lastIndexOf(":"); 
    var OMiEventId = OMiExternal[0].substr(OMiEventIdIndex+1,OMiExternal[0].length);
       
    
    
    //var configItem = lib.smis_ConfigurationManager.getEnabledConfigItem("SMOMi");
    var configItem = lib.SMOMi._getEnabledOMiConfig(OMiExternal[0]);
    var baseUrl = configItem.getConfigParameterValue("omi.eventdetail.baseurl") ;
	
	
	var url = baseUrl+OMiEventId;	
	openLink(url);	
}

/**  This function is used to open page according to url.  
*    @param url	- the url of the page
*/
function openLink(url){
	var rteReturnValue = new SCDatum();
	var argNames = new SCDatum();
	var argVals = new SCDatum();
	var usrNames = new SCDatum();
	
		argVals.setType(8);     //type array
		argNames.setType(8);     //type array 
		argNames.push("name");     //$MSG.US - recipient list
		argVals.push(url); 
		system.functions.rtecall("callrad", 
		                            rteReturnValue, 
		                            "us.launch.external",     //RAD app name
		                            argNames, 
		                            argVals,
		                            false);     //false to run in same thread
}