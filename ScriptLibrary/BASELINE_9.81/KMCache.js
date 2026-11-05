var cache = (function () {
	var libs = {};
	var totalOnce = 0;
	var kb = new SCFile('kmknowledgebase');
	var rc = kb.doSelect('true');
	while (rc == RC_SUCCESS) {
		add(kb);
		rc = kb.getNext();
	}
	
	function add(kb) {
		libs[kb.kbname] = {
			"totalDocs" : 0,
			"host" : parseSearchServer(kb),
			"lastUpdateTime" : kb.sysmodtime,
			"sclibtablename" : kb.sclibtablename,
			"scquery" : kb.scquery,
			"kbname" : kb.kbname,
			"docid" : kb.docid,
			"file" : cloneFile(kb)
		};
	}
	
	function cloneFile(kb) {
		var kbc = new SCFile('kmknowledgebase');
		system.functions.fduplicate(kbc, kb);
		return kbc;
	}
	
	function get(kbname, field) {
		return field ? libs[kbname][field] : libs[kbname];
	}
	
	function getByFileName(fileName) {
		var kbs = [];
		var i;
		for (i in libs) {
			if (libs[i]["sclibtablename"] == fileName) {
				kbs.push(libs[i]);
			}
		}
		return kbs;
	}
	
	function getAllFiles(){
		var kbs = [];
		var i;
		for (i in libs) {
			kbs.push(libs[i].file);		
		}
		return kbs;
	}
	
	function parseSearchServer(kb) {
		return kb.searchservername;
	}
	
	function refresh() {
		libs = {};
		totalOnce = 0;
		kb = new SCFile('kmknowledgebase');
		rc = kb.doSelect('true');
		while (rc == RC_SUCCESS) {
			add(kb);
			rc = kb.getNext();
		}
	}
	
	return {
		'get' : get,
		'getByFileName' : getByFileName,
		'refresh' : refresh,
		'getAllFiles' : getAllFiles,
		'set' : function (kbname, field, value) {
			libs[kbname] && (libs[kbname][field] = value);
		},
		'add' : add,
		'size' : function () {
			var count = 0;
			var i;
			for (i in libs) {
				count++;
			}
			return count;
		},
		'clean' : function () {
			libs = {};
		},
		'libs' : libs,
		'counting' : function (kbname) {
			totalOnce += parseInt(get(kbname, 'totalDocs'), 0);
		},
		'getTotalOnce' : function () {
			return totalOnce;
		},
		'cleanTotalOnce' : function () {
			totalOnce = 0;
		}
	};
	
})();

function getCache() {
	return cache;
}

function getKmknowledgebaseByFileName(fileName) {
	return getCache().getByFileName(fileName);
}


function refresh() {
	return getCache().refresh();
}
