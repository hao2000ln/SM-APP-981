/******************************************************
* Module Name: Service impact report Manager
* Function: Manager interface
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: Jan, 2010
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var BIRManagerClass = Class.create(lib.smis_Manager.getClass(), {

  getUrl: function(vFile) {
  	var baseUrl = this.configItem.getConfigParameterValue("baseurl");
  	var url = baseUrl + "?ciId=";
  	
	var device = new SCFile("device");
	var RC = device.doSelect("logical.name=\"" + vFile["logical.name"] + "\"");
	
	if ( RC == RC_SUCCESS && device["ucmdb.id"] != null)	{
	  url += device["ucmdb.id"];
	}
	//append customer
	url += "&customer=" + this.getCustomerId(vFile["company"]);

  	return url;
  	
  },
  
  getCustomerId: function(company) {
  	if (vars.$G_multi) {//get ucmdb.customer.id from company, where: company
		var companyFile = new SCFile("company");
		var RC = companyFile.doSelect("company=\"" + company + "\"");
		
		if ( RC == RC_SUCCESS)	{
		  return companyFile["ucmdb.customer.id"];
		}
	}
	
	return "1";
  },
  
  isScheduleBased: function() {
  	return false;
  }
});


function getClass() {return BIRManagerClass;}
