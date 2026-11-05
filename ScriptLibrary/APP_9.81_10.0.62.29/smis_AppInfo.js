/******************************************************
* Module Name: SMIS App Info
* Function: Utility functions for SMISAppInfo
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: Jul, 2009
*******************************************************/

function getAppInfo(category, name) {
	var appInfo = new SCFile("SMISAppInfo");
	var f = appInfo.doSelect( "category = \"" + category + "\" and name = \""+name + "\"" );
	
	if(f == RC_SUCCESS) {
		return appInfo.value;
	}
	
	return null;	
}
  
