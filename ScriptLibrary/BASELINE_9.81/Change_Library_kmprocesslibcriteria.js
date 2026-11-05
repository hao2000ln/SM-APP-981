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
var fieldmapping=[
	["changelib.number","id",false],
    ["changelib.status","status",true],
    ["changelib.ownedby","ownedby",false],
    ["changelib.assignment", "assignment", false],
    ["changelib.ci", "ci", false],
    ["changelib.openedby", "openedby", false],
    ["changelib.category", "category", true],
    ["changelib.subcategory", "subcategory", true],
    ["changelib.initialimpact", "initialimpact", false],
    ["changelib.severity", "severity", false],
    ["changelib.prioritycode","prioritycode", false]
];

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
	var strQuery = "" ;

    var buff = [];
    var idolQuery = lib.KMQuery_IDOL.require();
    var epochSeconds;

    if(KMQuery.changelib_openedbefore != null){
        epochSeconds = idolQuery.getEpochSeconds( KMQuery.changelib_openedbefore);
        buff.push('RANGE{.,'+epochSeconds+'}:'+idolQuery.dateField("opentime"));
    }
    if(KMQuery.changelib_openedafter != null) {
        epochSeconds = idolQuery.getEpochSeconds( KMQuery.changelib_openedafter);
        buff.push('RANGE{'+epochSeconds+',.}:'+idolQuery.dateField("opentime"));
    }

    strQuery = buff.join('+AND+');
    buff = null;

    return strQuery;
}


function getFieldMapping() {
	return fieldmapping;
}