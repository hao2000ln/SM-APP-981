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
	["requestlib.number","id",false],
    ["requestlib.status","status",true],
    ["requestlib.requestorname","requestorname",false],
    ["requestlib.requestedfor", "requestedfor", false],
    ["requestlib.assignment", "assignment", false],
    ["requestlib.assignee", "assignee", false],
    ["requestlib.category", "category", true],
    ["requestlib.priority", "priority", true]
];

/**
	QCCR1E83877 OVSM KM: Advanced Search on Title searches incorrectly depending on term and case
	@Author: Zhang, Ming-Di
**/
function ProcessLibCriteria(KMQuery,kbname) {
    var idolSearch = lib.KMQuery_IDOL.require();
    var strQuery = idolSearch.processIDOL(KMQuery, fieldmapping, this,kbname);

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
    var epochSeconds;
    var idolQuery = lib.KMQuery_IDOL.require();

    if(KMQuery.requestlib_openedbefore != null){
        epochSeconds = idolQuery.getEpochSeconds( KMQuery.requestlib_openedbefore);
        buff.push('RANGE{.,'+epochSeconds+'}:'+idolQuery.dateField("requesteddate"));
    }
    if(KMQuery.requestlib_openedafter != null) {
        epochSeconds = idolQuery.getEpochSeconds( KMQuery.requestlib_openedafter);
        buff.push('RANGE{'+epochSeconds+',.}:'+idolQuery.dateField("requesteddate"));
    }

    strQuery = buff.join('+AND+');
    buff = null;

    return strQuery;
}


function getFieldMapping() {
	return fieldmapping;
}