/**
 * get all active processes
 */
function getActiveProcesses()
{
	var activeProcess = new Array();
	
	var processes = system.functions.processes("ACTIVE"); 
	
	for (var i = 0, iLoopTimes = processes.length(); i < iLoopTimes; i++)
	{
		var process = processes[i].toArray();
		activeProcess.push(process[3]);
	}
	
	return activeProcess;
}


/**
 * Is giving process an active process (background schedules or operator)
 */
function isActiveProcess(process)
{
	if (process == null || process.length == 0)
		return false;
		
	var processes = getActiveProcesses();
	
	return 	lib.ArrayUtil.contains(processes, process);
}
