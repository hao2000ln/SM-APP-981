var $ = lib.c.$;

var Cm3rcategoryService = $({
	getCategory : function(name) {
		return $("cm3rcategory").select('name="' + name + '"').uniqueResult();
	}

});

function getClass() {
	return Cm3rcategoryService;
}