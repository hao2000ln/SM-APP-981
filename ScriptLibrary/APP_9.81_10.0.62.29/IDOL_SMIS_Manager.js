var Class = lib.smis_Prototype.getClass();

var IDOLManager = Class.create(lib.smis_Manager.getClass(), {

	isScheduleBased: function() {
		return true;
	},
  
	preProcess: function(task) {
		lib.IDOLConfigure.require().clearIDOLServerConfigCache();
		var idolserverinfo = lib.IDOLConfigure.require().getConfig();
		//initiate global vars $lo.idol.enabled, $lo.idol.img.enabled
		
		vars['$lo.idol.enabled'] = idolserverinfo['enable'];
		vars['$lo.idol.img.enabled'] = idolserverinfo['image.enable'];

		return true;
	},
  
	process: function(task) {
		return this.SMAdapter.sendRecords(task);
	}
  
});


function getClass() {return IDOLManager;}