/**
 * get the SCFile record count
 */
function countFile(file)
{
	var iTotal= new SCDatum();
	var returnCode = 1;
	
	funcs.rtecall("count", returnCode, file, "", iTotal); 
	
	
	return iTotal.getText();
}


/**
 * Call rad scmsg function
 * Return a string containing the complete message text indicated by the arguments.
 */
function scmsg(number, msgclass, msgargs)
{
	var args = msgargs;
	
	if (msgargs == null)
	{
		args = new SCFile();
		args.setType(lib.DataTypeConst.typeArray());
	}
	else if (typeof msgargs == "string")
	{
		args = new SCFile();
		args.setType(lib.DataTypeConst.typeArray());
		args.push(msgargs);		
	}

	return funcs.scmsg(number, msgclass, args);

}


/**
 *
 */
function log(msg) {
 	funcs.rtecall("log", vars.$L_void, "" + msg);
}


/**
 * Common function to get rte parameter defined in sm.ini
 *
 * @param	 {String}	parameter
 * @returns {String}	parameter value, empty string if not found
 */
function getRTEParameter(param) {
	var value = getRTEParm(param);
	
	// value starts as "ERROR:" if not found
	if (value == null || value.indexOf("ERROR:") == 0) {
		return "";
	}
	
	return value;
}
