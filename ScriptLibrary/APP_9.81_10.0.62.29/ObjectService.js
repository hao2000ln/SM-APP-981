var $ = lib.c.$;

var ObjectService = $({
	getObject : function(name) {
		return $("Object").select('file.name="' + name + '"').uniqueResult();
	}

});

function getClass() {
	return ObjectService;
}