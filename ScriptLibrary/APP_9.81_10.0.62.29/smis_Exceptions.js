/******************************************************
* Module Name: SMIS Exceptions
* Function: SMIS Exceptions
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: Sep, 2009
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var NetworkExceptionClass = Class.create({
  initialize: function(configItem) {
    this.message = "Network Exception";
  }
  
});

var JSONFormatExceptionClass = Class.create({
  initialize: function(configItem) {
    this.message = "JSONFormat Exception";
  }
  
});

function NetworkException() {return NetworkExceptionClass;}

function JSONFormatException() {return JSONFormatClass;}
