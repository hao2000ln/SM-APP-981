/******************************************************
* Module Name: SMIS UCMDB Adapter
* Function: Adapter Interface
* Author: Liu, Bin
* Version: 1.00
* Creation Date: July, 2016
*******************************************************/
var Class = lib.smis_Prototype.getClass();

var UcmdbManagerClass = Class.create(lib.smis_Manager.getClass(), {

	isScheduleBased: function() {
		return false;
	},
	validateParams: function() {
	
		var patternMax = new RegExp("^[0-9]*[0-9]*$","ig");
		var value = this.configItem.getConfigParameterValue("impactcisperpage");
		paramCaption = this.configItem.getParameterCaption("impactcisperpage");
		if(!value || !patternMax.test(value)){
			return lib.smis_CommonLib.msg("impactciperpage",[0,100,paramCaption]);
		}
		var value = parseInt(value);
		if (value < 0 || value > 100) {
			
			return lib.smis_CommonLib.msg("impactciperpage",[0,100,paramCaption]);
		}

		return null;
	}
});

function getClass() {return UcmdbManagerClass;}

