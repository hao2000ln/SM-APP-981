var displayNameCache = (function () {
	var libs = {};
	var count = 0;
	var max = 10000;
	
	function get(id) {
		if(!libs[id]) {
		    return null;
		}
		libs[id]["t"] = Date.now();
		return libs[id]["n"];
	}
	
	function set(id, name) {
		if (!id || !name) {
		    return;
		}
		if (count + 1 > max - 200) {
			clean();
		}
		libs[id] = {
			"n" : name,
			"t" : Date.now()
		};
		count++;
	}
	
	function clean() {
		var ti = Date.now() - 3600000;
		var i;
		for (i in libs) {
			if(!libs[i] || !libs[i]["t"])
			{	
				libs[i] = null;
				delete libs[i];
				count--;
				continue;
			}
			if (libs[i]["t"] < ti) {
				libs[i] = null;
				delete libs[i];
				count--;
			}
		}
	}
	
	function cleanAll(){
		libs = null;
		libs = {};
		count=0;
	}
	
	return {
		'get' : get,
		'set' : set,
		'cleanAll':cleanAll
	};
})();

var referenceTableCache = (function () {
	var libs = {};
	var count = 0;
	var max = 100;
	
	function get(filename) {
		if(!libs[filename]) {
		    return null;
		}
		libs[filename]["t"] = Date.now();
		return libs[filename]["rt"];
	}
	
	function set(filename, reftable) {
		if (!filename || !reftable) {
		    return;
		}
		libs[filename] = {
			"rt" : reftable,
			 "t" : Date.now()
			};
	}
	
	function clean() {
		var ti = Date.now() - 60000;
		var i;
		for (i in libs) {
			if (libs[i]["t"] < ti) {
				libs[i] = null;
				delete libs[i];
				count--;
			}
		}
	}
	
	function cleanAll(){
		libs = null;
		libs = {};
		count=0;
	}
	
	return {
		'get' : get,
		'set' : set,
		'cleanAll':cleanAll
	};
})();


var referenceTableDisplayFieldCache = (function () {
	var libs = {};
	var count = 0;
	var max = 100;
	
	function get(reftable) {
		if(!libs[reftable]) {
		    return null;
		}
		libs[reftable]["t"] = Date.now();
		return libs[reftable]["rt"];
	}
	
	function set(reftable, reftableDisField) {
		if (!reftable || !reftableDisField) {
		    return;
		}
		libs[reftable] = {
			"rt" : reftableDisField,
			 "t" : Date.now()
			};
	}
	
	function clean() {
		var ti = Date.now() - 60000;
		var i;
		for (i in libs) {
			if (libs[i]["t"] < ti) {
				libs[i] = null;
				delete libs[i];
				count--;
			}
		}
	}
	
	function cleanAll(){
		libs = null;
		libs = {};
		count=0;
	}
	
	return {
		'get' : get,
		'set' : set,
		'cleanAll':cleanAll
	};
})();

function getDisplayNameCache(){
	return displayNameCache;
}

function getReferenceTableCache(){
	return referenceTableCache;
}

function getRefTableDisplayFieldCache(){
	return referenceTableDisplayFieldCache;
}

