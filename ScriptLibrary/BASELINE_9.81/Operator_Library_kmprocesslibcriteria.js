// This script builds and returns a string of library-specific query values 
//   using the KMQuery object. The values in KMQuery were entered by the user  
//   under the tabs in the Advanced Search screen.
// Tailor this script if this knowledgebase has a tab in the Advanced Search screen.

var fieldmapping=[];

function ProcessLibCriteria(KMQuery,kbname) {
    var idolSearch = lib.KMQuery_IDOL.require();
	var strQuery = idolSearch.processIDOL(KMQuery, fieldmapping, this, kbname);

	return strQuery;
}

function processSpecial(KMQuery){
    return "";
}

function getFieldMapping() {
	return fieldmapping;
}