// This script builds and returns a string of library-specific query values 
//   using the KMQuery object. The values in KMQuery were entered by the user  
//   under the tabs in the Advanced Search screen.
// Tailor this script if this knowledgebase has a tab in the Advanced Search screen.

/**
	QCCR1E83877 OVSM KM: Advanced Search on Title searches incorrectly depending on term and case
	@Author: Zhang, Ming-Di
	reimplemented the search criteria, add fieldmapping to define the relation between kmquery field and search engine field.
	every element in fieldmapping stands for one relation.
	first record in the relation stands for the kmquery field
	secord means the search engine field
	third one defines if the field reuqests fullmatch.
**/
var fieldmapping=[];

/**
	QCCR1E83877 OVSM KM: Advanced Search on Title searches incorrectly depending on term and case
	@Author: Zhang, Ming-Di
**/
function ProcessLibCriteria(KMQuery,kbname) {
    var idolSearch = lib.KMQuery_IDOL.require();
	var strQuery = idolSearch.processIDOL(KMQuery, fieldmapping, this, kbname);

	return strQuery;
}

/**
    QCCR1E83877 OVSM KM: Advanced Search on Title searches incorrectly depending on term and case
    @Author: Zhang, Ming-Di
    defines the special query mapping which are not simply field:value
**/
function processSpecial(KMQuery){
    return "";
}

function getFieldMapping() {
	return fieldmapping;
}