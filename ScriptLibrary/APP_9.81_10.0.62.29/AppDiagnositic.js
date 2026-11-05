
function applicationCounter (moduleName, appName){

	appCounter(moduleName, appName);
} 

function appEventCounter (appName) {
	applicationCounter("Event Services", appName);
}

function appEventInCounter () {
	appEventCounter("eventin");
}

function appMailInCounter () {
	appEventCounter("emailin");
}