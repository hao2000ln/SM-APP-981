/******************************************************
* Module Name: SMBSM Outage Management Controller
* Function: provide default workflow control
* Author: Ling, Er-Li
* Version: 1.00
* Creation Date: 2012/06/11
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var SMBSMOutageManageControllerClass = Class.create({

  /** This method is used to initialize SMBSMOutageManageController
  * @return void
  */
  initialize: function(configItem) {

	this.configItem = configItem;  
	this.log = this.configItem.getLogger();	
  },
  
  /** This method is used to call scheduled method when starting up the integration instance
  * @return void
  */
  startup: function() {
    lib.smis_ConfigurationManager.setInstanceStatus(this.configItem.intId, lib.smis_Constants.INSTANCE_STATUS_RUNNING());
  	this.scheduleSync();
  	lib.smis_ConfigurationManager.setInstanceStatus(this.configItem.intId, lib.smis_Constants.INSTANCE_STATUS_SLEEPING());
  },
    
  /** This method is used to call main bussiness logic for outage management
  * @return void
  */
  scheduleSync: function(){ 
  	this.log.info("SMBSMOutageManageController", "SMBSMOutageManage scheduler starts."); 
  	try {
  		//this.log.info("configItem",this.configItem);
  		lib.CLIP_DowntimeManagement.maintainScheduledDowntime();
  	}catch(e){
		this.log.error("SMBSMOutageManageController", e.toString() );
	}
	this.log.info("SMBSMOutageManageController", "SMBSMOutageManage scheduler ends." ); 
  }
  
});

function getClass() {return SMBSMOutageManageControllerClass;}