/******************************************************
 * Module Name: SMIS Manager
 * Function: Manager interface
 * Author: Tian, Shao-Qin
 * Version: 1.11
 * Creation Date: spr, 2009
 *******************************************************/

var Class = lib.smis_Prototype.getClass();

var ManagerClass = Class.create({

    initialize: function(configItem, options) {
        this.configItem = configItem;
        this.intId = this.configItem.intId;
        this.options = options;
        var adapter1Name = this.configItem.SMAdapter;
        this.SMAdapter = new(lib[adapter1Name].getClass())(this.configItem);
        var adapter2Name = this.configItem.EPAdapter;
        this.EPAdapter = new(lib[adapter2Name].getClass())(this.configItem);

        this.logger = this.configItem.getLogger();
    },

    //append records to tasklist
    appendTasks: function() {},

    preProcess: function(task) {
        return true;
    },

    getDestObj: function() {
        return null;
    },

    getAction: function() {},

    process: function(task) {
        print("Controller: process");
        return true;
    },

    postProcess: function(task) {
        print("Controller: postProcess");
    },

    getRealTimeTask: function(bid) {
        var task = null;
        return task;
    },

    initParams: function() {
        //call this.configItem.setConfigParameterValue to set param's value
    },

    resetTask: function(task) {},

    validateParams: function() {},

    isScheduleBased: function() {
        return true;
    },

    beforeDelInstance: function() {
        return null;
    },

    afterDelInstance: function() {},

    finalize: function() {}
});


function getClass() {
    return ManagerClass;
}