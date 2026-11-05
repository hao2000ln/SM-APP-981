/******************************************************
* Module Name: Dummy Manager
* Function: Manager interface
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: Feb, 2010
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var DummyManagerClass = Class.create(lib.smis_Manager.getClass(), {

  isScheduleBased: function() {
  	return false;
  }
});


function getClass() {return DummyManagerClass;}
