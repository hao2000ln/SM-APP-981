/******************************************************
 * Module Name: SMOO Controller
 * Function: provide default workflow control
 * Author: Yang, Wen-Ying
 * Version: 1.00
 * Creation Date: Dec, 2009
 *******************************************************/

var _ = lib.Underscore.require();

var Class = lib.smis_Prototype.getClass();

var SMAlmControllerClass = Class.create({
    initialize: function (configItem) {
        this.configItem = configItem;
        this.log = this.configItem.getLogger();
    },

    /**
     *  Default invoketion flow
     */
    startup: function () {
        try {
            log.info('startup SMAlm Controller.');
            lib.smis_ConfigurationManager.setInstanceStatus(this.configItem.intId, lib.smis_Constants.INSTANCE_STATUS_RUNNING());
            
            var context = lib.AlmUtil.createContext(this.configItem);
            lib.OctaneTask.run(context);
            
            lib.smis_ConfigurationManager.setInstanceStatus(this.configItem.intId, lib.smis_Constants.INSTANCE_STATUS_SLEEPING());
            log.info('finished SMAlm Controller.');
        } catch (e) {
            log.error(e, e.stack);
        }


    },

    scheduleSync: function () {
    }        
});

function getClass() {
    return SMAlmControllerClass;
}

var log = getLog('octane.alm.controller');
// log.setLevel('info');