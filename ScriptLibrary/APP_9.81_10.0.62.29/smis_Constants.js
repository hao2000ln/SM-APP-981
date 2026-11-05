/******************************************************
* Module Name: SMIS Constants
* Function: contain global constants
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: spr, 2009
*******************************************************/

function PLATFORM_NAME() { return "smis";}

// smis instance status
function INSTANCE_STATUS_RUNNING() { return "Running"; }
function INSTANCE_STATUS_SLEEPING() { return"Sleeping"; }
function INSTANCE_STATUS_DISABLE() { return "Disabled"; }
function INSTANCE_STATUS_ERROR() { return "Error"; }

// schedule status, see RAD scheduler.process
function SCHEDULE_STATUS_RUNNING() { return "application running"; }
function SCHEDULE_STATUS_RESCHEDULED() { return "rescheduled"; }
function SCHEDULE_STATUS_FAILED() { return "application failed due to error - check msglog for possible messages"; }

function SCHEDULE_CLASS_NAME() {return "intClass";}
function SCHEDULER_RUN() { return "lib.smis_SecurityUtilities.setupGlobals(); \nvar config = lib.smis_ConfigurationManager.getInstanceConfig(\"$intId$\"); \nif (config != null) { \n\tvar bootstrap = new (lib.smis_Bootstrap.getClass())(config); \n\tbootstrap.run(); \n}";}

function MAPPING_DIRECTION_LEFTRIGHT() { return "LR";}
function MAPPING_DIRECTION_RIGHTLEFT() { return "RL";}
function MAPPING_DIRECTION_BOTH() { return "BOTH";}

function GLOBAL_CATEGORY() { return "Global";}
function PARAM_ARRAY_DELIMITER() { return "~"; }

function TASK_STATUS_NEW() { return 8;}
function TASK_STATUS_INPROGRESS() { return 7;}
function TASK_STATUS_ERROR() { return 6;}
function TASK_STATUS_LOCKEDERROR() { return 5;}
function TASK_STATUS_SUCCESS() { return 4;}
function TASK_STATUS_IGNORED() { return 3;}
function TASK_STATUS_FAILED() {return 2;}	  
function TASK_STATUS_RUNNING() { return 1; }
function TASK_STATUS_WAITING() { return 0; }

function getTaskStatusVal(code){
	var status = ["Waiting", "Running", "Retry Error", "Ignored", "Success", "Retry Locked", "Error", "In Progress", "New"];
	return status[code];
}