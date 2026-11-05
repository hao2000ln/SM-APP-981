/** @fileoverview Global Lists - contains functions used by the SRC Global List module
*   @author Beddy
*/
var select = lib.ScAPI_RAD._select;
var fun = system.functions;
var queryBuilder = lib.ScAPI_RAD._queryBuilder;

var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.ScAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;
var setErrorMsg = lib.ScAPI_Util.setErrorMsg;

// Retrieve the given gl values from global variables
function getGlobalList()
{
    // Default type is "badval"
    setExitType(BAD_VALIDATION_EXIT);
    
    var glName = vars['$L.file']['name'];
    if (glName == null)                                    // Check:name
    {
        setErrorMsg(lib.ScAPI_Util.getMessage(168));
	    return;
    }
    
    var gl = select('globallists', queryBuilder('name="%s"', [glName]), ['list.variable', 'display.variable']);
    if (gl == null)                                        // GlobalList not found
    {
        setErrorMsg(lib.ScAPI_Util.getMessage(169));
        return;
    }
    
    setExitType(NORMAL_EXIT);
    
    // Write back gl values
    if (gl['list.variable'] != null)    vars['$L.file']['value.list']   = fun.str(vars[gl['list.variable']]);
    if (gl['display.variable'] != null) vars['$L.file']['display.list'] = fun.str(vars[gl['display.variable']]);
}