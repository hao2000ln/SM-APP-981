/******************************************************
 * Module Name: SMIS Default Controll
 * Function: A subclass of Controller, providing additional functions
 * Author: Xing, Jiang-Bing
 * Version: 1.00
 * Creation Date: spr, 2009
 *******************************************************/

var Class = lib.smis_Prototype.getClass();

var DefaultControllerClass = Class.create(lib.smis_Controller.getClass(), {


    debugInfo: function(msg, records) {

        if (!this.log.isDebugEnabled()) {
            return;
        }

        this.log.debug("smis_DefaultController", "========================" + msg);

        var i;
        var prop;
        for (i in records) {
            var record = records[i];
            var toStr = "";
            for (prop in record) {
                toStr += prop;
                toStr += "=";
                toStr += record[prop];
                toStr += ", ";
            }

            this.log.debug("smis_DefaultController", toStr);
        }
    },

    beforeExcute: function($super) {

        if (this.log.isDebugEnabled()) {
            this.log.debug("smis_DefaultController", "DefaultController: beforeExcute");
        }
        lib.smis_ConfigurationManager.setInstanceStatus(this.configItem.intId, lib.smis_Constants.INSTANCE_STATUS_RUNNING());
    },


    afterExcute: function($super) {

        if (this.log.isDebugEnabled()) {
            this.log.debug("smis_DefaultController", "DefaultController: afterExcute");
        }

        //Update the config parameter
        lib.smis_ConfigurationManager.updateParam(this.configItem);

        //if this round is over set the status to Sleep();
        lib.smis_ConfigurationManager.setInstanceStatus(this.configItem.intId, lib.smis_Constants.INSTANCE_STATUS_SLEEPING());
    },

    exceptionCatch: function(e) {
        this.log.error("smis_DefaultController", "Error: " + e);
        this.log.error("smis_DefaultController", e.stack);
        this.log.warning("smis_DefaultController", "Disable the current instance because of the fault above");
        lib.smis_ConfigurationManager.disableInstance(this.configItem.intId, true);
    }

});


function getClass() {
    return DefaultControllerClass;
}