/******************************************************
* Module Name: SMIS Task
* Function: Basic task class
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: spr, 2009
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var TaskClass = Class.create({
  intId: null,
  direction: null,
  inRecord: null,
  outRecord: null,
  destObject: null,
  retry: null,
  expired: null,
  id: null,
  enqueueTime: null,
  
  initialize: function(intId) {
    this.intId = intId;
  }
});

function getClass() {return TaskClass;}