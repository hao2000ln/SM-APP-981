var $ = lib.c.$;
var _denull = system.functions.denull;
var _null = system.functions._null;
var msg = system.functions.scmsg;
var _ = lib.Underscore.require();

var KnownErrorService = $(lib.ProblemService.getClass(), {

	/*
		remove problem related fields from the list. 
		@param {SC_Array} fieldNames - all rootcause field names 
	 */
	suppressProblemFields: function(fieldNames){
		var keFieldNames = $.createSCArray();
		var lng = system.functions.lng(fieldNames);
		for (var i = lng - 1; i >= 0; i--) {
			
			if(fieldNames[i].indexOf("problem") === -1 && fieldNames[i].indexOf("Problem") === -1) keFieldNames.push(fieldNames[i]);
		}
		return keFieldNames;
	}
		


});

function getClass() {
	return KnownErrorService;
}

//call from RAD jscall()
function suppressProblemFields(fieldNames){
	return $("#KnownErrorService").suppressProblemFields(fieldNames)
}